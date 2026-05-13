# SmartContractor Smart Contract Local Package Start Template

Status: internal local package start template only. Not deployed. Not legal advice. This template does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Provide the exact local-only template for opening one SmartContractor smart contract work package after the package index allows it to start. This template records the package scope, dependencies, files, fixtures, and blocked live-risk checks before any local implementation begins.

This template is not a release record, not a deployment approval, not a public claim, not legal approval, and not finance-provider approval. It keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, and audit serialization work inside local files, deterministic fixtures, and validator checks.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Package index | `docs/smartcontractor-smart-contract-local-implementation-package-index.md` |
| Local implementation kickoff | `docs/smartcontractor-smart-contract-local-implementation-kickoff-record.md` |
| Local implementation plan | `docs/smartcontractor-smart-contract-local-implementation-plan.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## Template

```md
# Local Package Start Record: <work_package_id>

Status: local-only start record. Deployment status: BLOCKED_FOR_LIVE.

## IDs

- package_start_record_id:
- package_index_id:
- kickoff_record_id:
- implementation_plan_id:
- work_package_id:

## Ownership

- module_owner:
- reviewer:
- review_due:

## Scope

- allowed_files:
- blocked_files_checked:
- fixture_set:
- dependency_status:
- local_replay_status:
- audit_event_map_status:
- backend_to_chain_map_status:

## Decision

- package_start_decision: START_LOCAL_ONLY | REVISE | HOLD | NO_GO
- decision_reason:
- deployment_status: BLOCKED_FOR_LIVE

## Blocked Trigger Review

- live_xpr_deployment_checked:
- real_payment_checked:
- real_loan_checked:
- real_escrow_checked:
- repayment_routing_checked:
- token_collateral_liquidation_checked:
- stablecoin_settlement_checked:
- ai_final_authority_checked:
- secrets_checked:
- public_claims_checked:
```

## Allowed Decisions

| Decision | Meaning |
|----------|---------|
| START_LOCAL_ONLY | The work package may start in allowed files only; live deployment and real-money scope remain blocked |
| REVISE | The package start record needs tighter scope, missing IDs, missing owner/reviewer, or missing dependency evidence |
| HOLD | Required package index, kickoff, replay, audit, backend mapping, or ownership evidence is incomplete |
| NO_GO | Scope touches live money, live XPR, secrets, external accounts, legal claims, public claims, or AI final authority |

Default decision is `HOLD` until all fields and blocked-trigger checks are complete.

## Blocked Package Start Triggers

Any of these force `NO_GO`:

- live XPR deployment, setcode, setabi, updateauth, linkauth, or permission change;
- real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or bank/provider money movement;
- AI final authority for completion, payment release, default, liquidation, reward, dispute outcome, or milestone acceptance;
- private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, production webhook payloads, or live wallet balances;
- public whitepaper, website, partner, grant, investor, deck, email, social, or announcement claims.

## Required Checks

- `npm run check:smart-contract-local-package-start-template`
- `npm run check:smart-contract-local-implementation-package-index`
- `npm run check:smart-contract-local-implementation-kickoff`
- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, package_start_decision stays `HOLD` and local implementation must not start.
