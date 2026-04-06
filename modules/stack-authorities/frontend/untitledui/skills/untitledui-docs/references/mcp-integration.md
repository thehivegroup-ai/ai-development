# Untitled UI MCP Integration

Complete guide for Model Context Protocol server integration with Untitled UI.

## Overview

The Untitled UI MCP server enables AI assistants (Claude Code, Cursor, Codex, etc.) to discover, browse, and install React components through natural language.

**MCP Server URL**: `https://www.untitledui.com/react/api/mcp`  
**Server Name**: `untitledui`  
**Transport**: HTTP (streamable_http)

## Authentication Methods

The MCP server supports three authentication approaches:

### 1. OAuth 2.1 with PKCE (Recommended)

Supported by Claude Code and other MCP clients with OAuth capability.

**Benefits**:
- No manual API key management
- Automatic session refresh
- Browser-based login flow
- Most secure method

**Setup**:
```bash
# Claude Code
claude mcp add untitledui --transport http https://www.untitledui.com/react/api/mcp
```

When you access PRO components, the client will:
1. Prompt you to authenticate via browser
2. Handle OAuth flow automatically
3. Store and refresh tokens as needed

### 2. API Key Header

For MCP clients without OAuth support.

**Setup**:
```bash
# Claude Code with API key
claude mcp add --transport http untitledui \
  https://www.untitledui.com/react/api/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

**Get your API key**: https://www.untitledui.com/react/account/api-keys

### 3. No Authentication (Free Components Only)

Access free components without authentication.

**Setup**:
```bash
# No auth required for free components
claude mcp add --transport http untitledui \
  https://www.untitledui.com/react/api/mcp
```

## Installation by Client

### Claude Code

**With OAuth (recommended)**:
```bash
claude mcp add untitledui --transport http \
  https://www.untitledui.com/react/api/mcp
```

**With API key**:
```bash
claude mcp add --transport http untitledui \
  https://www.untitledui.com/react/api/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

**Verify**:
```bash
claude mcp list
```

### Cursor

**Manual configuration** in Cursor settings:

1. Open Cursor Settings
2. Navigate to MCP Servers
3. Add new server:
   - Name: `untitledui`
   - URL: `https://www.untitledui.com/react/api/mcp`
   - Transport: HTTP
   - (Optional) Add header: `Authorization: Bearer YOUR_API_KEY`

**Or edit `~/.cursor/mcp.json`**:
```json
{
  "mcpServers": {
    "untitledui": {
      "type": "http",
      "url": "https://www.untitledui.com/react/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Codex

**With OAuth**:
```bash
codex mcp add untitledui --url https://www.untitledui.com/react/api/mcp
```

**With API key**:
```bash
codex mcp add untitledui \
  --url https://www.untitledui.com/react/api/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

### Other MCP Clients

Any MCP-compatible client can connect using:

**Connection details**:
- **URL**: `https://www.untitledui.com/react/api/mcp`
- **Transport**: HTTP
- **Authentication**: OAuth 2.1 or Bearer token header

## Available Tools

### 1. `list_components`

List components by category with pagination.

**Parameters**:
- `category` (optional): Filter by base/application/marketing/foundations/shared-assets/examples
- `skip` (optional): Pagination offset (default: 0)
- `limit` (optional): Results per page (default: 100)
- `key` (optional): API key for PRO access

**Returns**:
```json
{
  "components": [...],
  "total": 300,
  "skip": 0,
  "limit": 100,
  "has_more": true
}
```

**Example usage**:
```typescript
// List all base components
await callMcpTool("untitledui", "list_components", {
  category: "base"
});

// List with pagination
await callMcpTool("untitledui", "list_components", {
  category: "application",
  skip: 100,
  limit: 50
});
```

### 2. `search_components`

Search components by name, description, or functionality.

**Parameters**:
- `query` (required): Search term
- `category_filter` (optional): Category filter
- `limit` (optional): Max results (default: 20)
- `key` (optional): API key for PRO access

**Returns**:
```json
{
  "results": [
    {
      "name": "button",
      "title": "Button",
      "description": "Clickable button component with variants",
      "category": "base",
      "access": "public"
    }
  ],
  "total": 15
}
```

**Example usage**:
```typescript
// Search for form components
await callMcpTool("untitledui", "search_components", {
  query: "form input"
});

// Search in specific category
await callMcpTool("untitledui", "search_components", {
  query: "navigation",
  category_filter: "marketing"
});
```

### 3. `get_component`

Get component metadata and CLI installation command.

**Parameters**:
- `component_name` (required): Component name
- `key` (optional): API key for PRO components

**Returns**:
```json
{
  "name": "button",
  "title": "Button",
  "description": "Clickable button with variants",
  "category": "base",
  "access": "public",
  "dependencies": ["icon"],
  "cli_command": "npx untitledui@latest add button --yes"
}
```

**Example usage**:
```typescript
// Get button component
const component = await callMcpTool("untitledui", "get_component", {
  component_name: "button"
});

// Execute the CLI command
await shell(component.cli_command);
```

