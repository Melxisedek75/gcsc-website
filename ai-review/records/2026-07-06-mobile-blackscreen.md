# Mobile Standalone Android Blackscreen

## Gate

- Task: Diagnose and fix SmartContractor standalone Android APK black/dark-blue screen after bootstrap spinner.
- Branch: `fix/mobile-blackscreen`
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Status: READY_FOR_REVIEW
- Live-risk: No deploy, no mainnet, no real payments, no secrets.

## Finding

Root cause is most likely the Expo Router root-layout lifecycle, not backend, Railway, or payment code.

Before this change, `app/_layout.tsx` returned only a loading `<View>` while `state === 'pending'`. During that same pending phase, `hydrate()` could call `router.replace(...)`. That means navigation could be requested before the root `<Stack>` navigator was mounted. In standalone release builds this matches the observed symptom: bootstrap spinner disappears, the root background remains, but route content never appears.

The post-failsafe symptom also supports this: `RootLayout` rendered enough to show `colors.bg`, but the Expo Router `<Stack>` content did not render.

## Fix

Changed `mobile/smartcontractor/app/_layout.tsx` so `<Stack>` is mounted from the first render. The loading spinner is now an absolute overlay above the navigator instead of replacing the navigator.

This is intentionally a single-variable fix:

- Did not disable New Architecture.
- Did not change WebAuth/Proton imports.
- Did not change nativewind/Metro config.
- Did not change backend/API code.

## Verification

Commands run from `mobile/smartcontractor` in the isolated worktree:

```powershell
npx --no-install tsc --noEmit --pretty false --diagnostics
```

Result: PASS

```text
Files:              572
Lines:           185447
Memory used:    294766K
Total time:      66.68s
```

```powershell
npx --no-install expo config --type public
```

Result: PASS

```powershell
npx --no-install expo export --platform android --output-dir .tmp\export-android
```

Result: PASS

```text
Android Bundled 37123ms index.js (1057 modules)
android bundles (1):
_expo/static/js/android/index-94ac13f5adc37648899a45a123dac149.hbc (3.23 MB)
Exported: ...\mobile\smartcontractor\.tmp\export-android
```

## Environment Note

Fresh `npm install` in the new worktree failed on local Windows/npm while unpacking `metro` with `TAR_ENTRY_ERROR`. To avoid mixing dependency-install noise with this code review, verification used a junction to the already-installed `C:\gcsc\mobile\smartcontractor\node_modules`. No repository files were changed for that.

## Reviewer Request

Claude should review:

1. Whether the root-layout lifecycle diagnosis is correct.
2. Whether mounting `<Stack>` immediately with a loading overlay is acceptable for Expo Router.
3. Whether the next EAS preview APK no longer shows a blank dark-blue screen.

If the physical APK still blanks, the next single-variable hypothesis should be New Architecture off (`newArchEnabled: false`) or lazy-loading Proton signing code, but those were deliberately not bundled into this fix.
