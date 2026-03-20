# Untitled UI React Stack Authority

Comprehensive stack authority for Untitled UI, a React component library with 300+ components built on React Aria Components, styled with Tailwind CSS v4.1.

## Overview

This module provides AI-native guidance for working with Untitled UI components through:
- **MCP Server Integration**: Direct component discovery and installation via Model Context Protocol
- **Component Library**: 300+ components across base, application, and marketing categories
- **CLI Tools**: Project scaffolding and component installation
- **Icons**: 1,100+ free icons, 4,600+ PRO icons across 4 styles
- **Agent Guide**: Critical conventions and implementation patterns

## Features

### Component Discovery & Installation
- MCP server for AI-native component search and installation
- CLI tool for project initialization and component addition
- Page templates for complete dashboard and marketing pages

### Implementation Guidance
- Critical file naming conventions (kebab-case required)
- Import patterns (Aria* prefix for React Aria components)
- Semantic color system (text-primary, NOT text-gray-900)
- Component patterns and best practices
- Styling architecture with sortCx utility

### Component Categories
- **Base Components**: Buttons, inputs, forms, badges, avatars (Free + PRO)
- **Application Components**: Tables, charts, modals, sidebars, calendars (PRO)
- **Marketing Components**: Heroes, pricing, testimonials, CTAs (PRO)
- **Page Templates**: Dashboards, landing pages, auth pages (PRO)

## Stack Dependencies

- React 19.1.1
- TypeScript
- Tailwind CSS v4.1
- React Aria Components
- Framer Motion (for animations)

## MCP Integration

The Untitled UI MCP server (`user-untitledui`) provides:
- Component search by functionality
- Component listing by category
- Single and bundle installation
- Page template discovery and installation (PRO)

**Server URL**: https://www.untitledui.com/react/api/mcp

## Skills

### untitledui-docs
Comprehensive guidance for Untitled UI component library with:
- MCP tool reference for all 6 available tools
- Complete CLI command reference
- Agent-specific implementation guide with critical conventions
- Component categories and usage examples
- Color system reference (76 semantic color classes)
- Icon usage patterns
- Free vs PRO access breakdown

## Usage

The skill triggers automatically when:
- Building React UIs with Untitled UI components
- Searching/browsing the Untitled UI component library
- Installing components or page templates
- Working with Untitled UI icons
- Need CLI or MCP integration guidance
- Implementing or modifying Untitled UI components

## Configuration

### components.json (Optional)
For custom project structures or monorepos, create a `components.json` file to configure import aliases:

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

**Note**: Aliases must match your `tsconfig.json` path mappings.

## Free vs PRO

**Free Access**:
- Core base components (buttons, inputs, forms, badges)
- Basic application components (tables, basic charts)
- 1,100+ line-style icons
- CLI access to free components

**PRO Access** (API key required):
- All component variants
- Advanced application components (modals, slideouts, command menus)
- All marketing components
- All page templates and examples
- 4,600+ icons across 4 styles (line, solid, duocolor, duotone)

## Documentation

- **Official Docs**: https://www.untitledui.com/react/docs
- **CLI Reference**: https://www.untitledui.com/react/docs/cli
- **Icons**: https://www.untitledui.com/react/docs/icons
- **MCP Integration**: https://www.untitledui.com/react/integrations/mcp
- **Agent Guide**: https://www.untitledui.com/react/AGENT.md

## Related Modules

Works well with:
- `frontend/react-tailwind` - React + Tailwind patterns
- `frontend/next-tailwind` - Next.js + Tailwind patterns
