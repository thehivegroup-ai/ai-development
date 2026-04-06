---
name: std-test-loop
description: Run tests, fix failures, and re-verify until all tests pass. Use when tests are failing and need systematic fixing, or when iterating through a test-fix-verify cycle.
disable-model-invocation: true
---

# Standard Test Loop

Use this to run tests, fix failures, and re-verify.

## Steps

1. Identify the right test scope (unit, integration, e2e).
2. Run tests and capture results.
3. Fix failures with minimal changes.
4. Re-run until passing, then summarize.

## Guidance

- Apply the `engineering-hygiene` skill.
- Delegate to `std-debugger` for stubborn failures.
