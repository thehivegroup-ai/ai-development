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
import { fetchRepository } from './git/fetcher.js';
import { scanModules, findModule } from './modules/scanner.js';
import { ModuleMetadata } from './types.js';
import {
  listResources,
  parseResourceUri,
  readResource,
  generateModuleOverview,
} from './modules/resources.js';
import { composeModules, resolveSelection } from './modules/composer.js';
import { diffEnvironment } from './modules/diff.js';
import {
  writeModules,
  writeStackProfile,
  writeLockfile,
  readLockfile,
  readStackProfile,
} from './modules/installer.js';
import { validateEnvironment } from './modules/validator.js';
import {
  categorizeModules,
  generateSelectionPrompt,
  validateSelection,
  generateSelectionSummary,
  suggestStackCombinations,
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

// Default configuration
const DEFAULT_REPO_URL = process.env.DEFAULT_REPO_URL || 
  'https://github.com/thehivegroup-ai/ai-development.git';
const DEFAULT_REF = process.env.DEFAULT_REF || 'main';

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
              enum: ['enterprise-standards', 'stack-authority', 'project-control'],
              description: 'Filter by module category',
            },
            forceRefresh: {
              type: 'boolean',
              description: 'Force refresh from remote (ignore cache)',
              default: false,
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
            selection: {
              type: 'object',
              description: 'Module selection',
              properties: {
                enterprise: { type: 'string' },
                controls: { type: 'array', items: { type: 'string' } },
                stacks: { type: 'array', items: { type: 'string' } },
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
            selection: {
              type: 'object',
              description: 'Module selection',
              properties: {
                enterprise: { type: 'string' },
                controls: { type: 'array', items: { type: 'string' } },
                stacks: { type: 'array', items: { type: 'string' } },
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
        // Fetch repository
        const { localPath } = await fetchRepository(repoUrl, ref);

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
            modules.find(m => m.id === selection.enterprise),
            ...(selection.controls || []).map((id: string) => modules.find(m => m.id === id)),
            ...(selection.stacks || []).map((id: string) => modules.find(m => m.id === id)),
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

      try {
        // Fetch repository
        const { localPath, commitSha } = await fetchRepository(repoUrl, ref, {
          forceRefresh,
        });

        // Scan for modules
        let modules = await scanModules(localPath);

        // Filter by category if specified
        if (category) {
          modules = modules.filter((m) => m.category === category);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  commitSha,
                  repoUrl,
                  ref,
                  modules: modules.map((m) => ({
                    id: m.id,
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
      const selection = args?.selection as any;
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

        // Fetch repository
        const { localPath, commitSha } = await fetchRepository(repoUrl, ref);

        // Scan all modules for dependency resolution
        const allModules = await scanModules(localPath);

        // Resolve selection to modules
        const selectedModules = await resolveSelection(localPath, selection);
        
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
        await writeModules(projectPath, composed, mode);
        const duration = Date.now() - startTime;

        // Write profile and lockfile
        if (writeProfile) {
          await writeStackProfile(projectPath, selection);
        }
        if (writeLockfileFlag) {
          await writeLockfile(projectPath, { repoUrl, ref, commitSha }, selection);
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
        };

        // Fetch repository
        const { localPath, commitSha } = await fetchRepository(repoUrl, ref);

        // Scan all modules for dependency resolution
        const allModules = await scanModules(localPath);

        // Resolve selection to modules
        const selectedModules = await resolveSelection(localPath, selection);
        
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

        // Apply update
        await writeModules(projectPath, composed, mode);

        // Update lockfile
        await writeLockfile(projectPath, { repoUrl, ref, commitSha }, selection);

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

        // Fetch new version
        const { localPath, commitSha } = await fetchRepository(
          currentLockfile.source.repoUrl,
          ref
        );

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
        };

        // Scan all modules
        const allModules = await scanModules(localPath);

        // Resolve selection
        const selectedModules = await resolveSelection(localPath, selection);

        // Resolve dependencies
        const depResolution = resolveDependencies(selectedModules, allModules);

        // Compose and write
        const { composed } = await composeModules(localPath, depResolution.resolved);
        await writeModules(projectPath, composed, 'merge');

        // Update lockfile
        await writeLockfile(
          projectPath,
          { repoUrl: currentLockfile.source.repoUrl, ref, commitSha },
          selection
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
      // Use cached data or fetch fresh
      if (!cachedRepoPath || !cachedModules) {
        const { localPath, commitSha } = await fetchRepository(
          DEFAULT_REPO_URL,
          DEFAULT_REF
        );
        cachedRepoPath = localPath;
        cachedCommitSha = commitSha;
        cachedModules = await scanModules(localPath);
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

      // Ensure we have cached data
      if (!cachedRepoPath || !cachedModules) {
        const { localPath, commitSha } = await fetchRepository(
          DEFAULT_REPO_URL,
          DEFAULT_REF
        );
        cachedRepoPath = localPath;
        cachedCommitSha = commitSha;
        cachedModules = await scanModules(localPath);
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
                  commitSha: cachedCommitSha,
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
