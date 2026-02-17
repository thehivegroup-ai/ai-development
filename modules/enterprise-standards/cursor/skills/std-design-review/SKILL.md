---
name: std-design-review
description: Trigger a structured heuristic evaluation of UI against usability and visual design principles.
disable-model-invocation: true
---

# Standard Design Review

Trigger a structured heuristic evaluation of UI against usability and visual design principles.

**This is not an opinion. This is a structured, evidence-based assessment against established criteria.**

---

## Purpose

Evaluate UI design quality systematically:
- Score against Nielsen's 10 usability heuristics
- Score against 11 visual design principles
- Check platform-specific compliance (web/iOS/Android)
- Quick accessibility audit
- Produce prioritized, actionable findings

---

## Prerequisites

**Before reviewing, establish context:**
- What is being evaluated? (screen, flow, component, full app)
- What platform? (web, iOS, Android, responsive)
- Who are the target users?
- What is the primary user task?
- What design system applies?

**If no design documentation exists, read `docs/design/` first. If none exists, note this as a finding.**

---

## The Evaluation Loop

### Step 1: Establish Context

**Question:**
- What are we evaluating?
- Who uses it and why?
- What design system or conventions apply?

**Output:**
```markdown
## Evaluation Context
- **Subject:** [Screen/flow/component]
- **Platform:** [Web / iOS / Android / Responsive]
- **Target Users:** [User description]
- **Primary Task:** [Main user goal]
- **Design System:** [System name or "none"]
```

---

### Step 2: Usability Heuristic Evaluation

**Invoke `ux-heuristic-evaluator` subagent:**

Evaluate against all 10 Nielsen heuristics. Score each: Pass / Minor / Major / Critical.

Provide evidence and specific recommendations for each finding.

---

### Step 3: Visual Design Evaluation

**Invoke `ux-visual-design-critic` subagent:**

Evaluate against all 11 visual design principles. Score each: Pass / Minor / Major / Critical.

Provide evidence and specific recommendations for each finding.

---

### Step 4: Platform and Accessibility Check

**Invoke `ux-platform-evaluator` and `ux-accessibility-auditor` subagents:**

Check platform-specific compliance and critical accessibility criteria.

---

### Step 5: Classify and Prioritize

**Use Nielsen's severity scale (0-4):**
- 0: Not a problem
- 1: Cosmetic (low priority)
- 2: Minor (medium priority)
- 3: Major (high priority)
- 4: Catastrophe (must fix before release)

---

### Step 6: Synthesize

**Invoke `std-verifier` and `std-planner`:**
- Verify evaluation consistency
- Assess remediation feasibility
- Produce actionable summary

---

## Required Artifacts

Every design review MUST produce:

```markdown
# Design Heuristic Evaluation

**Date:** YYYY-MM-DD
**Subject:** [What was evaluated]
**Platform:** [Web / iOS / Android / Responsive]
**Status:** Complete

## Evaluation Context
[Context details]

## Usability Heuristic Scores
[H1-H10 scores with findings]

## Visual Design Scores
[V1-V11 scores with findings]

## Prioritized Findings
### Critical (Severity 4)
### Major (Severity 3)
### Minor (Severity 2)
### Cosmetic (Severity 1)

## What's Working Well
[Positive findings]

## Recommended Actions
1. [Prioritized action items]
```

---

## Guidance

- **Apply the `heuristic-design-review` skill** for detailed evaluation method
- **Read `docs/design/` files** before evaluating to understand documented conventions
- **Update `docs/design/design-decisions.md`** with significant findings
- **Challenge with subagents** (`ux-heuristic-evaluator`, `ux-visual-design-critic`, `std-verifier`)
- **Every finding needs evidence** - No opinions, only observations against criteria
- **Include positive findings** - Acknowledge what works well

---

## Common Failure Modes

- **Opinion masquerading as evaluation** - "Looks cluttered" instead of citing H8 with evidence
- **Severity inflation** - Rating cosmetic issues as critical
- **Missing context** - Evaluating without knowing users or tasks
- **Platform blindness** - Applying web heuristics to mobile
- **No positive findings** - Only listing problems demoralizes teams
- **One-time evaluation** - Should evaluate at DESIGN-FLOW and after BUILD-SCREEN

---

## Transitions

**After DESIGN-REVIEW:**
- If after DESIGN-FLOW: → BUILD-SCREEN (no critical issues) or → DESIGN-FLOW (critical issues found)
- If after BUILD-SCREEN: → CLEAN-SWEEP
- If standalone audit: → PLAN (to prioritize remediation)
