# React Native Skills Installation Guide

**Date:** 2026-03-09  
**Status:** Ready for Installation

---

## Overview

This guide explains how to install and use the React Native skills from `callstackincubator/agent-skills` to expand your stack authority for React Native development.

---

## Available React Native Skills

The repository provides **5 comprehensive skills** for React Native development:

### 1. **react-native-best-practices** (RECOMMENDED)
**Performance optimization guide** covering:
- ✅ JavaScript/React optimization (FPS, re-renders, lists, state management, animations)
- ✅ Native optimization (iOS/Android profiling, TTI, memory management, Turbo Modules)
- ✅ Bundling optimization (bundle analysis, tree shaking, R8, app size)

**Contains 29 reference files:**
- `js-*.md` - JavaScript/React skills (9 files)
- `native-*.md` - Native iOS/Android skills (11 files)
- `bundle-*.md` - Bundling & app size skills (9 files)

**Impact:** CRITICAL for React Native performance work

---

### 2. **upgrading-react-native**
**React Native upgrade workflow** covering:
- Version upgrade templates
- Dependency management
- Common upgrade pitfalls
- Breaking changes handling

**Use when:** Upgrading React Native versions

---

### 3. **react-native-brownfield-migration**
**Incremental migration strategy** covering:
- Adding React Native to existing native apps
- Using `@callstack/react-native-brownfield`
- Setup, packaging, and phased integration
- Expo vs. bare workflow decisions

**Use when:** Integrating React Native into existing native apps

---

### 4. **github**
**GitHub workflow patterns** covering:
- PR workflows
- Code review patterns
- Branching strategies

**Use when:** Working with GitHub for React Native projects

---

### 5. **github-actions**
**GitHub Actions workflow patterns** covering:
- React Native simulator/emulator builds
- CI/CD for iOS/Android artifacts
- Build automation

**Use when:** Setting up CI/CD for React Native

---

## Installation Options

### Option 1: Install All Skills (RECOMMENDED)

Install all 5 skills to `.cursor/skills/` (project-level):

```bash
# From project root
mkdir -p .cursor/skills
cd .cursor/skills
git clone https://github.com/callstackincubator/agent-skills.git
```

After cloning, the structure will be:
```
.cursor/skills/agent-skills/
├── skills/
│   ├── react-native-best-practices/
│   ├── upgrading-react-native/
│   ├── react-native-brownfield-migration/
│   ├── github/
│   └── github-actions/
└── README.md
```

**Pros:**
- ✅ All skills available project-wide
- ✅ Easy to update (`git pull`)
- ✅ Shared with team (committed to repo)

**Cons:**
- ❌ Adds ~1MB to repository

---

### Option 2: Install Specific Skills Only

Copy only the skills you need:

```bash
# Clone to temporary location
cd /tmp
git clone https://github.com/callstackincubator/agent-skills.git

# Copy specific skills to project
mkdir -p /path/to/project/.cursor/skills
cp -r agent-skills/skills/react-native-best-practices /path/to/project/.cursor/skills/
cp -r agent-skills/skills/upgrading-react-native /path/to/project/.cursor/skills/

# Cleanup
rm -rf agent-skills
```

**Pros:**
- ✅ Smaller footprint
- ✅ Only what you need

**Cons:**
- ❌ Manual updates required
- ❌ May miss complementary skills

---

### Option 3: User-Level Installation

Install to `~/.cursor/skills/` (available across all projects):

```bash
mkdir -p ~/.cursor/skills
cd ~/.cursor/skills
git clone https://github.com/callstackincubator/agent-skills.git
```

**Pros:**
- ✅ Available in all React Native projects
- ✅ No repository bloat

**Cons:**
- ❌ Not shared with team
- ❌ Team members need to install separately

---

## Recommended Installation

For this project (`ai-development`), we recommend **Option 1** with a modification:

### Create a Submodule (BEST PRACTICE)

```bash
# Add as git submodule (stays up to date, doesn't bloat repo)
git submodule add https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills
git submodule update --init --recursive
```

**Benefits:**
- ✅ Team gets skills automatically (`git submodule update --init`)
- ✅ Easy updates (`git submodule update --remote`)
- ✅ Doesn't bloat repository (only reference stored)
- ✅ Version controlled

