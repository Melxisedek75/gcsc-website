# SmartContractor Smart Contract Scaffold Review Checklist

Status: internal scaffold review checklist only. Not deployed. Not legal advice. This checklist does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve repayment routing, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the review gates that must pass before any future SmartContractor local code scaffolding change is merged. The checklist is for local constants, type definitions, pure state-transition helpers, validator-only fixtures, serialization tests, and local replay harness placeholders only.

This checklist keeps project escrow, loan ledger, token collateral, peer review rewards, authority controls, and backend-to-chain map scaffolding separated from live XPR deployment, real payment, real loan, real escrow, repayment routing, token collateral liquidation, stablecoin settlement, and AI final authority.

## Required Inputs

| Input | Required Evidence | Fail Condition |
|-------|-------------------|----------------|
| Code ownership | `docs/smartcontractor-smart-contract-code-ownership-plan.md` | Missing `module_owner`, `reviewer`, `allowed_files`, or `blocked_files` |
| Scaffold handoff | `docs/smartcontractor-smart-contract-scaffold-handoff-template.md` | Missing `handoff_id`, decision, fixture set, or review status |
| File manifest | `docs/smartcontractor-smart-contract-scaffold-file-manifest.md` | File path outside allowed local directories |
| Coding readiness | `docs/smartcontractor-smart-contract-coding-readiness-checklist.md` | Missing founder/local-scope approval or required design links |
| Local replay | `docs/smartcontractor-smart-contract-local-replay-checklist.md` | Missing deterministic no-real-money replay path |
| Audit map | `docs/smartcontractor-smart-contract-audit-event-map.md` | Missing request ID, event name, module, actor, or provider status fields |

## Review Checklist

Before merge, the reviewer must confirm:

- `handoff_id` is present and non-secret.
- `module_owner` and `reviewer` are present.
- `allowed_files` are limited to local scaffolding paths.
- `blocked_files` include live deployment, payment, loan, escrow, collateral, stablecoin, and AI final authority paths.
- `fixture_set` uses no-real-money demo records only.
- `local_replay_status` is planned or passed before behavior helpers merge.
- `deployment_status` is `BLOCKED_FOR_LIVE`.
- No live XPR, no real payment, no real loan, no real escrow, no repayment routing, no token collateral liquidation, no stablecoin settlement, and no AI final authority are introduced.
- No private keys, seed phrases, service-role keys, provider credentials, passwords, raw customer data, live wallet balances, or production webhook payloads are present.
- No public whitepaper, website, partner, grant, investor, deck, email, social, or announcement wording is changed.

## Decision States

| Decision | Merge Meaning |
|----------|---------------|
| GO_LOCAL_ONLY | Merge is allowed only for local scaffolding files and docs; deployment remains blocked |
| REVISE | Changes need tighter scope, file boundaries, fixture safety, or linked review evidence |
| HOLD | Missing founder, legal/provider, finance-provider, security, XPR, local replay, or audit evidence |
| NO_GO | Change touches live money, secrets, external accounts, legal claims, public claims, or production deployment |

Default decision is `HOLD` if evidence is incomplete.

## Blocked Merge Triggers

Any of these immediately force `NO_GO`:

- live XPR deploy, setcode, setabi, updateauth, linkauth, or permission changes;
- real payment provider settlement;
- real loan approval, underwriting decision, APR promise, collection, or repayment routing;
- real escrow deposit, release, refund, default, or dispute payout;
- token collateral lock, liquidation, margin call, oracle execution, or lien/security-interest claim;
- stablecoin settlement or bank/provider money movement;
- AI final authority for completion, payment release, default, liquidation, reward, or dispute outcome;
- secrets or raw customer data;
- public product, token, investment, lending, escrow, stablecoin, collateral, or AI claim changes.

## Required Checks

- `npm run check:smart-contract-scaffold-review`
- `npm run check:smart-contract-scaffold-file-manifest`
- `npm run check:smart-contract-scaffold-handoff`
- `npm run check:smart-contract-code-ownership`
- `npm run check:smart-contract-coding-readiness`
- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-audit-event-map`
- `npm run check`

If any check fails, the scaffold change stays `HOLD` and smart contract implementation remains design-only.
