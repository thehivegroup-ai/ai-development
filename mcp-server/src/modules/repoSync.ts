/**
 * Push edits from a project .cursor/ into a local ai-development clone, then git commit/push.
 * Pull latest from that clone and refresh the project's .cursor/ from that tree.
 */

import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import { dirname, join, resolve, relative } from 'path';
import simpleGit from 'simple-git';
import { resolveModuleSource, getGitHeadSha } from '../git/sourceResolver.js';
import { readLockfile, readStackProfile, writeLockfile } from './installer.js';
import { readSyncManifest, SYNC_MANIFEST_FILENAME } from './syncManifest.js';
import { scanModules, findModule } from './scanner.js';
import type { ModuleMetadata } from '../types.js';
import { resolveSelection, composeModules } from './composer.js';
import { resolveDependencies, validateDependencies } from './dependencies.js';
import { writeInstalledEnvironment } from './syncManifest.js';

function ensureUnderRoot(filePath: string, root: string): void {
  const absFile = resolve(filePath);
  const absRoot = resolve(root);
  const rel = relative(absRoot, absFile);
  if (rel.startsWith('..') || rel.includes('..')) {
    throw new Error(`Path escapes repository root: ${filePath}`);
  }
}

async function isDirectory(p: string): Promise<boolean> {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

/** Normalize a path relative to `.cursor/` (from user input). */
export function normalizeCursorRelativePath(p: string): string {
  return p
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\.cursor\//, '');
}

/**
 * If patterns is non-empty, path must match exactly or be under a pattern as a path prefix
 * (e.g. `skills/foo` matches `skills/foo/SKILL.md` and `skills/foo/ref.md`).
 */
export function matchesOnlyPatterns(cursorRelativePath: string, patterns: string[]): boolean {
  if (patterns.length === 0) return true;
  const n = cursorRelativePath.replace(/\\/g, '/');
  for (const raw of patterns) {
    const pat = normalizeCursorRelativePath(raw);
    if (!pat) continue;
    if (n === pat) return true;
    if (n.startsWith(pat + '/')) return true;
  }
  return false;
}

/**
 * All files under .cursor/skills/ as paths relative to .cursor (posix, e.g. skills/foo/SKILL.md)
 */
async function listSkillFilesRelativeToCursor(cursorRoot: string): Promise<string[]> {
  const skillsRoot = join(cursorRoot, 'skills');
  if (!(await isDirectory(skillsRoot))) {
    return [];
  }
  const out: string[] = [];

  async function walk(dir: string, relFromSkills: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const pathRel = relFromSkills ? `${relFromSkills}/${e.name}` : e.name;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full, pathRel);
      } else {
        out.push(`skills/${pathRel.replace(/\\/g, '/')}`);
      }
    }
  }

  await walk(skillsRoot, '');
  return out;
}

/**
 * Set provides.skills in modules/<module>/module.json to match top-level folders under
 * cursor/skills/ that contain SKILL.md (sorted). So installers and list_modules stay in sync.
 */
async function syncModuleJsonProvidesSkills(
  repoRoot: string,
  modulePathRelative: string
): Promise<string> {
  const skillsDir = join(repoRoot, modulePathRelative, 'cursor', 'skills');
  const manifestPath = join(repoRoot, modulePathRelative, 'module.json');

  const skillNames: string[] = [];
  if (await isDirectory(skillsDir)) {
    const entries = await readdir(skillsDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      try {
        await stat(join(skillsDir, e.name, 'SKILL.md'));
        skillNames.push(`skills/${e.name}`);
      } catch {
        // folder without SKILL.md at root — skip
      }
    }
  }
  skillNames.sort();

  const raw = await readFile(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw) as Record<string, unknown>;
  if (!manifest.provides || typeof manifest.provides !== 'object' || manifest.provides === null) {
    manifest.provides = {};
  }
  const prov = manifest.provides as Record<string, unknown>;
  prov.skills = skillNames;

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  return join(modulePathRelative, 'module.json').replace(/\\/g, '/');
}

/** Top-level skill id from a path like `skills/foo/SKILL.md` or `skills/foo/ref.md` → `skills/foo` */
function skillIdFromCursorPath(cursorRelativePath: string): string | null {
  const n = cursorRelativePath.replace(/\\/g, '/');
  if (!n.startsWith('skills/')) return null;
  const rest = n.slice('skills/'.length);
  const first = rest.split('/')[0];
  if (!first) return null;
  return `skills/${first}`;
}

