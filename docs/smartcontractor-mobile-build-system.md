# SmartContractor Mobile Build System

Date: 2026-05-03

## Objective

Create a controlled mobile build path for SmartContractor:

```text
same product logic -> web/PWA -> Android wrapper -> iOS wrapper
```

## Why Capacitor First

Capacitor is the recommended first native route because SmartContractor is still changing quickly.

Benefits:

- reuse the current HTML/CSS/JS MVP;
- avoid duplicating business logic;
- lower token and development cost;
- add native features only when needed;
- ship Android/iOS faster after the web flow is proven.

## Required Before Native Build

Before creating real Android/iOS store builds:

- Supabase Auth connected;
- RLS policies tightened;
- API validation improved;
- mobile UI flow completed;
- HTTPS working on production domain;
- privacy policy drafted;
- terms/loan disclaimers drafted;
- evidence upload flow designed;
- wallet/deep-link behavior selected.

## Prepared Capacitor Settings

The web package now includes a Capacitor config:

```text
C:\gcsc\construction-ai\capacitor.config.json
```

Current values:

```text
appId: com.gcsc.smartcontractor
appName: SmartContractor
webDir: public
androidScheme: https
```

The Android wrapper has now been generated from this config, while iOS remains planned.

## Generated Android Wrapper

The Android wrapper lives in:

```text
C:\gcsc\construction-ai\android
```

Validate it with:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-wrapper
```

The generated wrapper is still not a Play Store build. Local debug build is blocked until Java (`JAVA_HOME`) and Android SDK tooling are available on the machine.

## Common Build Plan

1. Finish clickable web MVP.
2. Ensure PWA works on phone-width screens.
3. Add Capacitor dependencies in a controlled branch.
4. Configure app id:

```text
com.gcsc.smartcontractor
```

5. Configure app name:

```text
SmartContractor
```

6. Add Android wrapper. DONE locally.
7. Add Java/Android SDK build tooling before debug builds.
8. Add iOS wrapper.
9. Test local web app inside native wrappers.
10. Add camera/photo picker later.
11. Add push notifications later.

## Founder Actions Needed Later

Android:

- create or access Google Play Console;
- approve app name and package id;
- create signing key strategy.

iOS:

- Apple Developer account;
- App Store Connect access;
- approve bundle id;
- approve privacy labels.

## Current Status

```text
PWA foundation exists.
Capacitor config exists.
Android wrapper preflight exists.
Android wrapper project exists under C:\gcsc\construction-ai\android.
Mobile readiness validation exists.
Android debug build and iOS native wrapper are still planned, not production-ready.
```

## Local Validation

Run from:

```powershell
cd C:\gcsc\construction-ai
npm run check:mobile
```

This validates:

- Capacitor app id and app name;
- PWA manifest entrypoint;
- required mobile planning docs;
- Android/iOS build instructions.

Before generating the Android wrapper, also run:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-preflight
```

After generating or syncing the Android wrapper, run:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-wrapper
```
