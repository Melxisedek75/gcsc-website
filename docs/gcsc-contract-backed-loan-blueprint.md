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

## Implementation Packet External Use Gate

Local implementation packets cannot be used outside internal technical review unless the minimum evidence for that external use is recorded.

| External Use | Minimum Recorded Evidence | Blocked Until |
|---|---|---|
| founder_review_packet | Founder-facing summary, scope, current packet status, and blocked live actions | Founder records a review decision outside Codex automation |
| legal_or_provider_packet | Redacted technical summary, no-secret evidence references, and no-real-money boundary | Legal/provider reviewer is selected and founder approves sending |
| public_wording_source | Approved exact wording reference and claim-review evidence | Founder, legal/compliance, and public wording gates are recorded |
| production_or_deploy_source | Security review reference, authority model reference, and latest full check run | Founder, security, legal/provider, and deployment decisions are all recorded |

## Implementation Packet Decision Log

Every packet status change or handoff decision must record a small non-secret decision log entry.

| Decision Field | Required Value | Blocked If Missing |
|---|---|---|
| packet_decision_id | Stable non-secret local id tied to the packet and source commit | Decision cannot be referenced in handoff |
| decision_owner | Founder, legal/compliance, finance/provider, security, or Codex-local owner | Decision cannot be treated as reviewed |
| decision_state | HOLD, REVISE, LOCAL_ONLY_BUILD, or BLOCKED_FOR_LIVE_REVIEW | Decision cannot move packet status |
| decision_evidence_reference | Redacted file path, check run, or non-secret review reference | Decision cannot support external use |
| blocked_next_action | Explicit live action that remains blocked | Decision cannot close the safety gate |

## Implementation Packet Redaction Checklist

Every packet prepared from this blueprint must be redacted before founder review, legal/provider review, public wording, technical handoff, merge, or production decision use.

| Redaction Target | Required Handling | Blocked If Exposed |
|---|---|---|
| private_contract_text | Replace with signed_project_contract_reference or evidence_reference_hash | No founder, legal/provider, public, or production packet use |
| customer_or_contractor_identity | Replace with role, request id, or redacted profile reference | No external packet sharing |
| payment_or_bank_detail | Remove entirely and keep only no-real-money status | No packet handoff or merge |
| wallet_or_token_identifier | Replace with non-secret test fixture id unless founder-approved for review | No token collateral, settlement, or provider packet use |
| secrets_or_credentials | Remove entirely and rotate outside Codex if exposure is suspected | Stop work and notify founder |

## Implementation Packet Evidence Freshness Gate

Implementation packet evidence must be refreshed whenever packet scope, content, source commit, owner checkpoint, or intended use changes.

| Evidence Reference | Maximum Age | Refresh Required Before |
|---|---|---|
| latest_check_run_reference | Same working session or latest source commit | Any packet status upgrade, merge, or technical handoff |
| decision_evidence_reference | Current packet version and source commit | Founder, legal/provider, public, or production packet use |
| redaction_review_reference | After every packet content change | Any external sharing or handoff |
| owner_checkpoint_reference | After scope, authority, or blocked-live list changes | Packet closeout or status change |
| stale_or_missing_evidence | Treat as HOLD_FOR_SCOPE_REVIEW | No external use, merge, production decision, or live-risk action |

## Implementation Packet Change Control Gate

Every implementation packet change must keep a local change-control record before packet status, handoff, merge, or external-use state can advance.

| Change Control Field | Required Value | Blocked If Missing |
|---|---|---|
| source_commit | Current local commit or working-tree reference for the packet change | No packet status upgrade or merge |
| change_reason | Local technical reason tied to safety, evidence, scope, or implementation clarity | No handoff or closeout |
| affected_packet_sections | Exact sections changed or reviewed | No founder, legal/provider, public, or production packet use |
| review_owner | Codex-local, founder, legal/compliance, finance/provider, or security owner | No review state can be claimed |
| rollback_or_hold_action | Revert, revise, or hold action if change evidence is stale, unsafe, or disputed | No live-risk action or external sharing |

## Implementation Packet Audience Scope Gate

Every implementation packet must declare the intended audience and content depth before it can be exported, handed off, merged, or used for review decisions.

