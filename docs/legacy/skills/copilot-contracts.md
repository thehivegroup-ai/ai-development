# Copilot Contracts (Non-Negotiable)

These are the hard rules. If anything conflicts with these, **these win**.

## Approval Gates
- Present a clear plan and **wait for explicit user approval** before making implementation changes.
- Do not mark a phase complete without explicit user approval.

## Safety & Scope
- Do not perform git operations (commit, push, rebase, amend, cherry-pick, etc.).
- Do not add new dependencies without explicit approval.
- Do not refactor unrelated code. Keep changes tightly scoped to the task.

## Parity Definition (This Project)
- **Primary goal: VISUAL parity** with production at agreed viewports/breakpoints.
  - Layout, spacing, typography, component presence, responsive behavior.
- **Secondary goal: copy + SEO correctness**
  - Visible labels/CTAs, headings, `<title>`, meta description.
- **Non-goal: DOM/structural parity**
  - Production is not a SPA; its DOM structure will differ. Structure diffs are diagnostic only.

## Evidence & Truthfulness (Parity Work)
- Do not claim “parity” without **evidence artifacts**:
  - screenshots (visual evidence) are primary
  - text/SEO inventories are supporting evidence
- Do not fail parity purely due to DOM/structure differences unless they explain a visual mismatch.

## When Blocked
Stop and ask for direction if:
- production capture is blocked / non-deterministic
- requirements are ambiguous
- evidence conflicts
