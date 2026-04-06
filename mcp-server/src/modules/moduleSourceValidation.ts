/**
 * Validate module trees under modules/ for contribution / CI-style checks.
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { ModuleManifest } from '../types.js';

export interface ModuleSourceIssue {
  severity: 'error' | 'warning';
  code: string;
  path: string;
  message: string;
}

export interface ModuleSourceValidationResult {
  valid: boolean;
  repoRoot: string;
  modulesScanned: number;
  issues: ModuleSourceIssue[];
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function findModuleDirs(modulesDir: string): Promise<string[]> {
  const out: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    const hasManifest = entries.some((e) => e.isFile() && e.name === 'module.json');
    if (hasManifest) {
      out.push(dir);
    }
    for (const e of entries) {
      if (!e.isDirectory() || e.name.startsWith('.')) continue;
      await walk(join(dir, e.name));
    }
  }

  await walk(modulesDir);
  return out;
}

/**
 * Validate module.json files and basic layout under modules/.
 */
export async function validateModuleSources(repoRoot: string): Promise<ModuleSourceValidationResult> {
  const issues: ModuleSourceIssue[] = [];
  const modulesDir = join(repoRoot, 'modules');

  if (!(await isDirectory(modulesDir))) {
    return {
      valid: false,
      repoRoot,
      modulesScanned: 0,
      issues: [
        {
          severity: 'error',
          code: 'MISSING_MODULES_DIR',
          path: 'modules',
          message: `Directory not found: ${modulesDir}`,
        },
      ],
    };
  }

  const moduleDirs = await findModuleDirs(modulesDir);

  for (const modulePath of moduleDirs) {
    const rel = relative(repoRoot, modulePath);
    const manifestPath = join(modulePath, 'module.json');

    try {
      await stat(manifestPath);
    } catch {
      issues.push({
        severity: 'warning',
        code: 'MISSING_MODULE_JSON',
        path: join(rel, 'module.json'),
        message: 'module.json not found; metadata will be inferred from path and cursor/ contents',
      });
      continue;
    }

    try {
      const raw = await readFile(manifestPath, 'utf-8');
      JSON.parse(raw) as ModuleManifest;
    } catch (e) {
      issues.push({
        severity: 'error',
        code: 'INVALID_MODULE_JSON',
        path: join(rel, 'module.json'),
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const errors = issues.filter((i) => i.severity === 'error');
  return {
    valid: errors.length === 0,
    repoRoot,
    modulesScanned: moduleDirs.length,
    issues,
  };
}
