/**
 * Smart Conflict Resolution
 * 
 * Provides interactive conflict resolution with diffs and merge strategies
 */

import { FileCollision } from '../types.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Conflict resolution strategy
 */
export type ResolutionStrategy = 
  | 'keep-existing'
  | 'use-new'
  | 'merge'
  | 'manual';

/**
 * Conflict resolution decision
 */
export interface ConflictResolution {
  path: string;
  strategy: ResolutionStrategy;
  content?: string; // For manual or merged content
}

/**
 * File diff information
 */
export interface FileDiff {
  path: string;
  existingContent: string;
  newContent: string;
  modules: string[];
  identical: boolean;
}

/**
 * Generate simple diff between two strings
 */
function generateSimpleDiff(existing: string, newContent: string): string {
  const existingLines = existing.split('\n');
  const newLines = newContent.split('\n');
  const maxLines = Math.max(existingLines.length, newLines.length);
  
  const diff: string[] = [];
  let changedLines = 0;
  
  for (let i = 0; i < maxLines; i++) {
    const existingLine = existingLines[i] || '';
    const newLine = newLines[i] || '';
    
    if (existingLine !== newLine) {
      changedLines++;
      if (existingLine) {
        diff.push(`- ${existingLine}`);
      }
      if (newLine) {
        diff.push(`+ ${newLine}`);
      }
    } else if (diff.length > 0 && diff.length < 100) {
      // Show context around changes
      diff.push(`  ${existingLine}`);
    }
  }
  
  return `Changed lines: ${changedLines}\n\n${diff.slice(0, 100).join('\n')}${diff.length > 100 ? '\n... (diff truncated)' : ''}`;
}

/**
 * Analyze collisions and generate detailed diff information
 */
export async function analyzeCollisions(
  projectPath: string,
  collisions: FileCollision[],
  newContents: Map<string, { content: string; sourceModule: string }>
): Promise<FileDiff[]> {
  const diffs: FileDiff[] = [];
  
  for (const collision of collisions) {
    try {
      // Read existing content
      const existingPath = join(projectPath, '.cursor', collision.path);
      let existingContent = '';
      try {
        existingContent = await readFile(existingPath, 'utf-8');
      } catch {
        // File doesn't exist yet
      }
      
      // Get new content
      const newData = newContents.get(collision.path);
      const newContent = newData?.content || '';
      
      // Check if contents are identical
      const identical = existingContent === newContent;
      
      diffs.push({
        path: collision.path,
        existingContent,
        newContent,
        modules: collision.modules,
        identical,
      });
    } catch (error) {
      // Skip files that can't be read
      console.error(`Error analyzing ${collision.path}:`, error);
    }
  }
  
  return diffs;
}

/**
 * Generate conflict report with diffs
 */
export function generateConflictReport(diffs: FileDiff[]): string {
  const sections: string[] = [];
  
  sections.push('# File Conflicts\n');
  sections.push(`Found ${diffs.length} file(s) with potential conflicts.\n`);
  
  for (const diff of diffs) {
    sections.push(`\n## ${diff.path}\n`);
    sections.push(`**Provided by:** ${diff.modules.map(m => `\`${m || '""'}\``).join(', ')}\n`);
    
    if (diff.identical) {
      sections.push('**Status:** ✅ Contents are identical (no conflict)\n');
    } else {
      sections.push('**Status:** ⚠️  Contents differ\n');
      sections.push('\n**Diff:**\n');
      sections.push('```diff');
      sections.push(generateSimpleDiff(diff.existingContent, diff.newContent));
      sections.push('```\n');
      
      sections.push('\n**Resolution options:**');
      sections.push('- `keep-existing`: Keep the current file');
      sections.push('- `use-new`: Use the new version from modules');
      sections.push('- `merge`: Attempt automatic merge (if possible)');
      sections.push('- `manual`: Manually edit after installation\n');
    }
  }
  
  sections.push('\n---\n');
  sections.push('\n## Next Steps\n');
  sections.push('\n1. Review each conflict above');
  sections.push('2. Decide resolution strategy for each file');
  sections.push('3. Provide resolution decisions to install_environment');
  sections.push('4. Or use automatic strategy: `keep-existing` or `use-new` for all\n');
  
  return sections.join('\n');
}

/**
 * Apply conflict resolutions
 */
