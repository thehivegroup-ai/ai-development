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
# Find console.log statements
rg "console\.(log|debug|warn)" --type ts --type tsx --type js --type jsx

# Find commented code (manual review needed)
rg "^\s*//.*\{" --type ts --type tsx --type js --type jsx

# Find TODO comments
rg "(TODO|FIXME|HACK|XXX)" --type-all
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

**Commands:**
```bash
# TypeScript/ESLint will catch most
npm run lint

# Find unused exports (if using ts-prune)
npx ts-prune
```

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
- [ ] Linting errors (`npm run lint`)
- [ ] Type errors (`tsc --noEmit`)
- [ ] Formatting inconsistencies (`npm run format`)
- [ ] Naming convention violations
- [ ] Magic numbers (hardcoded values)
- [ ] Long functions (>50 lines)
- [ ] Deep nesting (>3 levels)

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
    .filter(item => item.type === 'product')
    .reduce((sum, item) => {
      const price = item.discount ? item.price * DISCOUNT_MULTIPLIER : item.price;
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
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

**Report format:**
```markdown
## Test Results

**Unit Tests:** 150/150 passing ✓
**Integration Tests:** 45/45 passing ✓
**E2E Tests:** 12/12 passing ✓

**Coverage:**
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
# Check for secrets (using truffleHog or similar)
rg "(api[_-]?key|password|secret|token).*=.*['\"]" --type ts --type js

# Check dependencies for vulnerabilities
npm audit

# Check for common security issues
npm run lint:security  # if configured
```

**Examples:**

❌ **Wrong:**
```typescript
const API_KEY = "sk_live_12345abcdef"; // Hardcoded secret

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
# Check bundle size
npm run build
# Review build output for size warnings

# Profile React components (in dev)
# Use React DevTools Profiler

# Check for N+1 queries (backend)
# Review query logs during testing
```

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
    include: { customer: true } // Single query with join
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
export function processData(data: any) { // any type = lazy
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

After running the hygiene checks, provide a summary:

```markdown
## Engineering Hygiene Report

### ✓ Cleanup
- [x] Debug code removed (0 console.log found)
- [x] Dead code removed (0 unused imports)
- [x] Commented code removed
- [x] TODOs resolved or issues filed

### ✓ Code Quality
- [x] Linting: 0 errors, 0 warnings
- [x] Type checking: 0 errors
- [x] Formatting: consistent (Prettier)

### ✓ Tests
- [x] Unit tests: 150/150 passing
- [x] Integration tests: 45/45 passing
- [x] Coverage: 87% (target: 80%)
- [x] No skipped or focused tests

### ✓ Security
- [x] No hardcoded secrets
- [x] npm audit: 0 vulnerabilities
- [x] Input validation in place

### ✓ Performance
- [x] No obvious regressions
- [x] Bundle size: +2KB (acceptable)

**Status:** ✅ Ready for review
**Blockers:** None
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

## References

See `references/` for:
- Detailed linting configuration examples
- Security vulnerability checklist
- Performance profiling techniques
- Code review preparation guide
