# AI Development Workflows

This document explains how Rules, Commands, Skills, and Subagents work together to enable consistent, reusable workflows.

---

## The Four Constructs

| Construct  | Purpose | Location | Triggered By |
|----------|---------|----------|--------------|
| **Rule** | Enforceable constraints | `.cursor/rules/*.mdc` | Pattern match or always |
| **Command** | Repeatable workflow entry point | `.cursor/commands/*.md` | User types `/command` |
| **Skill** | How-to guidance and examples | `.cursor/skills/*/SKILL.md` | Agent decides or command invokes |
| **Subagent** | Specialized perspective | `.cursor/agents/*.md` | Agent delegates or command invokes |

**Key Principle:** Commands are the interface. Rules constrain. Skills teach. Subagents specialize.

---

## Workflow Patterns

### Pattern 1: Complete Feature Development Workflow

**Modes:** SOLUTION → PLAN → DESIGN-FLOW → BUILD-SCREEN → CLEAN-SWEEP → TEST-LOOP → DEPLOY-RELEASE

#### 1. SOLUTION Mode

**User:**
```
I need to add user authentication to the app
```

**Agent:**
```
# Mode: SOLUTION
```

**What happens:**
1. Agent applies hermeneutic circle to interpret intent
2. Restates problem in user's terms
3. Identifies assumptions, constraints, success criteria
4. Offers solution narrative with tradeoffs

**Output:**
- Clear problem statement
- Success criteria
- Assumptions and constraints
- High-level solution approach

---

#### 2. PLAN Mode

**User:**
```
PLAN
```

**Agent:**
```
# Mode: PLAN
```

**What happens:**
1. Agent builds goal tree backward from desired outcome
2. Decomposes into ordered, verifiable tasks
3. Adds validation steps
4. Identifies dependencies, risks, rollback

**Output:**
- Ordered task list with dependencies
- Validation steps
- Risks and mitigation
- Rollback strategy

---

#### 3. DESIGN-FLOW Mode (for UI work)

**User:**
```
DESIGN-FLOW
```

**Agent:**
```
# Mode: DESIGN-FLOW
```

**What happens:**
1. Maps plan to screens and components
2. Identifies design tokens needed (colors, spacing, typography)
3. Defines component hierarchy
4. Specifies component classes and utilities
5. Outlines data flow and state management

**Output:**
- UI structure plan
- Component hierarchy
- Design token mapping
- Data flow diagram

---

#### 4. BUILD-SCREEN Mode

**User:**
```
BUILD-SCREEN
```

**Agent:**
```
# Mode: BUILD-SCREEN
```

**What happens:**
1. Implements incrementally based on design/plan
2. Applies stack-specific rules
3. Builds one component/feature at a time
4. Adds tests as building
5. Shows progress after each increment

**Output:**
- Working code changes
- Tests added/updated
- Progress report

---

#### 5. CLEAN-SWEEP Mode

**Agent (auto-transition):**
```
# Mode: CLEAN-SWEEP
```

**What happens:**
1. Reviews changes for correctness and consistency
2. Removes dead code, TODOs, debug artifacts
3. Fixes lint and type errors
4. Validates formatting, naming, structure
5. Invokes critic subagents for review

**Output:**
- Cleaned code
- No dead code or debug artifacts
- Formatting and linting fixed

---

#### 6. TEST-LOOP Mode

**Agent (auto-transition):**
```
# Mode: TEST-LOOP
```

**What happens:**
1. Identifies relevant test scope
2. Runs tests and captures results
3. If failures: delegates to debugger, fixes, re-runs
4. Checks for regressions
5. Repeats until all tests green

**Output:**
- All tests passing
- Coverage report
- Regression check results

---

#### 7. DEPLOY-RELEASE Mode

**User:**
```
DEPLOY-RELEASE
```

**Agent:**
```
# Mode: DEPLOY-RELEASE
```

**What happens:**
1. Runs preflight checks (build, lint, test)
2. Verifies environment configuration
3. Confirms versioning and release notes
4. Validates infrastructure plan
5. Documents rollout and rollback
6. Executes deployment (if approved)

**Output:**
- Preflight checklist
- Deployment steps
- Rollback plan
- Deployment status

---

## Pattern 2: Stack-Specific Workflows

### Building a React Screen

**User:**
```
/web.react.build-screen for user profile page
```

