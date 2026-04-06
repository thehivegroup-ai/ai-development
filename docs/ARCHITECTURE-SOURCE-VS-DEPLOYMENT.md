# Architecture: Source vs. Deployment

**Date:** 2026-03-26  
**Status:** Canonical

---

## The Critical Distinction

### `.cursor/` = Deployment Target (This Workspace)

The `.cursor/` directory in **this repository** (`ai-development`) is:
- ✅ A working reference implementation
- ✅ Used to develop and test the standards themselves
- ✅ A snapshot showing what an installed environment looks like
- ❌ **NOT the source of truth**
- ❌ **NOT the distribution format**

**Purpose:** Help develop and dogfood the module system.

---

### `modules/` = Source of Truth (The Solution)

The `modules/` directory is:
- ✅ **The canonical source** for all rules, skills, agents, hooks
- ✅ What the MCP server distributes
- ✅ What teams install into their projects
- ✅ Version-controlled, tagged, released
- ✅ The system being built

**Purpose:** Package reusable standards for distribution.

---

### `mcp-server/` = Distribution Mechanism (The Solution)

The MCP server is:
- ✅ **The installation engine** that reads `modules/` and installs to target `.cursor/`
- ✅ Handles discovery, selection, dependency resolution, conflict detection
- ✅ Manages versions, updates, rollbacks
- ✅ The delivery system

**Purpose:** Automate module installation and management.

---

