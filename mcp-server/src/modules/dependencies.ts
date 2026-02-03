/**
 * Dependency Resolution
 * 
 * Resolves module dependencies and validates dependency trees
 */

import { ModuleMetadata } from '../types.js';

/**
 * Dependency resolution result
 */
export interface DependencyResolution {
  resolved: ModuleMetadata[];
  missing: string[];
  circular: string[][];
}

/**
 * Build dependency graph
 */
function buildDependencyGraph(modules: ModuleMetadata[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  
  for (const module of modules) {
    graph.set(module.id, module.requires || []);
  }
  
  return graph;
}

/**
 * Detect circular dependencies using DFS
 */
function detectCircular(
  graph: Map<string, string[]>,
  moduleId: string,
  visited: Set<string> = new Set(),
  stack: string[] = []
): string[][] {
  const circular: string[][] = [];
  
  if (stack.includes(moduleId)) {
    // Found a cycle
    const cycleStart = stack.indexOf(moduleId);
    circular.push([...stack.slice(cycleStart), moduleId]);
    return circular;
  }
  
  if (visited.has(moduleId)) {
    return circular;
  }
  
  visited.add(moduleId);
  stack.push(moduleId);
  
  const dependencies = graph.get(moduleId) || [];
  for (const dep of dependencies) {
    const depCircular = detectCircular(graph, dep, visited, stack);
    circular.push(...depCircular);
  }
  
  stack.pop();
  
  return circular;
}

/**
 * Topological sort of modules (respecting dependencies)
 */
function topologicalSort(
  modules: ModuleMetadata[],
  graph: Map<string, string[]>
): ModuleMetadata[] {
  const sorted: ModuleMetadata[] = [];
  const visited = new Set<string>();
  const moduleMap = new Map(modules.map(m => [m.id, m]));
  
  function visit(moduleId: string) {
    if (visited.has(moduleId)) {
      return;
    }
    
    visited.add(moduleId);
    
    const dependencies = graph.get(moduleId) || [];
    for (const dep of dependencies) {
      if (moduleMap.has(dep)) {
        visit(dep);
      }
    }
    
    const module = moduleMap.get(moduleId);
    if (module) {
      sorted.push(module);
    }
  }
  
  for (const module of modules) {
    visit(module.id);
  }
  
  return sorted;
}

/**
 * Resolve dependencies for a selection of modules
 */
export function resolveDependencies(
  selected: ModuleMetadata[],
  allModules: ModuleMetadata[]
): DependencyResolution {
  const moduleMap = new Map(allModules.map(m => [m.id, m]));
  const resolved = new Set<ModuleMetadata>();
  const missing = new Set<string>();
  
  // Start with selected modules
  const toProcess = [...selected];
  
  while (toProcess.length > 0) {
    const module = toProcess.shift()!;
    
    if (resolved.has(module)) {
      continue;
    }
    
    resolved.add(module);
    
    // Add dependencies
    for (const depId of module.requires || []) {
      const depModule = moduleMap.get(depId);
      
      if (!depModule) {
        missing.add(depId);
      } else if (!resolved.has(depModule)) {
        toProcess.push(depModule);
      }
    }
  }
  
  // Build graph for circular detection
  const graph = buildDependencyGraph(Array.from(resolved));
  const circular: string[][] = [];
  
  for (const module of resolved) {
    const cycles = detectCircular(graph, module.id);
    for (const cycle of cycles) {
      // Only add unique cycles
      if (!circular.some(existing => 
        existing.length === cycle.length && 
        existing.every((v, i) => v === cycle[i])
      )) {
        circular.push(cycle);
      }
    }
  }
  
  // Sort modules by dependencies
  const sortedResolved = topologicalSort(Array.from(resolved), graph);
  
  return {
    resolved: sortedResolved,
    missing: Array.from(missing),
    circular,
  };
}

/**
 * Generate dependency tree visualization
 */
export function visualizeDependencyTree(
  modules: ModuleMetadata[]
): string {
  const lines: string[] = [];
  const processed = new Set<string>();
  
  function addModule(module: ModuleMetadata, depth: number) {
    const prefix = '  '.repeat(depth);
    const marker = processed.has(module.id) ? '↻' : '•';
    
    lines.push(`${prefix}${marker} ${module.name} (${module.id || '""'})`);
    
    if (processed.has(module.id)) {
      return; // Already processed, avoid infinite recursion
    }
    
    processed.add(module.id);
    
    const deps = module.requires || [];
    if (deps.length > 0) {
      for (const depId of deps) {
        const depModule = modules.find(m => m.id === depId);
        if (depModule) {
          addModule(depModule, depth + 1);
        } else {
          lines.push(`${prefix}  ! Missing: ${depId}`);
        }
      }
    }
  }
  
  for (const module of modules) {
    if (!processed.has(module.id)) {
      addModule(module, 0);
    }
  }
  
  return lines.join('\n');
}

/**
 * Generate dependency summary
 */
export function generateDependencySummary(resolution: DependencyResolution): string {
  const sections: string[] = [];
  
  sections.push('# Dependency Resolution\n');
  
  // Resolved modules
  sections.push(`## Resolved Modules (${resolution.resolved.length})\n`);
  for (const module of resolution.resolved) {
    const depsCount = (module.requires || []).length;
    sections.push(`- ${module.name} (${module.id || '""'})`);
    if (depsCount > 0) {
      sections.push(`  Requires: ${(module.requires || []).map(id => `\`${id || '""'}\``).join(', ')}`);
    }
    sections.push('');
  }
  
  // Missing dependencies
  if (resolution.missing.length > 0) {
    sections.push(`\n## ⚠️  Missing Dependencies (${resolution.missing.length})\n`);
    for (const missing of resolution.missing) {
      sections.push(`- \`${missing}\``);
    }
    sections.push('');
  }
  
  // Circular dependencies
  if (resolution.circular.length > 0) {
    sections.push(`\n## ⚠️  Circular Dependencies (${resolution.circular.length})\n`);
    for (const cycle of resolution.circular) {
      sections.push(`- ${cycle.map(id => `\`${id || '""'}\``).join(' → ')}`);
    }
    sections.push('');
  }
  
  // Visualization
  sections.push('\n## Dependency Tree\n');
  sections.push('```');
  sections.push(visualizeDependencyTree(resolution.resolved));
  sections.push('```');
  
  return sections.join('\n');
}

/**
 * Check if selection has all required dependencies
 */
export function validateDependencies(
  selected: ModuleMetadata[],
  allModules: ModuleMetadata[]
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const resolution = resolveDependencies(selected, allModules);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for missing dependencies
  if (resolution.missing.length > 0) {
    for (const missing of resolution.missing) {
      errors.push(`Missing required module: "${missing}"`);
    }
  }
  
  // Check for circular dependencies
  if (resolution.circular.length > 0) {
    for (const cycle of resolution.circular) {
      warnings.push(`Circular dependency detected: ${cycle.join(' → ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
