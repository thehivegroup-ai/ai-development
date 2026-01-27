# Hermeneutic Circle: Conceptual Framework

This document explains how Heidegger's hermeneutic circle is operationalized in this system through Commands, Rules, Skills, and Subagents.

---

## 1. Design Goal

Turn Heidegger's hermeneutic circle from a philosophical idea into a **repeatable interpretation system** that:

- ✅ Prevents premature solutions
- ✅ Makes assumptions explicit
- ✅ Allows understanding to evolve without chaos
- ✅ Produces a stable, shared interpretation of:
  - The problem
  - The desired outcome
  - Success criteria

---

## 2. Conceptual Mapping

| Heidegger Concept | Cursor Construct | Purpose |
|-------------------|------------------|---------|
| **Pre-understanding** (Fore-structures) | **Rules** | Force acknowledgment of assumptions |
| **Interpretive act** | **Command** | Trigger structured interpretation |
| **Interpretive method** | **Skill** | Teach how to interpret correctly |
| **Perspective testing** | **Subagent** | Challenge and refine interpretation |

---

## 3. Rules: Enforcing Interpretive Discipline

### Purpose

Rules ensure **no solution work begins without interpretation**.

### Implementation

**File:** `modules/enterprise-standards/cursor/rules/01-std-solution-hermeneutic.mdc`

**What it enforces:**
```
Every problem must produce explicit artifacts:
1. Problem statement (current best interpretation)
2. Desired outcome (provisional, observable)
3. Stated assumptions (what we're taking for granted)
4. Known constraints (what limits our options)
5. Open questions (what would change our understanding)
6. Success criteria (how we'll know we succeeded)

Solutions may not be proposed until interpretation is documented.
Re-interpretation is expected when new evidence appears.
```

### What Rules Do

- ✅ Enforce sequence (interpret → then plan/build)
- ✅ Prevent skipping the interpretive phase
- ✅ Normalize revision of understanding

### What Rules Do NOT Do

- ❌ Rules do NOT explain how to interpret (Skills do this)
- ❌ Rules do NOT provide the method (Commands do this)
- ❌ Rules do NOT test interpretation (Subagents do this)

**Rules only require that interpretation happens.**

---

## 4. Command: Triggering the Hermeneutic Cycle

### Purpose

Commands act as the **entry point into interpretation**.

### Implementation

**File:** `modules/enterprise-standards/cursor/commands/std.solution.md`

**Command:** `/std.solution`

### What the Command Does

1. Initiates a structured hermeneutic pass
2. Asks for interpretation, not solutions
3. Produces concrete artifacts (problem framing)
4. Prevents jumping to implementation

### Command Responsibilities

- Ask the right questions in the right order
- Guide through the three fore-structures:
  - **Fore-having** (context)
  - **Fore-sight** (assumptions)
  - **Fore-conception** (language)
- Invoke supporting skills and subagents
- Enforce the part ↔ whole loop

### Typical Output

```markdown
# Solution Interpretation

## Problem Statement
[In user's terms]

## Desired Outcome
[Observable, provisional]

## Assumptions
[Explicit pre-understanding]

## Constraints
[What limits us]

## Open Questions
[What would change understanding]

## Success Criteria
[Observable, measurable]
```

---

## 5. Skill: Teaching the Hermeneutic Method

### Purpose

Skills encode **how to interpret well**.

### Implementation

**File:** `modules/enterprise-standards/cursor/skills/hermeneutic-solution/SKILL.md`

**Skill:** `hermeneutic-solution`

### What the Skill Contains

1. **Explanation of the hermeneutic circle**
   - Part ↔ whole tension
   - Interpretive loop
   - Stability vs perfection

2. **The three fore-structures:**
   - **Fore-having** (context) → Background we bring
   - **Fore-sight** (expectations) → Assumptions we bring
   - **Fore-conception** (language) → Conceptual framework we use

3. **Step-by-step interpretive loop:**
   - Gather context
   - Make assumptions explicit
   - Clarify language
   - Interpret problem
   - Define outcome
   - Identify constraints/unknowns
   - Challenge interpretation
   - Stabilize or loop

4. **Examples:**
   - Good vs bad interpretations
   - Common failure modes
   - Real project examples

5. **Required artifacts:**
   - Explicit document format
   - What must be captured

### Skill Responsibilities

- Provide depth and rationale
- Standardize interpretation quality
- Keep rules concise (rules reference skills)
- Enable team learning

### Rules May Say

"Follow the `hermeneutic-solution` skill."

---

## 6. Subagents: Challenging and Refining Interpretation

### Purpose

