# Untitled UI CLI Reference

Complete reference for the Untitled UI command-line interface tool.

## Installation

No installation required. The CLI is available via npx/bunx:

```bash
npx untitledui@latest [command]
bunx untitledui@latest [command]
```

## Commands Overview

| Command | Purpose | Free/PRO |
|---------|---------|----------|
| `init` | Initialize new project with Untitled UI | Free |
| `add` | Add components to existing project | Free + PRO |
| `example` | Add complete page examples | PRO |
| `login` | Authenticate for PRO access | PRO |

## Init Command

Initialize a new project with Untitled UI pre-configured.

### Basic Usage

```bash
# Next.js project
npx untitledui@latest init --nextjs

# Vite project
npx untitledui@latest init --vite

# With custom project name
npx untitledui@latest init my-project --nextjs

# With brand color selection
npx untitledui@latest init --nextjs --color brand
```

### Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| `--nextjs` | Flag | Initialize Next.js project | One required |
| `--vite` | Flag | Initialize Vite project | One required |
| `-c, --color <name>` | String | Brand color (brand/error/warning/success/gray-neutral) | No |
| `-o, --overwrite` | Flag | Overwrite existing files | No |
| `--colors-list` | Flag | Show available color options | No |

### What Gets Installed

- Project scaffolding (Next.js or Vite)
- Tailwind CSS configured with Untitled UI tokens
- All base components
- Component configuration
- Theme setup with selected brand color
- TypeScript configuration
- Package dependencies

### Interactive Prompts

When running without options, you'll be asked:

1. **Project name**: Directory name for new project
2. **Brand color**: Choose from brand, error, warning, success, or gray-neutral
3. **Overwrite existing**: If directory exists, confirm overwrite

### Examples

```bash
# Minimal - will prompt for options
npx untitledui@latest init --nextjs

# Full specification
npx untitledui@latest init my-app --nextjs --color brand

# Check available colors
npx untitledui@latest init --colors-list

# Overwrite existing directory
npx untitledui@latest init my-app --nextjs --overwrite
```

## Add Command

Add Untitled UI components to an existing project.

### Basic Usage

```bash
# Single component
npx untitledui@latest add button

# Multiple components
npx untitledui@latest add button input select

# Interactive selection
npx untitledui@latest add
```

### Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| `-a, --all` | Flag | Add all available components | No |
| `-o, --overwrite` | Flag | Overwrite existing files | No |
| `-p, --path <path>` | String | Component installation path | No |
| `-d, --dir <directory>` | String | Project directory location | No |
| `-t, --type <type>` | String | Component type filter | No |
| `--include-all-components` | Flag | Auto-include all base components | No |
| `-y, --yes` | Flag | Non-interactive mode (use defaults) | No |

### Component Types

Valid values for `--type`:
- `base` - Core UI primitives
- `application` - Complex app components
- `marketing` - Marketing page sections
- `foundations` - Icons, logos, illustrations
- `shared-assets` - Shared page templates

### Interactive Mode

When running without component names:

1. **Select type**: Choose component category
2. **Select components**: Multi-select from filtered list
3. **Confirm dependencies**: Approve required base components
4. **Installation path**: Specify or use default

Use arrow keys to navigate, spacebar to select, enter to confirm.

### Non-Interactive Mode

For CI/CD or AI agents, use `--yes` flag:

```bash
npx untitledui@latest add button --yes
```

This uses default settings without prompts.

### Examples

```bash
# Add to specific path
npx untitledui@latest add button --path src/components/ui

# Add with overwrite
npx untitledui@latest add button --overwrite

# Add all components
npx untitledui@latest add --all

# Filter by type then select
npx untitledui@latest add --type base

# Non-interactive with custom path
npx untitledui@latest add button input --path components --yes

# Add to different project directory
npx untitledui@latest add button --dir ./my-other-project
```

### What Gets Added

- Component source files (TSX/JSX)
- Component dependencies (other required components)
- Type definitions
- Updated imports in central export file
- npm packages if needed

## Example Command

Add complete page examples/templates to your project.

**Note**: Most examples require PRO access.

### Basic Usage

```bash
# Interactive selection
npx untitledui@latest example

# Specific example
npx untitledui@latest example dashboards-01

# Nested example (variant)
npx untitledui@latest example dashboards-01/01
```

### Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| `-o, --overwrite` | Flag | Overwrite existing files | No |
| `-p, --path <path>` | String | Component installation path | No |
| `-e, --example-path <path>` | String | Example file installation path | No |
| `--include-all-components` | Flag | Auto-include all required components | No |
| `-y, --yes` | Flag | Non-interactive mode | No |

### Interactive Mode

When running without example name:

1. **Select category**: Application or Marketing
2. **Select example**: Choose from category
3. **Example path**: Where to place the page file (default: `app/`)
4. **Component path**: Where to place components (default: `components/`)
5. **Confirm components**: Approve required components

### Examples

```bash
# Custom paths for Next.js App Router
npx untitledui@latest example dashboards-01 \
  --example-path app/dashboard \
  --path components/ui

# Overwrite existing example
npx untitledui@latest example dashboards-01 --overwrite

# Non-interactive installation
npx untitledui@latest example dashboards-01 --yes

# Include all components without prompting
npx untitledui@latest example dashboards-01 --include-all-components
```

### Available Example Categories