| Audience Scope Field | Required Value | Blocked If Missing |
|---|---|---|
| intended_audience | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | No packet export or handoff |
| allowed_content_depth | Summary, technical, legal/provider, security, or public-safe wording scope | No audience-specific packet use |
| approval_status | INTERNAL_REVIEW_ONLY, FOUNDER_REVIEW_PENDING, EXTERNAL_REVIEW_PENDING, or BLOCKED_FOR_LIVE_REVIEW | No packet status upgrade |
| prohibited_content | Secrets, private identities, payment details, wallet/token identifiers, live loan terms, or legal conclusions listed as excluded | No external sharing |
| blocked_until | Explicit founder/legal/provider/security/public-wording decision or no-real-money evidence gate | No live-risk action or production use |

## Implementation Packet Revocation Gate

Any packet approval, handoff, export, or audience-specific use can be revoked if evidence, redaction, audience, claim, or live-risk conditions become unsafe.

| Revocation Trigger | Required Response | Blocked Until |
|---|---|---|
| sensitive_data_found | Revoke packet approval, stop sharing, and re-run redaction review | Founder/admin confirms redacted replacement |
| wrong_audience_shared | Mark packet BLOCKED_FOR_LIVE_REVIEW and record correction path | Founder/legal/provider route confirms next safe packet |
| stale_evidence_discovered | Downgrade to HOLD_FOR_SCOPE_REVIEW and refresh evidence references | Latest check run and owner checkpoint are recorded |
| unsafe_claim_found | Remove claim from packet and route wording to founder/legal review | Claim-review evidence is updated |
| live_risk_action_detected | Stop work and keep real loan, escrow, repayment, settlement, collateral, provider, deploy, and public actions blocked | Founder/legal/provider/security decision is recorded |

## Implementation Packet Supersession Gate

Any replacement packet must explicitly identify the packet it supersedes so stale packet approval, sharing, claim use, or live-risk assumptions cannot remain active by accident.

| Supersession Field | Required Value | Blocked If Missing |
|---|---|---|
| superseded_packet_id | Stable non-secret id of packet being replaced | Old packet remains ambiguous for handoff or review |
| replacement_packet_id | Stable non-secret id tied to current packet/source commit | New packet cannot be treated as active |
| supersession_reason | Evidence refresh, redaction fix, audience correction, claim correction, or live-risk correction | Packet cannot override prior approval |
| carry_forward_decisions | Explicit HOLD, REVISE, LOCAL_ONLY_BUILD, or BLOCKED_FOR_LIVE_REVIEW decisions copied or retired | Prior decision state cannot be reused |
| blocked_old_packet_use | Old packet marked blocked for sharing, claim use, production use, live-risk action, and external handoff | Old packet may not be referenced as current |

## Implementation Packet Retirement Gate

Any retired packet must be explicitly marked unusable for sharing, claim use, external handoff, production use, and live-risk action so stale packets cannot re-enter the review path.

| Retirement Field | Required Value | Blocked If Missing |
|---|---|---|
| retired_packet_id | Stable non-secret id of packet being retired | Packet may remain usable by mistake |
| retirement_reason | Superseded, revoked, stale, wrong audience, unsafe claim, or live-risk correction | Retirement cannot be audited |
| retirement_scope | Sharing, claim use, external handoff, production use, and live-risk action all blocked | Old packet may be reused outside scope |
| replacement_or_hold_reference | Replacement packet id or HOLD_FOR_SCOPE_REVIEW record | Reviewers cannot identify current safe source |
| retirement_owner | Codex-local, founder, legal/compliance, finance/provider, or security owner | Retirement cannot be treated as reviewed |

## Implementation Packet Review Freeze Gate

Any packet under founder, legal/provider, security, public wording, or live-risk review must freeze in-place edits until a new version, supersession record, retirement record, or explicit hold path is recorded.

| Review Freeze Field | Required Value | Blocked If Missing |
|---|---|---|
| freeze_state | OPEN_FOR_LOCAL_EDIT, FROZEN_FOR_FOUNDER_REVIEW, FROZEN_FOR_LEGAL_PROVIDER_REVIEW, or BLOCKED_FOR_LIVE_REVIEW | Packet review state cannot be trusted |
| freeze_reason | Founder review, legal/provider review, security review, public wording review, or live-risk block | Packet may change during review without record |
| allowed_change_path | New packet version, supersession record, or explicit HOLD_FOR_SCOPE_REVIEW | In-place edits cannot proceed |
| reviewer_notification_reference | Non-secret note that reviewers must use latest packet id | Reviewers may rely on stale packet |
| thaw_condition | Review completed, packet superseded, packet retired, or founder/legal/provider/security decision recorded | Packet cannot resume editing |

