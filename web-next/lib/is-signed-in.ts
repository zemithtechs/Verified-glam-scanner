import { getSessionToken } from "./session";

/** Lightweight cookie-presence check for public marketing pages — just
 * enough to decide "Log in" vs "Dashboard" in the header. Not an auth
 * decision (that's proxy.ts + the /app layout's authoritative check), so a
 * stale/expired cookie here just means the header briefly says "Dashboard"
 * until the user clicks through and gets bounced to login by the real gate. */
export async function isSignedIn(): Promise<boolean> {
  const token = await getSessionToken();
  return Boolean(token);
}
