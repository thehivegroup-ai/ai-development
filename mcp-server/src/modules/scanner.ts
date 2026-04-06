/**
 * Module scanner
 *
 * Scans the modules/ directory and discovers available modules.
 *
 * ARCHITECTURE NOTE:
 * - Reads FROM: modules/ directory (source of truth)
 * - Never reads from .cursor/ in ai-development repo (that's dogfooding)
 * - Discovered modules are installed TO: target-project/.cursor/ (deployment target)
 *
 * See docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md for details.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative } from 'path';
import { ModuleMetadata, ModuleCategory, ModuleManifest, ModuleProvides } from '../types.js';

/**
 * Check if a directory exists and is accessible
 */
async function directoryExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all files in a directory (non-recursive)
 */
async function getFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir);
    return entries;
  } catch {
    return [];
  }
}

/**
 * Resolve where installable Cursor content lives for a module.
 * Prefers `cursor/` when it has real content; otherwise uses the module root (flat layout).
 */
export async function getModuleContentRoot(modulePath: string): Promise<string> {
  const cursorPath = join(modulePath, 'cursor');
  if (!(await directoryExists(cursorPath))) {
    return modulePath;
  }

  if (await fileExists(join(cursorPath, 'hooks.json'))) {
    return cursorPath;
  }

  for (const d of ['rules', 'skills', 'agents', 'commands', 'hooks', 'scripts']) {
    if (await directoryExists(join(cursorPath, d))) {
      return cursorPath;
    }
  }

  try {
    const entries = await readdir(cursorPath);
    const meaningful = entries.filter((e) => e !== 'README.md' && e !== '.DS_Store');
    if (meaningful.length > 0) {
      return cursorPath;
    }
  } catch {
    // fall through
  }

  return modulePath;
}

/**
 * Normalize category strings from module.json (aliases vary across manifests)
 */
function normalizeManifestCategory(raw: string | undefined): ModuleCategory | undefined {
  if (!raw) return undefined;
  const r = raw.trim().toLowerCase().replace(/_/g, '-');
  if (r === 'enterprise-standard' || r === 'enterprise-standards') {
    return 'enterprise-standards';
  }
  if (r === 'stack-authority') return 'stack-authority';
  if (r === 'project-control') return 'project-control';
  if (r === 'named-project') return 'named-project';
  return undefined;
}

/**
 * Infer module category from path
 */
function inferCategory(modulePath: string, repoRoot: string): ModuleCategory {
  const relativePath = relative(repoRoot, modulePath).replace(/\\/g, '/');

  if (relativePath.startsWith('modules/enterprise-standards')) {
    return 'enterprise-standards';
  }
  if (relativePath.startsWith('modules/projects/')) {
    return 'named-project';
  }
  if (relativePath.startsWith('modules/stack-authorities')) {
    return 'stack-authority';
  }
  if (relativePath.startsWith('modules/project-controls')) {
    return 'project-control';
  }

  return 'stack-authority';
}

/**
 * Infer module ID from path
 * e.g., modules/stack-authorities/frontend/react-tailwind → frontend/react-tailwind
 * e.g., modules/projects/towerai → projects/towerai
 */
function inferModuleId(modulePath: string, repoRoot: string): string {
  const relativePath = relative(repoRoot, modulePath);
  const parts = relativePath.split(/[/\\]/);

  if (parts[0] === 'modules') {
    parts.shift();
    parts.shift();
    return parts.join('/');
  }

  return parts.join('/');
}

/**
 * Scan installable content at contentRoot (module `cursor/` or flat module root)
 */
