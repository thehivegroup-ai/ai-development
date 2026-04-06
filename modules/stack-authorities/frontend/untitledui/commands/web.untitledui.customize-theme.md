# Web Untitled UI Customize Theme

Customize the Untitled UI theme by changing brand colors and design tokens.

## Parallel Execution

**Theme customization can be parallelized:**

```
Phase 1: Planning (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Color Selection                      │
│         - Choose brand palette               │
│         - Review predefined options          │
│                                              │
│ Task B: Accessibility Review                 │
│         - Check contrast requirements        │
│         - Verify WCAG compliance             │
│                                              │
│ Task C: Impact Analysis                      │
│         - Identify affected components       │
│         - List pages to test                 │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Implementation (SEQUENTIAL)
• Locate theme file (src/styles/theme.css)
• Update color variables
• Test in browser
                   ↓
Phase 3: Verification (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Visual Testing                       │
│         - Light mode appearance              │
│         - Dark mode appearance               │
│                                              │
│ Task B: Contrast Testing                     │
│         - Text readability                   │
│         - Interactive element visibility     │
│                                              │
│ Task C: Component Testing                    │
│         - Buttons in all states              │
│         - Forms and inputs                   │
│         - Navigation and links               │
└──────────────────────────────────────────────┘
```

**Time savings:** 35-45% faster

## Steps

1. **Choose brand color** - Select from predefined palettes or define custom
2. **Update theme.css** - Edit `src/styles/theme.css` with new `--color-brand-*` variables
3. **Test both modes** - Verify appearance in light and dark mode
4. **Check contrast** - Ensure WCAG AA compliance (4.5:1 for text)

## Quick Start

### Use Predefined Palette

```css
/* src/styles/theme.css */
@theme {
    /* Change from purple to rose */
    --color-brand-25: var(--color-rose-25);
    --color-brand-50: var(--color-rose-50);
    /* ... repeat for all shades 100-950 ... */
}
```

**Available palettes:** rose, orange, amber, green, teal, blue, indigo, purple, pink, moss

### Define Custom Colors

For unique brand colors, define complete 12-shade scale (25, 50, 100-900, 950).

## Reference Documentation

See `untitledui-docs/SKILL.md` (Theming and CSS variables) and `references/agent-guide.md` for:
- Predefined palette options and semantic color classes
- Custom color scale guidelines
- Shade usage and accessibility

## Guidance

- **Apply `untitledui-docs` skill** for complete theming documentation
- **Start with predefined palette** - Easier than custom colors
- **Test thoroughly** - Check all components, states, and modes
- **Maintain consistency** - Use semantic classes: `text-brand-primary`
- **Meet WCAG standards** - Ensure proper contrast ratios

## Related

- Read `agent-guide.md` for theming architecture
- Review rule `25-web-untitledui-react.mdc` for color conventions
