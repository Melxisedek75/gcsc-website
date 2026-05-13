# SmartContractor Smart Contract Scaffold Merge Record

Status: internal scaffold merge record only. Not deployed. Not legal advice. This record does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the evidence record that must exist after any future SmartContractor local code scaffolding change is approved for merge. The record is for local code scaffolding only: constants, types, pure state-transition helpers, validator-only fixtures, serialization tests, and local replay harness placeholders.

The merge record keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map scaffolding traceable without enabling live XPR deployment, real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or AI final authority.

## Required Record Fields

| Field | Required Meaning |
|-------|------------------|
| `merge_record_id` | Non-secret identifier for the local scaffold merge record |
| `handoff_id` | Link to the scaffold handoff that authorized review |
| `review_id` | Link to the scaffold review checklist decision |
| `module_owner` | Owner for project escrow, loan ledger, token collateral, peer review rewards, authority controls, or backend-to-chain map |
| `reviewer` | Reviewer who confirmed the scope stayed local-only |
| `allowed_files` | Exact local files merged |
| `blocked_files_checked` | Confirmation that live-risk files stayed untouched |
| `fixture_set` | Demo-only fixture set used for local replay or validator evidence |
| `local_replay_status` | Planned, passed, blocked, or not applicable |
| `audit_event_map_status` | Confirmation that audit-event mapping is linked |
| `deployment_status` | Must remain `BLOCKED_FOR_LIVE` |
| `decision` | `MERGED_LOCAL_ONLY`, `REVISE`, `HOLD`, or `NO_GO` |

## Merge Evidence Checklist

Before marking a scaffold change `MERGED_LOCAL_ONLY`, confirm:

- `merge_record_id`, `handoff_id`, and `review_id` are present and non-secret.
- `module_owner` and `reviewer` match the code ownership plan.
- `allowed_files` match the scaffold file manifest.
- `blocked_files_checked` confirms no live deploy, authority, provider, payment, loan, escrow, collateral, stablecoin, or AI-final files changed.
- `fixture_set` uses no-real-money demo records only.
- `local_replay_status` is passed when state-transition helpers are included.
- `audit_event_map_status` links the affected events and request-id fields.
- `deployment_status` remains `BLOCKED_FOR_LIVE`.
- No live XPR, no real payment, no real loan, no real escrow, no repayment routing, no token collateral liquidation, no stablecoin settlement, and no AI final authority are introduced.

## Decision States

| Decision | Meaning |
|----------|---------|
| MERGED_LOCAL_ONLY | Merge is recorded for local scaffold files only; deployment and real-money actions remain blocked |
| REVISE | Merge record is incomplete or the scope needs correction |
| HOLD | Required owner, reviewer, handoff, review, fixture, replay, or audit evidence is missing |
| NO_GO | Change touches live money, secrets, external accounts, legal claims, public claims, or production deployment |

Default decision is `HOLD` until the evidence is complete.

## Required Checks

- `npm run check:smart-contract-scaffold-merge-record`
- `npm run check:smart-contract-scaffold-review`
- `npm run check:smart-contract-scaffold-file-manifest`
- `npm run check:smart-contract-scaffold-handoff`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, the scaffold merge record stays `HOLD` and smart contract implementation remains design-only.
