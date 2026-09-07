import { AnalysisError } from "./analyze-errors";

// Free-tier gate for FACE_BEAUTY_ANALYSIS: the client shows a rewarded
// interstitial (see VGAdsManager) and, only after onUserEarnedReward
// fires, calls POST /api/ads/reward to mint one of these. The analyze
// route then requires and consumes a token for each free scan — a client
// modified to skip the ad has no way to mint a valid token itself, since
// it's a server-generated opaque value looked up in D1 (same trust model
// as Better Auth's own session tokens).
const REWARD_TOKEN_TTL_MS = 5 * 60 * 1000;

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function mintRewardToken(db: D1Database, userId: string, featureType: string): Promise<{ token: string; expiresAt: string }> {
  const token = randomToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + REWARD_TOKEN_TTL_MS);

  await db
    .prepare("insert into reward_tokens (token, user_id, feature_type, issued_at, expires_at) values (?, ?, ?, ?, ?)")
    .bind(token, userId, featureType, now.toISOString(), expiresAt.toISOString())
    .run();

  return { token, expiresAt: expiresAt.toISOString() };
}

/** Verifies, then immediately consumes, a reward token — throws if invalid. */
export async function consumeRewardToken(db: D1Database, userId: string, featureType: string, token: string | undefined): Promise<void> {
  if (!token) {
    throw new AnalysisError(403, "REWARD_REQUIRED", "Watch an ad to unlock this scan.");
  }

  const row = await db
    .prepare("select user_id, feature_type, expires_at, consumed_at from reward_tokens where token = ?")
    .bind(token)
    .first<{ user_id: string; feature_type: string; expires_at: string; consumed_at: string | null }>();

  if (
    !row ||
    row.user_id !== userId ||
    row.feature_type !== featureType ||
    row.consumed_at !== null ||
    new Date(row.expires_at).getTime() < Date.now()
  ) {
    throw new AnalysisError(403, "REWARD_REQUIRED", "Watch an ad to unlock this scan.");
  }

  await db.prepare("update reward_tokens set consumed_at = ? where token = ?").bind(new Date().toISOString(), token).run();
}
