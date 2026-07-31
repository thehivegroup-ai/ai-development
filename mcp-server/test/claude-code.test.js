/**
 * Tests for the Claude Code converters.
 * Run: npm test  (from mcp-server/, after npm run build)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ADAPTER_FILENAME,
  convertAgent,
  convertCursorHooks,
  convertRule,
  mapAgentModel,
  mergeHookSettings,
  parseFrontmatter,
  rewriteCursorPaths,
  splitPatternList,
  yamlQuote,
} from '../dist/converters/claude-code.js';

// ============================================================================
// splitPatternList — brace-aware splitting
// ============================================================================

test('splitPatternList splits on top-level commas', () => {
  assert.deepEqual(splitPatternList('**/*.tsx,**/*.jsx'), ['**/*.tsx', '**/*.jsx']);
});

test('splitPatternList keeps brace groups intact', () => {
  // The real failure mode: a naive comma split turns `*.{ts,js}` into `*.{ts` + `js}`.
  assert.deepEqual(splitPatternList('**/infra/**/*.{ts,js},**/terraform/**/*.tf'), [
    '**/infra/**/*.{ts,js}',
    '**/terraform/**/*.tf',
  ]);
});

test('splitPatternList handles the real GCP rule value', () => {
  const raw = '"**/infra/**/*.{ts,js},**/terraform/**/*.tf,**/cloudbuild.yaml,**/gcp/**/*.{yaml,yml},**/k8s/**/*.yaml"';
  assert.deepEqual(splitPatternList(raw), [
    '**/infra/**/*.{ts,js}',
    '**/terraform/**/*.tf',
    '**/cloudbuild.yaml',
    '**/gcp/**/*.{yaml,yml}',
    '**/k8s/**/*.yaml',
  ]);
});

test('splitPatternList strips surrounding quotes and blank entries', () => {
  assert.deepEqual(splitPatternList('"a,  b ,,c"'), ['a', 'b', 'c']);
});

test('splitPatternList clamps depth so a stray } does not disable later splits', () => {
  // Without clamping at zero, the stray `}` would leave depth at -1 and every
  // subsequent comma would stop separating patterns.
  assert.deepEqual(splitPatternList('a},b'), ['a}', 'b']);
});

test('splitPatternList treats commas inside a group as literal', () => {
  assert.deepEqual(splitPatternList('a{b,c},d'), ['a{b,c}', 'd']);
});

// ============================================================================
// yamlQuote — globs starting with * would otherwise be YAML aliases
// ============================================================================

test('yamlQuote quotes glob patterns and escapes quotes/backslashes', () => {
  assert.equal(yamlQuote('**/*.ts'), '"**/*.ts"');
  assert.equal(yamlQuote('a"b'), '"a\\"b"');
  assert.equal(yamlQuote('a\\b'), '"a\\\\b"');
});

// ============================================================================
// parseFrontmatter
// ============================================================================

test('parseFrontmatter reads scalars and strips quotes', () => {
  const { data, body } = parseFrontmatter('---\ndescription: "Hi there."\nalwaysApply: true\n---\n\n# Body\n');
  assert.equal(data.description, 'Hi there.');
  assert.equal(data.alwaysApply, 'true');
  assert.equal(body.trim(), '# Body');
});

test('parseFrontmatter folds multi-line block scalars', () => {
  const content = [
    '---',
    'name: security-review',
    'description: >',
    '  Deep security analysis for PHI.',
    '  Produces threat models.',
    'version: 1.0.0',
    '---',
    '',
    'body',
  ].join('\n');
  const { data } = parseFrontmatter(content);
  assert.equal(data.description, 'Deep security analysis for PHI. Produces threat models.');
  assert.equal(data.version, '1.0.0');
  assert.equal(data.name, 'security-review');
});

test('parseFrontmatter reads YAML sequences', () => {
  const { lists } = parseFrontmatter('---\npaths:\n  - "src/**/*.ts"\n  - "lib/**"\n---\nbody');
  assert.deepEqual(lists.paths, ['src/**/*.ts', 'lib/**']);
});

test('parseFrontmatter returns whole document as body when no frontmatter', () => {
  const { raw, body } = parseFrontmatter('# Just markdown\n');
  assert.equal(raw, null);
  assert.equal(body, '# Just markdown\n');
});

