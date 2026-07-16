# Mobile Standalone Android Blackscreen

## Gate

- Task: Diagnose and fix SmartContractor standalone Android APK black/dark-blue screen after bootstrap spinner.
- Branch: `fix/mobile-blackscreen`
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Status: APPROVED (CLAUDE, 2026-07-06)
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

## Review (CLAUDE, 2026-07-06, head `a642db90`)

- Reviewer independently inspected the diff: YES (2 files: `_layout.tsx` + this record; single-variable fix confirmed — no newArch/Proton/metro/backend changes).
- **Diagnosis confirmed.** Conditionally replacing the root navigator with a plain `<View>` is a documented expo-router anti-pattern: the root layout must always render its `<Slot>`/`<Stack>` for routes to register, and `router.replace()` from `hydrate()` could fire before the navigator mounted. Dev builds (Expo Go) tolerate this; release builds fail silently with exactly the observed symptom (background renders, route content never mounts). CLAUDE's earlier 4s-failsafe made the spinner disappear but could not mount routes retroactively — consistent with the "spinner gone, still blank" progression.
- **Fix pattern approved.** Always-mounted `<Stack>` + absolute loading overlay is the recommended structure. `ErrorBoundary` wrapper preserved. Minor (non-blocking): `pointerEvents="none"` lets taps pass through the overlay to the underlying screen during bootstrap; cosmetic, can be revisited later.

### Reviewer verification (fresh run in Codex worktree, node_modules junction noted above)

| Check | Result |
|---|---|
| `npx --no-install tsc --noEmit --pretty false` | PASS (exit 0) |
| `npx --no-install expo config --type public` | PASS (exit 0, 56-line config, owner/scheme/projectId intact) |
| `npx --no-install expo export --platform android --output-dir .tmp\export-android-claude` | PASS (exit 0); bundle hash `index-94ac13f5adc37648899a45a123dac149.hbc` **identical to author's run** |

### Sign-off

- Reviewer decision: **APPROVED**
- Required checks: PASS
- Unresolved P0/P1 findings: 0
- Remaining verification: physical-device check of the new EAS preview APK (founder). If it still blanks → next single-variable branch per author's note.
- Merge to main: **BLOCKED** until founder approval. Deploy: N/A.
