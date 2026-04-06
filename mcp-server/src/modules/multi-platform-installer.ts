/**
 * Multi-platform module installer
 * Installs modules with platform-specific conversions
 * 
 * ARCHITECTURE NOTE:
 * - Reads FROM: modules/<module-name>/ (source: rules/, skills/, agents/, hooks.d/)
 * - Installs TO: target-project/.cursor/ (deployment target)
 * - The .cursor/ directory in ai-development repo is NOT used as source
 * 
 * Information flow:
 *   modules/enterprise-standards/rules/*.mdc
 *   → [this installer]
 *   → your-project/.cursor/rules/*.mdc
 * 
 * See docs/ARCHITECTURE-SOURCE-VS-DEPLOYMENT.md for details.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  Platform,
  AgentConverters,
  InstructionsConverters,
  HooksConverters,
  detectPlatform
} from '../converters/platform-converters.js';

// ============================================================================
// Types
// ============================================================================

export interface ModuleMetadata {
  id: string;
  category: string;
  name: string;
  description: string;
  version: string;
  provides: {
    agents?: string[];
    skills?: string[];
    instructions?: string;
    hooks?: string;
    docs?: string[];
  };
  platforms: {
    cursor?: PlatformConfig;
    claude?: PlatformConfig;
    vscode?: PlatformConfig;
  };
  tags: string[];
}

export interface PlatformConfig {
  rules?: string[];
  instructions?: string;
  installPath: string;
  priority?: string | number;
  applyTo?: string;
}

export interface InstallOptions {
  platform?: Platform;
  targetDir?: string;
  projectRoot: string;
  dryRun?: boolean;
  skipSymlinks?: boolean;
}

export interface InstallResult {
  success: boolean;
  platform: Platform;
  installedFiles: string[];
  symlinks: string[];
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Main Installation Functions
// ============================================================================

/**
 * Install module with auto-detected or specified platform
 */
export async function installModule(
  modulePath: string,
  options: InstallOptions
): Promise<InstallResult> {
  // Auto-detect platform if not specified
  const platform = options.platform || await detectPlatform(options.projectRoot) || 'cursor';
  
  // Load module metadata
  const metadata = await loadModuleMetadata(modulePath);
  
  // Get platform-specific configuration
  const platformConfig = metadata.platforms[platform];
  if (!platformConfig) {
    throw new Error(`Module does not support platform: ${platform}`);
  }
  
  const targetDir = options.targetDir || path.join(options.projectRoot, platformConfig.installPath);
  
  const result: InstallResult = {
    success: true,
    platform,
    installedFiles: [],
    symlinks: [],
    errors: [],
    warnings: []
  };
  
  try {
    // 1. Install agents
    if (metadata.provides.agents) {
      await installAgents(modulePath, metadata.provides.agents, {
        platform,
        targetDir: path.join(targetDir, 'agents'),
        dryRun: options.dryRun,
        result
      });
    }
    
    // 2. Install skills (symlink - already portable!)
    if (metadata.provides.skills) {
      await installSkills(modulePath, metadata.provides.skills, {
        targetDir: path.join(targetDir, 'skills'),
        skipSymlinks: options.skipSymlinks,
        dryRun: options.dryRun,
        result
      });
    }
    
    // 3. Install instructions/rules
    if (metadata.provides.instructions) {
      await installInstructions(modulePath, metadata, {
        platform,
        platformConfig,
        targetDir,
        dryRun: options.dryRun,
        result
      });
    }
    
    // 4. Install hooks
    if (metadata.provides.hooks) {
      await installHooks(modulePath, metadata.provides.hooks, {
        platform,
        targetDir,
        dryRun: options.dryRun,
        result
      });
    }
    
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
  }
  
  return result;
}

/**
 * Install module for Cursor platform
 */
export async function installModuleCursor(
  modulePath: string,
  options: Omit<InstallOptions, 'platform'>
): Promise<InstallResult> {
  return installModule(modulePath, { ...options, platform: 'cursor' });
}

/**
 * Install module for Claude Code platform
 */
export async function installModuleClaude(
  modulePath: string,
  options: Omit<InstallOptions, 'platform'>
): Promise<InstallResult> {
  return installModule(modulePath, { ...options, platform: 'claude' });
}

