---
name: teleological-planning
description: Build outcome-driven plans by working backward from the desired end-state (telos). Use when creating execution plans from a defined outcome, decomposing complex goals into phased tasks, or when planning needs to be outcome-driven rather than activity-driven.
---

# Teleological Planning

**This skill operationalizes teleological thinking as a repeatable planning system.**

---

## When to Use

- After hermeneutic interpretation is stable
- User needs an execution plan
- Multi-step or complex work requires coordination
- Risk mitigation is required
- Success must be verifiable

---

## Teleological Planning Operationalized

### Design Goal

Turn teleological thinking ("organizing action by the end-state") into practice:
- **Start from what success looks like** – Define observable end-state
- **Work backward** – Derive necessary steps from telos
- **Create phase gates** – Verifiable progress checkpoints
- **Keep execution aligned** – Every task contributes to telos

This prevents:
- Activity without direction ("we're busy but not progressing")
- Plans that optimize locally but miss the goal
- "We built it but it didn't work"
- Scope creep and task drift

---

## Teleological vs Task Planning

### Task Planning (Wrong)

```markdown
## Plan
1. Set up database
2. Create API routes
3. Build UI components
4. Write tests
5. Deploy

Problem: Where does this lead? What's the outcome?
```

**Issues:**
- No end-state defined
- Can't verify success
- Tasks might be unnecessary
- Missing might be unnoticed
- Optimization without purpose

---

### Teleological Planning (Correct)

```markdown
## End-State
Users can complete checkout in <1s, reducing abandonment from 40% to <10%

## Acceptance Criteria
1. 95th percentile response time <1s under peak load
2. Zero timeout errors during checkout
3. Checkout abandonment rate <10%

## Backward Derivation

To achieve <1s response time, we need:
↓
Phase 3: Performance validated
  Tasks: Load testing, monitoring, rollback plan

To validate performance, we need:
↓
Phase 2: Optimizations implemented
  Tasks: Cache layer, query optimization, N+1 elimination

To know what to optimize, we need:
↓
Phase 1: Root cause identified
  Tasks: Profiling, bottleneck analysis

Each task maps to acceptance criteria.
If all tasks done, telos is proven achieved.
```

**Benefits:**
- End-state is clear
- Success is verifiable
- Every task has a reason
- Gaps are visible
- Progress is meaningful

---

## The Telos (End-State)

### What is a Telos?

**Telos** (Greek: τέλος) = the end, purpose, or goal toward which something aims.

In planning, the telos is the **desired end-state** that guides all action.

### Characteristics of a Good Telos

A good telos is:

1. **Observable** – Can be seen, measured, verified
2. **Falsifiable** – Can prove it's NOT achieved
3. **Complete** – Nothing left ambiguous
4. **Stable** – Won't change midway (unless re-interpreted)
5. **Desirable** – Worth the effort

---

### Examples: Bad vs Good Telos

#### ❌ BAD: "Improve system performance"

Why bad:
- Not observable (improve by how much?)
- Not falsifiable (can always say "it's improved")
- Not complete (which system? which metric?)

#### ✅ GOOD: "Checkout API responds in <1s for 95th percentile under peak load (10k concurrent users), reducing checkout abandonment from 40% to <10%"

Why good:
- Observable: Can measure response time and abandonment rate
- Falsifiable: Can prove it's NOT <1s or abandonment NOT <10%
- Complete: Specific system (checkout API), specific metric (95th percentile), specific threshold (<1s), specific context (peak load)
- Desirable: Business impact clear (reduce abandonment)

---

#### ❌ BAD: "Refactor the codebase"

Why bad:
- Not observable (what does "refactored" look like?)
- Not falsifiable (can claim any change is "refactoring")
- No measurable outcome

#### ✅ GOOD: "Reduce code duplication from 35% to <10% in checkout flow, making feature additions require ≤2 files touched instead of current 8+"

Why good:
- Observable: Duplication percentage, file count
- Falsifiable: Can measure and prove NOT achieved
- Complete: Specific area (checkout flow), specific metrics
- Desirable: Business value (faster feature dev)

---

## Backward Decomposition Method

### The Core Technique

**Start at the end-state. Ask: "What must be true immediately before this?"**

Repeat recursively until you reach the current state.

---

### Step-by-Step Process

#### Step 1: Define End-State

```markdown
## End-State (Telos)
Users can complete checkout in <1s (95th percentile), checkout abandonment <10%
```

---

#### Step 2: Ask "What Must Be True?"

**To have <1s checkout:**
- Performance must be validated under load
- Monitoring must be in place
- Rollback must be ready

**This becomes Phase 4: Performance Validated**

---

#### Step 3: Recurse Backward

**To validate performance:**
- Optimizations must be implemented
- Code must be deployed
- Tests must pass

**This becomes Phase 3: Optimizations Implemented**

---

#### Step 4: Continue Until Current State

**To implement optimizations:**
- Root cause must be identified
- Solution approach must be selected

**This becomes Phase 2: Root Cause Identified**

**To identify root cause:**
- Profiling capability must exist
- Baseline must be captured

**This becomes Phase 1: Profiling Capability**

---

