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

**Preferred method:** Playwright capture script

```bash
node scripts/parity/capture_rendered.mjs prod "<PROD_URL>" ".temp/parity/prod"
```

**What this captures:**
- Screenshots at each viewport (`.temp/parity/prod/<viewport>/screenshot.png`)
- Rendered HTML at each viewport (`.temp/parity/prod/<viewport>/page.html`)

**If script doesn't exist yet, create it using the `playwright-capture` skill.**

**Fallback method (no screenshots):**

```bash
curl "<PROD_URL>" > .temp/parity/prod/page.html
```

**Verify capture:**

```bash
ls -la .temp/parity/prod/
```

**Expected:** One directory per viewport with `screenshot.png` and `page.html`

---

### Step 4: Capture Local

**Ensure local dev server is running before capturing.**

```bash
node scripts/parity/capture_rendered.mjs local "<LOCAL_URL>" ".temp/parity/local"
```

**What this captures:**
- Screenshots at each viewport (`.temp/parity/local/<viewport>/screenshot.png`)
- Rendered HTML at each viewport (`.temp/parity/local/<viewport>/page.html`)

**Verify capture:**

```bash
ls -la .temp/parity/local/
```

**Expected:** Same structure as prod (one directory per viewport with artifacts)

---

### Step 5: Verify Artifacts

**Check all required artifacts exist:**

```bash
# Expected structure
.temp/parity/
├── prod/
│   ├── desktop/
│   │   ├── screenshot.png
│   │   └── page.html
│   ├── tablet/
│   │   ├── screenshot.png
│   │   └── page.html
│   └── mobile/
│       ├── screenshot.png
│       └── page.html
├── local/
│   ├── desktop/
│   │   ├── screenshot.png
│   │   └── page.html
│   ├── tablet/
│   │   ├── screenshot.png
│   │   └── page.html
│   └── mobile/
│       ├── screenshot.png
│       └── page.html
```

**If any artifacts missing, identify why and re-capture.**

---

## Output

**Report artifacts generated:**

```markdown
## Capture Complete

### Production Captures
- Desktop (1920x1080): ✅ `.temp/parity/prod/desktop/screenshot.png`
- Tablet (768x1024): ✅ `.temp/parity/prod/tablet/screenshot.png`
- Mobile (375x667): ✅ `.temp/parity/prod/mobile/screenshot.png`

### Local Captures
- Desktop (1920x1080): ✅ `.temp/parity/local/desktop/screenshot.png`
- Tablet (768x1024): ✅ `.temp/parity/local/tablet/screenshot.png`
- Mobile (375x667): ✅ `.temp/parity/local/mobile/screenshot.png`

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
