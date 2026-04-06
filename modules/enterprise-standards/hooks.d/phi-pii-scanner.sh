#!/bin/bash
# ==============================================================================
# Hook:     afterFileEdit
# Enhances: 08-std-security-practices.mdc → PHI/PII Detection
# Purpose:  Scan edits for PHI/PII patterns in code, logs, test fixtures.
#           Agent-visible warnings for immediate remediation.
# ==============================================================================

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty')

# Skip explicitly allowed files (e.g., this hook itself, documentation explaining patterns)
case "$file_path" in
  **/hooks/phi-pii-scanner.sh|**/08-std-security-practices.mdc|**/security-review/**) 
    echo '{}'
    exit 0
    ;;
esac

# Extract new code from edits
new_code=$(echo "$input" | jq -r '[.edits[].new_string // empty] | join("\n")' 2>/dev/null)

# Detect PHI/PII patterns
issues=()

# === PHI Patterns (High Severity) ===

# Social Security Numbers (US)
if echo "$new_code" | grep -qE '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b'; then
  issues+=("🚨 SSN pattern detected (XXX-XX-XXXX)")
fi

# Medical identifiers
if echo "$new_code" | grep -qiE '\b(diagnosis|prescription|medical[_-]?record|patient[_-]?id[^a-zA-Z]|health[_-]?record)\s*[:=]'; then
  # Check if it's a type definition or actual data
  if ! echo "$new_code" | grep -qE '(interface|type|class|schema)'; then
    issues+=("⚠️ Possible PHI: medical/health data reference")
  fi
fi

# Health insurance numbers
if echo "$new_code" | grep -qiE '(insurance[_-]?number|policy[_-]?number|member[_-]?id)\s*[:=]\s*["'"'"'][A-Z0-9]{6,}["'"'"']'; then
  issues+=("🚨 Insurance/policy number pattern detected")
fi

# Biometric data references
if echo "$new_code" | grep -qiE '\b(fingerprint|retina|biometric|dna|genetic)\s*[:=]'; then
  if ! echo "$new_code" | grep -qE '(interface|type|class|schema)'; then
    issues+=("⚠️ Possible PHI: biometric data reference")
  fi
fi

# === PII Patterns (Medium Severity) ===

# Email addresses (not in imports, not example.com/test.com)
if echo "$new_code" | grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' | grep -qvE '(from |import |@example\.com|@test\.com|@placeholder\.)'; then
  # Check if it's in a test fixture or example
  if ! echo "$file_path" | grep -qE '(test|spec|fixture|example|mock)'; then
    issues+=("⚠️ Real email address detected (not example.com)")
  fi
fi

# Phone numbers (US format)
if echo "$new_code" | grep -qE '\b(\+?1[-.]?)?\(?[0-9]{3}\)?[-.]?[0-9]{3}[-.]?[0-9]{4}\b'; then
  # Check if it's not a placeholder (e.g., 555-0100 through 555-0199 are reserved)
  if ! echo "$new_code" | grep -qE '555-01[0-9]{2}'; then
    issues+=("⚠️ Phone number pattern detected")
  fi
fi

# Credit card patterns (basic check)
if echo "$new_code" | grep -qE '\b[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}\b'; then
  issues+=("🚨 Credit card number pattern detected")
fi

# Physical addresses (basic check for street patterns)
if echo "$new_code" | grep -qiE '\b[0-9]+\s+(north|south|east|west|n|s|e|w)?\s*[a-z]+\s+(street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct)\b'; then
  if ! echo "$file_path" | grep -qE '(test|spec|fixture|example|mock)'; then
    issues+=("⚠️ Physical address pattern detected")
  fi
fi

# IP addresses (can be PII under GDPR)
if echo "$new_code" | grep -qE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b'; then
  # Ignore localhost, private ranges, example ranges
  if ! echo "$new_code" | grep -qE '(127\.0\.0\.1|localhost|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|\<0\.0\.0\.0\>)'; then
    # Check if it's a config value or hardcoded
    if ! echo "$new_code" | grep -qiE '(config|env|constant|ALLOWED|WHITELIST)'; then
      issues+=("⚠️ IP address detected (can be PII under GDPR)")
    fi
  fi
fi

# Names in structured data (high confidence: firstName, lastName, fullName)
if echo "$new_code" | grep -qE '(firstName|lastName|fullName|given[_-]?name|family[_-]?name)\s*:\s*["'"'"'][A-Z][a-z]+\s*[A-Z]?[a-z]*["'"'"']'; then
  # Check if it's in a test file
  if ! echo "$file_path" | grep -qE '(test|spec|fixture|example|mock)'; then
    issues+=("⚠️ Possible PII: name data in code (firstName/lastName)")
  fi
fi

# Date of birth patterns
if echo "$new_code" | grep -qiE '(birth[_-]?date|dob|date[_-]?of[_-]?birth)\s*[:=]\s*["'"'"'][0-9]{4}-[0-9]{2}-[0-9]{2}["'"'"']'; then
  issues+=("⚠️ Date of birth pattern detected")
fi

# === PII in Logs (High Severity) ===

# Logging statements with PII keywords
if echo "$new_code" | grep -qE '(console\.(log|info|warn|error)|logger\.(info|warn|error|debug)|print|println|fmt\.Println|puts)'; then
  # Check if log contains PII keywords
  if echo "$new_code" | grep -qiE 'log.*\$\{.*(email|phone|ssn|name|address|user[_-]?name|password|token|credit[_-]?card)'; then
    issues+=("🚨 Logging statement may contain PII/PHI")
  fi
  
  # Check for patient/medical keywords
  if echo "$new_code" | grep -qiE 'log.*(patient|medical|diagnosis|prescription|health)'; then
    issues+=("🚨 Logging statement may contain PHI")
  fi
fi

# === Secrets (recheck with security context) ===

# Known secret patterns in PHI/PII context
if echo "$new_code" | grep -qiE '(patient[_-]?key|medical[_-]?api[_-]?key|hipaa[_-]?token)\s*[:=]\s*["'"'"'][A-Za-z0-9+/=_.:-]{20,}["'"'"']'; then
  issues+=("🚨 Healthcare/medical API key or token detected in code")
fi

# Generate agent message if issues found
if [ ${#issues[@]} -gt 0 ]; then
  issue_list=$(printf '%s\n' "${issues[@]}" | sed 's/^/  - /')
  
  cat <<EOF
{
  "agent_message": "🚨 SECURITY: PHI/PII detected in ${file_path}:\n\n${issue_list}\n\nPER 08-std-security-practices.mdc:\n- PHI/PII must NEVER appear in code, logs, or test fixtures\n- Use synthetic data (test-patient-001, user@example.com)\n- Use IDs instead of names in logs\n- See rule for compliant patterns"
}
EOF
else
  echo '{}'
fi

exit 0
