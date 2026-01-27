/**
 * Installer
 * 
 * Writes composed modules to disk
 */

import { mkdir, writeFile, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { ComposedModule, StackProfile, CursorLockfile, GitSource, ModuleSelection } from '../types.js';

/**
 * Ensure directory exists
 */
async function ensureDir(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

/**
 * Write composed modules to .cursor/
 */
export async function writeModules(
  projectPath: string,
  composed: ComposedModule,
  mode: 'merge' | 'overwrite'
): Promise<void> {
  const cursorPath = join(projectPath, '.cursor');
  
  // If overwrite mode, clean .cursor/ first
  if (mode === 'overwrite') {
    try {
      await rm(cursorPath, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  }
  
  // Write all files
  for (const [filePath, fileData] of composed.files) {
    const fullPath = join(cursorPath, filePath);
    await ensureDir(fullPath);
    await writeFile(fullPath, fileData.content, 'utf-8');
  }
}

/**
 * Write stack.profile.json
 */
export async function writeStackProfile(
  projectPath: string,
  profile: StackProfile
): Promise<void> {
  const profilePath = join(projectPath, 'stack.profile.json');
  await writeFile(profilePath, JSON.stringify(profile, null, 2), 'utf-8');
}

/**
 * Write cursor.lock.json
 */
export async function writeLockfile(
  projectPath: string,
  source: GitSource,
  selection: ModuleSelection
): Promise<void> {
  const lockfile: CursorLockfile = {
    source,
    selection,
    generatedAt: new Date().toISOString(),
  };
  
  const lockfilePath = join(projectPath, 'cursor.lock.json');
  await writeFile(lockfilePath, JSON.stringify(lockfile, null, 2), 'utf-8');
}

/**
 * Read existing lockfile
 */
export async function readLockfile(projectPath: string): Promise<CursorLockfile | null> {
  try {
    const lockfilePath = join(projectPath, 'cursor.lock.json');
    const content = await readFile(lockfilePath, 'utf-8');
    return JSON.parse(content) as CursorLockfile;
  } catch {
    return null;
  }
}

/**
 * Read existing stack profile
 */
export async function readStackProfile(projectPath: string): Promise<StackProfile | null> {
  try {
    const profilePath = join(projectPath, 'stack.profile.json');
    const content = await readFile(profilePath, 'utf-8');
    return JSON.parse(content) as StackProfile;
  } catch {
    return null;
  }
}

// Fix import
import { readFile } from 'fs/promises';
