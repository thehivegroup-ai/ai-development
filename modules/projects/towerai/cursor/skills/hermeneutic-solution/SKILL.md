---
name: hermeneutic-solution
version: 1.0.0
description: >
  Frame a solution by interpreting intent using Heidegger's hermeneutic circle operationalized 
  for software development. Use when the request is ambiguous, the scope is unclear, multiple 
  solution paths exist, or before proposing a solution to a complex problem.
  
  Trigger when user mentions: requirements unclear, what should we build, multiple approaches, 
  scope not clear, stakeholders disagree, problem keeps changing, clarify requirements, 
  understand the problem, or asks questions like "what's the real issue here" or "why do we 
  need this" before starting implementation.
---

# Hermeneutic Solution

**This skill operationalizes Heidegger's hermeneutic circle as a repeatable interpretation system.**

---

## When to Use

- The request is ambiguous or high level
- The user wants clarity on outcome, scope, or tradeoffs
- There are multiple valid solution paths
- "Requirements keep changing" (interpretation not stable)
- Teams argue about solutions (different interpretations)

**Note on Parallel Execution:**  
The interpretation process is **sequential by design** (hermeneutic circle requires iteration), but **evidence gathering** within each fore-structure can be parallelized. For example, when establishing context (fore-having), you can read multiple files, search for patterns, and check documentation in parallel before synthesizing.

---

## The Hermeneutic Circle Operationalized

### Design Goal

Turn Heidegger's hermeneutic circle from philosophy into practice:
- **Prevent premature solutions** – No action without interpretation
- **Make assumptions explicit** – Surface hidden pre-understanding
- **Allow evolution without chaos** – Understanding can change, but contextually
- **Produce stable shared interpretation** – Team alignment on problem, outcome, success

---

## The Three Fore-Structures

Heidegger identified three types of pre-understanding that shape interpretation:

### 1. Fore-Having (Context)

**What it is:** The background context we bring to interpretation

**In practice:**
- What's the current state?
- What led us here?
- What evidence do we have?
- What's the organizational/technical context?

**Example:**
```markdown
## Context (Fore-Having)
- Current system: monolithic Rails app, 10-year-old codebase
- Problem emerged: after Black Friday traffic spike
- Evidence: API response times >5s, 40% error rate
- Context: Team considering microservices migration
```

**Why it matters:** Same words mean different things in different contexts.

---

### 2. Fore-Sight (Expectations)

**What it is:** The expectations and assumptions we bring before looking

**In practice:**
- What do we expect to find?
- What are we assuming is true?
- What are we taking for granted?
- What biases are we bringing?

**Example:**
```markdown
## Assumptions (Fore-Sight)
- Assuming: performance issue is database-related
- Taking for granted: caching is properly configured
- Expecting: scaling horizontally will help
- Bias: we want to try microservices
```

**Why it matters:** Unexamined assumptions lead us astray.

---

### 3. Fore-Conception (Language)

**What it is:** The conceptual framework and language we use to understand

**In practice:**
- What do key terms mean?
- Are we using the same language?
- What conceptual models are we using?
- What needs explicit definition?

**Example:**
```markdown
## Definitions (Fore-Conception)
- **Performance issue**: Response time >2s for 95th percentile
- **User**: End customer making purchases (not internal tools)
- **Critical path**: Checkout flow specifically
- **Success**: <500ms for 95th percentile under peak load
```

**Why it matters:** Misaligned language = misaligned understanding.

---

## The Interpretive Loop

### Part ↔ Whole Tension

Interpretation moves between:
- **Part** → Details, symptoms, specific evidence
- **Whole** → Overall problem, desired outcome, system context

Each informs the other in a cycle.

### The Loop

```
1. Gather evidence (parts) → 
2. Form initial interpretation (provisional whole) → 
3. Test against details (do parts fit whole?) → 
4. Revise interpretation (new whole) → 
5. Gather more evidence (new parts) → 
6. Repeat until stable
```

**Stable ≠ Perfect**  
Stable = "Good enough to plan from, open to revision if new evidence appears"

---

## Step-by-Step Interpretive Method

### Step 1: Establish Fore-Having (Context)

**Questions to ask:**
- What's the current situation?
- What history led to this?
- What evidence do we have?
- What's been tried before?

**Output:**
```markdown
## Context
- [Current state description]
- [Timeline/history]
- [Evidence observed]
- [Previous attempts]
```

---

### Step 2: Make Fore-Sight Explicit (Assumptions)

**Questions to ask:**
- What am I assuming is true?
- What am I taking for granted?
- What do I expect to find?
- What biases am I bringing?

**Output:**
```markdown
## Assumptions
- [Assumption 1: what we're taking as given]
- [Assumption 2: what we expect]
- [Assumption 3: potential biases]
```

**Critical:** State assumptions even if obvious.

---

### Step 3: Clarify Fore-Conception (Language)

**Questions to ask:**
- What do key terms mean here?
- Are we using the same language?
- What needs explicit definition?
- What conceptual models apply?

**Output:**
```markdown
## Definitions
- **Term 1**: Specific meaning in this context
- **Term 2**: Specific meaning in this context
```

---

### Step 4: Interpret the Problem (Part → Whole)

**Move from symptoms to problem:**
- Symptoms: What we observe (the parts)
- Problem: What causes symptoms (provisional whole)

**Questions to ask:**
- What's the real issue (not just symptoms)?
- Why is this a problem?
- For whom is this a problem?
- What changes would resolve this?

**Output:**
```markdown
## Problem Statement
[Interpretation of the problem in user's terms]

Not: "API is slow"
But: "Checkout abandonment increased 40% because API response times exceed user patience threshold during peak traffic"
```

---

### Step 5: Define Desired Outcome (Whole → Part)