**Application Examples** (PRO):
- `dashboards-01` - Analytics dashboards with charts
- `dashboards-02` - Metrics dashboards with cards
- `settings-pages-01` - Settings with tab navigation
- `settings-pages-02` - Settings with sidebar navigation
- `informational-pages-01` - Content pages with sidebar
- `informational-pages-02` - Full-width content pages

**Marketing Examples** (PRO):
- `landing-pages` - Full landing pages
- `pricing-pages` - Pricing comparison pages
- `blog` - Blog listing pages
- `blog-post` - Article pages
- `about-pages` - About us pages
- `contact-pages` - Contact pages with forms
- `team-pages` - Team directory pages
- `legal-pages` - Terms and privacy pages
- `faq-pages` - FAQ pages

**Shared Examples** (PRO):
- `login-pages` - Login/signin pages
- `signup-pages` - Registration pages
- `verification-pages` - Email/phone verification
- `forgot-password-pages` - Password reset pages
- `404-pages` - Not found pages
- `email-templates` - Transactional email templates

### What Gets Added

- Complete example page file(s)
- All required components
- Page-specific assets
- npm package dependencies
- Properly configured imports

## Login Command

Authenticate with Untitled UI for PRO component access.

### Basic Usage

```bash
npx untitledui@latest login
```

### Authentication Flow

1. Command opens browser automatically
2. If already signed in to Untitled UI: Authenticates immediately
3. If not signed in: Redirects to sign-in page → Magic link sent to email
4. Click magic link in email
5. Returns to CLI with authentication complete

### What Happens After Login

- Authentication token saved locally
- Persists across CLI sessions
- Enables access to PRO components via `add` command
- Enables access to page templates via `example` command
- No need to re-authenticate unless token expires

### Examples

```bash
# Login for PRO access
npx untitledui@latest login

# Then use PRO components
npx untitledui@latest add modal
npx untitledui@latest example dashboards-01
```

## Common Workflows

### New Project Setup

```bash
# 1. Initialize project
npx untitledui@latest init my-app --nextjs --color brand

# 2. Navigate to project
cd my-app

# 3. Start dev server
npm run dev
```

### Adding Components to Existing Project

```bash
# 1. Add specific components
npx untitledui@latest add button input select

# 2. Or browse and select interactively
npx untitledui@latest add
```

### Building Complete Pages (PRO)

```bash
# 1. Login for PRO access
npx untitledui@latest login

# 2. Add complete dashboard
npx untitledui@latest example dashboards-01 --yes

# 3. Customize as needed
# Files are now in your project and fully editable
```

### CI/CD Integration

```bash
# Non-interactive component installation
npx untitledui@latest add button input select \
  --path src/components/ui \
  --yes

# Non-interactive example installation (requires API key in env)
npx untitledui@latest example dashboards-01 \
  --example-path src/app/dashboard \
  --path src/components \
  --yes
```

## Environment Variables

### For CLI Authentication

The CLI uses browser-based OAuth for authentication. No environment variables needed for normal use.

### For CI/CD

For automated installations in CI/CD, you can authenticate by logging in once locally, then the token persists.

Alternatively, for the MCP server in automated environments, use API key authentication.

## File Paths

### Default Installation Paths

- **Next.js**: Components install to `components/ui/` by default
- **Vite**: Components install to `src/components/ui/` by default
- **Examples**: Install to `app/` (Next.js) or `src/pages/` (Vite)

### Customizing Paths

Use `--path` and `--example-path` to override defaults:

```bash
# Custom component path
npx untitledui@latest add button --path src/shared/components

# Custom example paths
npx untitledui@latest example dashboards-01 \
  --example-path src/routes/dashboard \
  --path src/lib/components
```

## Troubleshooting

### CLI Not Found

Ensure npx is available:
```bash
npx --version
# or use bunx
bunx --version
```

### Permission Errors

Run with proper permissions or use bunx as alternative:
```bash
bunx untitledui@latest add button
```

### Component Installation Fails

1. Ensure project is initialized with Untitled UI
2. Check Node.js version (requires 18+)
3. Verify you're in project root directory
4. Check for existing files (use `--overwrite` if needed)

### Browser Doesn't Open for Login

If browser doesn't open automatically:
1. Copy the URL shown in terminal
2. Paste into browser manually
3. Complete authentication
4. Return to terminal

### PRO Component Access Denied

```bash
# Login first
npx untitledui@latest login

# Then try again
npx untitledui@latest add modal
```

### Can't Find Component

Use search or list to find exact name:
```bash
# Interactive browse
npx untitledui@latest add

# Or check MCP server with search
# (if using MCP integration)
```

## Version Management

### Checking Version

```bash
npx untitledui@latest --version
```

### Updating CLI

The CLI is always run via `@latest` tag, so no update needed. Each run uses the latest version.

### Updating Components

To update components to latest versions:

```bash
npx untitledui@latest add button --overwrite
```

This re-installs the component with latest code.

## Advanced Usage

### Monorepo Support

The CLI supports monorepo structures:

```bash
# Specify the app directory
cd apps/my-app
npx untitledui@latest add button

# Or use --dir flag
npx untitledui@latest add button --dir ./apps/my-app
```

### Custom Configuration

After initialization, you can modify:

- `tailwind.config.ts` - Theme tokens and colors
- `components.json` - Component paths and aliases
- Import aliases in `tsconfig.json`

### Integration with Existing Projects

To add Untitled UI to a project not initialized with the CLI:

1. Manually install dependencies
2. Configure Tailwind with Untitled UI tokens
3. Use `add` command with custom `--path`

See full integration guide at: https://www.untitledui.com/react/docs/installation
