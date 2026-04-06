# Correct Modules Structure

**Date:** 2026-03-25  
**Status:** Design Document

---

## Target Structure

### Top Level

```
modules/
├── enterprise-standards/        # Category: enterprise-standard
│   ├── agents/                  # Agents (AGENTS.md format)
│   ├── skills/                  # Skills (Agent Skills standard)
│   ├── rules/                   # Rules (.mdc files for Cursor)
│   ├── hooks/                   # Hook scripts (.sh)
│   ├── hooks.json               # Hooks configuration
│   ├── instructions.md          # Base instructions
│   ├── module.json              # Module metadata
│   └── README.md                # Documentation
│
└── stack-authorities/           # Category: stack-authority
    ├── backend/                 # Backend authority group
    │   ├── agents/              # Shared backend agents
    │   ├── skills/              # Shared backend skills
    │   ├── rules/               # Shared backend rules
    │   ├── hooks/               # Shared backend hooks
    │   ├── java/                # Java-specific module
    │   ├── node-fastify/        # Node-specific module
    │   ├── python-fastapi/      # Python-specific module
    │   ├── instructions.md      # Backend base instructions
    │   └── module.json          # Backend category metadata
    │
    ├── frontend/                # Frontend authority group
    │   ├── agents/              # Shared frontend agents
    │   ├── skills/              # Shared frontend skills
    │   ├── rules/               # Shared frontend rules
    │   ├── hooks/               # Shared frontend hooks
    │   ├── react-tailwind/      # React-specific module
    │   ├── next-tailwind/       # Next.js-specific module
    │   ├── angular-tailwind/    # Angular-specific module
    │   ├── vue-tailwind/        # Vue-specific module
    │   ├── react-native/        # React Native-specific module
    │   ├── untitledui/          # Untitled UI-specific module
    │   ├── instructions.md      # Frontend base instructions
    │   └── module.json          # Frontend category metadata
    │
    ├── database/                # Database authority group
    │   ├── agents/              # Shared database agents
    │   ├── skills/              # Shared database skills
    │   ├── rules/               # Shared database rules
    │   ├── hooks/               # Shared database hooks
    │   ├── postgres/            # Postgres-specific module
    │   ├── mongodb/             # MongoDB-specific module
    │   ├── sqlserver/           # SQL Server-specific module
    │   ├── instructions.md      # Database base instructions
    │   └── module.json          # Database category metadata
    │
    ├── cloud/                   # Cloud authority group
    │   ├── agents/              # Shared cloud agents
    │   ├── skills/              # Shared cloud skills
    │   ├── rules/               # Shared cloud rules
    │   ├── hooks/               # Shared cloud hooks
    │   ├── aws/                 # AWS-specific module
    │   ├── azure/               # Azure-specific module
    │   ├── gcp/                 # GCP-specific module
    │   ├── instructions.md      # Cloud base instructions
    │   └── module.json          # Cloud category metadata
    │
    ├── authentication/          # Auth authority group
    │   ├── agents/              # Shared auth agents
    │   ├── skills/              # Shared auth skills
    │   ├── rules/               # Shared auth rules
    │   ├── hooks/               # Shared auth hooks
    │   ├── keycloak-bff/        # Keycloak-specific module
    │   ├── instructions.md      # Auth base instructions
    │   └── module.json          # Auth category metadata
    │
    ├── mapping/                 # Mapping authority group
    │   ├── agents/              # Shared mapping agents
    │   ├── skills/              # Shared mapping skills
    │   ├── rules/               # Shared mapping rules
    │   ├── hooks/               # Shared mapping hooks
    │   ├── mapbox/              # Mapbox-specific module
    │   ├── instructions.md      # Mapping base instructions
    │   └── module.json          # Mapping category metadata
    │
    └── testing/                 # Testing authority group
        ├── agents/              # Shared testing agents
        ├── skills/              # Shared testing skills
        ├── rules/               # Shared testing rules
        ├── hooks/               # Shared testing hooks
        ├── visual-parity/       # Visual parity-specific module
        ├── instructions.md      # Testing base instructions
        └── module.json          # Testing category metadata
```

