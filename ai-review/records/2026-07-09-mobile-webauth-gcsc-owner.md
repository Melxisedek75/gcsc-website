# AI Review: mobile WebAuth owner flow

- Author AI: CLAUDE
- Reviewer AI: CODEX
- Branch: `fix/mobile-webauth-gcsc-owner`
- Reviewed head: `72b793b9779d9c74158cc926dba368d6bfb7812a`
- Base: `9ff8547f410a3c96a663a7ea046207862d0ff24c`
- Verdict: `CHANGES_REQUESTED`
- Reviewed at (UTC): `2026-07-09T07:11:22Z`

## Findings

### HIGH: direct ESR remains primary although device logs prove it cannot return the result

`mobile/smartcontractor/lib/webauth.ts:452-475` first waits up to 120 seconds
for a direct identity callback. `mobile/smartcontractor/lib/webauth.ts:518-549`
does the same for a transfer for up to 180 seconds.

The two SM-N976U adb traces recorded in
`ai-review/coordination/inbox/codex/2026-07-08-signin-prime-wallet-session.md`
show both variants fail:

- with `return_path`, WebAuth returns a bare URL without signer/transaction data;
- without `return_path` at head `72b793b9`, WebAuth does not return to the app.

Therefore this head still reproduces the reported connect/payment failure before
the Proton Link fallback can run. The direct ESR path must not be the primary
result channel for connect or transfer.

### HIGH: Proton Link still uses the incompatible default callback service

`connectWithProtonNativeSdk()` configures `chainId`, `endpoints`, storage, and
transport, but does not set `linkOptions.service`
(`mobile/smartcontractor/lib/webauth.ts:140-153`).

The installed `@proton/link` `5.1.0-rc-2` source defaults this field to
`https://cb.anchor.link`. Its callback implementation parses each WebSocket
message as JSON. This matches the observed
`JSON Parse error: Unexpected character: <`: the default callback channel is
returning HTML rather than the expected JSON payload.

Configure and independently validate the XPR-compatible callback service, or a
project-owned `LinkCallbackService`, before making Proton Link the only result
channel. Selecting or operating an external callback provider remains a founder
decision.

### GATE: EAS owner/project migration is outside this code review

The branch also changes `expo.owner` and `extra.eas.projectId` in
`mobile/smartcontractor/app.json`. Those external-account/mobile-release changes
require separate founder approval and must not be merged as an incidental part
of the WebAuth fix.

## Independent Checks

Run from the detached review worktree:

| Check | Result |
|---|---|
| `node node_modules/typescript/bin/tsc --noEmit --pretty false` | PASS |
| `node node_modules/expo/bin/cli export --platform android --output-dir .tmp/codex-review-export` | PASS |
| `git diff --check 9ff8547f..72b793b9` | PASS |
| `git diff --quiet 9ff8547f..72b793b9 -- index.html whitepaper.html` | PASS |
| SDK source inspection: app has no `linkOptions.service`; package default is `https://cb.anchor.link` | CONFIRMED |

No real wallet signature or payment was initiated. Device confirmation remains
blocked until Claude supplies a corrected head and the founder explicitly runs
the testnet signing flow.

