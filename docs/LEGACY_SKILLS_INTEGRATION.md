# Legacy Skills Integration

This document shows how legacy skills from `docs/legacy/skills/` were transformed into the new Cursor-centric structure.

---

## Integration Summary

| Legacy File | New Location | Transformation |
|------------|--------------|----------------|
| `copilot-contracts.md` | `modules/enterprise-standards/cursor/rules/00-std-foundation.mdc` + `07-std-evidence-based-claims.mdc` + `modules/stack-authorities/testing/visual-parity/cursor/rules/30-test-visual-parity.mdc` | Hard rules → Enforceable constraints (Rules) |
| `copilot-workflow.md` | `modules/enterprise-standards/cursor/rules/06-std-workflow-modes.mdc` | Execution protocol → Mode state machine |
| `parity.capture-prod.skill.md` | `modules/stack-authorities/testing/visual-parity/cursor/commands/test.parity.capture-all.md` | Procedural playbook → Command with workflow steps |
| `parity.capture-local.skill.md` | `modules/stack-authorities/testing/visual-parity/cursor/commands/test.parity.capture-all.md` | Procedural playbook → Command with workflow steps |
| `parity.compare-report.skill.md` | `modules/stack-authorities/testing/visual-parity/cursor/commands/test.parity.compare.md` | Procedural playbook → Command with workflow steps |
| `parity.fix-from-report.skill.md` | `modules/stack-authorities/testing/visual-parity/cursor/commands/test.parity.fix-from-report.md` | Procedural playbook → Command with workflow steps |
| `scraping.fetch-validate.skill.md` | `modules/stack-authorities/testing/visual-parity/cursor/skills/playwright-capture/SKILL.md` | Technical how-to → Comprehensive skill |
| (Implicit parity methodology) | `modules/stack-authorities/testing/visual-parity/cursor/skills/visual-parity-testing/SKILL.md` | Practice → Comprehensive skill with philosophy |
| (Implicit validation) | `modules/stack-authorities/testing/visual-parity/cursor/agents/test.parity-critic.md` | Critique role → Subagent |

---

## Detailed Transformations

### 1. Copilot Contracts → Rules

**Legacy:** `copilot-contracts.md`

```markdown
## Approval Gates
- Present a clear plan and wait for explicit user approval

## Safety & Scope
- Do not perform git operations
- Do not add new dependencies without approval
- Do not refactor unrelated code

## Parity Definition
- Primary goal: VISUAL parity
- Secondary goal: copy + SEO correctness
- Non-goal: DOM/structural parity

## Evidence & Truthfulness
- Do not claim "parity" without evidence artifacts
```

**New:** Three separate rules

#### **00-std-foundation.mdc** (General safety)
```markdown
## Git Operations
- NO git add, commit, push, rebase, amend, cherry-pick
- Read-only git operations allowed

## Approval Gates
- Present plan, wait for user approval before implementation

## Scope Management
- Keep changes tightly scoped to task
- Do not refactor unrelated code
```

#### **07-std-evidence-based-claims.mdc** (Evidence requirements)
```markdown
## No Claims Without Evidence

**Any claim of success must be backed by artifacts:**
- Testing claims: test runner output
- Visual parity claims: screenshots + comparison
- Performance claims: benchmark results
```

#### **30-test-visual-parity.mdc** (Domain-specific definition)
```markdown
## Parity Definition

### Primary Goal: VISUAL Parity
- Layout, spacing, typography, component presence

### Secondary Goal: Copy + SEO Correctness
- Labels, CTAs, headings, title, meta description

### Non-Goal: DOM/Structural Parity
- Production DOM structure NOT required to match
```

**Why split:** General safety rules apply to all work, evidence requirements apply to all claims, parity definition is domain-specific.

---

### 2. Copilot Workflow → Mode State Machine

**Legacy:** `copilot-workflow.md`

```markdown
## Cadence
1. Read: Contracts + standards/skills
2. Plan: Produce concrete plan
3. Wait: Stop until explicit approval
4. Execute: Follow skills/scripts
5. Verify: Generate artifacts and report
6. Stop: Present results, wait for next instruction
```

**New:** `06-std-workflow-modes.mdc`

