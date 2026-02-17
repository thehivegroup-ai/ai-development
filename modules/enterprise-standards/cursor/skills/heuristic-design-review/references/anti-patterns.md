# Anti-Patterns in Design Heuristic Evaluation

Common mistakes when conducting design reviews and how to avoid them.

---

## Anti-Pattern 1: Opinion Masquerading as Evaluation

**Bad:**
```markdown
## H8: Aesthetic and Minimalist Design
- Score: Major
- Finding: The design looks cluttered and unappealing
- Recommendation: Make it look better
```

**Why Bad:**
- "Cluttered" is subjective without evidence
- "Unappealing" is personal preference
- "Make it look better" is not actionable
- No reference to specific heuristic criteria

**Good:**
```markdown
## H8: Aesthetic and Minimalist Design
- Score: Major (Severity 3)
- Finding: The product listing page displays 8 data points per card
  (name, price, rating, description, SKU, weight, dimensions, stock count).
  User task analysis shows only name, price, and rating are needed for
  browse-and-compare behavior. 5 data points are irrelevant to the primary task.
- Location: Product listing cards, all category pages
- Recommendation: Remove SKU, weight, dimensions, stock count from listing cards.
  Move to product detail page. Reduce card content to name, price, rating,
  and thumbnail image.
```

---

## Anti-Pattern 2: Evaluating Without User Context

**Bad:**
```markdown
## Evaluation Context
- Subject: Admin Dashboard
- Platform: Web

## H7: Flexibility and Efficiency of Use
- Score: Critical
- Finding: No keyboard shortcuts available
```

**Why Bad:**
- Who are the users? Admins who use the tool 8 hours/day?
- What tasks do they perform? Data entry? Monitoring?
- Without user context, severity rating is arbitrary
- Keyboard shortcuts might be critical for power users or irrelevant for casual users

**Good:**
```markdown
## Evaluation Context
- Subject: Admin Dashboard
- Platform: Web
- Target Users: Customer support agents (8+ hours/day usage)
- Primary Task: Look up customer accounts and resolve tickets

## H7: Flexibility and Efficiency of Use
- Score: Major (Severity 3)
- Finding: Support agents perform account lookup 50+ times/day but must
  click through 3 screens each time. No keyboard shortcut for "search customer"
  (the most frequent action). No recent searches shown.
- Recommendation: Add Cmd/Ctrl+K shortcut for customer search. Show 5 most
  recent lookups on dashboard. Add keyboard navigation for ticket list.
```

---

## Anti-Pattern 3: Platform Blindness

**Bad:**
```markdown
## H3: User Control and Freedom
- Score: Critical
- Finding: No hover preview on product images
- Platform: iOS Mobile App
```

**Why Bad:**
- Hover does not exist on mobile touch devices
- Evaluating a mobile app against desktop interaction patterns
- Shows lack of platform awareness

**Good:**
```markdown
## H3: User Control and Freedom
- Score: Minor (Severity 2)
- Finding: Product images in the listing do not support long-press to preview.
  iOS convention (peek/context menu on long-press) is not implemented.
  Users must navigate to detail page to see larger images, then navigate back.
- Platform: iOS - Human Interface Guidelines recommends context menus
  for preview actions
- Recommendation: Implement long-press context menu with image preview
  and quick actions (Add to Cart, Save, Share).
```

---

## Anti-Pattern 4: Severity Inflation

**Bad:**
```markdown
## Prioritized Findings

### Critical (Severity 4)
1. Button border radius is 4px, design system specifies 8px
2. Heading font is 24px, should be 28px
3. Secondary button color is #6B7280, design system says #6B7181
4. Card shadow is wrong elevation
5. Spacing between sections is 24px not 32px
```

**Why Bad:**
- None of these prevent task completion
- None cause user confusion or errors
- All are cosmetic design system deviations
- Inflated severity wastes engineering time on wrong priorities
- Team loses trust in evaluation process

**Good:**
```markdown
### Cosmetic (Severity 1)
1. Button border radius is 4px, design system specifies 8px (Unity - V7)
2. Heading font is 24px, design system specifies 28px (Scale - V4)
3. Secondary button color deviates from design system token (Unity - V7)

### Recommendation
These are design system compliance issues, not usability problems.
Batch-fix during CLEAN-SWEEP mode. Consider adding design system
linting to prevent drift.
```

---

## Anti-Pattern 5: Missing Positive Findings

**Bad:**
```markdown
## Evaluation Summary
Found 23 issues:
- 3 Critical
- 7 Major
- 8 Minor
- 5 Cosmetic

[No mention of what works well]
```

**Why Bad:**
- Demoralizes the team
- Creates adversarial relationship with design review
- Misses opportunity to reinforce good patterns
- Incomplete picture of design quality
- Team may avoid future reviews

**Good:**
```markdown
## What's Working Well
- **Excellent error handling (H9):** Form validation messages are inline,
  specific, and suggest corrections. Best practice implementation.
- **Strong visual hierarchy (V1):** Clear primary CTA on every screen.
  Users' eyes are guided to the right action naturally.
- **Consistent component library (H4, V7):** Buttons, cards, and inputs
  share a cohesive visual language across all 12 screens evaluated.

## Areas for Improvement
[Then list the findings by severity...]
```

---

## Anti-Pattern 6: Checklist Without Thinking

**Bad:**
```markdown
| Heuristic | Score |
|-----------|-------|
| H1 | Pass |
| H2 | Pass |
| H3 | Pass |
| H4 | Pass |
| H5 | Pass |
| H6 | Pass |
| H7 | Pass |
| H8 | Minor |
| H9 | Pass |
| H10 | Pass |

Evaluation complete. 9/10 passing.
```

