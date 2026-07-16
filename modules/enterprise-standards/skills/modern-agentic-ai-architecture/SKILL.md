---
name: modern-agentic-ai-architecture
version: 1.0.0
description: >
  Modern agentic AI architecture principles: tool/endpoint design (agent-computer interface),
  action parity between UI and agent capabilities, conversational interface best practices,
  cold-start conversation starters, multi-tool prompting and orchestration, and knowledge-graph
  context provisioning. Use when architecting agentic systems, connecting tools to backend
  endpoints, designing chat/agent UX, auditing whether an agent can do everything the UI can do,
  or establishing standards for how agents select tools and consume domain knowledge.

  Trigger when user mentions: agentic AI, AI agent architecture, tool calling, function calling,
  MCP (Model Context Protocol), A2A (Agent2Agent), multi-agent orchestration, action parity,
  agent-native, UI-to-agent parity, conversational AI, chatbot UX, conversation starters, empty
  state design for AI, prompting behaviors, multi-tool selection, ReAct, plan-and-execute,
  knowledge graph, GraphRAG, or asks about building agents that call tools and answer questions
  reliably.
---

# Modern Agentic AI Architecture

This skill treats an agentic system as three coupled contracts: the **tool contract** (what the
model can act on and how endpoints are exposed to it), the **conversation contract** (what the
user expects the agent can do and how that's communicated), and the **knowledge contract** (how
domain information is organized and surfaced to the model so it can actually succeed). Five
principles, each with a decision rule for when to add complexity — most agentic failures come from
skipping the rule and adding orchestration, tools, or graph structure before a measured need for it
exists.

## Core Principles

1. **Tool & Endpoint Design (Agent-Computer Interface)** — every tool is a strict, self-documenting
   contract between the model and a backend endpoint, not a thin pass-through of an internal API.
2. **Conversational Interface Design** — the interface communicates capability, status, and
   failure paths explicitly; the user is never guessing what the agent is doing or can do.
3. **Cold-Start & Conversation Starters** — the empty state and "start over" flow are onboarding
   surfaces, not blank boxes; they close the gap between user intent and prompt language.
4. **Multi-Tool Prompting & Orchestration** — orchestration complexity (loops, planning, multi-
   agent) is added only in response to a measured failure mode, and every loop has a hard bound.
5. **Knowledge Organization & Context Provisioning** — how domain knowledge is structured (flat
   text, vector index, knowledge graph) determines what the agent can reason about; retrieval is a
   deliberate tool call, not context stuffed into the prompt.

---

## 1. Tool & Endpoint Design (Agent-Computer Interface)

### Principle

**A tool is a contract, not a convenience wrapper.** The model reads a tool's name, description,
and schema and reasons about it exactly like any other text in its context — it isn't running
code, it's making a judgment call from documentation. Treat every tool definition with the rigor
of a public API spec, and connect it to a real backend endpoint through a typed boundary (e.g. an
MCP server) rather than exposing the endpoint's internal shape directly.

### Why It Matters

- Vague tool descriptions produce vague tool calls; overly permissive schemas produce
  unpredictable inputs.
- The model has no side channel to ask "what does this field actually mean?" — everything it
  needs to call a tool correctly must be in the schema and description, in the moment of choice.
- An endpoint's internal representation (raw DB rows, opaque IDs, internal enums) is rarely what
  the model should see; the tool layer is where that translation happens.

### Implementation Patterns

```json
// ✅ CORRECT: a tool contract written for the model's moment of choice
{
  "name": "search_orders",
  "description": "Search orders by customer email, status, or date range. Returns up to 25 matching orders with id, status, total, and createdAt. Use this to find existing orders before creating a new one. Do NOT use this to look up a single order by ID — use get_order instead.",
  "input_schema": {
    "type": "object",
    "properties": {
      "customer_email": { "type": "string", "format": "email" },
      "status": { "type": "string", "enum": ["pending", "processing", "shipped", "completed"] },
      "created_after": { "type": "string", "format": "date" }
    },
    "additionalProperties": false
  }
}
```

