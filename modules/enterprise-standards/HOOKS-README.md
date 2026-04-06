# Hook Configuration Options

The enterprise-standards module provides two hook configuration options:

## Option 1: Comprehensive (hooks.json - default)

**File:** `hooks.json`

**afterFileEdit hooks:** 4 separate scripts
- `auto-format.sh` - Auto-format with prettier/black/gofmt
- `secrets-scanner.sh` - Scan for hardcoded secrets
- `phi-pii-scanner.sh` - Scan for PHI/PII patterns
- `hygiene-watchdog.sh` - Check debug code, TODOs, hardcoded values

**Pros:**
- Very thorough, catches more edge cases
- Separate concerns (one script per category)
- Detailed pattern matching

**Cons:**
- 4 shell processes per edit (latency)
- Can be noisy during active development
- Some overlap with editor linting and CI

**Best for:**
- Regulated environments (HIPAA, GDPR)
- Teams new to security practices
- Projects with PHI/PII handling

---

## Option 2: Consolidated (hooks.consolidated.json)

**File:** `hooks.consolidated.json`

**afterFileEdit hooks:** 1 consolidated script
- `consolidated-check.sh` - Critical security + lightweight hygiene

**What it checks:**
- 🚨 CRITICAL: Hardcoded secrets (high-entropy, API keys, AWS keys)
- 🚨 CRITICAL: PHI/PII patterns (SSN, credit cards, PHI in logs, healthcare API keys)
- ⚠️ IMPORTANT: Debug statements (console.log, debugger)
- ⚠️ IMPORTANT: Untracked TODOs

**Skips:**
- Auto-formatting (rely on editor format-on-save)
- Lightweight hygiene checks (rely on linter)
- Test files (for hygiene only, still scans secrets/PHI)

**Pros:**
- Single shell process per edit (faster)
- Focuses on critical security issues
- Less noisy during development
- Better separation of concerns (hooks = security, editor/CI = style)

**Cons:**
- Slightly less thorough pattern matching
- No auto-formatting

**Best for:**
- General development environments
- Teams with mature linting/CI pipelines
- Projects where editor format-on-save is configured

---

## Installation

### Use Comprehensive (default)
```bash
# Installs as hooks.json (default)
# No changes needed
```

### Switch to Consolidated
```bash
cd .cursor/
cp hooks.consolidated.json hooks.json
# Or symlink if you want to track changes
```

---

## Customization

Both configurations support:
- `sessionStart`: Session initialization with stack profile injection
- `beforeShellExecution`: Git command guard (blocks git writes)
- `afterFileEdit`: Security and quality checks

You can:
1. Edit timeout values in hooks.json
2. Add/remove specific checks in hook scripts
3. Adjust pattern matching sensitivity
4. Add custom hooks for your workflow

---

## Performance Comparison

| Configuration | Shell processes per edit | Avg latency | Noise level |
|---------------|-------------------------|-------------|-------------|
| Comprehensive | 4 | ~800ms | High during dev |
| Consolidated | 1 | ~200ms | Medium |
| None | 0 | 0ms | Zero (rely on CI) |

---

## Recommendation

- **Start with comprehensive** during first sprint to train team on security patterns
- **Switch to consolidated** once team is familiar with patterns
- **Disable entirely** if hooks feel intrusive and CI catches issues reliably

The goal is **fast feedback without blocking flow**.
