/**
 * Cache manager for Git repositories
 * 
 * Manages local cache of cloned repositories at:
 * ~/.cache/ai-dev-mcp/<hash(repoUrl)>/<commitSha>/
 */

import { createHash } from 'crypto';
import { homedir } from 'os';
import { join } from 'path';
import { mkdir, access } from 'fs/promises';

const CACHE_BASE_DIR = join(homedir(), '.cache', 'ai-dev-mcp');

/**
 * Generate a stable hash for a repository URL
 */
export function hashRepoUrl(repoUrl: string): string {
  return createHash('sha256')
    .update(repoUrl)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Get the cache directory for a repository
 */
export function getRepoCacheDir(repoUrl: string): string {
  const urlHash = hashRepoUrl(repoUrl);
  return join(CACHE_BASE_DIR, urlHash);
}

/**
 * Get the cache directory for a specific commit
 */
export function getCommitCacheDir(repoUrl: string, commitSha: string): string {
  return join(getRepoCacheDir(repoUrl), commitSha);
}

/**
 * Check if a commit is already cached
 */
export async function isCached(repoUrl: string, commitSha: string): Promise<boolean> {
  const cacheDir = getCommitCacheDir(repoUrl, commitSha);
  try {
    await access(cacheDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure cache directory exists
 */
export async function ensureCacheDir(repoUrl: string, commitSha: string): Promise<string> {
  const cacheDir = getCommitCacheDir(repoUrl, commitSha);
  await mkdir(cacheDir, { recursive: true });
  return cacheDir;
}

/**
 * Get the base cache directory (for cleanup operations)
 */
export function getBaseCacheDir(): string {
  return CACHE_BASE_DIR;
}