test('parseFrontmatter does not treat a mid-document --- as frontmatter', () => {
  const { raw } = parseFrontmatter('# Title\n\n---\n\nnot frontmatter\n');
  assert.equal(raw, null);
});

// ============================================================================
// convertRule
// ============================================================================

test('convertRule: alwaysApply true emits no frontmatter so it always loads', () => {
  const mdc = '---\ndescription: "Foundational constraints."\nalwaysApply: true\n---\n\n# Foundation\n\n- Do the thing\n';
  const { content, warnings } = convertRule(mdc, '00-std-foundation');
  assert.ok(!content.startsWith('---'), 'should have no frontmatter');
  assert.match(content, /^> Foundational constraints\./);
  assert.match(content, /# Foundation/);
  assert.deepEqual(warnings, []);
});

test('convertRule: globs become a quoted paths list', () => {
  const mdc = '---\ndescription: "Cloud rules."\nglobs: "**/infra/**/*.{ts,js},**/*.tf"\nalwaysApply: false\n---\n\n# Cloud\n';
  const { content, warnings } = convertRule(mdc, '50-cloud-aws');
  assert.match(content, /^---\npaths:\n  - "\*\*\/infra\/\*\*\/\*\.\{ts,js\}"\n  - "\*\*\/\*\.tf"\n---\n/);
  assert.match(content, /> Cloud rules\./);
  assert.deepEqual(warnings, []);
});

test('convertRule: generated paths round-trip back to the same patterns', () => {
  const patterns = '**/*.tsx,**/infra/**/*.{ts,js},**/k8s/**/*.yaml';
  const mdc = `---\ndescription: "x"\nglobs: "${patterns}"\nalwaysApply: false\n---\n\nbody\n`;
  const { content } = convertRule(mdc, 'r');
  const { lists } = parseFrontmatter(content);
  assert.deepEqual(lists.paths, splitPatternList(patterns));
});

test('convertRule: alwaysApply true with globs drops the globs and warns', () => {
  const mdc = '---\ndescription: "d"\nglobs: "**/*.ts"\nalwaysApply: true\n---\n\nbody\n';
  const { content, warnings } = convertRule(mdc, 'weird-rule');
  assert.ok(!content.startsWith('---'));
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /alwaysApply is true/);
});

test('convertRule: neither alwaysApply nor globs warns about the semantic change', () => {
  const mdc = '---\ndescription: "d"\nalwaysApply: false\n---\n\nbody\n';
  const { content, warnings } = convertRule(mdc, 'agent-requested');
  assert.ok(!content.startsWith('---'));
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /loads in every session/);
});

test('convertRule: accepts yes/on as truthy alwaysApply', () => {
  for (const value of ['yes', 'On', '1', 'TRUE']) {
    const { warnings } = convertRule(`---\ndescription: "d"\nalwaysApply: ${value}\n---\nbody\n`, 'r');
    assert.deepEqual(warnings, [], `expected ${value} to be truthy`);
  }
});

test('convertRule: preserves rule body verbatim', () => {
  const body = '# Title\n\n- **Bold** item with `code`\n\n```ts\nconst a: number = 1;\n```\n';
  const { content } = convertRule(`---\ndescription: "d"\nalwaysApply: true\n---\n\n${body}`, 'r');
  assert.ok(content.includes(body.trim()), 'body should survive unchanged');
});

// ============================================================================
// mapAgentModel / convertAgent
// ============================================================================

test('mapAgentModel maps Cursor tiers to Claude Code values', () => {
  assert.equal(mapAgentModel('fast').model, 'sonnet');
  assert.equal(mapAgentModel('max').model, 'opus');
  assert.equal(mapAgentModel('inherit').model, 'inherit');
  assert.equal(mapAgentModel('sonnet').model, 'sonnet');
  assert.equal(mapAgentModel('haiku').model, 'haiku');
  assert.equal(mapAgentModel('claude-opus-5').model, 'claude-opus-5');
});

test('mapAgentModel warns when remapping', () => {
  assert.match(mapAgentModel('fast').warning, /mapped to "sonnet"/);
});

test('mapAgentModel drops unknown values so the agent inherits', () => {
  const result = mapAgentModel('gpt-4o');
  assert.equal(result.model, undefined);
  assert.match(result.warning, /dropped/);
});

test('mapAgentModel ignores absent/empty values', () => {
  assert.deepEqual(mapAgentModel(undefined), {});
  assert.deepEqual(mapAgentModel('  '), {});
});

