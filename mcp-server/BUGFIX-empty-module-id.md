# Bug Fix: Enterprise Standards Module Installation

## Issue

The MCP server's `install_environment` tool was failing to install enterprise standards when the module ID was an empty string.

### Root Cause

The `inferModuleId` function in `src/modules/scanner.ts` was correctly generating an empty string for the enterprise-standards module (since it's at `modules/enterprise-standards/` with no sub-path), but the `resolveSelection` function in `src/modules/composer.ts` was using a falsy check that incorrectly filtered out empty strings.

### Files Changed

1. **`src/modules/scanner.ts`**
   - Added documentation clarifying that enterprise-standards has an empty string module ID
   - No logic change needed (empty string was correct)

2. **`src/modules/composer.ts`**
   - Changed condition from `if (selection.enterprise)` to `if (selection.enterprise !== undefined && selection.enterprise !== null)`
   - This allows empty string `""` to pass through correctly

## Testing

To verify the fix works:

### 1. List modules and confirm enterprise standards appears

```bash
# Should show enterprise-standards with id: ""
list_modules
```

Expected output should include:

```json
{
  "id": "",
  "category": "enterprise-standards",
  "name": "enterprise-standards",
  "description": "Core development standards and workflows",
  "provides": {
    "rules": ["00-std-foundation.mdc", "01-std-solution-hermeneutic.mdc", ...],
    "commands": ["std.clean-sweep.md", "std.deploy-release.md", ...],
    "skills": ["engineering-hygiene", "hermeneutic-solution", ...],
    "agents": ["std.debugger.md", "std.planner.md", ...]
  }
}
```

### 2. Install environment with enterprise standards

```bash
install_environment({
  projectPath: "/path/to/your/project",
  selection: {
    enterprise: "",  # Empty string for enterprise-standards
    controls: ["base"],
    stacks: ["frontend/react-tailwind", "backend/node-fastify", "database/postgres"]
  }
})
```

Expected result:
- ✅ All enterprise standards files installed to `.cursor/`
- ✅ Rules (7 files) in `.cursor/rules/`
- ✅ Commands (5 files) in `.cursor/commands/`
- ✅ Agents (3 files) in `.cursor/agents/`
- ✅ Skills (3 modules) in `.cursor/skills/`

### 3. Validate environment

```bash
validate_environment({
  projectPath: "/path/to/your/project"
})
```

Expected result:
- ✅ No missing required files
- ✅ All module references valid
- ✅ No structural issues

## Module ID Conventions

Going forward, these module ID conventions are used:

| Module Path | Module ID | Category |
|-------------|-----------|----------|
| `modules/enterprise-standards/` | `""` (empty string) | enterprise-standards |
| `modules/project-controls/base/` | `base` | project-control |
| `modules/project-controls/regulated/` | `regulated` | project-control |
| `modules/stack-authorities/frontend/react-tailwind/` | `frontend/react-tailwind` | stack-authority |
| `modules/stack-authorities/backend/node-fastify/` | `backend/node-fastify` | stack-authority |
| `modules/stack-authorities/database/postgres/` | `database/postgres` | stack-authority |

## Build Status

- ✅ TypeScript compilation successful
- ✅ All type checks pass
- ✅ Ready for testing

## Next Steps

1. Restart your MCP server (Cursor may need to be restarted)
2. Test the installation with the commands above
3. Verify all enterprise standards files are properly installed
4. Report any issues
