# Documentation Organization

This document explains the organization of .md files in this repository.

**Last Updated:** 2026-01-26

---

## Root Directory Documentation (8 files)

These are **core methodology and guide documents** that should remain in the root for easy discovery:

### Core Methodologies
- **`README.md`** - Main entry point and project overview
- **`HERMENEUTIC_CIRCLE.md`** - Hermeneutic circle methodology
- **`TELEOLOGICAL_PLANNING.md`** - Teleological (goal-driven) planning methodology

### Workflow & Composition Guides
- **`WORKFLOWS.md`** - Complete workflow guide (900+ lines)
- **`COMPOSITION.md`** - How to compose modules into projects (400+ lines)

### Legacy & Enhancement Documentation
- **`LEGACY_MAPPING.md`** - How legacy rules map to new structure
- **`LEGACY_SKILLS_INTEGRATION.md`** - How legacy skills were transformed
- **`ENHANCEMENTS.md`** - Summary of all enhancements

**Why in root:** These documents are frequently referenced and form the conceptual foundation.

---

## docs/functionality/ Directory (13 files)

These are **planning, completion, and implementation documents** organized by topic:

### Overall Completion Documentation
- **`COMPLETION-SUMMARY.md`** - Overall achievement summary (comprehensive)
- **`ACHIEVEMENT.md`** - Final report with statistics (by the numbers)

### Initiative Completion Reports (7 files)
- `COMPLETE-initiative-1-mcp-enhancements.md`
- `COMPLETE-initiative-2-visual-parity.md`
- `COMPLETE-initiative-3-stack-profiles.md`
- `COMPLETE-initiative-4-stack-authorities.md`
- `COMPLETE-initiative-6-agent-enhancements.md`
- `COMPLETE-initiative-7-skills-references.md`

### Planning & Implementation Docs
- `PLAN-next-phase-enhancements.md` - Original 7-initiative plan
- `PLAN-mcp-implementation.md` - MCP server planning
- `MCP-IMPLEMENTATION-COMPLETE.md` - MCP implementation summary
- `MCP-Git-Backed-Cursor-Environment-Setup.md` - MCP setup guide
- `requirements.md` - Requirements documentation

**Why in docs/functionality:** These are historical/completion records, not actively used for development.

---

## Module Documentation

Each module contains its own documentation:

### Module Structure
```
modules/[category]/[module-name]/
├── README.md                    # Module overview
├── module.json                  # Module manifest
└── cursor/
    ├── rules/*.mdc              # Rules files
    ├── commands/*.md            # Command files
    ├── agents/*.md              # Agent files
    └── skills/*/
        ├── SKILL.md             # Skill guide
        └── references/*.md      # Examples, anti-patterns, templates
```

---

## Answer: Are Root .md Files Needed for Function?

**YES - The 8 root .md files are essential:**

1. **`README.md`** - Required: Main entry point
2. **`HERMENEUTIC_CIRCLE.md`** - Essential methodology reference
3. **`TELEOLOGICAL_PLANNING.md`** - Essential methodology reference
4. **`WORKFLOWS.md`** - Essential: How to use the system
5. **`COMPOSITION.md`** - Essential: How to compose modules
6. **`LEGACY_MAPPING.md`** - Reference (not strictly required)
7. **`LEGACY_SKILLS_INTEGRATION.md`** - Reference (not strictly required)
8. **`ENHANCEMENTS.md`** - Historical record (not strictly required)

**NO - The docs/functionality/ files are NOT needed for function:**
- These are completion reports and planning documents
- They document what was built, not how to use it
- Useful for understanding history and achievement
- But system works without them

---

## Quick Reference

**To understand the system:** Read root .md files  
**To see what was built:** Read docs/functionality/ files  
**To use a specific module:** Read module README.md files  
**To learn a skill:** Read SKILL.md and references/ folder

---

## File Moves (2026-01-26)

Moved from root to `docs/functionality/`:
- `ACHIEVEMENT.md` (completion report)
- `COMPLETION-SUMMARY.md` (overall summary)

**Reason:** These are completion/planning documents, not active guides. Keeping root directory focused on essential methodology and usage documentation.

---

## Summary

**Root directory = Active guides and methodologies**  
**docs/functionality/ = Historical completion records**  
**modules/ = Per-module documentation**

This organization keeps the root clean while preserving all historical documentation.
