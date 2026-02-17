# Visual Parity Testing Setup

This example includes complete visual parity testing to ensure your local development matches production.

## What is Visual Parity Testing?

Visual parity testing captures screenshots from both production and local environments, then compares them pixel-by-pixel to detect any visual differences.

**Benefits:**
- Catch visual regressions early
- Ensure local matches production
- Validate responsive design
- Document visual state

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- Playwright (screenshot capture)
- pixelmatch (image comparison)
- sharp (image processing)

### 2. Configure Production URLs

Edit `visual-parity.production.config.json`:
```json
{
  "baseUrl": "https://your-actual-production-site.com",
  "pages": [
    { "path": "/", "name": "home" },
    { "path": "/products", "name": "products" }
  ]
}
```

### 3. Configure Local URLs

Edit `visual-parity.local.config.json`:
```json
{
  "baseUrl": "http://localhost:3000",
  "pages": [
    { "path": "/", "name": "home" },
    { "path": "/products", "name": "products" }
  ]
}
```

**Important:** Pages must match between production and local configs.

### 4. Run Tests

```bash
# Capture production screenshots
npm run capture:production

# Start your local server
npm start

# Capture local screenshots
npm run capture:local

# Compare
npm run compare

# Or run all steps together
npm run test:visual
```

### 5. View Results

Open `visual-tests/diff/report.html` in your browser to see:
- Side-by-side comparison
- Difference highlighting
- Pass/fail status
- Pixel diff percentage

## Configuration

### Pages Configuration

Add pages you want to test:

```json
{
  "pages": [
    {
      "path": "/dashboard",
      "name": "dashboard",
      "waitFor": "[data-testid='dashboard-loaded']",
      "waitTimeout": 10000
    }
  ]
}
```

**Fields:**
- `path` - URL path (relative to baseUrl)
- `name` - Identifier for this page (used in reports)
- `waitFor` - CSS selector to wait for before capture
- `waitTimeout` - Max time to wait (milliseconds)

### Viewports Configuration

Standard viewports are pre-configured:
- Mobile: 375x667 (iPhone SE)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080 (Full HD)

Add custom viewports:
```json
{
  "viewports": [
    {
      "name": "mobile-small",
      "width": 320,
      "height": 568
    }
  ]
}
```

### Comparison Threshold

Edit `visual-compare.config.json`:

```json
{
  "threshold": 0.01,  // 1% difference allowed
  "ignoreAntialiasing": true
}
```

**Threshold guidance:**
- `0.001` (0.1%) - Strict, catches tiny differences
- `0.01` (1%) - Recommended, ignores minor rendering variations
- `0.05` (5%) - Lenient, allows significant differences

### Authentication

If your site requires login:

```json
{
  "authentication": {
    "loginUrl": "https://example.com/login",
    "username": "test@example.com",
    "password": "test-password",
    "usernameSelector": "[data-testid='login-email']",
    "passwordSelector": "[data-testid='login-password']",
    "submitSelector": "[data-testid='login-submit']"
  }
}
```

**Security:** Use test credentials, never commit production passwords.

## Directory Structure

After running tests:

```
examples/react-fastify-postgres-aws/
├── visual-parity.production.config.json
├── visual-parity.local.config.json
├── visual-compare.config.json
├── package.json
└── visual-tests/
    ├── production/
    │   ├── home/
    │   │   ├── mobile/screenshot.png
    │   │   ├── tablet/screenshot.png
    │   │   └── desktop/screenshot.png
    │   └── products/
    │       └── ...
    ├── local/
    │   └── (same structure)
    ├── diff/
    │   ├── home/
    │   │   ├── mobile/diff.png
    │   │   └── ...
    │   ├── report.html
    │   └── results.json
    └── capture-report.json
```

## Workflow Integration

### Using with Commands

