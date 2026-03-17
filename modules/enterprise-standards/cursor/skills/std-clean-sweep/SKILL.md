---
name: std-clean-sweep
version: 1.0.0
description: >
  Refactor and standardize changes to ensure clean, consistent output. Use after implementing 
  changes to clean up code, before handoff or review, or when ensuring consistency across 
  modified files.
  
  Trigger when user mentions: clean up, refactor, ready for review, standardize code, remove 
  debug code, fix inconsistencies, or says "I'm done" or before committing changes.
disable-model-invocation: true
---

# Standard Clean Sweep

Use this after changes to ensure clean, consistent output.

## Steps

1. Review changes for correctness and consistency.
2. Remove dead code, TODOs, and debug artifacts.
3. Validate formatting, naming, and structure.
4. Summarize what changed and any known gaps.

## Guidance

- Apply the `engineering-hygiene` skill.
- Use the `std-verifier` subagent ONLY as a final quality gate after cleanup is complete, not during the cleanup process.
