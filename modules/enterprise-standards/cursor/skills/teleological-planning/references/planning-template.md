# Teleological Planning Template

Quick-start template for backward, goal-driven planning.

---

## End-State (Telos)

**What does complete look like?**
[Observable, measurable end state]

---

## Acceptance Criteria

**How do we verify we achieved the telos?**
1. [Criterion 1 - observable and testable]
2. [Criterion 2 - observable and testable]
3. [Criterion 3 - observable and testable]

---

## Non-Goals

**What are we explicitly NOT doing?**
- [Out of scope item 1]
- [Future enhancement]

---

## Backward Planning

### Phase N (Final): [Name]
**Goal:** [What this phase achieves]
**Gate:** [Observable criteria that this phase is complete]

**Tasks:**
- [Task A] → Maps to Acceptance Criterion X
- [Task B] → Maps to Acceptance Criterion Y

**Outputs:**
- [What this phase produces]

**Verification:**
- [How we verify phase gate]

---

### Phase N-1: [Name]
**Goal:** [What this phase achieves - enables Phase N]
**Gate:** [Observable criteria]
**Depends on:** Phase N-2

**Tasks:**
- [Task C] → Maps to Acceptance Criterion Z

---

### Phase 1 (Foundation): [Name]
**Goal:** [What this phase achieves - foundation for all others]
**Gate:** [Observable criteria]
**Depends on:** None

**Tasks:**
- [Task X] → Maps to Acceptance Criterion A

---

## Task-to-Criterion Mapping

Verify all criteria covered:

| Acceptance Criterion | Phase | Tasks |
|---------------------|-------|-------|
| Criterion 1 | Phase X | Task A, Task B |
| Criterion 2 | Phase Y | Task C |
| Criterion 3 | Phase Z | Task D, Task E |

**Orphaned tasks:** [List tasks that don't map] ← Remove or justify
**Uncovered criteria:** [List criteria with no tasks] ← Add tasks

---

## Dependencies

**Phase Dependencies:**
- Phase 3 depends on Phase 2 (needs API for UI)
- Phase 2 depends on Phase 1 (needs database for API)

**External Dependencies:**
- [Third-party API, library, service]
- [Team/resource availability]

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How we address it] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How we address it] |

---

## Phase Gates (Observable)

**Phase 1 Gate:**
- [ ] [Specific, verifiable criterion]
- [ ] [Specific, verifiable criterion]
- **Verification method:** [How we check]

**Phase 2 Gate:**
- [ ] [Specific, verifiable criterion]
- [ ] [Specific, verifiable criterion]
- **Verification method:** [How we check]

**Phase N Gate (Final):**
- [ ] All acceptance criteria met
- [ ] End-state achieved
- **Verification method:** [How we prove telos achieved]

---

## Rollback Strategy

**If Phase X fails:**
- [Rollback procedure]
- [Data backup/restore]
- [How to safely revert]

---

## Success Verification

**After all phases complete:**
1. Check each acceptance criterion
2. Verify end-state achieved
3. Measure success metrics
4. Get stakeholder signoff

**If telos not achieved:**
- Identify gap
- Add phase or tasks
- Re-execute

---

## Validation Checklist

Before execution:

- [ ] All phases derived backward from end-state
- [ ] Every acceptance criterion has tasks
- [ ] Every task maps to a criterion
- [ ] Phase gates are observable and verifiable
- [ ] Dependencies documented
- [ ] Risks have mitigation strategies
- [ ] Phase order is logical (foundation → final)
- [ ] Rollback strategy defined
- [ ] std.planner agent validated this plan

---

## Next Steps

1. Validate this plan with `/std.plan`
2. Invoke `std.planner` agent for validation
3. Address any gaps identified
4. Once validated, begin Phase 1
5. Verify each phase gate before proceeding
6. After completion, invoke `std.verifier`

---

## Usage Example

See `example-multi-phase-feature.md` for a complete worked example.
