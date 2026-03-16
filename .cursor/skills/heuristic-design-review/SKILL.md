---
name: heuristic-design-review
description: Evaluate UI design quality using Nielsen's heuristics and core visual design principles, operationalized as a repeatable review system for web and mobile. Use when evaluating UI usability, reviewing screen designs, or when a design feels off and needs structured critique.
---

# Heuristic Design Review

**This skill operationalizes Jakob Nielsen's usability heuristics and core visual design principles as a repeatable evaluation system for web and mobile interfaces.**

---

## When to Use

- Before building UI (during DESIGN-FLOW) to validate design decisions
- After building UI (after BUILD-SCREEN) to evaluate what was implemented
- When UI feels "off" but the problem is hard to articulate
- When redesigning or refactoring existing screens
- When onboarding a new design system or component library
- As a standalone design audit or expert review
- When accessibility, usability, or visual consistency is in question

---

## Heuristic Design Review Operationalized

### Design Goal

Turn Jakob Nielsen's heuristics and visual design principles from abstract guidelines into actionable evaluation:
- **Prevent usability failures before users encounter them** - Evaluate early and often
- **Make design decisions evidence-based** - Score against established criteria
- **Surface invisible problems** - Things designers and developers stop seeing
- **Produce prioritized, actionable findings** - Severity-ranked remediation list
- **Apply consistently across web and mobile** - Platform-aware evaluation

---

## The Two Evaluation Dimensions

This skill evaluates across two complementary dimensions:

### Dimension 1: Usability Heuristics (Nielsen's 10)

Evaluates whether the interface is **usable** - can users accomplish their goals effectively?

### Dimension 2: Visual Design Principles

Evaluates whether the interface is **well-designed** - does visual communication support usability and brand?

Both dimensions must be evaluated. A usable interface with poor visual design fails. A beautiful interface with poor usability fails.

---

## Dimension 1: Nielsen's 10 Usability Heuristics

### H1: Visibility of System Status

**Principle:** The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.

**Evaluate:**
- Do loading states exist for async operations?
- Are progress indicators shown for multi-step processes?
- Does the UI reflect the current state (active nav, selected items)?
- Are success/failure states communicated clearly?
- Is feedback immediate (< 100ms for direct manipulation, < 1s for navigation)?

**Web-specific:** Browser tab title reflects state, URL reflects location
**Mobile-specific:** Pull-to-refresh feedback, network state indicators

---

### H2: Match Between System and the Real World

**Principle:** The system should speak the users' language, with words, phrases, and concepts familiar to the user, rather than system-oriented terms.

**Evaluate:**
- Are labels written in user language (not developer jargon)?
- Do icons match real-world metaphors users understand?
- Is information organized in a natural, logical order?
- Do date/time/currency formats match user locale?
- Are error messages in plain language (no error codes)?

**Web-specific:** Breadcrumbs follow natural hierarchy
**Mobile-specific:** Gestures match platform conventions (swipe, long-press)

---

### H3: User Control and Freedom

**Principle:** Users often choose system functions by mistake and will need a clearly marked "emergency exit" to leave the unwanted state without having to go through an extended dialogue.

**Evaluate:**
- Can users undo/redo actions?
- Are there clear "back" and "cancel" options?
- Can users exit modals, wizards, and flows at any point?
- Are destructive actions reversible or confirmed?
- Is navigation non-destructive (no data loss on back)?

**Web-specific:** Browser back button works correctly, form state preserved
**Mobile-specific:** Swipe-to-go-back works, sheet dismissal is intuitive

---

### H4: Consistency and Standards

**Principle:** Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.

**Evaluate:**
- Are similar elements styled and behave the same everywhere?
- Are action verbs consistent ("Save" vs "Submit" vs "Done")?
- Does the interface follow platform conventions (web/iOS/Android)?
- Are design tokens applied consistently (colors, spacing, typography)?
- Do interactive elements have consistent affordances?

**Web-specific:** Links look like links, buttons look like buttons
**Mobile-specific:** iOS Human Interface Guidelines / Material Design compliance

