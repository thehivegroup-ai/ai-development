/**
 * Interactive Module Selector
 * 
 * Provides user-friendly module selection with categories and descriptions
 */

import { ModuleMetadata } from '../types.js';

/** Resolve canonical module by id or manifest alias */
export function findModuleByIdOrAlias(
  modules: ModuleMetadata[],
  id: string
): ModuleMetadata | undefined {
  return modules.find((m) => m.id === id || m.aliases?.includes(id));
}

function buildAcceptedIdSet(modules: ModuleMetadata[]): Set<string> {
  const s = new Set<string>();
  for (const m of modules) {
    s.add(m.id);
    for (const a of m.aliases || []) {
      s.add(a);
    }
  }
  return s;
}

/**
 * Selection categories
 */
export interface SelectionCategories {
  enterprise: ModuleMetadata[];
  controls: ModuleMetadata[];
  frontend: ModuleMetadata[];
  backend: ModuleMetadata[];
  database: ModuleMetadata[];
  cloud: ModuleMetadata[];
  testing: ModuleMetadata[];
  ci: ModuleMetadata[];
  /** Named project overlays (modules/projects/...) */
  projects: ModuleMetadata[];
}

/**
 * User's module choices
 */
export interface ModuleChoices {
  enterprise: string;
  controls: string[];
  stacks: string[];
  /** Optional named project overlays, merged last (e.g. projects/towerai) */
  projects?: string[];
}

/**
 * Organize modules by selection categories
 */
export function categorizeModules(modules: ModuleMetadata[]): SelectionCategories {
  const categories: SelectionCategories = {
    enterprise: [],
    controls: [],
    frontend: [],
    backend: [],
    database: [],
    cloud: [],
    testing: [],
    ci: [],
    projects: [],
  };

  for (const module of modules) {
    if (module.category === 'enterprise-standards') {
      categories.enterprise.push(module);
    } else if (module.category === 'project-control') {
      categories.controls.push(module);
    } else if (module.category === 'named-project') {
      categories.projects.push(module);
    } else if (module.category === 'stack-authority') {
      // Categorize by stack type based on module ID
      const id = module.id;
      
      if (id.startsWith('frontend/')) {
        categories.frontend.push(module);
      } else if (id.startsWith('backend/')) {
        categories.backend.push(module);
      } else if (id.startsWith('database/')) {
        categories.database.push(module);
      } else if (id.startsWith('cloud/')) {
        categories.cloud.push(module);
      } else if (id.startsWith('testing/')) {
        categories.testing.push(module);
      } else if (id.startsWith('ci/')) {
        categories.ci.push(module);
      }
    }
  }

  return categories;
}

/**
 * Format module for display
 */
export function formatModuleOption(module: ModuleMetadata): {
  id: string;
  name: string;
  description: string;
  provides: string;
  aliases?: string[];
} {
  const provides: string[] = [];
  
  if (module.provides.rules.length > 0) {
    provides.push(`${module.provides.rules.length} rule${module.provides.rules.length > 1 ? 's' : ''}`);
  }
  if (module.provides.commands.length > 0) {
    provides.push(`${module.provides.commands.length} command${module.provides.commands.length > 1 ? 's' : ''}`);
  }
  if (module.provides.skills.length > 0) {
    provides.push(`${module.provides.skills.length} skill${module.provides.skills.length > 1 ? 's' : ''}`);
  }
  if (module.provides.agents.length > 0) {
    provides.push(`${module.provides.agents.length} agent${module.provides.agents.length > 1 ? 's' : ''}`);
  }
  if (module.provides.hooks.length > 0) {
    provides.push(`${module.provides.hooks.length} hook${module.provides.hooks.length > 1 ? 's' : ''}`);
  }

  return {
    id: module.id,
    name: module.name,
    description: module.description || 'No description',
    provides: provides.join(', '),
    ...(module.aliases && module.aliases.length > 0 ? { aliases: module.aliases } : {}),
  };
}

