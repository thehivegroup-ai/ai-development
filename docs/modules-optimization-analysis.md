# Modules Structure Optimization Analysis

**Date:** 2026-03-25  
**Purpose:** Clean up modules structure applying cursor-optimization learnings

---

## Issues Identified

### 1. **Accidental Submodules** (Critical)

**Problem:** `docs`, `rules.claude`, `rules.vscode`, and `cursor` subdirectories were treated as independent modules by migration script.

**Evidence:**
- `modules/enterprise-standards/docs/module.json` exists
- `modules/enterprise-standards/rules.claude/module.json` exists
- `modules/enterprise-standards/rules.vscode/module.json` exists
- `modules/enterprise-standards/cursor/module.json` exists

**Impact:**
- 4 spurious modules per parent module
- Confusing module hierarchy
- `list_modules()` returns incorrect count
- Installation attempts on non-modules fail

**Solution:**
- Delete all nested `module.json` files in subdirectories
- Only keep top-level `module.json` per module

---

### 2. **README Duplication** (31 instances)

**Problem:** Migration created `README-NEW.md` alongside existing `README.md`.

**Evidence:**
```bash
$ find modules -name "README-NEW.md" | wc -l
31
```

**Impact:**
- Double maintenance burden
- Unclear which is canonical
- User confusion
- 31 extra files (~20KB redundant)

**Solution:**
- Review each pair
- If `README-NEW.md` is better: replace `README.md`
- If `README.md` is better: delete `README-NEW.md`
- Standardize on single README per module

---

### 3. **Instructions File Proliferation**

**Problem:** Nested submodule directories have redundant instruction files.

**Evidence:**
- `modules/enterprise-standards/rules.claude/instructions.md`
- `modules/enterprise-standards/rules.claude/instructions.vscode.md`
- Same pattern in `docs/`, `rules.vscode/`, `cursor/`

**Impact:**
- 4x instruction file duplication per module
- Unclear ownership
- Inconsistent updates

**Solution:**
- Keep only root-level instruction files:
  - `instructions.md` (platform-agnostic)
  - `instructions.vscode.md` (VS Code-specific)
- Delete all nested instruction files

---

### 4. **Empty Platform Directories**

**Problem:** `rules.claude/rules.claude/` and `rules.vscode/rules.vscode/` subdirectories are empty.

**Evidence:**
```
modules/enterprise-standards/rules.claude/
├── rules.claude/    # EMPTY
└── rules.vscode/    # EMPTY
```

**Impact:**
- Confusing structure
- No functional purpose

**Solution:**
- Delete empty nested directories
- Platform-specific rules should live in `rules.cursor/`, `rules.claude/`, `rules.vscode/` directly

---

### 5. **Symlink Chains**

**Problem:** Symlinks point to `cursor/` subdirectory, creating unnecessary indirection.

**Current:**
```
agents -> cursor/agents
skills -> cursor/skills
rules.cursor -> cursor/rules
```

**Impact:**
- Extra indirection
- Breaks if `cursor/` is removed
- Confusing for maintainers

**Solution:**
- Direct symlinks or actual directories
- No chaining through intermediate `cursor/` folder

---

### 6. **Missing Optimization Patterns**

**Problem:** Modules don't apply cursor-optimization learnings from the doc.

**Missing:**
- No parallel execution guidance
- No context offloading patterns
- No subagent invocation strategies

**Applies to:**
- Skills with exploration/review workflows
- Commands with multi-step processes
- Instructions that describe workflows

**Solution:**
- Add "Parallel Execution" sections to applicable files
- Add "Token Optimization: Use Subagent" guidance where appropriate
- Reference parent agents for context offloading

---

### 7. **Inconsistent Platform Handling**

**Current Structure Problems:**

```
enterprise-standards/
├── cursor/                    # Original Cursor artifacts
│   ├── rules/                # Cursor rules (.mdc)
│   ├── agents/               # Agents in AGENTS.md format
│   ├── skills/               # Skills in SKILL.md format
│   └── hooks.json
├── rules.claude/             # SHOULD BE rules, but is submodule
│   └── module.json           # ❌ Spurious
├── rules.vscode/             # SHOULD BE rules, but is submodule
│   └── module.json           # ❌ Spurious
├── docs/                     # SHOULD BE docs, but is submodule
│   └── module.json           # ❌ Spurious
└── module.json               # ✅ Root module metadata
```

**Desired Structure:**

```
enterprise-standards/
├── module.json               # Platform metadata (only one)
├── README.md                 # User-facing documentation
├── instructions.md           # Platform-agnostic base
├── instructions.vscode.md    # VS Code-specific
├── agents/                   # Platform-agnostic agents (AGENTS.md format)
│   └── std-planner.md
├── skills/                   # Platform-agnostic skills (SKILL.md format)
│   └── hermeneutic-solution/
├── hooks/                    # Hook scripts (portable)
│   └── git-guard.sh
├── hooks.cursor.json         # Cursor hooks config
├── hooks.claude.json         # Claude hooks config
├── hooks.vscode.json         # VS Code hooks config
├── rules.cursor/             # Cursor-specific rules (.mdc)
│   └── 00-std-foundation.mdc
├── rules.claude/             # Claude-specific rules (.md) - TO BE GENERATED
├── rules.vscode/             # VS Code-specific rules - TO BE GENERATED
└── docs/                     # Module documentation
    └── security/
```

**Key Changes:**
- Remove `cursor/` parent directory (flatten)
- Delete spurious `module.json` files in subdirectories
- Rename `hooks.json` → `hooks.cursor.json`
- Move `cursor/agents/` → `agents/`
- Move `cursor/skills/` → `skills/`
- Move `cursor/hooks/` → `hooks/`
- Move `cursor/rules/` → `rules.cursor/`

