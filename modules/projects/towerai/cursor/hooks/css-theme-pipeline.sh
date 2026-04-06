#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: skill css-tailwind-theme-pipeline (TowerAI module)
# Purpose:  Warn when edits reintroduce a second Tailwind entry or
#           import @towerai/ui/styles in apps/web (duplicate @theme).
# ==============================================================================

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty')

case "$file_path" in
  **/hooks/css-theme-pipeline.sh|**/check-css-theme-pipeline.sh|**/css-tailwind-theme-pipeline/SKILL.md)
    echo '{}'
    exit 0
    ;;
esac

case "$file_path" in
  *apps/web/src/*) ;;
  *)
    echo '{}'
    exit 0
    ;;
esac

case "$file_path" in
  *.ts|*.tsx|*.css) ;;
  *)
    echo '{}'
    exit 0
    ;;
esac

new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

issues=()

if echo "$new_code" | grep -qF '@towerai/ui/styles'; then
  issues+=("Do not import @towerai/ui/styles in apps/web. Tokens load from apps/web/src/styles.css → styles/theme.css (see skill css-tailwind-theme-pipeline). Remove CLI-injected imports or use the root stylesheet only.")
fi

if [[ "$file_path" != *'apps/web/src/styles.css'* ]]; then
  if echo "$new_code" | grep -qE "@import[[:space:]]+['\"]tailwindcss['\"]"; then
    issues+=("Only apps/web/src/styles.css may @import tailwindcss. Extend the root stylesheet or add @imports there.")
  fi
fi

if [ ${#issues[@]} -gt 0 ]; then
  issue_list=$(printf '%s\n' "${issues[@]}" | sed 's/^/  - /')
  cat <<EOF
{
  "agent_message": "CSS / Tailwind pipeline: ${file_path}\n\n${issue_list}\n\nSee .cursor/skills/css-tailwind-theme-pipeline/SKILL.md"
}
EOF
else
  echo '{}'
fi

exit 0
