# AI Review Record

- Change ID: 2026-07-08-signin-prime-wallet-session
- Repository: gcsc-website
- Branch: codex/signin-prime-wallet-session
- Base commit: 9ff8547f410a3c96a663a7ea046207862d0ff24c
- Head commit: 211316d0b7ce956710df8dd5b90060d807e972b5
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Author status: READY_FOR_REVIEW
- Reviewer decision: NOT_REVIEWED
- Required checks: PASS
- Unresolved P0/P1 findings: 0
- Live-risk decision: NOT_REQUIRED
- Founder evidence: NOT_REQUIRED
- Deploy decision: BLOCKED

## Scope

Fix the fresh-login WebAuth session gap on mobile. When an existing user signs in with a wallet already stored on the backend profile, the sign-in flow must prime the local WebAuth session from that backend wallet before routing to jobs. This prevents the first payment attempt after a fresh install/login from failing with `No WebAuth session - call connectWallet() first`.

This does not change payment amounts, recipients, Hyperion verification, WebAuth transaction signing, production deploy settings, public site files, or live blockchain/account configuration.

## Changed Files

- `mobile/smartcontractor/app/(auth)/sign-in.tsx`
- `mobile/smartcontractor/scripts/validate-sign-in-webauth-prime.mjs`
- `ai-review/records/2026-07-08-signin-prime-wallet-session.md`

## Verification

| Check | Command | Result | Evidence |
|---|---|---|---|
| Regression validator | `node scripts/validate-sign-in-webauth-prime.mjs` | PASS | `PASS: sign-in primes the stored WebAuth wallet session before routing` |
| TypeScript | `node node_modules\typescript\bin\tsc --noEmit --pretty false` | PASS | exit 0 |
| Android export | `node node_modules\expo\bin\cli export --platform android --output-dir .tmp\codex-signin-prime-export` | PASS | `Exported: .tmp\codex-signin-prime-export` |

## Findings

| Severity | Finding | Owner | Status |
|---|---|---|---|
| P1 | Existing-wallet sign-in routed to jobs before priming local WebAuth session, leaving the first payment without a local session. | CODEX | FIXED |

## Resolution Log

- Added `primeSessionFromBackend` import to `mobile/smartcontractor/app/(auth)/sign-in.tsx`.
- After successful `login()`, if `user.wallet.account` exists, sign-in now awaits `primeSessionFromBackend(user.wallet.account, user.wallet.permission ?? 'active')` before routing to the homeowner/contractor jobs screen.
- Added a focused validator to block regressions where login routes to jobs before wallet-session priming.
- No merge, deploy, public-site edit, production setting, secret, real payment, XPR signature, or mobile release action was performed.

## Reviewer Notes

- Reviewer independently inspected the diff: NO
- Reviewer independently ran required checks: NO
- Public/live/legal/payment boundary reviewed: NO
- Final rationale: Pending Claude review.

## Sign-off

Filled only by reviewer after independent verification:

- Reviewer decision: NOT_REVIEWED
- Required checks: NOT_RUN
- Unresolved P0/P1 findings: 0
- Live-risk decision: NOT_REQUIRED | FOUNDER_APPROVED | BLOCKED
- Founder evidence: NOT_REQUIRED
- Deploy decision: BLOCKED
