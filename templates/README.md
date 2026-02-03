# Stack Configuration Templates

This directory contains templates for configuring your project's technology stack and customizations.

## Files

### stack.profile.json
Defines which modules to install in your project.

**Purpose:** Select your technology stack  
**Required:** Yes (for MCP server installation)  
**Location:** Project root

**Structure:**
```json
{
  "enterprise": "",
  "controls": ["base"],
  "stacks": [
    "frontend/react-tailwind",
    "backend/node-fastify",
    "database/postgres",
    "cloud/aws"
  ]
}
```

### stack.override.json
Customizes or extends module configurations.

**Purpose:** Project-specific overrides  
**Required:** No  
**Location:** Project root

**Use when:**
- Adding project-specific rules
- Customizing commands for your infrastructure
- Extending skills with project examples
- Team-specific conventions

### module.json
Template for creating new modules.

**Purpose:** Module metadata and dependencies  
**Required:** Yes (for new modules)  
**Location:** Module root directory

**Use when:**
- Creating new stack authority modules
- Adding custom project control modules
- Contributing back to the repository

## Quick Start

### 1. Create Your Stack Profile

```bash
# Copy template
cp templates/stack.profile.json your-project/stack.profile.json

# Edit and remove documentation fields (_comment, _*, etc.)
# Keep only: enterprise, controls, stacks
```

### 2. Install Using MCP Server

```javascript
install_environment({
  projectPath: "/path/to/your-project",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: [...]
  }
})
```

### 3. (Optional) Add Overrides

```bash
# If you need customizations
cp templates/stack.override.json your-project/stack.override.json
# Edit as needed
```

## Examples

See the `examples/` directory for complete working configurations:

- **react-fastify-postgres-aws/** - Modern JavaScript stack
- **next-java-sqlserver-gcp/** - Enterprise with regulated controls
- **angular-fastify-postgres-aws/** - Angular application

Each example includes:
- Working `stack.profile.json`
- Comprehensive README
- Expected file structure
- Workflow examples

## Available Modules

### Enterprise Standards (Required)
- **ID:** `""`
- Always include this

### Project Controls
- `base` - Baseline quality (recommended)
- `regulated` - Additional security/compliance

### Frontend
- `frontend/react-tailwind` - React + Tailwind CSS
- `frontend/next-tailwind` - Next.js + Tailwind CSS
- `frontend/angular-tailwind` - Angular + Tailwind CSS

### Backend
- `backend/node-fastify` - Node.js + Fastify
- `backend/java` - Java + Spring Boot

### Database
- `database/postgres` - PostgreSQL
- `database/sqlserver` - SQL Server

### Cloud
- `cloud/aws` - Amazon Web Services
- `cloud/gcp` - Google Cloud Platform

### Testing
- `testing/visual-parity` - Playwright visual testing

## Common Combinations

### Modern Web App
```json
{
  "enterprise": "",
  "controls": ["base"],
  "stacks": [
    "frontend/react-tailwind",
    "backend/node-fastify",
    "database/postgres",
    "cloud/aws"
  ]
}
```

### Enterprise Application
```json
{
  "enterprise": "",
  "controls": ["base", "regulated"],
  "stacks": [
    "frontend/next-tailwind",
    "backend/java",
    "database/sqlserver",
    "cloud/gcp"
  ]
}
```

### Frontend Only
```json
{
  "enterprise": "",
  "controls": ["base"],
  "stacks": [
    "frontend/react-tailwind"
  ]
}
```

### API Only
```json
{
  "enterprise": "",
  "controls": ["base"],
  "stacks": [
    "backend/node-fastify",
    "database/postgres",
    "cloud/aws"
  ]
}
```

## Validation

Use the MCP server to validate your configuration:

```javascript
select_modules({
  validateOnly: true,
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: [...]
  }
})
```

This will:
- Check module IDs are valid
- Resolve dependencies automatically
- Report missing requirements
- Show total capabilities

## Module Creation

To create a new module:

1. Copy `module.json` template
2. Fill in metadata:
   - `id` - Unique identifier
   - `name` - Human-readable name
   - `description` - What it provides
   - `provides` - Files it contains
   - `requires` - Dependencies
3. Create `cursor/` directory structure
4. Add rules, commands, skills, agents
5. Validate with `scripts/validate-manifests.ts`

## Override Examples

### Disable a Rule
```json
{
  "rules": {
    "disable_tailwind": {
      "path": ".cursor/rules/20-web-react-tailwind.mdc",
      "enabled": false,
      "reason": "Using custom CSS framework"
    }
  }
}
```

### Add Custom Command
```json
{
  "commands": {
    "staging_deploy": {
      "path": ".cursor/commands/project.deploy-staging.md",
      "content": "# Deploy to Staging\n\n..."
    }
  }
}
```

### Extend Skill References
```json
{
  "skills": {
    "add_examples": {
      "skill": "react-component-standards",
      "references": [{
        "path": "references/our-components.md",
        "content": "# Our Component Patterns\n\n..."
      }]
    }
  }
}
```

## Best Practices

### DO:
✅ Version control your `stack.profile.json`  
✅ Document overrides with `reason` field  
✅ Test configuration before committing  
✅ Use MCP server for validation  
✅ Check examples for reference

### DON'T:
❌ Edit source modules directly  
❌ Override without documentation  
❌ Disable security in regulated environments  
❌ Select incompatible modules  
❌ Commit secrets in overrides

## Troubleshooting

### Module Not Found
Check spelling and case sensitivity of module IDs

### Dependency Errors
Use MCP server to automatically resolve dependencies

### File Conflicts
Use conflict resolution strategies in install_environment

### Validation Fails
Run validation script: `npm run validate` in scripts/

## Support

- See main README: `/Users/robertfiore/development/ai-development/README.md`
- Check examples: `/Users/robertfiore/development/ai-development/examples/`
- MCP server docs: `/Users/robertfiore/development/ai-development/mcp-server/README.md`
