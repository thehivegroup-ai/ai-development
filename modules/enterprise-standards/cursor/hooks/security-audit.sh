#!/bin/bash
# ==============================================================================
# Hook:     beforeCommit (proposed new event)
# Enhances: 08-std-security-practices.mdc → Pre-commit Security Audit
# Purpose:  Run security checklist before code is committed.
#           Blocks commit if critical security issues detected.
# ==============================================================================

# This hook would need to be registered as a "beforeCommit" event
# For now, we'll structure it to be manually invoked or integrated later

echo "Running security audit..."

# Get list of staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null)

if [ -z "$staged_files" ]; then
  echo '{"status": "skipped", "reason": "No staged files"}'
  exit 0
fi

critical_issues=()
warnings=()

# === 1. Dependency Vulnerability Scan ===
echo "→ Checking for dependency vulnerabilities..."

if [ -f "package.json" ]; then
  audit_output=$(npm audit --audit-level=moderate 2>&1 || true)
  
  if echo "$audit_output" | grep -q "critical"; then
    critical_issues+=("Critical npm vulnerabilities detected. Run 'npm audit' to review.")
  elif echo "$audit_output" | grep -q "high"; then
    warnings+=("High severity npm vulnerabilities detected. Run 'npm audit' to review.")
  fi
fi

if [ -f "requirements.txt" ]; then
  if command -v safety &> /dev/null; then
    safety_output=$(safety check --json 2>&1 || true)
    if echo "$safety_output" | grep -q '"vulnerabilities".*\['; then
      critical_issues+=("Python dependency vulnerabilities detected. Run 'safety check' to review.")
    fi
  else
    warnings+=("safety not installed. Cannot check Python dependencies. Install: pip install safety")
  fi
fi

# === 2. Secret Scanning (comprehensive) ===
echo "→ Scanning for secrets in staged files..."

for file in $staged_files; do
  if [ -f "$file" ]; then
    content=$(cat "$file")
    
    # High-confidence secret patterns
    if echo "$content" | grep -qE '["'"'"'](sk-[A-Za-z0-9]{40,}|ghp_[A-Za-z0-9]{36,}|AKIA[A-Z0-9]{16}|xox[baprs]-[A-Za-z0-9-]{10,})["'"'"']'; then
      critical_issues+=("High-confidence secret detected in $file")
    fi
    
    # AWS credentials
    if echo "$content" | grep -qE 'AKIA[0-9A-Z]{16}'; then
      critical_issues+=("AWS access key detected in $file")
    fi
    
    # Private keys
    if echo "$content" | grep -q "BEGIN PRIVATE KEY"; then
      critical_issues+=("Private key detected in $file")
    fi
  fi
done

# === 3. PHI/PII Patterns ===
echo "→ Checking for PHI/PII patterns..."

for file in $staged_files; do
  if [ -f "$file" ]; then
    content=$(cat "$file")
    
    # Skip test files and documentation
    case "$file" in
      *.test.*|*.spec.*|**/test/**|**/docs/**|**/*.md) continue ;;
    esac
    
    # SSN patterns
    if echo "$content" | grep -qE '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b'; then
      critical_issues+=("SSN pattern detected in $file")
    fi
    
    # Credit card patterns
    if echo "$content" | grep -qE '\b[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}[-\s]?[0-9]{4}\b'; then
      critical_issues+=("Credit card pattern detected in $file")
    fi
    
    # Real email addresses (not example.com)
    if echo "$content" | grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' | grep -qvE '(@example\.com|@test\.com|@placeholder\.)'; then
      warnings+=("Real email address detected in $file (use example.com for tests)")
    fi
  fi
done

# === 4. Authentication/Authorization Checks ===
echo "→ Checking authentication patterns..."

for file in $staged_files; do
  if [ -f "$file" ]; then
    content=$(cat "$file")
    
    # Check for new endpoints without auth checks
    if echo "$content" | grep -qE '(app\.(get|post|put|delete|patch)|router\.(get|post|put|delete|patch)|@(Get|Post|Put|Delete|Patch))'; then
      # Look for auth middleware or checks
      if ! echo "$content" | grep -qE '(auth|authenticate|authorize|requireAuth|@Auth|@Authorized|isAuthenticated)'; then
        warnings+=("New endpoint in $file may lack authentication. Verify auth is implemented.")
      fi
    fi
  fi
done

# === 5. Insecure Patterns ===
echo "→ Checking for insecure patterns..."

for file in $staged_files; do
  if [ -f "$file" ]; then
    content=$(cat "$file")
    
    # SQL injection risks
    if echo "$content" | grep -qE 'query\([^)]*\$\{|SELECT.*\$\{|INSERT.*\$\{|UPDATE.*\$\{|DELETE.*\$\{'; then
      critical_issues+=("Possible SQL injection in $file (use parameterized queries)")
    fi
    
    # Dangerous HTML rendering
    if echo "$content" | grep -qE 'dangerouslySetInnerHTML|innerHTML\s*=|eval\('; then
      warnings+=("Potentially dangerous HTML/JS in $file (XSS risk)")
    fi
    
    # Disabled security features
    if echo "$content" | grep -qiE '(disable.*security|no.*verify|skip.*validation|allow.*all)'; then
      warnings+=("Disabled security feature in $file. Review if intentional.")
    fi
  fi
done

# === 6. Environment Variables Check ===
echo "→ Checking environment configuration..."

if echo "$staged_files" | grep -q "\.env$"; then
  critical_issues+=(".env file in staged files. NEVER commit .env files. Use .env.example instead.")
fi

# === 7. Test Coverage for Security-Critical Code ===
echo "→ Checking test coverage for auth/security changes..."

auth_files=$(echo "$staged_files" | grep -E '(auth|security|permission|authorization)' | grep -v test || true)
if [ -n "$auth_files" ]; then
  for auth_file in $auth_files; do
    # Check if corresponding test file exists
    test_file=$(echo "$auth_file" | sed 's/\.\([^.]*\)$/.test.\1/')
    if [ ! -f "$test_file" ]; then
      test_file=$(echo "$auth_file" | sed 's/\.\([^.]*\)$/.spec.\1/')
      if [ ! -f "$test_file" ]; then
        warnings+=("Security-critical file $auth_file has no test file. Tests required for auth/security code.")
      fi
    fi
  done
fi

# === Results ===

if [ ${#critical_issues[@]} -gt 0 ]; then
  echo ""
  echo "❌ CRITICAL SECURITY ISSUES DETECTED:"
  printf '%s\n' "${critical_issues[@]}" | sed 's/^/  ❌ /'
  echo ""
  echo "Commit blocked. Fix critical issues before committing."
  
  if [ ${#warnings[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  WARNINGS:"
    printf '%s\n' "${warnings[@]}" | sed 's/^/  ⚠️  /'
  fi
  
  exit 1
fi

if [ ${#warnings[@]} -gt 0 ]; then
  echo ""
  echo "⚠️  SECURITY WARNINGS:"
  printf '%s\n' "${warnings[@]}" | sed 's/^/  ⚠️  /'
  echo ""
  echo "Review warnings before committing. Proceeding..."
fi

echo ""
echo "✅ Security audit passed"
exit 0
