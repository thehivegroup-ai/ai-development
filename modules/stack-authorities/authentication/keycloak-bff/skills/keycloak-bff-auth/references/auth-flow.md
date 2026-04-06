# Authentication Flow Reference

Detailed flows for the Keycloak BFF authentication pattern.

---

## Login Flow

```
1. User enters credentials on LoginPage
2. Frontend POST /auth/login { username, password }
3. API receives credentials (never forwarded to frontend from Keycloak)
4. API creates openid-client instance:
   - Discover issuer: Issuer.discover(OIDC_ISSUER)
   - Create confidential client with client_id + client_secret
5. API calls Keycloak token endpoint:
   - grant_type: password
   - scope: openid profile email
6. Keycloak validates credentials and returns TokenSet:
   - access_token (RS256 JWT)
   - refresh_token
   - expires_in
   - id_token
7. API decodes access_token to extract user info:
   - sub, email, name from standard claims
   - roles from realm_access.roles
8. API returns to frontend:
   - { access_token, refresh_token, expires_in, user: { sub, email, name, roles } }
9. Frontend stores tokens in localStorage
10. Frontend updates AuthContext (isAuthenticated: true, user)
11. Frontend redirects to original destination or dashboard
```

## Token Refresh Flow

```
1. Periodic check (every 60 seconds) or 401 response intercepted
2. Frontend POST /auth/refresh { refresh_token }
3. API creates openid-client instance (same as login)
4. API calls Keycloak token endpoint:
   - grant_type: refresh_token
   - refresh_token: <stored_refresh_token>
5. Keycloak validates refresh token and returns new TokenSet
6. API returns new { access_token, refresh_token, expires_in }
7. Frontend updates stored tokens
8. If triggered by 401: retry original request with new token
```

### Refresh Queue Pattern

When multiple requests hit 401 simultaneously:

```
Request A → 401 → starts refresh → queues Request A
Request B → 401 → refresh in progress → queues Request B
Request C → 401 → refresh in progress → queues Request C
                   refresh completes → retry A, B, C with new token
```

Implementation:
- Track `isRefreshing` flag and a `failedQueue` array.
- First 401 triggers refresh; subsequent 401s queue their retry promises.
- On refresh success, drain the queue and retry all with the new token.
- On refresh failure, reject all queued promises and redirect to login.

## Logout Flow

```
1. User clicks logout
2. Frontend POST /auth/logout
3. API returns 200 (stateless — no server-side session to invalidate)
4. Frontend clears all tokens from localStorage
5. Frontend resets AuthContext (isAuthenticated: false, user: null)
6. Frontend redirects to /login
```

## Request Authentication Flow

```
1. Frontend makes API request with Authorization: Bearer <access_token>
2. Auth middleware extracts token from header
3. Auth middleware fetches JWKS from Keycloak (cached):
   - Keycloak: {issuer}/protocol/openid-connect/certs
   - Standard: {issuer}/.well-known/jwks.json
4. Auth middleware verifies JWT:
   - Signature (RS256 via JWKS)
   - Issuer claim matches OIDC_ISSUER
   - Audience claim matches JWT_AUDIENCE
   - Token not expired
5. Auth middleware extracts user from payload:
   - { sub, email, name, roles }
6. Auth middleware attaches request.user
7. Role middleware (if present) checks request.user.roles
8. Route handler executes with authenticated context
```

## Test Mode Flow

```
1. JWT_SECRET is set, OIDC_ISSUER is not configured
2. Auth middleware detects test mode
3. JWT verified with HS256 using JWT_SECRET instead of JWKS
4. Test helpers generate tokens: createTestToken({ sub, roles })
5. No Keycloak instance required
```
