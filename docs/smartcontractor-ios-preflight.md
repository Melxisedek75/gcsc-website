# SmartContractor iOS Preflight

Date: 2026-05-07

Purpose: define what can be checked locally before any founder-controlled Apple account work starts.

## What This Allows

This preflight keeps the iPhone path ready without creating a real iOS project or touching App Store Connect.

It does not:

- enroll or log in to the Apple Developer Program;
- create an App Store Connect app record;
- generate signing certificates or provisioning profiles;
- run Xcode, which is macOS-only;
- enable real payments, loans, escrow, or token collateral;
- change live Supabase data or production deployment settings.

## Required Local State

The current local app identity must remain:

```text
appId: com.gcsc.smartcontractor
appName: SmartContractor
webDir: public
```

The PWA entrypoint must remain:

```text
C:\gcsc\construction-ai\public\smartcontractor.html
```

The current Capacitor config must remain:

```text
C:\gcsc\construction-ai\capacitor.config.json
```

## Local Checks Before iOS Wrapper Work

Run from:

```powershell
cd C:\gcsc\construction-ai
npm run check:mobile
npm run check:pwa-qa
```

Before any `npx cap add ios` command, confirm:

- the PWA loads on mobile width;
- offline fallback still works;
- install icons and manifest paths still resolve;
- Magic Link/Auth work remains in draft or strict mode according to the target environment;
- service-role keys are server-side only and never bundled into public assets;
- demo loan, payment, dispute, escrow, and token collateral flows remain non-production until founder/legal approval.

## Founder-Controlled Inputs Needed Later

iOS remains blocked until the founder provides or completes:

- Apple Developer Program membership;
- App Store Connect access;
- Apple Team ID;
- final app display name;
- support URL;
- privacy policy URL;
- app review demo account plan;
- decision about wallet/payment flows allowed in the first review build.

## Safe Command Boundary

These commands are planning-only until the Apple path is ready:

```powershell
cd C:\gcsc\construction-ai
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
```

Do not run `npx cap open ios` on Windows. Xcode only runs on macOS.

## Current Decision

The safe current state remains:

```text
PWA exists.
Capacitor config exists.
iOS preflight exists.
Native iOS project is not generated yet.
Apple account work is founder-controlled.
```
