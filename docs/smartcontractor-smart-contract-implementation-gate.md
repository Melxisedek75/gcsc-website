# SmartContractor Smart Contract Implementation Gate

Status: internal implementation gate only. Not deployed. Not legal advice. This gate does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

This gate defines what must be true before the draft SmartContractor contracts can move from design documents into code, local test contracts, or future deployment planning. It keeps project escrow, loan ledger, token collateral, and peer review reward hooks aligned with the backend MVP, legal boundaries, and no-real-money safety rules.

## Module Gate

| Module | Current State | Allowed Next Step | Blocked Until |
|--------|---------------|-------------------|---------------|
| Project escrow contract | REVIEW | Table/action naming and local-only test fixture planning | Escrow/payment provider review, legal review, custody model, dispute controls, and founder approval |
| Loan ledger contract | REVIEW | Ledger-only event design and local-only test fixture planning | Lending legal review, finance-provider review, borrower disclosures, underwriting policy, and founder approval |
| Token collateral lock | REVIEW | Lock-state design and oracle/custody question list | Legal/provider review, token-collateral approval, oracle policy, custody model, volatility disclosure, and founder approval |
| Peer review reward hook | REVIEW | Reward-event and reputation-event design | Abuse controls, reviewer eligibility, conflict checks, reward budget, and founder approval |

## Required Before Coding

- final draft account names or local placeholder names;
- action names and table names;
- backend-to-chain mapping for each action;
- audit event mapping;
- authority model for admin, homeowner, contractor, inspector, reviewer, DAO, and future multisig roles;
- local test fixture data with no real payments;
- explicit blocked live actions for escrow, lending, token collateral, and repayment routing;
- legal/provider review checklist link for every money-touching module.

## Required Before Deployment

Deployment planning remains blocked until:

- founder approves the exact module scope;
- attorney/provider review is complete for escrow, lending, repayment routing, stablecoin settlement, and token collateral;
- security review is complete;
- no-real-money local tests pass;
- XPR account names are confirmed and created by the founder;
- authority and multisig model is approved;
- production payment, escrow, and finance providers are selected and approved;
- public wording matches the actual approved implementation.

## Not Allowed

Do not:

- deploy live contracts;
- move real money;
- originate real loans;
- hold real escrow;
- lock real token collateral;
- route real repayments;
- replace licensed payment or escrow providers;
- auto-liquidate tokens;
- let AI approve loans, release payments, or make final legal decisions;
- claim GCSC or SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Linked Files

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-loan-legal-risk-model.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md`

## Required Checks

- `npm run check:smart-contract-implementation-gate`
- `npm run check:contract-docs`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix`
- `npm run check:whitepaper-v1-2-contract-backed-loan-implementation-blocker-register`
- `npm run check`

If any check fails, smart contract implementation stays design-only.