Subagents provide **independent perspectives** that test the interpretation.

They embody the **part ↔ whole tension**.

### Implementation

#### std.planner

**File:** `modules/enterprise-standards/cursor/agents/std.planner.md`

**Role:** Tests interpretation from **feasibility perspective**

**Questions it asks:**
- Can this be planned from?
- What's too vague to execute?
- What dependencies are unclear?
- Are success criteria measurable?

**Output:**
- Flags ambiguity that blocks planning
- Identifies missing information
- Surfaces feasibility issues
- Challenges assumptions that affect execution

---

#### std.verifier

**File:** `modules/enterprise-standards/cursor/agents/std.verifier.md`

**Role:** Tests interpretation from **consistency perspective**

**Questions it asks:**
- Does this interpretation hold together?
- Do the parts support the whole?
- Does this explain observed evidence?
- Are there contradictions?

**Output:**
- Checks internal consistency
- Identifies contradictions or vague claims
- Questions assumptions without evidence
- Proposes alternative interpretations

---

#### Domain Critics (Optional)

**Examples:**
- `web.react-critic` – Challenges from UI perspective
- `api.fastify-debugger` – Challenges from backend perspective
- `ctrl.security-reviewer` – Challenges from security perspective

**Role:** Challenge assumptions from **domain-specific perspective**

**Questions they ask:**
- Does this match reality in [domain]?
- Are we missing domain-specific context?
- What domain constraints apply?

---

### Subagent Responsibilities

- ✅ Surface hidden assumptions
- ✅ Stress-test the interpretation
- ✅ Force refinement before execution

### What Subagents Do NOT Do

- ❌ **They do not decide** – They critique
- ❌ **They do not execute** – They challenge
- ❌ **They do not accept** – They question

---

## 7. The Hermeneutic Loop as a System

### Step-by-Step Flow

```
1. Command invoked
   └─> /std.solution

2. Rules activate
   └─> Interpretation required
   └─> No solutions yet
   └─> Assumptions must be explicit

3. Skill applied
   └─> Guides interpretation using fore-structures
   └─> Shapes output format and quality
   └─> Produces artifacts

4. Subagents review
   └─> std.planner challenges from feasibility
   └─> std.verifier challenges from consistency
   └─> Domain critics challenge from expertise

5. Interpretation revised
   └─> Problem and outcome refined
   └─> Language clarified
   └─> Scope adjusted
   └─> Assumptions tested

6. Loop repeats
   └─> Until interpretation is stable enough to plan

7. Transition to planning
   └─> Only when interpretation survives challenges
   └─> Artifacts become inputs to /std.plan
```

---

## 8. Artifacts Produced (Critical)

### Why Artifacts Matter

Interpretation is **not just thinking** – it must produce **explicit artifacts**.

### Required Artifacts

Every hermeneutic interpretation produces:

```markdown
# Solution Interpretation

**Last Updated:** YYYY-MM-DD  
**Status:** Stable | Evolving

## Context (Fore-Having)
[Background, history, current state]

## Assumptions (Fore-Sight)
- [What we're assuming]
- [What we're taking for granted]

## Definitions (Fore-Conception)
- **Term**: Meaning in this context

## Problem Statement
[Current best interpretation in user's terms]

## Desired Outcome
[Observable, provisional future state]

## Success Criteria
- [Observable criterion 1]
- [Observable criterion 2]

## Constraints
- [What limits our options]

## Open Questions
- [What would change interpretation]

## Non-Goals
- [What we're NOT doing]

## Challenges & Responses
- [How interpretation was tested and refined]
```

### What Artifacts Enable

- ✅ **Inputs to planning** – Plan uses interpretation as foundation
- ✅ **References during build** – Team returns to interpretation when unclear
- ✅ **Anchors when scope shifts** – New evidence triggers re-interpretation, not chaos
- ✅ **Traceability** – Decisions are traceable to interpretation
- ✅ **Team alignment** – Shared understanding documented

---

## 9. Why This Works in Practice

### Without This System

| Problem | Why It Happens |
|---------|----------------|
| "Requirements keep changing" | Interpretation never stabilized |
| Teams argue about solutions | Different interpretations, never aligned |
| Problems treated as fixed objects | No room for evolution |
| Reinterpretation feels like failure | Not built into process |

### With This System

| Benefit | How It Works |
|---------|--------------|
| Understanding evolves contextually | Part ↔ whole loop allows revision |
| Changes are traceable | Artifacts show what changed and why |
| Decisions align with reality | Interpretation tested by subagents |
| Solutions match actual problems | Interpretation precedes solution |

---

## 10. Key Design Principle

