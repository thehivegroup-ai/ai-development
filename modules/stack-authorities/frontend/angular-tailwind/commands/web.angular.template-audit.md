# Web Angular Template Audit

Audit Angular templates for modern syntax, Tailwind usage, testability, and data integration.

## Steps

1. Verify standalone components and modern control flow syntax (`@if`, `@for`, `@switch`).
2. Check component/utility architecture for Tailwind classes.
3. Confirm `data-testid` coverage for interactive elements.
4. Review data binding and state management patterns.
5. Verify forms use typed reactive forms with validation.
6. Check API integration patterns (HttpClient, Signals).
7. Note accessibility or UX gaps.

## Guidance

- Apply `angular-tailwind-standards` skill for component patterns.
- Apply `angular-forms-validation` skill for forms.
- Apply `angular-data-integration` skill for API calls.
- Use `web.angular-critic` subagent for independent review.
