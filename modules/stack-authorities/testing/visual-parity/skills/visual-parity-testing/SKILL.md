---
name: visual-parity-testing
version: 1.0.0
description: >
  Complete methodology for evidence-driven visual parity testing between production and local 
  environments. Use when validating visual consistency between production and local/staging, 
  running visual regression comparisons, or setting up evidence-based parity workflows.
  
  Trigger when user mentions: visual parity, screenshot comparison, production vs local, 
  visual regression, does it match production, verify design matches, compare environments, 
  capture screenshots, visual testing, or uploads production screenshots asking to match them.
---

# Visual Parity Testing

**This skill operationalizes visual parity testing as a repeatable, evidence-driven workflow.**

---

## When to Use

- Recreating production UI in local/staging environment
- Validating visual consistency across environments
- Verifying responsive design matches production
- Ensuring copy and SEO metadata match production

---

## Visual Parity Operationalized

### Design Goal

Turn visual parity validation into a **repeatable, evidence-based workflow** that:
- **Generates artifacts first** (screenshots, captures, diffs)
- **Fixes based on evidence** (not guesswork)
- **Defines parity clearly** (visual, not DOM)
- **Validates with re-capture** (verify fixes work)

This prevents:
- Claiming parity without proof
- Fixing wrong things (not in evidence)
- DOM structure fixation (production SPA vs local structure)
- Scope creep (unrelated refactoring)

---

## Parity Definition

### What IS Parity?

#### 1. Visual Parity (Primary Goal)

**Definition:** Production and local are visually indistinguishable at agreed viewports.

**Includes:**
- **Layout:** Positioning, alignment, grid/flex behavior identical
- **Spacing:** Margins, padding, gaps match
- **Typography:** Fonts, sizes, weights, line heights, colors match
- **Component presence:** All visible elements present
- **Responsive behavior:** Breakpoint transitions work correctly

**How to verify:**
- Side-by-side screenshot comparison
- Visual inspection at each viewport
- Layout measurements match

---

#### 2. Copy + SEO Correctness (Secondary Goal)

**Definition:** Visible text and SEO metadata match production.

**Includes:**
- Button labels, CTAs, headings match exactly
- `<title>` tag matches production
- Meta description matches production
- Visible text content matches (where applicable)

**How to verify:**
- Text extraction and diff
- SEO metadata comparison
- Manual review of UI text

---

### What IS NOT Parity?

#### DOM/Structural Parity (Non-Goal)

**Production DOM structure is NOT required to match local.**

**Why:**
- Production may be server-rendered, local may be SPA
- Different frameworks create different DOM structures
- Implementation details vary (React vs Next vs server-side)

**Structure diffs are diagnostic only:**
- Help explain why visual mismatches occur
- Useful for debugging layout issues
- NOT a parity failure by themselves

**Example:**

```html
<!-- Production (server-rendered) -->
<div class="container">
  <div class="row">
    <div class="col">Content</div>
  </div>
</div>

<!-- Local (React) -->
<div className="flex container">
  <div className="flex-1">Content</div>
</div>
```

**Assessment:** Different DOM, but if visual output is identical, **parity is achieved**.

---

## The Visual Parity Workflow

### Step-by-Step Process

```
1. Define Requirements (SOLUTION mode)
   ↓
2. Plan Capture (PLAN mode)
   ↓
3. Capture Production (TEST-LOOP mode: /test.parity.capture-all)
   ↓
4. Capture Local (TEST-LOOP mode: /test.parity.capture-all)
   ↓
5. Generate Comparison (TEST-LOOP mode: /test.parity.compare)
   ↓
6. Review Evidence (Human review of visual gallery + reports)
   ↓
7. Fix Mismatches (TEST-LOOP mode: /test.parity.fix-from-report)
   ↓
8. Re-Capture and Verify (Loop back to step 4)
   ↓
9. Parity Achieved → DEPLOY-RELEASE
```

---

### Step 1: Define Requirements (SOLUTION Mode)

**Questions to answer:**

1. **Which pages need parity?**
   - Homepage? Product pages? Checkout flow?
   - Prioritize by business impact

2. **Which viewports?**
   - Desktop (1920x1080? 1440x900?)
   - Tablet (768x1024? 1024x768?)
   - Mobile (375x667? 390x844?)

3. **What defines success?**
   - Visual match at all viewports?
   - Copy/SEO match required?
   - Acceptable differences (e.g., timestamps, ads)?

4. **What are non-goals?**
   - DOM structure parity? (NO)
   - Functionality parity? (Different scope)
   - Performance parity? (Different scope)

**Output:** Clear parity requirements documented

---

### Step 2: Plan Capture (PLAN Mode)

**Backward from goal:**

**Goal:** Visual parity achieved at agreed viewports

**To achieve this, we need:**
- Comparison report showing matches (Phase 3)

**To generate comparison, we need:**
- Production screenshots at each viewport (Phase 2)
- Local screenshots at each viewport (Phase 2)

**To capture screenshots, we need:**
- Playwright capture script (Phase 1)
- Production URL accessible (Phase 1)
- Local dev server running (Phase 1)

