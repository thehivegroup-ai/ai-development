# Microservices Architecture Example

This example demonstrates how to configure multiple independent microservices, each with its own technology stack and development standards.

## Architecture

```
microservices/
├── services/
│   ├── user-service/        # Node.js + Postgres (regulated)
│   ├── order-service/       # Node.js + Postgres
│   ├── inventory-service/   # Java + SQL Server
│   ├── notification-service/# Node.js (no DB)
│   └── api-gateway/         # Node.js (regulated)
├── shared/
│   └── contracts/           # API contracts, types
└── infrastructure/
    └── aws/                 # IaC for all services
```

## Service Configurations

### User Service (Authentication & Authorization)
**Stack:** Node.js + Fastify + PostgreSQL + AWS  
**Controls:** Base + Regulated (handles sensitive data)

```javascript
install_environment({
  projectPath: "/path/to/services/user-service",
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

**Responsibilities:**
- User authentication
- Authorization tokens
- User profiles
- Audit logging

**Why Regulated:** Handles PII and security credentials

### Order Service
**Stack:** Node.js + Fastify + PostgreSQL + AWS  
**Controls:** Base

```javascript
install_environment({
  projectPath: "/path/to/services/order-service",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: [
      "backend/node-fastify",
      "database/postgres",
      "cloud/aws"
    ]
  }
})
```

**Responsibilities:**
- Order management
- Order history
- Order status tracking

### Inventory Service
**Stack:** Java + Spring Boot + SQL Server + AWS  
**Controls:** Base

```javascript
install_environment({
  projectPath: "/path/to/services/inventory-service",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: [
      "backend/java",
      "database/sqlserver",
      "cloud/aws"
    ]
  }
})
```

**Responsibilities:**
- Product inventory
- Stock management
- Warehouse operations

**Why Java:** Existing enterprise Java ecosystem

### Notification Service
**Stack:** Node.js + Fastify + AWS  
**Controls:** Base  
**Note:** No database (stateless)

```javascript
install_environment({
  projectPath: "/path/to/services/notification-service",
  selection: {
    enterprise: "",
    controls: ["base"],
    stacks: [
      "backend/node-fastify",
      "cloud/aws"
    ]
  }
})
```

**Responsibilities:**
- Email notifications
- SMS alerts
- Push notifications
- Event processing

### API Gateway
**Stack:** Node.js + Fastify + AWS  
**Controls:** Base + Regulated (entry point)

```javascript
install_environment({
  projectPath: "/path/to/services/api-gateway",
  selection: {
    enterprise: "",
    controls: ["base", "regulated"],
    stacks: [
      "backend/node-fastify",
      "cloud/aws"
    ]
  }
})
```

**Responsibilities:**
- Request routing
- Authentication/authorization
- Rate limiting
- API composition

**Why Regulated:** Security perimeter for all services

## Directory Structure

```
microservices/
├── services/
│   ├── user-service/
│   │   ├── .cursor/              # Fastify + Postgres + Regulated
│   │   ├── src/
│   │   ├── stack.profile.json
│   │   └── package.json
│   ├── order-service/
│   │   ├── .cursor/              # Fastify + Postgres
│   │   ├── src/
│   │   ├── stack.profile.json
│   │   └── package.json
│   ├── inventory-service/
│   │   ├── .cursor/              # Java + SQL Server
│   │   ├── src/
│   │   ├── stack.profile.json
│   │   └── pom.xml
│   ├── notification-service/
│   │   ├── .cursor/              # Fastify only
│   │   ├── src/
│   │   ├── stack.profile.json
│   │   └── package.json
│   └── api-gateway/
│       ├── .cursor/              # Fastify + Regulated
│       ├── src/
│       ├── stack.profile.json
│       └── package.json
├── shared/
│   └── contracts/
│       ├── user.ts
│       ├── order.ts
│       └── inventory.ts
└── infrastructure/
    └── aws/
        ├── terraform/
        └── cloudformation/
```

## Microservices Principles

### Independence
Each service:
- Has its own `.cursor/` configuration
- Can be developed independently
- Can be deployed independently
- Has its own database (no shared DB)
- Uses its own technology stack

### Communication
Services communicate via:
- REST APIs
- Message queues (SQS, SNS)
- Event bus
- Service mesh

### Standards
All services share:
- Enterprise standards (workflow, planning)
- Base quality controls
- Common deployment patterns

But differ in:
- Programming language
- Database technology
- Security requirements
- Specific patterns

## Workflow Examples

### Cross-Service Feature

```
1. Gateway: /std.solution
   - Frame feature spanning multiple services
   
2. Gateway: /std.plan
   - Plan API changes and service coordination
   
3. User Service: /api.fastify.add-route
   - Add authentication endpoint
   
