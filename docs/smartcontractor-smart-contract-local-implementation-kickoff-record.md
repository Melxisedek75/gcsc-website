# SmartContractor Smart Contract Local Implementation Kickoff Record

Status: internal local implementation kickoff record only. Not deployed. Not legal advice. This record does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the local-only record that opens one SmartContractor smart contract implementation work package after the local implementation plan is approved for planning. This is a kickoff control, not deployment approval, not production release, not legal approval, not finance-provider approval, and not a public whitepaper update.

The kickoff record keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, audit serialization, and backend-to-chain map work scoped to local files, deterministic fixtures, local replay evidence, and validator checks. It blocks live XPR deployment, real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, AI final authority, public claims, secrets, and raw customer data.

## Required Inputs

| Input | Required Evidence |
|-------|-------------------|
| Local implementation plan | `docs/smartcontractor-smart-contract-local-implementation-plan.md` |
| Scaffold release gate | `docs/smartcontractor-smart-contract-scaffold-release-gate.md` |
| Scaffold merge record | `docs/smartcontractor-smart-contract-scaffold-merge-record.md` |
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` |
| Audit event map | `docs/smartcontractor-smart-contract-audit-event-map.md` |
| Backend-to-chain map | `docs/smartcontractor-backend-to-chain-map.md` |

## Work Package IDs

| Work Package | Kickoff Scope | Blocked Scope |
|--------------|---------------|---------------|
| `WP-ESCROW-LOCAL` | milestone state constants, validation helpers, escrow-ready fixtures | live escrow deposits, releases, refunds, defaults, or dispute payouts |
| `WP-LOAN-LOCAL` | loan ledger types, receivables-based eligibility fixtures, repayment waterfall tests | real loan approval, underwriting promise, APR promise, collection, or repayment routing |
| `WP-COLLATERAL-LOCAL` | collateral estimate types, LTV fixture values, oracle placeholder states | token collateral lock, lien/security-interest claim, margin call, or liquidation |
| `WP-REVIEW-LOCAL` | peer review reward event types and reputation fixture outputs | real rewards, real penalties, final AI decision, or payment-release authority |
| `WP-AUTHORITY-LOCAL` | pause/role constants, signer labels, local authority failure fixtures | live XPR permissions, setcode, setabi, updateauth, linkauth, or production key changes |
| `WP-AUDIT-LOCAL` | audit-event serialization tests and request-id mapping | production webhook payloads, raw customer data, provider settlement events, or live wallet balances |

## Required Kickoff Fields

Every local implementation kickoff record must include:

- `kickoff_record_id`
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
- `kickoff_decision` = `START_LOCAL_ONLY`, `REVISE`, `HOLD`, or `NO_GO`

## Kickoff Decision States

| Decision | Meaning |
|----------|---------|
| START_LOCAL_ONLY | The listed local work package may start in allowed files only; live deployment and real-money scope remain blocked |
| REVISE | The kickoff record needs tighter allowed files, clearer owner/reviewer evidence, or missing fixture/replay details |
| HOLD | Founder, legal/provider, finance-provider, security, XPR account, replay, audit, backend mapping, or ownership evidence is incomplete |
| NO_GO | Scope touches live money, external accounts, secrets, legal claims, public claims, AI final authority, or production deployment |

Default decision is `HOLD` until the kickoff record proves the work package is local-only and evidence-linked.

## Blocked Kickoff Triggers

Any of these force `NO_GO`:

- live XPR deployment, setcode, setabi, updateauth, linkauth, or permission change;
- real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or bank/provider money movement;
- AI final authority for completion, payment release, default, liquidation, reward, dispute outcome, or milestone acceptance;
- private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, production webhook payloads, or live wallet balances;
- public whitepaper, website, partner, grant, investor, deck, email, social, or announcement claims.

## Required Checks

- `npm run check:smart-contract-local-implementation-kickoff`
- `npm run check:smart-contract-local-implementation-plan`
- `npm run check:smart-contract-scaffold-release-gate`
- `npm run check:smart-contract-scaffold-merge-record`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check`

If any check fails, the kickoff decision stays `HOLD` and the affected work package must not start.
