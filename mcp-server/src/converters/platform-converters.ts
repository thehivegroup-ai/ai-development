/**
 * Platform-specific converters for module installation
 * Handles format conversions between Cursor, Claude Code, and VS Code
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

export type Platform = 'cursor' | 'claude' | 'vscode';

export interface AgentFrontmatter {
  name?: string;
  description?: string;
  tools?: string | string[];
  model?: string;
  [key: string]: any;
}

export interface ParsedAgent {
  frontmatter: AgentFrontmatter;
  body: string;
}

export interface ConversionOptions {
  sourcePlatform?: Platform;
  targetPlatform: Platform;
  projectRoot: string;
}

// ============================================================================
// Agent Converters
// ============================================================================

/**
 * Parse agent file (AGENTS.md format with YAML frontmatter)
 */
export function parseAgent(content: string): ParsedAgent {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    // No frontmatter - return empty frontmatter with full content as body
    return {
      frontmatter: {} as AgentFrontmatter,
      body: content
    };
  }

  const [, frontmatterStr, body] = match;
  
  // Parse YAML frontmatter (simple parser)
  const frontmatter: AgentFrontmatter = {};
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value: any = line.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Convert agent to Cursor format (AGENTS.md standard)
 */
export function convertAgentToCursor(content: string): string {
  const { frontmatter, body } = parseAgent(content);
  
  // Cursor uses AGENTS.md format - already compatible
  // Just ensure tools is a string (not array)
  if (Array.isArray(frontmatter.tools)) {
    frontmatter.tools = frontmatter.tools.join(', ');
  }
  
  return `---
name: ${frontmatter.name}
description: ${frontmatter.description}${frontmatter.tools ? `
tools: ${frontmatter.tools}` : ''}${frontmatter.model ? `
model: ${frontmatter.model}` : ''}
---

${body}`;
}

/**
 * Convert agent to Claude Code format
 */
export function convertAgentToClaude(content: string): string {
  const { frontmatter, body } = parseAgent(content);
  
  // Claude Code uses similar format to Cursor
  // Tools should be comma-separated string
  let tools = frontmatter.tools;
  if (Array.isArray(tools)) {
    tools = tools.join(', ');
  }
  
  return `---
name: ${frontmatter.name}
description: ${frontmatter.description}${tools ? `
tools: "${tools}"` : ''}${frontmatter.model ? `
model: ${frontmatter.model}` : ''}
---

${body}`;
}

/**
 * Convert agent to VS Code format (.agent.md)
 */
export function convertAgentToVSCode(content: string): string {
  const { frontmatter, body } = parseAgent(content);
  
  // VS Code requires YAML array for tools and different tool names
  let tools: string[] = [];
  if (typeof frontmatter.tools === 'string') {
    tools = frontmatter.tools.split(',').map(t => t.trim());
  } else if (Array.isArray(frontmatter.tools)) {
    tools = frontmatter.tools;
  }
  
  // Map generic tool names to VS Code-specific names
  const mappedTools = tools.map(mapToolToVSCode);
  
  return `---
name: ${frontmatter.name}
description: ${frontmatter.description}
tools: [${mappedTools.map(t => `'${t}'`).join(', ')}]
user-invocable: true
disable-model-invocation: false${frontmatter.model ? `
model: ${frontmatter.model}` : ''}
---

${body}`;
}

/**
 * Map generic tool names to VS Code-specific tool names
 */
function mapToolToVSCode(tool: string): string {
  const mapping: Record<string, string> = {
    'Read': 'read/file',
    'Grep': 'search/codebase',
    'Glob': 'search/files',
    'Bash': 'terminal/execute',
    'Edit': 'edit/file',
    'Write': 'create/file',
    'web/fetch': 'web/fetch', // Already VS Code format
    'search/codebase': 'search/codebase', // Already VS Code format
  };
  
  return mapping[tool] || tool;
}

// ============================================================================
// Instructions Converters
// ============================================================================

/**
 * Convert base instructions to Cursor rules format
 */
export function convertInstructionsToCursorRules(
  instructions: string,
  metadata: { priority?: number; description?: string; alwaysApply?: boolean } = {}
): string {
  return `---
description: "${metadata.description || 'Enterprise standards'}"
alwaysApply: ${metadata.alwaysApply !== false}
---

${instructions}`;
}

/**
 * Convert base instructions to Claude Code format
 */
export function convertInstructionsToClaude(
  instructions: string,
  _applyTo: string = '**'
): string {
  // Claude Code CLAUDE.md doesn't need frontmatter for main file
  // But rules in .claude/rules/ do
  return instructions;
}

/**
 * Convert instructions to Claude Code rule format (for .claude/rules/)
 */
