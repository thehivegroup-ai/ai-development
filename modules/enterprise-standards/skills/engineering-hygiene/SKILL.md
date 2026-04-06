---
name: engineering-hygiene
version: 1.0.0
description: >
  Ensure quality, testing, and cleanup before handoff or release. Use when finishing 
  implementation, preparing for code review, fixing failing tests or linting errors, 
  or before declaring work complete.

  Trigger when user mentions: ready for review, clean up the code, fix lint errors, 
  remove debug code, run tests, check quality, or says "I'm done" or "this is complete" 
  or asks to verify everything works before committing.
---

# Engineering Hygiene

**This skill operationalizes quality gates for clean, testable, production-ready code.**

---

## When to Use

- After implementing changes (before claiming "done")
- Before declaring work ready for code review or release
- When tests or linting are failing
- Before committing changes to version control
- During CLEAN-SWEEP mode workflow

**Not for:**

- Architecture review (use app-review)
- Security-specific review (use security-review)
- Design evaluation (use heuristic-design-review)

---

## Token Optimization

**For large codebases with many files to check:**

**Launch `std-verifier` agent:**

```
"Run engineering hygiene checks across codebase.
Check for: debug code, dead code, lint errors, type errors, test failures, security issues.
Report findings with file locations."
```

**Token savings:** 10-30K tokens (comprehensive scans in isolated context)

**For focused work:** Use the checklist below in main conversation.

---

## The Quality Gate System

### Design Goal

Turn code quality from subjective judgment into **objective, verifiable checkpoints**:

- **Clean code** – No debug artifacts, dead code, or TODOs
- **Passing tests** – All tests green, coverage maintained
- **No regressions** – Existing functionality preserved
- **Security checked** – No obvious vulnerabilities introduced
- **Performance validated** – No obvious performance degradation

This prevents:

- "It works on my machine" failures
- Debug code leaking to production
- Breaking existing functionality
- Accumulating technical debt
- Security vulnerabilities in new code

---

## Parallel Execution Strategy

**All hygiene checks are independent and should run in parallel using Bazel targets:**

```
Quality Checks (PARALLEL - Run all concurrently)
┌──────────────────────────────────────────────┐
│ Check 1: ESLint (bazel test //apps/web:lint) │
│ Check 2: Prettier (bazel test //:format_check) │
│ Check 3: Tests (bazel test //apps/web:test) │
│ Check 4: Build (bazel build //apps/web:build) │
│ Check 5: API Lint (bazel test //apps/api:lint) │
│ Check 6: API Tests (bazel test //apps/api:test) │
│ Check 7: Debug artifacts (rg console.log)   │
└──────────────────┬───────────────────────────┘
                   ↓
         Parse Results & Generate Report
```

**Bazel targets available:**
- `//apps/web:lint` - ESLint check for web app
- `//apps/api:lint` - ESLint check for API
- `//:lint` - ESLint check for root config
- `//:format_check` - Prettier format check (all files)
- `//apps/web:test` - Vitest tests for web app
- `//apps/api:test` - Vitest tests for API
- `//apps/web:build` - Vite build for web app
- `//apps/api:build` - NestJS build for API

**Implementation:**
Launch all checks in parallel (single message, multiple shell commands).

**Time savings:** 50-60% faster than running sequentially.

**Output handling:**
- Bazel test output includes pass/fail status
- Capture stdout/stderr for all checks
- Parse and categorize issues by severity

---

---

## Pre-Flight: Validate Bazel Setup

Before running hygiene checks, verify Bazel targets are available:

```bash
# List available test targets
bazel query "kind('.*_test', //apps/...)"

# Expected output:
# //apps/web:lint
# //apps/web:test
# //apps/api:lint
# //apps/api:test
# //:format_check
```

**If Bazel targets are missing:**
- Check `BUILD.bazel` files exist in `apps/web/` and `apps/api/`
- Run `bazel sync` to refresh workspace
- Verify npm packages are linked: `bazel run @npm//:sync`

---

## Quality Check Commands

### Run All Checks in Parallel

**Execute all hygiene checks concurrently:**

