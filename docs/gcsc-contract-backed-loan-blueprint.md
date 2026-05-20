# GCSC Contract-Backed Loan Blueprint

Status: internal founder-approved design candidate only.

This blueprint is not legal advice, not lending approval, not escrow approval, not payment provider approval, not securities advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, not approval to move real money, and not approval to treat signed project contracts as legal collateral today.

## Purpose

This is the source-of-truth design for the GCSC contract-backed working-capital model.

The goal is to turn a signed SmartContractor project contract into a verified underwriting package for future contractor working capital, while keeping all real-money, legal, escrow, collateral, and provider decisions gated.

The design must protect four things:

- homeowner funds;
- contractor ability to start real work;
- lender/provider repayment logic;
- GCSC compliance, auditability, and platform integrity.

## Core Thesis

A signed SmartContractor project contract can create a structured business asset: expected milestone receivables.

Those receivables can support a future contractor working-capital request when all required approvals exist:

1. Homeowner or property owner signs a project contract with a contractor.
2. The contract defines scope, value, milestones, evidence, review roles, dispute rules, and payment schedule.
3. The contractor requests working capital against expected milestone receivables.
4. GCSC prepares a risk and verification package.
5. A future lender or finance provider approves, rejects, or requests more information.
6. When a milestone is approved and not disputed, the payment waterfall applies agreed repayment first.
7. Remaining net milestone proceeds go to the contractor.

Preferred wording: contract-backed working-capital eligibility, receivables-based underwriting, signed-project-contract credit support, repayment-first milestone waterfall.

Blocked wording: guaranteed loan, automatic loan approval, legal collateral today, live escrow, live lending, legally enforceable repayment routing without provider/legal approval, token-backed loan live today.

## Non-Negotiable Safety Principles

1. AI never makes final legal, lending, escrow, collateral, or payment decisions.
2. Smart contracts never receive hidden admin backdoors.
3. Every privileged action requires explicit role authority and audit logging.
4. Disputes pause release eligibility and repayment routing.
5. Real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, and liens remain blocked until founder, attorney, lender/provider, escrow/payment provider, security, and jurisdiction review are complete.
6. The platform must not store raw private documents, SSNs, bank data, passwords, private keys, service-role keys, or seed phrases on-chain.
7. Public wording must never promise token price growth, guaranteed repayment, guaranteed yield, risk-free homeowner outcomes, or lender-safe returns.

## Actors And Roles

| Actor | Allowed Role | Hard Boundary |
|---|---|---|
| Homeowner or property owner | Creates project, accepts bid, signs project contract, reviews milestones, opens disputes | Cannot be forced into real escrow or repayment routing without approved legal/provider terms |
| Contractor | Submits bid, signs contract, requests working capital, submits evidence, receives net milestone payout | Cannot self-approve loan, milestone, repayment routing, or evidence |
| Inspector or reviewer | Reviews milestone evidence and completion | Cannot move funds directly |
| AI verification agent | Recommends evidence status and risk signals | Cannot approve loans, release payments, or decide disputes |
| Risk assessment agent | Produces risk recommendation and explainable score | Cannot create binding lender approval |
| Lender or finance provider | Approves or rejects future working capital | Must be external/provider-reviewed before real lending |
| Escrow or payment provider | Handles real regulated money flow when approved | Must not be implied as live before integration approval |
| GCSC admin/multisig | Operates platform controls and emergency pause | Must be audited and limited; no unilateral hidden drain rights |
| Legal/compliance reviewer | Reviews documents, disclosures, jurisdiction, lending, escrow, collateral | Required before public real-money claims |

## Lifecycle State Machine

| State | Meaning | Allowed Next States |
|---|---|---|
| Project Draft | Project exists but no accepted bid | Bid Submitted, Cancelled |
| Bid Accepted | Owner selected contractor | Contract Drafted, Cancelled |
| Contract Signed | Parties accepted scope, milestones, and payment schedule | Loan Requested, Work Started, Disputed |
| Loan Requested | Contractor requests working capital tied to project receivables | Risk Review, Withdrawn |
| Risk Review | System prepares identity, contract, repayment, dispute, and compliance package | Provider Review, Rejected, More Info Needed |
| Provider Review | Future provider reviews funding request | Loan Approved, Rejected, More Info Needed |
| Loan Approved | Provider-approved funding may be recorded | Work Started, Cancelled, Disputed |
| Work Started | Contractor performs milestone work | Evidence Submitted, Disputed |
| Evidence Submitted | Contractor uploads evidence references | AI Review, Human Review, Disputed |
| AI Review | AI produces recommendation only | Human Review, More Evidence Needed, Disputed |
| Human Review | Owner, inspector, peer reviewer, or admin reviews | Milestone Approved, More Evidence Needed, Disputed |
| Milestone Approved | Work accepted under project rules | Release Eligible, Disputed |
| Release Eligible | Payment can enter waterfall if no pause exists | Repayment Routed, Disputed |
| Repayment Routed | Agreed repayment amount is applied first | Contractor Net Paid, Balance Updated |
| Contractor Net Paid | Remaining proceeds are paid to contractor | Next Milestone, Project Complete |
| Disputed | Release and repayment routing pause | Resolved, More Evidence Needed, Cancelled |
| Resolved | Dispute outcome recorded | Release Eligible, Refund Or Adjustment, Next Milestone |
| Project Complete | All milestones closed | Archived |

