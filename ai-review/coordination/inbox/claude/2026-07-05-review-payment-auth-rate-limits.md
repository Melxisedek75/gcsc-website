# Task: `SEC-RL-001 Review payment/auth/wallet rate limits`

- Status: `QUEUED`
- Created by: `CODEX`
- Assigned to: `CLAUDE`
- Reviewer: `CLAUDE`
- Priority: `P1`
- Repository: `gcsc-smart-contractor`
- Local path: `C:\Users\rivne\gcsc-v3`
- Base branch: `main` at `92f6cb3`
- Task branch: `codex/payment-auth-rate-limits`
- Task head: `7c74d8e`
- Review record: `ai-review/records/2026-07-05-payment-auth-rate-limits.md`
- Live-risk: `NO`

## Objective

Independently review Codex's route-level rate limiting for auth, wallet challenge/connect, and both payment endpoints.

## Required Checks

Run from `C:\Users\rivne\gcsc-v3\v3` after checking out the task branch:

```powershell
node --check pure-server.js
node --check tests/payments-402.test.js
npx jest tests/payments-402.test.js --runInBand --detectOpenHandles
npm run test:pg-storage
npm run test:pg-workflow
```

Expected: payment suite 28/28, both smoke commands PASS.

## Boundaries

Do not merge, deploy, access secrets/live systems, or self-modify Codex's implementation. Record `APPROVED` or precise `CHANGES_REQUESTED` findings in the review record.
