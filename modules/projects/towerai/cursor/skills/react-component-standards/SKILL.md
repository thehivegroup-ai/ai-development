---
name: react-component-standards
version: 1.0.0
description: >
  React component patterns for performance, state, and a11y. Use when creating or refactoring 
  React components, optimizing render performance, managing component state, or ensuring 
  accessibility compliance.
  
  Trigger when user mentions: create React component, optimize React performance, fix re-renders, 
  add memoization, create context provider, custom hooks, form component, accessibility issues, 
  or asks about React.memo, useCallback, useMemo, or component best practices.
---

# React Component Standards

Use this skill when creating or refactoring React components.

## When to Use

- Creating new React components
- Refactoring existing components for performance
- Implementing forms, hooks, or context providers
- Reviewing component quality

## Component Structure

### Functional Components with Typed Props

```tsx
// ✅ CORRECT: Typed props interface
interface UserCardProps {
  readonly user: User;
  readonly onEdit: (id: string) => void;
}

/**
 * UserCard Component
 * Displays user information with edit functionality
 */
export const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="card p-6">
      <h3>{user.name}</h3>
      <button className="btn-primary" onClick={() => onEdit(user.id)}>
        Edit
      </button>
    </div>
  );
});

UserCard.displayName = 'UserCard';
```

## Memoization Decision Tree

**MUST use `React.memo` when:**
1. Component receives callback props (`onClick`, `onSave`, etc.)
2. Component is pure presentational (just displays data)
3. Component renders expensive child trees or large lists
4. Component is a list item (used in `.map()`)

```tsx
// ✅ CORRECT: Memoized component
export const ProductCard = memo(({ product, onSelect }: ProductCardProps) => {
  return (
    <div className="card p-4">
      <h3>{product.name}</h3>
      <button onClick={() => onSelect(product.id)}>Select</button>
    </div>
  );
});
```

## Context Provider Memoization

**CRITICAL: Always memoize Context Provider values:**

```tsx
// ❌ WRONG: Value recreated every render
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CatalogItem) => {
    setItems(current => [...current, item]);
  };

  const value = { items, addItem }; // ❌ New object every render

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ✅ CORRECT: Properly memoized
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CatalogItem) => {
    setItems(current => [...current, item]);
  }, []); // Empty deps with functional setState

  const value = useMemo(
    () => ({ items, addItem }),
    [items, addItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

## Hook Dependencies

**Always declare all dependencies:**

```tsx
// ❌ WRONG: Missing dependency
useEffect(() => {
  fetchData(userId); // userId not in deps
}, []);

// ✅ CORRECT: All dependencies declared
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ✅ CORRECT: Using functional setState (no deps needed)
const increment = useCallback(() => {
  setCount(c => c + 1);
}, []);
```

## Custom Hooks

Extract reusable logic:

```tsx
function useApiData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetch(url).then(r => r.json());
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
```

## Accessibility Checklist

- [ ] Use semantic HTML (`button`, `nav`, `main`, `article`)
- [ ] All inputs have associated labels
- [ ] Interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] ARIA attributes for complex widgets
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA

## Component Checklist

When creating a component:

- [ ] Use functional component (not class)
- [ ] Define `ComponentNameProps` interface with `readonly`
- [ ] Add JSDoc comment explaining purpose
- [ ] Memoization check (see decision tree above)
- [ ] All callbacks memoized with `useCallback`
- [ ] Expensive computations memoized with `useMemo`
- [ ] Proper accessibility (semantic HTML, labels, ARIA)

## References

- `references/context-patterns.md` – Advanced Context patterns
- `references/form-patterns.md` – Form handling best practices
- `references/performance-optimization.md` – Performance deep dive