**What happens:**
1. Command `web.react.build-screen.md` orchestrates the workflow
2. Rules applied:
   - `00-std-foundation.mdc` (always)
   - `20-web-react-tailwind.mdc` (file pattern match)
3. Skills invoked:
   - `react-tailwind-conventions`
   - `react-component-standards`
4. Subagent `web.react-critic` reviews for UI consistency

**Execution flow:**
```
User types command
  ↓
Command loads and interprets instructions
  ↓
Rules constrain the solution space
  ↓
Skills provide how-to guidance
  ↓
Agent implements screen
  ↓
Subagent reviews for consistency
  ↓
Agent presents result
```

---

### Adding a Fastify Route

**User:**
```
/api.fastify.add-route for GET /users/:id
```

**What happens:**
1. Command `api.fastify.add-route.md` orchestrates
2. Rules applied:
   - `30-api-node-fastify.mdc` (file pattern match)
3. Skills invoked:
   - `fastify-api-standards`
4. Agent implements route, validation, handler, and tests

---

### Database Migration

**User:**
```
/db.postgres.migration to add users table
```

**What happens:**
1. Command `db.postgres.migration.md` orchestrates
2. Rules applied:
   - `40-db-postgres.mdc`
3. Skills invoked:
   - `postgres-standards`
4. Subagent `db.postgres-reviewer` reviews for safety
5. Agent creates migration with up/down steps

---

## Pattern 3: Multi-Stack Workflows

### Full-Stack Feature

**Example:** Add user authentication

**Phase 1: Solution**
```
/std-solution
```
- Define auth approach (JWT vs session, etc.)
- Identify frontend + backend + database changes

**Phase 2: Plan**
```
/std-plan
```
- Break into tasks:
  1. Database schema (users table, sessions)
  2. Backend routes (login, logout, validate)
  3. Frontend components (login form, protected routes)
  4. Tests for each layer

**Phase 3: Execute**

Backend:
```
/api.fastify.add-route for POST /auth/login
/api.fastify.add-route for POST /auth/logout
/api.fastify.test-loop
```

Database:
```
/db.postgres.migration to add users and sessions tables
```

Frontend:
```
/web.react.build-screen for login page
/web.react.build-screen for protected route wrapper
```

**Phase 4: Verify**
```
/std-clean-sweep
/std-test-loop
```

**Phase 5: Deploy**
```
/std-deploy-release
/cloud.aws.preflight
```

---

## How Rules Work

### Rule Loading

Rules are loaded based on:
1. **Always apply**: `alwaysApply: true` in frontmatter
2. **Pattern match**: `globs` match current file
3. **Manual**: User @-mentions the rule

### Rule Precedence

When multiple rules apply, they are **merged** (not overridden):
1. Team rules (if configured)
2. Project rules (`.cursor/rules/`)
3. User rules (global)

### Rule Numbering

Files are prefixed for clarity and ordering:
- `00-*` → Enterprise standards (always load first)
- `20-*` → Frontend stack authorities
- `30-*` → Backend stack authorities
- `40-*` → Database stack authorities
- `50-*` → Cloud stack authorities
- `90-*` → Project controls (load last, can layer additional requirements)

---

## How Commands Work

### Command Format

Commands are plain markdown files in `.cursor/commands/`:

```markdown
# Command Name

Brief description of what this command does.

## Steps

1. First step
2. Second step
3. Third step

## Guidance

- Apply skill X
- Consider invoking subagent Y
```

### Command Invocation

User types `/command-name` in chat.

Agent reads the command file and follows the instructions.

### Command Composition

Commands can invoke other commands:

```markdown
# /web.react.build-screen

## Steps

1. Confirm requirements
2. Implement screen
3. Run `/std-clean-sweep`
4. Run `/std-test-loop`
```

---

## How Skills Work

### Skill Format

Skills are folders with `SKILL.md`:

```markdown
---
name: skill-name
description: When to use this skill.
---

# Skill Name

## When to Use

- Scenario 1
- Scenario 2

## Instructions

1. Step-by-step guidance
2. Examples and patterns
3. Anti-patterns to avoid
```

### Skill Discovery

Agent automatically discovers skills and decides when they're relevant based on:
- Description field
- Current context
- Explicit invocation from commands

### Skill References

Skills can include:
- `references/` folder for detailed docs
- `scripts/` folder for executable helpers
- `assets/` folder for templates or data

---

## How Subagents Work

### Subagent Format

Subagents are markdown files in `.cursor/agents/`:

