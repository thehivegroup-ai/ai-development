# Design Heuristic Evaluation Template

Quick-start template for conducting a structured design review using Nielsen's heuristics and visual design principles.

---

## Evaluation Context

**Date:** YYYY-MM-DD
**Subject:** [Screen name, flow, component, or full application]
**Platform:** [Web / iOS / Android / Responsive]
**Evaluator:** [AI / Human / Both]
**Target Users:** [Persona or user type description]
**Primary User Task:** [What users are trying to accomplish on this screen]
**Design System:** [Design system name, or "none"]

---

## Usability Heuristic Evaluation

Score each heuristic: **Pass** | **Minor** (Severity 1-2) | **Major** (Severity 3) | **Critical** (Severity 4)

### H1: Visibility of System Status
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H2: Match Between System and Real World
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H3: User Control and Freedom
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H4: Consistency and Standards
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H5: Error Prevention
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H6: Recognition Rather Than Recall
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H7: Flexibility and Efficiency of Use
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H8: Aesthetic and Minimalist Design
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H9: Help Users Recognize, Diagnose, and Recover from Errors
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

### H10: Help and Documentation
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Location:** [Where in the UI]
- **Recommendation:** [Specific fix]

---

## Visual Design Evaluation

Score each principle: **Pass** | **Minor** (Severity 1-2) | **Major** (Severity 3) | **Critical** (Severity 4)

### V1: Visual Hierarchy
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V2: Contrast
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V3: Balance
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V4: Scale
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V5: White Space
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V6: Proximity
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V7: Unity
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V8: Gestalt Principles
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V9: Movement and Flow
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V10: Dominance
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

### V11: Rhythm
- **Score:** [Pass / Minor / Major / Critical]
- **Findings:** [What was observed]
- **Recommendation:** [Specific fix]

---

## Platform-Specific Findings

### [Web / iOS / Android] Compliance
- [Finding 1: severity and specific standard violated]
- [Finding 2: severity and specific standard violated]
- [Finding 3: severity and specific standard violated]

---

## Accessibility Quick Check

- [ ] Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text)
- [ ] Touch/click targets meet minimum size (44x44pt iOS, 48x48dp Android, 44x44px web)
- [ ] Focus indicators are visible for keyboard navigation
- [ ] Color is not the sole means of conveying information
- [ ] Motion respects prefers-reduced-motion
- [ ] Text is resizable without layout breakage
- [ ] Images have alt text or are decorative

**Findings:**
- [Finding 1: WCAG criterion and severity]
- [Finding 2: WCAG criterion and severity]

---

## Prioritized Findings

### Critical (Severity 4) - Must Fix Before Release
1. [Finding: heuristic/principle, description, location, recommendation]

### Major (Severity 3) - High Priority Fix
1. [Finding: heuristic/principle, description, location, recommendation]

### Minor (Severity 2) - Medium Priority Fix
1. [Finding: heuristic/principle, description, location, recommendation]

### Cosmetic (Severity 1) - Low Priority Fix
1. [Finding: heuristic/principle, description, location, recommendation]

---

## What's Working Well

- [Positive 1: specific strength and why it works]
- [Positive 2: specific strength and why it works]
- [Positive 3: specific strength and why it works]

---

## Overall Assessment

### Usability Score: [X/10 heuristics passing]
### Visual Design Score: [X/11 principles passing]

**Summary:** [2-3 sentence narrative assessment]

---

## Recommended Next Actions

1. **Immediate:** [Critical fix with estimated effort]
2. **Short-term:** [Major fixes with estimated effort]
3. **Long-term:** [Systemic improvements]

---

## Validation Checklist

Before concluding evaluation:

- [ ] All 10 heuristics evaluated with evidence
- [ ] All 11 visual design principles evaluated with evidence
- [ ] Platform-specific criteria applied
- [ ] Accessibility quick check completed
- [ ] Severity ratings are consistent and justified
- [ ] Every finding includes a specific recommendation
- [ ] Positive findings documented
- [ ] Remediation feasibility assessed

---

## Next Steps

1. Share evaluation with team/stakeholders
2. Prioritize findings against project constraints
3. Create remediation tasks (invoke `/std-plan` for backward planning)
4. Re-evaluate after fixes are implemented
5. Track improvement over successive evaluations

---

## Usage

See `SKILL.md` in parent directory for complete methodology and subagent integration details.
