# Migration Plan: Supabase → Cloudflare (D1 + R2 + Workers + Better Auth)

Status (2026-09-04): **Phase 0 complete. Phase 1 backend complete; Flutter side and Phase 2 not started.**

- D1 (`verified-glam-db`), both R2 buckets, and the Worker (`worker-api/`, deployed at `https://verified-glam-api.komolafephilip.workers.dev`) all exist and respond.
- Full D1 schema live: Better Auth's tables (user/session/account/verification) plus all 16 app tables ported from `supabase/migrations/001-013`, with the beauty tips catalog (8 categories, 96 tips, 28 labels) seeded.
- Better Auth's signup hook creates the matching `profiles` row (the `handle_new_user()` trigger port).
- **All 7 edge functions ported to `worker-api/src/routes/` + `worker-api/src/lib/` and smoke-tested live**: `polar-webhook`, `polar-create-checkout`, `polar-customer-portal`, `guide-recommendations`, `dispatch-challenge-notifications`+`send-challenge-push` (merged into one Cron-triggered handler), and `analyze-scan` (all 10 feature types, celebrity-portrait + showdown-podium enrichment, `get_showdown_leaderboard()` ported as JS aggregation over D1 queries per the plan). The `@cf-wasm/photon` image-resize spike passed live before this was attempted.
- Public R2 assets (celebrity portraits, showdown avatars) are served via a `/api/assets/:key` Worker route proxying the `ASSETS_BUCKET` binding — no custom domain wired up yet, swap `lib/r2.ts`'s `publicAssetUrl()` later if that changes.
- All Worker secrets set (Google, OpenAI, Polar, FCM, BETTER_AUTH_SECRET, TMDB optional/unset).
- Found and fixed a real latent bug while porting: the Polar SDK field was `customerExternalId` in the Deno function's code but the actual installed SDK (`0.48.1`, same version) expects `externalCustomerId` — worth checking whether the **live Supabase function** has the same bug, separate from this migration.

**Not started at all**: the Flutter app changes (8 `lib/services/supabase/*` files need rewriting to call the Worker instead of Supabase — auth service, storage service, 4 repositories), and Phase 2's data-migration rehearsal scripts (export/transform/import from live Supabase). Functional testing so far is structural (typecheck, dry-run bundle, auth-gate smoke tests) — no route has been exercised end-to-end with a real signed-up user, a real photo, and a real OpenAI call yet, since there are no users in the new system yet.

Supabase remains the live production backend; do not decommission it until Phase 3 (cutover) and the Phase 4 observation window are both complete.

