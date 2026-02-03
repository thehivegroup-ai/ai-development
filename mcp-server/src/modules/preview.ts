/**
 * Rich Preview
 * 
 * Enhanced diff visualization and summary reporting
 */

import { InstallationPlan, ModuleMetadata } from '../types.js';

/**
 * File change summary
 */
export interface ChangesSummary {
  totalFiles: number;
  added: number;
  modified: number;
  removed: number;
  unchanged: number;
  byType: {
    rules: number;
    commands: number;
    skills: number;
    agents: number;
    other: number;
  };
}

/**
 * Module contribution summary
 */
export interface ModuleContribution {
  moduleId: string;
  moduleName: string;
  filesProvided: number;
  types: {
    rules: string[];
    commands: string[];
    skills: string[];
    agents: string[];
  };
}

/**
 * Categorize file by type
 */
function categorizeFile(path: string): 'rules' | 'commands' | 'skills' | 'agents' | 'other' {
  if (path.startsWith('rules/')) return 'rules';
  if (path.startsWith('commands/')) return 'commands';
  if (path.startsWith('skills/')) return 'skills';
  if (path.startsWith('agents/')) return 'agents';
  return 'other';
}

/**
 * Generate changes summary
 */
export function generateChangesSummary(plan: InstallationPlan): ChangesSummary {
  const summary: ChangesSummary = {
    totalFiles: plan.added.length + plan.modified.length + plan.removed.length + plan.unchanged.length,
    added: plan.added.length,
    modified: plan.modified.length,
    removed: plan.removed.length,
    unchanged: plan.unchanged.length,
    byType: {
      rules: 0,
      commands: 0,
      skills: 0,
      agents: 0,
      other: 0,
    },
  };

  const allChanges = [...plan.added, ...plan.modified, ...plan.removed];
  
  for (const file of allChanges) {
    const type = categorizeFile(file);
    summary.byType[type]++;
  }

  return summary;
}

/**
 * Generate tree view of changes
 */
export function generateTreeView(plan: InstallationPlan): string {
  const tree: string[] = [];
  
  // Group files by directory
  const byDirectory = new Map<string, string[]>();
  
  for (const file of [...plan.added, ...plan.modified, ...plan.unchanged]) {
    const parts = file.split('/');
    const dir = parts.length > 1 ? parts[0] : '.';
    
    if (!byDirectory.has(dir)) {
      byDirectory.set(dir, []);
    }
    byDirectory.get(dir)!.push(file);
  }

  // Generate tree
  tree.push('.cursor/');
  
  const sortedDirs = Array.from(byDirectory.keys()).sort();
  
  for (let i = 0; i < sortedDirs.length; i++) {
    const dir = sortedDirs[i];
    const files = byDirectory.get(dir)!.sort();
    const isLast = i === sortedDirs.length - 1;
    const dirPrefix = isLast ? '└──' : '├──';
    
    tree.push(`${dirPrefix} ${dir}/`);
    
    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      const fileName = file.split('/').pop() || file;
      const fileIsLast = j === files.length - 1;
      const filePrefix = isLast ? '    ' : '│   ';
      const connector = fileIsLast ? '└──' : '├──';
      
      // Add status indicator
      let indicator = ' ';
      if (plan.added.includes(file)) indicator = '+';
      else if (plan.modified.includes(file)) indicator = '~';
      else if (plan.removed.includes(file)) indicator = '-';
      
      tree.push(`${filePrefix}${connector} ${indicator} ${fileName}`);
    }
  }

  return tree.join('\n');
}

/**
 * Generate module contributions report
 */
export function generateModuleContributions(modules: ModuleMetadata[]): ModuleContribution[] {
  return modules.map(module => ({
    moduleId: module.id,
    moduleName: module.name,
    filesProvided:
      module.provides.rules.length +
      module.provides.commands.length +
      module.provides.skills.length +
      module.provides.agents.length,
    types: {
      rules: module.provides.rules,
      commands: module.provides.commands,
      skills: module.provides.skills,
      agents: module.provides.agents,
    },
  }));
}

/**
 * Generate rich preview report
 */
