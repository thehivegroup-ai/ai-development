/**
 * Core type definitions for the AI Development MCP Server
 */

/**
 * Git reference type - can be a branch, tag, or commit SHA
 */
export type GitRef = string;

/**
 * Commit SHA (resolved from a ref)
 */
export type CommitSha = string;

/**
 * Module category/domain
 */
export type ModuleCategory = 
  | 'enterprise-standards'
  | 'stack-authority'
  | 'project-control'
  /** Named app/repo overlay (e.g. projects/towerai), merged after stacks */
  | 'named-project';

/**
 * Module ID (e.g., "frontend/react-tailwind")
 */
export type ModuleId = string;

/**
 * Provides information - what files a module contains
 */
export interface ModuleProvides {
  rules: string[];
  commands: string[];
  skills: string[];
  agents: string[];
  hooks: string[];
}

/**
 * Module metadata
 */
export interface ModuleMetadata {
  id: ModuleId;
  /** Optional short names that resolve to this module (e.g. "towerai" for "projects/towerai") */
  aliases?: string[];
  category: ModuleCategory;
  name: string;
  description?: string;
  path: string;
  provides: ModuleProvides;
  requires?: ModuleId[];
  tags?: string[];
}

/**
 * Module manifest (optional module.json file)
 */
export interface ModuleManifest {
  id: ModuleId;
  /** Some manifests use `category` instead of `type`; scanner accepts both */
  type?: ModuleCategory;
  category?: ModuleCategory;
  name: string;
  description: string;
  provides: ModuleProvides;
  requires?: ModuleId[];
  tags?: string[];
  /** Alternate IDs accepted by tools (e.g. "towerai" for id "projects/towerai") */
  aliases?: string[];
}

/**
 * Git source information
 */
export interface GitSource {
  repoUrl: string;
  ref: GitRef;
  commitSha: CommitSha;
}

/**
 * Module selection for installation
 */
export interface ModuleSelection {
  enterprise: ModuleId;
  controls: ModuleId[];
  stacks: ModuleId[];
  /** Optional named project overlays (merged last), e.g. projects/towerai */
  projects?: ModuleId[];
}

/**
 * Stack profile (stack.profile.json)
 */
export interface StackProfile {
  enterprise: ModuleId;
  controls: ModuleId[];
  stacks: ModuleId[];
  projects?: ModuleId[];
}

/**
 * Cursor lockfile (cursor.lock.json)
 */
export interface CursorLockfile {
  source: GitSource;
  selection: ModuleSelection;
  generatedAt: string;
}

/**
 * File operation in a diff/plan
 */
export interface FileOperation {
  path: string;
  type: 'add' | 'modify' | 'remove' | 'unchanged';
  sourceModule?: ModuleId;
}

/**
 * Collision information
 */
export interface FileCollision {
  path: string;
  modules: ModuleId[];
}

/**
 * Installation plan
 */
export interface InstallationPlan {
  added: string[];
  modified: string[];
  removed: string[];
  unchanged: string[];
  collisions: FileCollision[];
}

/**
 * Validation issue
 */
export interface ValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: 'error' | 'warning';
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Composed module content (virtual file tree)
 */
export interface ComposedModule {
  files: Map<string, {
    content: string;
    sourceModule: ModuleId;
    /** Path relative to repo root (posix). When set, sync_manifest uses this instead of modulePath/cursor/… */
    repoSourcePath?: string;
  }>;
}
