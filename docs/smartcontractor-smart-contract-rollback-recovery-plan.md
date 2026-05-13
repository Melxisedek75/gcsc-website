# SmartContractor Smart Contract Rollback Recovery Plan

Status: internal rollback and emergency recovery plan only. Not deployed. Not legal advice. This plan does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define how SmartContractor should pause, document, review, and recover future smart contract modules before project escrow, loan ledger, token collateral, peer review rewards, authority controls, or backend-to-chain mapping move from local design into code, test contracts, or live XPR deployment.

This plan exists so every emergency response defaults to pause-only response, no money movement, and founder/legal/provider/security review before any recovery action.

## Recovery States

| State | Meaning |
|-------|---------|
| `NORMAL_LOCAL_ONLY` | Local design and no-real-money fixtures can continue |
| `PAUSED_LOCAL_ONLY` | Local fixture or design flow is paused for review |
| `EMERGENCY_PAUSED` | Emergency pause is active and no state-changing live-risk action is allowed |
| `RECOVERY_REVIEW` | Evidence packet is being reviewed by founder, legal/provider, finance-provider, and security reviewers |
| `READY_FOR_LOCAL_REPLAY` | Only local no-real-money replay is allowed after review |
| `BLOCKED_FOR_LIVE` | Any live XPR, payment, loan, escrow, repayment, collateral, stablecoin, or reward action remains blocked |

Default recovery state for money-touching modules is `EMERGENCY_PAUSED` or `BLOCKED_FOR_LIVE` until written approval evidence exists.

## Emergency Triggers

Emergency pause must be considered when any of these signals appear:

- mismatch between backend-to-chain map and future contract action behavior;
- audit event missing `request_id`, `actor_id`, `module`, `event_name`, or provider/founder/legal status;
- attempted live escrow release, real loan approval, repayment routing, token collateral liquidation, stablecoin settlement, or real reward issue without approval;
- authority signer, multisig, pause/unpause, or upgrade policy drift;
- AI attempting final approval, release, default, liquidation, or dispute decision;
- private data, service-role keys, private keys, seed phrases, passwords, raw customer data, or provider secrets appearing in a contract payload, document, log, or chat;
- dispute pause, terminal state, refund, cancellation, or recovery behavior that conflicts with the smart contract state machine;
- provider, legal, finance-provider, or security review status missing for a live-risk module.

## Immediate Response

1. Trigger emergency pause through the approved authority path.
2. Record a rollback record with non-secret evidence.
3. Stop all live-risk actions: no money movement, no real loan approval, no real escrow release, no repayment routing, no token collateral liquidation, no stablecoin settlement, and no real rewards.
4. Preserve request IDs, audit events, local fixture input, expected state, observed state, and reviewer notes.
5. Route evidence to founder review, legal/provider review, finance-provider review, and security review when the module touches escrow, lending, repayment, token collateral, settlement, or public claims.
6. Resume only local no-real-money replay after review confirms the issue is understood.

## Module Recovery Rules

| Module | Pause Condition | Recovery Rule |
|--------|-----------------|---------------|
| Project escrow | Any release, refund, dispute, milestone, or custody mismatch | Keep funds language design-only; require founder/legal/provider approval before live release or refund logic |
| Loan ledger | Any origination, repayment, default, APR, disclosure, or collection mismatch | Keep loan ledger local-only; require finance-provider and legal/provider approval before live lending semantics |
| Token collateral | Any lock, release, oracle, margin, or liquidation mismatch | Keep token collateral labels demo-only; never auto-liquidate collateral without approved provider/legal/security model |
| Peer review rewards | Any reviewer reward, slashing, reputation, or payment influence mismatch | Keep rewards simulated until founder/legal/provider approval and no-real-money tests pass |
| Authority controls | Any signer, multisig, emergency pause, unpause, upgrade, or provider signer mismatch | Keep contract blocked until authority and multisig approval, security review, and recovery replay pass |
| Backend-to-chain map | Any API/action/table/audit drift | Update the backend-to-chain map and rerun checks before contract coding or deployment planning |

## Required Evidence Packet

Every rollback record must include non-secret fields:

- `incident_id`
- `request_id`
- `module`
- `trigger`
- `paused_by`
- `paused_at`
- `previous_state`
- `recovery_state`
- `founder_approval_status`
- `provider_review_status`
- `legal_provider_status`
- `finance_provider_status`
- `security_review_status`
- `created_at`

Evidence must link the affected action, table, audit event, fixture object, and reviewer decision without storing private keys, service-role keys, passwords, seed phrases, raw customer data, provider secrets, or payment credentials.

## Required Links

- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-loan-legal-risk-model.md`

## Not Allowed

This rollback recovery plan must not be used to:

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
- bypass founder approval, legal/provider review, finance-provider review, security review, or authority and multisig approval;
- claim SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Checks

- `npm run check:smart-contract-rollback-recovery`
- `npm run check:smart-contract-deployment-blockers`
- `npm run check:backend-to-chain-map`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-state-machine`
- `npm run check:smart-contract-implementation-gate`
- `npm run check`

If any check fails, smart contract implementation stays design-only and deployment planning stays blocked.
