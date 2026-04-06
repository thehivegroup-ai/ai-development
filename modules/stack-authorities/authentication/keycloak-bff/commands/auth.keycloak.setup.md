# Auth Keycloak Setup

Set up Keycloak for local development with Docker, realm configuration, and test users.

## Steps

1. Add Keycloak and its PostgreSQL database to `docker-compose.yml`.
2. Create an init script for the Keycloak database (`CREATE DATABASE keycloak`).
3. Create a setup script (`scripts/setup-keycloak.sh`) that uses the Keycloak Admin REST API to:
   - Create a realm named after the project.
   - Create a confidential client with direct access grants enabled.
   - Add an audience mapper for the `aud` claim.
   - Create realm roles (`admin`, `viewer`).
   - Create test users with known passwords and assigned roles.
4. Add OIDC environment variables to `.env.example` and `.env`.
5. Install backend dependencies: `openid-client`, `jose`.
6. Create the auth config module with JWKS URL resolution and issuer discovery.
7. Create auth routes: `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.
8. Create auth middleware (JWT verification) and role middleware (`requireRole`, `requireAdmin`, `requireViewer`).
9. Install frontend dependencies: `axios` (if not present).
10. Create the `AuthContext`, token storage utilities, and API client interceptors.
11. Create the `ProtectedRoute` component and `LoginPage`.
12. Verify end-to-end: start Keycloak, run setup script, login as test user, access protected route.

## Guidance

- Apply the `keycloak-bff-auth` skill for the full implementation methodology.
- Invoke the `auth.keycloak-reviewer` agent to validate the implementation.
- Reference `auth-flow.md` for sequence diagrams and `rbac-patterns.md` for middleware examples.