```markdown
---
name: subagent-name
description: When to use this subagent.
model: fast | inherit
---

You are a [role] specialist.

When invoked:
1. Do X
2. Verify Y
3. Report Z
```

### Subagent Delegation

Agent delegates to subagents:
- **Automatically**: Based on task complexity and description
- **Explicitly**: Command or user requests it

### Subagent Isolation

Each subagent:
- Gets its own context window
- Receives fresh prompt with necessary context
- Returns summary to parent agent

---

## Module Composition

### How Projects Consume Modules

Projects copy module `cursor/` contents into `.cursor/`:

```bash
# Example: React + Fastify + Postgres + AWS
cp -r modules/enterprise-standards/cursor/* .cursor/
cp -r modules/stack-authorities/frontend/react-tailwind/cursor/* .cursor/
cp -r modules/stack-authorities/backend/node-fastify/cursor/* .cursor/
cp -r modules/stack-authorities/database/postgres/cursor/* .cursor/
cp -r modules/stack-authorities/cloud/aws/cursor/* .cursor/
cp -r modules/project-controls/base/cursor/* .cursor/
```

Result:
```
.cursor/
  rules/
    00-std-foundation.mdc
    01-std-solution-hermeneutic.mdc
    02-std-planning-teleological.mdc
    03-std-quality-clean-test-deploy.mdc
    20-web-react-tailwind.mdc
    30-api-node-fastify.mdc
    40-db-postgres.mdc
    50-cloud-aws.mdc
    90-ctrl-base.mdc
  commands/
    web.react.build-screen.md
    web.react.compare-screens.md
    api.fastify.add-route.md
    db.postgres.migration.md
    cloud.aws.preflight.md
    ctrl.base.check.md
  skills/
    std-solution/
    std-plan/
    std-clean-sweep/
    std-test-loop/
    std-deploy-release/
    hermeneutic-solution/
    teleological-planning/
    engineering-hygiene/
    react-tailwind-conventions/
    react-component-standards/
    fastify-api-standards/
    postgres-standards/
    aws-infra-standards/
    project-basics/
  agents/
    std-planner.md
    std-verifier.md
    std-debugger.md
    web.react-critic.md
    api.fastify-debugger.md
    db.postgres-reviewer.md
    cloud.aws-release-manager.md
    ctrl.base-verifier.md
```

---

## Workflow Decision Tree

```
User makes request
  ↓
Is it vague or high-level?
  YES → SOLUTION mode (frame it)
  NO → Continue
  ↓
Does it need planning?
  YES → PLAN mode (structure it)
  NO → Continue
  ↓
Is it UI/UX work?
  YES → DESIGN-FLOW mode (map to components)
  NO → Continue
  ↓
BUILD-SCREEN mode (implement)
  ↓
CLEAN-SWEEP mode (refactor/standardize)
  ↓
TEST-LOOP mode (green tests)
  ↓
Is it production-bound?
  YES → DEPLOY-RELEASE mode
  NO → Done, return to SOLUTION
```

---

## Workflow Examples by Scenario

### Scenario 1: Full-Stack Feature

**Request:** "Add user profile page where users can update their name and email"

**Workflow:**
```
1. SOLUTION → Frame the feature
   - Users need profile editing capability
   - Success: view + update + validation + persistence
   
2. PLAN → Break into tasks
   - Backend: PUT /api/users/:id endpoint
   - Frontend: /profile route + form component
   - Validation: frontend + backend
   - Tests: API tests + UI tests

3. DESIGN-FLOW → Map UI structure
   - Route: /profile
   - Components: ProfileForm, Input, Button
   - Design tokens: spacing-4, color-brand-red, text-lg
   - State: form state, loading, error

4. BUILD-SCREEN → Implement frontend
   - Profile form component with validation
   - Loading/error/success states
   - Integration with API

5. BUILD-API → Implement backend
   - Add Fastify route with schema validation
   - Service layer for user update logic
   - Tests for success/unauthorized/invalid

6. CLEAN-SWEEP → Clean both
   - Remove debug logs
   - Fix lint errors
   - Standardize error responses (backend)
   - Apply React memo patterns (frontend)

7. TEST-LOOP → Verify both
   - Run API tests: all passing ✓
   - Run UI tests: all passing ✓
   - Integration tests: all passing ✓

8. DEPLOY-RELEASE → Deploy to staging
    - Preflight checks ✓
    - Deploy backend + frontend
    - Smoke tests ✓
```

---

### Scenario 2: Backend-Only Feature

