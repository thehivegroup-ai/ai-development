# Keycloak BFF Authentication

Standards for implementing Keycloak-based authentication using the Backend-for-Frontend (BFF) pattern.

## Focus

- The frontend never communicates with Keycloak directly; all auth flows go through the API.
- OIDC-based authentication using `openid-client` for token exchange.
- JWT verification using `jose` with JWKS from the Keycloak realm.
- Role-based access control with Fastify middleware.
- Dual-provider support (Keycloak for local dev, AWS Cognito for production).

## Architecture

```
Browser  ──POST /auth/login──▶  API  ──password grant──▶  Keycloak
         ◀─ tokens + user ───       ◀── token set ──────

Browser  ──Bearer token──────▶  API  ──verify JWT────────▶  JWKS endpoint
         ◀─ protected data ──       ◀── public keys ─────
```

## Key Patterns

- **BFF proxy** — frontend sends credentials to API, API exchanges with Keycloak.
- **OIDC abstraction** — same code path works for Keycloak, Cognito, or Auth0 via issuer detection.
- **Role extraction** — handles `realm_access.roles`, `cognito:groups`, `roles`, `groups`.
- **Test mode** — `JWT_SECRET` env var enables HS256 tokens for testing without Keycloak.
- **Refresh queue** — Axios interceptor queues requests during token refresh to prevent parallel refresh calls.