Invariant: no state may jump directly from Evidence Submitted to Repayment Routed without AI/human review, milestone approval, release eligibility, and no active dispute.

## Payment Waterfall

The future payment waterfall applies only after a milestone is approved, release-eligible, not disputed, and provider/legal terms permit routing.

Formula:

```text
milestone_gross - approved_platform_fees - agreed_loan_repayment = contractor_net_payout
```

Required waterfall controls:

- repayment cap per milestone;
- outstanding balance check;
- minimum contractor net payout rule if provider terms require it;
- dispute pause;
- refund/adjustment path;
- audit event for every calculation input and output;
- no negative payout;
- no repayment above outstanding balance;
- no fee above approved schedule.

## Data Model

Minimum future backend/smart-contract references:

- project_contract_id;
- homeowner_profile_id;
- contractor_profile_id;
- accepted_bid_id;
- provider_id;
- loan_id;
- milestone_id;
- payment_intent_id;
- dispute_id;
- evidence_reference_hash;
- approval_reference_id;
- milestone_gross_amount;
- approved_platform_fee_amount;
- agreed_repayment_amount;
- contractor_net_payout;
- remaining_loan_balance;
- release_eligibility_state;
- dispute_state;
- audit_event_id.

Private documents stay off-chain. On-chain records should store only ids, hashes, references, state, asset amounts where legally approved, and audit events.

## Smart Contract Module Boundaries

### Project Contract Registry

Records accepted project relationships and milestone references.

No legal-contract replacement claim. The signed legal agreement remains off-chain or in provider-approved records.

### Milestone And Escrow-Ready State Machine

Tracks milestone funding, evidence, review, approval, hold, release eligibility, refund, and archive states.

No live escrow claim until licensed/provider-approved rails exist.

### Contract-Backed Loan Ledger

Tracks loan request, provider review status, approved principal, outstanding balance, repayment events, and closeout.

No autonomous lending approval. Provider approval remains external and review-gated.

### Repayment Waterfall Router

Calculates repayment-first routing for approved milestones.

No routing if dispute_state is active, release_eligibility_state is false, provider approval is missing, or legal/payment terms are missing.

### Reputation And Risk Ledger

Records completed jobs, dispute ratios, repayment behavior, bid accuracy, inspection outcomes, and verified feedback.

Must include correction/review path. No unexplained automated denial.

### Audit And Compliance Registry

Records non-secret evidence that required checks occurred.

Must include role, timestamp, action, before/after state, reference ids, request id, and blocked/live-risk flag.

## Security And Anti-Backdoor Requirements

Smart contract and backend implementation must enforce:

- least-privilege roles;
- multisig or admin quorum for privileged actions;
- explicit emergency pause with audit trail;
- no owner-only fund drain;
- no hidden upgrade path;
- no arbitrary balance mutation;
- no arbitrary price oracle trust;
- no bypass from dispute to release;
- no self-approval by contractor;
- no AI-only approval;
- no frontend-controlled authority for protected actions;
- no service-role key in browser code;
- deterministic tests for every state transition;
- replay tests for payment waterfall calculations;
- event logs for every privileged action.

Required blocked actions:

- create live loan without provider approval;
- route repayment while disputed;
- release milestone before approval;
- overpay repayment above outstanding balance;
- reduce audit history;
- delete or rewrite repayment history;
- change provider approval after funding without audit;
- use token collateral without collateral agreement, oracle, custody, and legal review;
- present a roadmap feature as live.

## Threat Model

| Threat | Control |
|---|---|
| Contractor submits fake evidence | AI-assisted review, human review, evidence hash, dispute path, fraud flag |
| Homeowner refuses valid payment | milestone evidence, inspector/peer/admin review, dispute resolution |
| Admin drains funds | no hidden drain function, multisig, scoped permissions, audit logs, emergency pause only |
| AI wrongfully approves work | AI recommendation only; human/provider approval required |
| Provider approval spoofed | signed provider reference, backend service boundary, audit event, optional future multisig |
| Dispute bypass | release and repayment require dispute_state = clear |
| Price oracle manipulation | no token collateral live until oracle/custody/legal review; conservative LTV |
| Public legal overclaim | public wording gate, claim review matrix, founder/legal/provider review |
| Secret leakage | no secrets in docs, frontend, on-chain records, or public packets |
| State corruption | append-only audit events, deterministic replay, status transition validator |