---

### H5: Error Prevention

**Principle:** Even better than good error messages is a careful design which prevents a problem from occurring in the first place.

**Evaluate:**
- Are form inputs validated in real-time (before submission)?
- Are dangerous actions behind confirmation dialogs?
- Do inputs constrain values to valid ranges (date pickers, dropdowns)?
- Are default values sensible and helpful?
- Does inline validation guide users before they make errors?

**Web-specific:** Auto-save for long forms, input masks for formatted data
**Mobile-specific:** Input type matches keyboard (email, phone, number)

---

### H6: Recognition Rather Than Recall

**Principle:** Minimize the user's memory load by making objects, actions, and options visible.

**Evaluate:**
- Are recently used items or searches visible?
- Are options shown rather than requiring memorization?
- Is context preserved when navigating between screens?
- Are tooltips/help available where needed?
- Are labels always visible (not just placeholder text)?

**Web-specific:** Persistent navigation, visible search, breadcrumbs
**Mobile-specific:** Tab bar for primary navigation, clear section headers

---

### H7: Flexibility and Efficiency of Use

**Principle:** Accelerators - unseen by the novice user - may often speed up the interaction for the expert user.

**Evaluate:**
- Are keyboard shortcuts available for power users?
- Can frequent actions be completed with fewer steps?
- Are shortcuts discoverable but not mandatory?
- Is there progressive disclosure (simple → advanced)?
- Can users customize or personalize their workflow?

**Web-specific:** Keyboard navigation, search with filters, bulk actions
**Mobile-specific:** Shortcuts, widgets, quick actions (3D Touch/long-press)

---

### H8: Aesthetic and Minimalist Design

**Principle:** Dialogues should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with the relevant units and diminishes their relative visibility.

**Evaluate:**
- Is every element necessary for the current task?
- Is content prioritized (most important most prominent)?
- Are secondary actions visually de-emphasized?
- Is white space used intentionally for clarity?
- Are decorative elements supporting or competing with content?

**Web-specific:** Above-the-fold content is essential, no unnecessary sidebars
**Mobile-specific:** Small screen real estate demands ruthless prioritization

---

### H9: Help Users Recognize, Diagnose, and Recover from Errors

**Principle:** Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.

**Evaluate:**
- Are error messages in plain language (no codes, no jargon)?
- Do error messages say what went wrong specifically?
- Do error messages suggest how to fix the problem?
- Are errors shown near the element that caused them?
- Is the error state visually distinct but not alarming?

**Web-specific:** Form field errors inline, toast notifications for system errors
**Mobile-specific:** Haptic feedback for errors, non-blocking error display

---

### H10: Help and Documentation

**Principle:** Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation.

**Evaluate:**
- Is onboarding provided for first-time users?
- Are help texts contextual (not just a FAQ page)?
- Is documentation searchable and task-oriented?
- Are empty states instructive (not just "No data")?
- Are complex features explained in-context?

**Web-specific:** Inline help, tooltips, knowledge base links
**Mobile-specific:** Coach marks, onboarding carousels, contextual tips

---

## Dimension 2: Core Visual Design Principles

### V1: Visual Hierarchy

**Principle:** The arrangement of elements in order of importance. By varying size, color, and placement, designers signal to users what to look at first.

**Evaluate:**
- Is there a clear primary focal point on each screen?
- Does element size reflect importance (larger = more important)?
- Is the reading order logical (F-pattern for web, top-down for mobile)?
- Are headings, subheadings, and body text visually distinct?
- Do CTAs dominate over secondary actions?

---

### V2: Contrast

**Principle:** Uses differences in color, size, or texture to make specific elements stand out. High contrast is crucial for readability and creating focal points.

**Evaluate:**
- Does text meet WCAG contrast ratios (4.5:1 normal, 3:1 large)?
- Are interactive elements visually distinct from static content?
- Do primary actions have higher contrast than secondary?
- Is color contrast sufficient in all states (hover, active, disabled)?
- Does the design work in both light and dark modes (if applicable)?