**Request:** "Add API endpoint for bulk user import"

**Workflow:**
```
1. SOLUTION → Understand requirements
   - Need bulk user import via CSV
   - Success: parse CSV, validate, create users, return report

2. PLAN → Break into tasks
   - POST /api/users/bulk-import endpoint
   - CSV parsing logic
   - Validation (email format, duplicates)
   - Transaction handling
   - Response with success/failure report
   - Tests for various CSV formats

3. BUILD-API → Implement endpoint
   - Fastify route with file upload
   - CSV parsing service
   - Validation logic with detailed errors
   - Database transaction for all-or-nothing
   - Tests for success/validation errors/duplicates

4. CLEAN-SWEEP → Clean API
   - Remove debug logs
   - Fix lint errors
   - Standardize error responses
   - api.fastify-debugger reviews

5. TEST-LOOP → Verify API
   - Unit tests: parsing, validation ✓
   - Integration tests: full flow ✓
   - Edge cases: malformed CSV, duplicates ✓
   - All passing ✓
```

**Note:** DESIGN-FLOW and BUILD-SCREEN skipped (no UI), DEPLOY-RELEASE skipped (goes to SOLUTION for next task)

---

### Scenario 3: Bug Fix

**Request:** "Login button isn't working"

**Workflow:**
```
1. SOLUTION → Understand bug
   - Button click not triggering auth
   - Success: button works, user logs in

2. PLAN → Fix approach
   - Reproduce issue
   - Check event handler
   - Verify API call
   - Fix + test

3. BUILD-SCREEN → Implement fix
   - Event handler had wrong binding
   - Fixed with useCallback

4. CLEAN-SWEEP → Clean
   - No other issues found

5. TEST-LOOP → Verify fix
   - Manual test: button works ✓
   - Regression tests: all pass ✓
```

**Note:** DESIGN-FLOW and BUILD-API skipped (simple UI fix), DEPLOY-RELEASE skipped (goes to SOLUTION for next task)

---

### Scenario 3: UI Refactor

**Request:** "Clean up the Tailwind usage on home page"

**Workflow:**
```
1. SOLUTION → Understand goal
   - Home page has long inline className strings
   - Success: component classes, consistent spacing

2. DESIGN-FLOW → Analyze current + map to standards
   - Identify controls (buttons, cards, links)
   - Map to component classes
   - Identify layout patterns

3. CLEAN-SWEEP → Refactor to standards
   - Extract component classes
   - Apply utilities for layout
   - Use cn helper for composition
   - Invoke web.react-critic for review

4. TEST-LOOP → Verify no breakage
   - Visual regression: matches ✓
   - Functional tests: all pass ✓
```

**Note:** PLAN skipped (clear task), BUILD-SCREEN skipped (pure refactor), straight to CLEAN-SWEEP

---

### Scenario 4: Database Migration

**Request:** "Add users table with email and password"

**Workflow:**
```
1. SOLUTION → Understand schema
   - Need users table for authentication
   - Success: table created, indexed, reversible

2. PLAN → Migration approach
   - Define schema (id, email, password_hash, created_at)
   - Add indexes (email unique)
   - Write up/down migration

3. BUILD-SCREEN → Create migration
   - Write migration file
   - Test up migration
   - Test down migration

4. CLEAN-SWEEP → Review migration
   - Verify reversibility
   - Check indexes
   - db.postgres-reviewer reviews

5. TEST-LOOP → Verify migration
   - Run up: success ✓
   - Run down: success ✓
   - Verify data integrity ✓
```

**Note:** DESIGN-FLOW skipped (not UI), DEPLOY-RELEASE might follow if deploying schema change

---

### Scenario 5: Performance Optimization

**Request:** "React app is rendering slowly"

**Workflow:**
```
1. SOLUTION → Analyze issue
   - Identify slow renders
   - Success: improved render performance

2. PLAN → Optimization strategy
   - Profile components
   - Add memoization
   - Optimize context
   - Verify improvements

3. BUILD-SCREEN → Implement optimizations
   - Add React.memo to expensive components
   - useCallback for callbacks
   - useMemo for derived state
   - Split large Context

4. CLEAN-SWEEP → Review patterns
   - Verify all memo usage correct
   - web.react-critic reviews

5. TEST-LOOP → Verify performance
   - Profile: 50% improvement ✓
   - Functional tests: all pass ✓
   - No regressions ✓
```

---

### Scenario 6: Security Review

**Request:** "Review auth implementation for security issues"

