import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";

// Port of vg_supabase_push_token_repository.dart's two calls.
export const pushTokens = new Hono<{ Bindings: Env; Variables: SessionVars }>();

pushTokens.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ token?: string; platform?: string }>().catch(() => ({}) as { token?: string; platform?: string });
  const token = body.token?.trim();
  const platform = body.platform?.trim();
  if (!token || !platform) {
    return c.json({ error: "token and platform required" }, 400);
  }

  const now = new Date().toISOString();
  await c.env.DB.prepare(
    `insert into device_push_tokens (id, user_id, fcm_token, platform, is_active, last_seen_at, updated_at)
     values (?, ?, ?, ?, 1, ?, ?)
     on conflict (fcm_token) do update set
       user_id = excluded.user_id,
       platform = excluded.platform,
       is_active = 1,
       last_seen_at = excluded.last_seen_at,
       updated_at = excluded.updated_at`,
  )
    .bind(crypto.randomUUID(), userId, token, platform, now, now)
    .run();

  return c.json({ ok: true });
});

pushTokens.post("/deactivate", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ token?: string }>().catch(() => ({}) as { token?: string });
  const token = body.token?.trim();
  if (!token) {
    return c.json({ error: "token required" }, 400);
  }

  await c.env.DB.prepare(
    "update device_push_tokens set is_active = 0, updated_at = ? where user_id = ? and fcm_token = ?",
  )
    .bind(new Date().toISOString(), userId, token)
    .run();

  return c.json({ ok: true });
});
