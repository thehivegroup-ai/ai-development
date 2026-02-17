# Angular + Fastify + PostgreSQL + AWS Example

This example demonstrates a modern Angular application with standalone components, Signals, and AWS deployment.

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
- **Angular + Tailwind** (`frontend/angular-tailwind`)
- Standalone components, Signals, typed reactive forms
- 1 rule, 1 command, 3 skills, 1 agent

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

- **13 rules** - Development constraints and patterns
- **13 commands** - Workflow entry points
- **10 skills** - How-to guidance with Angular patterns
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
      "frontend/angular-tailwind",
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
cp -r ../ai-development/modules/stack-authorities/frontend/angular-tailwind/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/backend/node-fastify/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/database/postgres/cursor/* .cursor/
cp -r ../ai-development/modules/stack-authorities/cloud/aws/cursor/* .cursor/
```

## Key Commands

### Workflow Commands
- `/std-solution` - Frame the problem using hermeneutic circle
- `/std-plan` - Create teleological execution plan
- `/std-clean-sweep` - Code cleanup and review
- `/std-test-loop` - Testing workflow
- `/std-deploy-release` - Deployment preparation

### Frontend Commands
- `/web.angular.template-audit` - Audit Angular templates and forms

### Backend Commands
- `/api.fastify.add-route` - Add new API route
- `/api.fastify.test-loop` - API testing workflow

### Database Commands
- `/db.postgres.migration` - Create database migration
- `/db.postgres.performance-check` - Query optimization

### Cloud Commands
- `/cloud.aws.deploy` - Deploy to AWS
- `/cloud.aws.preflight` - Pre-deployment checks

## Angular-Specific Features

This stack includes comprehensive Angular guidance:

### Skills Provided

1. **angular-tailwind-standards**
   - Standalone component patterns
   - Tailwind integration
   - Design token usage

2. **angular-forms-validation**
   - Typed reactive forms
   - Custom validators
   - Real-time validation with Signals
   - Multi-step forms
   - Error handling patterns

3. **angular-data-integration**
   - HttpClient with Signals
   - Loading/error state management
   - Optimistic updates
   - Pagination patterns
   - File upload with progress

### Modern Angular Patterns

- **Standalone Components** - No NgModules required
- **Signals** - Reactive state management
- **Modern Template Syntax** - `@if`, `@for`, `@switch`
- **Typed Forms** - Full type safety
- **MCP Tool Integration** - Angular CLI via MCP

## Use Cases

### Ideal For:
- Enterprise Angular applications
- Form-heavy applications
- Data-intensive dashboards
- Admin panels
- Internal tools
- Real-time applications

### Project Types:
- ERP systems
- CRM platforms
- Business intelligence dashboards
- Inventory management
- Order management systems
- Analytics platforms

## Technology Versions

This stack works with:
- Angular 17+ (standalone components, Signals)
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
│   ├── 22-web-angular-tailwind.mdc
│   ├── 30-api-node-fastify.mdc
│   ├── 40-db-postgres.mdc
│   ├── 50-cloud-aws.mdc
│   └── 90-ctrl-base.mdc
├── commands/
│   ├── std.*.md (5 files)
│   ├── web.angular.*.md (1 file)
│   ├── api.fastify.*.md (2 files)
│   ├── db.postgres.*.md (2 files)
│   ├── cloud.aws.*.md (2 files)
│   └── ctrl.base.*.md (1 file)
├── skills/
│   ├── engineering-hygiene/
│   ├── hermeneutic-solution/
│   ├── teleological-planning/
│   ├── angular-tailwind-standards/
│   ├── angular-forms-validation/
│   ├── angular-data-integration/
│   ├── fastify-api-standards/
│   ├── postgres-standards/
│   ├── aws-infra-standards/
│   └── project-basics/
└── agents/
    ├── std.*.md (3 files)
    ├── web.angular-critic.md
    ├── api.fastify-debugger.md
    ├── db.postgres-reviewer.md
    ├── cloud.aws-release-manager.md
    └── ctrl.base-verifier.md
```

## Workflow Example

### Feature: User Management with Forms

```
1. /std-solution
   - Frame: "Add user management with complex forms"
   
2. /std-plan
   - Plan: API endpoints, Angular forms, database schema
   
3. /db.postgres.migration
   - Create users table
   
4. /api.fastify.add-route
   - Build CRUD endpoints for users
   
5. Build Angular Components
   - Use angular-forms-validation skill
   - Typed reactive forms with custom validators
   - Real-time validation with Signals
   
6. Build Data Service
   - Use angular-data-integration skill
   - HttpClient with Signals
   - Loading/error state management
   
7. /web.angular.template-audit
   - Audit forms and data integration
   
8. /std-clean-sweep
   - Review and clean code
   
9. /std-test-loop
   - Run tests with data-testid attributes
   
10. /cloud.aws.deploy
    - Deploy to AWS
```

## Angular Forms Example

The `angular-forms-validation` skill provides patterns for:

### Typed Reactive Forms

```typescript
// Fully typed form with custom validators
interface UserForm {
  name: string;
  email: string;
  age: number;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
}

const form = this.fb.group<UserForm>({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  age: [18, [rangeValidator(18, 100)]],
  preferences: this.fb.group({
    newsletter: [false],
    notifications: [true]
  })
});
```

### Real-time Validation with Signals

```typescript
// Reactive validation state
readonly nameError = toSignal(
  this.form.controls.name.statusChanges.pipe(
    map(() => this.getErrorMessage('name'))
  )
);
```

## Angular Data Integration Example

The `angular-data-integration` skill provides patterns for:

### HttpClient with Signals

```typescript
export class UserService {
  private http = inject(HttpClient);
  
  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  
  loadUsers() {
    this.loading.set(true);
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
```

## Testing with data-testid

All Angular patterns include `data-testid` attributes for E2E testing:

```html
<form [formGroup]="form" data-testid="user-form">
  <input 
    formControlName="name" 
    data-testid="user-form-name-input"
  />
  
  <button 
    type="submit" 
    data-testid="user-form-submit-button"
  >
    Save
  </button>
</form>
```

## Next Steps

1. Install using MCP server or manual copy
2. Restart Cursor to load rules and commands
3. Review Angular skills:
   - `.cursor/skills/angular-forms-validation/SKILL.md`
   - `.cursor/skills/angular-data-integration/SKILL.md`
   - `.cursor/skills/angular-tailwind-standards/SKILL.md`
4. Type `/` to see available commands
5. Start building with `/std-solution`
6. Use `/web.angular.template-audit` to verify patterns

## Angular MCP Integration

This configuration includes the Angular CLI MCP server integration. Use:
- `get_best_practices` for Angular coding standards
- `search_documentation` for Angular concepts
- `find_examples` for code examples

## Support

See project documentation at `/Users/robertfiore/development/ai-development/README.md`