export function applyConflictResolutions(
  resolutions: ConflictResolution[],
  newContents: Map<string, { content: string; sourceModule: string }>,
  existingContents: Map<string, string>
): Map<string, string> {
  const resolved = new Map<string, string>();
  
  for (const resolution of resolutions) {
    const newData = newContents.get(resolution.path);
    const existing = existingContents.get(resolution.path);
    
    switch (resolution.strategy) {
      case 'keep-existing':
        if (existing) {
          resolved.set(resolution.path, existing);
        }
        break;
        
      case 'use-new':
        if (newData) {
          resolved.set(resolution.path, newData.content);
        }
        break;
        
      case 'merge':
        // Simple merge: if one is empty, use the other
        if (!existing && newData) {
          resolved.set(resolution.path, newData.content);
        } else if (existing && !newData) {
          resolved.set(resolution.path, existing);
        } else if (existing && newData) {
          // Both exist - try to merge (for now, just use new)
          // TODO: Implement smart merge logic
          resolved.set(resolution.path, newData.content);
        }
        break;
        
      case 'manual':
        if (resolution.content) {
          resolved.set(resolution.path, resolution.content);
        }
        break;
    }
  }
  
  return resolved;
}

/**
 * Generate automatic resolution based on strategy
 */
export function generateAutoResolutions(
  diffs: FileDiff[],
  defaultStrategy: ResolutionStrategy
): ConflictResolution[] {
  return diffs
    .filter(diff => !diff.identical) // Skip identical files
    .map(diff => ({
      path: diff.path,
      strategy: defaultStrategy,
    }));
}

/**
 * Validate resolution decisions
 */
export function validateResolutions(
  resolutions: ConflictResolution[],
  diffs: FileDiff[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const diffPaths = new Set(diffs.map(d => d.path));
  
  for (const resolution of resolutions) {
    // Check if path exists in diffs
    if (!diffPaths.has(resolution.path)) {
      errors.push(`Resolution for unknown file: ${resolution.path}`);
    }
    
    // Check manual resolutions have content
    if (resolution.strategy === 'manual' && !resolution.content) {
      errors.push(`Manual resolution for ${resolution.path} missing content`);
    }
  }
  
  // Check all conflicts are resolved
  for (const diff of diffs) {
    if (!diff.identical && !resolutions.some(r => r.path === diff.path)) {
      errors.push(`No resolution provided for: ${diff.path}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Smart conflict detection with detailed analysis
 */
export interface SmartConflictAnalysis {
  conflicts: FileDiff[];
  report: string;
  autoResolvable: number;
  needsReview: number;
  suggestions: {
    path: string;
    suggestion: ResolutionStrategy;
    reason: string;
  }[];
}

/**
 * Analyze conflicts and provide smart suggestions
 */
export function analyzeConflictsSmart(diffs: FileDiff[]): SmartConflictAnalysis {
  const suggestions: SmartConflictAnalysis['suggestions'] = [];
  let autoResolvable = 0;
  let needsReview = 0;
  
  for (const diff of diffs) {
    if (diff.identical) {
      autoResolvable++;
      suggestions.push({
        path: diff.path,
        suggestion: 'use-new',
        reason: 'Contents are identical',
      });
    } else if (!diff.existingContent) {
      autoResolvable++;
      suggestions.push({
        path: diff.path,
        suggestion: 'use-new',
        reason: 'File does not exist yet',
      });
    } else if (!diff.newContent) {
      autoResolvable++;
      suggestions.push({
        path: diff.path,
        suggestion: 'keep-existing',
        reason: 'No new content to apply',
      });
    } else {
      needsReview++;
      
      // Suggest based on content size difference
      const existingSize = diff.existingContent.length;
      const newSize = diff.newContent.length;
      const sizeDiff = Math.abs(existingSize - newSize);
      
      if (sizeDiff < 100) {
        suggestions.push({
          path: diff.path,
          suggestion: 'merge',
          reason: 'Small difference, merge recommended',
        });
      } else if (newSize > existingSize * 2) {
        suggestions.push({
          path: diff.path,
          suggestion: 'use-new',
          reason: 'New version is significantly larger (more complete)',
        });
      } else {
        suggestions.push({
          path: diff.path,
          suggestion: 'manual',
          reason: 'Significant differences, manual review recommended',
        });
      }
    }
  }
  
  const report = generateConflictReport(diffs);
  
  return {
    conflicts: diffs,
    report,
    autoResolvable,
    needsReview,
    suggestions,
  };
}
