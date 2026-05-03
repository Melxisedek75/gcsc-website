# SmartContractor Mobile Workspace

Date: 2026-05-03

## Goal

Prepare SmartContractor for Android and iPhone without splitting the product into three different codebases too early.

## Current Strategy

Use this path:

```text
PWA first -> Capacitor wrapper -> Android/iOS store builds -> native-only features later
```

Reason:

- fastest route to a usable mobile MVP;
- reuses `construction-ai/public/smartcontractor.html`;
- avoids maintaining separate Android, iOS, and web product logic;
- lets GCSC test the business model before expensive native app work;
- later supports camera, evidence upload, push notifications, deep links, and wallet links.

## Source Web App

Current mobile web/PWA files:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
C:\gcsc\construction-ai\public\manifest.webmanifest
C:\gcsc\construction-ai\public\service-worker.js
```

Local test URL:

```text
http://localhost:3002/smartcontractor.html
```

## Workspace Layout

```text
smartcontractor-mobile/
  README.md
  android/
    Android-specific plan and starter files
  ios/
    iOS-specific plan and starter files
```

## Product Rule

The mobile app must support the main MVP flow:

```text
homeowner creates job
-> contractor sees open bid
-> contractor submits bid
-> contractor requests starter loan
-> milestone repayment is shown
-> dispute can be opened
-> peer review can be submitted
```

## Mobile Features Needed Later

### Phase 1: PWA

- responsive layout;
- installable home-screen app;
- offline shell;
- basic app icon;
- mobile navigation.

### Phase 2: Capacitor

- Android project wrapper;
- iOS project wrapper;
- camera/photo picker for dispute evidence;
- file upload;
- push notifications;
- app deep links;
- wallet deep links.

### Phase 3: Store Launch

- Android signing key;
- Google Play Console;
- Apple Developer account;
- App Store Connect;
- privacy policy;
- support URL;
- screenshots;
- app review compliance.

## Do Not Do Yet

- Do not build two separate native business logic stacks.
- Do not launch to public app stores before Supabase RLS/auth is production-safe.
- Do not add paid services without founder approval.
- Do not store private keys or wallet secrets in mobile app code.

