/**
 * Maps installed .cursor/ files back to paths under modules/.../cursor/ in the ai-development clone.
 * Enables push_module_updates to copy edits from a dev project into the contributor's clone.
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { posix } from 'path';
import { ComposedModule, GitSource, ModuleMetadata, ModuleSelection } from '../types.js';
import { writeModules, writeLockfile } from './installer.js';

export const SYNC_MANIFEST_FILENAME = 'ai-development.sync-manifest.json';

export interface SyncManifestEntry {
  /** Path relative to .cursor/ (posix, e.g. skills/foo/SKILL.md) */
  cursorRelativePath: string;
  moduleId: string;
  /** Path relative to ai-development repo root (posix) */
  repoRelativePath: string;
}

export interface SyncManifest {
  version: 1;
  generatedAt: string;
  lockSource: GitSource;
  entries: SyncManifestEntry[];
}

export function moduleArrayToMap(modules: ModuleMetadata[]): Map<string, ModuleMetadata> {
  const m = new Map<string, ModuleMetadata>();
  for (const mod of modules) {
    m.set(mod.id, mod);
  }
  return m;
}

export function buildSyncManifest(
  lockSource: GitSource,
  composed: ComposedModule,
  moduleById: Map<string, ModuleMetadata>
): SyncManifest {
  const entries: SyncManifestEntry[] = [];
  for (const [cursorRelativePath, { sourceModule, repoSourcePath }] of composed.files) {
    const mod = moduleById.get(sourceModule);
    if (!mod) continue;
    const repoRelativePath =
      repoSourcePath?.replace(/\\/g, '/') ??
      posix
        .join(mod.path.replace(/\\/g, '/'), 'cursor', cursorRelativePath.replace(/\\/g, '/'))
        .replace(/^\//, '');
    entries.push({ cursorRelativePath, moduleId: sourceModule, repoRelativePath });
  }
  entries.sort((a, b) => a.repoRelativePath.localeCompare(b.repoRelativePath));
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    lockSource,
    entries,
  };
}

export async function writeSyncManifest(projectPath: string, manifest: SyncManifest): Promise<void> {
  const p = join(projectPath, SYNC_MANIFEST_FILENAME);
  await writeFile(p, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
}

export async function readSyncManifest(projectPath: string): Promise<SyncManifest | null> {
  try {
    const p = join(projectPath, SYNC_MANIFEST_FILENAME);
    const c = await readFile(p, 'utf-8');
    const parsed = JSON.parse(c) as SyncManifest;
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Write .cursor/, lockfile, and sync manifest in one shot (install/update/upgrade).
 */
export async function writeInstalledEnvironment(
  projectPath: string,
  composed: ComposedModule,
  mode: 'merge' | 'overwrite',
  lockSource: GitSource,
  selection: ModuleSelection,
  modules: ModuleMetadata[],
  options: { writeLockfile: boolean }
): Promise<void> {
  await writeModules(projectPath, composed, mode);
  if (options.writeLockfile) {
    await writeLockfile(projectPath, lockSource, selection);
  }
  const moduleMap = moduleArrayToMap(modules);
  const manifest = buildSyncManifest(lockSource, composed, moduleMap);
  await writeSyncManifest(projectPath, manifest);
}
