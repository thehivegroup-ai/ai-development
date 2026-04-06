# Module Duplication Strategy & Stack Authorities Update Plan

## Issue Identified ✅

**Problem:** After restructuring, we have duplicates:
- `cursor/agents/` AND `agents/` (duplicated: 76K)
- `cursor/rules/` AND `rules.cursor/` (duplicated: 68K)
- `cursor/hooks/` AND `hooks.d/` (duplicated)
- `cursor/skills/` AND `skills/` (symlink - not duplicate)

**Total Duplication:** ~144K per module that's been migrated

---

## Solution: Two-Phase Approach

### Phase 1: Keep `cursor/` for Backward Compatibility (Recommended)

**Rationale:**
- Existing Cursor projects may reference `modules/.../cursor/`
- MCP server currently installs from `cursor/` subdirectory
- Allows gradual migration without breaking changes
- Can deprecate later once all systems use new structure

**Structure:**
```
enterprise-standards/
├── cursor/                    # ⚠️ DEPRECATED - kept for backward compat
│   ├── agents/
│   ├── skills/
│   ├── rules/
│   └── hooks/
├── agents/                    # ✅ NEW - platform-agnostic source
├── skills -> cursor/skills    # ✅ SYMLINK - point to source
├── rules.cursor/              # ✅ NEW - Cursor-specific
├── rules.claude/              # ✅ NEW - Claude-specific
├── rules.vscode/              # ✅ NEW - VS Code-specific
└── hooks.d/                   # ✅ NEW - hook scripts
```

**Marking as Deprecated:**
1. Add `DEPRECATED.md` in `cursor/` directory
2. Update MCP server to use new structure
3. Keep `cursor/` as read-only reference
4. Remove in next major version

### Phase 2: Remove `cursor/` (Future)

After all systems migrate:
1. Delete `cursor/` subdirectories
2. Update any hardcoded references
3. Bump module versions to 2.0.0

---

## Recommended Approach: Optimize Current Structure

**Better solution than Phase 1:**

Make `cursor/` the source of truth, point everything to it:

```
enterprise-standards/
├── cursor/                          # 📦 SOURCE OF TRUTH
│   ├── agents/                      # ✅ Agents (AGENTS.md format)
│   ├── skills/                      # ✅ Skills (portable)
│   ├── rules/                       # ✅ Cursor rules (.mdc)
│   └── hooks/                       # ✅ Hook scripts
│
├── agents -> cursor/agents          # 🔗 SYMLINK
├── skills -> cursor/skills          # 🔗 SYMLINK
├── rules.cursor -> cursor/rules     # 🔗 SYMLINK
├── hooks.d -> cursor/hooks          # 🔗 SYMLINK
│
├── rules.claude/                    # ✅ Claude-specific (generated)
├── rules.vscode/                    # ✅ VS Code-specific (generated)
├── hooks.json -> cursor/hooks.json  # 🔗 SYMLINK
├── hooks.claude.json                # ✅ Claude hooks config
├── hooks.vscode.json                # ✅ VS Code hooks config
│
├── instructions.md                  # ✅ Base instructions
├── instructions.vscode.md           # ✅ VS Code instructions
└── module.json                      # ✅ Metadata
```

**Benefits:**
- Single source of truth (`cursor/`)
- No duplication via symlinks
- Backward compatible (Cursor still works)
- New platform structure available
- Clear migration path

---

## Stack Authorities Update Plan

### Status: NOT YET MIGRATED

**Current structure:**
```
modules/stack-authorities/
├── frontend/
│   ├── react-native/
│   │   └── cursor/         # ❌ Cursor-only
│   ├── react-tailwind/
│   │   └── cursor/         # ❌ Cursor-only
│   └── ...
├── backend/
├── database/
└── ...
```

**Needs:**
1. Run migration script on each stack authority module
2. Generate platform-specific configurations
3. Create module.json for each
4. Generate platform instructions

### Migration Command

```bash
# Migrate all stack authorities
for module in modules/stack-authorities/*/*; do
  if [ -d "$module/cursor" ]; then
    echo "Migrating: $module"
    ./scripts/migrate-module-structure.ts "$module"
  fi
done
```

---

## Updated Migration Strategy

### For enterprise-standards (Already Migrated)

**Fix duplication by using symlinks:**

```bash
cd modules/enterprise-standards

# Remove duplicates
rm -rf agents/ rules.cursor/ hooks.d/

# Create symlinks to cursor/ (source of truth)
ln -s cursor/agents agents
ln -s cursor/rules rules.cursor
ln -s cursor/hooks hooks.d

# Hooks config
rm hooks.json
ln -s cursor/hooks.json hooks.json
```

**Result:** No duplication, backward compatible, new structure works

### For stack-authorities (Not Yet Migrated)

**Option 1: Use symlinks from the start**
```bash
# In migration script, create symlinks instead of copying
ln -s cursor/agents agents
ln -s cursor/rules rules.cursor
ln -s cursor/hooks hooks.d
```

**Option 2: Keep cursor/ as deprecated, copy to new locations**
- Copy agents, rules, hooks to new locations
- Mark cursor/ as deprecated
- Plan removal in v2.0.0

