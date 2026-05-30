# SmartContractor Beta Go/No-Go Scorecard

Date: 2026-05-11

## Purpose

This scorecard helps the founder decide whether SmartContractor is ready for the next demo-safe beta step. It is not approval for real loans, escrow, token collateral, production payment capture, live Supabase policy changes, live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, token custody, or legal/provider decisions.

## Required Inputs

Review these inputs before making the decision:

- `docs/smartcontractor-public-beta-review-packet.md`;
- `docs/smartcontractor-beta-triage-rubric.md`;
- `docs/smartcontractor-beta-issue-lifecycle.md`;
- `docs/smartcontractor-beta-decision-log.md`;
- latest `npm run check` result;
- non-secret screenshots, videos, request IDs, and tester notes from the beta session.

## Scorecard

Rate each area as `green`, `yellow`, or `red`:

| Area | Green | Yellow | Red |
|------|-------|--------|-----|
| auth/session | Tester can start and continue a demo session without confusion | Minor copy or retry confusion | Session failure blocks flow |
| homeowner flow | Job intake is understandable and demo-safe | Minor wording or layout friction | Homeowner cannot create or understand job request |
| contractor flow | Bid and simulated starter loan flow are clear | Minor trust or copy issue | Contractor cannot understand bid/credit path |
| payment simulation | Demo clearly says simulated and no production payment occurs | Tester asks for clarification | UI implies real capture, escrow, or repayment |
| dispute evidence | Evidence metadata path is clear | Minor upload/copy confusion | Tester cannot understand dispute evidence purpose |
| peer review | Reviewer scoring purpose is clear | Minor scoring wording issue | Reviewer flow creates trust or fairness concern |
| admin/risk review | Admin sees blockers and review queue clearly | Minor filtering/copy issue | Admin cannot identify live-risk blockers |
| smart contract product surface | `gcscworkcap1`, `gcscclaim111`, `gcsccredit11`, and `gcscadvance1` read as demo-only status cards with safe scope, blocked-live reasons, and next review steps | Tester needs wording clarified, but understands nothing is live | Tester thinks any card is live or expects ClaimBridge, working-capital, escrow-backed advance, repayment routing, token custody, or live deployment |
| mobile/PWA | Main demo works on phone width | Minor visual issue | Mobile layout blocks core demo path |

## Automatic No-Go Conditions

The next beta step is `no-go` if any of these are true:

- unresolved P0 issue exists;
- UI or docs imply real loan approval, origination, repayment, or default handling;
- UI or docs imply real escrow, custody, stored value, or release of funds;
- UI or docs imply token collateral lock, liquidation, or guaranteed token value;
- production payment capture, settlement, or refund is enabled or implied;
- `gcscworkcap1`, `gcscclaim111`, `gcsccredit11`, or `gcscadvance1` is interpreted as live;
- UI or docs imply live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, or token custody;
- live Supabase RLS, admin role, or database policy change is required before the demo;
- any secret, API key, database password, service-role key, private key, or seed phrase appears in evidence.

## Founder Decision

Record one decision in `docs/smartcontractor-beta-decision-log.md`:

- `go`: proceed to the next demo-safe beta step;
- `conditional go`: proceed only after listed P1 fixes;
- `no-go`: stop and fix blockers before inviting another tester;
- `blocked founder`: needs founder, legal/provider, external account, or live-system action.

## Acceptance Criteria

- Every scorecard area has a color.
- Every red area links to a beta issue id.
- No unresolved P0 issue remains for a `go` decision.
- Real loan, real escrow, token collateral, production payment, and live Supabase actions remain blocked unless separately approved by the founder and reviewed by the right legal/provider party.
- Smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, and token custody remain blocked unless separately approved by the founder and reviewed by the right legal/provider/security party.
- The decision is recorded in the beta decision log with non-secret evidence references.
