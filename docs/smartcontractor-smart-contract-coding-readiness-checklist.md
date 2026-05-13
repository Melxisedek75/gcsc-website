# SmartContractor Smart Contract Coding Readiness Checklist

Status: internal coding-readiness checklist only. Not deployed. Not legal advice. This checklist does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the minimum evidence required before SmartContractor smart contract work can move from design documents into local code scaffolding for project escrow, loan ledger, token collateral, peer review rewards, authority controls, or backend-to-chain mapping.

Coding readiness means local code scaffolding may be considered after review. It does not mean testnet deployment, live XPR deployment, production provider integration, real money movement, or public launch.

## Required Inputs

| Input | Required Evidence | Status Rule |
|-------|-------------------|-------------|
| Implementation gate | `docs/smartcontractor-smart-contract-implementation-gate.md` is current | Missing evidence keeps coding blocked |
| Authority model | `docs/smartcontractor-smart-contract-authority-model.md` is current | Missing signer/pause policy keeps coding blocked |
| Test fixtures | `docs/smartcontractor-smart-contract-test-fixtures.md` is current | Missing fixture coverage keeps coding blocked |
| Action register | `docs/smartcontractor-smart-contract-action-register.md` is current | Missing action/table/event names keeps coding blocked |
| State machine | `docs/smartcontractor-smart-contract-state-machine.md` is current | Missing terminal or pause rules keeps coding blocked |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` is current | Missing request-id or provider status fields keeps coding blocked |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` is current | Missing API/action/table alignment keeps coding blocked |
| Deployment blockers | `docs/smartcontractor-smart-contract-deployment-blockers.md` is current | Any live-risk blocker keeps deployment blocked |
| Rollback recovery | `docs/smartcontractor-smart-contract-rollback-recovery-plan.md` is current | Missing emergency pause or rollback record keeps coding blocked |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` is current | Missing no-real-money replay path keeps coding blocked |

## Allowed Local Coding Scope

Only these local-only coding activities can be considered after the checklist passes:

- type definitions for non-secret fixture records;
- table/action name constants matching the action register;
- pure state-transition helpers for no-real-money tests;
- validator-only fixtures;
- serialization tests for audit event fields;
- local replay harness placeholders;
- comments that state no live XPR, payment, loan, escrow, repayment, token collateral, stablecoin, or reward action is enabled.

## Not Ready For Coding

Coding remains blocked if any of these are true:

- founder scope approval is missing;
- legal/provider review is missing for escrow, repayment, stablecoin, or public wording;
- finance-provider review is missing for loan, underwriting, repayment, APR, disclosure, or collection semantics;
- security review is missing for authority, upgrade, pause, unpause, or rollback behavior;
- XPR account and permission approval is missing;
- local replay evidence is missing;
- private keys, service-role keys, passwords, seed phrases, raw customer data, provider secrets, or payment credentials appear in any fixture or document;
- any language implies real loan approval, real escrow release, repayment routing, token collateral liquidation, stablecoin settlement, real rewards, or AI final authority.

## Coding Start Record

Before local code scaffolding starts, create a non-secret coding start record with:

- `coding_start_id`
- `module`
- `scope`
- `allowed_files`
- `blocked_files`
- `linked_design_docs`
- `fixture_set`
- `local_replay_status`
- `founder_approval_status`
- `legal_provider_status`
- `finance_provider_status`
- `security_review_status`
- `xpr_account_status`
- `deployment_status`
- `created_at`

Default `deployment_status` is `BLOCKED_FOR_LIVE`.

## Required Checks

- `npm run check:smart-contract-coding-readiness`
- `npm run check:smart-contract-implementation-gate`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-test-fixtures`
- `npm run check:smart-contract-action-register`
- `npm run check:smart-contract-state-machine`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check:smart-contract-deployment-blockers`
- `npm run check:smart-contract-rollback-recovery`
- `npm run check:smart-contract-local-replay`
- `npm run check`

If any check fails, smart contract implementation stays design-only and deployment planning stays blocked.