## Implementation Owner Matrix

| Owner | Responsibility | Stop Boundary |
|---|---|---|
| Founder | Approves public wording, provider outreach, live deploy timing, and admin activation | Cannot be bypassed by Codex or automation |
| Legal/compliance reviewer | Reviews lending, escrow, repayment, collateral, privacy, and public claims | Must approve before real-money claims or provider commitments |
| Finance or lending provider | Defines underwriting, funding, repayment, servicing, and disclosures | No autonomous Codex funding, servicing, or repayment routing |
| Security reviewer | Reviews authority model, replay fixtures, audit trail, and anti-backdoor controls | No live contract deployment before security review |
| Codex | Prepares local drafts, validators, replay fixtures, implementation plans, and founder review packets | Cannot approve legal terms, provider commitments, production deploy, live loans, real escrow, repayment routing, stablecoin settlement, or token collateral |

## Implementation Evidence Gate

Before the blueprint can be used for any local implementation packet, every evidence reference must stay non-secret, local-only, and review-gated.

| Evidence Item | Required Before | Stop Boundary |
|---|---|---|
| signed_project_contract_reference | local implementation planning | Must be a non-secret id or hash reference, not raw private contract text |
| provider_review_reference | provider-facing handoff or real funding design | Must remain pending until provider writes back through founder-controlled review |
| legal_review_reference | public real-money wording or production routing | Must remain pending until attorney/compliance review is recorded |
| security_review_reference | production contract deployment | Must remain pending until authority, audit, replay, and anti-backdoor review is complete |
| no_real_money_check_run | every local implementation packet | Must show local-only checks before any live loan, escrow, repayment, settlement, or collateral step |

## Implementation Packet Readiness Checklist

Every local implementation packet derived from this blueprint must include these readiness items before it can leave `LOCAL_REVIEW_ONLY`.

| Readiness Item | Required Evidence | Blocked If Missing |
|---|---|---|
| scope_summary | Local-only module or packet scope with explicit non-live purpose | Packet cannot be used for provider, legal, public, or production decisions |
| state_transition_map | Allowed states, forbidden jumps, dispute pauses, and repayment holds | No smart contract implementation handoff |
| authority_and_audit_map | Role checks, signer references, request ids, and append-only audit events | No privileged action design acceptance |
| blocked_live_action_list | Real loans, escrow, repayment routing, stablecoin settlement, token collateral, public launch, and provider commitments listed as blocked | No founder review packet closeout |
| latest_check_run_reference | Fresh local validator or full check evidence | No packet status can move beyond LOCAL_REVIEW_ONLY |

## Implementation Packet Status Taxonomy

Every implementation packet must keep one explicit status so a local technical artifact cannot drift into founder, provider, legal, public, deployment, or real-money authority.

| Packet Status | Meaning | Allowed Next Status |
|---|---|---|
| LOCAL_REVIEW_ONLY | Draft or implementation packet exists only for local technical review and cannot support external decisions | HOLD_FOR_SCOPE_REVIEW or READY_FOR_TECHNICAL_DRAFT |
| HOLD_FOR_SCOPE_REVIEW | Scope, evidence, owner checkpoint, or no-real-money proof is incomplete | LOCAL_REVIEW_ONLY or READY_FOR_TECHNICAL_DRAFT |
| READY_FOR_TECHNICAL_DRAFT | Local scope, fixtures, owner notes, blocked-live list, and check evidence are present | BLOCKED_FOR_LIVE_REVIEW |
| BLOCKED_FOR_LIVE_REVIEW | Packet is technically organized but blocked from provider, legal, public, deploy, loan, escrow, repayment, settlement, or collateral use | LOCAL_REVIEW_ONLY after revisions only |

## Founder Approval Gates

This model can move from draft to implementation planning only when the founder explicitly approves:

1. contract-backed working capital is the preferred wording;
2. AI is recommendation-only;
3. repayment-first waterfall is future provider-reviewed routing;
4. signed project contract is not described as legal collateral today;
5. smart contract work starts as local ledger/state-machine code, not live money movement;
6. legal/provider review happens before public real-money claims.

## Implementation Readiness

Ready now:

- internal whitepaper v1.2 architecture language;
- founder review packet;
- local state-machine design;
- local backend/smart-contract model planning;
- validator and claim guard coverage.

Not ready without external approval:

- real loans;
- real escrow;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- UCC/lien/security-interest execution;
- production payment provider integration;
- public claims that the system is legally compliant.

## Required Checks Before Public Use

- `npm run check:contract-backed-loan-blueprint`
- `npm run check:whitepaper-v1-2-contract-backed-loan-flow`
- `npm run check:whitepaper-v1-2-contract-backed-loan-addendum`
- `npm run check:whitepaper-v1-2-smart-contract-architecture`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check:legal-review`
- `npm run check`
