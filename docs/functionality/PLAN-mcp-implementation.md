# Implementation Plan: MCP Server for AI Development Modules

**Goal:** Build an MCP server that exposes the ai-development modules (rules, commands, skills, agents) from GitHub and provides tools to install, update, diff, and validate project `.cursor/` environments.

**Source Repo:** https://github.com/thehivegroup-ai/ai-development.git

---

## Architecture Decision Summary

### Approach: Hybrid Resource + Tool-based MCP Server

- **Resources** for browsing/reading module content
- **Tools** for installation and management operations
- **Git-based** using shallow clones with commit SHA pinning
- **Convention-based** module discovery (scan `cursor/` folders)
- **Fail-fast** collision policy with namespaced naming conventions

---

## Phase 1: Foundation & Git Operations

**Goal:** Set up MCP server infrastructure with Git cloning and caching.

### Tasks

#### 1.1 Project Structure
```
ai-development-mcp/
  src/
    index.ts              # MCP server entry point
    git/
      fetcher.ts          # Git clone/fetch/cache operations
      resolver.ts         # Resolve ref → commitSha
    cache/
      manager.ts          # Cache directory management
    types.ts              # TypeScript types
  package.json
  tsconfig.json
  README.md
```

**Dependencies:**
- `@modelcontextprotocol/sdk` - MCP server SDK
- `simple-git` - Git operations
- `zod` - Schema validation

#### 1.2 Git Fetcher Implementation

**Key functions:**
- `cloneOrFetch(repoUrl, ref)` → returns local path
- `resolveToCommitSha(repoUrl, ref)` → returns SHA
- Cache location: `~/.cache/ai-dev-mcp/<hash(repoUrl)>/<commitSha>/`

**Strategy:**
- For tags/commits: treat as immutable, cache indefinitely
- For branches: implement TTL-based refresh (30 min) or force refresh flag
- Use shallow clones (`--depth 1`) for efficiency

#### 1.3 MCP Server Registration

**Cursor MCP config** (`~/.cursor/config.json` or settings):
```json
{
  "mcpServers": {
    "ai-development": {
      "command": "node",
      "args": ["/path/to/ai-development-mcp/dist/index.js"],
      "env": {
        "DEFAULT_REPO_URL": "https://github.com/thehivegroup-ai/ai-development.git",
        "DEFAULT_REF": "main"
      }
    }
  }
}
```

**Deliverable:** MCP server starts, connects, can clone repo and cache it.

---

## Phase 2: Module Discovery & Resources

**Goal:** Scan modules and expose them as readable MCP resources.

### Tasks

#### 2.1 Module Scanner

**Scan strategy:**
```
modules/
  enterprise-standards/<module>/cursor/...
  stack-authorities/<category>/<module>/cursor/...
  project-controls/<module>/cursor/...
```

**Extract:**
- Module ID (e.g., `frontend/react-tailwind`)
- Module path
- Category (enterprise-standards, stack-authority, project-control)
- Contents: rules[], commands[], skills[], agents[]

**Output:** Internal module registry (array of module metadata).

#### 2.2 MCP Resources

Expose each module as a resource:

**Resource URI pattern:**
```
ai-dev://modules/<module-id>
ai-dev://modules/<module-id>/rules
ai-dev://modules/<module-id>/commands
ai-dev://modules/<module-id>/skills
ai-dev://modules/<module-id>/agents
```

**Example:**
```
ai-dev://modules/frontend/react-tailwind
ai-dev://modules/frontend/react-tailwind/rules/20-web-react-tailwind.mdc
ai-dev://modules/frontend/react-tailwind/skills/react-component-standards
```

**Benefit:** Agent can read specific files directly using MCP resource fetch.

#### 2.3 `list_modules` Tool

**Input:**
```typescript
{
  repoUrl?: string;      // default from env
  ref?: string;          // default from env
  category?: string;     // filter: "frontend", "backend", etc.
  tags?: string[];       // future: filter by tags
  forceRefresh?: boolean;
}
```

**Output:**
```typescript
{
  commitSha: string;
  modules: [
    {
      id: "frontend/react-tailwind",
      category: "stack-authority",
      name: "React + Tailwind",
      path: "modules/stack-authorities/frontend/react-tailwind",
      provides: {
        rules: ["20-web-react-tailwind.mdc"],
        commands: ["web.react.build-screen.md", ...],
        skills: ["react-component-standards", ...],
        agents: ["web.react-critic.md"]
      }
    },
    ...
  ]
}
```

