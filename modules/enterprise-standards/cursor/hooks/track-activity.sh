#!/bin/bash
# ==============================================================================
# Hook:     afterShellExecution
# Enhances: std-test-loop skill — tracks shell commands for test detection
# Purpose:  Log executed commands to session state so the stop hook can
#           determine whether tests were run during the session.
# ==============================================================================

input=$(cat)
conv_id=$(echo "$input" | jq -r '.conversation_id // empty')
command=$(echo "$input" | jq -r '.command // empty')

[ -n "$conv_id" ] || exit 0

state_dir="/tmp/ai-dev-hooks/$conv_id"
mkdir -p "$state_dir"
echo "$command" >> "$state_dir/commands.log"

exit 0
