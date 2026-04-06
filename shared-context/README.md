# Shared context

**Last Updated:** 2026-04-06  
**Status:** Active  
**Owner:** Team

## Purpose

This directory holds **per-initiative** documentation and working memory. It is **not** the same as:

- **`docs/`** (repository root) — documentation *about* the ai-development repo, MCP, and modules  
- **`memory-bank/`** (repository root) — active work *on* this tooling repo  
- **`modules/`** — installable Cursor/module source  

## Layout

```
shared-context/
  <project-name>/
    docs/           # Durable narrative: decisions, runbooks, initiative-specific references
    memory-bank/    # Planning, current phase, handoffs (see memory-bank/README.md)
```

Example: `shared-context/towerai/` for the TowerAI initiative.

## MCP

Use **`list_shared_context`** to discover initiatives in a clone, and **`push_shared_context`** to copy local `docs/` and/or `memory-bank/` trees into `shared-context/<projectName>/` and optionally commit/push.