**Update (later same day):** `profiles`, `scans`, and `challenges` routes were still 501 stubs from Phase 0 — now fully built (challenges.ts ports real business logic — badge awarding, streak math, day-unlock checks — that lived client-side in Dart against Supabase RLS, since D1 has no RLS equivalent). Added the `bearer` plugin to Better Auth (cookies don't work naturally for a Flutter native client) and a custom `/api/auth-native/google` endpoint for native Google Sign-In's ID-token flow (Better Auth's Google provider only handles browser OAuth-redirect). Also found and fixed a real bug during this: `worker-api/migrations/0000_better_auth.sql`, generated via the deprecated `@better-auth/cli` package, was missing an `account.issuer` column the actual installed `better-auth@1.7.2` runtime requires — first real signup failed with a D1 error. Fixed by calling the installed library's own `getMigrations()`/`compileMigrations()` directly (`worker-api/scripts/generate-schema.mjs`) and shipping `0003_better_auth_schema_fix.sql`. **Ran a real end-to-end test against the live system**: signed up a test user, got a bearer token, called `/api/profiles/me` (confirmed the signup hook created the profile row), `/api/scans` (create + photo upload to R2), and `/api/analyze` (confirmed the credits/subscription gate correctly rejects a non-pro user) — all against the actual deployed Worker and D1, not simulated. Test data cleaned up afterward. This is the first genuine end-to-end proof the backend works, not just structural checks. Also live-verified: `/api/auth/sign-in/email`, and a full signed-URL round-trip for private scan photos (`/api/scans/:id/photo-url` issues an HMAC-signed link, `/api/photo-signed/*` serves it unauthenticated, tampered tokens correctly rejected with 403).

**Flutter side (all 12 files touching Supabase, not the originally-scoped 8) — written but UNVERIFIED.** This environment has no Flutter/Dart toolchain (`flutter` isn't on PATH in Bash or PowerShell), so none of this Dart code has been compiled or analyzed — everything else in this plan was live-tested; this wasn't. Preserved every existing class name and method signature (`VGSupabaseAuthService`, `VGSupabaseProfileRepository`, `VGSupabaseScanRepository`, `VGSupabaseStorageService`, `VGSupabaseChallengeRepository`, `VGSupabasePushTokenRepository`, `VGSupabaseConfig`, `VGSupabaseInit`, `VGSupabaseConnection`) so none of the ~45 call-site files elsewhere in the app needed changes — only internals were rewritten, now calling a new `lib/services/supabase/vg_api_client.dart` (bearer-token REST client, session persisted via `flutter_secure_storage`, new pubspec dependency) instead of `supabase_flutter`. Also rewrote the 4 services that bypassed the repository layer and called Supabase directly: `vg_analysis_service.dart`, `vg_credits_service.dart`, `vg_guide_service.dart`, `vg_polar_checkout_service.dart`, plus `vg_error_utils.dart` (typed against `FunctionException`) and `vg_web_auth_helpers.dart` (typed against `AuthException`). `supabase_flutter` is no longer imported anywhere in `lib/`, but the pubspec dependency itself was deliberately left in place — removing it is a later cleanup step, not a Phase 1 concern.

Real gaps found and deliberately not papered over:
- **Password reset doesn't work yet** — `/api/auth/forget-password` 404s because Better Auth doesn't mount that route without an email-sending provider configured (none set up). Needs a transactional email service (Resend/Postmark/SendGrid) before this works.
- **`grantOnMockPurchase` (dev/mock paywall testing) is now client-cache-only, even when signed in** — the old Supabase RLS policy (`profiles_update_own`) let any authenticated user write `is_pro`/`credits_balance` directly on their own row from the client, which this dev-only method relied on. D1 has no equivalent open write path by default, and building one just for this convenience would reopen a self-grant hole. Real subscriptions are unaffected (Polar webhook path, server-side only).
- **`GOOGLE_WEB_CLIENT_ID` is still a placeholder in `.env`** — Google Sign-In (native ID-token flow, `/api/auth-native/google`) needs the real value before it'll work; added a `.vscode/launch.json` profile ("Verified Glam (Cloudflare)") for local testing with it left blank.
- Production build scripts (`scripts/build-web.ps1`, `scripts/cloudflare-build.sh`) were deliberately NOT updated to point at the Worker — those drive the live marketing site's deploy pipeline against Supabase; wiring `VG_API_URL` through them is a cutover-time decision, not something to slip in now.

**Next step for Flutter**: run `flutter pub get` (picks up `flutter_secure_storage`) then `flutter analyze` in an environment with the Flutter SDK, and report errors back — expect some, since none of this was compile-checked.

Phase 2 (data-migration rehearsal scripts) has not been started.

**Unrelated but important — production Supabase audit (later same day):** Comparing Supabase's tracked migration history against this repo's `supabase/migrations/` files found 4 migrations that were never applied to production — `008_profile_credits`, `011_celebrity_match_portraits`, `012_showdown_avatars`, `013_showdown_engagement` (tracked history stopped at `006`; everything after was evidently applied by hand via the SQL Editor at some point, and these 4 got missed, likely from the duplicate `008_` filename prefix). Confirmed real impact: `profiles` was missing `subscription_plan`/`credits_balance`/`credits_allocated`/`credits_period_key`, meaning **`analyze-scan`'s credit check was failing for every real Pro subscriber** — a live, revenue-impacting bug, unrelated to this migration. Applied all 4 migrations directly to production (user-approved), verified: all 3 storage buckets now exist, `get_showdown_leaderboard()` now callable, credits columns present. Real production data as of this audit: 17 users, 87 scans, 6 challenge plans, 24 Polar webhook events, 197 leftover objects in `scan-photos` (cleanup isn't as reliable as the ephemeral design assumes) — none of this exists in D1 yet, which still only has schema + static catalog seed data. Phase 2 needs to build export/transform/import against this real, non-trivial dataset.

## Context

Verified Glam is currently live on Supabase (Postgres database, Auth, Storage, and 7 Deno Edge Functions). The founder's concern: Supabase's Pro plan ($25/mo) bills egress at $0.09/GB with no ceiling, and this app repeatedly serves/re-fetches user photos — a cost curve that scales badly for a photo-heavy app as subscriber count grows into the tens of thousands, especially while subscription revenue per user is only ~$5-6/mo. The website is already deployed on Cloudflare Pages/Workers, so consolidating the backend onto Cloudflare (D1 for the database, R2 for image storage — R2 has zero egress fees, Workers for the API, Better Auth for authentication instead of paying for Supabase Auth/DB together) would put the entire stack on one platform and make image-serving costs flat instead of linear with usage.

Research confirms the founder's instinct is directionally right: at ~10k subscribers, Supabase Pro is estimated at ~$60-90/mo (dominated by egress), vs. an estimated ~$8-15/mo on the Cloudflare stack (Workers Paid $5/mo + D1, mostly free-tier + R2 storage, no egress charge). The gap widens further if usage/photo-views scale faster than subscriber count.

This app is live with real users, real data, and active Polar subscriptions today. The founder wants a **big-bang cutover** (not a slow dual-write migration): build the full Cloudflare backend and Flutter client changes, migrate the data in one pass during a planned downtime window, and switch over — keeping Supabase alive as a rollback safety net until the new system is proven.

Payments (Polar.sh) and push/analytics (Firebase) are **not changing** — only Supabase (DB + Auth + Storage + Edge Functions) is being replaced.

## What's being replaced, table by table

| Supabase piece | Cloudflare replacement |
|---|---|
| Postgres database (16 app tables) | D1 (SQLite) |
| Supabase Auth (auth.users, sessions, Google sign-in) | Better Auth, self-hosted on Workers with a D1 adapter |
| Storage: `scan-photos` (private) | R2, private bucket, accessed only via Worker binding (no client-side signed URLs) |
| Storage: `celebrity-match-portraits`, `showdown-avatars` (public) | R2 public bucket(s) on a custom domain |
| 7 Deno Edge Functions | One Cloudflare Worker (Hono router), split into routes + a Cron Trigger for scheduled push jobs |
| RLS policies (~25, all `auth.uid() = user_id` checks) | Explicit `WHERE user_id = ?` guards in every Worker route, driven by a verified Better Auth session |
| `handle_new_user()` Postgres trigger | Better Auth `databaseHooks.user.create.after` hook that inserts the `profiles` row |
| `get_showdown_leaderboard()` SQL function | Worker-side JS aggregation over 3 parameterized D1 queries (not a single SQL port — safer to test) |

**Key finding that simplifies things:** scan photos are already ephemeral — the app uploads, analyzes, then deletes them (`vg_analysis_service.dart` → `deleteScanPhoto()`). Most historical scans have no photo left in storage, only the JSON result. So the private-bucket design doesn't need signed URLs or SigV4 presigning at all — the Worker just reads the R2 object directly off its own binding during analysis, then deletes it. This is simpler than the current Supabase flow.

Zero use of Supabase Realtime anywhere in the app — nothing to replace there.

## Architecture

One Worker project (new, separate from the existing site's asset-only `wrangler.toml`), routed with Hono:

```
worker-api/
  src/
    index.ts                 # Hono app, mounts routers + global middleware
    auth.ts                  # Better Auth instance (D1 adapter, Google provider, hooks)
    middleware/session.ts    # verifies Better Auth session -> ctx.userId, 401 if absent
    routes/
      profiles.ts, scans.ts, analyze.ts, guide.ts, challenges.ts,
      push-tokens.ts, showdown.ts, polar/checkout.ts, polar/portal.ts, polar/webhook.ts
    scheduled/challenge-notifications.ts   # Cron Trigger
    lib/credits.ts, openai.ts, r2.ts       # ported business logic
  wrangler.toml   # D1 binding, R2 bindings (private scan bucket + public asset bucket), secrets
```

Every route with a session runs the same guard: resolve `userId` from the Better Auth session, then scope every D1 query to it — this is the mechanical replacement for all the RLS policies, and it's low-risk because the business logic already lives server-side in the Deno functions today (they use a service-role client that bypasses RLS), not in client-side Postgrest calls guarded only by policy. The genuinely new work is writing thin CRUD routes for what used to be raw client-side Supabase table queries (scans, profile, challenges, push tokens) — D1 has no auto-generated REST layer the way Supabase does.

## Auth migration (no forced password resets)

- **Preserve user IDs**: carry Supabase's `auth.users.id` (UUID) over as Better Auth's `user.id` directly. This makes the data migration a straight copy instead of an ID-remapping pass across all 16 tables' foreign keys.
- **Preserve password hashes**: configure Better Auth to verify with bcrypt (matching Supabase's existing hashes, e.g. via `bcryptjs`, which is Workers-compatible) instead of forcing a mass reset or a risky dual-verifier lazy-migration scheme.
- **Preserve Google-linked accounts**: migrate each `auth.identities` row (provider='google', Google sub) into a Better Auth `account` row keyed the same way — no re-consent needed, the app still does native Google Sign-In and gets a fresh ID token each time.
- **Preserve the email join key**: `credits.ts`'s Polar-webhook fallback (`resolveUserIdFromPolarCustomer`) matches guest-checkout customers by email when Polar's `external_id` isn't set — this must keep working, or guest-checkout subscribers stop reconciling.
- **Sessions do not carry over** (expected, and fine for a big-bang cutover with planned downtime): every user signs in once more after the cutover with their existing email/password or Google account. No one loses their account or has to reset a password.

**Flutter-side:** replace `lib/services/supabase/vg_supabase_auth_service.dart` with a new service exposing the same 6-method shape (`signUpWithEmail`, `signInWithEmail`, `signInWithGoogle`, `resetPassword`, `signOut`, `currentSession`/`currentUser`/`isSignedIn`/`onAuthStateChange`) so downstream call sites barely change. Default to calling Better Auth's REST endpoints directly (well-documented, typed OpenAPI surface) rather than betting on the unofficial community Flutter packages (`flutter_better_auth`, `better_auth_flutter_client`) — evaluate those in a short spike first, fall back to hand-rolled REST if they're not solid. Native Google ID-token sign-in has no built-in Better Auth equivalent — needs a small custom endpoint that verifies the token against Google's JWKS server-side.

## Data migration (big-bang cutover procedure)

1. **Export**: `pg_dump --data-only` for all 16 app tables, plus a separate export of `auth.users`/`auth.identities` (needs a direct Postgres connection, not the client API).
2. **Transform**: a one-off script converts `jsonb` → JSON-stringified TEXT, `timestamptz` → ISO-8601 TEXT, boolean → 0/1, keeps UUIDs as-is; separately transforms the auth export into Better Auth's `user`/`account` row shape (bcrypt hash → `account.password`, Google identities → `account` rows).
3. **Import**: `wrangler d1 execute --file=` in dependency order (user → account → profiles → everything else); copy the handful of objects in the two public storage buckets into R2 via the R2 API.
4. **Verify before flipping traffic**: row-count parity per table, JSON-validity check on every migrated JSON column, foreign-key integrity check (no orphaned rows), and a manual end-to-end test — sign in with a real test account, confirm scan history, credit balance, and subscription status all match pre-migration.

**Rollback plan**: Supabase stays fully intact and running through the cutover and a follow-on observation period — it is not decommissioned at cutover. If a critical defect surfaces right after go-live, the mitigation is to have affected users stay on/reinstall the previous app version pointed at the still-live Supabase backend. Because this is a one-directional big-bang (not dual-write), there's no way to reconcile new Cloudflare-side activity back into Supabase after the fact — so the plan leans on a strict go/no-go checklist (below) to make that scenario unlikely rather than trying to build reconciliation tooling.

## Edge function rewrite order

Simplest/lowest-risk first, to build up shared infrastructure before the hardest function:

1. **`polar-webhook`** — no session dependency, signature-verified as-is; validate its D1-based idempotency table and the `credits.ts` port early since Polar events keep arriving regardless of migration state.
2. **`polar-create-checkout` / `polar-customer-portal`** — thin, session-gated, good warm-up for the session-middleware pattern.
3. **`guide-recommendations`** — text-only OpenAI call, proves out calling OpenAI from a Worker.
4. **`dispatch-challenge-notifications` + `send-challenge-push`** — port FCM v1 JWT signing (Deno's `djwt` → `jose`), move the dispatch loop to a Workers Cron Trigger.
5. **`analyze-scan` last** (largest, ~2500 lines) — by this point session handling, the D1 credit ledger, and R2 helpers are already proven; what's new here is the R2-binding photo read (simpler than today's signed-URL flow), a Workers-compatible image resize library (spike `@cf-wasm/photon` early — this is the one genuinely uncertain dependency), and the leaderboard rewrite. Keep the exact same request/response JSON contract (error codes, success shape) so the Flutter-side analysis service needs no logic changes beyond the transport call.

## Flutter app changes

- **Rewritten**: the auth service (see above), the Supabase init/config files (replaced by a much simpler API-client base-URL + bearer-token setup), the storage service, and all four Supabase repositories (`vg_supabase_scan_repository.dart`, `vg_supabase_profile_repository.dart`, `vg_supabase_challenge_repository.dart`, `vg_supabase_push_token_repository.dart`) — each becomes a plain HTTP call to the new Worker, keeping the same method signatures so the rest of the app doesn't ripple.
- **Modified, not replaced**: `lib/services/vg_analysis_service.dart` (transport call swaps, logic stays), and higher-level services (`vg_credits_service.dart`, `vg_challenge_service.dart`, `vg_polar_checkout_service.dart`, `vg_push_service.dart`) which should need little change if the repository interfaces are preserved — audit each briefly to confirm none of them reach past their repository into Supabase-specific types.
- Remove the `supabase_flutter` dependency once everything under `lib/services/supabase/` is retired; keep `google_sign_in`.

## Timeline

- **Phase 0 — Groundwork (~1-2 weeks)**: stand up the Worker/D1/R2/Better Auth skeleton in staging; spike the three uncertain pieces (Google ID-token verification in Better Auth, Workers-compatible image resize, Flutter Better Auth integration approach); write and rehearse the export/transform/import scripts against a copy of production data.
- **Phase 1 — Backend + Flutter build, in parallel with the still-live Supabase app (~3-5 weeks)**: build D1 schema, rewrite the 7 functions in the order above, build the new Flutter services — production stays on Supabase the whole time.
- **Phase 2 — Migration rehearsal (~1 week)**: run the full pipeline against a fresh production snapshot into staging, verify, time it, repeat close to the actual cutover date to catch schema drift.
- **Phase 3 — Cutover (a few hours of planned downtime)**: go/no-go checklist (recent clean rehearsal, all routes tested, real-account sign-in tested, Polar webhook tested end-to-end, new build tested on real devices, rollback messaging ready) → execute export/transform/import/verify → release the new app version.
- **Phase 4 — Decommission Supabase (weeks later, not immediately)**: keep Supabase alive read-only for a 2-4 week observation window; only cancel it and remove `supabase_flutter`/`supabase/` from the repo once the new system has a clean track record.

## Key risks

| Risk | Mitigation |
|---|---|
| Data loss during migration | Supabase stays live through cutover + observation; rehearse the pipeline twice+ before the real cutover; hard verification gates before flipping traffic |
| Users locked out post-cutover | Preserve IDs and bcrypt hashes exactly — no forced resets; test against real opt-in accounts before cutover |
| Guest-checkout Polar customers stop reconciling | Preserve email as the matchable field the existing fallback logic relies on; test that specific path |
| Image resize has no direct Workers equivalent | Spike `@cf-wasm/photon` in Phase 0, not mid-rewrite |
| Native Google sign-in has no built-in Better Auth flow | Scope a custom JWKS-verification endpoint explicitly as build work, spiked early |
| Leaderboard rewrite introduces a scoring bug | Diff its output against the live Postgres RPC on the same data during rehearsal, before trusting it in production |
| Community Better Auth Flutter SDKs are immature | Default to hand-rolled REST against Better Auth's documented API; only adopt a community SDK if the Phase 0 spike finds it solid |
| Big-bang has no path to reconcile post-cutover Cloudflare activity back to Supabase if rolled back | Explicit, accepted tradeoff — mitigated by a strict go/no-go gate rather than building dual-write reconciliation |

## Verification once implementation starts

- Unit/integration tests for each new Worker route against a seeded staging D1 (row-count and auth-guard checks).
- Diff the leaderboard rewrite's output against the live `get_showdown_leaderboard()` RPC for identical input data.
- Manual sign-in test (email/password and Google) against staging with a handful of real, opted-in production accounts before the real cutover.
- Full data-migration verification suite (row-count parity, JSON validity, FK integrity) run as part of every rehearsal, not just the final cutover.
- Post-cutover: monitor Worker error rates, D1 query volume/cost, R2 request volume, and Polar webhook success rate during the observation window before decommissioning Supabase.

## Cloudflare account

All of this is built on the **komolafephilip@yahoo.com** account (account ID `d51f26f800e13df506b35fd6c2d523f6`), kept separate from the founder's other Cloudflare account via a project-local API token in `.env` (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) — see conversation history for how that isolation works. R2 and D1 permissions were verified working on 2026-09-04.
