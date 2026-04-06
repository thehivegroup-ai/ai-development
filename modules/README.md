# Modules Directory - Source of Truth

This directory contains the **canonical source** for all AI development standards (rules, skills, agents, hooks, commands).

## Critical Architecture Note

**`modules/` IS the source of truth.**

- The MCP server reads FROM `modules/`
- Users install TO their project's `.cursor/`
- The `.cursor/` directory in **this repository** is for dogfooding, NOT distribution

See `../docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md` for complete architectural explanation.

---

## Structure

Each module contains:
```
modules/<category>/<module-name>/
├── module.json          # Manifest: what this provides
├── cursor/              # Optional: Cursor install layout (preferred for new modules)
│   ├── rules/           # Constraint definitions
│   ├── skills/
│   ├── agents/
│   ├── commands/
│   ├── hooks/
│   ├── scripts/
│   └── hooks.json
├── rules/               # Alternative: flat layout (legacy) — same leaf names as under cursor/
├── skills/
├── agents/
├── commands/
├── hooks.d/             # Automation scripts (may map to .cursor/hooks/ on install)
├── hooks.json
└── README.md            # Module documentation
```

`projects/<name>/` follows the same pattern; keep TowerAI-specific (or other product-specific) assets there instead of mixing them into stack-authorities.

---

## Categories

### `enterprise-standards/`
Technology-agnostic workflow standards (solution framing, planning, quality gates, security, evidence-based claims)

### `stack-authorities/`
Technology-specific standards organized by:
- `frontend/` - React, Next.js, Angular, Vue.js
- `backend/` - Node/Fastify, Java, Python/FastAPI
- `database/` - PostgreSQL, SQL Server, MongoDB
- `cloud/` - AWS, GCP, Azure
- `testing/` - Visual parity, E2E

### `project-controls/`
Cross-cutting controls:
- `base/` - Baseline quality controls
- `regulated/` - Compliance controls (HIPAA, GDPR)

### `projects/`
**Named project overlays** — rules, skills, hooks, agents, and commands that apply to a specific application or product (for example TowerAI). These modules use category `named-project`, are discovered like other modules (via `module.json`), and install with **`projects` in the MCP selection**, merged **after** stack modules so they can extend or override shared behavior.

Example: `projects/towerai/` holds TowerAI-specific skills and hooks (e.g. CSS pipeline, monorepo packages); numbered rules and `std-*` skills come from enterprise/stack modules, not from `projects/`.

---

## Installation

**Use the MCP server** (don't manually copy):

```bash
# Via MCP tools in Cursor
select_modules    # Interactive selection
install_environment  # Automated installation to target/.cursor/
```

The MCP server:
1. Reads from `modules/` in this repo (source)
2. Resolves dependencies
3. Handles conflicts
4. Installs to `your-project/.cursor/` (target)

**Never manually copy** `.cursor/` from this repo to other projects - that copies the dogfooding installation, not a properly selected/composed environment.

---

## Maintenance

### Updating a Module

1. Edit source files in `modules/<module-name>/`
2. Update `module.json` version if needed
3. Test locally by updating `.cursor/` in this repo (dogfooding)
4. Commit changes to `modules/`
5. Tag new version
6. Users update via `upgrade_environment` MCP tool

### Adding a New Module

1. Create directory under appropriate category
2. Add `module.json` manifest
3. Create rules/, skills/, agents/, etc.
4. Add to `module.json` provides section
5. Test via MCP server installation
6. Document in category README

---

## Key Principle

> **Edit in `modules/`, test in `.cursor/`, distribute via MCP server.**

This separation enables:
- Version management
- Dependency resolution  
- Conflict detection
- Automated updates
- Proper distribution

See MCP server documentation for installation workflow.
