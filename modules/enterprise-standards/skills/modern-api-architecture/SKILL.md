---
name: modern-api-architecture
version: 1.0.0
description: >
  Modern backend API architecture principles for a Fastify + Prisma stack: schema-first
  contracts, layered services, composable auth/RBAC middleware, canonical envelopes,
  versioning, observability, resilience, and contract-level testing. Use when architecting
  new API surfaces, refactoring route structure, or establishing backend standards.

  Trigger when user mentions: API architecture, backend architecture, Fastify structure,
  route/service/repository layering, RBAC middleware design, API versioning, response
  envelope, OpenAPI contract, health/readiness design, or asks about building scalable
  maintainable backend services.
---

# Modern API Architecture

This skill treats the API as a **contract**: every route is a schema-validated,
permission-gated, envelope-consistent promise to callers, with business logic pushed down into a
testable service layer. Thirteen principles, ordered from foundational contract shape through the
harder cross-cutting concerns (idempotency, concurrency, state modeling, request bounds, and async
work) that most APIs get around to later — treat the last five as a deliberate audit checklist for
any API that has grown past its first few endpoints.

## Core Principles

1. **Schema-First Contracts** — request/response shape is defined once, in code, and everything
   else (validation, docs, types) derives from it.
2. **Layered Architecture (Route → Service/Repository → Data)** — handlers are thin; business
   logic and queries live in testable, framework-independent modules.
3. **Composable Auth & Authorization Middleware** — authentication and permission checks are
   declarative `preHandler` chains, never inline `if` statements in a handler body.
4. **Canonical Response & Error Envelopes** — one success shape, one error shape, enforced
   everywhere, not per-route improvisation.
5. **Deliberate Versioning & Path Stability** — paths are versioned from day one and every
   mount point is intentional and documented, not incidental.
6. **Observability & Structured Logging** — every request, and especially every privileged
   action, is traceable after the fact from logs alone.
7. **Resilience at the Edges** — anything that crosses a network boundary (identity provider,
   object storage, queues, third-party APIs) is timeout-bounded and degrades to a status, never
   an unhandled crash.
8. **Contract-Level Testing** — integration tests assert the contract (status codes, envelope
   shape, permission boundaries) against a real database, not a mocked one.
9. **Idempotency Where It Matters** — a retried write produces the same result whether it runs
   once or ten times, never a duplicate.
10. **Explicit Concurrency Control** — concurrent writers to the same resource are detected and
    resolved deterministically, never by silent last-write-wins.
11. **Explicit State Transition Modeling** — a resource with lifecycle states declares its valid
    transitions and enforces them server-side, with every transition recorded as an event.
12. **Protect Against Unbounded Requests** — every request has a bounded cost: payload size,
    collection size, and call rate, everywhere, not just where it happened to get added.
13. **Asynchronous Handling of Long-Running Work** — work that can't finish inside a normal
    HTTP timeout is accepted as a job and tracked, never held open on a live request.

---

## 1. Schema-First Contracts

### Principle

**The route's JSON Schema is the single source of truth** — Fastify validates the request against
it, serializes the response through it, and the OpenAPI document is generated from the same
object. Nothing is hand-documented separately from what the code enforces.

### Pattern

```typescript
// src/routes/orders.ts
const listOrdersQuerySchema = {
  type: 'object',
  properties: {
    q: { type: 'string', maxLength: 200 },
    status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'completed'] },
    page: { type: 'integer', minimum: 1, default: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 25 },
  },
  additionalProperties: false,
} as const;

app.get('/v1/orders', {
  preHandler: listAuth,
  schema: {
    querystring: listOrdersQuerySchema,
    response: { 200: listOrdersResponseSchema, ...CommonErrorResponsesSchema },
  },
}, handler);
```

`additionalProperties: false` on every input schema — unknown fields are a 400, not a silent
no-op. Every response schema's `response` block includes a shared `CommonErrorResponsesSchema`
(`src/routes/types.ts`) so 400/401/403/404/409/422/500/503 are documented, not just 200.

