#!/bin/bash
# ==============================================================================
# Hook:     sessionStart
# Enhances: All modules — injects non-duplicate project context
# Purpose:  Provide stack profile and available commands (not auto-loaded by Cursor).
#           Cursor already provides: workspace path, git status, open files, rules.
# ==============================================================================

input=$(cat)
workspace=$(echo "$input" | jq -r '.workspace_roots[0] // empty')
conv_id=$(echo "$input" | jq -r '.conversation_id // empty')

# Initialize session state directory
if [ -n "$conv_id" ]; then
  mkdir -p "/tmp/ai-dev-hooks/$conv_id"
  # Clean up stale session state (older than 24 hours)
  find /tmp/ai-dev-hooks -maxdepth 1 -type d -mmin +1440 -exec rm -rf {} \; 2>/dev/null
fi

# Need workspace to discover project context
[ -n "$workspace" ] || { echo '{}'; exit 0; }

context=""

# Load stack profile if present (NOT auto-provided by Cursor)
if [ -f "$workspace/stack.profile.json" ]; then
  profile=$(cat "$workspace/stack.profile.json" 2>/dev/null)
  context+="## Active Stack Profile\n\`\`\`json\n$profile\n\`\`\`\n\n"
fi

# List available commands (NOT auto-discovered by Cursor)
if [ -d "$workspace/.cursor/commands" ]; then
  cmds=$(ls "$workspace/.cursor/commands/"*.md 2>/dev/null | xargs -I{} basename {} .md | sort)
  if [ -n "$cmds" ]; then
    context+="## Available Commands\n"
    while IFS= read -r cmd; do
      context+="- /$cmd\n"
    done <<< "$cmds"
    context+="\n"
  fi
fi

# Output context using jq for proper JSON escaping
if [ -n "$context" ]; then
  header="# Project Context\n\n"
  echo -e "${header}${context}" | jq -Rs '{ additional_context: . }'
else
  echo '{}'
fi