#### Step 5: Verify Completeness

Ask: **"If I complete Phase 1 → 2 → 3 → 4, is the telos achieved?"**

- Check each phase contributes to telos
- Identify gaps
- Add missing phases

---

## Phase Gates

### What Are Phase Gates?

**Phase gates** are checkpoints that verify progress toward the telos.

Each gate has **observable criteria** that must be met before proceeding.

---

### Designing Phase Gates

Each phase gate must answer:
1. **What was accomplished?** (deliverables)
2. **How do we know?** (evidence/verification)
3. **Can we proceed?** (decision criteria)

---

### Example Phase Gates

```markdown
### Phase 1: Profiling Capability
**Goal:** Ability to profile production-like load

**Gate Criteria:**
- [ ] Profiling tools installed and tested (run smoke test)
- [ ] Test environment configured to mirror production (load test validation)
- [ ] Baseline metrics captured (current response time distribution documented)

**Evidence:**
- Profiling tool output for sample requests
- Test environment specification document
- Baseline metrics dashboard

**Decision:** Proceed only if all criteria met.

---

### Phase 2: Root Cause Identified
**Goal:** Know what's causing slow checkout

**Gate Criteria:**
- [ ] 100+ slow requests profiled (profiling data collected)
- [ ] Bottleneck identified with evidence (e.g., "N+1 query in order retrieval")
- [ ] Optimization approach documented and approved (peer reviewed)

**Evidence:**
- Profiling report with bottleneck analysis
- Optimization proposal document
- Peer review approval

**Decision:** Proceed only if root cause is clear and approach is sound.
```

---

### Phase Gate Anti-Patterns

❌ **Vague criteria:** "Phase 1 is mostly done"  
✅ **Specific criteria:** "Profiling tools tested with 3 sample requests"

❌ **No verification:** "We think it works"  
✅ **Verification:** "Load test shows 95th percentile <1s"

❌ **No decision:** "We're moving forward anyway"  
✅ **Decision:** "All criteria met, approved to proceed"

---

## Task-to-Outcome Mapping

### Why This Matters

**If you can't map a task to an acceptance criterion, the task is invalid.**

Every task must:
1. Contribute to a phase gate
2. Satisfy an acceptance criterion
3. Move toward the telos

---

### Creating the Mapping

```markdown
## Task-to-Outcome Mapping

| Task | Phase | Contributes To | Acceptance Criterion |
|------|-------|---------------|---------------------|
| Install New Relic | 1 | Profiling capability | Profiling tools installed |
| Configure test environment | 1 | Profiling capability | Environment mirrors production |
| Capture baseline metrics | 1 | Profiling capability | Baseline captured |
| Profile 100 slow requests | 2 | Root cause identification | Bottleneck identified |
| Analyze profiling data | 2 | Root cause identification | Bottleneck identified |
| Design optimization approach | 2 | Root cause identification | Approach documented |
| Optimize database queries | 3 | Implementation | Response time <1s |
| Implement caching layer | 3 | Implementation | Response time <1s |
| Eliminate N+1 queries | 3 | Implementation | Response time <1s |
| Run load tests | 4 | Validation | 95th percentile <1s verified |
| Configure monitoring | 4 | Validation | Production readiness |
| Test rollback | 4 | Validation | Rollback plan verified |
```

---

### Completeness Check

**Ask:**
1. Does every task map to a phase gate? (YES/NO)
2. Does every acceptance criterion have tasks? (YES/NO)
3. If all tasks complete, is telos achieved? (YES/NO)

If NO to any, **the plan is incomplete**.

---

## Dependencies & Risks

### Identifying Dependencies

**Question:** What must happen before what?

```markdown
## Dependencies

**Strict Order:**
- Phase 1 must complete before Phase 2 (need profiling before analysis)
- Phase 2 must complete before Phase 3 (need root cause before optimizing)
- Phase 3 must complete before Phase 4 (need changes before testing)

**Within Phases:**
- Configure environment before profiling (Phase 1)
- Analyze data before designing approach (Phase 2)
- All optimizations before load testing (Phase 4)
```

---

### Identifying Risks

**Question:** What could prevent us from achieving the telos?

```markdown
## Risks & Mitigation

### Risk 1: Root cause is external service
**Likelihood:** Medium  
**Impact:** High (changes our approach entirely)  
**Mitigation:**
- Profile external service calls separately in Phase 1
- Have backup plan for external service optimization
**Rollback:** N/A (discovery phase)

### Risk 2: Optimizations break checkout flow
**Likelihood:** Medium  
**Impact:** High (revenue impact)  
**Mitigation:**
- Comprehensive test suite before deployment
- Feature flag for gradual rollout
- Monitoring alerts for errors
**Rollback:** Revert changes, disable feature flag

### Risk 3: Performance gains insufficient
**Likelihood:** Low  
**Impact:** High (telos not achieved)  
**Mitigation:**
- Multiple optimization strategies identified in Phase 2
- Incremental approach (implement highest-impact first)
**Rollback:** Continue to Phase 2 (re-identify)
```

---

## Validation Checkpoints

### Why Validate?

Validation proves we're on track toward the telos.

