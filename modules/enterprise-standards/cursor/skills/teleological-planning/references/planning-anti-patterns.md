# Planning Anti-Patterns

Common mistakes when applying teleological (backward) planning.

---

## Anti-Pattern 1: Task-First Planning

**Bad (Forward Planning):**
```markdown
## Tasks
1. Set up database
2. Create API endpoints
3. Build UI
4. Deploy
```

**Why Bad:**
- Tasks brainstormed, not derived
- No connection to end-state
- Can't prove tasks achieve goal
- Classic waterfall thinking

**Good (Backward Planning):**
```markdown
## End-State
Users can view order history in dashboard.

## Working Backward
To achieve this, users must:
→ See order list in UI (Phase 3: Frontend)
→ Get orders from API (Phase 2: API)
→ Store orders in database (Phase 1: Data)

Each phase derived backward from end-state.
```

---

## Anti-Pattern 2: Vague Phase Gates

**Bad:**
```markdown
Phase 1 Gate: "Database ready"
Phase 2 Gate: "API tested"
```

**Why Bad:**
- Not observable
- Not verifiable
- Subjective interpretation

**Good:**
```markdown
Phase 1 Gate: "Orders table exists with 3 test records, migration runs without errors"
Phase 2 Gate: "All 5 API endpoints return 200 with Postman tests, coverage > 80%"
```

---

## Anti-Pattern 3: Orphaned Tasks

**Bad:**
```markdown
## Acceptance Criteria
1. Users can register
2. Users can log in

## Tasks
- Add registration endpoint
- Add login endpoint
- Add comprehensive logging ← ORPHAN
- Add analytics dashboard ← ORPHAN
```

**Why Bad:**
- Logging doesn't map to criteria
- Dashboard doesn't map to criteria
- Scope creep disguised as tasks

**Good:**
```markdown
Map every task to a criterion:
- Registration endpoint → Criterion 1 ✓
- Login endpoint → Criterion 2 ✓

Remove orphans or add criteria.
```

---

## Anti-Pattern 4: Missing Dependencies

**Bad:**
```markdown
Phase 1: Build UI forms
Phase 2: Create API
Phase 3: Set up database
```

**Why Bad:**
- Order is wrong
- UI depends on API
- API depends on database
- Dependencies not explicit

**Good:**
```markdown
Phase 1: Database (no dependencies)
Phase 2: API (depends on Phase 1)
Phase 3: UI (depends on Phase 2)

Dependencies explicit, order logical.
```

---

## Anti-Pattern 5: No Risk Mitigation

**Bad:**
```markdown
## Risks
- Database migration might fail
- API might be slow
```

**Why Bad:**
- Identified risks but no mitigation
- Plan doesn't address "what if"

**Good:**
```markdown
## Risks
- Database migration might fail
  **Mitigation:** Backup before migration, test on staging, have rollback script

- API might be slow
  **Mitigation:** Load test before deployment, add caching, implement timeouts
```

---

## Anti-Pattern 6: Uncovered Acceptance Criteria

**Bad:**
```markdown
## Acceptance Criteria
1. Users can register
2. Users can log in
3. Sessions persist across refreshes ← NO TASKS

## Tasks
- Add registration
- Add login
[No task for session persistence]
```

**Why Bad:**
- Criterion 3 has no tasks
- Can't achieve telos
- Gap will be discovered late

**Good:**
```markdown
Ensure every criterion has tasks:
- Criterion 1 → Registration tasks
- Criterion 2 → Login tasks
- Criterion 3 → Session storage task ← ADDED
```

---

## Anti-Pattern 7: Phases Without Logic

**Bad:**
```markdown
Phase 1: Do A, B, C
Phase 2: Do D, E, F
Phase 3: Do G, H, I
```

**Why Bad:**
- No justification for phase grouping
- No clear progression
- Appears arbitrary

**Good:**
```markdown
Phase 1: Data Layer (foundation)
Phase 2: Business Logic (uses Phase 1)
Phase 3: Presentation (uses Phase 2)

Each phase builds on previous.
```

---

## Anti-Pattern 8: No Success Verification

**Bad:**
```markdown
## End-State
Faster checkout

## Plan
[Tasks to make checkout faster]
```

**Why Bad:**
- "Faster" not measurable
- Can't verify success
- No baseline

**Good:**
```markdown
## End-State
Checkout completion time < 30 seconds (currently 2 minutes)

## Success Verification
- Measure current: 2 min baseline
- Implement changes
- Measure after: Must be < 30s
- If not, iterate
```

---

## Anti-Pattern 9: Planning Before Framing

**Bad:**
[Jump directly to planning without problem framing]

**Why Bad:**
- Don't understand problem fully
- End-state unclear
- Plan will be wrong

**Good:**
```markdown
1. Frame problem first (/std.solution)
2. Validate framing (std.verifier)
3. THEN plan backward (/std.plan)
```

---

## Anti-Pattern 10: Ignoring Phase Validation

**Bad:**
[Plan phases but never check if gates are met]

**Why Bad:**
- Can't verify progress
- Issues discovered too late
- No checkpoints

**Good:**
```markdown
After each phase:
1. Check phase gate criteria
2. Verify all tasks complete
3. Test before moving to next phase
4. If gate not met, don't proceed
```

---

## Quick Self-Check

Before executing plan:

- [ ] Tasks derived backward from end-state?
- [ ] Every acceptance criterion has tasks?
- [ ] Every task maps to a criterion?
- [ ] Phase gates are observable?
- [ ] Dependencies documented?
- [ ] Risks have mitigation?
- [ ] Phase order logical?
- [ ] Success is verifiable?

If any unchecked, revise plan.
