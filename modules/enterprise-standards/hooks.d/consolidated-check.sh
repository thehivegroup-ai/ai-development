#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: Multiple rules (00, 03, 07, 08)
# Purpose:  Consolidated security and quality checks on file edits
#           Runs only critical checks; delegates non-urgent checks to CI/lint
# ==============================================================================

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty')

# Skip non-code files
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.py|*.go|*.rs|*.java|*.kt|*.rb|*.cs) ;;
  *.json|*.yaml|*.yml|*.env*) ;;
  *) echo '{}'; exit 0 ;;
esac

# Skip test/mock files for hygiene checks (but still scan for secrets/PHI)
is_test_file=false
case "$file_path" in
  *.test.*|*.spec.*|*__tests__*|*__mocks__*|**/fixtures/**|**/test-data/**|**/examples/**) 
    is_test_file=true
    ;;
esac

# Extract new code from edits
new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

issues=()

# =============================================================================
# CRITICAL: Secrets Detection (ALWAYS RUN)
# =============================================================================

# High-entropy strings (likely secrets)
if echo "$new_code" | grep -qE '["'"'"'][A-Za-z0-9+/=_-]{32,}["'"'"']'; then
  # Check if it's not a hash, UUID, or known safe pattern
  if ! echo "$new_code" | grep -qiE '(hash|uuid|id|checksum|example|placeholder|test[_-]?key)'; then
    issues+=("🚨 HIGH-ENTROPY STRING: Possible hardcoded secret (32+ chars)")
  fi
fi

# AWS keys
if echo "$new_code" | grep -qE '(AKIA[0-9A-Z]{16}|aws[_-]?secret[_-]?access[_-]?key)'; then
  issues+=("🚨 AWS ACCESS KEY detected")
fi

# API keys with known prefixes
if echo "$new_code" | grep -qE '(sk|pk)[_-](live|test|prod)[_-][A-Za-z0-9]{20,}'; then
  issues+=("🚨 API KEY with known prefix (sk/pk live/test/prod)")
fi

# Generic secret assignments
if echo "$new_code" | grep -qiE '(api[_-]?key|secret[_-]?key|private[_-]?key|password|token)["\'"'"']?\s*[:=]\s*["'"'"'][A-Za-z0-9+/=_.-]{16,}["'"'"']'; then
  if ! echo "$new_code" | grep -qiE '(process\.env|os\.getenv|System\.getenv|ENV\[|config\.|settings\.)'; then
    issues+=("🚨 SECRET ASSIGNMENT: Hardcoded secret (not from env)")
  fi
fi

# =============================================================================
# CRITICAL: PHI/PII Detection (ALWAYS RUN, except skip patterns)
# =============================================================================

# Skip PHI/PII checks for these files
case "$file_path" in
  **/hooks.d/phi-pii-scanner.sh|**/08-std-security-practices.mdc|**/security-review/**|**/docs/security/**) 
    # Skip PHI/PII checks for security documentation
    ;;
  *)
    # SSN patterns
    if echo "$new_code" | grep -qE '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b'; then
      issues+=("🚨 SSN PATTERN detected (XXX-XX-XXXX)")
    fi

    # Credit card patterns
    if echo "$new_code" | grep -qE '\b[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}\b'; then
      issues+=("🚨 CREDIT CARD PATTERN detected")
    fi

    # PHI in logs (critical)
    if echo "$new_code" | grep -qE '(console\.(log|info|warn|error)|logger\.(info|warn|error|debug)|print|println)'; then
      if echo "$new_code" | grep -qiE 'log.*(ssn|patient|medical|diagnosis|prescription|insurance.*number)'; then
        issues+=("🚨 PHI IN LOG STATEMENT")
      fi
    fi

    # Healthcare API keys
    if echo "$new_code" | grep -qiE '(patient[_-]?key|medical[_-]?api[_-]?key|hipaa[_-]?token)\s*[:=]\s*["'"'"'][A-Za-z0-9+/=_.:-]{20,}["'"'"']'; then
      issues+=("🚨 HEALTHCARE API KEY detected")
    fi
    ;;
esac

# =============================================================================
# IMPORTANT: Code Hygiene (SKIP for test files, lightweight checks)
# =============================================================================

if [ "$is_test_file" = false ]; then
  # Debug statements (common blocker)
  if echo "$new_code" | grep -qE '(console\.(log|debug)|debugger\b|print\(|pp |pprint\()'; then
    issues+=("⚠️ DEBUG STATEMENT: console.log/debugger/print (remove before commit)")
  fi

  # Untracked TODOs (should be in issues/plan)
  if echo "$new_code" | grep -qE '\b(TODO|FIXME|HACK|XXX)\b'; then
    issues+=("⚠️ TODO/FIXME marker (ensure tracked in plan or issue)")
  fi
fi

# =============================================================================
# OUTPUT
# =============================================================================

if [ ${#issues[@]} -gt 0 ]; then
  issue_list=$(printf '%s\n' "${issues[@]}" | sed 's/^/  - /')
  
  cat <<EOF
{
  "agent_message": "Security & Quality Check: ${file_path}\n\n${issue_list}\n\nCritical issues (🚨) must be fixed immediately.\nWarnings (⚠️) should be addressed before commit.\n\nReferences: 00-std-foundation, 07-evidence-based-claims, 08-std-security-practices"
}
EOF
else
  echo '{}'
fi

exit 0
