# Legacy Rules Mapping

This document shows how legacy rules from `docs/legacy/` are transformed into the new Cursor-centric structure.

---

## Core Rules Mapping

### From `docs/legacy/core rules/core.mdc`

**Legacy Pattern:** SOLUTION → PLAN → ACT → CLEAN mode state machine

**Extended to:** SOLUTION → PLAN → DESIGN-FLOW → BUILD-SCREEN → BUILD-API → CLEAN-SWEEP → TEST-LOOP → DEPLOY-RELEASE (8 modes)

**New Location:**

| Legacy Concept | Extended Mode | New Rule/Command | File |
|----------------|---------------|------------------|------|
| SOLUTION mode (hermeneutic circle) | **SOLUTION** mode | `/std.solution` command + rule | `modules/enterprise-standards/cursor/commands/std.solution.md` |
|  |  | Constraint rule | `modules/enterprise-standards/cursor/rules/01-std-solution-hermeneutic.mdc` |
|  |  | Guidance skill | `modules/enterprise-standards/cursor/skills/hermeneutic-solution/SKILL.md` |
| PLAN mode (teleological planning) | **PLAN** mode | `/std.plan` command + rule | `modules/enterprise-standards/cursor/commands/std.plan.md` |
|  |  | Constraint rule | `modules/enterprise-standards/cursor/rules/02-std-planning-teleological.mdc` |
|  |  | Guidance skill | `modules/enterprise-standards/cursor/skills/teleological-planning/SKILL.md` |
|  |  | Specialist subagent | `modules/enterprise-standards/cursor/agents/std.planner.md` |
| ACT mode (implementation) | **DESIGN-FLOW** mode (UI design) | Stack UI commands | `modules/stack-authorities/frontend/*/cursor/commands/*.md` |
|  | **BUILD-SCREEN** mode (frontend) | Stack UI build commands | `modules/stack-authorities/frontend/*/cursor/commands/*.md` |
|  | **BUILD-API** mode (backend) | Stack API build commands | `modules/stack-authorities/backend/*/cursor/commands/*.md` |
|  |  |  | `modules/stack-authorities/database/*/cursor/commands/*.md` |
| CLEAN mode | **CLEAN-SWEEP** mode | `/std.clean-sweep` command + rule | `modules/enterprise-standards/cursor/commands/std.clean-sweep.md` |
|  |  | Constraint rule | `modules/enterprise-standards/cursor/rules/03-std-quality-clean-test-deploy.mdc` |
|  |  | Guidance skill | `modules/enterprise-standards/cursor/skills/engineering-hygiene/SKILL.md` |
|  |  | Verification subagent | `modules/enterprise-standards/cursor/agents/std.verifier.md` |
| (implicit) | **TEST-LOOP** mode | `/std.test-loop` command | `modules/enterprise-standards/cursor/commands/std.test-loop.md` |
|  |  | Stack test commands | `modules/stack-authorities/*/cursor/commands/*test*.md` |
|  |  | Debugger subagent | `modules/enterprise-standards/cursor/agents/std.debugger.md` |
| (implicit) | **DEPLOY-RELEASE** mode | `/std.deploy-release` command | `modules/enterprise-standards/cursor/commands/std.deploy-release.md` |
|  |  | Stack deploy commands | `modules/stack-authorities/cloud/*/cursor/commands/*.md` |
|  |  | Release manager subagents | `modules/stack-authorities/cloud/*/cursor/agents/*.md` |
| Mode state machine | Extended 8-mode workflow | Full workflow mode system | `modules/enterprise-standards/cursor/rules/06-std-workflow-modes.mdc` |
| Mode headers (`# Mode: SOLUTION`) | Extended mode headers | Mode output format | `modules/enterprise-standards/cursor/rules/06-std-workflow-modes.mdc` |
| User triggers (PLAN, ACT, CLEAN) | Extended triggers | Mode transition keywords | `modules/enterprise-standards/cursor/rules/06-std-workflow-modes.mdc` |

**Key Transformation:**
- **Legacy:** 4 modes (SOLUTION → PLAN → ACT → CLEAN)
- **New:** 8 modes with frontend/backend separation
- **Benefits:** 
  - More granular control
  - Explicit UI design phase (DESIGN-FLOW)
  - Separate build modes: BUILD-SCREEN (frontend) and BUILD-API (backend)
  - Explicit testing phase (TEST-LOOP)
  - Explicit deployment phase (DEPLOY-RELEASE)
  - Support for parallel/sequential work (UI + API)
  - Mode skipping for simple tasks

---

### From `docs/legacy/core rules/documentation.mdc`

