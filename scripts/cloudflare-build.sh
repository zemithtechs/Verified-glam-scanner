#!/usr/bin/env bash
# Cloudflare Pages build — installs Flutter, builds web with dart-defines.
# Required env: VG_API_URL (the Worker API — see worker-api/wrangler.toml)
# Optional env: GOOGLE_WEB_CLIENT_ID

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Git commit: $(git rev-parse HEAD 2>/dev/null || echo unknown)"
echo "==> Git branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"

# Cloudflare dashboard multiline fields sometimes inject CR/LF/tabs into values.
sanitize_env() {
  printf '%s' "${1:-}" | tr -d '\r\n\t'
}

VG_API_URL="$(sanitize_env "${VG_API_URL:-}")"
GOOGLE_WEB_CLIENT_ID="$(sanitize_env "${GOOGLE_WEB_CLIENT_ID:-}")"

if [[ -z "${VG_API_URL}" ]]; then
  echo "ERROR: Set VG_API_URL in Cloudflare Pages environment variables (e.g. https://verified-glam-api.<account>.workers.dev)." >&2
  exit 1
fi

# Production Cloudflare builds always use the live Worker API + real analysis.
VG_USE_CLOUD_BACKEND="true"
VG_USE_MOCK_ANALYSIS="false"

echo "==> Install Flutter stable"
FLUTTER_DIR="${HOME}/flutter"
if [[ ! -d "${FLUTTER_DIR}/bin" ]]; then
  git clone https://github.com/flutter/flutter.git -b stable --depth 1 "${FLUTTER_DIR}"
fi
export PATH="${FLUTTER_DIR}/bin:${PATH}"
flutter --version
flutter config --enable-web --no-analytics
flutter precache --web

echo "==> flutter pub get"
flutter pub get

echo "==> Seed web/ with SEO root assets (Flutter copies web/ into build/web)"
bash "${ROOT}/scripts/copy-seo-root-assets.sh" "${ROOT}/web"

echo "==> flutter build web (app shell only — main_web.dart)"
BUILD_ARGS=(
  build web
  --release
  --no-wasm-dry-run
  --no-tree-shake-icons
  -t lib/main_web.dart
  "--dart-define=VG_API_URL=${VG_API_URL}"
  "--dart-define=VG_USE_CLOUD_BACKEND=${VG_USE_CLOUD_BACKEND}"
  "--dart-define=VG_USE_MOCK_ANALYSIS=${VG_USE_MOCK_ANALYSIS}"
)
if [[ -n "${GOOGLE_WEB_CLIENT_ID}" ]]; then
  BUILD_ARGS+=("--dart-define=GOOGLE_WEB_CLIENT_ID=${GOOGLE_WEB_CLIENT_ID}")
fi
flutter "${BUILD_ARGS[@]}"

# Flutter copies web/ verbatim — web/serve.json must never reach Wrangler (error 100324).
rm -f "${ROOT}/build/web/_redirects" "${ROOT}/build/web/serve.json"

BOOTSTRAP="${ROOT}/build/web/flutter_bootstrap.js"
if [[ -f "${BOOTSTRAP}" ]]; then
  echo "==> Disable Flutter service worker (static hosting)"
  sed -i 's/serviceWorkerSettings: {[^}]*}/serviceWorkerSettings: null/g' "${BOOTSTRAP}" || \
    sed -i '' 's/serviceWorkerSettings: {[^}]*}/serviceWorkerSettings: null/g' "${BOOTSTRAP}" 2>/dev/null || true
fi

echo "==> Overlay static marketing pages"
bash "${ROOT}/scripts/sync-static-site.sh"

echo "==> Verify build output"
if [[ -f "build/web/_redirects" ]]; then
  echo "ERROR: build/web/_redirects must not be deployed — wrangler html_handling loops on clean-URL redirects." >&2
  exit 1
fi
if [[ -f "build/web/serve.json" ]]; then
  echo "ERROR: build/web/serve.json must not be deployed — wrangler converts redirects and triggers error 100324." >&2
  exit 1
fi
REQUIRED=(
  "build/web/index.html"
  "build/web/pricing/index.html"
  "build/web/about/index.html"
  "build/web/privacy/index.html"
  "build/web/terms/index.html"
  "build/web/login/index.html"
  "build/web/register/index.html"
  "build/web/tools/index.html"
  "build/web/face-beauty-analysis/index.html"
  "build/web/404.html"
  "build/web/flutter_bootstrap.js"
  "build/web/main.dart.js"
  "build/web/js/passkeys-bundle.js"
  "build/web/sitemap.xml"
  "build/web/robots.txt"
  "build/web/llms.txt"
)
for required in "${REQUIRED[@]}"; do
  if [[ ! -f "${required}" ]]; then
    echo "ERROR: Missing ${required} — build incomplete." >&2
    exit 1
  fi
done

# Marketing homepage must be static HTML (not the Flutter loader shell).
if grep -q 'flutter_bootstrap.js' build/web/index.html; then
  echo "ERROR: build/web/index.html is the Flutter shell — sync-static-site did not overlay marketing home." >&2
  exit 1
fi
if ! grep -q 'Verified Glam Scanner' build/web/index.html; then
  echo "ERROR: build/web/index.html missing marketing content." >&2
  exit 1
fi
if grep -q '__SUPABASE_URL__' build/web/js/auth-config.js 2>/dev/null; then
  echo "ERROR: build/web/js/auth-config.js still has __SUPABASE_URL__ placeholder." >&2
  exit 1
fi
if grep -q '__POLAR_CHECKOUT_LINK_ANNUAL__' build/web/js/auth-config.js 2>/dev/null; then
  echo "ERROR: build/web/js/auth-config.js missing POLAR_CHECKOUT_LINK_ANNUAL (set env or .env.example)." >&2
  exit 1
fi
MAIN_SIZE="$(wc -c < build/web/main.dart.js | tr -d ' ')"
echo "    main.dart.js size: ${MAIN_SIZE} bytes"
if [[ "${MAIN_SIZE}" -lt 100000 ]]; then
  echo "ERROR: main.dart.js looks too small — build may have failed silently." >&2
  exit 1
fi

echo "==> Final SEO root assets + sitemap validation"
bash "${ROOT}/scripts/copy-seo-root-assets.sh" "${ROOT}/build/web"
bash "${ROOT}/scripts/verify-sitemap.sh" "${ROOT}/build/web"

echo "==> Build complete: build/web/"
