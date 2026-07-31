/**
 * Claude Code converters
 *
 * Translates the platform-neutral module tree (as composed for `.cursor/`) into
 * the artifact layout Claude Code actually reads:
 *
 *   rules/*.mdc            -> .claude/rules/*.md        (alwaysApply -> unconditional, globs -> `paths:`)
 *   skills/<name>/**       -> .claude/skills/<name>/**  (passthrough; already portable)
 *   agents/*.md            -> .claude/agents/*.md       (model alias remapped)
 *   commands/*.md          -> .claude/commands/*.md     (passthrough)
 *   hooks/*.sh             -> .claude/hooks/*.sh        (path references rewritten)
 *   hooks.json             -> .claude/settings.json     (event + I/O translation via adapter shim)
 *
 * Cursor and Claude Code hand hook scripts different JSON on stdin and expect
 * different JSON back, so hook scripts are not rewritten. They are invoked
 * through CURSOR_HOOK_ADAPTER, which translates in both directions. That keeps
 * `modules/` the single source of truth for hook logic.
 */

// ============================================================================
// Frontmatter
// ============================================================================

export interface ParsedFrontmatter {
  /** Original frontmatter text between the `---` fences, or null when absent. */
  raw: string | null;
  /** Scalar keys. Folded/literal blocks are joined into a single line. */
  data: Record<string, string>;
  /** Keys whose value was a YAML sequence. */
  lists: Record<string, string[]>;
  /** Document content after the frontmatter block. */
  body: string;
}

const FRONTMATTER_RE = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * Parse YAML frontmatter well enough for the shapes these modules use:
 * scalars, quoted scalars, folded/literal blocks (`>` / `|`) and `- ` sequences.
 */
export function parseFrontmatter(content: string): ParsedFrontmatter {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    return { raw: null, data: {}, lists: {}, body: content };
  }

  const rawBlock = match[1];
  const body = content.slice(match[0].length);
  const data: Record<string, string> = {};
  const lists: Record<string, string[]> = {};

  const lines = rawBlock.split(/\r?\n/);
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Skip blank lines and comments at the top level.
    if (!line.trim() || /^\s*#/.test(line)) {
      index += 1;
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_.-]+)[ \t]*:[ \t]*(.*)$/);
    if (!keyMatch) {
      index += 1;
      continue;
    }

    const key = keyMatch[1];
    const inline = keyMatch[2].trim();
    index += 1;

    // Folded (`>`) or literal (`|`) block scalar.
    if (inline === '>' || inline === '|' || /^[>|][-+]?\d*$/.test(inline)) {
      const collected: string[] = [];
      while (index < lines.length) {
        const next = lines[index];
        if (next.trim() && !/^\s/.test(next)) break;
        collected.push(next.trim());
        index += 1;
      }
      data[key] = collected.join(' ').replace(/\s+/g, ' ').trim();
      continue;
    }

    // YAML sequence on following lines.
    if (inline === '') {
      const items: string[] = [];
      while (index < lines.length) {
        const next = lines[index];
        const item = next.match(/^\s+-[ \t]+(.*)$/);
        if (!item) {
          if (next.trim() && !/^\s/.test(next)) break;
          if (!next.trim()) {
            index += 1;
            continue;
          }
          break;
        }
        items.push(stripQuotes(item[1].trim()));
        index += 1;
      }
      if (items.length) {
        lists[key] = items;
        data[key] = items.join(',');
      } else {
        data[key] = '';
      }
      continue;
    }

    data[key] = stripQuotes(inline);
  }

  return { raw: rawBlock, data, lists, body };
}

/** Remove one layer of matching surrounding quotes. */
export function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

/** Emit a YAML double-quoted scalar. Glob patterns need it: `*` starts an alias. */
export function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

const TRUTHY = /^(true|yes|on|1)$/i;

export function isTruthy(value: string | undefined): boolean {
  return TRUTHY.test((value ?? '').trim());
}

