# Web React Compare Screens

Compare two screens for design, behavior, and state consistency.

## Parallel Execution

**Comparison aspects can be analyzed in parallel:**

```
Phase 1: Component Analysis (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Shared Component Identification      │
│         - List components used in both       │
│         - Identify variants                  │
│                                              │
│ Task B: Layout & Spacing Comparison          │
│         - Compare grid/flex patterns         │
│         - Check spacing consistency          │
│                                              │
│ Task C: Typography & Color Comparison        │
│         - Compare font scales                │
│         - Check color usage                  │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Behavior Analysis (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: State Handling                       │
│ Task B: Accessibility Patterns               │
│ Task C: Error/Loading States                 │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 3: Synthesis (SEQUENTIAL)
• Document mismatches
• Propose consolidation
• Invoke web.react-critic for validation
```

**Time savings:** 40-50% faster

## Steps

1. Identify shared components, patterns, and variants.
2. Compare layout, spacing, and typography choices.
3. Review state handling and accessibility behaviors.
4. Note mismatches and propose consolidation.

## Guidance

- Apply `react-tailwind-conventions`.
- Use `web.react-critic` for a UI consistency pass.