async function scanModuleContent(contentRoot: string): Promise<ModuleProvides> {
  const provides: ModuleProvides = {
    rules: [],
    commands: [],
    skills: [],
    agents: [],
    hooks: [],
  };

  const rulesDir = join(contentRoot, 'rules');
  if (await directoryExists(rulesDir)) {
    const files = await getFiles(rulesDir);
    provides.rules = files.filter((f) => f.endsWith('.mdc') || f.endsWith('.md'));
  }

  const commandsDir = join(contentRoot, 'commands');
  if (await directoryExists(commandsDir)) {
    const files = await getFiles(commandsDir);
    provides.commands = files.filter((f) => f.endsWith('.md'));
  }

  const skillsDir = join(contentRoot, 'skills');
  if (await directoryExists(skillsDir)) {
    const entries = await getFiles(skillsDir);
    for (const entry of entries) {
      const skillPath = join(skillsDir, entry);
      const skillFile = join(skillPath, 'SKILL.md');
      if (await directoryExists(skillPath)) {
        try {
          await stat(skillFile);
          provides.skills.push(entry);
        } catch {
          // No SKILL.md, skip
        }
      }
    }
  }

  const agentsDir = join(contentRoot, 'agents');
  if (await directoryExists(agentsDir)) {
    const files = await getFiles(agentsDir);
    provides.agents = files.filter((f) => f.endsWith('.md'));
  }

  const hooksJson = join(contentRoot, 'hooks.json');
  try {
    await stat(hooksJson);
    provides.hooks.push('hooks.json');
  } catch {
    // No hooks.json
  }

  const hooksDir = join(contentRoot, 'hooks');
  if (await directoryExists(hooksDir)) {
    const files = await getFiles(hooksDir);
    provides.hooks.push(...files.map((f) => `hooks/${f}`));
  }

  const hooksDDir = join(contentRoot, 'hooks.d');
  if (await directoryExists(hooksDDir)) {
    const files = await getFiles(hooksDDir);
    provides.hooks.push(...files.map((f) => `hooks/${f}`));
  }

  return provides;
}

/**
 * Load module manifest if it exists
 */
async function loadManifest(modulePath: string): Promise<ModuleManifest | null> {
  const manifestPath = join(modulePath, 'module.json');

  try {
    const content = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content) as ModuleManifest;
    return manifest;
  } catch {
    return null;
  }
}

/**
 * Scan a single module directory
 */
async function scanModule(modulePath: string, repoRoot: string): Promise<ModuleMetadata | null> {
  const manifest = await loadManifest(modulePath);
  const contentRoot = await getModuleContentRoot(modulePath);

  const provides = await scanModuleContent(contentRoot);

  if (
    provides.rules.length === 0 &&
    provides.commands.length === 0 &&
    provides.skills.length === 0 &&
    provides.agents.length === 0 &&
    provides.hooks.length === 0
  ) {
    return null;
  }

  const id = manifest?.id || inferModuleId(modulePath, repoRoot);
  const rawType = manifest?.type ?? manifest?.category;
  const category: ModuleCategory =
    normalizeManifestCategory(rawType) ?? inferCategory(modulePath, repoRoot);
  const name = manifest?.name || id.split('/').pop() || id;

  const aliases = manifest?.aliases?.filter((a) => typeof a === 'string' && a.trim().length > 0);

  return {
    id,
    ...(aliases && aliases.length > 0 ? { aliases } : {}),
    category,
    name,
    description: manifest?.description,
    path: relative(repoRoot, modulePath),
    provides,
    requires: manifest?.requires,
    tags: manifest?.tags,
  };
}

/**
 * Find every directory under modules/ that contains a module.json (module root).
 */
async function findModuleDirectoriesWithManifest(modulesDir: string): Promise<string[]> {
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
 * Scan the repository for all modules
 */
export async function scanModules(repoPath: string): Promise<ModuleMetadata[]> {
  const modulesDir = join(repoPath, 'modules');

  if (!(await directoryExists(modulesDir))) {
    throw new Error(`Modules directory not found: ${modulesDir}`);
  }

  const moduleDirs = await findModuleDirectoriesWithManifest(modulesDir);

  const modules: ModuleMetadata[] = [];

  for (const moduleDir of moduleDirs) {
    const metadata = await scanModule(moduleDir, repoPath);
    if (metadata) {
      modules.push(metadata);
    }
  }

  return modules;
}

/**
 * Find a specific module by canonical ID or alias (see module.json `aliases`)
 */
export async function findModule(
  repoPath: string,
  moduleId: string
): Promise<ModuleMetadata | null> {
  const allModules = await scanModules(repoPath);
  const found =
    allModules.find((m) => m.id === moduleId) ||
    allModules.find((m) => m.aliases?.includes(moduleId));
  return found || null;
}
