# Enterprise Standards - Base Instructions

**Platform-Agnostic Core Standards**

This file contains the foundational standards that apply across all AI coding environments (Cursor, Claude Code, VS Code). Platform-specific adaptations are in separate directories.

---

## Core Workflow

### Command-Driven Development

Use standardized commands to trigger workflows:

- `/std-solution` - Frame problems using hermeneutic interpretation
- `/std-plan` - Create outcome-driven teleological plans
- `/std-design-review` - Evaluate UI quality with usability heuristics
- `/std-clean-sweep` - Quality gates before handoff
- `/std-test-loop` - Test-driven development cycle
- `/std-deploy-release` - Release preparation checklist

### Intent Before Action

**MUST capture user intent before implementing:**

1. **Context** - What's the current state? What history led here?
2. **Problem** - What's the real issue (not just symptoms)?
3. **Outcome** - What does success look like? (Observable, measurable)
4. **Constraints** - What limits our options?
5. **Success Criteria** - How will we know we succeeded?

**Rationale:** Prevents solving the wrong problem. Forces explicit shared understanding.

---

## Git Operations Policy

**AI agents MUST NOT perform git operations.**

### Prohibited

- ❌ `git add`, `git commit`, `git push`
- ❌ `git branch`, `git checkout`, `git merge`
- ❌ `git stash`, `git rebase`
- ❌ Any command that modifies repository state

### Allowed (Read-Only)

- ✅ `git status`, `git diff`, `git log`

**Rationale:** User controls version control decisions. AI provides recommendations, user executes.

---

## Solution Framing (Hermeneutic Circle)

### When to Use

- Request is ambiguous or high-level
- Multiple solution paths exist
- Requirements keep changing
- Teams argue about solutions (different interpretations)

### Process

1. **Establish Context (Fore-Having)**
   - Current state, history, evidence, previous attempts

2. **Make Assumptions Explicit (Fore-Sight)**
   - What are we assuming? What biases exist?

3. **Clarify Language (Fore-Conception)**
   - Define key terms in this context
   - Establish shared vocabulary

4. **Interpret Problem (Part ↔ Whole)**
   - Move from symptoms to root problem
   - Test interpretation against evidence

5. **Define Outcome**
   - Observable, measurable desired end-state
   - Specific success criteria
   - Explicit non-goals

6. **Identify Constraints & Unknowns**
   - Technical, business, resource limits
   - Open questions that would change approach

7. **Test Interpretation**
   - Challenge with subagents (in SOLUTION mode only)
   - Verify logical consistency

8. **Stabilize or Loop**
   - If stable: move to planning
   - If unstable: gather more evidence, revise

**Artifact:** Solution Interpretation document with all sections

---

## Teleological Planning

### When to Use

- After hermeneutic interpretation is stable
- Multi-step or complex work
- Risk mitigation required
- Success must be verifiable

### Process (Work Backward from Outcome)

1. **Define End-State (Telos)**
   - Observable, falsifiable, complete
   - Example: "Checkout API responds in <1s for 95th percentile under peak load"

2. **Define Acceptance Criteria**
   - How we verify success
   - Must be observable and measurable

3. **Work Backward**
   - Ask: "What must be true immediately before this?"
   - Derive phases recursively until current state

4. **Create Phase Gates**
   - Observable criteria for each phase
   - Evidence requirements
   - Decision criteria to proceed

5. **Map Tasks to Outcomes**
   - Every task must map to acceptance criterion
   - If task doesn't map → either add criterion or remove task

6. **Identify Dependencies & Risks**
   - What must happen before what?
   - What could prevent achieving telos?
   - Mitigation and rollback plans

**Artifact:** Teleological plan with phases, gates, task-outcome mapping

---

## Quality Gates

### Before Handoff

**MUST verify:**

1. **Tests**
   - Unit tests: all passing
   - Integration tests: no regressions
   - Edge cases: covered

2. **Linting & Formatting**
   - No lint errors
   - Code formatted consistently
   - No debug artifacts (`console.log`, `debugger`, commented code)

3. **Documentation**
   - Public APIs documented
   - Complex logic explained
   - README updated if needed

4. **Security**
   - No hardcoded secrets
   - No PHI/PII exposure
   - Input validation present
   - Error messages don't leak sensitive data

5. **Evidence**
   - Artifact proving success (test output, screenshots, metrics)
   - Stored in `.temp/` or committed as needed

---

## File Organization

### Temporary Files

- **Location:** `.temp/` directory (gitignored)
- **Use for:** Development artifacts, test outputs, temporary scripts

### Documentation

- **Long-term stable:** `docs/`
  - `docs/requirements/` - Requirements and specs
  - `docs/architecture/` - System architecture
  - `docs/completed/` - Completed work documentation

