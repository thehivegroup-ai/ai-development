# .cursor Directory - Dogfooding Installation

**⚠️ IMPORTANT: This is NOT the source of truth.**

---

## What This Directory Is

This `.cursor/` directory in the `ai-development` repository is:

✅ **A dogfooding installation** - We use our own standards while developing them  
✅ **A reference implementation** - Shows what an installed environment looks like  
✅ **A test workspace** - Validates that rules/skills/agents work in practice  

❌ **NOT the source** - Source is in `modules/`  
❌ **NOT for distribution** - Users should use MCP server, not copy this  
❌ **NOT the canonical version** - `modules/` is canonical  

---

## Architecture

```
ai-development/
├── modules/              ← SOURCE OF TRUTH (edit here)
│   ├── enterprise-standards/
│   ├── stack-authorities/
│   └── project-controls/
│
├── mcp-server/           ← DISTRIBUTION ENGINE (installs from modules/)
│
└── .cursor/              ← DOGFOODING (this directory)
    ├── rules/            ← Installed from modules/ for testing
    ├── skills/           ← Installed from modules/ for testing
    └── agents/           ← Installed from modules/ for testing
```

**Information Flow:**
```
modules/ (source) 
  → mcp-server (reads and installs)
    → user-project/.cursor/ (deployment target)

.cursor/ (this dir) is a special case:
  An installation of modules/ into THIS repo for dogfooding
```

---

## How to Use Standards in Your Project

### ✅ Correct: Use MCP Server

```typescript
// In your project, via Cursor MCP tools:
select_modules()          // Choose what you need
install_environment()     // Install to your-project/.cursor/
```

The MCP server:
- Reads from `modules/` in ai-development repo
- Installs to `your-project/.cursor/`
- Handles dependencies and conflicts

### ❌ Incorrect: Copy This Directory

```bash
# DON'T DO THIS:
cp -r ai-development/.cursor/* my-project/.cursor/

# This copies a dogfooding installation, not properly selected modules
# You'll get everything, unresolved conflicts, and no dependency tracking
```

---

## Maintenance of This Directory

### When Working on ai-development

**Updating standards:**
1. Edit source in `modules/enterprise-standards/`
2. Test by updating `.cursor/` in this repo (manual sync)
3. Verify standards work while developing
4. Commit only `modules/` changes (`.cursor/` is gitignored or committed separately)

**This creates drift between `modules/` and `.cursor/`** - that's expected during development.

**Before release:**
- Ensure `.cursor/` reflects latest `modules/` for testing
- Run MCP install to verify installation works
- Document any intentional differences

---

## Files in This Directory

Most files in `.cursor/` are **copied from `modules/`**:

| .cursor/ path | Source path | Relationship |
|---------------|-------------|--------------|
| `rules/00-std-foundation.mdc` | `modules/enterprise-standards/rules/00-*.mdc` | Installed copy |
| `skills/hermeneutic-solution/` | `modules/enterprise-standards/skills/hermeneutic-solution/` | Installed copy |
| `agents/std-planner.md` | `modules/enterprise-standards/agents/std-planner.md` | Installed copy |

**During development, these can drift.** That's OK - resync before release.

---

## For New Contributors

**If you want to improve a rule, skill, or agent:**
1. Edit the source in `modules/`
2. Test changes by updating `.cursor/` manually
3. Commit changes to `modules/` only
4. `.cursor/` changes are for local testing

**If you see something in `.cursor/` that should be in `modules/`:**
1. Check if it exists in `modules/` first
2. If not, add it to appropriate `modules/` location
3. Update `.cursor/` to match

---

## Key Principle

> **`modules/` = what we ship**  
> **`.cursor/` = how we test what we ship**

See `docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md` for complete explanation of the source vs. deployment distinction.
