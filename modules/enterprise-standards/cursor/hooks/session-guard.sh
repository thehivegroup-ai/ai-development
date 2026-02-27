#!/bin/bash
# ==============================================================================
# Hook:     stop
# Enhances: std-test-loop skill + std-verifier agent +
#           03-std-quality-clean-test-deploy rule
# Purpose:  After session completion, check:
#           1. (loop 0) Were tests run if source files were edited?
#           2. (loop 0 or 1) Should verification be suggested for large changes?
# ==============================================================================

input=$(cat)
status=$(echo "$input" | jq -r '.status // empty')
loop_count=$(echo "$input" | jq -r '.loop_count // 0')
conv_id=$(echo "$input" | jq -r '.conversation_id // empty')

# Only act on completed sessions, cap at 2 follow-ups
if [ "$status" != "completed" ] || [ "$loop_count" -gt 1 ]; then
  echo '{}'
  exit 0
fi

state_dir="/tmp/ai-dev-hooks/$conv_id"

# Count source file edits (excluding test/spec files)
source_edits=0
if [ -f "$state_dir/edits.log" ]; then
  source_edits=$(grep -E '\.(ts|tsx|js|jsx|py|go|rs|java|kt|rb|cs)$' "$state_dir/edits.log" 2>/dev/null | \
    grep -cvE '\.(test|spec)\.' 2>/dev/null || echo 0)
fi

# Count test command executions
test_runs=0
if [ -f "$state_dir/commands.log" ]; then
  test_runs=$(grep -cE \
    '(npm[[:space:]]+test|npx[[:space:]]+(jest|vitest)|yarn[[:space:]]+test|pnpm[[:space:]]+test|pytest|go[[:space:]]+test|cargo[[:space:]]+test|mvn[[:space:]]+test|gradle[[:space:]]+test|ng[[:space:]]+test|jest|vitest|mocha)' \
    "$state_dir/commands.log" 2>/dev/null || echo 0)
fi

# Priority 1 (loop 0): Remind to run tests if source files were edited
if [ "$loop_count" -eq 0 ] && [ "$source_edits" -gt 0 ] && [ "$test_runs" -eq 0 ]; then
  cat <<'EOF'
{
  "followup_message": "Source files were modified but no tests were run this session. Per the std-test-loop skill and quality rules, please run the relevant test suite to verify these changes."
}
EOF
  exit 0
fi

# Priority 2 (loop 0 if tests ran, or loop 1 after test reminder):
# Suggest verification for substantial changes
total_edits=0
if [ -f "$state_dir/edits.log" ]; then
  total_edits=$(sort -u "$state_dir/edits.log" | wc -l | tr -d ' ')
fi

if [ "$total_edits" -ge 5 ]; then
  cat <<EOF
{
  "followup_message": "This session modified $total_edits unique files. Consider running the std-verifier to validate feature completeness, code quality, and test coverage before wrapping up."
}
EOF
  exit 0
fi

echo '{}'