```json
// ❌ WRONG: implementation-named, vague, no boundary from neighboring tools
{
  "name": "orders_query",
  "description": "Query the orders table.",
  "input_schema": { "type": "object", "properties": { "filter": { "type": "string" } } }
}
```

**Naming and boundaries:**

- Name tools for intent (`search_orders`), never internal implementation (`orders_query`,
  `run_sql`).
- Every description states the boundary explicitly: what this tool is for, and what it is *not*
  for when a neighboring tool could plausibly apply. One sentence of "do not use this for X" often
  prevents most wrong-tool errors.
- Parameters are unambiguously named (`customer_id`, not `id` or `user`) and constrained (enums,
  formats) so the model can't easily construct an invalid call.

**Consolidate related operations:**

```json
// ✅ CORRECT: one tool, an action parameter, fewer decision points for the model
{
  "name": "manage_pull_request",
  "input_schema": {
    "properties": {
      "action": { "enum": ["create", "review", "merge"] },
      "repo": { "type": "string" },
      "pr_number": { "type": "integer" }
    }
  }
}
// ❌ WRONG: create_pr, review_pr, merge_pr as three separate tools with overlapping schemas
```

**High-signal responses:**

```json
// ✅ CORRECT: fields the model can act on
{ "order_id": "ord_9f2a", "status": "shipped", "carrier": "ups", "tracking_url": "https://..." }

// ❌ WRONG: internal/opaque fields that don't inform the next action
{ "uuid": "8f14e45f...", "row_version": 7, "mime_type": null, "_internal_flags": 12 }
```

**Connecting tools to endpoints:**

- Prefer a standard tool-hosting layer (e.g. MCP) between the model and backend endpoints — it
  gives you one discovery mechanism (list tools), one invocation mechanism (call tool), and one
  place to enforce schema validation before a request ever reaches the endpoint.
- Validate arguments against the schema *before* calling the endpoint — reject malformed calls
  with a structured error the model can read and self-correct from, don't let them 500 downstream.
- Every outbound call from a tool to an endpoint is timeout-bounded and returns a typed error
  object on failure — a stack trace or raw HTTP error is not something the model can act on.

**Action parity — derive the tool catalog from the UI's action surface:**

Don't design tools from an abstract sense of "what an agent might need." Audit what the product's
UI already lets a user do — every button, link, form submission, and menu action — and treat that
inventory as the tool catalog's real spec: **whatever a user can do through the UI, the agent
should be able to do through conversation.**

```markdown
<!-- ✅ CORRECT: an action/capability map, kept current as a living artifact -->
| UI Action        | UI Location        | Agent Tool           | Status     |
|-------------------|---------------------|----------------------|------------|
| View orders       | Orders tab          | search_orders        | ✅ covered |
| Cancel order      | Order detail → menu | cancel_order         | ✅ covered |
| Edit shipping addr| Order detail → edit | update_shipping_addr | ⚠️ MISSING |
| Export orders CSV | Orders → Export     | N/A                  | ⚠️ MISSING |
| Take a photo      | Mobile camera       | N/A (device action)  | — n/a      |
```

- **Build the map by walking the UI, not the codebase** — screens, buttons, links, and menu items
  are the ground truth for what users can accomplish; a tool catalog audited only against existing
  backend endpoints will miss actions the UI composes from several calls.
- **Map to outcomes, not a rigid 1:1 button-to-tool ratio** — one tool can satisfy several UI
  actions (`manage_pull_request` above covers three buttons), and one UI action may need several
  composable primitives behind it. The test is "can the agent achieve the same outcome," not
  "does every button have its own tool."
- **Ship the tool in the same change as the UI feature** — action parity decays the moment tool
  coverage is treated as a follow-up task; a new button and its agent-callable equivalent belong
  in the same PR.
- **Every entity with UI-driven CRUD should have agent-callable CRUD** — a common gap is create
  and read exposed as tools while update and delete stay UI-only, silently limiting what the agent
  can actually help with.
- **Don't let the agent screen-scrape or fake it** — if a UI action has no tool equivalent, that's
  a backlog item to close, not a reason to have the agent attempt the action through an unsupported
  side channel (browser automation over the product's own UI, guessing at an undocumented
  endpoint).