**Deliverable:** Agent can discover all available modules.

---

## Phase 3: Installation Tools

**Goal:** Automated installation with collision detection and lockfile generation.

### Tasks

#### 3.1 Composition Engine

**Input:** Selected module IDs (e.g., `["enterprise/enterprise-standards", "frontend/react-tailwind"]`)

**Process:**
1. For each module, collect all files from `cursor/` subdirectory
2. Merge in order:
   - Enterprise standards
   - Project controls
   - Stack authorities
3. Build virtual output tree (in-memory representation of `.cursor/`)

**Collision detection:**
- Track file paths
- If same path appears twice with different content → fail with error
- Namespacing conventions prevent most collisions (e.g., `20-web-*`, `30-api-*`)

**Output:** Virtual file tree ready to write.

#### 3.2 `diff_environment` Tool

**Input:**
```typescript
{
  projectPath: string;   // absolute path to project
  repoUrl?: string;
  ref?: string;
  selection: {
    enterprise: string;
    controls: string[];
    stacks: string[];
  };
  dryRun: boolean;       // always true for diff
}
```

**Process:**
1. Build virtual output from selected modules
2. Compare against existing `.cursor/` in project
3. Compute: added[], modified[], removed[]

**Output:**
```typescript
{
  commitSha: string;
  plan: {
    added: string[];      // new files
    modified: string[];   // changed files
    removed: string[];    // files to delete
    unchanged: string[];  // no changes
  },
  collisions: [          // if any
    {
      path: string;
      modules: string[]; // which modules provide this
    }
  ]
}
```

**Deliverable:** Agent can preview changes before installation.

#### 3.3 `install_environment` Tool

**Input:**
```typescript
{
  projectPath: string;
  repoUrl?: string;
  ref?: string;
  selection: {
    enterprise: string;
    controls: string[];
    stacks: string[];
  };
  mode: "merge" | "overwrite";  // merge = keep existing files, overwrite = replace all
  writeProfile: boolean;         // default true
  writeLockfile: boolean;        // default true
  forceRefresh: boolean;         // default false
  dryRun: boolean;               // default false
}
```

**Process:**
1. Run composition engine
2. If collisions → abort with error
3. If dryRun → return plan only
4. Write files to `.cursor/`
5. Generate `stack.profile.json`:
   ```json
   {
     "enterprise": "enterprise/enterprise-standards",
     "controls": ["controls/base"],
     "stacks": ["frontend/react-tailwind", "backend/node-fastify"]
   }
   ```
6. Generate `cursor.lock.json`:
   ```json
   {
     "source": {
       "repoUrl": "...",
       "ref": "v1.0.0",
       "commitSha": "abc123..."
     },
     "selection": { ... },
     "generatedAt": "2026-01-26T..."
   }
   ```

**Output:**
```typescript
{
  commitSha: string;
  plan: { added, modified, removed };
  applied: boolean;
}
```

**Deliverable:** Agent can install a complete `.cursor/` environment.

#### 3.4 Collision Detection & Reporting

**Fail-fast policy:**
- If two modules provide same file path with different content → error
- Provide clear error message with module names

**Example error:**
```
Collision detected: .cursor/rules/20-web-component.mdc
  - Provided by: frontend/react-tailwind
  - Provided by: frontend/angular-tailwind

Recommendation: Modules use namespacing conventions to avoid collisions.
```

**Resolution:** Ensure all modules follow naming conventions (already in place).

---

## Phase 4: Validation & Updates

**Goal:** Complete the management toolset with validation and updates.

### Tasks

#### 4.1 `validate_environment` Tool

**Input:**
```typescript
{
  projectPath: string;
  strict: boolean;  // default false
}
```

**Checks:**
1. `.cursor/` folder exists
2. Required subfolders: `rules/`, `commands/`, `skills/`, `agents/`
3. Skills have `SKILL.md` files
4. Commands follow naming conventions (e.g., `std.*.md`)
5. No duplicate file names
6. `stack.profile.json` is valid JSON
7. `cursor.lock.json` is valid JSON
8. (Optional strict mode) Verify installed files match lockfile commitSha

**Output:**
```typescript
{
  valid: boolean;
  issues: [
    { code: "MISSING_FOLDER", message: ".cursor/rules/ not found", path: ".cursor/rules" }
  ],
  warnings: [
    { code: "NO_LOCKFILE", message: "cursor.lock.json not found (recommended)" }
  ]
}
```

**Deliverable:** Agent can check environment health.

#### 4.2 `update_environment` Tool

