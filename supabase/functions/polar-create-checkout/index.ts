import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { polarProductIds } from "../_shared/credits.ts";
import {
  buildCheckoutLinkUrl,
  createPolarClient,
  polarAccessToken,
  polarCancelUrl,
  polarCheckoutLinkForPlan,
  polarSuccessUrl,
} from "../_shared/polar.ts";

const FUNCTION_VERSION = "6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "X-Function-Version": FUNCTION_VERSION,
};

const VALID_PLANS = new Set(["annual", "pro_weekly"]);

function responseHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return { ...corsHeaders, ...extra };
}

function jsonError(status: number, message: string) {
  return new Response(
    JSON.stringify({ error: message, version: FUNCTION_VERSION }),
    {
      status,
      headers: responseHeaders({ "Content-Type": "application/json" }),
    },
  );
}

function productIdForPlan(planId: string): string | null {
  const ids = polarProductIds();
  if (planId === "annual") return ids.annual;
  if (planId === "pro_weekly") return ids.proWeekly;
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: responseHeaders() });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonError(401, "Missing authorization");
    }

    if (!polarAccessToken()) {
      return jsonError(503, "POLAR_ACCESS_TOKEN not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonError(401, "Invalid session");
    }

    const body = await req.json();
    const planId = typeof body.planId === "string" ? body.planId.trim() : "";
    if (!VALID_PLANS.has(planId)) {
      return jsonError(400, "Invalid planId");
    }

    const successUrl = polarSuccessUrl();
    const cancelUrl = polarCancelUrl();
    const productId = productIdForPlan(planId);
    const polar = createPolarClient();

    if (polar && productId) {
      try {
        // Field is externalCustomerId in @polar-sh/sdk@0.48.1 — customerExternalId
        // (previously used here) doesn't exist on CheckoutCreate and was silently
        // dropped, so checkouts weren't linking to the user's external ID at all.
        // cancelUrl also isn't a CheckoutCreate field in this SDK version (Polar
        // replaced it with returnUrl semantics) — dropped from the call, kept only
        // in the response JSON below.
        const checkout = await polar.checkouts.create({
          products: [productId],
          externalCustomerId: userData.user.id,
          customerEmail: userData.user.email ?? undefined,
          successUrl,
        });

        if (checkout.url) {
          return new Response(
            JSON.stringify({
              checkoutUrl: checkout.url,
              successUrl,
              cancelUrl,
              version: FUNCTION_VERSION,
            }),
            { headers: responseHeaders({ "Content-Type": "application/json" }) },
          );
        }
      } catch (apiError) {
        console.warn("Polar API checkout failed, trying static link fallback:", apiError);
      }
    }

    const staticLink = polarCheckoutLinkForPlan(planId);
    if (staticLink) {
      const checkoutUrl = buildCheckoutLinkUrl(
        staticLink,
        userData.user.id,
        userData.user.email,
      );
      return new Response(
        JSON.stringify({ checkoutUrl, successUrl, cancelUrl, version: FUNCTION_VERSION }),
        { headers: responseHeaders({ "Content-Type": "application/json" }) },
      );
    }

    if (!polarAccessToken()) {
      return jsonError(503, "POLAR_ACCESS_TOKEN not configured");
    }

    return jsonError(
      503,
      "Polar checkout not configured — set POLAR_PRODUCT_ID_* secrets (preferred) or POLAR_CHECKOUT_LINK_* fallback",
    );
  } catch (e) {
    console.error(e);
    return jsonError(500, e instanceof Error ? e.message : "Checkout failed");
  }
});
