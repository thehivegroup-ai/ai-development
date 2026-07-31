/**
 * Tests for the generated Cursor -> Claude Code hook adapter shim.
 *
 * The shim is bash, so it is written to a temp dir and driven with real
 * Claude Code hook payloads against stub Cursor hook scripts.
 *
 * Skipped automatically when jq is unavailable (the shim requires it).
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, chmod, rm } from 'fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { CURSOR_HOOK_ADAPTER } from '../dist/converters/claude-code.js';

let hasJq = true;
try {
  execFileSync('jq', ['--version'], { stdio: 'ignore' });
} catch {
  hasJq = false;
}

let dir;
let adapter;

before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'hook-adapter-'));
  adapter = join(dir, 'adapter.sh');
  await writeFile(adapter, CURSOR_HOOK_ADAPTER, 'utf-8');
  await chmod(adapter, 0o755);
});

after(async () => {
  if (dir) await rm(dir, { recursive: true, force: true });
});

/** Write an executable stub Cursor hook that echoes fixed JSON. */
async function stub(name, bodyScript) {
  const path = join(dir, name);
  await writeFile(path, `#!/usr/bin/env bash\n${bodyScript}\n`, 'utf-8');
  await chmod(path, 0o755);
  return path;
}

/**
 * Run the adapter with the given stdin and return trimmed stdout.
 * Sync execution keeps stdin closing well-defined.
 */
function invoke(args, stdin) {
  return execFileSync(adapter, args, {
    input: stdin,
    encoding: 'utf-8',
    timeout: 10_000,
  }).trim();
}

/** Run the adapter against a payload object. */
function run(event, target, payload) {
  return invoke([event, target], JSON.stringify(payload));
}

// ============================================================================
// stdin translation
// ============================================================================

test('maps Claude Code stdin fields onto the Cursor shape', { skip: !hasJq }, async () => {
  // Echo back what the wrapped script actually received.
  const target = await stub('echo.sh', 'cat | jq -c "{c: .conversation_id, w: .workspace_roots[0], cmd: .command, f: .file_path}" | jq -Rs "{additional_context: .}"');

  const out = await run('SessionStart', target, {
    session_id: 'sess-1',
    cwd: '/proj',
    hook_event_name: 'SessionStart',
    tool_name: 'Bash',
    tool_input: { command: 'ls', file_path: '/proj/a.ts' },
  });

  const parsed = JSON.parse(out);
  const seen = JSON.parse(parsed.hookSpecificOutput.additionalContext);
  assert.equal(seen.c, 'sess-1', 'session_id -> conversation_id');
  assert.equal(seen.w, '/proj', 'cwd -> workspace_roots[0]');
  assert.equal(seen.cmd, 'ls', 'tool_input.command -> command');
  assert.equal(seen.f, '/proj/a.ts', 'tool_input.file_path -> file_path');
});

test('builds .edits from an Edit tool payload', { skip: !hasJq }, async () => {
  // Mirrors how secrets-scanner.sh reads the edited code.
  const target = await stub('edits.sh', 'cat | jq -r "[.edits[].new_string] | join(\\"|\\")" | jq -Rs "{agent_message: .}"');

  const out = await run('PostToolUse', target, {
    hook_event_name: 'PostToolUse',
    tool_name: 'Edit',
    tool_input: { file_path: '/p/a.ts', old_string: 'a', new_string: 'const KEY = "x"' },
  });

  assert.match(JSON.parse(out).hookSpecificOutput.additionalContext, /const KEY = "x"/);
});

test('builds .edits from a Write tool payload', { skip: !hasJq }, async () => {
  const target = await stub('editsw.sh', 'cat | jq -r "[.edits[].new_string] | join(\\"|\\")" | jq -Rs "{agent_message: .}"');

  const out = await run('PostToolUse', target, {
    hook_event_name: 'PostToolUse',
    tool_name: 'Write',
    tool_input: { file_path: '/p/a.ts', content: 'file body here' },
  });

  assert.match(JSON.parse(out).hookSpecificOutput.additionalContext, /file body here/);
});

test('builds .edits from a MultiEdit payload preserving each edit', { skip: !hasJq }, async () => {
  const target = await stub('editsm.sh', 'cat | jq -r "[.edits[].new_string] | join(\\"|\\")" | jq -Rs "{agent_message: .}"');

  const out = await run('PostToolUse', target, {
    hook_event_name: 'PostToolUse',
    tool_name: 'MultiEdit',
    tool_input: {
      file_path: '/p/a.ts',
      edits: [
        { old_string: 'a', new_string: 'first' },
        { old_string: 'b', new_string: 'second' },
      ],
    },
  });

  const context = JSON.parse(out).hookSpecificOutput.additionalContext;
  assert.match(context, /first\|second/);
});

// ============================================================================
// stdout translation
// ============================================================================