**Plan output:**

```markdown
## Parity Testing Plan

### End-State (Telos)
Visual parity achieved between production and local at desktop/tablet/mobile viewports.

### Phase 1: Capture Setup
- [ ] Install Playwright
- [ ] Create capture script (`scripts/parity/capture_rendered.mjs`)
- [ ] Verify prod URL accessible
- [ ] Start local dev server

### Phase 2: Evidence Generation
- [ ] Capture production screenshots (desktop/tablet/mobile)
- [ ] Capture local screenshots (desktop/tablet/mobile)
- [ ] Verify all artifacts generated

### Phase 3: Comparison
- [ ] Generate visual gallery (side-by-side)
- [ ] Extract text/SEO (prod vs local)
- [ ] Generate parity report

### Phase 4: Fixing
- [ ] Review evidence
- [ ] Fix visual mismatches
- [ ] Fix copy/SEO mismatches
- [ ] Re-capture and verify
```

---

### Step 3-4: Capture Production and Local

**Use `/test.parity.capture-all` command.**

**Key principles:**

1. **Capture production first** (source of truth)
2. **Ensure local dev server running** before local capture
3. **Use same viewports** for both environments
4. **Verify artifacts** exist before proceeding

**Capture script structure:**

```javascript
// scripts/parity/capture_rendered.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

async function capture(env, url, outputDir) {
  const browser = await chromium.launch();
  
  for (const [name, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport });
    await page.goto(url, { waitUntil: 'networkidle' });
    
    const dir = `${outputDir}/${name}`;
    mkdirSync(dir, { recursive: true });
    
    await page.screenshot({ path: `${dir}/screenshot.png`, fullPage: true });
    const html = await page.content();
    writeFileSync(`${dir}/page.html`, html);
  }
  
  await browser.close();
}

const [env, url, outputDir] = process.argv.slice(2);
capture(env, url, outputDir);
```

**Output artifacts:**

```
.temp/parity/
├── prod/
│   ├── desktop/screenshot.png, page.html
│   ├── tablet/screenshot.png, page.html
│   └── mobile/screenshot.png, page.html
├── local/
│   ├── desktop/screenshot.png, page.html
│   ├── tablet/screenshot.png, page.html
│   └── mobile/screenshot.png, page.html
```

---

### Step 5: Generate Comparison

**Use `/test.parity.compare` command.**

**Key principles:**

1. **Visual gallery is primary evidence** (side-by-side screenshots)
2. **Text/SEO diff is supporting evidence** (catches copy issues)
3. **Parity report summarizes** all findings

**Visual gallery structure:**

```html
<!-- scripts/parity/make_visual_gallery.mjs output -->
<!DOCTYPE html>
<html>
<head>
  <title>Visual Parity Review</title>
  <style>
    .viewport { margin: 2rem 0; }
    .comparison { display: flex; gap: 1rem; }
    .comparison img { width: 45%; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>Visual Parity Review</h1>
  
  <div class="viewport">
    <h2>Desktop (1920x1080)</h2>
    <div class="comparison">
      <div>
        <h3>Production</h3>
        <img src="../../prod/desktop/screenshot.png" />
      </div>
      <div>
        <h3>Local</h3>
        <img src="../../local/desktop/screenshot.png" />
      </div>
    </div>
  </div>
  
  <!-- Repeat for tablet, mobile -->
</body>
</html>
```

**Text extraction logic:**

```javascript
// scripts/parity/extract_ui_text.mjs
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'node-html-parser';

function extractText(htmlPath) {
  const html = readFileSync(htmlPath, 'utf-8');
  const root = parse(html);
  
  return {
    title: root.querySelector('title')?.text || '',
    metaDescription: root.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    buttons: root.querySelectorAll('button').map(b => b.text.trim()),
    headings: {
      h1: root.querySelectorAll('h1').map(h => h.text.trim()),
      h2: root.querySelectorAll('h2').map(h => h.text.trim()),
    }
  };
}
```

**Parity report structure:**

```markdown
# Parity Report

**Date:** 2026-01-26  
**Production:** https://example.com  
**Local:** http://localhost:3000

## Visual Assessment

### Desktop (1920x1080)
**Status:** ⚠️ Minor mismatch  
**Issues:**
- Header padding: 16px (local) vs 32px (prod)

### Tablet (768x1024)
**Status:** ✅ Match

### Mobile (375x667)
**Status:** ❌ Major mismatch  
**Issues:**
- Sign Up button missing on local
- Navigation menu layout incorrect

## Copy/SEO Assessment

**Text mismatches:**
- Button: "Register" (local) vs "Sign Up" (prod)

**SEO mismatches:**
- Title: "NSA Storage" (local) vs "Storage Facilities | NSA" (prod)

## Overall

**Visual Parity:** ❌ Not achieved  
**Copy/SEO:** ❌ Not achieved

**Recommended fixes:**
1. Desktop: Increase header padding to 32px
2. Mobile: Show Sign Up button, fix navigation layout
3. Update button label to "Sign Up"
4. Fix title tag

## Evidence
- Gallery: `.temp/parity/diff/visual-review.html`
- Text diff: `.temp/parity/diff/ui-text-diff.json`
```

