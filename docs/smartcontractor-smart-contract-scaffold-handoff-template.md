# SmartContractor Smart Contract Scaffold Handoff Template

Status: internal scaffold handoff template only. Not deployed. Not legal advice. This template does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Provide one non-secret handoff record format before any SmartContractor local code scaffolding starts for project escrow, loan ledger, token collateral, peer review rewards, authority controls, or backend-to-chain map modules.

The template keeps future local code scaffolding tied to approved design docs, fixture sets, code ownership, blocked files, local replay evidence, and `BLOCKED_FOR_LIVE` deployment status. It is a planning and review artifact only.

## Handoff Metadata

| Field | Value |
|-------|-------|
| `handoff_id` | `SCH-YYYYMMDD-001` |
| `module` | project escrow / loan ledger / token collateral / peer review rewards / authority controls / backend-to-chain map |
| `module_owner` | Codex local scaffolding |
| `reviewer` | Founder plus required legal-provider, finance-provider, security, or technical reviewer |
| `scope` | local code scaffolding only |
| `allowed_files` | exact local docs, validators, constants, type definitions, state helpers, fixture files, or serialization tests |
| `blocked_files` | live deployment scripts, provider adapters that move money, key material, public whitepaper/site claims, production permission files |
| `linked_design_docs` | required docs listed below |
| `fixture_set` | named no-real-money fixture set |
| `local_replay_status` | missing / planned / passed |
| `deployment_status` | `BLOCKED_FOR_LIVE` |
| `founder_approval_status` | missing / approved for local scaffolding only |
| `legal_provider_status` | missing / review required / approved for local wording only |
| `finance_provider_status` | missing / review required / approved for local underwriting language only |
| `security_review_status` | missing / review required / approved for local helpers only |
| `xpr_account_status` | missing / review required / approved for local naming only |
| `created_at` | ISO date |

## Required Design Links

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
- `docs/smartcontractor-smart-contract-code-ownership-plan.md`

## Allowed Scope

Allowed local-only scope can include:

- constants for local action/table/event names;
- type definitions for no-real-money fixture records;
- pure state-transition helpers;
- validator-only fixtures;
- audit serialization tests;
- local replay harness placeholders;
- documentation that says no live XPR, no real payment, no real loan, no real escrow, no repayment routing, no token collateral liquidation, no stablecoin settlement, and no AI final authority.

## Blocked Scope

The handoff is invalid if it includes:

- private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, or live wallet balances;
- live XPR deploy, updateauth, linkauth, setcode, setabi, or permission changes;
- real payment provider settlement;
- real loan approval, APR promise, underwriting decision, collection, or repayment routing;
- real escrow deposit, release, refund, default, or dispute payout;
- token collateral liquidation, margin call, oracle execution, or lien/security-interest claim;
- stablecoin settlement or bank/provider funds movement;
- AI final authority for completion, payment release, default, liquidation, reward, or dispute outcome;
- public whitepaper, website, grant, investor, partner, email, social, or announcement language without the founder/public-use gate.

## Review Decision

| Decision | Meaning |
|----------|---------|
| GO_LOCAL_ONLY | Local scaffolding may start within `allowed_files`; deployment stays blocked |
| REVISE | Handoff needs clearer scope, files, fixtures, or review links |
| HOLD | Missing founder, legal/provider, finance-provider, security, XPR, or replay evidence |
| NO_GO | Scope touches live money, secrets, legal claims, external accounts, or production deployment |

Default decision is `HOLD` until all required fields are filled with non-secret evidence.

## Required Checks

- `npm run check:smart-contract-scaffold-handoff`
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

If any check fails, the handoff stays `HOLD` and smart contract implementation remains design-only.
