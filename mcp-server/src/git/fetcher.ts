/**
 * Git repository fetcher
 * 
 * Handles cloning, fetching, and resolving refs to commit SHAs
 */

import simpleGit, { SimpleGit } from 'simple-git';
import { GitRef, CommitSha } from '../types.js';
import { 
  getCommitCacheDir, 
  isCached, 
  ensureCacheDir,
  getRepoCacheDir
} from '../cache/manager.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';

export interface FetchOptions {
  forceRefresh?: boolean;
}

/**
 * Resolve a Git ref to a commit SHA
 */
export async function resolveRefToCommitSha(
  repoUrl: string,
  ref: GitRef
): Promise<CommitSha> {
  // Create a temporary clone to resolve the ref
  const tempDir = join(getRepoCacheDir(repoUrl), '_temp', Date.now().toString());
  await mkdir(tempDir, { recursive: true });

  const git: SimpleGit = simpleGit();
  
  try {
    // Clone with minimal depth just to resolve the ref
    await git.clone(repoUrl, tempDir, ['--depth', '1', '--branch', ref]);
    
    const gitRepo = simpleGit(tempDir);
    const log = await gitRepo.log(['-n', '1']);
    
    if (!log.latest) {
      throw new Error(`Failed to resolve ref "${ref}" to commit SHA`);
    }
    
    return log.latest.hash;
  } finally {
    // Clean up temp directory
    try {
      await git.raw(['rm', '-rf', tempDir]);
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Fetch repository at a specific ref and return the local path
 * 
 * This function:
 * 1. Resolves the ref to a commit SHA
 * 2. Checks if the commit is already cached
 * 3. If not cached or forceRefresh is true, clones the repository
 * 4. Returns the path to the cached repository
 */
export async function fetchRepository(
  repoUrl: string,
  ref: GitRef,
  options: FetchOptions = {}
): Promise<{ localPath: string; commitSha: CommitSha }> {
  // Resolve ref to commit SHA
  const commitSha = await resolveRefToCommitSha(repoUrl, ref);
  
  // Check if already cached
  const cached = await isCached(repoUrl, commitSha);
  
  if (cached && !options.forceRefresh) {
    return {
      localPath: getCommitCacheDir(repoUrl, commitSha),
      commitSha
    };
  }
  
  // Clone to cache
  const cacheDir = await ensureCacheDir(repoUrl, commitSha);
  const git: SimpleGit = simpleGit();
  
  // Clone with the specific commit
  // We use --depth 1 for efficiency since we know the exact commit
  await git.clone(repoUrl, cacheDir, ['--depth', '1', '--branch', ref]);
  
  return {
    localPath: cacheDir,
    commitSha
  };
}

/**
 * Validate that a repository URL is accessible
 */
export async function validateRepoUrl(repoUrl: string): Promise<boolean> {
  const git: SimpleGit = simpleGit();
  
  try {
    await git.listRemote([repoUrl]);
    return true;
  } catch {
    return false;
  }
}
