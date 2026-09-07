import type { Context, Next } from "hono";
import { createAuth } from "../auth";
import type { Env } from "../env";

export type SessionVars = {
  userId: string;
  userEmail: string | null;
};

/**
 * Mechanical replacement for Postgres RLS: every route that needs a user
 * scopes its D1 queries with `WHERE user_id = ?` using this verified id,
 * instead of relying on database-level policies (see
 * docs/CLOUDFLARE_MIGRATION_PLAN.md — "RLS policies" row).
 */
export async function requireSession(
  c: Context<{ Bindings: Env; Variables: SessionVars }>,
  next: Next,
) {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user?.id) {
    return c.json({ error: "unauthorized" }, 401);
  }

  c.set("userId", session.user.id);
  c.set("userEmail", session.user.email ?? null);
  await next();
}
