# Untitled UI Docs - Stack Authority Skill

## Overview

This skill provides comprehensive guidance for using Untitled UI, a React component library with 300+ components. It leverages the Untitled UI MCP server for AI-native component discovery and installation.

## Installation Location

`~/.codex/skills/untitledui-docs/`

## Triggers

This skill triggers when:
- Building React UIs with Untitled UI components
- Searching/browsing the Untitled UI component library
- Installing Untitled UI components or page templates
- Accessing Untitled UI icons
- Need guidance on Untitled UI CLI commands, theming, and integration

## Structure

### Core Files
- **SKILL.md** (339 lines): Main skill instructions with Quick Start, workflows, component categories, CLI commands, icons, MCP tools, and troubleshooting
- **agents/openai.yaml**: UI metadata with MCP dependency configuration

### Reference Files
- **cli-reference.md** (501 lines): Complete CLI command reference with all options, examples, and workflows
- **component-categories.md** (318 lines): Detailed breakdown of all components by category with usage examples
- **mcp-integration.md** (690 lines): Comprehensive MCP server integration guide with authentication, tools, and workflows
- **agent-guide.md** (812 lines): **AI agent-specific guide** with critical conventions, component patterns, color system, and implementation examples

Total: ~2,660 lines of documentation

## Features

### Agent-Specific Implementation Guide
- **NEW**: Complete agent guide from official AGENT.md
- Critical conventions: kebab-case files, Aria* imports, semantic colors
- Component patterns with React Aria Components foundation
- Complete color system reference (text, border, foreground, background)
- Detailed examples for all major components (Button, Input, Select, etc.)
- Styling architecture with sortCx utility
- Icon usage patterns and best practices

### MCP Integration
- Direct integration with Untitled UI MCP server (`user-untitledui`)
- 6 MCP tools: search, list, get component, bundle, templates (PRO), template files (PRO)
- OAuth 2.1 and API key authentication support
- Resource browsing via MCP

### Component Coverage
- **Base Components**: Buttons, forms, badges, avatars, tooltips (Free + PRO)
- **Application Components**: Tables, charts, modals, sidebars, calendars (PRO)
- **Marketing Components**: Heroes, pricing, testimonials, CTAs (PRO)
- **Page Templates**: Complete dashboards, landing pages, auth pages (PRO)
- **Icons**: 1,100+ free (line), 4,600+ PRO (4 styles)

### CLI Support
- Project initialization (Next.js, Vite)
- Component installation (single, multiple, bundles)
- Page template installation
- Authentication for PRO access
- Custom paths and configurations

### Workflows
- Discover and install single components
- Build complete pages from templates
- Install multiple related components
- Browse and discover component library
- Handle free vs PRO access patterns

## Free vs PRO

**Free Access** (no authentication):
- Core base components (buttons, inputs, forms)
- Basic application components (tables, charts)
- 1,100+ line-style icons
- CLI access to free components

**PRO Access** (API key required):
- All component variants
- Advanced application components (modals, slideouts)
- All marketing components
- All page templates and examples
- 4,600+ icons across 4 styles

## Dependencies

### MCP Server
- **Name**: `untitledui`
- **Server ID**: `user-untitledui`
- **URL**: https://www.untitledui.com/react/api/mcp
- **Transport**: HTTP (streamable_http)
- **Authentication**: OAuth 2.1 or Bearer token

### Tools Referenced
- `search_components` - Search by functionality
- `list_components` - Browse by category
- `get_component` - Get installation command
- `get_component_bundle` - Multiple components
- `get_page_templates` - Browse templates (PRO)
- `get_page_template_files` - Install templates (PRO)

## Usage Examples

### Basic Component Installation
```
User: "Add a button component to my project"
→ Skill searches → Gets component → Executes CLI command
```

### Dashboard Creation
```
User: "Create a dashboard with charts and metrics"
→ Skill searches templates → Shows options → Installs complete dashboard
```

### Form Building
```
User: "Add form components for a contact form"
→ Skill searches → Identifies components → Bundles installation
```

### Component Discovery
```
User: "What navigation components are available?"
→ Skill searches → Lists results → Explains free vs PRO options
```

## Integration Notes

- **Progressive Disclosure**: SKILL.md provides overview, references provide depth
- **Token Efficiency**: Uses CLI commands from MCP instead of reading source
- **MCP-First**: Always prioritize MCP tools over manual methods
- **Context-Aware**: References appropriate documentation based on query type

## Validation

Skill structure validated:
- ✅ YAML frontmatter with name and description
- ✅ Description includes when to use
- ✅ agents/openai.yaml with interface metadata
- ✅ MCP dependencies configured
- ✅ Reference files for detailed information
- ✅ Assets directory created (for future icons if needed)

## Future Enhancements

Potential additions:
- Add Untitled UI brand icons to `assets/` directory
- Include visual component gallery in references
- Add Figma integration examples
- Include theming/customization templates
- Add common component composition patterns

## Related Skills

This skill complements:
- **openai-docs**: For AI/LLM integration patterns
- Frontend framework skills (Next.js, React)
- Design system skills

## Support Resources

- **Official Docs**: https://www.untitledui.com/react/docs
- **MCP Integration**: https://www.untitledui.com/react/integrations/mcp
- **CLI Reference**: https://www.untitledui.com/react/docs/cli
- **Component Library**: https://www.untitledui.com/react/components
- **Icons**: https://www.untitledui.com/react/docs/icons
