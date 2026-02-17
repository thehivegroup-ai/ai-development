# React + Fastify + PostgreSQL + AWS Example

This example demonstrates a modern JavaScript full-stack application with AWS deployment.

## Stack Composition

### Enterprise Standards (Required)
- **ID:** `""`
- **Provides:** Core workflow standards, planning, solution framing
- 8 rules, 5 commands, 3 skills, 3 agents

### Project Controls
- **Base Controls** (`base`)
- Minimum quality and verification standards
- 1 rule, 1 command, 1 skill, 1 agent

### Technology Stack

#### Frontend
- **React + Tailwind** (`frontend/react-tailwind`)
- Component standards, memoization patterns, accessibility
- 1 rule, 3 commands, 2 skills, 1 agent

#### Backend
- **Node.js + Fastify** (`backend/node-fastify`)
- API patterns, schema validation, plugin architecture
- 1 rule, 2 commands, 1 skill, 1 agent

#### Database
- **PostgreSQL** (`database/postgres`)
- Migration discipline, query optimization
- 1 rule, 2 commands, 1 skill, 1 agent

#### Cloud
- **AWS** (`cloud/aws`)
- Infrastructure as code, deployment patterns
- 1 rule, 2 commands, 1 skill, 1 agent

## Total Provides

- **14 rules** - Development constraints and patterns
- **15 commands** - Workflow entry points
- **9 skills** - How-to guidance and examples
- **8 agents** - Specialized AI perspectives

## Installation

### Using MCP Server

```javascript
install_environment({
  projectPath: "/path/to/your/project",
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

### Manual Installation

```bash
cd your-project/

# Enterprise standards (required)
cp -r ../ai-development/modules/enterprise-standards/cursor/* .cursor/

# Base controls
cp -r ../ai-development/modules/project-controls/base/cursor/* .cursor/

# Stack modules
cp -r ../ai-development/modules/stack-authorities/frontend/react-tailwind/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/backend/node-fastify/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/database/postgres/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/cloud/aws/cursor/* .cursor/
```

## Key Commands

### Workflow Commands
- `/std-solution` - Frame the problem using hermeneutic circle
- `/std-plan` - Create teleological (goal-driven) execution plan
- `/std-clean-sweep` - Code cleanup and review
- `/std-test-loop` - Testing workflow
- `/std-deploy-release` - Deployment preparation

### Frontend Commands
- `/web.react.build-screen` - Build React component with Tailwind
- `/web.react.compare-screens` - Compare component implementations
- `/web.react.tailwind-refactor` - Refactor to Tailwind patterns

### Backend Commands
- `/api.fastify.add-route` - Add new API route
- `/api.fastify.test-loop` - API testing workflow

### Database Commands
- `/db.postgres.migration` - Create database migration
- `/db.postgres.performance-check` - Query optimization

### Cloud Commands
- `/cloud.aws.deploy` - Deploy to AWS
- `/cloud.aws.preflight` - Pre-deployment checks

## Use Cases

### Ideal For:
- Modern web applications
- API-driven architectures
- Real-time applications (Fastify + WebSockets)
- Scalable cloud deployments
- PostgreSQL data requirements
- AWS infrastructure

### Project Types:
- SaaS applications
- Internal tools and dashboards
- E-commerce platforms
- Content management systems
- Analytics platforms

## Technology Versions

This stack works with:
- React 18+
- Node.js 18+
- Fastify 4+
- PostgreSQL 14+
- Tailwind CSS 3+

## Expected File Structure

After installation, your `.cursor/` directory will contain:

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
│   ├── 07-std-evidence-based-claims.mdc
│   ├── 20-web-react-tailwind.mdc
│   ├── 30-api-node-fastify.mdc
│   ├── 40-db-postgres.mdc
│   ├── 50-cloud-aws.mdc
│   ├── 90-ctrl-base.mdc
│   └── (additional rule overrides)
├── commands/
│   ├── std.*.md (5 files)
│   ├── web.react.*.md (3 files)
│   ├── api.fastify.*.md (2 files)
│   ├── db.postgres.*.md (2 files)
│   ├── cloud.aws.*.md (2 files)
│   └── ctrl.base.*.md (1 file)
├── skills/
│   ├── engineering-hygiene/
│   ├── hermeneutic-solution/
│   ├── teleological-planning/
│   ├── react-component-standards/
│   ├── react-tailwind-conventions/
│   ├── fastify-api-standards/
│   ├── postgres-standards/
│   ├── aws-infra-standards/
│   └── project-basics/
└── agents/
    ├── std.*.md (3 files)
    ├── web.react-critic.md
    ├── api.fastify-debugger.md
    ├── db.postgres-reviewer.md
    ├── cloud.aws-release-manager.md
    └── ctrl.base-verifier.md
```

## Workflow Example

### Feature Development

```
1. /std-solution
   - Frame: "Add user authentication with JWT"
   
2. /std-plan
   - Plan phases: API endpoints, React components, database schema
   
3. /db.postgres.migration
   - Create users table migration
   
4. /api.fastify.add-route
   - Build /auth/login and /auth/register endpoints
   
5. /web.react.build-screen
   - Build Login and Register components
   
6. /std-clean-sweep
   - Review and clean code
   
7. /std-test-loop
   - Run tests and fix issues
   
8. /cloud.aws.preflight
   - Check deployment readiness
   
9. /cloud.aws.deploy
   - Deploy to AWS
```

## Next Steps

1. Install using MCP server or manual copy
2. Restart Cursor to load rules and commands
3. Type `/` to see available commands
4. Review `.cursor/` directory structure
5. Check `cursor.lock.json` for version tracking
6. Start building with `/std-solution`

## Support

See project documentation at `/Users/robertfiore/development/ai-development/README.md`
