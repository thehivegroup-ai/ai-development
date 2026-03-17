---
name: std-plan
version: 1.0.0
description: >
  Trigger teleological planning to derive execution plans backward from desired end-state. Use 
  when the user needs an execution plan, when defining the approach for a complex feature, or 
  before starting multi-step implementation work.
  
  Trigger when user mentions: create plan, how do we build this, what are the steps, break 
  this down, plan phases, work backward, define milestones, or asks "how do we get there" 
  after defining outcome.
disable-model-invocation: true
---

# Standard Plan

Trigger teleological planning to derive execution plans backward from desired end-state.

**This is not task listing. This is proving the end-state will exist.**

---

## Purpose

Turn "what success looks like" into actionable execution plan:
- Start from the end-state (telos)
- Work backward to determine necessary steps
- Create clear phase gates
- Keep execution aligned with intent

This prevents:
- Activity without direction
- Plans that optimize locally but miss the goal
- "We built it but it didn't work"

---

## Prerequisites

**Before planning, you MUST have:**
- Stable interpretation from `/std-solution`
- Clear desired outcome
- Observable success criteria

**If interpretation is not stable, return to SOLUTION mode.**

---

## The Teleological Planning Loop

### Step 1: Define the End-State (Telos)

**Question:**
- What does success look like when we're done?
- What observable change will have occurred?
- What will be true that is not true now?

**Output:**
```markdown
## End-State (Telos)
[Concrete, observable future state]

Example:
- NOT: "System is faster"
- BUT: "Checkout API responds in <1s for 95th percentile under peak load, checkout abandonment <10%"
```

