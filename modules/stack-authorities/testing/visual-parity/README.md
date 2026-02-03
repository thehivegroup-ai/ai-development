# Visual Parity Testing

Stack authority for visual parity testing using Playwright for screenshot capture and comparison.

## Purpose

Enable evidence-based visual parity validation between production and local environments.

**Core principle:** Generate artifacts first (screenshots, captures, diffs), then fix based on evidence.

## Contents

### Rules

- `30-test-visual-parity.mdc` – Constraints for visual parity testing (evidence requirements, parity definition)

### Commands

- `test.parity.capture-all.md` – Full capture workflow (prod + local screenshots)
- `test.parity.compare.md` – Generate comparison report and visual gallery
- `test.parity.fix-from-report.md` – Fix visual mismatches based on diff report

### Skills

- `visual-parity-testing/` – Complete methodology for visual parity work
- `playwright-capture/` – Technical guide for Playwright screenshot capture

### Agents

- `test.parity-critic.md` – Validates parity claims with evidence

## Parity Definition

### Primary Goal: Visual Parity
- Layout, spacing, typography, component presence
- Responsive behavior at agreed viewports

### Secondary Goal: Copy + SEO Correctness
- Visible labels/CTAs, headings
- `<title>` and meta description

### Non-Goal: DOM/Structural Parity
- Production may use different DOM structure
- Structure diffs are diagnostic only, not parity blockers

## Workflow

```
1. SOLUTION mode → Define parity requirements (viewports, pages, success criteria)
2. PLAN mode → Plan capture and comparison workflow
3. TEST-LOOP mode → Run parity testing
   - /test.parity.capture-all → Capture prod + local screenshots
   - /test.parity.compare → Generate diff report + visual gallery
   - Review evidence artifacts
   - /test.parity.fix-from-report → Fix mismatches
   - Re-capture and verify
4. DEPLOY-RELEASE → Deploy when visual parity achieved
```

## Evidence Artifacts

All artifacts output to `.temp/parity/` (gitignored):

```
.temp/parity/
├── prod/
│   ├── desktop/
│   │   ├── screenshot.png
│   │   └── page.html
│   ├── tablet/
│   └── mobile/
├── local/
│   ├── desktop/
│   ├── tablet/
│   └── mobile/
└── diff/
    ├── visual-review.html        # Side-by-side screenshot gallery
    ├── ui-text-diff.json          # Copy/SEO mismatches
    └── parity-report.md           # Full parity assessment
```

## Integration

**Requires:**
- Enterprise Standards (for evidence-based claims rule)
- Playwright (for screenshot capture)

**Composes with:**
- Frontend stack authorities (React, Next, Angular)
- Project Controls (for regulated parity requirements)
