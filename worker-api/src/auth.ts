import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";
import bcrypt from "bcryptjs";
import type { Env } from "./env";
import { gravatarUrlFor } from "./lib/gravatar";

/**
 * Migrated Supabase users keep their original bcrypt hash (see
 * docs/CLOUDFLARE_MIGRATION_PLAN.md — "Preserve password hashes"), so
 * Better Auth is configured to hash/verify with bcrypt instead of its
 * scrypt default. New signups after cutover get bcrypt hashes too, so
 * there is only one verification path, not a dual-mode migration hack.
 */
export function createAuth(env: Env) {
  return betterAuth({
    database: {
      db: new Kysely({ dialect: new D1Dialect({ database: env.DB }) }),
      type: "sqlite",
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    // "Remember me" — stay signed in for 30 days instead of Better Auth's
    // 7-day default, matching the native Google sign-in session TTL below.
    session: {
      expiresIn: 60 * 60 * 24 * 30,
    },
    // The marketing site (website/js/auth.js) calls sign-in/sign-up
    // cross-origin from its own domain — Better Auth's CSRF check rejects
    // any Origin not listed here, separately from the Hono CORS middleware
    // in index.ts (which only controls browser-visible response headers).
    trustedOrigins: [
      "https://scanner.verifiedglam.com",
      "https://verified-glam-scanner.komolafephilip.workers.dev",
      "http://localhost:8080",
      "http://localhost:8099",
      "http://127.0.0.1:8080",
      // web-next (Next.js rewrite) — Route Handlers call these endpoints
      // server-to-server and Better Auth's CSRF check requires a trusted
      // Origin header even for non-browser requests.
      "http://localhost:3100",
      "https://verified-glam-web.komolafephilip.workers.dev",
    ],
    emailAndPassword: {
      enabled: true,
      password: {
        hash: (password) => bcrypt.hash(password, 10),
        verify: ({ hash, password }) => bcrypt.compare(password, hash),
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    // Flutter (native, not a browser) can't rely on cookie-based sessions —
    // the bearer plugin lets it send `Authorization: Bearer <session-token>`
    // instead, same session table underneath.
    plugins: [bearer()],
    databaseHooks: {
      user: {
        create: {
          // Port of the Postgres handle_new_user() trigger
          // (supabase/migrations/001_initial_schema.sql): every new
          // Better Auth user gets a matching `profiles` row, id-linked
          // 1:1 like the original `references auth.users(id)` did.
          after: async (user) => {
            await env.DB.prepare(
              `insert into profiles (id, email, credits_balance, credits_allocated, credits_period_key)
               values (?, ?, 10, 10, 'free-lifetime') on conflict (id) do nothing`,
            )
              .bind(user.id, user.email)
              .run();

            // Give every new account a profile picture up front: reuse an
            // OAuth provider's photo (e.g. Google) if Better Auth already
            // captured one, otherwise check whether Gravatar has one for
            // this email. If neither exists, leave it unset — the frontend
            // renders a colored-initials avatar rather than a generic stock
            // photo, so there's no bad case for avatar_url staying null.
            const avatarUrl = user.image ?? (await gravatarUrlFor(user.email));
            if (avatarUrl) {
              await env.DB.prepare("update profiles set avatar_url = ? where id = ?").bind(avatarUrl, user.id).run();
            }
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
