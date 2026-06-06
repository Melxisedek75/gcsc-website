# SmartContractor Week 2 Smart Contract Module Recheck

Status: LOCAL_RECHECK_ONLY.

This recheck does not approve XPR deployment, XPR signatures, contract account creation, token collateral, token custody, real payments, real loans, real escrow, repayment routing, stablecoin settlement, provider submissions, legal conclusions, security sign-off, production release, public launch, public website replacement, external account work, or live actions.

## Purpose

Give the founder one local-only smart contract module reading order before any future security, founder, legal/provider, or XPR deployment review. The goal is to confirm module split, authority model, audit trail, state machine, local package starts, replay evidence, and anti-backdoor boundaries without turning the design into live chain authority.

## Source Documents And Surfaces

- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-smart-contract-local-replay-checklist.md`
- `docs/smartcontractor-smart-contract-local-implementation-package-index.md`
- `docs/smartcontractor-smart-contract-escrow-local-package-start-record.md`
- `docs/smartcontractor-smart-contract-loan-local-package-start-record.md`
- `docs/smartcontractor-smart-contract-collateral-local-package-start-record.md`
- `docs/smartcontractor-smart-contract-review-local-package-start-record.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`

## Week 2 Smart Contract Module Recheck Sequence

1. Confirm module split remains local-only and separated by authority boundary.
2. Confirm project escrow/milestone module language is escrow-ready only and does not hold or release real funds.
3. Confirm loan ledger module language is working-capital readiness only and does not originate, approve, fund, deny, or service real credit.
4. Confirm repayment waterfall language is preview-only and does not route real payments, repayments, escrow, stablecoins, or contractor payouts.
5. Confirm token collateral language remains future review only and does not lock, custody, value, margin, liquidate, or transfer real tokens.
6. Confirm peer review/reputation language stays local-review only and does not publish scores, assign liability, or pay real rewards.
7. Confirm authority model, action register, state machine, and audit event map preserve request IDs, manual gates, pause/recovery controls, and no-backdoor boundaries.
8. Confirm local replay evidence remains PASS_LOCAL_ONLY and BLOCKED_FOR_LIVE before security/founder/legal/provider review.
9. Confirm deployment blockers still stop XPR contract deployment, XPR signatures, account creation, token actions, provider commitments, legal conclusions, production, and public launch.
10. Record one safe founder report-back block with no secrets, no private keys, no transaction hashes, no contract account credentials, no live URLs, no provider response, and no legal/security conclusion.

## Current Module Hold State Matrix

| Module Area | Required Local Review | Default State | Blocked Live Action |
|---|---|---|---|
| project escrow / milestones | milestone states, evidence binding, dispute holds, no custody | HOLD_FOR_MODULE_SCOPE_REVIEW | escrow custody or release |
| loan ledger / working capital | eligibility inputs, adverse-action placeholders, provider/founder gates | HOLD_FOR_FINANCE_PROVIDER_REVIEW | real credit approval, denial, or funding |
| repayment waterfall | allocation preview, hold-first ordering, audit proof | HOLD_FOR_REPAYMENT_REVIEW | payment routing or contractor payout |
| token collateral | LTV labels, oracle placeholder, margin/liquidation review | HOLD_FOR_TOKEN_COLLATERAL_REVIEW | token lock, custody, margin call, liquidation |
| peer review / reputation | reviewer metadata, conflict checks, local reward placeholder | HOLD_FOR_REVIEW_REWARD_REVIEW | real reward payout or public score |
| authority / audit | roles, action register, state machine, audit events, request IDs | HOLD_FOR_AUTHORITY_MODEL_REVIEW | privileged action or owner override |
| replay / anti-backdoor | local replay, invariant checks, pause/recovery, no hidden authority | HOLD_FOR_AUDIT_REPLAY_REVIEW | XPR deployment or live authority |

## Founder Safe Report-Back

Use this template only for local founder review. Do not paste private keys, wallet secrets, XPR transaction hashes, contract account credentials, service-role keys, provider responses, attorney/security reviewer advice, live URLs, production environment values, or real customer/payment/loan/escrow data.

```text
Smart Contract Module Week 2 Recheck
Scope: local prep only
module_split_status:
project_escrow_milestone_status:
loan_ledger_status:
repayment_waterfall_status:
token_collateral_status:
peer_review_reputation_status:
authority_audit_status:
local_replay_status:
anti_backdoor_status:
xpr_deployment_requested: no
xpr_signature_requested: no
contract_account_creation_requested: no
real_payment_or_loan_or_escrow_action_taken: no
repayment_or_stablecoin_or_token_collateral_action_taken: no
legal_or_provider_or_security_conclusion_made: no
decision:
Live-risk actions taken: none
```

## Decision State Matrix

| State | Meaning | Next Safe Action |
|---|---|---|
| READY_FOR_FOUNDER_SMART_CONTRACT_MODULE_REVIEW | Local module packet is ready for founder reading | Founder reviews module split and boundaries only |
| READY_FOR_SECURITY_REVIEW_PACKET_DRAFT | Local module packet can be turned into a redacted security reviewer draft | Codex drafts local reviewer packet only |
| READY_FOR_REVISION | Founder wants local wording or module scope changes | Codex edits local docs only |
| HOLD_FOR_MODULE_SCOPE_REVIEW | Module boundaries are incomplete or unclear | Update local module map |
| HOLD_FOR_AUTHORITY_MODEL_REVIEW | Authority, pause, override, or audit controls are incomplete | Update authority/audit docs locally |
| HOLD_FOR_AUDIT_REPLAY_REVIEW | Replay evidence, state machine, or invariant proof is incomplete | Update local replay docs/fixtures only |
| HOLD_FOR_TOKEN_COLLATERAL_REVIEW | Collateral language risks implying live token custody/value/liquidation | Tighten future-review-only collateral wording |
| BLOCKED_FOR_XPR_DEPLOYMENT | Request asks for contract account creation, deployment, signature, or chain action | Stop for founder/XPR/security/legal approval |
| BLOCKED_FOR_LIVE_OR_EXTERNAL_ACTION | Request asks for money movement, provider/legal/security decision, external account, production, or public launch | Stop for founder/legal/provider/security/live approval |

`SMART_CONTRACT_MODULE_REVIEW_RECORDED` is an internal scope-review marker only. It is not approval to deploy, sign, register accounts, activate XPR, move money, custody tokens, originate loans, hold escrow, route repayment, publish claims, or release production.

## Authority Audit And Anti-Backdoor Boundary

- Every privileged action must have a named authority, request ID, audit event, precondition, postcondition, and blocked-live gate.
- No module may use broad owner powers to bypass milestone evidence, dispute holds, repayment review, collateral review, peer review, or legal/provider/security gates.
- Pause, rollback, recovery, and replay checks remain local-only until external written review and founder approval exist.
- Any mismatch between module state, replay evidence, authority model, or audit event map must default to HOLD or BLOCKED, not GO.

## Codex Scope

Codex may:

- update local docs and validators;
- run local checks;
- commit scoped local-only files;
- summarize founder-safe report-back fields.

Codex must stop before:

- XPR signatures, contract account creation, deployment, or on-chain actions;
- private keys, wallet secrets, service-role keys, or provider credentials;
- real payments, loans, escrow, repayment routing, stablecoin settlement, token custody, token collateral, margin, liquidation, or reward payouts;
- legal/provider/security conclusions or commitments;
- public website replacement, public launch, production release, external sends, or external account changes.

## Required Checks

- `npm run check:week-two-smart-contract-module-recheck`
- `npm run check:smart-contract-implementation-gate`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-action-register`
- `npm run check:smart-contract-state-machine`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:smart-contract-deployment-blockers`
- `npm run check:smart-contract-state-helpers-local`
- `npm run check:smart-contract-local-replay-packet`
- `npm run check:contract-backed-loan-blueprint`
- `npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor`
- `npm run check:smartcontractor`
- `npm run check:auth`

## Acceptance Check

This recheck is accepted only if the founder can review the smart contract module split locally with no-secret, no-private-key, no-XPR-signature, no-contract-account-creation, no-deploy, no-token-custody, no-real-money, no-loan, no-escrow, no-repayment-routing, no-stablecoin, no-token-collateral, no-provider/legal/security-conclusion, no-public-file-replacement, no-public-launch, no-production, and no-live-action boundaries visible in one place.
