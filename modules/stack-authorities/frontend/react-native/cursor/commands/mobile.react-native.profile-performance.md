---
name: mobile.react-native.profile-performance
description: Profile React Native app performance including FPS, memory usage, and Time to Interactive (TTI). Use when investigating performance issues, frame drops, or slow app behavior.
---

# Profile React Native Performance

Comprehensive performance profiling for React Native applications.

---

## When to Use

- App feels laggy or janky during user interactions
- Scrolling performance is poor
- App startup is slow
- Memory usage is high or growing
- Investigating frame drops
- Before and after performance optimizations

---

## Performance Profiling Workflow

### Step 1: Enable Performance Tools

**React Native DevTools:**
```bash
# Start Metro bundler
npx react-native start

# In terminal, press 'j' to open DevTools
# Or shake device → "Open DevTools"
```

**In DevTools:**
- Enable "Show Perf Monitor" (FPS counter)
- Enable "Show Performance Overlay"

---

### Step 2: Profile FPS (Frames Per Second)

**Target:** Consistent 60 FPS for smooth UX

**Tool:** React Native DevTools Performance Monitor

**Process:**
1. Open app and navigate to problem area
2. Perform problematic interaction (scroll, animation, etc.)
3. Observe FPS in performance monitor
4. Record baseline: "FPS drops to 30-40 during scroll"

**Common Issues:**
- FPS < 60 during scroll → Check `js-lists-flatlist-flashlist.md`
- FPS < 60 during animation → Check `js-animations-reanimated.md`
- FPS < 60 overall → Check `js-profile-react.md`

---

### Step 3: Profile React Components

**Tool:** React DevTools Profiler

**Process:**
```bash
# Open React DevTools
# In Chrome DevTools → "Profiler" tab
```

1. Click "Record" button
2. Perform the interaction
3. Click "Stop"
4. Analyze flame graph:
   - Which components re-render?
   - Which components take longest?
   - Are there unnecessary re-renders?

**What to look for:**
- Components re-rendering unnecessarily → Check `js-react-compiler.md`
- Expensive render functions → Check `js-concurrent-react.md`
- State updates causing cascading re-renders → Check `js-atomic-state.md`

**Reference:** `.cursor/skills/react-native-best-practices/references/js-profile-react.md`

---

### Step 4: Profile Memory Usage

#### JavaScript Memory

**Tool:** Chrome DevTools Memory Profiler

**Process:**
1. Open Chrome DevTools
2. Go to "Memory" tab
3. Take heap snapshot
4. Perform interaction that may leak
5. Take another heap snapshot
6. Compare snapshots:
   - Is heap size growing?
   - Are objects being retained?
   - Are listeners attached but not removed?

**Common Leaks:**
- Event listeners not removed
- Timers not cleared
- Refs to unmounted components
- Closures capturing large objects

**Reference:** `.cursor/skills/react-native-best-practices/references/js-memory-leaks.md`

#### Native Memory

**iOS (Xcode Instruments):**
```bash
# Build for profiling
npx react-native run-ios --configuration Release

# Open in Xcode
open ios/YourApp.xcworkspace

# Product → Profile (⌘I)
# Select "Allocations" or "Leaks" instrument
```

**Android (Android Studio Profiler):**
```bash
# Build for profiling
npx react-native run-android --variant=release

# Open Android Studio
# View → Tool Windows → Profiler
# Select your app process
# Click "Memory" to see allocations
```

**Reference:** `.cursor/skills/react-native-best-practices/references/native-memory-leaks.md`

---

### Step 5: Profile App Startup (TTI)

**Metric:** Time to Interactive (TTI) - Time from launch to usable UI

**Target:** < 2 seconds for good UX

#### iOS (Xcode Instruments)

```bash
# Build for profiling
npx react-native run-ios --configuration Release

# Open Xcode → Product → Profile
# Select "Time Profiler"
# Run app and record launch
```

**Look for:**
- JavaScript bundle load time
- Native module initialization
- Bridge traffic during startup
- Main thread blocking

#### Android (Android Studio)

