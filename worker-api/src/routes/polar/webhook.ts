import { Hono } from "hono";
import type { Env } from "../../env";
import {
  extractProductId,
  grantSubscriptionCredits,
  planForPolarProductId,
  resolveUserIdFromPolarCustomer,
  revokeSubscription,
} from "../../lib/credits";
import {
  assertEventOrganization,
  parsePolarWebhookEvent,
  polarWebhookSecret,
  StandardWebhookVerificationError,
  validatePolarWebhookSecretFormat,
} from "../../lib/polar";

// Port of supabase/functions/polar-webhook — first in the rewrite order
// (see docs/CLOUDFLARE_MIGRATION_PLAN.md) since it has no session
// dependency and Polar keeps sending real events regardless of migration
// state. Logic is unchanged from the Deno version; only the Supabase admin
// client calls became D1 prepared statements (see ../../lib/credits.ts).

const FUNCTION_VERSION = "d1-1";

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

async function isDuplicateEvent(db: D1Database, eventId: string): Promise<boolean> {
  const row = await db.prepare("select id from polar_webhook_events where id = ?").bind(eventId).first();
  return row != null;
}

async function markEventProcessed(db: D1Database, eventId: string, eventType: string): Promise<void> {
  await db
    .prepare("insert into polar_webhook_events (id, event_type) values (?, ?)")
    .bind(eventId, eventType)
    .run();
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
  env: Env,
  data: Record<string, unknown>,
  forceRefresh = false,
): Promise<void> {
  const userId = await resolveUserIdFromPolarCustomer(env.DB, customerFromPayload(data));
  if (!userId) {
    console.warn("Polar webhook: no matching user (external_id or email)", data.id);
    return;
  }

  const productId = extractProductId(data);
  if (!productId) {
    console.warn("Polar webhook: missing product id", data.id);
    return;
  }

  const plan = planForPolarProductId(env, productId);
  if (!plan) {
    console.warn("Polar webhook: unknown product", productId);
    return;
  }

  const customer = customerFromPayload(data);
  await grantSubscriptionCredits(env.DB, userId, plan, {
    polarCustomerId: typeof customer?.id === "string" ? customer.id : null,
    polarSubscriptionId: typeof data.id === "string" ? data.id : null,
    subscriptionStatus: typeof data.status === "string" ? data.status : "active",
    periodEnd: periodEndIso(data),
    forceRefresh,
  });
}

async function handleSubscriptionRevoked(
  env: Env,
  data: Record<string, unknown>,
  status: "canceled" | "revoked" | "past_due",
): Promise<void> {
  const userId = await resolveUserIdFromPolarCustomer(env.DB, customerFromPayload(data));
  if (!userId) return;

  const retain = status === "canceled";
  await revokeSubscription(env.DB, userId, {
    subscriptionStatus: status,
    periodEnd: periodEndIso(data),
    retainAccessUntilPeriodEnd: retain,
  });
}

async function handleOrderRenewal(env: Env, data: Record<string, unknown>): Promise<void> {
  const billingReason = data.billing_reason ?? data.billingReason;
  if (billingReason !== "subscription_cycle") return;

  const subscription = data.subscription as Record<string, unknown> | undefined;
  if (subscription) {
    await handleSubscriptionActive(env, subscription, true);
    return;
  }

  const userId = await resolveUserIdFromPolarCustomer(env.DB, customerFromPayload(data));
  if (!userId) return;

  const product = data.product as Record<string, unknown> | undefined;
  const productId = typeof product?.id === "string" ? product.id : null;
  if (!productId) return;

  const plan = planForPolarProductId(env, productId);
  if (!plan) return;

  await grantSubscriptionCredits(env.DB, userId, plan, {
    subscriptionStatus: "active",
    forceRefresh: true,
  });
}

export const polarWebhook = new Hono<{ Bindings: Env }>();

polarWebhook.get("/", (c) =>
  c.json({ ok: true, endpoint: "polar-webhook", hint: "Polar delivers events via POST with Standard Webhooks signatures" }),
);

polarWebhook.post("/", async (c) => {
  const env = c.env;
  const webhookSecret = polarWebhookSecret(env);
  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET not configured");
    return json(503, { error: "Webhook not configured" });
  }

  const formatError = validatePolarWebhookSecretFormat(webhookSecret);
  if (formatError) {
    console.error(formatError);
    return json(503, { error: formatError });
  }

  const rawBody = await c.req.text();
  const headerRecord = headersToRecord(c.req.raw.headers);
  let event: { type: string; data: Record<string, unknown> };

  try {
    event = parsePolarWebhookEvent(rawBody, headerRecord, webhookSecret);
  } catch (e) {
    if (e instanceof StandardWebhookVerificationError) {
      return json(403, { error: "Invalid signature", hint: INVALID_SIGNATURE_HINT });
    }
    console.error("Polar webhook parse error", e);
    return json(400, { error: "Invalid payload", detail: e instanceof Error ? e.message : "Parse failed" });
  }

  const eventId = c.req.header("webhook-id") ?? crypto.randomUUID();

  if (await isDuplicateEvent(env.DB, eventId)) {
    return json(202, { ok: true, duplicate: true });
  }

  try {
    const type = event.type;
    const data = event.data ?? {};

    const orgError = assertEventOrganization(env, data);
    if (orgError) {
      console.error(orgError);
      return json(403, { error: orgError });
    }

    switch (type) {
      case "subscription.active":
        await handleSubscriptionActive(env, data);
        break;
      case "subscription.updated": {
        const status = typeof data.status === "string" ? data.status : "";
        if (status === "active") {
          await handleSubscriptionActive(env, data);
        } else if (status === "past_due") {
          await handleSubscriptionRevoked(env, data, "past_due");
        } else if (status === "canceled") {
          await handleSubscriptionRevoked(env, data, "canceled");
        }
        break;
      }
      case "subscription.canceled":
        await handleSubscriptionRevoked(env, data, "canceled");
        break;
      case "subscription.revoked":
        await handleSubscriptionRevoked(env, data, "revoked");
        break;
      case "subscription.past_due":
        await handleSubscriptionRevoked(env, data, "past_due");
        break;
      case "order.created":
        await handleOrderRenewal(env, data);
        break;
      default:
        break;
    }

    await markEventProcessed(env.DB, eventId, type);
    return json(202, { ok: true });
  } catch (e) {
    console.error("Polar webhook handler error", e);
    return json(500, { error: e instanceof Error ? e.message : "Handler failed" });
  }
});
