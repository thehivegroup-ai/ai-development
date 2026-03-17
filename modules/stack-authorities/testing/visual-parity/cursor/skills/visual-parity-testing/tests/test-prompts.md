# Test Prompts for Visual Parity Testing

These test prompts validate that the skill triggers correctly and produces evidence-driven visual parity workflows.

---

## Realistic User Requests (Good Test Cases)

These prompts reflect how real users actually phrase visual parity requests:

### Test Case 1: Basic Visual Match Request
```
"ok so i rebuilt the homepage in react. need to make sure it looks exactly 
like production. how do i verify that? just eyeballing it isnt cutting it"
```

**Expected behavior:**
- Skill triggers on "looks exactly like production"
- Provides systematic capture → compare → fix workflow
- Explains visual parity definition (layout, not DOM)
- Recommends screenshot comparison at multiple viewports
- Provides evidence-driven approach (not guesswork)

---

### Test Case 2: With Production Screenshot
```
"*uploads screenshot* this is what prod looks like. my local version is 
kinda close but spacing is off in a few places. how do i find all the 
differences and fix them?"
```

**Expected behavior:**
- Skill triggers on "find all the differences"
- Recommends capture both environments at same viewports
- Suggests visual comparison tools
- Explains fix-from-evidence workflow
- Warns against fixing things not in evidence

---

### Test Case 3: Responsive Design Verification
```
"finished building the mobile menu. works on my laptop but need to check 
it matches production on phone and tablet sizes. whats the process?"
```

**Expected behavior:**
- Skill triggers on "matches production"
- Emphasizes multi-viewport capture (mobile, tablet, desktop)
- Explains responsive breakpoint testing
- Provides viewport dimension recommendations
- Evidence-based validation approach

---

### Test Case 4: Post-Refactor Verification
```
"refactored the checkout flow from jquery to react. looks the same to me 
but want to be 100% sure i didnt break anything visually before shipping"
```

**Expected behavior:**
- Skill triggers on "looks the same" and "sure i didnt break"
- Provides regression testing workflow
- Capture before/after screenshots
- Side-by-side comparison
- Validation checklist

---

### Test Case 5: Copy and SEO Verification
```
"visual looks good but need to make sure button labels, headings, and SEO 
metadata match production exactly. how do i verify text content?"
```

**Expected behavior:**
- Skill triggers on "match production exactly"
- Explains secondary goal: copy + SEO correctness
- Provides text extraction and diff approach
- Separate from visual parity (primary goal)
- Evidence-based verification (not manual review)

---

## Clean Prompts (Avoid Testing With These)

These are too polished and don't reflect real usage:

### Anti-Test Case 1
```
"Please help me validate visual parity between production and local environments."
```

**Why bad:** Too formal, no context, uses skill terminology

---

### Anti-Test Case 2
```
"I need to perform evidence-driven visual parity testing."
```

**Why bad:** Uses skill jargon, unrealistic phrasing

---

### Anti-Test Case 3
```
"Let's compare screenshots to ensure visual consistency."
```

**Why bad:** Too clean, missing real-world messiness

---

## Edge Cases (Should NOT Trigger)

These requests should be handled without the skill:

### Edge Case 1: Functional Testing
```
"make sure the submit button actually submits the form"
```

**Expected:** Functional testing, NOT visual parity

---

### Edge Case 2: Performance Testing
```
"check if the page loads fast enough"
```

**Expected:** Performance testing, NOT visual parity

---

### Edge Case 3: Accessibility Testing
```
"verify screen readers can access this page"
```

**Expected:** A11y testing, NOT visual parity (though related)

---

## Success Criteria for Skill

When tested with realistic prompts, the skill should:

1. **Trigger reliably** when user mentions visual matching/comparison
2. **NOT trigger** for non-visual testing (functional, performance, a11y)
3. **Produce workflow** matching capture → compare → fix → verify pattern
4. **Emphasize evidence** over guesswork ("looks good to me")
5. **Define parity correctly** (visual, not DOM structure)
6. **Include multi-viewport** testing by default
7. **Warn against scope creep** (fixing things not in evidence)

---

## Realistic Workflow Scenarios

