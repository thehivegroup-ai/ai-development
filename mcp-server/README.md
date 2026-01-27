# AI Development MCP Server

MCP (Model Context Protocol) server for managing AI development modules (rules, commands, skills, agents) from the [ai-development](https://github.com/thehivegroup-ai/ai-development) repository.

## Features

- **Module Discovery**: List and browse available modules from Git repository
- **Installation Tools**: Install module configurations into project `.cursor/` directories
- **Version Control**: Support for branches, tags, and commit SHAs
- **Caching**: Local cache for fast repeated access
- **Validation**: Verify environment consistency and completeness

## Installation

```bash
cd mcp-server
npm install
npm run build
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
        "DEFAULT_REF": "main"
      }
    }
  }
}
```

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
