#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: engineering-hygiene skill → detects incomplete/debug code
# Purpose:  Detect debug artifacts, untracked TODOs, mock data, hardcoded values.
#           Agent-visible warnings for immediate remediation.
# ==============================================================================

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty')

# Skip test files, mocks, fixtures — debug output and mock data expected there
case "$file_path" in
  *.test.*|*.spec.*|*__tests__*|*__mocks__*|**/fixtures/**|**/test-data/**|**/examples/**) 
    echo '{}'
    exit 0 
    ;;
esac

# Skip non-code files
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.py|*.go|*.rs|*.java|*.kt|*.rb|*.cs) ;;
  *) echo '{}'; exit 0 ;;
esac

# Extract new code from edits
new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

# Detect issues
issues=()

# Debug artifacts (high severity)
if echo "$new_code" | grep -qE 'console\.(log|debug|info|warn)\('; then
  issues+=("console.log/debug/info/warn")
fi

if echo "$new_code" | grep -qE '\bdebugger\b'; then
  issues+=("debugger statement")
fi

if echo "$new_code" | grep -qiE 'print\(|println\(|fmt\.Println|puts |pp |pprint'; then
  issues+=("print statement")
fi

# Incomplete functionality markers (medium severity)
if echo "$new_code" | grep -qiE '\b(TODO|FIXME|HACK|XXX|TEMP|WIP)\b'; then
  issues+=("TODO/FIXME/HACK marker (ensure tracked in plan)")
fi

if echo "$new_code" | grep -qiE '(not implemented|coming soon|placeholder)'; then
  issues+=("incomplete implementation comment")
fi

# Mock/stub data in production code (medium severity)
if echo "$new_code" | grep -qiE '(mock|stub|fake|dummy)[_-]?(data|value|user|response)'; then
  issues+=("mock/stub data reference")
fi

# Hardcoded values that should be config (low severity)
if echo "$new_code" | grep -qE '(localhost|127\.0\.0\.1|0\.0\.0\.0):'; then
  issues+=("hardcoded localhost address")
fi

if echo "$new_code" | grep -qE 'https?://[a-z0-9.-]+(:[0-9]+)?/[^"'"'"']*["'"'"']' | grep -qvE '(example\.com|placeholder\.dev)'; then
  if ! echo "$new_code" | grep -qiE '(config|env|constant)'; then
    issues+=("hardcoded URL (should be config)")
  fi
fi

# Generate agent message if issues found
if [ ${#issues[@]} -gt 0 ]; then
  issue_list=$(printf '%s\n' "${issues[@]}" | sed 's/^/  - /' | paste -sd ' ' -)
  
  cat <<EOF
{
  "agent_message": "⚠️ Code hygiene: ${file_path} contains:\n${issue_list}\n\nDebug artifacts and incomplete markers should be removed before handoff. Mock data and hardcoded values should use configuration."
}
EOF
else
  echo '{}'
fi

exit 0
