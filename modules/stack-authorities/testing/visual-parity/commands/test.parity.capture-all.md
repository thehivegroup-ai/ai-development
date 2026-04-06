# Test Parity: Capture All

Trigger full capture workflow for visual parity testing (production + local screenshots at all agreed viewports).

**Generate artifacts first, then fix based on evidence.**

---

## Purpose

Capture visual evidence from both production and local environments to enable side-by-side comparison.

This is the **first step** in visual parity testing.

---

## Prerequisites

**Before capturing, you MUST have:**
- Agreed viewports defined (desktop/tablet/mobile with specific dimensions)
- Target URLs identified (prod URL + local URL)
- Local development server running
- Playwright installed (`npm install -D playwright`)

**If prerequisites missing, return to SOLUTION mode to clarify requirements.**

---

## Capture Workflow

### Step 1: Verify Environment

**Check production URL is accessible:**

```bash
curl -I <PROD_URL>
```

**Expected:** HTTP 200 response

**Check local dev server is running:**

```bash
curl -I <LOCAL_URL>
```

**Expected:** HTTP 200 response

**If either fails, stop and report error.**

---

### Step 2: Define Viewports

**Question:**
- Which viewports are required for this parity test?
- What are the exact dimensions?

**Common breakpoints:**

```javascript
const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};
```

**User must approve viewport list before capturing.**

---

### Step 3: Capture Production

**Run the capture script for production:**

```bash
npm run capture:production
# or
tsx scripts/visual-parity/capture.ts visual-parity.production.config.json
```

**What this script does:**
1. Reads configuration from `visual-parity.production.config.json`
2. Launches Playwright browser
3. Authenticates if credentials provided
4. Navigates to each page
5. Captures screenshots at each viewport
6. Saves to `visual-tests/production/`
7. Generates capture report

**Verify capture:**

```bash
ls -R visual-tests/production/
```

**Expected:** Directory per page, subdirectory per viewport with `screenshot.png`

**Example:**
```
visual-tests/production/
├── home/
│   ├── mobile/screenshot.png
│   ├── tablet/screenshot.png
│   └── desktop/screenshot.png
├── products/
│   └── ...
└── capture-report.json
```

---

### Step 4: Capture Local

**Ensure local dev server is running before capturing.**

Check server is up:
```bash
curl -I http://localhost:3000
```

**Run the capture script for local:**

```bash
npm run capture:local
# or
tsx scripts/visual-parity/capture.ts visual-parity.local.config.json
```

**What this script does:**
1. Reads configuration from `visual-parity.local.config.json`
2. Connects to local server
3. Captures same pages and viewports as production
4. Saves to `visual-tests/local/`
5. Generates capture report

**Verify capture:**

```bash
ls -R visual-tests/local/
```

**Expected:** Same structure as production

---

### Step 5: Verify Artifacts

**Check all required artifacts exist:**

```bash
# Expected structure
visual-tests/
├── production/
│   ├── home/
│   │   ├── mobile/screenshot.png
│   │   ├── tablet/screenshot.png
│   │   └── desktop/screenshot.png
│   ├── products/
│   │   └── ...
│   └── capture-report.json
└── local/
    ├── home/
    │   ├── mobile/screenshot.png
    │   ├── tablet/screenshot.png
    │   └── desktop/screenshot.png
    ├── products/
    │   └── ...
    └── capture-report.json
```

**If any artifacts missing, identify why and re-capture.**

---

## Output

**Report artifacts generated:**

```markdown
## Capture Complete ✅

### Configuration
- Production URL: https://your-production-site.com
- Local URL: http://localhost:3000
- Pages: 4 (home, products, about, contact)
- Viewports: 3 (mobile, tablet, desktop)
- Total Screenshots: 24 (4 pages × 3 viewports × 2 environments)

### Production Captures
- home/mobile: ✅ visual-tests/production/home/mobile/screenshot.png
- home/tablet: ✅ visual-tests/production/home/tablet/screenshot.png
- home/desktop: ✅ visual-tests/production/home/desktop/screenshot.png
- (... and so on for all pages)

### Local Captures
- home/mobile: ✅ visual-tests/local/home/mobile/screenshot.png
- home/tablet: ✅ visual-tests/local/home/tablet/screenshot.png
- home/desktop: ✅ visual-tests/local/home/desktop/screenshot.png
- (... and so on for all pages)

### Reports Generated
- Production: visual-tests/production/capture-report.json
- Local: visual-tests/local/capture-report.json

### Next Step
Run `/test.parity.compare` to generate visual comparison.
```

---

## Guidance

- **Apply the `playwright-capture` skill** for Playwright script implementation details
- **Apply the `visual-parity-testing` skill** for full parity methodology
- **Invoke `test.parity-critic` subagent** if capture artifacts seem incomplete

---

## Common Failure Modes

❌ **Capture runs but screenshots are blank** → Viewport dimensions may be wrong, or page requires JavaScript rendering time  
❌ **Production capture blocked by rate limiting** → Add delay between captures or use authenticated requests  
❌ **Local capture fails with connection refused** → Dev server not running  
❌ **Screenshots differ due to dynamic content** → May need to mock timestamps, ads, or user-specific data

---

## What This Command Does NOT Do

- Does NOT compare captures (use `/test.parity.compare`)
- Does NOT fix visual mismatches (use `/test.parity.fix-from-report`)
- Does NOT determine if parity is achieved (comparison report does this)

This command only **generates visual evidence artifacts**.
