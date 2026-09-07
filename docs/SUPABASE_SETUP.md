# Supabase backend setup — Verified Glam

## 1. Create project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Copy **Project URL** and **anon public** key (Settings → API).

## 2. Database

From the repo root (with [Supabase CLI](https://supabase.com/docs/guides/cli) installed):

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or paste [`supabase/migrations/001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql) into the SQL editor and run it.

## 3. Authentication

1. **Authentication → Providers → Email** — enable.
2. **Google** — enable and add OAuth client IDs:
   - **Web client ID** (used as `serverClientId` on Android) → set as `GOOGLE_WEB_CLIENT_ID` dart-define.
   - Android client with your app SHA-1 from `keytool -list -v -keystore ~/.android/debug.keystore`.
3. Add redirect URL if using deep links: `io.supabase.verifiedglam://login-callback`
4. **Web app (local testing)** — Authentication → URL configuration:
   - Site URL: `http://localhost:8080` (while testing locally)
   - Redirect URLs: `http://localhost:8080/**`, `http://localhost:**`
   - When you deploy to Cloudflare, switch Site URL to `https://app.verifiedglam.com` and add `https://app.verifiedglam.com/**`

## 4. Storage

Migration creates private bucket `scan-photos` with RLS. No public access.

## 5. Edge Functions

Set secrets in **Project Settings → Edge Functions → Secrets** (not in database tables):

- `OPENAI_API_KEY` — required (`sk-...`, no quotes or trailing spaces)
- `OPENAI_MODEL` — optional (default `gpt-4o-mini`; `gpt-4o` also works)

Verify secrets: Dashboard → Edge Functions → Secrets. If the key is missing, scan features return **503** `"OPENAI_API_KEY not configured"`. If the key is present but OpenAI returns no content, logs show `finish_reason` (often `content_filter`).

### `analyze-scan`

Handles all 10 scan feature types (photo upload + OpenAI vision). **Pro subscribers** consume **5 credits** per analysis; credits renew by plan (200/year on Yearly, 30/week on Pro Weekly). See migration `008_profile_credits.sql`.

### `guide-recommendations`

Profile-only personalized tips for the Guide tab (no photo).

### `polar-create-checkout` (authenticated)

Creates a Polar hosted checkout session via **API first** (`polar.checkouts.create`) with `customerExternalId` = Supabase user UUID. Falls back to static checkout links only if API fails and `POLAR_CHECKOUT_LINK_*` is set. Input: `{ "planId": "annual" | "pro_weekly" }`. Returns `{ "checkoutUrl" }`.

### `polar-customer-portal` (authenticated)

Returns `{ "portalUrl" }` so signed-in users can cancel or update billing in Polar’s customer portal.

### `polar-webhook` (public, signature-verified)

Receives Polar Standard Webhooks. Updates `profiles.is_pro`, `subscription_plan`, credit fields, and Polar IDs. Idempotent via `polar_webhook_events`.

Deploy all functions:

```bash
supabase functions deploy analyze-scan guide-recommendations polar-create-checkout polar-customer-portal polar-webhook
```

Or from Windows (requires `SUPABASE_ACCESS_TOKEN` in `.env` from [Account → Tokens](https://supabase.com/dashboard/account/tokens)):

```powershell
.\scripts\deploy-functions.ps1
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically in production.

### Polar.sh subscriptions (web + Android)

Cross-platform billing uses Polar hosted checkout — **not** Google Play Billing or RevenueCat. Pay on web or Android → same Supabase account gets Pro + credits on both.

**Edge Function secrets** (Dashboard → Edge Functions → Secrets):

| Secret | Value |
|--------|--------|
| `POLAR_ACCESS_TOKEN` | Organization access token (sandbox first, then production) |
| `POLAR_ORGANIZATION_ID` | Organization UUID from Polar → Settings → **Unique identifier for your organization** |
| `POLAR_ORGANIZATION_SLUG` | Org slug for `https://polar.sh/{slug}/portal` fallback (Settings → slug) |
| `POLAR_WEBHOOK_SECRET` | **`polar_whs_…` exactly from Polar → Webhooks → Signing secret** — do **not** add `whsec_` prefix |
| `POLAR_PRODUCT_ID_ANNUAL` | `9e185286-cf2b-41b8-a728-e7154d144722` |
| `POLAR_PRODUCT_ID_PRO_WEEKLY` | `8c9fddc9-1001-4143-8a27-31ce929ae5e6` |
| `POLAR_CHECKOUT_LINK_ANNUAL` | Optional guest/marketing fallback — **not required** in Supabase; API checkout is preferred |
| `POLAR_CHECKOUT_LINK_PRO_WEEKLY` | Optional guest/marketing fallback |
| `POLAR_SUCCESS_URL` | `https://scanner.verifiedglam.com/app/face-beauty-analysis?checkout=success` (post-payment dashboard) |
| `POLAR_CANCEL_URL` | `https://scanner.verifiedglam.com/pricing?checkout=cancelled` |
| `POLAR_ENV` | **`production`** for live billing (defaults to sandbox if unset or any other value) |

**Polar Dashboard:** Register webhook URL `https://YOUR_PROJECT.supabase.co/functions/v1/polar-webhook`. Subscribe to **`subscription.active`**, `subscription.updated`, `subscription.canceled`, `subscription.revoked`, `order.created`. **`checkout.created` alone does not grant Pro.**

**Database:** Run migration `009_polar_subscription.sql` (`supabase db push`).

**Local dev mock billing:** Set `kVGLocalDevMode = true` in `lib/utils/vg_constants.dart` to use `purchaseMock` without Polar.

### Subscription credits (manual SQL / QA)

To grant credits manually without Polar (e.g. before webhook testing):

```sql
update public.profiles
set is_pro = true,
    subscription_plan = 'annual',
    subscription_status = 'active',
    credits_balance = 200,
    credits_allocated = 200,
    credits_period_key = '2026'
where id = 'YOUR_USER_UUID';
```

Use `pro_weekly` with `credits_balance = 30` and `credits_period_key = '2026-W26'` (ISO week) for weekly renewal tests. Each `analyze-scan` call deducts 5 credits when successful.

### Polar sandbox QA checklist

Run after secrets and webhook are configured:

```powershell
.\scripts\test-polar-integration.ps1
```

Manual E2E:

1. Sandbox checkout **Yearly** on web → profile shows 200 credits → scan deducts 5.
2. Same account on Android → Pro access without repaying.
3. **Pro weekly** → 30 credits; block on insufficient credits after use.
4. Cancel in Polar portal → webhook sets `subscription_status` / revokes access at period end.
5. Renewal `order.created` with `billing_reason: subscription_cycle` refreshes credits.

Use `polar listen --forward-to https://YOUR_PROJECT.supabase.co/functions/v1/polar-webhook` for local webhook testing during development.

## 6. Run Flutter with credentials

### Web app prerequisite (passkeys SDK)

`supabase_flutter` 2.15+ depends on the Corbado **passkeys** plugin. On web, `Supabase.initialize()` requires the public SDK script in [`web/index.html`](../web/index.html):

```html
<script src="js/passkeys-bundle.js"></script>
```

The file is vendored at [`web/js/passkeys-bundle.js`](../web/js/passkeys-bundle.js) (public client SDK — **not** a secret). Without it, the web app crashes on startup with `PasskeyAuthenticator.init` / null-check errors. Rebuild after changes: `.\scripts\build-web.ps1`.

**Recommended:** use the dev script (reads `.env` and passes `--dart-define`):

```powershell
.\scripts\run-dev.ps1
```

Or use the **Verified Glam (Supabase)** launch config in `.vscode/launch.json`.

Manual run:

```powershell
C:\Users\zenit\flutter\bin\flutter.bat run `
  --dart-define=SUPABASE_URL=https://YOUR_REF.supabase.co `
  --dart-define=SUPABASE_ANON_KEY=your_anon_key `
  --dart-define=GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com `
  --dart-define=VG_USE_SUPABASE=true `
  --dart-define=VG_USE_MOCK_ANALYSIS=false
```

Copy [`.env.example`](../.env.example) for reference. **Do not commit real keys.**

## 7. Flags

| Dart define | Default | Meaning |
|-------------|---------|---------|
| `VG_USE_SUPABASE` | `true` | Cloud auth, storage, scans |
| `VG_USE_MOCK_ANALYSIS` | `false` | Skip OpenAI; use local mock payloads |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | empty | If empty, app falls back to local-only mock |

`kVGLocalDevMode` in code only bypasses paywall/ads — not the backend.

## 8. Pre-phone verification (run before device testing)

After deploying Edge Functions, confirm production returns **`X-Function-Version: 2`** on OPTIONS:

```powershell
# Deploy (needs SUPABASE_ACCESS_TOKEN in .env)
.\scripts\deploy-functions.ps1

# Full E2E: signup, upload photo, all 10 scan types + Guide (uses .env Supabase keys)
.\tools\e2e-test-supabase.ps1

# Optional: test OpenAI vision only (needs OPENAI_API_KEY in .env temporarily)
.\tools\test-openai-vision.ps1
```

If `e2e-test-supabase.ps1` prints **All E2E tests passed**, the backend and OpenAI pipeline work. Then run the app on your phone with `.\scripts\run-dev.ps1`.

If you still see **`Empty OpenAI response`** without `finish_reason=`, the old function is still cached — redeploy and confirm version **2** in response headers.

## 9. Phone test flow

1. Walkthrough → Login (email or Google).
2. Complete onboarding.
3. Run **Beauty Tips** or **Face Golden Ratio** with a selfie → Edge Function returns JSON payload.
4. Open **Guide** tab → personalized tips from `guide-recommendations` (cached locally).
5. Open **Scans** tab → history loaded from `scans` table.

### Phone test matrix

| Feature | Expected |
|---------|----------|
| Face Beauty Analysis | Score + annotations |
| Seasonal Color Palette | season + palette |
| 7 Day Beauty Routine | 7-day list |
| Beauty Tips | spots overlay + tips |
| Celebrity Look Alike | matches list |
| Facial Symmetry | symmetry scores |
| Beauty Score Showdown | podium |
| Face Comparison | similarity |
| Attractiveness Test | scores + landmarks |
| Face Golden Ratio | measurements |
| Guide tab | 3–5 personalized tips |

## Limits

Supabase and OpenAI bill by usage. Edge Function enforces **50 scans/user/day** in [`analyze-scan/index.ts`](../supabase/functions/analyze-scan/index.ts). Adjust `DAILY_SCAN_LIMIT` as needed.

## Is the backend connected?

| Layer | How to tell |
|-------|-------------|
| **Flutter app** | Only connected if you pass `--dart-define=SUPABASE_URL=...` and `--dart-define=SUPABASE_ANON_KEY=...` at run time. A `.env` file is **not** loaded automatically. If defines are missing, the app uses **local mock** data. |
| **Supabase project** | Dashboard → project `qmivgvctmxvpnbouqslj` should be **Active** (not paused). Settings → API: copy **Project URL** + **anon public** (or publishable) key. |
| **Database** | Run migration (`supabase db push` or SQL editor). Table Editor should show `profiles`, `scans`. |
| **Edge Functions** | `analyze-scan`, `guide-recommendations`, `send-challenge-push`, `dispatch-challenge-notifications` deployed. Secrets: `OPENAI_API_KEY`, `TMDB_API_KEY` (optional), **`FCM_SERVICE_ACCOUNT_JSON`** (recommended) or **`FCM_SERVER_KEY`** (legacy). |
| **Push cron** | Schedule `dispatch-challenge-notifications` every **10 minutes** in Dashboard → Edge Functions → Schedules (or invoke manually while testing). |
| **Migrations** | Include `007_notification_streak_kind.sql` for `streak` notification jobs. |
| **Beauty tips catalog** | Tables `beauty_tip_categories`, `beauty_tip_entries`, `beauty_spot_label_map`, `app_content` seeded from `lib/data/vg_beauty_tips_catalog.dart`. |

Quick run with your project (replace key from dashboard if API returns 401):

```powershell
.\scripts\run-dev.ps1 -DeviceId YOUR_DEVICE_ID
```

Or manually:

```powershell
C:\Users\zenit\flutter\bin\flutter.bat run `
  --dart-define=SUPABASE_URL=https://qmivgvctmxvpnbouqslj.supabase.co `
  --dart-define=SUPABASE_ANON_KEY=YOUR_KEY_FROM_DASHBOARD `
  --dart-define=VG_USE_SUPABASE=true `
  --dart-define=VG_USE_MOCK_ANALYSIS=false
```

## Challenge push notifications (FCM)

Full checklist: **[FCM_PUSH_SETUP.md](FCM_PUSH_SETUP.md)**. One-command setup (after `SUPABASE_ACCESS_TOKEN` in `.env`):

```powershell
.\scripts\setup-fcm-push.ps1
```

Use **`verified-glam-firebase-adminsdk-*.json`** for Supabase, not `google-services.json` (Android only; already at `android/app/google-services.json`).

[`send-challenge-push`](../supabase/functions/send-challenge-push/index.ts) supports two credential types. Use **one** of them (not both required).

### Option A — FCM HTTP v1 (recommended)

Uses your **Firebase Admin SDK JSON** (`verified-glam-firebase-adminsdk-*.json`). This is **not** the legacy Server key.

1. Firebase Console → Project settings → **Service accounts** → **Generate new private key** (JSON file).
2. Supabase Dashboard → **Edge Functions** → **Secrets** → add **`FCM_SERVICE_ACCOUNT_JSON`** → paste the **entire JSON** (one line is fine).
3. Or CLI after `npx supabase login`:
   ```powershell
   .\scripts\set-fcm-service-account-secret.ps1 -JsonPath "C:\path\to\verified-glam-firebase-adminsdk-....json"
   ```
4. Never commit `*firebase-adminsdk*.json` to git. Rotate the key in Firebase if it was ever exposed.

### Option B — Legacy Server key (optional)

Only if HTTP v1 is unavailable or you need older integrations.

1. [Google Cloud Console](https://console.cloud.google.com/) → project **verified-glam** → APIs & Services → enable **Cloud Messaging API (Legacy)**.
2. Firebase Console → Project settings → **Cloud Messaging** → **Cloud Messaging API (Legacy)** → copy **Server key** (plain `AIza...` string — **not** the JSON file).
3. Supabase secret **`FCM_SERVER_KEY`** = that string only.

### Deploy and test

1. Deploy `send-challenge-push` and `dispatch-challenge-notifications`.
2. Run migration `007_notification_streak_kind.sql`.
3. Schedule **`dispatch-challenge-notifications`** every **10 minutes** (Dashboard → Edge Functions → Schedules).
4. On device: sign in, allow notifications, complete a challenge day — verify `challenge_notification_jobs` move from `pending` to `sent`.

Notification types (enqueued when user taps Mark as done):

| Kind | When |
|------|------|
| `unlock` | 24h after previous day completed |
| `streak` | 7:00 PM on unlock day |
| `reminder` | 48h after unlock if day not done |
| `completion` | 1 min after final day |

Deep links: `/challenge/day{N}` opens the day task; `/challenge/reward` opens the reward card.

## Cursor Supabase MCP

See [`.cursor/README-SUPABASE-MCP.md`](../.cursor/README-SUPABASE-MCP.md). Config: [`.cursor/mcp.json`](../.cursor/mcp.json).
