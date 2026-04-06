/**
 * Outlines git commands for contributors to run locally.
 * Credentials: user's existing SSH, credential helper, or `gh auth` — not via MCP.
 */

export interface ContributionWorkflowInput {
  upstreamRepoUrl: string;
  /** Branch to create (default: feat/module-update) */
  branchName?: string;
  /** Absolute path to an existing clone; commands use `cd` here */
  localClonePath?: string;
  /** Your fork URL (HTTPS or SSH); used in fresh-clone scenario */
  forkRemoteUrl?: string;
  /** Base branch name (default: main) */
  defaultBranch?: string;
}

export interface ContributionWorkflowPayload {
  upstreamRepoUrl: string;
  defaultBranch: string;
  suggestedBranchName: string;
  credentials: {
    summary: string;
    beforeYouPush: string[];
  };
  /** Copy-paste command sequences */
  scenarios: {
    id: string;
    title: string;
    commands: string[];
  }[];
  pullRequest: {
    description: string;
    githubCliExamples: string[];
  };
}

export function buildContributionWorkflowPayload(
  input: ContributionWorkflowInput
): ContributionWorkflowPayload {
  const upstream = input.upstreamRepoUrl;
  const branch = input.branchName?.trim() || 'feat/module-update';
  const main = input.defaultBranch?.trim() || 'main';
  const localPath = input.localClonePath?.trim();
  const fork = input.forkRemoteUrl?.trim();

  const credentials = {
    summary:
      'Every command below runs in your own terminal. Git authenticates the same way as when you use it elsewhere: SSH keys, HTTPS + credential manager, or GitHub CLI (`gh auth login`). The MCP server does not receive passwords, tokens, or run `git push` for you.',
    beforeYouPush: [
      'git remote -v',
      '# Confirm origin points at your fork (push target) and upstream at the canonical repo (optional, for syncing).',
      '# If using SSH: ssh -T git@github.com',
      '# If using GitHub CLI: gh auth status',
    ],
  };

  const scenarios: ContributionWorkflowPayload['scenarios'] = [];

  if (localPath) {
    scenarios.push({
      id: 'existing-clone',
      title: 'Existing clone: branch, commit, push',
      commands: [
        `cd "${localPath}"`,
        `git fetch origin`,
        `git checkout ${main}`,
        `git pull --ff-only origin ${main}`,
        `# If you use upstream remote: git fetch upstream && git merge upstream/${main}`,
        `git checkout -b ${branch}`,
        '# Edit or add files under modules/',
        'git add modules/',
        'git status',
        `git commit -m "feat: describe your module change"`,
        `git push -u origin ${branch}`,
      ],
    });
  }

  if (fork) {
    scenarios.push({
      id: 'clone-fork',
      title: 'New machine: clone your fork, branch from upstream default',
      commands: [
        `git clone ${fork} ai-development`,
        'cd ai-development',
        `git remote add upstream ${upstream}`,
        'git fetch upstream',
        `git checkout -b ${branch} upstream/${main}`,
        '# Edit modules/',
        'git add modules/',
        `git commit -m "feat: describe your module change"`,
        `git push -u origin ${branch}`,
      ],
    });
  }

  scenarios.push({
    id: 'generic',
    title: 'Generic (fill in paths and fork URL yourself)',
    commands: [
      `git clone <YOUR_FORK_OR_UPSTREAM_URL> ai-development`,
      'cd ai-development',
      `# If you cloned upstream and use a fork: git remote add origin <YOUR_FORK_URL>`,
      `git remote add upstream ${upstream}`,
      'git fetch upstream',
      `git checkout -b ${branch} upstream/${main}`,
      '# Edit modules/',
      'git add modules/',
      `git commit -m "feat: describe your module change"`,
      `git push -u origin ${branch}`,
    ],
  });

  const pullRequest = {
    description: `Open a pull request from branch "${branch}" into the default branch on the upstream repository. Use the GitHub/GitLab web UI, or gh if authenticated.`,
    githubCliExamples: [
      `gh pr create --fill --base ${main} --head ${branch}`,
      '# Or from a fork: gh pr create --fill --repo OWNER/REPO',
    ],
  };

  return {
    upstreamRepoUrl: upstream,
    defaultBranch: main,
    suggestedBranchName: branch,
    credentials,
    scenarios,
    pullRequest,
  };
}