### Scenario 1: Full Visual Parity Workflow
```
User: "rebuilt the product page in next.js. need to match production"
→ visual-parity-testing triggers
→ provides systematic workflow:

Step 1: Capture production (desktop, tablet, mobile)
Step 2: Capture local (same viewports)
Step 3: Generate visual comparison
Step 4: Review evidence (side-by-side screenshots)
Step 5: Fix only what's in evidence
Step 6: Re-capture to verify fixes
Step 7: Invoke parity-critic for validation
```

### Scenario 2: Responsive Issue
```
User: "homepage looks perfect on desktop but mobile layout is messed up"
→ visual-parity-testing triggers
→ identifies responsive issue
→ recommends mobile-specific capture
→ provides breakpoint testing approach
→ evidence-driven fix workflow
```

### Scenario 3: After Major Refactor
```
User: "migrated from angular to react. huge refactor. how do i prove 
everything looks the same?"
→ visual-parity-testing triggers
→ emphasizes comprehensive regression testing
→ multi-page, multi-viewport capture
→ systematic comparison
→ evidence artifacts for stakeholder review
```

---

## Testing Protocol

### Manual Testing
1. Copy prompt from "Realistic User Requests"
2. Paste into Claude Code chat
3. Verify skill triggers automatically
4. Check output includes capture → compare → fix workflow
5. Verify multi-viewport testing mentioned
6. Verify evidence-driven approach emphasized
7. Check for parity definition (visual, not DOM)

### Automated Testing (Future)
```bash
# Generate test cases
skill-creator test visual-parity-testing --generate

# Run tests
skill-creator test visual-parity-testing --run

# Review results
skill-creator test visual-parity-testing --review
```

---

## Common Mistakes to Check

### Mistake 1: Claiming Parity Without Evidence
❌ **Wrong:**
"looks good to me, should be fine to ship"

✅ **Correct:**
"captured screenshots at 3 viewports, generated comparison, 
verified all 47 differences fixed, re-captured to confirm"

### Mistake 2: DOM Structure Fixation
❌ **Wrong:**
"production has <div class='container'> but local has <section class='wrapper'> 
so it's not parity"

✅ **Correct:**
"visual output matches (layout, spacing, typography identical), 
DOM structure difference doesn't affect parity"

### Mistake 3: Fixing Things Not In Evidence
❌ **Wrong:**
"while I'm here let me refactor the CSS and improve the spacing"

✅ **Correct:**
"evidence shows these 5 specific issues. fixing only those. 
other improvements are scope creep."

### Mistake 4: Single Viewport Testing
❌ **Wrong:**
"looks good on my 1920x1080 monitor, shipping it"

✅ **Correct:**
"tested at mobile (390x844), tablet (768x1024), desktop (1920x1080), 
all viewports match production"

---

## Evidence Artifact Examples

### Good Evidence
```
## Visual Parity Report

**Viewports Tested:**
- Mobile: 390x844 (iPhone 14 Pro)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080 (typical desktop)

**Artifacts Generated:**
- `.temp/parity/prod/mobile.png`
- `.temp/parity/prod/tablet.png`
- `.temp/parity/prod/desktop.png`
- `.temp/parity/local/mobile.png`
- `.temp/parity/local/tablet.png`
- `.temp/parity/local/desktop.png`
- `.temp/parity/diff/visual-review.html`

**Issues Found (from evidence):**
1. Header padding: 16px (prod) vs 12px (local) - FIXED
2. Button border radius: 8px (prod) vs 4px (local) - FIXED
3. Footer background: #f5f5f5 (prod) vs #ffffff (local) - FIXED

**Verification:**
Re-captured after fixes. All visual differences resolved.
See `.temp/parity/diff/visual-review-after-fixes.html`

**Status:** ✅ Visual parity achieved
```

---

## Iteration Log

### Version 1.0.0 (2026-03-16)
- Initial test prompts created
- 5 realistic cases, 3 anti-cases, 3 edge cases
- Success criteria defined
- Common mistakes documented
- Evidence artifact examples
- Testing protocol established

---

## Adding New Test Cases

When adding test cases:
1. Use actual user language (screenshots attached, casual tone)
2. Include context (rebuilding? refactoring? migrating?)
3. Show uncertainty ("kinda close", "looks off")
4. Document expected behavior
5. Test that skill triggers automatically

**Sources for new test cases:**
- Real visual regression bugs found in production
- QA feedback about visual differences
- Designer review comments
- Responsive design breakage reports
- Post-deployment visual issues
