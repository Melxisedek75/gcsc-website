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

## Follow-up: WebAuth callback placeholders

Founder test showed WebAuth opened an identity request, but after tapping Authorize it did not return to SmartContractor.

Additional root cause: the callback URL did not include ESR placeholders. `@proton/signing-request` resolves callback fields only when the callback contains placeholders such as `{{sa}}`, `{{sp}}`, `{{tx}}`, and `{{sig}}`. The previous callback was only `smartcontractor://webauth-callback?req=<local-id>`, so WebAuth had no explicit callback payload fields to substitute.

Additional fix:

- Build callback manually as `smartcontractor://webauth-callback?rid=<local-id>&sa={{sa}}&sp={{sp}}&tx={{tx}}&sig={{sig}}&cid={{cid}}`.
- Use `rid` as the local correlation id to avoid conflict with ESR callback payload `req`.

Additional verification:

```powershell
npx --no-install tsc --noEmit --pretty false --diagnostics
npx --no-install expo export --platform android --output-dir .tmp\export-android-callback-placeholders
```

Result: PASS. Android bundle hash: `index-f1af6a482f6559ba4a0421679b4f1a1d.hbc`.

## Follow-up: Android deep-link return handling

Founder test showed WebAuth opens the identity request and can authorize, but SmartContractor remains on `Waiting for WebAuth...` after returning. This means the callback was not delivered to the pending promise.

Additional fix:

- Change callback URL from host-style `smartcontractor://webauth-callback?...` to Expo path-style `smartcontractor:///webauth-callback?...`.
- Add an Android intent-filter data variant with `pathPrefix: "/webauth-callback"` while preserving the existing host-style callback variant.
- In `waitForCallback()`, accept callback both from `Linking.addEventListener('url')` and from `Linking.getInitialURL()` when `AppState` becomes active. This covers Android cases where the launch intent is available but Expo does not emit the URL event to the existing listener.
- Require the local correlation id (`rid`) or ESR `req` to match before resolving, so unrelated app links are ignored.

Additional verification:

```powershell
npx --no-install tsc --noEmit --pretty false --diagnostics
npx --no-install expo export --platform android --output-dir .tmp\export-android-deeplink-return
```

Result: PASS. Android bundle hash: `index-b898b8586543e3f0ffb51ac496729ea3.hbc`.