```bash
# 1. Frame the feature
/std-solution

# 2. Plan implementation
/std-plan

# 3. Build feature
/web.react.build-screen

# 4. Clean and review
/std-clean-sweep

# 5. Run unit tests
/std-test-loop

# 6. Run visual parity tests
/test.parity.capture-all
/test.parity.compare

# 7. If differences found
/test.parity.fix-from-report

# 8. Deploy
/std-deploy-release
```

### Adding Visual Parity Module

To get the `/test.parity.*` commands, add visual parity to your stack profile:

```json
{
  "enterprise": "",
  "controls": ["base"],
  "stacks": [
    "frontend/react-tailwind",
    "backend/node-fastify",
    "database/postgres",
    "cloud/aws",
    "testing/visual-parity"  ← Add this
  ]
}
```

Then reinstall:

```javascript
install_environment({
  projectPath: "/path/to/project",
  selection: { ... }
})
```

## CI/CD Integration (Phase 4)

### GitHub Actions

```yaml
name: Visual Parity Tests

on: [pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Capture production screenshots
        run: npm run capture:production
      
      - name: Capture local screenshots
        run: npm run capture:local
      
      - name: Compare screenshots
        run: npm run compare
        continue-on-error: true
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: visual-parity-results
          path: visual-tests/
      
      - name: Comment on PR
        uses: actions/github-script@v6
        if: always()
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(
              fs.readFileSync('visual-tests/diff/results.json', 'utf8')
            );
            
            const body = `## Visual Parity Test Results
            
            - Total: ${results.summary.total}
            - Passed: ${results.summary.passed} ✅
            - Failed: ${results.summary.failed} ❌
            - Identical: ${results.summary.identical}
            
            [View Full Report](../artifacts/visual-parity-results/diff/report.html)
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body
            });
```

## Troubleshooting

### Screenshots Don't Match

**Possible causes:**
1. **Fonts** - Different OS renders fonts differently
   - Solution: Use web fonts, not system fonts

2. **Timing** - Content loading at different speeds
   - Solution: Increase waitTimeout, use better waitFor selectors

3. **Dynamic Content** - Dates, timestamps, random data
   - Solution: Mock data, use fixed test data

4. **Animations** - CSS transitions/animations
   - Solution: Disable animations in test environment

5. **External Resources** - CDN loading times vary
   - Solution: Use local resources in tests

### Threshold Too Strict

If getting false positives:
```json
{
  "threshold": 0.05  // Increase from 0.01 to 0.05 (5%)
}
```

### Missing Screenshots

Check:
- Is local server running?
- Are URLs correct?
- Are selectors correct (waitFor)?
- Check capture-report.json for errors

## Best Practices

### ✅ DO:
- Use `data-testid` attributes for reliable selectors
- Test all major user flows
- Include mobile, tablet, desktop viewports
- Run tests before every deployment
- Keep test credentials secure
- Version control configs (not credentials)

### ❌ DON'T:
- Test pages with constantly changing content
- Use production credentials in configs
- Set threshold too high (defeats purpose)
- Skip authentication testing
- Commit screenshots to git (too large)

## Integration with Visual Parity Module

The `testing/visual-parity` module provides:

### Rules
- `30-test-visual-parity.mdc` - Testing standards

### Commands
- `/test.parity.capture-all` - Run captures
- `/test.parity.compare` - Run comparison
- `/test.parity.fix-from-report` - AI-assisted fixing

### Skills
- `playwright-capture` - Screenshot capture patterns
- `visual-parity-testing` - Complete methodology

### Agent
- `test.parity-critic` - Visual difference analyzer

## Next Steps

1. Configure your production and local URLs
2. Add pages you want to test
3. Run `npm install` to get dependencies
4. Run `npm run test:visual`
5. Review `visual-tests/diff/report.html`
6. Fix any differences
7. Re-run until all tests pass
8. Add to CI/CD pipeline

## Support

- Main docs: `/Users/robertfiore/development/ai-development/README.md`
- Visual parity module: `modules/stack-authorities/testing/visual-parity/`
- Scripts: `scripts/visual-parity/`
