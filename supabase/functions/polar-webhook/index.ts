import {
  createAdminClient,
  extractProductId,
  grantSubscriptionCredits,
  planForPolarProductId,
  resolveUserIdFromPolarCustomer,
  revokeSubscription,
  type SubscriptionPlan,
} from "../_shared/credits.ts";
import {
  assertEventOrganization,
  parsePolarWebhookEvent,
  polarWebhookSecret,
  StandardWebhookVerificationError,
  validatePolarWebhookSecretFormat,
} from "../_shared/polar.ts";

const FUNCTION_VERSION = "6";

const INVALID_SIGNATURE_HINT =
  "POLAR_WEBHOOK_SECRET must be polar_whs_… exactly as shown in Polar dashboard — do not add whsec_";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify({ ...body, version: FUNCTION_VERSION }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function headersToRecord(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

async function isDuplicateEvent(admin: ReturnType<typeof createAdminClient>, eventId: string): Promise<boolean> {
  const { data } = await admin
    .from("polar_webhook_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  return data != null;
}

async function markEventProcessed(
  admin: ReturnType<typeof createAdminClient>,
  eventId: string,
  eventType: string,
): Promise<void> {
  await admin.from("polar_webhook_events").insert({ id: eventId, event_type: eventType });
}

function periodEndIso(data: Record<string, unknown>): string | null {
  const raw = data.current_period_end ?? data.currentPeriodEnd;
  return typeof raw === "string" ? raw : null;
}

function customerFromPayload(data: Record<string, unknown>): Record<string, unknown> | null {
  const customer = data.customer as Record<string, unknown> | undefined;
  return customer ?? null;
}

async function handleSubscriptionActive(
  admin: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>,
  forceRefresh = false,
): Promise<void> {
  const userId = await resolveUserIdFromPolarCustomer(admin, customerFromPayload(data));
  if (!userId) {
    console.warn("Polar webhook: no matching user (external_id or email)", data.id);
    return;
  }

  const productId = extractProductId(data);
  if (!productId) {
    console.warn("Polar webhook: missing product id", data.id);
    return;
  }

  const plan = planForPolarProductId(productId);
  if (!plan) {
    console.warn("Polar webhook: unknown product", productId);
    return;
  }

  const customer = customerFromPayload(data);
  await grantSubscriptionCredits(admin, userId, plan, {
    polarCustomerId: typeof customer?.id === "string" ? customer.id : null,
    polarSubscriptionId: typeof data.id === "string" ? data.id : null,
    subscriptionStatus: typeof data.status === "string" ? data.status : "active",
    periodEnd: periodEndIso(data),
    forceRefresh,
  });
}

async function handleSubscriptionRevoked(
  admin: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>,
  status: "canceled" | "revoked" | "past_due",
): Promise<void> {
  const userId = await resolveUserIdFromPolarCustomer(admin, customerFromPayload(data));
  if (!userId) return;

  const retain = status === "canceled";
  await revokeSubscription(admin, userId, {
    subscriptionStatus: status,
    periodEnd: periodEndIso(data),
    retainAccessUntilPeriodEnd: retain,
  });
}

async function handleOrderRenewal(
  admin: ReturnType<typeof createAdminClient>,
  data: Record<string, unknown>,
): Promise<void> {
  const billingReason = data.billing_reason ?? data.billingReason;
  if (billingReason !== "subscription_cycle") return;

  const subscription = data.subscription as Record<string, unknown> | undefined;
  if (subscription) {
    await handleSubscriptionActive(admin, subscription, true);
    return;
  }

  const userId = await resolveUserIdFromPolarCustomer(admin, customerFromPayload(data));
  if (!userId) return;

  const product = data.product as Record<string, unknown> | undefined;
  const productId = typeof product?.id === "string" ? product.id : null;
  if (!productId) return;

  const plan = planForPolarProductId(productId);
  if (!plan) return;

  await grantSubscriptionCredits(admin, userId, plan, {
    subscriptionStatus: "active",
    forceRefresh: true,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, webhook-id, webhook-signature, webhook-timestamp",
        "X-Function-Version": FUNCTION_VERSION,
      },
    });
  }

  if (req.method === "GET" || req.method === "HEAD") {
    return json(200, {
      ok: true,
      endpoint: "polar-webhook",
      hint: "Polar delivers events via POST with Standard Webhooks signatures",
    });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const webhookSecret = polarWebhookSecret();
  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET not configured");
    return json(503, { error: "Webhook not configured" });
  }

  const formatError = validatePolarWebhookSecretFormat(webhookSecret);
  if (formatError) {
    console.error(formatError);
    return json(503, { error: formatError });
  }

  const rawBody = await req.text();
  const headerRecord = headersToRecord(req.headers);
  let event: { type: string; data: Record<string, unknown> };

  try {
    event = parsePolarWebhookEvent(rawBody, headerRecord, webhookSecret);
  } catch (e) {
    if (e instanceof StandardWebhookVerificationError) {
      return json(403, { error: "Invalid signature", hint: INVALID_SIGNATURE_HINT });
    }
    console.error("Polar webhook parse error", e);
    return json(400, {
      error: "Invalid payload",
      detail: e instanceof Error ? e.message : "Parse failed",
    });
  }

  const eventId = req.headers.get("webhook-id") ?? crypto.randomUUID();
  const admin = createAdminClient();

  if (await isDuplicateEvent(admin, eventId)) {
    return json(202, { ok: true, duplicate: true });
  }

  try {
    const type = event.type;
    const data = event.data ?? {};

    const orgError = assertEventOrganization(data);
    if (orgError) {
      console.error(orgError);
      return json(403, { error: orgError });
    }

    switch (type) {
      case "subscription.active":
        await handleSubscriptionActive(admin, data);
        break;
      case "subscription.updated": {
        const status = typeof data.status === "string" ? data.status : "";
        if (status === "active") {
          await handleSubscriptionActive(admin, data);
        } else if (status === "past_due") {
          await handleSubscriptionRevoked(admin, data, "past_due");
        } else if (status === "canceled") {
          await handleSubscriptionRevoked(admin, data, "canceled");
        }
        break;
      }
      case "subscription.canceled":
        await handleSubscriptionRevoked(admin, data, "canceled");
        break;
      case "subscription.revoked":
        await handleSubscriptionRevoked(admin, data, "revoked");
        break;
      case "subscription.past_due":
        await handleSubscriptionRevoked(admin, data, "past_due");
        break;
      case "order.created":
        await handleOrderRenewal(admin, data);
        break;
      default:
        break;
    }

    await markEventProcessed(admin, eventId, type);
    return json(202, { ok: true });
  } catch (e) {
    console.error("Polar webhook handler error", e);
    return json(500, { error: e instanceof Error ? e.message : "Handler failed" });
  }
});