```bash
# Parallel execution (launch all in single message, multiple Shell calls)
bazel test //apps/web:lint      # Web ESLint
bazel test //apps/api:lint      # API ESLint
bazel test //:format_check      # Prettier format check
bazel test //apps/web:test      # Web tests
bazel test //apps/api:test      # API tests
bazel build //apps/web:build    # Web build
bazel build //apps/api:build    # API build
```

**Bazel advantages:**
- ✅ Incremental builds (only changed files)
- ✅ Cached results (skip if nothing changed)
- ✅ Hermetic execution (consistent across machines)
- ✅ Parallel execution by default

### Run Selective Checks

**For focused work, run only relevant targets:**

```bash
# Web app only
bazel test //apps/web:lint //apps/web:test
bazel build //apps/web:build

# API only
bazel test //apps/api:lint //apps/api:test
bazel build //apps/api:build

# Formatting only
bazel test //:format_check
```

### Auto-Fix Issues

**ESLint auto-fix (run in workspace, not via Bazel):**

```bash
# Web app
cd apps/web && npx eslint src/ --fix

# API
cd apps/api && npx eslint src/ test/ --fix
```

**Prettier auto-format:**

```bash
# Format all files
npx prettier --write .
```

**Note:** Auto-fix commands run outside Bazel for faster iteration. Re-run Bazel tests after fixes to verify.

---

## Cleanup Checklist

### 1. Remove Debug Artifacts

**Check for:**

- [ ] `console.log`, `console.debug`, `print()` statements
- [ ] Commented-out code blocks
- [ ] Temporary test data or mock values
- [ ] Debug breakpoints in code
- [ ] Hardcoded API keys or credentials
- [ ] TODO/FIXME comments without issues filed

**Commands:**

```bash
# Find console.log statements (web app)
rg "console\.(log|debug|warn)" apps/web/src --type ts --type tsx

# Find console.log statements (API)
rg "console\.(log|debug|warn)" apps/api/src --type ts

# Find commented code (manual review needed)
rg "^\s*//.*\{" apps/web/src apps/api/src --type ts --type tsx

# Find TODO comments
rg "(TODO|FIXME|HACK|XXX)" apps/ packages/ --type ts --type tsx
```

**Examples:**

❌ **Wrong:**

```typescript
export function processOrder(order: Order) {
  console.log('Processing order:', order); // Debug code
  // const tax = calculateTax(order); // Old implementation
  const tax = 0; // TODO: fix tax calculation
  return { ...order, tax };
}
```

✅ **Correct:**

```typescript
export function processOrder(order: Order) {
  const tax = calculateTax(order);
  return { ...order, tax };
}
```

---

### 2. Remove Dead Code

**Check for:**

- [ ] Unused imports
- [ ] Unused variables or functions
- [ ] Unreachable code paths
- [ ] Deprecated API usage
- [ ] Duplicate utility functions

**Bazel handles this automatically:**

```bash
# ESLint checks include no-unused-vars and no-unreachable rules
bazel test //apps/web:lint
bazel test //apps/api:lint

# Find unused exports (if using ts-prune)
npx ts-prune
```

**Note:** Bazel's incremental analysis only checks changed files by default, making lint checks fast.

**Examples:**

❌ **Wrong:**

```typescript
import { useState, useEffect, useMemo } from 'react'; // useMemo unused
import { formatDate } from './utils'; // unused import

export function UserProfile({ user }: Props) {
  const [count, setCount] = useState(0); // unused state
  return <div>{user.name}</div>;
}
```

✅ **Correct:**

```typescript
import { useState } from 'react';

export function UserProfile({ user }: Props) {
  return <div>{user.name}</div>;
}
```

---

### 3. Fix Code Quality Issues

**Check for:**

- [ ] Linting errors (Bazel lint targets)
- [ ] Type errors (TypeScript compilation via Bazel build)
- [ ] Formatting inconsistencies (Bazel format_check)
- [ ] Naming convention violations
- [ ] Magic numbers (hardcoded values)
- [ ] Long functions (>70 lines per AGENTS.md)
- [ ] Deep nesting (>3 levels)

**Run quality checks via Bazel:**

```bash
# Run ESLint (parallel execution recommended)
bazel test //apps/web:lint
bazel test //apps/api:lint

# Check TypeScript compilation (via build targets)
bazel build //apps/web:build
bazel build //apps/api:build

# Check Prettier formatting
bazel test //:format_check
```

