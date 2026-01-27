# AI Development MCP Server - Usage Guide

Complete guide to using the MCP server tools for managing AI development modules.

## Tools Overview

The server provides 5 main tools:

1. **list_modules** - Discover available modules
2. **diff_environment** - Preview changes before applying
3. **install_environment** - Install modules into a project
4. **validate_environment** - Check environment health
5. **update_environment** - Update from lockfile/profile

---

## Tool 1: list_modules

**Purpose:** Discover what modules are available in the repository.

### Parameters

```typescript
{
  repoUrl?: string;      // Optional, defaults to configured repo
  ref?: string;          // Optional, defaults to 'main'
  category?: string;     // Optional filter: 'enterprise-standards', 'stack-authority', 'project-control'
  forceRefresh?: boolean; // Optional, force refresh from remote
}
```

### Examples

**List all modules:**
```json
{
  "ref": "main"
}
```

**List only frontend stack authorities:**
```json
{
  "ref": "main",
  "category": "stack-authority"
}
```

**List from a specific tag:**
```json
{
  "ref": "v1.0.0",
  "forceRefresh": true
}
```

### Response Format

```json
{
  "commitSha": "abc123...",
  "repoUrl": "https://github.com/thehivegroup-ai/ai-development.git",
  "ref": "main",
  "modules": [
    {
      "id": "enterprise/enterprise-standards",
      "category": "enterprise-standards",
      "name": "Enterprise Standards",
      "description": "Core workflow standards",
      "path": "modules/enterprise-standards",
      "provides": {
        "rules": ["00-std-foundation.mdc", "01-std-solution-hermeneutic.mdc", ...],
        "commands": ["std.solution.md", "std.plan.md", ...],
        "skills": ["hermeneutic-solution", "teleological-planning", ...],
        "agents": ["std.planner.md", "std.verifier.md", ...]
      },
      "requires": [],
      "tags": ["enterprise", "core"]
    },
    {
      "id": "frontend/react-tailwind",
      "category": "stack-authority",
      "name": "React + Tailwind",
      "description": "React conventions with Tailwind patterns",
      "path": "modules/stack-authorities/frontend/react-tailwind",
      "provides": {
        "rules": ["20-web-react-tailwind.mdc"],
        "commands": ["web.react.build-screen.md", "web.react.compare-screens.md"],
        "skills": ["react-component-standards", "react-tailwind-conventions"],
        "agents": ["web.react-critic.md"]
      },
      "tags": ["frontend", "react", "tailwind"]
    }
  ]
}
```

---

## Tool 2: diff_environment

**Purpose:** Preview what would change in a project without applying it.

### Parameters

```typescript
{
  projectPath: string;  // REQUIRED: Absolute path to project
  repoUrl?: string;     // Optional
  ref?: string;         // Optional
  selection: {          // REQUIRED: Module selection
    enterprise: string;
    controls: string[];
    stacks: string[];
  }
}
```

### Example

```json
{
  "projectPath": "/Users/me/my-project",
  "ref": "main",
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": [
      "frontend/react-tailwind",
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
}
```

### Response Format

```json
{
  "commitSha": "abc123...",
  "repoUrl": "https://github.com/thehivegroup-ai/ai-development.git",
  "ref": "main",
  "plan": {
    "added": [
      "rules/00-std-foundation.mdc",
      "rules/20-web-react-tailwind.mdc",
      "commands/std.solution.md"
    ],
    "modified": [
      "rules/30-api-node-fastify.mdc"
    ],
    "removed": [
      "rules/old-rule.mdc"
    ],
    "unchanged": [
      "skills/hermeneutic-solution/SKILL.md"
    ],
    "collisions": []
  },
  "applied": false
}
```

---

## Tool 3: install_environment

**Purpose:** Install or update module configuration in a project.

### Parameters

```typescript
{
  projectPath: string;  // REQUIRED
  repoUrl?: string;
  ref?: string;
  selection: {          // REQUIRED
    enterprise: string;
    controls: string[];
    stacks: string[];
  };
  mode?: 'merge' | 'overwrite';  // Default: 'merge'
  writeProfile?: boolean;         // Default: true
  writeLockfile?: boolean;        // Default: true
  dryRun?: boolean;              // Default: false
}
```

