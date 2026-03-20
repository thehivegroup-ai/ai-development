# Untitled UI Stack Authority - Complete

## Final Location

✅ **Correct Location**: `/modules/stack-authorities/frontend/untitledui/`

## Structure

```
modules/stack-authorities/frontend/untitledui/
├── README.md                                    # Module overview
├── module.json                                  # Module configuration
└── cursor/
    └── skills/
        └── untitledui-docs/
            ├── SKILL.md                         # Main skill (352 lines)
            ├── agents/
            │   └── openai.yaml                  # UI metadata
            ├── assets/                          # (empty, for future icons)
            └── references/
                ├── agent-guide.md               # Implementation guide (827 lines) ⭐
                ├── cli-reference.md             # CLI commands (501 lines)
                ├── component-categories.md      # Component library (318 lines)
                └── mcp-integration.md           # MCP setup (690 lines)
```

## Total Documentation

**2,688 lines** across all files

## What Was Created

### Module Files

**module.json**
- Stack authority type
- Frontend/untitledui identifier
- Compatible with react-tailwind and next-tailwind
- Tags: frontend, react, untitledui, tailwind, typescript, component-library, react-aria, ui-components

**README.md**
- Complete module overview
- Feature breakdown
- Configuration guidance (components.json)
- Free vs PRO comparison
- Related modules

### Skill Files

**SKILL.md** (352 lines)
- Quick Start for MCP tools and implementation
- Component categories overview
- CLI commands
- Icon usage
- MCP tool reference
- Workflows and troubleshooting

**agents/openai.yaml**
- Display name: "Untitled UI Docs"
- Short description for UI
- Default prompt
- MCP dependency: untitledui server

### Reference Files

**1. agent-guide.md** (827 lines) ⭐
- **NEW**: Added components.json configuration section
- Project architecture (React 19.1.1, TypeScript, Tailwind v4.1, React Aria)
- **CRITICAL conventions**:
  - File naming: kebab-case REQUIRED
  - Import naming: Aria* prefix REQUIRED
  - Color system: Semantic classes REQUIRED
  - components.json: Must match tsconfig.json aliases
- Component reference with examples
- Complete color system (76 semantic classes)
- Styling architecture
- Icon patterns
- Best practices

**2. component-categories.md** (318 lines)
- All 300+ components by category
- Usage examples
- Access levels (Free vs PRO)
- Component selection guide

**3. cli-reference.md** (501 lines)
- Complete CLI documentation
- All commands: init, add, example, login
- Options and flags
- Workflows and troubleshooting

**4. mcp-integration.md** (690 lines)
- MCP server setup (multiple clients)
- 3 authentication methods
- All 6 MCP tools
- Workflow examples
- Error handling

## Integration with components.json

Added to agent-guide.md under "Project Architecture":

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

**Key Points**:
- Optional configuration for custom project structures
- Aliases MUST match tsconfig.json path mappings
- Relative paths (../../components/) DON'T work
- Only valid tsconfig aliases (@/components/, @workspace/ui/) work
- Referenced in agent-guide.md with link to full docs

## Documentation Sources Integrated

1. ✅ CLI Documentation (https://www.untitledui.com/react/docs/cli)
2. ✅ Icons Documentation (https://www.untitledui.com/react/docs/icons)
3. ✅ MCP Integration (https://www.untitledui.com/react/integrations/mcp)
4. ✅ Agent Guide (https://www.untitledui.com/react/AGENT.md)
5. ✅ components.json (https://www.untitledui.com/react/integrations/components-json) ⭐ NEW

## Module Configuration

### Provides
- **Skills**: untitledui-docs
- **Rules**: (none - focused on component usage)
- **Commands**: (future: could add custom commands)
- **Agents**: (future: could add untitledui-specific agents)

### Compatibility
- Cursor >=0.40.0
- Compatible with:
  - frontend/react-tailwind
  - frontend/next-tailwind

### Tags
frontend, react, untitledui, tailwind, typescript, component-library, react-aria, ui-components

## Usage Workflows

### 1. Component Discovery (MCP)
User: "Find button components in Untitled UI"
→ Skill uses MCP search → Returns results → Provides CLI install command

### 2. Component Implementation (Agent Guide)
User: "Create a form with inputs"
→ Skill reads agent-guide.md → Uses kebab-case files → Semantic colors → Aria* imports

### 3. Custom Project Setup (components.json)
User: "I'm in a monorepo with custom aliases"
→ Skill references agent-guide.md → Explains components.json → Shows tsconfig.json requirements

### 4. Page Templates (MCP + PRO)
User: "Add a dashboard template"
→ Skill searches templates → Shows options → Installs complete page

## Key Enhancements

### components.json Integration
- Added to agent-guide.md under Project Architecture
- Explains when and why to use it (monorepos, custom structures)
- Clarifies alias requirements (must match tsconfig.json)
- Warns against relative paths
- Links to official documentation

### Complete Coverage
- Component discovery and installation (MCP)
- Component implementation (Agent Guide)
- Project configuration (components.json)
- CLI operations (CLI Reference)
- Styling and theming (Color System)
- Convention enforcement (File naming, imports, colors)

## Differences from ~/.codex/skills Version

The version in `~/.codex/skills/untitledui-docs/` was created first but in the wrong location. The correct version in the workspace includes:
- ✅ Proper module.json with stack-authority configuration
- ✅ Complete README.md with module overview
- ✅ components.json integration in agent-guide.md
- ✅ Proper module structure following existing patterns
- ✅ Integration with other frontend modules

## Next Steps

Optional future enhancements:
1. Add custom commands for common Untitled UI operations
2. Create untitledui-specific agents (e.g., untitledui-reviewer)
3. Add Untitled UI brand icons to assets/
4. Create rules for Untitled UI-specific conventions
5. Add Figma integration examples

## Testing the Module

To verify the module works:

```bash
# Check module is recognized
ls modules/stack-authorities/frontend/untitledui/

# Verify skill structure
ls modules/stack-authorities/frontend/untitledui/cursor/skills/untitledui-docs/

# Check reference files
wc -l modules/stack-authorities/frontend/untitledui/cursor/skills/untitledui-docs/references/*.md
```

The skill should trigger when working with Untitled UI components and provide comprehensive guidance for discovery, installation, and implementation.