### Anti-Patterns

```typescript
// ❌ WRONG: parsing/validating by hand inside the handler
app.post('/v1/orders', {}, async (request, reply) => {
  const body = request.body as any;
  if (!body.customerId || typeof body.customerId !== 'string') {
    return reply.status(400).send({ error: 'customerId required' }); // ad hoc, undocumented, untyped
  }
  ...
});

// ❌ WRONG: a schema with no additionalProperties guard — typo'd fields pass through silently
const schema = { type: 'object', properties: { customerId: { type: 'string' } } };
```

---

## 2. Layered Architecture (Route → Service/Repository → Data)

### Principle

**Route handlers orchestrate; they do not decide.** A handler's job is: authenticate, authorize,
parse the already-validated input, call one service/repository method, shape the reply. ORM
queries, business rules, and cross-entity logic live in `src/services/**`.

### Pattern

```typescript
// src/routes/orders.ts — route wires a repository, doesn't query the ORM directly
const orderRepo = createOrderRepository(app.prisma);
...
return orderRepo.listOrders(params);   // handler stays a thin translator
```

```
src/routes/orders.ts          → thin handlers, preHandler auth, schema
src/services/order/service.ts       → OrderService: business rules
src/services/order/*-repository.ts  → ORM access, query shaping
```

Complex domains split further into `service.ts` (rules) + `*-repository.ts` (persistence) +
`types.ts` (domain types) + `errors.ts` (domain error classes).

### Anti-Patterns

- A route file importing the ORM client and building `where` clauses inline for anything beyond a
  trivial single-table scope filter.
- A "service" that is just a re-export of an ORM model with no behavior — if there's no rule or
  transformation, the repository doesn't need a service wrapper on top of it.
- Business logic duplicated across two route files because each grew its own inline copy instead
  of sharing a service method.

---

## 3. Composable Auth & Authorization Middleware

### Principle

**Every non-health route declares its own unique permission**, checked via a `preHandler` chain,
never via conditionals inside the handler body. Authentication resolves identity and RBAC scope
once, up front; authorization checks a specific permission key per endpoint.

### Pattern

```typescript
// src/routes/orders.ts
const listAuth   = [app.authenticate, app.requirePermission('orders:list')];
const getAuth    = [app.authenticate, app.requirePermission('orders:get')];
const createAuth = [app.authenticate, app.requirePermission('orders:create')];

app.get('/v1/orders',     { preHandler: listAuth },   handler);
app.get('/v1/orders/:id', { preHandler: getAuth },    handler);
app.post('/v1/orders',    { preHandler: createAuth }, handler);
```

`app.authenticate` (verifies the bearer token — local JWT or OIDC/JWKS, depending on the identity
provider) always runs first and populates `request.user` with `roles`, `permissions`, and
`dataScope`. `app.requirePermission(key)` checks one permission and emits a structured
`type: 'audit'` log line with `outcome: 'deny'` on every rejection — denials are as observable as
approvals.

**Data-scope filtering is not optional** — every list/get endpoint applies `request.user.dataScope`
to its query before returning rows. A caller with zero scope gets an empty page, not an
unfiltered one.

### One endpoint = one permission

Never reuse a permission key across two independent operations, even on the same resource
(`GET /v1/orders:list` ≠ `GET /v1/orders/:id:get` ≠ `POST /v1/orders:create`).

### Anti-Patterns

```typescript
// ❌ WRONG: authorization decided inline instead of as a preHandler
app.get('/v1/orders/:id', async (request, reply) => {
  if (!request.user?.permissions.includes('orders:get')) {
    return reply.status(403).send(...); // scattered, easy to forget, not composable
  }
  ...
});

// ❌ WRONG: reusing one permission for list and create
const auth = [app.authenticate, app.requirePermission('orders:manage')];
app.get('/v1/orders', { preHandler: auth }, listHandler);
app.post('/v1/orders', { preHandler: auth }, createHandler); // can't grant read without write
```

---

