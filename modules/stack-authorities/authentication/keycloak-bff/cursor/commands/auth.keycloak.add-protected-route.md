# Auth Keycloak Add Protected Route

Add authentication and role-based authorization to a new or existing API route.

## Steps

1. Identify the route to protect and the required access level (`viewer`, `admin`, or custom role).
2. Import `authMiddleware` and the appropriate role middleware (`requireAdmin`, `requireViewer`, or `requireRole`).
3. Add middleware to the route's `preHandler` array in the correct order: `[authMiddleware, requireRole(...)]`.
4. Ensure the route handler accesses user info via `request.user` (not by decoding the token again).
5. Add appropriate error responses to the route's schema (401, 403).
6. If this is a new CRUD resource, apply the standard pattern:
   - GET (list/detail): `requireViewer`
   - POST/PUT/PATCH: `requireAdmin`
   - DELETE: `requireAdmin`
7. Add integration tests covering:
   - Authenticated admin access (expect 2xx).
   - Authenticated viewer access (expect 2xx for reads, 403 for writes).
   - Unauthenticated access (expect 401).

## Guidance

- Apply the `keycloak-bff-auth` skill for middleware patterns.
- Reference `rbac-patterns.md` for complete middleware and test examples.
- Invoke the `auth.keycloak-reviewer` agent to validate the protected route.