**Move from outcome to criteria:**
- Outcome: The desired future state (the whole)
- Criteria: Observable evidence outcome is achieved (the parts)

**Questions to ask:**
- What does "solved" look like?
- How will we know we succeeded?
- What observable changes will occur?
- What won't change (non-goals)?

**Output:**
```markdown
## Desired Outcome
[Observable, provisional outcome]

## Success Criteria
- [Observable criterion 1: specific, measurable]
- [Observable criterion 2: specific, measurable]

## Non-Goals
- [What we're explicitly NOT doing]
```

---

### Step 6: Identify Constraints & Unknowns

**Questions to ask:**
- What limits our options?
- What don't we know yet?
- What would change our understanding?
- What risks exist?

**Output:**
```markdown
## Constraints
- [Technical constraint]
- [Business constraint]
- [Time/resource constraint]

## Open Questions
- [Question that would shift interpretation]
- [Information that would change approach]
```

---

### Step 7: Test Interpretation (Challenge)

**Use subagents to stress-test ONLY in SOLUTION mode:**

**When to challenge interpretation:**
- ✅ During SOLUTION mode - Testing logical consistency of interpretation
- ❌ During BUILD modes - Verification happens later in CLEAN-SWEEP

**Invoke `std-planner`:**
- "Can this interpretation be planned from?"
- "What's missing for feasibility?"
- "What ambiguity blocks execution?"

**Invoke `std-verifier` (SOLUTION mode only):**
- "Does this interpretation hold together?"
- "Are there internal contradictions?"
- "Does this explain the observed evidence?"

**Invoke domain critics (if available):**
- "Does this match reality in [domain]?"
- "Are we missing domain-specific context?"

**Output:**
```markdown
## Challenges & Revisions
- Challenge 1: [What subagent questioned]
  - Response: [How interpretation revised]
- Challenge 2: [What didn't hold up]
  - Response: [New understanding]
```

---

### Step 8: Stabilize or Loop

**Decision point:**

Is interpretation stable enough to plan from?

**Stable means:**
- ✓ Problem is clear in user's terms
- ✓ Assumptions are explicit
- ✓ Success criteria are observable
- ✓ Constraints are known
- ✓ Team has shared understanding
- ✓ Interpretation survives challenges

**If YES:**
- Document final interpretation
- Move to `/std-plan`

**If NO:**
- Gather more evidence
- Revise interpretation
- Loop back to Step 4

**Remember:** Interpretation can be reopened if new evidence appears.

---

## Required Artifacts

Every interpretation produces this document:

```markdown
# Solution Interpretation

**Last Updated:** YYYY-MM-DD  
**Status:** Stable | Evolving  
**Revision:** [Why interpretation changed, if applicable]

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

---

## Common Failure Modes

### 1. Premature Solutioning

**Symptom:** Jumping to "we should build X" before problem is clear

**Example:**
- ❌ "The API is slow, we should use Redis"
- ✅ "Checkout abandonment increased 40%. Why? What's the user experience? What's the performance threshold?"

**Fix:** Return to Step 4, interpret the problem first.

---

### 2. Symptom Fixation

**Symptom:** Treating symptoms as the problem

**Example:**
- ❌ Problem: "API returns 500 errors"
- ✅ Problem: "Payment processing fails for 15% of transactions, causing revenue loss and support burden"

**Fix:** Ask "why is this a problem?" three times.

---

### 3. Hidden Assumptions

**Symptom:** Making decisions based on unexamined assumptions

**Example:**
- Assuming users want feature X (never validated)
- Assuming performance issue is database (no evidence)

**Fix:** Make fore-sight explicit (Step 2).

---

### 4. Vague Outcomes

**Symptom:** Success criteria that can't be observed

**Example:**
- ❌ "Make the system better"
- ❌ "Improve user experience"
- ✅ "Reduce checkout abandonment from 40% to <10%"
- ✅ "95th percentile response time <500ms under peak load"

**Fix:** Define observable criteria (Step 5).

---

### 5. Skipping Challenges

**Symptom:** Not testing interpretation with subagents in SOLUTION mode

**Example:**
- Interpretation feels good, skip straight to planning
- Discover halfway through that interpretation was flawed

**Fix:** During SOLUTION mode, invoke `std-planner` and `std-verifier` (Step 7). Do NOT invoke during BUILD modes.

---

## Why This Works in Practice

### Without Hermeneutic Interpretation

- "Requirements keep changing" (interpretation not stable)
- Teams argue about solutions (different interpretations)
- Problems treated as fixed objects (no evolution allowed)
- Re-interpretation feels like failure

### With Hermeneutic Interpretation

- Understanding evolves contextually (part ↔ whole)
- Changes are traceable (explicit artifacts)
- Decisions align with reality (tested interpretation)
- Solutions match actual problems (not symptoms)

---

## Relationship to Other Constructs

**Rules enforce** that interpretation happens:
- `01-std-solution-hermeneutic.mdc` requires interpretation before solutions

**Commands trigger** the interpretive loop:
- `/std-solution` initiates this skill

**Subagents challenge** the interpretation:
- `std-planner` tests feasibility
- `std-verifier` tests consistency

**Planning consumes** the interpretation:
- `/std-plan` uses artifacts as input
- Teleological planning builds backward from desired outcome

---

## Key Principle

**The hermeneutic circle is not a meeting.**  
**It is a repeatable interpretive machine.**

Commands trigger it.  
Rules enforce it.  
Skills teach it.  
Subagents refine it.

This is how Heidegger becomes operational.

---

## References

See `references/` for:
- Heidegger's *Being and Time* (§32, §33) – Original hermeneutic circle
- Gadamer's *Truth and Method* – Interpretive method
- Example interpretations from real projects
- Anti-patterns and how to avoid them
