# React Component Standards - Reference Materials

Code examples and patterns for React + TypeScript + Tailwind development.

---

## Contents

### Examples
- `component-with-hooks.tsx` - Complete component using hooks
- `custom-hook.ts` - Reusable custom hook pattern
- `form-validation.tsx` - Form with validation
- `data-fetching.tsx` - API integration pattern

### Anti-Patterns
- `react-anti-patterns.md` - Common mistakes to avoid

### Migration Guides
- `class-to-functional.md` - Converting class components to functional

---

## Quick Reference

**Component Structure:**
```typescript
interface Props { ... }
export function Component({ ...props }: Props) {
  const [state, setState] = useState();
  const computed = useMemo();
  useEffect(() => {});
  return <div className="..." data-testid="...">...</div>;
}
```

**Testing:**
```typescript
render(<Component {...props} />);
expect(screen.getByTestId('...')).toBeInTheDocument();
```

---

See `SKILL.md` for complete standards.
