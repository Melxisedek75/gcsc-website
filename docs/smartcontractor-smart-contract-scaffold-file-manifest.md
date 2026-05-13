# SmartContractor Smart Contract Scaffold File Manifest

Status: internal scaffold file manifest only. Not deployed. Not legal advice. This manifest does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the exact future local file layout that SmartContractor can use when smart contract work moves from design documents into local code scaffolding. The manifest keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map files separated before any implementation work starts.

This file is a planning boundary. It allows future local constants, type definitions, pure state helpers, validator-only fixtures, serialization tests, and local replay harness placeholders. It does not authorize live XPR deployment, real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, or AI final authority.

## Manifest Rules

- Every future scaffold file must map to one `module_owner`, one `reviewer`, one `handoff_id`, one `fixture_set`, and one `deployment_status`.
- Default `deployment_status` is `BLOCKED_FOR_LIVE`.
- A file may not combine project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map logic unless the handoff template explicitly approves a local-only cross-module helper.
- Every scaffold file must remain no live XPR by default.
- No scaffold file may contain secrets, private keys, service-role keys, provider credentials, passwords, seed phrases, real customer data, live wallet balances, live XPR actions, public investment claims, or production settlement instructions.

## Planned Directories

| Directory | Purpose | Allowed Scope | Blocked Scope |
|-----------|---------|---------------|---------------|
| `construction-ai/src/smart-contracts/constants/` | Local action, table, event, and state names | constants only | no live account names that imply deployment approval |
| `construction-ai/src/smart-contracts/types/` | Local fixture and audit record types | type definitions only | no raw customer data or provider schemas with secrets |
| `construction-ai/src/smart-contracts/state/` | Pure local state-transition helpers | no-real-money helper functions | no live release, default, liquidation, or payment execution |
| `construction-ai/src/smart-contracts/fixtures/` | Validator-only fixture records | demo-only project, milestone, loan, collateral, review, authority fixtures | no live balances, wallet keys, legal documents, or provider records |
| `construction-ai/src/smart-contracts/replay/` | Local replay harness placeholders | deterministic no-real-money replay steps | no testnet/mainnet push actions |
| `construction-ai/src/smart-contracts/serialization/` | Audit event serialization checks | request ID, module ID, provider status, privacy-safe fields | no production webhook settlement payloads |

## Planned Files

| File | Module | module_owner | reviewer | fixture_set | deployment_status |
|------|--------|--------------|----------|-------------|------------------|
| `constants/projectEscrowConstants.ts` | project escrow | Codex local scaffolding | founder/security/legal-provider | `project_escrow_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `constants/loanLedgerConstants.ts` | loan ledger | Codex local scaffolding | founder/finance-provider/legal-provider | `loan_ledger_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `constants/tokenCollateralConstants.ts` | token collateral | Codex local scaffolding | founder/security/finance-provider/legal-provider | `token_collateral_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `constants/peerReviewRewardConstants.ts` | peer review rewards | Codex local scaffolding | founder/security | `peer_review_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `constants/authorityControlConstants.ts` | authority controls | Codex local scaffolding | founder/security/multisig reviewer | `authority_controls_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `types/projectEscrowTypes.ts` | project escrow | Codex local scaffolding | founder/security/legal-provider | `project_escrow_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `types/loanLedgerTypes.ts` | loan ledger | Codex local scaffolding | founder/finance-provider/legal-provider | `loan_ledger_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `types/tokenCollateralTypes.ts` | token collateral | Codex local scaffolding | founder/security/finance-provider/legal-provider | `token_collateral_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `types/peerReviewRewardTypes.ts` | peer review rewards | Codex local scaffolding | founder/security | `peer_review_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `types/authorityControlTypes.ts` | authority controls | Codex local scaffolding | founder/security/multisig reviewer | `authority_controls_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `types/backendChainMapTypes.ts` | backend-to-chain map | Codex local scaffolding | founder/technical reviewer | `backend_chain_map_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `state/projectEscrowState.ts` | project escrow | Codex local scaffolding | founder/security/legal-provider | `project_escrow_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `state/loanLedgerState.ts` | loan ledger | Codex local scaffolding | founder/finance-provider/legal-provider | `loan_ledger_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `state/tokenCollateralState.ts` | token collateral | Codex local scaffolding | founder/security/finance-provider/legal-provider | `token_collateral_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `state/peerReviewRewardState.ts` | peer review rewards | Codex local scaffolding | founder/security | `peer_review_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `state/authorityControlState.ts` | authority controls | Codex local scaffolding | founder/security/multisig reviewer | `authority_controls_demo_fixture` | `BLOCKED_FOR_LIVE` |
| `fixtures/smartContractDemoFixtures.ts` | shared fixtures | Codex local scaffolding | founder/technical reviewer | all no-real-money fixture sets | `BLOCKED_FOR_LIVE` |
| `replay/localReplayPlan.ts` | local replay | Codex local scaffolding | founder/technical/security reviewer | all no-real-money fixture sets | `BLOCKED_FOR_LIVE` |
| `serialization/auditEventSerialization.ts` | backend-to-chain map | Codex local scaffolding | founder/technical/security reviewer | `backend_chain_map_demo_fixture` | `BLOCKED_FOR_LIVE` |

## Blocked File Names

These names stay blocked unless founder, legal/provider, finance-provider, security, XPR account, and deployment approvals are explicitly recorded:

- `deploy.ts`
- `mainnet.ts`
- `testnetPush.ts`
- `setcode.ts`
- `setabi.ts`
- `updateauth.ts`
- `linkauth.ts`
- `releasePayment.ts`
- `approveLoan.ts`
- `routeRepayment.ts`
- `liquidateCollateral.ts`
- `settleStablecoin.ts`
- `aiFinalDecision.ts`

## Required Links

- `docs/smartcontractor-smart-contract-code-ownership-plan.md`
- `docs/smartcontractor-smart-contract-scaffold-handoff-template.md`
- `docs/smartcontractor-smart-contract-coding-readiness-checklist.md`
- `docs/smartcontractor-smart-contract-local-replay-checklist.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`

## Required Checks

- `npm run check:smart-contract-scaffold-file-manifest`
- `npm run check:smart-contract-scaffold-handoff`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-coding-readiness`
- `npm run check:smart-contract-local-replay`
- `npm run check:backend-to-chain-map`
- `npm run check:smart-contract-audit-event-map`
- `npm run check`

If any check fails, local smart contract implementation remains design-only and deployment remains `BLOCKED_FOR_LIVE`.
