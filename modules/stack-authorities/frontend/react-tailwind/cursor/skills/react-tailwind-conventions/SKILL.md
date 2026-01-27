---
name: react-tailwind-conventions
description: Tailwind component/utility conventions for React UIs.
---

# React Tailwind Conventions

Use this skill when building or refactoring React UI with Tailwind CSS.

## When to Use

- Building new UI components with Tailwind
- Refactoring existing components with long inline className strings
- Creating reusable control components (buttons, inputs, cards)
- Auditing UI for consistency

## Architecture: Component Classes + Utilities

### Layer 1: Utilities (Layout & Spacing)

Use Tailwind utilities for:
- **Layout**: `flex`, `grid`, `block`, `inline-flex`
- **Spacing**: `gap-4`, `mt-6`, `p-4`, `space-y-4`
- **Responsive**: `md:flex-row`, `lg:grid-cols-3`
- **Positioning**: `absolute`, `relative`, `sticky`

```tsx
// ✅ CORRECT: Utilities for layout
<div className="flex items-center gap-4 mt-6">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>
```

### Layer 2: Component Classes (Controls)

Use component classes for:
- Buttons, inputs, cards, links, badges
- Any UI control used 3+ times
- Design system components

```css
/* src/styles/globals.css */
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2;
    @apply px-4 py-2 rounded-lg font-semibold;
    @apply bg-brand-red-600 text-white;
    @apply hover:bg-brand-red-700;
    @apply focus-visible:outline-none focus-visible:ring-2;
    @apply transition-colors duration-200;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .input {
    @apply w-full px-4 py-2 rounded-lg;
    @apply border border-gray-300;
    @apply focus:outline-none focus:ring-2 focus:ring-brand-red-600;
  }

  .card {
    @apply bg-white rounded-lg shadow-sm;
    @apply border border-gray-200;
  }
}
```

### Layer 3: React Components

Build components using component classes + utilities:

```tsx
// ✅ CORRECT: Component using both
export const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="card p-6 space-y-4"> {/* class + utilities */}
      <h3 className="text-xl font-semibold">{user.name}</h3>
      <div className="flex justify-end gap-4">
        <button className="btn-secondary">Cancel</button>
        <button className="btn-primary" onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
});
```

## The `cn` Helper

Always use `cn` utility for className composition:

```typescript
// lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

```tsx
// Usage
<Button className={cn("btn-primary", isActive && "ring-2")} />
```

## Variant Props Pattern

Create components with variant props mapped to component classes:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export const Button = memo(function Button({ 
  variant = "primary", 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };

  return (
    <button className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
});
```

## What NOT to Do

```tsx
// ❌ WRONG: Long inline className for controls
<button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-red-600 text-white font-semibold hover:bg-brand-red-700 focus-visible:outline-none transition-colors">
  Submit
</button>

// ✅ CORRECT: Use component class
<button className="btn-primary">Submit</button>

// ❌ WRONG: Component class for layout
.property-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

// ✅ CORRECT: Utilities for layout
<div className="grid grid-cols-3 gap-6">
```

## Design Tokens

Component classes must use design tokens via `@apply`:

```css
/* ✅ CORRECT */
.btn-primary {
  @apply bg-brand-red-600 text-text-on-brand;
}

/* ❌ WRONG: Hardcoded values */
.btn-primary {
  background-color: #C41F1D;
}
```

## Naming Conventions

Component classes follow pattern: `{element}-{variant}`

**Examples:**
- `btn-primary`, `btn-secondary`, `btn-ghost`
- `input`, `input-search`
- `link-nav`, `link-text`
- `card`, `card-hover`

## Accessibility Requirements

All component classes MUST include proper focus states:

```css
.btn-primary {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-600 focus-visible:ring-offset-2;
}
```

## References

- See `references/` folder for:
  - Complete component class library
  - Tailwind configuration examples
  - Complex component patterns
