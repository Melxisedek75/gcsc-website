# SmartContractor Android Wrapper Preflight

Date: 2026-05-05

Purpose: define the local checks that must pass before generating the real Capacitor Android project.

## What This Allows

This preflight allows a future safe Android wrapper generation step only when the web/PWA app identity and launch safety gates are still intact.

It does not:

- create a native Android project;
- install Android Studio or SDK tooling;
- connect Google Play Console;
- enable real lending;
- enable real escrow;
- enable real payment provider production mode;
- change live Supabase data.

## Required Local State

Run from:

```powershell
cd C:\gcsc\construction-ai
npm run check:android-preflight
```

The validator checks:

- `capacitor.config.json` keeps `appId: com.gcsc.smartcontractor`;
- `appName` stays `SmartContractor`;
- `webDir` stays `public`;
- Android scheme stays `https`;
- Android Capacitor commands run from `C:\gcsc\construction-ai`;
- command docs do not call `npx cap init` after config already exists;
- Android build docs and checklist link this preflight;
- public PWA files do not contain secret-like backend key wording.

## Required Launch Gates Before Public Android Testing

These must be completed before any public Android beta:

- Supabase Auth Magic Link tested with real founder/homeowner/contractor users;
- `SMARTCONTRACTOR_ROUTE_PROTECTION=strict` enabled in the target deployment;
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict` enabled in the target deployment;
- strict RLS reviewed and applied only after explicit founder approval;
- `SUPABASE_SERVICE_ROLE_KEY` configured server-side only, never bundled into Android assets;
- privacy policy covers photos, evidence uploads, notifications, wallet handoff, and account data;
- legal review completed for loans, payment handling, disputes, collateral, and token language;
- real payment provider production mode remains off until founder approval.

## Current Decision

The safe current state remains:

```text
PWA exists.
Capacitor config exists.
Android wrapper preflight exists.
Native Android project is not generated yet.
```
