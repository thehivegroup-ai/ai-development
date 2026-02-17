# RBAC Patterns Reference

Role-based access control patterns for the Keycloak BFF authentication module.

---

## Keycloak Role Configuration

### Realm Roles

Define roles at the realm level in Keycloak:

| Role | Purpose |
|------|---------|
| `admin` | Full access — create, read, update, delete |
| `viewer` | Read-only access |

Add project-specific roles as needed (e.g., `editor`, `manager`, `auditor`).

### Audience Mapper

Add a client mapper of type "Audience" to include the client ID in the `aud` claim.
This enables JWT audience verification on the API side.

---

## Backend Middleware

### Auth Middleware (`auth.middleware.ts`)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized', message: 'Missing token' });
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: config.oidc.issuer,
      audience: config.jwt.audience,
    });

    request.user = {
      sub: payload.sub!,
      email: payload.email as string,
      name: payload.name as string,
      roles:
        payload.realm_access?.roles ||
        payload['cognito:groups'] ||
        payload.roles ||
        payload.groups ||
        [],
    };
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid token' });
  }
}
```

### Role Middleware (`roles.middleware.ts`)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'Authentication required' });
    }

    const hasRequiredRole = roles.some((role) => request.user.roles.includes(role));
    if (!hasRequiredRole) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        requiredRoles: roles,
      });
    }
  };
}

export const requireAdmin = requireRole('admin');
export const requireViewer = requireRole('viewer', 'admin');
```

### Route Usage

```typescript
// Read endpoints — viewer or admin
fastify.get('/items', {
  preHandler: [authMiddleware, requireViewer],
  schema: { tags: ['Items'] },
}, getItemsHandler);

// Write endpoints — admin only
fastify.post('/items', {
  preHandler: [authMiddleware, requireAdmin],
  schema: { tags: ['Items'], body: createItemSchema },
}, createItemHandler);

// Public endpoints — no middleware
fastify.get('/health', healthHandler);

// Custom role check
fastify.put('/items/:id/approve', {
  preHandler: [authMiddleware, requireRole('admin', 'manager')],
}, approveItemHandler);
```

---

## Frontend Patterns

### Role-Based UI Rendering

```tsx
// Conditional rendering based on role
const isAdmin = useMemo(() => {
  return (user?.roles ?? []).includes('admin');
}, [user?.roles]);

return (
  <div>
    <ItemList items={items} />
    {isAdmin && <AdminPanel />}
  </div>
);
```

### ProtectedRoute Component

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}
```

### Role-Gated Route

```tsx
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user?.roles.includes('admin')) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}
```

---

## Testing Patterns

### Test Token Helper

```typescript
import jwt from 'jsonwebtoken';

export function createTestToken(overrides: Partial<JwtPayload> = {}): string {
  const payload = {
    sub: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    realm_access: { roles: ['viewer'] },
    aud: 'app-api',
    iss: 'test-issuer',
    ...overrides,
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, { algorithm: 'HS256', expiresIn: '1h' });
}

// Admin token
const adminToken = createTestToken({
  realm_access: { roles: ['admin'] },
});

// Viewer token
const viewerToken = createTestToken({
  realm_access: { roles: ['viewer'] },
});
```

### Integration Test Example

```typescript
describe('POST /items', () => {
  it('allows admin to create items', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/items',
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { name: 'Test Item' },
    });
    expect(response.statusCode).toBe(201);
  });

  it('forbids viewer from creating items', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/items',
      headers: { authorization: `Bearer ${viewerToken}` },
      payload: { name: 'Test Item' },
    });
    expect(response.statusCode).toBe(403);
  });

  it('rejects unauthenticated requests', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/items',
      payload: { name: 'Test Item' },
    });
    expect(response.statusCode).toBe(401);
  });
});
```