---

### V3: Balance

**Principle:** The distribution of visual weight across a composition. Can be symmetrical for stability or asymmetrical for energy.

**Evaluate:**
- Does the layout feel stable and intentional?
- Are heavy elements (images, dark colors) balanced by lighter ones?
- Is the grid system consistent and well-applied?
- Are form layouts balanced (labels, inputs, help text)?
- Does the design avoid lopsided or top-heavy compositions?

---

### V4: Scale

**Principle:** Using relative size to indicate importance and depth. Larger items naturally grab more attention.

**Evaluate:**
- Do element sizes follow a consistent scale (type scale, spacing scale)?
- Are primary elements larger than secondary?
- Does the scale create depth and visual interest?
- Are touch targets appropriately sized (minimum 44x44pt mobile)?
- Is the scale responsive across breakpoints?

---

### V5: White Space (Negative Space)

**Principle:** The empty areas between and around design elements. Provides breathing room, reduces clutter, and helps users focus.

**Evaluate:**
- Is there adequate spacing between content groups?
- Are margins and padding consistent?
- Does white space create clear content separation?
- Is the layout breathable (not cramped)?
- Is spacing intentional (using a spacing scale, not arbitrary)?

---

### V6: Proximity

**Principle:** Elements placed close together are perceived as related. Helps organize information into meaningful groups.

**Evaluate:**
- Are related elements grouped together?
- Are unrelated elements separated by sufficient space?
- Do form labels sit closer to their inputs than to other fields?
- Are action buttons near the content they affect?
- Is content grouped into clear, logical sections?

---

### V7: Unity

**Principle:** The sense that all parts of a design belong together. Achieved by consistently using the same colors, fonts, and styles.

**Evaluate:**
- Is the color palette applied consistently?
- Are fonts limited and used consistently (max 2-3 families)?
- Do components share a consistent visual language?
- Are border radii, shadows, and effects consistent?
- Does every screen feel like it belongs to the same product?

---

### V8: Gestalt Principles

**Principle:** Psychological rules describing how the brain organizes visual information: similarity, closure, continuity, and common region.

**Evaluate:**
- Do similar elements look similar (similarity)?
- Are incomplete patterns still understandable (closure)?
- Do aligned elements create visual flow (continuity)?
- Are grouped elements enclosed or backgrounded (common region)?
- Does the layout leverage natural perceptual grouping?

---

### Advanced Visual Principles

### V9: Movement and Flow

**Principle:** Creating a visual flow that leads the user's eye in a specific path.

**Evaluate:**
- Does the eye follow a natural reading pattern (F-pattern, Z-pattern)?
- Do visual cues (arrows, lines, color) guide attention flow?
- Is the scroll experience intentional (content reveals naturally)?
- Are animations purposeful (guiding attention, not decorative)?

---

### V10: Dominance

**Principle:** Ensuring one element exerts more influence than others to immediately capture attention.

**Evaluate:**
- Is there a single dominant element per screen/section?
- Does the dominant element align with the user's primary task?
- Are hero sections, CTAs, or key content clearly dominant?
- Is dominance achieved through size, color, or position (not all three)?

---

### V11: Rhythm

**Principle:** A sense of organized movement created by repeating elements with varying spacing or intervals.

**Evaluate:**
- Do lists, cards, and grids create a visual rhythm?
- Are repeating patterns consistent and predictable?
- Does variation in rhythm create emphasis where needed?
- Is the rhythm appropriate for content density?

---

## Step-by-Step Evaluation Method

### Step 1: Establish Evaluation Context

**Questions to ask:**
- What is being evaluated? (screen, flow, component, full app)
- What is the target platform? (web, iOS, Android, responsive)
- Who are the target users? (personas, experience level)
- What is the primary user task on this screen?
- What design system or standards apply?
- Do `docs/design/` files exist? Read them as evaluation baseline.
- Does `.cursor/rules/design-system.mdc` exist? If not, recommend creating one.

