import type { Context, Next } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "./session";
import { isAdminEmail } from "../lib/admin";

/** Mounted after requireSession — rejects any signed-in user who isn't on
 * the admin allowlist, same 403 shape as other auth failures in this API. */
export async function requireAdmin(c: Context<{ Bindings: Env; Variables: SessionVars }>, next: Next) {
  const email = c.get("userEmail");
  if (!isAdminEmail(email)) {
    return c.json({ error: "forbidden" }, 403);
  }
  await next();
}