- **Active work:** `memory-bank/`
  - `memory-bank/current/` - Current phase work
  - `memory-bank/planning/` - Upcoming work plans

- **Project root:** Only README.md, LICENSE, CONTRIBUTING.md, config files

### Tests

- **Use proper framework:** `*.test.ts`, `*.test.js`, `*.spec.ts`
- **NOT ad-hoc scripts:** No temporary test files in root

---

## Documentation Lifecycle

### Plan Documents

1. **Create:** `memory-bank/planning/PHASEX_PLAN.md`
   - Status: Planning
   - Include: Goals, timeline, deliverables, todo list

2. **Move to Active:** `mv memory-bank/planning/PHASEX_PLAN.md memory-bank/current/PHASEX_PLAN.md`
   - Status: Active
   - Mark first task as in-progress

3. **Move to Completed:** `mv memory-bank/current/PHASEX_PLAN.md docs/completed/PHASEX_PLAN.md`
   - Status: Completed
   - Archive with outcomes

**CRITICAL:** Use `mv` command to preserve git history. Never read+create+delete.

### Todo Lists

**MUST maintain in plan documents, NOT only in-memory.**

Format:
```markdown
## Todo List

- [x] **Task 1:** Complete X
  - Status: Completed
  - Files: `src/x.ts`
- [~] **Task 2:** Build Y
  - Status: In Progress
  - Next: Fix validation
- [ ] **Task 3:** Add Z
  - Status: Not Started
```

---

## Error Handling Standards

- Always handle errors explicitly
- Log errors with context (without secrets)
- Provide actionable error messages
- Never silently swallow exceptions
- Use try/catch for async operations
- Implement error boundaries (React) where applicable

---

## Security Practices

### Secrets Management

- **NEVER hardcode secrets** in code, logs, examples
- Use environment variables
- Document required env vars in `.env.example`
- Load from secure secret stores in production

### PHI/PII Handling

- **Identify PHI/PII early** in requirements
- **Encryption at rest and in transit**
- **Access controls** - role-based permissions
- **Audit logging** for PHI/PII access
- **Data minimization** - collect only what's needed
- **Retention policies** - delete when no longer needed

### Input Validation

- Validate all user input
- Sanitize for SQL injection, XSS
- Use parameterized queries
- Implement rate limiting
- CORS configured correctly

### Error Messages

- Don't leak sensitive data
- Don't expose stack traces in production
- Log full errors server-side
- Return generic messages to client

---

## Evidence-Based Claims

**Any claim of success MUST be backed by artifacts.**

### Testing Claims

- **"Tests passing"** → Test runner output with pass/fail counts
- **"Visual parity achieved"** → Screenshots (prod vs local)
- **"Performance improved"** → Benchmark results (before/after)

### Implementation Claims

- **"Feature complete"** → Acceptance criteria checklist (all checked), test results
- **"Bug fixed"** → Reproduction steps no longer trigger bug, regression tests passing

### Deployment Claims

- **"Deployment successful"** → Deployment logs, health checks, smoke tests

### Artifact Storage

- **Development:** `.temp/` directory (gitignored)
- **Permanent:** `docs/evidence/` for long-term reference

---

## Workflow Modes

**9-phase development workflow:**

1. **SOLUTION** - Hermeneutic interpretation of requirements
2. **PLAN** - Teleological planning from outcome backward
3. **DESIGN-FLOW** - UI/UX flow design
4. **DESIGN-REVIEW** - Heuristic evaluation of designs
5. **BUILD-SCREEN** - Frontend implementation
6. **BUILD-API** - Backend implementation
7. **CLEAN-SWEEP** - Quality gates and cleanup
8. **TEST-LOOP** - Test-driven development cycle
9. **DEPLOY-RELEASE** - Release preparation

**Each mode has specific entry/exit criteria and validation requirements.**

---

## Key Principles

1. **Interpretation before action** - Understand the problem
2. **Outcome-driven planning** - Work backward from telos
3. **Evidence-based verification** - Prove success with artifacts
4. **Explicit documentation** - Decisions and rationale captured
5. **Security by design** - Not an afterthought
6. **Quality gates enforced** - No shortcuts before handoff

---

## Relationship to Skills

**Skills expand on these standards:**

- `hermeneutic-solution/` - Detailed interpretation method
- `teleological-planning/` - Detailed planning method
- `heuristic-design-review/` - UI evaluation techniques
- `engineering-hygiene/` - Quality gate procedures
- `security-review/` - Deep security analysis

**Agents enforce standards:**

- `std-planner` - Validates teleological plans
- `std-verifier` - Validates quality gates
- `std-debugger` - Root-cause analysis
- `security-critic` - Adversarial security review

---

**This is the operational foundation for all development work.**
