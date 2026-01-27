# Copilot Workflow (How Work Proceeds)

This file defines the execution protocol for Copilot/agents.

## Cadence
1. **Read**: Contracts + relevant standards/skills.
2. **Plan**: Produce a concrete plan (files to touch, commands to run, artifacts to generate).
3. **Wait**: Stop until you get explicit approval for implementation.
4. **Execute**: Follow skills/scripts; keep scope tight.
5. **Verify**: Generate artifacts and a report.
6. **Stop**: Present results, wait for next instruction.

## Continuous Execution
Continuous execution applies **only after** approval. Continue until:
- blocked (tooling/environment)
- uncertain (needs clarification)
- complete (report + artifacts produced)
- new scope introduced

## Stop Conditions
- Missing information, blocked tooling, or ambiguous requirements.
- Evidence indicates mismatch but the correct behavior is unclear.
