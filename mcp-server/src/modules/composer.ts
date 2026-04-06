/**
 * Composition engine
 *
 * Merges selected modules into a single .cursor/ output
 * with collision detection and proper ordering
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import { ModuleMetadata, ModuleSelection, ComposedModule, FileCollision, ModuleCategory } from '../types.js';
import { findModule, getModuleContentRoot } from './scanner.js';

/**
 * Merge rank: lower first. Named project overlays always merge last.
 */
function mergeRank(category: ModuleCategory): number {
  switch (category) {
    case 'enterprise-standards':
      return 0;
    case 'project-control':
      return 1;
    case 'stack-authority':
      return 2;
    case 'named-project':
      return 4;
    default:
      return 3;
  }
}

/**
 * Sort modules by merge priority
 */
function sortModulesByPriority(modules: ModuleMetadata[]): ModuleMetadata[] {
  return modules.sort((a, b) => mergeRank(a.category) - mergeRank(b.category));
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
 * Map source path under module content root to installed .cursor/ relative path
 */
function toInstalledRelativePath(sourceRelative: string): string {
  const norm = sourceRelative.replace(/\\/g, '/');
  if (norm.startsWith('hooks.d/')) {
    return `hooks/${norm.slice('hooks.d/'.length)}`;
  }
  return norm;
}

/**
 * Read module files into memory (with repo-relative paths for sync manifest)
 */
async function readModuleFiles(
  repoPath: string,
  module: ModuleMetadata
): Promise<
  Map<
    string,
    {
      content: string;
      repoSourcePath: string;
    }
  >
> {
  const files = new Map<string, { content: string; repoSourcePath: string }>();
  const modulePath = join(repoPath, module.path);
  const contentRoot = await getModuleContentRoot(modulePath);
  const filePaths = await getAllFiles(contentRoot, contentRoot);

  for (const filePath of filePaths) {
    const fullPath = join(contentRoot, filePath);
    const content = await readFile(fullPath, 'utf-8');
    const installedPath = toInstalledRelativePath(filePath);
    const repoSourcePath = relative(repoPath, fullPath).replace(/\\/g, '/');
    files.set(installedPath, { content, repoSourcePath });
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

  const sortedModules = sortModulesByPriority([...modules]);

  for (const module of sortedModules) {
    const moduleFiles = await readModuleFiles(repoPath, module);

    for (const [filePath, { content, repoSourcePath }] of moduleFiles) {
      if (!fileModuleMap.has(filePath)) {
        fileModuleMap.set(filePath, new Set());
      }
      fileModuleMap.get(filePath)!.add(module.id);

      const existing = composed.files.get(filePath);

      if (existing) {
        if (filePath === 'hooks.json') {
          const merged = mergeHooksJson(existing.content, content);
          composed.files.set(filePath, {
            content: merged,
            sourceModule: module.id,
            repoSourcePath,
          });
        } else if (existing.content !== content) {
          if (!collisions.find((c) => c.path === filePath)) {
            collisions.push({
              path: filePath,
              modules: Array.from(fileModuleMap.get(filePath)!),
            });
          }
          composed.files.set(filePath, {
            content,
            sourceModule: module.id,
            repoSourcePath,
          });
        } else {
          composed.files.set(filePath, {
            content,
            sourceModule: module.id,
            repoSourcePath,
          });
        }
      } else {
        composed.files.set(filePath, {
          content,
          sourceModule: module.id,
          repoSourcePath,
        });
      }
    }
  }

  return { composed, collisions };
}

/**
 * Merge two hooks.json configs by combining hook arrays per event type
 */
function mergeHooksJson(existingContent: string, newContent: string): string {
  try {
    const existing = JSON.parse(existingContent);
    const incoming = JSON.parse(newContent);

    const merged = {
      version: Math.max(existing.version || 1, incoming.version || 1),
      hooks: { ...existing.hooks },
    };

    if (incoming.hooks) {
      for (const [event, hooks] of Object.entries(incoming.hooks)) {
        if (!merged.hooks[event]) {
          merged.hooks[event] = hooks;
        } else if (Array.isArray(hooks)) {
          const existingCommands = new Set(
            (merged.hooks[event] as Array<{ command?: string }>).map((h) => h.command)
          );
          for (const hook of hooks as Array<{ command?: string }>) {
            if (!existingCommands.has(hook.command)) {
              (merged.hooks[event] as unknown[]).push(hook);
            }
          }
        }
      }
    }

    return JSON.stringify(merged, null, 2) + '\n';
  } catch {
    return newContent;
  }
}

/**
 * Rewrite selection IDs to canonical module ids (resolves aliases from module.json).
 */
export async function normalizeSelectionIds(
  repoPath: string,
  selection: ModuleSelection
): Promise<ModuleSelection> {
  const canon = async (id: string) => {
    if (id === undefined || id === null || id === '') {
      return id;
    }
    const m = await findModule(repoPath, id);
    return m?.id ?? id;
  };

  return {
    enterprise: await canon(selection.enterprise),
    controls: await Promise.all((selection.controls || []).map(canon)),
    stacks: await Promise.all((selection.stacks || []).map(canon)),
    projects: await Promise.all((selection.projects || []).map(canon)),
  };
}

/**
 * Resolve module selection to module metadata
 */
export async function resolveSelection(
  repoPath: string,
  selection: ModuleSelection
): Promise<ModuleMetadata[]> {
  const modules: ModuleMetadata[] = [];

  if (selection.enterprise !== undefined && selection.enterprise !== null) {
    const mod = await findModule(repoPath, selection.enterprise);
    if (!mod) {
      throw new Error(`Enterprise module not found: ${selection.enterprise}`);
    }
    modules.push(mod);
  }

  for (const controlId of selection.controls) {
    const mod = await findModule(repoPath, controlId);
    if (!mod) {
      throw new Error(`Control module not found: ${controlId}`);
    }
    modules.push(mod);
  }

  for (const stackId of selection.stacks) {
    const mod = await findModule(repoPath, stackId);
    if (!mod) {
      throw new Error(`Stack module not found: ${stackId}`);
    }
    modules.push(mod);
  }

  for (const projectId of selection.projects || []) {
    const mod = await findModule(repoPath, projectId);
    if (!mod) {
      throw new Error(`Project module not found: ${projectId}`);
    }
    modules.push(mod);
  }

  return modules;
}
