# Project Composition Guide

This guide explains how to compose modules from this repository into your project.

---

## Quick Start

### 1. Choose Your Stack

**Example:** React + Fastify + Postgres + AWS

### 2. Copy Module Contents

```bash
# From ai-development/ repository root
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
```

### 3. Result

Your `.cursor/` directory now contains:

```
.cursor/
  rules/
    00-std-foundation.mdc
    01-std-solution-hermeneutic.mdc
    02-std-planning-teleological.mdc
    03-std-quality-clean-test-deploy.mdc
    04-std-environment-config.mdc
    20-web-react-tailwind.mdc
    30-api-node-fastify.mdc
    40-db-postgres.mdc
    50-cloud-aws.mdc
    90-ctrl-base.mdc
  commands/
    web.react.build-screen.md
    web.react.compare-screens.md
    web.react.tailwind-refactor.md
    api.fastify.add-route.md
    api.fastify.test-loop.md
    db.postgres.migration.md
    db.postgres.performance-check.md
    cloud.aws.deploy.md
    cloud.aws.preflight.md
    ctrl.base.check.md
  skills/
    std-solution/
    std-plan/
    std-clean-sweep/
    std-test-loop/
    std-deploy-release/
    hermeneutic-solution/
    teleological-planning/
    engineering-hygiene/
    react-tailwind-conventions/
    react-component-standards/
    fastify-api-standards/
    postgres-standards/
    aws-infra-standards/
    project-basics/
  agents/
    std-planner.md
    std-verifier.md
    std-debugger.md
    web.react-critic.md
    api.fastify-debugger.md
    db.postgres-reviewer.md
    cloud.aws-release-manager.md
    ctrl.base-verifier.md
```

---

## Stack Profiles

### React + Fastify + Postgres + AWS

**Use case:** Modern web app with Node.js backend on AWS

**Modules:**
- `enterprise-standards` ✓
- `frontend/react-tailwind` ✓
- `backend/node-fastify` ✓
- `database/postgres` ✓
- `cloud/aws` ✓
- `project-controls/base` ✓

**Available commands:**
- `/std-solution`, `/std-plan`, `/std-clean-sweep`, `/std-test-loop`, `/std-deploy-release`
- `/web.react.build-screen`, `/web.react.compare-screens`, `/web.react.tailwind-refactor`
- `/api.fastify.add-route`, `/api.fastify.test-loop`
- `/db.postgres.migration`, `/db.postgres.performance-check`
- `/cloud.aws.deploy`, `/cloud.aws.preflight`
- `/ctrl.base.check`

---

### Next.js + Java + SQL Server + GCP

**Use case:** Enterprise app with Java backend on GCP

**Modules:**
- `enterprise-standards` ✓
- `frontend/next-tailwind` ✓
- `backend/java` ✓
- `database/sqlserver` ✓
- `cloud/gcp` ✓
- `project-controls/base` ✓
- `project-controls/regulated` ✓ (if needed)

**Available commands:**
- `/std-solution`, `/std-plan`, `/std-clean-sweep`, `/std-test-loop`, `/std-deploy-release`
- `/web.next.route-audit`, `/web.next.build-screen`
- `/api.java.add-endpoint`, `/api.java.test-loop`
- `/db.sqlserver.migration`
- `/cloud.gcp.deploy`, `/cloud.gcp.preflight`
- `/ctrl.base.check`, `/ctrl.regulated.security-check`

---

### Angular + Fastify + Postgres + AWS

**Use case:** Angular app with Node.js backend

**Modules:**
- `enterprise-standards` ✓
- `frontend/angular-tailwind` ✓
- `backend/node-fastify` ✓
- `database/postgres` ✓
- `cloud/aws` ✓
- `project-controls/base` ✓

**Available commands:**
- `/std-solution`, `/std-plan`, `/std-clean-sweep`, `/std-test-loop`, `/std-deploy-release`
- `/web.angular.template-audit`
- `/api.fastify.add-route`, `/api.fastify.test-loop`
- `/db.postgres.migration`, `/db.postgres.performance-check`
- `/cloud.aws.deploy`, `/cloud.aws.preflight`
- `/ctrl.base.check`

---

## Customization

### Adding Project-Specific Rules

Create `.cursor/rules/99-project-specific.mdc`:

```markdown
---
description: "Project-specific constraints"
alwaysApply: true
---

# Project Specific Rules

- Use feature flags for all new features
- All API responses must include request tracing ID
- UI components must support dark mode
```

### Adding Custom Commands

Create `.cursor/commands/project.custom-workflow.md`:

```markdown
# Project Custom Workflow

Custom workflow for this project.

## Steps

1. Step one
2. Step two
3. Step three

## Guidance

- Apply relevant skills
- Invoke appropriate subagents
```

### Extending Skills

Add to existing skill `references/` folders or create new skills:

```
.cursor/skills/my-custom-skill/
  SKILL.md
  references/
    example-1.md
    example-2.md
```

---

## Module Composition Matrix

| Module | React | Next | Angular | Node/Fastify | Java | Postgres | SQL Server | AWS | GCP |
|--------|-------|------|---------|--------------|------|----------|------------|-----|-----|
| `enterprise-standards` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `frontend/react-tailwind` | ✓ | | | | | | | | |
| `frontend/next-tailwind` | | ✓ | | | | | | | |
| `frontend/angular-tailwind` | | | ✓ | | | | | | |
| `backend/node-fastify` | | | | ✓ | | | | | |
| `backend/java` | | | | | ✓ | | | | |
| `database/postgres` | | | | | | ✓ | | | |
| `database/sqlserver` | | | | | | | ✓ | | |
| `cloud/aws` | | | | | | | | ✓ | |
| `cloud/gcp` | | | | | | | | | ✓ |
| `project-controls/base` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `project-controls/regulated` | (opt) | (opt) | (opt) | (opt) | (opt) | (opt) | (opt) | (opt) | (opt) |

---

## Maintenance

### Updating Modules

When the ai-development repository is updated:

```bash
# Pull latest changes
cd ai-development/
git pull

# Re-copy modules to your project
cd your-project/
# (repeat copy commands from Quick Start)
```

### Version Control

**Recommended:** Commit the `.cursor/` directory to your project repository.

**Rationale:**
- Project-specific customizations are preserved
- Team members get consistent configuration
- Changes to standards are tracked in version control

---

## Troubleshooting

### Commands aren't showing up

1. Verify files are in `.cursor/commands/`
2. Restart Cursor IDE
3. Type `/` in chat to see available commands

### Rules aren't applying

1. Check `globs` patterns in rule frontmatter
2. Verify `alwaysApply: true` for global rules
3. Confirm rule file is in `.cursor/rules/`

### Skills aren't being used

1. Verify skill is in `.cursor/skills/*/SKILL.md`
2. Check description is clear about when to use
3. Try explicit mention in command or chat

---

## Examples

See `examples/` folder in ai-development repository:
- `react-fastify-postgres-aws/` – Full stack example with `.cursor/` output
- `next-java-sqlserver-gcp/` – Enterprise stack example with `.cursor/` output

---

## Contributing Back

If you create useful modules, commands, skills, or subagents:

1. Fork the ai-development repository
2. Add your module to appropriate `modules/` folder
3. Update this guide with new stack profile
4. Submit pull request

---

## Support

- File issues in ai-development repository
- Discuss in team channels
- Contribute improvements back to main repo
