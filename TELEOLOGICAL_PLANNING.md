# Teleological Planning: Conceptual Framework

This document explains how teleological thinking is operationalized in this system through Commands, Rules, Skills, and Subagents.

---

## 1. Design Goal

Turn teleological thinking ("organizing action by the end-state") into a **repeatable planning system** that:

- ✅ Starts from what success must look like
- ✅ Works backward to determine necessary steps
- ✅ Creates clear phase gates
- ✅ Keeps execution aligned with intent

This prevents:
- Activity without direction ("we're busy but not progressing")
- Plans that optimize locally but miss the goal
- "We built it but it didn't work"
- Scope creep and task drift

---

## 2. Conceptual Mapping

| Teleological Concept | Cursor Construct | Purpose |
|---------------------|------------------|---------|
| **End-state** (telos) | **Rule** | Force outcome definition |
| **Planning act** | **Command** | Trigger backward planning |
| **Planning method** | **Skill** | Teach how to plan backward |
| **Outcome validation** | **Subagent** | Verify alignment with telos |

---

## 3. Rules: Enforcing Outcome-Driven Planning

### Purpose

Rules ensure **planning begins with outcomes, not tasks**.

### Implementation

**File:** `modules/enterprise-standards/cursor/rules/02-std-planning-teleological.mdc`

**What it enforces:**
```
Every initiative must define:
1. Concrete end-state (observable, falsifiable)
2. Acceptance criteria (how we verify telos is achieved)
3. Non-goals (what success is NOT)
4. Task-to-outcome mapping (every task contributes to telos)
5. Phase gates (verifiable progress checkpoints)
6. Validation steps (tests, checks, reviews)

Plans must be derived backward from the end-state.
Tasks without clear contribution to end-state are invalid.
Execution may not begin without approved plan.
```

### What Rules Do

- ✅ Prevent task-first thinking
- ✅ Force clarity on success
- ✅ Make planning falsifiable

### What Rules Do NOT Do

- ❌ Rules do NOT describe how to plan (Skills do this)
- ❌ Rules do NOT trigger planning (Commands do this)
- ❌ Rules do NOT validate plans (Subagents do this)

**Rules only require that planning is outcome-driven.**

---

## 4. Command: Triggering Teleological Planning

### Purpose

Commands are the **formal entry point into planning**.

### Implementation

**File:** `modules/enterprise-standards/cursor/commands/std.plan.md`

**Command:** `/std.plan`

### What the Command Does

1. Requires end-state as input (from SOLUTION mode)
2. Refuses to start from task lists
3. Structures the backward reasoning process
4. Produces a concrete execution plan

### Command Responsibilities

- Ask outcome-first questions
- Enforce backward derivation
- Structure phases and dependencies
- Invoke validation subagents
- Produce standardized plan artifact

### Typical Output

```markdown
# Teleological Plan

## End-State (Telos)
[Observable future state]

## Acceptance Criteria
1. [Criterion 1]
2. [Criterion 2]

## Non-Goals
- [What we're NOT doing]

## Phase Gates
[Checkpoints with observable criteria]

## Task-to-Outcome Mapping
[Every task maps to acceptance criterion]

## Dependencies
[What blocks what]

## Risks & Mitigation
[What could fail, how we handle it]

## Validation Checkpoints
[Tests, reviews, checks]
```

---

## 5. Skill: Teaching Teleological Planning

### Purpose

Skills encode **how to plan from outcomes backward**.

### Implementation

**File:** `modules/enterprise-standards/cursor/skills/teleological-planning/SKILL.md`

**Skill:** `teleological-planning`

### What the Skill Contains

1. **Explanation of teleological reasoning**
   - What is a telos (end-state)?
   - Why plan backward vs forward?
   - Characteristics of good telos

2. **Difference between task vs outcome planning**
   - Task planning anti-patterns
   - Teleological planning examples
   - Side-by-side comparison

3. **How to define observable end-states**
   - Observable
   - Falsifiable
   - Complete
   - Examples: bad vs good

4. **Backward decomposition techniques**
   - Start at end-state
   - Ask "what must be true before this?"
   - Recurse until current state
   - Verify completeness

5. **Phase gate design**
   - What are phase gates?
   - How to design effective gates
   - Gate anti-patterns

6. **Task-to-outcome mapping**
   - Why it matters
   - How to create mapping
   - Completeness check

7. **Dependencies & risks**
   - Identifying dependencies
   - Risk identification and mitigation

8. **Validation checkpoints**
   - Types of validation
   - Example checkpoints