/**
 * Merge skill ids derived from pushed paths into existing provides.skills (no full directory rescan).
 * Use when **onlyPaths** limits what was copied so we do not rewrite the whole list from on-disk folders.
 */
async function mergeProvidesSkillsFromPushedPaths(
  repoRoot: string,
  modulePathRelative: string,
  pushedCursorRelativePaths: string[]
): Promise<string> {
  const manifestPath = join(repoRoot, modulePathRelative, 'module.json');
  const raw = await readFile(manifestPath, 'utf-8');
  const manifest = JSON.parse(raw) as Record<string, unknown>;
  if (!manifest.provides || typeof manifest.provides !== 'object' || manifest.provides === null) {
    manifest.provides = {};
  }
  const prov = manifest.provides as Record<string, unknown>;
  const existing = Array.isArray(prov.skills)
    ? (prov.skills as unknown[]).filter((x): x is string => typeof x === 'string')
    : [];
  const merged = new Set(existing);
  for (const p of pushedCursorRelativePaths) {
    const id = skillIdFromCursorPath(p);
    if (id) merged.add(id);
  }
  prov.skills = [...merged].sort();

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  return join(modulePathRelative, 'module.json').replace(/\\/g, '/');
}

async function copyFile(src: string, dest: string): Promise<void> {
  const content = await readFile(src, 'utf-8');
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, content, 'utf-8');
}

export interface PushModuleUpdatesResult {
  dryRun: boolean;
  scope: 'skills' | 'all';
  /** When set, skills were copied to this module's modules/.../cursor/skills/ */
  skillsTargetModuleId?: string;
  /** modules/.../module.json updated (provides.skills) when using skillsTargetModuleId */
  moduleJsonPath?: string;
  copiedRepoPaths: string[];
  git: {
    nothingToCommit: boolean;
    commitSha?: string;
    pushed: boolean;
    message?: string;
  };
  lockfileUpdated?: boolean;
  /** When set, only these `.cursor/`-relative paths were considered */
  onlyPaths?: string[];
}

/**
 * Copy tracked files from project .cursor into ai-development clone; commit and push.
 * Uses the user's existing git credentials (SSH / credential helper).
 *
 * When **skillsTargetModuleId** is set and **scope** is **skills**, copies every file under
 * `.cursor/skills/` into `modules/<that module>/cursor/skills/...` (named-project overlays
 * such as projects/towerai), instead of using sync-manifest paths (which may point at enterprise).
 *
 * **onlyPaths** — optional list of paths relative to `.cursor/` (e.g. `skills/foo/SKILL.md`,
 * `rules/20-web.mdc`, `hooks.json`). When set, only matching files are pushed (prefix match allowed,
 * e.g. `skills/foo` pushes the whole skill folder). Use **scope `all`** with **onlyPaths** to push a
 * single rule, hook, or command without pushing all skills.
 */
