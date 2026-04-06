#!/usr/bin/env node

/**
 * AI Development MCP Server
 * 
 * Exposes tools and resources for managing AI development modules
 * (rules, commands, skills, agents) from a Git repository.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  resolveModuleSource,
  getGitContributionStatus,
} from './git/sourceResolver.js';
import { validateModuleSources } from './modules/moduleSourceValidation.js';
import { scanModules, findModule } from './modules/scanner.js';
import { ModuleMetadata } from './types.js';
import {
  listResources,
  parseResourceUri,
  readResource,
  generateModuleOverview,
} from './modules/resources.js';
import { composeModules, resolveSelection, normalizeSelectionIds } from './modules/composer.js';
import { diffEnvironment } from './modules/diff.js';
import {
  writeStackProfile,
  readLockfile,
  readStackProfile,
} from './modules/installer.js';
import { writeInstalledEnvironment } from './modules/syncManifest.js';
import { pushModuleUpdates, pullLatestAndRefreshProject } from './modules/repoSync.js';
import { validateEnvironment } from './modules/validator.js';
import {
  categorizeModules,
  generateSelectionPrompt,
  validateSelection,
  generateSelectionSummary,
  suggestStackCombinations,
  findModuleByIdOrAlias,
} from './tools/selector.js';
import {
  resolveDependencies,
  generateDependencySummary,
  validateDependencies,
} from './modules/dependencies.js';
import {
  analyzeCollisions,
  analyzeConflictsSmart,
  generateAutoResolutions,
  validateResolutions,
} from './modules/conflicts.js';
import {
  checkForUpdates,
  createBackup,
  listBackups,
  restoreBackup,
  generateChangelog,
  generateUpgradeSummary,
  validateUpgrade,
} from './modules/versions.js';
import {
  generateRichPreview,
  generateCompactSummary,
  generateInstallationReport,
} from './modules/preview.js';
import { buildContributionWorkflowPayload } from './tools/contributionWorkflow.js';

// Default configuration
const DEFAULT_REPO_URL = process.env.DEFAULT_REPO_URL || 
  'https://github.com/thehivegroup-ai/ai-development.git';
const DEFAULT_REF = process.env.DEFAULT_REF || 'main';

/**
 * When set, MCP reads modules from this ai-development clone (for editing / contribution)
 * instead of the read-only remote cache. Per-tool `localRepoPath` overrides this.
 */
function effectiveLocalRepoPath(explicit?: string | null): string | undefined {
  const trimmed = explicit?.trim();
  if (trimmed) return trimmed;
  const fromEnv = process.env.LOCAL_MODULES_REPO?.trim();
  if (fromEnv) return fromEnv;
  return undefined;
}

/**
 * Local ai-development clone used for push/pull sync (same machine as Cursor).
 * Often the same path as LOCAL_MODULES_REPO.
 */
function effectiveAiDevelopmentRepo(explicit?: string | null): string | undefined {
  const trimmed = explicit?.trim();
  if (trimmed) return trimmed;
  const fromEnv = process.env.AI_DEVELOPMENT_REPO?.trim() || process.env.LOCAL_MODULES_REPO?.trim();
  if (fromEnv) return fromEnv;
  return undefined;
}

// Cache for current repository state
let cachedRepoPath: string | null = null;
let cachedCommitSha: string | null = null;
let cachedModules: any[] | null = null;

/**
 * Create and configure the MCP server
 */
