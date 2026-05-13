# SmartContractor Smart Contract Review Local Package Start Record

Status: internal local package start record only. Not deployed. Not legal advice. This record does not approve real escrow, does not approve real loans, does not approve real token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, does not approve live XPR contract deployment, and does not approve AI or peer review as final payment-release authority.

## Purpose

Open the sixth local-only smart contract implementation work package: `WP-REVIEW-LOCAL`. This record allows only peer review state constants, review metadata fixture planning, reputation-point fixture planning, reward-payable placeholder planning, conflict-of-interest fixture planning, and deterministic no-real-money replay alignment before any local peer review implementation begins.

This record is not a release record, not a deployment approval, not a public claim, not legal approval, and not finance-provider approval. It keeps peer review and reward logic separate from real payment release, real escrow decisions, real loan approval, real reward payouts, token issuance, reviewer compensation, reputation penalties, public reputation claims, and final dispute authority until audit, authority, escrow, loan, and collateral package start records remain aligned with founder, legal/provider, technical, local replay, audit event, and backend-to-chain evidence.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Audit local package start | `docs/smartcontractor-smart-contract-audit-local-package-start-record.md` |
| Authority local package start | `docs/smartcontractor-smart-contract-authority-local-package-start-record.md` |
| Escrow local package start | `docs/smartcontractor-smart-contract-escrow-local-package-start-record.md` |
| Loan local package start | `docs/smartcontractor-smart-contract-loan-local-package-start-record.md` |
| Collateral local package start | `docs/smartcontractor-smart-contract-collateral-local-package-start-record.md` |
| Smart contract design | `docs/smartcontractor-smart-contract-design.md` |
| Dispute research | `docs/upwork-research-smartcontractor-disputes.md` |
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

- `package_start_record_id`: `SC-REVIEW-LOCAL-START-001`
- `package_index_id`: `SC-LOCAL-PACKAGE-INDEX-001`
- `kickoff_record_id`: `SC-LOCAL-KICKOFF-001`
- `implementation_plan_id`: `SC-LOCAL-IMPLEMENTATION-PLAN-001`
- `work_package_id`: `WP-REVIEW-LOCAL`

## Ownership

- `module_owner`: Codex local smart contract implementation owner
- `reviewer`: founder or future smart contract reviewer before public or live use
- `review_due`: before any review helper merge, public reputation wording, live XPR deployment, real reward payout, dispute authority claim, or payment-release integration

## Scope

- `allowed_files`: future local peer review state constants, local review metadata fixtures, local reputation-point fixtures, local reward-payable placeholders, local conflict-of-interest fixtures, validator-only replay evidence, and documentation under approved smart contract local paths
- `blocked_files_checked`: live deployment scripts, production reward payout handlers, token issuance handlers, payment release handlers, escrow decision handlers, loan approval handlers, dispute finality handlers, AI-final-authority handlers, production payment provider adapters, stablecoin settlement handlers, wallet/key files, raw customer exports, public whitepaper files, public website files, and external account configs
- `fixture_set`: deterministic no-real-money peer review and reward-placeholder fixtures only
- `dependency_status`: package index reviewed; `WP-AUDIT-LOCAL`, `WP-AUTHORITY-LOCAL`, `WP-ESCROW-LOCAL`, `WP-LOAN-LOCAL`, and `WP-COLLATERAL-LOCAL` start records exist; `WP-REVIEW-LOCAL` is sixth in order
- `local_replay_status`: `READY_LOCAL`
- `audit_event_map_status`: `READY_LOCAL`
- `backend_to_chain_map_status`: `READY_LOCAL`
- `authority_model_status`: `READY_LOCAL`
- `escrow_fixture_status`: `READY_LOCAL`
- `loan_fixture_status`: `READY_LOCAL`
- `collateral_fixture_status`: `READY_LOCAL`

## Decision

- `package_start_decision`: `START_LOCAL_ONLY`
- `decision_reason`: peer review state constants, review metadata fixtures, reward-payable placeholders, reputation-point fixtures, and conflict-of-interest fixtures can start locally because audit, authority, escrow, loan, and collateral local start records exist and all live-risk triggers remain blocked.
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
- `peer_review_final_authority_checked`: blocked
- `real_reward_payout_checked`: blocked
- `token_issuance_checked`: blocked
- `public_reputation_claims_checked`: blocked
- `secrets_checked`: no secrets allowed
- `public_claims_checked`: no public claims allowed

## Required Checks

- `npm run check:smart-contract-review-local-package-start`
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

If any check fails, `package_start_decision` returns to `HOLD` and local peer review implementation must not start.
