# Mobile WebAuth Session Recovery

## Gate

- Task: Fix Android payment flow error `No WebAuth session — call connectWallet() first` after backend payment challenge.
- Branch: `fix/mobile-webauth-session-recovery`
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Status: READY_FOR_REVIEW
- Live-risk: No merge, no production deploy, no public release, no real mainnet payment.

## Symptom

Founder installed the preview APK and the blackscreen was fixed. On contractor lead-token payment, the payment sheet reached the live payment flow and then failed at WebAuth signing:

```text
No WebAuth session — call connectWallet() first
```

The payment sheet had already contacted the backend and moved to the WebAuth signing stage, so the backend was reachable and returned the payment challenge.

## Root Cause

`lib/webauth.ts` used only the module-level in-memory `currentSession` unless the root layout had already restored it.

That is fragile on Android because the app can return from WebAuth, reload JS, or use safeStorage's in-memory fallback. In that state the backend/user profile can still contain the verified wallet, while the local `currentSession` is null. Payment signing then fails before opening a transfer signing prompt.

## Fix

Two small client-side changes:

1. `lib/webauth.ts`: before signing, try `loadWebauthSession()` if `currentSession` is null.
2. `lib/payments.ts`: pass `fromAccount` and `fromPermission` from `getCurrentUser()?.wallet` into WebAuth signing.

This lets payment signing use the backend-bound wallet as the signer even when the local in-memory WebAuth session was not hydrated.

## Verification

Commands run from `mobile/smartcontractor`:

```powershell
npx --no-install tsc --noEmit --pretty false --diagnostics
```

Result: PASS

```text
Files:              572
Lines:           185455
Memory used:    264473K
Total time:      43.46s
```

```powershell
npx --no-install expo export --platform android --output-dir .tmp\export-android-session-recovery
```

Result: PASS

```text
Android Bundled 38324ms index.js (1057 modules)
_expo/static/js/android/index-9a5bb9b9565300ae743b02adabde150d.hbc (3.23 MB)
```

## Reviewer Request

Claude should verify that:

1. Passing the backend-bound profile wallet into WebAuth signing is consistent with backend sender-binding.
2. The app now opens a WebAuth transfer signing prompt instead of failing with `No WebAuth session`.
3. If WebAuth still opens only the wallet home screen, the next investigation should focus on ESR URI encoding/scheme support, not session state.