9. **Common failure modes**
   - Task-first planning
   - Vague end-states
   - Missing mapping
   - No phase gates
   - Unfalsifiable plans

10. **Examples**
    - Real teleological plans
    - Before/after transformations

### Skill Responsibilities

- Standardize planning quality
- Prevent superficial plans
- Make plans comparable across teams
- Enable backward thinking

### Rules May Say

"Follow the `teleological-planning` skill."

---

## 6. Subagents: Validating Outcome Alignment

### Purpose

Subagents **verify that execution stays aligned with the telos**.

They represent **goal accountability**.

### Implementation

#### std.planner

**File:** `modules/enterprise-standards/cursor/agents/std.planner.md`

**Role in PLAN mode:** Validates **outcome-task alignment**

**Questions it asks:**
- If all tasks complete, is telos achieved?
- Was this derived backward or task-first?
- Does each phase logically follow?
- Are phase gates effective?
- Does every task map to a criterion?

**Output:**
- Tests completeness (gaps between current and telos)
- Validates backward derivation
- Checks phase gate effectiveness
- Verifies task-outcome mapping
- Identifies orphaned tasks or uncovered criteria

---

#### std.verifier

**File:** `modules/enterprise-standards/cursor/agents/std.verifier.md`

**Role in PLAN mode:** Validates **internal consistency**

**Questions it asks:**
- Do tasks collectively achieve acceptance criteria?
- Are there contradictions in the plan?
- Are dependencies realistic?
- Is risk mitigation practical?

**Output:**
- Checks logical consistency
- Identifies contradictions
- Tests assumptions
- Validates feasibility

---

### Subagent Responsibilities

- ✅ Challenge weak end-states
- ✅ Prevent task drift
- ✅ Validate completeness and coherence
- ✅ Guard the telos

### What Subagents Do NOT Do

- ❌ **They do not own execution** – They guard alignment
- ❌ **They do not build plans** – They validate them
- ❌ **They do not approve** – They critique

---

## 7. Teleological Planning as a System

### Step-by-Step Flow

```
1. Hermeneutic interpretation complete
   └─> Problem and desired outcome stabilized
   └─> Success criteria defined

2. Command invoked
   └─> /std.plan

3. Rules activate
   └─> End-state required
   └─> Acceptance criteria required
   └─> Backward planning enforced

4. Skill applied
   └─> Guides backward decomposition
   └─> Structures phases and dependencies
   └─> Produces plan artifact

5. Subagents review
   └─> std.planner validates outcome-task alignment
   └─> std.verifier validates consistency
   └─> Identify gaps and risks

6. Plan refined
   └─> Phases adjusted
   └─> Tasks clarified
   └─> Validation steps added
   └─> Mapping verified

7. Plan approved
   └─> Meets telos requirements
   └─> Completeness verified
   └─> Ready for execution

8. Execution begins
   └─> Following phase gates
   └─> Validating at checkpoints
   └─> Staying aligned with telos
```

---

## 8. Artifacts Produced (Critical)

### Why Artifacts Matter

Plans are **not just documents** – they are **execution contracts**.

### Required Artifacts

Every teleological plan produces:

```markdown
# Teleological Plan

**Last Updated:** YYYY-MM-DD  
**Status:** Draft | Approved | In Progress | Complete

## End-State (Telos)
[Concrete, observable future state]

## Acceptance Criteria
1. [Observable criterion 1]
2. [Observable criterion 2]

## Non-Goals
- [What we're NOT doing]

## Phase Gates

### Phase 1: [Name]
**Goal:** [What this phase achieves]
**Gate Criteria:**
- [ ] [Observable criterion]

### Phase 2: [Name]
**Goal:** [What this phase achieves]
**Gate Criteria:**
- [ ] [Observable criterion]

## Task-to-Outcome Mapping
| Task | Phase | Contributes To | Acceptance Criterion |
|------|-------|---------------|---------------------|
| Task 1 | Phase X | Goal Y | Criterion Z |

## Dependencies
- [What blocks what]

## Risks & Mitigation
1. **Risk:** [What could go wrong]
   - **Mitigation:** [How we prevent/handle it]
   - **Rollback:** [How we undo if needed]

## Validation Checkpoints
### After Phase 1:
- [ ] [Validation step]

## Completeness Check
- [ ] All tasks map to acceptance criteria
- [ ] All acceptance criteria covered by tasks
- [ ] No gaps between current state and telos
- [ ] Dependencies identified
- [ ] Risks mitigated
- [ ] Validation steps included
```

### What Artifacts Enable