**Input:**
```typescript
{
  projectPath: string;
  repoUrl?: string;      // optional, read from lockfile if omitted
  ref?: string;          // optional, read from lockfile if omitted
  mode: "merge" | "overwrite";
  dryRun: boolean;
}
```

**Process:**
1. Read `cursor.lock.json` or `stack.profile.json`
2. Use existing selection
3. Fetch new ref (if provided, or use current)
4. Run diff + install

**Use case:** "Update my environment to latest v2.0.0"

**Deliverable:** Agent can update existing installations.

#### 4.3 `module.json` Support (Optional)

**Add to each module:**
```json
{
  "id": "frontend/react-tailwind",
  "type": "stack-authority",
  "name": "React + Tailwind",
  "description": "React conventions + Tailwind patterns",
  "provides": {
    "rules": ["20-web-react-tailwind.mdc"],
    "commands": ["web.react.build-screen.md"],
    "skills": ["react-component-standards"],
    "agents": ["web.react-critic.md"]
  },
  "requires": ["enterprise/enterprise-standards"],
  "tags": ["frontend", "react", "tailwind"]
}
```

**Benefits:**
- Explicit metadata (no inference needed)
- Dependency resolution
- Better filtering and search

**Implementation:**
- Scanner checks for `module.json` first
- Falls back to convention-based scanning if missing

---

## Phase 5: Documentation & Testing

**Goal:** Make the MCP server production-ready.

### Tasks

#### 5.1 Error Handling

**Add:**
- Git failures (network, auth, invalid ref)
- File system errors (permissions, disk space)
- Invalid module structures
- JSON parse errors
- Clear, actionable error messages

#### 5.2 Documentation

**Create:**
1. **README.md** - Installation and setup
2. **USAGE.md** - How to use each tool
3. **EXAMPLES.md** - Common workflows
4. **TROUBLESHOOTING.md** - Common issues

**Include:**
- MCP server installation instructions
- Cursor configuration
- Example tool invocations
- Screenshots or CLI output examples

#### 5.3 Testing

**Test scenarios:**
1. Install fresh environment (no existing `.cursor/`)
2. Update existing environment
3. Preview changes with diff
4. Handle collisions
5. Validate environment
6. Test with `examples/react-fastify-postgres-aws` stack profile

**Test repos:**
- Use the actual `ai-development` repo
- Test with tags, branches, commits
- Test with private repo (SSH auth)

---

## Implementation Order (Fast Path)

**Week 1-2:**
1. Phase 1.1, 1.2 - Git operations working
2. Phase 2.1, 2.2 - Module scanning and resources
3. Phase 2.3 - `list_modules` tool

**Week 3-4:**
4. Phase 3.1, 3.2 - Composition and diff
5. Phase 3.3, 3.4 - Installation and collision detection

**Week 5-6:**
6. Phase 4.1, 4.2 - Validation and updates
7. Phase 5 - Testing and documentation

---

## Success Criteria

- [ ] MCP server can clone and cache repo at specific ref
- [ ] `list_modules` returns all available modules
- [ ] MCP resources expose module files for reading
- [ ] `diff_environment` shows preview of changes
- [ ] `install_environment` creates complete `.cursor/` from selection
- [ ] Collision detection prevents naming conflicts
- [ ] `validate_environment` checks environment health
- [ ] `update_environment` updates from lockfile
- [ ] Tested with real project stack profiles
- [ ] Documentation complete

---

## Future Enhancements (Post-MVP)

- `add_stack` tool (add one module without reinstalling all)
- `remove_stack` tool (remove module and its files)
- `scaffold_project` tool (create project structure)
- Semver-aware `latest_release` resolver
- Web UI for browsing modules
- CI/CD integration (validate on PR)

---

## Next Steps

1. **Set up project skeleton** - Create `ai-development-mcp/` repository
2. **Start with Phase 1** - Get Git operations working
3. **Test early** - Use real ai-development repo immediately
4. **Iterate** - Build phase by phase, test continuously

---

## Implementation Decisions

1. **Repo hosting:** ✅ Public repository (uses HTTPS, no auth needed)
2. **Versioning:** Support both tags (v1.0.0) and branches (main) - user specifies ref
3. **Module manifests:** Phase 4 (optional enhancement) - start convention-based
4. **Distribution:** Start local, consider npm publishing later

### Git Strategy (Public Repo)
- Use HTTPS clone: `https://github.com/thehivegroup-ai/ai-development.git`
- No authentication required for reads
- Simpler setup for users