## Implementation Packet Review Exit Gate

Any packet leaving founder, legal/provider, security, public wording, or live-risk review must record the exit decision, owner, evidence, scope, and remaining blocked actions before it can support the next internal step.

| Review Exit Field | Required Value | Blocked If Missing |
|---|---|---|
| exit_decision | HOLD, REVISE, LOCAL_ONLY_BUILD, BLOCKED_FOR_LIVE_REVIEW, or APPROVED_FOR_NEXT_INTERNAL_STEP | Packet cannot leave review freeze |
| exit_owner | Founder, legal/compliance, finance/provider, security, or Codex-local owner | Exit cannot be attributed |
| exit_evidence_reference | Redacted file path, check run, or non-secret review reference tied to packet id | Exit cannot support next step |
| exit_scope | Internal technical draft, founder packet, legal/provider packet, public wording source, or production/deploy source | Packet can be reused outside reviewed scope |
| blocked_after_exit | Real loan, escrow, repayment, settlement, collateral, provider, deploy, public launch, or legal decision still blocked as applicable | Exit may be misread as live approval |

## Implementation Packet Post-Exit Distribution Gate

Any packet distributed after review exit must keep distribution state, audience, evidence, channel boundary, and blocked actions explicit before the packet leaves local archive or founder-controlled review.

| Post-Exit Distribution Field | Required Value | Blocked If Missing |
|---|---|---|
| distribution_state | INTERNAL_ONLY, READY_FOR_FOUNDER_HANDOFF, READY_FOR_LEGAL_PROVIDER_HANDOFF, READY_FOR_PUBLIC_WORDING_REVIEW, or BLOCKED_FOR_DISTRIBUTION | Packet distribution cannot start |
| distribution_audience | Founder, legal/compliance, finance/provider, security, public-wording reviewer, or Codex-local archive | Audience cannot be verified |
| distribution_evidence_reference | Review exit record, redaction check, latest check run, and packet id | Distribution lacks proof of safe exit |
| distribution_channel_boundary | Local file path, founder-controlled upload, or approved review channel; no autonomous external send | Packet may be sent through unapproved channel |
| distribution_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked | Distribution may be misread as live authorization |

## Implementation Packet Distribution Acknowledgement Gate

Any distributed packet must record recipient acknowledgement state, owner, reference, scope, and still-blocked actions before follow-up can be closed or the packet can be treated as understood.

| Distribution Acknowledgement Field | Required Value | Blocked If Missing |
|---|---|---|
| acknowledgement_state | NOT_SENT, SENT_FOR_REVIEW, ACKNOWLEDGED, NEEDS_CLARIFICATION, or BLOCKED_FOR_ACKNOWLEDGEMENT | Packet follow-up cannot be closed |
| acknowledgement_owner | Founder, legal/compliance, finance/provider, security, public-wording reviewer, or Codex-local owner | Acknowledgement cannot be attributed |
| acknowledgement_reference | Non-secret note, request id, file path, or review-thread reference tied to packet id | Packet recipient understanding cannot be traced |
| acknowledgement_scope | Receipt only, clarification requested, review accepted, review rejected, or local archive only | Packet outcome can be misread |
| acknowledgement_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked until explicit separate approval | Acknowledgement may be mistaken for approval |

## Implementation Packet Clarification Response Gate

Any question raised after packet distribution must be routed by response owner and scope before it can be answered, closed, or used to change packet status.

| Clarification Response Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_state | NOT_REQUESTED, REQUESTED, ANSWERED_LOCALLY, ROUTED_TO_FOUNDER, ROUTED_TO_LEGAL_PROVIDER, or BLOCKED_PENDING_RESPONSE | Clarification cannot be closed |
| clarification_question_reference | Non-secret question id, request id, or review-thread reference tied to packet id | Clarification cannot be traced |
| clarification_response_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Response authority cannot be verified |
| clarification_scope | Technical explanation, wording clarification, legal/provider question, security question, or live-risk question | Response may exceed allowed role |
| clarification_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked unless separately approved | Clarification may be mistaken for approval |

