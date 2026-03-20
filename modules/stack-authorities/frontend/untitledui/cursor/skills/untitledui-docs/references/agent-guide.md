# Untitled UI Agent Guide

**Source**: https://www.untitledui.com/react/AGENT.md

This reference provides AI agent-specific guidance for working with Untitled UI React components.

## Project Architecture

### Tech Stack
- **React 19.1.1** with TypeScript
- **Tailwind CSS v4.1** for styling
- **React Aria Components** as the accessibility foundation

### Component Foundation
- All components built on **React Aria Components**
- Follow compound component pattern (e.g., `Select.Item`, `Select.ComboBox`)
- TypeScript throughout for type safety

### Configuration (Optional)

**components.json** - Optional configuration file for custom project structures or monorepos:

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

**Important**: Aliases MUST match your `tsconfig.json` path mappings. Relative paths like `../../components/` will NOT work - only valid tsconfig path aliases like `@/components/` or `@workspace/ui/components/`.

See https://www.untitledui.com/react/integrations/components-json for complete details.

## Critical Conventions

### Import Naming Convention

**CRITICAL**: All imports from `react-aria-components` MUST be prefixed with `Aria*`:

```typescript
// ✅ CORRECT
import { Button as AriaButton, TextField as AriaTextField } from "react-aria-components";

// ❌ INCORRECT
import { Button, TextField } from "react-aria-components";
```

**Why**: Prevents naming conflicts with custom components and maintains codebase consistency.

### File Naming Convention

**IMPORTANT**: All files MUST use **kebab-case**:

```
✅ Correct:
- date-picker.tsx
- user-profile.tsx
- api-client.ts
- auth-context.tsx

❌ Incorrect:
- DatePicker.tsx
- userProfile.tsx
- apiClient.ts
- AuthContext.tsx
```

Applies to all file types: components (.tsx), TypeScript (.ts), styles (.css), tests (.test.ts), config files.

## Project Structure

```
src/
├── components/
│   ├── base/              # Core UI components (Button, Input, Select)
│   ├── application/       # Complex components (DatePicker, Modal, Table)
│   ├── foundations/       # Design tokens (FeaturedIcon, etc.)
│   ├── marketing/         # Marketing-specific components
│   └── shared-assets/     # Reusable assets and illustrations
├── hooks/                 # Custom React hooks
├── pages/                 # Route components
├── providers/             # React context providers
├── styles/               # Global styles and theme
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Development Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build (TypeScript + Vite)
```

## Component Patterns

### Base Components
Located in `components/base/`:
- `Button` - All button variants with loading states
- `Input` - Text inputs with validation and icons
- `Select` - Dropdown selections with complex options
- `Checkbox`, `Radio`, `Toggle` - Form controls
- `Avatar`, `Badge`, `Tooltip` - Display components

### Application Components
Located in `components/application/`:
- `DatePicker` - Calendar-based date selection
- `Modal` - Overlay dialogs
- `Pagination` - Data navigation
- `Table` - Data display with sorting
- `Tabs` - Content organization

### Styling Architecture
- Uses `sortCx` utility for organized style objects
- Size variants: `sm`, `md`, `lg`, `xl`
- Color variants: `primary`, `secondary`, `tertiary`, `destructive`
- Responsive and state-aware with Tailwind

### Component Props Pattern

```typescript
interface CommonProps {
    size?: "sm" | "md" | "lg";
    isDisabled?: boolean;
    isLoading?: boolean;
}

interface ButtonProps extends CommonProps, HTMLButtonElement {
    color?: "primary" | "secondary" | "tertiary";
    iconLeading?: FC | ReactNode;
    iconTrailing?: FC | ReactNode;
}
```

## Styling Guidelines

### Tailwind CSS v4.1
- Latest Tailwind CSS v4.1 features
- Custom design tokens in theme configuration
- Consistent spacing, colors, typography scales

## Brand Color Customization

To change the main brand color across the entire application:

