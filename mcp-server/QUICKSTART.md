# Quick Start: AI Development MCP Server

Get up and running with the MCP server in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Cursor IDE installed
- Git installed

## Step 1: Build the Server (2 minutes)

```bash
cd /path/to/ai-development/mcp-server
npm install
npm run build
```

**Verify:** You should see `dist/` folder created with compiled JavaScript.

## Step 2: Configure Cursor (1 minute)

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Search for "MCP"
3. Click "Edit in settings.json"
4. Add this configuration:

```json
{
  "mcpServers": {
    "ai-development": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/ai-development/mcp-server/dist/index.js"],
      "env": {
        "DEFAULT_REPO_URL": "https://github.com/thehivegroup-ai/ai-development.git",
        "DEFAULT_REF": "main"
      }
    }
  }
}
```

**Important:** Replace `/ABSOLUTE/PATH/TO/` with your actual path!

**macOS/Linux example:**
```json
"args": ["/Users/yourname/development/ai-development/mcp-server/dist/index.js"]
```

**Windows example:**
```json
"args": ["C:\\Users\\yourname\\development\\ai-development\\mcp-server\\dist\\index.js"]
```

5. Save and restart Cursor

## Step 3: Verify Connection (30 seconds)

In Cursor, ask the AI:

```
Can you call the list_modules tool to show me available modules?
```

You should see a list of modules like:
- `enterprise/enterprise-standards`
- `frontend/react-tailwind`
- `backend/node-fastify`
- etc.

## Step 4: Install to a Project (1 minute)

Create or open a project, then ask the AI:

```
Install AI development modules to this project:
- Enterprise standards
- React + Tailwind frontend
- Fastify backend
- Postgres database

Use the install_environment tool with projectPath set to the current directory.
```

The AI will:
1. Compose the selected modules
2. Create `.cursor/` directory
3. Write rules, commands, skills, agents
4. Create `stack.profile.json` and `cursor.lock.json`

## Step 5: Start Using Workflows

In Cursor, try these commands:

```
/std-solution
```

Frame your problem before implementing.

```
/std-plan
```

Create a structured execution plan.

```
/web.react.build-screen
```

Build a React component with AI assistance.

---

## What You Just Set Up

Your project now has:

```
.cursor/
├── rules/           # Constraints (what must/mustn't be done)
├── commands/        # Workflows you can invoke with /command
├── skills/          # How-to guidance for the AI
└── agents/          # Specialized AI subagents

stack.profile.json   # Your module selection
cursor.lock.json     # Version pinning for reproducibility
```

---

## Common First Commands

| Command | What It Does |
|---------|--------------|
| `/std-solution` | Frame a problem before coding |
| `/std-plan` | Create execution plan |
| `/std-clean-sweep` | Clean and review changes |
| `/std-test-loop` | Run tests, fix failures |
| `/web.react.build-screen` | Build React UI |
| `/api.fastify.add-route` | Add API endpoint |
| `/db.postgres.migration` | Create DB migration |

---

## Troubleshooting

### "MCP server not connecting"

**Check:**
1. Path is absolute (no `~` or relative paths)
2. Server was built: `ls mcp-server/dist/index.js`
3. Node.js is installed: `node --version`

**Try:**
```bash
# Test server directly
cd mcp-server
node dist/index.js
```

### "Module not found" error

**Solution:**
```bash
cd mcp-server
npm install
npm run build
```

### "list_modules returns empty"

**Check:** 
- Internet connection (server needs to clone from GitHub)
- GitHub is accessible

**Try:**
```bash
# Clear cache
rm -rf ~/.cache/ai-dev-mcp/
```

---

## Next Steps

1. **Read the docs:**
   - `USAGE.md` - Complete tool reference
   - `CONFIGURATION.md` - Advanced setup
   - `README.md` - Architecture overview

2. **Explore modules:**
   ```
   Call list_modules to see all available modules
   ```

3. **Try different stacks:**
   - Next.js + Java + SQL Server + GCP
   - Angular + Fastify + Postgres
   - React + Java + Postgres + AWS

4. **Update your environment:**
   ```
   Call update_environment when new versions are released
   ```

---

## Example: Full Setup for React + Fastify App

```javascript
// 1. List available modules
list_modules({ ref: "main" })

// 2. Preview installation
diff_environment({
  projectPath: "/path/to/my-app",
  selection: {
    enterprise: "enterprise/enterprise-standards",
    controls: ["controls/base"],
    stacks: [
      "frontend/react-tailwind",
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
})

// 3. Install
install_environment({
  projectPath: "/path/to/my-app",
  ref: "main",
  selection: { /* same as above */ }
})

// 4. Validate
validate_environment({
  projectPath: "/path/to/my-app"
})
```

---

## That's It!

You're ready to use AI development workflows with Cursor. 🎉

**Need help?** Check `USAGE.md` for complete documentation.
