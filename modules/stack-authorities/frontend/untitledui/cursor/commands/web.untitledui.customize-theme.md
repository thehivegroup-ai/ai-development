# Web Untitled UI Customize Theme

Customize the Untitled UI theme by changing brand colors and design tokens.

## Steps

1. **Choose your brand color** - Select from predefined palettes or define custom
2. **Locate theme file** - Edit `src/styles/theme.css`
3. **Update color variables** - Modify `--color-brand-*` variables
4. **Verify changes** - Check both light and dark modes
5. **Test contrast** - Ensure accessibility with proper contrast ratios

## Theme Customization Methods

### Method 1: Use Predefined Palette (Recommended)

The easiest way is to use one of Untitled UI's predefined color palettes:

```css
/* src/styles/theme.css */
@theme {
    /* Change from purple (brand) to rose */
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

**Available Palettes:**
- `rose` - Pink/red tones
- `orange` - Orange tones
- `amber` / `warning` - Yellow/gold tones
- `green` / `success` - Green tones
- `teal` - Teal/cyan tones
- `blue` - Blue tones
- `indigo` - Indigo tones
- `purple` / `brand` - Purple tones (default)
- `pink` - Pink tones
- `gray` - Neutral gray tones
- `moss` - Green-gray tones
- `error` - Red error tones

### Method 2: Define Custom Colors

For a unique brand color, define your own complete color scale:

```css
/* src/styles/theme.css */
@theme {
    --color-brand-25: rgb(254 252 250);   /* Lightest - backgrounds */
    --color-brand-50: rgb(254 248 245);
    --color-brand-100: rgb(254 236 228);
    --color-brand-200: rgb(253 217 206);
    --color-brand-300: rgb(252 188 170);
    --color-brand-400: rgb(251 146 125);
    --color-brand-500: rgb(249 101 84);   /* Base brand color */
    --color-brand-600: rgb(239 68 68);    /* Primary interactive */
    --color-brand-700: rgb(220 38 38);
    --color-brand-800: rgb(185 28 28);
    --color-brand-900: rgb(153 27 27);
    --color-brand-950: rgb(69 10 10);     /* Darkest - text on light bg */
}
```

**Requirements for Custom Colors:**
1. **Complete scale** - Define all 12 shades (25, 50, 100-900, 950)
2. **Consistent progression** - Each shade should be progressively darker
3. **Sufficient contrast** - Meet WCAG AA standards
4. **Test both modes** - Verify in light and dark mode

### Method 3: During Project Initialization

When creating a new project, select brand color via CLI:

```bash
# Interactive selection
npx untitledui@latest init --nextjs

# Direct specification
npx untitledui@latest init --nextjs --color rose
npx untitledui@latest init --vite --color teal
```

## Color Scale Guidelines

### Shade Usage

| Shade | Usage | Example |
|-------|-------|---------|
| 25, 50 | Lightest backgrounds | Hover states, subtle backgrounds |
| 100-200 | Light backgrounds | Cards, sections, secondary backgrounds |
| 300-400 | Borders, accents | Borders, dividers, subtle emphasis |
| 500-600 | Primary brand color | Buttons, links, primary actions |
| 700-800 | Dark accents | Hover states, pressed states |
| 900-950 | Darkest text/backgrounds | Text on light backgrounds, dark mode backgrounds |

### Key Shades

- **500** - Your base brand color (used as reference)
- **600** - Primary interactive color (buttons, links)
- **700-800** - Hover and active states
- **100-200** - Background tints

## Verification Checklist

After changing theme colors:

- [ ] All 12 shades defined (25, 50, 100-900, 950)
- [ ] Colors progress consistently from light to dark
- [ ] Test in **light mode** - check readability
- [ ] Test in **dark mode** - check readability
- [ ] Check contrast ratios meet WCAG AA (4.5:1 for text)
- [ ] Test interactive elements (buttons, links, forms)
- [ ] Verify hover and active states look good
- [ ] Check brand color usage across all pages

## Common Use Cases

### Update Brand to Match Company Colors

```css
/* Extract your company's primary color */
/* Generate a complete scale using a tool or service */
/* Then update theme.css */
@theme {
    --color-brand-600: rgb(10 102 194);  /* Your company blue */
    /* ... generate and add all other shades ... */
}
```

### Seasonal Theme Changes

```css
/* Winter theme - cool blues */
@theme {
    --color-brand-25: var(--color-blue-25);
    /* ... blue palette ... */
}

/* Spring theme - fresh greens */
@theme {
    --color-brand-25: var(--color-green-25);
    /* ... green palette ... */
}
```

### Multi-Brand Support

For different brands within the same app, use CSS scoping:

```css
/* Default brand */
@theme {
    --color-brand-600: var(--color-purple-600);
}

/* Brand A - scoped */
.brand-a {
    --color-brand-600: var(--color-rose-600);
}

/* Brand B - scoped */
.brand-b {
    --color-brand-600: var(--color-teal-600);
}
```

## Theme Tools & Resources

### Color Scale Generators
- **Tailwind Color Generator** - Generate complete scales from single color
- **ColorBox by Lyft** - Create accessible color systems
- **Leonardo** - Generate color scales with target contrast ratios

### Accessibility Testing
- **WebAIM Contrast Checker** - Verify contrast ratios
- **Color Safe** - Generate accessible color palettes
- **Stark** - Browser extension for accessibility checks

## Troubleshooting

### Colors Not Applying
- Verify you're editing the correct theme file (`src/styles/theme.css`)
- Check syntax - ensure proper CSS variable format
- Clear browser cache and hard reload
- Check for typos in variable names

### Dark Mode Issues
- Ensure color scale works in both modes
- Test darker shades (700-950) for dark mode readability
- Verify semantic classes reference the right theme variables

### Contrast Problems
- Use darker shades (700+) for text on light backgrounds
- Use lighter shades (100-300) for text on dark backgrounds
- Test with actual text content, not just color swatches

## Best Practices

1. **Start with predefined palette** - Easier than custom colors
2. **Maintain consistency** - Use the same brand color throughout
3. **Test thoroughly** - Check all components, states, and modes
4. **Document choices** - Note why specific colors were chosen
5. **Consider accessibility** - Always meet WCAG standards
6. **Use semantic classes** - Reference via `text-brand-primary`, not `text-purple-600`

## Related

- Read `references/agent-guide.md` for theming architecture
- See SKILL.md "Semantic Color Reference" for color usage
- Review rule `25-web-untitledui-react.mdc` for color conventions
