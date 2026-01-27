# Skill: Capture Production Evidence (Visual Parity)

## Purpose
Capture production evidence required for **visual parity** at agreed viewports.

## Preferred Capture
- `node scripts/parity/capture_rendered.mjs prod "<PROD_URL>" ".temp/parity/prod"`

## Outputs
- `.temp/parity/prod/<vp>/page.html`
- `.temp/parity/prod/<vp>/screenshot.png`
