# SmartContractor iOS Build Plan

Date: 2026-05-04

## Status

This is a planning document for the iPhone/iOS lane. It is not a finished iOS app.

SmartContractor should move in this order:

1. PWA first.
2. Mobile UX polish.
3. Capacitor wrapper.
4. iPhone TestFlight.
5. App Store readiness.

Current web/PWA MVP:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
```

Prepared Capacitor config:

```text
C:\gcsc\construction-ai\capacitor.config.json
```

Bundle ID:

```text
com.gcsc.smartcontractor
```

## Why iOS Is Blocked For Now

iOS cannot be fully built or submitted without founder-controlled Apple assets:

- Apple Developer Program membership;
- App Store Connect access;
- Apple Team ID;
- production app name decision;
- support URL;
- privacy policy URL;
- test account for App Review;
- decision about which payment and wallet flows are allowed in the review build.

## Recommended iOS Commands Later

Run only after the Apple account path is ready:

```powershell
cd C:\gcsc\construction-ai
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
npx cap open ios
```

Do not run `npx cap open ios` on Windows expecting Xcode to open. Xcode is macOS-only.

## iOS Permissions Later

Camera/photo evidence:

```text
NSCameraUsageDescription
NSPhotoLibraryUsageDescription
NSPhotoLibraryAddUsageDescription
```

Push notifications:

```text
aps-environment
UserNotifications permission prompt
```

Universal links:

```text
Associated Domains capability
applinks:xprnet.org
apple-app-site-association
```

Wallet links:

```text
custom URL schemes if needed
universal link fallback
Capacitor Browser/App handling
```

## First TestFlight Definition Of Done

- PWA loads inside Capacitor on iPhone.
- App respects safe areas.
- Login/auth works.
- Contractor and homeowner screens load.
- Photo evidence capture works or has an approved fallback.
- Push permission prompt does not appear too early.
- Deep links open the correct route.
- Wallet handoff has fallback when wallet app is absent.
- App Review notes are written.
- Privacy labels are drafted.

## Current Scaffold Files

```text
C:\gcsc\smartcontractor-mobile\ios\README.md
C:\gcsc\smartcontractor-mobile\ios\checklist.md
C:\gcsc\smartcontractor-mobile\ios\capacitor-commands.md
C:\gcsc\smartcontractor-mobile\ios\native-preview\AppDelegate.swift
```