### 4. `get_component_bundle`

Get multiple components with single installation command.

**Parameters**:
- `component_names` (required): Array of component names
- `key` (optional): API key for PRO components

**Returns**:
```json
{
  "components": [...],
  "cli_command": "npx untitledui@latest add button input select --yes"
}
```

**Example usage**:
```typescript
// Get form components bundle
const bundle = await callMcpTool("untitledui", "get_component_bundle", {
  component_names: ["button", "input", "select", "checkbox"]
});

// Execute the bundle installation
await shell(bundle.cli_command);
```

### 5. `get_page_templates` (PRO)

Browse available page templates.

**Parameters**:
- `category` (optional): Filter by template category
- `key` (required): API key

**Returns**:
```json
{
  "templates": [
    {
      "id": "dashboards-01",
      "title": "Analytics Dashboard",
      "description": "Dashboard with sidebar, charts, and metrics",
      "category": "application",
      "variants": ["01", "02", "03"]
    }
  ]
}
```

**Example usage**:
```typescript
// List all dashboard templates
await callMcpTool("untitledui", "get_page_templates", {
  category: "application",
  key: API_KEY
});
```

### 6. `get_page_template_files` (PRO)

Get page template files and installation command.

**Parameters**:
- `template_id` (required): Template identifier (e.g., "dashboards-01/01")
- `key` (required): API key

**Returns**:
```json
{
  "template_id": "dashboards-01/01",
  "title": "Analytics Dashboard",
  "files": [...],
  "components": [...],
  "cli_command": "npx untitledui@latest example dashboards-01/01 --yes"
}
```

**Example usage**:
```typescript
// Get dashboard template
const template = await callMcpTool("untitledui", "get_page_template_files", {
  template_id: "dashboards-01/01",
  key: API_KEY
});

// Execute installation
await shell(template.cli_command);
```

## Available Resources

The MCP server provides browseable resources:

### Resource URIs

- `untitledui://components` - All components overview
- `untitledui://components/base` - Base UI components
- `untitledui://components/application` - Application components
- `untitledui://components/marketing` - Marketing components
- `untitledui://templates` - Page templates
- `untitledui://examples` - Usage examples

### Accessing Resources

```typescript
// List available resources
await listMcpResources("untitledui");

// Fetch specific resource
await fetchMcpResource("untitledui", "untitledui://components/base");
```

## Integration Workflows

### Workflow 1: Discover and Install Component

```typescript
// 1. User asks: "Add a button to my project"

// 2. Search for the component
const results = await callMcpTool("untitledui", "search_components", {
  query: "button"
});

// 3. Get component details
const component = await callMcpTool("untitledui", "get_component", {
  component_name: "button"
});

// 4. Execute installation
await shell(component.cli_command);

// 5. Respond with success and usage example
```

### Workflow 2: Build Complete Page

```typescript
// 1. User asks: "Create a dashboard with charts and metrics"

// 2. Search for dashboard templates
const templates = await callMcpTool("untitledui", "get_page_templates", {
  category: "application",
  key: API_KEY
});

// 3. Show options and get user selection
// User selects: "dashboards-01"

// 4. Install template
const template = await callMcpTool("untitledui", "get_page_template_files", {
  template_id: "dashboards-01/01",
  key: API_KEY
});

await shell(template.cli_command);

// 5. Explain what was installed
```

### Workflow 3: Multiple Component Installation

```typescript
// 1. User asks: "Add form components for a contact form"

// 2. Search for form-related components
const results = await callMcpTool("untitledui", "search_components", {
  query: "form input"
});

// 3. Identify needed components: input, textarea, button, select

// 4. Get bundle
const bundle = await callMcpTool("untitledui", "get_component_bundle", {
  component_names: ["input", "textarea", "button", "select"]
});

// 5. Execute single installation command
await shell(bundle.cli_command);

// 6. Provide form implementation example
```

### Workflow 4: Browse and Discover

```typescript
// 1. User asks: "What components do you have for navigation?"

// 2. Search components
const results = await callMcpTool("untitledui", "search_components", {
  query: "navigation"
});

// 3. List results with descriptions and access levels
// - sidebar-navigation (PRO)
// - header-navigation (PRO)
// - breadcrumb (Free)
// - tabs (Free)
// - dropdown (Free)

// 4. Explain options and help user choose
```

## Free vs PRO Access

### With No Authentication (Free)
- ✓ Base components (buttons, inputs, badges)
- ✓ Core application components (tables, basic charts)
- ✓ 1,100+ line-style icons
- ✗ Advanced application components (modals, slideouts)
- ✗ Marketing components (all)
- ✗ Page templates (all)
- ✗ PRO icon styles

### With API Key (PRO)
- ✓ All base component variants
- ✓ All application components
- ✓ All marketing components
- ✓ All page templates
- ✓ 4,600+ icons (4 styles)
- ✓ Priority support

Each component in API responses includes an `access` field:
- `"public"` - Free tier
- `"pro"` - Requires authentication

## Error Handling

### Common Errors