> **The hermeneutic circle is not a meeting.**  
> **It is a repeatable interpretive machine.**

- **Commands** trigger it
- **Rules** enforce it
- **Skills** teach it
- **Subagents** refine it

**This is how Heidegger becomes operational.**

---

## 11. Relationship to Other Modes

The hermeneutic circle (SOLUTION mode) feeds into the rest of the workflow:

```
SOLUTION (hermeneutic interpretation)
   ↓
   [Artifacts produced: problem, outcome, criteria]
   ↓
PLAN (teleological planning)
   ↓
   [Goal tree built backward from outcome]
   ↓
DESIGN-FLOW / BUILD-SCREEN / BUILD-API
   ↓
   [Implementation guided by interpretation]
   ↓
CLEAN-SWEEP / TEST-LOOP
   ↓
   [Validation against success criteria]
   ↓
DEPLOY-RELEASE
   ↓
   [Outcome achieved, measured against criteria]
```

**If new evidence appears during any mode:**
- Return to SOLUTION mode
- Re-interpret with new evidence
- Update artifacts
- Adjust plan/implementation accordingly

---

## 12. Example: Hermeneutic Circle in Action

### Initial Request

"Make the system faster"

### Step 1: Command Invoked

```
/std.solution
```

### Step 2: Gather Context (Fore-Having)

```markdown
## Context
- E-commerce platform, 3-year-old codebase
- Performance degraded after Black Friday
- Users complaining about checkout speed
- API response times: 5-8 seconds (used to be <1s)
- Database queries increased 10x
```

### Step 3: Make Assumptions Explicit (Fore-Sight)

```markdown
## Assumptions
- Assuming: database is the bottleneck
- Taking for granted: caching is configured correctly
- Expecting: query optimization will help
- Bias: team wants to try new database technology
```

### Step 4: Clarify Language (Fore-Conception)

```markdown
## Definitions
- **System**: Specifically the checkout API
- **Faster**: Response time <1 second for 95th percentile
- **User**: End customer completing purchase
```

### Step 5: Interpret Problem

```markdown
## Problem Statement
Checkout abandonment increased from 5% to 40% after Black Friday because API response times (5-8s) exceed user patience threshold, causing lost revenue and support burden.
```

### Step 6: Define Desired Outcome

```markdown
## Desired Outcome
Checkout API response time <1 second for 95th percentile under peak load.

## Success Criteria
- 95th percentile response time <1s
- Checkout abandonment <10%
- Zero degradation during peak traffic
```

### Step 7: Challenge with Subagents

**std.planner challenges:**
```
Can this be planned?
- Yes, but need to identify root cause first
- "Database is bottleneck" is assumption, not fact
- Need profiling before planning optimization

Questions:
- Have we profiled to confirm database is the issue?
- What specific queries are slow?
- Is it query count, query complexity, or data volume?
```

**std.verifier challenges:**
```
Does this hold together?
- Problem statement good: ties performance to business impact
- Assumption "database is bottleneck" needs validation
- Success criteria clear and measurable

Evidence gaps:
- No profiling data to support database assumption
- Could be: network latency, API logic, cache misses, external services

Alternative interpretations:
- External payment service might be slow
- Cache invalidation might be causing full DB hits
- Could be N+1 query problem

Recommendation:
Add profiling step before assuming solution. Interpretation is good, but assumption needs testing.
```

### Step 8: Revise Interpretation

```markdown
## Problem Statement (Revised)
Checkout abandonment increased from 5% to 40% after Black Friday because API response times (5-8s) exceed user patience threshold. Root cause unknown – need profiling.

## Assumptions (Revised)
- Taking for granted: issue is in our API (could be external)
- Need to validate: where the time is spent (DB? external calls? computation?)

## Open Questions
- What does profiling show for slow requests?
- Is this database, external services, or application logic?
- Does caching work as expected?

## Next Step
Profile 100 slow checkout requests to identify root cause before planning optimization.
```

### Step 9: Stabilize

**Decision:** Interpretation is now stable enough to plan the profiling step.

**Artifacts captured** in `memory-bank/current/checkout-performance-interpretation.md`

**Move to PLAN mode** to plan the profiling work.

---

## 13. Summary

This system makes Heidegger's hermeneutic circle **operational** through:

1. **Rules** that enforce interpretive discipline
2. **Commands** that trigger the interpretive loop
3. **Skills** that teach the interpretive method
4. **Subagents** that challenge and refine interpretation
5. **Artifacts** that capture and preserve interpretation

The result is a **repeatable interpretive machine** that prevents premature solutions and produces stable, shared understanding.
