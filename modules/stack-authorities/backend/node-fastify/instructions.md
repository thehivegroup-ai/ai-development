# Node Fastify

**Platform-Agnostic Instructions**

This file contains base instructions that apply across all platforms.


---


# API Node Fastify

## Structure

- **Use Fastify plugins** for shared concerns (logging, auth, validation, error handling)
- **Validate request/response schemas** at the route level using JSON schema
- **Keep route handlers thin** – Business logic lives in service layer
- **Standardize error responses** – Consistent error envelopes and status codes

## Schema Validation

Every route MUST define request/response schemas:

```typescript
// ✅ CORRECT: Schema validation
const createUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      name: { type: 'string', minLength: 1 },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
      },
    },
  },
};

fastify.post('/users', { schema: createUserSchema }, async (request, reply) => {
  const user = await userService.createUser(request.body);
  reply.code(201).send(user);
});
```

## Error Handling

Use consistent error envelopes:

```typescript
// ✅ CORRECT: Standardized error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { "field": "email" }
  }
}
```

## Status Codes

- `200` – Success with body
- `201` – Created
- `204` – Success, no body
- `400` – Bad request (validation failure)
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not found
- `409` – Conflict
- `500` – Server error

## Non-Interactive Command Execution

**NEVER use interactive flags with npm commands:**

```bash
# ❌ WRONG
npm install --interactive

# ✅ CORRECT  
npm install

# ❌ WRONG
npx some-cli --interactive

# ✅ CORRECT
npx some-cli --yes  # Use non-interactive flag
```
