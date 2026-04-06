#!/bin/bash
# ==============================================================================
# Manual / CI: full-repo check for CSS theme pipeline (skill css-tailwind-theme-pipeline).
# Usage: from repo root: bash .cursor/scripts/check-css-theme-pipeline.sh
# ==============================================================================

set -euo pipefail

repo_root=$(cd "$(dirname "$0")/../.." && pwd)
web_src="${repo_root}/apps/web/src"
fail=0

if [[ ! -d "$web_src" ]]; then
  echo "check-css-theme-pipeline: apps/web/src not found (run from towerai repo root)."
  exit 1
fi

echo "Checking apps/web for @towerai/ui/styles imports..."
if grep -rE "from ['\"]@towerai/ui/styles['\"]|import ['\"]@towerai/ui/styles['\"]" "$web_src" --include='*.ts' --include='*.tsx' --include='*.css' --include='*.js' --include='*.jsx' 2>/dev/null; then
  echo "FAIL: apps/web must not import @towerai/ui/styles (use apps/web/src/styles.css only)."
  fail=1
else
  echo "OK: no @towerai/ui/styles in apps/web/src."
fi

echo "Checking for a second @import tailwindcss in apps/web CSS (only styles.css allowed)..."
while IFS= read -r -d '' f; do
  if [[ "$f" == "${web_src}/styles.css" ]]; then
    continue
  fi
  if grep -qE "@import[[:space:]]+['\"]tailwindcss['\"]" "$f" 2>/dev/null; then
    echo "FAIL: second Tailwind entry in: $f"
    fail=1
  fi
done < <(find "$web_src" -name '*.css' -print0 2>/dev/null)

if [[ "$fail" -eq 0 ]]; then
  echo "OK: only expected Tailwind root (or no extra CSS entries)."
fi

exit "$fail"