## Implementation Packet Clarification Decision Routing Gate

Any clarification that could change packet status, public wording, legal/provider position, security posture, or live-risk interpretation must be routed to the correct decision owner before it can be answered or closed.

| Clarification Decision Routing Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_routing_state | LOCAL_RESPONSE_ALLOWED, FOUNDER_DECISION_REQUIRED, LEGAL_PROVIDER_DECISION_REQUIRED, SECURITY_DECISION_REQUIRED, PUBLIC_WORDING_DECISION_REQUIRED, or BLOCKED_FOR_ROUTING | Clarification routing cannot be trusted |
| clarification_decision_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Required decision owner is ambiguous |
| clarification_decision_boundary | Technical-only answer, founder business decision, legal/provider decision, security decision, public wording decision, or live-risk decision | Response may cross authority boundary |
| clarification_next_allowed_action | Answer locally, route to founder, route to legal/provider, route to security, route to public wording review, or hold packet | Clarification can advance without proper owner |
| clarification_routing_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked until the required owner records a separate decision | Routing may be mistaken for approval |

## Implementation Packet Clarification Closure Gate

Every clarification must close with a non-secret evidence reference, scoped outcome, and explicit blocked-live reminder before it can be treated as answered or revision-ready.

| Clarification Closure Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_closure_state | OPEN, ANSWERED_LOCALLY, ROUTED_AND_PENDING, CLOSED_NO_STATUS_CHANGE, CLOSED_WITH_REVISION_REQUIRED, or BLOCKED_FOR_CLOSURE | Clarification closure state cannot be trusted |
| clarification_closure_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Closure owner cannot be attributed |
| clarification_closure_evidence_reference | Non-secret answer note, routing note, review-thread reference, check run, or packet id | Closure cannot be traced |
| clarification_closure_scope | No packet change, local technical revision, founder decision pending, legal/provider decision pending, security decision pending, or public wording revision pending | Closure may be reused outside scope |
| clarification_closure_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked after closure unless separately approved | Closure may be mistaken for live approval |

## Implementation Packet Clarification Revision Intake Gate

Any packet revision caused by a clarification must record the revision source, owner, scope, and live-risk block before the packet can change text, status, or implementation handoff notes.

| Clarification Revision Intake Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_revision_state | NO_REVISION, REVISION_REQUESTED, LOCAL_REVISION_ALLOWED, FOUNDER_REVIEW_REQUIRED, LEGAL_PROVIDER_REVIEW_REQUIRED, SECURITY_REVIEW_REQUIRED, PUBLIC_WORDING_REVIEW_REQUIRED, or BLOCKED_FOR_REVISION | Clarification-driven revision state cannot be trusted |
| clarification_revision_source | Non-secret clarification closure reference, decision routing note, review-thread reference, or packet id | Revision source cannot be traced |
| clarification_revision_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Revision owner cannot be attributed |
| clarification_revision_scope | Local technical edit, founder wording edit, legal/provider edit, security edit, public wording edit, or live-risk hold | Revision may exceed reviewed scope |
| clarification_revision_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked until revision review and separate approval are recorded | Revision may be mistaken for approval |

## Implementation Packet Clarification Revision Review Gate

Clarification-driven packet revisions must be reviewed under the correct scope before they can be treated as accepted local wording, founder wording, legal/provider wording, security wording, or public wording.

| Clarification Revision Review Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_revision_review_state | NOT_NEEDED, PENDING_LOCAL_REVIEW, PENDING_FOUNDER_REVIEW, PENDING_LEGAL_PROVIDER_REVIEW, PENDING_SECURITY_REVIEW, PENDING_PUBLIC_WORDING_REVIEW, REVIEWED_LOCAL_ONLY, or BLOCKED_FOR_REVIEW | Clarification revision review state cannot be trusted |
| clarification_revision_review_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Revision review owner cannot be attributed |
| clarification_revision_review_evidence | Non-secret diff reference, check run, packet id, review note, or decision record | Revision review cannot be traced |
| clarification_revision_review_scope | Local technical validation, founder wording validation, legal/provider validation, security validation, public wording validation, or live-risk hold | Revision review may be reused outside scope |
| clarification_revision_review_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked after revision review unless separately approved | Revision review may be mistaken for live approval |

