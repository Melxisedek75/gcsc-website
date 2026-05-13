# SmartContractor Smart Contract Local Replay Checklist

Status: internal local replay checklist only. Not deployed. Not legal advice. This checklist does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, does not approve stablecoin settlement, and does not approve live XPR contract deployment.

## Purpose

Define the no-real-money replay steps that must pass before SmartContractor project escrow, loan ledger, token collateral, peer review rewards, authority controls, or backend-to-chain mapping can move from design documents into smart contract coding.

Local replay means deterministic fixture review only. It is not a testnet deployment, not a live XPR deployment, not provider approval, and not permission to move funds.

## Replay Scope

| Module | Replay Goal | Required Boundary |
|--------|-------------|-------------------|
| Project escrow | Replay milestone lock, evidence review, dispute pause, release-ready, refund-ready, and terminal states | No real escrow release and no custody claim |
| Loan ledger | Replay signed-contract receivable, review status, repayment-first waterfall, default label, and dispute pause | No real loan approval, origination, collection, or repayment routing |
| Token collateral | Replay collateral estimate, LTV label, oracle snapshot placeholder, lock label, and release label | No real token lock, margin call, liquidation, or collateral seizure |
| Peer review rewards | Replay reviewer eligibility, score, recommendation, reputation label, and simulated reward | No real token reward, slashing, or final payment authority |
| Authority controls | Replay emergency pause, unpause request, signer mismatch, upgrade block, and rollback record | No single-key live authority and no unreviewed upgrade |
| Backend-to-chain map | Replay API/action/table/audit event consistency | No private data on-chain and no live chain writes |

## Required Fixtures

Each local replay packet must include:

- fixture project contract;
- fixture milestone;
- fixture loan ledger entry;
- fixture repayment waterfall;
- fixture token collateral lock;
- fixture peer review reward;
- fixture authority action;
- fixture emergency pause;
- fixture rollback record;
- fixture audit event with `request_id`;
- fixture backend-to-chain map row.

## Replay Steps

1. Confirm every fixture is local-only and contains no private keys, service-role keys, passwords, seed phrases, raw customer data, provider secrets, or payment credentials.
2. Replay the happy path from accepted bid to project contract, milestone evidence, review, and release-ready state.
3. Replay dispute pause before any release-ready state becomes terminal.
4. Replay the repayment-first waterfall where milestone payment repays a simulated contractor working-capital balance before simulated contractor payout.
5. Replay token collateral labels without real token custody, margin call, liquidation, or seizure.
6. Replay peer review reward eligibility without issuing real rewards.
7. Replay authority failure, emergency pause, rollback record, and blocked unpause.
8. Confirm every replayed action produces the expected audit event and request-id correlation.
9. Confirm every replayed backend action maps to the expected draft XPR action name and table name.
10. Keep coding and deployment blocked if any mismatch appears.

## Pass/Fail Gates

| Gate | PASS | FAIL |
|------|------|------|
| Fixture safety | All fixtures are local-only and non-secret | Any secret-looking value or real customer/payment data appears |
| State machine | Replay follows approved states and terminal rules | Any skipped pause, release, refund, default, or terminal-state mismatch appears |
| Audit trail | Each action has request-id and required event fields | Any event is missing required fields |
| Backend map | API/action/table/audit mapping stays consistent | Any unmapped action or private-data-on-chain risk appears |
| Authority | Emergency pause and blocked unpause behave as expected | Single-key, AI-only, contractor self-release, or unreviewed upgrade path appears |
| Money boundary | No money movement is possible | Any real payment, loan, escrow, repayment, collateral, stablecoin, or reward path appears |

Any FAIL creates a rollback record and returns the module to `BLOCKED_FOR_LIVE`.

## Evidence Fields

Local replay evidence must record:

- `replay_id`
- `request_id`
- `fixture_set`
- `module`
- `scenario`
- `expected_state`
- `observed_state`
- `audit_event`
- `backend_action`
- `draft_xpr_action`
- `table_name`
- `pass_fail_status`
- `rollback_record_id`
- `founder_approval_status`
- `legal_provider_status`
- `finance_provider_status`
- `security_review_status`
- `created_at`

## Not Allowed

This checklist must not be used to:

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
- bypass founder approval, legal/provider review, finance-provider review, security review, authority approval, or multisig approval.

## Required Links

- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-smart-contract-rollback-recovery-plan.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`

## Required Checks

- `npm run check:smart-contract-local-replay`
- `npm run check:smart-contract-test-fixtures`
- `npm run check:smart-contract-state-machine`
- `npm run check:smart-contract-action-register`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:backend-to-chain-map`
- `npm run check:smart-contract-rollback-recovery`
- `npm run check:smart-contract-deployment-blockers`
- `npm run check`

If any check fails, smart contract implementation stays design-only and deployment planning stays blocked.
