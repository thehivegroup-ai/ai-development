# Visual Parity

**Platform-Agnostic Instructions**

This file contains base instructions that apply across all platforms.


---


# Test Visual Parity

## Parity Definition (This Project)

### Primary Goal: VISUAL Parity

Visual parity means production and local are visually indistinguishable at agreed viewports.

**Includes:**
- Layout (positioning, alignment, grid/flex behavior)
- Spacing (margins, padding, gaps)
- Typography (fonts, sizes, weights, line heights, colors)
- Component presence (all visible elements present)
- Responsive behavior (breakpoint transitions work correctly)

### Secondary Goal: Copy + SEO Correctness

**Includes:**
- Visible labels, CTAs, headings match production
- `<title>` tag matches production
- Meta description matches production

### Non-Goal: DOM/Structural Parity

**Production DOM structure is NOT required to match.**

- Production may be server-rendered, local may be SPA
- Different component implementations are acceptable
- Structure diffs are **diagnostic only** (help explain visual mismatches)
- Do NOT fail parity purely due to DOM differences

## Evidence Requirements

**Visual parity CANNOT be claimed without artifacts:**

1. **Screenshots** (primary evidence)
   - Production screenshots at agreed viewports
   - Local screenshots at same viewports
   - Side-by-side visual comparison

2. **Copy/SEO inventory** (supporting evidence)
   - UI text extraction (prod vs local)
   - SEO metadata extraction (title, meta description)
   - Diff report showing mismatches

3. **Parity report** (assessment)
   - Summary of visual mismatches
   - Copy/SEO mismatches
   - Recommended fixes

## Artifact Locations

All parity artifacts MUST be generated in `.temp/parity/`:

```
.temp/parity/
├── prod/              # Production captures
├── local/             # Local captures
└── diff/              # Comparison outputs
```

## Viewport Requirements

**Define agreed viewports before capturing.**

Common breakpoints:
- Desktop: 1920x1080 or 1440x900
- Tablet: 768x1024
- Mobile: 375x667 or 390x844

**Parity must be achieved at ALL agreed viewports.**

## Fixing from Evidence

**Do NOT fix without evidence.**

Workflow:
1. Generate artifacts (capture-all)
2. Review visual gallery and diff reports
3. Identify visual mismatches
4. Fix based on specific evidence
5. Re-capture to verify fix

**Do NOT:**
- Guess at fixes without screenshots
- Claim parity without re-capturing
- Fix unrelated code (tight scope)

## Stop Conditions

Stop and ask for direction if:
- Production capture is blocked/non-deterministic
- Requirements are ambiguous (which viewports? which pages?)
- Evidence conflicts (screenshots show match, but copy differs)
- Visual mismatch exists but cause is unclear

## What This Rule Does NOT Do

- Does NOT explain how to capture (see `playwright-capture` skill)
- Does NOT trigger capture workflow (use `/test.parity.capture-all` command)
- Does NOT validate evidence quality (subagents do this)

This rule only **defines what parity means and requires evidence**.