1. **Update Brand Color Variables**: Edit `src/styles/theme.css` and modify the `--color-brand-*` variables
2. **Maintain Color Scale**: Ensure you provide a complete color scale from 25 to 950 with proper contrast ratios
3. **Example Brand Color Scale**:
    ```css
    @theme {
        --color-brand-25: rgb(252 250 255);  /* Lightest tint */
        --color-brand-50: rgb(249 245 255);
        --color-brand-100: rgb(244 235 255);
        --color-brand-200: rgb(233 215 254);
        --color-brand-300: rgb(214 187 251);
        --color-brand-400: rgb(182 146 246);
        --color-brand-500: rgb(158 119 237);  /* Base brand color */
        --color-brand-600: rgb(127 86 217);   /* Primary interactive color */
        --color-brand-700: rgb(105 65 198);
        --color-brand-800: rgb(83 56 158);
        --color-brand-900: rgb(66 48 125);
        --color-brand-950: rgb(44 28 95);    /* Darkest shade */
    }
    ```

### Using Predefined Palettes

You can use any of Untitled UI's predefined color palettes:

```css
@theme {
    /* Use rose palette as brand */
    --color-brand-25: var(--color-rose-25);
    --color-brand-50: var(--color-rose-50);
    --color-brand-100: var(--color-rose-100);
    --color-brand-200: var(--color-rose-200);
    --color-brand-300: var(--color-rose-300);
    --color-brand-400: var(--color-rose-400);
    --color-brand-500: var(--color-rose-500);
    --color-brand-600: var(--color-rose-600);
    --color-brand-700: var(--color-rose-700);
    --color-brand-800: var(--color-rose-800);
    --color-brand-900: var(--color-rose-900);
    --color-brand-950: var(--color-rose-950);
}
```

**Available predefined palettes:**
- `brand` (default purple)
- `error` (red)
- `warning` (yellow/amber)
- `success` (green)
- `gray`, `moss`, `green`, `teal`, `blue`
- `indigo`, `purple`, `pink`, `rose`, `orange`

### CLI Color Selection

When initializing a project, the CLI prompts for brand color:

```bash
npx untitledui@latest init --nextjs

? Which color would you like to use as the brand color?
❯   brand
    error
    warning
    success
    gray
    moss
    green
    teal
    blue
    ...
```

Or specify directly:
```bash
npx untitledui@latest init --nextjs --color rose
```

### Theming Best Practices

1. **Complete color scale** - Always define all shades (25-950) for consistency
2. **Test in both modes** - Verify colors work in light and dark mode
3. **Contrast ratios** - Ensure accessibility with proper contrast
4. **Use semantic classes** - Reference brand colors via `text-brand-primary`, `bg-brand-solid`, etc.
5. **No hard restarts needed** - Theme changes apply automatically on save

The color scale automatically adapts to both light and dark modes through the CSS variable system.

### Style Organization

```typescript
export const styles = sortCx({
    common: {
        root: "base-classes-here",
        icon: "icon-classes-here",
    },
    sizes: {
        sm: { root: "small-size-classes" },
        md: { root: "medium-size-classes" },
    },
    colors: {
        primary: { root: "primary-color-classes" },
        secondary: { root: "secondary-color-classes" },
    },
});
```

### Utility Functions
- `cx()` - Class name utility (from `@/utils/cx`)
- `sortCx()` - Organized style objects
- `isReactComponent()` - Component type checking

## Icon Usage

### Available Libraries
- `@untitledui/icons` - 1,100+ line-style icons (free)
- `@untitledui/file-icons` - File type icons
- `@untitledui-pro/icons` - 4,600+ icons in 4 styles (PRO)

### Import & Usage

```typescript
// Recommended: Named imports (tree-shakeable)
import { Home01, Settings01, ChevronDown } from "@untitledui/icons";

// Component props - pass as reference
<Button iconLeading={ChevronDown}>Options</Button>

// Standalone usage
<Home01 className="size-5 text-gray-600" />

// As JSX element - MUST include data-icon
<Button iconLeading={<ChevronDown data-icon className="size-4" />}>
  Options
</Button>
```

### Styling

```typescript
// Size: use size-4 (16px), size-5 (20px), size-6 (24px)
<Home01 className="size-5" />

// Color: use semantic text colors
<Home01 className="size-5 text-brand-600" />

// Stroke width (line icons only)
<Home01 className="size-5" strokeWidth={2} />

// Accessibility: decorative icons need aria-hidden
<Home01 className="size-5" aria-hidden="true" />
```

