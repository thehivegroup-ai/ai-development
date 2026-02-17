# AI Development – Cursor-Centric Architecture

This document defines **how Commands, Rules, Skills, and Subagents work together** in the **AI Development repository** to enable reusable, consistent development workflows across many projects.

The goal is **structure, composability, and reuse** — not governance, enforcement, or automation (yet).

---

## 1. Core Mental Model

Cursor features map to **four distinct responsibilities**:

| Construct  | Responsibility | What it is | What it is NOT |
|----------|----------------|------------|----------------|
| **Rule** | Constraints | Enforceable standards | Tutorials, debates |
| **Command** | Rituals | Repeatable prompts | One-off chats |
| **Skill** | Playbooks | How-to guidance | Hard constraints |
| **Subagent** | Specialization | Delegated perspective | Default execution |

Each construct does **one job**.  
Together, they encode *how we think and build*.

---

## 2. Repository Structure (High-Level)

```
ai-development/
  modules/
    enterprise-standards/
    stack-authorities/
    project-controls/
```

Each module is **self-contained** and provides a `cursor/` payload:

```
<module>/
  cursor/
    rules/
    commands/
    skills/
    agents/
```

Modules are **composed**, not merged logically.  
Projects physically copy or sync module contents into their `.cursor/`.

---

## 3. Module Types and Responsibilities

### 3.1 Enterprise Standards Module

**Purpose:**  
Define *how the organization thinks about building software*.

**Characteristics:**
- Technology-agnostic
- Stable over time
- Applies to every project

**Typical contents:**

#### Rules
- Engineering hygiene
- Logging and error handling expectations
- Required planning and testing behaviors
- Phase structure (Solution → Design → Build → Clean → Test → Deploy)

Rules here never mention React, AWS, databases, etc.

#### Commands
- `/std-solution` – hermeneutic interpretation
- `/std-plan` – teleological planning
- `/std-clean-sweep`
- `/std-test-loop`
- `/std-deploy-release`

These commands define **how work starts and progresses**, not how tech is implemented.

#### Skills
- Hermeneutic solution framing
- Teleological planning
- Engineering hygiene
- Phase expectations

Skills explain *how to think and work*, not what tools to use.

#### Subagents
- `std-planner` – converts intent into structured plans
- `std-verifier` – validates outcomes against expectations
- `std-debugger` – focuses on root cause analysis

---

### 3.2 Stack Authorities Modules

**Purpose:**  
Define **the correct way to use a specific technology stack**.

Each stack authority is opinionated and scoped.

Examples:
- `frontend/react-tailwind`
- `frontend/next-tailwind`
- `backend/node-fastify`
- `database/postgres`
- `cloud/aws`

---

#### Stack Authority Rules

Rules answer: **“What must be true in this stack?”**

Examples:
- How Tailwind is structured (Utility vs Control vs Component)
- Where variant logic must live
- Forbidden patterns (inline conditional class sprawl, ad-hoc API errors)
- Required libraries or patterns

Rules are:
- Short
- Enforceable
- Scoped by folder (e.g., `/apps/web/**`, `/services/api/**`)

---

#### Stack Authority Commands

Commands answer: **“What are the standard actions in this stack?”**

Examples:
- `/web.react.build-screen`
- `/web.react.compare-screens`
- `/api.fastify.add-route`
- `/db.postgres.migration`
- `/cloud.aws.preflight`

Commands orchestrate:
- existing standards
- skills
- subagents

They are the **entry points** developers actually use.

---

#### Stack Authority Skills

Skills answer: **“How do we do this correctly?”**

Examples:
- Tailwind Utility / Control / Component taxonomy
- React component composition patterns
- Next.js routing and server/client boundaries
- Fastify plugin and route structure
- Postgres migrations and indexing strategies

Skills:
- Contain examples
- Explain rationale
- May evolve faster than rules

Rules often say:
> “Follow the `<skill-name>` skill.”

---

#### Stack Authority Subagents

Subagents answer: **“Who should look at this?”**

