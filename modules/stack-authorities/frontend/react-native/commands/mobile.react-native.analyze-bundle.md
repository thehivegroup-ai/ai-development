---
name: mobile.react-native.analyze-bundle
description: Analyze React Native JavaScript bundle size and identify optimization opportunities. Use when bundle is large, startup is slow, or you need to reduce app size.
---

# Analyze React Native Bundle

Analyze JavaScript bundle size and identify code bloat.

---

## Quick Analysis

### Step 1: Build Production Bundle

```bash
# iOS
npx react-native bundle \
  --entry-file index.js \
  --bundle-output ios-bundle.js \
  --platform ios \
  --sourcemap-output ios-bundle.js.map \
  --dev false --minify true

# Android
npx react-native bundle \
  --entry-file index.js \
  --bundle-output android-bundle.js \
  --platform android \
  --sourcemap-output android-bundle.js.map \
  --dev false --minify true
```

### Step 2: Check Bundle Size

```bash
ls -lh ios-bundle.js android-bundle.js

# Good: < 1.5 MB
# Acceptable: 1.5-2.5 MB
# Large: > 2.5 MB (needs optimization)
```

### Step 3: Analyze with source-map-explorer

```bash
# Install
npm install -g source-map-explorer

# Analyze
npx source-map-explorer ios-bundle.js --no-border-checks

# Opens treemap visualization in browser
```

---

## What to Look For

### Large Libraries
- Libraries > 200KB → Consider alternatives
- Moment.js (huge) → Use date-fns or day.js
- Lodash (full import) → Import specific functions
- Large icon libraries → Use selective imports

### Duplicate Code
- Same library bundled multiple times
- Different versions of same package

### Unused Code
- Dead code not removed
- Imports from barrel files (index.ts)
- Polyfills you don't need

---

## Optimization Actions

### 1. Enable Tree Shaking

```javascript
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,  // Enables tree shaking
      },
    }),
  },
};
```

**Reference:** `bundle-tree-shaking.md`

### 2. Fix Barrel File Imports

```typescript
// ❌ Bad: Imports entire module
import { Button } from './components';  // imports all of components/index.ts

// ✅ Good: Direct import
import { Button } from './components/Button';
```

**Reference:** `bundle-barrel-exports.md`

### 3: Replace Large Libraries

```bash
# Check library size
npx cost-of-modules

# Replace large libraries:
# moment.js (232KB) → date-fns (13KB)
# lodash (70KB) → lodash-es with tree shaking
```

**Reference:** `bundle-library-size.md`

### 4. Code Splitting

```typescript
// Lazy load screens
const ProfileScreen = React.lazy(() => import('./screens/Profile'));
const SettingsScreen = React.lazy(() => import('./screens/Settings'));
```

**Reference:** `bundle-code-splitting.md`

### 5. Enable Hermes Bytecode

Hermes can reduce bundle size and improve startup:

```ruby
# ios/Podfile
use_react_native!(
  :hermes_enabled => true  # Enable Hermes
)
```

**Reference:** `bundle-hermes-mmap.md`

---

## Re-measure and Validate

```bash
# After applying fixes, rebuild and compare
npx react-native bundle \
  --entry-file index.js \
  --bundle-output ios-bundle-optimized.js \
  --platform ios \
  --dev false --minify true

# Compare sizes
ls -lh ios-bundle.js ios-bundle-optimized.js

# Confirm reduction
# Before: 2.8 MB
# After: 1.9 MB (32% reduction) ✅
```

---

## Skills Integration

Uses:
- `react-native-best-practices/references/bundle-analyze-js.md`
- `react-native-best-practices/references/bundle-tree-shaking.md`
- `react-native-best-practices/references/bundle-library-size.md`
- `react-native-best-practices/references/bundle-code-splitting.md`