## 4. Canonical Response & Error Envelopes

### Principle

**One success shape, one error shape, used identically by every route.** A caller should be able
to write one response-parsing function for the whole API.

### Documented contract

```json
// Success (collection)
{ "data": [...], "pagination": { "page": 1, "pageSize": 20, "total": 150 } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "Human-readable message", "details": {} } }
```

Codify an `ApiErrorEnvelopeSchema` in `src/routes/types.ts` and export a shared
`CommonErrorResponsesSchema` so every route's `response` schema documents 400–503 consistently.

### Anti-Patterns

- A route that returns `{ ok: false, ... }` on one error path and `{ error: {...} }` (no `ok`) on
  another in the same file.
- Leaking internals in `error.message` for 500s — the global error handler should redact this
  (`statusCode === 500 ? 'Internal server error' : error.message`); don't bypass it with a manual
  `reply.status(500).send({ message: err.stack })`.

---

## 5. Deliberate Versioning & Path Stability

### Principle

**Every path is versioned from the start, and every mount point exists on purpose.** Callers
should never have to guess whether a route lives under `/api` or not.

### Pattern

Declare routes once as `/v1/<resource>` and decide deliberately whether they mount under one path
prefix or several (e.g. unprefixed and under `/api`, for reverse-proxy compatibility across
environments that do or don't strip a prefix). `/health` (and its prefixed equivalent, if a dual
mount exists) is the only auth-exempt path. Document which mount is canonical for external callers
whenever the reason for a mount point isn't self-evident.

### Anti-Patterns

- Introducing `/v2/` routes by branching the whole route file instead of versioning only the
  fields that actually changed (additive fields don't need a new version; breaking response
  shape changes do).
- Adding a new route under only one of several mounts, silently breaking whichever caller uses
  the other.

---

## 6. Observability & Structured Logging

### Principle

**Every privileged decision is reconstructable from logs alone**, without reading application
state. Fastify's built-in pino logger is used natively — no ad hoc `console.log`.

### Pattern

```typescript
// src/plugins/security.ts — every permission denial is an audit event
app.log.info({
  type: 'audit',
  actor: request.user?.sub ?? 'unknown',
  role: request.user?.roles?.[0] ?? 'unknown',
  action: `${method} ${routePath}`,
  resource: routePath,
  outcome: 'deny',
  request_id: request.id,
  timestamp: new Date().toISOString(),
});
```

Every `requirePermission` / `requireAnyPermission` denial emits this shape (`type: 'audit'`,
`outcome`, `request_id`) — filterable in aggregate log tooling without correlating against the
database. `Fastify({ logger: true })` gives every request a `request_id` for free; use it in any
handler-level log line so a single request's logs can be grepped end to end.

### Anti-Patterns

- Logging only denials and not the `allow` path for genuinely privileged actions (create/delete
  on sensitive resources) — the audit trail needs both outcomes for actions a security baseline
  calls out as privileged.
- `console.log` / `console.error` anywhere in `src/` — breaks structured JSON log ingestion.

---

## 7. Resilience at the Edges

### Principle

**Anything that crosses a network boundary is timeout-bounded, retried with backoff where safe,
and degrades to a status field — never an unhandled 500 or a hung request.**

### Pattern

```typescript
// src/plugins/security.ts — outbound identity-provider call: bounded attempts, bounded timeout,
// only retries on transient failure classes, returns null (not a throw) on exhaustion
const attempts = app.appConfig.httpRetries + 1;
for (let attempt = 0; attempt < attempts; attempt += 1) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(app.appConfig.httpTimeoutMs) });
    ...
  } catch (error) {
    if (!exhausted && transient) { await delay(...); continue; }
    return null;
  }
}
```

```typescript
// src/routes/health.ts — every optional addon (cache, queue, object storage, identity provider)
// probed with a bounded timeout and reported as 'healthy' | 'degraded' — health always returns 200
```

Make the health contract explicit: **HTTP 200 in all cases** — API-responsive vs.
dependency-degraded is a payload distinction, not a status-code one, so uptime monitors never
false-page on a downstream dependency blip.

