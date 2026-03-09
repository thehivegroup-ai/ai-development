#!/bin/bash
# install-react-native-skills.sh
#
# Installs React Native skills from callstackincubator/agent-skills
# as a git submodule for easy updates and team sharing.

set -e

echo "🚀 Installing React Native skills from callstackincubator/agent-skills..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ ERROR: Not in a git repository"
  exit 1
fi

# Check if .cursor/skills/agent-skills already exists
if [ -d ".cursor/skills/agent-skills" ]; then
  echo "⚠️  .cursor/skills/agent-skills already exists"
  echo ""
  echo "Options:"
  echo "  1. Update existing: cd .cursor/skills/agent-skills && git pull"
  echo "  2. Remove and reinstall: rm -rf .cursor/skills/agent-skills && $0"
  exit 1
fi

# Create .cursor directory if it doesn't exist
echo "📁 Creating .cursor/skills directory..."
mkdir -p .cursor/skills

# Add as submodule
echo "📦 Adding as git submodule..."
if git submodule add https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills 2>&1; then
  echo "✅ Submodule added successfully"
else
  echo "❌ Failed to add submodule"
  exit 1
fi

# Initialize submodule
echo "🔄 Initializing submodule..."
git submodule update --init --recursive

echo ""
echo "✅ Installation complete!"
echo ""
echo "📚 Installed skills:"
echo "  ✓ react-native-best-practices (29 reference files)"
echo "  ✓ upgrading-react-native"
echo "  ✓ react-native-brownfield-migration"
echo "  ✓ github"
echo "  ✓ github-actions"
echo ""
echo "📖 Usage:"
echo "  - Type '/' in Cursor Agent chat to see available skills"
echo "  - Skills auto-apply when working on React Native code"
echo ""
echo "🔄 To update skills later:"
echo "  cd .cursor/skills/agent-skills && git pull"
echo ""
echo "📘 Documentation:"
echo "  See docs/skills/react-native-skills-installation.md for details"