### PRO Icon Styles

```typescript
import { Home01 } from "@untitledui-pro/icons";          // Line (default)
import { Home01 } from "@untitledui-pro/icons/duocolor"; // Duocolor
import { Home01 } from "@untitledui-pro/icons/duotone";  // Duotone
import { Home01 } from "@untitledui-pro/icons/solid";    // Solid
```

## Animation and Transitions

### CSS Transitions

For default small transition actions (hover, color changes):

```typescript
className = "transition duration-100 ease-linear";
```

Provides snappy 100ms linear transition that feels responsive.

### Animation Libraries
- `motion` (Framer Motion) for complex animations
- `tailwindcss-animate` for utility-based animations
- CSS transitions for simple state changes

### Loading States
- Components support `isLoading` prop
- Built-in loading spinners
- Proper disabled states during loading

## Common Component Patterns

### Compound Components

```typescript
const Select = SelectComponent as typeof SelectComponent & {
    Item: typeof SelectItem;
    ComboBox: typeof ComboBox;
};
Select.Item = SelectItem;
Select.ComboBox = ComboBox;
```

### Conditional Rendering

```typescript
{label && <Label isRequired={isRequired}>{label}</Label>}
{hint && <HintText isInvalid={isInvalid}>{hint}</HintText>}
```

## Most Used Components

### Button

**Import:**
```typescript
import { Button } from "@/components/base/buttons/button";
```

**Common Props:**
- `size`: `"sm" | "md" | "lg" | "xl"` (default: `"sm"`)
- `color`: `"primary" | "secondary" | "tertiary" | "link-gray" | "link-color" | "primary-destructive" | "secondary-destructive" | "tertiary-destructive" | "link-destructive"` (default: `"primary"`)
- `iconLeading`: `FC | ReactNode` - Icon before text
- `iconTrailing`: `FC | ReactNode` - Icon after text
- `isDisabled`: `boolean` - Disabled state
- `isLoading`: `boolean` - Loading state with spinner
- `showTextWhileLoading`: `boolean` - Keep text visible during loading

**Examples:**
```typescript
// Basic
<Button size="md">Save</Button>

// With icon
<Button iconLeading={Check} color="primary">Save</Button>

// Loading
<Button isLoading showTextWhileLoading>Submitting...</Button>

// Destructive
<Button color="primary-destructive" iconLeading={Trash02}>Delete</Button>

// As link
<Button href="/dashboard" color="link-color">View Dashboard</Button>
```

### Input

**Import:**
```typescript
import { Input } from "@/components/base/input/input";
import { InputGroup } from "@/components/base/input/input-group";
```

**Common Props:**
- `size`: `"sm" | "md"` (default: `"sm"`)
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text
- `hint`: `string` - Helper text below input
- `tooltip`: `string` - Tooltip text for help icon
- `icon`: `FC` - Leading icon component
- `isRequired`: `boolean` - Required field indicator
- `isDisabled`: `boolean` - Disabled state
- `isInvalid`: `boolean` - Error state

**Examples:**
```typescript
// Basic
<Input label="Email" placeholder="olivia@untitledui.com" />

// With validation
<Input
  icon={Mail01}
  label="Email"
  isRequired
  isInvalid
  hint="Please enter a valid email"
/>

// Input group with button
<InputGroup label="Website" trailingAddon={<Button>Copy</Button>}>
  <InputBase placeholder="www.untitledui.com" />
</InputGroup>
```

### Select

**Import:**
```typescript
import { MultiSelect } from "@/components/base/select/multi-select";
import { Select } from "@/components/base/select/select";
```

**Common Props:**
- `size`: `"sm" | "md"` (default: `"sm"`)
- `label`: `string` - Field label
- `placeholder`: `string` - Placeholder text
- `hint`: `string` - Helper text
- `tooltip`: `string` - Tooltip text
- `items`: `Array` - Data items to display
- `isRequired`: `boolean` - Required field
- `isDisabled`: `boolean` - Disabled state
- `placeholderIcon`: `FC | ReactNode` - Icon for placeholder

