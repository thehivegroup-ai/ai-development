/**
 * Claude Code installer
 *
 * Takes the same composed module tree that `writeModules` installs into
 * `.cursor/` and projects it into `.claude/`, applying the format conversions in
 * ../converters/claude-code.ts.
 *
 * Reusing the composed tree means module selection, dependency resolution,
 * priority ordering and collision handling behave identically on both platforms.
 *
 * Note: this direction is one-way. `push_module_updates` reads `.cursor/` via the
 * sync manifest, so edits made under `.claude/` are not published back to the
 * module sources.
 */

import { mkdir, writeFile, readFile, rm, chmod } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { ComposedModule } from '../types.js';
import {
  ADAPTER_FILENAME,
  CURSOR_HOOK_ADAPTER,
  convertAgent,
  convertCursorHooks,
  convertRule,
  mergeHookSettings,
  rewriteCursorPaths,
} from '../converters/claude-code.js';

export interface ClaudeInstallPlanEntry {
  /** Path relative to the project root. */
  target: string;
  /** Path within the composed tree that produced it, when applicable. */
  source?: string;
  kind: 'rule' | 'skill' | 'agent' | 'command' | 'hook-script' | 'settings' | 'adapter' | 'memory';
  /** File content, or null for a generated-later artifact. */
  content: string;
  executable?: boolean;
}

export interface ClaudeInstallPlan {
  entries: ClaudeInstallPlanEntry[];
  /** Composed files intentionally not installed, with the reason. */
  skipped: { source: string; reason: string }[];
  warnings: string[];
}

/** Files that exist in the module tree but are not Claude Code artifacts. */
const SKIP_EXACT = new Set([
  'module.json',
  'README.md',
  'HOOKS-README.md',
  'hooks.consolidated.json',
  '.DS_Store',
]);

const SKIP_PREFIXES = ['docs/', '.githooks/', 'scripts/'];

function isSkipped(path: string): string | null {
  if (SKIP_EXACT.has(path)) return 'not a Claude Code artifact';
  if (basename(path) === '.DS_Store') return 'not a Claude Code artifact';
  for (const prefix of SKIP_PREFIXES) {
    if (path.startsWith(prefix)) return `\`${prefix}\` is documentation/tooling, not a Claude Code artifact`;
  }
  return null;
}

/**
 * Build the `.claude/` file plan from a composed module tree.
 */
