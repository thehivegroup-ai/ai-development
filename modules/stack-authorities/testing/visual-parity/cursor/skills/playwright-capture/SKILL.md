---
name: playwright-capture
description: Technical guide for using Playwright to capture rendered screenshots and HTML at multiple viewports. Use when capturing screenshots for visual parity testing, setting up multi-viewport screenshot automation, or comparing rendered output between environments.
---

# Playwright Capture

**Technical implementation guide for capturing production and local screenshots using Playwright.**

---

## When to Use

- Capturing rendered screenshots for visual parity testing
- Need full-page screenshots at multiple viewports
- Require rendered HTML (after JavaScript execution)
- Comparing production vs local/staging environments

---

## Prerequisites

**Install Playwright:**

```bash
npm install -D playwright
npx playwright install chromium
```

**Or (if using pnpm):**

```bash
pnpm add -D playwright
pnpm exec playwright install chromium
```

---

## Basic Capture Script

### Minimal Example

```javascript
// scripts/parity/capture_rendered.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

async function capture(url, outputDir) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle' });
  
  mkdirSync(outputDir, { recursive: true });
  
  await page.screenshot({
    path: `${outputDir}/screenshot.png`,
    fullPage: true
  });
  
  const html = await page.content();
  writeFileSync(`${outputDir}/page.html`, html);
  
  await browser.close();
}

// Usage: node scripts/parity/capture_rendered.mjs "https://example.com" ".temp/parity/prod"
const [url, outputDir] = process.argv.slice(2);
capture(url, outputDir);
```

**Run it:**

```bash
node scripts/parity/capture_rendered.mjs "https://example.com" ".temp/parity/prod"
```

**Output:**
- `.temp/parity/prod/screenshot.png`
- `.temp/parity/prod/page.html`

---

## Multi-Viewport Capture

### Script with Multiple Viewports

```javascript
// scripts/parity/capture_rendered.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

async function captureAllViewports(env, url, outputDir) {
  console.log(`Capturing ${env} from ${url}...`);
  
  const browser = await chromium.launch({
    headless: true
  });
  
  for (const [name, viewport] of Object.entries(viewports)) {
    console.log(`  Capturing ${name} (${viewport.width}x${viewport.height})...`);
    
    const page = await browser.newPage({ viewport });
    
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    const dir = `${outputDir}/${name}`;
    mkdirSync(dir, { recursive: true });
    
    await page.screenshot({
      path: `${dir}/screenshot.png`,
      fullPage: true
    });
    
    const html = await page.content();
    writeFileSync(`${dir}/page.html`, html);
    
    console.log(`  ✓ ${name} captured`);
    
    await page.close();
  }
  
  await browser.close();
  console.log(`✓ All ${env} captures complete`);
}

// Usage: node scripts/parity/capture_rendered.mjs prod "https://example.com" ".temp/parity/prod"
const [env, url, outputDir] = process.argv.slice(2);

if (!env || !url || !outputDir) {
  console.error('Usage: node capture_rendered.mjs <env> <url> <outputDir>');
  console.error('Example: node capture_rendered.mjs prod "https://example.com" ".temp/parity/prod"');
  process.exit(1);
}

captureAllViewports(env, url, outputDir);
```

**Run it:**

```bash
# Capture production
node scripts/parity/capture_rendered.mjs prod "https://example.com" ".temp/parity/prod"

# Capture local
node scripts/parity/capture_rendered.mjs local "http://localhost:3000" ".temp/parity/local"
```

**Output structure:**

```
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
└── local/
    ├── desktop/
    ├── tablet/
    └── mobile/
```

---

## Advanced Options

### 1. Wait for Specific Element

```javascript
await page.goto(url, { waitUntil: 'networkidle' });

// Wait for specific element to be visible
await page.waitForSelector('.header', { state: 'visible', timeout: 10000 });

// Wait for all images to load
await page.waitForLoadState('load');
```

### 2. Handle Authentication

```javascript
// If site requires login
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  httpCredentials: {
    username: 'user',
    password: 'pass'
  }
});
const page = await context.newPage();
```

### 3. Mock Dynamic Content

```javascript
// Intercept and mock timestamp or dynamic content
await page.route('**/api/timestamp', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ timestamp: '2026-01-26T12:00:00Z' })
  });
});

await page.goto(url);
```

### 4. Disable Animations

```javascript
// Disable CSS animations for consistent screenshots
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
});
```

### 5. Capture Specific Element

```javascript
// Instead of full page, capture specific element
const element = await page.$('.main-content');
await element.screenshot({ path: `${dir}/content.png` });
```

