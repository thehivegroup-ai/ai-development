# Manual Scripts

Scripts that can be invoked manually for additional checks.

---

## `check-css-theme-pipeline.sh`

**Purpose:** Enforce **rule 27** — single Tailwind global entry and no `@towerai/ui/styles` in `apps/web`.

**Usage:**

```bash
pnpm run check:css-pipeline
# or
bash .cursor/scripts/check-css-theme-pipeline.sh
```

**Checks:**

1. No `import '@towerai/ui/styles'` (or `from '@towerai/ui/styles'`) under `apps/web/src`.
2. No `@import 'tailwindcss'` in any `apps/web/src/**/*.css` except `apps/web/src/styles.css`.

**Cursor:** The same rules are surfaced on edit via `.cursor/hooks/css-theme-pipeline.sh` (`afterFileEdit` in `hooks.json`).

---

## `security-audit.sh`

**Purpose:** Comprehensive security audit for pre-commit or pre-release checks.

**Usage:**

```bash
cd /path/to/towerai
.cursor/scripts/security-audit.sh
```

**Checks Performed:**

1. **Dependency Vulnerabilities**
   - npm audit (Node.js)
   - safety check (Python)

2. **Secret Scanning**
   - API keys (OpenAI, GitHub, AWS, Slack)
   - Private keys
   - AWS credentials

3. **PHI/PII Detection**
   - SSN patterns
   - Credit card numbers
   - Real email addresses

4. **Authentication Checks**
   - New endpoints without auth

5. **Insecure Patterns**
   - SQL injection risks
   - XSS vulnerabilities (dangerouslySetInnerHTML, eval)
   - Disabled security features

6. **Environment Files**
   - Detects staged .env files

7. **Test Coverage**
   - Auth/security files without tests

**When to Run:**

- ✅ Before major releases
- ✅ Before security reviews
- ✅ Manual pre-commit checks
- ✅ CI/CD pipeline integration

**Exit Codes:**

- `0` - All checks passed
- `1` - Critical issues detected

**Note:** This script was originally designed as a `beforeCommit` hook, but Cursor doesn't support that event type. It's been moved here for manual invocation.

---

## Why Manual Scripts?

Some checks are too expensive or disruptive to run on every file edit:

- Dependency audits (slow, network calls)
- Comprehensive security scans
- Test coverage analysis

Manual scripts give you control over when these checks run.
