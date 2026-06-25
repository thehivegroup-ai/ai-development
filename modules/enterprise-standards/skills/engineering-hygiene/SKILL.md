---
name: engineering-hygiene
version: 1.1.0
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

- Architecture review (use stack- or project-specific review skills if installed)
- Security-specific review (use `security-review` skill)
- Design evaluation (use `heuristic-design-review` skill)

---

## Token Optimization

**For large codebases with many files to check:**

**Launch `std-verifier` agent:**

```
"Run engineering hygiene checks across the changed codebase.
Check for: debug code, dead code, lint errors, type errors, test failures, obvious security issues.
Report findings with file locations."
```

**Token savings:** 10–30K tokens (comprehensive scans in isolated context)

**For focused work:** Use the checklist below in the main conversation.

---

## The Quality Gate System

### Design Goal

Turn code quality from subjective judgment into **objective, verifiable checkpoints**:

- **Clean code** – No debug artifacts, dead code, or unresolved TODOs
- **Passing tests** – All relevant tests green; coverage maintained where the project tracks it
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

## Pre-Flight: Discover Project Commands

**Before running checks, resolve how *this* project runs quality gates.**

1. Read **`stack.profile.json`** (if present) for stack and package layout.
2. Read **`README.md`** and **`package.json`** scripts (root and affected workspaces in monorepos).
3. Prefer **documented project commands** over inventing new ones.

**Typical check categories** (names vary by project):

| Category | Common script names | Purpose |
|----------|---------------------|---------|
| Lint | `lint`, `eslint` | Style and static analysis |
| Format | `format:check`, `prettier --check` | Consistent formatting |
| Typecheck | `typecheck`, `tsc --noEmit` | Types without relying on bundlers alone |
| Test | `test`, `test:unit` | Unit and integration tests |
| Build | `build` | Compile / bundle verification |

**Monorepos:** Run checks in the **packages or apps you changed**, plus any workspace-level gates defined in root scripts or CI config.

**If scripts are missing:** Ask the user which commands CI uses, or inspect `.github/workflows/` (or equivalent) for the canonical pipeline.

---

## Parallel Execution Strategy

**Independent checks should run in parallel** (single message, multiple shell invocations):

```
Quality Checks (PARALLEL)
┌──────────────────────────────────────────────┐
│ Lint      (project lint script)              │
│ Format    (project format check)             │
│ Typecheck (project typecheck script)         │
│ Test      (project test script)              │
│ Build     (project build script, if needed)  │
│ Scan      (debug artifacts via rg)           │
└──────────────────┬───────────────────────────┘
                   ↓
         Parse Results & Generate Report
```

**Implementation:** Launch all applicable checks concurrently, then aggregate pass/fail and errors.

**Time savings:** Often 50%+ vs. running sequentially.

**Output handling:** Capture stdout/stderr for each check; categorize by severity and file location.

---

## Quality Check Commands

### Run All Applicable Checks

Use the project's own scripts. Examples (adapt paths and package manager):

```bash
# Root or workspace — replace with scripts from package.json
npm run lint
npm run format:check    # or: npx prettier --check .
npm run typecheck       # prefer explicit tsc over build-only type inference
npm test
npm run build           # when build validates compilation
```

**Package manager:** Use `npm`, `pnpm`, or `yarn` as the project standard — do not assume one globally.

**Typecheck note:** Many frontend bundlers **do not** fail on type errors. Prefer an explicit **`typecheck`** (or `tsc --noEmit`) when the project provides it.

### Run Selective Checks

For focused changes, run only gates for **touched packages** plus any repo-wide format/lint at root if CI requires it.

### Auto-Fix Issues

When safe, auto-fix then re-run checks:

```bash
npm run lint -- --fix    # if supported
npx prettier --write .   # when format check failed
```

Re-run the same check commands after fixes to verify.

---

## Cleanup Checklist

### 1. Remove Debug Artifacts

**Check for:**

- [ ] `console.log`, `console.debug`, `print()` statements
- [ ] Commented-out code blocks
- [ ] Temporary test data or mock values
- [ ] Debug breakpoints left in code
- [ ] Hardcoded API keys or credentials
- [ ] TODO/FIXME comments without tracked issues

**Commands** (adjust `src/` to your project layout):

```bash
rg "console\.(log|debug|warn)" src --type-add 'tsx:*.tsx' -t ts -t tsx
rg "(TODO|FIXME|HACK|XXX)" src
rg "(api[_-]?key|password|secret|token)\s*=\s*['\"]" src
```

