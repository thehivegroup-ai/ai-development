# std-verifier Scope Clarification

**Date:** 2026-03-09  
**Status:** Completed

---

## Problem

The `std-verifier` agent was being invoked during BUILD phases (DESIGN-FLOW, BUILD-SCREEN, BUILD-API), creating excessive token usage overhead when it should only be used:
1. During SOLUTION mode for interpretation consistency checks
2. After implementation is complete (CLEAN-SWEEP, TEST-LOOP) for quality gates

---

## Solution

Updated documentation across the enterprise-standards module to clarify when `std-verifier` should and should not be invoked.

---

## Changes Made

### 1. Agent Definition Updated
**File:** `modules/enterprise-standards/cursor/agents/std-verifier.md`

Added explicit usage guidance:

✅ **USE in these modes:**
- SOLUTION Mode - Test interpretation for internal consistency
- CLEAN-SWEEP Mode - After implementation complete, verify quality
- TEST-LOOP Mode - Validate test coverage and completeness
- DEPLOY-RELEASE Mode - Pre-deployment quality gate

❌ **DO NOT USE in these modes:**
- PLAN Mode - Planning doesn't need verification
- DESIGN-FLOW Mode - Too early, no implementation to verify
- DESIGN-REVIEW Mode - Use UX subagents, not std-verifier
- BUILD-SCREEN Mode - Building in progress, premature to verify
- BUILD-API Mode - Building in progress, premature to verify

---

### 2. Workflow Modes Updated
**File:** `modules/enterprise-standards/cursor/rules/06-std-workflow-modes.mdc`

**DESIGN-REVIEW Mode:**
- Removed: "Invoke `std-verifier` for consistency check"
- Kept only UX-specific subagents

**CLEAN-SWEEP Mode:**
- Clarified: "AFTER cleanup complete: Optionally invoke `std-verifier` for quality gate"
- Made it clear this is a final step, not during cleanup

---

### 3. Hermeneutic Solution Skill Updated
**File:** `modules/enterprise-standards/cursor/skills/hermeneutic-solution/SKILL.md`

**Step 7 (Test Interpretation):**
- Added: "Use subagents to stress-test ONLY in SOLUTION mode"
- Added: "When to challenge interpretation" section
- Clarified: Verification happens later in CLEAN-SWEEP for BUILD modes

**Failure Mode 5:**
- Updated: "During SOLUTION mode, invoke `std-planner` and `std-verifier`. Do NOT invoke during BUILD modes."

---

### 4. std-solution Skill Updated
**File:** `modules/enterprise-standards/cursor/skills/std-solution/SKILL.md`

**Step 7 (Challenge the Interpretation):**
- Added: "Invoke subagents to test interpretation (SOLUTION mode only)"
- Added note: "This challenge step is ONLY for SOLUTION mode. During BUILD modes, skip verification until CLEAN-SWEEP phase."

**Guidance Section:**
- Updated: "Challenge with subagents (SOLUTION mode only)"

---

### 5. std-design-review Skill Updated
**File:** `modules/enterprise-standards/cursor/skills/std-design-review/SKILL.md`

**Step 6 (Synthesize):**
- Removed: "Invoke `std-verifier` and `std-planner`"
- Replaced with: Direct synthesis actions

**Guidance Section:**
- Removed: `std-verifier` from subagent list
- Kept only UX-specific subagents

---

### 6. std-clean-sweep Skill Updated
**File:** `modules/enterprise-standards/cursor/skills/std-clean-sweep/SKILL.md`

**Guidance Section:**
- Updated: "Use the `std-verifier` subagent ONLY as a final quality gate after cleanup is complete, not during the cleanup process."

---

### 7. Reference Templates Updated

**hermeneutic-solution/references/solution-template.md:**
- Updated: "(SOLUTION mode only) std-verifier invoked for consistency check"
- Updated: "(SOLUTION mode only) Invoke `std-verifier` agent to check interpretation consistency"

**hermeneutic-solution/references/anti-patterns.md:**
- Anti-Pattern 10: Added note about verification timing
- How to Avoid: Updated step 5 to "(SOLUTION mode only)"

**heuristic-design-review/references/anti-patterns.md:**
- Removed: std-verifier from self-check checklist

**heuristic-design-review/references/evaluation-template.md:**
- Removed: std-verifier and std-planner from validation checklist

---

## Expected Impact

### Token Usage Reduction
- **Before:** std-verifier invoked during DESIGN-REVIEW and throughout BUILD phases
- **After:** std-verifier only invoked in SOLUTION mode (interpretation checks) and CLEAN-SWEEP/TEST-LOOP (quality gates)
- **Estimated reduction:** 60-80% fewer std-verifier invocations during typical feature development

### Workflow Efficiency
- BUILD phases no longer interrupted by comprehensive verification checklists
- Verification happens at appropriate checkpoints (after implementation complete)
- SOLUTION mode still gets interpretation consistency checks (maintains quality)

---

## Key Principle

**Separation of Concerns:**
- **Interpretation verification (SOLUTION mode):** Check logical consistency of problem understanding
- **Implementation verification (POST-BUILD):** Check code quality, test coverage, security after building is complete
- **Design verification (DESIGN-REVIEW mode):** Use specialized UX subagents, not general verifier

---

## Testing Recommendations

1. Monitor token usage during next few feature builds
2. Verify std-verifier is still invoked at appropriate times:
   - During SOLUTION mode interpretation challenges
   - After CLEAN-SWEEP as quality gate
   - Before DEPLOY-RELEASE
3. Confirm std-verifier is NOT invoked during:
   - DESIGN-FLOW
   - BUILD-SCREEN
   - BUILD-API
   - DESIGN-REVIEW

---

## Related Files

All changes are in `modules/enterprise-standards/cursor/`:

- `agents/std-verifier.md` (agent definition)
- `rules/06-std-workflow-modes.mdc` (workflow state machine)
- `skills/std-solution/SKILL.md` (solution framing)
- `skills/hermeneutic-solution/SKILL.md` (hermeneutic circle)
- `skills/std-design-review/SKILL.md` (design review)
- `skills/std-clean-sweep/SKILL.md` (cleanup)
- `skills/hermeneutic-solution/references/solution-template.md`
- `skills/hermeneutic-solution/references/anti-patterns.md`
- `skills/heuristic-design-review/references/anti-patterns.md`
- `skills/heuristic-design-review/references/evaluation-template.md`

---

## Conclusion

The `std-verifier` agent is now properly scoped to:
1. **SOLUTION mode:** Interpretation consistency checks only
2. **POST-BUILD phases:** Quality gates after implementation complete

This eliminates overhead during BUILD phases while maintaining quality checks at appropriate workflow checkpoints.