/**
 * Install module for VS Code platform
 */
export async function installModuleVSCode(
  modulePath: string,
  options: Omit<InstallOptions, 'platform'>
): Promise<InstallResult> {
  return installModule(modulePath, { ...options, platform: 'vscode' });
}

// ============================================================================
// Component Installers
// ============================================================================

/**
 * Install agents with platform-specific conversion
 */
async function installAgents(
  modulePath: string,
  agents: string[],
  options: {
    platform: Platform;
    targetDir: string;
    dryRun?: boolean;
    result: InstallResult;
  }
): Promise<void> {
  await ensureDir(options.targetDir, options.dryRun);
  
  for (const agentPath of agents) {
    const sourcePath = path.join(modulePath, agentPath);
    const agentName = path.basename(agentPath);
    
    // Convert filename for VS Code (.agent.md)
    const targetFilename = options.platform === 'vscode' 
      ? agentName.replace('.md', '.agent.md')
      : agentName;
    
    const targetPath = path.join(options.targetDir, targetFilename);
    
    try {
      const content = await fs.readFile(sourcePath, 'utf-8');
      
      // Convert based on target platform
      let convertedContent: string;
      switch (options.platform) {
        case 'cursor':
          convertedContent = AgentConverters.toCursor(content);
          break;
        case 'claude':
          convertedContent = AgentConverters.toClaude(content);
          break;
        case 'vscode':
          convertedContent = AgentConverters.toVSCode(content);
          break;
      }
      
      if (!options.dryRun) {
        await fs.writeFile(targetPath, convertedContent, 'utf-8');
      }
      
      options.result.installedFiles.push(targetPath);
      
    } catch (error) {
      options.result.errors.push(`Failed to install agent ${agentName}: ${error}`);
    }
  }
}

/**
 * Install skills (symlink or copy)
 */
async function installSkills(
  modulePath: string,
  skills: string[],
  options: {
    targetDir: string;
    skipSymlinks?: boolean;
    dryRun?: boolean;
    result: InstallResult;
  }
): Promise<void> {
  await ensureDir(options.targetDir, options.dryRun);
  
  for (const skillPath of skills) {
    const sourcePath = path.join(modulePath, skillPath);
    const skillName = path.basename(skillPath);
    const targetPath = path.join(options.targetDir, skillName);
    
    try {
      if (options.skipSymlinks) {
        // Copy directory
        if (!options.dryRun) {
          await copyDirectory(sourcePath, targetPath);
        }
        options.result.installedFiles.push(targetPath);
      } else {
        // Create symlink (skills are portable!)
        if (!options.dryRun) {
          await fs.symlink(sourcePath, targetPath, 'dir');
        }
        options.result.symlinks.push(targetPath);
      }
    } catch (error) {
      options.result.warnings.push(`Failed to install skill ${skillName}: ${error}`);
    }
  }
}

/**
 * Install instructions/rules with platform-specific conversion
 */
async function installInstructions(
  modulePath: string,
  metadata: ModuleMetadata,
  options: {
    platform: Platform;
    platformConfig: PlatformConfig;
    targetDir: string;
    dryRun?: boolean;
    result: InstallResult;
  }
): Promise<void> {
  const instructionsPath = path.join(modulePath, metadata.provides.instructions!);
  const baseInstructions = await fs.readFile(instructionsPath, 'utf-8');
  
  switch (options.platform) {
    case 'cursor':
      // Install Cursor rules
      if (options.platformConfig.rules) {
        const rulesDir = path.join(options.targetDir, 'rules');
        await ensureDir(rulesDir, options.dryRun);
        
        for (const rulePath of options.platformConfig.rules) {
          const ruleSource = path.join(modulePath, rulePath);
          const ruleName = path.basename(rulePath);
          const ruleTarget = path.join(rulesDir, ruleName);
          
          if (!options.dryRun) {
            await fs.copyFile(ruleSource, ruleTarget);
          }
          options.result.installedFiles.push(ruleTarget);
        }
      }
      break;
      
    case 'claude':
      // Generate CLAUDE.md from base instructions
      const claudeMdPath = path.join(options.targetDir, 'CLAUDE.md');
      const claudeContent = InstructionsConverters.toClaude(baseInstructions);
      
      if (!options.dryRun) {
        await fs.writeFile(claudeMdPath, claudeContent, 'utf-8');
      }
      options.result.installedFiles.push(claudeMdPath);
      break;
      
    case 'vscode':
      // Generate copilot-instructions.md from platform-specific instructions
      const vscodeInstructionsPath = path.join(modulePath, options.platformConfig.instructions || metadata.provides.instructions!);
      const vscodeInstructions = await fs.readFile(vscodeInstructionsPath, 'utf-8');
      const vscodeTargetPath = path.join(path.dirname(options.targetDir), 'copilot-instructions.md');
      
      if (!options.dryRun) {
        await fs.writeFile(vscodeTargetPath, vscodeInstructions, 'utf-8');
      }
      options.result.installedFiles.push(vscodeTargetPath);
      break;
  }
}

