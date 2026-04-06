/**
 * Push edits from a project .cursor/ into a local ai-development clone, then git commit/push.
 * Pull latest from that clone and refresh the project's .cursor/ from the same tree.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join, resolve, relative } from 'path';
import simpleGit from 'simple-git';
import { resolveModuleSource, getGitHeadSha } from '../git/sourceResolver.js';
import { readLockfile, readStackProfile, writeLockfile } from './installer.js';
import { readSyncManifest, SYNC_MANIFEST_FILENAME } from './syncManifest.js';
import { scanModules } from './scanner.js';
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

async function copyFile(src: string, dest: string): Promise<void> {
  const content = await readFile(src, 'utf-8');
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, content, 'utf-8');
}

export interface PushModuleUpdatesResult {
  dryRun: boolean;
  scope: 'skills' | 'all';
  copiedRepoPaths: string[];
  git: {
    nothingToCommit: boolean;
    commitSha?: string;
    pushed: boolean;
    message?: string;
  };
  lockfileUpdated?: boolean;
}

/**
 * Copy tracked files from project .cursor into ai-development clone; commit and push.
 * Uses the user's existing git credentials (SSH / credential helper).
 */
export async function pushModuleUpdates(options: {
  projectPath: string;
  aiDevelopmentRepo: string;
  commitMessage: string;
  scope: 'skills' | 'all';
  dryRun: boolean;
  updateProjectLockfile: boolean;
}): Promise<PushModuleUpdatesResult> {
  const { projectPath, aiDevelopmentRepo, commitMessage, scope, dryRun, updateProjectLockfile } =
    options;

  const manifest = await readSyncManifest(projectPath);
  if (!manifest) {
    throw new Error(
      `Missing ${SYNC_MANIFEST_FILENAME}. Re-run install_environment or update_environment.`
    );
  }

  let entries = manifest.entries;
  if (scope === 'skills') {
    entries = entries.filter((e) => e.cursorRelativePath.startsWith('skills/'));
  }
  if (entries.length === 0) {
    throw new Error(`No manifest entries for scope "${scope}".`);
  }

  const copiedRepoPaths: string[] = entries.map((e) => e.repoRelativePath);
  const root = resolve(aiDevelopmentRepo);

  if (dryRun) {
    return {
      dryRun: true,
      scope,
      copiedRepoPaths,
      git: {
        nothingToCommit: true,
        pushed: false,
        message: 'dry-run: no files written; paths show what would be copied and committed.',
      },
    };
  }

  for (const e of entries) {
    const src = join(projectPath, '.cursor', e.cursorRelativePath);
    const dest = join(root, e.repoRelativePath);
    ensureUnderRoot(dest, root);
    await copyFile(src, dest);
  }

  const git = simpleGit(root);
  for (const p of copiedRepoPaths) {
    await git.add(p);
  }

  const diffCached = await git.diff(['--cached']);
  if (!diffCached || diffCached.trim() === '') {
    return {
      dryRun: false,
      scope,
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