**Requirements:**
- Observable (can be measured/verified)
- Falsifiable (can prove it's NOT achieved)
- Complete (nothing left ambiguous)

---

### Step 2: Define Acceptance Criteria

**Question:**
- How will we KNOW the end-state is achieved?
- What evidence proves success?
- What tests/checks verify the telos?

**Output:**
```markdown
## Acceptance Criteria
1. [Observable criterion 1: specific, measurable]
2. [Observable criterion 2: specific, measurable]
3. [Observable criterion 3: specific, measurable]

Example:
1. Load test: 95th percentile response time <1s with 10k concurrent users
2. Monitoring: Zero timeout errors during peak traffic
3. Business metric: Checkout abandonment rate <10%
```

**Requirements:**
- Each criterion is verifiable
- Criteria collectively prove telos achieved
- No ambiguous terms ("better", "faster", "improved")

---

### Step 3: Define Non-Goals

**Question:**
- What is success NOT?
- What are we explicitly NOT doing?
- What optimizations are out of scope?

**Output:**
```markdown
## Non-Goals
- [What we're NOT doing]
- [Scope we're NOT addressing]

Example:
- NOT optimizing admin dashboard (only checkout)
- NOT addressing mobile app performance (web only)
- NOT implementing new features (performance only)
```

**Why this matters:** Prevents scope creep, clarifies boundaries.

---

### Step 4: Work Backward from End-State

**Method: Backward Decomposition**

Start at the end-state and ask: **"What must be true immediately before this?"**

Repeat recursively until you reach current state.

**Example:**

```
End-State: Checkout API <1s response time

↓ What must be true?

Phase 4: Performance validated under load
├─ Load tests pass
├─ Monitoring configured
└─ Rollback plan ready

↓ What must be true?

Phase 3: Optimizations implemented
├─ Database queries optimized
├─ Caching implemented
├─ N+1 queries eliminated

↓ What must be true?

Phase 2: Root cause identified
├─ Profiling data collected
├─ Bottleneck identified
└─ Optimization approach selected

↓ What must be true?

Phase 1: Profiling capability exists
├─ Profiling tools installed
├─ Test environment configured
└─ Baseline metrics captured

↓ Current State
```

---

### Step 5: Define Phase Gates

**Question:**
- What are the major checkpoints?
- How do we verify progress toward telos?
- What evidence shows each phase succeeded?

**Output:**
```markdown
## Phase Gates

### Phase 1: Profiling Capability
**Gate Criteria:**
- [ ] Profiling tools installed and tested
- [ ] Test environment mirrors production load
- [ ] Baseline metrics captured (current response times)

### Phase 2: Root Cause Identified
**Gate Criteria:**
- [ ] 100 slow requests profiled
- [ ] Bottleneck identified with evidence
- [ ] Optimization approach documented and approved

### Phase 3: Optimizations Implemented
**Gate Criteria:**
- [ ] Database queries optimized (N+1 eliminated)
- [ ] Caching layer implemented
- [ ] Unit tests pass
- [ ] Code review complete

### Phase 4: Performance Validated
**Gate Criteria:**
- [ ] Load tests show <1s for 95th percentile
- [ ] Zero errors under peak load
- [ ] Monitoring configured and alerting
- [ ] Rollback plan tested
```

**Each gate MUST:**
- Have observable criteria
- Prove progress toward telos
- Block next phase if not met

---

### Step 6: Map Tasks to Outcome

**Question:**
- For each task, which acceptance criterion does it satisfy?
- If we complete all tasks, is the telos achieved?
- Are there gaps?

**Output:**
```markdown
## Task-to-Outcome Mapping

| Task | Contributes To | Acceptance Criterion |
|------|---------------|---------------------|
| Install profiling tools | Phase 1 | Baseline metrics captured |
| Profile 100 slow requests | Phase 2 | Root cause identified |
| Optimize database queries | Phase 3 | Response time <1s |
| Implement caching | Phase 3 | Response time <1s |
| Run load tests | Phase 4 | 95th percentile <1s verified |
| Configure monitoring | Phase 4 | Production readiness |
```

**Critical Check:**
- If all tasks complete, is telos achieved? YES/NO
- If NO, what's missing?

---

### Step 7: Identify Dependencies & Risks

**Question:**
- What blocks what?
- What can fail?
- What assumptions could be wrong?

**Output:**
```markdown
## Dependencies
- Phase 2 depends on Phase 1 (need profiling tools first)
- Phase 3 depends on Phase 2 (need root cause before optimizing)
- Phase 4 depends on Phase 3 (need changes before testing)

## Risks
1. **Risk:** Profiling overhead affects production
   - **Mitigation:** Use test environment that mirrors production
   - **Rollback:** Remove profiling tools if issues

2. **Risk:** Root cause is external service, not our code
   - **Mitigation:** Profile external service calls separately
   - **Impact:** May need to change approach

3. **Risk:** Optimizations break functionality
   - **Mitigation:** Comprehensive test suite
   - **Rollback:** Revert changes, traffic shift back
```

---

### Step 8: Add Validation Checkpoints

**Question:**
- How do we verify we're on track?
- What tests prove correctness?
- What reviews ensure quality?

**Output:**
```markdown
## Validation Checkpoints

### After Phase 1:
- [ ] Run profiling tool smoke test
- [ ] Verify test environment load matches production
- [ ] Review baseline metrics with team

### After Phase 2:
- [ ] Peer review profiling analysis
- [ ] Validate root cause hypothesis with senior eng
- [ ] Confirm optimization approach feasible

### After Phase 3:
- [ ] Unit tests: all passing
- [ ] Code review: approved
- [ ] Integration tests: no regressions
- [ ] Performance tests: improvement measured

### After Phase 4:
- [ ] Load tests: acceptance criteria met
- [ ] Security review: no new vulnerabilities
- [ ] Monitoring: dashboards configured
- [ ] Rollback test: verified working
```

---

### Step 9: Challenge with Subagents

**Invoke subagents to test plan:**

**std-planner:**
- "Is this plan complete?"
- "Will completing all tasks achieve the telos?"
- "What's missing?"

**std-verifier:**
- "Do tasks map to acceptance criteria?"
- "If all tasks done, is telos proven?"
- "Are there gaps or contradictions?"

**Revise plan based on feedback.**

---

### Step 10: Stabilize or Loop

**Decision:**
- Is plan complete and outcome-aligned?
  - YES → Document plan, move to DESIGN-FLOW/BUILD-SCREEN/BUILD-API
  - NO → Revise plan, loop back to Step 4

---

## Required Artifacts

Every teleological plan MUST produce:

```markdown
# Teleological Plan

**Last Updated:** YYYY-MM-DD  
**Status:** Draft | Approved | In Progress | Complete

## End-State (Telos)
[Concrete, observable future state]

## Acceptance Criteria
1. [Observable criterion 1]
2. [Observable criterion 2]
3. [Observable criterion 3]

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
| Task | Contributes To | Acceptance Criterion |
|------|---------------|---------------------|
| Task 1 | Phase X | Criterion Y |

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

---

## Guidance

- **Apply the `teleological-planning` skill** for detailed backward planning method
- **Challenge with subagents** (`std-planner`, `std-verifier`)
- **Start from end-state** – Never start from tasks
- **Work backward** – Don't jump to tasks
- **Make it falsifiable** – Must be possible to prove plan fails

---

## Common Failure Modes

- **Task-first planning** – Starting with "we need to do X, Y, Z" instead of "success looks like..."  
- **Vague end-states** – "Make it better" instead of observable outcomes  
- **Missing task-outcome mapping** – Can't prove tasks achieve telos  
- **No phase gates** – Can't verify progress  
- **Unfalsifiable plans** – No way to prove plan fails  
- **Skipping validation** – Not testing plan with subagents

---

## Why This Works

**Without teleological planning:**
- Teams optimize tasks, not outcomes
- Plans feel "complete" but fail
- Late surprises derail delivery
- Accountability is fuzzy

**With teleological planning:**
- Every task has a reason (maps to telos)
- Scope is intentional (non-goals explicit)
- Success is verifiable (acceptance criteria)
- Progress is meaningful (phase gates)

---

## Relationship to Other Modes

**SOLUTION mode produces:**
- Problem statement
- Desired outcome
- Success criteria

**PLAN mode consumes these and produces:**
- Concrete end-state
- Backward-derived execution plan
- Phase gates and validation

**BUILD modes execute:**
- Following the plan
- Validating at each phase gate
- Staying aligned with telos

---

## Key Principle

**Planning is not listing tasks.**  
**It is proving that the end-state will exist.**

Skills teach it.  
Subagents protect it.

This is teleology made operational.
