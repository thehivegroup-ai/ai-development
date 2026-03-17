---
name: keycloak-bff-auth
version: 1.0.0
description: >
  Keycloak BFF authentication — OIDC integration, JWT verification, RBAC middleware, and frontend token 
  management. Use when implementing Keycloak authentication, adding protected routes, configuring RBAC 
  middleware, or debugging JWT and token issues.
  
  Trigger when user mentions: Keycloak, OIDC, JWT token, authentication middleware, RBAC, protected route, 
  role-based access, token refresh, or asks about Keycloak integration or authentication setup.
---

# Keycloak BFF Authentication

## When to Use

- Implementing authentication or authorization in a project that uses Keycloak.
- Adding login, logout, or token refresh flows.
- Creating protected routes with role-based access control.
- Setting up Keycloak for local development (Docker, realm, client, roles, users).
- Debugging JWT verification, token refresh, or role enforcement issues.

## Design Goals

- The frontend never communicates with Keycloak directly (BFF pattern).
- OIDC abstraction supports Keycloak, Cognito, and other providers via issuer detection.
- Role extraction handles multiple JWT claim formats for provider portability.
- Test mode allows development without a running Keycloak instance.

## Instructions

### Setting Up Keycloak (Local Development)

1. **Docker Compose** — run Keycloak 23+ with a PostgreSQL database.
   - Create a separate `keycloak` database alongside the application database.
   - Use `start-dev` mode with `KC_HTTP_ENABLED=true` and `KC_HOSTNAME_STRICT=false`.

2. **Setup Script** — automate realm, client, roles, and test user creation via the Keycloak Admin REST API.
   - Realm: `{project-name}`
   - Client: `{project-name}-api` (confidential, direct access grants enabled)
   - Roles: `admin`, `viewer` (minimum; add project-specific roles as needed)
   - Test users: one per role with known passwords
   - Audience mapper: add `aud` claim with the client ID value

3. **Environment Configuration**:
   ```
   OIDC_ISSUER=http://localhost:8080/realms/{project-name}
   JWT_AUDIENCE={project-name}-api
   JWT_ALGORITHMS=RS256
   KEYCLOAK_REALM={project-name}
   KEYCLOAK_CLIENT_ID={project-name}-api
   KEYCLOAK_CLIENT_SECRET=<from-setup-script>
   KEYCLOAK_SERVER_URL=http://localhost:8080
   ```

### Backend: Authentication Routes

4. **POST /auth/login** — accept `{ username, password }`, use `openid-client` password grant, return `{ access_token, refresh_token, expires_in, user }`.

5. **POST /auth/refresh** — accept `{ refresh_token }`, exchange for new token set, return same shape as login.

6. **POST /auth/logout** — stateless logout (return 200). Token invalidation is client-side. For server-side invalidation, implement token blacklisting.

7. **GET /auth/me** — verify the Bearer token and return the current user profile from JWT claims.

### Backend: JWT Verification Middleware

8. **Auth middleware** — extract `Authorization: Bearer {token}`, verify with `jose` against JWKS, attach `request.user` with `{ sub, email, name, roles }`.
   - JWKS URL for Keycloak: `{issuer}/protocol/openid-connect/certs`
   - JWKS URL for standard OIDC: `{issuer}/.well-known/jwks.json`

9. **Role middleware** — factory function `requireRole(...roles)` that checks `request.user.roles`. Export convenience helpers: `requireAdmin`, `requireViewer`.

### Backend: Role Extraction

10. Extract roles from the JWT payload handling multiple formats:
    - `realm_access.roles` (Keycloak)
    - `cognito:groups` (AWS Cognito)
    - `roles` or `groups` (generic OIDC)

### Frontend: Auth Context and Token Management

11. **AuthContext** — React context with `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`.
    - On mount: check stored token, attempt refresh if expired.
    - Periodic refresh interval (60 seconds).

12. **Token storage** — `localStorage` with namespaced keys: `{app}_auth_token`, `{app}_auth_token_expiry`, `{app}_refresh_token`.

13. **API client interceptors**:
    - Request: attach `Authorization: Bearer {token}`.
    - Response: on 401, attempt refresh and retry. Queue concurrent requests during refresh to prevent parallel refresh calls.

14. **ProtectedRoute** — component that redirects unauthenticated users to `/login?redirect={currentPath}`.

15. **Role checks in UI** — use `user.roles.includes('admin')` for conditional rendering of admin-only features.

### Test Mode

16. When `JWT_SECRET` is set and OIDC is not configured, generate HS256 test tokens without Keycloak. This enables:
    - Unit and integration tests without Docker.
    - Fast local development iteration.

## References

- `references/auth-flow.md` — detailed sequence diagrams for login, refresh, and logout.
- `references/rbac-patterns.md` — role-based access control patterns and middleware examples.