### Anti-Patterns

- An outbound call (object storage, geocoding, chat/LLM service, payment provider) with no
  `AbortSignal.timeout` — one slow dependency hangs every request that touches it.
- Retrying on every error class indiscriminately (retrying a 401 or a validation error wastes
  the retry budget on something that will never succeed).

---

## 8. Contract-Level Testing

### Principle

**Integration tests assert the contract** — status code, envelope shape, and permission
boundary — against a real database. Unit tests cover service/repository logic in isolation.

### Pattern

```
tests/integration/rbac-scope-boundary.test.ts   → asserts scope filtering, not just 200 OK
tests/integration/orders.test.ts                → 403 for missing permission is a required case
tests/unit/services/rbac/*.test.ts              → permission/authorization services in isolation
```

Don't mock the database in integration tests — run against a real instance (Docker in CI), and
require every new list/get endpoint to have a test proving `403` for a caller lacking the
permission.

### Anti-Patterns

- A route test that only checks the 200 path and never exercises the 401/403/404 branches the
  schema documents.
- Mocking the ORM client in an integration test — it validates the mock, not the query.

---

## 9. Idempotency Where It Matters

### Principle

**State-changing operations that can be safely retried produce the same result whether they run
once or multiple times.** A caller that times out and resends a request should never end up
with two resources instead of one.

### Why It Matters

- Retries are inevitable, not exceptional — network partitions, client timeouts, and mobile/
  field connectivity all cause a caller to resend a request without knowing whether the first
  attempt succeeded.
- Without idempotency, a retried `POST` creates a duplicate order, duplicate upload, or duplicate
  job instead of returning the original result.
- It's what makes principle #7's retry guidance safe to act on — a client can only retry a
  mutating request if the server guarantees a repeat is a no-op, not a second side effect.

### Implementation Patterns

```typescript
// ✅ natural idempotency via a caller-supplied unique key, upsert instead of create
app.post('/v1/orders', { schema: { body: createOrderBodySchema } }, async (request, reply) => {
  const record = await prisma.order.upsert({
    where: { idempotencyKey: request.body.idempotencyKey }, // caller-supplied natural key
    create: toCreateInput(request.body),
    update: {}, // a repeated call returns the same row instead of creating a second one
  });
  return reply.code(201).send(toApiShape(record));
});
```

```typescript
// ✅ an Idempotency-Key header for operations with no natural unique field
const cached = await idempotencyStore.get(request.headers['idempotency-key']);
if (cached) return reply.code(cached.statusCode).send(cached.body);
const result = await service.create(request.body);
await idempotencyStore.set(request.headers['idempotency-key'], result, { ttlMs: 24 * 60 * 60 * 1000 });
```

`PUT` is idempotent by HTTP definition (full replace) — prefer it over `POST` for "create-or-replace
by caller-supplied identity" operations. The gap is specifically `POST`-based creates and
`PATCH`-based partial updates that apply a relative delta.

### Anti-Patterns

```typescript
// ❌ WRONG: a retried POST silently creates a second order — no dedup key
app.post('/v1/orders', { preHandler: createAuth }, async (request, reply) => {
  const record = await orderService.create(request.body);
  return reply.code(201).send(record);
});

// ❌ WRONG: a PATCH that applies a relative delta is not safe to retry
app.patch('/v1/orders/:id/items', {}, async (request) => {
  await prisma.order.update({
    where: { id: request.params.id },
    data: { itemCount: { increment: 1 } }, // retried request double-counts
  });
});
```

---

## 10. Explicit Concurrency Control

### Principle

**Concurrent writers to the same resource are detected and resolved deterministically** — never
silently resolved by whichever write happens to land last.

### Why It Matters

- Multiple actors can update the same resource concurrently — two operators editing the same
  record from different sessions — and last-write-wins discards one side's change with no signal
  to either party that it happened.