---

### Step 6: Review Evidence

**Human review required.**

**Open visual gallery:**

```bash
open .temp/parity/diff/visual-review.html
```

**Review checklist:**

- [ ] **Layout:** Are elements positioned identically?
- [ ] **Spacing:** Are margins/padding consistent?
- [ ] **Typography:** Are fonts, sizes, colors matching?
- [ ] **Components:** Are all elements present?
- [ ] **Responsive:** Do breakpoints work correctly?
- [ ] **Copy:** Are labels, CTAs, headings correct?
- [ ] **SEO:** Are title/meta tags correct?

**Acceptable differences:**
- Dynamic content (timestamps, user-specific data, ads)
- OS/browser rendering subtleties (anti-aliasing, font smoothing)
- Loading states (if captured at different load times)

**Unacceptable differences:**
- Layout mismatches
- Missing components
- Incorrect spacing/typography
- Wrong copy/CTAs

---

### Step 7: Fix Mismatches

**Use `/test.parity.fix-from-report` command.**

**Key principles:**

1. **Fix only what evidence shows** (don't guess)
2. **Keep scope tight** (no unrelated refactoring)
3. **One fix at a time** (isolate changes)
4. **Verify each fix** (re-capture after fix)

**Fix workflow:**

```
For each issue in parity report:
1. Identify affected component
2. Understand root cause (CSS? missing element? responsive issue?)
3. Apply minimal fix
4. Re-capture local
5. Re-generate comparison
6. Verify issue resolved
```

**Example fixes:**

**Issue: Header padding mismatch**

```diff
// Before
.header {
-  padding: 1rem; /* 16px */
+  padding: 2rem; /* 32px - matches production */
}
```

**Issue: Missing button on mobile**

```diff
// Before
- <button className="hidden md:block">Sign Up</button>
// After
+ <button className="block">Sign Up</button>
```

**Issue: Button label mismatch**

```diff
// Before
- <button>Register</button>
// After
+ <button>Sign Up</button>
```

---

### Step 8: Re-Capture and Verify

**After each fix:**

```bash
# Re-capture local
node scripts/parity/capture_rendered.mjs local "http://localhost:3000" ".temp/parity/local"

# Re-generate comparison
node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"

# Review updated gallery
open .temp/parity/diff/visual-review.html
```

**Verify:**
- Issue resolved?
- No new issues introduced?
- All viewports still working?

**Loop back to Step 7 until all issues resolved.**

---

### Step 9: Parity Achieved

**Criteria for completion:**

- ✅ Visual gallery shows match at all viewports
- ✅ Text diff shows no mismatches (or only acceptable differences)
- ✅ Parity report status: ACHIEVED
- ✅ Evidence artifacts saved

**Final parity report:**

```markdown
## Parity Status: ✅ ACHIEVED

### Visual Parity
- Desktop: ✅ Match
- Tablet: ✅ Match
- Mobile: ✅ Match

### Copy/SEO
- ✅ All text matches
- ✅ Title and meta tags correct

### Evidence
- Final gallery: `.temp/parity/diff/visual-review.html`
- Final report: `.temp/parity/diff/parity-report.md`

**Ready for deployment.**
```

---

## Common Failure Modes

### 1. Claiming Parity Without Evidence

**Symptom:** "It looks good to me" without screenshots

**Fix:** Always generate artifacts before claiming parity

---

### 2. Fixating on DOM Structure

**Symptom:** Trying to match production's DOM exactly

**Fix:** Remember: visual parity is the goal, not structural parity

---

### 3. Over-Fixing

**Symptom:** Refactoring unrelated code during parity fixes

**Fix:** Keep scope tight—only fix what the evidence shows

---

### 4. Skipping Re-Capture

**Symptom:** Claiming fix worked without re-capturing

**Fix:** Always re-capture and re-compare after fixes

---

### 5. Ignoring Viewport-Specific Issues

**Symptom:** Fixing desktop but breaking mobile

**Fix:** Test all viewports after each fix

---

## Why This Works in Practice

### Without Evidence-Driven Parity Testing

| Problem | Why It Happens |
|---------|----------------|
| "Looks good" but actually doesn't | No screenshot comparison |
| Fixes break other viewports | No systematic re-testing |
| Arguing about "close enough" | No objective criteria |
| Scope creep during fixes | No tight focus on evidence |

---

### With Evidence-Driven Parity Testing

| Benefit | How It Works |
|---------|--------------|
| Objective parity assessment | Side-by-side screenshots |
| Viewport-specific fixes | Evidence shows exact issue per viewport |
| Tight scope | Only fix what evidence shows |
| Verifiable completion | Re-capture proves parity achieved |

---

## Key Principle

> **Generate artifacts first, then fix based on evidence.**

Commands trigger it.  
Rules enforce it.  
Skills teach it.  
Subagents validate it.

**This is visual parity made operational.**

---

## References

See `references/` for:
- Playwright documentation
- Example capture scripts
- Real parity reports from projects
- Common visual mismatch patterns and fixes
