# Skill: Generate Parity Evidence (Visual-First)

## Purpose
Produce parity evidence focused on **visual parity** (primary) and **copy/SEO correctness** (secondary).

## Primary Evidence (Visual)
1. Capture screenshots at required viewports for prod and local.
2. Generate a visual review gallery (side-by-side per viewport).

## Supporting Evidence (Copy + SEO)
- Extract UI text + SEO metadata inventories and generate a mismatch report.
- Use this to catch obvious issues like wrong button text, missing CTAs, incorrect `<title>` or meta description.

## Non-Goal
- DOM/structural parity is not required. Structure diffs are **diagnostic only**.

## Outputs
### Visual
- `.temp/parity/prod/<vp>/screenshot.png`
- `.temp/parity/local/<vp>/screenshot.png`
- `.temp/parity/diff/visual-review.html`

### Supporting
- `.temp/parity/diff/ui-text-diff.json`
- `.temp/parity/diff/parity-report.md`