**Item Props:**
- `id`: `string` - Unique identifier
- `supportingText`: `string` - Secondary text
- `icon`: `FC | ReactNode` - Leading icon
- `avatarUrl`: `string` - Avatar image URL
- `isDisabled`: `boolean` - Disabled item

**Examples:**
```typescript
// Basic select
<Select label="Team member" placeholder="Select member" items={users}>
  {(item) => (
    <Select.Item id={item.id} supportingText={item.email}>
      {item.name}
    </Select.Item>
  )}
</Select>

// With search (ComboBox)
<Select.ComboBox label="Search" placeholder="Search users" items={users}>
  {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
</Select.ComboBox>

// With avatars
<Select items={users} placeholderIcon={User01}>
  {(item) => (
    <Select.Item avatarUrl={item.avatar} supportingText={item.role}>
      {item.name}
    </Select.Item>
  )}
</Select>
```

### Checkbox

**Import:**
```typescript
import { Checkbox } from "@/components/base/checkbox/checkbox";
```

**Common Props:**
- `size`: `"sm" | "md"` (default: `"sm"`)
- `label`: `string` - Checkbox label
- `hint`: `string` - Helper text below label
- `isSelected`: `boolean` - Checked state
- `isDisabled`: `boolean` - Disabled state
- `isIndeterminate`: `boolean` - Indeterminate state

**Examples:**
```typescript
// Basic
<Checkbox label="Remember me" />

// With hint
<Checkbox
  label="Remember me"
  hint="Save my login details for next time"
/>

// Controlled
<Checkbox isSelected={checked} onChange={setChecked} />
```

### Badge

**Import:**
```typescript
import { Badge, BadgeWithDot, BadgeWithIcon } from "@/components/base/badges/badges";
```

**Common Props:**
- `size`: `"sm" | "md" | "lg"` - Badge size
- `color`: `"gray" | "brand" | "error" | "warning" | "success" | "blue-gray" | "blue-light" | "blue" | "indigo" | "purple" | "pink" | "rose" | "orange"` - Color theme
- `type`: `"pill-color" | "color" | "modern"` - Badge style variant

**Examples:**
```typescript
// Basic
<Badge color="brand" size="md">New</Badge>

// With dot
<BadgeWithDot color="success" type="pill-color">Active</BadgeWithDot>

// With icon
<BadgeWithIcon iconLeading={ArrowUp} color="success">12%</BadgeWithIcon>
```

### Avatar

**Import:**
```typescript
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
```

**Common Props:**
- `size`: `"xs" | "sm" | "md" | "lg" | "xl" | "2xl"` - Avatar size
- `src`: `string` - Image URL
- `alt`: `string` - Alt text for accessibility
- `initials`: `string` - Text initials when no image
- `placeholderIcon`: `FC` - Icon when no image
- `status`: `"online" | "offline"` - Status indicator
- `verified`: `boolean` - Verification badge
- `badge`: `ReactNode` - Custom badge element

**Examples:**
```typescript
// Basic
<Avatar src="/avatar.jpg" alt="User Name" size="md" />

// With status
<Avatar src="/avatar.jpg" status="online" />

// With initials
<Avatar initials="OR" size="lg" />

// Label group
<AvatarLabelGroup
  src="/avatar.jpg"
  title="Olivia Rhye"
  subtitle="olivia@untitledui.com"
  size="md"
/>
```

### FeaturedIcon

**Import:**
```typescript
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
```

**Common Props:**
- `icon`: `FC` - Icon component to display (required)
- `size`: `"sm" | "md" | "lg" | "xl"` - Icon container size
- `color`: `"brand" | "gray" | "error" | "warning" | "success"` - Color scheme
- `theme`: `"light" | "gradient" | "dark" | "modern" | "modern-neue" | "outline"` - Visual theme style

**Theme Styles:**
- `light` - Subtle background with colored icon
- `gradient` - Gradient background effect
- `dark` - Solid colored background with white icon
- `modern` - Contemporary gray styling (gray color only)
- `modern-neue` - Alternative modern style (gray color only)
- `outline` - Border style with transparent background