test('SessionStart: additional_context becomes additionalContext', { skip: !hasJq }, async () => {
  const target = await stub('ctx.sh', `cat >/dev/null; echo '{"additional_context":"# Project Context"}'`);
  const out = await run('SessionStart', target, { hook_event_name: 'SessionStart', cwd: '/p' });
  assert.deepEqual(JSON.parse(out), {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: '# Project Context',
    },
  });
});

test('SessionStart: empty {} yields no decision', { skip: !hasJq }, async () => {
  const target = await stub('empty.sh', `cat >/dev/null; echo '{}'`);
  const out = await run('SessionStart', target, { hook_event_name: 'SessionStart', cwd: '/p' });
  assert.deepEqual(JSON.parse(out), {});
});

test('PreToolUse: deny carries the agent message as the reason', { skip: !hasJq }, async () => {
  const target = await stub('deny.sh', `cat >/dev/null; echo '{"permission":"deny","agent_message":"Blocked by policy"}'`);
  const out = await run('PreToolUse', target, {
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'git push' },
  });
  assert.deepEqual(JSON.parse(out), {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: 'Blocked by policy',
    },
  });
});

test('PreToolUse: allow needs no reason', { skip: !hasJq }, async () => {
  const target = await stub('allow.sh', `cat >/dev/null; echo '{"permission":"allow"}'`);
  const out = await run('PreToolUse', target, {
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command: 'ls' },
  });
  assert.deepEqual(JSON.parse(out), {
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow' },
  });
});

test('PreToolUse: Cursor "approve" normalizes to Claude "allow"', { skip: !hasJq }, async () => {
  const target = await stub('approve.sh', `cat >/dev/null; echo '{"permission":"approve"}'`);
  const out = await run('PreToolUse', target, { hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: {} });
  assert.equal(JSON.parse(out).hookSpecificOutput.permissionDecision, 'allow');
});

test('PreToolUse: ask is passed through', { skip: !hasJq }, async () => {
  const target = await stub('ask.sh', `cat >/dev/null; echo '{"permission":"ask","agent_message":"Confirm"}'`);
  const out = await run('PreToolUse', target, { hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: {} });
  assert.equal(JSON.parse(out).hookSpecificOutput.permissionDecision, 'ask');
});

test('PostToolUse: agent_message surfaces as additionalContext', { skip: !hasJq }, async () => {
  const target = await stub('warn.sh', `cat >/dev/null; echo '{"agent_message":"Potential secret detected"}'`);
  const out = await run('PostToolUse', target, {
    hook_event_name: 'PostToolUse',
    tool_name: 'Edit',
    tool_input: { file_path: '/p/a.ts', new_string: 'x' },
  });
  assert.deepEqual(JSON.parse(out), {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: 'Potential secret detected',
    },
  });
});

test('PostToolUse: clean result produces no context', { skip: !hasJq }, async () => {
  const target = await stub('clean.sh', `cat >/dev/null; echo '{}'`);
  const out = await run('PostToolUse', target, {
    hook_event_name: 'PostToolUse',
    tool_name: 'Edit',
    tool_input: { file_path: '/p/a.ts', new_string: 'x' },
  });
  assert.deepEqual(JSON.parse(out), {});
});

// ============================================================================
// Fail-open behaviour — a broken hook must never wedge the session
// ============================================================================

test('fails open when the wrapped script exits non-zero', { skip: !hasJq }, async () => {
  const target = await stub('fail.sh', 'cat >/dev/null; exit 3');
  const out = invoke(['PreToolUse', target], JSON.stringify({ hook_event_name: 'PreToolUse', tool_input: {} }));
  assert.equal(out, '', 'no decision emitted');
});

test('fails open when the wrapped script emits garbage', { skip: !hasJq }, async () => {
  const target = await stub('garbage.sh', `cat >/dev/null; echo 'not json at all'`);
  const out = invoke(['PreToolUse', target], JSON.stringify({ hook_event_name: 'PreToolUse', tool_input: {} }));
  assert.equal(out, '');
});

test('fails open when the target does not exist', { skip: !hasJq }, () => {
  assert.equal(invoke(['PreToolUse', join(dir, 'nope.sh')], '{}'), '');
});

test('fails open with no arguments', { skip: !hasJq }, () => {
  assert.equal(invoke([], '{}'), '');
});

test('handles malformed stdin without crashing', { skip: !hasJq }, async () => {
  const target = await stub('ok.sh', `cat >/dev/null; echo '{"permission":"allow"}'`);
  assert.equal(invoke(['PreToolUse', target], 'not json'), '', 'unparseable input yields no decision');
});

test('preserves multi-line and quoted content through translation', { skip: !hasJq }, async () => {
  const target = await stub('multi.sh', `cat >/dev/null; printf '%s' '{"agent_message":"line one\\nline \\"two\\""}'`);
  const out = await run('PostToolUse', target, {
    hook_event_name: 'PostToolUse',
    tool_name: 'Edit',
    tool_input: { new_string: 'x' },
  });
  assert.equal(JSON.parse(out).hookSpecificOutput.additionalContext, 'line one\nline "two"');
});