4. User Service: /db.postgres.migration
   - Update user schema
   
5. Order Service: /api.fastify.add-route
   - Add order endpoints (calls User Service)
   
6. Order Service: /db.postgres.migration
   - Update order schema
   
7. Gateway: Update routing
   - Wire new endpoints through gateway
   
8. All Services: /std.test-loop
   - Integration testing
   
9. Gateway: /ctrl.regulated.security-check
   - Security audit
   
10. Each Service: /cloud.aws.deploy
    - Deploy independently
```

### Single-Service Feature

```
1. Order Service: /std.solution
   - Feature contained to one service
   
2. Order Service: /std.plan
   
3. Order Service: /api.fastify.add-route
   
4. Order Service: /db.postgres.migration
   
5. Order Service: /std.clean-sweep
   
6. Order Service: /std.test-loop
   
7. Order Service: /cloud.aws.deploy
```

## Service Communication

### API Contracts (Shared)
Define contracts in `shared/contracts/`:

```typescript
// shared/contracts/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
}
```

Each service imports and implements contracts:

```typescript
// user-service/src/routes/auth.ts
import { User, AuthToken } from '@shared/contracts/user';
```

### Event-Driven Communication
Services publish events, others subscribe:

```
Order Created → Inventory Service (reserve stock)
             → Notification Service (send confirmation)
             → User Service (update activity)
```

## Testing Strategy

### Per-Service Tests
```bash
cd services/user-service
/std.test-loop  # Unit + integration tests
```

### Contract Tests
Verify service contracts match:
```bash
cd shared/contracts
npm run test:contracts
```

### End-to-End Tests
Test full user flows across services:
```bash
cd tests/e2e
npm run test:checkout  # Gateway → Order → Inventory → Notification
```

## Deployment

### Independent Deployment
Each service deploys separately:

```bash
# Deploy order service
cd services/order-service
/cloud.aws.deploy

# User service not affected
```

### Coordinated Deployment
For breaking changes, deploy in order:

```bash
1. Deploy user-service (new auth)
2. Deploy api-gateway (new routing)
3. Deploy order-service (uses new auth)
4. Deploy notification-service
5. Deploy inventory-service
```

### Blue-Green Deployment
Each service can do blue-green independently:

```bash
# Deploy v2 alongside v1
/cloud.aws.deploy --blue-green

# Switch traffic
/cloud.aws.switch-traffic

# Rollback if needed
/rollback_environment
```

## Monitoring & Observability

Each service should:
- Log to centralized logging (CloudWatch)
- Emit metrics (CloudWatch Metrics)
- Provide health endpoints
- Implement distributed tracing

Standards provided by enterprise module.

## Security

### API Gateway
- JWT validation
- Rate limiting
- Request sanitization
- CORS configuration

### Regulated Services (User Service, Gateway)
- Additional audit logging
- Secret scanning
- Security testing
- Compliance checks

### Service-to-Service
- mTLS between services
- API keys for internal calls
- Network isolation (VPC)

## Benefits of Microservices Approach

✅ **Independent Development**
- Teams own entire service
- Different technologies per service
- Independent release cycles

✅ **Scalability**
- Scale services independently
- Optimize per-service performance
- Right-size infrastructure

✅ **Resilience**
- Service failures isolated
- Graceful degradation
- Circuit breakers

✅ **Technology Flexibility**
- Java where it makes sense
- Node.js for others
- Best tool for the job

## Challenges & Solutions

### Challenge: Consistency
**Solution:** Shared enterprise standards across all services

### Challenge: Testing
**Solution:** Contract tests + E2E test suite

### Challenge: Deployment Complexity
**Solution:** Infrastructure as code + automated pipelines

### Challenge: Debugging
**Solution:** Distributed tracing + centralized logging

## When to Use Microservices

✅ **Good for:**
- Large teams (>20 developers)
- Complex domains
- Need for independent scaling
- Different technology requirements
- Frequent deployments

❌ **Not ideal for:**
- Small teams (<5 developers)
- Simple applications
- Early-stage startups
- Tight coupling between features

## Migration Path

### Start Simple
Begin with monolith using single stack profile.

### Identify Boundaries
Use `/std.solution` to identify service boundaries.

### Extract Services
One at a time, extract services with their own profiles.

### Add Gateway
Introduce API gateway to manage routing.

### Iterate
Continue extracting services as needed.

## Next Steps

1. Identify your service boundaries
2. Choose technology stack per service
3. Install appropriate modules per service
4. Set up shared contracts
5. Implement inter-service communication
6. Set up deployment pipelines
7. Implement monitoring and logging
8. Start building with `/std.solution` per service

## Support

See main README: `/Users/robertfiore/development/ai-development/README.md`
