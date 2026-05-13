# SmartContractor Smart Contract Code Ownership Plan

Status: internal code ownership plan only. Not deployed. Not legal advice. This plan does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define who owns each future local code scaffolding area before SmartContractor smart contract implementation begins. The plan keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map work separated so code changes can be reviewed without crossing into live XPR, real payment, real loan, real escrow, real repayment routing, token collateral liquidation, stablecoin settlement, or AI final authority.

This plan is for local code scaffolding only. It may support type definitions, constants, pure state-transition helpers, validator-only fixtures, serialization tests, and local replay harness placeholders. It does not authorize deployment, money movement, lending decisions, collateral enforcement, public token claims, or production settlement.

## Ownership Rules

- Each module must have one `module_owner` and one `reviewer` before local code scaffolding starts.
- Each change must declare `allowed_files` and `blocked_files`.
- Each change must reference a `handoff_id`, `fixture_set`, `local_replay_status`, and `deployment_status`.
- Default `deployment_status` is `BLOCKED_FOR_LIVE`.
- Cross-module behavior must be described in design docs before code touches multiple modules.
- No autonomous task may create live XPR deployment scripts, real payment routing, real loan approval, real escrow release, token collateral liquidation, stablecoin settlement, or AI final authority. In short: no AI final authority.

## Planned Local File Sets

| Area | Allowed Local Files | Blocked Files Or Actions |
|------|---------------------|--------------------------|
| Shared constants | `construction-ai/src/smart-contracts/constants/*` | Live account permission changes, private keys, deployment manifests |
| Type definitions | `construction-ai/src/smart-contracts/types/*` | Real customer data, provider credentials, service-role keys |
| State helpers | `construction-ai/src/smart-contracts/state/*` | Live release/default/liquidation execution |
| Validator fixtures | `construction-ai/src/smart-contracts/fixtures/*` | Real wallet balances, real contracts, raw legal documents |
| Replay placeholders | `construction-ai/src/smart-contracts/replay/*` | Testnet/mainnet push actions, real XPR transactions |
| Documentation and validators | `docs/*`, `construction-ai/scripts/validate-*` | Public whitepaper/site changes without approval |

## Module Ownership Matrix

| Module | module_owner | reviewer | allowed_files | blocked_files | fixture_set | local_replay_status | deployment_status |
|--------|--------------|----------|---------------|---------------|-------------|---------------------|------------------|
| Project escrow | Codex local scaffolding | Founder/security/legal-provider review required | constants, types, pure milestone state helpers, validator-only fixtures | no live XPR, no real escrow, no real payment, no stablecoin settlement | `project_escrow_demo_fixture` | Required before code merge | `BLOCKED_FOR_LIVE` |
| Loan ledger | Codex local scaffolding | Founder/finance-provider/legal-provider review required | constants, types, pure loan status helpers, validator-only fixtures | no real loan approval, no APR promise, no repayment routing, no collections | `loan_ledger_demo_fixture` | Required before code merge | `BLOCKED_FOR_LIVE` |
| Token collateral | Codex local scaffolding | Founder/security/legal-provider/finance-provider review required | constants, types, pure collateral status helpers, validator-only fixtures | no token collateral liquidation, no oracle dependency, no margin call execution | `token_collateral_demo_fixture` | Required before code merge | `BLOCKED_FOR_LIVE` |
| Peer review rewards | Codex local scaffolding | Founder/security review required | constants, types, pure review/reward status helpers, validator-only fixtures | no real rewards, no reputation write as final authority, no AI-only reviewer payment | `peer_review_demo_fixture` | Required before code merge | `BLOCKED_FOR_LIVE` |
| Authority controls | Codex local scaffolding | Founder/security/multisig review required | constants, types, pause/unpause state helpers, validator-only fixtures | no single-key production authority, no permission deployment, no upgrade action | `authority_controls_demo_fixture` | Required before code merge | `BLOCKED_FOR_LIVE` |
| Backend-to-chain map | Codex local scaffolding | Founder/technical review required | constants, type maps, audit serialization tests, validator-only fixtures | no provider webhooks that move funds, no live settlement adapter | `backend_chain_map_demo_fixture` | Required before code merge | `BLOCKED_FOR_LIVE` |

## Cross-Module Contracts

- Project escrow may reference loan ledger only as a design-level repayment-first waterfall, not as live repayment routing.
- Loan ledger may reference signed project contracts only as contract-backed working-capital eligibility, not as an approved loan, lien, collateral assignment, or legal security interest.
- Token collateral may reference loan ledger only as a disabled future review state, not as live token collateral liquidation.
- Peer review rewards may reference escrow and reputation only as local event outcomes, not as automatic payment release or final AI authority.
- Authority controls must be able to pause every module in local state tests before any module can be considered for code merge.
- Backend-to-chain map must keep audit event names, request IDs, provider status, and privacy boundaries aligned with the action register and audit event map.

## Blocked Files/Actions

These remain blocked until founder approval, legal/provider review, finance-provider review, security review, XPR account and permission approval, and live deployment approval are complete:

- live XPR deployment scripts;
- production private key or permission changes;
- real payment provider settlement;
- real loan approval or collections;
- real escrow deposit, release, refund, or default;
- repayment routing from milestone payments;
- token collateral lock, liquidation, margin call, or oracle execution;
- stablecoin settlement;
- AI final authority for completion, payment release, default, liquidation, or dispute outcome;
- public whitepaper, website, grant, investor, or partner claims that imply live regulated finance.

## Handoff Record

Every future local code scaffolding handoff must include:

- `handoff_id`
- `module`
- `module_owner`
- `reviewer`
- `scope`
- `allowed_files`
- `blocked_files`
- `linked_design_docs`
- `fixture_set`
- `local_replay_status`
- `deployment_status`
- `founder_approval_status`
- `legal_provider_status`
- `finance_provider_status`
- `security_review_status`
- `xpr_account_status`
- `created_at`

Default `deployment_status` is `BLOCKED_FOR_LIVE`.

## Required Links

- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-smart-contract-rollback-recovery-plan.md`
- `docs/smartcontractor-smart-contract-local-replay-checklist.md`
- `docs/smartcontractor-smart-contract-coding-readiness-checklist.md`

## Required Checks

- `npm run check:smart-contract-code-ownership`
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

If any check fails, smart contract implementation stays design-only and live deployment remains blocked.