- Multi-step writes that touch more than one table (recording a lifecycle transition *and* its
  audit event) must succeed or fail together; a crash between the two steps leaves the database in
  a state nothing marks as inconsistent, so no reconciliation process would ever catch it.
- An unconditional `update` that overwrites a row regardless of what value was read before the
  write was issued is the concrete pattern to find and fix — especially if no write path in the
  codebase uses a database transaction at all.

### Implementation Patterns

```typescript
// ✅ optimistic concurrency via a precondition on the row actually being updated
async update(orderId: string, input: UpdateOrderInput, expectedUpdatedAt: Date) {
  const result = await this.prisma.order.updateMany({
    where: { id: orderId, updatedAt: expectedUpdatedAt },
    data: { ...input, updatedAt: new Date() },
  });
  if (result.count === 0) {
    throw new ConflictError('order_modified_since_read'); // → 409, not a silent overwrite
  }
}
```

```typescript
// ✅ multi-table writes wrapped in a transaction, not two independent calls
await prisma.$transaction([
  prisma.order.update({ where: { id: orderId }, data: { status: next } }),
  prisma.orderLifecycleEvent.create({
    data: { orderId, fromStatus: current, toStatus: next, changedAt: new Date() },
  }),
]);
```

Reserve `409 Conflict` for a lost-update, and include it in the shared error-response schema so
every route documents it consistently.

### Anti-Patterns

```typescript
// ❌ WRONG: unconditional overwrite, no transaction, no conflict signal
async update(orderId: string, input: UpdateOrderInput) {
  return this.prisma.order.update({
    where: { id: orderId },
    data: { status: input.status ?? current.status },
  }); // second writer's read is silently discarded; state + event write aren't paired
}
```

---

## 11. Explicit State Transition Modeling

### Principle

**A resource with lifecycle states declares its valid transitions and enforces them
server-side** — an invalid transition is rejected, not silently accepted, and every transition is
recorded as an auditable event.

### Why It Matters

- A lifecycle event table (`from status` / `to status` / `changed at`) only answers "when did this
  record move from `pending` to `completed`, and who did it?" if the write path actually
  populates it.
- Without a transition guard, a client can move a `completed` resource back to `draft`, or skip
  required intermediate states, and the API has no way to reject it as invalid.
- State often gates other behavior elsewhere in the system (e.g. attachments only accepted during
  certain statuses) — an ungoverned transition can silently unlock or lock capability downstream
  of where it happened.

### Implementation Patterns

```typescript
// ✅ an explicit transition table + guard, not a free-text field write
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  draft: ['pending'],
  pending: ['processing', 'draft'],
  processing: ['completed', 'pending'],
  completed: [], // terminal
};

function assertValidTransition(from: OrderStatus, to: OrderStatus) {
  if (!ALLOWED_TRANSITIONS[from]?.includes(to)) {
    throw new InvalidTransitionError(`order_transition_${from}_to_${to}_not_allowed`); // → 409
  }
}

async transitionTo(orderId: string, to: OrderStatus, actorUserId: string) {
  const current = await this.repository.requireById(orderId);
  assertValidTransition(current.status, to);
  await this.prisma.$transaction([
    this.prisma.order.update({ where: { id: orderId }, data: { status: to } }),
    this.prisma.orderLifecycleEvent.create({
      data: { orderId, fromStatus: current.status, toStatus: to, changedAt: new Date(), changedByUserId: actorUserId },
    }),
  ]);
}
```

Expose transitions as their own endpoint (`POST /v1/orders/:id/transitions`) rather than letting
an arbitrary `status` field ride inside a general-purpose `PATCH /v1/orders/:id` body — this also
gives the transition its own permission key (`orders:transition`), consistent with the
one-permission-per-operation rule.

### Anti-Patterns

```typescript
// ❌ WRONG: status is just another field in a general PATCH body
update(orderId: string, input: { status?: string; customerName?: string; notes?: string })
// any caller with orders:update can set status to any string, in any order,
// with no record of the transition ever created
```

---

## 12. Protect Against Unbounded Requests

