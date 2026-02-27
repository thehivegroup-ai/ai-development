/**
 * Environment validator
 * 
 * Validates .cursor/ environment structure and content
 */

import { stat, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { ValidationResult, ValidationIssue } from '../types.js';

/**
 * Check if a path exists
 */
async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if path is a directory
 */
async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Validate .cursor/ environment
 */
export async function validateEnvironment(
  projectPath: string,
  strict: boolean = false
): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const cursorPath = join(projectPath, '.cursor');

  // Check .cursor/ exists
  if (!(await pathExists(cursorPath))) {
    issues.push({
      code: 'MISSING_CURSOR_DIR',
      message: '.cursor/ directory not found',
      path: '.cursor',
      severity: 'error',
    });
    return { valid: false, issues, warnings };
  }

  if (!(await isDirectory(cursorPath))) {
    issues.push({
      code: 'CURSOR_NOT_DIR',
      message: '.cursor exists but is not a directory',
      path: '.cursor',
      severity: 'error',
    });
    return { valid: false, issues, warnings };
  }

  // Check required subdirectories
  const requiredDirs = ['rules', 'commands', 'skills', 'agents'];
  for (const dir of requiredDirs) {
    const dirPath = join(cursorPath, dir);
    if (!(await pathExists(dirPath))) {
      warnings.push({
        code: 'MISSING_SUBDIR',
        message: `Missing ${dir}/ subdirectory`,
        path: `.cursor/${dir}`,
        severity: 'warning',
      });
    } else if (!(await isDirectory(dirPath))) {
      issues.push({
        code: 'INVALID_SUBDIR',
        message: `${dir} exists but is not a directory`,
        path: `.cursor/${dir}`,
        severity: 'error',
      });
    }
  }

  // Validate skills have SKILL.md
  const skillsDir = join(cursorPath, 'skills');
  if (await isDirectory(skillsDir)) {
    const skillFolders = await readdir(skillsDir, { withFileTypes: true });
    for (const folder of skillFolders) {
      if (folder.isDirectory()) {
        const skillFile = join(skillsDir, folder.name, 'SKILL.md');
        if (!(await pathExists(skillFile))) {
          issues.push({
            code: 'MISSING_SKILL_FILE',
            message: `Skill folder missing SKILL.md`,
            path: `.cursor/skills/${folder.name}`,
            severity: 'error',
          });
        }
      }
    }
  }

  // Validate hooks configuration
  const hooksJson = join(cursorPath, 'hooks.json');
  if (await pathExists(hooksJson)) {
    try {
      const content = await readFile(hooksJson, 'utf-8');
      const config = JSON.parse(content);
      
      if (!config.version) {
        warnings.push({
          code: 'HOOKS_MISSING_VERSION',
          message: 'hooks.json is missing version field',
          path: '.cursor/hooks.json',
          severity: 'warning',
        });
      }
      
      // Validate referenced hook scripts exist
      if (config.hooks) {
        for (const [event, hooks] of Object.entries(config.hooks)) {
          if (Array.isArray(hooks)) {
            for (const hook of hooks as Array<{ command?: string }>) {
              if (hook.command && hook.command.startsWith('.cursor/hooks/')) {
                const scriptPath = join(projectPath, hook.command);
                if (!(await pathExists(scriptPath))) {
                  issues.push({
                    code: 'MISSING_HOOK_SCRIPT',
                    message: `Hook script not found: ${hook.command} (referenced in ${event})`,
                    path: hook.command,
                    severity: 'error',
                  });
                }
              }
            }
          }
        }
      }
    } catch {
      issues.push({
        code: 'INVALID_HOOKS_JSON',
        message: 'hooks.json is not valid JSON',
        path: '.cursor/hooks.json',
        severity: 'error',
      });
    }
  }

  // Check naming conventions
  const rulesDir = join(cursorPath, 'rules');
  if (await isDirectory(rulesDir)) {
    const rules = await readdir(rulesDir);
    for (const rule of rules) {
      if (!rule.endsWith('.mdc') && !rule.endsWith('.md')) {
        warnings.push({
          code: 'INVALID_RULE_EXTENSION',
          message: `Rule file should end with .mdc or .md`,
          path: `.cursor/rules/${rule}`,
          severity: 'warning',
        });
      }
    }
  }

  const commandsDir = join(cursorPath, 'commands');
  if (await isDirectory(commandsDir)) {
    const commands = await readdir(commandsDir);
    for (const command of commands) {
      if (!command.endsWith('.md')) {
        warnings.push({
          code: 'INVALID_COMMAND_EXTENSION',
          message: `Command file should end with .md`,
          path: `.cursor/commands/${command}`,
          severity: 'warning',
        });
      }
    }
  }

  // Check for stack.profile.json
  const profilePath = join(projectPath, 'stack.profile.json');
  if (!(await pathExists(profilePath))) {
    warnings.push({
      code: 'NO_PROFILE',
      message: 'stack.profile.json not found (recommended)',
      path: 'stack.profile.json',
      severity: 'warning',
    });
  } else {
    // Validate JSON
    try {
      const content = await readFile(profilePath, 'utf-8');
      JSON.parse(content);
    } catch {
      issues.push({
        code: 'INVALID_PROFILE',
        message: 'stack.profile.json is not valid JSON',
        path: 'stack.profile.json',
        severity: 'error',
      });
    }
  }

  // Check for cursor.lock.json
  const lockfilePath = join(projectPath, 'cursor.lock.json');
  if (!(await pathExists(lockfilePath))) {
    warnings.push({
      code: 'NO_LOCKFILE',
      message: 'cursor.lock.json not found (recommended)',
      path: 'cursor.lock.json',
      severity: 'warning',
    });
  } else {
    // Validate JSON
    try {
      const content = await readFile(lockfilePath, 'utf-8');
      const lockfile = JSON.parse(content);
      
      // Validate structure
      if (!lockfile.source || !lockfile.selection || !lockfile.generatedAt) {
        issues.push({
          code: 'INVALID_LOCKFILE',
          message: 'cursor.lock.json is missing required fields',
          path: 'cursor.lock.json',
          severity: 'error',
        });
      }
    } catch {
      issues.push({
        code: 'INVALID_LOCKFILE',
        message: 'cursor.lock.json is not valid JSON',
        path: 'cursor.lock.json',
        severity: 'error',
      });
    }
  }

  // In strict mode, warnings become errors
  if (strict) {
    issues.push(...warnings.map(w => ({ ...w, severity: 'error' as const })));
    return { valid: issues.length === 0, issues, warnings: [] };
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}
