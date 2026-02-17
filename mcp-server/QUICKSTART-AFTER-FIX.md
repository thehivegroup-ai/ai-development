# Quick Start: Using the MCP Server After Bug Fix

## Installation Command (Fixed)

Now you can successfully install enterprise standards along with your stack modules:

```javascript
install_environment({
  projectPath: "/Users/robertfiore/your-project",
  selection: {
    enterprise: "",  // ✅ Fixed: empty string now works correctly
    controls: ["base"],
    stacks: [
      "frontend/react-tailwind",
      "backend/node-fastify", 
      "database/postgres"
    ]
  },
  mode: "merge",
  writeProfile: true,
  writeLockfile: true
})
```

## What Gets Installed

### Enterprise Standards (ID: `""`)

**Rules (7 files):**
- `00-std-foundation.mdc` - Core development principles
- `01-std-solution-hermeneutic.mdc` - Problem-solution framing
- `02-std-planning-teleological.mdc` - Goal-oriented planning
- `03-std-quality-clean-test-deploy.mdc` - Quality gates
- `04-std-environment-config.mdc` - Environment & secrets management
- `05-std-documentation-organization.mdc` - Documentation standards
- `06-std-workflow-modes.mdc` - Development workflow modes

**Commands (5 files):**
- `std-clean-sweep.md` - Code cleanup workflow
- `std-deploy-release.md` - Deployment workflow
- `std-plan.md` - Planning workflow
- `std-solution.md` - Solution framing workflow
- `std-test-loop.md` - Testing workflow

**Agents (3 files):**
- `std-debugger.md` - Debugging specialist
- `std-planner.md` - Planning specialist
- `std-verifier.md` - Quality verification specialist

**Skills (3 modules):**
- `engineering-hygiene/` - Clean code practices
- `hermeneutic-solution/` - Problem framing methodology
- `teleological-planning/` - Goal-driven planning methodology

### Base Controls (ID: `base`)

**Rules:** `90-ctrl-base.mdc`
**Commands:** `ctrl.base.check.md`
**Agents:** `ctrl.base-verifier.md`
**Skills:** `project-basics/`

### Stack Authorities

Each stack provides technology-specific rules, commands, agents, and skills:

- **React + Tailwind** (`frontend/react-tailwind`)
- **Node.js + Fastify** (`backend/node-fastify`)
- **PostgreSQL** (`database/postgres`)
- **AWS** (`cloud/aws`)
- **GCP** (`cloud/gcp`)
- **Angular + Tailwind** (`frontend/angular-tailwind`)
- **Next.js + Tailwind** (`frontend/next-tailwind`)
- **Java** (`backend/java`)
- **SQL Server** (`database/sqlserver`)
- **Visual Parity Testing** (`testing/visual-parity`)

## Verification Steps

### 1. Check installed files

```bash
ls -R .cursor/
```

You should see:
```
.cursor/
├── rules/
│   ├── 00-std-foundation.mdc
│   ├── 01-std-solution-hermeneutic.mdc
│   ├── 02-std-planning-teleological.mdc
│   ├── 03-std-quality-clean-test-deploy.mdc
│   ├── 04-std-environment-config.mdc
│   ├── 05-std-documentation-organization.mdc
│   ├── 06-std-workflow-modes.mdc
│   ├── 90-ctrl-base.mdc
│   └── [stack-specific rules]
├── commands/
│   ├── std-clean-sweep.md
│   ├── std-deploy-release.md
│   ├── std-plan.md
│   ├── std-solution.md
│   ├── std-test-loop.md
│   └── [other commands]
├── agents/
│   ├── std-debugger.md
│   ├── std-planner.md
│   ├── std-verifier.md
│   └── [other agents]
└── skills/
    ├── engineering-hygiene/
    ├── hermeneutic-solution/
    ├── teleological-planning/
    └── [other skills]
```

### 2. Validate the installation

```javascript
validate_environment({
  projectPath: "/Users/robertfiore/your-project",
  strict: false
})
```

Should return:
```json
{
  "valid": true,
  "issues": [],
  "warnings": []
}
```

### 3. Check the lockfile

```bash
cat cursor.lock.json
```

Should show:
```json
{
  "source": {
    "repoUrl": "https://github.com/...",
    "ref": "main",
    "commitSha": "..."
  },
  "selection": {
    "enterprise": "",
    "controls": ["base"],
    "stacks": [...]
  },
  "generatedAt": "..."
}
```

### 4. Check the profile

```bash
cat stack.profile.json
```

Should match your selection:
```json
{
  "enterprise": "",
  "controls": ["base"],
  "stacks": [
    "frontend/react-tailwind",
    "backend/node-fastify",
    "database/postgres"
  ]
}
```

## Restart Required

After the MCP server rebuild, you may need to:

1. **Restart Cursor** - The MCP connection needs to pick up the new build
2. **Wait a few seconds** - MCP server initialization takes a moment
3. **Test with list_modules** - Verify connection is working

## Troubleshooting

### "Module not found" error

Make sure you're using the correct module IDs:
- Enterprise standards: `""` (empty string, not null)
- Controls: `"base"` or `"regulated"`
- Stacks: full path like `"frontend/react-tailwind"`

### Files not appearing

1. Check the diff first:
   ```javascript
   diff_environment({...})
   ```
2. Try with `mode: "overwrite"` instead of `"merge"`
3. Verify `.cursor/` directory permissions

### Validation warnings

If you see warnings about missing files:
1. Check if the module ID is correct
2. Try `update_environment` to refresh
3. Check git status - make sure modules aren't ignored

## Success Indicators

✅ All 7 enterprise standard rules installed  
✅ All 5 standard commands installed  
✅ All 3 standard agents installed  
✅ All 3 standard skills installed  
✅ Stack-specific modules merged correctly  
✅ No file collisions reported  
✅ `validate_environment` returns valid: true  
✅ Cursor rules appear in IDE