**Legacy Pattern:** Documentation organization standards

**New Location:**

| Legacy Concept | New Rule | File |
|----------------|----------|------|
| `docs/` vs `memory-bank/` structure | Documentation organization | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| Planning → Current → Completed lifecycle | Documentation lifecycle | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| Todo lists in plan documents | Todo list management | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| File status headers (Draft, Active, etc.) | File header requirements | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| File moving with `mv` command | File moving rules | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| No markdown in root directory | Root directory rules | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| `.temp/` for temporary files | Temporary file rules | `modules/enterprise-standards/cursor/rules/00-std-foundation.mdc` + `05-std-documentation-organization.mdc` |

**Key Transformation:**
- **Legacy:** Comprehensive documentation guide (621 lines)
- **New:** Distilled into enforceable constraints in rule file

---

### From `docs/legacy/core rules/environment.mdc`

**Legacy Pattern:** Environment variable and secrets management

**New Location:**

| Legacy Concept | New Rule | File |
|----------------|----------|------|
| Never commit secrets | Environment configuration | `modules/enterprise-standards/cursor/rules/04-std-environment-config.mdc` |
| `.env.example` templates | Environment configuration | `modules/enterprise-standards/cursor/rules/04-std-environment-config.mdc` |
| Naming conventions (SCREAMING_SNAKE_CASE) | Environment configuration | `modules/enterprise-standards/cursor/rules/04-std-environment-config.mdc` |
| Loading and validation patterns | Environment configuration | `modules/enterprise-standards/cursor/rules/04-std-environment-config.mdc` |
| Security requirements | Environment configuration | `modules/enterprise-standards/cursor/rules/04-std-environment-config.mdc` |

**Key Transformation:**
- **Legacy:** Detailed guide with examples (389 lines)
- **New:** Enforceable constraints with key patterns in rule file

---

### From `docs/legacy/core rules/progress.md`

**Legacy Pattern:** Phase tracking and progress reporting

**New Location:**

| Legacy Concept | New Implementation | File |
|----------------|-------------------|------|
| Todo lists with status | Todo list management | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| Phase completion tracking | Documentation lifecycle | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |
| Status reporting | Todo list format | `modules/enterprise-standards/cursor/rules/05-std-documentation-organization.mdc` |

---

## Angular Rules Mapping

### From `docs/legacy/angular rules/forms-validation.mdc`

**Legacy Pattern:** Angular reactive forms with validation

**New Location:**

| Legacy Concept | New Skill | File |
|----------------|-----------|------|
| Typed reactive forms | Angular forms validation skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-forms-validation/SKILL.md` |
| Custom validators | Angular forms validation skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-forms-validation/SKILL.md` |
| Real-time updates with Signals | Angular forms validation skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-forms-validation/SKILL.md` |
| Multi-step form patterns | Angular forms validation skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-forms-validation/SKILL.md` |
| Form state services | Angular forms validation skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-forms-validation/SKILL.md` |
| Reusable form components | Angular forms validation skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-forms-validation/SKILL.md` |

**Key Transformation:**
- **Legacy:** Rule file (711 lines) with comprehensive examples
- **New:** Skill file (how-to guidance) + Rule file (constraints)

---

### From `docs/legacy/angular rules/data-integration.mdc`

**Legacy Pattern:** Angular HttpClient and data integration

**New Location:**

| Legacy Concept | New Skill | File |
|----------------|-----------|------|
| HttpClient with Signals | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |
| Service pattern | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |
| Loading/error state management | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |
| Optimistic updates | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |
| Pagination | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |
| File upload with progress | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |
| HTTP interceptors | Angular data integration skill | `modules/stack-authorities/frontend/angular-tailwind/cursor/skills/angular-data-integration/SKILL.md` |

**Key Transformation:**
- **Legacy:** Rule file (624 lines) with detailed patterns
- **New:** Skill file (how-to guidance) + Rule file (constraints)

---

### From `docs/legacy/angular rules/test-data-attributes.mdc`

**Legacy Pattern:** `data-testid` attributes for E2E testing

**New Location:**

| Legacy Concept | New Rule | File |
|----------------|----------|------|
| `data-testid` requirements | Angular Tailwind constraints | `modules/stack-authorities/frontend/angular-tailwind/cursor/rules/22-web-angular-tailwind.mdc` |
| Where to add test IDs | Angular Tailwind constraints | `modules/stack-authorities/frontend/angular-tailwind/cursor/rules/22-web-angular-tailwind.mdc` |

---

## React Rules Mapping

