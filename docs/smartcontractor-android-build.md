# SmartContractor Android Build Plan

Date: 2026-05-03

## Status

Android direction is now documented as a separate planning lane.

This is not a finished native app. The correct MVP order is still:

1. PWA first.
2. Capacitor Android wrapper second.
3. Native Android capabilities third.

## Source PWA

Current web/PWA MVP:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
```

Existing PWA support files:

```text
C:\gcsc\construction-ai\public\manifest.webmanifest
C:\gcsc\construction-ai\public\service-worker.js
```

## Android Planning Folder

```text
C:\gcsc\smartcontractor-mobile\android\
```

Contents:

- `README.md` - Android direction, phases, permissions, native capability plan.
- `CHECKLIST.md` - readiness checklist from PWA to Play Store internal testing.
- `CAPACITOR-COMMANDS.md` - recommended commands for the main Codex to run later.
- `native-preview\MainActivity.kt` - placeholder example only, not a working Android app.

## Recommended Capacitor Setup

When the main app owner is ready, run from the package owner area:

```powershell
cd C:\gcsc
npm install @capacitor/core @capacitor/cli
npx cap init SmartContractor com.gcsc.smartcontractor --web-dir construction-ai/public
npm install @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```

Use package id:

```text
com.gcsc.smartcontractor
```

## Permissions And Features For Later

Camera/photo evidence:

- contractor progress photos;
- dispute evidence;
- insurance claim evidence;
- likely Capacitor plugin: `@capacitor/camera`.

Push notifications:

- bid alerts;
- milestone approvals;
- payment release notices;
- dispute updates;
- requires Firebase Cloud Messaging setup.

Deep links:

- direct links to jobs, bids, claims, disputes;
- Android App Links with verified production domain.

Wallet links:

- WebAuth/XPR payment or signing handoff;
- return link back into SmartContractor;
- receipt verification should remain server-side.

Location:

- useful for contractor matching and service radius;
- defer until routing needs it.

## Next Steps For Main Codex

1. Finish PWA mobile flows and authentication.
2. Confirm final web output directory.
3. Decide whether Capacitor config belongs at `C:\gcsc` root or inside a future web app package.
4. Add Capacitor packages and generate the real Android project.
5. Test on Android emulator and physical Android device.
6. Add native plugins only after the web workflows are stable.

