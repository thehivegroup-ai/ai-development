---
name: css-tailwind-theme-pipeline
version: 1.0.0
description: >
  TowerAI web app global CSS architecture: one Tailwind v4 entry, app-owned theme tokens,
  @towerai/ui source scanning, Untitled UI primitives, and MUI coexistence without duplicate
  @theme blocks or conflicting body typography.

  Trigger when user mentions: global CSS, styles.css, theme.css, Tailwind entry, duplicate
  Tailwind, @towerai/ui/styles, globals.css, Untitled UI theme import, layout CSS import,
  CSS cascade, Rubik vs Inter, or refactoring design tokens.
---

# CSS / Tailwind / Theme Pipeline (TowerAI Web)

Use this skill for **global styling architecture** in `apps/web`. For component-level Tailwind patterns, see `react-tailwind-conventions`; for Untitled UI MCP/CLI discovery, see `untitledui-docs`.

## Goals

1. **One compiled Tailwind pipeline** — no second `@import 'tailwindcss'` in the app.
2. **One canonical `@theme` source for the app** — `apps/web/src/styles/theme.css` (Rubik, Gray Iron, nav tokens). Not a second import of `packages/ui` theme in the app bundle.
3. **Primitives still work** — `@source` includes `packages/ui/src/**/*.{ts,tsx}`.
4. **MUI** does not fight **Untitled/tokens** on font family.

## Canonical files

| Role | Path |
|------|------|
| Global CSS entry (only app import) | `apps/web/src/styles.css` |
| Design tokens (`@theme`, `@layer base`) | `apps/web/src/styles/theme.css` |
| Prose / typography plugin tweaks | `apps/web/src/styles/typography.css` |
| Root import of global CSS | `apps/web/src/routes/__root.tsx` → `../styles.css` |
| MUI theme (palette + typography for MUI components) | `apps/web/src/theme/welltowerTheme.ts` |
| UI package theme (library / docs / codegen alias) | `packages/ui/src/styles/theme.css` exported as `@towerai/ui/styles` |

## MUST / MUST NOT

**MUST**

- Add new `@plugin`, `@source`, `@utility`, or global base rules to **`apps/web/src/styles.css`** (or files it `@import`s, e.g. `theme.css`, `typography.css`).
- After changing tokens, run **`pnpm run build`** in `apps/web` and spot-check critical screens.
- Keep **`tailwindcss-react-aria-components`** in the root stylesheet for Untitled-style primitives under `packages/ui`.

**MUST NOT**

- Add `import '@/styles/…css'` on individual routes/layouts if that file pulls in **`tailwindcss`** again or re-imports the full theme.
- Add `import '@towerai/ui/styles'` to **`apps/web`** — it reintroduces a near-duplicate `@theme` and caused Inter/Rubik and utility drift.
- Point **TanStack Router devtools** at production bundles without a dev guard (keep `import.meta.env.DEV` if the panel is enabled).

## Untitled UI CLI / `components.json`

`packages/ui/components.json` sets `"styles": "@towerai/ui/styles"` for the Untitled toolchain. That path is correct for **the UI package** and documentation. For **this monorepo app**:

- If codegen adds `import '@towerai/ui/styles'` to `apps/web`, **delete that import** — the app already loads tokens via `styles.css` → `./styles/theme.css`.
- Prefer editing **`apps/web/src/styles/theme.css`** when changing brand/fonts/radius for the product.

## Syncing `packages/ui` vs `apps/web` theme

- **App** is the product source of truth for shipped CSS.
- **`packages/ui`** theme may lag; if you fix tokens in the app, consider porting the same variable changes to `packages/ui/src/styles/theme.css` so **Storybook**, **other apps**, or **README examples** that import `@towerai/ui/styles` stay consistent. This is documentation / library hygiene, not required for every app-only tweak.

## MUI alignment

`CssBaseline` + `ThemeProvider` apply MUI typography to the tree. Set **`typography.fontFamily`** to the **Rubik** stack to match `--font-body` / `html, body` in `styles.css`. Do not leave Inter in MUI while the rest of the app is Rubik.

## Quick verification

**On every save (Cursor):** `.cursor/hooks/css-theme-pipeline.sh` is registered in `.cursor/hooks.json` under **`afterFileEdit`**. It flags edits that add `@towerai/ui/styles` or a second `@import 'tailwindcss'` under `apps/web/src`.

**Full repo / CI:**

```bash
pnpm run check:css-pipeline
```

Equivalent: `bash .cursor/scripts/check-css-theme-pipeline.sh`

**Ad-hoc:**

```bash
rg "import '@towerai/ui/styles'" apps/web && echo "FAIL: remove app imports of package theme"
rg "@import 'tailwindcss'" apps/web/src --glob '*.css'
```

Expect **one** `@import 'tailwindcss'` in `apps/web` (only `src/styles.css`).

## Related rules

- `.cursor/rules/26-design-system.mdc` — semantic classes, `cx`, Rubik
- `.cursor/rules/27-css-tailwind-theme-pipeline.mdc` — short enforceable checklist
- `.cursor/rules/28-monorepo-packages.mdc` — skill **monorepo-packages** (`@towerai/*`, `workspace:*`, `exports`)
