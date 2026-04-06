# Web React Build Screen

Build a React screen using Tailwind and shared UI components.

## Parallel Execution

**Discovery phase can run in parallel:**

```
Phase 1: Discovery (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Design Requirements                  │
│         - Confirm screen purpose/states      │
│         - Check docs/design/ files           │
│                                              │
│ Task B: Component Inventory                  │
│         - Identify reusable components       │
│         - Review existing patterns           │
│                                              │
│ Task C: Data Requirements                    │
│         - Check API contracts                │
│         - Identify state management needs    │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Implementation (SEQUENTIAL)
• Build layout with Tailwind utilities
• Add states (loading/error/empty)
• Implement accessibility
                   ↓
Phase 3: Validation (SEQUENTIAL)
• Add/update tests
• Invoke web.react-critic for review
```

**Time savings:** 30-40% faster

## Steps

1. Confirm screen purpose, states, and data requirements.
2. Identify reusable components and existing patterns.
3. Implement layout using utilities and component classes.
4. Add accessibility and empty/error/loading states.
5. Add or update tests if required.

## Guidance

- Apply `react-tailwind-conventions` and `react-component-standards`.
- Ask the `web.react-critic` subagent to review UI consistency.
