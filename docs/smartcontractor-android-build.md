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

The repository now has the base config:

```text
C:\gcsc\construction-ai\capacitor.config.json
```

It locks:

```text
appId: com.gcsc.smartcontractor
appName: SmartContractor
webDir: public
```

When the main app owner is ready to generate the real Android project, run from the package owner area:

```powershell
cd C:\gcsc\construction-ai
npm install @capacitor/core @capacitor/cli
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

1. Keep `npm run check:mobile` passing.
2. Add Capacitor packages when disk space and Android tooling are ready.
3. Generate the real Android project with `npx cap add android`.
4. Test on Android emulator and physical Android device.
5. Add native plugins only after the web workflows are stable.

## Current Blockers

The Android project is intentionally not generated yet because it can add many files and may require Android Studio / SDK setup.

This is the safe current state:

- PWA exists;
- Capacitor config exists;
- package id is locked;
- Android commands are documented;
- validation checks the mobile path.
