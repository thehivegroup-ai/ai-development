# Keycloak Bff

**Platform-Agnostic Instructions**

This file contains base instructions that apply across all platforms.


---


# Auth Keycloak BFF

## Architecture: Backend-for-Frontend

The frontend MUST NOT communicate with Keycloak directly. All authentication flows go through the API.

```
Frontend  ──POST /auth/login──▶  API  ──password grant──▶  Keycloak
          ◀─ tokens + user ───       ◀── token set ──────
```

## Backend Authentication

### OIDC Token Exchange

- Use `openid-client` to discover the issuer and exchange credentials.
- Use the **password grant** (`grant_type: 'password'`) with `scope: 'openid profile email'`.
- The API is a **confidential client** — `client_secret` is never exposed to the frontend.

```typescript
// ✅ CORRECT: OIDC password grant via openid-client
const issuer = await Issuer.discover(config.oidc.issuer);
const client = new issuer.Client({
  client_id: config.oidc.clientId,
  client_secret: config.oidc.clientSecret,
  token_endpoint_auth_method: 'client_secret_post',
});
const tokenSet = await client.grant({
  grant_type: 'password',
  username,
  password,
  scope: 'openid profile email',
});
```

### JWT Verification

- Use `jose` (`createRemoteJWKSSet`) to verify tokens against the Keycloak JWKS endpoint.
- Keycloak JWKS URL: `{issuer}/protocol/openid-connect/certs`.
- Validate `iss`, `aud`, and `exp` claims.

```typescript
// ✅ CORRECT: JWKS-based verification
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(new URL(jwksUrl));
const { payload } = await jwtVerify(token, JWKS, {
  issuer: config.oidc.issuer,
  audience: config.jwt.audience,
});
```

### Role Extraction

Extract roles from the JWT payload. Handle multiple claim formats for provider portability:

```typescript
// ✅ CORRECT: Multi-provider role extraction
const roles =
  payload.realm_access?.roles ||   // Keycloak
  payload['cognito:groups'] ||     // AWS Cognito
  payload.roles ||                 // Generic OIDC
  payload.groups ||                // Fallback
  [];
```

## Backend Authorization

### Middleware Pattern

- **Auth middleware** — verifies JWT and attaches `request.user` with `sub`, `email`, `roles`.
- **Role middleware** — checks `request.user.roles` against required roles.

```typescript
// ✅ CORRECT: Role middleware factory
export function requireRole(...roles: string[]) {
  return async (request, reply) => {
    if (!request.user) return reply.status(401).send({ error: 'Unauthorized' });
    const hasRole = roles.some(role => request.user.roles.includes(role));
    if (!hasRole) return reply.status(403).send({ error: 'Forbidden', requiredRoles: roles });
  };
}

export const requireAdmin = requireRole('admin');
export const requireViewer = requireRole('viewer', 'admin');
```

### Route Protection

Apply middleware in `preHandler`:

```typescript
// ✅ CORRECT: Protected route
fastify.get('/items', { preHandler: [authMiddleware, requireViewer] }, handler);
fastify.post('/items', { preHandler: [authMiddleware, requireAdmin] }, handler);
```

## Frontend Authentication

### Token Storage

Store tokens in `localStorage` with namespaced keys:

- `{app}_auth_token` — access token
- `{app}_auth_token_expiry` — expiry timestamp
- `{app}_refresh_token` — refresh token

### Auth Context

- `AuthContext` manages `user`, `isAuthenticated`, `isLoading`.
- On mount: attempt to restore session from stored token or refresh.
- Periodic token refresh (every 60 seconds).

### Axios Interceptor Pattern

- **Request interceptor** — attach `Authorization: Bearer {token}`.
- **Response interceptor** — on 401, attempt token refresh and retry; queue concurrent requests during refresh.

```typescript
// ✅ CORRECT: 401 interceptor with refresh queue
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Route Protection

Use a `ProtectedRoute` component that redirects unauthenticated users to `/login?redirect={currentPath}`.

## Test Mode

When `JWT_SECRET` is set and OIDC is not configured, use HS256 tokens for testing without a running Keycloak instance.

## Provider Portability

The OIDC abstraction supports multiple providers via issuer detection:

- Keycloak: `issuer.includes('/realms/')`
- Cognito: `issuer.includes('cognito')`

New providers can be added by extending the issuer detection and role extraction logic.