**Output:**
```markdown
## Evaluation Context
- **Subject:** [Screen/flow/component name]
- **Platform:** [Web / iOS / Android / Responsive]
- **Target Users:** [Persona or user type]
- **Primary Task:** [What users are trying to accomplish]
- **Design System:** [System name or "none"]
- **Evaluator:** [AI / Human / Both]
```

---

### Step 2: Conduct Usability Heuristic Evaluation

**Invoke `ux-heuristic-evaluator` subagent:**

Evaluate the subject against all 10 Nielsen heuristics. For each heuristic:
1. Score: Pass / Minor Issue / Major Issue / Critical
2. Evidence: What specifically was observed
3. Location: Where in the UI the issue occurs
4. Recommendation: Specific fix

**Output:**
```markdown
## Usability Heuristic Evaluation

| # | Heuristic | Score | Findings |
|---|-----------|-------|----------|
| H1 | Visibility of System Status | [Score] | [Finding] |
| H2 | Match Between System and Real World | [Score] | [Finding] |
| H3 | User Control and Freedom | [Score] | [Finding] |
| H4 | Consistency and Standards | [Score] | [Finding] |
| H5 | Error Prevention | [Score] | [Finding] |
| H6 | Recognition Rather Than Recall | [Score] | [Finding] |
| H7 | Flexibility and Efficiency of Use | [Score] | [Finding] |
| H8 | Aesthetic and Minimalist Design | [Score] | [Finding] |
| H9 | Help Users Recognize/Diagnose/Recover from Errors | [Score] | [Finding] |
| H10 | Help and Documentation | [Score] | [Finding] |
```

---

### Step 3: Conduct Visual Design Evaluation

**Invoke `ux-visual-design-critic` subagent:**

Evaluate the subject against all visual design principles. For each principle:
1. Score: Pass / Minor Issue / Major Issue / Critical
2. Evidence: What specifically was observed
3. Recommendation: Specific fix

**Output:**
```markdown
## Visual Design Evaluation

| # | Principle | Score | Findings |
|---|-----------|-------|----------|
| V1 | Visual Hierarchy | [Score] | [Finding] |
| V2 | Contrast | [Score] | [Finding] |
| V3 | Balance | [Score] | [Finding] |
| V4 | Scale | [Score] | [Finding] |
| V5 | White Space | [Score] | [Finding] |
| V6 | Proximity | [Score] | [Finding] |
| V7 | Unity | [Score] | [Finding] |
| V8 | Gestalt Principles | [Score] | [Finding] |
| V9 | Movement and Flow | [Score] | [Finding] |
| V10 | Dominance | [Score] | [Finding] |
| V11 | Rhythm | [Score] | [Finding] |
```

---

### Step 4: Platform-Specific Evaluation

**Invoke `ux-platform-evaluator` subagent:**

Apply platform-specific standards based on evaluation context.

**For Web:**
- Responsive behavior across breakpoints (mobile, tablet, desktop)
- Keyboard navigation and focus management
- Browser compatibility considerations
- URL structure and navigation patterns
- Performance impact of visual choices (image sizes, animations)

**For Mobile (iOS):**
- Human Interface Guidelines compliance
- Safe area and notch handling
- Touch target sizes (minimum 44x44pt)
- Native gesture support
- Dynamic Type support

**For Mobile (Android):**
- Material Design compliance
- Edge-to-edge display handling
- Touch target sizes (minimum 48x48dp)
- Back button behavior
- Font scaling support

**Output:**
```markdown
## Platform-Specific Findings

### [Platform] Compliance
- [Finding 1 with severity]
- [Finding 2 with severity]
- [Finding 3 with severity]
```

---

### Step 5: Accessibility Quick Check

**Invoke `ux-accessibility-auditor` subagent:**

Evaluate critical accessibility criteria that intersect with design:
- Color contrast ratios (WCAG AA minimum)
- Text size and readability
- Touch/click target sizes
- Focus indicators visible
- Color not sole means of conveying information
- Motion/animation respects prefers-reduced-motion
- Screen reader landmark structure

