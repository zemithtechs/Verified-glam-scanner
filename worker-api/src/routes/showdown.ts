import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";
import { fetchShowdownLeaderboard } from "../lib/showdown";

export const showdown = new Hono<{ Bindings: Env; Variables: SessionVars }>();

showdown.get("/leaderboard", async (c) => {
  const leaderboard = await fetchShowdownLeaderboard(c.env.DB, 200);
  return c.json({ leaderboard });
});
