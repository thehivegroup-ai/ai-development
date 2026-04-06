# Test Prompts for Teleological Planning

These test prompts validate that the skill triggers correctly and produces outcome-driven plans.

---

## Realistic User Requests (Good Test Cases)

These prompts reflect how real users actually phrase planning requests:

### Test Case 1: Feature Request After Solution
```
"ok so we figured out we need to speed up checkout (get it under 1 second). 
now what? like what are the actual steps to make that happen? where do we 
even start"
```

**Expected behavior:**
- Skill triggers on "what are the actual steps"
- Takes outcome from previous context (<1s checkout)
- Works backward from end-state
- Creates phases with dependencies
- Maps tasks to acceptance criteria

---

### Test Case 2: Complex Multi-Step Feature
```
"boss wants full user dashboard with profile editing, order history, saved 
payment methods, and address book. this feels huge. help me break it down 
into phases so i can actually ship something"
```

**Expected behavior:**
- Skill triggers on "break it down into phases"
- Identifies multiple features (profile, orders, payments, addresses)
- Creates backward plan from "complete dashboard"
- Defines phase gates
- Shows dependencies (authentication before profile, etc.)

---

### Test Case 3: Vague Goal Needs Concrete Plan
```
"we need to improve our API performance before black friday (8 weeks away). 
what's the plan? what do we do week 1, week 2, etc?"
```

**Expected behavior:**
- Skill triggers on "what's the plan"
- Requires concrete end-state first (may need hermeneutic-solution first)
- If outcome defined, creates time-boxed phases
- Includes validation checkpoints
- Risk mitigation for deadline

---

### Test Case 4: Migration Planning
```
"got approval to migrate from monolith to microservices. zero downtime 
required. need a plan that shows how we get there without breaking production"
```

**Expected behavior:**
- Skill triggers on "need a plan"
- Backward planning from "microservices with zero downtime"
- Phases for incremental migration
- Rollback plans for each phase
- Dependencies explicit (service boundaries before extraction)

---

### Test Case 5: Performance Optimization
```
"profiling shows checkout API is slow because of N+1 queries in order 
retrieval. we need <1s response time. what's the execution plan?"
```

**Expected behavior:**
- Skill triggers on "execution plan"
- Root cause known (N+1 queries)
- Backward planning from <1s response time
- Phases: optimize queries → test → validate → deploy
- Task-to-outcome mapping clear

---

## Clean Prompts (Avoid Testing With These)

These are too polished and don't reflect real usage:

### Anti-Test Case 1
```
"Please create a teleological plan for implementing user authentication."
```

**Why bad:** Uses skill name explicitly, no context, too formal

---

### Anti-Test Case 2
```
"I need to build an execution plan working backward from the desired end-state."
```

**Why bad:** Uses planning terminology, unrealistic phrasing

---

### Anti-Test Case 3
```
"Let's apply teleological thinking to derive a phase-based plan."
```

**Why bad:** Philosophical jargon, no real user talks like this

---

## Edge Cases (Should NOT Trigger)

These requests should be handled without the skill:

### Edge Case 1: Simple Task
```
"add a logout button"
```

**Expected:** Skill should NOT trigger (no planning needed, just do it)

---

### Edge Case 2: Already Has Plan
```
"here's the plan: step 1 is X, step 2 is Y, step 3 is Z. execute it"
```

**Expected:** Skill should NOT trigger (plan already exists, just execute)

---

### Edge Case 3: Needs Solution First
```
"make the system faster"
```

**Expected:** `hermeneutic-solution` should trigger first, NOT planning  
(outcome not defined yet, interpretation needed)

---

## Success Criteria for Skill

When tested with realistic prompts, the skill should:

1. **Trigger reliably** when user asks for plan/phases/steps after outcome is clear
2. **NOT trigger** before outcome is defined (defer to hermeneutic-solution)
3. **Produce artifacts** matching the template (end-state, phases, task mapping)
4. **Work backward** from end-state, not forward from tasks
5. **Include phase gates** with observable criteria
6. **Map every task** to acceptance criterion
7. **Enable execution** (plan is actionable, not abstract)

---

## Realistic Planning Scenarios

### Scenario 1: After Hermeneutic Interpretation
```
User: "requirements are super unclear on this auth feature"
→ hermeneutic-solution triggers
→ produces: clear outcome, success criteria, constraints

User: "ok that's clearer. now how do we build it?"
→ teleological-planning triggers
→ produces: backward-derived plan from outcome
```

### Scenario 2: Tight Deadline
```
User: "we have 2 weeks to add payment processing to checkout. 
what's the timeline? what do we tackle first?"
→ teleological-planning triggers
→ backward plan with time-boxed phases
→ critical path identified
→ risk mitigation for deadline
```

### Scenario 3: Large Ambiguous Goal
```
User: "rebuild the entire admin panel"
→ hermeneutic-solution triggers first
→ clarifies scope, constraints, success criteria

User: "ok so we're rebuilding user management, reporting, and 
settings. now break that into phases we can ship"
→ teleological-planning triggers
→ phases derived backward from "complete admin panel"
→ dependencies explicit (user mgmt before reporting)
```

---

## Testing Protocol

### Manual Testing
1. Copy prompt from "Realistic User Requests"
2. Paste into Claude Code chat
3. Verify skill triggers automatically
4. Check output matches backward planning (not task-first)
5. Verify task-to-outcome mapping exists
6. Verify phase gates are observable

### Automated Testing (Future)
```bash
# Generate test cases
skill-creator test teleological-planning --generate

# Run tests
skill-creator test teleological-planning --run

# Review results
skill-creator test teleological-planning --review
```

---

## Common Mistakes to Check

### Mistake 1: Task-First Planning
❌ **Wrong output:**
```markdown
## Plan
1. Set up database
2. Create API routes
3. Build UI
```

✅ **Correct output:**
```markdown
## End-State (Telos)
Users can manage addresses in <2s, stored securely with validation

## Backward Derivation
To achieve secure address management:
  Phase 3: Validation proven (load tests, security audit)
  Phase 2: Features implemented (CRUD + validation)
  Phase 1: Infrastructure ready (DB schema + API structure)
```

### Mistake 2: Missing Task-Outcome Mapping
❌ **Wrong:** Tasks listed but no mapping to acceptance criteria

✅ **Correct:** Every task maps to criterion, completeness verified

### Mistake 3: Vague Phase Gates
❌ **Wrong:** "Phase 1 mostly done"

✅ **Correct:** "Phase 1 complete: [x] Schema deployed, [x] Baseline captured"

---

## Iteration Log

### Version 1.0.0 (2026-03-16)
- Initial test prompts created
- 5 realistic cases, 3 anti-cases, 3 edge cases
- Success criteria defined
- Common mistakes documented
- Testing protocol established

---

## Adding New Test Cases

When adding test cases:
1. Use actual user language (casual, incomplete sentences OK)
2. Show context (why are they planning?)
3. Indicate complexity level
4. Document expected behavior
5. Test that skill triggers automatically

**Sources for new test cases:**
- Real project planning sessions
- Retrospectives where "we should have planned better"
- Product roadmap discussions
- Technical design proposals
- Architecture decision records
