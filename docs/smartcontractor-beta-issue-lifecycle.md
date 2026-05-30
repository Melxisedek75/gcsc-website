# SmartContractor Beta Issue Lifecycle

Date: 2026-05-11

## Purpose

This lifecycle keeps beta feedback moving from tester observation to verified fix without mixing demo feedback with live financial, legal, payment, or Supabase production decisions.

## Status Flow

Use these statuses for every beta issue:

1. `new` - issue was reported but not reviewed yet.
2. `triaged` - severity and trust category were assigned using `docs/smartcontractor-beta-triage-rubric.md`.
3. `fixing` - Codex or founder is working on a safe local fix.
4. `ready for retest` - fix is merged locally or in GitHub and needs the same flow tested again.
5. `verified` - retest passed and evidence was captured.
6. `deferred` - accepted as non-blocking for the current beta scope.
7. `blocked founder` - needs founder approval, external account, legal/provider review, or live-system action.

## Intake Fields

Every issue should include:

- issue id;
- severity;
- trust category;
- request_id if an API call was involved;
- tester role;
- browser, device, and viewport;
- expected result;
- actual result;
- evidence link to screenshot or short video;
- whether it touches legal, identity, real-money, or live-system risk.
- whether it touches `gcscworkcap1`, `gcscclaim111`, `gcsccredit11`, or `gcscadvance1`;
- whether the tester expected ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, token custody, or live smart contract deployment.

## Fix Workflow

Safe local fixes can proceed when:

- the issue is not asking for real loan, real escrow, token collateral, production payment, live Supabase, or legal/provider review action;
- the issue is not asking for live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, or token custody;
- the expected result is clear;
- a validator, smoke test, or checklist can guard the fix;
- the change is scoped and can be committed without unrelated files.

For P0 and P1 fixes, update the related doc, validator, smoke test, or frontend/backend guard before marking the issue ready for retest.

## Retest Workflow

Before marking an issue `verified`, capture:

- retest result;
- tester role used for retest;
- command or browser path tested;
- screenshot, video, or request_id evidence;
- whether the same issue reappeared;
- whether a new issue was created from the retest.

## Founder Approval Gates

Move the issue to `blocked founder` when it involves:

- real loan terms, origination, repayment, default, or underwriting;
- real escrow, stored value, custody, or release of funds;
- token collateral, liquidation, staking-backed credit, or token value promises;
- production payment capture, settlement, refund, or provider activation;
- live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, or token custody;
- live Supabase RLS replacement, admin membership activation, or production database policy changes;
- legal/provider review for lending, escrow, payment handling, identity, contractor verification, or financial claims.

## Acceptance Criteria

- Every beta issue has one status from the lifecycle.
- Every P0/P1 issue has severity, trust category, evidence, and retest result before closure.
- No issue bypasses founder approval gates for real loan, real escrow, token collateral, production payment, live Supabase, or legal/provider review actions.
- No issue bypasses founder approval gates for live smart contract deployment, ClaimBridge advance funding, contract-backed working-capital funding, escrow-backed advance payout, repayment routing, or token custody.
- Verified fixes are linked to a commit, request_id, document update, or validator.
