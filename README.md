# AI Development

This repository is the source of truth for our AI development workflow: commands, rules, skills, and subagents that teams compose into projects.

## Overview

This repository provides a modular, compositional system for standardizing AI-assisted development workflows in Cursor. Teams select the modules they need and copy them into their project's `.cursor/` directory.

**Core Philosophy:**
- **Rules** = Enforceable constraints ("must" and "must not")
- **Commands** = Repeatable workflow entry points (user types `/command-name`)
- **Skills** = How-to guidance and examples
- **Subagents** = Specialized AI perspectives (planner, critic, debugger)

---

## Quick Start

### Option 1: Using the MCP Server (Recommended)

The MCP server provides automated module management with version control and validation.

**Setup:**
1. See [mcp-server/README.md](./mcp-server/README.md) for installation instructions
2. Use the `list_modules` tool to discover available modules
3. Use the `install_environment` tool to set up your project (coming soon)

**Benefits:**
- Automated installation and updates
- Version pinning with lockfiles
- Collision detection
- Environment validation

### Option 2: Manual Installation

```bash
# 1. Choose your stack (e.g., React + Fastify + Postgres + AWS)
# 2. Copy modules to your project
cd your-project/

# Enterprise standards (always include)
cp -r ../ai-development/modules/enterprise-standards/cursor/* .cursor/

# Stack authorities (based on your stack)
cp -r ../ai-development/modules/stack-authorities/frontend/react-tailwind/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/backend/node-fastify/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/database/postgres/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/cloud/aws/cursor/* .cursor/

# Project controls (based on requirements)
cp -r ../ai-development/modules/project-controls/base/cursor/* .cursor/

# 3. Start using workflows
# In Cursor, type: /std.solution
```

---

## Structure

```
ai-development/
├── modules/
│   ├── enterprise-standards/          # Technology-agnostic workflow standards
│   │   └── cursor/
│   │       ├── rules/                 # Core constraints
│   │       ├── commands/              # Standard workflow commands
│   │       ├── skills/                # Solution, planning, hygiene guidance
│   │       └── agents/                # Planner, verifier, debugger subagents
│   │
│   ├── stack-authorities/             # Technology-specific standards
│   │   ├── frontend/
│   │   │   ├── react-tailwind/        # React + Tailwind patterns
│   │   │   ├── next-tailwind/         # Next.js + Tailwind patterns
│   │   │   └── angular-tailwind/      # Angular + Tailwind patterns
│   │   ├── backend/
│   │   │   ├── node-fastify/          # Node.js + Fastify patterns
│   │   │   └── java/                  # Java API patterns
│   │   ├── database/
│   │   │   ├── postgres/              # PostgreSQL patterns
│   │   │   └── sqlserver/             # SQL Server patterns
│   │   └── cloud/
│   │       ├── aws/                   # AWS deployment patterns
│   │       └── gcp/                   # GCP deployment patterns
│   │
│   └── project-controls/              # Cross-cutting controls
│       ├── base/                      # Baseline quality controls
│       └── regulated/                 # Additional controls for regulated environments
│
├── mcp-server/                        # MCP server for automated module management
│   ├── src/                           # TypeScript source
│   ├── dist/                          # Compiled JavaScript
│   ├── package.json
│   └── README.md                      # Server documentation
│
├── examples/                          # Example stack compositions
│   ├── react-fastify-postgres-aws/
│   └── next-java-sqlserver-gcp/
│
├── templates/                         # Starter templates
│   ├── stack.profile.json            # Stack composition template
│   ├── stack.override.json           # Override template
│   └── ADR-template.md               # Architecture Decision Record
│
├── docs/                              # Documentation and planning
│   ├── functionality/                 # Feature docs and plans
│   └── legacy/                        # Legacy documentation (informational)
│
├── README.md                          # This file
├── WORKFLOWS.md                       # Complete workflow guide
└── COMPOSITION.md                     # Project composition guide
```

---

## Documentation

- **[HERMENEUTIC_CIRCLE.md](./HERMENEUTIC_CIRCLE.md)** – How Heidegger's hermeneutic circle is operationalized through Commands, Rules, Skills, and Subagents
- **[TELEOLOGICAL_PLANNING.md](./TELEOLOGICAL_PLANNING.md)** – How teleological (outcome-driven) planning is operationalized through Commands, Rules, Skills, and Subagents
- **[WORKFLOWS.md](./WORKFLOWS.md)** – Complete guide to how rules, commands, skills, and subagents work together
- **[COMPOSITION.md](./COMPOSITION.md)** – How to compose modules into your project
- **[LEGACY_MAPPING.md](./LEGACY_MAPPING.md)** – How legacy rules map to the new structure
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** – Summary of enhancements made to this repository
- **Module READMEs** – Each module has a README explaining its focus and purpose

