# Claude Code support

The MCP server can install modules into the layout Claude Code reads (`.claude/`)
instead of, or alongside, the Cursor layout (`.cursor/`).

Pass `platform` to `install_environment` or `diff_environment`:

| `platform` | Writes |
|------------|--------|
| `cursor` (default) | `.cursor/`, `cursor.lock.json`, `ai-development.sync-manifest.json` |
| `claude` | `.claude/`, `cursor.lock.json` |
| `both` | everything above |

```json
{
  "projectPath": "/abs/path/to/your-project",
  "platform": "claude",
  "selection": {
    "enterprise": "enterprise-standards",
    "controls": [],
    "stacks": ["next-tailwind", "postgres"]
  }
}
```

Module selection, dependency resolution, priority ordering and conflict handling
are shared with the Cursor path — the same composed tree is projected into a
different layout, so both platforms always get the same module content.

Use `diff_environment` with `platform: "claude"` to preview the file list,
skipped files, and conversion warnings without writing anything.

---

## What maps to what

| Module source | Claude Code target | Conversion |
|---------------|--------------------|------------|
| `rules/*.mdc` | `.claude/rules/*.md` | Frontmatter rewritten (see below) |
| `skills/<name>/**` | `.claude/skills/<name>/**` | Copied as-is; skills are already portable |
| `agents/*.md` | `.claude/agents/*.md` | `model` value remapped |
| `commands/*.md` | `.claude/commands/*.md` | Copied as-is |
| `hooks.d/*.sh` | `.claude/hooks/*.sh` | `.cursor/` path references retargeted |
| `hooks.json` | `.claude/settings.json` → `hooks` | Event names, matchers and I/O translated |

Not installed, because they are not Claude Code artifacts: `module.json`,
`README.md`, `HOOKS-README.md`, `hooks.consolidated.json`, `docs/**`,
`.githooks/**`, `scripts/**`.

`instructions.md` is skipped when its module also ships `rules/`, since the rules
are the enforceable form of the same content and installing both would duplicate
it in every session's context. A module that ships `instructions.md` and no rules
gets it installed as `.claude/rules/00-base-instructions.md`.

### Rules

Cursor's rule activation model maps onto Claude Code's `.claude/rules/` directory:

| Cursor frontmatter | Claude Code result |
|--------------------|--------------------|
| `alwaysApply: true` | No frontmatter — loads in every session |
| `globs: "a,b"` | `paths: ["a", "b"]` — loads when matching files are read |
| Neither | No frontmatter — loads in every session, **with a warning** |

That last row is the one behaviour change. Cursor loads such rules only when the
agent asks for them; Claude Code has no equivalent trigger, so they load
unconditionally. Loading a constraint too often is safer than never loading it,
but it does cost context. Four `enterprise-standards` rules are affected today.

`globs` values are comma-separated but contain brace groups such as
`**/infra/**/*.{ts,js}`. Splitting is brace-aware so those stay intact, and each
pattern is emitted double-quoted because a leading `*` would otherwise parse as a
YAML alias.

The Cursor `description` has no place in Claude Code rule frontmatter, so it is
preserved as a leading blockquote instead of being dropped.

### Agents

`model` is remapped, because Claude Code only accepts `sonnet`, `opus`, `haiku`,
`fable`, a full model ID, or `inherit`:

| Source | Becomes |
|--------|---------|
| `fast` | `sonnet` |
| `max` | `opus` |
| `auto`, `default` | `inherit` |
| already valid | unchanged |
| anything else | field dropped, so the agent inherits the session model |

21 of 23 agents currently declare `model: fast`. Each remap is reported as a
warning so the choice is visible; if `sonnet` is wrong for a given reviewer,
change it at the source in `modules/`.

Everything else in the frontmatter — including long multi-line descriptions — is
edited in place rather than re-serialized, so nothing is reformatted or truncated.

### Hooks

Cursor and Claude Code disagree on three things: event names, what a matcher
matches, and the JSON hook scripts exchange on stdin/stdout. Event and matcher
differences are handled at install time:

