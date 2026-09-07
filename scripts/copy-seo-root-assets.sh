#!/usr/bin/env bash
# Copy website/ SEO root files into build/web (and web/ before Flutter build).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-$ROOT/build/web}"

for f in sitemap.xml robots.txt llms.txt _headers; do
  src="$ROOT/website/$f"
  if [[ ! -f "$src" ]]; then
    echo "ERROR: Missing source $src" >&2
    exit 1
  fi
  mkdir -p "$TARGET"
  cp -f "$src" "$TARGET/$f"
done
