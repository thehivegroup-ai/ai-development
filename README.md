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

The MCP server provides automated module management with interactive selection, dependency resolution, and version control.

**Setup:**
1. See [mcp-server/README.md](./mcp-server/README.md) for installation
2. Use `select_modules` for interactive module selection
3. Use `install_environment` to set up your project automatically

**Available Tools:**
- `list_modules` - Discover available modules
- `select_modules` - Interactive selection with AI suggestions
- `install_environment` - Automated installation with dependency resolution
- `diff_environment` - Preview changes before installation
- `validate_environment` - Verify installation correctness
- `update_environment` - Add/remove modules
- `upgrade_environment` - Upgrade to new versions
- `rollback_environment` - Rollback to previous version

**Benefits:**
- ✅ Interactive module selection with categorization
- ✅ Automatic dependency resolution
- ✅ Smart conflict resolution with diffs
- ✅ Version management with upgrade/rollback
- ✅ Rich previews with tree views

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
│   │       ├── rules/                 # 8 core constraints
│   │       ├── commands/              # 5 standard workflow commands
│   │       ├── skills/                # 3 skills (solution, planning, hygiene)
│   │       │   └── */references/      # Rich examples and anti-patterns
│   │       └── agents/                # 3 agents (planner, verifier, debugger)
│   │
│   ├── stack-authorities/             # Technology-specific standards
│   │   ├── frontend/
│   │   │   ├── react-tailwind/        # React + Tailwind
│   │   │   ├── next-tailwind/         # Next.js + Tailwind
│   │   │   ├── angular-tailwind/      # Angular + Tailwind
│   │   │   └── vue-tailwind/          # Vue.js + Tailwind (NEW)
│   │   ├── backend/
│   │   │   ├── node-fastify/          # Node.js + Fastify
│   │   │   ├── java/                  # Java + Spring Boot
│   │   │   └── python-fastapi/        # Python + FastAPI (NEW)
│   │   ├── database/
│   │   │   ├── postgres/              # PostgreSQL
│   │   │   ├── sqlserver/             # SQL Server
│   │   │   └── mongodb/               # MongoDB (NEW)
│   │   ├── cloud/
│   │   │   ├── aws/                   # AWS
│   │   │   ├── gcp/                   # GCP
│   │   │   └── azure/                 # Microsoft Azure (NEW)
│   │   └── testing/
│   │       └── visual-parity/         # Playwright visual testing (COMPLETE)
│   │
│   └── project-controls/              # Cross-cutting controls
│       ├── base/                      # Baseline quality controls
│       └── regulated/                 # Compliance controls
│
├── mcp-server/                        # MCP server (8 tools, production ready)
│   ├── src/                           # TypeScript source (2,000+ lines)
│   │   ├── tools/                     # Tool implementations
│   │   └── modules/                   # Core functionality
│   ├── dist/                          # Compiled JavaScript
│   ├── package.json
│   └── README.md
│
├── scripts/
│   ├── visual-parity/                 # Visual testing scripts (COMPLETE)
│   │   ├── capture.ts                 # Screenshot capture
│   │   ├── compare.ts                 # Image comparison
│   │   └── package.json
│   └── validate-manifests.ts          # Schema validation
│
├── examples/                          # Complete working examples
│   ├── react-fastify-postgres-aws/    # Modern web app
│   ├── next-java-sqlserver-gcp/       # Enterprise + regulated
│   ├── angular-fastify-postgres-aws/  # Angular app
│   ├── monorepo-fullstack/            # Monorepo pattern
│   └── microservices/                 # Microservices pattern
│
├── templates/                         # Configuration templates
│   ├── README.md                      # Template guide
│   ├── stack.profile.json             # Module selection
│   ├── stack.override.json            # Customization (NEW)
│   └── module.json                    # New module template
│
├── schemas/
│   └── module.schema.json             # Module validation schema
│
├── docs/
│   └── functionality/                 # Completion documentation
│       └── COMPLETE-initiative-*.md   # 7 initiative summaries
│
└── docs/
    └── functionality/                 # Completion documentation
        ├── COMPLETION-SUMMARY.md      # Overall achievement summary
        ├── ACHIEVEMENT.md             # Final report with statistics
        └── COMPLETE-initiative-*.md   # 7 initiative summaries

└── COMPLETION-SUMMARY.md              # Overall achievement summary
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

## 🎉 What's New (January 2026)

### All 7 Planned Initiatives Complete!

**Project Status:** 100% Complete - Production Ready

See [COMPLETION-SUMMARY.md](./docs/functionality/COMPLETION-SUMMARY.md) for full details.

**Highlights:**
- 🚀 8 MCP server tools (interactive selection, dependency resolution, version management)
- 📸 Complete visual parity testing system with CI/CD
- 📚 5 complete stack profile examples (simple + monorepo + microservices)
- 🎯 4 new technology stacks (Vue.js, Python FastAPI, MongoDB, Azure) - **13 total**
- 📋 17 module manifests with JSON Schema validation
- 🤖 4 enhanced agents with systematic processes (1,300+ lines)
- 📖 40 anti-patterns documented across 4 key skills