### Mode Options

- **merge**: Keep existing files, only add/update from modules
- **overwrite**: Remove `.cursor/` and replace entirely

### Example: Fresh Installation

```json
{
  "projectPath": "/Users/me/my-project",
  "ref": "v1.0.0",
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": [
      "frontend/react-tailwind",
      "backend/node-fastify"
    ]
  },
  "mode": "merge",
  "writeProfile": true,
  "writeLockfile": true
}
```

### Example: Dry Run (Preview Only)

```json
{
  "projectPath": "/Users/me/my-project",
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": ["frontend/react-tailwind"]
  },
  "dryRun": true
}
```

### What Gets Created

After running `install_environment`, your project will have:

```
my-project/
├── .cursor/
│   ├── rules/
│   │   ├── 00-std-foundation.mdc
│   │   ├── 20-web-react-tailwind.mdc
│   │   └── ...
│   ├── commands/
│   │   ├── std.solution.md
│   │   ├── web.react.build-screen.md
│   │   └── ...
│   ├── skills/
│   │   ├── hermeneutic-solution/
│   │   │   └── SKILL.md
│   │   └── ...
│   └── agents/
│       ├── std.planner.md
│       └── ...
├── stack.profile.json
└── cursor.lock.json
```

### Response Format

```json
{
  "commitSha": "abc123...",
  "repoUrl": "https://github.com/thehivegroup-ai/ai-development.git",
  "ref": "v1.0.0",
  "plan": {
    "added": [...],
    "modified": [...],
    "removed": [...],
    "unchanged": [...],
    "collisions": []
  },
  "applied": true,
  "message": "Installation completed successfully"
}
```

---

## Tool 4: validate_environment

**Purpose:** Check that `.cursor/` environment is properly structured and valid.

### Parameters

```typescript
{
  projectPath: string;  // REQUIRED
  strict?: boolean;     // Default: false (warnings become errors in strict mode)
}
```

### Example

```json
{
  "projectPath": "/Users/me/my-project",
  "strict": false
}
```

### Response Format

```json
{
  "valid": true,
  "issues": [],
  "warnings": [
    {
      "code": "NO_LOCKFILE",
      "message": "cursor.lock.json not found (recommended)",
      "path": "cursor.lock.json",
      "severity": "warning"
    }
  ]
}
```

### Validation Checks

**Errors (fail validation):**
- `.cursor/` directory missing or not a directory
- Subdirectories exist but are files instead
- Skills folders missing `SKILL.md`
- Invalid JSON in `stack.profile.json` or `cursor.lock.json`
- Malformed lockfile structure

