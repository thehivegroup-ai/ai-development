# Test Parity: Fix From Report

Fix visual mismatches based on the parity comparison report.

**Fix only what the evidence shows. Keep scope tight.**

---

## Purpose

Address visual and copy mismatches identified in the parity report using evidence-driven fixes.

This is the **third step** in visual parity testing (after `/test.parity.compare`).

---

## Prerequisites

**Before fixing, you MUST have:**
- Parity report generated (`.temp/parity/diff/parity-report.md`)
- Visual gallery reviewed (`.temp/parity/diff/visual-review.html`)
- Text diff reviewed (`.temp/parity/diff/ui-text-diff.json`)

**If reports missing, run `/test.parity.compare` first.**

---

## Fix Workflow

### Step 1: Review Evidence Artifacts

**Read parity report:**

```bash
cat .temp/parity/diff/parity-report.md
```

**Identify specific issues:**
- Visual mismatches (layout, spacing, typography)
- Copy mismatches (button labels, CTAs, headings)
- SEO mismatches (title tag, meta description)

**Open visual gallery:**

```bash
open .temp/parity/diff/visual-review.html
```

**Compare screenshots side-by-side for each viewport.**

---

### Step 2: Prioritize Fixes

**Question:**
- Which mismatches are blockers? (major visual differences)
- Which are minor? (small spacing differences)
- Which are acceptable? (OS/browser rendering differences)

**User must approve fix priority before implementing.**

---

### Step 3: Fix Visual Mismatches

**For each visual issue in the report:**

1. **Identify the component/file affected**
   - Use screenshot evidence to locate component
   - Search codebase for component name

2. **Understand the root cause**
   - Is it CSS (spacing, layout, typography)?
   - Is it missing component?
   - Is it responsive breakpoint issue?

3. **Fix with minimal scope**
   - Change only what's needed to achieve visual parity
   - Do NOT refactor unrelated code
   - Do NOT change functionality

4. **Verify fix locally**
   - View in browser at affected viewport
   - Check visual match against production screenshot

**Example fixes:**

```typescript
// Issue: Button missing on mobile
// Evidence: .temp/parity/diff/visual-review.html shows button present in prod, missing in local

// Fix: Show button on mobile viewport
<button className="block md:block">Sign Up</button>
// Changed from: className="hidden md:block"
```

```css
/* Issue: Header spacing mismatch on desktop
   Evidence: Production has 32px padding, local has 16px */

/* Fix: Match production spacing */
.header {
  padding: 2rem; /* 32px - matches production */
}
```

---

### Step 4: Fix Copy Mismatches

**For each text/SEO issue in the report:**

1. **Locate the text in code**
   - Search for button labels, CTAs, headings
   - Check `<title>` tag in HTML head
   - Check meta description in HTML head

2. **Update to match production exactly**
   - Use text diff as source of truth
   - Copy exact wording from production

**Example fixes:**

```typescript
// Issue: Button label mismatch
// Evidence: ui-text-diff.json shows "Register" should be "Sign Up"

// Fix: Match production label
<button>Sign Up</button>
// Changed from: <button>Register</button>
```

```html
<!-- Issue: Title tag mismatch -->
<!-- Evidence: Expected "Storage Facilities | NSA", found "NSA Storage" -->

<!-- Fix: Match production title -->
<title>Storage Facilities | NSA</title>
```

---

### Step 5: Re-Capture and Verify

**After fixes, re-capture local screenshots:**

```bash
node scripts/parity/capture_rendered.mjs local "<LOCAL_URL>" ".temp/parity/local"
```

**Re-generate comparison:**

```bash
node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"
```

**Review updated visual gallery:**

```bash
open .temp/parity/diff/visual-review.html
```

**Verify fixes:**
- Visual mismatches resolved?
- Copy matches production?
- No new issues introduced?

**If parity not achieved, identify remaining issues and loop back to Step 3.**

---

### Step 6: Update Parity Report

**Document fixes applied:**

```markdown
## Fixes Applied

### Visual Fixes
1. ✅ Desktop header spacing: Updated padding from 16px to 32px
2. ✅ Mobile button visibility: Changed `hidden md:block` to `block md:block`

### Copy Fixes
1. ✅ Button label: Changed "Register" to "Sign Up"
2. ✅ Title tag: Updated to "Storage Facilities | NSA"

### Re-Capture Results

**Visual Parity:** ✅ Achieved at all viewports  
**Copy/SEO Parity:** ✅ Achieved

**Evidence:** See updated `.temp/parity/diff/visual-review.html`
```

**Append to parity report:**

```bash
cat >> .temp/parity/diff/parity-report.md <<'EOF'

---

## Fixes Applied (YYYY-MM-DD)

[Fixes documentation here]
EOF
```

---

## Output

**Report fixes applied and verification:**

```markdown
## Fixes Complete

### Changes Made
- Desktop: Fixed header padding (16px → 32px)
- Mobile: Fixed button visibility
- Button label: "Register" → "Sign Up"
- Title tag: Updated to match production

### Verification
- ✅ Re-captured local screenshots
- ✅ Re-generated visual gallery
- ✅ Visual parity achieved at all viewports
- ✅ Copy/SEO parity achieved

### Evidence
- Updated visual gallery: `.temp/parity/diff/visual-review.html`
- Updated parity report: `.temp/parity/diff/parity-report.md`

**Parity Status: ✅ ACHIEVED**

### Next Step
Run tests (`/std-test-loop`) to verify no regressions, then proceed to DEPLOY-RELEASE.
```

---

## Guidance

- **Apply the `visual-parity-testing` skill** for detailed fix methodology
- **Keep scope tight** – Only fix what the evidence shows
- **Do NOT refactor** unrelated code
- **Re-capture after every fix** to verify
- **Invoke `test.parity-critic` subagent** to validate fixes

---

## Common Failure Modes

❌ **Fixed one viewport but broke another** → Test all viewports after each fix  
❌ **Visual match but functionality broken** → Run regression tests  
❌ **Over-fixing** → Changing code unrelated to parity issues  
❌ **Claiming parity without re-capturing** → Must re-generate evidence after fixes

---

## Stop Conditions

Stop and ask for direction if:
- Fix is unclear from evidence
- Multiple approaches possible (needs design decision)
- Fix would require refactoring unrelated code
- Production behavior is incorrect (fix needed in prod, not local)

---

## What This Command Does NOT Do

- Does NOT make assumptions about fixes (evidence-driven only)
- Does NOT refactor unrelated code (tight scope)
- Does NOT skip verification (must re-capture)
- Does NOT claim parity without updated evidence

This command only **fixes specific issues identified in parity report**.