---

## Optimization Opportunities

### A. Parallel Execution Patterns

**Apply to Skills:**
- `engineering-hygiene/SKILL.md` - Multi-phase quality gates
- `heuristic-design-review/SKILL.md` - Parallel UI evaluations
- `security-review/SKILL.md` - Parallel security checks
- Any skill with "exploration" or "review" in workflow

**Template:**
```markdown
## Parallel Execution Strategy

Phase 1: Discovery (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: [Description]                        │
│ Task B: [Description]                        │
│ Task C: [Description]                        │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Analysis (SEQUENTIAL)
• [Task that needs Phase 1 results]

**Time savings:** 30-50% faster
```

### B. Context Offloading (Token Optimization)

**Apply to Large Exploration Skills:**
- `engineering-hygiene/SKILL.md`
- `heuristic-design-review/SKILL.md`
- `security-review/SKILL.md`

**Template:**
```markdown
## Token Optimization: Use Subagent

Launch [agent-name] agent:
"[Task description with specifics]"

Token savings: 40-60K tokens

When to use subagent:
- ✅ Large codebase exploration
- ✅ Multi-file analysis
- ✅ Comprehensive audit

When to keep in main conversation:
- ❌ Single file review
- ❌ Quick validation check
```

### C. Agent Invocations

**Update Commands to Reference Agents:**

Commands that should invoke subagents:
- Any command with "review" in name
- Commands with multi-phase workflows
- Commands that generate comprehensive artifacts

**Pattern:**
```markdown
### Optional: Quality Review

Invoke `[agent-name]` agent:
"Review [artifact] for [standards] compliance..."
```

---

## Cleanup Plan

### Phase 1: Remove Spurious Artifacts (High Priority)

**Delete spurious module.json files:**
```bash
# Find all nested module.json files (not at module root)
find modules/*/cursor/ -name "module.json" -delete
find modules/*/docs/ -name "module.json" -delete
find modules/*/rules.claude/ -name "module.json" -delete
find modules/*/rules.vscode/ -name "module.json" -delete
```

**Count:** ~60-80 files (4 per module × 15-20 modules)

### Phase 2: Consolidate READMEs

**For each module:**
1. Compare `README.md` vs `README-NEW.md`
2. If NEW is better: `mv README-NEW.md README.md`
3. If OLD is better: `rm README-NEW.md`

**Count:** 31 files to process

### Phase 3: Remove Redundant Instructions

**Delete nested instruction files:**
```bash
find modules/*/cursor/ -name "instructions*.md" -delete
find modules/*/docs/ -name "instructions*.md" -delete
find modules/*/rules.claude/ -name "instructions*.md" -delete
find modules/*/rules.vscode/ -name "instructions*.md" -delete
```

**Keep only root-level:**
- `modules/*/instructions.md`
- `modules/*/instructions.vscode.md`

**Count:** ~60-80 files

### Phase 4: Clean Empty Directories

**Remove empty nested platform directories:**
```bash
find modules/*/rules.claude/rules.claude -type d -empty -delete
find modules/*/rules.claude/rules.vscode -type d -empty -delete
find modules/*/rules.vscode/rules.claude -type d -empty -delete
find modules/*/rules.vscode/rules.vscode -type d -empty -delete
```

### Phase 5: Flatten Structure (Refactor)

**For enterprise-standards (example):**
1. Move `cursor/agents/` → `agents/`
2. Move `cursor/skills/` → `skills/`
3. Move `cursor/hooks/` → `hooks/`
4. Move `cursor/rules/` → `rules.cursor/`
5. Rename `hooks.json` → `hooks.cursor.json`
6. Update symlinks (if any)
7. Delete empty `cursor/` directory

**Repeat for all modules with nested `cursor/` structure.**

### Phase 6: Apply Optimization Patterns

**Add to Skills with workflows:**
1. Identify skills with exploration/review phases
2. Add "Parallel Execution Strategy" section
3. Add "Token Optimization: Use Subagent" section (if applicable)
4. Reference parent module agents

**Add to Commands:**
1. Identify commands with multi-step workflows
2. Add "Parallel Execution" section
3. Add optional agent invocations

---

## File Count Reduction

**Current:** ~344 files

**Estimated After Cleanup:**
- Remove spurious module.json: -60 files
- Consolidate READMEs: -31 files
- Remove redundant instructions: -60 files
- Remove empty directories: -20 files

**Projected:** ~173 files (50% reduction)

**Token Savings:** 80-120K tokens (fewer files to index/search)

---

## Implementation Sequence

1. **Delete spurious module.json files** (automated)
2. **Consolidate READMEs** (semi-automated, needs review)
3. **Remove redundant instructions** (automated)
4. **Clean empty directories** (automated)
5. **Flatten structure** (manual per module, test thoroughly)
6. **Apply optimization patterns** (manual, requires content review)

---

## Risk Mitigation

**Before any deletion:**
- Run `git status` to verify clean state
- Verify no uncommitted work
- Test one module first (enterprise-standards)
- Can revert with `git checkout -- modules/`

**After changes:**
- Verify module installation still works
- Test MCP server can read modules
- Check symlinks resolve correctly
- Validate no broken references

---

## Success Criteria

- [ ] No spurious `module.json` files in subdirectories
- [ ] Single README per module
- [ ] Instructions only at module root
- [ ] No empty directories
- [ ] All modules have parallel execution guidance (where applicable)
- [ ] All exploration skills reference subagents
- [ ] File count reduced by ~40-50%
- [ ] Module installation works on all platforms

---

## Next Steps

1. Create cleanup script or execute manually
2. Test on `enterprise-standards` first
3. Apply to all modules
4. Update MCP installer to expect new structure
5. Document new canonical structure