**PRO Access Required**:
```json
{
  "error": "PRO access required for this component",
  "component": "modal",
  "upgrade_url": "https://www.untitledui.com/buy/react"
}
```

**Response**: Inform user they need PRO access and provide upgrade link.

**Component Not Found**:
```json
{
  "error": "Component not found",
  "component": "invalid-name",
  "suggestion": "Did you mean: button?"
}
```

**Response**: Show suggestion or search for alternatives.

**Authentication Failed**:
```json
{
  "error": "Invalid API key"
}
```

**Response**: Ask user to verify their API key or re-authenticate.

## Best Practices

### 1. Token Efficiency
- Use `search_components` before `list_components` when user has specific need
- Use `get_component_bundle` for multiple components instead of individual calls
- Execute CLI commands directly instead of reading component source

### 2. User Experience
- Show component descriptions when presenting options
- Indicate which components are PRO vs free
- Explain what will be installed before executing
- Provide usage examples after installation

### 3. Error Recovery
- If search returns no results, try broader query or list by category
- If PRO component fails, explain upgrade path clearly
- If installation fails, check prerequisites (project initialized, correct directory)

### 4. Progressive Enhancement
- Start with free components when possible
- Suggest PRO alternatives when they add value
- Group related component installations into bundles

## Troubleshooting

### MCP Connection Issues

**Symptom**: Tools not available in AI assistant

**Solutions**:
1. Verify server configuration in client settings
2. Check URL is exactly: `https://www.untitledui.com/react/api/mcp`
3. Ensure transport is set to HTTP
4. Try removing and re-adding server

### Authentication Issues

**Symptom**: PRO components return access denied

**Solutions**:
1. Verify API key is valid at https://www.untitledui.com/react/account
2. Check header format: `Authorization: Bearer YOUR_KEY`
3. Try re-authenticating with OAuth flow
4. Ensure PRO subscription is active

### CLI Command Failures

**Symptom**: CLI command from MCP returns error

**Solutions**:
1. Check project is initialized: `npx untitledui@latest init`
2. Verify Node.js version (18+ required)
3. Ensure running from project root directory
4. Check for file conflicts (use `--overwrite` if needed)

### Component Not Found

**Symptom**: Search returns no results

**Solutions**:
1. Try broader search terms ("nav" instead of "navigation bar")
2. List all components in category to browse
3. Check spelling of component name
4. Verify component exists in Untitled UI library

## Testing MCP Integration

### Manual Testing

```bash
# 1. Add MCP server
claude mcp add untitledui --transport http \
  https://www.untitledui.com/react/api/mcp

# 2. Verify connection
claude mcp list

# 3. Test in Claude Code
claude code

# In chat:
# "Search for button components in Untitled UI"
# "Add the button component to my project"
# "Show me all marketing components"
```

### Validation Checklist

- [ ] MCP server appears in server list
- [ ] Search returns results for common queries
- [ ] List returns paginated component lists
- [ ] Get component returns installation commands
- [ ] Bundle works with multiple components
- [ ] PRO components require authentication
- [ ] Free components work without authentication
- [ ] CLI commands execute successfully
- [ ] Components install to correct paths

## Advanced Configuration

### Custom Headers

Add custom headers for tracking or additional auth:

```json
{
  "mcpServers": {
    "untitledui": {
      "type": "http",
      "url": "https://www.untitledui.com/react/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY",
        "X-Client-ID": "your-client-id",
        "X-Session-ID": "session-tracking-id"
      }
    }
  }
}
```

### Environment-Specific Configuration

Use different configs for dev/staging/prod:

```bash
# Development (free components only)
MCP_ENV=dev claude mcp add untitledui-dev \
  --transport http https://www.untitledui.com/react/api/mcp

# Production (with PRO access)
MCP_ENV=prod claude mcp add untitledui-prod \
  --transport http https://www.untitledui.com/react/api/mcp \
  --header "Authorization: Bearer $PROD_API_KEY"
```

### Rate Limiting

The MCP server implements rate limiting:

- **Free tier**: 100 requests/hour
- **PRO tier**: 1000 requests/hour

Responses include rate limit headers:
- `X-RateLimit-Limit`: Max requests per hour
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Migration Notes

### From Direct CLI to MCP

**Before (manual CLI)**:
```bash
npx untitledui@latest add button
```

**After (via MCP)**:
```typescript
// AI assistant handles discovery and execution
const component = await callMcpTool("untitledui", "get_component", {
  component_name: "button"
});
await shell(component.cli_command);
```

### From Web Docs to MCP

**Before**: Copy component code from web docs

**After**: Use MCP to search, discover, and install directly

Benefits:
- No manual copying
- Always latest version
- Automatic dependency resolution
- Proper project integration

## Support and Resources

- **Documentation**: https://www.untitledui.com/react/docs
- **MCP Integration Guide**: https://www.untitledui.com/react/integrations/mcp
- **API Reference**: https://www.untitledui.com/react/docs/api
- **Component Library**: https://www.untitledui.com/react/components
- **Support**: support@untitledui.com