---

### 2. Remove Dead Code

**Check for:**

- [ ] Unused imports
- [ ] Unused variables or functions
- [ ] Unreachable code paths
- [ ] Deprecated API usage
- [ ] Duplicate utility functions

Lint rules such as `no-unused-vars` usually catch these when lint passes.

---

### 3. Fix Code Quality Issues

**Check for:**

- [ ] Lint errors
- [ ] Type errors (via dedicated typecheck, not build alone)
- [ ] Formatting inconsistencies
- [ ] Naming convention violations
- [ ] Magic numbers
- [ ] Overly long functions or deep nesting (per project standards)

**Use Cursor's ReadLints** on files you edited for fast feedback:

```
ReadLints({ paths: ['src/components/Feature.tsx'] })
```

**Critical issues (must fix):** unused vars, debug `console`, explicit `any`, unhandled promises, incorrect hook dependencies (React projects).

---

### 4. Verify Tests Pass

**Check for:**

- [ ] Unit and integration tests passing for changed areas
- [ ] E2E tests passing when UI or critical paths changed
- [ ] No skipped (`.skip`) or focused (`.only`) tests left in commits
- [ ] Coverage maintained if the project enforces thresholds

Run the project's test script(s); report counts and failures with file/line references.

---

### 5. Security Check

Quick scan during hygiene. **For threat modeling, OWASP depth, or PHI/PII compliance, use the `security-review` skill — not this section alone.**

**Check for:**

- [ ] No hardcoded secrets
- [ ] No PHI/PII in logs or error messages
- [ ] No SQL string concatenation (parameterized queries only)
- [ ] No unsafe HTML rendering without sanitization
- [ ] Dependency audit shows no unaddressed high/critical issues

**Commands:**

```bash
rg "(api[_-]?key|password|secret|token)\s*=\s*['\"]" src
npm audit --audit-level=high   # or pnpm/yarn equivalent
```

If sensitive data or auth is involved, stop and run `security-review`.

---

### 6. Performance Check

**Check for:**

- [ ] No obvious regressions (N+1 queries, unnecessary re-renders, unbounded lists)
- [ ] Large lists virtualized where appropriate
- [ ] Assets optimized when relevant
- [ ] Bundle size not significantly increased (frontend)

Use project profiling tools and build output; flag patterns in changed code rather than guessing.

---

## Common Failure Modes

### "I'll Clean It Up Later"

Debug code and TODOs ship. **Fix before review.**

### "Tests Pass on My Machine"

Compare with CI environment, clean install, and documented scripts.

### "It's Just a Small Change"

Run the same gates CI runs — small diffs still break production.

### "No One Will Notice"

Poor quality compounds. Treat every change as production-bound.

---

## Quality Gate Output Template

After checks, summarize with evidence:

```markdown
## Engineering Hygiene Report

### Cleanup
- [x] Debug artifacts removed
- [x] Dead code / unused imports addressed
- [x] TODOs resolved or tracked

### Code Quality
- Lint: PASSED / FAILED (command: `…`)
- Format: PASSED / FAILED (command: `…`)
- Typecheck: PASSED / FAILED (command: `…`)
- Top issues: (file:line — rule — fix)

### Tests
- Command: `…`
- Result: N passed, M failed
- Coverage: (if available)

### Security
- Secret scan: clean / findings
- Dependency audit: (summary)
- Deep review needed: yes → `security-review` / no

### Performance
- Obvious regressions: none / (describe)

**Status:** Ready for review / Blocked
**Blockers:** (list)
```

---

## Integration with Workflow Modes

### CLEAN-SWEEP Mode

Engineering hygiene applies during CLEAN-SWEEP:

1. Review changes for correctness
2. Run cleanup checklist and project quality commands
3. Invoke **`std-verifier`** (or stack-specific critic agents if installed) for adversarial review
4. Fix issues found
5. Re-run tests
6. Generate hygiene report with evidence

### Before Code Review

Run this skill manually so reviewers see clean, verified work.

### Before Deploy

All tests pass, security acceptable, performance acceptable, rollback understood.

---

## Key Principle

> **"Done" means clean, tested, and production-ready.**  
> **Not "the feature works on my machine."**

---

## References

Project-specific command lists may live in:

- `README.md` — build, test, lint
- `stack.profile.json` — installed stack modules
- CI workflow files — canonical gates
- Stack authority skills (when installed) — framework-specific hygiene details
