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
    ],
  }));

  /**
   * Handle tool calls
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

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

      try {
        if (!projectPath) {
          throw new Error('projectPath is required');
        }
        if (!selection) {
          throw new Error('selection is required');
        }

        // Fetch repository
        const { localPath, commitSha } = await fetchRepository(repoUrl, ref);

        // Resolve selection to modules
        const modules = await resolveSelection(localPath, selection);

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

        // If diff_environment or dryRun, return plan only
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
        await writeModules(projectPath, composed, mode);

        // Write profile and lockfile
        if (writeProfile) {
          await writeStackProfile(projectPath, selection);
        }
        if (writeLockfileFlag) {
          await writeLockfile(projectPath, { repoUrl, ref, commitSha }, selection);
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

        // Resolve selection to modules
        const modules = await resolveSelection(localPath, selection);

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