/**
 * Split a Cursor `globs:` value into individual patterns.
 *
 * Values are comma-separated but may contain brace groups such as
 * `**\/infra/**\/*.{ts,js}`. Splitting on every comma would corrupt those, so
 * commas are only treated as separators at brace depth zero.
 */
export function splitPatternList(raw: string): string[] {
  const source = stripQuotes(raw);
  const patterns: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of source) {
    if (char === '{') {
      depth += 1;
      current += char;
    } else if (char === '}') {
      depth = Math.max(0, depth - 1);
      current += char;
    } else if (char === ',' && depth === 0) {
      if (current.trim()) patterns.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) patterns.push(current.trim());
  return patterns;
}

// ============================================================================
// Rules
// ============================================================================

export interface ConversionResult {
  content: string;
  warnings: string[];
}

/**
 * Convert a Cursor `.mdc` rule into a Claude Code project rule.
 *
 * - `alwaysApply: true`  -> no frontmatter, loads every session
 * - `globs: a,b`         -> `paths:` list, loads when matching files are read
 * - neither              -> loads unconditionally (Cursor's agent-requested
 *                           rules have no Claude Code equivalent), with a warning
 */
export function convertRule(mdcContent: string, ruleName: string): ConversionResult {
  const { data, body } = parseFrontmatter(mdcContent);
  const warnings: string[] = [];

  const alwaysApply = isTruthy(data.alwaysApply);
  const patterns = data.globs ? splitPatternList(data.globs) : [];
  const description = data.description ?? '';

  let frontmatter = '';
  if (alwaysApply && patterns.length > 0) {
    warnings.push(
      `${ruleName}: alwaysApply is true, so its ${patterns.length} glob pattern(s) were dropped — the rule loads in every session.`
    );
  } else if (patterns.length > 0) {
    frontmatter = `---\npaths:\n${patterns.map((p) => `  - ${yamlQuote(p)}`).join('\n')}\n---\n\n`;
  } else if (!alwaysApply) {
    warnings.push(
      `${ruleName}: has neither alwaysApply nor globs. Cursor loads it only on agent request; Claude Code has no equivalent, so it now loads in every session.`
    );
  }

  // Claude Code rule frontmatter only defines `paths`, so the Cursor description
  // is preserved as a leading blockquote rather than an unsupported key.
  const preamble = description ? `> ${description}\n\n` : '';

  return { content: `${frontmatter}${preamble}${body.replace(/^\s*\n/, '')}`, warnings };
}

// ============================================================================
// Agents
// ============================================================================

/** Model aliases Claude Code accepts directly. */
const CLAUDE_MODEL_ALIASES = new Set(['sonnet', 'opus', 'haiku', 'fable', 'inherit']);

/** Cursor model tiers that have no Claude Code alias. */
const MODEL_ALIAS_MAP: Record<string, string> = {
  fast: 'sonnet',
  max: 'opus',
  auto: 'inherit',
  default: 'inherit',
};

export function mapAgentModel(value: string | undefined): { model?: string; warning?: string } {
  if (value === undefined) return {};
  const raw = stripQuotes(value).trim();
  if (!raw) return {};

  const lower = raw.toLowerCase();
  if (CLAUDE_MODEL_ALIASES.has(lower)) return { model: lower };
  if (lower.startsWith('claude-')) return { model: raw };

  const mapped = MODEL_ALIAS_MAP[lower];
  if (mapped) {
    return {
      model: mapped,
      warning: `model "${raw}" is not a Claude Code value; mapped to "${mapped}".`,
    };
  }

  return {
    warning: `model "${raw}" is not a Claude Code value and had no mapping; the field was dropped so the agent inherits the session model.`,
  };
}

/**
 * Convert a subagent definition to Claude Code format.
 *
 * The frontmatter block is edited in place rather than re-serialized: these
 * descriptions are long free text, and round-tripping them through a minimal
 * YAML writer risks corrupting them.
 */
