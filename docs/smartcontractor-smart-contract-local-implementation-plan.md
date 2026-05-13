# SmartContractor Smart Contract Local Implementation Plan

Status: internal local implementation plan only. Not deployed. Not legal advice. This plan does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define how SmartContractor can move from scaffold release-gate evidence into local implementation planning without touching live systems. The plan is only for local code scaffolding and local tests around constants, types, pure state-transition helpers, validator-only fixtures, serialization tests, and local replay harness placeholders.

This plan keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map modules separated from live XPR deployment, real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, and AI final authority.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Scaffold release gate | `docs/smartcontractor-smart-contract-scaffold-release-gate.md` |
| Scaffold merge record | `docs/smartcontractor-smart-contract-scaffold-merge-record.md` |
| Scaffold review | `docs/smartcontractor-smart-contract-scaffold-review-checklist.md` |
| Scaffold file manifest | `docs/smartcontractor-smart-contract-scaffold-file-manifest.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Coding readiness | `docs/smartcontractor-smart-contract-coding-readiness-checklist.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## Local Work Packages

| Package | Local Scope | Blocked Scope |
|---------|-------------|---------------|
| `WP-ESCROW-LOCAL` | milestone state constants, type shells, validation fixtures | live escrow deposits, releases, refunds, defaults, or dispute payouts |
| `WP-LOAN-LOCAL` | loan ledger type shells, repayment waterfall fixtures, no-money state helpers | real loan approval, underwriting, APR promise, collection, or repayment routing |
| `WP-COLLATERAL-LOCAL` | collateral estimate types, LTV fixture values, oracle placeholder types | token collateral lock, lien/security-interest claim, margin call, or liquidation |
| `WP-REVIEW-LOCAL` | peer review reward event types and reputation fixture outputs | real rewards, real reputation penalties, or AI final authority |
| `WP-AUTHORITY-LOCAL` | pause/role constants, signer names, local authority fixtures | live XPR permissions, setcode, setabi, updateauth, or linkauth |
| `WP-AUDIT-LOCAL` | audit-event serialization tests and request-id mapping | production webhook payloads, raw customer data, or provider settlement events |

## Required Planning Fields

Every local implementation planning record must include:

- `implementation_plan_id`
- `release_gate_id`
- `merge_record_id`
- `work_package_id`
- `module_owner`
- `reviewer`
- `allowed_files`
- `blocked_files_checked`
- `fixture_set`
- `local_replay_status`
- `audit_event_map_status`
- `backend_to_chain_map_status`
- `deployment_status` = `BLOCKED_FOR_LIVE`
- `implementation_decision` = `PLAN_LOCAL_ONLY`, `REVISE`, `HOLD`, or `NO_GO`

## Blocked Implementation Triggers

Any of these force `NO_GO`:

- live XPR deployment, setcode, setabi, updateauth, linkauth, or permission change;
- real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or bank/provider money movement;
- AI final authority for completion, payment release, default, liquidation, reward, or dispute outcome;
- private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, production webhook payloads, or live wallet balances;
- public whitepaper, website, partner, grant, investor, deck, email, social, or announcement claims.

## Decision States

| Decision | Meaning |
|----------|---------|
| PLAN_LOCAL_ONLY | Local implementation planning can continue; deployment and real-money scope remain blocked |
| REVISE | The work package needs tighter boundaries or missing evidence |
| HOLD | Founder, legal/provider, finance-provider, security, XPR account, replay, audit, or backend mapping evidence is missing |
| NO_GO | Scope touches live money, secrets, external accounts, legal claims, public claims, or production deployment |

Default decision is `HOLD` until all evidence is complete.

## Required Checks

- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-scaffold-release-gate`
- `npm run check:smart-contract-scaffold-merge-record`
- `npm run check:smart-contract-scaffold-review`
- `npm run check:smart-contract-scaffold-file-manifest`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-coding-readiness`
- `npm run check:smart-contract-local-replay`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, the local implementation plan stays `HOLD` and smart contract implementation remains design-only.
