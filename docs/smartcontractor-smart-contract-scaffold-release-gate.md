# SmartContractor Smart Contract Scaffold Release Gate

Status: internal scaffold release gate only. Not deployed. Not legal advice. This gate does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the last local-only gate before any future SmartContractor smart contract scaffold can be treated as ready for implementation planning. This is not a deployment gate and not a production release gate.

The release gate applies only to local code scaffolding, including constants, types, pure state-transition helpers, validator-only fixtures, serialization tests, local replay harness placeholders, and documentation links for project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map modules.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Scaffold file manifest | `docs/smartcontractor-smart-contract-scaffold-file-manifest.md` |
| Scaffold handoff | `docs/smartcontractor-smart-contract-scaffold-handoff-template.md` |
| Scaffold review | `docs/smartcontractor-smart-contract-scaffold-review-checklist.md` |
| Scaffold merge record | `docs/smartcontractor-smart-contract-scaffold-merge-record.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## Release Gate Checklist

Before a scaffold can move from local scaffolding to implementation planning:

- `release_gate_id` is present and non-secret.
- `merge_record_id`, `handoff_id`, and `review_id` are linked.
- `module_owner` and `reviewer` match the ownership plan.
- `allowed_files` are limited to local scaffold files from the manifest.
- `blocked_files_checked` confirms no live deploy, permission, provider, payment, loan, escrow, collateral, stablecoin, AI-final, or public-claim files changed.
- `fixture_set` uses no-real-money demo records only.
- `local_replay_status` is passed or explicitly not applicable for docs-only scaffold changes.
- `audit_event_map_status` and `backend_to_chain_map_status` are linked.
- `deployment_status` remains `BLOCKED_FOR_LIVE`.
- `release_decision` is `READY_FOR_LOCAL_IMPLEMENTATION_PLANNING`, `REVISE`, `HOLD`, or `NO_GO`.

## Blocked Release Triggers

Any of these force `NO_GO`:

- live XPR deployment, setcode, setabi, updateauth, linkauth, or permission change;
- real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or bank/provider money movement;
- AI final authority for completion, payment release, default, liquidation, reward, or dispute outcome;
- private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, production webhook payloads, or live wallet balances;
- public whitepaper, website, partner, grant, investor, deck, email, social, or announcement claims.

## Decision States

| Decision | Meaning |
|----------|---------|
| READY_FOR_LOCAL_IMPLEMENTATION_PLANNING | Scaffold evidence is complete enough to plan local implementation only |
| REVISE | Evidence is incomplete or needs tighter boundaries |
| HOLD | Founder, legal/provider, finance-provider, security, XPR account, replay, audit, or backend mapping evidence is missing |
| NO_GO | Scope touches live money, secrets, external accounts, legal claims, public claims, or production deployment |

Default decision is `HOLD` until all evidence is complete.

## Required Checks

- `npm run check:smart-contract-scaffold-release-gate`
- `npm run check:smart-contract-scaffold-merge-record`
- `npm run check:smart-contract-scaffold-review`
- `npm run check:smart-contract-scaffold-file-manifest`
- `npm run check:smart-contract-scaffold-handoff`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, the scaffold release gate stays `HOLD` and smart contract implementation remains design-only.
