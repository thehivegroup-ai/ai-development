/**
 * Module scanner
 * 
 * Scans the modules/ directory and discovers available modules
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
 * Infer module category from path
 */
function inferCategory(modulePath: string, repoRoot: string): ModuleCategory {
  const relativePath = relative(repoRoot, modulePath);
  
  if (relativePath.startsWith('modules/enterprise-standards')) {
    return 'enterprise-standards';
  } else if (relativePath.startsWith('modules/stack-authorities')) {
    return 'stack-authority';
  } else if (relativePath.startsWith('modules/project-controls')) {
    return 'project-control';
  }
  
  return 'stack-authority'; // default
}

/**
 * Infer module ID from path
 * e.g., modules/stack-authorities/frontend/react-tailwind → frontend/react-tailwind
 */
function inferModuleId(modulePath: string, repoRoot: string): string {
  const relativePath = relative(repoRoot, modulePath);
  const parts = relativePath.split('/');
  
  // Remove 'modules' and category prefix
  if (parts[0] === 'modules') {
    parts.shift(); // remove 'modules'
    parts.shift(); // remove category (enterprise-standards, stack-authorities, project-controls)
    return parts.join('/');
  }
  
  return parts.join('/');
}

/**
 * Scan a cursor/ directory for contents
 */
async function scanCursorDirectory(cursorPath: string): Promise<ModuleProvides> {
  const provides: ModuleProvides = {
    rules: [],
    commands: [],
    skills: [],
    agents: []
  };
  
  // Scan rules/
  const rulesDir = join(cursorPath, 'rules');
  if (await directoryExists(rulesDir)) {
    const files = await getFiles(rulesDir);
    provides.rules = files.filter(f => f.endsWith('.mdc') || f.endsWith('.md'));
  }
  
  // Scan commands/
  const commandsDir = join(cursorPath, 'commands');
  if (await directoryExists(commandsDir)) {
    const files = await getFiles(commandsDir);
    provides.commands = files.filter(f => f.endsWith('.md'));
  }
  
  // Scan skills/ (directories containing SKILL.md)
  const skillsDir = join(cursorPath, 'skills');
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
  
  // Scan agents/
  const agentsDir = join(cursorPath, 'agents');
  if (await directoryExists(agentsDir)) {
    const files = await getFiles(agentsDir);
    provides.agents = files.filter(f => f.endsWith('.md'));
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
  const cursorPath = join(modulePath, 'cursor');
  
  // Check if cursor/ directory exists
  if (!(await directoryExists(cursorPath))) {
    return null;
  }
  
  // Try to load manifest first
  const manifest = await loadManifest(modulePath);
  
  // Scan cursor/ directory for actual contents
  const provides = await scanCursorDirectory(cursorPath);
  
  // If no content found, skip this module
  if (
    provides.rules.length === 0 &&
    provides.commands.length === 0 &&
    provides.skills.length === 0 &&
    provides.agents.length === 0
  ) {
    return null;
  }
  
  // Build module metadata
  const id = manifest?.id || inferModuleId(modulePath, repoRoot);
  const category = manifest?.type || inferCategory(modulePath, repoRoot);
  const name = manifest?.name || id.split('/').pop() || id;
  
  return {
    id,
    category,
    name,
    description: manifest?.description,
    path: relative(repoRoot, modulePath),
    provides,
    requires: manifest?.requires,
    tags: manifest?.tags
  };
}

/**
 * Recursively scan for module directories
 */
async function findModuleDirectories(dir: string, depth: number = 0): Promise<string[]> {
  const MAX_DEPTH = 5;
  if (depth > MAX_DEPTH) return [];
  
  const modules: string[] = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const fullPath = join(dir, entry.name);
      
      // Check if this is a module directory (has cursor/ subdirectory)
      const cursorPath = join(fullPath, 'cursor');
      if (await directoryExists(cursorPath)) {
        modules.push(fullPath);
      } else {
        // Recurse into subdirectories
        const subModules = await findModuleDirectories(fullPath, depth + 1);
        modules.push(...subModules);
      }
    }
  } catch {
    // Directory not accessible
  }
  
  return modules;
}

/**
 * Scan the repository for all modules
 */
export async function scanModules(repoPath: string): Promise<ModuleMetadata[]> {
  const modulesDir = join(repoPath, 'modules');
  
  if (!(await directoryExists(modulesDir))) {
    throw new Error(`Modules directory not found: ${modulesDir}`);
  }
  
  // Find all module directories
  const moduleDirs = await findModuleDirectories(modulesDir);
  
  // Scan each module
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
 * Find a specific module by ID
 */
export async function findModule(
  repoPath: string,
  moduleId: string
): Promise<ModuleMetadata | null> {
  const allModules = await scanModules(repoPath);
  return allModules.find(m => m.id === moduleId) || null;
}
