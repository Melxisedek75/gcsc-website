# SmartContractor Smart Contract State Machine

Status: internal state-machine draft only.

This state machine does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

Define local-only state transitions for future XPR smart contract modules before any code is written or deployed.

The state machine keeps SmartContractor project escrow, contractor credit, repayment waterfall, token collateral, peer review reward, dispute pause, emergency pause, and authority flows reviewable before implementation.

## Project Escrow States

| State | Allowed next states | Local-only meaning |
|-------|---------------------|--------------------|
| draft | pending_review, cancelled | Project contract fixture exists but is not funded or active |
| pending_review | active, cancelled, paused | Founder/provider/admin review fixture is pending |
| active | milestone_submitted, paused, cancelled | Project fixture can receive milestone evidence |
| milestone_submitted | under_review, disputed, paused | Contractor submitted evidence metadata |
| under_review | release_recommended, disputed, paused | Inspector or peer review recommendation is being recorded |
| release_recommended | completed, disputed, paused | Local release recommendation exists, but no real funds move |
| disputed | under_review, paused, cancelled | Evidence review or dispute path is active |
| paused | active, under_review, cancelled | Safety pause blocks release recommendation changes |
| completed | archived | Local fixture is closed without real escrow movement |
| cancelled | archived | Local fixture is closed before completion |
| archived | archived | Terminal local record state |

## Loan Ledger States

| State | Allowed next states | Local-only meaning |
|-------|---------------------|--------------------|
| requested | scoring, declined, paused | Contractor credit request fixture is recorded |
| scoring | provider_review, declined, paused | RAA/backend score fixture is recorded |
| provider_review | offer_recorded, declined, paused | Finance-provider review label is pending |
| offer_recorded | repayment_plan_recorded, declined, paused | Offer label exists, not a real loan approval |
| repayment_plan_recorded | repayment_event_recorded, disputed, paused | Repayment-first waterfall label is recorded |
| repayment_event_recorded | repaid_label, default_label, disputed, paused | Simulated repayment allocation is recorded |
| disputed | provider_review, paused, declined | Review path is active |
| default_label | provider_review, archived | Local default label only |
| repaid_label | archived | Local repayment label only |
| declined | archived | Local decline label only |
| paused | scoring, provider_review, repayment_plan_recorded, archived | Safety pause blocks state changes until review |
| archived | archived | Terminal local record state |

## Token Collateral States

| State | Allowed next states | Local-only meaning |
|-------|---------------------|--------------------|
| draft | demo_locked, cancelled | Collateral estimate fixture exists |
| demo_locked | price_snapshot_recorded, paused, cancelled | Demo-only lock label is recorded |
| price_snapshot_recorded | ltv_checked, paused, cancelled | Placeholder oracle snapshot label is recorded |
| ltv_checked | release_label_recorded, liquidation_blocked, paused | Local LTV/margin label is recorded |
| liquidation_blocked | release_label_recorded, paused, archived | Auto-liquidation stays blocked |
| release_label_recorded | archived | Demo release label is recorded |
| paused | ltv_checked, release_label_recorded, archived | Safety pause blocks changes until review |
| cancelled | archived | Local fixture is cancelled |
| archived | archived | Terminal local record state |

## Peer Review Reward States

| State | Allowed next states | Local-only meaning |
|-------|---------------------|--------------------|
| submitted | scored, abuse_flagged, paused | Peer review evidence metadata is submitted |
| scored | reward_label_recorded, abuse_flagged, paused | Score and reputation impact label are recorded |
| reward_label_recorded | archived | Demo reward label exists, but no real token reward is issued |
| abuse_flagged | admin_review, paused, archived | Abuse or conflict flag requires review |
| admin_review | scored, reward_label_recorded, paused, archived | Admin review label is recorded |
| paused | admin_review, scored, archived | Safety pause blocks reward label changes |
| archived | archived | Terminal local record state |

## Global Pause Rules

- Emergency pause may move any non-terminal module fixture to `paused`.
- Emergency pause must not move real funds, approve real loans, release real escrow, route real repayments, lock real token collateral, settle stablecoins, issue real rewards, or liquidate collateral.
- Unpause requires stronger authority than pause.
- Terminal states cannot be reopened without a new fixture and audit event.
- Every state transition must create an audit event with actor, role, request id, previous state, next state, and safety gate note.

## Required Links

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-loan-legal-risk-model.md`

## Not Allowed

- Real payment movement.
- Real loan approval or origination.
- Real escrow holding or release.
- Real token collateral locking.
- Real repayment routing.
- Real stablecoin settlement.
- Real token rewards.
- Auto-liquidation.
- AI-only approval, release, default, dispute, or liquidation decisions.
- Claims that SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Checks

- `npm run check:smart-contract-state-machine`
- `npm run check:smart-contract-action-register`
- `npm run check:smart-contract-test-fixtures`
- `npm run check:smart-contract-authority-model`
- `npm run check:smart-contract-implementation-gate`
- `npm run check`
