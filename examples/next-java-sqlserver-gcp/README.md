# Next.js + Java + SQL Server + GCP Example

This example demonstrates an enterprise application with regulated environment controls and GCP deployment.

## Stack Composition

### Enterprise Standards (Required)
- **ID:** `""`
- **Provides:** Core workflow standards, planning, solution framing
- 8 rules, 5 commands, 3 skills, 3 agents

### Project Controls
- **Base Controls** (`base`) - Minimum quality standards
- **Regulated Controls** (`regulated`) - Additional security and compliance
- 2 rules, 2 commands, 2 skills, 2 agents

### Technology Stack

#### Frontend
- **Next.js + Tailwind** (`frontend/next-tailwind`)
- App Router, server components, SSR patterns
- 1 rule, 2 commands, 1 skill, 1 agent

#### Backend
- **Java** (`backend/java`)
- Layered architecture, Spring Boot patterns
- 1 rule, 2 commands, 1 skill, 1 agent

#### Database
- **SQL Server** (`database/sqlserver`)
- Migration safety, schema conventions
- 1 rule, 1 command, 1 skill, 1 agent

#### Cloud
- **GCP** (`cloud/gcp`)
- Infrastructure as code, Cloud Run, security
- 1 rule, 2 commands, 1 skill, 1 agent

## Total Provides

- **15 rules** - Development constraints and security controls
- **14 commands** - Workflow entry points
- **10 skills** - How-to guidance and compliance patterns
- **9 agents** - Specialized AI perspectives

## Installation

### Using MCP Server

```javascript
install_environment({
  projectPath: "/path/to/your/project",
  selection: {
    enterprise: "",
    controls: ["base", "regulated"],
    stacks: [
      "frontend/next-tailwind",
      "backend/java",
      "database/sqlserver",
      "cloud/gcp"
    ]
  }
})
```

### Manual Installation

```bash
cd your-project/

# Enterprise standards (required)
mkdir -p .cursor/rules .cursor/skills .cursor/agents .cursor/hooks
cp ../ai-development/modules/enterprise-standards/rules/*.mdc .cursor/rules/
cp -r ../ai-development/modules/enterprise-standards/skills/* .cursor/skills/
cp ../ai-development/modules/enterprise-standards/agents/*.md .cursor/agents/
cp ../ai-development/modules/enterprise-standards/hooks.json .cursor/hooks.json
cp ../ai-development/modules/enterprise-standards/hooks.d/*.sh .cursor/hooks/

# Project controls
cp -r ../ai-development/modules/project-controls/base/cursor/* .cursor/
cp -r ../ai-development/modules/project-controls/regulated/cursor/* .cursor/

# Stack modules
cp -r ../ai-development/modules/stack-authorities/frontend/next-tailwind/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/backend/java/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/database/sqlserver/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/cloud/gcp/cursor/* .cursor/
```

## Key Commands

### Workflow Commands
- `/std-solution` - Frame the problem using hermeneutic circle
- `/std-plan` - Create teleological execution plan
- `/std-clean-sweep` - Code cleanup and review
- `/std-test-loop` - Testing workflow
- `/std-deploy-release` - Deployment preparation with security checks

### Frontend Commands
- `/web.next.build-screen` - Build Next.js screen with App Router
- `/web.next.route-audit` - Audit routing structure

### Backend Commands
- `/api.java.add-endpoint` - Add new REST endpoint
- `/api.java.test-loop` - Java testing workflow

### Database Commands
- `/db.sqlserver.migration` - Create SQL Server migration

### Cloud Commands
- `/cloud.gcp.deploy` - Deploy to GCP
- `/cloud.gcp.preflight` - Pre-deployment security checks

### Control Commands
- `/ctrl.base.check` - Basic quality verification
- `/ctrl.regulated.security-check` - Security and compliance audit

## Use Cases

### Ideal For:
- Enterprise applications
- Regulated industries (finance, healthcare, government)
- Applications requiring audit trails
- Server-side rendered applications
- SQL Server databases
- GCP infrastructure
- Security-critical systems

