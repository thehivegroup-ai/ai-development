# React Native

**Platform-Agnostic Instructions**

This file contains base instructions that apply across all platforms.


---


# React Native Development Standards

## When to Apply

Apply when:
- Working on React Native or Expo projects
- Debugging performance issues (FPS, memory, TTI, bundle size)
- Optimizing React Native applications
- Writing native modules or platform-specific code
- Setting up CI/CD for React Native apps

---

## Core Principles

### 1. Performance First
- **Measure before optimizing** - Always establish baseline metrics
- **Profile regularly** - Use React DevTools, Xcode Instruments, Android Studio Profiler
- **Optimize for 60 FPS** - Target consistent 60 FPS for smooth UX
- **Monitor bundle size** - Keep JavaScript bundle optimized
- **Measure TTI** - Track Time to Interactive for startup performance

### 2. React Native Architecture
- **Understand threading model** - JS thread, UI thread, bridge overhead
- **Minimize bridge traffic** - Use Turbo Modules for heavy native operations
- **Leverage native capabilities** - Use native SDKs over web polyfills
- **Optimize view hierarchy** - Flatten views, avoid deep nesting

### 3. JavaScript/React Optimization
- **Enable React Compiler** - Automatic memoization (preferred over manual)
- **Use FlashList over FlatList** - Better performance for lists
- **Atomic state management** - Jotai/Zustand for granular re-renders
- **Reanimated for animations** - Run animations on UI thread

---

## Performance Optimization Workflow

### Step 1: Measure
```bash
# Measure FPS
# Open React Native DevTools (press 'j' in Metro or shake device)
# Enable "Show Perf Monitor"

# Measure bundle size
npx react-native bundle \
  --entry-file index.js \
  --bundle-output output.js \
  --platform ios \
  --sourcemap-output output.js.map \
  --dev false --minify true
npx source-map-explorer output.js

# Measure TTI (Time to Interactive)
# Use Xcode Instruments or Android Studio Profiler
```

### Step 2: Optimize
Apply fixes based on measurements:
- **Slow FPS?** → Use `react-native-best-practices` skill → `js-lists-flatlist-flashlist.md`
- **Large bundle?** → Use `react-native-best-practices` skill → `bundle-tree-shaking.md`
- **Slow startup?** → Use `react-native-best-practices` skill → `native-measure-tti.md`
- **Memory leaks?** → Use `react-native-best-practices` skill → `js-memory-leaks.md` + `native-memory-leaks.md`

### Step 3: Re-measure
Verify improvements with same measurements from Step 1

### Step 4: Validate
Confirm metrics improved (e.g., FPS 45→60, bundle 2.1MB→1.6MB)

---

## Key Patterns

### Lists and Scrolling
```tsx
// ❌ Bad: ScrollView for large lists
<ScrollView>
  {items.map(item => <Item key={item.id} data={item} />)}
</ScrollView>

// ✅ Good: FlashList with optimizations
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  estimatedItemSize={100}  // Helps with measurement
  getItemType={(item) => item.type}  // Improves recycling
/>
```

### State Management
```tsx
// ❌ Bad: Single large state object causing re-renders
const [state, setState] = useState({ user, posts, comments, likes });

// ✅ Good: Atomic state with Jotai
import { atom, useAtom } from 'jotai';

const userAtom = atom(user);
const postsAtom = atom(posts);

// Components only re-render when their specific atom changes
function UserProfile() {
  const [user] = useAtom(userAtom);  // Only re-renders on user changes
  return <Text>{user.name}</Text>;
}
```

### Animations
```tsx
// ❌ Bad: Animated API (runs on JS thread, can drop frames)
const fadeAnim = useRef(new Animated.Value(0)).current;
Animated.timing(fadeAnim, { toValue: 1, duration: 500 }).start();

// ✅ Good: Reanimated (runs on UI thread, smooth 60 FPS)
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

function FadeIn({ children }) {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);
  
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={style}>{children}</Animated.View>;
}
```

### Native Modules
```tsx
// ❌ Bad: Web polyfill (large bundle, slower)
import CryptoJS from 'crypto-js';
const hash = CryptoJS.SHA256(data);

// ✅ Good: Native SDK via Turbo Module
import { NativeModules } from 'react-native';
const { CryptoModule } = NativeModules;
const hash = await CryptoModule.sha256(data);  // Fast native implementation
```

---

## Bundle Optimization

### Tree Shaking
```javascript
// ❌ Bad: Imports entire library
import _ from 'lodash';
const result = _.uniq(array);

// ✅ Good: Import only what you need
import uniq from 'lodash/uniq';
const result = uniq(array);
```

