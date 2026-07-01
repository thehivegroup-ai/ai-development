---
name: impeccable-commands
description: Use when the user invokes any Impeccable design command (/impeccable, /shape, /polish, /critique, /typeset, /colorize, /animate, /audit, /craft, /distill, /harden, /bolder, /quieter, /layout, /delight, /overdrive, /clarify, /adapt, /optimize, /extract, /document, /onboard, /init, /live) or asks to design, improve, or critique any frontend UI. Reads the full Impeccable skill installed at .cursor/skills/impeccable/SKILL.md.
---

# Impeccable Commands

This skill is a pointer to the Impeccable design skill installed by the AI-Development MCP.

## Usage

Read `.cursor/skills/impeccable/SKILL.md` to get the full skill definition and command routing.

The skill will direct you to:
1. Run `node .cursor/skills/impeccable/scripts/context.mjs` to load project context
2. Read the sub-command reference at `reference/<command>.md`
3. Read the register reference (`reference/brand.md` or `reference/product.md`)
4. Execute the command following its defined flow

## Available Commands

| Command | Category |
|---|---|
| `/craft [feature]` | Build |
| `/shape [feature]` | Build |
| `/init` | Build |
| `/document` | Build |
| `/extract [target]` | Build |
| `/critique [target]` | Evaluate |
| `/audit [target]` | Evaluate |
| `/polish [target]` | Refine |
| `/bolder [target]` | Refine |
| `/quieter [target]` | Refine |
| `/distill [target]` | Refine |
| `/harden [target]` | Refine |
| `/onboard [target]` | Refine |
| `/animate [target]` | Enhance |
| `/colorize [target]` | Enhance |
| `/typeset [target]` | Enhance |
| `/layout [target]` | Enhance |
| `/delight [target]` | Enhance |
| `/overdrive [target]` | Enhance |
| `/clarify [target]` | Fix |
| `/adapt [target]` | Fix |
| `/optimize [target]` | Fix |
| `/live` | Iterate |

## Anti-Pattern Detector

Run manually: `node .cursor/skills/impeccable/scripts/detect.mjs <path>`
Or via npx: `npx impeccable detect <path>`
