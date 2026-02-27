#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: std-clean-sweep skill → Step 3 (formatting)
# Purpose:  Auto-format files after each edit using the project's configured
#           formatter. Also tracks file edits in session state for stop hooks.
# ==============================================================================

input=$(cat)
conv_id=$(echo "$input" | jq -r '.conversation_id // empty')
file_path=$(echo "$input" | jq -r '.file_path // empty')
workspace=$(echo "$input" | jq -r '.workspace_roots[0] // empty')

# Track this edit in session state
if [ -n "$conv_id" ]; then
  state_dir="/tmp/ai-dev-hooks/$conv_id"
  mkdir -p "$state_dir"
  echo "$file_path" >> "$state_dir/edits.log"
fi

# Skip if file doesn't exist
[ -f "$file_path" ] || exit 0

# Auto-format based on file type using project-local tools when available
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.scss|*.html|*.json|*.md|*.yaml|*.yml)
    if [ -n "$workspace" ] && [ -x "$workspace/node_modules/.bin/prettier" ]; then
      "$workspace/node_modules/.bin/prettier" --write "$file_path" 2>/dev/null
    fi
    ;;
  *.py)
    if command -v ruff &>/dev/null; then
      ruff format --quiet "$file_path" 2>/dev/null
    elif command -v black &>/dev/null; then
      black --quiet "$file_path" 2>/dev/null
    fi
    ;;
  *.go)
    if command -v gofmt &>/dev/null; then
      gofmt -w "$file_path" 2>/dev/null
    fi
    ;;
  *.rs)
    if command -v rustfmt &>/dev/null; then
      rustfmt "$file_path" 2>/dev/null
    fi
    ;;
esac

exit 0
