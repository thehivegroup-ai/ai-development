# Impeccable Design Skills

**Last Updated:** 2026-07-01
**Status:** Active
**Owner:** AI Development Team

## What Impeccable Does

Impeccable gives agents a designer's vocabulary for building and iterating production-grade frontend interfaces. It ships 24 commands covering the full design lifecycle — from shaping UX before writing code to final polish and anti-pattern detection before shipping.

The skill is installed at `.cursor/skills/impeccable/` and is invoked via `/impeccable <command>` in any Cursor agent session.

## When to Trigger Impeccable

Trigger the Impeccable skill (`read .cursor/skills/impeccable/SKILL.md`) when:

- The user invokes `/impeccable`, `/shape`, `/polish`, `/critique`, `/typeset`, `/colorize`, `/animate`, `/audit`, `/craft`, `/distill`, `/harden`, `/bolder`, `/quieter`, `/layout`, `/delight`, `/overdrive`, `/clarify`, `/adapt`, `/optimize`, `/extract`, `/document`, `/onboard`, `/init`, or `/live`
- The user asks to design, redesign, critique, polish, or improve any frontend UI (web, mobile, component, landing page, dashboard, form, empty state, onboarding)
- The user says a design "feels off", "looks bland", "is too loud", "needs polish", or "looks like AI made it"
- The user asks about typography, color strategy, spacing, animation, motion, responsive layout, or visual hierarchy in code
- The user wants a `DESIGN.md` or `PRODUCT.md` generated for a project

## What Impeccable Is NOT For

- Backend-only tasks (APIs, databases, business logic with no UI)
- Generating non-visual code (CLI tools, scripts, data pipelines)

## Command Categories

| Category | Commands |
|---|---|
| Build | `craft`, `shape`, `init`, `document`, `extract` |
| Evaluate | `critique`, `audit` |
| Refine | `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard` |
| Enhance | `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive` |
| Fix | `clarify`, `adapt`, `optimize` |
| Iterate | `live` |

## Anti-Pattern Detector

The detector runs automatically on UI file edits via the Cursor `preToolUse` hook (blocks bad writes before they land). It can also be run manually:

```bash
npx impeccable detect src/
```

Or via the bundled script (no network, no npx):

```bash
node .cursor/skills/impeccable/scripts/detect.mjs <path>
```

## Hook Management

Enable/disable the auto-detector hook:

```bash
# Enable
node .cursor/skills/impeccable/scripts/hook-admin.mjs on

# Disable
node .cursor/skills/impeccable/scripts/hook-admin.mjs off

# Status
node .cursor/skills/impeccable/scripts/hook-admin.mjs status
```

## Downstream Project Setup

When deploying this module to a downstream project:

1. Run `npx impeccable skills install` in the project root (installs skills into `.cursor/skills/impeccable/`)
2. Run `/impeccable init` in a Cursor agent session to generate `PRODUCT.md` and optionally `DESIGN.md`
3. Enable the hook: `node .cursor/skills/impeccable/scripts/hook-admin.mjs on`

## References

- Full skill: `.cursor/skills/impeccable/SKILL.md`
- Command references: `.cursor/skills/impeccable/reference/*.md`
- Hook management: `.cursor/skills/impeccable/reference/hooks.md`
- Impeccable docs: https://impeccable.style/
