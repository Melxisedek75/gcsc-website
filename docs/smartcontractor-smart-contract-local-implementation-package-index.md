# SmartContractor Smart Contract Local Implementation Package Index

Status: internal local implementation package index only. Not deployed. Not legal advice. This index does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the safe order for starting local SmartContractor smart contract implementation work packages after a kickoff record exists. This index keeps local code work sequenced, reviewable, and tied to evidence before any allowed file changes begin.

This index is not a release plan and not a public claim. It exists to prevent parallel local work from mixing project escrow, loan ledger, token collateral, peer review rewards, authority controls, and audit serialization without clear dependencies and blocked live-risk boundaries.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Local implementation plan | `docs/smartcontractor-smart-contract-local-implementation-plan.md` |
| Local implementation kickoff | `docs/smartcontractor-smart-contract-local-implementation-kickoff-record.md` |
| Scaffold release gate | `docs/smartcontractor-smart-contract-scaffold-release-gate.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## Package Start Order

| Order | Work Package | Start Condition | Why |
|-------|--------------|-----------------|-----|
| 1 | `WP-AUDIT-LOCAL` | kickoff_decision = `START_LOCAL_ONLY` and audit_event_map_status = `READY_LOCAL` | audit serialization and request IDs should be stable before business logic emits events |
| 2 | `WP-AUTHORITY-LOCAL` | pause/role constants and blocked files checked | authority and pause boundaries should exist before escrow, loan, collateral, or review helpers |
| 3 | `WP-ESCROW-LOCAL` | backend_to_chain_map_status = `READY_LOCAL` and local_replay_status = `READY_LOCAL` | milestone states are the center of project-contract workflow |
| 4 | `WP-LOAN-LOCAL` | escrow fixtures exist and repayment waterfall remains local-only | signed-contract receivables and repayment-first fixtures depend on milestone states |
| 5 | `WP-COLLATERAL-LOCAL` | loan fixture values exist and token collateral remains estimate-only | collateral estimates should not imply locks, liens, margin calls, or liquidation |
| 6 | `WP-REVIEW-LOCAL` | escrow/loan/audit outputs can be referenced as fixtures | peer review rewards and reputation events should not create payment-release authority |

## Required Package Fields

Each package index row or start note must include:

- `package_index_id`
- `kickoff_record_id`
- `work_package_id`
- `package_order`
- `dependency_status`
- `allowed_files`
- `blocked_files_checked`
- `fixture_set`
- `local_replay_status`
- `audit_event_map_status`
- `backend_to_chain_map_status`
- `deployment_status` = `BLOCKED_FOR_LIVE`
- `package_start_decision` = `START_LOCAL_ONLY`, `REVISE`, `HOLD`, or `NO_GO`

## Blocked Package Starts

Any of these force `NO_GO`:

- live XPR deployment, setcode, setabi, updateauth, linkauth, or permission change;
- real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or bank/provider money movement;
- AI final authority for completion, payment release, default, liquidation, reward, dispute outcome, or milestone acceptance;
- private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, production webhook payloads, or live wallet balances;
- public whitepaper, website, partner, grant, investor, deck, email, social, or announcement claims.

## Required Checks

- `npm run check:smart-contract-local-implementation-package-index`
- `npm run check:smart-contract-local-implementation-kickoff`
- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, the affected work package stays `HOLD` and local implementation must not start for that package.