export function convertAgent(content: string, agentName: string): ConversionResult {
  const parsed = parseFrontmatter(content);
  const warnings: string[] = [];

  if (parsed.raw === null) {
    return { content, warnings: [`${agentName}: no YAML frontmatter; copied unchanged.`] };
  }

  const { model, warning } = mapAgentModel(parsed.data.model);
  if (warning) warnings.push(`${agentName}: ${warning}`);

  const lines = parsed.raw.split(/\r?\n/);
  const rewritten: string[] = [];
  let replaced = false;

  for (const line of lines) {
    if (/^model[ \t]*:/.test(line)) {
      if (model) {
        rewritten.push(`model: ${model}`);
      }
      replaced = true;
      continue;
    }
    rewritten.push(line);
  }

  if (!replaced && model) {
    rewritten.push(`model: ${model}`);
  }

  const frontmatter = rewritten.join('\n').replace(/\n+$/, '');
  return { content: `---\n${frontmatter}\n---\n${parsed.body}`, warnings };
}

// ============================================================================
// Path references
// ============================================================================

/**
 * Rewrite `.cursor/` path references to `.claude/`.
 *
 * Applied to hook scripts and command bodies, which reference sibling
 * artifacts by path (for example `session-init.sh` listing `.cursor/commands`).
 */
