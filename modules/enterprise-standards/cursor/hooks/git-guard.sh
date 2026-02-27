#!/bin/bash
# ==============================================================================
# Hook:     beforeShellExecution
# Enhances: 00-std-foundation.mdc → Git Operations
# Purpose:  Enforce the rule that AI agents must not perform git write operations.
#           Allowed: git status, git diff, git log, git show
#           Blocked: all other git commands
# ==============================================================================

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty')

# Allow commands that contain ONLY read-only git subcommands
if [[ "$command" =~ git[[:space:]]+(status|diff|log|show) ]] && \
   ! [[ "$command" =~ git[[:space:]]+(add|commit|push|pull|checkout|switch|merge|rebase|stash|reset|cherry-pick|revert|tag|clean|rm|mv|branch|init|clone|fetch|am|apply|bisect|worktree|submodule|restore) ]]; then
  echo '{"permission":"allow"}'
  exit 0
fi

# Block any other git command
if [[ "$command" =~ git[[:space:]] ]] || [[ "$command" == "git" ]]; then
  cat <<'EOF'
{
  "permission": "deny",
  "agent_message": "Blocked by git-guard hook (enforces 00-std-foundation rule). Only read-only git commands are allowed: git status, git diff, git log, git show. The user controls when and how changes are committed."
}
EOF
  exit 0
fi

echo '{"permission":"allow"}'
