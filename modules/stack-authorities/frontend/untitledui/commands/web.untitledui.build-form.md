# Web Untitled UI Build Form

Build a form using Untitled UI form components with proper validation and accessibility.

## Parallel Execution

**Form implementation can be parallelized:**

```
Phase 1: Planning and Installation (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Define Requirements                  │
│         - List form fields                   │
│         - Validation rules                   │
│         - Submit behavior                    │
│                                              │
│ Task B: Component Discovery                  │
│         - Check which components needed      │
│         - Review component APIs              │
│                                              │
│ Task C: Install Components                   │
│         - npx untitledui add input select    │
│           checkbox button                    │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Implementation (SEQUENTIAL)
• Build form structure
• Add state management
• Implement validation
• Add submit handler
                   ↓
Phase 3: Testing (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Validation Testing                   │
│         - Test required fields               │
│         - Test error states                  │
│                                              │
│ Task B: Accessibility Testing                │
│         - Keyboard navigation                │
│         - Screen reader labels               │
│                                              │
│ Task C: Interaction Testing                  │
│         - Submit behavior                    │
│         - Loading states                     │
└──────────────────────────────────────────────┘
```

**Time savings:** 40-50% faster

## Steps

1. **Define form requirements** - Fields, validation rules, submit behavior
2. **Install components** - Use MCP or CLI: `npx untitledui add input select checkbox button --yes`
3. **Implement form structure** - Layout with proper labels and validation
4. **Add state management** - Form state, validation, submission handling
5. **Test form behavior** - Validation, error states, accessibility

## Component Reference

See `untitledui-docs/SKILL.md` and `references/agent-guide.md` for form components, validation, and accessibility patterns.

## Guidance

- **Apply `untitledui-docs` skill** for component details and patterns
- **Read agent-guide.md** for component props and API
- **Use semantic colors** for errors: `text-error-primary`
- **Include all states** - Empty, filled, error, disabled, loading
- **Test validation** - Both client and server-side error handling

## Optional: Review Form Implementation

**Invoke `web.untitledui-critic` agent:**
- Component usage correctness
- Untitled UI pattern compliance
- Accessibility validation
- Error state handling