export async function pushModuleUpdates(options: {
  projectPath: string;
  aiDevelopmentRepo: string;
  commitMessage: string;
  scope: 'skills' | 'all';
  dryRun: boolean;
  updateProjectLockfile: boolean;
  /** e.g. projects/towerai — forces skill files into that module's cursor/skills/ */
  skillsTargetModuleId?: string;
  /** If non-empty, only push paths under .cursor/ that match (prefix or exact) */
  onlyPaths?: string[];
}): Promise<PushModuleUpdatesResult> {
  const {
    projectPath,
    aiDevelopmentRepo,
    commitMessage,
    scope,
    dryRun,
    updateProjectLockfile,
    skillsTargetModuleId: skillsTargetRaw,
    onlyPaths: onlyPathsRaw,
  } = options;

  const skillsTargetModuleId = skillsTargetRaw?.trim() || undefined;
  const onlyPatterns =
    onlyPathsRaw?.map(normalizeCursorRelativePath).filter((p) => p.length > 0) ?? [];

  const manifest = await readSyncManifest(projectPath);
  /** Named-project skill push copies from `.cursor/skills/` using the module id, not manifest entries. */
  const skillsTargetMode = scope === 'skills' && Boolean(skillsTargetModuleId);
  if (!manifest && !skillsTargetMode) {
    throw new Error(
      `Missing ${SYNC_MANIFEST_FILENAME}. Re-run install_environment or update_environment.`
    );
  }

  const root = resolve(aiDevelopmentRepo);
  const cursorRoot = join(projectPath, '.cursor');

  let copiedRepoPaths: string[] = [];
  let entries: { cursorRelativePath: string; repoRelativePath: string }[] = [];
  let targetSkillModule: ModuleMetadata | null = null;

  if (scope === 'skills' && skillsTargetModuleId) {
    const mod = await findModule(root, skillsTargetModuleId);
    if (!mod) {
      throw new Error(
        `skillsTargetModuleId module not found in clone: "${skillsTargetModuleId}". Check modules/ and module.json.`
      );
    }
    targetSkillModule = mod;

    let skillRelPaths = await listSkillFilesRelativeToCursor(cursorRoot);
    skillRelPaths = skillRelPaths.filter((p) => matchesOnlyPatterns(p, onlyPatterns));
    if (skillRelPaths.length === 0) {
      throw new Error(
        onlyPatterns.length
          ? `No files under .cursor/skills/ match onlyPaths ${JSON.stringify(onlyPatterns)}.`
          : 'No files under .cursor/skills/. Add or restore skills, or omit skillsTargetModuleId to use the sync manifest only.'
      );
    }

    const base = mod.path.replace(/\\/g, '/');
    entries = skillRelPaths.map((cursorRelativePath) => ({
      cursorRelativePath,
      repoRelativePath: join(base, 'cursor', cursorRelativePath).replace(/\\/g, '/'),
    }));
    copiedRepoPaths = entries.map((e) => e.repoRelativePath);
  } else {
    if (!manifest) {
      throw new Error(
        `Missing ${SYNC_MANIFEST_FILENAME}. Re-run install_environment or update_environment.`
      );
    }
    let manifestEntries = manifest.entries;
    if (scope === 'skills') {
      manifestEntries = manifestEntries.filter((e) => e.cursorRelativePath.startsWith('skills/'));
    }
    manifestEntries = manifestEntries.filter((e) =>
      matchesOnlyPatterns(e.cursorRelativePath, onlyPatterns)
    );
    if (manifestEntries.length === 0) {
      throw new Error(
        onlyPatterns.length
          ? `No sync manifest entries match onlyPaths ${JSON.stringify(onlyPatterns)} for scope "${scope}".`
          : `No manifest entries for scope "${scope}".`
      );
    }
    entries = manifestEntries.map((e) => ({
      cursorRelativePath: e.cursorRelativePath,
      repoRelativePath: e.repoRelativePath,
    }));
    copiedRepoPaths = entries.map((e) => e.repoRelativePath);
  }

  if (dryRun) {
    return {
      dryRun: true,
      scope,
      ...(onlyPatterns.length ? { onlyPaths: onlyPatterns } : {}),
      ...(skillsTargetModuleId && scope === 'skills' ? { skillsTargetModuleId } : {}),
      ...(targetSkillModule && skillsTargetModuleId
        ? {
            moduleJsonPath: join(targetSkillModule.path, 'module.json').replace(/\\/g, '/'),
          }
        : {}),
      copiedRepoPaths,
      git: {
        nothingToCommit: true,
        pushed: false,
        message:
          'dry-run: no files written; no git' +
          (targetSkillModule && skillsTargetModuleId
            ? '; with a real run, module.json provides.skills would be synced from on-disk cursor/skills/ when any skill path is pushed'
            : ''),
      },
    };
  }

  for (const e of entries) {
    const src = join(projectPath, '.cursor', e.cursorRelativePath);
    const dest = join(root, e.repoRelativePath);
    ensureUnderRoot(dest, root);
    await copyFile(src, dest);
  }

  let moduleJsonPath: string | undefined;
  const pushedAnySkill =
    skillsTargetModuleId &&
    entries.some((e) => e.cursorRelativePath.replace(/\\/g, '/').startsWith('skills/'));
  if (targetSkillModule && skillsTargetModuleId && pushedAnySkill) {
    if (onlyPatterns.length > 0) {
      moduleJsonPath = await mergeProvidesSkillsFromPushedPaths(
        root,
        targetSkillModule.path,
        entries.map((e) => e.cursorRelativePath)
      );
    } else {
      moduleJsonPath = await syncModuleJsonProvidesSkills(root, targetSkillModule.path);
    }
  }

  const git = simpleGit(root);
  for (const p of copiedRepoPaths) {
    await git.add(p);
  }
  if (moduleJsonPath) {
    await git.add(moduleJsonPath);
  }

  const diffCached = await git.diff(['--cached']);
  if (!diffCached || diffCached.trim() === '') {
    return {
      dryRun: false,
      scope,
      ...(onlyPatterns.length ? { onlyPaths: onlyPatterns } : {}),
      ...(skillsTargetModuleId && scope === 'skills' ? { skillsTargetModuleId } : {}),
      ...(moduleJsonPath ? { moduleJsonPath } : {}),
      copiedRepoPaths,
      git: {
        nothingToCommit: true,
        pushed: false,
        message: 'No diff after copy; clone already matches your .cursor/ content.',
      },
    };
  }

  await git.commit(commitMessage);
  await git.push();

  const head = (await getGitHeadSha(root)) || undefined;

  let lockfileUpdated = false;
  if (updateProjectLockfile && head) {
    const lockfile = await readLockfile(projectPath);
    if (lockfile) {
      await writeLockfile(
        projectPath,
        {
          repoUrl: lockfile.source.repoUrl,
          ref: lockfile.source.ref,
          commitSha: head,
        },
        lockfile.selection
      );
      lockfileUpdated = true;
    }
  }

  return {
    dryRun: false,
    scope,
    ...(onlyPatterns.length ? { onlyPaths: onlyPatterns } : {}),
    ...(skillsTargetModuleId && scope === 'skills' ? { skillsTargetModuleId } : {}),
    ...(moduleJsonPath ? { moduleJsonPath } : {}),
    copiedRepoPaths,
    git: {
      nothingToCommit: false,
      commitSha: head,
      pushed: true,
    },
    lockfileUpdated,
  };
}

