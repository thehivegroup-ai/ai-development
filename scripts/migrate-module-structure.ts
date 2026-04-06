#!/usr/bin/env ts-node
/**
 * Migration Script: Convert Cursor-only modules to multi-platform structure
 * 
 * Usage:
 *   ./scripts/migrate-module-structure.ts <module-path>
 *   ./scripts/migrate-module-structure.ts --all
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';

// ============================================================================
// Types
// ============================================================================

interface MigrationResult {
  modulePath: string;
  success: boolean;
  changes: string[];
  errors: string[];
  warnings: string[];
}

interface ModuleStructure {
  hasAgents: boolean;
  hasSkills: boolean;
  hasRules: boolean;
  hasHooks: boolean;
  hasCommands: boolean;
}

// ============================================================================
// Main Migration Logic
// ============================================================================

async function migrateModule(modulePath: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    modulePath,
    success: true,
    changes: [],
    errors: [],
    warnings: []
  };
  
  console.log(`\n🔄 Migrating module: ${path.basename(modulePath)}`);
  console.log(`   Path: ${modulePath}\n`);
  
  try {
    // 1. Analyze current structure
    const structure = await analyzeModuleStructure(modulePath);
    console.log('📊 Current structure:', structure);
    
    // 2. Create new directory structure
    await createPlatformDirectories(modulePath, result);
    
    // 3. Copy agents to platform-agnostic location
    if (structure.hasAgents) {
      await migrateAgents(modulePath, result);
    }
    
    // 4. Create symlink for skills (already portable)
    if (structure.hasSkills) {
      await migrateSkills(modulePath, result);
    }
    
    // 5. Process rules
    if (structure.hasRules) {
      await migrateRules(modulePath, result);
    }
    
    // 6. Process hooks
    if (structure.hasHooks) {
      await migrateHooks(modulePath, result);
    }
    
    // 7. Create/update module.json
    await createModuleMetadata(modulePath, structure, result);
    
    // 8. Generate base instructions
    await generateBaseInstructions(modulePath, result);
    
    // 9. Generate platform-specific instructions
    await generatePlatformInstructions(modulePath, result);
    
    // 10. Create README
    await generateReadme(modulePath, result);
    
    console.log(`\n✅ Migration complete!`);
    console.log(`   Changes: ${result.changes.length}`);
    console.log(`   Warnings: ${result.warnings.length}`);
    console.log(`   Errors: ${result.errors.length}\n`);
    
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
    console.error(`\n❌ Migration failed: ${error}\n`);
  }
  
  return result;
}

// ============================================================================
// Analysis
// ============================================================================

async function analyzeModuleStructure(modulePath: string): Promise<ModuleStructure> {
  const cursorPath = path.join(modulePath, 'cursor');
  
  const structure: ModuleStructure = {
    hasAgents: false,
    hasSkills: false,
    hasRules: false,
    hasHooks: false,
    hasCommands: false
  };
  
  try {
    const entries = await fs.readdir(cursorPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        switch (entry.name) {
          case 'agents':
            structure.hasAgents = true;
            break;
          case 'skills':
            structure.hasSkills = true;
            break;
          case 'rules':
            structure.hasRules = true;
            break;
          case 'hooks':
            structure.hasHooks = true;
            break;
          case 'commands':
            structure.hasCommands = true;
            break;
        }
      } else if (entry.name === 'hooks.json') {
        structure.hasHooks = true;
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not analyze ${cursorPath}`);
  }
  
  return structure;
}

// ============================================================================
// Directory Creation
// ============================================================================

async function createPlatformDirectories(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  // Only create directories for platform-specific generated files
  // Don't create agents/, rules.cursor/, hooks.d/ - those will be symlinks
  const dirs = [
    'rules.claude',
    'rules.vscode'
  ];
  
  for (const dir of dirs) {
    const dirPath = path.join(modulePath, dir);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      result.changes.push(`Created directory: ${dir}/`);
    } catch (error) {
      // Directory might already exist
    }
  }
}

// ============================================================================
// Component Migration
// ============================================================================

async function migrateAgents(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  const targetPath = path.join(modulePath, 'agents');
  
  try {
    // Remove if exists (might be directory or symlink)
    try {
      const stats = await fs.lstat(targetPath);
      if (stats.isDirectory() && !stats.isSymbolicLink()) {
        await fs.rm(targetPath, { recursive: true, force: true });
      } else {
        await fs.unlink(targetPath);
      }
    } catch {}
    
    // Create symlink to cursor/agents (source of truth)
    await fs.symlink('cursor/agents', targetPath);
    result.changes.push('Created symlink: agents -> cursor/agents');
  } catch (error) {
    result.warnings.push(`Failed to create agents symlink: ${error}`);
  }
}

async function migrateSkills(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  const targetPath = path.join(modulePath, 'skills');
  
  try {
    // Remove if exists
    try {
      await fs.unlink(targetPath);
    } catch {}
    
    // Create symlink to cursor/skills (skills are portable!)
    await fs.symlink('cursor/skills', targetPath);
    result.changes.push('Created symlink: skills -> cursor/skills');
  } catch (error) {
    result.warnings.push(`Failed to create skills symlink: ${error}`);
  }
}

async function migrateRules(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  const targetPath = path.join(modulePath, 'rules.cursor');
  
  try {
    // Remove if exists (might be directory or symlink)
    try {
      const stats = await fs.lstat(targetPath);
      if (stats.isDirectory() && !stats.isSymbolicLink()) {
        await fs.rm(targetPath, { recursive: true, force: true });
      } else {
        await fs.unlink(targetPath);
      }
    } catch {}
    
    // Create symlink to cursor/rules (source of truth)
    await fs.symlink('cursor/rules', targetPath);
    result.changes.push('Created symlink: rules.cursor -> cursor/rules');
  } catch (error) {
    result.warnings.push(`Failed to create rules symlink: ${error}`);
  }
}

async function migrateHooks(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  // Symlink hooks.json
  try {
    const hooksJsonTarget = path.join(modulePath, 'hooks.json');
    
    // Remove if exists
    try {
      await fs.unlink(hooksJsonTarget);
    } catch {}
    
    // Create symlink to cursor/hooks.json (source of truth)
    await fs.symlink('cursor/hooks.json', hooksJsonTarget);
    result.changes.push('Created symlink: hooks.json -> cursor/hooks.json');
    
    // Generate platform-specific hooks
    const hooksContent = await fs.readFile(hooksJsonSource, 'utf-8');
    const hooks = JSON.parse(hooksContent);
    
    // Claude format
    const claudeHooks = convertHooksToClaude(hooks);
    await fs.writeFile(
      path.join(modulePath, 'hooks.claude.json'),
      JSON.stringify(claudeHooks, null, 2),
      'utf-8'
    );
    result.changes.push('Generated hooks.claude.json');
    
    // VS Code format
    const vscodeHooks = convertHooksToVSCode(hooks);
    await fs.writeFile(
      path.join(modulePath, 'hooks.vscode.json'),
      JSON.stringify(vscodeHooks, null, 2),
      'utf-8'
    );
    result.changes.push('Generated hooks.vscode.json');
    
  } catch (error) {
    result.warnings.push(`Failed to migrate hooks: ${error}`);
  }
  
  // Symlink hook scripts directory
  try {
    const hooksScriptsTarget = path.join(modulePath, 'hooks.d');
    
    // Remove if exists
    try {
      await fs.rm(hooksScriptsTarget, { recursive: true, force: true });
    } catch {}
    
    // Create symlink to cursor/hooks (source of truth)
    await fs.symlink('cursor/hooks', hooksScriptsTarget);
    result.changes.push('Created symlink: hooks.d -> cursor/hooks');
  } catch (error) {
    result.warnings.push(`Failed to create hooks.d symlink: ${error}`);
  }
}

// ============================================================================
// Metadata Generation
// ============================================================================

async function createModuleMetadata(
  modulePath: string,
  structure: ModuleStructure,
  result: MigrationResult
): Promise<void> {
  const moduleName = path.basename(modulePath);
  const category = inferCategory(modulePath);
  
  // List agents
  const agents: string[] = [];
  if (structure.hasAgents) {
    const agentsDir = path.join(modulePath, 'cursor/agents');
    const agentFiles = await fs.readdir(agentsDir);
    agents.push(...agentFiles.filter(f => f.endsWith('.md')).map(f => `cursor/agents/${f}`));
  }
  
  // List skills
  const skills: string[] = [];
  if (structure.hasSkills) {
    const skillsDir = path.join(modulePath, 'cursor/skills');
    const skillDirs = await fs.readdir(skillsDir, { withFileTypes: true });
    skills.push(...skillDirs.filter(d => d.isDirectory()).map(d => `cursor/skills/${d.name}`));
  }
  
  // List rules
  const cursorRules: string[] = [];
  if (structure.hasRules) {
    const rulesDir = path.join(modulePath, 'cursor/rules');
    const ruleFiles = await fs.readdir(rulesDir);
    cursorRules.push(...ruleFiles.filter(f => f.endsWith('.mdc')).map(f => `cursor/rules/${f}`));
  }
  
  const metadata = {
    id: moduleName,
    category,
    name: formatModuleName(moduleName),
    description: `Description for ${moduleName}`,
    version: '1.0.0',
    provides: {
      agents: agents.length > 0 ? agents : undefined,
      skills: skills.length > 0 ? skills : undefined,
      instructions: 'instructions.md',
      hooks: structure.hasHooks ? 'cursor/hooks.json' : undefined
    },
    platforms: {
      cursor: {
        rules: cursorRules,
        installPath: '.cursor/',
        priority: inferPriority(category)
      },
      claude: {
        instructions: 'instructions.md',
        installPath: '.claude/',
        applyTo: '**'
      },
      vscode: {
        instructions: 'instructions.vscode.md',
        installPath: '.github/',
        applyTo: '**'
      }
    },
    tags: inferTags(moduleName, category),
    dependencies: []
  };
  
  const metadataPath = path.join(modulePath, 'module.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  result.changes.push('Generated module.json');
}

async function generateBaseInstructions(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  const instructionsPath = path.join(modulePath, 'instructions.md');
  
  // Check if already exists
  try {
    await fs.access(instructionsPath);
    result.warnings.push('instructions.md already exists, skipping');
    return;
  } catch {}
  
  // Generate from rules if available
  const rulesPath = path.join(modulePath, 'cursor/rules');
  let content = `# ${formatModuleName(path.basename(modulePath))}\n\n`;
  content += `**Platform-Agnostic Instructions**\n\n`;
  content += `This file contains base instructions that apply across all platforms.\n\n`;
  
  try {
    const ruleFiles = await fs.readdir(rulesPath);
    
    for (const ruleFile of ruleFiles) {
      if (!ruleFile.endsWith('.mdc')) continue;
      
      const rulePath = path.join(rulesPath, ruleFile);
      const ruleContent = await fs.readFile(rulePath, 'utf-8');
      
      // Extract content (remove frontmatter)
      const contentMatch = ruleContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
      if (contentMatch) {
        content += `\n---\n\n${contentMatch[1]}`;
      } else {
        content += `\n---\n\n${ruleContent}`;
      }
    }
  } catch (error) {
    content += `\n## Instructions\n\nTo be documented.\n`;
  }
  
  await fs.writeFile(instructionsPath, content, 'utf-8');
  result.changes.push('Generated instructions.md');
}

async function generatePlatformInstructions(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  // VS Code instructions (compact version)
  const vscodeInstructionsPath = path.join(modulePath, 'instructions.vscode.md');
  
  const moduleName = formatModuleName(path.basename(modulePath));
  
  const vscodeContent = `---
name: '${moduleName}'
description: '${moduleName} development standards'
applyTo: '**'
---

# ${moduleName} for GitHub Copilot

To be documented - see instructions.md for full details.
`;
  
  await fs.writeFile(vscodeInstructionsPath, vscodeContent, 'utf-8');
  result.changes.push('Generated instructions.vscode.md');
}

async function generateReadme(
  modulePath: string,
  result: MigrationResult
): Promise<void> {
  const readmePath = path.join(modulePath, 'README-NEW.md');
  const moduleName = formatModuleName(path.basename(modulePath));
  
  const content = `# ${moduleName} Module

**Multi-Platform AI Development Module**

Compatible with **Cursor**, **Claude Code**, and **VS Code Copilot**.

## Structure

See module.json for complete module metadata.

## Installation

### Cursor
\`\`\`bash
install_module_cursor("${path.basename(modulePath)}")
\`\`\`

### Claude Code
\`\`\`bash
install_module_claude("${path.basename(modulePath)}")
\`\`\`

### VS Code
\`\`\`bash
install_module_vscode("${path.basename(modulePath)}")
\`\`\`

## What's Portable

- ✅ Skills - Agent Skills standard (100% portable)
- ✅ Agents - AGENTS.md format (95% portable, minor frontmatter)
- ✅ Hooks - Scripts portable, config needs path adjustment

## License

MIT
`;
  
  await fs.writeFile(readmePath, content, 'utf-8');
  result.changes.push('Generated README-NEW.md');
}

// ============================================================================
// Helper Functions
// ============================================================================

function convertHooksToClaude(cursorHooks: any): any {
  return {
    hooks: {
      SessionStart: cursorHooks.hooks.sessionStart?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.claude/')
      })),
      PreToolUse: cursorHooks.hooks.beforeShellExecution?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.claude/')
      })),
      PostToolUse: cursorHooks.hooks.afterFileEdit?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.claude/')
      })),
      Stop: cursorHooks.hooks.afterShellExecution?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.claude/')
      }))
    }
  };
}

function convertHooksToVSCode(cursorHooks: any): any {
  return {
    hooks: {
      SessionStart: cursorHooks.hooks.sessionStart?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.github/')
      })),
      PreToolUse: cursorHooks.hooks.beforeShellExecution?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.github/')
      })),
      PostToolUse: cursorHooks.hooks.afterFileEdit?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.github/')
      })),
      Stop: cursorHooks.hooks.afterShellExecution?.map((h: any) => ({
        ...h,
        command: h.command.replace('.cursor/', '.github/')
      }))
    }
  };
}

function inferCategory(modulePath: string): string {
  if (modulePath.includes('stack-authorities')) return 'stack-authority';
  if (modulePath.includes('enterprise-standards')) return 'enterprise-standard';
  if (modulePath.includes('project-controls')) return 'project-control';
  return 'module';
}

function inferPriority(category: string): string {
  switch (category) {
    case 'enterprise-standard': return '0-9';
    case 'stack-authority': return '20-49';
    case 'project-control': return '90-99';
    default: return '50';
  }
}

function inferTags(moduleName: string, category: string): string[] {
  const tags = [category];
  
  // Add technology tags based on module name
  const techTags: Record<string, string[]> = {
    react: ['frontend', 'react'],
    angular: ['frontend', 'angular'],
    vue: ['frontend', 'vue'],
    tailwind: ['css', 'tailwind'],
    fastapi: ['backend', 'python', 'api'],
    node: ['backend', 'nodejs'],
    java: ['backend', 'java'],
    postgres: ['database', 'sql'],
    mongodb: ['database', 'nosql'],
    aws: ['cloud', 'aws']
  };
  
  for (const [key, tech] of Object.entries(techTags)) {
    if (moduleName.includes(key)) {
      tags.push(...tech);
    }
  }
  
  return [...new Set(tags)];
}

function formatModuleName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// Recursive Module Finder
// ============================================================================

async function findModulesRecursively(basePath: string): Promise<string[]> {
  const modules: string[] = [];
  
  async function scan(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      // Check if current directory has a cursor/ subdirectory (is a module)
      const hasCursorDir = entries.some(e => e.isDirectory() && e.name === 'cursor');
      if (hasCursorDir) {
        modules.push(dirPath);
        return; // Don't scan subdirectories of a module
      }
      
      // Scan subdirectories
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await scan(path.join(dirPath, entry.name));
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  await scan(basePath);
  return modules;
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Migration Script: Convert Cursor-only modules to multi-platform structure

Usage:
  ./scripts/migrate-module-structure.ts <module-path>
  ./scripts/migrate-module-structure.ts --all
  ./scripts/migrate-module-structure.ts --dry-run <module-path>

Examples:
  ./scripts/migrate-module-structure.ts modules/enterprise-standards
  ./scripts/migrate-module-structure.ts --all
`);
    process.exit(0);
  }
  
  if (args[0] === '--all') {
    // Migrate all modules recursively
    const modulesPath = path.join(process.cwd(), 'modules');
    const modulePaths = await findModulesRecursively(modulesPath);
    
    console.log(`Found ${modulePaths.length} modules to migrate\n`);
    
    for (const modulePath of modulePaths) {
      await migrateModule(modulePath);
    }
  } else {
    // Migrate single module
    const modulePath = path.resolve(args[0]);
    await migrateModule(modulePath);
  }
}

main().catch(console.error);
