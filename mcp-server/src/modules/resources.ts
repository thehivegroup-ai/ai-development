/**
 * Module resource provider
 * 
 * Exposes module content as MCP resources for reading
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { ModuleMetadata } from '../types.js';

/**
 * Resource URI patterns:
 * - ai-dev://modules                              (list all modules)
 * - ai-dev://modules/{moduleId}                   (module overview)
 * - ai-dev://modules/{moduleId}/rules             (list rules)
 * - ai-dev://modules/{moduleId}/rules/{filename}  (read rule file)
 * - ai-dev://modules/{moduleId}/commands/{filename}
 * - ai-dev://modules/{moduleId}/skills/{skillName}
 * - ai-dev://modules/{moduleId}/agents/{filename}
 */

export interface ModuleResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * Generate resource URI for a module
 */
export function getModuleUri(moduleId: string): string {
  return `ai-dev://modules/${moduleId}`;
}

/**
 * Generate resource URI for module content
 */
export function getContentUri(
  moduleId: string,
  type: 'rules' | 'commands' | 'skills' | 'agents' | 'hooks',
  filename?: string
): string {
  const base = `ai-dev://modules/${moduleId}/${type}`;
  return filename ? `${base}/${filename}` : base;
}

/**
 * Parse a resource URI
 */
export function parseResourceUri(uri: string): {
  moduleId?: string;
  type?: 'rules' | 'commands' | 'skills' | 'agents' | 'hooks';
  filename?: string;
} | null {
  if (!uri.startsWith('ai-dev://modules')) {
    return null;
  }

  const path = uri.replace('ai-dev://modules', '').replace(/^\//, '');
  
  if (!path) {
    return {}; // List all modules
  }

  const parts = path.split('/');

  if (parts.length === 1) {
    return { moduleId: parts[0] }; // Module overview
  }

  if (parts.length === 2) {
    return { 
      moduleId: parts[0], 
      type: parts[1] as 'rules' | 'commands' | 'skills' | 'agents' | 'hooks'
    }; // List content type
  }

  if (parts.length === 3) {
    return {
      moduleId: parts[0],
      type: parts[1] as 'rules' | 'commands' | 'skills' | 'agents' | 'hooks',
      filename: parts[2]
    }; // Read specific file
  }

  return null;
}

/**
 * List all resources for a set of modules
 */
export function listResources(modules: ModuleMetadata[]): ModuleResource[] {
  const resources: ModuleResource[] = [];

  for (const module of modules) {
    // Module overview resource
    resources.push({
      uri: getModuleUri(module.id),
      name: `${module.name} (${module.id})`,
      description: module.description || `Module ${module.id}`,
      mimeType: 'application/json',
    });

    // Rules resources
    for (const rule of module.provides.rules) {
      resources.push({
        uri: getContentUri(module.id, 'rules', rule),
        name: `${module.name} - ${rule}`,
        description: `Rule: ${rule}`,
        mimeType: 'text/markdown',
      });
    }

    // Commands resources
    for (const command of module.provides.commands) {
      resources.push({
        uri: getContentUri(module.id, 'commands', command),
        name: `${module.name} - ${command}`,
        description: `Command: ${command}`,
        mimeType: 'text/markdown',
      });
    }

    // Skills resources
    for (const skill of module.provides.skills) {
      resources.push({
        uri: getContentUri(module.id, 'skills', skill),
        name: `${module.name} - ${skill}`,
        description: `Skill: ${skill}`,
        mimeType: 'text/markdown',
      });
    }

    // Agents resources
    for (const agent of module.provides.agents) {
      resources.push({
        uri: getContentUri(module.id, 'agents', agent),
        name: `${module.name} - ${agent}`,
        description: `Agent: ${agent}`,
        mimeType: 'text/markdown',
      });
    }

    // Hooks resources
    for (const hook of module.provides.hooks) {
      resources.push({
        uri: getContentUri(module.id, 'hooks', hook),
        name: `${module.name} - ${hook}`,
        description: `Hook: ${hook}`,
        mimeType: hook.endsWith('.json') ? 'application/json' : 'text/x-shellscript',
      });
    }
  }

  return resources;
}

/**
 * Read resource content
 */
export async function readResource(
  repoPath: string,
  module: ModuleMetadata,
  type: 'rules' | 'commands' | 'skills' | 'agents' | 'hooks',
  filename?: string
): Promise<string> {
  const modulePath = join(repoPath, module.path);
  
  if (type === 'skills' && filename) {
    // Skills are directories with SKILL.md
    const skillPath = join(modulePath, 'cursor', 'skills', filename, 'SKILL.md');
    return await readFile(skillPath, 'utf-8');
  }
  
  // Regular files
  const contentPath = join(modulePath, 'cursor', type, filename || '');
  return await readFile(contentPath, 'utf-8');
}

/**
 * Generate module overview JSON
 */
export function generateModuleOverview(module: ModuleMetadata): string {
  return JSON.stringify(
    {
      id: module.id,
      category: module.category,
      name: module.name,
      description: module.description,
      path: module.path,
      provides: module.provides,
      requires: module.requires,
      tags: module.tags,
      resources: {
        rules: module.provides.rules.map(r => getContentUri(module.id, 'rules', r)),
        commands: module.provides.commands.map(c => getContentUri(module.id, 'commands', c)),
        skills: module.provides.skills.map(s => getContentUri(module.id, 'skills', s)),
        agents: module.provides.agents.map(a => getContentUri(module.id, 'agents', a)),
        hooks: module.provides.hooks.map(h => getContentUri(module.id, 'hooks', h)),
      },
    },
    null,
    2
  );
}
