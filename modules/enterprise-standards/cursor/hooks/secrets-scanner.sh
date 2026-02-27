#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: 04-std-environment-config.mdc → Secrets Management
# Purpose:  Scan edits for patterns that look like hardcoded secrets.
#           Observational only — logs warnings to session state, does not block.
# ==============================================================================

input=$(cat)
conv_id=$(echo "$input" | jq -r '.conversation_id // empty')
file_path=$(echo "$input" | jq -r '.file_path // empty')

# Skip environment files — they are expected to contain secrets
case "$file_path" in
  *.env|*.env.*) exit 0 ;;
esac

# Extract new code from all edits
new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

# Scan for patterns that look like hardcoded secrets
if echo "$new_code" | grep -qiE \
  '(api[_-]?key|secret[_-]?key|password|access[_-]?token|private[_-]?key|client[_-]?secret)\s*[:=]\s*["'"'"'][A-Za-z0-9+/=_.:-]{8,}'; then
  if [ -n "$conv_id" ]; then
    state_dir="/tmp/ai-dev-hooks/$conv_id"
    mkdir -p "$state_dir"
    echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] POTENTIAL SECRET in $file_path" >> "$state_dir/warnings.log"
  fi
fi

exit 0