**Achievement: 140+ files, 18,600+ lines, 7/7 initiatives ✅**

---

## Documentation

- **[HERMENEUTIC_CIRCLE.md](./HERMENEUTIC_CIRCLE.md)** – How Heidegger's hermeneutic circle is operationalized
- **[TELEOLOGICAL_PLANNING.md](./TELEOLOGICAL_PLANNING.md)** – How teleological (outcome-driven) planning is operationalized
- **[WORKFLOWS.md](./WORKFLOWS.md)** – Complete guide to how rules, commands, skills, and subagents work together
- **[COMPOSITION.md](./COMPOSITION.md)** – How to compose modules into your project
- **[docs/functionality/](./docs/functionality/)** – Initiative completion summaries and planning documents
  - [COMPLETION-SUMMARY.md](./docs/functionality/COMPLETION-SUMMARY.md) – Overall achievement summary
  - [ACHIEVEMENT.md](./docs/functionality/ACHIEVEMENT.md) – Final report with statistics
  - Individual initiative summaries (COMPLETE-initiative-*.md)
- **[LEGACY_MAPPING.md](./LEGACY_MAPPING.md)** – How legacy rules map to the new structure
- **[LEGACY_SKILLS_INTEGRATION.md](./LEGACY_SKILLS_INTEGRATION.md)** – How legacy skills were transformed
- **[ENHANCEMENTS.md](./ENHANCEMENTS.md)** – Summary of all enhancements made to this repository
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

#### Frontend (4 Frameworks)

**React + Tailwind:**
- Component/utility architecture
- React memoization patterns
- Performance and accessibility
- Commands: `/web.react.build-screen`, `/web.react.compare-screens`, `/web.react.tailwind-refactor`
- Skill: react-component-standards (with anti-patterns reference)

**Next.js + Tailwind:**
- App Router, server components, SSR
- File-based routing optimization
- Commands: `/web.next.build-screen`, `/web.next.route-audit`
- Skill: next-standards

**Angular + Tailwind:**
- Standalone components, Signals
- Typed reactive forms, data integration
- Command: `/web.angular.template-audit`
- Skills: angular-tailwind-standards, angular-forms-validation, angular-data-integration

**Vue.js + Tailwind:** [NEW]
- Composition API with `<script setup>`
- TypeScript integration, Pinia state management
- Command: `/web.vue.build-component`
- Skills: vue-component-standards
- Agent: web.vue-critic

---

#### Backend (3 Frameworks)

**Node.js + Fastify:**
- Schema validation, plugin architecture
- Performance patterns
- Commands: `/api.fastify.add-route`, `/api.fastify.test-loop`
- Skill: fastify-api-standards
- Agent: api.fastify-debugger

**Java + Spring Boot:**
- Layered architecture, dependency injection
- Commands: `/api.java.add-endpoint`, `/api.java.test-loop`
- Skill: java-api-standards
- Agent: api.java-debugger

**Python + FastAPI:** [NEW]
- Async/await patterns, Pydantic validation
- Type hints, dependency injection
- Command: `/api.fastapi.add-endpoint`
- Skill: fastapi-api-standards (with anti-patterns reference)
- Agent: api.fastapi-reviewer

---

#### Database (3 Systems)

**PostgreSQL:**
- Migration discipline, query optimization
- Commands: `/db.postgres.migration`, `/db.postgres.performance-check`
- Skill: postgres-standards
- Agent: db.postgres-reviewer

**Microsoft SQL Server:**
- Migration safety, schema conventions
- Command: `/db.sqlserver.migration`
- Skill: sqlserver-standards
- Agent: db.sqlserver-reviewer

**MongoDB:** [NEW]
- Schema design, indexing strategies
- Embedding vs referencing patterns
- Command: `/db.mongodb.schema`
- Skill: mongodb-standards
- Agent: db.mongodb-reviewer

---

#### Cloud (3 Providers)

**Amazon Web Services (AWS):**
- CloudFormation, infrastructure as code
- Commands: `/cloud.aws.deploy`, `/cloud.aws.preflight`
- Skill: aws-infra-standards
- Agent: cloud.aws-release-manager

**Google Cloud Platform (GCP):**
- Cloud Run, security patterns
- Commands: `/cloud.gcp.deploy`, `/cloud.gcp.preflight`
- Skill: gcp-infra-standards
- Agent: cloud.gcp-release-manager

**Microsoft Azure:** [NEW]
- Bicep templates, Managed Identities
- Key Vault integration
- Commands: `/cloud.azure.deploy`, `/cloud.azure.preflight`
- Skill: azure-infra-standards
- Agent: cloud.azure-release-manager

---

#### Testing

**Visual Parity Testing:** [COMPLETE]
- Playwright screenshot capture
- Pixelmatch pixel-perfect comparison
- Multi-viewport, multi-page support
- CI/CD integration
- Commands: `/test.parity.capture-all`, `/test.parity.compare`, `/test.parity.fix-from-report`
- Skills: playwright-capture, visual-parity-testing
- Agent: test.parity-critic

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
