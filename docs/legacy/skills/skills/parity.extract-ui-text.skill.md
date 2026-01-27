# Skill: Extract UI Text Inventory

## Purpose
Convert “obvious to a human” issues (wrong button text, missing headings) into deterministic diffs.

## Preferred Implementation
- `scripts/parity/extract_ui_text.mjs`
- `scripts/parity/extract_structure.mjs`

## Inventory Contents
- headings (H1–H3) in order
- buttons: visible text + accessible name (best-effort)
- links: text + href (normalized)
- key labels/CTAs relevant to the page

## Outputs
- `.temp/parity/*/ui-text.json`