test('convertAgent rewrites model and preserves the description verbatim', () => {
  const description =
    'Planning specialist that validates outcome-task alignment. Use when: validating plans, checking tasks align, or before implementation.';
  const md = `---\nname: std-planner\ndescription: ${description}\nmodel: fast\n---\n\n# Standard Planner\n\nYou are a specialist.\n`;
  const { content, warnings } = convertAgent(md, 'std-planner');

  assert.match(content, /^---\n/);
  assert.match(content, /^model: sonnet$/m);
  assert.ok(!/model: fast/.test(content));
  // The description contains colons; it must not be re-serialized or truncated.
  assert.ok(content.includes(`description: ${description}`));
  assert.match(content, /# Standard Planner/);
  assert.equal(warnings.length, 1);

  // And the result must still parse as frontmatter.
  const { data } = parseFrontmatter(content);
  assert.equal(data.name, 'std-planner');
  assert.equal(data.model, 'sonnet');
});

test('convertAgent leaves a valid model untouched and emits no warning', () => {
  const md = '---\nname: a\ndescription: d\nmodel: inherit\n---\n\nbody\n';
  const { content, warnings } = convertAgent(md, 'a');
  assert.match(content, /^model: inherit$/m);
  assert.deepEqual(warnings, []);
});

test('convertAgent removes the model line entirely when unmappable', () => {
  const md = '---\nname: a\ndescription: d\nmodel: gpt-4o\n---\n\nbody\n';
  const { content } = convertAgent(md, 'a');
  assert.ok(!/^model:/m.test(content), 'model line should be gone');
  assert.match(content, /^name: a$/m);
});

test('convertAgent passes through a file with no frontmatter', () => {
  const md = '# Just a doc\n';
  const { content, warnings } = convertAgent(md, 'a');
  assert.equal(content, md);
  assert.equal(warnings.length, 1);
});

// ============================================================================
// rewriteCursorPaths
// ============================================================================

test('rewriteCursorPaths retargets .cursor/ references', () => {
  assert.equal(
    rewriteCursorPaths('if [ -d "$workspace/.cursor/commands" ]; then'),
    'if [ -d "$workspace/.claude/commands" ]; then'
  );
});

// ============================================================================
// convertCursorHooks
// ============================================================================

const REAL_HOOKS = JSON.stringify({
  version: 1,
  hooks: {
    sessionStart: [{ command: '.cursor/hooks/session-init.sh', timeout: 5 }],
    beforeShellExecution: [{ command: '.cursor/hooks/git-guard.sh', matcher: 'git' }],
    afterFileEdit: [
      { command: '.cursor/hooks/auto-format.sh', timeout: 10 },
      { command: '.cursor/hooks/secrets-scanner.sh', timeout: 5 },
    ],
  },
});

test('convertCursorHooks maps events to Claude Code events and matchers', () => {
  const { hooks } = convertCursorHooks(REAL_HOOKS);

  assert.deepEqual(Object.keys(hooks).sort(), ['PostToolUse', 'PreToolUse', 'SessionStart']);

  // SessionStart takes no tool matcher.
  assert.equal(hooks.SessionStart.length, 1);
  assert.equal(hooks.SessionStart[0].matcher, undefined);

  // beforeShellExecution -> PreToolUse on Bash
  assert.equal(hooks.PreToolUse[0].matcher, 'Bash');

  // afterFileEdit -> PostToolUse on the edit tools
  assert.equal(hooks.PostToolUse[0].matcher, 'Write|Edit|MultiEdit|NotebookEdit');
});

test('convertCursorHooks groups hooks sharing an event+matcher', () => {
  const { hooks } = convertCursorHooks(REAL_HOOKS);
  assert.equal(hooks.PostToolUse.length, 1, 'one matcher group');
  assert.equal(hooks.PostToolUse[0].hooks.length, 2, 'both scripts in it');
});

test('convertCursorHooks routes scripts through the adapter with $CLAUDE_PROJECT_DIR', () => {
  const { hooks } = convertCursorHooks(REAL_HOOKS);
  const entry = hooks.SessionStart[0].hooks[0];
  assert.equal(entry.type, 'command');
  assert.ok(entry.command.includes(ADAPTER_FILENAME), 'goes through the adapter');
  assert.ok(entry.command.includes('SessionStart'), 'adapter is told the event');
  assert.ok(entry.command.includes('.claude/hooks/session-init.sh'), 'points at the installed script');
  assert.ok(!entry.command.includes('.cursor/'), 'no .cursor/ paths remain');
  assert.ok(entry.command.includes('$CLAUDE_PROJECT_DIR'), 'cwd-independent');
  assert.equal(entry.timeout, 5, 'timeout preserved (both use seconds)');
});

test('convertCursorHooks warns that a command-text matcher cannot be expressed', () => {
  const { warnings } = convertCursorHooks(REAL_HOOKS);
  assert.ok(
    warnings.some((w) => /matcher "git"/.test(w) && /tool "Bash"/.test(w)),
    `expected a matcher warning, got: ${JSON.stringify(warnings)}`
  );
});

test('convertCursorHooks skips unknown Cursor events with a warning', () => {
  const { hooks, warnings } = convertCursorHooks(
    JSON.stringify({ hooks: { someFutureEvent: [{ command: '.cursor/hooks/x.sh' }] } })
  );
  assert.deepEqual(hooks, {});
  assert.ok(warnings.some((w) => /someFutureEvent/.test(w)));
});

test('convertCursorHooks reports malformed JSON instead of throwing', () => {
  const { hooks, warnings } = convertCursorHooks('{not json');
  assert.deepEqual(hooks, {});
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /could not be parsed/);
});

