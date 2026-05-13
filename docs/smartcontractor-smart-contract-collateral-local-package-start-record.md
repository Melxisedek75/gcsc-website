# SmartContractor Smart Contract Collateral Local Package Start Record

Status: internal local package start record only. Not deployed. Not legal advice. This record does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Open the fifth local-only smart contract implementation work package: `WP-COLLATERAL-LOCAL`. This record allows only collateral state constants, token estimate fixture planning, oracle snapshot placeholder planning, LTV label fixture planning, and deterministic no-real-money replay alignment before any local collateral implementation begins.

This record is not a release record, not a deployment approval, not a public claim, not legal approval, and not finance-provider approval. It keeps token collateral logic separate from real token locking, liens, custody, margin calls, liquidation, real loan origination, repayment routing, stablecoin settlement, provider underwriting, and production payment movement until audit, authority, escrow, and loan package start records remain aligned with legal/provider, finance-provider, technical, local replay, audit event, and backend-to-chain evidence.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Audit local package start | `docs/smartcontractor-smart-contract-audit-local-package-start-record.md` |
| Authority local package start | `docs/smartcontractor-smart-contract-authority-local-package-start-record.md` |
| Escrow local package start | `docs/smartcontractor-smart-contract-escrow-local-package-start-record.md` |
| Loan local package start | `docs/smartcontractor-smart-contract-loan-local-package-start-record.md` |
| Smart contract design | `docs/smartcontractor-smart-contract-design.md` |
| Loan legal risk model | `docs/smartcontractor-loan-legal-risk-model.md` |
| Test fixtures | `docs/smartcontractor-smart-contract-test-fixtures.md` |
| Local package start template | `docs/smartcontractor-smart-contract-local-package-start-template.md` |
| Package index | `docs/smartcontractor-smart-contract-local-implementation-package-index.md` |
| Local implementation kickoff | `docs/smartcontractor-smart-contract-local-implementation-kickoff-record.md` |
| Local implementation plan | `docs/smartcontractor-smart-contract-local-implementation-plan.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## IDs

- `package_start_record_id`: `SC-COLLATERAL-LOCAL-START-001`
- `package_index_id`: `SC-LOCAL-PACKAGE-INDEX-001`
- `kickoff_record_id`: `SC-LOCAL-KICKOFF-001`
- `implementation_plan_id`: `SC-LOCAL-IMPLEMENTATION-PLAN-001`
- `work_package_id`: `WP-COLLATERAL-LOCAL`

## Ownership

- `module_owner`: Codex local smart contract implementation owner
- `reviewer`: founder or future smart contract reviewer before public or live use
- `review_due`: before any collateral helper merge, public wording, live XPR deployment, custody integration, oracle integration, or real-money action

## Scope

- `allowed_files`: future local collateral state constants, local token estimate fixtures, local LTV label fixtures, local oracle snapshot placeholders, validator-only replay evidence, and documentation under approved smart contract local paths
- `blocked_files_checked`: live deployment scripts, production token lock handlers, custody provider adapters, oracle provider adapters, liquidation handlers, margin call handlers, repayment routing handlers, production payment provider adapters, stablecoin settlement handlers, wallet/key files, raw customer exports, public whitepaper files, public website files, and external account configs
- `fixture_set`: deterministic no-real-money collateral estimate fixtures only
- `dependency_status`: package index reviewed; `WP-AUDIT-LOCAL`, `WP-AUTHORITY-LOCAL`, `WP-ESCROW-LOCAL`, and `WP-LOAN-LOCAL` start records exist; `WP-COLLATERAL-LOCAL` is fifth in order
- `local_replay_status`: `READY_LOCAL`
- `audit_event_map_status`: `READY_LOCAL`
- `backend_to_chain_map_status`: `READY_LOCAL`
- `authority_model_status`: `READY_LOCAL`
- `loan_fixture_status`: `READY_LOCAL`

## Decision

- `package_start_decision`: `START_LOCAL_ONLY`
- `decision_reason`: collateral state constants, token estimate fixtures, LTV labels, and oracle snapshot placeholders can start locally because audit, authority, escrow, and loan local start records exist and all live-risk triggers remain blocked.
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
- `real_token_lock_checked`: blocked
- `custody_provider_checked`: blocked
- `oracle_provider_checked`: blocked
- `margin_call_checked`: blocked
- `token_price_appreciation_claim_checked`: blocked

## Required Checks

- `npm run check:smart-contract-collateral-local-package-start`
- `npm run check:smart-contract-loan-local-package-start`
- `npm run check:smart-contract-escrow-local-package-start`
- `npm run check:smart-contract-authority-local-package-start`
- `npm run check:smart-contract-audit-local-package-start`
- `npm run check:smart-contract-test-fixtures`
- `npm run check:contract-docs`
- `npm run check:legal-review`
- `npm run check:smart-contract-local-package-start-template`
- `npm run check:smart-contract-local-implementation-package-index`
- `npm run check:smart-contract-local-implementation-kickoff`
- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, `package_start_decision` returns to `HOLD` and local collateral implementation must not start.
