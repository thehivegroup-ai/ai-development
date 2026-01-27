# Configuring the AI Development MCP Server in Cursor

This guide explains how to add the AI Development MCP server to your Cursor settings.

## Prerequisites

1. The MCP server is built: `cd mcp-server && npm install && npm run build`
2. You have Cursor installed
3. You know the absolute path to the MCP server

## Configuration Steps

### Method 1: Via Cursor Settings UI

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Search for "MCP" in settings
3. Click "Edit in settings.json" for MCP Servers
4. Add the configuration (see below)

### Method 2: Directly Edit settings.json

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Type "Preferences: Open User Settings (JSON)"
3. Add the MCP server configuration

## Configuration

Add this to your Cursor `settings.json`:

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

**Important:** Replace `/absolute/path/to/ai-development/` with the actual path on your system.

### Example Paths

**macOS/Linux:**
```json
"args": ["/Users/yourname/development/ai-development/mcp-server/dist/index.js"]
```

**Windows:**
```json
"args": ["C:\\Users\\yourname\\development\\ai-development\\mcp-server\\dist\\index.js"]
```

## Verification

1. Restart Cursor after adding the configuration
2. Open Cursor's developer console (Help > Toggle Developer Tools)
3. Look for "AI Development MCP Server" connection message
4. Try calling the `list_modules` tool from the AI agent

## Environment Variables

You can customize the server behavior with these environment variables:

- `DEFAULT_REPO_URL` - Default repository to use (default: `https://github.com/thehivegroup-ai/ai-development.git`)
- `DEFAULT_REF` - Default branch/tag to use (default: `main`)

## Troubleshooting

### Server Not Starting

**Check:**
1. Node.js is installed: `node --version` (requires Node 18+)
2. Server is built: Check that `mcp-server/dist/` exists
3. Path is correct and absolute (no `~` or relative paths)

### Cannot Find Module

**Solution:**
Run `cd mcp-server && npm install && npm run build` again.

### Permission Errors

**macOS/Linux:**
```bash
chmod +x mcp-server/dist/index.js
```

### Cache Issues

The server caches repositories in `~/.cache/ai-dev-mcp/`. To clear:

```bash
rm -rf ~/.cache/ai-dev-mcp/
```

## Usage Example

Once configured, you can use the server from Cursor's AI agent:

```
Agent: Call the list_modules tool to see available modules

Response:
{
  "commitSha": "abc123...",
  "modules": [
    {
      "id": "enterprise/enterprise-standards",
      "category": "enterprise-standards",
      "name": "Enterprise Standards",
      ...
    }
  ]
}
```

## Next Steps

See [mcp-server/README.md](../README.md) for:
- Available tools
- Tool parameters
- Response formats
- Development workflow
