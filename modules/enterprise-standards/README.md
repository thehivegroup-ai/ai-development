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
- `01-std-solution-hermeneutic.mdc` – Solution framing constraints (hermeneutic circle)
- `02-std-planning-teleological.mdc` – Planning constraints (teleological planning)
- `03-std-quality-clean-test-deploy.mdc` – Quality gates and testing
- `04-std-environment-config.mdc` – Environment variable and secrets management
- `05-std-documentation-organization.mdc` – Documentation structure (docs/, memory-bank/, lifecycle)
- `06-std-workflow-modes.mdc` – 9-mode workflow: SOLUTION → PLAN → DESIGN-FLOW → DESIGN-REVIEW → BUILD-SCREEN → BUILD-API → CLEAN-SWEEP → TEST-LOOP → DEPLOY-RELEASE
- `07-std-evidence-based-claims.mdc` – Evidence requirements for success claims
- `08-std-security-practices.mdc` – Security constraints for PHI, PII, secrets, OWASP, HIPAA, GDPR

### Skills (invocable via `/skill-name`)

- `std-solution/` – Frame problems using hermeneutic approach
- `std-plan/` – Create execution plans using teleological planning
- `std-design-review/` – Evaluate UI against usability heuristics and visual design principles
- `std-clean-sweep/` – Clean and review changes
- `std-test-loop/` – Run tests and fix failures
- `std-deploy-release/` – Prepare release checklist

### Skills (teaching/reference)

- `hermeneutic-solution/` – How to interpret user intent and frame solutions
- `teleological-planning/` – How to create outcome-driven plans
- `heuristic-design-review/` – How to evaluate UI design quality using heuristics
- `engineering-hygiene/` – How to ensure quality before handoff
- `modern-frontend-architecture/` – Modern frontend architecture principles (state, components, performance, a11y, design system, types, progressive enhancement)
- `security-review/` – How to perform deep security analysis for PHI/PII features (STRIDE threat modeling, data flow mapping, compliance checklists)

### Agents

- `std-planner.md` – Planning specialist subagent
- `std-verifier.md` – Quality verification subagent
- `std-debugger.md` – Root-cause analysis subagent
- `ux-heuristic-evaluator.md` – Usability heuristic evaluator
- `ux-visual-design-critic.md` – Visual design principles evaluator
- `ux-platform-evaluator.md` – Platform compliance checker
- `ux-accessibility-auditor.md` – Accessibility auditor
- `security-critic.md` – Adversarial security reviewer (challenges auth, encryption, compliance)

### Hooks

- `phi-pii-scanner.sh` – Real-time detection of PHI/PII patterns in code (afterFileEdit)
- `security-audit.sh` – Pre-commit comprehensive security checklist (manual invocation)
- `secrets-scanner.sh` – Detects hardcoded secrets (afterFileEdit)
- `hygiene-watchdog.sh` – Detects debug artifacts and incomplete code (afterFileEdit)
- `git-guard.sh` – Prevents AI from performing git operations (beforeShellExecution)

### Documentation

See `docs/security/` for comprehensive security standards documentation:
- **README.md** – Security standards overview and usage guide
- **QUICK-START.md** – 5-minute quick start guide with examples
- **IMPLEMENTATION.md** – Implementation details and file structure
