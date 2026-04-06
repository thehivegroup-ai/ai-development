# Untitledui

**Platform-Agnostic Instructions**

This file contains base instructions that apply across all platforms.


---


# Untitled UI React

## Component Library

This project uses **Untitled UI**, a React component library with 300+ components built on React Aria Components and styled with Tailwind CSS v4.1.

## Critical Conventions

### File Naming (REQUIRED)
- **ALL files MUST use kebab-case**: `date-picker.tsx`, `user-profile.tsx`
- **NEVER use PascalCase**: ❌ `DatePicker.tsx`, `UserProfile.tsx`

### Import Naming (REQUIRED)
- **React Aria imports MUST use Aria* prefix**:
  ```typescript
  // ✅ CORRECT
  import { Button as AriaButton, TextField as AriaTextField } from "react-aria-components";
  
  // ❌ INCORRECT
  import { Button, TextField } from "react-aria-components";
  ```

### Color System (REQUIRED)
- **MUST use semantic color classes, NOT raw Tailwind colors**:
  ```typescript
  // ✅ CORRECT
  className="text-primary text-secondary bg-primary"
  
  // ❌ INCORRECT
  className="text-gray-900 text-gray-600 bg-blue-700"
  ```

## Component Usage

### Importing Components
```typescript
// From Untitled UI base components
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

// Icons (tree-shakeable)
import { Home01, Settings01, ChevronDown } from "@untitledui/icons";
```

### Icon Usage
```typescript
// As component reference (preferred)
<Button iconLeading={ChevronDown}>Options</Button>

// As JSX element (MUST include data-icon)
<Button iconLeading={<ChevronDown data-icon className="size-4" />}>
  Options
</Button>
```

### Common Props Pattern
Most components support:
- `size`: `"sm" | "md" | "lg" | "xl"`
- `isDisabled`: boolean
- `isLoading`: boolean
- `isInvalid`: boolean
- `isRequired`: boolean

### Compound Components
```typescript
// Use dot notation for complex components
<Select label="Team member" items={users}>
  {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
</Select>

<Select.ComboBox label="Search" items={users}>
  {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
</Select.ComboBox>
```

## Styling

### CSS Transitions
For hover states and small transitions:
```typescript
className="transition duration-100 ease-linear"
```

### Style Organization
Use `sortCx` utility for organized style objects:
```typescript
export const styles = sortCx({
  common: {
    root: "base-classes-here",
  },
  sizes: {
    sm: { root: "small-size-classes" },
    md: { root: "medium-size-classes" },
  },
  colors: {
    primary: { root: "primary-color-classes" },
  },
});
```

## Semantic Color Reference

### Text Colors
- `text-primary` - Primary text (headings)
- `text-secondary` - Secondary text (labels)
- `text-tertiary` - Tertiary text (supporting text)
- `text-brand-primary` - Brand headings
- `text-brand-secondary` - Brand accents
- `text-error-primary` - Error states
- `text-success-primary` - Success states

### Border Colors
- `border-primary` - High contrast borders
- `border-secondary` - Default borders
- `border-brand` - Brand borders (active states)
- `border-error` - Error state borders

### Background Colors
- `bg-primary` - Primary background (white)
- `bg-secondary` - Secondary background (contrast)
- `bg-brand-primary` - Primary brand background
- `bg-brand-solid` - Solid brand background
- `bg-error-primary` - Error backgrounds

### Foreground Colors (icons, non-text)
- `fg-primary` - Highest contrast icons
- `fg-secondary` - High contrast icons
- `fg-tertiary` - Medium contrast icons
- `fg-brand-primary` - Brand icons
- `fg-error-primary` - Error icons

## Configuration

### Optional: components.json
For monorepos or custom project structures:
```json
{
  "aliases": {
    "components": "@/components/",
    "utils": "@/utils/",
    "hooks": "@/hooks/",
    "styles": "@/styles/"
  },
  "examples": "app"
}
```

**Note**: Aliases MUST match `tsconfig.json` path mappings.

## Theming

### Brand Color Customization

Edit `src/styles/theme.css` to change brand colors:

```css
@theme {
    /* Use predefined palette */
    --color-brand-25: var(--color-rose-25);
    --color-brand-600: var(--color-rose-600);
    /* ... complete scale 25-950 ... */
    
    /* Or define custom RGB values */
    --color-brand-25: rgb(252 250 255);
    --color-brand-600: rgb(127 86 217);
}
```

**Available palettes**: brand, error, warning, success, gray, moss, green, teal, blue, indigo, purple, pink, rose, orange

**Requirements**:
- Complete color scale (25, 50, 100-900, 950)
- Test in both light and dark modes
- Maintain proper contrast ratios (WCAG AA)

### CLI Color Selection

```bash
npx untitledui@latest init --nextjs --color rose
```

## React Aria Foundation

All components are built on React Aria Components:
- Consistent accessibility (ARIA attributes, keyboard navigation)
- Built-in state management
- Compound component patterns
- TypeScript support throughout

## Best Practices

1. **Follow kebab-case file naming** - Required by Untitled UI conventions
2. **Use Aria* prefix for React Aria imports** - Prevents naming conflicts
3. **Use semantic color classes** - Ensures light/dark mode compatibility
4. **Leverage compound components** - Use `Select.Item`, `Select.ComboBox` patterns
5. **Include proper states** - Loading, disabled, error states for all interactive components
6. **Use sortCx for styles** - Organizes style variants clearly
7. **Pass icons as references** - Preferred over JSX elements for performance
