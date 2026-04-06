# TowerAI project module

**Purpose:** Canonical **project overlay** for the TowerAI / Welltower DataCo application: monorepo conventions (`@towerai/*`), CSS/Tailwind single-entry pipeline, Okta OIDC, and Express API patterns.

**Install:** Add `projects/towerai` to the `projects` array in your MCP `install_environment` selection (together with enterprise + stacks). This layer merges **last**, so it can override or extend shared stack rules.

**Contents (under `cursor/`):**

- Rules: design system pointer, CSS pipeline, monorepo packages, Express API, Okta auth
- Skills: `css-tailwind-theme-pipeline`, `monorepo-packages`
- Hooks: `css-theme-pipeline.sh` (merged into the project `hooks.json`)
- Scripts: `check-css-theme-pipeline.sh` for local/CI checks

Edit here in `modules/projects/towerai/cursor/` and sync to consuming repos via the MCP install flow.
