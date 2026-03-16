# Example: Authentication Feature Framing

**Problem Context:** Users can access all pages without authentication, creating security risk.

---

## Hermeneutic Circle Application

### Iteration 1: Initial Understanding

**Problem (first guess):**
"We need to add authentication"

**Questions from planner:**
- Authentication for what? All pages or specific pages?
- What type of auth? Email/password, OAuth, SSO?
- What happens to existing anonymous users?

**Realization:** Problem statement too vague.

---

### Iteration 2: Refined Understanding

**Current State:**
- All pages publicly accessible
- No user accounts exist
- No way to identify returning users
- Sensitive data (user profiles, orders) visible to anyone

**Desired Outcome:**
Users must log in with email/password to access protected pages (profile, orders, admin).

**Acceptance Criteria:**
1. Users can register with email + password
2. Users can log in and receive session token
3. Protected pages redirect to login if not authenticated
4. Public pages (home, about) remain accessible
5. Session persists across page refreshes
6. Token expires after 24 hours

**Non-Goals:**
- OAuth/SSO (future enhancement)
- Password reset flow (v2)
- Two-factor authentication (v2)
- Remember me functionality (v2)

**Constraints:**
- Must use existing PostgreSQL database
- Frontend is React (can't change)
- Backend is Node.js + Fastify
- No breaking changes to existing API endpoints

**Questions from verifier:**
- How do we handle users currently using the site?
- What about SEO for currently-public pages that will become protected?
- Rate limiting on login attempts?

---

### Iteration 3: Final Refinement

**Current State (more specific):**
- Site has 5,000 monthly visitors
- 3 pages need protection: /profile, /orders, /admin
- 10 pages stay public: home, about, products, etc.
- Backend has user data but no auth mechanism
- Frontend has no login UI

**Desired Outcome (validated):**
Authenticated users can access their profiles and orders. Unauthenticated visitors can browse products but must register to purchase.

**Acceptance Criteria (complete):**
1. User registration: Email + password (min 8 chars)
2. User login: Returns JWT token, expires 24h
3. Protected routes: Redirect to /login with return URL
4. Public routes: No auth check
5. Session persistence: LocalStorage stores token
6. Token validation: Backend validates on protected endpoints
7. Logout: Clears token, redirects to home

**Non-Goals (clarified):**
- Password reset (out of scope - users can re-register for v1)
- OAuth (future)
- Admin roles (all logged-in users are "user" role for v1)

**Constraints (validated):**
- PostgreSQL: Add users table, no migration required for existing data
- React: Add login/register forms, auth context
- Fastify: Add JWT middleware, registration/login endpoints
- Backward compatible: Existing public API endpoints unchanged

**Success Metrics:**
- 100% of profile/order page access requires auth
- Login flow < 5 seconds
- Zero downtime during deployment
- Registration conversion > 60%

---

## Why This Works

**Iteration 1:** Too vague - couldn't plan
**Iteration 2:** Much better - identified gaps through questioning
**Iteration 3:** Complete - can now derive specific tasks backward from outcome

**Hermeneutic Circle in Action:**
- Parts (details) informed whole (big picture)
- Whole clarified what parts were needed
- Questions revealed assumptions
- Iteration improved understanding

---

## Planning Phase (After Framing)

Now that problem is framed, we can plan backward:

**End State:** Users authenticated to access protected pages

**Phase 4:** Deploy and verify
- All criteria met
- Session working
- Auth flow complete

**Phase 3:** Frontend integration
- Login/register forms
- Auth context
- Protected route wrapper
- Token storage

**Phase 2:** Backend API
- Registration endpoint
- Login endpoint
- JWT middleware
- Token validation

**Phase 1:** Database
- Users table
- Password hashing
- Migration

Each phase derived backward from end state. Tasks map to acceptance criteria.

---

## Key Takeaways

1. **Iterate:** First understanding always incomplete
2. **Question:** Agents challenge assumptions
3. **Specify:** Vague → Concrete through dialog
4. **Validate:** Verifier tests coherence
5. **Plan:** Only after framing complete

This is the hermeneutic circle method in practice.