### Project Types:
- Banking and financial systems
- Healthcare applications (HIPAA)
- Government portals
- Enterprise resource planning (ERP)
- Customer relationship management (CRM)
- Compliance tracking systems

## Regulated Environment Features

The `regulated` control module adds:

- **Security Requirements**
  - Secret scanning before commits
  - Audit trail requirements
  - Access control verification
  - Data encryption standards

- **Compliance Checks**
  - Code review mandatory
  - Security testing required
  - Documentation requirements
  - Change approval workflows

- **Audit Features**
  - All changes logged
  - Deployment tracking
  - Security incident reporting
  - Compliance verification

## Technology Versions

This stack works with:
- Next.js 14+ (App Router)
- Java 17+
- Spring Boot 3+
- SQL Server 2019+
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
│   ├── 21-web-next-tailwind.mdc
│   ├── 31-api-java.mdc
│   ├── 41-db-sqlserver.mdc
│   ├── 51-cloud-gcp.mdc
│   ├── 90-ctrl-base.mdc
│   └── 91-ctrl-regulated.mdc
├── commands/
│   ├── std.*.md (5 files)
│   ├── web.next.*.md (2 files)
│   ├── api.java.*.md (2 files)
│   ├── db.sqlserver.*.md (1 file)
│   ├── cloud.gcp.*.md (2 files)
│   ├── ctrl.base.*.md (1 file)
│   └── ctrl.regulated.*.md (1 file)
├── skills/
│   ├── engineering-hygiene/
│   ├── hermeneutic-solution/
│   ├── teleological-planning/
│   ├── next-standards/
│   ├── java-api-standards/
│   ├── sqlserver-standards/
│   ├── gcp-infra-standards/
│   ├── project-basics/
│   └── regulated-delivery/
└── agents/
    ├── std.*.md (3 files)
    ├── web.next-critic.md
    ├── api.java-debugger.md
    ├── db.sqlserver-reviewer.md
    ├── cloud.gcp-release-manager.md
    ├── ctrl.base-verifier.md
    └── ctrl.security-reviewer.md
```

## Workflow Example

### Feature Development (Regulated)

```
1. /std-solution
   - Frame: "Add patient records management"
   - Document compliance requirements
   
2. /ctrl.regulated.security-check
   - Verify security controls in design
   
3. /std-plan
   - Plan with security milestones
   - Include audit trail requirements
   
4. /db.sqlserver.migration
   - Create encrypted tables
   - Add audit columns
   
5. /api.java.add-endpoint
   - Build secure REST endpoints
   - Implement access controls
   
6. /web.next.build-screen
   - Build UI with role-based access
   
7. /std-clean-sweep
   - Security code review
   
8. /std-test-loop
   - Run security tests
   
9. /ctrl.regulated.security-check
   - Final compliance verification
   
10. /cloud.gcp.preflight
    - Security and compliance checks
    
11. /cloud.gcp.deploy
    - Deploy with audit logging
```

## Security Best Practices

### Enforced by Regulated Controls:

1. **Authentication & Authorization**
   - Multi-factor authentication
   - Role-based access control
   - Session management

2. **Data Protection**
   - Encryption at rest
   - Encryption in transit
   - Data masking for PII

3. **Audit & Logging**
   - All access logged
   - Immutable audit trails
   - Retention policies

4. **Code Security**
   - Secret scanning
   - Dependency scanning
   - Static analysis

5. **Deployment Security**
   - Environment isolation
   - Secrets management
   - Infrastructure as code

## Next Steps

1. Install using MCP server or manual copy
2. Restart Cursor to load rules and commands
3. Review security requirements in `.cursor/rules/91-ctrl-regulated.mdc`
4. Configure secrets management
5. Set up audit logging
6. Start building with `/std-solution`
7. Run `/ctrl.regulated.security-check` before each release

## Compliance Support

This configuration supports compliance with:
- HIPAA (Healthcare)
- SOC 2
- GDPR
- PCI-DSS (with additional controls)
- ISO 27001

Consult with your compliance team for specific requirements.

## Support

See project documentation at `/Users/robertfiore/development/ai-development/README.md`
