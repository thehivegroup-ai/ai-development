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
ls -R visual-tests/production/
ls -R visual-tests/local/
```

**Expected:** Matching directory structure with screenshots for each page and viewport

**If missing, run `/test.parity.capture-all` first.**

---

### Step 2: Run Comparison Script

```bash
npm run compare
# or
tsx scripts/visual-parity/compare.ts visual-compare.config.json
```

**What this script does:**
1. Reads comparison config
2. Loads production and local screenshots
3. Compares pixel-by-pixel using pixelmatch
4. Generates diff images highlighting differences
5. Creates HTML report with side-by-side view
6. Creates JSON results for programmatic access
7. Calculates pass/fail based on threshold

**Output:**
- `visual-tests/diff/report.html` - Interactive HTML report
- `visual-tests/diff/results.json` - Machine-readable results
- `visual-tests/diff/<page>/<viewport>/diff.png` - Diff images (if differences found)

---

### Step 3: Review HTML Report

**Open report in browser:**

```bash
open visual-tests/diff/report.html
# or: xdg-open visual-tests/diff/report.html (Linux)
```

**Report shows:**
- Overall pass/fail summary
- Per-page/viewport results
- Side-by-side comparison images
- Difference highlighting
- Pixel diff percentage

**Look for:**
- Layout differences
- Missing elements
- Color variations
- Spacing issues
- Responsive behavior differences

---

### Step 4: Review JSON Results

```bash
cat visual-tests/diff/results.json
```

**Contains:**
- Timestamp
- Configuration used
- Per-comparison results
- Summary statistics
- Duration

**Use for:**
- CI/CD integration
- Automated reporting
- Historical tracking
- Trend analysis

---

## Output

**Report comparison results:**

```markdown
## Comparison Complete ✅

### Results Summary
- **Total Comparisons:** 12 (4 pages × 3 viewports)
- **Passed:** 10 ✅
- **Failed:** 2 ❌
- **Threshold:** 1% difference allowed

### Detailed Results

#### Home Page
- mobile: ✅ Passed (0.02% diff - pixel perfect)
- tablet: ✅ Passed (0.15% diff - minor font rendering)
- desktop: ✅ Passed (identical)

#### Products Page
- mobile: ❌ Failed (3.5% diff - button missing)
- tablet: ✅ Passed (0.5% diff)
- desktop: ⚠️  Passed (0.8% diff - close to threshold)

#### About Page
- mobile: ✅ Passed (identical)
- tablet: ✅ Passed (identical)
- desktop: ✅ Passed (identical)

#### Contact Page
- mobile: ✅ Passed (0.3% diff)
- tablet: ❌ Failed (2.1% diff - form layout issue)
- desktop: ✅ Passed (identical)

### Evidence Generated
- HTML Report: visual-tests/diff/report.html
- JSON Results: visual-tests/diff/results.json
- Diff Images: visual-tests/diff/<page>/<viewport>/diff.png (for failures)

### Issues Found
1. **Products/Mobile:** Missing "Add to Cart" button (3.5% diff)
   - Diff image: visual-tests/diff/products/mobile/diff.png
   
2. **Contact/Tablet:** Form layout incorrect (2.1% diff)
   - Diff image: visual-tests/diff/contact/tablet/diff.png

### Next Step
Open visual-tests/diff/report.html to review screenshots, then run `/test.parity.fix-from-report` to address issues.
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
