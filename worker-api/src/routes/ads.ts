import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";
import { mintRewardToken } from "../lib/reward-tokens";
import { VALID_FEATURES, type FeatureType } from "../lib/analyze-types";

// Called only after the client's onUserEarnedReward fires for a rewarded
// interstitial — see docs on lib/reward-tokens.ts for why this, and not a
// bare client-side flag, is what actually gates the analyze route.
export const ads = new Hono<{ Bindings: Env; Variables: SessionVars }>();

ads.post("/reward", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ featureType?: string }>().catch(() => ({}) as { featureType?: string });
  const featureType = body.featureType as FeatureType;

  if (!VALID_FEATURES.includes(featureType)) {
    return c.json({ error: `Unknown featureType: ${featureType}`, errorCode: "INVALID_REQUEST" }, 400);
  }

  const { token, expiresAt } = await mintRewardToken(c.env.DB, userId, featureType);
  return c.json({ rewardToken: token, expiresAt });
});
