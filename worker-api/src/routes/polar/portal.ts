import { Hono } from "hono";
import type { Env } from "../../env";
import type { SessionVars } from "../../middleware/session";
import { createPolarClient, defaultPortalUrl, polarAccessToken } from "../../lib/polar";

// Port of supabase/functions/polar-customer-portal.
const FUNCTION_VERSION = "d1-1";

export const polarPortal = new Hono<{ Bindings: Env; Variables: SessionVars }>();

polarPortal.post("/", async (c) => {
  const env = c.env;
  const userId = c.get("userId");

  if (!polarAccessToken(env)) {
    return c.json({ error: "POLAR_ACCESS_TOKEN not configured", version: FUNCTION_VERSION }, 503);
  }

  const polar = createPolarClient(env);
  if (!polar) {
    return c.json({ error: "Polar client not configured", version: FUNCTION_VERSION }, 503);
  }

  try {
    const session = await polar.customerSessions.create({ externalCustomerId: userId });
    const portalUrl = session.customerPortalUrl ?? defaultPortalUrl(env);
    if (!portalUrl) {
      return c.json(
        {
          error:
            "No Polar customer found for this account. Complete checkout first, or set POLAR_ORGANIZATION_SLUG for the default portal URL.",
          version: FUNCTION_VERSION,
        },
        404,
      );
    }
    return c.json({ portalUrl, version: FUNCTION_VERSION });
  } catch (e) {
    // Polar's SDK throws (rather than returning a normal response) when
    // externalCustomerId has no matching customer yet — i.e. this user has
    // never completed a checkout. That's an expected, common case (anyone
    // who hasn't subscribed), not a server error, so surface it the same
    // way as the "no portalUrl" branch above instead of leaking the raw
    // Polar validation error as a 500.
    const message = e instanceof Error ? e.message : "Portal session failed";
    if (message.includes("Customer does not exist")) {
      return c.json(
        {
          error: "No Polar customer found for this account. Complete checkout first.",
          version: FUNCTION_VERSION,
        },
        404,
      );
    }
    console.error(e);
    return c.json({ error: message, version: FUNCTION_VERSION }, 500);
  }
});