**Workflow:**
```
1. SOLUTION → Understand scope
   - Review auth flow for vulnerabilities
   - Success: secure auth, no gaps

2. PLAN → Review checklist
   - Check password hashing
   - Verify token validation
   - Review session management
   - Check authorization boundaries

3. BUILD-SCREEN → Fix issues
   - Add rate limiting
   - Improve token validation
   - Add audit logging

4. CLEAN-SWEEP → Security review
   - ctrl.security-reviewer reviews
   - All findings addressed

5. TEST-LOOP → Security tests
   - Penetration tests: pass ✓
   - Authorization tests: pass ✓
```

---

## Example: End-to-End Feature

### Request
"Add a user profile page where users can update their name and email"

### Workflow

#### Step 1: Solution
```
/std-solution
```

**Agent Response:**
```
# Solution Summary

**Problem**: Add user profile editing capability

**Success Criteria**:
- Users can view their current profile
- Users can update name and email
- Changes are validated and persisted
- User receives feedback on success/failure

**Constraints**:
- Must reuse existing auth context
- Must follow React + Tailwind patterns
- Must validate email format

**Approach**:
- New route `/profile`
- Profile form component
- Backend PUT /api/users/:id endpoint
- Frontend validation + backend validation
```

---

#### Step 2: Plan
```
/std-plan
```

**Agent Response:**
```
# Plan: User Profile Page

## Tasks

1. **Backend: Add profile update endpoint**
   - Route: PUT /api/users/:id
   - Validate: email format, auth
   - Tests: success, unauthorized, invalid input

2. **Frontend: Build profile page**
   - Route: /profile
   - Form with name + email
   - Loading/error/success states
   - Tests: render, submit, validation

3. **Validation**
   - Run API tests
   - Run frontend tests
   - Manual test in browser

## Dependencies
- Existing auth context
- User data structure

## Risks
- Race condition if user updates from multiple tabs
```

---

#### Step 3: Execute

**Backend:**
```
/api.fastify.add-route for PUT /api/users/:id
```

**Frontend:**
```
/web.react.build-screen for /profile
```

---

#### Step 4: Clean
```
/std-clean-sweep
```

Verifies:
- No debug code
- No unused imports
- Consistent formatting
- No lint errors

---

#### Step 5: Test
```
/std-test-loop
```

Runs:
- Backend tests
- Frontend tests
- Fixes any failures

---

#### Step 6: Verify
```
/std-verifier subagent
```

Independently checks:
- All claimed functionality works
- Tests pass
- No gaps or broken behavior

---

## Command Reference by Workflow

### Discovery & Solution
- `/std-solution` – Frame the problem and solution

### Planning
- `/std-plan` – Create execution plan

### Implementation (Stack-Specific)
- `/web.react.build-screen` – Build React UI
- `/web.next.build-screen` – Build Next.js page
- `/web.angular.template-audit` – Review Angular templates
- `/api.fastify.add-route` – Add Fastify route
- `/api.java.add-endpoint` – Add Java endpoint
- `/db.postgres.migration` – Create Postgres migration
- `/db.sqlserver.migration` – Create SQL Server migration

### Quality & Testing
- `/std-clean-sweep` – Clean and review changes
- `/std-test-loop` – Run tests and fix failures
- `/web.react.compare-screens` – Compare UI consistency
- `/db.postgres.performance-check` – Check DB performance

### Deployment
- `/std-deploy-release` – Prepare release
- `/cloud.aws.preflight` – AWS preflight checks
- `/cloud.aws.deploy` – AWS deployment
- `/cloud.gcp.preflight` – GCP preflight checks
- `/cloud.gcp.deploy` – GCP deployment

### Controls & Compliance
- `/ctrl.base.check` – Base project control checks
- `/ctrl.regulated.security-check` – Security and compliance review

---

## Subagent Reference by Purpose

### General Purpose
- `std-planner` – Converts intent to structured plan
- `std-verifier` – Validates completed work
- `std-debugger` – Root-cause analysis for failures

### Stack-Specific
- `web.react-critic` – UI consistency for React
- `web.next-critic` – Next.js architecture review
- `web.angular-critic` – Angular template review
- `api.fastify-debugger` – Fastify API debugging
- `api.java-debugger` – Java API debugging
- `db.postgres-reviewer` – Postgres migration safety
- `db.sqlserver-reviewer` – SQL Server migration safety
- `cloud.aws-release-manager` – AWS release readiness
- `cloud.gcp-release-manager` – GCP release readiness

