# Architecture Clarification: Source vs. Deployment

**Date:** 2026-03-26  
**Status:** Canonical Reference

---

## The Solution Architecture

### What IS the Solution

✅ **`modules/`** - Source of truth for all standards
- Rules, skills, agents, hooks defined here
- Version controlled, tagged, released
- What teams consume

✅ **`mcp-server/`** - Distribution engine
- Reads from `modules/`
- Handles discovery, selection, dependency resolution
- Installs to target projects

### What is NOT the Solution

❌ **`.cursor/` in ai-development repo** - Dogfooding installation
- Used to develop and test the standards themselves
- A reference implementation showing what installed output looks like
- NOT the distribution source
- NOT what users should copy

---

## Information Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  ai-development Repository                   │
│                                                              │
│  modules/ ←────────────────── SOURCE OF TRUTH               │
│  ├── enterprise-standards/    (Edit here)                   │
│  │   ├── rules/                                             │
│  │   ├── skills/                                            │
│  │   ├── agents/                                            │
│  │   └── hooks.d/                                           │
│  ├── stack-authorities/                                     │
│  └── project-controls/                                      │
│                                                              │
│  mcp-server/ ←────────────── DISTRIBUTION ENGINE           │
│  └── Reads modules/, installs to target                    │
│                                                              │
│  .cursor/ ←───────────────── DOGFOODING ONLY               │
│  └── Installation of modules/ for testing (NOT source)     │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ MCP Server
                         │ (reads modules/)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    User Project                              │
│                                                              │
│  .cursor/ ←──────────────── DEPLOYMENT TARGET              │
│  ├── rules/               (Installed from modules/)         │
│  ├── skills/              (Via MCP server)                  │
│  ├── agents/              (Based on selection)              │
│  ├── commands/            (With dependencies)               │
│  └── hooks/               (Conflict resolution)             │
│                                                              │
│  src/ ←──────────────────── USER'S ACTUAL CODE             │
│  └── Standards applied via .cursor/ configuration           │
└─────────────────────────────────────────────────────────────┘
```

---

## Why This Distinction Matters

### Problem That Was Occurring

1. Documentation said "copy from `modules/*/cursor/*`"
2. `.cursor/` exists in ai-development repo
3. Some docs said "copy `.cursor/*` to your project"
4. **Result:** Confusion about what's source vs. deployment target

### Corrected Understanding

| Directory | Role | Edit? | Distribute? |
|-----------|------|-------|-------------|
| `modules/` | **Source** | ✅ Yes | ✅ Yes (via MCP) |
| `mcp-server/` | **Distribution** | ✅ Yes | ✅ Runs from here |
| `.cursor/` (ai-dev repo) | **Dogfooding** | ⚠️ Test only | ❌ No |
| `.cursor/` (user project) | **Deployment** | ⚠️ Local customization | ❌ No |

---

## Documentation Updates Applied

### README.md
- ✅ Added architecture note
- ✅ Clarified modules/ and mcp-server/ are the solution
- ✅ Explained .cursor/ is dogfooding only

### mcp-server/README.md
- ✅ Added architecture overview
- ✅ Documented source → distribution → target flow
- ✅ Clarified installer reads from modules/

### docs/COMPOSITION.md
- ✅ Added critical architecture note
- ✅ Updated installation instructions
- ✅ Removed confusing cursor/ copy commands

### modules/README.md
- ✅ Created - Documents this is source of truth
- ✅ Explains module structure
- ✅ Installation via MCP only

### .cursor/README.md
- ✅ Created - Documents this is dogfooding
- ✅ Explains NOT to copy from here
- ✅ Directs to MCP server for installation

### docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md
- ✅ Created - Complete architectural explanation
- ✅ Mental models for users, maintainers, AI agents
- ✅ Decision record and rationale

---

## Code Comments Added

### scanner.ts
- ✅ Header comment explains reads from modules/ only
- ✅ Notes .cursor/ is for dogfooding

### multi-platform-installer.ts
- ✅ Header comment explains source → target flow
- ✅ Documents modules/ as source, target/.cursor/ as destination

---

## Operational Impact

### For Users
**Before:** "Should I copy .cursor/ or modules/cursor/?"  
**After:** "Use MCP server select_modules and install_environment"

### For Maintainers
**Before:** "Do I edit modules/ or .cursor/?"  
**After:** "Edit modules/ (source), sync to .cursor/ for testing"

### For MCP Server
**Before:** Ambiguous about source location  
**After:** Explicitly reads from modules/, installs to target/.cursor/

### For AI Agents
**Before:** Might reference .cursor/ as source  
**After:** Clear that modules/ is source, .cursor/ is deployment format

---

## Validation

### Check MCP Server Reads Correct Source

```typescript
// scanner.ts line 38-50: inferCategory reads relative to repoRoot
// Looks for 'modules/enterprise-standards', 'modules/stack-authorities'
// ✅ Correct - reads from modules/

// multi-platform-installer.ts: installModule reads from modulePath
// modulePath points to modules/<module-name>/
// ✅ Correct - reads from modules/
```

### Check Documentation Consistency

```bash
# All references to installation should point to MCP server
grep -r "cp.*\.cursor" docs/*.md
# Should find minimal results, mainly in migration/legacy contexts

# modules/ should be described as source
grep -r "source of truth" modules/ docs/
# Should find modules/README.md and docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md
```

---

## Key Takeaways

1. **`modules/` and `mcp-server/` ARE the solution** (source + distribution)
2. **`.cursor/` is the deployment target format** (where standards get installed)
3. **`.cursor/` in ai-development repo** is special - it's dogfooding, not distribution
4. **MCP server is the ONLY supported installation method** (no manual copying)
5. **All documentation updated** to reflect this architecture

The confusion is resolved. The architecture is now clearly documented at code, documentation, and conceptual levels.