**Why Bad:**
- No evidence provided for any score
- "Pass" without explanation is meaningless
- No context on what was actually evaluated
- Cannot be verified or challenged
- Provides no actionable information

**Good:**
```markdown
### H1: Visibility of System Status - Pass
- **Evidence:** Loading spinner shown during API calls (measured: appears
  within 100ms). Progress bar on multi-step checkout (4 steps clearly
  indicated). Active navigation item highlighted with accent color.
  Form submission shows success toast within 200ms.
- **Note:** Consider adding skeleton screens for initial page load
  (currently blank for ~800ms). Not a violation, but would improve
  perceived performance.
```

---

## Anti-Pattern 7: Evaluating Implementation, Not Design

**Bad:**
```markdown
## H5: Error Prevention
- Score: Critical
- Finding: The API returns 500 errors when the email field is empty
- Recommendation: Fix the backend validation
```

**Why Bad:**
- This is a backend bug, not a design issue
- Heuristic evaluation focuses on the interface, not implementation
- The design question is: "Does the UI prevent the user from submitting an empty email?"

**Good:**
```markdown
## H5: Error Prevention
- Score: Major (Severity 3)
- Finding: The email field allows form submission when empty. No client-side
  validation prevents the error. The input does not use type="email" and has
  no required attribute. Users see a generic "Something went wrong" error
  after waiting for the API response.
- Recommendation: Add required attribute and type="email" to input. Implement
  inline validation that checks on blur. Show specific message: "Email address
  is required" before form submission is attempted.
```

---

## Anti-Pattern 8: One-Size-Fits-All Evaluation

**Bad:**
```markdown
[Same evaluation criteria applied identically to:
- A data-dense enterprise dashboard
- A consumer e-commerce checkout
- A mobile social media feed]
```

**Why Bad:**
- Different products have different user needs
- Enterprise users tolerate density; consumers don't
- Mobile social feeds have different attention patterns than dashboards
- Severity of the same issue varies by context

**Good:**
```markdown
## Evaluation Context
- **Subject:** Enterprise financial dashboard
- **Target Users:** Financial analysts (expert users, daily use)
- **Primary Task:** Monitor 50+ metrics and drill into anomalies

## H8: Aesthetic and Minimalist Design
- Score: Pass
- Finding: Dashboard displays 52 data points on the main view. While this
  would be a violation for a consumer product, the target users (financial
  analysts) require simultaneous visibility of all metrics for cross-metric
  pattern recognition. User research confirms analysts prefer dense views.
- Note: Progressive disclosure is correctly applied for drill-down details.
  Primary view shows headlines; detail views show full data.
```

---

## Anti-Pattern 9: Evaluating a Snapshot, Not a Flow

**Bad:**
```markdown
## Evaluation: Login Page
[Evaluates only the static login form]
```

**Why Bad:**
- Usability problems often occur in transitions between screens
- Error states, loading states, and edge cases are missed
- The "happy path" gets evaluated, but failure paths don't
- Multi-step flows have compounding usability issues

**Good:**
```markdown
## Evaluation: Login Flow (5 states)

### State 1: Empty form (initial load)
[Evaluation findings]

### State 2: Validation errors (incorrect input)
[Evaluation findings]

### State 3: Loading state (submission in progress)
[Evaluation findings]

### State 4: Error state (authentication failed)
[Evaluation findings]

### State 5: Success state (redirect to dashboard)
[Evaluation findings]

### Flow-Level Findings
- H3 (User Control): No "back" option from loading state if user realizes
  they entered wrong credentials. Must wait for failure.
- H1 (System Status): No transition animation between states; form content
  "jumps" when error messages appear, shifting the submit button position.
```

---

## Anti-Pattern 10: Ignoring Accessibility as "Separate"

**Bad:**
```markdown
## Design Evaluation: Complete

## Accessibility
We'll do an accessibility audit separately later.
```

**Why Bad:**
- Accessibility IS design quality, not a separate concern
- Contrast ratios directly relate to V2 (Contrast)
- Touch targets directly relate to V4 (Scale)
- Color-only indicators violate both accessibility and V2
- Delaying accessibility review leads to costly retrofitting

**Good:**
```markdown
## V2: Contrast
- Score: Major (Severity 3)
- Finding: Body text (#999999) on white background has 2.85:1 contrast ratio.
  Fails WCAG AA requirement of 4.5:1. Affects readability for all users;
  fails accessibility compliance for low-vision users.
- Recommendation: Darken body text to minimum #767676 (4.54:1 ratio) or
  preferably #595959 (7:1 ratio, meets WCAG AAA).

[Accessibility is integrated into each relevant heuristic and principle,
not siloed into a separate section]
```

---

## How to Avoid These Anti-Patterns

1. **Always establish user context before evaluating**
2. **Cite specific criteria and evidence for every finding**
3. **Apply platform-appropriate standards**
4. **Use severity ratings honestly and consistently**
5. **Include positive findings alongside problems**
6. **Provide evidence, not just scores**
7. **Evaluate the design/interface, not the code**
8. **Adapt evaluation depth to product context**
9. **Evaluate flows and states, not just static screens**
10. **Integrate accessibility into every evaluation dimension**

---

## Quick Self-Check

Before finalizing an evaluation, ask:

- [ ] Does every finding cite a specific heuristic or principle?
- [ ] Does every finding include observable evidence?
- [ ] Does every finding include an actionable recommendation?
- [ ] Are severity ratings justified by impact on user tasks?
- [ ] Have I included what's working well?
- [ ] Did I evaluate the full flow (not just happy path)?
- [ ] Did I apply platform-specific criteria?
- [ ] Is accessibility integrated (not deferred)?
- [ ] Would the team find this evaluation actionable?
- [ ] Did I invoke std-verifier to check consistency?

If any checkbox is unchecked, revise the evaluation.