/**
 * Install hooks with platform-specific path adjustments
 */
async function installHooks(
  modulePath: string,
  hooksConfigPath: string,
  options: {
    platform: Platform;
    targetDir: string;
    dryRun?: boolean;
    result: InstallResult;
  }
): Promise<void> {
  const sourcePlatform = 'cursor'; // Assume source is cursor format
  
  // Read hooks configuration
  const hooksPath = path.join(modulePath, getHooksConfigForPlatform(options.platform, hooksConfigPath));
  let hooksContent: string;
  
  try {
    hooksContent = await fs.readFile(hooksPath, 'utf-8');
  } catch {
    // If platform-specific hooks don't exist, convert from base
    const baseHooksPath = path.join(modulePath, hooksConfigPath);
    hooksContent = await fs.readFile(baseHooksPath, 'utf-8');
    
    // Adjust paths
    hooksContent = HooksConverters.adjustPaths(hooksContent, sourcePlatform, options.platform);
  }
  
  // Write hooks configuration
  const targetHooksPath = getTargetHooksPath(options.platform, options.targetDir);
  
  if (!options.dryRun) {
    await ensureDir(path.dirname(targetHooksPath), false);
    await fs.writeFile(targetHooksPath, hooksContent, 'utf-8');
  }
  
  options.result.installedFiles.push(targetHooksPath);
  
  // Copy hook scripts
  const hooksDir = path.join(modulePath, 'hooks.d');
  const targetHooksDir = path.join(options.targetDir, 'hooks');
  
  try {
    await ensureDir(targetHooksDir, options.dryRun);
    
    if (!options.dryRun) {
      await copyDirectory(hooksDir, targetHooksDir);
    }
    
    options.result.installedFiles.push(targetHooksDir);
  } catch (error) {
    options.result.warnings.push(`Failed to copy hook scripts: ${error}`);
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Load module metadata from module.json
 */
async function loadModuleMetadata(modulePath: string): Promise<ModuleMetadata> {
  const metadataPath = path.join(modulePath, 'module.json');
  const content = await fs.readFile(metadataPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Ensure directory exists
 */
async function ensureDir(dir: string, dryRun?: boolean): Promise<void> {
  if (dryRun) return;
  
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

/**
 * Copy directory recursively
 */
async function copyDirectory(source: string, target: string): Promise<void> {
  await fs.mkdir(target, { recursive: true });
  
  const entries = await fs.readdir(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

/**
 * Get hooks configuration filename for platform
 */
function getHooksConfigForPlatform(platform: Platform, baseConfig: string): string {
  const platformSuffix: Record<Platform, string> = {
    cursor: '',
    claude: '.claude',
    vscode: '.vscode'
  };
  
  const baseName = baseConfig.replace('.json', '');
  const suffix = platformSuffix[platform];
  
  return suffix ? `${baseName}${suffix}.json` : baseConfig;
}

/**
 * Get target hooks path for platform
 */
function getTargetHooksPath(platform: Platform, targetDir: string): string {
  switch (platform) {
    case 'cursor':
      return path.join(targetDir, 'hooks.json');
    case 'claude':
      return path.join(targetDir, 'settings.json');
    case 'vscode':
      return path.join(targetDir, 'hooks', 'hooks.json');
  }
}
