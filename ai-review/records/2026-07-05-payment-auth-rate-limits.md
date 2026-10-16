# AI Review Record

- Change ID: 2026-07-05-payment-auth-rate-limits
- Repository: gcsc-smart-contractor
- Branch: codex/payment-auth-rate-limits
- Author AI: CODEX
- Reviewer AI: CLAUDE
- Author status: READY_FOR_REVIEW
- Reviewer decision: PENDING
- Required checks: PASS
- Unresolved P0/P1 findings: 0
- Live-risk decision: NOT_REQUIRED
- Founder evidence: NOT_REQUIRED
- Deploy decision: BLOCKED_PENDING_REVIEW

## Scope

Add route-level rate limiting to the sensitive endpoints that were not covered by the existing limiter:

- `POST /api/wallet/challenge`
- `POST /api/payment/lead-token`
- `POST /api/payment/job-posting`

Existing auth rate limiting for register/login and wallet-connect remains unchanged. Payment limits use `PAYMENT_RATE_LIMIT_MAX` and `PAYMENT_RATE_LIMIT_WINDOW_MS`; wallet challenge shares the existing wallet limit bucket configuration.

## Source

- Backend branch: `codex/payment-auth-rate-limits`
- Head: `7c74d8e`
- Base: backend `main` at `92f6cb3`
- Changed files:
  - `v3/pure-server.js`
  - `v3/tests/payments-402.test.js`

## TDD Evidence

Before implementation, the targeted suite produced the expected RED result:

- auth login limiter: PASS;
- wallet challenge third request: expected 429, received 200;
- both payment endpoint third requests: expected 429, received 402.

After the route mapping change, all four targeted limiter tests passed.

## Author Verification

| Command | Result |
|---|---|
| `node --check pure-server.js` | PASS |
| `node --check tests/payments-402.test.js` | PASS |
| `npx --no-install jest tests/payments-402.test.js --runInBand --detectOpenHandles -t "sensitive endpoint rate limits"` | PASS, 4/4 |
| `npx --no-install jest tests/payments-402.test.js --runInBand --detectOpenHandles` | PASS, 28/28 x2 |
| `npm run test:pg-storage` | PASS |
| `npm run test:pg-workflow` | PASS |

## Reviewer Instructions

Independently inspect the two-file diff and rerun the exact verification commands from `v3/`. Confirm:

1. register/login remain rate limited;
2. both wallet challenge and wallet connect are rate limited;
3. both payment routes are rate limited;
4. payment route limits are independently configurable through environment variables;
5. existing payment, sender-binding, wallet-proof, and PostgreSQL smoke behavior remains green.

Set `Reviewer decision: APPROVED` only after independent verification. Do not merge or deploy.