## Information Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    ai-development/ Repository                     │
│                                                                    │
│  modules/                          mcp-server/                    │
│  ├── enterprise-standards/   ───>  ├── Reads modules/            │
│  │   ├── rules/                    │   Scans structure           │
│  │   ├── skills/                   │   Validates manifests       │
│  │   ├── agents/                   ├── Installs to              │
│  │   └── hooks.d/                  │   target projects           │
│  ├── stack-authorities/            └── module.json               │
│  └── project-controls/                                           │
│                                                                    │
│  .cursor/ (in THIS repo)                                         │
│  └── Used for developing the standards themselves                │
│      Not the distribution source                                 │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ MCP Server Installs
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│                    user-project/ (Target)                         │
│                                                                    │
│  .cursor/                  ← DEPLOYMENT TARGET                   │
│  ├── rules/                ← Installed from modules/             │
│  ├── skills/               ← MCP server copies here              │
│  ├── agents/               ← Based on user selection             │
│  ├── commands/             ← With dependency resolution           │
│  └── hooks/                ← Conflict detection                  │
│                                                                    │
│  User's actual code lives here                                   │
│  Standards are applied via .cursor/ configuration                │
└──────────────────────────────────────────────────────────────────┘
```

---

## Why This Matters

### Problem: Confusion About Source of Truth

When documentation says "copy from `modules/enterprise-standards/cursor/*`" it creates confusion:
1. ❌ Implies `cursor/` subdirectory is the source
2. ❌ Suggests module structure requires `cursor/` for content
3. ❌ Makes `.cursor/` in this repo seem like the canonical source

### Reality: Two-Layer Architecture

**Layer 1: Module Source (modules/)**
```
modules/enterprise-standards/
├── module.json          # Manifest: what this provides
├── rules/               # Source: constraint definitions
├── skills/              # Source: process guidance
├── agents/              # Source: specialist perspectives
├── hooks.d/             # Source: automation scripts
├── hooks.json           # Source: hook configuration
└── cursor/              # Marker: helps MCP scanner find module
    └── README.md        # Documents this is a marker only
```

**Layer 2: Installed Environment (.cursor/ in target projects)**
```
user-project/.cursor/
├── rules/               # Installed: from module source
├── skills/              # Installed: from module source
├── agents/              # Installed: from module source
├── commands/            # Installed: from module source
└── hooks/               # Installed: from module hooks.d/
    ├── *.sh             # Scripts
    └── hooks.json       # Configuration
```

---

## MCP Server Behavior

### What MCP Server Does

1. **Reads** `modules/` directory structure
2. **Scans** `module.json` manifests
3. **Discovers** rules, skills, agents, commands, hooks
4. **Installs** to target project `.cursor/` directory
5. **Resolves** dependencies and conflicts
6. **Validates** installation completeness

### What MCP Server Does NOT Do

- ❌ Read from `ai-development/.cursor/`
- ❌ Distribute `ai-development/.cursor/` contents
- ❌ Use `.cursor/` as source material

### Source Paths for MCP

```typescript
// MCP server reads FROM:
modules/enterprise-standards/rules/*.mdc
modules/enterprise-standards/skills/*/SKILL.md
modules/enterprise-standards/agents/*.md
modules/enterprise-standards/hooks.d/*.sh
modules/enterprise-standards/hooks.json

// MCP server installs TO:
target-project/.cursor/rules/*.mdc
target-project/.cursor/skills/*/SKILL.md
target-project/.cursor/agents/*.md
target-project/.cursor/hooks/*.sh
target-project/.cursor/hooks.json
```

---

## Current State Analysis

### What `.cursor/` in ai-development Actually Is

**Purpose in this repo:**
1. Dogfooding - We use our own standards while developing them
2. Reference implementation - Shows what installed output looks like
3. Development workspace - Tests that rules/skills work in practice

**NOT:**
- The distribution source
- The canonical version
- What users should copy manually

### The Drift Problem

Because `.cursor/` and `modules/` coexist in this repo:
1. Rules exist in both places (dual maintenance)
2. Skills exist in both places (can drift)
3. Agents exist in both places (version confusion)
4. Documentation sometimes points to wrong location

**Solution:** Clear documentation that `modules/` is source, `.cursor/` is a dogfooding installation.

---

## Correct Mental Model

### For Users Installing Standards

"I want React + Fastify standards in my project"

**Correct flow:**
```
1. Use MCP server select_modules tool
2. Choose: enterprise-standards, react-tailwind, node-fastify
3. MCP reads from modules/ in ai-development repo
4. MCP installs to my-project/.cursor/
5. I use the standards via Cursor
```

**Incorrect flow:**
```
1. Copy ai-development/.cursor/* to my-project/.cursor/
2. (This copies a reference implementation, not selected modules)
```

---

### For Maintainers Updating Standards

"I want to update the security-review skill"

**Correct flow:**
```
1. Edit: modules/enterprise-standards/skills/security-review/SKILL.md
2. Test: Update .cursor/skills/security-review/SKILL.md (local test)
3. Commit: Only modules/ changes
4. Release: Tag new version
5. Users: Update via MCP server upgrade_environment tool
```

**Incorrect flow:**
```
1. Edit: .cursor/skills/security-review/SKILL.md
2. Commit: (This updates the dogfooding copy, not the source)
```

---

### For AI Agents Working in ai-development Repo

**When developing standards:**
- ✅ Edit files in `modules/`
- ✅ Update `.cursor/` to test changes locally
- ✅ Document that `.cursor/` is for dogfooding

**When installing standards to other projects:**
- ✅ Read from `modules/`
- ✅ Install to target `.cursor/`
- ❌ Never copy `ai-development/.cursor/` directly

---

## Documentation Principles

### Always Clarify Context

When writing installation docs:

❌ **Unclear:**
> "Copy the enterprise standards to your project"

✅ **Clear:**
> "Use the MCP server to install enterprise-standards module from `modules/enterprise-standards/` into your project's `.cursor/` directory"

---

### Module Documentation

**In `modules/*/README.md`:**
- Describe what the module provides
- Document module.json structure
- Explain rules, skills, agents, hooks
- Reference paths within `modules/*/`
- **Never** reference `ai-development/.cursor/`

**In `ai-development/.cursor/`:**
- Treat as installed environment for dogfooding
- Document that it's a test installation
- Note it may not match modules/ exactly during development

---

## Implementation Requirements

### For MCP Server

**MUST:**
1. Read source from `modules/` only
2. Install to target `.cursor/` only
3. Never reference `ai-development/.cursor/` in code or logs
4. Document that module source is in `modules/`

**Code locations to verify:**
- `mcp-server/src/modules/scanner.ts` - Scans `modules/`
- `mcp-server/src/modules/composer.ts` - Reads from `modulePath` (in modules/)
- `mcp-server/src/modules/multi-platform-installer.ts` - Installs to `targetDir/.cursor/`

---

### For Documentation

**MUST update:**
- [x] README.md - Clarify `.cursor/` is dogfooding
- [ ] COMPOSITION.md - Emphasize MCP server reads from modules/
- [ ] WORKFLOWS.md - Remove confusion about cursor/ subdirectories
- [ ] mcp-server/README.md - Add architecture section
- [ ] All example READMEs - Show MCP installation, not manual copy

**MUST add:**
- [x] This document (ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md)
- [ ] modules/README.md - "This is the source of truth"
- [ ] .cursor/README.md - "This is a dogfooding installation"

---

## Migration Path

### Phase 1: Documentation ✅ (Current)
- Document the distinction clearly
- Update installation instructions
- Add architecture clarity doc

### Phase 2: Code Verification
- Audit MCP server to ensure it only reads modules/
- Verify scanner/composer paths
- Test installation flow end-to-end

### Phase 3: Workspace Clarity
- Add `.cursor/README.md` explaining dogfooding
- Add `modules/README.md` marking as source
- Consider: `.cursor/` → `.cursor-dogfood/` to reduce confusion

---

## Decision Record

**Decision:** `modules/` is source, `.cursor/` is deployment target (even in this repo)

**Rationale:**
- Separates development (modules) from consumption (.cursor)
- MCP server is the installation mechanism
- Users shouldn't manually copy between repos
- Enables version management and dependency resolution

**Tradeoffs Accepted:**
- `.cursor/` in this repo must be kept in sync manually for dogfooding
- Potential for drift between modules/ and .cursor/ during development
- Requires clear documentation to prevent confusion

**Affects:**
- All installation documentation
- MCP server implementation
- Module development workflow
- User onboarding materials

---

## Key Takeaway

> **`modules/` and `mcp-server/` ARE the solution.**  
> **`.cursor/` is the deployment target format (even in this repo).**

This is not about "modules vs cursor subdirectories" - it's about **source repository vs. installed environment**.

The fact that this repo has **both** `.cursor/` (for dogfooding) and `modules/` (as source) created the confusion. The solution: **document clearly which is which**.
