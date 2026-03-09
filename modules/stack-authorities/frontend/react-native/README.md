# React Native Stack Authority

**Version:** 1.0.0  
**Type:** Stack Authority Module  
**Upstream:** https://github.com/callstackincubator/agent-skills

---

## Overview

Production-grade React Native performance optimization, native development patterns, and build standards based on Callstack's "Ultimate Guide to React Native Optimization".

---

## What This Module Provides

### Skills (3)
- **react-native-best-practices** (29 reference files)
  - JavaScript/React optimization (FPS, re-renders, lists, state, animations)
  - Native iOS/Android optimization (TTI, memory, profiling, Turbo Modules)
  - Bundling/build optimization (analysis, tree shaking, R8, code splitting)
  
- **react-native-upgrade** - Version upgrade workflows and breaking changes
- **react-native-brownfield** - Integrating React Native into existing native apps

### Rules (1)
- `20-mobile-react-native.mdc` - React Native coding standards and conventions

### Commands (4)
- `mobile.react-native.profile-performance` - Profile app performance (FPS, memory, TTI)
- `mobile.react-native.analyze-bundle` - Analyze and optimize bundle size
- `mobile.react-native.upgrade-version` - Guided version upgrade workflow
- `mobile.react-native.brownfield-setup` - Setup React Native in native app

### Agents (1)
- `mobile.react-native-performance-auditor` - Performance review specialist

---

## Installation via MCP Server

```bash
# Install this module to a project
mcp-server install frontend/react-native

# Or specify in project configuration
{
  "modules": {
    "frontend/react-native": "latest"
  }
}
```

---

## Direct Installation (Without MCP)

```bash
# Clone the stack-authorities repository
git clone <your-repo> 
cd <project>/.cursor

# Add as git submodule
git submodule add <url>/modules/stack-authorities modules
git submodule update --init --recursive

# The skills will be at:
# .cursor/modules/stack-authorities/frontend/react-native/cursor/skills/
```

---

## Skills Content

### react-native-best-practices

**29 reference files organized by category:**

#### JavaScript/React (9 files)
- `js-react-compiler.md` - Automatic memoization
- `js-lists-flatlist-flashlist.md` - List performance
- `js-atomic-state.md` - State management (Jotai/Zustand)
- `js-animations-reanimated.md` - Animation best practices
- `js-concurrent-react.md` - Concurrent features
- `js-measure-fps.md` - FPS measurement
- `js-profile-react.md` - React DevTools profiling
- `js-memory-leaks.md` - Memory leak detection
- `js-uncontrolled-components.md` - Input performance

#### Native iOS/Android (11 files)
- `native-turbo-modules.md` - Efficient native modules
- `native-measure-tti.md` - Time to Interactive
- `native-memory-leaks.md` - Native memory detection
- `native-memory-patterns.md` - Memory management
- `native-profiling.md` - Xcode/Android Studio profiling
- `native-threading-model.md` - RN threading model
- `native-view-flattening.md` - View hierarchy optimization
- `native-sdks-over-polyfills.md` - Native SDKs vs web polyfills
- `native-platform-setup.md` - Platform-specific setup
- `native-android-16kb-alignment.md` - Android app size

#### Bundling/Build (9 files)
- `bundle-analyze-js.md` - Bundle analysis
- `bundle-tree-shaking.md` - Tree shaking
- `bundle-r8-android.md` - Android code shrinking
- `bundle-library-size.md` - Library selection
- `bundle-barrel-exports.md` - Avoiding barrel bloat
- `bundle-code-splitting.md` - Code splitting
- `bundle-hermes-mmap.md` - Hermes optimization
- `bundle-native-assets.md` - Asset optimization
- `bundle-analyze-app.md` - App size analysis

---

## Usage

### In Cursor

Skills are automatically discovered when the module is installed:
- Type `/` in Agent chat
- Search for "react-native"
- Skills auto-apply when working on React Native code

### Common Use Cases

**Performance Issue:**
```
User: "App is laggy when scrolling"
AI reads: js-lists-flatlist-flashlist.md
AI suggests: Replace ScrollView with FlashList, add getItemLayout
```

**Bundle Size:**
```
User: "iOS bundle is 3.5MB"
AI reads: bundle-analyze-js.md
AI suggests: Analyze with source-map-explorer, apply tree shaking
```

**Slow Startup:**
```
User: "App takes 4 seconds to show first screen"
AI reads: native-measure-tti.md
AI suggests: Measure TTI baseline, code split dependencies
```

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
  │   ├─ JS/React optimization
  │   └─ Native optimization
  │
CLEAN-SWEEP (quality check)
  │
  └─ Bundle optimization ✅
  ↓
TEST-LOOP
  ↓
DEPLOY-RELEASE
```

---

## Updating

### Via MCP Server
```bash
mcp-server update frontend/react-native
```

### Manual Update
```bash
cd modules/stack-authorities/frontend/react-native/upstream
git pull origin main
```

---

## Module Structure

```
frontend/react-native/
├── module.json                          # Module definition
├── README.md                            # This file
├── upstream/                            # Git submodule to callstackincubator/agent-skills
│   └── skills/
│       ├── react-native-best-practices/
│       ├── upgrading-react-native/
│       └── react-native-brownfield-migration/
└── cursor/
    ├── rules/
    │   └── 20-mobile-react-native.mdc
    ├── commands/
    │   ├── mobile.react-native.profile-performance.md
    │   ├── mobile.react-native.analyze-bundle.md
    │   ├── mobile.react-native.upgrade-version.md
    │   └── mobile.react-native.brownfield-setup.md
    ├── skills/                          # Symlinks to upstream/skills
    │   ├── react-native-best-practices -> ../../upstream/skills/react-native-best-practices
    │   ├── react-native-upgrade -> ../../upstream/skills/upgrading-react-native
    │   └── react-native-brownfield -> ../../upstream/skills/react-native-brownfield-migration
    └── agents/
        └── mobile.react-native-performance-auditor.md
```

---

## Attribution

React Native skills based on **"The Ultimate Guide to React Native Optimization"** by [Callstack](https://www.callstack.com/).

- **Upstream Source:** https://github.com/callstackincubator/agent-skills
- **Upstream License:** MIT
- **Upstream Author:** Callstack
- **Reference Guide:** https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization
- **Code Examples:** https://github.com/callstack/optimization-best-practices

---

## Tags

`frontend` `mobile` `react-native` `expo` `typescript` `ios` `android` `performance` `native`

---

## Compatibility

- **Cursor:** >= 0.40.0
- **Requires:** `enterprise-standards` module
- **Compatible with:** All backend and cloud modules

---

## License

MIT License - See LICENSE file in repository root
