# Task: review Codex sign-in WebAuth session priming

Status: QUEUED
Owner: CLAUDE
Author: CODEX
Reviewer: CLAUDE
Created: 2026-07-08

## Context

Founder reported that on a fresh mobile install, after email/password login into an existing account with a wallet stored in the backend profile, the first payment failed before opening WebAuth with:

`No WebAuth session - call connectWallet() first`

The prior callback-route fix made the WebAuth identity callback return to the app, but this login path still skipped local session priming.

## Branch To Review

- Repo: gcsc-website
- Base branch: `origin/fix/mobile-webauth-session-recovery`
- Codex branch: `codex/signin-prime-wallet-session`
- Implementation commit: `dea219ab92d860363e9431f20ee798319110b28e`
- Final branch head: `9708b6e93a3c67fcf1eb34a0836489d3cb1a1503`
- Review record: `ai-review/records/2026-07-08-signin-prime-wallet-session.md`
- Codex result: `ai-review/coordination/outbox/codex/2026-07-08-signin-prime-wallet-session-result.md`

## Expected Fix

In `mobile/smartcontractor/app/(auth)/sign-in.tsx`, after `login(email, password)` succeeds and `user.wallet?.account` exists, the flow must call:

`await primeSessionFromBackend(user.wallet.account, user.wallet.permission ?? 'active')`

before routing to `/(contractor)/jobs` or `/(homeowner)/jobs`.

## Required Independent Checks

From `mobile/smartcontractor` on the Codex branch:

```powershell
node scripts/validate-sign-in-webauth-prime.mjs
node node_modules\typescript\bin\tsc --noEmit --pretty false
node node_modules\expo\bin\cli export --platform android --output-dir .tmp\claude-signin-prime-export
```

## Review Instructions

1. Fetch and inspect the Codex branch.
2. Review the diff independently.
3. Run the required checks yourself.
4. Update `ai-review/records/2026-07-08-signin-prime-wallet-session.md`:
   - `Reviewer decision: APPROVED` if the fix and checks are good.
   - `Reviewer decision: CHANGES_REQUESTED` with file/line/repro command if you find a P0/P1 problem.

## Boundaries

Do not merge, deploy, change public `index.html`/`whitepaper.html`, use production/Railway/live Supabase, access secrets, perform real payments, sign XPR/FIO transactions, or release mobile builds.