### Code Splitting
```typescript
// ❌ Bad: Import all screens upfront
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import SettingsScreen from './screens/Settings';

// ✅ Good: Lazy load screens
const HomeScreen = React.lazy(() => import('./screens/Home'));
const ProfileScreen = React.lazy(() => import('./screens/Profile'));
const SettingsScreen = React.lazy(() => import('./screens/Settings'));
```

---

## Memory Management

### JavaScript Memory
```tsx
// ❌ Bad: Memory leak (listener not removed)
useEffect(() => {
  Keyboard.addListener('keyboardDidShow', handleShow);
}, []);

// ✅ Good: Clean up listeners
useEffect(() => {
  const subscription = Keyboard.addListener('keyboardDidShow', handleShow);
  return () => subscription.remove();
}, []);
```

### Native Memory
```objc
// ❌ Bad: Strong reference cycle (iOS)
self.onComplete = ^{
  [self doSomething];  // Retains self
};

// ✅ Good: Weak reference
__weak typeof(self) weakSelf = self;
self.onComplete = ^{
  [weakSelf doSomething];
};
```

---

## Platform-Specific Optimization

### iOS
- Use Xcode Instruments for profiling (Time Profiler, Allocations)
- Enable Hermes for better startup time
- Optimize images with ImageOptim

### Android
- Use Android Studio Profiler (CPU, Memory, Network)
- Enable R8 code shrinking in production
- Enable Hermes and bytecode precompilation
- Check 16KB page size alignment (Android 15+)

---

## Skills Integration

Use these skills for detailed guidance:

### react-native-best-practices
**29 reference files** covering:
- JavaScript/React optimization (9 files)
- Native iOS/Android optimization (11 files)
- Bundling/build optimization (9 files)

**Key files:**
- `js-react-compiler.md` - Enable React Compiler
- `js-lists-flatlist-flashlist.md` - List performance
- `native-turbo-modules.md` - Writing native modules
- `bundle-analyze-js.md` - Bundle size analysis

### react-native-upgrade
Version upgrade workflows with breaking changes guide

### react-native-brownfield
Integrating React Native into existing native apps

---

## Commands

### `/mobile.react-native.profile-performance`
Profile app performance (FPS, memory, TTI)

### `/mobile.react-native.analyze-bundle`
Analyze JavaScript bundle size and identify optimizations

### `/mobile.react-native.upgrade-version`
Guided React Native version upgrade workflow

### `/mobile.react-native.brownfield-setup`
Setup React Native in existing native app

---

## Agent Support

### mobile.react-native-performance-auditor
Performance review specialist for React Native apps
- Analyzes code for performance anti-patterns
- Recommends specific optimizations
- Validates fixes with measurements

---

## Priority Matrix

| Priority | Issue | Impact | Fix |
|----------|-------|--------|-----|
| CRITICAL | FPS drops during scroll | High | FlashList + getItemLayout |
| CRITICAL | Bundle > 2MB | High | Tree shaking + code splitting |
| HIGH | Startup > 3s (TTI) | High | Code split + defer imports |
| HIGH | Memory leaks | High | Clean up listeners + weak refs |
| MEDIUM | Animations janky | Medium | Use Reanimated worklets |
| MEDIUM | Bridge overhead | Medium | Batch updates + Turbo Modules |

---

## Common Anti-Patterns

### ❌ Avoid
- Using ScrollView for large lists (use FlashList)
- Placing heavy logic in render
- Not cleaning up listeners/timers
- Using Animated API for complex animations (use Reanimated)
- Importing entire libraries (kills tree shaking)
- Web polyfills when native SDKs available
- Anonymous functions in renderItem
- Deep view hierarchies

### ✅ Prefer
- FlashList for lists
- React Compiler for automatic memoization
- Atomic state management (Jotai/Zustand)
- Reanimated for animations
- Native SDKs over polyfills
- Tree-shakeable imports
- Turbo Modules for native code
- Flat view hierarchies

---

## Resources

- **Skills:** Type `/` and search for "react-native-best-practices"
- **Upstream:** https://github.com/callstackincubator/agent-skills
- **Guide:** [The Ultimate Guide to React Native Optimization](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-optimization)
- **Examples:** https://github.com/callstack/optimization-best-practices

---

## Integration with Workflow Modes

- **SOLUTION** - Frame React Native performance problems
- **PLAN** - Plan optimizations backward from metrics
- **BUILD-SCREEN** - Apply RN best practices during implementation
- **CLEAN-SWEEP** - Audit for performance anti-patterns
- **TEST-LOOP** - Verify performance improvements
- **DEPLOY-RELEASE** - Build optimized iOS/Android artifacts
