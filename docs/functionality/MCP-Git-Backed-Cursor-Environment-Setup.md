# MCP Server (Git URL/Branch/Tag) for Cursor Environment Setup

This document outlines an MCP (Model Context Protocol) server that **pulls Cursor modules from a Git URL (repo) and a branch/tag/commit**, and exposes tools that make it easy to **install, update, diff, and validate** a project’s `.cursor/` development environment.

> Scope: **Implementation outline**, not governance/review workflows.

---

## 1) Goal & Developer Experience

### Goal
Enable a developer (inside any project repo) to say:

- “Install enterprise + base + react-tailwind + fastify + postgres + aws from `<git repo>@<tag>`”
- “Update my `.cursor/` to the latest `<tag>`”
- “Show me what will change (diff) before updating”
- “Validate my environment is consistent and complete”

### Expected outputs in the project repo
- `.cursor/rules/**`
- `.cursor/commands/**`
- `.cursor/skills/**`
- `.cursor/agents/**`
- `stack.profile.json` (optional but recommended)
- `cursor.lock.json` (optional but recommended; pins source + selection)

---

## 2) Repository Contract (Source-of-Truth Repo)

Your `ai-development` repo should be organized into **modules**, each providing a `cursor/` payload:

```
ai-development/
  modules/
    enterprise-standards/<module>/
      cursor/{rules,commands,skills,agents}/...
      README.md
      module.json (recommended)
    stack-authorities/<domain>/<module>/
      cursor/{rules,commands,skills,agents}/...
      README.md
      module.json (recommended)
    project-controls/<module>/
      cursor/{rules,commands,skills,agents}/...
      README.md
      module.json (recommended)
```

### Recommended: `module.json` (per module)
Place next to `cursor/`:

```json
{
  "id": "frontend/react-tailwind",
  "type": "stack-authority",
  "name": "React + Tailwind",
  "description": "React conventions + Tailwind Utility/Control/Component taxonomy.",
  "provides": {
    "rules": ["20-web-react-tailwind.mdc"],
    "commands": ["web.react.build-screen.md"],
    "skills": ["react-tailwind-conventions"],
    "agents": ["web.react-critic.md"]
  },
  "requires": ["enterprise/enterprise-standards", "controls/base"],
  "tags": ["frontend", "react", "tailwind"]
}
```

If you don’t want manifests yet, the MCP server can infer module contents by scanning `cursor/`, but manifests make discovery and validation easier.

---

## 3) MCP Server Architecture (Git-backed)

### 3.1 Components
- **MCP Server (Node/TS or Python)**
  - Exposes tools: `list_modules`, `install_environment`, `diff_environment`, `update_environment`, `validate_environment`
- **Git Fetcher**
  - Clones or fetches updates for the source repo at a requested `ref` (branch/tag/commit)
- **Module Resolver**
  - Finds modules and reads optional `module.json`
- **Composer**
  - Merges selected modules into a single output `.cursor/`
- **Diff Engine**
  - Computes file-level changes before applying
- **Validator**
  - Checks naming collisions, required files, and basic correctness
- **Cache**
  - Caches repo clones by (repo URL + ref) or by (repo URL + commit SHA)

---

## 4) Git Pull Strategy (URL/Branch/Tag/Commit)

### 4.1 Inputs
- `repoUrl`: e.g., `git@github.com:org/ai-development.git` or `https://...`
- `ref`: one of:
  - tag: `v1.2.0`
  - branch: `main`
  - commit: `a1b2c3d4...`

### 4.2 Normalize to an immutable commit SHA
To ensure deterministic installs:
1. Fetch `ref`
2. Resolve to `commitSha`
3. Use `commitSha` for caching and lockfile pins

### 4.3 Cache layout
Suggested cache directory:
- `~/.cache/ai-dev-mcp/<hash(repoUrl)>/<commitSha>/`

Where `<hash(repoUrl)>` is a stable hash (sha256/base32) of repoUrl.

### 4.4 Refresh policy
- If `ref` is a **tag** or **commit**, treat as immutable
- If `ref` is a **branch**, refresh on:
  - explicit `forceRefresh: true`, or
  - TTL (e.g., 30 minutes), or
  - always refresh (slower but simplest)

---

## 5) Project Consumption Contract

### 5.1 `stack.profile.json` (recommended)
In each project repo:

```json
{
  "enterprise": "enterprise/enterprise-standards",
  "controls": ["controls/base"],
  "stacks": [
    "frontend/react-tailwind",
    "backend/node-fastify",
    "database/postgres",
    "cloud/aws"
  ]
}
```

### 5.2 `cursor.lock.json` (recommended)
Pin the source repo + resolved commit:

```json
{
  "source": {
    "repoUrl": "git@github.com:org/ai-development.git",
    "ref": "v1.2.0",
    "commitSha": "a1b2c3d4..."
  },
  "selection": {
    "enterprise": "enterprise/enterprise-standards",
    "controls": ["controls/base"],
    "stacks": ["frontend/react-tailwind", "backend/node-fastify", "database/postgres", "cloud/aws"]
  },
  "generatedAt": "2026-01-26T00:00:00Z"
}
```

Even without governance, a lockfile:
- makes installs reproducible
- enables “update” to be deliberate

---

## 6) Composition Rules (How modules merge)

### 6.1 Merge order (recommended)
1. **Enterprise standards**
2. **Project controls**
3. **Stack authorities**
4. **Project overrides** (if you add later)

### 6.2 File merge strategy
For each selected module:
- copy `cursor/rules/*` → `.cursor/rules/*`
- copy `cursor/commands/*` → `.cursor/commands/*`
- copy `cursor/skills/*` → `.cursor/skills/*`
- copy `cursor/agents/*` → `.cursor/agents/*`

