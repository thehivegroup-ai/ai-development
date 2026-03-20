---
name: untitledui-docs
description: "Use when building React UIs with Untitled UI components, need to search/browse the Untitled UI component library, install Untitled UI components or page templates, access Untitled UI icons, or need guidance on Untitled UI CLI commands, theming, and integration. Prioritize the Untitled UI MCP server for component discovery and installation."
---

# Untitled UI Docs

Provide authoritative guidance for using Untitled UI, a comprehensive React component library with 300+ components across base, application, and marketing categories. Use the Untitled UI MCP server to search, browse, and install components directly.

## Quick Start

**For component discovery and installation:**
- Use `mcp__untitledui__search_components` to find components by functionality
- Use `mcp__untitledui__list_components` to browse components by category
- Use `mcp__untitledui__get_component` to get installation commands for single components
- Use `mcp__untitledui__get_component_bundle` to install multiple components at once
- Use `mcp__untitledui__get_page_templates` to browse page templates (PRO)
- Use `mcp__untitledui__get_page_template_files` to install complete page templates (PRO)

**For component implementation and code:**
- **ALWAYS read `references/agent-guide.md` before writing code** - Contains critical conventions and patterns
- Key conventions: kebab-case files, Aria* imports, semantic color classes (NOT raw Tailwind)
- Component examples, props reference, and styling guidelines

## Untitled UI Product Overview

1. **Base Components**: Core UI primitives (buttons, inputs, forms, dropdowns, avatars, badges, etc.)
2. **Application Components**: Complex app components (tables, charts, modals, sidebars, calendars, file uploaders, etc.)
3. **Marketing Components**: Landing page sections (heroes, pricing, testimonials, CTAs, footers, etc.)
4. **Page Templates**: Complete examples (dashboards, settings pages, landing pages, auth pages)
5. **Foundations**: Icons (1,100+ free, 4,600+ PRO), logos, illustrations
6. **CLI Tool**: Component installation and project scaffolding
7. **MCP Server**: AI-native component discovery and installation

## If MCP Server is Missing

If MCP tools fail or no Untitled UI resources are available:

1. Check if the server is configured by looking for `user-untitledui` in the MCP servers list
2. If missing, the user needs to configure it manually (see MCP integration docs)
3. For PRO components, authentication is required via API key in MCP config

## Workflow

### When to Use MCP vs CLI

**Prefer MCP Server (AI-native):**
- ✅ When discovering components ("find form components", "what navigation options exist")
- ✅ When the AI is helping build features ("add a login form")
- ✅ When you need component suggestions based on requirements
- ✅ For bundling related components automatically
- ✅ When browsing page templates and examples

**Use CLI Directly:**
- Terminal access by user
- User explicitly runs CLI commands
- CI/CD pipelines and automation
- When MCP server is not available
- Updating existing components with `--overwrite`

### AI Workflow with MCP

1. Clarify what the user needs: specific component, page template, or general UI guidance
2. **Use MCP to discover**: Search or list components using MCP tools
3. **Get CLI command**: Component metadata includes the exact CLI installation command
4. **Execute CLI**: Run the CLI command to install (MCP provides the command)
5. For page templates, use MCP page template tools to browse and install complete examples
6. Provide guidance on usage, theming, or customization as needed

### Example MCP Workflows

**User asks: "Add a button to my project"**
```
1. AI: mcp__untitledui__search_components(query: "button")
2. AI: mcp__untitledui__get_component(component_name: "button")
3. AI: Execute: npx untitledui@latest add button --yes
4. AI: Provide usage example from agent-guide.md
```

**User asks: "Create a contact form"**
```
1. AI: mcp__untitledui__search_components(query: "form input")
2. AI: mcp__untitledui__get_component_bundle(
     component_names: ["input", "textarea", "checkbox", "button"]
   )
3. AI: Execute: npx untitledui@latest add input textarea checkbox button --yes
4. AI: Provide form implementation pattern
```

**User asks: "Add a dashboard"**
```
1. AI: mcp__untitledui__get_page_templates(category: "application")
2. AI: Show template options
3. User selects: dashboards-01
4. AI: mcp__untitledui__get_page_template_files(template_id: "dashboards-01/01")
5. AI: Execute: npx untitledui@latest example dashboards-01/01 --yes
```

## Component Categories

### Base Components (Free + PRO)
- **Buttons**: Standard, social, app store, utility buttons, button groups
- **Forms**: Inputs, textarea, select, checkboxes, radios, toggles, verification codes
- **Display**: Badges, tags, avatars, tooltips, progress indicators, QR codes
- **Navigation**: Dropdowns, tabs, breadcrumbs
- **Media**: Video players, credit cards, illustrations
- **Editors**: Text editors (rich text)
- **Feedback**: Alerts, notifications, loading indicators, empty states

