# Test Prompts for Hermeneutic Solution

These test prompts validate that the skill triggers correctly and produces quality interpretations.

---

## Realistic User Requests (Good Test Cases)

These prompts reflect how real users actually phrase requests:

### Test Case 1: Ambiguous Feature Request
```
"ok so my boss wants me to add user auth but idk if she means just 
login/signup or SSO or what. and do we need password reset? 2FA? 
help me figure out what we actually need here"
```

**Expected behavior:**
- Skill triggers automatically
- Surfaces fore-structures (context, assumptions, language)
- Questions what "user auth" means in this context
- Identifies missing requirements (scope ambiguous)
- Produces interpretation document with explicit assumptions

---

### Test Case 2: Changing Requirements
```
"the client keeps changing their mind about the dashboard. one day 
they want charts, next day they want tables, now theyre talking about 
filters. i dont even know what were building anymore"
```

**Expected behavior:**
- Skill triggers on "keeps changing"
- Interprets as unstable understanding (hermeneutic loop not stabilized)
- Helps identify what's actually being asked for
- Separates symptoms (changing requests) from problem (unclear outcome)
- Produces stable interpretation to anchor further changes

---

### Test Case 3: Performance "Requirement"
```
"we need to make it faster"
```

**Expected behavior:**
- Skill triggers on vague requirement
- Challenges "faster" as undefined (fore-conception)
- Questions: faster for whom? which part? how much faster?
- Converts vague request into observable outcome
- Produces measurable success criteria

---

### Test Case 4: Stakeholder Disagreement
```
"eng team says we need to refactor the api but product says ship 
features. idk what to prioritize. both seem important?"
```

**Expected behavior:**
- Skill triggers on conflicting priorities
- Identifies different interpretations of "important"
- Surfaces hidden assumptions (technical debt vs business value)
- Helps articulate actual problem
- Produces interpretation that addresses both concerns

---

### Test Case 5: Technical Jargon Mismatch
```
"boss said the system needs to be 'scalable' and 'resilient' 
but when i asked what that means she just said 'you know, handle 
more users' ...what does that actually mean for implementation?"
```

**Expected behavior:**
- Skill triggers on unclear language (fore-conception)
- Clarifies "scalable" and "resilient" in this context
- Converts to observable metrics (how many users? what growth rate?)
- Identifies constraints (budget? timeline? current architecture?)
- Produces concrete technical requirements from business jargon

---

## Clean Prompts (Avoid Testing With These)

These are too polished and don't reflect real usage:

### Anti-Test Case 1
```
"Please help me clarify requirements for user authentication feature."
```

**Why bad:** Too formal, no context, no ambiguity shown

---

### Anti-Test Case 2
```
"I need to frame a solution for the dashboard feature."
```

**Why bad:** Uses skill name explicitly, unrealistic phrasing

---

### Anti-Test Case 3
```
"Let's apply the hermeneutic circle to interpret this problem."
```

**Why bad:** Uses philosophical terminology, no real user talks like this

---

## Edge Cases (Should NOT Trigger)

These requests should be handled without the skill:

### Edge Case 1: Already Clear
```
"add a logout button to the nav bar"
```

**Expected:** Skill should NOT trigger (requirement is crystal clear)

---

### Edge Case 2: Simple Bug Fix
```
"the submit button is broken, fix it"
```

**Expected:** Skill should NOT trigger (problem is specific, no interpretation needed)

---

### Edge Case 3: Straightforward Task
```
"update the copyright year to 2026"
```

**Expected:** Skill should NOT trigger (trivial, no ambiguity)

---

## Success Criteria for Skill

When tested with realistic prompts, the skill should:

1. **Trigger reliably** on ambiguous/vague/conflicting requests
2. **NOT trigger** on clear, simple requests
3. **Produce artifacts** matching the template in SKILL.md
4. **Surface assumptions** that weren't obvious
5. **Clarify language** with context-specific definitions
6. **Stabilize interpretation** through part ↔ whole loop
7. **Enable planning** (std-planner can work from interpretation)

---

## Testing Protocol

### Manual Testing
1. Copy prompt from "Realistic User Requests"
2. Paste into Claude Code chat
3. Verify skill triggers automatically
4. Check output matches expected artifacts
5. Verify interpretation is stable (can proceed to planning)

### Automated Testing (Future)
Use skill-creator test harness:
```bash
# Generate test cases
skill-creator test hermeneutic-solution --generate

# Run tests
skill-creator test hermeneutic-solution --run

# Review results
skill-creator test hermeneutic-solution --review
```

---

## Iteration Log

### Version 1.0.0 (2026-03-16)
- Initial test prompts created
- 5 realistic cases, 3 anti-cases, 3 edge cases
- Success criteria defined
- Testing protocol documented

---

## Adding New Test Cases

When adding test cases:
1. Use actual user language (typos, abbreviations, casual tone OK)
2. Include context (why are they asking?)
3. Show ambiguity or confusion in the prompt
4. Document expected behavior
5. Test that skill triggers automatically

**Sources for new test cases:**
- Real Slack/email requests from team
- Support tickets with unclear requirements
- Retrospectives where "requirements changed"
- User research sessions with conflicting feedback
