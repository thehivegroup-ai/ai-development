# Additional Modules Cleanup - Phase 2

**Date:** 2026-03-25  
**Status:** Ready for Execution  
**Based on:** cursor-files-deleted-2026-03-25.md analysis

---

## Duplicate Functionality Identified

### 1. Wrapper Skills (6 files) - REMOVE

These are thin wrappers that just redirect to actual skills:

**`std-solution/SKILL.md`** → Wrapper for `hermeneutic-solution/`
- Size: 228 lines
- Content: Just restates hermeneutic-solution in shorter form
- Action: ❌ DELETE

**`std-plan/SKILL.md`** → Wrapper for `teleological-planning/`
- Size: 462 lines
- Content: Restates teleological-planning
- Action: ❌ DELETE

**`std-clean-sweep/SKILL.md`** → Wrapper for `engineering-hygiene/`
- Size: 29 lines
- Content: Just points to engineering-hygiene
- Action: ❌ DELETE

**`std-design-review/SKILL.md`** → Wrapper for `heuristic-design-review/`
- Size: 175 lines
- Content: Simplified version of heuristic-design-review
- Action: ❌ DELETE

**`std-test-loop/SKILL.md`** → Wrapper for `engineering-hygiene/`
- Size: 22 lines
- Content: Just points to engineering-hygiene
- Action: ❌ DELETE

**`std-deploy-release/SKILL.md`** → Wrapper for `engineering-hygiene/`
- Size: 22 lines
- Content: Just points to engineering-hygiene
- Action: ❌ DELETE

**Rationale:** Users can invoke actual skills directly. Wrappers add confusion and maintenance burden.

---

### 2. Minimal Skill (1 file) - REMOVE

**`project-basics/SKILL.md`** → Covered by `engineering-hygiene/`
- Size: 18 lines
- Content: Very basic checklist
- All functionality covered by engineering-hygiene
- Action: ❌ DELETE

---

### 3. Overlapping Agents (4 files) - REMOVE

**`ctrl.base-verifier.md`** → Overlaps with `std-verifier`
- Size: 13 lines
- Content: Lightweight checks
- Overlap: `std-verifier` is more comprehensive
- Action: ❌ DELETE
- Replacement: Use `std-verifier` from enterprise-standards

**Cloud Release Managers (3 files):**

**`cloud.aws-release-manager.md`** → Not actively used
- Size: 13 lines
- Current usage: AWS deployments not active
- Action: ❌ DELETE (can restore if needed)

**`cloud.azure-release-manager.md`** → Not actively used
- Size: 24 lines
- Current usage: Azure deployments not active
- Action: ❌ DELETE (can restore if needed)

**`cloud.gcp-release-manager.md`** → Not actively used
- Size: 13 lines
- Current usage: GCP deployments not active
- Action: ❌ DELETE (can restore if needed)

**Note:** If cloud deployments become active, these can be restored from git history.

---

### 4. Orphaned Hook (1 file) - REMOVE

**`track-activity.sh`** → No consumer
- Purpose: Log commands for test detection
- Problem: References "stop hook" that doesn't exist
- No code reads `/tmp/ai-dev-hooks/` output
- Action: ❌ DELETE
- Also remove: Entry from `hooks.json`

---

### 5. Reference-Heavy Commands (1 file) - CONSOLIDATE

**`mapbox.runtime.patterns.md`** → Move to skill references
- Size: 726 lines, 15KB
- Content: Comprehensive GL JS runtime patterns
- Problem: Commands should be workflow-focused, not reference docs
- mapbox-standards skill already covers Studio workflows (848 lines)
- Action: 
  - ✅ Move content to `mapbox-standards/references/gl-js-runtime-patterns.md`
  - ✅ Reduce command to workflow-only (~50 lines)
  - ✅ Add parallel execution pattern

---

### 6. Component-Heavy Commands (2 files) - CONSOLIDATE

**`web.untitledui.build-form.md`** → Move examples to skill
- Size: 216 lines, 5.5KB
- Content: Extensive component examples
- Problem: Detailed examples should be in skill references
- Action:
  - ✅ Move component examples to `untitledui-docs/references/form-components.md`
  - ✅ Reduce command to workflow-only (~50 lines)
  - ✅ Add parallel execution pattern

**`web.untitledui.customize-theme.md`** → Move guide to skill
- Size: 220 lines, 6.7KB
- Content: Comprehensive theming guide
- Action:
  - ✅ Move theming guide to `untitledui-docs/references/theming-guide.md`
  - ✅ Reduce command to workflow-only (~50 lines)
  - ✅ Add parallel execution pattern

---

