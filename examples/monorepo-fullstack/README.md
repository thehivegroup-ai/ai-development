# Full-Stack Monorepo Example

This example demonstrates how to configure a monorepo with multiple applications sharing infrastructure.

## Architecture

```
monorepo/
├── apps/
│   ├── admin/           # Angular admin panel
│   ├── customer/        # React customer portal
│   └── api/             # Shared Fastify API
├── packages/
│   └── shared/          # Shared utilities
└── .cursor/             # Shared standards
```

## Workspace Configuration

### Root Level (Shared Standards)
Install enterprise standards and base controls at the monorepo root for consistency across all workspaces.

```bash
cd monorepo/
```

```javascript
install_environment({
  projectPath: "/path/to/monorepo",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: []
  }
})
```

**Provides:**
- Enterprise standards (8 rules, 5 commands, 3 skills, 3 agents)
- Base controls (1 rule, 1 command, 1 skill, 1 agent)

### Admin App (Angular)
```bash
cd monorepo/apps/admin/
```

```javascript
install_environment({
  projectPath: "/path/to/monorepo/apps/admin",
  selection: {
    enterprise: "",
    controls: ["base", "regulated"],
    stacks: [
      "frontend/angular-tailwind",
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
})
```

**Use Case:** Internal admin panel with elevated permissions

**Special Requirements:**
- Regulated controls for sensitive operations
- Angular for complex forms
- Data integration patterns

### Customer Portal (React)
```bash
cd monorepo/apps/customer/
```

```javascript
install_environment({
  projectPath: "/path/to/monorepo/apps/customer",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: [
      "frontend/react-tailwind",
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
})
```

**Use Case:** Customer-facing portal

**Special Requirements:**
- React for performance
- Component patterns
- API integration

### Backend API (Shared)
```bash
cd monorepo/apps/api/
```

```javascript
install_environment({
  projectPath: "/path/to/monorepo/apps/api",
  selection: {
    enterprise: "",
    controls: ["base", "regulated"],
    stacks: [
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
})
```

**Use Case:** Shared API server for all frontends

**Special Requirements:**
- Regulated controls for data access
- Schema validation
- Performance patterns

## Installation Strategy

### Option 1: Separate .cursor/ per Workspace
Each app has its own `.cursor/` directory with relevant modules.

**Pros:**
- Each app gets only what it needs
- No rule conflicts
- Clear separation

**Cons:**
- Duplication of enterprise standards
- More maintenance

### Option 2: Shared .cursor/ with Workspace Overrides
Single `.cursor/` at root with `stack.override.json` per app.

**Pros:**
- Single source of truth
- Consistent standards
- Less duplication

**Cons:**
- All apps see all rules
- Potential conflicts

**Recommended:** Option 1 for large monorepos, Option 2 for small ones

## Directory Structure

### Option 1: Separate Configurations
```
monorepo/
├── .cursor/                    # Root: enterprise + base
│   ├── rules/
│   ├── commands/
│   ├── skills/
│   └── agents/
├── apps/
│   ├── admin/
│   │   ├── .cursor/           # Angular + regulated
│   │   └── stack.profile.json
│   ├── customer/
│   │   ├── .cursor/           # React
│   │   └── stack.profile.json
│   └── api/
│       ├── .cursor/           # Fastify + regulated
│       └── stack.profile.json
└── packages/
    └── shared/
```

### Option 2: Shared Configuration
```
monorepo/
├── .cursor/                    # All modules
│   ├── rules/
│   ├── commands/
│   ├── skills/
│   └── agents/
├── stack.profile.json          # Root profile
├── apps/
│   ├── admin/
│   │   └── stack.override.json  # Admin customizations
│   ├── customer/
│   │   └── stack.override.json  # Customer customizations
│   └── api/
│       └── stack.override.json  # API customizations
└── packages/
    └── shared/
```

## Workflow Examples

### Cross-Workspace Feature

```
1. Root: /std-solution
   - Frame feature affecting multiple apps
   
2. API: /api.fastify.add-route
   - Add shared endpoints
   
3. API: /db.postgres.migration
   - Update database schema
   
4. Admin: /web.angular.template-audit
   - Build admin UI
   
5. Customer: /web.react.build-screen
   - Build customer UI
   
6. Root: /std-test-loop
   - Integration testing across apps
   
7. Root: /std-deploy-release
   - Coordinate deployment
```

### Admin-Only Feature

```
1. Admin: /std-solution
   - Frame admin feature
   
2. Admin: /ctrl.regulated.security-check
   - Verify security requirements
   
3. Admin: /std-plan
   - Plan implementation
   
4. Admin: Build feature
   
5. Admin: /std-clean-sweep
   
6. Admin: /cloud.aws.deploy
```

## Shared Modules

Create a `packages/shared/` directory for:
- Type definitions
- Utilities
- Constants
- Validation schemas

Each workspace can import from shared:

```typescript
// Admin app
import { UserSchema } from '@monorepo/shared';

// Customer app
import { UserSchema } from '@monorepo/shared';

// API
import { UserSchema } from '@monorepo/shared';
```

## Testing Strategy

### Unit Tests
Each workspace tests independently using its own testing config.

### Integration Tests
Root-level tests that span multiple workspaces:

```bash
# Root level
cd monorepo/
npm run test:integration
```

### E2E Tests
Test full user flows across frontend and backend:

```bash
# Admin E2E
cd apps/admin/
npm run test:e2e

# Customer E2E
cd apps/customer/
npm run test:e2e
```

## Deployment

### Coordinated Deployment
Deploy all apps together (recommended for tightly coupled apps):

```bash
# Root level
/std-deploy-release
# Deploys: API → Admin → Customer
```

### Independent Deployment
Deploy each app separately (recommended for loosely coupled):

```bash
# API
cd apps/api && /cloud.aws.deploy

# Admin
cd apps/admin && /cloud.aws.deploy

# Customer
cd apps/customer && /cloud.aws.deploy
```

## Benefits of This Approach

✅ **Code Reuse**
- Shared API server
- Shared types and utilities
- Consistent standards

✅ **Independent Development**
- Teams can work in parallel
- Different release cadences possible
- Technology choices per app

✅ **Consistent Quality**
- Shared enterprise standards
- Common workflow commands
- Unified testing approach

✅ **Flexibility**
- Mix technologies (Angular + React)
- Different security levels (regulated + base)
- Independent deployment

## Common Patterns

### Shared Authentication
API provides auth endpoints, both frontends consume them.

### Shared Database
Single PostgreSQL instance, different table access per app.

### Shared Deployment
Single AWS account, different resources per app.

### Shared Standards
Enterprise standards at root, technology-specific at app level.

## Next Steps

1. Choose configuration option (separate vs shared .cursor/)
2. Install root-level standards
3. Install per-app modules
4. Set up shared package
5. Configure build system (Turborepo, Nx, etc.)
6. Start building with `/std-solution` at appropriate level

## Support

See main README: `/Users/robertfiore/development/ai-development/README.md`
