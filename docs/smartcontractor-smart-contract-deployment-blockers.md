# SmartContractor Smart Contract Deployment Blockers

Status: internal deployment-blocker register only. Not deployed. Not legal advice. This register does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

Keep every smart contract deployment blocker visible before project escrow, loan ledger, token collateral, peer review rewards, authority controls, or backend-to-chain mapping move from design documents into code, test contracts, or live XPR deployment.

This document protects the founder from accidental drift into real money, real loans, real escrow, token collateral, stablecoin settlement, or legal/provider obligations before the required approvals exist.

## Blocker States

| State | Meaning |
|-------|---------|
| `BLOCKED` | Cannot proceed without founder, legal/provider, finance-provider, security, or external account action |
| `REVIEW` | Draft exists, but approval evidence is missing or incomplete |
| `READY_FOR_LOCAL_ONLY` | Safe for local no-real-money tests only |
| `READY_FOR_FOUNDER_REVIEW` | Safe to show founder for a decision, but not safe for live deployment |
| `APPROVED_FOR_LIVE` | Not available until all required evidence exists |

Default state for all money-touching smart contract work is `BLOCKED`.

## Deployment Blockers

| Blocker | Current State | Required Evidence | Blocks |
|---------|---------------|-------------------|--------|
| Founder module scope approval | BLOCKED | Non-secret approval record naming exact modules and excluded live-risk features | Any smart contract coding beyond design scaffolds |
| Legal/provider escrow review | BLOCKED | Attorney/provider review of custody, escrow agent role, dispute release, refunds, and consumer protection | Project escrow deployment and payment release |
| Finance-provider lending review | BLOCKED | Provider or counsel review of contractor credit, receivables-based underwriting, disclosures, APR, repayment waterfall, and collections boundaries | Loan ledger deployment and repayment events |
| Token collateral legal/provider review | BLOCKED | Review of token collateral classification, custody, volatility disclosure, oracle policy, lock/release mechanics, and liquidation prohibition | Token collateral lock deployment |
| Stablecoin settlement provider review | BLOCKED | Approved provider, payment flow, custody/settlement model, sanctions/AML policy, and refund/dispute handling | Stablecoin settlement events |
| Authority and multisig approval | REVIEW | Approved signer set, pause/unpause policy, upgrade policy, emergency recovery, and separation of duties | Any live contract deployment |
| Security review | BLOCKED | Security checklist, permission review, test evidence, and external audit path where required | Any live contract deployment |
| XPR account approval | BLOCKED | Founder-created account names, permissions, keys handled outside chat, and multisig plan | Any live XPR deployment |
| Backend-to-chain mapping approval | REVIEW | Approved API/action/table/audit map with privacy boundary and request-id correlation | Contract coding and event table design |
| Audit event map approval | REVIEW | Approved event names, required fields, provider/founder/legal statuses, and no-real-money semantics | Contract coding and dispute/payment traceability |
| No-real-money fixture tests | REVIEW | Local fixture coverage for escrow, loan, collateral, peer review, authority failure, dispute pause, and emergency pause | Contract implementation readiness |
| Public wording approval | BLOCKED | Founder/legal/provider-approved public wording matching the actual implementation | Website, whitepaper, deck, grant, partner, investor, email, social, or announcement use |

## Module Readiness Matrix

| Module | Allowed Now | Blocked Live Action |
|--------|-------------|---------------------|
| Project escrow | Local state design, audit event mapping, test fixture planning | Holding funds, releasing escrow, acting as escrow agent, replacing a licensed provider |
| Loan ledger | Local ledger labels, receivables-based review draft, repayment waterfall simulation | Loan approval, origination, repayment routing, collections, lender/broker/underwriter claims |
| Token collateral | Demo collateral labels, LTV calculation draft, oracle placeholder review | Locking real tokens, custody, margin call, auto-liquidation, collateral seizure |
| Peer review rewards | Review score labels, reputation labels, reward eligibility labels | Real token rewards, slashing, final payment release authority |
| Authority controls | Local pause/unpause model, multisig draft, emergency pause plan | Single-key production authority, AI-only approvals, unreviewed upgrades |
| Backend-to-chain map | Local mapping and validator | Live chain writes, private data storage, provider status claims without evidence |

## Required Evidence Packet

Before any live deployment discussion, collect:

- founder scope approval;
- legal/provider escrow review;
- finance-provider lending review;
- token collateral review;
- stablecoin settlement review;
- authority and multisig approval;
- security review;
- XPR account and permission approval;
- backend-to-chain mapping approval;
- audit event map approval;
- no-real-money fixture test results;
- public wording approval;
- rollback and emergency pause plan;
- confirmation that no private keys, service-role keys, passwords, seed phrases, raw customer data, or provider secrets are stored in docs or chat.

## Required Links

- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-loan-legal-risk-model.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`

## Not Allowed

This blocker register must not be used to:

- deploy live contracts;
- move real funds;
- approve real loans;
- release real escrow;
- route real repayments;
- lock real token collateral;
- settle stablecoins;
- issue real rewards;
- auto-liquidate collateral;
- let AI make final approval, release, default, liquidation, or dispute decisions;
- claim SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Checks

- `npm run check:smart-contract-deployment-blockers`
- `npm run check:backend-to-chain-map`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-implementation-gate`
- `npm run check`

If any check fails, smart contract implementation stays design-only.
