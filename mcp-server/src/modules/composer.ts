/**
 * Composition engine
 * 
 * Merges selected modules into a single .cursor/ output
 * with collision detection and proper ordering
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import { ModuleMetadata, ModuleSelection, ComposedModule, FileCollision } from '../types.js';
import { findModule } from './scanner.js';

/**
 * Module merge order (enterprise → controls → stacks)
 */
const MERGE_ORDER = ['enterprise-standards', 'project-control', 'stack-authority'];

/**
 * Sort modules by merge priority
 */
function sortModulesByPriority(modules: ModuleMetadata[]): ModuleMetadata[] {
  return modules.sort((a, b) => {
    const orderA = MERGE_ORDER.indexOf(a.category);
    const orderB = MERGE_ORDER.indexOf(b.category);
    return orderA - orderB;
  });
}

/**
 * Recursively get all files in a directory
 */
async function getAllFiles(dir: string, baseDir: string = dir): Promise<string[]> {
  const files: string[] = [];
  
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
 * Read module files into memory
 */
async function readModuleFiles(
  repoPath: string,
  module: ModuleMetadata
): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const modulePath = join(repoPath, module.path);
  const cursorPath = join(modulePath, 'cursor');
  
  // Get all files from cursor/ directory
  const filePaths = await getAllFiles(cursorPath, cursorPath);
  
  for (const filePath of filePaths) {
    const fullPath = join(cursorPath, filePath);
    const content = await readFile(fullPath, 'utf-8');
    files.set(filePath, content);
  }
  
  return files;
}

/**
 * Compose modules into a single virtual file tree
 */
export async function composeModules(
  repoPath: string,
  modules: ModuleMetadata[]
): Promise<{ composed: ComposedModule; collisions: FileCollision[] }> {
  const composed: ComposedModule = {
    files: new Map(),
  };
  
  const fileModuleMap = new Map<string, Set<string>>();
  const collisions: FileCollision[] = [];
  
  // Sort modules by priority
  const sortedModules = sortModulesByPriority([...modules]);
  
  // Process each module
  for (const module of sortedModules) {
    const moduleFiles = await readModuleFiles(repoPath, module);
    
    for (const [filePath, content] of moduleFiles) {
      // Track which modules provide this file
      if (!fileModuleMap.has(filePath)) {
        fileModuleMap.set(filePath, new Set());
      }
      fileModuleMap.get(filePath)!.add(module.id);
      
      // Check if file already exists with different content
      const existing = composed.files.get(filePath);
      
      if (existing) {
        // File exists - check if content is identical
        if (existing.content !== content) {
          // Different content = collision
          if (!collisions.find((c) => c.path === filePath)) {
            collisions.push({
              path: filePath,
              modules: Array.from(fileModuleMap.get(filePath)!),
            });
          }
        }
        // If content is identical, just update source module (last wins)
        composed.files.set(filePath, {
          content,
          sourceModule: module.id,
        });
      } else {
        // New file
        composed.files.set(filePath, {
          content,
          sourceModule: module.id,
        });
      }
    }
  }
  
  return { composed, collisions };
}

/**
 * Resolve module selection to module metadata
 */
export async function resolveSelection(
  repoPath: string,
  selection: ModuleSelection
): Promise<ModuleMetadata[]> {
  const modules: ModuleMetadata[] = [];
  
  // Resolve enterprise module
  if (selection.enterprise) {
    const module = await findModule(repoPath, selection.enterprise);
    if (!module) {
      throw new Error(`Enterprise module not found: ${selection.enterprise}`);
    }
    modules.push(module);
  }
  
  // Resolve control modules
  for (const controlId of selection.controls) {
    const module = await findModule(repoPath, controlId);
    if (!module) {
      throw new Error(`Control module not found: ${controlId}`);
    }
    modules.push(module);
  }
  
  // Resolve stack modules
  for (const stackId of selection.stacks) {
    const module = await findModule(repoPath, stackId);
    if (!module) {
      throw new Error(`Stack module not found: ${stackId}`);
    }
    modules.push(module);
  }
  
  return modules;
}
