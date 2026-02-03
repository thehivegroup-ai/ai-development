# Anti-Patterns in Problem Framing

Common mistakes when applying the hermeneutic circle methodology.

---

## Anti-Pattern 1: Jumping to Solution

**Bad:**
```markdown
## Problem
Users need authentication.

## Solution
We'll use JWT tokens with passport.js and add login forms.
```

**Why Bad:**
- Started with solution, not problem
- No current state or desired outcome
- No acceptance criteria
- Can't validate if solution achieves goal

**Good:**
```markdown
## Current State
All pages publicly accessible, no user accounts.

## Desired Outcome
Protected pages require authentication.

## Acceptance Criteria
1. Users can register
2. Users can log in
3. Protected pages redirect if not authenticated

[Now we can derive solution backward from this]
```

---

## Anti-Pattern 2: Vague Outcomes

**Bad:**
```markdown
## Desired Outcome
Make the site faster and more performant.
```

**Why Bad:**
- Not measurable
- Not observable
- Can't verify achievement
- Multiple interpretations possible

**Good:**
```markdown
## Desired Outcome
95th percentile page load time < 1 second on 3G network.

## Acceptance Criteria
1. Lighthouse performance score > 90
2. Time to Interactive < 1.5s
3. First Contentful Paint < 0.8s
```

---

## Anti-Pattern 3: Solution Disguised as Problem

**Bad:**
```markdown
## Problem
We don't have a caching layer.

## Desired Outcome
Add Redis caching.
```

**Why Bad:**
- "No caching" is not a problem, it's a missing solution
- Desired outcome is a solution, not an outcome
- Assumes caching is needed without evidence

**Good:**
```markdown
## Problem (Symptom)
API response times are slow (> 2 seconds average).

## Current State
Database queries run on every request. User profile query takes 1.8s.

## Desired Outcome
API response times < 200ms for 95% of requests.

## Analysis
User profiles rarely change → caching could help
[Now caching is a derived solution, not assumed]
```

---

## Anti-Pattern 4: Missing Non-Goals

**Bad:**
```markdown
## Problem
Add user dashboard.

## Desired Outcome
Users can see their data.
```

**Why Bad:**
- Scope unbounded
- "Their data" could mean anything
- Will lead to scope creep

**Good:**
```markdown
## Desired Outcome
Users see their order history and profile.

## Non-Goals
- Analytics/insights (future)
- Saved payment methods (future)
- Wishlist (out of scope)
- Social features (out of scope)
```

---

## Anti-Pattern 5: Ignoring Constraints

**Bad:**
```markdown
## Solution
Rewrite entire backend in Go for better performance.
```

**Why Bad:**
- Ignores existing tech stack
- Ignores team expertise
- Ignores deployment constraints
- Assumes rewrite is only option

**Good:**
```markdown
## Constraints
- Backend is Node.js (team expertise)
- Cannot rewrite (time/risk)
- Must work with existing database
- Deploy without downtime

## Solution Space
Given constraints, optimize Node.js backend:
- Add indexes
- Implement caching
- Optimize queries
```

---

## Anti-Pattern 6: No Success Metrics

**Bad:**
```markdown
## Desired Outcome
Improve user experience.
```

**Why Bad:**
- Can't measure "improved"
- Can't prove success
- Subjective interpretation

**Good:**
```markdown
## Success Metrics
- Task completion rate > 85%
- User satisfaction score > 4.2/5
- Support tickets < 10/month
- Feature usage > 60% of users
```

---

## Anti-Pattern 7: Task-First Planning

**Bad:**
```markdown
## Plan
1. Add database table
2. Create API endpoint
3. Build UI form
4. Deploy
```

**Why Bad:**
- Tasks not derived from outcome
- No backward planning
- No justification for tasks
- Can't map tasks to criteria

**Good:**
```markdown
## Desired Outcome
[Clear, observable outcome]

## Backward Planning
To achieve outcome → Need working UI
To have working UI → Need API
To have API → Need database

Tasks derived backward from end state.
```

---

## Anti-Pattern 8: Accepting First Interpretation

**Bad:**
```markdown
## Problem
Shopping cart abandonment is high.

## Root Cause
Checkout form is too long.

## Solution
Remove half the form fields.
```

**Why Bad:**
- No evidence for root cause
- Assumed cause without testing
- Skipped hermeneutic iteration
- One interpretation, no alternatives

**Good:**
```markdown
## Problem
Shopping cart abandonment is high (78%).

## Hypotheses
1. Form too long? (Check analytics: Where do users drop off?)
2. Shipping costs surprise? (Check: Are costs shown early?)
3. Payment failures? (Check: Error rates on payment processing)

## Evidence Needed
- User session recordings
- Analytics on abandonment points
- Exit surveys

[Iterate to find actual cause, don't assume]
```

---

## Anti-Pattern 9: No Stakeholder Validation

**Bad:**
[AI defines problem and solution without user input]

**Why Bad:**
- AI might misunderstand domain
- User might have context AI lacks
- Assumptions might be wrong

**Good:**
```markdown
## Problem (AI Draft)
Users can't find products easily.

## Validation Questions for User
1. Are users complaining about search?
2. What evidence suggests search is the issue?
3. What are users actually struggling with?

[Iterate based on user feedback]
```

---

## Anti-Pattern 10: Skipping Verification

**Bad:**
[Planner accepts problem framing without challenge]

**Why Bad:**
- Internal contradictions missed
- Gaps not identified
- Assumptions not tested

**Good:**
[Invoke std.verifier to challenge interpretation]

**Verifier asks:**
- Does desired outcome match problem statement?
- Do success criteria actually measure outcome?
- Are constraints compatible with approach?
- What evidence supports root cause?

---

## How to Avoid These Anti-Patterns

1. **Always start with current state and desired outcome**
2. **Make outcomes observable and measurable**
3. **Question assumptions - don't accept first interpretation**
4. **Iterate through hermeneutic circle**
5. **Invoke std.planner and std.verifier agents**
6. **Derive solutions backward from outcome**
7. **Define non-goals explicitly**
8. **Document constraints**
9. **Require evidence for claims**
10. **Validate with stakeholders**

---

## Quick Self-Check

Before proceeding to planning, ask:

- [ ] Is desired outcome observable?
- [ ] Are acceptance criteria measurable?
- [ ] Have we defined non-goals?
- [ ] Are constraints documented?
- [ ] Is this backward-derived, not task-first?
- [ ] Have we validated with verifier?
- [ ] Do we have evidence for assumptions?
- [ ] Can we prove when outcome is achieved?

If any checkbox is unchecked, iterate more.
