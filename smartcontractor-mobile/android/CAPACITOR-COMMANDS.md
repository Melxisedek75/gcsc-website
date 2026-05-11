# Recommended Capacitor Commands

Date: 2026-05-03

These commands are a starter reference for the main Codex when it is ready to turn the SmartContractor PWA into an Android wrapper.

Do not run these from this folder unless the project package structure is intentionally moved here.
The package owner is `C:\gcsc\construction-ai`, where `capacitor.config.json` already exists.

## Preflight

```powershell
cd C:\gcsc\construction-ai
npm run check:android-preflight
```

## First Setup

```powershell
cd C:\gcsc\construction-ai
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
```

## Sync After Web Changes

```powershell
cd C:\gcsc\construction-ai
npx cap sync android
```

## Open Android Studio

```powershell
cd C:\gcsc\construction-ai
npx cap open android
```

## Useful Checks

```powershell
npx cap doctor
npx cap ls
```

## Future Plugins

Camera:

```powershell
npm install @capacitor/camera
npx cap sync android
```

Push notifications:

```powershell
npm install @capacitor/push-notifications
npx cap sync android
```

App launcher:

```powershell
npm install @capacitor/app
npx cap sync android
```

Browser or wallet handoff:

```powershell
npm install @capacitor/browser
npx cap sync android
```

## Notes For Main Codex

- Confirm the final web directory before running `cap init`.
- If the PWA becomes a bundled app with a build step, Capacitor should point to the build output, not necessarily `construction-ai/public`.
- Keep secrets on the backend; Android assets can be inspected by users.
- After Android project generation, do not hand-edit generated files unless the change is intentionally native.