Examples:
- `web.react-critic` – UI consistency, Tailwind usage
- `api.fastify-debugger` – API-specific debugging
- `db.postgres-reviewer` – schema and migration sanity
- `cloud.aws-release-manager` – deploy readiness

Subagents are **perspectives**, not replacements.

---

### 3.3 Project Controls Modules

**Purpose:**  
Apply **cross-cutting constraints** independent of technology.

Examples:
- `base`
- `regulated`
- `high-scale`
- `internal-tools`

---

#### Project Control Rules
- Additional checks (security, compliance, documentation)
- Process requirements (extra validation, stricter testing)
- Overrides of defaults (never removing enterprise standards)

#### Project Control Commands
- `/ctrl.base.check`
- `/ctrl.regulated.security-check`

These commands layer *additional rituals* on top of standard workflows.

#### Project Control Skills
- Compliance guidance
- Delivery constraints
- Domain-specific expectations

#### Project Control Subagents
- Security reviewer
- Compliance checker
- Risk assessor

---

## 4. How the Constructs Work Together

### 4.1 The Execution Flow

A typical workflow looks like:

1. **Command invoked**
   - `/std-solution`
   - `/web.react.build-screen`

2. **Rules constrain behavior**
   - What patterns are allowed
   - What must be produced
   - What is forbidden

3. **Skills provide guidance**
   - How to structure components
   - How to apply Tailwind
   - How to design APIs

4. **Subagents review or assist**
   - Validate assumptions
   - Check consistency
   - Surface risks or gaps

Commands **trigger**.  
Rules **constrain**.  
Skills **teach**.  
Subagents **specialize**.

---

### 4.2 Rules vs Skills (Important Boundary)

| If the content… | It belongs in… |
|-----------------|---------------|
| Must always be followed | Rule |
| Explains how or why | Skill |
| Is optional guidance | Skill |
| Blocks incorrect output | Rule |

If a rule becomes long → it should be split:
- Rule: “You must do X”
- Skill: “Here’s how to do X”

---

### 4.3 Commands as the User Interface

Developers should not need to:
- remember standards
- remember file locations
- remember process steps

Commands:
- encapsulate workflows
- invoke the right skills
- optionally call subagents

Commands are the **primary developer touchpoint**.

---

## 5. Composition Across Projects

Projects consume modules by **copying their `cursor/` contents** into `.cursor/`.

Recommended composition order:
1. Enterprise Standards
2. Project Controls
3. Stack Authorities

Rules are ordered numerically to ensure precedence:
- `00-*` → enterprise
- `20–50-*` → stacks
- `90-*` → project controls

Commands and skills are namespaced to avoid collisions.

---

## 6. Naming Conventions (Required for Scale)

### Commands
```
std.*
web.react.*
web.next.*
web.angular.*
api.fastify.*
db.postgres.*
cloud.aws.*
ctrl.*
```

### Rules
```
00-std-*
20-web-*
30-api-*
40-db-*
50-cloud-*
90-ctrl-*
```

### Skills
- One folder per concern
- Named after the practice, not the tool

### Subagents
- Named after their perspective, not their power
  - `*-critic`
  - `*-reviewer`
  - `*-debugger`

---

## 7. Why This Structure Works

- **Reusable** – modules are copyable and composable
- **Scalable** – new stacks don’t disturb existing ones
- **Predictable** – Cursor behavior becomes deterministic
- **Shareable** – teams can contribute modules back
- **Tool-aligned** – fits how Cursor actually works

This is not configuration sprawl.

This is **codified engineering judgment**, modularized.

---

## 8. Non-Goals (For Now)

This architecture explicitly does **not** cover:
- Governance
- Review workflows
- CI enforcement
- Version pinning
- Drift detection

Those can be layered later **without changing this structure**.

---

## 9. Summary

This repository:
- Encodes *how we think*
- Encodes *how we build*
- Keeps rules enforceable
- Keeps guidance reusable
- Keeps workflows repeatable

Cursor becomes the **execution surface** for a shared development language.