### Application Components (PRO)
- **Layout**: Sidebars, headers, page headers, section headers/footers
- **Navigation**: Modals, slideouts, command menus, paginations, carousels
- **Data**: Tables, charts (line, bar, pie, radar), metrics, activity feeds
- **Forms**: Date pickers, calendars, file uploaders
- **Content**: Messaging, activity feeds, code snippets, content dividers
- **Steps**: Progress steps, tabs

### Marketing Components (PRO)
- **Headers**: Navigation headers, hero sections
- **Content**: Feature sections, testimonials, social proof, blog sections
- **Conversion**: Pricing sections, CTA sections, newsletter CTAs
- **Social**: Team sections, careers sections, contact sections
- **Support**: FAQ sections, footers, banners

### Page Templates (PRO)
- **Application**: Dashboards, settings pages, informational pages
- **Marketing**: Landing pages, pricing pages, blogs, about pages, contact pages
- **Shared**: Login, signup, verification, forgot password, 404 pages
- **Email**: Email templates

## CLI Commands

**Important for AI Agents**: When executing CLI commands, ALWAYS use the `--yes` flag for non-interactive mode. This prevents prompts and uses defaults automatically.

### Project Initialization
```bash
# Create new Next.js project with Untitled UI
npx untitledui@latest init --nextjs

# Create new Vite project with Untitled UI
npx untitledui@latest init --vite

# With brand color selection
npx untitledui@latest init --nextjs --color brand
```

### Adding Components
```bash
# Add single component
npx untitledui@latest add button

# Add multiple components
npx untitledui@latest add button toggle avatar

# Interactive selection
npx untitledui@latest add

# Non-interactive (for AI/CI)
npx untitledui@latest add button --yes

# Custom path
npx untitledui@latest add button --path src/components

# Overwrite existing
npx untitledui@latest add button --overwrite
```

### Adding Page Templates (PRO)
```bash
# Interactive example selection
npx untitledui@latest example

# Specific example
npx untitledui@latest example dashboards-01

# With custom paths
npx untitledui@latest example dashboards-01 --example-path src/app/dashboard --path components/ui

# Non-interactive
npx untitledui@latest example dashboards-01 --yes
```

### Authentication (PRO)
```bash
# Login for PRO access
npx untitledui@latest login
```

## Theming

### Brand Color Selection

**During initialization:**
```bash
npx untitledui@latest init --nextjs --color rose
```

**Available palettes:** brand (purple), error (red), warning (amber), success (green), gray, moss, green, teal, blue, indigo, purple, pink, rose, orange

### Manual Theme Customization

Edit `src/styles/theme.css` to change brand colors:

```css
@theme {
    /* Use predefined palette */
    --color-brand-25: var(--color-rose-25);
    --color-brand-50: var(--color-rose-50);
    /* ... all shades 100-950 ... */
    
    /* Or define custom colors */
    --color-brand-25: rgb(252 250 255);
    --color-brand-600: rgb(127 86 217);  /* Primary interactive */
    /* ... complete scale 25-950 ... */
}
```

**Requirements:**
- Complete color scale (25, 50, 100-900, 950)
- Proper contrast ratios for accessibility
- Test in both light and dark modes
- Changes apply automatically (no restart needed)

### Using Theme Colors

Reference brand colors via semantic classes:
```typescript
// Text
className="text-brand-primary text-brand-secondary"

// Backgrounds
className="bg-brand-solid bg-brand-primary"

// Borders
className="border-brand"

// Foreground (icons)
className="fg-brand-primary"
```

See "Semantic Color Reference" section for complete color system.

Untitled UI Icons are available as a separate package:

```bash
# Install free icons (1,100+ line style)
npm install @untitledui/icons

# Import icons
import { Home01, Settings01, User01 } from "@untitledui/icons"

# Use icons
<Home01 className="size-5" />
<Settings01 className="size-6 text-brand-600" strokeWidth={1.5} />
```

### PRO Icons (4,600+ across 4 styles)
```bash
# Configure .npmrc with token
# @untitledui-pro:registry=https://pkg.untitledui.com
# //pkg.untitledui.com/:_authToken=YOUR_TOKEN_HERE

# Install PRO icons
npm install @untitledui-pro/icons

# Import by style
import { Home01 } from "@untitledui-pro/icons/line"      # Line style
import { Home01 } from "@untitledui-pro/icons/solid"     # Solid style
import { Home01 } from "@untitledui-pro/icons/duocolor"  # Duocolor style
import { Home01 } from "@untitledui-pro/icons/duotone"   # Duotone style
```

## MCP Tool Reference

### `search_components`
Search components by name, description, or functionality.

**When to use**: User asks for components by function ("find form components", "show me navigation")

**Parameters**:
- `query` (required): Search term
- `category_filter` (optional): Filter by category
- `limit` (optional): Max results (default: 20)
- `key` (optional): API key for PRO access

**Returns**: List of matching components with name, description, category, access level (public/pro)

### `list_components`
Browse all components in a category.

**When to use**: User wants to see what's available in a category ("list all base components")

