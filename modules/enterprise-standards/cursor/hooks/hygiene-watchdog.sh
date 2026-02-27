#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: engineering-hygiene skill → Step 2 (debug artifacts)
# Purpose:  Detect when edits introduce debug artifacts (console.log, debugger,
#           TODO, etc.). Logs findings to session state for std-verifier review.
# ==============================================================================

input=$(cat)
conv_id=$(echo "$input" | jq -r '.conversation_id // empty')
file_path=$(echo "$input" | jq -r '.file_path // empty')

# Skip test files — debug output in tests is expected
case "$file_path" in
  *.test.*|*.spec.*|*__tests__*|*__mocks__*) exit 0 ;;
esac

# Skip non-code files
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.py|*.go|*.rs|*.java|*.kt|*.rb|*.cs) ;;
  *) exit 0 ;;
esac

# Extract new code from edits
new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

# Check for debug artifacts
issues=""

if echo "$new_code" | grep -qE 'console\.(log|debug)\('; then
  issues="${issues}console.log/debug, "
fi

if echo "$new_code" | grep -q 'debugger'; then
  issues="${issues}debugger statement, "
fi

if echo "$new_code" | grep -qiE '\b(TODO|FIXME|HACK|XXX)\b'; then
  issues="${issues}TODO/FIXME marker, "
fi

# Log findings to session state
if [ -n "$issues" ] && [ -n "$conv_id" ]; then
  state_dir="/tmp/ai-dev-hooks/$conv_id"
  mkdir -p "$state_dir"
  issues="${issues%, }"
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $file_path — $issues" >> "$state_dir/hygiene.log"
fi

exit 0
