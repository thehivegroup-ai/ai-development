# Web Untitled UI Add Component

Add Untitled UI components to your project using the MCP server or CLI.

## Steps

1. **Identify the component needed** - What functionality are you looking for?
2. **Search the component library** - Use MCP `search_components` or ask "find [functionality] components"
3. **Review component details** - Check if it's Free or PRO, view props and usage
4. **Install the component** - Execute the CLI command provided by MCP
5. **Verify installation** - Check that component files and dependencies were added

## MCP Workflow (Recommended)

### Single Component
```
User: "Add a button component to my project"
→ Search: mcp__untitledui__search_components(query: "button")
→ Get: mcp__untitledui__get_component(component_name: "button")
→ Execute: npx untitledui@latest add button --yes
```

### Multiple Related Components
```
User: "Add form components: input, select, checkbox, button"
→ Bundle: mcp__untitledui__get_component_bundle(
    component_names: ["input", "select", "checkbox", "button"]
  )
→ Execute: npx untitledui@latest add input select checkbox button --yes
```

### Page Template (PRO)
```
User: "Add a dashboard template"
→ Search: mcp__untitledui__get_page_templates(category: "application")
→ Get: mcp__untitledui__get_page_template_files(template_id: "dashboards-01/01")
→ Execute: npx untitledui@latest example dashboards-01/01 --yes
```

## CLI Workflow (Alternative)

### Interactive Selection
```bash
# Browse and select components
npx untitledui@latest add

# Select type → Select components → Confirm
```

### Direct Installation
```bash
# Single component
npx untitledui@latest add button

# Multiple components
npx untitledui@latest add button input select

# With custom path
npx untitledui@latest add button --path src/components/ui
```

## After Installation

1. **Read agent guide** - Review `references/agent-guide.md` for critical conventions
2. **Check imports** - Ensure proper kebab-case file names and Aria* prefixes
3. **Use semantic colors** - Apply text-primary, bg-primary, etc. (not raw Tailwind)
4. **Test the component** - Verify it renders and functions correctly
5. **Check dependencies** - Ensure all required base components were installed

### Optional: Review Component Implementation

**Invoke `web.untitledui-critic` agent** (if exists):
```
"Review [component name] implementation for Untitled UI convention compliance and identify any pattern violations"
```

This ensures the installed component matches project conventions and integrates properly with existing code.

## Common Components

### Base Components (Free)
- `button` - All button variants with loading states
- `input` - Text inputs with validation and icons
- `select` - Dropdowns with search capabilities
- `checkbox` - Checkbox with labels
- `badge` - Status badges with colors
- `avatar` - User avatars with initials fallback
- `tooltip` - Hover tooltips

### Application Components (PRO)
- `modal` - Dialog modals
- `table` - Data tables with sorting/filtering
- `sidebar-navigation` - Collapsible sidebar
- `date-picker` - Calendar date selection
- `file-uploader` - Drag-drop file upload

### Marketing Components (PRO)
- `hero-section` - Hero with various layouts
- `pricing-section` - Pricing tables
- `testimonial-section` - Customer testimonials
- `footer` - Marketing site footer

## Troubleshooting

### Component Not Found
- Use MCP search to find exact component name
- Check if component is PRO (requires authentication)
- Verify spelling matches component library

### Installation Fails
- Ensure project is initialized: `npx untitledui@latest init`
- Check Node.js version (requires 18+)
- Verify you're in project root directory

### PRO Access Denied
- Login for PRO components: `npx untitledui@latest login`
- Or configure API key in MCP server settings

## Guidance

- **Prefer MCP over manual CLI** - MCP provides discovery and context
- **Read agent-guide.md** - Critical conventions before implementing
- **Bundle related components** - More efficient than one-by-one
- **Check Free vs PRO** - Know what requires authentication
