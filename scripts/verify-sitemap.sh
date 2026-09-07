#!/usr/bin/env bash
# Validate build/web/sitemap.xml — must be real XML, not the Flutter 404 shell.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="${1:-$ROOT/build/web}"
SITEMAP="$BUILD/sitemap.xml"

if [[ ! -f "$SITEMAP" ]]; then
  echo "ERROR: Missing $SITEMAP" >&2
  exit 1
fi

if grep -qE 'flutter_bootstrap|<html|<!DOCTYPE|404\.html' "$SITEMAP"; then
  echo "ERROR: sitemap.xml contains HTML/Flutter content — crawlers would get wrong file." >&2
  exit 1
fi

if ! head -1 "$SITEMAP" | grep -q '<?xml'; then
  echo "ERROR: sitemap.xml missing XML declaration." >&2
  exit 1
fi

if ! grep -q '<urlset' "$SITEMAP"; then
  echo "ERROR: sitemap.xml missing <urlset> root element." >&2
  exit 1
fi

if ! grep -q 'scanner.verifiedglam.com' "$SITEMAP"; then
  echo "ERROR: sitemap.xml URLs must use production host scanner.verifiedglam.com." >&2
  exit 1
fi

missing=0
while IFS= read -r loc; do
  path="${loc#https://scanner.verifiedglam.com}"
  path="${path#/}"
  if [[ -z "$path" ]]; then
    rel="index.html"
  else
    rel="${path}/index.html"
  fi
  if [[ ! -f "$BUILD/$rel" ]]; then
    echo "ERROR: sitemap lists $loc but missing $BUILD/$rel" >&2
    missing=1
  fi
done < <(grep '<loc>' "$SITEMAP" | sed -n 's|.*<loc>\([^<]*\)</loc>.*|\1|p')

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

if [[ -f "$BUILD/robots.txt" ]] && ! grep -q 'Sitemap: https://scanner.verifiedglam.com/sitemap.xml' "$BUILD/robots.txt"; then
  echo "ERROR: robots.txt must reference https://scanner.verifiedglam.com/sitemap.xml" >&2
  exit 1
fi

echo "    sitemap.xml OK ($(grep -c '<loc>' "$SITEMAP") URLs, $(wc -c < "$SITEMAP" | tr -d ' ') bytes)"