---

## Visual Gallery Generator

### Script to Create Side-by-Side Comparison

```javascript
// scripts/parity/make_visual_gallery.mjs
import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

function generateGallery(prodDir, localDir, outputPath) {
  const viewports = readdirSync(prodDir).filter(d => 
    readdirSync(join(prodDir, d)).includes('screenshot.png')
  );
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Visual Parity Review</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 2rem;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    .viewport {
      background: white;
      padding: 2rem;
      margin: 2rem 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .viewport h2 {
      margin-top: 0;
      color: #666;
    }
    .comparison {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }
    .comparison > div {
      flex: 1;
    }
    .comparison h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .comparison img {
      width: 100%;
      border: 2px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>Visual Parity Review</h1>
  <p>Production vs Local comparison at multiple viewports</p>
  
  ${viewports.map(vp => `
    <div class="viewport">
      <h2>${vp.charAt(0).toUpperCase() + vp.slice(1)}</h2>
      <div class="comparison">
        <div>
          <h3>Production</h3>
          <img src="../../prod/${vp}/screenshot.png" alt="${vp} production" />
        </div>
        <div>
          <h3>Local</h3>
          <img src="../../local/${vp}/screenshot.png" alt="${vp} local" />
        </div>
      </div>
    </div>
  `).join('')}
  
</body>
</html>
  `.trim();
  
  writeFileSync(outputPath, html);
  console.log(`✓ Visual gallery generated: ${outputPath}`);
}

// Usage: node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"
const [prodDir, localDir, outputPath] = process.argv.slice(2);

if (!prodDir || !localDir || !outputPath) {
  console.error('Usage: node make_visual_gallery.mjs <prodDir> <localDir> <outputPath>');
  process.exit(1);
}

generateGallery(prodDir, localDir, outputPath);
```

**Run it:**

```bash
node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"

open .temp/parity/diff/visual-review.html
```

---

## Troubleshooting

### Issue: Screenshots are blank

**Cause:** Page didn't finish loading

**Fix:**

```javascript
await page.goto(url, {
  waitUntil: 'networkidle', // Wait for network to be idle
  timeout: 30000             // Increase timeout
});

// Or wait for specific element
await page.waitForSelector('.main-content', { state: 'visible' });
```

---

### Issue: Screenshots differ due to dynamic content

**Cause:** Timestamps, ads, user-specific content

**Fix:** Mock dynamic content

```javascript
await page.route('**/api/**', route => {
  // Mock API responses to be deterministic
  route.fulfill({ status: 200, body: '{"timestamp":"2026-01-26"}' });
});
```

---

### Issue: Font rendering differences

**Cause:** OS/browser font smoothing

**Fix:** This is acceptable—focus on layout/spacing, not sub-pixel font rendering

---

### Issue: Playwright installation fails

**Cause:** Missing system dependencies

**Fix:**

```bash
# macOS
brew install --cask chromium

# Ubuntu/Debian
sudo apt-get install -y chromium-browser

# Then
npx playwright install chromium
```

---

## Performance Tips

### 1. Reuse Browser Instance

```javascript
// Instead of launching per viewport
const browser = await chromium.launch();

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  // ... capture
  await page.close();
}

await browser.close(); // Close once at end
```

### 2. Parallel Captures (if needed)

```javascript
await Promise.all(
  viewports.map(async ([name, viewport]) => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport });
    // ... capture
    await browser.close();
  })
);
```

### 3. Cache Browser Binaries

```bash
# Set Playwright cache dir
export PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/playwright
```

---

## Integration with Parity Workflow

**Capture workflow:**

```bash
# 1. Capture production
node scripts/parity/capture_rendered.mjs prod "https://example.com" ".temp/parity/prod"

# 2. Capture local (dev server must be running)
node scripts/parity/capture_rendered.mjs local "http://localhost:3000" ".temp/parity/local"

# 3. Generate visual gallery
node scripts/parity/make_visual_gallery.mjs ".temp/parity/prod" ".temp/parity/local" ".temp/parity/diff/visual-review.html"

# 4. Open gallery in browser
open .temp/parity/diff/visual-review.html
```

---

## Key Principles

1. **Capture production first** (source of truth)
2. **Use same viewports** for both environments
3. **Wait for page to be fully loaded** (`networkidle` or specific selectors)
4. **Mock dynamic content** if needed for deterministic captures
5. **Generate visual gallery** for easy side-by-side comparison

---

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Screenshot Options](https://playwright.dev/docs/api/class-page#page-screenshot)
- [Viewport Configuration](https://playwright.dev/docs/emulation#viewport)
