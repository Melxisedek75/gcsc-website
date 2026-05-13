# SmartContractor Backend To Chain Map

Status: internal backend-to-chain mapping draft only. Not deployed. Not legal advice. This map does not approve real escrow, does not approve real loans, does not approve token collateral, does not approve production payments, and does not approve live XPR contract deployment.

## Purpose

Map SmartContractor backend entities and API events to future XPR smart contract actions, tables, state transitions, and audit events before any contract code is written. The goal is to keep the current marketplace, project contracts, milestones, contractor credit, repayment waterfall, token collateral labels, peer review, dispute pause, and authority flows aligned with the future on-chain design.

This is a design-only bridge. The backend remains the source of truth for the local MVP until founder approval, legal/provider review, security review, no-real-money tests, XPR account approval, and production provider gates are complete.

## Mapping Rules

- Backend APIs may prepare records and audit events, but must not trigger live money movement.
- Future chain actions must mirror approved backend state, not invent new business logic.
- Chain table rows should store references and labels, not private documents or sensitive personal data.
- Every future chain write must link to a backend `request_id`.
- Every future chain state transition must link to an audit event name.
- AI outputs can be stored as recommendations or labels only, never as final approval authority.
- Provider, founder, legal, and security approval statuses must remain explicit before live-risk features are enabled.

## Backend Entities

| Backend Entity | Current MVP Role | Future Chain Reference |
|----------------|------------------|------------------------|
| `profiles` | User identity shell and role link | actor account reference only |
| `homeowners` | Project owner profile | homeowner/account role |
| `contractors` | Contractor profile and reputation inputs | contractor/account role |
| `jobs` | Job request posted by homeowner | project source reference |
| `bids` | Contractor bid and accepted proposal | project contract source |
| `project_contracts` | Accepted bid converted to project contract | project table reference |
| `project_milestones` | Work/payment milestone state | milestone table reference |
| `starter_loans` | Contractor working-capital request and status | loan ledger reference |
| `loan_repayments` | Repayment-first allocation record | repayment event reference |
| `token_collateral_locks` | Demo collateral estimate and state label | collateral table reference |
| `disputes` | Dispute and pause trigger | dispute status reference |
| `evidence_items` | Work proof, review proof, dispute proof metadata | evidence hash/reference only |
| `peer_reviews` | Reviewer score and recommendation | review table reference |
| `audit_events` | Source audit ledger and request correlation | chain audit event reference |
| `payment_intents` | Provider-agnostic payment intent scaffold | provider settlement reference only |

## API To Action Map

| Backend/API Event | Draft Chain Action | Draft Table | Audit Event | Safety Gate |
|-------------------|-------------------|-------------|-------------|-------------|
| Accepted bid creates project contract | `mkproject` | `projects` | `contract.project.created` | founder-review |
| Milestone is added to a project | `addmile` | `milestones` | `contract.milestone.added` | founder-review |
| Contractor submits milestone evidence | `submitevid` | `evidence` | `contract.milestone.evidence_submitted` | demo-only |
| Reviewer/admin records milestone review | `recordrevw` | `reviews` | `contract.milestone.review_recorded` | provider-review |
| Project or module is paused | `pauseproj` or `pausemod` | `pauses` | `contract.project.paused` or `authority.module.paused` | security-review |
| Dispute resolution label is recorded | `resolvedisp` | `disputes` | `contract.project.dispute_resolved` | legal-review |
| Contractor credit request is recorded | `reqloan` | `loans` | `loan.request.recorded` | legal-review |
| Risk score is recorded | `scoreloan` | `scores` | `loan.score.recorded` | finance-provider-review |
| Provider review status is recorded | `providerok` | `providerlog` | `loan.provider_review.recorded` | provider-review |
| Draft repayment plan is recorded | `setrepay` | `repayplans` | `loan.repayment_plan.recorded` | finance-provider-review |
| Simulated repayment event is recorded | `recpaydemo` | `repayments` | `loan.repayment_event.recorded` | demo-only |
| Demo token collateral label is recorded | `lockdemo` | `collateral` | `collateral.demo_lock.recorded` | legal-provider-review |
| Price snapshot label is recorded | `pricesnap` | `prices` | `collateral.price_snapshot.recorded` | oracle-review |
| LTV label is recorded | `ltvcheck` | `collateral` | `collateral.ltv_check.recorded` | legal-provider-review |
| Liquidation attempt is blocked | `blockliq` | `collateral` | `collateral.liquidation_blocked` | blocked |
| Peer review is submitted | `submitpeer` | `peerreviews` | `peer.review.submitted` | demo-only |
| Peer review score is recorded | `scorepeer` | `peerreviews` | `peer.review.score_recorded` | admin-review |
| Demo peer reward label is recorded | `rewarddemo` | `rewardlabels` | `peer.review.reward_label.recorded` | founder-review |
| Authority is changed | `setauth` | `authorities` | `authority.changed` | founder-security-review |
| Emergency pause is recorded | `emergpause` | `pauses` | `authority.emergency_pause.recorded` | security-review |

## Required Chain References

Future smart contract rows should reference:

- `request_id`;
- `project_contract_id`;
- `milestone_id`;
- `loan_id`;
- `repayment_id`;
- `collateral_id`;
- `review_id`;
- `evidence_id`;
- `payment_intent_id`;
- `audit_event_id`;
- `actor_role`;
- `safety_gate`;
- `provider_review_status`;
- `founder_approval_status`;
- `legal_provider_status`.

## Privacy Boundary

Future chain rows must not store:

- names, emails, phone numbers, private addresses, government IDs, bank data, card data, wallet private keys, raw contracts, raw evidence files, raw invoices, secrets, service-role keys, passwords, or personal documents;
- legal conclusions such as lien status, enforceability, borrower eligibility, escrow custody, lender approval, or licensed-provider status unless an approved provider/legal workflow supplies the label.

## Required Links

- `docs/smartcontractor-smart-contract-design.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-loan-legal-risk-model.md`

## Not Allowed

This map must not be used to:

- deploy live contracts;
- move real funds;
- approve real loans;
- release real escrow;
- route real repayments;
- lock real token collateral;
- settle stablecoins;
- issue real rewards;
- liquidate collateral;
- let AI make final approval, release, default, liquidation, or dispute decisions;
- claim SmartContractor is a licensed lender, bank, escrow agent, payment provider, underwriter, broker, or legal advisor.

## Required Checks

- `npm run check:backend-to-chain-map`
- `npm run check:smart-contract-audit-event-map`
- `npm run check:smart-contract-state-machine`
- `npm run check:smart-contract-action-register`
- `npm run check:smart-contract-implementation-gate`
- `npm run check`

If any check fails, smart contract implementation stays design-only.