**Examples:**
```typescript
// Basic
<FeaturedIcon icon={CheckCircle} color="success" theme="light" size="lg" />

// Gradient
<FeaturedIcon icon={AlertCircle} color="warning" theme="gradient" size="xl" />

// Dark theme
<FeaturedIcon icon={XCircle} color="error" theme="dark" size="md" />

// Modern (gray only)
<FeaturedIcon icon={Settings} color="gray" theme="modern" size="lg" />
```

### Link Pattern

**Note**: No dedicated Link component. Use Button with `href` and link color variants.

**Link Colors:**
- `link-gray` - Gray link styling
- `link-color` - Brand color link styling
- `link-destructive` - Destructive link styling

**Examples:**
```typescript
// Basic link
<Button href="/dashboard" color="link-color">View Dashboard</Button>

// With icon
<Button href="/settings" color="link-gray" iconLeading={Settings01}>
  Settings
</Button>

// External link
<Button href="https://example.com" color="link-color" iconTrailing={ExternalLink01}>
  Visit Site
</Button>
```

## Color System (CRITICAL)

**MUST use semantic color classes, NOT raw Tailwind colors.**

### ❌ Bad (Do NOT use):
```typescript
className="text-gray-900 text-gray-600 bg-blue-700"
```

### ✅ Good (Always use):
```typescript
className="text-primary text-secondary bg-primary"
```

## Semantic Color Variables

### Text Colors

| Class | Usage |
|-------|-------|
| `text-primary` | Primary text (page headings) |
| `text-primary_on-brand` | Primary text on brand backgrounds |
| `text-secondary` | Secondary text (labels, section headings) |
| `text-secondary_hover` | Secondary text hover state |
| `text-secondary_on-brand` | Secondary text on brand backgrounds |
| `text-tertiary` | Tertiary text (supporting text, paragraphs) |
| `text-tertiary_hover` | Tertiary text hover state |
| `text-tertiary_on-brand` | Tertiary text on brand backgrounds |
| `text-quaternary` | Quaternary text (subtle, low-contrast) |
| `text-quaternary_on-brand` | Quaternary text on brand backgrounds |
| `text-white` | Always white regardless of mode |
| `text-disabled` | Disabled text color |
| `text-placeholder` | Input placeholder text |
| `text-placeholder_subtle` | Subtle placeholder (lower contrast) |
| `text-brand-primary` | Primary brand text (headings) |
| `text-brand-secondary` | Secondary brand text (accents, highlights) |
| `text-brand-secondary_hover` | Secondary brand text hover |
| `text-brand-tertiary` | Tertiary brand text (lighter accents) |
| `text-brand-tertiary_alt` | Alternative tertiary (lighter in dark mode) |
| `text-error-primary` | Error state text |
| `text-warning-primary` | Warning state text |
| `text-success-primary` | Success state text |

### Border Colors

Can also use with `ring-` and `outline-` prefixes.

| Class | Usage |
|-------|-------|
| `border-primary` | High contrast borders (inputs, buttons, checkboxes) |
| `border-secondary` | Medium contrast borders (default for most components) |
| `border-secondary_alt` | Alternative with alpha transparency (floating menus) |
| `border-tertiary` | Low contrast borders (subtle dividers) |
| `border-disabled` | Disabled border color |
| `border-disabled_subtle` | Subtle disabled borders |
| `border-brand` | Brand border color (active states) |
| `border-brand_alt` | Brand border (switches to gray in dark mode) |
| `border-error` | Error state border |
| `border-error_subtle` | Subtle error border |

### Foreground Colors

Can use with `text-`, `bg-`, `ring-`, `outline-`, `stroke-`, `fill-` prefixes.

| Class | Usage |
|-------|-------|
| `fg-primary` | Highest contrast non-text elements (icons) |
| `fg-secondary` | High contrast non-text elements |
| `fg-secondary_hover` | Secondary hover state |
| `fg-tertiary` | Medium contrast non-text elements |
| `fg-tertiary_hover` | Tertiary hover state |
| `fg-quaternary` | Low contrast non-text elements |
| `fg-quaternary_hover` | Quaternary hover state |
| `fg-white` | Always white regardless of mode |
| `fg-disabled` | Disabled non-text elements |
| `fg-disabled_subtle` | Subtle disabled elements |
| `fg-brand-primary` | Primary brand non-text elements |
| `fg-brand-primary_alt` | Alternative (switches to gray in dark) |
| `fg-brand-secondary` | Secondary brand non-text elements |
| `fg-brand-secondary_alt` | Alternative (switches to gray in dark) |
| `fg-error-primary` | Primary error non-text elements |
| `fg-error-secondary` | Secondary error non-text elements |
| `fg-warning-primary` | Primary warning non-text elements |
| `fg-warning-secondary` | Secondary warning non-text elements |
| `fg-success-primary` | Primary success non-text elements |
| `fg-success-secondary` | Secondary success non-text elements |

