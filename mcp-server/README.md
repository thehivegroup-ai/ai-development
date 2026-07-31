# AI Development MCP Server

MCP (Model Context Protocol) server for managing AI development modules (rules, commands, skills, agents) from the [ai-development](https://github.com/thehivegroup-ai/ai-development) repository.

## Architecture Overview

**Critical Distinction:**
- **Source:** `modules/` directory (rules, skills, agents, hooks defined here)
- **Distribution:** This MCP server (reads from `modules/`, installs to target projects)
- **Target:** User project `.cursor/` directory (where standards are deployed)

```
modules/ (source) → mcp-server (distribution) → your-project/.cursor/ (target)
```

The `.cursor/` directory in the `ai-development` repo itself is **for dogfooding only**, not distribution. See `../docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md` for details.

## Features

- **Module Discovery**: List and browse available modules from `modules/` directory
- **Installation Tools**: Install module configurations from `modules/` into project `.cursor/` directories
- **Multi-Editor**: Install into Cursor (`.cursor/`) or Claude Code (`.claude/`) — see [CLAUDE-CODE.md](./CLAUDE-CODE.md)
- **Version Control**: Support for branches, tags, and commit SHAs
- **Caching**: Local cache for fast repeated access
- **Validation**: Verify environment consistency and completeness

## Installation

```bash
cd mcp-server
npm install
npm run build
npm test      # optional: converter + hook adapter tests
```

## Configuration

Add to your Cursor MCP settings (typically `~/.cursor/config.json` or via Cursor Settings > MCP):

```json
{
  "mcpServers": {
    "ai-development": {
      "command": "node",
      "args": ["/absolute/path/to/ai-development/mcp-server/dist/index.js"],
      "env": {
        "DEFAULT_REPO_URL": "https://github.com/thehivegroup-ai/ai-development.git",
        "DEFAULT_REF": "main",
        "LOCAL_MODULES_REPO": "/absolute/path/to/your/ai-development-clone",
        "AI_DEVELOPMENT_REPO": "/absolute/path/to/your/ai-development-clone"
      }
    }
  }
}
```

### Registering with Claude Code

Claude Code reads its own MCP config, so register the server with the CLI instead
of editing a JSON file. `--scope user` makes it available in every project:

```bash
claude mcp add ai-development \
  --scope user \
  -e DEFAULT_REPO_URL=https://github.com/thehivegroup-ai/ai-development.git \
  -e DEFAULT_REF=main \
  -e LOCAL_MODULES_REPO=/absolute/path/to/your/ai-development-clone \
  -e AI_DEVELOPMENT_REPO=/absolute/path/to/your/ai-development-clone \
  -- node /absolute/path/to/ai-development/mcp-server/dist/index.js
```

Verify with `claude mcp get ai-development`. To install modules in the layout
Claude Code reads, pass `platform: "claude"` to `install_environment` — see
[CLAUDE-CODE.md](./CLAUDE-CODE.md).

### `LOCAL_MODULES_REPO` (optional)

Absolute path to a local **ai-development** clone (directory that contains `modules/`). When set, `list_modules`, `install_environment`, and related tools read this tree instead of the read-only cache. Use the same path as `AI_DEVELOPMENT_REPO` when you edit modules and sync from an app project.

Per-tool `localRepoPath` overrides this for a single call.

### `AI_DEVELOPMENT_REPO` (optional, for push / pull sync)

Absolute path to the same clone used for **`push_module_updates`** and **`sync_latest_environment`**. If omitted, those tools fall back to `LOCAL_MODULES_REPO`.

Authentication for `git push` / `git pull` is whatever you already use in that repo (SSH, credential helper, etc.). The server runs `git` locally; it does not store passwords or tokens.

### End-to-end: edit skills in an app project and publish

1. Clone **ai-development** on your machine and configure **`LOCAL_MODULES_REPO`** / **`AI_DEVELOPMENT_REPO`** to that path (often identical).
2. In another project (your app), run **`install_environment`** with `localRepoPath` pointing at your clone (or rely on env). This writes `.cursor/`, `stack.profile.json`, `cursor.lock.json`, and **`ai-development.sync-manifest.json`** (maps each installed file back to `modules/.../cursor/...` in the clone).
3. Edit files under **`.cursor/skills/`** (or other installed paths) in the app project.
4. Run **`push_module_updates`** with `projectPath` = app root, a **`commitMessage`**, and usually **`scope`: `"skills"`**. To publish **only** specific paths (one skill, one rule, `hooks.json`, etc.), pass **`onlyPaths`** relative to `.cursor/` (e.g. `["skills/my-skill/SKILL.md"]`, `["rules/20-web.mdc"]`). Use **`scope`: `"all"`** when pushing a single rule, hook, agent, or command. The tool copies into the clone, then **`git add` / `git commit` / `git push`** there. When using **`skillsTargetModuleId`** with **`scope`: `"skills"`**, **`ai-development.sync-manifest.json`** is not required (routing uses the named project module under `modules/projects/…`). Other pushes still need the manifest from **`install_environment`** / **`update_environment`**.
5. Other machines: set **`AI_DEVELOPMENT_REPO`** to their clone, run **`sync_latest_environment`** on their app project (`git pull --ff-only` in the clone, then refresh `.cursor/` from that tree).

### Initiative docs (`shared-context/`)

Per-initiative **`docs/`** and **`memory-bank/`** live under **`shared-context/<project-name>/`** (not root `docs/`, which documents this repo).

| Tool | Purpose |
|------|--------|
| `list_shared_context` | List initiatives under `shared-context/` in the clone (`hasDocs` / `hasMemoryBank`) |
| `push_shared_context` | Copy **`docsSourcePath`** and/or **`memoryBankSourcePath`** into `shared-context/<projectName>/`; optional **git commit + push** |

### Contributing workflow tools

| Tool | Purpose |
|------|--------|
| `push_module_updates` | Copy `.cursor/` edits into the clone per sync manifest; **git commit + push**. Optional **`onlyPaths`** (relative to `.cursor/`) limits to specific skills, rules, hooks, agents, or commands. For **skills** only, set **`skillsTargetModuleId`** (e.g. `projects/towerai`) to write `.cursor/skills/` into that module’s `cursor/skills/` and refresh **`module.json` → `provides.skills`**. |
| `sync_latest_environment` | **`git pull --ff-only`** in the clone; refresh this project’s `.cursor/` |
| `contribution_workflow` | Copy-paste git command outlines (manual alternative); optional `localClonePath`, `forkRemoteUrl`, `branchName` |
| `validate_module_sources` | Check `module.json` and layout under `modules/` in a clone |
| `git_contribution_status` | Read-only branch / ahead-behind / short status for the clone |

## Usage

### List Available Modules

Use the `list_modules` tool to discover what's available:

```typescript
// List all modules from main branch
{
  "repoUrl": "https://github.com/thehivegroup-ai/ai-development.git",
  "ref": "main"
}

// List only frontend stack authorities
{
  "ref": "main",
  "category": "stack-authority"
}

// Force refresh from remote
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
      "id": "frontend/react-tailwind",
      "category": "stack-authority",
      "name": "React + Tailwind",
      "description": "React conventions with Tailwind patterns",
      "path": "modules/stack-authorities/frontend/react-tailwind",
      "provides": {
        "rules": ["20-web-react-tailwind.mdc"],
        "commands": ["web.react.build-screen.md"],
        "skills": ["react-component-standards"],
        "agents": ["web.react-critic.md"]
      },
      "tags": ["frontend", "react", "tailwind"]
    }
  ]
}
```

## Architecture

### Directory Structure

```
mcp-server/
  src/
    index.ts              # MCP server entry point
    types.ts              # TypeScript type definitions
    git/
      fetcher.ts          # Git clone/fetch operations
    cache/
      manager.ts          # Cache directory management
    modules/
      scanner.ts          # Module discovery and scanning
```

### Caching Strategy

Repositories are cached at:
```
~/.cache/ai-dev-mcp/<hash(repoUrl)>/<commitSha>/
```

- Tags and commits are treated as immutable (cached indefinitely)
- Branches can be refreshed with `forceRefresh: true`

## Development

```bash
# Build
npm run build

# Watch mode
npm run watch

# Run
npm start

# Development mode (build + run)
npm run dev
```

## Roadmap

### Phase 1: Foundation ✅
- [x] Git operations
- [x] Module scanning
- [x] list_modules tool

### Phase 2: Resources ✅
- [x] MCP resources for module content
- [x] Resource URIs for rules, commands, skills, agents

### Phase 3: Installation Tools ✅
- [x] diff_environment tool
- [x] install_environment tool
- [x] Collision detection

### Phase 4: Management ✅
- [x] validate_environment tool
- [x] update_environment tool
- [x] module.json manifest support

### Phase 5: Polish ✅
- [x] Comprehensive error handling
- [x] Usage documentation
- [x] Configuration guide

## Contributing

This is part of the [ai-development](https://github.com/thehivegroup-ai/ai-development) monorepo.

## License

MIT
