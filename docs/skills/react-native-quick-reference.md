# React Native Skills - Quick Reference

**Installation Date:** 2026-03-09  
**Source:** https://github.com/callstackincubator/agent-skills  
**Status:** ✅ Installed as git submodule

---

## Installed Skills

### 1. react-native-best-practices ⭐ PRIMARY
**29 reference files** covering performance optimization

#### JavaScript/React (9 files)
- `js-react-compiler.md` - Automatic memoization with React Compiler (CRITICAL)
- `js-lists-flatlist-flashlist.md` - List performance (FlatList → FlashList)
- `js-atomic-state.md` - State management (Jotai/Zustand)
- `js-animations-reanimated.md` - Animation best practices (Reanimated)
- `js-concurrent-react.md` - Concurrent features (useDeferredValue, useTransition)
- `js-measure-fps.md` - FPS measurement
- `js-profile-react.md` - React DevTools profiling
- `js-memory-leaks.md` - JS memory leak detection
- `js-uncontrolled-components.md` - Input performance

#### Native iOS/Android (11 files)
- `native-turbo-modules.md` - Writing efficient native modules
- `native-measure-tti.md` - Time to Interactive optimization
- `native-memory-leaks.md` - Native memory leak detection
- `native-memory-patterns.md` - Memory management patterns
- `native-profiling.md` - Xcode/Android Studio profiling
- `native-threading-model.md` - Understanding RN threading
- `native-view-flattening.md` - View hierarchy optimization
- `native-sdks-over-polyfills.md` - Use native SDKs (not web polyfills)
- `native-platform-setup.md` - Platform-specific setup
- `native-android-16kb-alignment.md` - Android app size optimization

#### Bundling/Build (9 files)
- `bundle-analyze-js.md` - Bundle analysis (source-map-explorer)
- `bundle-tree-shaking.md` - Tree shaking setup
- `bundle-r8-android.md` - Android code shrinking (R8)
- `bundle-library-size.md` - Choosing small libraries
- `bundle-barrel-exports.md` - Avoiding barrel file bloat
- `bundle-code-splitting.md` - Code splitting strategies
- `bundle-hermes-mmap.md` - Hermes bytecode optimization
- `bundle-native-assets.md` - Asset optimization
- `bundle-analyze-app.md` - App size analysis

---

### 2. upgrading-react-native
Version upgrade workflows and breaking changes

---

### 3. react-native-brownfield-migration
Integrating React Native into existing native apps

---

### 4. github
GitHub PR workflows and code review patterns

---

### 5. github-actions
CI/CD for React Native (iOS/Android builds)

---

## Quick Usage

### In Cursor Agent Chat

**Type `/` to see skills:**
```
/ [search for skill name]
```

**Skills auto-apply when:**
- Working on React Native code
- Discussing performance issues
- Setting up builds/CI
- Upgrading React Native

---

## Common Use Cases

### 1. Performance Issue
**User:** "App is laggy when scrolling"

**AI reads:** `js-lists-flatlist-flashlist.md`

**AI suggests:**
- Replace ScrollView with FlashList
- Add getItemLayout
- Enable React Compiler

---

### 2. Bundle Too Large
**User:** "iOS bundle is 3.5MB"

**AI reads:** `bundle-analyze-js.md` + `bundle-tree-shaking.md`

**AI suggests:**
```bash
npx react-native bundle --entry-file index.js \
  --bundle-output output.js --platform ios \
  --dev false --minify true
npx source-map-explorer output.js
```

---

### 3. Slow Startup
**User:** "App takes 4 seconds to show first screen"

**AI reads:** `native-measure-tti.md` + `bundle-code-splitting.md`

**AI suggests:**
- Measure TTI baseline
- Code split heavy dependencies
- Defer non-critical imports

---

### 4. Memory Leak
**User:** "App crashes after 10 minutes"

**AI reads:** `js-memory-leaks.md` + `native-memory-leaks.md`

