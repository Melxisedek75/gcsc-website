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

This does not create the heavy Android/iOS native projects yet. It locks the app identity and web output folder so the wrapper can be generated later without changing product URLs.

## Common Build Plan

1. Finish clickable web MVP.
2. Ensure PWA works on phone-width screens.
3. Add Capacitor dependencies in a controlled branch.
4. Configure app id:

```text
org.xprnet.smartcontractor
```

5. Configure app name:

```text
SmartContractor
```

6. Add Android wrapper.
7. Add iOS wrapper.
8. Test local web app inside native wrappers.
9. Add camera/photo picker later.
10. Add push notifications later.

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
Mobile readiness validation exists.
Android/iOS native wrappers are still planned, not generated.
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
