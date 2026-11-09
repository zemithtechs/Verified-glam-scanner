import "server-only";
import { cookies } from "next/headers";

/**
 * Single source of truth for the session cookie. httpOnly so the bearer
 * token issued by worker-api's Better Auth never reaches client-side JS —
 * this is what replaces the old Flutter-web URL-param handoff, which was
 * the actual cause of the login redirect-loop bug in that app.
 */
export const SESSION_COOKIE = "vg_session";

// Matches worker-api's session TTL (auth.ts / auth-native.ts: 30 days).
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