**Update submodule later:**
```bash
cd .cursor/skills/agent-skills
git pull origin main
cd ../../..
git add .cursor/skills/agent-skills
git commit -m "chore: update React Native skills"
```

---

## Skill Structure

Each skill follows the **Agent Skills Standard**:

```
skill-name/
├── SKILL.md              # Main skill file (quick reference)
└── references/           # Detailed reference files
    ├── topic-1.md
    ├── topic-2.md
    └── images/           # Visual references
```

### How Skills Work in Cursor

1. **Automatic Discovery:** Cursor automatically discovers skills in:
   - `.cursor/skills/` (project-level)
   - `~/.cursor/skills/` (user-level)

2. **Skill Invocation:** Type `/` in Agent chat to see and select skills

3. **Contextual Application:** AI uses skills automatically when:
   - Working on React Native code
   - Discussing performance optimization
   - Debugging React Native issues
   - Setting up CI/CD for React Native

---

## Usage Examples

### Example 1: Performance Optimization

**User:** "Our React Native app is laggy during scrolling"

**AI Response (with skill):**
```
Looking at your FlatList implementation, I can see several performance issues.
Based on react-native-best-practices skill:

1. Replace ScrollView with FlashList for better performance
2. Add getItemLayout to skip measurement
3. Use React Compiler to avoid manual memoization

Let me apply these fixes...
```

**AI reads:** `react-native-best-practices/references/js-lists-flatlist-flashlist.md`

---

### Example 2: Bundle Size Optimization

**User:** "Our iOS bundle is 3.5MB, can we reduce it?"

**AI Response (with skill):**
```
Let's analyze your bundle. Based on react-native-best-practices skill:

First, let's measure:
```bash
npx react-native bundle --entry-file index.js \
  --bundle-output output.js --platform ios \
  --dev false --minify true
npx source-map-explorer output.js
```

**AI reads:** `react-native-best-practices/references/bundle-analyze-js.md`

---

### Example 3: React Native Upgrade

**User:** "We need to upgrade from RN 0.72 to 0.74"

**AI Response (with skill):**
```
Let me guide you through the upgrade process using upgrading-react-native skill:

1. First, check for breaking changes...
2. Update dependencies in this order...
3. Run the upgrade helper...
```

**AI reads:** `upgrading-react-native/SKILL.md`

---

## Integration with Enterprise Standards

These React Native skills **complement** your existing enterprise standards:

### Current Enterprise Standards
- `std-solution` - Problem framing (hermeneutic circle)
- `std-plan` - Backward planning (teleological)
- `std-design-review` - UX heuristic evaluation
- `std-clean-sweep` - Code quality cleanup
- `std-test-loop` - Test verification

### React Native Skills Add
- **Stack-specific expertise** for React Native
- **Performance optimization** patterns
- **Native platform** knowledge (iOS/Android)
- **Bundling and build** optimization

### Workflow Integration

```
SOLUTION (frame the problem)
  ↓
PLAN (backward planning)
  ↓
BUILD-SCREEN (React Native implementation)
  ├─ React Native best practices applied during build
  ├─ Performance patterns from js-*.md
  └─ Native optimization from native-*.md
  ↓
CLEAN-SWEEP (quality check)
  ├─ Use react-native-best-practices for review
  └─ Bundle size optimization from bundle-*.md
  ↓
TEST-LOOP (verification)
  ↓
DEPLOY-RELEASE (with React Native build artifacts)
  └─ Use github-actions skill for CI/CD
```

---

## Installation Script

Copy and run this script to install as a submodule:

```bash
#!/bin/bash
# install-react-native-skills.sh

set -e

echo "Installing React Native skills from callstackincubator/agent-skills..."

# Check if .cursor/skills already exists
if [ -d ".cursor/skills/agent-skills" ]; then
  echo "ERROR: .cursor/skills/agent-skills already exists"
  echo "Remove it first or update with: cd .cursor/skills/agent-skills && git pull"
  exit 1
fi

# Create .cursor directory if it doesn't exist
mkdir -p .cursor/skills

# Add as submodule
echo "Adding as git submodule..."
git submodule add https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills

# Initialize submodule
echo "Initializing submodule..."
git submodule update --init --recursive

echo "✅ Installation complete!"
echo ""
echo "Installed skills:"
echo "  - react-native-best-practices"
echo "  - upgrading-react-native"
echo "  - react-native-brownfield-migration"
echo "  - github"
echo "  - github-actions"
echo ""
echo "Usage: Type '/' in Cursor Agent chat to see available skills"
echo ""
echo "To update skills later: cd .cursor/skills/agent-skills && git pull"
```

Save as `scripts/install-react-native-skills.sh` and run:
```bash
chmod +x scripts/install-react-native-skills.sh
./scripts/install-react-native-skills.sh
```

---

## Verification

After installation, verify skills are available:

1. **Check directory structure:**
```bash
ls -la .cursor/skills/agent-skills/skills/
# Should show: react-native-best-practices, github, github-actions, etc.
```

2. **Test in Cursor:**
   - Open Cursor
   - Open Agent chat
   - Type `/`
   - Search for "react-native-best-practices"
   - Should appear in skill list

3. **Test skill application:**
   - Ask: "How can I optimize React Native FlatList performance?"
   - AI should reference `react-native-best-practices` skill in response

---

## Updating Skills

### Update Submodule Method
```bash
cd .cursor/skills/agent-skills
git pull origin main
cd ../../..
git add .cursor/skills/agent-skills
git commit -m "chore: update React Native skills to latest"
```

### Update Cloned Repository Method
```bash
cd .cursor/skills/agent-skills
git pull origin main
```

---

## Skill Reference Quick Links

After installation, these are the key files to reference:

### JavaScript/React Performance
- `js-react-compiler.md` - Automatic memoization with React Compiler
- `js-lists-flatlist-flashlist.md` - List optimization
- `js-atomic-state.md` - State management optimization
- `js-animations-reanimated.md` - Animation best practices
- `js-measure-fps.md` - FPS measurement
- `js-profile-react.md` - React DevTools profiling

### Native Performance
- `native-turbo-modules.md` - Writing efficient native modules
- `native-measure-tti.md` - Time to Interactive optimization
- `native-memory-leaks.md` - Native memory leak detection
- `native-profiling.md` - Xcode/Android Studio profiling
- `native-threading-model.md` - Understanding RN threading

### Bundle/Build Optimization
- `bundle-analyze-js.md` - Bundle analysis
- `bundle-tree-shaking.md` - Tree shaking setup
- `bundle-r8-android.md` - Android code shrinking
- `bundle-library-size.md` - Choosing small libraries

---

## Next Steps

1. **Install the skills** using the submodule method (recommended)
2. **Test skill discovery** in Cursor Agent chat
3. **Apply to React Native projects** in your workspace
4. **Integrate with workflow modes** (BUILD-SCREEN, CLEAN-SWEEP)
5. **Share with team** via git submodule

---

## Additional Resources

- **Source Repository:** https://github.com/callstackincubator/agent-skills
- **Callstack Guide:** [Ultimate Guide to React Native Optimization](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization)
- **Code Examples:** https://github.com/callstack/optimization-best-practices

---

## Troubleshooting

### Skills Not Appearing in Cursor

1. **Check directory structure:**
   ```bash
   ls .cursor/skills/agent-skills/skills/
   ```

2. **Verify SKILL.md files exist:**
   ```bash
   cat .cursor/skills/agent-skills/skills/react-native-best-practices/SKILL.md | head -20
   ```

3. **Restart Cursor** to refresh skill discovery

4. **Check Cursor logs** for skill loading errors

### Submodule Issues

**Problem:** Submodule not initialized after clone

**Solution:**
```bash
git submodule update --init --recursive
```

**Problem:** Submodule conflicts with existing directory

**Solution:**
```bash
rm -rf .cursor/skills/agent-skills
git submodule add https://github.com/callstackincubator/agent-skills.git .cursor/skills/agent-skills
```

---

## Conclusion

The `callstackincubator/agent-skills` repository provides production-grade React Native expertise that complements your enterprise standards. Installing these skills will significantly expand your AI's React Native stack authority, enabling better performance optimization, upgrade workflows, and build automation.

**Recommended action:** Install via git submodule for easy updates and team sharing.