## Cleanup Execution Plan

### Phase 1: Delete Wrapper Skills (6 files)

```bash
rm modules/enterprise-standards/cursor/skills/std-solution/SKILL.md
rm modules/enterprise-standards/cursor/skills/std-plan/SKILL.md
rm modules/enterprise-standards/cursor/skills/std-clean-sweep/SKILL.md
rm modules/enterprise-standards/cursor/skills/std-design-review/SKILL.md
rm modules/enterprise-standards/cursor/skills/std-test-loop/SKILL.md
rm modules/enterprise-standards/cursor/skills/std-deploy-release/SKILL.md
```

**Also update:**
- `module.json` - Remove from provides.skills array

---

### Phase 2: Delete Minimal Skill (1 file)

```bash
rm modules/project-controls/base/cursor/skills/project-basics/SKILL.md
rmdir modules/project-controls/base/cursor/skills/project-basics/
```

**Also update:**
- `module.json` - Remove from provides.skills array

---

### Phase 3: Delete Overlapping Agents (4 files)

```bash
rm modules/project-controls/base/cursor/agents/ctrl.base-verifier.md
rm modules/stack-authorities/cloud/aws/cursor/agents/cloud.aws-release-manager.md
rm modules/stack-authorities/cloud/azure/cursor/agents/cloud.azure-release-manager.md
rm modules/stack-authorities/cloud/gcp/cursor/agents/cloud.gcp-release-manager.md
```

**Also update:**
- Each `module.json` - Remove from provides.agents array

---

### Phase 4: Remove Orphaned Hook (1 file + config)

```bash
rm modules/enterprise-standards/cursor/hooks/track-activity.sh
```

**Also update:**
- `hooks.json` - Remove `afterShellExecution` entry
- `hooks.claude.json` - Remove entry
- `hooks.vscode.json` - Remove entry

---

### Phase 5: Consolidate Command Content

For `mapbox.runtime.patterns.md`:
1. Create `modules/stack-authorities/mapping/mapbox/cursor/skills/mapbox-standards/references/`
2. Move GL JS patterns to `references/gl-js-runtime-patterns.md`
3. Reduce command to workflow-only (~50 lines)
4. Add parallel execution pattern

For `web.untitledui.build-form.md`:
1. Create `modules/stack-authorities/frontend/untitledui/cursor/skills/untitledui-docs/references/`
2. Move component examples to `references/form-components.md`
3. Reduce command to workflow-only (~50 lines)
4. Add parallel execution pattern
5. Add agent invocation

For `web.untitledui.customize-theme.md`:
1. Move theming guide to `references/theming-guide.md`
2. Reduce command to workflow-only (~50 lines)
3. Add parallel execution pattern

---

## Expected Impact

### Files Removed: 13 files
- 6 wrapper skills
- 1 minimal skill
- 4 overlapping agents
- 1 orphaned hook
- 1 hook config entry

### Files Consolidated: 3 files
- Move detailed content to skill references
- Reduce commands to workflow-only
- Add optimization patterns

### File Count Reduction
- Before Phase 2: 303 files
- After Phase 2: 290 files
- **Total reduction: 13 files (4.3%)**
- **Combined with Phase 1: 54 files total (15.7% from original 344)**

### Token Savings
- Reference content moved to skills: 15-25K tokens
- Wrapper skills removed: 10-15K tokens
- **Total estimated savings: 25-40K tokens**

---

## Risk Assessment

### Low Risk (Safe to Delete)

✅ Wrapper skills - Just point to actual skills  
✅ Minimal skill - All functionality in engineering-hygiene  
✅ Orphaned hook - No consumers  
✅ Cloud release managers - Not in active use

### Medium Risk (Test After)

⚠️ Content consolidation - Must verify references are accessible  
⚠️ Hook removal - Verify no hidden dependencies

### Mitigation

- Can restore any file from git history
- Test module installation after changes
- Verify all symlinks resolve correctly
- Check that skills can access new reference files

---

## Success Criteria

- [ ] 6 wrapper skills deleted
- [ ] 1 minimal skill deleted
- [ ] 4 overlapping agents deleted
- [ ] 1 orphaned hook deleted
- [ ] Hook configs updated (3 files)
- [ ] Module.json files updated (provides arrays cleaned)
- [ ] 3 commands consolidated with references created
- [ ] All symlinks still resolve
- [ ] Module installation still works
- [ ] File count reduced to ~290

---

## Next Steps

1. Execute Phase 1-4 (deletions)
2. Update module.json files to remove deleted items
3. Execute Phase 5 (content consolidation)
4. Test module structure integrity
5. Document cleanup results