### From `docs/legacy/react.mdc`, `ui-structure.mdc`, `tailwind-4-patterns.mdc`

**Legacy Pattern:** React + Tailwind patterns

**New Location:**

| Legacy Concept | New Rule/Skill | File |
|----------------|----------------|------|
| Component/utility architecture | React Tailwind rule | `modules/stack-authorities/frontend/react-tailwind/cursor/rules/20-web-react-tailwind.mdc` |
| Component classes via `@apply` | React Tailwind conventions skill | `modules/stack-authorities/frontend/react-tailwind/cursor/skills/react-tailwind-conventions/SKILL.md` |
| `cn` helper pattern | React Tailwind conventions skill | `modules/stack-authorities/frontend/react-tailwind/cursor/skills/react-tailwind-conventions/SKILL.md` |
| Variant props pattern | React Tailwind conventions skill | `modules/stack-authorities/frontend/react-tailwind/cursor/skills/react-tailwind-conventions/SKILL.md` |
| Memoization requirements | React component standards skill | `modules/stack-authorities/frontend/react-tailwind/cursor/skills/react-component-standards/SKILL.md` |
| Context provider patterns | React component standards skill | `modules/stack-authorities/frontend/react-tailwind/cursor/skills/react-component-standards/SKILL.md` |
| Hook dependencies | React component standards skill | `modules/stack-authorities/frontend/react-tailwind/cursor/skills/react-component-standards/SKILL.md` |

---

## API Rules Mapping

### From `docs/legacy/api.mdc`

**Legacy Pattern:** API development standards

**New Location:**

| Legacy Concept | New Rule | File |
|----------------|----------|------|
| Schema validation | Fastify API rule | `modules/stack-authorities/backend/node-fastify/cursor/rules/30-api-node-fastify.mdc` |
| Error envelopes | Fastify API rule | `modules/stack-authorities/backend/node-fastify/cursor/rules/30-api-node-fastify.mdc` |
| Status codes | Fastify API rule | `modules/stack-authorities/backend/node-fastify/cursor/rules/30-api-node-fastify.mdc` |
| Service layer pattern | Fastify API standards skill | `modules/stack-authorities/backend/node-fastify/cursor/skills/fastify-api-standards/SKILL.md` |

---

## Node.js Rules Mapping

### From `docs/legacy/nodejs.mdc`

**Legacy Pattern:** Node.js/npm standards

**New Location:**

| Legacy Concept | New Rule | File |
|----------------|----------|------|
| Non-interactive command execution | Fastify API rule | `modules/stack-authorities/backend/node-fastify/cursor/rules/30-api-node-fastify.mdc` |

---

## Transformation Pattern Summary

### Rules (Constraints)
- **What:** Enforceable "must" and "must not" statements
- **Size:** Short (< 50 lines typically)
- **Examples:** "Never commit secrets", "Add `data-testid` to interactive elements"

### Commands (Workflows)
- **What:** Repeatable workflow entry points
- **Trigger:** User types `/command-name`
- **Examples:** `/std.solution`, `/web.react.build-screen`, `/db.postgres.migration`

### Skills (Guidance)
- **What:** How-to guidance with examples and patterns
- **Size:** Comprehensive (100-300+ lines with examples)
- **Examples:** Form validation patterns, data integration patterns, Tailwind architecture

### Subagents (Specialists)
- **What:** Specialized AI perspectives
- **Trigger:** Agent delegates or command invokes
- **Examples:** `std.planner`, `std.verifier`, `web.react-critic`

---

## What's Not Yet Mapped

The following legacy files have **not been fully transformed** yet:

- `docs/legacy/security.mdc` – Should become `modules/project-controls/regulated/` content
- `docs/legacy/performance.mdc` – Should be integrated into stack authority skills
- `docs/legacy/typescript.mdc` – Should be integrated into stack authority rules/skills
- Additional framework-specific patterns

These can be added as needed when teams require them.

---

## How to Use This Mapping

When you need a pattern from the legacy rules:

1. Check this mapping document
2. Find the new location (rule/command/skill/subagent)
3. If not yet mapped, create it in the appropriate module
4. Follow the transformation pattern (constraints → rules, guidance → skills)

---

## Summary

**Transformation Philosophy:**

| Legacy Approach | New Approach |
|----------------|--------------|
| Large rule files with everything | Small rule files (constraints only) |
| Guidance mixed with rules | Guidance moved to skills |
| No workflow entry points | Commands provide workflow entry points |
| No specialization | Subagents provide expert perspectives |
| Flat structure | Modular, composable structure |

**Result:** More maintainable, discoverable, and composable system.