test('convertCursorHooks omits timeout when the source has none', () => {
  const { hooks } = convertCursorHooks(
    JSON.stringify({ hooks: { beforeShellExecution: [{ command: '.cursor/hooks/g.sh' }] } })
  );
  assert.equal(hooks.PreToolUse[0].hooks[0].timeout, undefined);
});

// ============================================================================
// mergeHookSettings
// ============================================================================

test('mergeHookSettings preserves unrelated settings keys', () => {
  const existing = { permissions: { allow: ['Bash(npm test)'] }, model: 'opus' };
  const merged = mergeHookSettings(existing, { SessionStart: [{ hooks: [{ type: 'command', command: `x/${ADAPTER_FILENAME} SessionStart y` }] }] });
  assert.deepEqual(merged.permissions, { allow: ['Bash(npm test)'] });
  assert.equal(merged.model, 'opus');
  assert.equal(merged.hooks.SessionStart.length, 1);
});

test('mergeHookSettings keeps hand-written hooks and replaces generated ones', () => {
  const handWritten = { matcher: 'Bash', hooks: [{ type: 'command', command: './my-own-hook.sh' }] };
  const generatedOld = {
    matcher: 'Bash',
    hooks: [{ type: 'command', command: `"$CLAUDE_PROJECT_DIR"/.claude/hooks/${ADAPTER_FILENAME} PreToolUse old.sh` }],
  };
  const existing = { hooks: { PreToolUse: [handWritten, generatedOld] } };

  const generatedNew = {
    PreToolUse: [
      {
        matcher: 'Bash',
        hooks: [{ type: 'command', command: `"$CLAUDE_PROJECT_DIR"/.claude/hooks/${ADAPTER_FILENAME} PreToolUse new.sh` }],
      },
    ],
  };

  const merged = mergeHookSettings(existing, generatedNew);
  const commands = merged.hooks.PreToolUse.flatMap((g) => g.hooks.map((h) => h.command));
  assert.ok(commands.includes('./my-own-hook.sh'), 'hand-written hook survives');
  assert.ok(commands.some((c) => c.includes('new.sh')), 'new generated hook present');
  assert.ok(!commands.some((c) => c.includes('old.sh')), 'stale generated hook removed');
});

test('mergeHookSettings is idempotent across repeated installs', () => {
  const generated = {
    PostToolUse: [
      {
        matcher: 'Write|Edit',
        hooks: [{ type: 'command', command: `"$CLAUDE_PROJECT_DIR"/.claude/hooks/${ADAPTER_FILENAME} PostToolUse fmt.sh` }],
      },
    ],
  };
  const once = mergeHookSettings({}, generated);
  const twice = mergeHookSettings(once, generated);
  assert.deepEqual(twice, once);
});

test('mergeHookSettings drops the hooks key when nothing remains', () => {
  const merged = mergeHookSettings({ hooks: {} }, {});
  assert.equal('hooks' in merged, false);
});