**AI suggests:**
- Profile with Chrome DevTools (JS heap)
- Profile with Xcode Instruments (native memory)
- Check for detached listeners

---

### 5. Animation Jank
**User:** "Animations drop to 30 FPS"

**AI reads:** `js-animations-reanimated.md` + `js-measure-fps.md`

**AI suggests:**
- Use Reanimated worklets
- Move logic to UI thread
- Measure FPS before/after

---

## Integration with Enterprise Workflow

```
SOLUTION (problem framing)
  ↓
PLAN (backward planning)
  ↓
BUILD-SCREEN (React Native implementation)
  │
  ├─ react-native-best-practices applied ✅
  │   ├─ js-react-compiler.md (auto-memoization)
  │   ├─ js-lists-flatlist-flashlist.md (list perf)
  │   └─ js-atomic-state.md (state mgmt)
  │
  └─ native optimization guidance ✅
      ├─ native-turbo-modules.md (native code)
      └─ native-threading-model.md (threading)
  ↓
CLEAN-SWEEP (quality check)
  │
  └─ Bundle optimization ✅
      ├─ bundle-analyze-js.md (analyze)
      └─ bundle-tree-shaking.md (reduce size)
  ↓
TEST-LOOP (verification)
  ↓
DEPLOY-RELEASE (with CI/CD)
  │
  └─ github-actions skill ✅
      └─ iOS/Android build automation
```

---

## Updating Skills

```bash
# Update to latest
cd .cursor/skills/agent-skills
git pull origin main

# Commit the update
cd ../../..
git add .cursor/skills/agent-skills
git commit -m "chore: update React Native skills"
```

---

## File Locations

```
.cursor/skills/agent-skills/         # Git submodule root
├── skills/
│   ├── react-native-best-practices/
│   │   ├── SKILL.md                # Main skill file
│   │   └── references/             # 29 detailed guides
│   │       ├── js-*.md             # 9 JS/React files
│   │       ├── native-*.md         # 11 Native files
│   │       ├── bundle-*.md         # 9 Bundle files
│   │       └── images/             # Profiler screenshots
│   │
│   ├── upgrading-react-native/
│   ├── react-native-brownfield-migration/
│   ├── github/
│   └── github-actions/
└── README.md
```

---

## Key Reference Files (Bookmarks)

### Must-Read for React Native Work
1. **js-react-compiler.md** - Enable React Compiler for automatic memoization
2. **js-lists-flatlist-flashlist.md** - List performance (most common perf issue)
3. **bundle-analyze-js.md** - Bundle size analysis (critical for production)
4. **native-turbo-modules.md** - Writing native modules correctly
5. **native-measure-tti.md** - Startup performance (user-facing metric)

### For Specific Problems
- **Animations janky?** → `js-animations-reanimated.md`
- **App crashes?** → `js-memory-leaks.md` + `native-memory-leaks.md`
- **Slow startup?** → `native-measure-tti.md` + `bundle-code-splitting.md`
- **Large bundle?** → `bundle-tree-shaking.md` + `bundle-library-size.md`
- **Native performance?** → `native-profiling.md` + `native-threading-model.md`

---

## Verification Checklist

- ✅ Skills installed to `.cursor/skills/agent-skills/`
- ✅ Git submodule configured (easy updates)
- ✅ 5 skills with 29+ reference files available
- ✅ Skills discoverable via `/` in Cursor Agent chat
- ✅ Integration with enterprise workflow documented

---

## Next Actions

1. **Test in Cursor:** Open Agent chat, type `/`, search for "react-native"
2. **Try a query:** Ask about React Native performance optimization
3. **Verify skill application:** AI should reference specific `.md` files
4. **Share with team:** Commit submodule, team runs `git submodule update --init`

---

## Additional Resources

- **Installation Guide:** `docs/skills/react-native-skills-installation.md`
- **Source Repo:** https://github.com/callstackincubator/agent-skills
- **Callstack Guide:** [Ultimate Guide to React Native Optimization](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization)
- **Code Examples:** https://github.com/callstack/optimization-best-practices
