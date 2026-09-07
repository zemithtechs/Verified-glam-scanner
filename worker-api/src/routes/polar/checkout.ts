import { Hono } from "hono";
import type { Env } from "../../env";
import type { SessionVars } from "../../middleware/session";
import { polarProductIds } from "../../lib/credits";
import {
  buildCheckoutLinkUrl,
  createPolarClient,
  polarAccessToken,
  polarCancelUrl,
  polarCheckoutLinkForPlan,
  polarSuccessUrl,
} from "../../lib/polar";

// Port of supabase/functions/polar-create-checkout — session-gated warm-up
// for the middleware pattern (see docs/CLOUDFLARE_MIGRATION_PLAN.md).
// requireSession (mounted in index.ts) replaces the Supabase
// userClient.auth.getUser() call.

const FUNCTION_VERSION = "d1-1";
const VALID_PLANS = new Set(["annual", "pro_weekly"]);

export const polarCheckout = new Hono<{ Bindings: Env; Variables: SessionVars }>();

function productIdForPlan(env: Env, planId: string): string | null {
  const ids = polarProductIds(env);
  if (planId === "annual") return ids.annual;
  if (planId === "pro_weekly") return ids.proWeekly;
  return null;
}

polarCheckout.post("/", async (c) => {
  const env = c.env;
  const userId = c.get("userId");
  const userEmail = c.get("userEmail");

  if (!polarAccessToken(env)) {
    return c.json({ error: "POLAR_ACCESS_TOKEN not configured", version: FUNCTION_VERSION }, 503);
  }

  const body = await c.req.json<{ planId?: string }>().catch(() => ({}) as { planId?: string });
  const planId = typeof body.planId === "string" ? body.planId.trim() : "";
  if (!VALID_PLANS.has(planId)) {
    return c.json({ error: "Invalid planId", version: FUNCTION_VERSION }, 400);
  }

  const successUrl = polarSuccessUrl(env);
  const cancelUrl = polarCancelUrl(env);
  const productId = productIdForPlan(env, planId);
  const polar = createPolarClient(env);

  if (polar && productId) {
    try {
      // Note: this SDK version's CheckoutCreate has no cancelUrl field (Polar
      // dropped it in favor of returnUrl semantics) — cancelUrl is kept only
      // in our own response JSON below, not sent to Polar's API.
      const checkout = await polar.checkouts.create({
        products: [productId],
        externalCustomerId: userId,
        customerEmail: userEmail ?? undefined,
        successUrl,
      });

      if (checkout.url) {
        return c.json({ checkoutUrl: checkout.url, successUrl, cancelUrl, version: FUNCTION_VERSION });
      }
    } catch (apiError) {
      console.warn("Polar API checkout failed, trying static link fallback:", apiError);
    }
  }

  const staticLink = polarCheckoutLinkForPlan(env, planId);
  if (staticLink) {
    const checkoutUrl = buildCheckoutLinkUrl(staticLink, userId, userEmail);
    return c.json({ checkoutUrl, successUrl, cancelUrl, version: FUNCTION_VERSION });
  }

  return c.json(
    {
      error: "Polar checkout not configured — set POLAR_PRODUCT_ID_* secrets (preferred) or POLAR_CHECKOUT_LINK_* fallback",
      version: FUNCTION_VERSION,
    },
    503,
  );
});