### Principle

**Every request has a bounded cost, everywhere** — bounded payload size, bounded collection size,
bounded call rate — regardless of caller intent.

### Why It Matters

- An unbounded list/search endpoint or unbounded request body is a trivial denial-of-service
  vector, accidental or deliberate — and consistency is usually the gap, not an unknown pattern.
- A missing global rate limit means one misbehaving client (a buggy retry loop, a compromised
  credential) can exhaust database connections or degrade the service for every other tenant, even
  though RBAC/`dataScope` correctly limits *what* that client can see.

### Implementation Patterns

```typescript
// ✅ bounded file uploads
await app.register(multipart, { limits: { fileSize: MAX_UPLOAD_BYTES } });

// ✅ bounded collection size
pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 25 },
```

```typescript
// ✅ global rate limiting
await app.register(import('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute',
  keyGenerator: (request) => request.user?.userId ?? request.ip,
});

// ✅ an explicit global body-size ceiling instead of the framework default
const app = Fastify({ logger: true, bodyLimit: 1 * 1024 * 1024 });
```

### Anti-Patterns

- A search/export/list endpoint with no upper bound on `pageSize` — treat any new collection
  endpoint without a matching cap as a bug.
- Relying on the framework's silent default body limit instead of a value chosen deliberately for
  the endpoint's actual payload shape.

---

## 13. Asynchronous Handling of Long-Running Work

### Principle

**A request that can't complete within a normal HTTP timeout is accepted immediately and tracked
as a job** — the client polls or is notified, it never holds a connection open waiting on the work
to finish.

### Why It Matters

- Bulk exports and long-running sweeps are exactly the kind of multi-minute operations that
  shouldn't run inline inside a request/response cycle — a slow client connection or proxy timeout
  would abort the operation mid-flight with no record of how far it got.
- If a queue is already provisioned and health-checked as infrastructure, but nothing in `src/`
  publishes or consumes from it, it isn't providing this benefit yet — that's dead weight, not
  resilience.
- A job-record pattern for one long-lived, multi-status business process (e.g. an order lifecycle)
  generalizes cleanly to any technical operation the request/response cycle can't reasonably hold
  open.

### Implementation Patterns

```typescript
// ✅ accept immediately, return a job id, do the work off the request thread
app.post(
  '/v1/exports',
  { preHandler: createExportAuth, schema: { response: { 202: exportJobSchema } } },
  async (request, reply) => {
    const job = await exportJobService.enqueue(request.body); // insert a Job row, publish to the queue
    return reply.code(202).send({ jobId: job.id, status: 'queued' }); // 202 Accepted, not 200/201
  },
);

app.get('/v1/exports/:jobId', { preHandler: getExportAuth }, async (request) => {
  return exportJobService.getStatus(request.params.jobId); // { status, resultUrl? }
});
```

`202 Accepted` is the signal that work was accepted but not yet done — pair it with a
status-polling `GET`.

### Anti-Patterns

```typescript
// ❌ WRONG: holding the request open for a multi-minute operation
app.post('/v1/exports', {}, async (request, reply) => {
  const csv = await generateFullExport(request.body); // minutes-long, blocks the request, times out
  return reply.send(csv);
});
```

- Provisioning a queue in infrastructure/health checks with no producer or consumer code actually
  using it — health-checking a dependency the application doesn't use is dead weight, not
  resilience.

---

## Architecture Checklist

### Planning a new API surface

- [ ] Resource and verbs identified; one permission key per operation (`resource:verb`)
- [ ] `dataScope` filtering strategy decided for every list/get (what happens with zero scope?)
- [ ] Request/response JSON Schema drafted before the handler body
- [ ] Pagination defaults chosen (20–100 page size) if it's a collection endpoint
- [ ] Whether the operation needs idempotency (retryable `POST`/`PATCH`) decided up front
- [ ] Whether the resource has lifecycle states decided — if so, transitions modeled explicitly,
      not left as a free-text field
