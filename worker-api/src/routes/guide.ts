import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";
import { fetchGuideRecommendations, resolveModel, FALLBACK_MODEL } from "../lib/openai";

// Port of supabase/functions/guide-recommendations — text-only OpenAI call,
// warm-up for calling OpenAI from a Worker before analyze.ts (see
// docs/CLOUDFLARE_MIGRATION_PLAN.md rewrite order).
const FUNCTION_VERSION = "d1-1";

export const guide = new Hono<{ Bindings: Env; Variables: SessionVars }>();

guide.post("/recommendations", async (c) => {
  const env = c.env;
  const openaiKey = env.OPENAI_API_KEY?.trim();
  if (!openaiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured", version: FUNCTION_VERSION }, 503);
  }
  const openaiModel = resolveModel(env.OPENAI_MODEL || FALLBACK_MODEL);

  const body = await c.req
    .json<{ profile?: Record<string, unknown> }>()
    .catch(() => ({}) as { profile?: Record<string, unknown> });
  const profile = body.profile ?? {};

  try {
    const payload = await fetchGuideRecommendations({ apiKey: openaiKey, model: openaiModel, profile });
    return c.json({ ...payload, version: FUNCTION_VERSION });
  } catch (e) {
    console.error(e);
    return c.json({ error: e instanceof Error ? e.message : "Guide recommendations failed", version: FUNCTION_VERSION }, 500);
  }
});