**Warnings (noted but don't fail):**
- Missing subdirectories (`rules/`, `commands/`, `skills/`, `agents/`)
- Missing `stack.profile.json` or `cursor.lock.json`
- Wrong file extensions (`.mdc` for rules, `.md` for commands)

---

## Tool 5: update_environment

**Purpose:** Update project environment based on existing lockfile or profile.

### Parameters

```typescript
{
  projectPath: string;  // REQUIRED
  repoUrl?: string;     // Optional, read from lockfile if omitted
  ref?: string;         // Optional, read from lockfile if omitted
  mode?: 'merge' | 'overwrite';  // Default: 'merge'
  dryRun?: boolean;     // Default: false
}
```

### How It Works

1. Reads `cursor.lock.json` for source repo and ref
2. Reads `stack.profile.json` for module selection
3. Fetches modules at the specified ref
4. Applies updates

### Example: Update to Latest

```json
{
  "projectPath": "/Users/me/my-project",
  "ref": "v2.0.0"
}
```

### Example: Update from Lockfile

```json
{
  "projectPath": "/Users/me/my-project"
}
```

This will use the repo/ref from `cursor.lock.json` and selection from `stack.profile.json`.

---

## Common Workflows

### Workflow 1: Set Up a New Project

```bash
# Step 1: Discover available modules
# Call: list_modules with ref="main"

# Step 2: Preview installation
# Call: diff_environment with your selection

# Step 3: Install
# Call: install_environment with your selection
```

### Workflow 2: Update Existing Project

```bash
# Step 1: Check current state
# Call: validate_environment

# Step 2: Preview update
# Call: update_environment with dryRun=true

# Step 3: Apply update
# Call: update_environment
```

### Workflow 3: Switch to Specific Version

```bash
# Step 1: Preview switch
# Call: diff_environment with ref="v1.5.0"

# Step 2: Install
# Call: install_environment with ref="v1.5.0"
```

---

## Error Handling

### Collision Errors

If modules provide the same file with different content:

```json
{
  "error": "Collision detected",
  "collisions": [
    {
      "path": "rules/20-web-component.mdc",
      "modules": ["frontend/react-tailwind", "frontend/angular-tailwind"]
    }
  ]
}
```

**Solution:** Don't select conflicting modules together, or ensure modules follow naming conventions.

### Module Not Found

```json
{
  "error": "Stack module not found: frontend/invalid-module"
}
```

**Solution:** Run `list_modules` to see available modules.

### Invalid Project Path

```json
{
  "error": "projectPath is required"
}
```

**Solution:** Provide absolute path to your project directory.

---

## File Formats

### stack.profile.json

```json
{
  "enterprise": "enterprise/enterprise-standards",
  "controls": ["controls/base"],
  "stacks": [
    "frontend/react-tailwind",
    "backend/node-fastify",
    "database/postgres",
    "cloud/aws"
  ]
}
```

### cursor.lock.json

```json
{
  "source": {
    "repoUrl": "https://github.com/thehivegroup-ai/ai-development.git",
    "ref": "v1.0.0",
    "commitSha": "abc123def456..."
  },
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": ["frontend/react-tailwind"]
  },
  "generatedAt": "2026-01-26T12:00:00.000Z"
}
```

---

## Tips & Best Practices

### 1. Always Use Refs for Production

Use tags or commit SHAs for production projects:

```json
{
  "ref": "v1.0.0"  // Good
}
```

Not:

```json
{
  "ref": "main"  // Risky for production (changes over time)
}
```

### 2. Preview Before Installing

Always use `diff_environment` or `dryRun: true` before applying changes:

```json
{
  "dryRun": true
}
```

### 3. Validate After Installation

Run `validate_environment` after installation to ensure everything is correct:

```json
{
  "projectPath": "/Users/me/my-project",
  "strict": true
}
```

### 4. Keep Lockfiles

Always write lockfiles for reproducible builds:

```json
{
  "writeLockfile": true
}
```

### 5. Use Merge Mode

Prefer `merge` over `overwrite` to preserve custom project files:

```json
{
  "mode": "merge"
}
```

---

## Troubleshooting

### "Cannot resolve ref to commit SHA"

**Cause:** Branch, tag, or commit doesn't exist.

**Solution:** Check the ref name, or use `forceRefresh: true`.

### "Module not found"

**Cause:** Module ID is incorrect or doesn't exist at this ref.

**Solution:** Run `list_modules` to see available modules.

### "Collision detected"

**Cause:** Multiple modules provide same file with different content.

**Solution:** Don't combine conflicting modules. Follow naming conventions.

### "stack.profile.json not found"

**Cause:** Using `update_environment` without a profile file.

**Solution:** Either create `stack.profile.json` or use `install_environment` instead.

---

## Examples by Stack

### React + Fastify + Postgres + AWS

```json
{
  "projectPath": "/Users/me/my-app",
  "ref": "main",
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": [
      "frontend/react-tailwind",
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
}
```

### Next.js + Java + SQL Server + GCP

```json
{
  "projectPath": "/Users/me/my-app",
  "ref": "main",
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base", "controls/regulated"],
    "stacks": [
      "frontend/next-tailwind",
      "backend/java",
      "database/sqlserver",
      "cloud/gcp"
    ]
  }
}
```

### Angular + Fastify + Postgres

```json
{
  "projectPath": "/Users/me/my-app",
  "ref": "main",
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": [
      "frontend/angular-tailwind",
      "backend/node-fastify",
      "database/postgres"
    ]
  }
}
```
