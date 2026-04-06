# TowerAI project module

**Purpose:** Canonical **project overlay** for the TowerAI / Welltower DataCo application: monorepo conventions (`@towerai/*`) and the CSS/Tailwind single-entry pipeline. **Number-prefixed rules (`NN-*.mdc`) and `std-*` skills live in enterprise and stack modules**—do not duplicate them under `modules/projects/`.

**Install:** Add `projects/towerai` to the `projects` array in your MCP `install_environment` selection (together with enterprise + stacks). This layer merges **last** for skills and hooks.

**Contents (under `cursor/`):**

- Skills: TowerAI-only — see `module.json` → `provides.skills`
- Hooks: `css-theme-pipeline.sh` (merged into the project `hooks.json`)
- Scripts: `check-css-theme-pipeline.sh` for local/CI checks

Edit here in `modules/projects/towerai/cursor/` and sync to consuming repos via the MCP install flow.

**Pushing skill edits from an app project:** use MCP **`push_module_updates`** with **`scope`: `"skills"`** and **`skillsTargetModuleId`: `"projects/towerai"`** so everything under that app’s `.cursor/skills/` is written to **`modules/projects/towerai/cursor/skills/`**, and **`module.json`** **`provides.skills`** is rewritten to list each top-level skill folder (so `list_modules` and installs stay accurate).