- ✅ **Execution contracts** – Team knows what to do
- ✅ **Review anchors** – Can verify progress at phase gates
- ✅ **References during build** – Team returns to plan when unclear
- ✅ **Accountability** – Can prove plan achieves telos or not
- ✅ **Traceability** – Decisions traceable to end-state

---

## 9. Why This Works in Practice

### Without Teleological Planning

| Problem | Why It Happens |
|---------|----------------|
| Teams optimize tasks, not outcomes | No end-state defined |
| Plans feel "complete" but fail | Tasks don't map to telos |
| Late surprises derail delivery | No phase gates, no validation |
| Accountability is fuzzy | Can't prove plan achieves outcome |
| Scope creep | No non-goals defined |

### With Teleological Planning

| Benefit | How It Works |
|---------|--------------|
| Every task has a reason | Task-to-outcome mapping explicit |
| Scope is intentional | Non-goals prevent drift |
| Success is verifiable | Acceptance criteria observable |
| Progress is meaningful | Phase gates prove advancement toward telos |
| Failure is early | Phase gates catch problems before full implementation |

---

## 10. Key Design Principle

> **Planning is not listing tasks.**  
> **It is proving that the end-state will exist.**

Commands initiate it.  
Rules enforce it.  
Skills teach it.  
Subagents protect it.

**This is teleology made operational.**

---

## 11. Relationship to Hermeneutic Interpretation

### The Flow

```
SOLUTION Mode (Hermeneutic)
  ↓
  Produces:
  - Problem statement
  - Desired outcome
  - Success criteria
  - Constraints
  ↓
PLAN Mode (Teleological)
  ↓
  Consumes interpretation, produces:
  - Concrete end-state (telos)
  - Backward-derived phases
  - Task-to-outcome mapping
  - Phase gates and validation
  ↓
EXECUTION Modes
  ↓
  Follow plan:
  - Design-Flow / Build-Screen / Build-API
  - Validate at phase gates
  - Stay aligned with telos
  - Return to PLAN if gaps discovered
```

### Together They Form

1. **Interpret** the problem (hermeneutic)
2. **Define** the end-state (from interpretation)
3. **Plan** backward from end-state (teleological)
4. **Execute** plan (guided by both)
5. **Validate** against telos (phase gates)
6. **Achieve** or re-plan

---

## 12. Example: Teleological Planning in Action

### From Hermeneutic Interpretation

```markdown
# Solution Interpretation (from SOLUTION mode)

## Problem Statement
Checkout abandonment increased from 5% to 40% after Black Friday because API response times (5-8s) exceed user patience threshold, causing lost revenue and support burden.

## Desired Outcome
Checkout API response time <1 second for 95th percentile under peak load.

## Success Criteria
- 95th percentile response time <1s
- Checkout abandonment <10%
- Zero timeout errors during checkout

## Constraints
- Cannot break existing checkout flow
- Must maintain PCI compliance
- Limited to 2 weeks for implementation
```

---

### Step 1: Command Invoked

```
/std.plan
```

---

### Step 2: Define End-State (Telos)

```markdown
## End-State (Telos)
Checkout API responds in <1 second for 95th percentile under peak load (10k concurrent users), reducing checkout abandonment from 40% to <10%.
```

---

### Step 3: Define Acceptance Criteria

```markdown
## Acceptance Criteria
1. Load test shows 95th percentile response time <1s with 10k concurrent users
2. Production monitoring shows zero timeout errors during peak traffic
3. Business metrics show checkout abandonment rate <10%
4. All existing functionality maintained (regression tests pass)
```

---

### Step 4: Define Non-Goals

```markdown
## Non-Goals
- NOT optimizing admin dashboard performance
- NOT addressing mobile app performance (web checkout only)
- NOT implementing new checkout features
- NOT changing payment provider
```

---

### Step 5: Work Backward from Telos

```markdown
## Backward Derivation

To achieve: <1s response time, <10% abandonment
  ↓ What must be true?

Phase 4: Performance Validated
- Load tests verify <1s
- Monitoring configured
- Rollback tested
  ↓ What must be true?

Phase 3: Optimizations Implemented
- Caching layer active
- Database queries optimized
- N+1 queries eliminated
  ↓ What must be true?

Phase 2: Root Cause Identified
- Profiling data analyzed
- Bottleneck confirmed (N+1 in order retrieval)
- Optimization approach designed
  ↓ What must be true?

Phase 1: Profiling Capability Exists
- Profiling tools installed
- Test environment configured
- Baseline metrics captured
  ↓ Current State
```

---

### Step 6: Define Phase Gates

