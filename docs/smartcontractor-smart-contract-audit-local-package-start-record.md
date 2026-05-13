# SmartContractor Smart Contract Audit Local Package Start Record

Status: internal local package start record only. Not deployed. Not legal advice. This record does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Open the first local-only smart contract implementation work package: `WP-AUDIT-LOCAL`. This record allows only audit-event serialization planning, request-id mapping, and deterministic no-real-money fixture alignment before any local audit implementation begins.

This record is not a release record, not a deployment approval, not a public claim, not legal approval, and not finance-provider approval. It keeps audit serialization separate from project escrow, loan ledger, token collateral, peer review rewards, and authority controls until the local package start template, package index, kickoff record, ownership plan, local replay checklist, audit event map, and backend-to-chain map remain aligned.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Local package start template | `docs/smartcontractor-smart-contract-local-package-start-template.md` |
| Package index | `docs/smartcontractor-smart-contract-local-implementation-package-index.md` |
| Local implementation kickoff | `docs/smartcontractor-smart-contract-local-implementation-kickoff-record.md` |
| Local implementation plan | `docs/smartcontractor-smart-contract-local-implementation-plan.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## IDs

- `package_start_record_id`: `SC-AUDIT-LOCAL-START-001`
- `package_index_id`: `SC-LOCAL-PACKAGE-INDEX-001`
- `kickoff_record_id`: `SC-LOCAL-KICKOFF-001`
- `implementation_plan_id`: `SC-LOCAL-IMPLEMENTATION-PLAN-001`
- `work_package_id`: `WP-AUDIT-LOCAL`

## Ownership

- `module_owner`: Codex local smart contract implementation owner
- `reviewer`: founder or future smart contract reviewer before public or live use
- `review_due`: before any scaffold merge, public wording, live XPR deployment, or real-money action

## Scope

- `allowed_files`: future local audit serialization helpers, local audit fixture files, validator-only replay evidence, and documentation under approved smart contract local paths
- `blocked_files_checked`: live deployment scripts, production webhook handlers, payment provider adapters, raw customer exports, wallet/key files, public whitepaper files, public website files, and external account configs
- `fixture_set`: deterministic no-real-money audit event fixtures only
- `dependency_status`: package index reviewed; `WP-AUDIT-LOCAL` is first in order
- `local_replay_status`: `READY_LOCAL`
- `audit_event_map_status`: `READY_LOCAL`
- `backend_to_chain_map_status`: `READY_LOCAL`

## Decision

- `package_start_decision`: `START_LOCAL_ONLY`
- `decision_reason`: audit serialization and request-id mapping can start locally because dependencies are evidence-linked and live-risk triggers remain blocked.
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

## Required Checks

- `npm run check:smart-contract-audit-local-package-start`
- `npm run check:smart-contract-local-package-start-template`
- `npm run check:smart-contract-local-implementation-package-index`
- `npm run check:smart-contract-local-implementation-kickoff`
- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, `package_start_decision` returns to `HOLD` and local audit implementation must not start.