export interface PullLatestResult {
  previousHead: string | null;
  newHead: string;
  refreshed: boolean;
}

/**
 * git pull --ff-only in the ai-development clone, then re-apply modules to projectPath from that tree.
 */
export async function pullLatestAndRefreshProject(options: {
  projectPath: string;
  aiDevelopmentRepo: string;
}): Promise<PullLatestResult> {
  const root = resolve(options.aiDevelopmentRepo);
  const git = simpleGit(root);
  const prev = await getGitHeadSha(root);
  await git.raw(['pull', '--ff-only']);
  const newHead = (await getGitHeadSha(root)) || '';
  if (!newHead) {
    throw new Error('Could not resolve HEAD after pull');
  }

  const lockfile = await readLockfile(options.projectPath);
  if (!lockfile) {
    throw new Error('cursor.lock.json not found. Run install_environment first.');
  }
  const profile = await readStackProfile(options.projectPath);
  if (!profile) {
    throw new Error('stack.profile.json not found');
  }

  const selection = {
    enterprise: profile.enterprise,
    controls: profile.controls,
    stacks: profile.stacks,
    projects: profile.projects ?? [],
  };

  const { localPath, commitSha } = await resolveModuleSource({
    repoUrl: lockfile.source.repoUrl,
    ref: lockfile.source.ref,
    localRepoPath: root,
  });

  const allModules = await scanModules(localPath);
  const selectedModules = await resolveSelection(localPath, selection);
  const depResolution = resolveDependencies(selectedModules, allModules);
  const depValidation = validateDependencies(selectedModules, allModules);
  if (!depValidation.valid) {
    throw new Error(`Dependency validation failed: ${depValidation.errors.join('; ')}`);
  }
  const modules = depResolution.resolved;
  const { composed, collisions } = await composeModules(localPath, modules);
  if (collisions.length > 0) {
    throw new Error(
      `Collision after pull — resolve in repo first: ${collisions.map((c) => c.path).join(', ')}`
    );
  }

  await writeInstalledEnvironment(
    options.projectPath,
    composed,
    'merge',
    {
      repoUrl: lockfile.source.repoUrl,
      ref: lockfile.source.ref,
      commitSha,
    },
    selection,
    modules,
    { writeLockfile: true }
  );

  return {
    previousHead: prev,
    newHead,
    refreshed: true,
  };
}