```markdown
## Eight Modes of Operation

1. SOLUTION → Interpret & refine (Read + understand)
2. PLAN → Build goal tree backward (Plan)
3. DESIGN-FLOW → Map to screens/components
4. BUILD-SCREEN → Implement UI (Execute)
5. BUILD-API → Implement API (Execute)
6. CLEAN-SWEEP → Refactor and standardize
7. TEST-LOOP → Green tests (Verify)
8. DEPLOY-RELEASE → Gated deployment (Stop)

## Mode Transitions
- Approval gates built into transitions
- User controls flow explicitly
```

**Why transformed:** The cadence maps to the mode state machine, but with more granular execution phases (separate UI/API implementation, explicit cleaning, testing loop).

---

### 3. Parity Skills → Commands

**Legacy:** `parity.capture-prod.skill.md`, `parity.capture-local.skill.md`

```markdown
## Purpose
Capture production/local evidence for visual parity

## Preferred Capture
- node scripts/parity/capture_rendered.mjs

## Outputs
- screenshots.png
- page.html
```

**New:** `test.parity.capture-all.md` (Command)

```markdown
# Test Parity: Capture All

Trigger full capture workflow (production + local at all viewports)

## Capture Workflow

### Step 1: Verify Environment
[Check prod/local URLs accessible]

### Step 2: Define Viewports
[Define desktop/tablet/mobile dimensions]

### Step 3: Capture Production
[Run capture script for prod]

### Step 4: Capture Local
[Run capture script for local]

### Step 5: Verify Artifacts
[Check all artifacts exist]

## Output
[Report artifacts generated, reference next command]
```

**Why transformed:** Legacy skills were brief procedural notes. Commands are comprehensive workflow guides with steps, verification, and context.

---

**Legacy:** `parity.compare-report.skill.md`

```markdown
## Purpose
Produce visual parity evidence

## Primary Evidence (Visual)
1. Capture screenshots
2. Generate visual review gallery

## Supporting Evidence (Copy + SEO)
- Extract UI text + SEO metadata
- Generate mismatch report
```

**New:** `test.parity.compare.md` (Command)

```markdown
# Test Parity: Compare

Generate visual comparison report from captures

## Comparison Workflow

### Step 1: Verify Captures Exist
### Step 2: Generate Visual Gallery
### Step 3: Extract UI Text and SEO Metadata
### Step 4: Generate Parity Report
### Step 5: Review Evidence Artifacts

[Detailed steps for each]

## Output
[Report comparison results with evidence references]
```

**Why transformed:** Commands provide step-by-step guidance, error handling, and output templates.

---

### 4. Methodology → Skills

**Legacy:** Implicit in `copilot-contracts.md` + individual skill files

- Parity definition scattered across multiple files
- No comprehensive methodology guide
- No explanation of "why" (just "what")

**New:** `visual-parity-testing/SKILL.md` (Comprehensive skill)

```markdown
# Visual Parity Testing

## Visual Parity Operationalized

### Design Goal
Turn visual parity validation into repeatable, evidence-based workflow

### What IS Parity?
1. Visual Parity (Primary) - Layout, spacing, typography...
2. Copy + SEO (Secondary) - Text, titles, meta...

### What IS NOT Parity?
DOM/Structural Parity (Non-Goal)

## The Visual Parity Workflow
[9-step detailed workflow]

## Common Failure Modes
[5 common mistakes with examples]

## Why This Works in Practice
[Before/after comparison]

## Key Principle
Generate artifacts first, then fix based on evidence.
```

**Why transformed:** Skills teach the methodology in depth, explain philosophy, provide examples, and document failure modes. Legacy skills were brief procedures; new skills are comprehensive guides.

---

### 5. Technical How-To → Technical Skill

**Legacy:** `scraping.fetch-validate.skill.md`

```markdown
## Preferred (Playwright)
- node scripts/parity/capture_rendered.mjs

## Fallback (curl)
- bash scripts/scraping/fetch_page.sh
```

**New:** `playwright-capture/SKILL.md`

```markdown
# Playwright Capture

## Basic Capture Script
[Complete code example]

## Multi-Viewport Capture
[Complete code example with all viewports]

## Advanced Options
1. Wait for specific element
2. Handle authentication
3. Mock dynamic content
4. Disable animations
5. Capture specific element

## Visual Gallery Generator
[Complete code example]

## Troubleshooting
[5 common issues with fixes]

## Performance Tips
[3 optimization techniques]
```