export function rewriteCursorPaths(text: string): string {
  return text.replace(/\.cursor\//g, '.claude/');
}

// ============================================================================
// Hooks
// ============================================================================

export interface ClaudeHookEntry {
  type: 'command';
  command: string;
  timeout?: number;
}

export interface ClaudeHookGroup {
  matcher?: string;
  hooks: ClaudeHookEntry[];
}

export type ClaudeHookSettings = Record<string, ClaudeHookGroup[]>;

interface CursorHookEntry {
  command?: string;
  timeout?: number;
  matcher?: string;
}

/**
 * Cursor hook event -> Claude Code event plus the tool-name matcher that
 * reproduces the same trigger point.
 */
const HOOK_EVENT_MAP: Record<string, { event: string; matcher?: string }> = {
  sessionStart: { event: 'SessionStart' },
  beforeShellExecution: { event: 'PreToolUse', matcher: 'Bash' },
  afterShellExecution: { event: 'PostToolUse', matcher: 'Bash' },
  beforeReadFile: { event: 'PreToolUse', matcher: 'Read' },
  afterFileEdit: { event: 'PostToolUse', matcher: 'Write|Edit|MultiEdit|NotebookEdit' },
  beforeMCPExecution: { event: 'PreToolUse', matcher: 'mcp__.*' },
  stop: { event: 'Stop' },
};

/** Filename of the translation shim written into `.claude/hooks/`. */
export const ADAPTER_FILENAME = '_cursor-hook-adapter.sh';

/**
 * Build the command that runs a Cursor hook script under Claude Code.
 * `$CLAUDE_PROJECT_DIR` keeps the invocation independent of the process cwd.
 */
function adapterCommand(event: string, scriptRelativePath: string): string {
  const adapter = `"$CLAUDE_PROJECT_DIR"/.claude/hooks/${ADAPTER_FILENAME}`;
  const target = `"$CLAUDE_PROJECT_DIR"/.claude/${scriptRelativePath}`;
  return `${adapter} ${event} ${target}`;
}

/**
 * Convert a Cursor `hooks.json` into the `hooks` block of `.claude/settings.json`.
 */
export function convertCursorHooks(hooksJson: string): {
  hooks: ClaudeHookSettings;
  warnings: string[];
} {
  const warnings: string[] = [];
  let parsed: { hooks?: Record<string, CursorHookEntry[]> };

  try {
    parsed = JSON.parse(hooksJson);
  } catch (error) {
    return { hooks: {}, warnings: [`hooks.json could not be parsed: ${error}`] };
  }

  const source = parsed.hooks ?? {};
  const grouped = new Map<string, ClaudeHookGroup>();
  const result: ClaudeHookSettings = {};

  for (const [cursorEvent, entries] of Object.entries(source)) {
    const mapping = HOOK_EVENT_MAP[cursorEvent];
    if (!mapping) {
      warnings.push(`hooks.json: Cursor event "${cursorEvent}" has no Claude Code equivalent and was skipped.`);
      continue;
    }
    if (!Array.isArray(entries)) continue;

    for (const entry of entries) {
      if (!entry?.command) continue;

      const scriptRelativePath = entry.command.replace(/^\.?\/?\.cursor\//, '').replace(/^\.\//, '');

      if (entry.matcher && mapping.event === 'PreToolUse') {
        warnings.push(
          `hooks.json: "${cursorEvent}" matcher "${entry.matcher}" filters on command text, which Claude Code matchers cannot express. Bound to tool "${mapping.matcher}" instead — the script's own checks still apply.`
        );
      }

      const key = `${mapping.event}::${mapping.matcher ?? ''}`;
      let group = grouped.get(key);
      if (!group) {
        group = mapping.matcher ? { matcher: mapping.matcher, hooks: [] } : { hooks: [] };
        grouped.set(key, group);
        if (!result[mapping.event]) result[mapping.event] = [];
        result[mapping.event].push(group);
      }

      const hook: ClaudeHookEntry = {
        type: 'command',
        command: adapterCommand(mapping.event, scriptRelativePath),
      };
      if (typeof entry.timeout === 'number') hook.timeout = entry.timeout;
      group.hooks.push(hook);
    }
  }

  return { hooks: result, warnings };
}

/**
 * Merge generated hooks into an existing settings object.
 *
 * Previously generated groups are identified by their use of the adapter shim
 * and replaced, so reinstalling is idempotent and hand-written hooks survive.
 */
export function mergeHookSettings(
  existing: Record<string, unknown>,
  generated: ClaudeHookSettings
): Record<string, unknown> {
  const settings = { ...existing };
  const currentHooks = (settings.hooks as Record<string, ClaudeHookGroup[]> | undefined) ?? {};
  const mergedHooks: Record<string, ClaudeHookGroup[]> = {};

  const isGenerated = (group: ClaudeHookGroup): boolean =>
    Array.isArray(group?.hooks) &&
    group.hooks.length > 0 &&
    group.hooks.every((hook) => typeof hook?.command === 'string' && hook.command.includes(ADAPTER_FILENAME));

  for (const [event, groups] of Object.entries(currentHooks)) {
    const preserved = Array.isArray(groups) ? groups.filter((group) => !isGenerated(group)) : [];
    if (preserved.length) mergedHooks[event] = preserved;
  }

  for (const [event, groups] of Object.entries(generated)) {
    mergedHooks[event] = [...(mergedHooks[event] ?? []), ...groups];
  }

  if (Object.keys(mergedHooks).length) {
    settings.hooks = mergedHooks;
  } else {
    delete settings.hooks;
  }

  return settings;
}

/**
 * Translation shim between Claude Code's hook I/O and Cursor's.
 *
 * stdin   Claude Code                     -> Cursor
 *         .cwd                            -> .workspace_roots[0]
 *         .session_id                     -> .conversation_id
 *         .tool_input.command             -> .command
 *         .tool_input.file_path           -> .file_path
 *         .tool_input.{new_string,content,
 *                      edits,new_source}  -> .edits[]  (the scanners read this)
 *
 * stdout  Cursor                          -> Claude Code
 *         {additional_context}            -> {hookSpecificOutput.additionalContext}
 *         {permission, agent_message}     -> {hookSpecificOutput.permissionDecision, ...Reason}
 *         {agent_message} on PostToolUse  -> {hookSpecificOutput.additionalContext}
 *
 * Fails open: if jq is missing or the wrapped script errors, the shim exits 0
 * with no decision so a broken hook cannot wedge the session.
 */
export const CURSOR_HOOK_ADAPTER = `#!/usr/bin/env bash
# =============================================================================
# Cursor -> Claude Code hook adapter
#
# GENERATED by the ai-development MCP server. Do not edit; changes are
# overwritten on reinstall. Hook logic lives in the module sources.
#
# Usage: _cursor-hook-adapter.sh <ClaudeEventName> <path/to/cursor-hook.sh>
#
# Translates Claude Code's hook stdin into the shape Cursor hook scripts expect,
# runs the script unmodified, then translates its stdout back. Fails open.
# =============================================================================
set -uo pipefail

EVENT="\${1:-}"
TARGET="\${2:-}"

if [ -z "$EVENT" ] || [ -z "$TARGET" ] || [ ! -x "$TARGET" ]; then
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  # jq drives the translation and every wrapped script; without it, do nothing.
  exit 0
fi

input="$(cat)"

# --- Claude Code stdin -> Cursor stdin ---------------------------------------
# The .edits array matters: the secret and hygiene scanners inspect
# .edits[].new_string, so an empty array makes them silently pass everything.
cursor_input="$(printf '%s' "$input" | jq -c '
  (.tool_input // {}) as $ti
  | {
      conversation_id: (.session_id // ""),
      workspace_roots: (if (.cwd // "") == "" then [] else [.cwd] end),
      hook_event_name: (.hook_event_name // ""),
      tool_name: (.tool_name // ""),
      command: ($ti.command // ""),
      file_path: ($ti.file_path // $ti.notebook_path // ""),
      edits: (
        if ($ti.edits | type) == "array" then
          [ $ti.edits[] | { old_string: (.old_string // ""), new_string: (.new_string // "") } ]
        elif ($ti.new_string | type) == "string" then
          [ { old_string: ($ti.old_string // ""), new_string: $ti.new_string } ]
        elif ($ti.content | type) == "string" then
          [ { old_string: "", new_string: $ti.content } ]
        elif ($ti.new_source | type) == "string" then
          [ { old_string: "", new_string: $ti.new_source } ]
        else [] end
      )
    }' 2>/dev/null)"

if [ -z "$cursor_input" ]; then
  exit 0
fi

output="$(printf '%s' "$cursor_input" | "$TARGET" 2>/dev/null)"

if [ -z "$output" ]; then
  exit 0
fi

# --- Cursor stdout -> Claude Code stdout -------------------------------------
case "$EVENT" in
  SessionStart)
    printf '%s' "$output" | jq -c '
      if (.additional_context // "") == "" then {} else
        { hookSpecificOutput: {
            hookEventName: "SessionStart",
            additionalContext: .additional_context } }
      end' 2>/dev/null || true
    ;;
  PreToolUse)
    printf '%s' "$output" | jq -c '
      (.permission // "") as $p
      | if $p == "" then {} else
          { hookSpecificOutput: (
              { hookEventName: "PreToolUse",
                permissionDecision: (if $p == "approve" then "allow" else $p end) }
              + (if (.agent_message // .user_message // "") == "" then {}
                 else { permissionDecisionReason: (.agent_message // .user_message) } end)
            ) }
        end' 2>/dev/null || true
    ;;
  PostToolUse)
    # The scanners report findings via agent_message; surface it next to the
    # tool result so the model sees it. The tool has already run, so this is
    # advisory rather than blocking.
    printf '%s' "$output" | jq -c '
      ((.agent_message // .additional_context // "")) as $m
      | if $m == "" then {} else
          { hookSpecificOutput: {
              hookEventName: "PostToolUse",
              additionalContext: $m } }
        end' 2>/dev/null || true
    ;;
  *)
    # Stop and any future events: no actionable Cursor output to translate.
    ;;
esac

exit 0
`;
