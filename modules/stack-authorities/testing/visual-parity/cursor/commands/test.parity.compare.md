# Test Parity: Compare

Generate visual comparison report and side-by-side gallery from captured production and local screenshots.

**This produces the evidence needed to assess visual parity.**

---

## Purpose

Compare production and local captures to identify visual mismatches and generate actionable diff reports.

This is the **second step** in visual parity testing (after `/test.parity.capture-all`).

---

## Prerequisites

**Before comparing, you MUST have:**
- Production captures in `.temp/parity/prod/`
- Local captures in `.temp/parity/local/`
- Same viewports captured for both environments

**If captures missing, run `/test.parity.capture-all` first.**

---

## Comparison Workflow

### Step 1: Verify Captures Exist

```bash
ls -la .temp/parity/prod/
ls -la .temp/parity/local/
```

**Expected:** Matching directory structure with screenshots and HTML for each viewport

**If missing, stop and report which captures are incomplete.**

---

### Step 2: Generate Visual Gallery

**Preferred method:** Visual review gallery script

```bash
node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"
```

**What this generates:**
- Side-by-side screenshot comparison
- One row per viewport (desktop, tablet, mobile)
- Visual diff highlighting (if available)

**Output:** `.temp/parity/diff/visual-review.html`

**If script doesn't exist yet, create it using the `visual-parity-testing` skill.**

---

### Step 3: Extract UI Text and SEO Metadata

**Purpose:** Catch copy/SEO mismatches that may not be obvious in screenshots

**Extract from production HTML:**

```bash
node scripts/parity/extract_ui_text.mjs ".temp/parity/prod" ".temp/parity/diff/prod-text.json"
```

**Extract from local HTML:**

```bash
node scripts/parity/extract_ui_text.mjs ".temp/parity/local" ".temp/parity/diff/local-text.json"
```

**What this extracts:**
- Button labels, CTA text, headings
- `<title>` tag content
- Meta description
- Visible text content

**Generate diff report:**

```bash
node scripts/parity/diff_text.mjs ".temp/parity/diff/prod-text.json" ".temp/parity/diff/local-text.json" ".temp/parity/diff/ui-text-diff.json"
```

**Output:** `.temp/parity/diff/ui-text-diff.json`

---

### Step 4: Generate Parity Report

**Purpose:** Summarize visual and copy mismatches in a single markdown report

**Structure:**

```markdown
# Parity Report

**Date:** YYYY-MM-DD  
**Production URL:** <PROD_URL>  
**Local URL:** <LOCAL_URL>

## Visual Parity Assessment

### Desktop (1920x1080)
- **Status:** ✅ Match | ⚠️ Minor mismatch | ❌ Major mismatch
- **Issues:**
  - [List specific visual issues if any]

### Tablet (768x1024)
- **Status:** ✅ Match | ⚠️ Minor mismatch | ❌ Major mismatch
- **Issues:**
  - [List specific visual issues if any]

### Mobile (375x667)
- **Status:** ✅ Match | ⚠️ Minor mismatch | ❌ Major mismatch
- **Issues:**
  - [List specific visual issues if any]

## Copy + SEO Assessment

### Text Mismatches
- Button label: Expected "Sign Up", found "Register"
- CTA text: Missing on mobile viewport

### SEO Mismatches
- Title tag: Expected "Storage Facilities | NSA", found "NSA Storage"
- Meta description: Missing

## Overall Assessment

**Visual Parity:** ✅ Achieved | ⚠️ Partial | ❌ Not achieved  
**Copy/SEO Parity:** ✅ Achieved | ⚠️ Partial | ❌ Not achieved

**Recommended Actions:**
1. [Specific fix for issue 1]
2. [Specific fix for issue 2]

## Evidence Artifacts

- Visual gallery: `.temp/parity/diff/visual-review.html`
- Text diff: `.temp/parity/diff/ui-text-diff.json`
- Production screenshots: `.temp/parity/prod/<viewport>/screenshot.png`
- Local screenshots: `.temp/parity/local/<viewport>/screenshot.png`
```

**Save report:**

```bash
# Generate report programmatically or manually based on evidence
cat > .temp/parity/diff/parity-report.md <<'EOF'
[Report content here]
EOF
```

**Output:** `.temp/parity/diff/parity-report.md`

---

### Step 5: Review Evidence Artifacts

**Open visual gallery in browser:**

```bash
open .temp/parity/diff/visual-review.html
# or: xdg-open .temp/parity/diff/visual-review.html (Linux)
```

**Review side-by-side screenshots:**
- Are layouts identical?
- Are spacing and typography consistent?
- Are all components present?
- Do responsive breakpoints work correctly?

**Review text diff:**

```bash
cat .temp/parity/diff/ui-text-diff.json
```

**Look for:**
- Button label mismatches
- Missing CTAs
- Incorrect headings
- SEO metadata issues

---

## Output

**Report comparison results:**

```markdown
## Comparison Complete

### Evidence Artifacts Generated
- ✅ Visual gallery: `.temp/parity/diff/visual-review.html`
- ✅ Text diff: `.temp/parity/diff/ui-text-diff.json`
- ✅ Parity report: `.temp/parity/diff/parity-report.md`

### Assessment Summary

**Visual Parity:**
- Desktop: ⚠️ Minor spacing issue in header
- Tablet: ✅ Match
- Mobile: ❌ Button missing

**Copy/SEO:**
- Title tag mismatch: Expected "Storage Facilities | NSA", found "NSA Storage"
- Button label: "Register" should be "Sign Up"

### Next Step
Review visual gallery in browser, then run `/test.parity.fix-from-report` to address mismatches.
```

---

## Guidance

- **Apply the `visual-parity-testing` skill** for detailed comparison methodology
- **Invoke `test.parity-critic` subagent** to validate assessment quality
- **Open visual-review.html in browser** for human review (AI cannot see images in browser context)

---

## Common Failure Modes

❌ **No visual mismatches in gallery but text diff shows issues** → Visual parity achieved, copy fixes needed  
❌ **Visual mismatches exist but cause unclear** → May need to inspect HTML structure for diagnostic purposes  
❌ **Dynamic content differs (timestamps, ads)** → Expected, not a parity failure unless layout affected  
❌ **Font rendering differs slightly** → OS/browser rendering differences, acceptable if design intent preserved

---

## What This Command Does NOT Do

- Does NOT capture screenshots (use `/test.parity.capture-all`)
- Does NOT fix visual mismatches (use `/test.parity.fix-from-report`)
- Does NOT make parity decisions (humans do, based on evidence)

This command only **generates comparison evidence and reports**.
