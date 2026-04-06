---
name: monorepo-packages
version: 1.0.0
description: >
  TowerAI pnpm workspace: how to depend on and import @towerai/ui, @towerai/shared,
  workspace:* protocol, package exports, apps/web path aliases, and avoiding duplicate
  CSS or invalid deep imports.

  Trigger when user mentions: workspace, monorepo, packages/, @towerai, workspace:*,
  import from packages, pnpm workspace, shared package, or adding a dependency to the UI library.
---

# Monorepo Packages (TowerAI)

## Workspace model

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Declares `apps/*` and `packages/*` as workspace members |
| Root `pnpm-lock.yaml` | Single lockfile; run `pnpm install` from repo root |
| Per-package `package.json` | `name`, `exports`, `dependencies`; internal refs use `workspace:*` |

## Published-style package names

Libraries are **scoped** under `@towerai/`:

| Package | Role |
|---------|------|
| `@towerai/ui` | React primitives, components, foundations, utilities (Untitled-style UI) |
| `@towerai/shared` | Shared TS types, data, config (no React UI) |

Consuming apps declare:

```json
"@towerai/ui": "workspace:*",
"@towerai/shared": "workspace:*"
```

## How to import (do / don’t)

**Do**

- `import { Button } from '@towerai/ui'` (barrel from `packages/ui/src/index.ts` when exported).
- Subpaths that appear in **`packages/<name>/package.json` → `exports`**, e.g. `@towerai/ui/primitives/...`, `@towerai/shared/types`.
- App-only code from `@/components/...`, `@/hooks/...` (maps to `apps/web/src`).

**Don’t**

- Long relative hops from an app into `packages/`: `../../../packages/ui/src/...` — use `@towerai/ui` instead.
- `import '@towerai/ui/styles'` **inside `apps/web`** — duplicates the global `@theme` stack; the app loads tokens via `apps/web/src/styles.css` (see skill **css-tailwind-theme-pipeline** and rule **27**).
- Import arbitrary internal files not covered by `exports` unless you are editing **inside** that package.

## `exports` and tooling

- **Node / Vite** resolve imports using **`exports`** in the target package’s `package.json`.
- **TypeScript** in `apps/web` also uses **path mappings** in `apps/web/tsconfig.json` for `@towerai/ui` → `packages/ui/src` so editors and `tsc` agree with the workspace layout.

If a new subpath is needed, add it to the package’s **`exports`** first, then import it.

## Tailwind + `@towerai/ui`

The **app** owns Tailwind compilation. `apps/web/src/styles.css` includes `@source` for `packages/ui/src/**/*.{ts,tsx}` so utilities for UI primitives are generated in one build. Do not create a second Tailwind entry in the app to “fix” missing classes.

## Adding or changing dependencies

1. Identify **which package** needs the dependency (the app vs `@towerai/ui` vs `@towerai/shared`).
2. Add to that package’s `package.json`.
3. Run `pnpm install` from the **repository root**.

## Related

- **Global CSS / `@towerai/ui/styles`:** skill **css-tailwind-theme-pipeline** in this module
- `packages/ui/components.json` — Untitled CLI aliases (`styles` → `@towerai/ui/styles`); app must not double-import (see **untitledui-docs** from the **untitledui** stack module)