```bash
# Build for profiling
npx react-native run-android --variant=release

# Use Android Studio Profiler
# CPU → Record
# Launch app
# Stop recording
```

**Analyze:**
- Method tracing timeline
- Which methods take longest?
- Is JavaScript blocking?

**Reference:** `.cursor/skills/react-native-best-practices/references/native-measure-tti.md`

---

### Step 6: Profile JavaScript Thread

**Look for JS thread blocking:**
- Use React Native DevTools Performance Monitor
- Check "JS Thread" indicator (should be green)
- If red/yellow → JS thread is busy

**Common Causes:**
- Heavy computation in render
- Large lists without virtualization
- Synchronous API calls
- Too many bridge calls

**Solutions:**
- Move work to useEffect
- Use useDeferredValue for expensive updates
- Use FlashList for lists
- Batch bridge updates

**Reference:** `.cursor/skills/react-native-best-practices/references/native-threading-model.md`

---

## Output Report Template

After profiling, create a baseline report:

```markdown
# Performance Profile Report

**Date:** YYYY-MM-DD
**App Version:** X.Y.Z
**Platform:** iOS/Android
**Device:** iPhone 14 / Pixel 7

## Baseline Metrics

### FPS (Frames Per Second)
- Home screen: 60 FPS ✅
- Product list scroll: 35 FPS ❌
- Animation (modal open): 58 FPS ⚠️

### Memory Usage
- JS Heap: 45 MB (growing slowly)
- Native Memory: 120 MB (stable)
- Leaks detected: None ✅

### Startup Time (TTI)
- Cold start: 2.8s ⚠️
- Warm start: 1.2s ✅

### React Component Profiling
- ProductList re-renders: 15 times per scroll ❌
- ProductCard: Expensive memo calculations
- Header: Unnecessary re-renders (not using memo)

## Issues Identified

1. **CRITICAL: Poor scroll performance (35 FPS)**
   - Cause: Using FlatList without optimization
   - Fix: Replace with FlashList + getItemLayout
   - Reference: `js-lists-flatlist-flashlist.md`

2. **HIGH: Slow cold start (2.8s)**
   - Cause: Loading all screens upfront
   - Fix: Code split routes, defer heavy imports
   - Reference: `native-measure-tti.md` + `bundle-code-splitting.md`

3. **MEDIUM: ProductList re-rendering too often**
   - Cause: State updates trigger full list re-render
   - Fix: Enable React Compiler or use atomic state
   - Reference: `js-react-compiler.md` + `js-atomic-state.md`

## Next Steps

1. Apply fix #1 (FlashList) → Re-measure FPS
2. Apply fix #2 (code splitting) → Re-measure TTI
3. Apply fix #3 (React Compiler) → Re-measure component renders
4. Validate all metrics improved
```

---

## Tools Reference

### React Native DevTools
- **Enable:** Press 'j' in Metro or shake device
- **Performance Monitor:** Shows FPS, JS/UI thread load
- **Element Inspector:** Debug view hierarchy

### Chrome DevTools
- **Profiler:** React component profiling
- **Memory:** Heap snapshots, memory leaks
- **Performance:** JavaScript execution timeline

### Xcode Instruments (iOS)
- **Time Profiler:** CPU usage, method tracing
- **Allocations:** Memory allocations over time
- **Leaks:** Memory leak detection
- **System Trace:** Complete system analysis

### Android Studio Profiler (Android)
- **CPU:** Method tracing, thread activity
- **Memory:** Heap dump, allocation tracking
- **Network:** API call profiling
- **Energy:** Battery usage

---

## Follow-Up Commands

After profiling:
- `/mobile.react-native.analyze-bundle` - If startup is slow or bundle is large
- Apply fixes from `react-native-best-practices` skill
- Re-run this command to verify improvements

---

## Skills Integration

This command uses:
- `react-native-best-practices/references/js-measure-fps.md`
- `react-native-best-practices/references/js-profile-react.md`
- `react-native-best-practices/references/js-memory-leaks.md`
- `react-native-best-practices/references/native-memory-leaks.md`
- `react-native-best-practices/references/native-measure-tti.md`
- `react-native-best-practices/references/native-profiling.md`