export function generateRichPreview(
  plan: InstallationPlan,
  modules: ModuleMetadata[]
): string {
  const summary = generateChangesSummary(plan);
  const contributions = generateModuleContributions(modules);
  const tree = generateTreeView(plan);

  const sections: string[] = [];

  sections.push('# Installation Preview\n');

  // Summary
  sections.push('## Summary\n');
  sections.push(`**Total Changes:** ${summary.totalFiles} files`);
  sections.push(`- ✅ ${summary.added} added`);
  sections.push(`- ⚠️  ${summary.modified} modified`);
  sections.push(`- ❌ ${summary.removed} removed`);
  sections.push(`- ⏭️  ${summary.unchanged} unchanged\n`);

  // By type
  sections.push('## Changes by Type\n');
  sections.push(`- **Rules:** ${summary.byType.rules} files`);
  sections.push(`- **Commands:** ${summary.byType.commands} files`);
  sections.push(`- **Skills:** ${summary.byType.skills} directories`);
  sections.push(`- **Agents:** ${summary.byType.agents} files`);
  if (summary.byType.other > 0) {
    sections.push(`- **Other:** ${summary.byType.other} files`);
  }
  sections.push('');

  // Module contributions
  sections.push('## Module Contributions\n');
  for (const contrib of contributions) {
    sections.push(`### ${contrib.moduleName} (\`${contrib.moduleId || '""'}\`)\n`);
    sections.push(`Provides ${contrib.filesProvided} files:`);
    
    if (contrib.types.rules.length > 0) {
      sections.push(`- **Rules:** ${contrib.types.rules.join(', ')}`);
    }
    if (contrib.types.commands.length > 0) {
      sections.push(`- **Commands:** ${contrib.types.commands.join(', ')}`);
    }
    if (contrib.types.skills.length > 0) {
      sections.push(`- **Skills:** ${contrib.types.skills.join(', ')}`);
    }
    if (contrib.types.agents.length > 0) {
      sections.push(`- **Agents:** ${contrib.types.agents.join(', ')}`);
    }
    sections.push('');
  }

  // File tree
  sections.push('## File Tree\n');
  sections.push('```');
  sections.push(tree);
  sections.push('```');
  sections.push('\n**Legend:** `+` added, `~` modified, `-` removed\n');

  // Detailed changes
  if (plan.added.length > 0) {
    sections.push('## Files to be Added\n');
    for (const file of plan.added) {
      sections.push(`- ${file}`);
    }
    sections.push('');
  }

  if (plan.modified.length > 0) {
    sections.push('## Files to be Modified\n');
    for (const file of plan.modified) {
      sections.push(`- ${file}`);
    }
    sections.push('');
  }

  if (plan.removed.length > 0) {
    sections.push('## Files to be Removed\n');
    for (const file of plan.removed) {
      sections.push(`- ${file}`);
    }
    sections.push('');
  }

  // Next steps
  sections.push('## Next Steps\n');
  sections.push('To proceed with installation:');
  sections.push('1. Review the changes above');
  sections.push('2. Ensure you have backups if needed');
  sections.push('3. Call `install_environment` with `dryRun: false`');
  sections.push('4. Or use `upgrade_environment` for automatic backup\n');

  return sections.join('\n');
}

/**
 * Generate compact summary (one-liner)
 */
export function generateCompactSummary(plan: InstallationPlan): string {
  return `${plan.added.length} added, ${plan.modified.length} modified, ${plan.removed.length} removed, ${plan.unchanged.length} unchanged`;
}

/**
 * Generate installation report (post-install)
 */
export function generateInstallationReport(
  plan: InstallationPlan,
  modules: ModuleMetadata[],
  duration: number
): string {
  const summary = generateChangesSummary(plan);
  const sections: string[] = [];

  sections.push('# Installation Complete ✅\n');

  sections.push('## Summary\n');
  sections.push(`**Duration:** ${duration}ms`);
  sections.push(`**Files Changed:** ${summary.added + summary.modified}`);
  sections.push(`**Modules Installed:** ${modules.length}\n`);

  sections.push('## What Was Installed\n');
  for (const module of modules) {
    sections.push(`- ${module.name} (\`${module.id || '""'}\`)`);
  }
  sections.push('');

  sections.push('## Next Steps\n');
  sections.push('1. Restart Cursor to load new rules and commands');
  sections.push('2. Type `/` to see available commands');
  sections.push('3. Check `.cursor/` directory for installed files');
  sections.push('4. Review `cursor.lock.json` for version tracking\n');

  return sections.join('\n');
}