**Parameters**:
- `category` (optional): Filter by base/application/marketing/foundations/shared-assets/examples
- `skip` (optional): Pagination offset
- `limit` (optional): Max results (default: 100)
- `key` (optional): API key for PRO access

**Returns**: Paginated list with total count, has_more flag

### `get_component`
Get single component metadata and CLI installation command.

**When to use**: User wants to install a specific component

**Parameters**:
- `component_name` (required): Name of component
- `key` (optional): API key for PRO components

**Returns**: Component metadata and CLI command to execute

### `get_component_bundle`
Install multiple components at once.

**When to use**: User needs several related components ("add button, input, and form")

**Parameters**:
- `component_names` (required): Array of component names
- `key` (optional): API key for PRO components

**Returns**: Bundle metadata and CLI command

### `get_page_templates` (PRO)
Browse available page templates.

**When to use**: User wants to see template options ("show dashboard templates")

**Parameters**:
- `category` (optional): Filter by template category
- `key` (required): API key

**Returns**: List of templates with descriptions

### `get_page_template_files` (PRO)
Install a complete page template.

**When to use**: User wants to add a full page ("install landing page template")

**Parameters**:
- `template_id` (required): Template identifier
- `key` (required): API key

**Returns**: Template files and CLI installation command

## Free vs PRO

### Free (No Authentication)
- Core base components: buttons, inputs, forms, badges, avatars
- Core application components: tables, basic charts
- Foundation icons: 1,100+ line-style icons
- CLI access to free components

### PRO (API Key Required)
- All component variants and styles
- Advanced application components: modals, slideouts, command menus
- All marketing components: heroes, pricing, testimonials
- All page templates and examples
- 4,600+ icons across 4 styles (line, solid, duocolor, duotone)
- Private npm package access

## Integration Notes

- **Next.js**: Full support via `npx untitledui@latest init --nextjs`
- **Vite**: Full support via `npx untitledui@latest init --vite`
- **Tailwind CSS**: Components use Tailwind utility classes
- **TypeScript**: Full TypeScript support
- **Tree-shaking**: Modern bundlers automatically optimize imports
- **Dark Mode**: Built-in dark mode support
- **Monorepo**: Supports monorepo structures

## Theming

Untitled UI uses CSS variables for theming:

```css
:root {
  --brand-50: #f0f9ff;
  --brand-600: #0284c7;
  /* ... other brand colors ... */
}
```

Change theme by updating CSS variables or using the brand color option during init.

## Quality Guidelines

- Always use MCP tools before manual installation
- Provide the exact CLI command from MCP responses
- For PRO components, check if user is authenticated
- Cite component names and categories accurately
- When installing multiple related components, use `get_component_bundle`
- For complete pages, recommend page templates over assembling from scratch
- Reference official docs at https://www.untitledui.com/react when needed

## Common Workflows

### Building a Dashboard
1. Search for dashboard templates: `get_page_templates` with category filter
2. Install complete dashboard: `get_page_template_files`
3. Result: Full dashboard with sidebar, charts, tables pre-configured

### Adding Form Components
1. Search: `search_components` with query "form"
2. Bundle install: `get_component_bundle` with [input, select, checkbox, button]
3. Result: All form components installed with dependencies

### Creating Landing Page
1. Search: `search_components` with query "hero" or category "marketing"
2. Install components: hero, pricing, testimonials, footer
3. Or use template: `get_page_template_files` for complete landing page

### Icon Usage
1. Check if free icons (`@untitledui/icons`) meet needs
2. For more styles, recommend PRO package
3. Provide import examples with proper styling

## Reference Map

Load only what you need:

- `references/agent-guide.md` -> **Read this when implementing or modifying Untitled UI components** - Critical conventions, component patterns, color system, and code examples
- `references/component-categories.md` -> Detailed breakdown of all component categories with examples
- `references/cli-reference.md` -> Complete CLI command reference with all options
- `references/mcp-integration.md` -> Detailed MCP server setup and authentication

**IMPORTANT**: When writing code that uses Untitled UI components, ALWAYS read `references/agent-guide.md` first for critical conventions like:
- File naming (kebab-case required)
- Import naming (Aria* prefix for react-aria-components)
- Color system (semantic classes required, NOT raw Tailwind colors)
- Component patterns and props
- Icon usage patterns

## Troubleshooting

### MCP Tools Not Working
- Verify `user-untitledui` server is configured
- Check MCP server list in Cursor
- For PRO access, verify API key is set in MCP config

### CLI Installation Fails
- Ensure project is initialized: `npx untitledui@latest init`
- Check Node.js version (requires 18+)
- Verify in correct project directory
- For PRO components, run `npx untitledui@latest login` first

### Component Not Found
- Use `search_components` to find exact name
- Check if component is PRO (requires authentication)
- Verify spelling matches component library naming

### Authentication Issues
- For CLI: Run `npx untitledui@latest login`
- For MCP: Add API key to MCP server configuration
- For npm (icons): Configure `.npmrc` with private registry token