- [ ] Whether the operation can complete inside a normal request timeout decided — if not, a job
      + polling shape is designed instead of a synchronous endpoint

### Implementing

- [ ] Route registered under `/v1/...`, mounted through every canonical mount point
- [ ] `preHandler: [app.authenticate, app.requirePermission('...')]` present — no bare routes
- [ ] Handler calls a service/repository method; no inline ORM query beyond the trivial case
- [ ] Response uses the canonical envelope (`{ data, pagination }` / `{ error: {...} }`) —
      no ad hoc shape
- [ ] New permission key added to the seed/permissions data and assigned to a role
- [ ] Any outbound network call is timeout-bounded and degrades to a status, not a throw
- [ ] Multi-table writes wrapped in a transaction; concurrent-write detection in place for
      anything editable by more than one actor
- [ ] Collection/search endpoints have an explicit upper bound on result size; any new payload
      type has a deliberate size limit, not the framework default

### Quality gate

- [ ] Integration test: happy path + `403` for missing permission + scope-boundary case
- [ ] Integration test: retried write doesn't duplicate a resource, if the operation is meant to
      be idempotent
- [ ] Integration test: invalid state transition returns `409`, if the resource has lifecycle
      states
- [ ] OpenAPI (`/docs`, `/openapi.json`) reflects the route without manual doc edits
- [ ] Lint, build, and test all pass
- [ ] No `console.log`; audit log present for privileged allow/deny paths

---

## Anti-Patterns to Avoid

### ❌ Contracts

- Hand-validating input in the handler body instead of JSON Schema
- Response shape that isn't in the schema's `response` block (untyped, undocumented)

### ❌ Layering

- ORM queries and business rules inline in route handlers
- A route file that grows past a few hundred lines because logic never moved to a service

### ❌ Auth

- Authorization checked with an `if` in the handler instead of a `preHandler`
- One permission key shared across two independently-grantable operations
- A list/get endpoint that skips `dataScope` filtering

### ❌ Envelopes

- Mixing envelope shapes across routes or across success paths in the same route
- Numeric `code` values where the contract specifies a string code

### ❌ Resilience

- Outbound fetch/query with no timeout
- Health endpoint that returns non-200 on a degraded (not down) dependency

### ❌ Testing

- Mocking the database in integration tests
- Shipping an endpoint with no `403`-for-missing-permission test

### ❌ Idempotency & Concurrency

- A `POST` with no dedup key or upsert semantics — a client retry creates a duplicate resource
- A `PATCH` that applies a relative delta (`increment`, `append`) instead of an absolute value
- An `update` that overwrites a row unconditionally instead of checking it hasn't changed since it
  was read
- A multi-table write (state change + audit event) issued as two independent calls instead of one
  transaction

### ❌ State Modeling

- A lifecycle/status field writable as a plain string on a general `PATCH`, with no allowed-
  transition check and no event recorded
- A transition validated only in the frontend, trusting the client to never send an invalid one

### ❌ Unbounded Requests & Async Work

- A collection/search/export endpoint with no upper bound on result size
- No global rate limit and no deliberate body-size ceiling — relying on framework defaults
- A multi-minute operation run synchronously inside a request handler instead of as a job with a
  polling endpoint
- A queue or broker wired into infrastructure/health checks with no producer or consumer code
  actually using it

---

## Related Skills

- `fastify-api-standards` — narrower route/validation/error-handling checklist this skill
  supersedes for architecture-level decisions
- `postgres-standards` — schema and query discipline behind the repository layer
- `keycloak-bff-auth` — identity provider and JWT/RBAC mechanics behind `app.authenticate`
- `security-review` — threat-model-level review for PHI/PII-touching endpoints
- `engineering-hygiene` — quality and testing standards before handoff
- `teleological-planning` — outcome-driven planning for backend work

## References

- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [Fastify JSON Schema Validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
- [Prisma Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

**Project documentation** (create per project if applicable):

- `docs/architecture/` — project-specific API patterns and decisions
- `docs/security/` — auth/RBAC rules, audit logging conventions