```markdown
## Phase Gates

### Phase 1: Profiling Capability
**Goal:** Ability to profile production-like load

**Gate Criteria:**
- [ ] New Relic installed and smoke tested
- [ ] Test environment configured to mirror production (10k users)
- [ ] Baseline metrics captured (current 95th percentile = 5.2s)

**Evidence Required:**
- Profiling tool output for 10 sample requests
- Test environment load test results
- Baseline metrics dashboard screenshot

---

### Phase 2: Root Cause Identified
**Goal:** Know exactly what's causing slow checkout

**Gate Criteria:**
- [ ] 100+ slow requests profiled
- [ ] Bottleneck identified: N+1 query in order retrieval
- [ ] Optimization approach documented and peer reviewed

**Evidence Required:**
- Profiling report with analysis
- Query execution plan showing N+1 pattern
- Optimization proposal with peer review approval

---

### Phase 3: Optimizations Implemented
**Goal:** Code changes that eliminate bottleneck

**Gate Criteria:**
- [ ] Caching layer implemented for order data
- [ ] Database queries optimized (batching implemented)
- [ ] N+1 queries eliminated
- [ ] Unit tests: 150 tests passing
- [ ] Integration tests: 45 tests passing, no regressions
- [ ] Local performance test: 95th percentile <1s

**Evidence Required:**
- Code review approval
- Test results (all green)
- Local performance test results

---

### Phase 4: Performance Validated
**Goal:** Telos achieved and proven

**Gate Criteria:**
- [ ] Load test: 95th percentile <1s with 10k users
- [ ] Production monitoring: zero timeout errors
- [ ] Business metric: checkout abandonment <10%
- [ ] Rollback test successful

**Evidence Required:**
- Load test report
- Production monitoring dashboard
- Business metrics report
- Rollback test results
```

---

### Step 7: Task-to-Outcome Mapping

```markdown
## Task-to-Outcome Mapping

| Task | Phase | Contributes To | Acceptance Criterion |
|------|-------|---------------|---------------------|
| Install New Relic | 1 | Profiling capability | Baseline captured |
| Configure test env | 1 | Profiling capability | Mirror production |
| Capture baseline | 1 | Profiling capability | Baseline captured |
| Profile 100 requests | 2 | Root cause ID | Bottleneck identified |
| Analyze profiling data | 2 | Root cause ID | Bottleneck identified |
| Design optimization | 2 | Root cause ID | Approach documented |
| Implement caching | 3 | Optimization | Response time <1s |
| Optimize queries | 3 | Optimization | Response time <1s |
| Eliminate N+1 | 3 | Optimization | Response time <1s |
| Run load tests | 4 | Validation | Criterion 1 (load test <1s) |
| Configure monitoring | 4 | Validation | Criterion 2 (zero errors) |
| Measure abandonment | 4 | Validation | Criterion 3 (abandonment <10%) |
| Test rollback | 4 | Validation | Criterion 4 (functionality maintained) |

**Completeness Check:**
✅ All tasks map to phase gates
✅ All acceptance criteria covered
✅ If all tasks done, telos is achieved
```

---

### Step 8: Challenge with std.planner

**Subagent review:**

```markdown
## Teleological Planning Validation (std.planner)

### Is This Plan Complete?
Yes. Plan is comprehensive and properly derived backward.

### Telos Achievement Check
If all tasks complete, is telos achieved? **YES**

All 4 acceptance criteria are covered:
- Criterion 1 (load test <1s): Phase 4, task "Run load tests"
- Criterion 2 (zero errors): Phase 4, task "Configure monitoring"
- Criterion 3 (abandonment <10%): Phase 4, task "Measure abandonment"
- Criterion 4 (functionality): Phase 3 integration tests + Phase 4 regression

### Backward Derivation Check
Was this derived backward? **YES**

Evidence:
- Started from telos (<1s, <10% abandonment)
- Worked backward through logical phases
- Each phase answers "what must be true before?"

### Recommendation
Plan is complete and properly teleological. Approved for execution.

Minor suggestion: Add rollback window (2-week deadline is tight for Phase 4 validation).
```

---

### Step 9: Plan Approved, Move to Execution

Plan meets telos requirements. Ready for DESIGN-FLOW → BUILD-API → CLEAN-SWEEP → TEST-LOOP → DEPLOY-RELEASE.

---

## 13. Summary

This system makes teleological planning **operational** through:

1. **Rules** that enforce outcome-driven planning
2. **Commands** that trigger backward derivation
3. **Skills** that teach the planning method
4. **Subagents** that validate outcome-task alignment
5. **Artifacts** that prove plans achieve telos

The result is a **repeatable planning machine** that prevents activity without direction and ensures execution aligns with intent.