### 6.3 Collision policy (pick one)
- **Fail-fast (recommended initially)**  
  If any file path already exists with different content, abort and report collisions.
- **Last-wins**  
  Later modules overwrite earlier modules (risky without governance).
- **Namespace-required**  
  Enforce naming conventions to prevent collisions (best long-term).

Recommended: **Fail-fast + enforce namespacing conventions**.

---

## 7) Tooling API: MCP Tools & Schemas

Below are suggested MCP tools. You can implement more later, but this set covers “setup new environment” cleanly.

### 7.1 `list_modules`
**Purpose:** Discover what modules exist at a given `repoUrl@ref`.

**Input**
- `repoUrl` (string)
- `ref` (string)
- `domains` (optional string[]) e.g. `["frontend", "backend"]`
- `tags` (optional string[])

**Output**
- `commitSha`
- `modules[]` with:
  - `id`, `type`, `name`, `description`, `tags`
  - `path` (for debugging)
  - `requires[]` (optional)
  - `provides` (optional)

---

### 7.2 `install_environment`
**Purpose:** Create/update the project’s `.cursor/` from selected modules.

**Input**
- `projectPath` (string, absolute)
- `repoUrl` (string)
- `ref` (string)
- `selection`:
  - `enterprise` (string)
  - `controls` (string[])
  - `stacks` (string[])
- `mode` (string): `"merge"` | `"overwrite"`
- `writeProfile` (bool, default true)
- `writeLockfile` (bool, default true)
- `forceRefresh` (bool, default false)
- `dryRun` (bool, default false)

**Output**
- `commitSha`
- `plan`:
  - `added[]`, `modified[]`, `removed[]` (paths)
  - `collisions[]` (if any)
- `applied` (bool)

---

### 7.3 `diff_environment`
**Purpose:** Show what would change *without* applying it.

**Input**
Same as `install_environment`, but `dryRun=true` always.

**Output**
Same `plan` structure.

---

### 7.4 `update_environment`
**Purpose:** Reinstall based on the project’s existing `stack.profile.json` or `cursor.lock.json`.

**Input**
- `projectPath`
- `repoUrl` (optional; if omitted, read from lockfile)
- `ref` (optional; if omitted, read from lockfile or allow `latestTag=true`)
- `latestTag` (bool, default false) *(optional future enhancement)*
- `mode`: `"merge"` | `"overwrite"`
- `dryRun` (bool)

**Output**
Same `plan` structure.

---

### 7.5 `validate_environment`
**Purpose:** Basic checks on the local project `.cursor/`.

**Input**
- `projectPath`
- `strict` (bool, default false)

**Checks (recommended)**
- `.cursor/` folder exists
- required subfolders exist
- skills contain `SKILL.md`
- command/rule naming conventions (optional)
- no duplicate command file names (path collisions)
- no unreadable/invalid JSON in profile/lockfile
- optional: verify installed content matches lockfile commit

**Output**
- `valid` (bool)
- `issues[]` (code + message + file)
- `warnings[]`

---

## 8) Security & Guardrails (practical baseline)

Even without governance, file-writing tools should be constrained.

### 8.1 Project path restrictions
- Only allow writes under `projectPath`
- Only write to:
  - `.cursor/**`
  - `stack.profile.json`
  - `cursor.lock.json`
- Reject any path traversal or symlink escapes.

### 8.2 Git safety
- Pin to `commitSha` after resolving `ref`
- Prefer shallow clone (`--depth 1`) when possible (branch/tag), but ensure you can resolve tags
- Optional: verify repo URL is in an allowlist

### 8.3 Content safety
- Treat module repo as trusted internal source
- Still validate that copied files are not enormous, binary, or invalid formats

---

## 9) Implementation Notes (Node/TS reference)

### 9.1 Libraries
- Git operations:
  - `simple-git` (easy)
  - or call `git` CLI directly (often simplest and most deterministic)
- File ops:
  - `fs/promises`, `path`
  - hashing: `crypto`

### 9.2 Typical install flow (pseudo)
1. Resolve `repoUrl@ref` → `commitSha` (fetch if needed)
2. Scan modules under `modules/**`
3. Validate `selection` IDs exist (and `requires` satisfied, if using manifests)
4. Build a composition plan:
   - copy set of files from each module into a virtual output tree
   - detect collisions
5. Diff virtual output tree against local `.cursor/`
6. If `dryRun`, return plan only
7. Else:
   - apply changes
   - write `stack.profile.json` and `cursor.lock.json` (optional)
8. Run `validate_environment` and include warnings

---

## 10) Suggested “Nice-to-Haves” (later)

- `scaffold_project_structure` tool (creates `/apps`, `/services`, `/infra`, `/db` skeletons)
- `add_stack` tool (installs one additional module and resolves conflicts)
- `remove_stack` tool (prunes files that came from a module, if tracked in lockfile)
- `module_manifest_lint` tool (ensures modules are well-formed)
- `latest_release` resolver (choose latest semver tag automatically)

---

## 11) What to build first (fast path)

1. `list_modules`
2. `diff_environment`
3. `install_environment`
4. `update_environment`
5. `validate_environment`

That gives you a complete “setup new development environment” loop with minimal complexity.

---

## 12) Acceptance Criteria (Definition of Done)

- MCP server can read from **repoUrl + ref** (branch/tag/commit)
- Resolves to **commitSha** and caches it
- Installs selected modules into `.cursor/` deterministically
- Supports `diff` and `dryRun`
- Writes `stack.profile.json` and `cursor.lock.json` (optional but recommended)
- Validates basic correctness and reports collisions clearly

---
