import { Hono } from "hono";
import type { Env } from "../env";
import { verifyGoogleIdToken } from "../lib/google-auth";

// Native Google sign-in (Flutter's google_sign_in package returns an ID
// token directly, no browser redirect) — Better Auth's Google provider only
// handles the OAuth-redirect flow, so this issues sessions the same way
// Better Auth itself would, using the identical `user`/`account`/`session`
// tables (see docs/CLOUDFLARE_MIGRATION_PLAN.md — "Native Google sign-in").
export const authNative = new Hono<{ Bindings: Env }>();

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days — "remember me", matches auth.ts's session.expiresIn.

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function createSession(db: D1Database, userId: string): Promise<{ token: string; expiresAt: string }> {
  const token = randomToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);

  await db
    .prepare('insert into session (id, "expiresAt", token, "createdAt", "updatedAt", "userId") values (?, ?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), expiresAt.toISOString(), token, now.toISOString(), now.toISOString(), userId)
    .run();

  return { token, expiresAt: expiresAt.toISOString() };
}

authNative.post("/google", async (c) => {
  const env = c.env;
  const body = await c.req.json<{ idToken?: string }>().catch(() => ({}) as { idToken?: string });
  const idToken = body.idToken?.trim();
  if (!idToken) return c.json({ error: "idToken required" }, 400);

  let claims;
  try {
    claims = await verifyGoogleIdToken(idToken, env.GOOGLE_CLIENT_ID);
  } catch (e) {
    console.warn("Google ID token verification failed", e);
    return c.json({ error: "Invalid Google ID token" }, 401);
  }

  const db = env.DB;
  const now = new Date().toISOString();

  const GOOGLE_ISSUER = "https://accounts.google.com";

  const existingAccount = await db
    .prepare('select "userId" from account where "issuer" = ? and "accountId" = ?')
    .bind(GOOGLE_ISSUER, claims.sub)
    .first<{ userId: string }>();

  let userId: string;

  if (existingAccount) {
    userId = existingAccount.userId;
  } else {
    const existingUser = await db.prepare("select id from \"user\" where email = ?").bind(claims.email).first<{ id: string }>();

    if (existingUser) {
      userId = existingUser.id;
    } else {
      userId = crypto.randomUUID();
      await db
        .prepare('insert into "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") values (?, ?, ?, ?, ?, ?, ?)')
        .bind(userId, claims.name ?? claims.email.split("@")[0], claims.email, claims.email_verified ? 1 : 0, claims.picture ?? null, now, now)
        .run();
      // Mirrors auth.ts's databaseHooks.user.create.after — that hook only
      // fires for Better Auth's own signup flow, not this direct DB insert.
      await db.prepare("insert into profiles (id, email) values (?, ?) on conflict (id) do nothing").bind(userId, claims.email).run();
    }

    await db
      .prepare(
        'insert into account (id, "issuer", "accountId", "providerId", "userId", "createdAt", "updatedAt") values (?, ?, ?, \'google\', ?, ?, ?)',
      )
      .bind(crypto.randomUUID(), GOOGLE_ISSUER, claims.sub, userId, now, now)
      .run();
  }

  const session = await createSession(db, userId);
  return c.json({ token: session.token, expiresAt: session.expiresAt, userId });
});
