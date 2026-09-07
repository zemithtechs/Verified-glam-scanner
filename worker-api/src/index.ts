import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "./auth";
import { requireSession, type SessionVars } from "./middleware/session";
import { dispatchChallengeNotifications } from "./scheduled/challenge-notifications";
import { profiles } from "./routes/profiles";
import { scans, scanPhotoSigned } from "./routes/scans";
import { analyze } from "./routes/analyze";
import { guide } from "./routes/guide";
import { challenges } from "./routes/challenges";
import { pushTokens } from "./routes/push-tokens";
import { showdown } from "./routes/showdown";
import { polarCheckout } from "./routes/polar/checkout";
import { polarPortal } from "./routes/polar/portal";
import { polarWebhook } from "./routes/polar/webhook";
import { assets } from "./routes/assets";
import { ads } from "./routes/ads";
import { authNative } from "./routes/auth-native";
import type { Env } from "./env";

const app = new Hono<{ Bindings: Env; Variables: SessionVars }>();

// The marketing/website's static pages (website/js/auth.js, checkout.js) call
// this API cross-origin using a bearer token, not cookies — no credentials
// needed, so a plain origin allowlist is enough (see docs/CLOUDFLARE_MIGRATION_PLAN.md).
const ALLOWED_ORIGINS = [
  "https://scanner.verifiedglam.com",
  "https://verified-glam-scanner.komolafephilip.workers.dev",
  "http://localhost:8080",
  "http://localhost:8099",
  "http://127.0.0.1:8080",
];
app.use(
  "*",
  cors({
    origin: (origin) => (origin && ALLOWED_ORIGINS.includes(origin) ? origin : ""),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

// Better Auth mounts its own sub-router (sign-up, sign-in, session, Google
// OAuth callback, etc.) at /api/auth/*.
app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

// Native Google sign-in (ID-token flow, see lib/google-auth.ts) — kept at a
// separate path from Better Auth's own /api/auth/* sub-router above.
app.route("/api/auth-native", authNative);

// Polar webhook verifies its own signature — no session guard.
app.route("/api/polar/webhook", polarWebhook);

// Public asset proxy for R2's ASSETS_BUCKET (celebrity portraits, showdown
// avatars) — no session guard, matches the original bucket's public=true.
app.route("/api/assets", assets);

// Signed scan-photo proxy — protected by its own HMAC token, not a
// session, since Image.network callers can't attach custom headers (see
// routes/scans.ts's signPhotoToken). Deliberately NOT under /api/scans/*
// — that path has the requireSession middleware below, which would defeat
// the point of a signature-based unauthenticated proxy.
app.route("/api/photo-signed", scanPhotoSigned);

// Everything below requires a verified Better Auth session.
app.use("/api/profiles/*", requireSession);
app.use("/api/scans/*", requireSession);
app.use("/api/analyze/*", requireSession);
app.use("/api/guide/*", requireSession);
app.use("/api/challenges/*", requireSession);
app.use("/api/push-tokens/*", requireSession);
app.use("/api/showdown/*", requireSession);
app.use("/api/polar/checkout/*", requireSession);
app.use("/api/polar/portal/*", requireSession);
app.use("/api/ads/*", requireSession);

app.route("/api/profiles", profiles);
app.route("/api/scans", scans);
app.route("/api/analyze", analyze);
app.route("/api/guide", guide);
app.route("/api/challenges", challenges);
app.route("/api/push-tokens", pushTokens);
app.route("/api/showdown", showdown);
app.route("/api/polar/checkout", polarCheckout);
app.route("/api/polar/portal", polarPortal);
app.route("/api/ads", ads);

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Env) {
    await dispatchChallengeNotifications(env);
  },
};