Without validation, we only discover failure at the end.

---

### Types of Validation

1. **Tests** – Automated verification (unit, integration, e2e)
2. **Reviews** – Peer/expert verification (code review, architecture review)
3. **Checks** – Manual verification (smoke test, acceptance test)
4. **Measurements** – Metric verification (performance test, monitoring)

---

### Example Validation Checkpoints

```markdown
## Validation Checkpoints

### After Phase 1: Profiling Capability
**Tests:**
- [ ] Profiling tool smoke test passes
- [ ] Test environment load test passes

**Reviews:**
- [ ] Test environment configuration peer reviewed
- [ ] Baseline metrics reviewed by team

**Checks:**
- [ ] Manual profiling of 3 sample requests successful

**Measurements:**
- [ ] Baseline: 95th percentile = 5.2s (documented)

---

### After Phase 2: Root Cause Identified
**Analysis:**
- [ ] 100+ requests profiled and analyzed

**Reviews:**
- [ ] Bottleneck analysis peer reviewed
- [ ] Optimization approach approved by senior engineer

**Evidence:**
- [ ] Profiling report shows N+1 query in order retrieval

---

### After Phase 3: Optimizations Implemented
**Tests:**
- [ ] Unit tests: all passing (150 tests)
- [ ] Integration tests: no regressions (45 tests)
- [ ] Performance tests: response time reduced by 80%

**Reviews:**
- [ ] Code review: approved
- [ ] Security review: no new vulnerabilities

**Measurements:**
- [ ] Local testing: 95th percentile = 0.8s

---

### After Phase 4: Performance Validated
**Tests:**
- [ ] Load tests: 95th percentile <1s with 10k concurrent users
- [ ] Rollback test: successful rollback to previous version

**Measurements:**
- [ ] Production monitoring: 95th percentile = 0.9s
- [ ] Business metric: checkout abandonment = 8%

**Evidence:**
- [ ] Telos achieved (acceptance criteria met)
```

---

## Common Failure Modes

### 1. Task-First Planning

**Symptom:** Start with "we need to do X, Y, Z" instead of "success looks like..."

**Example:**
- ❌ "We need to add caching, optimize queries, and upgrade hardware"
- ✅ "We need checkout <1s. To achieve that, we must first identify bottleneck, then optimize based on data."

**Fix:** Always start with end-state, work backward.

---

### 2. Vague End-States

**Symptom:** End-state is not observable or falsifiable

**Example:**
- ❌ "Make the system better"
- ✅ "Reduce checkout response time from 5s to <1s (95th percentile)"

**Fix:** Make end-state observable and measurable.

---

### 3. Missing Task-Outcome Mapping

**Symptom:** Can't explain why a task is needed

**Example:**
- Task: "Refactor user service"
- Question: "How does this contribute to <1s checkout?"
- Answer: "Uh... good practice?"
- ❌ Task is invalid

**Fix:** Every task must map to acceptance criterion.

---

### 4. No Phase Gates

**Symptom:** Can't verify progress until the end

**Example:**
- Long plan with no checkpoints
- Discover at end that approach was wrong

**Fix:** Add phase gates with observable criteria.

---

### 5. Unfalsifiable Plans

**Symptom:** No way to prove plan fails to achieve telos

**Example:**
- Plan: "Improve performance"
- No specific metrics
- Any change can be claimed as "improvement"

**Fix:** Make acceptance criteria falsifiable.

---

## Why This Works in Practice

### Without Teleological Planning

| Problem | Why It Happens |
|---------|----------------|
| Teams optimize tasks, not outcomes | No end-state defined |
| Plans feel "complete" but fail | Tasks don't map to telos |
| Late surprises derail delivery | No phase gates, no validation |
| Accountability is fuzzy | Can't prove plan achieves outcome |

---

### With Teleological Planning

| Benefit | How It Works |
|---------|--------------|
| Every task has a reason | Task-to-outcome mapping |
| Scope is intentional | Non-goals explicit |
| Success is verifiable | Acceptance criteria observable |
| Progress is meaningful | Phase gates prove advancement toward telos |

---

## Relationship to Hermeneutic Interpretation

**SOLUTION mode (hermeneutic)** produces:
- Problem statement (what's wrong)
- Desired outcome (what success looks like)
- Success criteria (how we know)
- Constraints (what limits us)

**PLAN mode (teleological)** consumes these and produces:
- Concrete end-state (telos)
- Backward-derived phases
- Task-to-outcome mapping
- Phase gates and validation

**Together they form:**
1. Interpret the problem (hermeneutic)
2. Define the end-state (from interpretation)
3. Plan backward from end-state (teleological)
4. Execute plan (guided by both)

---

## Key Principle

> **Planning is not listing tasks.**  
> **It is proving that the end-state will exist.**

Commands initiate it.  
Rules enforce it.  
Skills teach it.  
Subagents protect it.

**This is teleology made operational.**

---

## References

See `references/` for:
- Aristotle's *Nicomachean Ethics* – Original teleological thinking
- *The Goal* (Goldratt) – Constraint-based teleological planning
- Example teleological plans from real projects
- Anti-patterns and how to avoid them