- **Some actions are legitimately UI/device-only** (camera capture, drag-to-reorder, biometric
  confirmation) — mark those explicitly as `n/a` in the map so they're a documented exception, not
  an undetected gap.

### Anti-Patterns

- A tool description under one sentence for anything beyond the most trivial operation — aim for
  3-4 sentences: what it does, when to use it, when not to, and any format caveats.
- Dozens of narrow, near-duplicate tools instead of a handful of composable ones with an `action`
  or `type` parameter — this creates decision paralysis, not clarity.
- A tool that returns the raw endpoint response unfiltered (internal IDs, pagination cursors with
  no meaning, nulled-out fields) instead of a shaped, high-signal payload.
- Skipping schema validation at the tool boundary and letting the backend endpoint's own error
  handling be the model's only feedback signal.
- Shipping a UI feature without auditing whether the agent has (or needs) an equivalent tool —
  action parity treated as a follow-up task instead of part of the same change.
- CRUD asymmetry: create/read exposed as tools while update/delete stay UI-only, with no
  documented reason.
- Working around a missing tool by having the agent screen-scrape the UI or call an undocumented
  endpoint instead of logging the gap and building the tool.

---

## 2. Conversational Interface Design

### Principle

**The interface is the only thing the user experiences — model quality is invisible without it.**
Maintain simplicity in the agent's design and prioritize transparency by explicitly showing the
agent's planning/tool-use steps rather than presenting a black box that occasionally produces an
answer.

### Why It Matters

- Users cannot tell what is happening (thinking vs. calling a tool vs. streaming vs. failed) unless
  the interface says so explicitly — silence reads as "broken," not "working."
