#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: 04-std-environment-config.mdc → Secrets Management
# Purpose:  Scan edits for patterns that look like hardcoded secrets.
#           Agent-visible warnings for immediate remediation.
# ==============================================================================

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty')

# Skip environment files, test fixtures, and example files
case "$file_path" in
  *.env|*.env.*|*.example.*|**/test/**|**/tests/**|**/__tests__/**|**/__mocks__/**|**/fixtures/**) 
    echo '{}' 
    exit 0 
    ;;
esac

# Extract new code from all edits
new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

# Improved secret detection patterns
detected=""

# Known secret prefixes (high confidence)
if echo "$new_code" | grep -qE '["'"'"'](sk-[A-Za-z0-9]{40,}|ghp_[A-Za-z0-9]{36,}|AKIA[A-Z0-9]{16}|xox[baprs]-[A-Za-z0-9-]{10,})["'"'"']'; then
  detected="HIGH_CONFIDENCE"
fi

# Generic secret patterns (medium confidence) - only if not already detected
if [ -z "$detected" ]; then
  if echo "$new_code" | grep -qiE '(api[_-]?key|secret[_-]?key|password|access[_-]?token|private[_-]?key|client[_-]?secret)\s*[:=]\s*["'"'"'][A-Za-z0-9+/=_.:-]{20,}["'"'"']'; then
    # Check for high entropy (not just "placeholder" or "test-key")
    if ! echo "$new_code" | grep -qiE '(placeholder|example|test|sample|dummy|your[_-]?key|your[_-]?secret)'; then
      detected="MEDIUM_CONFIDENCE"
    fi
  fi
fi

# If secret detected, make agent aware immediately
if [ -n "$detected" ]; then
  severity="⚠️"
  [ "$detected" = "HIGH_CONFIDENCE" ] && severity="🚨"
  
  cat <<EOF
{
  "agent_message": "${severity} Potential hardcoded secret detected in ${file_path}. Secrets must use environment variables or secure credential management. Please review and move to .env or secret store."
}
EOF
else
  echo '{}'
fi

exit 0
