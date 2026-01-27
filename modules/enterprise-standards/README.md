# Enterprise Standards

Technology-agnostic standards that define how we think, plan, execute, and verify
work across all projects.

## Purpose

- Encode shared engineering judgment and workflow rituals.
- Keep rules short and enforceable, push guidance into skills.
- Provide subagents for planning, verification, and debugging.

## Contents

### Rules

- `00-std-foundation.mdc` – Foundational constraints (commands, git, secrets, errors)
- `01-std-solution-hermeneutic.mdc` – Solution framing constraints
- `02-std-planning-teleological.mdc` – Planning constraints
- `03-std-quality-clean-test-deploy.mdc` – Quality gates and testing
- `04-std-environment-config.mdc` – Environment variable and secrets management
- `05-std-documentation-organization.mdc` – Documentation structure (docs/, memory-bank/, lifecycle)
- `06-std-workflow-modes.mdc` – Extended 8-mode workflow: SOLUTION → PLAN → DESIGN-FLOW → BUILD-SCREEN → BUILD-API → CLEAN-SWEEP → TEST-LOOP → DEPLOY-RELEASE

### Commands

- `std.solution.md` – Frame problems using hermeneutic approach
- `std.plan.md` – Create execution plans using teleological planning
- `std.clean-sweep.md` – Clean and review changes
- `std.test-loop.md` – Run tests and fix failures
- `std.deploy-release.md` – Prepare release checklist

### Skills

- `hermeneutic-solution/` – How to interpret user intent and frame solutions
- `teleological-planning/` – How to create outcome-driven plans
- `engineering-hygiene/` – How to ensure quality before handoff

### Agents

- `std.planner.md` – Planning specialist subagent
- `std.verifier.md` – Quality verification subagent
- `std.debugger.md` – Root-cause analysis subagent
