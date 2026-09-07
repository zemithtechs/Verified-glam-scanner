# Polar production setup checklist

Use this after Polar has verified your organization. All Polar secrets live in **Supabase** (not Cloudflare).

## 1. Supabase Edge Function secrets

Dashboard → **Project Settings → Edge Functions → Secrets** (or `supabase secrets set`):

| Secret | Production value |
|--------|------------------|
| `POLAR_ACCESS_TOKEN` | Production org access token from Polar → Settings → Access tokens |
| `POLAR_ORGANIZATION_ID` | Organization UUID — Polar → Settings → **Unique identifier for your organization** |
| `POLAR_ORGANIZATION_SLUG` | Organization slug — used in `https://polar.sh/{slug}/portal` (portal fallback) |
| `POLAR_WEBHOOK_SECRET` | **`polar_whs_…` exactly as shown in Polar → Webhooks → Signing secret** (do **not** add `whsec_`) |
| `POLAR_PRODUCT_ID_ANNUAL` | `9e185286-cf2b-41b8-a728-e7154d144722` |
| `POLAR_PRODUCT_ID_PRO_WEEKLY` | `8c9fddc9-1001-4143-8a27-31ce929ae5e6` |
| `POLAR_SUCCESS_URL` | `https://scanner.verifiedglam.com/app/face-beauty-analysis?checkout=success` |
| `POLAR_CANCEL_URL` | `https://scanner.verifiedglam.com/pricing?checkout=cancelled` |
| `POLAR_ENV` | **`production`** (exact string; anything else uses sandbox API) |

Optional (not recommended in Supabase — signed-in checkout uses API):

| Secret | Notes |
|--------|--------|
| `POLAR_CHECKOUT_LINK_ANNUAL` | Guest/marketing fallback only; `polar-create-checkout` prefers API when product IDs are set |
| `POLAR_CHECKOUT_LINK_PRO_WEEKLY` | Same |

Also keep: `OPENAI_API_KEY`, optional FCM keys.

**Webhook secret:** Paste `polar_whs_…` from Polar with no modifications. Wrong format (e.g. `whsec_polar_whs_…`) causes **403 Invalid signature** on every delivery. Sync via:

```powershell
.\scripts\set-polar-secrets.ps1
```

**Signed-in checkout:** `polar-create-checkout` uses **Polar API** (`polar.checkouts.create`) with `customerExternalId` = Supabase user UUID. Static checkout links are fallback only.

Deploy functions:

```powershell
.\scripts\deploy-functions.ps1
```

Apply database migration (if not done):

```powershell
supabase db push
```

## 2. Polar Dashboard (production org)

| Setting | Value |
|---------|--------|
| **Webhook URL** | `https://qmivgvctmxvpnbouqslj.supabase.co/functions/v1/polar-webhook` |
| **Webhook events** | **`subscription.active`**, `subscription.updated`, `subscription.canceled`, `subscription.revoked`, `order.created` |
| **Not sufficient alone** | `checkout.created` does **not** grant Pro or credits — you must enable `subscription.active` |
| **Customer portal** | Enable in Polar org settings — app opens per-session `portalUrl` from `polar-customer-portal` |
| **Checkout success (API)** | Set `POLAR_SUCCESS_URL` in Supabase secrets (see table above) |

If using optional static checkout links on the marketing site, set each link's Success URL in Polar Dashboard → Checkout Links to the same `POLAR_SUCCESS_URL` path.

## 3. Supabase Auth URL configuration

Dashboard → **Authentication → URL configuration**:

| Setting | Value |
|---------|--------|
| Site URL | `https://scanner.verifiedglam.com` |
| Redirect URLs | `https://scanner.verifiedglam.com/**`, `http://localhost:**` |

**Google OAuth** (if used): authorized JavaScript origin = `https://scanner.verifiedglam.com`; redirect URI = `https://qmivgvctmxvpnbouqslj.supabase.co/auth/v1/callback`.

## 4. Cloudflare (build-time only)

Workers & Pages → **verified-glam-scanner** → Settings → Environment variables → **Production**:

| Variable | Required |
|----------|----------|
| `SUPABASE_URL` | Yes — `https://qmivgvctmxvpnbouqslj.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes |
| `GOOGLE_WEB_CLIENT_ID` | If using Google sign-in |

Paste each as a **single line** (no line breaks).

Build: `bash scripts/cloudflare-build.sh`  
Output: `build/web`  
Deploy: `npx wrangler deploy` (if Workers UI requires it)

## 5. Smoke test

```powershell
.\scripts\test-polar-integration.ps1
node scripts/test-polar-webhook.mjs
```

Expect signed test POST → **202**. Unsigned POST → **403** (expected).

## 6. Production E2E (manual)

1. Sign in at `/login` on live site.
2. `/pricing` → Subscribe → Polar checkout → pay → land on `?checkout=success` → toast + Pro credits (200 yearly / 30 weekly).
3. Polar dashboard → webhook deliveries: **`subscription.active` → 202** (not only `checkout.created`).
4. Pro user → **Manage subscription** on `/pricing` or in-app profile → Polar portal → cancel → webhook updates status.
5. Run one scan → 5 credits deducted.

## User flows (implemented)

- **Checkout**: requires sign-in; unsigned users → `/register?plan=…` → after auth → `/pricing?plan=…` → auto-resume checkout via API.
- **Billing**: Pro users see **Manage subscription** on static `/pricing` and in Flutter profile; opens Polar customer portal in new tab.
- **Credits / Pro status**: Polar webhook is source of truth; static pricing polls `profiles.is_pro` after successful checkout.