- A dead-end response (agent can't help, gives no path forward) is the single biggest driver of
  abandonment in conversational products.
- Multi-step tool use without visible planning steps looks identical to a hang, whether it takes
  2 seconds or 20.

### Implementation Patterns

**Capability transparency (set expectations up front):**

```
✅ "I can search and update your orders, and check shipping status. I can't process refunds yet."
❌ "Ask me anything!"
```

**Show the plan, not just the answer:**

```tsx
// ✅ CORRECT: surface tool-use steps as they happen, not just a spinner
<AgentSteps>
  <Step status="done">Searching orders for jane@example.com</Step>
  <Step status="active">Checking shipping status for ord_9f2a</Step>
</AgentSteps>
```

**Design for failure — never trap the user:**

```
✅ "I couldn't find that order. Try the order number instead of the email,
   or I can connect you with support."
❌ "An error occurred." (dead end, no recovery path)
```

**Status communication during streaming:**

- Stream tokens as they arrive; show a stop control during generation (saves cost, respects the
  user's time).
- Use `aria-live="polite"` / `role="status"` on streaming containers so screen readers announce
  content without interrupting mid-stream.

**Structured actions over pure free text when the choice set is constrained:**

```
✅ Quick-reply chips: [See more] [Talk to a human] [Start over]
❌ Forcing the user to type "start over" verbatim to reset
```

### Anti-Patterns

- A single opaque loading indicator for a multi-tool chain that takes more than a couple of
  seconds — show which step is active.
- No stated scope of capability, so users only learn what the agent can't do by hitting a wall.
- An error state that ends the conversation instead of offering rephrase suggestions, a
  documentation link, or human handoff.
- Free-text-only input for choices that are actually enumerable (status filters, common next
  actions) — this pushes unnecessary articulation cost onto the user.

---

## 3. Cold-Start & Conversation Starters

### Principle

**A blank input box is the biggest usability problem in conversational UI.** Users know what they
want but not the vocabulary that produces it — the "articulation barrier." The empty state and the
"start over" flow are the primary onboarding surfaces; design them deliberately instead of
shipping the default blank prompt box.

### Why It Matters

- A blank prompt box on a first session has no shared context: the user doesn't know what the
  product does well, what it charges for, or what it remembers — the conversation cannot
  meaningfully begin.
- Suggested starters function as a navigation mechanism, not training wheels — they show the
  vocabulary, shape, and granularity of a well-formed request inline.
- "Start over" is not just "clear the transcript" — it has real state semantics (memory, tool
  auth, retrieved documents) that need an explicit, honest signal to the user.

### Implementation Patterns

**Conversation starters (empty state):**

```tsx
// ✅ CORRECT: 3-4 starters, each demonstrating a distinct capability
<EmptyState>
  <CapabilityStatement>I can help you manage orders, check shipping, and answer product questions.</CapabilityStatement>
  <Starters>
    <Starter onClick={() => send('Show me my open orders')}>Show me my open orders</Starter>
    <Starter onClick={() => send('Where is order #4821?')}>Where is order #4821?</Starter>
    <Starter onClick={() => send('Compare plan A and plan B')}>Compare plan A and plan B</Starter>
  </Starters>
</EmptyState>
```

- Limit to 3–4 starters — more creates decision paralysis.
- Generate starters from live context (recently viewed data, connected tools/integrations,
  account state) rather than static copy that goes stale as capabilities change.
- Place starters directly above the input bar — that's where the user's eyes land after reading a
  response, and where starters get the most engagement.

**Post-response contextual follow-ups:**

```
✅ After answering, offer 2-3 generated follow-ups: "Track this order" / "Cancel it" / "Something else"
❌ Ending every turn with nothing but a blinking cursor
```

**"Start over" with honest state semantics:**

```tsx
// ✅ CORRECT: distinguish what resets from what persists
<ResetMenu>
  <Option onClick={clearTranscript}>New conversation (keeps my connected tools)</Option>
  <Option onClick={fullReset}>Start fresh (forgets this session's context and tool access)</Option>
</ResetMenu>
```

- Never silently carry stale tool-authorization or retrieved-document state across a "new chat"
  action the user believes is a clean slate.
- One clear primary action per empty/reset state — don't compete for attention with a second CTA.

### Anti-Patterns

- A generic "Ask me anything" placeholder with no example prompts.
- Static starter prompts that were accurate at launch but no longer reflect current tool
  capabilities.
- More than 4 starters, or starters that all demonstrate the same capability instead of showing
  the agent's range.
- A "new chat" button that clears the visible transcript but leaves stale memory, tool grants, or
  retrieved context active behind the scenes.

---

## 4. Multi-Tool Prompting & Orchestration

### Principle

**Start with a single capable agent in a tool-use loop; add orchestration structure only in
response to a measured failure mode** — context overflow, latency from unavoidable serial calls,
or a role genuinely too broad for one prompt. Every loop, regardless of pattern, has an explicit
bound on steps, tool calls, and cost.

### Why It Matters

- Orchestration topology affects reliability more than model choice — an unbounded loop is a cost
  and correctness risk regardless of how good the underlying model is.
- Ambiguous tool boundaries (principle 1) are the dominant cause of wrong-tool selection in
  multi-tool prompts, not model capability.
- Multi-agent coordination overhead (handoffs, shared state, inter-agent contracts) only pays for
  itself when the task is genuinely separable; most tasks are not.

### Implementation Patterns

**Bounded ReAct loop (default starting point):**

```typescript
// ✅ CORRECT: reason → act → observe, with a hard step cap
const MAX_STEPS = 8;
let step = 0;
while (step < MAX_STEPS) {
  const decision = await model.reason({ history, availableTools });
  if (decision.type === 'final_answer') return decision.content;

  const result = await callTool(decision.toolName, decision.args); // validated at the boundary
  history.push({ tool: decision.toolName, args: decision.args, result });
  step += 1;
}
throw new StepLimitExceededError(); // never loop silently forever
```

**Parallel fan-out for independent calls:**

```typescript
// ✅ CORRECT: independent tool calls run concurrently, wait time caps at the slowest call
const [inventory, pricing, shipping] = await Promise.all([
  callTool('check_inventory', { sku }),
  callTool('get_pricing', { sku }),
  callTool('estimate_shipping', { sku, zip }),
]);

// ❌ WRONG: sequential when there's no dependency between calls
const inventory = await callTool('check_inventory', { sku });
const pricing = await callTool('get_pricing', { sku }); // doesn't depend on inventory result
```

**Plan-and-execute for knowable multi-step dependencies:**

- When steps and their dependencies can be determined up front, have the model emit a plan (a
  small DAG of tool calls with dependencies) before executing, instead of re-reasoning after every
  single tool result. Execute independent nodes in parallel, dependent nodes after their parents
  resolve.
- Reserve this for tasks where re-planning after each step adds latency without adding accuracy —
  a plain bounded loop is simpler and sufficient for most tasks.

**Bounded execution / circuit breakers (non-negotiable at any complexity level):**

```typescript
// ✅ CORRECT: hard caps enforced by the harness, not requested politely in the prompt
const budget = { maxToolCalls: 12, maxWallClockMs: 30_000, maxCostUsd: 0.50 };
if (callsMade >= budget.maxToolCalls) throw new BudgetExceededError('tool_call_cap');
if (Date.now() - startedAt > budget.maxWallClockMs) throw new BudgetExceededError('time_cap');
```

**When to graduate to multi-agent (and how to connect agents):**

Only introduce a second agent when one of these is true, backed by evidence (not anticipation):

- The task's context genuinely exceeds a single context window.
- Subtasks are cleanly separable by role and a coordinator can route/synthesize deterministically.
- Measured latency shows independent subtasks would meaningfully parallelize across agents, not
  just across tool calls within one agent.

```json
// ✅ CORRECT: capability discovery via an agent card (A2A-style), so agents don't hardcode
// each other's internals — this is the standardizing pattern for inter-agent connection
{
  "name": "shipping-agent",
  "capabilities": ["track_shipment", "estimate_delivery"],
  "endpoint": "https://agents.example.com/shipping/a2a",
  "auth": "bearer"
}
```

- Define strict, typed contracts for inter-agent messages — treat an agent-to-agent call with the
  same skepticism as any third-party API call, not as an internal function call.
- Give the coordinator explicit write ownership over shared state; never let two agents both
  believe they own the same piece of state.

### Anti-Patterns

- A tool-use loop with no step cap, time cap, or cost cap — the "$0.02 to $47" runaway-cost failure
  mode is real and entirely preventable with a hard budget.
- Defaulting to a multi-agent architecture before hitting a measured single-agent ceiling —
  coordination overhead is paid immediately, benefits are not guaranteed.
- Sequential tool calls for work with no dependency between the calls.
- Re-planning from scratch after every tool result when the dependency graph was knowable up
  front (unnecessary latency), or, conversely, committing to a rigid upfront plan for a task whose
  next step genuinely depends on what the previous tool returned.
- Inter-agent messages passed as loosely-typed free text instead of a schema-validated contract.

---

## 5. Knowledge Organization & Context Provisioning

### Principle

**How domain knowledge is structured determines what the agent can answer — and that structure
should be exposed to the model through a retrieval tool call, not stuffed wholesale into the
prompt.** Vector search answers "what's semantically similar to this?"; a knowledge graph answers
"what is this connected to, and through what path?" Route between them by query shape, don't
default to the more complex one everywhere.

### Why It Matters

- Vector-only retrieval fails on relationship-heavy, multi-hop questions ("how does X affect Y
  three steps downstream?") — it returns nearby chunks, not a reasoning path.
- A graph with no real relationships (just `(Document)-[:HAS_CHUNK]->(Chunk)`) is a list with
  extra infrastructure cost, not a knowledge graph — it doesn't answer anything vector search
  couldn't.
- Graph retrieval adds real latency and cost; using it for simple factual lookups is waste with no
  accuracy benefit.

### Implementation Patterns

**Route by query shape, not by default:**

```typescript
// ✅ CORRECT: simple/factual → vector search; relational/multi-hop → graph traversal
function chooseRetrievalStrategy(query: string): 'vector' | 'graph' {
  return isRelationalOrMultiHop(query) ? 'graph' : 'vector';
}
// "What's the return policy?" → vector
// "What upstream services fail if the payments API goes down?" → graph
```

**Expose the graph as a retrieval tool, not as inline context:**

```json
// ✅ CORRECT: a retrieval tool that returns a subgraph — nodes, edges, and the chunks attached
// to them — so the model can reason over relationships and cite a path, not just a snippet
{
  "name": "query_knowledge_graph",
  "description": "Find entities related to the query and the relationships connecting them, up to 2 hops. Use for questions about how things are connected, impact chains, or dependencies. Do NOT use for simple factual lookups — use search_documents instead.",
  "input_schema": {
    "properties": {
      "entity": { "type": "string" },
      "relationship_types": { "type": "array", "items": { "type": "string" } },
      "max_hops": { "type": "integer", "minimum": 1, "maximum": 3, "default": 2 }
    }
  }
}
```

```json
// ✅ Response shape: a subgraph, not a flat chunk list — the model can trace the path
{
  "nodes": [{ "id": "payments-api", "type": "service" }, { "id": "checkout-flow", "type": "service" }],
  "edges": [{ "from": "checkout-flow", "to": "payments-api", "type": "DEPENDS_ON" }],
  "supporting_chunks": [{ "source": "runbook.md#L42", "text": "Checkout calls payments synchronously..." }]
}
```

**Schema-first graph design:**

- Pre-design the entity types and relationship types that matter for the domain (`DEPENDS_ON`,
  `SUPERSEDES`, `FILED_BY`, `MENTIONS`) before extraction runs — don't let the schema "emerge"
  purely from automated extraction noise.
- Entity-extraction quality determines graph quality more than any downstream retrieval tuning;
  invest there first.

**High-signal subgraph responses (same discipline as principle 1):**

- Return semantic, stable identifiers (names, slugs) the model can cite, not opaque internal graph
  keys.
- Cap subgraph size returned per call (hop limit, node limit) — an unbounded traversal is as much
  a cost/context risk as an unbounded tool loop.

**Incremental updates:**

- Update the graph incrementally as source data changes; don't rebuild the full graph on every
  ingest — this is both a cost problem and a staleness problem for anything the agent might be
  asked about right after a change.

### Anti-Patterns

- A "knowledge graph" with no real relationships beyond document-to-chunk containment — this is
  vector search with extra infrastructure, not a graph.
- Dumping an entire retrieved subgraph or document corpus into the prompt instead of exposing
  retrieval as a bounded tool call the agent invokes deliberately.
- Using graph traversal for simple factual lookups a vector search would answer just as well, at
  lower latency and cost.
- Letting graph schema emerge entirely from extraction with no pre-designed entity/relationship
  types — this produces a noisy graph that degrades agent context quality rather than improving it.
- Returning opaque internal graph node/edge IDs instead of semantic identifiers the model can
  reason about and cite.

---

## Architecture Checklist

### Planning a new agentic system

- [ ] UI action/capability map built (every button, link, and menu action the UI exposes) as the
      spec for the tool catalog — not designed from an abstract sense of agent needs
- [ ] Tool catalog defined with one clear purpose per tool; boundaries between similar tools
      stated explicitly in each description
- [ ] Decided: single-agent bounded loop (default) vs. plan-and-execute vs. multi-agent — backed
      by a measured constraint, not anticipation
- [ ] Step/time/cost budget defined for any tool-use loop before it's built
- [ ] Conversational empty state and "start over" semantics designed (not left as framework
      defaults)
- [ ] Knowledge retrieval strategy decided per query shape: vector, graph, or both — and whether
      a knowledge graph is justified by real relational structure in the domain

### Implementing

- [ ] Every tool schema has `additionalProperties: false` (or equivalent) and a 3-4 sentence
      description stating when to use it and when not to
- [ ] Tool responses return high-signal, semantic fields — no raw internal IDs, nulls, or
      unfiltered endpoint dumps
- [ ] Arguments validated at the tool boundary before the backend endpoint is called
- [ ] New UI action ships with its agent-tool equivalent in the same change; capability map
      updated in the same PR
- [ ] Loop has an enforced hard cap (steps, wall-clock, cost) — not a suggested limit in the prompt
- [ ] Conversation starters generated from live capability/context, limited to 3-4
- [ ] Failure states offer a recovery path (rephrase, docs, human handoff) — never a dead end
- [ ] Knowledge graph (if used) has pre-designed entity/relationship types and returns bounded
      subgraphs with semantic identifiers

### Quality gate

- [ ] Tested wrong-tool-call rate with the actual tool descriptions shipped, not a draft version
- [ ] Capability map audited against the live UI — no `MISSING` rows without a tracked backlog
      item, no undocumented `n/a` exceptions
- [ ] Verified the loop cannot exceed its budget under an adversarial/looping input
- [ ] Verified "start over" actually clears the state it claims to clear
- [ ] Verified graph retrieval is only invoked for relational/multi-hop queries in evaluation set,
      not for simple factual ones
- [ ] Accessibility pass on streaming/status UI (`aria-live`, keyboard, screen reader)

---

## Anti-Patterns to Avoid

### ❌ Tools & Endpoints

- Implementation-named tools, vague descriptions, no stated boundary from similar tools
- Dozens of narrow tools instead of a few composable ones with an action parameter
- Raw/opaque endpoint responses passed through unfiltered
- UI actions with no agent-tool equivalent and no tracked backlog item (action-parity gaps)
- CRUD asymmetry — create/read exposed as tools, update/delete left UI-only

### ❌ Conversational Interface

- No stated capability scope; users learn limits only by hitting them
- Silent multi-step tool chains with no visible progress
- Dead-end failure states with no recovery path

### ❌ Cold-Start

- Generic "Ask me anything" with no starters
- Stale static starters that no longer reflect real capabilities
- "New chat" that clears the transcript but not the underlying state

### ❌ Orchestration

- Unbounded tool-use loops with no step/time/cost cap
- Multi-agent architecture adopted before a measured single-agent ceiling
- Sequential calls for independent work; free-text inter-agent contracts

### ❌ Knowledge & Context

- A graph with no real relationships beyond containment
- Full corpus/subgraph dumped into the prompt instead of a bounded retrieval tool call
- Graph traversal used for simple lookups; schema left to emerge from extraction noise

---

## Related Skills

- `modern-api-architecture` — the backend endpoint contracts that tools ultimately call
- `modern-frontend-architecture` — component/state patterns for building the conversational UI
- `heuristic-design-review` — usability evaluation for the conversational interface
- `security-review` — tool access is a new attack surface; audit for injection via tool
  arguments/results and PII exposure in tool responses
- `engineering-hygiene` — quality and testing standards before handoff
- `teleological-planning` — outcome-driven planning for agentic system builds

## References

**Tool & agent design:**
- [Building Effective AI Agents (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents)
- [Writing Effective Tools for AI Agents (Anthropic)](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Model Context Protocol (MCP) specification](https://modelcontextprotocol.io/)
- [Agent2Agent (A2A) protocol](https://github.com/a2aproject/A2A)
- Agent-Native Architecture / Action Parity Discipline — every UI action has an equivalent agent
  tool, audited as an ongoing practice and shipped in the same change as the UI feature
- AgentPatterns.ai — Headless-First Services: the "parity test" (an agent can complete every flow
  a human can in the GUI) as the ship criterion for agent-facing APIs

**Orchestration patterns:**
- Augment Code — Agentic Design Patterns catalog (ReAct, Plan-and-Execute, Reflection,
  Multi-Agent, Bounded Execution/Circuit Breaker, Guardrail Layering)

**Knowledge & context:**
- Microsoft Research — GraphRAG: knowledge-graph-augmented retrieval for multi-hop reasoning
- GraphRAG practitioner guidance: route by query complexity, vector for simple lookups, graph for
  relational/multi-hop; don't let schema emerge purely from extraction

**Conversational UX:**
- Conversational UI guide — suggested prompts and conversation starters, empty-state onboarding
- Erika Hall, *Conversational Design* (A Book Apart) — shared context as the precondition for a
  conversation to meaningfully begin

**Project documentation** (create per project if applicable):

- `docs/architecture/` — project-specific agent/tool topology and decisions
- `docs/design/` — conversational UI patterns and starter-prompt content