export function convertInstructionsToClaudeRule(
  instructions: string,
  applyTo: string = '**',
  name?: string
): string {
  return `---
paths:
  - "${applyTo}"${name ? `
name: ${name}` : ''}
---

${instructions}`;
}

/**
 * Convert base instructions to VS Code format
 */
export function convertInstructionsToVSCode(
  instructions: string,
  metadata: { name?: string; applyTo?: string } = {}
): string {
  return `---
name: '${metadata.name || 'Enterprise Standards'}'
description: 'Core development standards: hermeneutic solution framing, teleological planning, and quality gates'
applyTo: '${metadata.applyTo || '**'}'
---

${instructions}`;
}

// ============================================================================
// Hooks Converters
// ============================================================================

export interface HookConfig {
  type: string;
  command: string;
  timeout?: number;
  matcher?: string;
  cwd?: string;
  env?: Record<string, string>;
}

export interface CursorHooks {
  version?: number;
  hooks: {
    sessionStart?: HookConfig[];
    beforeShellExecution?: HookConfig[];
    afterFileEdit?: HookConfig[];
    afterShellExecution?: HookConfig[];
  };
}

export interface ClaudeHooks {
  hooks: {
    SessionStart?: HookConfig[];
    PreToolUse?: HookConfig[];
    PostToolUse?: HookConfig[];
    Stop?: HookConfig[];
  };
}

export interface VSCodeHooks {
  hooks: {
    SessionStart?: HookConfig[];
    PreToolUse?: HookConfig[];
    PostToolUse?: HookConfig[];
    Stop?: HookConfig[];
  };
}

/**
 * Convert Cursor hooks to Claude Code format
 */
export function convertHooksToClaude(cursorHooks: CursorHooks, targetDir: string): ClaudeHooks {
  const hooks = cursorHooks.hooks;
  
  return {
    hooks: {
      SessionStart: hooks.sessionStart?.map(h => ({
        ...h,
        command: h.command.replace('.cursor/', `${targetDir}/`)
      })),
      PreToolUse: hooks.beforeShellExecution?.map(h => ({
        ...h,
        command: h.command.replace('.cursor/', `${targetDir}/`),
        matcher: undefined // Claude uses tool_name field instead
      })),
      PostToolUse: hooks.afterFileEdit?.map(h => ({
        ...h,
        command: h.command.replace('.cursor/', `${targetDir}/`)
      })),
      Stop: hooks.afterShellExecution?.map(h => ({
        ...h,
        command: h.command.replace('.cursor/', `${targetDir}/`)
      }))
    }
  };
}

/**
 * Convert Cursor hooks to VS Code format
 */
export function convertHooksToVSCode(cursorHooks: CursorHooks, targetDir: string): VSCodeHooks {
  // VS Code uses same event names as Claude Code
  return convertHooksToClaude(cursorHooks, targetDir) as VSCodeHooks;
}

/**
 * Adjust hook paths for target platform
 */
export function adjustHookPaths(hooks: string, sourcePlatform: Platform, targetPlatform: Platform): string {
  const pathMappings: Record<Platform, string> = {
    cursor: '.cursor/',
    claude: '.claude/',
    vscode: '.github/'
  };
  
  const sourcePrefix = pathMappings[sourcePlatform];
  const targetPrefix = pathMappings[targetPlatform];
  
  return hooks.replace(new RegExp(sourcePrefix, 'g'), targetPrefix);
}

// ============================================================================
// Platform Detection
// ============================================================================

/**
 * Detect which AI platform is being used in a project
 */
export async function detectPlatform(projectRoot: string): Promise<Platform | null> {
  const checks = [
    { platform: 'cursor' as Platform, path: '.cursor' },
    { platform: 'claude' as Platform, path: '.claude/CLAUDE.md' },
    { platform: 'vscode' as Platform, path: '.github/copilot-instructions.md' }
  ];
  
  for (const check of checks) {
    try {
      await fs.access(path.join(projectRoot, check.path));
      return check.platform;
    } catch {
      // Path doesn't exist, continue
    }
  }
  
  // Default to Cursor if nothing detected
  return 'cursor';
}

// ============================================================================
// Exports
// ============================================================================

export const AgentConverters = {
  toCursor: convertAgentToCursor,
  toClaude: convertAgentToClaude,
  toVSCode: convertAgentToVSCode,
  parse: parseAgent
};

export const InstructionsConverters = {
  toCursorRules: convertInstructionsToCursorRules,
  toClaude: convertInstructionsToClaude,
  toClaudeRule: convertInstructionsToClaudeRule,
  toVSCode: convertInstructionsToVSCode
};

export const HooksConverters = {
  toClaude: convertHooksToClaude,
  toVSCode: convertHooksToVSCode,
  adjustPaths: adjustHookPaths
};
