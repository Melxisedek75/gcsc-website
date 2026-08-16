# Task: Review mobile WebAuth SDK callback/payment fix

Status: APPROVED (CLAUDE, 2026-07-08, reviewed head `9ff8547f`)
Owner: CLAUDE
Author: CODEX
Reviewer: CLAUDE
Created: 2026-07-08T01:25:00Z

## Repository

- Repo: `gcsc-website`
- Local worktree used by CODEX: `C:\Users\rivne\.config\superpowers\worktrees\gcsc\mobile-blackscreen`
- Branch: `fix/mobile-webauth-session-recovery`
- Head: `db6ee0ba67389cb682856482f351d0c803a65e4f`

## Context

Founder reports Android WebAuth opens and shows an `Unknown Requestor` authorization screen, but after authorizing/signing the app stays on `Waiting for WebAuth...` or payment flow fails without a transaction signature callback.

Update after founder phone test: requestor metadata now renders correctly in WebAuth as `GCSC Token @gcsctoken111`, but the app can still remain on `Waiting for WebAuth...` after `Authorize`. CODEX traced this to the SDK login path waiting indefinitely on the default `https://cb.anchor.link` callback service before the direct ESR fallback can run.

CODEX compared the app against the official `@proton/react-native-sdk` source and README:

- SDK transport `onRequest()` sets `same_device`, `return_path`, and `req_account`, then opens the encoded signing request.
- SDK transport `onSessionRequest()` only opens `${scheme}://link`, which can wake WebAuth without carrying the full transaction payload in the URL.
- SDK README transaction example sends `session.transact({ actions }, { broadcast: true })`.

## CODEX Changes

File changed:

- `mobile/smartcontractor/lib/webauth.ts`

Summary:

- Changed direct callback URL from `smartcontractor:///webauth-callback` to `smartcontractor://webauth-callback` to match the Android host intent filter and SDK return URL style.
- Added direct ESR metadata: `same_device`, `return_path`, and `req_account`, so WebAuth sees the dapp/requestor metadata instead of an unknown unlabelled request.
- Avoided session-channel-only transaction fallback; direct `link.transact()` now sends the full transaction request.
- Changed payment transaction call to `link.transact({ actions: [action] }, { broadcast: true })`.
- Uses restored `session.auth` as the signer and rejects mismatch with stored profile wallet before sending a transfer.
- Added short timeout/trace diagnostics to make any next phone screenshot actionable.
- Added a 45 second timeout around initial `ProtonRNSDK(false)` login so Android does not hang forever on the SDK callback service and can fall back to direct ESR identity callback.

## Checks Run By CODEX

From `C:\Users\rivne\.config\superpowers\worktrees\gcsc\mobile-blackscreen\mobile\smartcontractor`:

```powershell
node node_modules\typescript\bin\tsc --noEmit --pretty false
```

Result: PASS.

```powershell
node node_modules\expo\bin\cli export --platform android --output-dir .tmp\codex-webauth-official-export
```

Result: PASS.

Additional checks after `db6ee0ba`:

```powershell
node node_modules\typescript\bin\tsc --noEmit --pretty false
```

Result: PASS.

```powershell
node node_modules\expo\bin\cli export --platform android --output-dir .tmp\codex-webauth-timeout-export
```

Result: PASS.

EAS preview build:

- Build id: `90c4507a-0b95-4126-8ed1-fd3ad10f6fbc`
- Commit: `540c6104aebcb068fa1d8a6ef9fdbeedfd3ea305`
- APK: `https://expo.dev/artifacts/eas/6EXGqlzNVo8EkqIIBFKfZZSk8PBAcHUD6FfZF5e4VKA.apk`
- Build page: `https://expo.dev/accounts/melxisedek75/projects/smartcontractor/builds/90c4507a-0b95-4126-8ed1-fd3ad10f6fbc`

New EAS preview build for `db6ee0ba`:

- Build id: `67658bf3-1b64-4578-a481-af09ab4a907c`
- Commit: `db6ee0ba67389cb682856482f351d0c803a65e4f`
- Status at task update: `IN_PROGRESS`
- Build page: `https://expo.dev/accounts/melxisedek75/projects/smartcontractor/builds/67658bf3-1b64-4578-a481-af09ab4a907c`

## Review Request

Please independently review the diff against `18a0e4f0` and verify:

1. The callback URL shape is correct for `app.json` Android intent filters.
2. Direct ESR requests now match official React Native SDK metadata (`same_device`, `return_path`, `req_account`).
3. The transaction request follows the official `actions` array shape.
4. The `session.auth` signer/profile wallet mismatch check does not break legitimate restored sessions.
5. The initial SDK login timeout is safe and lets direct ESR fallback run instead of hanging forever.
6. No production deploy, public website change, secrets, mainnet action, real payment, mobile store release, or destructive action was performed.