| Cursor event | Claude Code event | Matcher |
|--------------|-------------------|---------|
| `sessionStart` | `SessionStart` | — |
| `beforeShellExecution` | `PreToolUse` | `Bash` |
| `afterShellExecution` | `PostToolUse` | `Bash` |
| `beforeReadFile` | `PreToolUse` | `Read` |
| `afterFileEdit` | `PostToolUse` | `Write|Edit|MultiEdit|NotebookEdit` |
| `beforeMCPExecution` | `PreToolUse` | `mcp__.*` |
| `stop` | `Stop` |  — |

A Cursor matcher like `"git"` filters on *command text*; Claude Code matchers
filter on *tool name*. Those can't be expressed, so the hook binds to the tool and
the script's own checks do the filtering — which `git-guard.sh` already does. This
is reported as a warning rather than silently changing behaviour.

The I/O difference is handled at runtime by a generated shim,
`.claude/hooks/_cursor-hook-adapter.sh`. Hook scripts are **not** rewritten, so
`modules/` stays the single source of truth for hook logic. Each hook is invoked
as:

```
"$CLAUDE_PROJECT_DIR"/.claude/hooks/_cursor-hook-adapter.sh <Event> "$CLAUDE_PROJECT_DIR"/.claude/hooks/<script>.sh
```

The shim translates in both directions:

| Claude Code stdin | Cursor stdin |
|-------------------|--------------|
| `.cwd` | `.workspace_roots[0]` |
| `.session_id` | `.conversation_id` |
| `.tool_input.command` | `.command` |
| `.tool_input.file_path` | `.file_path` |
| `.tool_input.new_string` / `.content` / `.edits` / `.new_source` | `.edits[]` |

| Cursor stdout | Claude Code stdout |
|---------------|--------------------|
| `{additional_context}` (SessionStart) | `hookSpecificOutput.additionalContext` |
| `{permission, agent_message}` (PreToolUse) | `hookSpecificOutput.permissionDecision` + `permissionDecisionReason` |
| `{agent_message}` (PostToolUse) | `hookSpecificOutput.additionalContext` |

The `.edits[]` mapping matters: `secrets-scanner.sh`, `phi-pii-scanner.sh` and
`hygiene-watchdog.sh` all inspect `.edits[].new_string`. Without it they would
receive an empty array and silently approve everything.

The shim **fails open**. If `jq` is missing, the wrapped script errors, or its
output is unparseable, it exits 0 with no decision so a broken hook can't wedge
a session. It requires `jq`, as the hook scripts themselves already do.

`settings.json` is **merged**, not overwritten: `permissions`, `env`, `model` and
hand-written hooks are preserved. Previously generated hook entries are
recognized by their use of the shim and replaced, so reinstalling is idempotent.

---

## Limitations

- **Publishing back is Cursor-only.** `push_module_updates` and
  `sync_latest_environment` read `.cursor/` through
  `ai-development.sync-manifest.json`, which a `claude`-only install does not
  write. Edits made under `.claude/` are not published to the module sources. Use
  `platform: "both"` if you want to contribute changes back, and edit under
  `.cursor/`.
- **`validate_environment` checks `.cursor/`.** It does not yet inspect `.claude/`.
- **Command names keep their dots.** `commands/web.next.build-screen.md` becomes
  `/web.next.build-screen`, not a `web:next` namespace. Claude Code namespaces via
  subdirectories; renaming was left alone to keep a 1:1 mapping with the sources.
- **`hooks.consolidated.json` is not used.** Only `hooks.json` is converted.

---

## Verifying an install

In the target project:

```bash
claude          # then run /context to confirm rules loaded under "Memory files"
```

`/context` lists which rules and CLAUDE.md files actually loaded, and `/doctor`
reports hook configuration problems. To exercise a hook directly without waiting
for the event to fire:

```bash
echo '{"session_id":"s","cwd":"'"$PWD"'","hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"git push"}}' \
  | .claude/hooks/_cursor-hook-adapter.sh PreToolUse .claude/hooks/git-guard.sh
```

That should print a `deny` decision with the reason from `git-guard.sh`.
