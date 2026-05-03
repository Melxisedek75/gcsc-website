# SmartContractor Android Direction

Date: 2026-05-03

This folder is the Android planning and starter area for the SmartContractor MVP.
It is not a working native app yet.

The current product strategy is:

1. Ship and harden the mobile PWA first.
2. Wrap the existing web app with Capacitor for Android.
3. Add native Android capabilities only when the web flow is stable.

Current web MVP source:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
```

Existing PWA assets:

```text
C:\gcsc\construction-ai\public\manifest.webmanifest
C:\gcsc\construction-ai\public\service-worker.js
```

## Recommended Android Path

Use Capacitor as the first Android wrapper because it lets GCSC reuse the web/PWA MVP while adding native Android features step by step.

Recommended phases:

1. Validate the PWA on Android Chrome.
2. Add Capacitor config in the main web app area when the main Codex is ready.
3. Generate the Android project with Capacitor.
4. Test the wrapper locally on emulator and real Android device.
5. Add native plugins only after the core homeowner and contractor flows are stable.
6. Prepare Play Store metadata, privacy policy, screenshots, and internal testing track.

## Suggested Capacitor Commands

Run these later from the web app/package owner area, not from this planning folder:

```powershell
npm install @capacitor/core @capacitor/cli
npx cap init SmartContractor com.gcsc.smartcontractor --web-dir construction-ai/public
npm install @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```

If the web app later moves to a build output folder, update `--web-dir` or `capacitor.config.*` accordingly.

Expected future package id:

```text
com.gcsc.smartcontractor
```

## Android Features Needed Later

Camera and photo evidence:

- contractor progress photos;
- homeowner dispute evidence;
- before/after job documentation;
- insurance claim evidence;
- likely plugin: `@capacitor/camera`;
- Android permissions: camera and media/photo access depending on target SDK.

Push notifications:

- new bid alerts;
- contractor selected;
- milestone approved or rejected;
- payment released;
- dispute opened;
- likely plugin: `@capacitor/push-notifications`;
- external setup: Firebase Cloud Messaging.

Deep links:

- open job links directly in app;
- open bid invite links;
- open dispute or claim links;
- Android App Links domain verification needed later.

Wallet links:

- WebAuth/XPR wallet launch from SmartContractor;
- return path after signing or payment;
- payment receipt handoff back into the app;
- needs careful testing with wallet deep link formats before production.

File upload:

- license documents;
- insurance certificates;
- permits;
- job attachments;
- should reuse existing web upload flows first.

Location:

- contractor service area matching;
- job site distance estimation;
- optional at MVP stage unless needed for lead routing.

## Do Not Treat This Folder As

- a finished Android Studio project;
- a Gradle project;
- a production native app;
- a replacement for the existing PWA.

The first production candidate should still come from the web/PWA build after auth, database security, and core workflows are ready.