/**
 * Generate selection prompt with categorized modules
 */
export function generateSelectionPrompt(categories: SelectionCategories): string {
  const sections: string[] = [];

  sections.push('# Module Selection\n');
  sections.push('Select modules for your project. Enterprise standards are required.\n');

  // Enterprise Standards (required)
  sections.push('\n## Enterprise Standards (Required)\n');
  if (categories.enterprise.length > 0) {
    sections.push('These provide core workflow standards and are always included:\n');
    for (const module of categories.enterprise) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id || '""'}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('⚠️  No enterprise standards found in repository.\n');
  }

  // Project Controls (optional, multi-select)
  sections.push('\n## Project Controls (Optional)\n');
  if (categories.controls.length > 0) {
    sections.push('Choose quality and governance controls:\n');
    for (const module of categories.controls) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No project controls available.\n');
  }

  // Frontend (choose one or more)
  sections.push('\n## Frontend Framework (Choose one or more)\n');
  if (categories.frontend.length > 0) {
    for (const module of categories.frontend) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No frontend modules available.\n');
  }

  // Backend (choose one or more)
  sections.push('\n## Backend Framework (Choose one or more)\n');
  if (categories.backend.length > 0) {
    for (const module of categories.backend) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No backend modules available.\n');
  }

  // Database (choose one or more)
  sections.push('\n## Database (Choose one or more)\n');
  if (categories.database.length > 0) {
    for (const module of categories.database) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No database modules available.\n');
  }

  // Cloud (choose one)
  sections.push('\n## Cloud Provider (Choose one)\n');
  if (categories.cloud.length > 0) {
    for (const module of categories.cloud) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No cloud provider modules available.\n');
  }

  // Testing (optional)
  sections.push('\n## Testing (Optional)\n');
  if (categories.testing.length > 0) {
    for (const module of categories.testing) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No testing modules available.\n');
  }

  // CI/CD (optional)
  sections.push('\n## CI/CD (Optional)\n');
  if (categories.ci.length > 0) {
    for (const module of categories.ci) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No CI/CD modules available.\n');
  }

  sections.push('\n## Named project overlays (Optional)\n');
  if (categories.projects.length > 0) {
    sections.push(
      'Repo-specific rules/skills/hooks (e.g. TowerAI). Merged **after** stacks. Choose zero or more:\n'
    );
    for (const module of categories.projects) {
      const formatted = formatModuleOption(module);
      sections.push(`- **${formatted.name}** (ID: \`${formatted.id}\`)`);
      if (formatted.aliases?.length) {
        sections.push(`  Also accepted: ${formatted.aliases.map((a) => `\`${a}\``).join(', ')}`);
      }
      sections.push(`  ${formatted.description}`);
      sections.push(`  Provides: ${formatted.provides}\n`);
    }
  } else {
    sections.push('No named project modules in this repository.\n');
  }

  sections.push('\n---\n');
  sections.push('\n## How to Respond\n');
  sections.push('\nProvide your selection in JSON format:\n');
  sections.push('```json\n');
  sections.push('{\n');
  sections.push('  "enterprise": "",  // Always use empty string for enterprise-standards\n');
  sections.push('  "controls": ["base"],  // Array of control module IDs\n');
  sections.push('  "stacks": [  // Array of stack module IDs\n');
  sections.push('    "frontend/react-tailwind",\n');
  sections.push('    "backend/node-fastify",\n');
  sections.push('    "database/postgres",\n');
  sections.push('    "cloud/aws"\n');
  sections.push('  ],\n');
  sections.push('  "projects": []  // Optional: e.g. ["projects/towerai"] or ["towerai"] if the module lists aliases\n');
  sections.push('}\n');
  sections.push('```\n');

  return sections.join('');
}

/**
 * Validate user's module selection
 */
export function validateSelection(
  selection: ModuleChoices,
  availableModules: ModuleMetadata[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const moduleIds = buildAcceptedIdSet(availableModules);

  // Check enterprise is provided
  if (selection.enterprise === undefined || selection.enterprise === null) {
    errors.push('Enterprise standards module is required');
  } else if (!moduleIds.has(selection.enterprise)) {
    errors.push(`Enterprise module not found: "${selection.enterprise}"`);
  }

  // Check controls are valid (if any)
  for (const controlId of selection.controls || []) {
    if (!moduleIds.has(controlId)) {
      errors.push(`Control module not found: "${controlId}"`);
    }
  }

  // Check stacks are valid
  if (!selection.stacks || selection.stacks.length === 0) {
    errors.push('At least one stack module is required');
  } else {
    for (const stackId of selection.stacks) {
      if (!moduleIds.has(stackId)) {
        errors.push(`Stack module not found: "${stackId}"`);
      }
    }
  }

  for (const projectId of selection.projects || []) {
    if (!moduleIds.has(projectId)) {
      errors.push(
        `Project module not found: "${projectId}". Use the canonical id (e.g. projects/towerai) or a declared alias; named-project modules only exist in the module source you are reading (local clone vs remote cache).`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate selection summary
 */
export function generateSelectionSummary(
  selection: ModuleChoices,
  modules: ModuleMetadata[]
): string {
  const sections: string[] = [];
  const moduleMap = new Map<string, ModuleMetadata>();
  for (const m of modules) {
    moduleMap.set(m.id, m);
    for (const a of m.aliases || []) {
      moduleMap.set(a, m);
    }
  }

  sections.push('# Your Module Selection\n');

  // Enterprise
  const enterpriseModule = moduleMap.get(selection.enterprise);
  if (enterpriseModule) {
    sections.push('\n## Enterprise Standards\n');
    sections.push(`- ${enterpriseModule.name}\n`);
    const formatted = formatModuleOption(enterpriseModule);
    sections.push(`  ${formatted.provides}\n`);
  }

  // Controls
  if (selection.controls && selection.controls.length > 0) {
    sections.push('\n## Project Controls\n');
    for (const controlId of selection.controls) {
      const module = moduleMap.get(controlId);
      if (module) {
        sections.push(`- ${module.name}\n`);
        const formatted = formatModuleOption(module);
        sections.push(`  ${formatted.provides}\n`);
      }
    }
  }

  // Stacks
  sections.push('\n## Technology Stack\n');
  for (const stackId of selection.stacks || []) {
    const module = moduleMap.get(stackId);
    if (module) {
      sections.push(`- ${module.name} (\`${stackId}\`)\n`);
      const formatted = formatModuleOption(module);
      sections.push(`  ${formatted.provides}\n`);
    }
  }

  if (selection.projects && selection.projects.length > 0) {
    sections.push('\n## Named project overlays\n');
    for (const projectId of selection.projects) {
      const module = moduleMap.get(projectId);
      if (module) {
        sections.push(`- ${module.name} (\`${projectId}\`)\n`);
        const formatted = formatModuleOption(module);
        sections.push(`  ${formatted.provides}\n`);
      }
    }
  }

  // Total counts
  const allModules = [
    moduleMap.get(selection.enterprise),
    ...(selection.controls || []).map(id => moduleMap.get(id)),
    ...(selection.stacks || []).map(id => moduleMap.get(id)),
    ...(selection.projects || []).map(id => moduleMap.get(id)),
  ].filter(Boolean) as ModuleMetadata[];

  const totalRules = allModules.reduce((sum, m) => sum + m.provides.rules.length, 0);
  const totalCommands = allModules.reduce((sum, m) => sum + m.provides.commands.length, 0);
  const totalSkills = allModules.reduce((sum, m) => sum + m.provides.skills.length, 0);
  const totalAgents = allModules.reduce((sum, m) => sum + m.provides.agents.length, 0);
  const totalHooks = allModules.reduce((sum, m) => sum + m.provides.hooks.length, 0);

  sections.push('\n## Total Provides\n');
  sections.push(`- **${totalRules}** rules\n`);
  sections.push(`- **${totalCommands}** commands\n`);
  sections.push(`- **${totalSkills}** skills\n`);
  sections.push(`- **${totalAgents}** agents\n`);
  if (totalHooks > 0) {
    sections.push(`- **${totalHooks}** hooks\n`);
  }

  sections.push('\n---\n');
  sections.push('\nNext steps:\n');
  sections.push('1. Review this selection\n');
  sections.push('2. Use `diff_environment` to preview changes\n');
  sections.push('3. Use `install_environment` to apply\n');

  return sections.join('');
}

/**
 * Suggest common stack combinations
 */
export function suggestStackCombinations(categories: SelectionCategories): string {
  const sections: string[] = [];

  sections.push('# Common Stack Combinations\n');
  sections.push('\nHere are some popular technology stack combinations:\n');

  // Modern JavaScript Stack
  if (
    categories.frontend.some(m => m.id === 'frontend/react-tailwind') &&
    categories.backend.some(m => m.id === 'backend/node-fastify') &&
    categories.database.some(m => m.id === 'database/postgres') &&
    categories.cloud.some(m => m.id === 'cloud/aws')
  ) {
    sections.push('\n## Modern JavaScript Stack\n');
    sections.push('```json\n');
    sections.push('{\n');
    sections.push('  "enterprise": "",\n');
    sections.push('  "controls": ["base"],\n');
    sections.push('  "stacks": [\n');
    sections.push('    "frontend/react-tailwind",\n');
    sections.push('    "backend/node-fastify",\n');
    sections.push('    "database/postgres",\n');
    sections.push('    "cloud/aws"\n');
    sections.push('  ]\n');
    sections.push('}\n');
    sections.push('```\n');
    sections.push('**Use case:** Modern web application with React frontend and Node.js backend\n');
  }

  // Next.js Full Stack
  if (
    categories.frontend.some(m => m.id === 'frontend/next-tailwind') &&
    categories.backend.some(m => m.id === 'backend/node-fastify') &&
    categories.database.some(m => m.id === 'database/postgres')
  ) {
    sections.push('\n## Next.js Full Stack\n');
    sections.push('```json\n');
    sections.push('{\n');
    sections.push('  "enterprise": "",\n');
    sections.push('  "controls": ["base"],\n');
    sections.push('  "stacks": [\n');
    sections.push('    "frontend/next-tailwind",\n');
    sections.push('    "backend/node-fastify",\n');
    sections.push('    "database/postgres"\n');
    sections.push('  ]\n');
    sections.push('}\n');
    sections.push('```\n');
    sections.push('**Use case:** Server-rendered React application with API routes\n');
  }

  // Enterprise Java Stack
  if (
    categories.frontend.some(m => m.id === 'frontend/angular-tailwind') &&
    categories.backend.some(m => m.id === 'backend/java') &&
    categories.database.some(m => m.id === 'database/sqlserver') &&
    categories.cloud.some(m => m.id === 'cloud/gcp')
  ) {
    sections.push('\n## Enterprise Java Stack\n');
    sections.push('```json\n');
    sections.push('{\n');
    sections.push('  "enterprise": "",\n');
    sections.push('  "controls": ["base", "regulated"],\n');
    sections.push('  "stacks": [\n');
    sections.push('    "frontend/angular-tailwind",\n');
    sections.push('    "backend/java",\n');
    sections.push('    "database/sqlserver",\n');
    sections.push('    "cloud/gcp"\n');
    sections.push('  ]\n');
    sections.push('}\n');
    sections.push('```\n');
    sections.push('**Use case:** Enterprise application with Angular frontend and Java backend\n');
  }

  return sections.join('');
}
