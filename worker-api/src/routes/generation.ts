import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";
import { CREDITS_PER_GENERATION, chargeWebGeneration, getGenerationBalance } from "../lib/credits";
import { AnalysisError } from "../lib/analyze-errors";

/**
 * Credit handling for the AI Beauty Styling tools. Session-gated in index.ts.
 * The site checks the balance first, makes the image, then charges. Charging after success means a failed
 * generation never costs credits, and there is no "refund" endpoint that could be abused to mint credits.
 */
export const generation = new Hono<{ Bindings: Env; Variables: SessionVars }>();

generation.get("/balance", async (c) => {
  const balance = await getGenerationBalance(c.env.DB, c.get("userId"));
  return c.json({ ...balance, costPerResult: CREDITS_PER_GENERATION, canGenerate: balance.total >= CREDITS_PER_GENERATION });
});

generation.post("/charge", async (c) => {
  const body = await c.req.json<{ tool?: string }>().catch(() => ({}) as { tool?: string });
  const tool = typeof body.tool === "string" ? body.tool.slice(0, 80) : "AI tool";
  try {
    const remaining = await chargeWebGeneration(c.env.DB, c.get("userId"), tool);
    return c.json({ ok: true, remaining });
  } catch (e) {
    if (e instanceof AnalysisError) return c.json({ error: e.message, errorCode: e.errorCode }, e.status as 429);
    throw e;
  }
});