---

## Available Modules

### Enterprise Standards (Always Include)

**Purpose:** Technology-agnostic workflow and quality norms

**Provides:**
- Standard workflow commands (`/std.solution`, `/std.plan`, `/std.clean-sweep`, `/std.test-loop`, `/std.deploy-release`)
- Core constraints (foundation, solution framing, planning, quality gates, environment config)
- Skills (hermeneutic solution, teleological planning, engineering hygiene)
- Subagents (planner, verifier, debugger)

---

### Stack Authorities (Choose Based on Stack)

#### Frontend

**React + Tailwind:**
- Component/utility architecture for Tailwind
- React memoization patterns
- Performance and accessibility standards
- Commands: `/web.react.build-screen`, `/web.react.compare-screens`, `/web.react.tailwind-refactor`

**Next.js + Tailwind:**
- App Router conventions
- Server/client component boundaries
- Routing and layout patterns
- Commands: `/web.next.route-audit`, `/web.next.build-screen`

**Angular + Tailwind:**
- Standalone components and Signals
- Modern template syntax (`@if`, `@for`, `@switch`)
- Typed reactive forms
- Data integration patterns (HttpClient + Signals)
- Commands: `/web.angular.template-audit`

#### Backend

**Node.js + Fastify:**
- Plugin and route structure
- Schema validation patterns
- Service layer architecture
- Commands: `/api.fastify.add-route`, `/api.fastify.test-loop`

**Java:**
- Layered architecture (controller → service → repository)
- Validation and error handling
- Testing conventions
- Commands: `/api.java.add-endpoint`, `/api.java.test-loop`

#### Database

**PostgreSQL:**
- Migration discipline
- Indexing and query performance
- Commands: `/db.postgres.migration`, `/db.postgres.performance-check`

**SQL Server:**
- Migration safety
- Schema conventions
- Commands: `/db.sqlserver.migration`

#### Cloud

**AWS:**
- Infrastructure as code
- Secrets management
- Preflight checks
- Commands: `/cloud.aws.deploy`, `/cloud.aws.preflight`

**GCP:**
- Infrastructure as code
- Environment configuration
- Commands: `/cloud.gcp.deploy`, `/cloud.gcp.preflight`

---

### Project Controls (Optional)

**Base:**
- Minimum quality checks
- Verification expectations
- Commands: `/ctrl.base.check`

**Regulated:**
- Security and compliance checks
- Audit trail requirements
- Commands: `/ctrl.regulated.security-check`

---

## Common Workflows

### Feature Development

```
1. /std.solution              # Frame the problem
2. /std.plan                  # Create execution plan
3. /web.react.build-screen    # Build UI (example)
4. /api.fastify.add-route     # Build API (example)
5. /std.clean-sweep           # Clean and review
6. /std.test-loop             # Test and fix
7. /std.deploy-release        # Prepare for deployment
```

### Bug Fix

```
1. std.debugger subagent      # Root cause analysis
2. Fix issue
3. /std.test-loop             # Verify fix
4. /std.clean-sweep           # Clean state
```

### Refactoring

```
1. /web.react.compare-screens  # Analyze current state
2. /web.react.tailwind-refactor # Refactor to standards
3. /std.test-loop              # Verify no breakage
```

---

## Example Stacks

### React + Fastify + Postgres + AWS

**Modules:**
- `enterprise-standards`
- `frontend/react-tailwind`
- `backend/node-fastify`
- `database/postgres`
- `cloud/aws`
- `project-controls/base`

**Use case:** Modern web application with Node.js backend on AWS

---

### Next.js + Java + SQL Server + GCP

**Modules:**
- `enterprise-standards`
- `frontend/next-tailwind`
- `backend/java`
- `database/sqlserver`
- `cloud/gcp`
- `project-controls/base`
- `project-controls/regulated` (optional)

**Use case:** Enterprise application with Java backend on GCP

---

## Usage

1. **Choose your stack** – Identify which frontend, backend, database, and cloud modules you need
2. **Copy modules** – Copy `cursor/` contents from each module to your project's `.cursor/` directory
3. **Customize** – Add project-specific rules, commands, or skills as needed
4. **Use workflows** – Type `/` in Cursor to see available commands

See [COMPOSITION.md](./COMPOSITION.md) for detailed composition guide.

---

## Contributing

To contribute improvements or new modules:

1. Fork this repository
2. Create a new module in appropriate `modules/` folder
3. Follow existing structure (rules, commands, skills, agents)
4. Add documentation (README, update this file)
5. Submit pull request

---

## License

[Your License Here]