**Why transformed:** Legacy skill was minimal. New skill is comprehensive technical guide with complete code examples, advanced techniques, troubleshooting, and performance tips.

---

### 6. Validation → Subagent

**Legacy:** Implicit in contracts ("Do not claim parity without evidence")

- No explicit validation mechanism
- Human responsible for catching bad claims
- No structured critique process

**New:** `test.parity-critic.md` (Subagent)

```markdown
# Test Parity Critic

You are a visual parity validation specialist.

## Your Responsibilities

### 1. Validate Evidence Exists
[Check for artifacts]

### 2. Challenge Visual Parity Claims
[Question assumptions]

### 3. Distinguish Visual vs Structural Issues
[Clarify parity definition]

### 4. Validate Copy/SEO Claims
[Check text/SEO diffs]

### 5. Validate Fix Claims
[Verify re-capture after fixes]

### 6. Challenge Acceptable Difference Claims
[Test rationalizations]

## Your Output Template
[Structured validation format]
```

**Why created:** Subagent operationalizes the validation that was previously just a contract. It provides structured critique, challenges assumptions, and validates evidence quality.

---

## Key Transformations Summary

| Legacy Pattern | New Pattern | Why |
|---------------|-------------|-----|
| Hard rules (contracts) | Rules (.mdc) | Enforceable constraints with YAML frontmatter |
| Execution cadence | Mode state machine | More granular, explicit transitions |
| Brief procedural notes | Commands (.md) | Comprehensive workflow guides |
| Implicit methodology | Skills (SKILL.md) | Explicit philosophy + practice |
| Minimal technical notes | Technical skills | Complete code examples + troubleshooting |
| No validation mechanism | Subagents | Automated critique + validation |

---

## Benefits of Transformation

### Before (Legacy)

- Rules scattered across multiple files
- Brief procedural notes (hard to follow)
- No comprehensive methodology
- No structured validation
- Implicit assumptions
- Hard to compose across projects

### After (New Structure)

- Rules centralized and enforceable
- Commands provide step-by-step guidance
- Skills teach methodology in depth
- Subagents validate claims automatically
- Explicit philosophy and practice
- Modular composition (visual parity is a stack authority module)

---

## Usage in New System

### Full Visual Parity Workflow

```
1. SOLUTION mode
   - Define parity requirements (viewports, pages, success criteria)

2. PLAN mode
   - Apply teleological planning
   - Plan backward from "visual parity achieved"

3. TEST-LOOP mode
   - Run /test.parity.capture-all
     → Applies: 30-test-visual-parity.mdc rule
     → Applies: playwright-capture skill
   
   - Run /test.parity.compare
     → Generates visual gallery + parity report
   
   - Review evidence artifacts
     → Human decision based on objective evidence
   
   - Run /test.parity.fix-from-report
     → Applies: visual-parity-testing skill
     → Fixes only what evidence shows
   
   - Invoke test.parity-critic subagent
     → Validates parity claims with evidence
     → Challenges assumptions
     → Approves or rejects parity claim

4. DEPLOY-RELEASE mode (if parity achieved)
```

### Rules Enforced

- `00-std-foundation.mdc`: No git ops, approval gates, tight scope
- `07-std-evidence-based-claims.mdc`: No parity claim without artifacts
- `30-test-visual-parity.mdc`: Visual parity definition, evidence requirements

### Commands Available

- `/test.parity.capture-all`: Capture prod + local screenshots
- `/test.parity.compare`: Generate comparison report
- `/test.parity.fix-from-report`: Fix visual mismatches

### Skills Applied

- `visual-parity-testing`: Complete methodology
- `playwright-capture`: Technical implementation

### Subagents Invoked

- `test.parity-critic`: Validate parity claims with evidence

---

## Conclusion

The legacy skills have been **fully transformed** into the new Cursor-centric structure:

- **Contracts** → **Rules** (enforceable constraints)
- **Workflow** → **Mode state machine** (explicit phases)
- **Procedural notes** → **Commands** (workflow guides)
- **Implicit methodology** → **Skills** (comprehensive guides)
- **No validation** → **Subagents** (automated critique)

The new structure is **more comprehensive, more modular, and more operational** than the legacy approach.