**Output:**
```markdown
## Accessibility Findings
- [Finding 1: severity and WCAG criterion]
- [Finding 2: severity and WCAG criterion]
```

---

### Step 6: Severity Classification and Prioritization

**Classify every finding using Nielsen's severity scale:**

| Severity | Definition | Priority |
|----------|-----------|----------|
| **0 - Not a Problem** | Does not affect usability | None |
| **1 - Cosmetic** | Need not be fixed unless extra time is available | Low |
| **2 - Minor** | Fixing this should be given low priority | Medium |
| **3 - Major** | Important to fix, should be given high priority | High |
| **4 - Catastrophe** | Imperative to fix before product can be released | Critical |

**Prioritization criteria:**
- Frequency: How often does the issue occur?
- Impact: How severely does it affect users?
- Persistence: Is it a one-time or recurring problem?

**Output:**
```markdown
## Prioritized Findings

### Critical (Severity 4) - Must Fix
1. [Finding: description, location, recommendation]

### Major (Severity 3) - Should Fix
1. [Finding: description, location, recommendation]

### Minor (Severity 2) - Could Fix
1. [Finding: description, location, recommendation]

### Cosmetic (Severity 1) - Nice to Fix
1. [Finding: description, location, recommendation]
```

---

### Step 7: Synthesize and Recommend

**Compile evaluation into actionable summary:**