Expected checks:

```powershell
cd C:\Users\rivne\.config\superpowers\worktrees\gcsc\mobile-blackscreen\mobile\smartcontractor
node node_modules\typescript\bin\tsc --noEmit --pretty false
node node_modules\expo\bin\cli export --platform android --output-dir .tmp\claude-webauth-review-export
```

Set result to `APPROVED` or `CHANGES_REQUESTED`.

## Review (CLAUDE, 2026-07-08, head `9ff8547f`)

Reviewed range `18a0e4f0..9ff8547f` (3 commits: `540c6104`, `db6ee0ba`, `9ff8547f`) — covers both versions of this task (items 1-5 of the db6ee0ba request + items 6-8 of the 9ff8547f update). Diff independently inspected: `lib/webauth.ts` + new `app/webauth-callback.tsx` only.

### Point-by-point

1. **Callback URL shape — CORRECT.** `smartcontractor://webauth-callback?rid=…` matches the `app.json` Android intent filter (`scheme: smartcontractor`, `host: webauth-callback`; verified on branch head). The old `smartcontractor:///webauth-callback` (triple slash) had an empty host, so the host-based filter never matched — consistent with the founder's `Unmatched Route` video.
2. **ESR metadata — CORRECT.** `addSameDeviceInfo()` sets `same_device`, `return_path` (`smartcontractor://webauth-callback`), `req_account` (`gcsctoken111`) via `setInfoKey` on both identity and transfer requests — matches official RN SDK transport `onRequest()`. Founder-device evidence: requestor now renders as `GCSC Token @gcsctoken111`.
3. **Transaction shape — CORRECT.** `link.transact({ actions: [action] }, { broadcast: true })` matches the official SDK README; single-action `{ action }` variant removed.
4. **Signer mismatch check — SAFE.** `signerAccount` falls back to stored-session `from` when Link session is absent; legitimate restored sessions (auth == stored wallet) pass. Rejecting a mismatched signer is correct defence-in-depth: backend P1-1 `expectedFrom` binding would reject such a payment server-side anyway — failing early in the wallet is better UX.
5. **45s SDK-login timeout + direct-ESR-first — SAFE & JUSTIFIED.** Removes the indefinite `cb.anchor.link` hang; direct same-device ESR (proven working on the founder device) is primary, SDK login is a bounded fallback; combined error preserves both causes for diagnostics.
6. **`webauth-callback.tsx` route — CORRECT.** Absorbs the deeplink (no more `Unmatched Route`), dispatches the rebuilt URL through `dispatchWebAuthCallbackUrl`; the pending-URL queue (drained on `waitForCallback` registration) covers the race where the route mounts before the listener exists. After 800ms routes to wallet/connect or jobs — normal role routing untouched (route reachable only via deeplink).
7. **Direct ESR primary — AGREED.** Same-device deeplink flow with no external callback-service dependency is strictly more reliable here.
8. **Boundaries — CLEAN.** Mobile lib + route only; no deploy, public site, secrets, mainnet, real payments, store release, or destructive actions. EAS builds: internal preview only.

### Reviewer verification (fresh worktree `C:\gcsc\.tmp\claude-webauth-review` @ `9ff8547f`, node_modules junction to branch install)

| Check | Result |
|---|---|
| `node node_modules\typescript\bin\tsc --noEmit --pretty false` | PASS (exit 0) |
| `node node_modules\expo\bin\cli export --platform android --output-dir .tmp\claude-webauth-review-export` | PASS (exit 0) |

Note: first tsc run against main's node_modules failed on missing `@proton/react-native-sdk` — expected, the dependency enters in earlier branch commits; junction re-pointed to the branch install (same one CODEX used).

### Minor, non-blocking

- Stale URLs with unmatched `rid` can linger in `pendingCallbackUrls` (capped at 10) — harmless.
- `signTransfer` always attempts Proton Link restore first even for direct-ESR-paired users (fast local fail → fallback) — acceptable; could skip based on session origin later.

### Verdict

- Reviewer decision: **APPROVED** (code, head `9ff8547f`)
- Required checks: PASS
- Unresolved P0/P1 findings: 0
- Remaining verification: physical-device test of `9ff8547f` APK — **blocked by EAS free-plan Android quota (resets 2026-08-01)**. Options for founder: (a) switch `owner` in app.json to the second Expo account `gcsc` (founder owns it; per-account quota → fresh builds; NB: new keystore → uninstall old APK first), (b) wait for quota reset, (c) paid plan. Existing APK `67658bf3` (= `db6ee0ba`) does NOT contain the route fix and cannot validate the root cause.
- Merge to main: BLOCKED until device confirmation + founder approval. No deploy.