## Implementation Packet Clarification Revision Closeout Gate

A clarification-driven packet revision can close only after review evidence, final scope, and blocked-live boundaries are recorded without implying approval for real loans, escrow, repayment, settlement, collateral, provider commitments, deploy, public launch, or legal decisions.

| Clarification Revision Closeout Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_revision_closeout_state | NO_REVISION, OPEN, REVIEWED_LOCAL_ONLY, CLOSED_REQUIRES_FOUNDER_DECISION, CLOSED_REQUIRES_LEGAL_PROVIDER_DECISION, CLOSED_REQUIRES_SECURITY_DECISION, CLOSED_REQUIRES_PUBLIC_WORDING_DECISION, or BLOCKED_FOR_CLOSEOUT | Clarification revision closeout state cannot be trusted |
| clarification_revision_closeout_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Revision closeout owner cannot be attributed |
| clarification_revision_closeout_evidence | Non-secret revision review evidence, final diff reference, check run, packet id, or decision record | Revision closeout cannot be traced |
| clarification_revision_closeout_scope | No change, local technical closeout, founder decision pending, legal/provider decision pending, security decision pending, public wording decision pending, or live-risk hold | Revision closeout may be reused outside scope |
| clarification_revision_closeout_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked after revision closeout unless separately approved | Revision closeout may be mistaken for live approval |

## Implementation Packet Clarification Revision Archive Gate

A closed clarification-driven packet revision can be archived only with a non-secret closeout reference, final packet identifier, source commit or check evidence, and live-risk boundaries that remain blocked after archival.

| Clarification Revision Archive Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_revision_archive_state | NOT_ARCHIVED, READY_FOR_LOCAL_ARCHIVE, ARCHIVED_LOCAL_ONLY, ARCHIVED_PENDING_FOUNDER_DECISION, ARCHIVED_PENDING_LEGAL_PROVIDER_DECISION, ARCHIVED_PENDING_SECURITY_DECISION, ARCHIVED_PENDING_PUBLIC_WORDING_DECISION, or BLOCKED_FOR_ARCHIVE | Clarification revision archive state cannot be trusted |
| clarification_revision_archive_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Revision archive owner cannot be attributed |
| clarification_revision_archive_evidence | Non-secret closeout reference, final packet id, source commit, check run, or decision record | Revision archive cannot be traced |
| clarification_revision_archive_scope | Local archive, founder decision archive, legal/provider archive, security archive, public wording archive, or live-risk hold | Revision archive may be reused outside scope |
| clarification_revision_archive_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked after revision archive unless separately approved | Revision archive may be mistaken for live approval |

## Implementation Packet Clarification Revision Retrieval Gate

An archived clarification-driven packet revision can be retrieved for local, founder, legal/provider, security, or public wording review only when the retrieval reason, owner, evidence reference, and blocked-live boundaries are recorded.

| Clarification Revision Retrieval Field | Required Value | Blocked If Missing |
|---|---|---|
| clarification_revision_retrieval_state | NOT_REQUESTED, REQUESTED_FOR_LOCAL_REVIEW, RETRIEVED_LOCAL_ONLY, RETRIEVED_FOR_FOUNDER_REVIEW, RETRIEVED_FOR_LEGAL_PROVIDER_REVIEW, RETRIEVED_FOR_SECURITY_REVIEW, RETRIEVED_FOR_PUBLIC_WORDING_REVIEW, or BLOCKED_FOR_RETRIEVAL | Clarification revision retrieval state cannot be trusted |
| clarification_revision_retrieval_owner | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | Revision retrieval owner cannot be attributed |
| clarification_revision_retrieval_evidence | Non-secret archive reference, retrieval reason, packet id, source commit, check run, or decision record | Revision retrieval cannot be traced |
| clarification_revision_retrieval_scope | Local review, founder review, legal/provider review, security review, public wording review, or live-risk hold | Revision retrieval may be reused outside scope |
| clarification_revision_retrieval_blocked_actions | Real loan, escrow, repayment, settlement, collateral, provider commitment, deploy, public launch, and legal decision remain blocked after revision retrieval unless separately approved | Revision retrieval may be mistaken for live approval |

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
