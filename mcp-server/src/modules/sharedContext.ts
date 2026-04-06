/**
 * shared-context/ — per-initiative docs and memory-bank (not modules/, not root docs/)
 */

import { cp, mkdir, readdir, stat } from 'fs/promises';
import { dirname, join, relative, resolve } from 'path';
import simpleGit from 'simple-git';
import { getGitHeadSha } from '../git/sourceResolver.js';

function ensureUnderRoot(filePath: string, root: string): void {
  const absFile = resolve(filePath);
  const absRoot = resolve(root);
  const rel = relative(absRoot, absFile);
  if (rel.startsWith('..') || rel.includes('..')) {
    throw new Error(`Path escapes repository root: ${filePath}`);
  }
}

async function isDirectory(p: string): Promise<boolean> {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
}

export interface SharedContextProjectInfo {
  name: string;
  hasDocs: boolean;
  hasMemoryBank: boolean;
}

/**
 * List project folders under shared-context/ with basic layout flags
 */
export async function listSharedContextDetail(repoRoot: string): Promise<SharedContextProjectInfo[]> {
  const base = join(repoRoot, 'shared-context');
  if (!(await isDirectory(base))) {
    return [];
  }
  const entries = await readdir(base, { withFileTypes: true });
  const names = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();

  const out: SharedContextProjectInfo[] = [];
  for (const name of names) {
    const docs = join(base, name, 'docs');
    const mb = join(base, name, 'memory-bank');
    out.push({
      name,
      hasDocs: await isDirectory(docs),
      hasMemoryBank: await isDirectory(mb),
    });
  }
  return out;
}

export interface PushSharedContextResult {
  dryRun: boolean;
  copied: { role: 'docs' | 'memory-bank'; from: string; to: string }[];
  git: {
    nothingToCommit: boolean;
    commitSha?: string;
    pushed: boolean;
    message?: string;
  };
}

/**
 * Copy a source directory tree into shared-context/<projectName>/docs or memory-bank/
 */
export async function pushSharedContext(options: {
  aiDevelopmentRepo: string;
  projectName: string;
  docsSourcePath?: string;
  memoryBankSourcePath?: string;
  commitMessage: string;
  dryRun: boolean;
  pushGit: boolean;
}): Promise<PushSharedContextResult> {
  const {
    aiDevelopmentRepo,
    projectName,
    docsSourcePath,
    memoryBankSourcePath,
    commitMessage,
    dryRun,
    pushGit,
  } = options;

  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(projectName)) {
    throw new Error(
      `Invalid projectName "${projectName}". Use letters, numbers, dot, underscore, hyphen (e.g. towerai).`
    );
  }

  const trimmedDocs = docsSourcePath?.trim();
  const trimmedMb = memoryBankSourcePath?.trim();
  if (!trimmedDocs && !trimmedMb) {
    throw new Error('At least one of docsSourcePath or memoryBankSourcePath is required.');
  }

  const root = resolve(aiDevelopmentRepo);
  if (!(await isDirectory(root))) {
    throw new Error(`aiDevelopmentRepo is not a directory: ${root}`);
  }

  const copied: PushSharedContextResult['copied'] = [];

  async function prepareCopy(src: string, role: 'docs' | 'memory-bank'): Promise<string> {
    const abs = resolve(src);
    if (!(await isDirectory(abs))) {
      throw new Error(`Source path is not a directory: ${abs}`);
    }
    const dest = join(root, 'shared-context', projectName, role);
    ensureUnderRoot(dest, root);
    copied.push({ role, from: abs, to: dest });
    return dest;
  }

  const destDocs = trimmedDocs ? await prepareCopy(trimmedDocs, 'docs') : null;
  const destMb = trimmedMb ? await prepareCopy(trimmedMb, 'memory-bank') : null;

  if (dryRun) {
    return {
      dryRun: true,
      copied,
      git: {
        nothingToCommit: true,
        pushed: false,
        message: 'dry-run: no files written; no git',
      },
    };
  }

  if (destDocs) {
    await mkdir(dirname(destDocs), { recursive: true });
    await cp(trimmedDocs!, destDocs, { recursive: true, force: true });
  }
  if (destMb) {
    await mkdir(dirname(destMb), { recursive: true });
    await cp(trimmedMb!, destMb, { recursive: true, force: true });
  }

  if (!pushGit) {
    const head = (await getGitHeadSha(root)) || undefined;
    return {
      dryRun: false,
      copied,
      git: {
        nothingToCommit: false,
        commitSha: head,
        pushed: false,
        message: 'Files copied; pushGit was false (commit/push skipped).',
      },
    };
  }

  const git = simpleGit(root);
  if (destDocs) {
    await git.add(join('shared-context', projectName, 'docs').replace(/\\/g, '/'));
  }
  if (destMb) {
    await git.add(join('shared-context', projectName, 'memory-bank').replace(/\\/g, '/'));
  }

  const diffCached = await git.diff(['--cached']);
  if (!diffCached || diffCached.trim() === '') {
    return {
      dryRun: false,
      copied,
      git: {
        nothingToCommit: true,
        pushed: false,
        message: 'No diff after copy; clone already matches sources.',
      },
    };
  }

  await git.commit(commitMessage);
  await git.push();

  const head = (await getGitHeadSha(root)) || undefined;

  return {
    dryRun: false,
    copied,
    git: {
      nothingToCommit: false,
      commitSha: head,
      pushed: true,
    },
  };
}
