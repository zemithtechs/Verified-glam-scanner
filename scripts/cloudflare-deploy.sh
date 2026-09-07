#!/usr/bin/env bash
# Run after cloudflare-build.sh — strip redirect files wrangler rejects, then deploy.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="${ROOT}/build/web"

if [[ ! -d "${BUILD}" ]]; then
  echo "ERROR: Missing build/web — run bash scripts/cloudflare-build.sh first." >&2
  exit 1
fi

rm -f "${BUILD}/_redirects" "${BUILD}/serve.json"

if [[ -f "${BUILD}/_redirects" || -f "${BUILD}/serve.json" ]]; then
  echo "ERROR: build/web still has redirect config (_redirects or serve.json)." >&2
  exit 1
fi

echo "==> Pre-deploy check"
echo "    Git: $(git -C "${ROOT}" rev-parse --short HEAD 2>/dev/null || echo unknown)"
echo "    Asset files: $(find "${BUILD}" -type f | wc -l | tr -d ' ')"
bash "${ROOT}/scripts/verify-sitemap.sh" "${BUILD}"
if find "${BUILD}" -maxdepth 1 -name '_redirects' -o -name 'serve.json' | grep -q .; then
  echo "ERROR: redirect files found in build/web root." >&2
  exit 1
fi

echo "==> npx wrangler deploy"
cd "${ROOT}"
exec npx wrangler deploy