---

## Recommended Actions

### Immediate (Fix enterprise-standards duplication)

1. **Replace copies with symlinks:**
   ```bash
   cd modules/enterprise-standards
   rm -rf agents/ rules.cursor/ hooks.d/ hooks.json
   ln -s cursor/agents agents
   ln -s cursor/rules rules.cursor  
   ln -s cursor/hooks hooks.d
   ln -s cursor/hooks.json hooks.json
   ```

2. **Update module.json references:**
   ```json
   "provides": {
     "agents": ["cursor/agents/*.md"],  // Point to source
     "skills": ["cursor/skills/*/"],    // Already symlinked
     "rules": ["cursor/rules/*.mdc"],   // Point to source
     "hooks": "cursor/hooks.json"       // Point to source
   }
   ```

3. **Document structure in README:**
   - `cursor/` is source of truth
   - Other directories are symlinks or generated
   - Platform-specific files (rules.claude, rules.vscode) are generated

### Short-term (Migrate stack-authorities)

4. **Update migration script to use symlinks:**
   ```typescript
   // In migrate-module-structure.ts
   // Instead of copying, create symlinks
   await fs.symlink('cursor/agents', 'agents');
   await fs.symlink('cursor/rules', 'rules.cursor');
   await fs.symlink('cursor/hooks', 'hooks.d');
   ```

5. **Run migration on all stack authorities:**
   ```bash
   ./scripts/migrate-module-structure.ts --all
   ```

### Medium-term (MCP server updates)

6. **Update MCP installer to handle symlinks:**
   - Detect if source is symlink
   - Follow symlink to actual content
   - Install from source location

7. **Add validation:**
   - Check for duplicates
   - Warn if cursor/ and new structure don't match
   - Verify symlinks resolve correctly

---

## Decision: Which Approach?

### Recommended: **Symlink Approach**

**Why:**
✅ No duplication (saves disk space)
✅ Single source of truth (cursor/)
✅ Backward compatible
✅ Clear migration path
✅ Easy to understand
✅ Works with git

**Structure:**
```
module/
├── cursor/          # 📦 Source of truth (agents, skills, rules, hooks)
├── agents/          # 🔗 → cursor/agents
├── skills/          # 🔗 → cursor/skills  
├── rules.cursor/    # 🔗 → cursor/rules
├── hooks.d/         # 🔗 → cursor/hooks
├── hooks.json       # 🔗 → cursor/hooks.json
├── rules.claude/    # ✅ Generated (Claude-specific)
├── rules.vscode/    # ✅ Generated (VS Code-specific)
├── hooks.claude.json    # ✅ Generated
├── hooks.vscode.json    # ✅ Generated
├── instructions.md      # ✅ Base (generated from rules)
├── instructions.vscode.md  # ✅ VS Code format
└── module.json          # ✅ Metadata
```

**What's Duplicated:** ONLY platform-specific adaptations (instructions, hooks configs, rules formats)

**What's NOT Duplicated:** Core content (agents, skills, hook scripts, base rules)

---

## Implementation Steps

### Step 1: Fix enterprise-standards (NOW)

```bash
#!/bin/bash
cd modules/enterprise-standards

# Remove duplicate directories
rm -rf agents/ rules.cursor/ hooks.d/ hooks.json

# Create symlinks to source (cursor/)
ln -s cursor/agents agents
ln -s cursor/rules rules.cursor
ln -s cursor/hooks hooks.d
ln -s cursor/hooks.json hooks.json

echo "✅ Duplication fixed - using symlinks"
```

### Step 2: Update migration script (NOW)

Modify `scripts/migrate-module-structure.ts`:

```typescript
// Instead of copying agents
await fs.symlink('cursor/agents', path.join(modulePath, 'agents'));

// Instead of copying rules
await fs.symlink('cursor/rules', path.join(modulePath, 'rules.cursor'));

// Instead of copying hooks
await fs.symlink('cursor/hooks', path.join(modulePath, 'hooks.d'));
await fs.symlink('cursor/hooks.json', path.join(modulePath, 'hooks.json'));

// Skills already handled correctly
await fs.symlink('cursor/skills', path.join(modulePath, 'skills'));
```

### Step 3: Migrate stack-authorities (AFTER script update)

```bash
# Test on one module
./scripts/migrate-module-structure.ts modules/stack-authorities/frontend/react-tailwind

# Verify no duplication
du -sh modules/stack-authorities/frontend/react-tailwind/*

# If good, migrate all
./scripts/migrate-module-structure.ts --all
```

---

## Summary

**Current Problem:**
- ✅ Identified: Duplication in enterprise-standards (agents, rules, hooks)
- ✅ Identified: stack-authorities not yet migrated

**Solution:**
- 🔧 Fix: Use symlinks instead of copies (cursor/ is source)
- 🔧 Update: Migration script to create symlinks
- 📋 Todo: Migrate stack-authorities modules

**Result:**
- ✅ No duplication of core content
- ✅ Backward compatible (cursor/ still works)
- ✅ Platform-agnostic structure available
- ✅ Clear path forward