---

## Key Principles

### 1. No `cursor/` Directories
- ❌ NO nested `cursor/` subdirectories
- ✅ Platform-agnostic content at module level
- ✅ MCP server handles platform conversion during installation

### 2. No Platform-Specific Files in Source
- ❌ NO `rules.claude/` or `rules.vscode/`
- ❌ NO `instructions.vscode.md` or `instructions.claude.md`
- ❌ NO `hooks.claude.json` or `hooks.vscode.json`
- ✅ MCP server generates these during installation

### 3. Hierarchical Organization
- Category groups (backend, frontend, database, cloud, etc.)
- Shared components at group level (agents, skills, rules, hooks)
- Specific implementations in subdirectories

### 4. Each Module Contains
- `agents/` - Agent definitions
- `skills/` - Skill definitions
- `rules/` - Rule files (.mdc for Cursor source)
- `hooks/` - Hook scripts (.sh)
- `hooks.json` - Hook configuration
- `instructions.md` - Base instructions
- `module.json` - Metadata
- `README.md` - Documentation

---

## What MCP Server Does

During installation, MCP server:

1. **Reads** source content from `agents/`, `skills/`, `rules/`, `hooks/`
2. **Converts** to target platform format:
   - Cursor: Uses as-is or minor adjustments
   - Claude: Converts frontmatter, event names
   - VS Code: Converts to `.agent.md` format, different tool names
3. **Generates** platform-specific files:
   - `rules.claude/*.md`
   - `rules.vscode/*.instructions.md`
   - `instructions.vscode.md`
   - `hooks.claude.json`
   - `hooks.vscode.json`
4. **Installs** to target directory:
   - Cursor: `.cursor/`
   - Claude: `.claude/`
   - VS Code: `.github/`

---

## Migration Required

**Current state:** Modules have nested `cursor/` directories  
**Target state:** Flat structure with no platform nesting  
**Action:** Move content from `cursor/` subdirectories up to module level

### Example: enterprise-standards

**Current (WRONG):**
```
modules/enterprise-standards/
├── cursor/              ❌ Nested platform directory
│   ├── agents/
│   ├── skills/
│   ├── rules/
│   └── hooks/
├── agents -> cursor/agents  ❌ Symlink to nested dir
└── module.json
```

**Target (CORRECT):**
```
modules/enterprise-standards/
├── agents/              ✅ Direct
├── skills/              ✅ Direct
├── rules/               ✅ Direct
├── hooks/               ✅ Direct
├── hooks.json           ✅ Direct
├── instructions.md      ✅ Direct
├── module.json          ✅ Direct
└── README.md            ✅ Direct
```

---

## Migration Plan

### Phase 1: Flatten enterprise-standards

```bash
cd modules/enterprise-standards/

# Remove symlinks
rm agents skills rules.cursor hooks.d hooks.json

# Move cursor/ content up
mv cursor/agents ./
mv cursor/skills ./
mv cursor/rules ./
mv cursor/hooks ./
mv cursor/hooks.json ./

# Remove empty cursor/ directory
rmdir cursor/

# Update module.json to remove "cursor/" prefixes
```

### Phase 2: Flatten all stack-authorities modules

For each module in stack-authorities:
```bash
cd modules/stack-authorities/[category]/[module]/

# Same pattern: remove symlinks, move content up, remove cursor/
```

### Phase 3: Create group-level shared components

For each stack-authorities group (backend, frontend, database, cloud, etc.):
```bash
cd modules/stack-authorities/[group]/

# Create shared directories if they have common components
mkdir -p agents/ skills/ rules/ hooks/
```

---

## Next Steps

1. **Execute flattening migration**
2. **Update module.json files** (remove "cursor/" prefixes from paths)
3. **Test MCP server** can read the new structure
4. **Verify** all modules install correctly

---

**This document defines the TARGET structure we need to achieve.**