**Bazel benefits:**
- ✅ Only tests changed files (incremental)
- ✅ Caches results (skip if unchanged)
- ✅ Hermetic execution (reproducible)
- ✅ Parallel by default

**Auto-fix what's safe:**

```bash
# Auto-fix ESLint issues (run in workspace, outside Bazel)
cd apps/web && npx eslint src/ --fix
cd apps/api && npx eslint src/ test/ --fix

# Auto-format with Prettier
npx prettier --write .
```

**Use Cursor's ReadLints tool for real-time feedback:**

When fixing issues in specific files, use the `ReadLints` tool to get linter errors for files you're actively editing:

```typescript
// Check lints for files you just modified
ReadLints({ paths: ['apps/web/src/components/NewFeature.tsx'] })
```

**Benefits:**
- Real-time linter feedback in Cursor
- Focus on files you changed (not entire codebase)
- Faster than running full Bazel test

**Common ESLint issues to check:**

**Critical (must fix):**
- `no-unused-vars` - Remove unused variables/imports
- `no-console` - Remove debug console statements  
- `@typescript-eslint/no-explicit-any` - Replace `any` types
- `@typescript-eslint/no-floating-promises` - Handle async properly
- `react-hooks/exhaustive-deps` - Fix hook dependencies

**Quality (should fix):**
- `complexity` - Break down complex functions
- `max-lines-per-function` - Split long functions
- `no-magic-numbers` - Extract constants

**Examples:**

❌ **Wrong:**

```typescript
function calculateTotal(items: Item[]) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === 'product') {
      if (items[i].discount) {
        total += items[i].price * 0.9; // Magic number
      } else {
        total += items[i].price;
      }
    }
  }
  return total;
}
```

✅ **Correct:**

```typescript
const DISCOUNT_MULTIPLIER = 0.9;

function calculateTotal(items: Item[]): number {
  return items
    .filter((item) => item.type === 'product')
    .reduce((sum, item) => {
      const price = item.discount
        ? item.price * DISCOUNT_MULTIPLIER
        : item.price;
      return sum + price;
    }, 0);
}
```

---

### 4. Verify Tests Pass

**Check for:**

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All e2e tests passing (if applicable)
- [ ] No skipped tests (`.skip`, `xit`)
- [ ] No focused tests (`.only`, `fit`)
- [ ] Test coverage maintained or improved

**Commands:**

```bash
# Run all tests via Bazel (parallel)
bazel test //apps/web:test
bazel test //apps/api:test

# Run tests for specific package
bazel test //apps/web:test
bazel test //apps/api:test

# Check coverage (run outside Bazel for coverage report)
cd apps/web && npm run test:coverage
cd apps/api && npm run test:coverage
```

**Bazel test output format:**

```
INFO: Analyzed target //apps/web:test (0 packages loaded, 0 targets configured).
INFO: Found 1 test target...
Target //apps/web:test up-to-date:
  bazel-bin/apps/web/test.sh
INFO: Elapsed time: 2.345s, Critical Path: 2.12s
INFO: 1 process: 1 internal.
//apps/web:test                                                          PASSED in 2.1s

Executed 1 out of 1 test: 1 test passes.
```

**Report format:**

```markdown
## Test Results

**Web App Tests (//apps/web:test):** PASSED ✓
- Executed: 150 tests
- Duration: 2.1s

**API Tests (//apps/api:test):** PASSED ✓
- Executed: 45 tests
- Duration: 1.8s

**Coverage (run separately):**

- Statements: 87% (target: 80%)
- Branches: 82% (target: 75%)
- Functions: 90% (target: 80%)
- Lines: 87% (target: 80%)

**No regressions detected.**
```

---

### 5. Security Check

**Check for:**

- [ ] No hardcoded secrets (API keys, passwords)
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Sensitive data not logged
- [ ] Authentication/authorization properly enforced
- [ ] Input validation in place
- [ ] Dependencies have no known vulnerabilities

**Commands:**

```bash
# Check for secrets (using ripgrep)
rg "(api[_-]?key|password|secret|token).*=.*['\"]" apps/ packages/ --type ts

# Check dependencies for vulnerabilities (run in workspace root)
npm audit

# Security scan via Bazel (if configured)
# bazel test //security:scan  # if you have security test targets
```