### Control-Specific
- `ctrl.base-verifier` – Base control validation
- `ctrl.security-reviewer` – Security and compliance

---

## Tips for Effective Usage

### For Developers

1. **Start with commands** – Type `/` to see available workflows
2. **Let commands guide you** – They orchestrate rules, skills, and subagents
3. **Use solution → plan → build flow** for complex work
4. **Invoke critics and reviewers** when quality matters

### For AI Agents

1. **Commands are entry points** – Read command files to understand workflow
2. **Rules constrain behavior** – Check which rules apply to current file
3. **Skills provide guidance** – Reference skills mentioned in commands
4. **Subagents provide perspective** – Delegate when specialized view helps

### For Teams

1. **Extend modules, don't fork** – Add new stack authorities as modules
2. **Namespace everything** – Commands, rules, skills all use prefixes
3. **Document decisions** – Use ADR template for significant choices
4. **Share back to this repo** – Contribute improvements to modules

---

## Troubleshooting

### "Agent isn't following my standards"

1. Check rule is in `.cursor/rules/`
2. Verify `alwaysApply: true` or matching `globs` pattern
3. Confirm rule is short and enforceable (not guidance)
4. Move detailed guidance to a skill

### "Command doesn't do what I expect"

1. Read the command file in `.cursor/commands/`
2. Check which skills and subagents it references
3. Update command file to match expectations
4. Test with `/command-name` invocation

### "Skills aren't being used"

1. Verify skill is in `.cursor/skills/*/SKILL.md`
2. Check description is clear about when to use
3. Try explicit mention in command or chat
4. Consider `disable-model-invocation: false` in frontmatter

### "Subagent never triggers"

1. Check description is clear and specific
2. Try explicit invocation: `/subagent-name`
3. Verify subagent file is in `.cursor/agents/`
4. Check name matches filename

---

## Module Development Workflow

### Creating a New Stack Authority

1. **Create module structure:**
   ```
   modules/stack-authorities/category/stack-name/
     cursor/
       rules/
       commands/
       skills/
       agents/
     README.md
   ```

2. **Define rules** (constraints):
   - What must be true?
   - What is forbidden?
   - Keep each rule < 50 lines

3. **Create commands** (workflows):
   - What are common actions?
   - What steps does workflow follow?
   - Which skills and subagents help?

4. **Write skills** (guidance):
   - How do we do this correctly?
   - Include examples and rationale
   - Link to references if needed

5. **Add subagents** (specialists):
   - What perspectives help?
   - Critic? Debugger? Reviewer?

6. **Test in example project:**
   - Copy to `examples/` folder
   - Build sample `.cursor/` output
   - Verify commands work end-to-end

---

## Real-World Scenarios

### Scenario 1: Bug Fix

**User:** "Login button isn't working"

**Workflow:**
1. Agent auto-invokes `std-debugger` subagent
2. Debugger reproduces issue and identifies root cause
3. Agent fixes issue
4. `/std-test-loop` verifies fix
5. `/std-clean-sweep` ensures clean state

### Scenario 2: New Feature

**User:** "Add shopping cart"

**Workflow:**
1. `/std-solution` – Frame the feature
2. `/std-plan` – Break into tasks
3. Execute with stack commands
4. `/std-verifier` validates completeness
5. `/std-deploy-release` prepares for prod

### Scenario 3: Refactor

**User:** "Clean up the Tailwind usage on home page"

**Workflow:**
1. `/web.react.compare-screens` – Analyze current state
2. `/web.react.tailwind-refactor` – Refactor to standards
3. `/web.react-critic` – Review consistency
4. `/std-test-loop` – Verify no breakage

### Scenario 4: Security Review

**User:** "Review auth implementation for security"

**Workflow:**
1. `/ctrl.regulated.security-check` – Run security audit
2. `ctrl.security-reviewer` subagent reviews code
3. Agent addresses findings
4. Re-run until clean

---

## Summary

**The system is compositional:**
- Commands orchestrate
- Rules constrain
- Skills teach
- Subagents specialize

**The flow is predictable:**
1. User invokes command (or agent suggests one)
2. Command references skills and rules
3. Agent follows guidance and constraints
4. Subagents provide specialized perspective
5. User receives consistent, quality output

**The result is reusable:**
- Modules are portable across projects
- Teams share and improve standards
- Cursor behavior becomes deterministic
- Engineering judgment is codified
