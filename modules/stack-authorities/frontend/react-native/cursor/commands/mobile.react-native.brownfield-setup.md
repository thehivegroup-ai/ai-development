---
name: mobile.react-native.brownfield-setup
description: Setup React Native in an existing native iOS/Android app (brownfield integration). Use when adding React Native to an existing native application.
---

# React Native Brownfield Setup

Integrate React Native into existing native iOS/Android applications.

---

## Overview

**Brownfield** = Adding React Native to an existing native app (vs. "greenfield" = new RN app)

**Use cases:**
- Gradual migration from native to React Native
- Add new features in React Native while keeping native code
- Hybrid app with both native and RN screens

---

## Approach Options

### Option 1: Manual Integration (More Control)

Follow React Native docs:
- https://reactnative.dev/docs/integration-with-existing-apps

### Option 2: Using @callstack/react-native-brownfield (Recommended)

Easier setup with tooling support.

```bash
npm install @callstack/react-native-brownfield
```

---

## Setup Workflow (iOS)

### Step 1: Add React Native to Project

```bash
# In your iOS project directory
npm init -y
npm install react-native
cd ios && pod init
```

### Step 2: Update Podfile

```ruby
# ios/Podfile
platform :ios, '13.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'

target 'YourApp' do
  use_react_native!(
    :path => '../node_modules/react-native',
    :hermes_enabled => true
  )
end
```

### Step 3: Install Pods

```bash
cd ios
pod install
cd ..
```

### Step 4: Create React Native Entry Point

```typescript
// index.js
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('MyReactNativeApp', () => App);
```

### Step 5: Add RCTRootView to Native Code

```swift
// ViewController.swift
import React

class ViewController: UIViewController {
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let jsCodeLocation = RCTBundleURLProvider.sharedSettings()
      .jsBundleURL(forBundleRoot: "index")
    
    let rootView = RCTRootView(
      bundleURL: jsCodeLocation,
      moduleName: "MyReactNativeApp",
      initialProperties: nil,
      launchOptions: nil
    )
    
    view = rootView
  }
}
```

### Step 6: Start Metro

```bash
npx react-native start
```

### Step 7: Build and Run

Open Xcode → Build and Run

---

## Setup Workflow (Android)

### Step 1: Update build.gradle (Project Level)

```gradle
// android/build.gradle
buildscript {
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath("com.android.tools.build:gradle:7.4.2")
  }
}
```

### Step 2: Update build.gradle (App Level)

```gradle
// android/app/build.gradle
apply plugin: "com.android.application"
apply from: "../../node_modules/react-native/react.gradle"

dependencies {
  implementation "com.facebook.react:react-native:+"
  implementation "com.facebook.react:hermes-engine:+"
}
```

### Step 3: Update MainActivity

```kotlin
// MainActivity.kt
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "MyReactNativeApp"
  
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

### Step 4: Create Application Class

```kotlin
// MainApplication.kt
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {
  
  private val mReactNativeHost = object : DefaultReactNativeHost(this) {
    override fun getPackages(): List<ReactPackage> = PackageList(this).packages
    override fun getJSMainModuleName(): String = "index"
    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
    override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
    override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
  }
  
  override val reactNativeHost: ReactNativeHost = mReactNativeHost
  
  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
  }
}
```

### Step 5: Update AndroidManifest.xml

```xml
<!-- AndroidManifest.xml -->
<application
  android:name=".MainApplication"
  android:allowBackup="false"
  android:usesCleartextTraffic="true">
  
  <activity
    android:name=".MainActivity"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
    android:windowSoftInputMode="adjustResize">
  </activity>
  
  <!-- Development settings activity -->
  <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
</application>
```

### Step 6: Start Metro and Build

```bash
npx react-native start
```

In Android Studio → Build and Run

---

## Communication: Native ↔ React Native

### From Native to React Native (Pass Props)

**iOS:**
```swift
let props = ["userId": "123", "name": "John"]
let rootView = RCTRootView(
  bundleURL: jsCodeLocation,
  moduleName: "MyReactNativeApp",
  initialProperties: props,  // Pass props
  launchOptions: nil
)
```

**Android:**
```kotlin
val bundle = Bundle()
bundle.putString("userId", "123")
bundle.putString("name", "John")

val reactRootView = ReactRootView(this)
reactRootView.startReactApplication(
  reactInstanceManager,
  "MyReactNativeApp",
  bundle  // Pass props
)
```

### From React Native to Native (Native Modules)

Create native module to expose native functionality to RN:

**iOS (Swift):**
```swift
@objc(NativeModule)
class NativeModule: NSObject {
  @objc func doSomething(_ callback: RCTResponseSenderBlock) {
    // Native code here
    callback(["success", true])
  }
}
```

**Android (Kotlin):**
```kotlin
class NativeModule(reactContext: ReactApplicationContext) : 
  ReactContextBaseJavaModule(reactContext) {
  
  override fun getName() = "NativeModule"
  
  @ReactMethod
  fun doSomething(callback: Callback) {
    // Native code here
    callback.invoke("success", true)
  }
}
```

---

## Phased Migration Strategy

### Phase 1: Setup (Week 1)
- ✅ Add React Native to project
- ✅ Create single test screen in RN
- ✅ Verify build and navigation work

### Phase 2: Pilot Feature (Weeks 2-4)
- ✅ Choose low-risk feature to build in RN
- ✅ Build feature completely in RN
- ✅ Test thoroughly with native app

### Phase 3: Expand (Months 2-6)
- ✅ Migrate more screens to RN
- ✅ Build new features in RN
- ✅ Keep critical native screens as-is

### Phase 4: Consolidate (Months 6+)
- ✅ Evaluate full migration vs. hybrid
- ✅ Optimize bundle size
- ✅ Refactor shared components

---

## Common Issues

**Issue: "Unable to load script from assets"**
- Ensure Metro bundler is running
- Check network connectivity (dev mode)

**Issue: Native build errors**
- Clean: `cd ios && rm -rf Pods Podfile.lock && pod install`
- Clean: `cd android && ./gradlew clean`

**Issue: Hot reload not working**
- Shake device → "Enable Fast Refresh"
- Restart Metro: `npx react-native start --reset-cache`

---

## Skills Integration

Uses:
- `react-native-brownfield/SKILL.md` - Complete brownfield guide
- `react-native-brownfield/references/` - Platform-specific setup
