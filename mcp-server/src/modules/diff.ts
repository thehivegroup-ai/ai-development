/**
 * Diff engine
 * 
 * Compares local .cursor/ against composed modules to generate a plan
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative } from 'path';
import { ComposedModule, InstallationPlan } from '../types.js';

/**
 * Check if a path exists
 */
async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Recursively get all files in a directory
 */
async function getAllFiles(dir: string, baseDir: string = dir): Promise<string[]> {
  const files: string[] = [];
  
  if (!(await pathExists(dir))) {
    return files;
  }
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else {
        files.push(relative(baseDir, fullPath));
      }
    }
  } catch {
    // Directory doesn't exist or not accessible
  }
  
  return files;
}

/**
 * Read local .cursor/ directory into memory
 */
async function readLocalCursor(projectPath: string): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const cursorPath = join(projectPath, '.cursor');
  
  if (!(await pathExists(cursorPath))) {
    return files;
  }
  
  const filePaths = await getAllFiles(cursorPath, cursorPath);
  
  for (const filePath of filePaths) {
    try {
      const fullPath = join(cursorPath, filePath);
      const content = await readFile(fullPath, 'utf-8');
      files.set(filePath, content);
    } catch {
      // Skip files that can't be read
    }
  }
  
  return files;
}

/**
 * Generate diff between local and composed modules
 */
export async function diffEnvironment(
  projectPath: string,
  composed: ComposedModule
): Promise<InstallationPlan> {
  const local = await readLocalCursor(projectPath);
  
  const added: string[] = [];
  const modified: string[] = [];
  const unchanged: string[] = [];
  const removed: string[] = [];
  
  // Check composed files against local
  for (const [filePath, fileData] of composed.files) {
    const localContent = local.get(filePath);
    
    if (!localContent) {
      // File doesn't exist locally
      added.push(filePath);
    } else if (localContent !== fileData.content) {
      // File exists but content differs
      modified.push(filePath);
    } else {
      // File exists and content is identical
      unchanged.push(filePath);
    }
  }
  
  // Check local files for removals
  for (const filePath of local.keys()) {
    if (!composed.files.has(filePath)) {
      removed.push(filePath);
    }
  }
  
  return {
    added: added.sort(),
    modified: modified.sort(),
    removed: removed.sort(),
    unchanged: unchanged.sort(),
    collisions: [], // Collisions are detected during composition
  };
}
