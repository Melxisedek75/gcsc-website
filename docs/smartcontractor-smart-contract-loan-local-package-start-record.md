# SmartContractor Smart Contract Loan Local Package Start Record

Status: internal local package start record only. Not deployed. Not legal advice. This record does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Open the fourth local-only smart contract implementation work package: `WP-LOAN-LOCAL`. This record allows only loan state constants, signed-contract receivables fixture planning, repayment-first waterfall fixture planning, and deterministic no-real-money replay alignment before any local loan implementation begins.

This record is not a release record, not a deployment approval, not a public claim, not legal approval, and not finance-provider approval. It keeps loan ledger logic separate from real loan origination, real escrow, repayment routing, token collateral, stablecoin settlement, provider underwriting, and production payment movement until audit, authority, and escrow package start records remain aligned with legal/provider, finance-provider, technical, local replay, audit event, and backend-to-chain evidence.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Audit local package start | `docs/smartcontractor-smart-contract-audit-local-package-start-record.md` |
| Authority local package start | `docs/smartcontractor-smart-contract-authority-local-package-start-record.md` |
| Escrow local package start | `docs/smartcontractor-smart-contract-escrow-local-package-start-record.md` |
| Loan legal risk model | `docs/smartcontractor-loan-legal-risk-model.md` |
| Contract-backed loan implementation readiness matrix | `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md` |
| Local package start template | `docs/smartcontractor-smart-contract-local-package-start-template.md` |
| Package index | `docs/smartcontractor-smart-contract-local-implementation-package-index.md` |
| Local implementation kickoff | `docs/smartcontractor-smart-contract-local-implementation-kickoff-record.md` |
| Local implementation plan | `docs/smartcontractor-smart-contract-local-implementation-plan.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## IDs

- `package_start_record_id`: `SC-LOAN-LOCAL-START-001`
- `package_index_id`: `SC-LOCAL-PACKAGE-INDEX-001`
- `kickoff_record_id`: `SC-LOCAL-KICKOFF-001`
- `implementation_plan_id`: `SC-LOCAL-IMPLEMENTATION-PLAN-001`
- `work_package_id`: `WP-LOAN-LOCAL`

## Ownership

- `module_owner`: Codex local smart contract implementation owner
- `reviewer`: founder or future smart contract reviewer before public or live use
- `review_due`: before any loan helper merge, public wording, live XPR deployment, provider integration, or real-money action

## Scope

- `allowed_files`: future local loan state constants, local signed-contract receivables fixtures, local repayment-first waterfall fixtures, validator-only replay evidence, and documentation under approved smart contract local paths
- `blocked_files_checked`: live deployment scripts, production loan origination handlers, provider underwriting adapters, repayment routing handlers, production payment provider adapters, stablecoin settlement handlers, token collateral lock handlers, wallet/key files, raw customer exports, public whitepaper files, public website files, and external account configs
- `fixture_set`: deterministic no-real-money loan ledger and receivables fixtures only
- `dependency_status`: package index reviewed; `WP-AUDIT-LOCAL`, `WP-AUTHORITY-LOCAL`, and `WP-ESCROW-LOCAL` start records exist; `WP-LOAN-LOCAL` is fourth in order
- `local_replay_status`: `READY_LOCAL`
- `audit_event_map_status`: `READY_LOCAL`
- `backend_to_chain_map_status`: `READY_LOCAL`
- `authority_model_status`: `READY_LOCAL`
- `escrow_fixture_status`: `READY_LOCAL`

## Decision

- `package_start_decision`: `START_LOCAL_ONLY`
- `decision_reason`: loan state constants, signed-contract receivables fixtures, and repayment-first waterfall fixtures can start locally because audit, authority, and escrow local start records exist and all live-risk triggers remain blocked.
- `deployment_status`: `BLOCKED_FOR_LIVE`

## Blocked Trigger Review

- `live_xpr_deployment_checked`: blocked
- `real_payment_checked`: blocked
- `real_loan_checked`: blocked
- `real_escrow_checked`: blocked
- `repayment_routing_checked`: blocked
- `token_collateral_liquidation_checked`: blocked
- `stablecoin_settlement_checked`: blocked
- `ai_final_authority_checked`: blocked
- `secrets_checked`: no secrets allowed
- `public_claims_checked`: no public claims allowed
- `loan_origination_checked`: blocked
- `provider_underwriting_checked`: blocked
- `borrower_obligation_checked`: blocked
- `lender_or_bank_claim_checked`: blocked

## Required Checks

- `npm run check:smart-contract-loan-local-package-start`
- `npm run check:smart-contract-escrow-local-package-start`
- `npm run check:smart-contract-authority-local-package-start`
- `npm run check:smart-contract-audit-local-package-start`
- `npm run check:legal-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix`
- `npm run check:smart-contract-local-package-start-template`
- `npm run check:smart-contract-local-implementation-package-index`
- `npm run check:smart-contract-local-implementation-kickoff`
- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, `package_start_decision` returns to `HOLD` and local loan implementation must not start.