### Background Colors

| Class | Usage |
|-------|-------|
| `bg-primary` | Primary background (white) |
| `bg-primary_alt` | Alternative primary (switches to secondary in dark) |
| `bg-primary_hover` | Primary hover state |
| `bg-primary-solid` | Primary dark background |
| `bg-secondary` | Secondary background (contrast against white) |
| `bg-secondary_alt` | Alternative (switches to primary in dark) |
| `bg-secondary_hover` | Secondary hover state |
| `bg-secondary_subtle` | Subtle secondary (lighter in light mode) |
| `bg-secondary-solid` | Secondary dark background |
| `bg-tertiary` | Tertiary background |
| `bg-quaternary` | Quaternary background |
| `bg-active` | Active state background |
| `bg-disabled` | Disabled background |
| `bg-disabled_subtle` | Subtle disabled background |
| `bg-overlay` | Overlay backgrounds (modals) |
| `bg-brand-primary` | Primary brand background |
| `bg-brand-primary_alt` | Alternative (switches to secondary in dark) |
| `bg-brand-secondary` | Secondary brand background |
| `bg-brand-solid` | Solid brand background |
| `bg-brand-solid_hover` | Solid brand hover |
| `bg-brand-section` | Brand section backgrounds |
| `bg-brand-section_subtle` | Subtle brand section |
| `bg-error-primary` | Primary error background |
| `bg-error-secondary` | Secondary error background |
| `bg-error-solid` | Solid error background |
| `bg-error-solid_hover` | Solid error hover |
| `bg-warning-primary` | Primary warning background |
| `bg-warning-secondary` | Secondary warning background |
| `bg-warning-solid` | Solid warning background |
| `bg-success-primary` | Primary success background |
| `bg-success-secondary` | Secondary success background |
| `bg-success-solid` | Solid success background |

## Best Practices for AI Assistance

### When Adding New Components

1. Follow existing component structure
2. Use React Aria Components as foundation
3. Implement proper TypeScript types
4. Add size and color variants where applicable
5. Include accessibility features
6. Follow naming conventions (kebab-case files, Aria* imports)
7. Add to appropriate folders (`base/`, `application/`, `foundations/`, etc.)
8. Use semantic color classes (NOT raw Tailwind colors)
9. Include proper loading and disabled states
10. Use `sortCx` for style organization

### State Management

- Use React Aria's built-in state management
- Local state for component-specific data
- Context for shared state (theme in `src/providers/theme.tsx`, router in `src/providers/router-provider.tsx`)

### Key Files

- `src/utils/cx.ts` - Class name utilities
- `src/utils/is-react-component.ts` - Component type checking
- `src/hooks/` - Custom React hooks
- `src/styles/globals.css` - Global styles
- `src/styles/theme.css` - Theme definitions
- `src/styles/typography.css` - Typography styles

### Icon Usage Patterns

1. **As component reference** (preferred): `<Button iconLeading={ChevronDown}>`
2. **As element** (must include `data-icon`): `<Button iconLeading={<ChevronDown data-icon />}>`
3. **Standalone**: `<Home01 className="size-5 text-brand-600" />`
4. **Always use semantic colors**: `text-brand-600`, NOT `text-blue-600`

### Common Patterns

- **Size variants**: Most components support `sm`, `md`, `lg`
- **State props**: `isDisabled`, `isLoading`, `isInvalid`, `isRequired`
- **Compound components**: Use dot notation (e.g., `Select.Item`, `Select.ComboBox`)
- **Accessibility**: All components include proper ARIA attributes and keyboard support
- **Transitions**: Use `transition duration-100 ease-linear` for hover states
