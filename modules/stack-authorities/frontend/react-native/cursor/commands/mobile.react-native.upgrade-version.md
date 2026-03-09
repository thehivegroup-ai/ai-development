---
name: mobile.react-native.upgrade-version
description: Guided React Native version upgrade workflow with breaking changes detection. Use when upgrading React Native to a newer version.
---

# Upgrade React Native Version

Guided workflow for upgrading React Native with breaking changes detection.

---

## Before You Start

1. **Check current version:**
   ```bash
   cat package.json | grep "react-native"
   ```

2. **Review upgrade guide:**
   - Visit: https://react-native-community.github.io/upgrade-helper/
   - Select: FROM version → TO version
   - Review breaking changes

3. **Create backup branch:**
   ```bash
   git checkout -b upgrade-react-native-[version]
   ```

---

## Upgrade Workflow

### Step 1: Update Dependencies

```bash
# Update package.json
npm install react-native@[version] react@[version]

# iOS
cd ios && pod install && cd ..

# Android (no action needed, gradle pulls new version)
```

### Step 2: Run Upgrade Helper

```bash
# Use React Native upgrade helper
npx react-native upgrade

# This will:
# - Update native files (ios/*, android/*)
# - Show conflicts
# - Let you accept/reject changes
```

### Step 3: Resolve Conflicts

Follow prompts from upgrade helper:
- Review each change carefully
- Accept changes for new version
- Keep your customizations where needed

### Step 4: Update Native Dependencies

#### iOS

```bash
cd ios
pod update
pod install
cd ..
```

#### Android

Update `android/build.gradle`:
```gradle
buildscript {
  ext {
    buildToolsVersion = "[new version]"
    minSdkVersion = "[check requirements]"
    compileSdkVersion = "[check requirements]"
    targetSdkVersion = "[check requirements]"
  }
}
```

### Step 5: Check Breaking Changes

**Common breaking changes by version:**

**0.72 → 0.73:**
- New Architecture (Turbo Modules/Fabric) opt-in
- Metro config changes

**0.73 → 0.74:**
- TypeScript 5.x required
- Hermes improvements

**0.74 → 0.75:**
- React 18.3 features
- New bridgeless mode

**Always check:** https://github.com/facebook/react-native/releases

### Step 6: Update Third-Party Libraries

```bash
# Check outdated packages
npm outdated

# Update packages that support new RN version
npm update

# Check for compatibility:
# https://reactnative.directory/
```

### Step 7: Test

```bash
# Clean everything
rm -rf node_modules ios/build android/app/build
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android

# Test all critical flows
```

---

## Common Issues & Fixes

### Build Errors (iOS)

**Error: "No podspec found"**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

**Error: Xcode version mismatch**
- Check RN version requirements
- Update Xcode if needed
- Run: `sudo xcode-select --switch /Applications/Xcode.app`

### Build Errors (Android)

**Error: "SDK version mismatch"**
- Update `android/build.gradle` with correct SDK versions
- Sync gradle files

**Error: "Duplicate class"**
- Clean: `cd android && ./gradlew clean && cd ..`
- Rebuild

### Runtime Errors

**Error: "Unable to resolve module"**
```bash
# Clear Metro cache
npx react-native start --reset-cache
```

**Error: "Native module cannot be found"**
```bash
# iOS: Reinstall pods
cd ios && pod install && cd ..

# Android: Clean build
cd android && ./gradlew clean && cd ..
```

---

## Rollback Plan

If upgrade fails:

```bash
# Revert changes
git reset --hard HEAD

# Or restore from backup branch
git checkout main
git branch -D upgrade-react-native-[version]
```

---

## Post-Upgrade Checklist

- [ ] App builds successfully (iOS + Android)
- [ ] All screens render correctly
- [ ] Navigation works
- [ ] Third-party libraries functional
- [ ] No new warnings in console
- [ ] Performance is same or better
- [ ] Tests pass

---

## Skills Integration

Uses:
- `react-native-upgrade/SKILL.md` - Complete upgrade workflow
- `react-native-upgrade/references/` - Version-specific guides
