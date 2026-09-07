import type { Env } from "../env";

/**
 * Public URL for an object in the ASSETS_BUCKET (celebrity portraits,
 * showdown avatars — was Supabase's public storage URL). No custom domain
 * is wired to the bucket yet, so this points at the Worker's own
 * /api/assets/:key proxy route (see routes/assets.ts) instead of an
 * r2.dev/custom-domain URL — swap this one function later if that changes,
 * nothing else needs to know.
 */
export function publicAssetUrl(env: Env, key: string): string {
  return `${env.BETTER_AUTH_URL}/api/assets/${key}`;
}