export function planClaudeInstall(composed: ComposedModule): ClaudeInstallPlan {
  const entries: ClaudeInstallPlanEntry[] = [];
  const skipped: { source: string; reason: string }[] = [];
  const warnings: string[] = [];

  // Modules that contributed at least one rule; their instructions.md is a
  // prose restatement of those rules and would duplicate context.
  const modulesWithRules = new Set<string>();
  for (const [path, file] of composed.files) {
    if (path.startsWith('rules/') && path.endsWith('.mdc')) {
      modulesWithRules.add(file.sourceModule);
    }
  }

  let cursorHooks: { path: string; content: string } | null = null;

  for (const [path, file] of composed.files) {
    const skipReason = isSkipped(path);
    if (skipReason) {
      skipped.push({ source: path, reason: skipReason });
      continue;
    }

    // ---- rules -------------------------------------------------------------
    if (path.startsWith('rules/')) {
      if (!path.endsWith('.mdc')) {
        skipped.push({ source: path, reason: 'not a .mdc rule' });
        continue;
      }
      const name = basename(path, '.mdc');
      const { content, warnings: ruleWarnings } = convertRule(file.content, name);
      warnings.push(...ruleWarnings);
      entries.push({
        target: join('.claude', 'rules', `${name}.md`),
        source: path,
        kind: 'rule',
        content,
      });
      continue;
    }

    // ---- skills ------------------------------------------------------------
    if (path.startsWith('skills/')) {
      // Skills are portable across both platforms; only path references change.
      entries.push({
        target: join('.claude', path),
        source: path,
        kind: 'skill',
        content: rewriteCursorPaths(file.content),
      });
      continue;
    }

    // ---- agents ------------------------------------------------------------
    if (path.startsWith('agents/') && path.endsWith('.md')) {
      const name = basename(path, '.md');
      const { content, warnings: agentWarnings } = convertAgent(file.content, name);
      warnings.push(...agentWarnings);
      entries.push({
        target: join('.claude', path),
        source: path,
        kind: 'agent',
        content: rewriteCursorPaths(content),
      });
      continue;
    }

    // ---- commands ----------------------------------------------------------
    if (path.startsWith('commands/') && path.endsWith('.md')) {
      entries.push({
        target: join('.claude', path),
        source: path,
        kind: 'command',
        content: rewriteCursorPaths(file.content),
      });
      continue;
    }

    // ---- hook scripts ------------------------------------------------------
    if (path.startsWith('hooks/')) {
      entries.push({
        target: join('.claude', path),
        source: path,
        kind: 'hook-script',
        // Scripts reference sibling artifacts by path (e.g. `.cursor/commands`).
        content: rewriteCursorPaths(file.content),
        executable: path.endsWith('.sh'),
      });
      continue;
    }

    // ---- hooks.json --------------------------------------------------------
    if (path === 'hooks.json') {
      cursorHooks = { path, content: file.content };
      continue;
    }

    // ---- base instructions -------------------------------------------------
    if (path === 'instructions.md') {
      if (modulesWithRules.has(file.sourceModule)) {
        skipped.push({
          source: path,
          reason: `superseded by the rules from \`${file.sourceModule}\`, which install into .claude/rules/`,
        });
      } else {
        entries.push({
          target: join('.claude', 'rules', '00-base-instructions.md'),
          source: path,
          kind: 'rule',
          content: rewriteCursorPaths(file.content),
        });
      }
      continue;
    }

    skipped.push({ source: path, reason: 'no Claude Code equivalent' });
  }

  // ---- hooks -> settings.json ---------------------------------------------
  if (cursorHooks) {
    const { hooks, warnings: hookWarnings } = convertCursorHooks(cursorHooks.content);
    warnings.push(...hookWarnings);

    if (Object.keys(hooks).length > 0) {
      entries.push({
        target: join('.claude', 'hooks', ADAPTER_FILENAME),
        kind: 'adapter',
        content: CURSOR_HOOK_ADAPTER,
        executable: true,
      });
      // Serialized during write, once existing settings are known.
      entries.push({
        target: join('.claude', 'settings.json'),
        source: cursorHooks.path,
        kind: 'settings',
        content: JSON.stringify({ hooks }, null, 2),
      });
    }
  }

  entries.sort((a, b) => a.target.localeCompare(b.target));
  skipped.sort((a, b) => a.source.localeCompare(b.source));

  return { entries, skipped, warnings };
}

/**
 * Write a planned `.claude/` install to disk.
 *
 * `settings.json` is merged rather than overwritten so hand-written settings
 * (permissions, env, model) survive. In `overwrite` mode the generated artifact
 * directories are cleared, but `settings.json` is still merged.
 */
export async function writeClaudeEnvironment(
  projectPath: string,
  plan: ClaudeInstallPlan,
  mode: 'merge' | 'overwrite'
): Promise<{ written: string[] }> {
  const written: string[] = [];

  if (mode === 'overwrite') {
    for (const dir of ['rules', 'skills', 'agents', 'commands', 'hooks']) {
      await rm(join(projectPath, '.claude', dir), { recursive: true, force: true });
    }
  }

  for (const entry of plan.entries) {
    const fullPath = join(projectPath, entry.target);
    await mkdir(dirname(fullPath), { recursive: true });

    if (entry.kind === 'settings') {
      const generated = JSON.parse(entry.content) as { hooks: Record<string, never> };
      let existing: Record<string, unknown> = {};
      try {
        existing = JSON.parse(await readFile(fullPath, 'utf-8'));
      } catch {
        // No existing settings, or unreadable — start from empty.
      }
      const merged = mergeHookSettings(existing, generated.hooks);
      await writeFile(fullPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8');
    } else {
      await writeFile(fullPath, entry.content, 'utf-8');
    }

    if (entry.executable) {
      await chmod(fullPath, 0o755);
    }

    written.push(entry.target);
  }

  return { written };
}

/**
 * Summary counts for tool output.
 */
export function summarizeClaudePlan(plan: ClaudeInstallPlan): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of plan.entries) {
    counts[entry.kind] = (counts[entry.kind] ?? 0) + 1;
  }
  return counts;
}