**Examples:**

❌ **Wrong:**

```typescript
const API_KEY = 'sk_live_12345abcdef'; // Hardcoded secret

export async function fetchData(userInput: string) {
  // SQL injection vulnerability
  const query = `SELECT * FROM users WHERE name = '${userInput}'`;
  return db.query(query);
}
```

✅ **Correct:**

```typescript
const API_KEY = process.env.API_KEY; // From environment

export async function fetchData(userInput: string) {
  // Parameterized query
  const query = 'SELECT * FROM users WHERE name = ?';
  return db.query(query, [userInput]);
}
```

---

### 6. Performance Check

**Check for:**

- [ ] No obvious performance regressions
- [ ] No N+1 query patterns
- [ ] No unnecessary re-renders (React)
- [ ] Large lists virtualized
- [ ] Images optimized
- [ ] Bundle size not significantly increased

**Commands:**

```bash
# Check bundle size via Bazel build
bazel build //apps/web:build
bazel build //apps/api:build

# Review build output for size
ls -lh bazel-bin/apps/web/build/dist/
ls -lh bazel-bin/apps/api/build/dist/

# Profile React components (in dev)
# Use React DevTools Profiler or browser tools

# Check for N+1 queries (backend)
# Review query logs during testing
```

**Performance linting (React-specific):**

ESLint checks via Bazel include performance rules:

```bash
# Check for React performance issues (via Bazel lint)
bazel test //apps/web:lint

# Manual performance pattern checks:
rg "key=\{.*index" apps/web/src --type tsx  # Find array index keys
rg "\{\{.*\}\}" apps/web/src --type tsx      # Find inline objects in JSX
rg "\{\[.*\]\}" apps/web/src --type tsx      # Find inline arrays in JSX
```

**Common performance issues:**
- [ ] Array index as key in React lists
- [ ] New objects/arrays created in JSX props
- [ ] Missing React.memo for expensive components
- [ ] Unnecessary useEffect dependencies causing loops

**Examples:**

❌ **Wrong:**

```typescript
// N+1 query pattern
async function getOrdersWithCustomers(orderIds: string[]) {
  const orders = await db.orders.findMany({ where: { id: { in: orderIds } } });

  for (const order of orders) {
    order.customer = await db.customers.findOne({ id: order.customerId }); // N+1
  }

  return orders;
}
```

✅ **Correct:**

```typescript
// Batch query
async function getOrdersWithCustomers(orderIds: string[]) {
  return db.orders.findMany({
    where: { id: { in: orderIds } },
    include: { customer: true }, // Single query with join
  });
}
```

---

## Common Failure Modes

### 1. "I'll Clean It Up Later"

**Symptom:** Leaving debug code, TODOs, or poor quality "temporarily"

**Example:**

```typescript
// TODO: refactor this mess later
// console.log('DEBUG:', data); // remember to remove
export function processData(data: any) {
  // any type = lazy
  // ... messy implementation
}
```

**Why it fails:** "Later" never comes. Technical debt accumulates.

**Fix:** Clean as you go. Code review will catch it anyway.

---

### 2. "Tests Pass on My Machine"

**Symptom:** Tests pass locally but fail in CI/CD

**Common causes:**

- Environment-specific configuration
- Timing/race conditions
- File path assumptions
- Mock data not matching production shape

**Fix:**

- Run tests in clean environment
- Use Docker for consistency
- Check CI logs for differences

---

### 3. "It's Just a Small Change"

**Symptom:** Skipping quality checks for "trivial" changes

**Example:**

- One-line change that breaks tests
- Typo fix that introduces XSS
- CSS change that breaks layout

**Fix:** Run full quality checklist regardless of change size.

---

### 4. "No One Will Notice"

**Symptom:** Leaving known issues or poor code quality

**Reality:**

- Future you will notice (and curse past you)
- Code reviewers will notice
- Bugs in production will notice
- New team members will notice and lose trust

**Fix:** Treat every commit as if it's going to production.

---

## Quality Gate Output Template

After running the hygiene checks via Bazel, provide a summary:

```markdown
## Engineering Hygiene Report

### ✓ Cleanup

- [x] Debug code removed (0 console.log found)
- [x] Dead code removed (0 unused imports)
- [x] Commented code removed
- [x] TODOs resolved or issues filed

### ✓ Code Quality

**ESLint (Bazel):**
- `//apps/web:lint` → PASSED ✅
- `//apps/api:lint` → PASSED ✅
- `//:lint` → PASSED ✅

**TypeScript Compilation (Bazel Build):**
- `//apps/web:build` → SUCCESS ✅
- `//apps/api:build` → SUCCESS ✅

**Prettier (Bazel):**
- `//:format_check` → PASSED ✅

**Top Issues (if any):**
1. `no-unused-vars` in `utils.ts:45` → Remove unused import
2. `react-hooks/exhaustive-deps` in `Component.tsx:23` → Add missing dependency

**Auto-fix applied:** Yes (ran eslint --fix in affected directories)

### ✓ Tests

**Bazel Test Results:**
- `//apps/web:test` → PASSED in 2.1s ✅
- `//apps/api:test` → PASSED in 1.8s ✅
- **Total:** 195 tests passing
- **Coverage:** 87% (target: 80%)
- No skipped or focused tests

### ✓ Security

- [x] No hardcoded secrets (rg scan clean)
- [x] npm audit: 0 vulnerabilities
- [x] Input validation in place

### ✓ Performance

- [x] No obvious regressions
- [x] Bundle size check via Bazel build: acceptable

**Status:** ✅ Ready for review
**Blockers:** None
**Bazel Cache:** All targets cached (no changes detected)
```

---

## Integration with Workflow Modes

### CLEAN-SWEEP Mode

Engineering hygiene is **automatically applied** during CLEAN-SWEEP mode:

1. Review changes for correctness
2. Run cleanup checklist
3. Invoke critic subagents (`web.react-critic`, `api.fastify-debugger`, etc.)
4. Fix all issues found
5. Re-run tests
6. Generate hygiene report

### Before Code Review

Run this skill manually before requesting review:

- Ensures reviewer sees clean, quality code
- Reduces review cycles
- Builds reviewer trust

### Before Deploy

Final quality gate before production:

- All tests must pass
- No security vulnerabilities
- Performance validated
- Rollback plan ready

---

## Key Principle

> **"Done" means clean, tested, and production-ready.**  
> **Not "the feature works on my machine."**

Code that passes this checklist:

- ✅ Merges faster (fewer review comments)
- ✅ Deploys confidently (fewer production issues)
- ✅ Maintains easily (future developers thank you)
- ✅ Scales reliably (no hidden performance issues)

---

## Bazel Quick Reference

### Common Hygiene Commands

```bash
# Run all quality checks in parallel (recommended)
bazel test //apps/web:lint //apps/api:lint //:format_check
bazel test //apps/web:test //apps/api:test
bazel build //apps/web:build //apps/api:build

# Run everything (all tests and builds)
bazel test //...
bazel build //...

# Clean cache (if seeing stale results)
bazel clean

# Clean everything (including external dependencies)
bazel clean --expunge
```

### Debugging Failed Checks

**ESLint failure:**
```bash
# See full ESLint output
bazel test //apps/web:lint --test_output=all

# Auto-fix and re-test
cd apps/web && npx eslint src/ --fix
bazel test //apps/web:lint
```

**Format check failure:**
```bash
# See which files need formatting
bazel test //:format_check --test_output=all

# Auto-format and re-test
npx prettier --write .
bazel test //:format_check
```

**Build failure:**
```bash
# See full build output
bazel build //apps/web:build --verbose_failures

# Check TypeScript errors
cd apps/web && npx tsc --noEmit
```

**Test failure:**
```bash
# See full test output
bazel test //apps/web:test --test_output=all

# Run tests outside Bazel for better debugging
cd apps/web && npm run test:watch
```

### Bazel Performance Tips

- **Use test filters:** `bazel test //apps/web:test --test_filter=ComponentName`
- **Check cache status:** `bazel test //... --explain=explain.log`
- **Parallel execution:** Bazel runs tests in parallel by default
- **Incremental builds:** Only rebuilds changed files and dependencies

---

## References

See `references/` for:

- Detailed linting configuration examples
- Security vulnerability checklist
- Performance profiling techniques
- Code review preparation guide