1. Overall assessment (usability + visual design)
2. Top 3 critical issues to address first
3. Pattern-level problems (systemic, not one-off)
4. Positive findings (what's working well)
5. Recommended next actions

**Invoke `std-planner` subagent:**
- "Can these findings be planned from?"
- "What's the remediation priority?"
- "Which fixes have the highest impact-to-effort ratio?"

**Invoke `std-verifier` subagent:**
- "Are findings consistent with each other?"
- "Do recommendations contradict any constraints?"
- "Are severity ratings appropriate?"

**Output:**
```markdown
## Evaluation Summary

### Overall Assessment
[Brief narrative of design quality]

### Usability Score: [X/10 heuristics passing]
### Visual Design Score: [X/11 principles passing]

### Top 3 Issues
1. [Highest impact issue with recommendation]
2. [Second highest impact issue with recommendation]
3. [Third highest impact issue with recommendation]

### Systemic Patterns
- [Pattern 1: recurring problem across multiple screens]
- [Pattern 2: design system inconsistency]

### What's Working Well
- [Positive 1: specific strength]
- [Positive 2: specific strength]

### Recommended Next Actions
1. [Immediate action]
2. [Short-term improvement]
3. [Longer-term enhancement]
```

---

### Step 8: Produce Evaluation Artifact

Every evaluation produces this document:

```markdown
# Design Heuristic Evaluation

**Date:** YYYY-MM-DD
**Subject:** [What was evaluated]
**Platform:** [Web / iOS / Android / Responsive]
**Evaluator:** [AI / Human / Both]
**Status:** Complete | In Progress

## Evaluation Context
- **Target Users:** [User description]
- **Primary Task:** [Main user goal]
- **Design System:** [System name]

## Usability Heuristic Scores

| # | Heuristic | Score |
|---|-----------|-------|
| H1 | Visibility of System Status | [Score] |
| H2 | Match Between System and Real World | [Score] |
| H3 | User Control and Freedom | [Score] |
| H4 | Consistency and Standards | [Score] |
| H5 | Error Prevention | [Score] |
| H6 | Recognition Rather Than Recall | [Score] |
| H7 | Flexibility and Efficiency of Use | [Score] |
| H8 | Aesthetic and Minimalist Design | [Score] |
| H9 | Help Users Recognize/Diagnose/Recover | [Score] |
| H10 | Help and Documentation | [Score] |

## Visual Design Scores

| # | Principle | Score |
|---|-----------|-------|
| V1 | Visual Hierarchy | [Score] |
| V2 | Contrast | [Score] |
| V3 | Balance | [Score] |
| V4 | Scale | [Score] |
| V5 | White Space | [Score] |
| V6 | Proximity | [Score] |
| V7 | Unity | [Score] |
| V8 | Gestalt Principles | [Score] |
| V9 | Movement and Flow | [Score] |
| V10 | Dominance | [Score] |
| V11 | Rhythm | [Score] |

## Prioritized Findings

### Critical (Severity 4)
[Findings list]

### Major (Severity 3)
[Findings list]

### Minor (Severity 2)
[Findings list]

### Cosmetic (Severity 1)
[Findings list]

## Platform-Specific Findings
[Platform compliance issues]

## Accessibility Findings
[Accessibility issues]

## What's Working Well
[Positive findings]

## Recommended Actions
1. [Action with priority and effort estimate]
2. [Action with priority and effort estimate]

## Challenges & Responses
[How evaluation was stress-tested by subagents]
```

---

## Subagent Integration

### Parallel Evaluation Strategy

For comprehensive evaluation, invoke subagents in parallel:

```
┌─────────────────────────────────────────────────┐
│                DESIGN-REVIEW Mode                │
│                                                  │
│  ┌──────────────┐  ┌────────────────────┐       │
│  │    ux.        │  │    ux.              │       │
│  │  heuristic-   │  │  visual-design-     │       │
│  │  evaluator    │  │  critic             │       │
│  └──────┬───────┘  └────────┬───────────┘       │
│         │                    │                    │
│  ┌──────┴───────┐  ┌────────┴───────────┐       │
│  │    ux.        │  │    ux.              │       │
│  │  platform-    │  │  accessibility-     │       │
│  │  evaluator    │  │  auditor            │       │
│  └──────┬───────┘  └────────┬───────────┘       │
│         │                    │                    │
│         └────────┬───────────┘                   │
│                  ↓                                │
│         ┌────────────────┐                       │
│         │  Synthesize &  │                       │
│         │  Prioritize    │                       │
│         └────────┬───────┘                       │
│                  ↓                                │
│         ┌────────────────┐  ┌────────────────┐   │
│         │ std-planner    │  │ std-verifier   │   │
│         │ (feasibility)  │  │ (consistency)  │   │
│         └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Subagent Definitions

**`ux-heuristic-evaluator`** - Evaluates against Nielsen's 10 heuristics
- Input: Screen/component/flow to evaluate, platform context
- Output: Heuristic scores and findings
- Specialized knowledge: Usability patterns, interaction design

**`ux-visual-design-critic`** - Evaluates visual design principles
- Input: Screen/component visual state, design system tokens
- Output: Visual design scores and findings
- Specialized knowledge: Typography, color theory, layout, composition

**`ux-platform-evaluator`** - Platform-specific compliance
- Input: Platform target (web/iOS/Android), screen to evaluate
- Output: Platform-specific findings
- Specialized knowledge: HIG, Material Design, WCAG, responsive patterns

**`ux-accessibility-auditor`** - Accessibility evaluation
- Input: Screen/component, WCAG target level (A/AA/AAA)
- Output: Accessibility findings with WCAG criteria
- Specialized knowledge: WCAG 2.1+, ARIA, assistive technology patterns

**`std-planner`** - Feasibility of remediation
- Input: Prioritized findings
- Output: Remediation plan feasibility assessment

**`std-verifier`** - Consistency of evaluation
- Input: Full evaluation report
- Output: Internal consistency check, severity validation

---

## Common Failure Modes

### 1. Evaluating Without Context

**Symptom:** Reviewing a screen without knowing who uses it or why

**Example:**
- Reviewing a dashboard without knowing the user role
- Evaluating mobile design against desktop heuristics

**Fix:** Always establish evaluation context (Step 1) before scoring.

---

### 2. Severity Inflation

**Symptom:** Rating everything as "Critical" or "Major"

**Example:**
- A cosmetic alignment issue rated as Severity 3
- A color preference rated as Severity 4

**Fix:** Apply severity scale rigorously. Ask: "Does this prevent task completion?" (Critical) vs. "Does this slow users down?" (Major) vs. "Does this cause confusion?" (Minor) vs. "Does this look wrong?" (Cosmetic).

---

### 3. Subjective Evaluation

**Symptom:** "I don't like this color" instead of evidence-based findings

**Example:**
- "The button should be blue" (preference)
- vs. "The CTA button has insufficient contrast (2.1:1 ratio) against its background, failing WCAG AA" (evidence)

**Fix:** Every finding must cite a specific heuristic or principle and provide measurable evidence.

---

### 4. Missing Positive Findings

**Symptom:** Only listing problems, never acknowledging what works well

**Example:**
- 20 findings, all negative
- Team gets demoralized, ignores report

**Fix:** Always include "What's Working Well" section. Positive patterns should be reinforced, not just problems fixed.

---

### 5. Evaluation Without Remediation

**Symptom:** Listing problems without suggesting solutions

**Example:**
- "H4: Consistency violation" (what should I do about it?)

**Fix:** Every finding must include a specific, actionable recommendation.

---

### 6. One-Time Evaluation

**Symptom:** Evaluating once and never revisiting

**Example:**
- Design review before build, never re-evaluated after implementation

**Fix:** Evaluate at DESIGN-FLOW (design decisions), after BUILD-SCREEN (implementation), and after CLEAN-SWEEP (polish). The evaluation is iterative, not one-shot.

---

### 7. Platform Blindness

**Symptom:** Applying web heuristics to mobile or vice versa

**Example:**
- Requiring hover states on mobile
- Expecting swipe gestures on desktop

**Fix:** Always specify platform context and apply platform-specific evaluation criteria.

---

## Integration with Workflow Modes

### Relationship to DESIGN-FLOW

**DESIGN-FLOW** produces design decisions.
**DESIGN-REVIEW** evaluates those decisions against heuristics and principles.

Use DESIGN-REVIEW:
- After DESIGN-FLOW (validate before building)
- After BUILD-SCREEN (verify implementation matches intent)
- Standalone (audit existing UI)

### Workflow Integration

```
SOLUTION → PLAN → DESIGN-FLOW → DESIGN-REVIEW → BUILD-SCREEN → DESIGN-REVIEW → CLEAN-SWEEP
                       ↑              │                               │
                       └──────────────┘                               │
                       (iterate if critical                           │
                        findings found)                               │
                                                                      ↓
                                                               (verify fixes)
```

### Mode Triggers

- User types `DESIGN-REVIEW` to enter mode
- Auto-suggested after DESIGN-FLOW completes
- Can be re-entered after BUILD-SCREEN to verify implementation
- Command: `/std-design-review`

---

## Relationship to Other Constructs

**Rules enforce** that design review happens:
- `06-std-workflow-modes.mdc` includes DESIGN-REVIEW in the mode state machine

**Commands trigger** the evaluation:
- `/std-design-review` initiates this skill

**Subagents perform** specialized evaluation:
- `ux-heuristic-evaluator` scores usability
- `ux-visual-design-critic` scores visual design
- `ux-platform-evaluator` checks platform compliance
- `ux-accessibility-auditor` checks accessibility

**Other modes consume** the evaluation:
- DESIGN-FLOW uses findings to revise design decisions
- BUILD-SCREEN uses findings as implementation criteria
- CLEAN-SWEEP uses findings as cleanup targets

---

## Key Principle

**Heuristic evaluation is not an opinion.**
**It is a structured, evidence-based assessment against established criteria.**

Commands trigger it.
Rules enforce it.
Skills teach it.
Subagents execute it.

This is how Nielsen becomes operational.

---

## References

See `references/` for:
- Nielsen's *Usability Engineering* (1993) - Original 10 heuristics
- Nielsen Norman Group - Updated heuristic definitions
- David Travis - 247 Web Usability Guidelines
- Gestalt psychology - Perceptual organization principles
- WCAG 2.1+ - Accessibility guidelines
- Apple Human Interface Guidelines - iOS design standards
- Material Design - Android design standards
- Evaluation templates and anti-patterns
