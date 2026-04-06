/**
 * Resolve where module sources live: a local ai-development clone (contribution)
 * or the read-only remote cache used for installs.
 */

import { join } from 'path';
import { stat } from 'fs/promises';
import simpleGit from 'simple-git';
import { fetchRepository } from './fetcher.js';

const MODULES_DIR_NAME = 'modules';

async function isDirectory(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Best-effort HEAD for lockfiles and reporting when using a local clone.
 */
export async function getGitHeadSha(repoRoot: string): Promise<string | null> {
  try {
    const git = simpleGit(repoRoot);
    const sha = await git.revparse(['HEAD']);
    return sha.trim();
  } catch {
    return null;
  }
}

export interface ResolveModuleSourceOptions {
  repoUrl: string;
  ref: string;
  forceRefresh?: boolean;
  /**
   * Absolute path to the ai-development repository root (must contain modules/).
   * When set, the server uses this tree instead of cloning/fetching the remote cache.
   */
  localRepoPath?: string | null;
}

export interface ResolvedModuleSource {
  localPath: string;
  commitSha: string;
  source: 'local' | 'remote-cache';
}

export async function resolveModuleSource(
  options: ResolveModuleSourceOptions
): Promise<ResolvedModuleSource> {
  const { repoUrl, ref, forceRefresh, localRepoPath } = options;

  if (localRepoPath) {
    const modulesDir = join(localRepoPath, MODULES_DIR_NAME);
    if (!(await isDirectory(modulesDir))) {
      throw new Error(
        `localRepoPath must be the repository root containing "${MODULES_DIR_NAME}/". Received: ${localRepoPath}`
      );
    }
    const sha = (await getGitHeadSha(localRepoPath)) || 'local-working-copy';
    return {
      localPath: localRepoPath,
      commitSha: sha,
      source: 'local',
    };
  }

  const { localPath, commitSha } = await fetchRepository(repoUrl, ref, { forceRefresh });
  return {
    localPath,
    commitSha,
    source: 'remote-cache',
  };
}

/**
 * Read-only snapshot for contributors (commit/push remain manual with user credentials).
 */
export async function getGitContributionStatus(repoRoot: string): Promise<{
  branch: string;
  detached: boolean;
  commitSha: string | null;
  isClean: boolean;
  tracking: string | null;
  ahead: number;
  behind: number;
  shortStatus: string;
}> {
  const git = simpleGit(repoRoot);
  const branch = await git.branch();
  const status = await git.status();
  const sha = await getGitHeadSha(repoRoot);

  return {
    branch: branch.current,
    detached: branch.detached,
    commitSha: sha,
    isClean: status.isClean(),
    tracking: status.tracking ?? null,
    ahead: status.ahead,
    behind: status.behind,
    shortStatus: await git.raw(['status', '--short', '-b']).then((s) => s.trim()),
  };
}
