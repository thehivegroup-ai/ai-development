---
name: std-solution
description: Trigger the hermeneutic circle to interpret the problem before proposing solutions. Use when the problem statement is ambiguous, requirements need clarification, or before proposing a solution to ensure the real intent is understood.
disable-model-invocation: true
---

# Standard Solution

Trigger the hermeneutic circle to interpret the problem before proposing solutions.

**This is not a meeting. This is a repeatable interpretive machine.**

---

## Purpose

Turn understanding into explicit artifacts:
- Prevent premature solutions
- Make assumptions visible
- Allow understanding to evolve without chaos
- Produce shared interpretation

---

## The Hermeneutic Loop

### Step 1: Gather Context (Fore-Having)

**Question:**
- What is the current situation?
- What brought us here?
- What evidence do we have?

**Output:**
```markdown
## Context
- [Current state]
- [History leading to this point]
- [Evidence observed]
```

---

### Step 2: State Expectations (Fore-Sight)

**Question:**
- What do we expect to see?
- What assumptions are we bringing?
- What are we taking for granted?

**Output:**
```markdown
## Assumptions
- [Assumption 1]
- [Assumption 2]
- [What we're taking as given]
```

---

### Step 3: Clarify Language (Fore-Conception)

**Question:**
- What do key terms mean?
- Are we using the same language?
- What needs definition?

**Output:**
```markdown
## Definitions
- **Term**: Meaning in this context
- **Term**: Meaning in this context
```

---

### Step 4: Interpret the Problem

**Question:**
- Restate the problem in the user's terms
- What is the real issue (not just symptoms)?
- What changes would resolve this?

**Output:**
```markdown
## Problem Statement
[Current best interpretation of the problem]
```

---

### Step 5: Define Desired Outcome

**Question:**
- What does "solved" look like?
- How will we know we succeeded?
- What observable changes will occur?

**Output:**
```markdown
## Desired Outcome
[Provisional, observable outcome]

## Success Criteria
- [Criterion 1: observable, measurable]
- [Criterion 2: observable, measurable]
```

---

### Step 6: Identify Constraints & Unknowns

**Question:**
- What limits our options?
- What don't we know yet?
- What would change our understanding?

**Output:**
```markdown
## Constraints
- [Constraint 1]
- [Constraint 2]

## Open Questions
- [Question that would shift interpretation]
- [Question that would shift interpretation]
```

---

### Step 7: Challenge the Interpretation

**Invoke subagents to test interpretation:**

- `std-planner` → Can this be planned? What's missing?
- `std-verifier` → Does this interpretation hold together? Contradictions?

**Revise interpretation based on feedback.**

---

### Step 8: Stabilize or Loop

**Decision:**
- Is interpretation stable enough to plan?
  - YES → Move to `/std-plan`
  - NO → Revise interpretation, loop back to Step 4

---

## Required Artifacts

Every interpretation MUST produce:

```markdown
# Solution Interpretation

**Last Updated:** YYYY-MM-DD  
**Status:** Stable | Evolving

## Problem Statement
[In user's terms]

## Desired Outcome
[Observable, provisional]

## Assumptions
- [Explicit assumption 1]
- [Explicit assumption 2]

## Constraints
- [What limits us]

## Open Questions
- [What would change our understanding]

## Success Criteria
- [Observable criterion 1]
- [Observable criterion 2]

## Non-Goals
- [What we're explicitly NOT doing]
```

---

## Guidance

- **Apply the `hermeneutic-solution` skill** for detailed interpretive method
- **Challenge with subagents** (`std-planner`, `std-verifier`)
- **Revise freely** – Understanding evolves, that's normal
- **No solutions yet** – Interpretation first, planning second

---

## Common Failure Modes

- **Premature solutioning** – Jumping to implementation before interpretation stabilizes  
- **Symptom fixation** – Treating symptoms as the problem  
- **Hidden assumptions** – Not making pre-understanding explicit  
- **Vague outcomes** – "Make it better" instead of observable success criteria  
- **Skipping challenges** – Not testing interpretation with subagents

---

## Why This Works

**Without this:**
- "Requirements keep changing" (no stable interpretation)
- Teams argue about solutions (different interpretations)
- Problems treated as fixed (no room for evolution)

**With this:**
- Understanding evolves contextually
- Changes are traceable
- Decisions align with reality
- Solutions match actual problems