function createServer() {
  const server = new Server(
    {
      name: 'ai-development',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  /**
   * List available tools
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'list_modules',
        description: 'List all available modules in the AI development repository',
        inputSchema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'Git repository URL (defaults to configured repo)',
            },
            ref: {
              type: 'string',
              description: 'Git ref (branch, tag, or commit SHA)',
            },
            category: {
              type: 'string',
              enum: ['enterprise-standards', 'stack-authority', 'project-control', 'named-project'],
              description: 'Filter by module category (named-project = repo-specific overlays under modules/projects/)',
            },
            projectPath: {
              type: 'string',
              description:
                'Optional absolute path to an app repo. When set, the response includes stack.profile.json and cursor.lock.json summary if present (project awareness).',
            },
            forceRefresh: {
              type: 'boolean',
              description: 'Force refresh from remote (ignore cache)',
              default: false,
            },
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to a local ai-development clone (contains modules/). Uses LOCAL_MODULES_REPO env when omitted. Enables editing modules and testing installs from your working tree.',
            },
          },
        },
      },
      {
        name: 'select_modules',
        description: 'Interactive guide to help select modules for your project. Shows categorized options with descriptions and suggests common combinations.',
        inputSchema: {
          type: 'object',
          properties: {
            repoUrl: {
              type: 'string',
              description: 'Git repository URL (optional)',
            },
            ref: {
              type: 'string',
              description: 'Git ref (branch, tag, or commit SHA)',
            },
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to a local ai-development clone (contains modules/). Uses LOCAL_MODULES_REPO env when omitted.',
            },
            showSuggestions: {
              type: 'boolean',
              description: 'Show common stack combination suggestions',
              default: true,
            },
            validateOnly: {
              type: 'boolean',
              description: 'Only validate a provided selection, don\'t show full guide',
              default: false,
            },
            selection: {
              type: 'object',
              description: 'Module selection to validate (used with validateOnly)',
              properties: {
                enterprise: { type: 'string' },
                controls: { type: 'array', items: { type: 'string' } },
                stacks: { type: 'array', items: { type: 'string' } },
                projects: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional named project overlays (e.g. projects/towerai), merged last',
                },
              },
            },
          },
        },
      },
      {
        name: 'diff_environment',
        description: 'Preview what would change in a project without applying it',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project directory',
            },
            repoUrl: {
              type: 'string',
              description: 'Git repository URL (optional)',
            },
            ref: {
              type: 'string',
              description: 'Git ref (branch, tag, or commit SHA)',
            },
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to a local ai-development clone (contains modules/). Uses LOCAL_MODULES_REPO env when omitted.',
            },
            selection: {
              type: 'object',
              description: 'Module selection',
              properties: {
                enterprise: { type: 'string' },
                controls: { type: 'array', items: { type: 'string' } },
                stacks: { type: 'array', items: { type: 'string' } },
                projects: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional named project overlays (e.g. projects/towerai), merged after stacks',
                },
              },
              required: ['enterprise', 'controls', 'stacks'],
            },
          },
          required: ['projectPath', 'selection'],
        },
      },
      {
        name: 'install_environment',
        description: 'Install or update module configuration in a project',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project directory',
            },
            repoUrl: {
              type: 'string',
              description: 'Git repository URL (optional)',
            },
            ref: {
              type: 'string',
              description: 'Git ref (branch, tag, or commit SHA)',
            },
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to a local ai-development clone (contains modules/). Uses LOCAL_MODULES_REPO env when omitted.',
            },
            selection: {
              type: 'object',
              description: 'Module selection',
              properties: {
                enterprise: { type: 'string' },
                controls: { type: 'array', items: { type: 'string' } },
                stacks: { type: 'array', items: { type: 'string' } },
                projects: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional named project overlays (e.g. projects/towerai), merged after stacks',
                },
              },
              required: ['enterprise', 'controls', 'stacks'],
            },
            mode: {
              type: 'string',
              enum: ['merge', 'overwrite'],
              description: 'Installation mode (merge = keep existing, overwrite = replace all)',
              default: 'merge',
            },
            writeProfile: {
              type: 'boolean',
              description: 'Write stack.profile.json',
              default: true,
            },
            writeLockfile: {
              type: 'boolean',
              description: 'Write cursor.lock.json',
              default: true,
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview changes without applying',
              default: false,
            },
            conflictStrategy: {
              type: 'string',
              enum: ['ask', 'keep-existing', 'use-new', 'fail'],
              description: 'How to handle file conflicts (ask = return conflicts for user decision, keep-existing = auto keep current, use-new = auto use new, fail = abort on conflict)',
              default: 'ask',
            },
            conflictResolutions: {
              type: 'array',
              description: 'Specific resolution for each conflict (used after initial conflict analysis)',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  strategy: { 
                    type: 'string',
                    enum: ['keep-existing', 'use-new', 'merge', 'manual']
                  },
                  content: { type: 'string' }
                },
                required: ['path', 'strategy']
              }
            },
          },
          required: ['projectPath', 'selection'],
        },
      },
      {
        name: 'validate_environment',
        description: 'Validate project .cursor/ environment structure and consistency',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project directory',
            },
            strict: {
              type: 'boolean',
              description: 'Strict mode (warnings become errors)',
              default: false,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'update_environment',
        description: 'Update project environment based on existing lockfile or profile',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project directory',
            },
            repoUrl: {
              type: 'string',
              description: 'Git repository URL (optional, read from lockfile if omitted)',
            },
            ref: {
              type: 'string',
              description: 'Git ref (optional, read from lockfile if omitted)',
            },
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to a local ai-development clone (contains modules/). Uses LOCAL_MODULES_REPO env when omitted.',
            },
            mode: {
              type: 'string',
              enum: ['merge', 'overwrite'],
              description: 'Installation mode',
              default: 'merge',
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview changes without applying',
              default: false,
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'upgrade_environment',
        description: 'Upgrade environment to a new version with automatic backup and rollback capability',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project directory',
            },
            ref: {
              type: 'string',
              description: 'Target version (branch, tag, or commit SHA)',
            },
            createBackup: {
              type: 'boolean',
              description: 'Create backup before upgrading',
              default: true,
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview upgrade without applying',
              default: false,
            },
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to a local ai-development clone (contains modules/). Uses LOCAL_MODULES_REPO env when omitted.',
            },
          },
          required: ['projectPath', 'ref'],
        },
      },
      {
        name: 'rollback_environment',
        description: 'Rollback environment to a previous backup',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the project directory',
            },
            backupPath: {
              type: 'string',
              description: 'Path to backup (if omitted, uses most recent)',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'validate_module_sources',
        description:
          'Validate module.json files and layout under modules/ in a local ai-development clone. Use before opening a PR.',
        inputSchema: {
          type: 'object',
          properties: {
            repoRoot: {
              type: 'string',
              description:
                'Absolute path to the repository root (contains modules/). Defaults to LOCAL_MODULES_REPO when omitted.',
            },
          },
        },
      },
      {
        name: 'git_contribution_status',
        description:
          'Read-only git status for a local clone (branch, ahead/behind, short status). Does not commit or push; use your own git credentials in the terminal.',
        inputSchema: {
          type: 'object',
          properties: {
            localRepoPath: {
              type: 'string',
              description:
                'Absolute path to the ai-development clone. Defaults to LOCAL_MODULES_REPO when omitted.',
            },
          },
        },
      },
      {
        name: 'push_module_updates',
        description:
          'Copy changes from project .cursor/ into the local ai-development clone using ai-development.sync-manifest.json, then git commit and push (uses your existing git credentials).',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the app/dev project where install_environment wrote .cursor/',
            },
            commitMessage: {
              type: 'string',
              description: 'Git commit message for the clone',
            },
            scope: {
              type: 'string',
              enum: ['skills', 'all'],
              description: 'skills = only under .cursor/skills/; all = every file in the sync manifest',
              default: 'skills',
            },
            dryRun: {
              type: 'boolean',
              description: 'If true, only report paths that would be copied (no writes, no git)',
              default: false,
            },
            aiDevelopmentRepo: {
              type: 'string',
              description:
                'Absolute path to your ai-development clone. Defaults to AI_DEVELOPMENT_REPO or LOCAL_MODULES_REPO',
            },
            updateProjectLockfile: {
              type: 'boolean',
              description: 'After a successful push, update cursor.lock.json commitSha to match the clone HEAD',
              default: true,
            },
          },
          required: ['projectPath', 'commitMessage'],
        },
      },
      {
        name: 'sync_latest_environment',
        description:
          'git pull --ff-only in the local ai-development clone, then re-run install logic to refresh this project .cursor/ from the updated modules.',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Absolute path to the app/dev project',
            },
            aiDevelopmentRepo: {
              type: 'string',
              description:
                'Absolute path to your ai-development clone. Defaults to AI_DEVELOPMENT_REPO or LOCAL_MODULES_REPO',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'contribution_workflow',
        description:
          'Returns copy-paste git command outlines for updating modules in the repo using the user\'s existing Git credentials (SSH, credential helper, gh). Does not run git or store secrets.',
        inputSchema: {
          type: 'object',
          properties: {
            upstreamRepoUrl: {
              type: 'string',
              description: 'Upstream Git URL (defaults to DEFAULT_REPO_URL / configured env)',
            },
            branchName: {
              type: 'string',
              description: 'Branch to create (e.g. feat/add-java-module)',
            },
            localClonePath: {
              type: 'string',
              description:
                'Absolute path to your existing ai-development clone; fills in cd and push commands for that tree',
            },
            forkRemoteUrl: {
              type: 'string',
              description: 'Your fork clone URL (HTTPS or SSH); enables the fresh-clone scenario block',
            },
            defaultBranch: {
              type: 'string',
              description: 'Upstream default branch name (default: main)',
            },
          },
        },
      },
    ],
  }));

  /**
   * Handle tool calls
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'select_modules') {
      const repoUrl = (args?.repoUrl as string) || DEFAULT_REPO_URL;
      const ref = (args?.ref as string) || DEFAULT_REF;
      const showSuggestions = (args?.showSuggestions as boolean) ?? true;
      const validateOnly = (args?.validateOnly as boolean) || false;
      const selection = args?.selection as any;

      try {
        const localRepoPath = effectiveLocalRepoPath(args?.localRepoPath as string | undefined);
        const { localPath } = await resolveModuleSource({
          repoUrl,
          ref,
          localRepoPath,
        });

        // Scan for modules
        const modules = await scanModules(localPath);

        // If validate only mode
        if (validateOnly && selection) {
          const validation = validateSelection(selection, modules);
          
          if (!validation.valid) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      valid: false,
                      errors: validation.errors,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: true,
            };
          }

          // Generate summary for valid selection
          const selectedModules = [
            findModuleByIdOrAlias(modules, selection.enterprise),
            ...(selection.controls || []).map((id: string) => findModuleByIdOrAlias(modules, id)),
            ...(selection.stacks || []).map((id: string) => findModuleByIdOrAlias(modules, id)),
            ...(selection.projects || []).map((id: string) => findModuleByIdOrAlias(modules, id)),
          ].filter(Boolean) as ModuleMetadata[];
          
          // Resolve dependencies
          const depResolution = resolveDependencies(selectedModules, modules);
          const depValidation = validateDependencies(selectedModules, modules);
          
          // Check for dependency issues
          if (!depValidation.valid) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      valid: false,
                      selectionErrors: validation.errors,
                      dependencyErrors: depValidation.errors,
                      dependencyWarnings: depValidation.warnings,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: true,
            };
          }
          
          // Generate summaries
          const summary = generateSelectionSummary(selection, modules);
          const depSummary = generateDependencySummary(depResolution);
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    valid: true,
                    summary,
                    dependencySummary: depSummary,
                    resolvedModules: depResolution.resolved.map(m => m.id),
                    selection,
                    warnings: depValidation.warnings,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Interactive mode - show selection guide
        const categories = categorizeModules(modules);
        const prompt = generateSelectionPrompt(categories);
        const suggestions = showSuggestions ? suggestStackCombinations(categories) : '';

        return {
          content: [
            {
              type: 'text',
              text: prompt + (suggestions ? '\n\n' + suggestions : ''),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'list_modules') {
      const repoUrl = (args?.repoUrl as string) || DEFAULT_REPO_URL;
      const ref = (args?.ref as string) || DEFAULT_REF;
      const category = args?.category as string | undefined;
      const forceRefresh = (args?.forceRefresh as boolean) || false;
      const listProjectPath = (args?.projectPath as string | undefined)?.trim();

      try {
        const localRepoPath = effectiveLocalRepoPath(args?.localRepoPath as string | undefined);
        const { localPath, commitSha, source } = await resolveModuleSource({
          repoUrl,
          ref,
          forceRefresh,
          localRepoPath,
        });

        // Scan for modules
        let modules = await scanModules(localPath);

        // Filter by category if specified
        if (category) {
          modules = modules.filter((m) => m.category === category);
        }

        let namedProjectHint: string | undefined;
        if (category === 'named-project' && modules.length === 0) {
          namedProjectHint =
            'No named-project modules in this source snapshot. Named overlays live under modules/projects/<name>/ in the ai-development repo. Use localRepoPath (or LOCAL_MODULES_REPO) pointing at a clone that includes that folder, or ensure the commit you resolve (remote cache) contains modules/projects/…; try forceRefresh: true after upstream adds the module.';
        }

        let projectContext: Record<string, unknown> | undefined;
        if (listProjectPath) {
          const profile = await readStackProfile(listProjectPath);
          const lockfile = await readLockfile(listProjectPath);
          projectContext = {
            projectPath: listProjectPath,
            stackProfile: profile,
            cursorLockfile: lockfile
              ? {
                  repoUrl: lockfile.source.repoUrl,
                  ref: lockfile.source.ref,
                  selection: lockfile.selection,
                  generatedAt: lockfile.generatedAt,
                }
              : null,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  commitSha,
                  moduleSource: source,
                  repoUrl,
                  ref,
                  projectContext,
                  namedProjectHint,
                  modules: modules.map((m) => ({
                    id: m.id,
                    ...(m.aliases?.length ? { aliases: m.aliases } : {}),
                    category: m.category,
                    name: m.name,
                    description: m.description,
                    path: m.path,
                    provides: m.provides,
                    requires: m.requires,
                    tags: m.tags,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'diff_environment' || name === 'install_environment') {
      const projectPath = args?.projectPath as string;
      const repoUrl = (args?.repoUrl as string) || DEFAULT_REPO_URL;
      const ref = (args?.ref as string) || DEFAULT_REF;
      const rawSel = args?.selection as Record<string, unknown> | undefined;
      const selection = rawSel
        ? {
            enterprise: rawSel.enterprise as string,
            controls: (rawSel.controls as string[]) ?? [],
            stacks: (rawSel.stacks as string[]) ?? [],
            projects: (rawSel.projects as string[]) ?? [],
          }
        : undefined;
      const mode = (args?.mode as 'merge' | 'overwrite') || 'merge';
      const writeProfile = (args?.writeProfile as boolean) ?? true;
      const writeLockfileFlag = (args?.writeLockfile as boolean) ?? true;
      const dryRun = (args?.dryRun as boolean) || false;
      const conflictStrategy = (args?.conflictStrategy as 'ask' | 'keep-existing' | 'use-new' | 'fail') || 'ask';
      const conflictResolutions = args?.conflictResolutions as any[] | undefined;

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }
        if (!selection) {
          throw new Error('selection is required');
        }

        const localRepoPath = effectiveLocalRepoPath(args?.localRepoPath as string | undefined);
        const { localPath, commitSha } = await resolveModuleSource({
          repoUrl,
          ref,
          localRepoPath,
        });

        const selectionNormalized = await normalizeSelectionIds(localPath, selection);

        // Scan all modules for dependency resolution
        const allModules = await scanModules(localPath);

        // Resolve selection to modules
        const selectedModules = await resolveSelection(localPath, selectionNormalized);
        
        // Resolve dependencies
        const depResolution = resolveDependencies(selectedModules, allModules);
        const depValidation = validateDependencies(selectedModules, allModules);
        
        // Check for dependency issues
        if (!depValidation.valid) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    error: 'Dependency resolution failed',
                    errors: depValidation.errors,
                    warnings: depValidation.warnings,
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
        
        // Use resolved modules (includes dependencies)
        const modules = depResolution.resolved;

        // Compose modules
        const { composed, collisions } = await composeModules(localPath, modules);

        // Handle collisions with smart conflict resolution
        if (collisions.length > 0) {
          // Analyze collisions in detail
          const diffs = await analyzeCollisions(projectPath, collisions, composed.files);
          const analysis = analyzeConflictsSmart(diffs);
          
          // Handle based on conflict strategy
          if (conflictStrategy === 'fail') {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      error: 'Conflicts detected (strategy: fail)',
                      conflicts: analysis.conflicts.length,
                      report: analysis.report,
                    },
                    null,
                    2
                  ),
                },
              ],
              isError: true,
            };
          }
          
          // If user provided specific resolutions, apply them
          if (conflictResolutions && conflictResolutions.length > 0) {
            const validation = validateResolutions(conflictResolutions, diffs);
            if (!validation.valid) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(
                      {
                        error: 'Invalid conflict resolutions',
                        errors: validation.errors,
                      },
                      null,
                      2
                    ),
                  },
                ],
                isError: true,
              };
            }
            
            // Apply resolutions (implementation would update composed.files)
            // For now, just proceed with installation
          } else if (conflictStrategy === 'ask') {
            // Return conflict analysis for user decision
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      conflicts: true,
                      analysis: {
                        total: analysis.conflicts.length,
                        autoResolvable: analysis.autoResolvable,
                        needsReview: analysis.needsReview,
                      },
                      report: analysis.report,
                      suggestions: analysis.suggestions,
                      message: 'Conflicts detected. Review and provide conflict resolutions, or use conflictStrategy: "keep-existing" or "use-new" for automatic resolution.',
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          } else {
            // Auto-resolve based on strategy
            generateAutoResolutions(diffs, conflictStrategy);
            // Apply auto-resolutions (implementation would update composed.files)
            // For now, proceed with warning
          }
        }

        // Generate diff
        const plan = await diffEnvironment(projectPath, composed);
        plan.collisions = collisions;

        // Generate rich preview
        const richPreview = generateRichPreview(plan, modules);
        const compactSummary = generateCompactSummary(plan);

        // If diff_environment or dryRun, return plan with rich preview
        if (name === 'diff_environment' || dryRun) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    commitSha,
                    repoUrl,
                    ref,
                    selectionResolved: selectionNormalized,
                    summary: compactSummary,
                    preview: richPreview,
                    plan,
                    applied: false,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Apply installation
        const startTime = Date.now();
        await writeInstalledEnvironment(
          projectPath,
          composed,
          mode,
          { repoUrl, ref, commitSha },
          selectionNormalized,
          modules,
          { writeLockfile: writeLockfileFlag }
        );
        const duration = Date.now() - startTime;

        if (writeProfile) {
          await writeStackProfile(projectPath, selectionNormalized);
        }

        // Generate installation report
        const report = generateInstallationReport(plan, modules, duration);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  commitSha,
                  repoUrl,
                  ref,
                  summary: compactSummary,
                  report,
                  plan,
                  applied: true,
                  message: 'Installation completed successfully',
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'validate_environment') {
      const projectPath = args?.projectPath as string;
      const strict = (args?.strict as boolean) || false;

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }

        const result = await validateEnvironment(projectPath, strict);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'update_environment') {
      const projectPath = args?.projectPath as string;
      let repoUrl = args?.repoUrl as string | undefined;
      let ref = args?.ref as string | undefined;
      const mode = (args?.mode as 'merge' | 'overwrite') || 'merge';
      const dryRun = (args?.dryRun as boolean) || false;

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }

        // Try to read lockfile first
        const lockfile = await readLockfile(projectPath);
        if (lockfile) {
          repoUrl = repoUrl || lockfile.source.repoUrl;
          ref = ref || lockfile.source.ref;
        } else {
          // Fall back to defaults
          repoUrl = repoUrl || DEFAULT_REPO_URL;
          ref = ref || DEFAULT_REF;
        }

        // Read profile for selection
        const profile = await readStackProfile(projectPath);
        if (!profile) {
          throw new Error('stack.profile.json not found. Cannot determine module selection.');
        }

        const selection = {
          enterprise: profile.enterprise,
          controls: profile.controls,
          stacks: profile.stacks,
          projects: profile.projects ?? [],
        };

        const localRepoPath = effectiveLocalRepoPath(args?.localRepoPath as string | undefined);
        const { localPath, commitSha } = await resolveModuleSource({
          repoUrl,
          ref,
          localRepoPath,
        });

        const selectionNormalized = await normalizeSelectionIds(localPath, selection);

        // Scan all modules for dependency resolution
        const allModules = await scanModules(localPath);

        // Resolve selection to modules
        const selectedModules = await resolveSelection(localPath, selectionNormalized);
        
        // Resolve dependencies
        const depResolution = resolveDependencies(selectedModules, allModules);
        const depValidation = validateDependencies(selectedModules, allModules);
        
        // Check for dependency issues
        if (!depValidation.valid) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    error: 'Dependency resolution failed',
                    errors: depValidation.errors,
                    warnings: depValidation.warnings,
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }
        
        // Use resolved modules (includes dependencies)
        const modules = depResolution.resolved;

        // Compose modules
        const { composed, collisions } = await composeModules(localPath, modules);

        // Check for collisions
        if (collisions.length > 0) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    error: 'Collision detected',
                    collisions: collisions.map((c) => ({
                      path: c.path,
                      modules: c.modules,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
            isError: true,
          };
        }

        // Generate diff
        const plan = await diffEnvironment(projectPath, composed);
        plan.collisions = collisions;

        // If dryRun, return plan only
        if (dryRun) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    commitSha,
                    repoUrl,
                    ref,
                    plan,
                    applied: false,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        await writeInstalledEnvironment(
          projectPath,
          composed,
          mode,
          { repoUrl, ref, commitSha },
          selectionNormalized,
          modules,
          { writeLockfile: true }
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  commitSha,
                  repoUrl,
                  ref,
                  plan,
                  applied: true,
                  message: 'Update completed successfully',
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'upgrade_environment') {
      const projectPath = args?.projectPath as string;
      const ref = args?.ref as string;
      const createBackupFlag = (args?.createBackup as boolean) ?? true;
      const dryRun = (args?.dryRun as boolean) || false;

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }
        if (!ref) {
          throw new Error('ref is required');
        }

        // Read current lockfile
        const currentLockfile = await readLockfile(projectPath);
        if (!currentLockfile) {
          throw new Error('cursor.lock.json not found. Use install_environment first.');
        }

        const localRepoPath = effectiveLocalRepoPath(args?.localRepoPath as string | undefined);
        const { localPath, commitSha } = await resolveModuleSource({
          repoUrl: currentLockfile.source.repoUrl,
          ref,
          localRepoPath,
        });

        // Check for updates
        const comparison = checkForUpdates(
          currentLockfile.source,
          ref,
          commitSha
        );

        // Validate upgrade
        const validation = validateUpgrade(currentLockfile, {
          repoUrl: currentLockfile.source.repoUrl,
          ref,
          commitSha,
        });

        // Generate changelog
        const changelog = generateChangelog(currentLockfile, {
          repoUrl: currentLockfile.source.repoUrl,
          ref,
          commitSha,
        });

        // If dry run, return summary
        if (dryRun) {
          const summary = generateUpgradeSummary(comparison, changelog);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    dryRun: true,
                    comparison,
                    validation,
                    summary,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Create backup
        let backupPath: string | undefined;
        if (createBackupFlag) {
          backupPath = await createBackup(projectPath, {
            timestamp: new Date().toISOString(),
            source: currentLockfile.source,
            reason: `Pre-upgrade backup (${currentLockfile.source.ref} → ${ref})`,
          });
        }

        // Perform update (reuse update_environment logic)
        const profile = await readStackProfile(projectPath);
        if (!profile) {
          throw new Error('stack.profile.json not found');
        }

        const selection = {
          enterprise: profile.enterprise,
          controls: profile.controls,
          stacks: profile.stacks,
          projects: profile.projects ?? [],
        };

        const selectionNormalized = await normalizeSelectionIds(localPath, selection);

        // Scan all modules
        const allModules = await scanModules(localPath);

        // Resolve selection
        const selectedModules = await resolveSelection(localPath, selectionNormalized);

        // Resolve dependencies
        const depResolution = resolveDependencies(selectedModules, allModules);

        const { composed } = await composeModules(localPath, depResolution.resolved);
        await writeInstalledEnvironment(
          projectPath,
          composed,
          'merge',
          { repoUrl: currentLockfile.source.repoUrl, ref, commitSha },
          selectionNormalized,
          depResolution.resolved,
          { writeLockfile: true }
        );

        const summary = generateUpgradeSummary(comparison, changelog, backupPath);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  comparison,
                  backupPath,
                  summary,
                  message: 'Upgrade completed successfully',
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'rollback_environment') {
      const projectPath = args?.projectPath as string;
      const backupPath = args?.backupPath as string | undefined;

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }

        // List backups
        const backups = await listBackups(projectPath);

        if (backups.length === 0) {
          throw new Error('No backups found');
        }

        // Use specified backup or most recent
        const targetBackup = backupPath
          ? backups.find(b => b.path === backupPath)
          : backups[0];

        if (!targetBackup) {
          throw new Error(`Backup not found: ${backupPath}`);
        }

        // Restore backup
        await restoreBackup(projectPath, targetBackup.path);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  restored: targetBackup.path,
                  metadata: targetBackup.metadata,
                  message: 'Rollback completed successfully',
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    if (name === 'validate_module_sources') {
      const repoRoot =
        (args?.repoRoot as string | undefined)?.trim() || effectiveLocalRepoPath(undefined);
      try {
        if (!repoRoot) {
          throw new Error('repoRoot is required, or set LOCAL_MODULES_REPO in the MCP server environment');
        }
        const result = await validateModuleSources(repoRoot);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    }

    if (name === 'git_contribution_status') {
      const localRepoPath = effectiveLocalRepoPath(args?.localRepoPath as string | undefined);
      try {
        if (!localRepoPath) {
          throw new Error(
            'localRepoPath is required, or set LOCAL_MODULES_REPO in the MCP server environment'
          );
        }
        const status = await getGitContributionStatus(localRepoPath);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    }

    if (name === 'push_module_updates') {
      const projectPath = args?.projectPath as string;
      const commitMessage = args?.commitMessage as string;
      const scope = (args?.scope as 'skills' | 'all') || 'skills';
      const dryRun = (args?.dryRun as boolean) || false;
      const aiDevelopmentRepo = effectiveAiDevelopmentRepo(args?.aiDevelopmentRepo as string | undefined);
      const updateProjectLockfile = (args?.updateProjectLockfile as boolean) ?? true;

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }
        if (!commitMessage) {
          throw new Error('commitMessage is required');
        }
        if (!aiDevelopmentRepo) {
          throw new Error(
            'aiDevelopmentRepo is required, or set AI_DEVELOPMENT_REPO (or LOCAL_MODULES_REPO) to your ai-development clone path'
          );
        }

        const result = await pushModuleUpdates({
          projectPath,
          aiDevelopmentRepo,
          commitMessage,
          scope,
          dryRun,
          updateProjectLockfile,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    }

    if (name === 'sync_latest_environment') {
      const projectPath = args?.projectPath as string;
      const aiDevelopmentRepo = effectiveAiDevelopmentRepo(args?.aiDevelopmentRepo as string | undefined);

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }
        if (!aiDevelopmentRepo) {
          throw new Error(
            'aiDevelopmentRepo is required, or set AI_DEVELOPMENT_REPO (or LOCAL_MODULES_REPO) to your ai-development clone path'
          );
        }

        const result = await pullLatestAndRefreshProject({
          projectPath,
          aiDevelopmentRepo,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    }

    if (name === 'contribution_workflow') {
      const upstreamRepoUrl = (args?.upstreamRepoUrl as string) || DEFAULT_REPO_URL;
      const payload = buildContributionWorkflowPayload({
        upstreamRepoUrl,
        branchName: args?.branchName as string | undefined,
        localClonePath: args?.localClonePath as string | undefined,
        forkRemoteUrl: args?.forkRemoteUrl as string | undefined,
        defaultBranch: args?.defaultBranch as string | undefined,
      });

      const envelope = {
        ...payload,
        moduleSourceOfTruth:
          'Canonical content lives under modules/ in the ai-development repo (not .cursor/ in that repo for distribution).',
        mcpSetup: {
          LOCAL_MODULES_REPO:
            'Set to your clone root so list_modules / install_environment read your edits; restart Cursor after changing env.',
        },
        validateWithMcp: [
          'validate_module_sources (repoRoot or LOCAL_MODULES_REPO)',
          'install_environment with localRepoPath against a test project',
        ],
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(envelope, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  });

  /**
   * List available resources
   */
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      const localRepoPath = effectiveLocalRepoPath(undefined);
      const { localPath, commitSha, source } = await resolveModuleSource({
        repoUrl: DEFAULT_REPO_URL,
        ref: DEFAULT_REF,
        localRepoPath,
      });
      const needRefresh =
        !cachedRepoPath ||
        cachedRepoPath !== localPath ||
        !cachedModules ||
        source === 'local';
      if (needRefresh) {
        cachedRepoPath = localPath;
        cachedCommitSha = commitSha;
        cachedModules = await scanModules(localPath);
      }

      if (!cachedModules || !cachedRepoPath) {
        throw new Error('Failed to load modules');
      }

      const resources = listResources(cachedModules);

      return {
        resources: resources.map((r) => ({
          uri: r.uri,
          name: r.name,
          description: r.description,
          mimeType: r.mimeType,
        })),
      };
    } catch (error) {
      console.error('Error listing resources:', error);
      return { resources: [] };
    }
  });

  /**
   * Read resource content
   */
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    try {
      // Parse the URI
      const parsed = parseResourceUri(uri);
      if (!parsed) {
        throw new Error(`Invalid resource URI: ${uri}`);
      }

      const localRepoPath = effectiveLocalRepoPath(undefined);
      const { localPath, commitSha, source } = await resolveModuleSource({
        repoUrl: DEFAULT_REPO_URL,
        ref: DEFAULT_REF,
        localRepoPath,
      });
      const needRefresh =
        !cachedRepoPath ||
        cachedRepoPath !== localPath ||
        !cachedModules ||
        source === 'local';
      if (needRefresh) {
        cachedRepoPath = localPath;
        cachedCommitSha = commitSha;
        cachedModules = await scanModules(localPath);
      }

      if (!cachedModules || !cachedRepoPath) {
        throw new Error('Failed to load modules');
      }

      // Handle different resource types
      if (!parsed.moduleId) {
        // List all modules
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  commitSha: cachedCommitSha ?? commitSha,
                  modules: cachedModules.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    category: m.category,
                    description: m.description,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Find the module
      const module = await findModule(cachedRepoPath, parsed.moduleId);
      if (!module) {
        throw new Error(`Module not found: ${parsed.moduleId}`);
      }

      // Module overview
      if (!parsed.type) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: generateModuleOverview(module),
            },
          ],
        };
      }

      // Read specific content
      if (!parsed.filename) {
        // List content of this type
        const items = module.provides[parsed.type] || [];
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({ [parsed.type]: items }, null, 2),
            },
          ],
        };
      }

      // Read actual file content
      const content = await readResource(
        cachedRepoPath,
        module,
        parsed.type,
        parsed.filename
      );

      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Error: ${errorMessage}`,
          },
        ],
      };
    }
  });

  return server;
}

/**
 * Start the server
 */
async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  console.error('AI Development MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
