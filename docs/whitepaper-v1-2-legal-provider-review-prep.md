# GCSC Whitepaper v1.2 Legal Provider Review Prep

Status: INTERNAL_REVIEW_PREP_ONLY

This packet is not legal advice, not provider approval, not lender approval, not escrow approval, not payment-provider approval, and not approval to launch real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, or public launch.

Explicit launch boundary: not approval to launch real loans; not approval to launch real escrow; not approval to launch real repayment routing; not approval to launch stablecoin settlement; not approval to launch token collateral.

## Purpose

Prepare one conservative, non-secret review packet for attorneys, finance providers, escrow/payment providers, and future compliance reviewers.

The packet explains what GCSC and SmartContractor do now, which features remain local/demo only, which future concepts need external review, and which live actions stay blocked until written approvals are recorded.

## What GCSC SmartContractor Does Now

Current implemented scope is a local/demo construction marketplace workflow:

- jobs and bids;
- signed project contracts as workflow records;
- milestone records and evidence review states;
- evidence upload simulation metadata;
- dispute center and peer/admin review;
- contractor risk and admin console views;
- audit logs and request IDs;
- provider/payment/Auth scaffolds;
- mobile/PWA readiness runbooks;
- smart contract architecture drafts and local replay material.

Current scope does not move real money, originate real loans, hold escrow funds, route repayment, settle stablecoins, lock token collateral, or make automated AI final approvals.

## Future Concepts Needing Review

These concepts are architecture targets only until legal/provider approval:

- contract-backed working-capital eligibility after a signed project contract;
- receivables-based underwriting based on project value, milestone schedule, contractor profile, verification, history, and dispute state;
- repayment-first milestone waterfall where approved milestone proceeds can repay a provider-approved balance before contractor net payout;
- escrow-ready payment coordination without autonomous custody;
- stablecoin settlement roadmap;
- token collateral roadmap;
- AI-assisted verification for recommendations only;
- modular smart contract split for authority, project registry, milestone, loan ledger, repayment waterfall, collateral/risk, reputation/review, dispute/override, and audit/compliance.

## Disabled And Blocked Live Actions

The following actions remain blocked:

- live loan origination;
- live escrow custody;
- real repayment routing;
- stablecoin settlement;
- token collateral;
- production provider API calls;
- AI final approval;
- AI payment release;
- AI dispute decision;
- public claims that loans, escrow, repayment routing, stablecoin settlement, token collateral, or compliant finance features are live.

Any unclear or missing written approval defaults to HOLD, REVIEW, or BLOCKED_FOR_LIVE.

## Legal And Provider Classification Questions

Questions for attorney/provider review:

- Is GCSC only software/marketplace infrastructure, or does a proposed flow touch lending, escrow, payment handling, money transmission, credit brokering, servicing, or collection activity?
- Which state-by-state contractor finance, home improvement, consumer protection, or disclosure rules may apply?
- Does contract-backed working capital require UCC filings, assignment of receivables, security interests, lien notices, borrower disclosures, or lender licensing?
- What homeowner protections, cancellation rights, refund rules, dispute rights, or milestone approval rules must be reflected?
- What privacy, retention, audit, adverse-action, and data correction rules apply to contractor scoring and AI-assisted recommendations?
- Which public whitepaper, website, deck, email, social, grant, investor, and provider claims require legal approval before use?

## Finance Provider Review Questions

Questions for a future lender or finance provider:

- Who is the lender of record and who owns underwriting responsibility?
- Which contractor eligibility, verification, license, insurance, bank, tax, dispute, and repayment-history fields are required?
- What borrower terms, APR/fee disclosures, repayment schedule, late-payment treatment, and servicing rules are mandatory?
- Can milestone proceeds be used in a repayment-first waterfall, and who authorizes that allocation?
- How should disputes, partial milestone approvals, refunds, failed payments, overpayments, and chargebacks stop or alter repayment?
- Are fair lending, adverse action, credit reporting, collection, or state licensing rules triggered?

## Escrow And Payment Provider Review Questions

Questions for escrow/payment providers:

- Who holds funds, if anyone, and under what license or provider account?
- Who has release authority for milestone funds?
- How are refunds, chargebacks, payment failures, ACH/cards/wallet rails, and provider disputes handled?
- Can GCSC display escrow-ready states without custody?
- What must be true before any live repayment allocation touches payment rails?
- Which stablecoin or XPR/Metal Pay flows are allowed, restricted, or provider-prohibited?

## Stablecoin And Token Collateral Review Questions

Questions before any stablecoin settlement or token collateral language is used live:

- Which rails and jurisdictions are permitted for stablecoin settlement?
- Who has custody or control of assets?
- What oracle, LTV, valuation, liquidation, pause, dispute, and emergency authority rules are required?
- Do token collateral references create securities, commodities, lending, custody, tax, or accounting concerns?
- Which words must be avoided in public materials until legal/provider review is complete?

## AI Review Questions

AI must stay recommendation-only until approved.

Review questions:

- Which AI outputs can be shown as suggestions versus decisions?
- Who makes final underwriting, milestone approval, payment release, dispute, and collateral decisions?
- What explainability, correction, appeal, audit, and human-review records are required?
- What data may AI process, retain, or share with providers?

## Smart Contract Review Questions

Questions for smart contract/security review:

- Are authority roles separated from frontend, AI, and provider adapters?
- Is multisig or stronger approval required for deploy, upgrade, unpause, provider authorization, and live-money enablement?
- Are there no backdoors: no hidden owner drain, no hidden upgrade path, no arbitrary balance mutation, no dispute bypass, no AI-only final approval, and no contractor self-approval?
- Are audit events append-only and non-secret?
- Are emergency pause and recovery paths defined without moving funds?

## Reviewer Role Separation Matrix

No reviewer role can approve another reviewer role by implication. A legal answer does not activate provider rails, a provider answer does not create legal approval, a security answer does not approve business launch timing, and founder approval does not replace external legal, finance-provider, payment-provider, or security review where those reviews are required.

| Reviewer role | May review | Must not approve alone |
| --- | --- | --- |
| Attorney / legal reviewer | Attorney review may classify legal, lending, escrow, payment, consumer-protection, privacy, disclosure, and public-claim risks. | Live lending, escrow, payment rails, provider commitments, code deployment, or production launch without the matching provider/security/founder records. |
| Finance provider | Finance-provider review may define lender-of-record, underwriting, borrower terms, servicing, repayment, adverse-action, and collection requirements. | Legal classification, escrow custody, payment processor setup, smart contract deployment, or public claims outside provider-approved wording. |
| Escrow/payment provider | Escrow/payment-provider review may define custody, payment rail, chargeback, refund, release, callback, and provider dispute requirements. | Lending approval, borrower terms, legal classification, stablecoin/token collateral handling, or security approval. |
| Security / smart contract reviewer | Security/smart-contract review may approve code safety, authority separation, auditability, pause, upgrade, rollback, and anti-backdoor controls. | Legal compliance, lender/provider terms, payment custody, public launch, or real-money enablement. |
| Founder / owner | Founder approval may approve product scope, business priority, reviewer routing, and external owner actions, but it does not replace legal, finance-provider, payment-provider, or security approval. | Any live loan, escrow, repayment, stablecoin, token collateral, provider, legal/compliance, or public launch claim without the required external review evidence. |

## Reviewer Independence And Conflict Disclosure Boundary

Before a reviewer response can support APPROVE_FOR_NEXT_INTERNAL_STEP, the response record must include reviewer_independence_status, conflict_disclosure, relationship_to_gcsc, compensation_or_referral_interest, reviewed_scope, and evidence_expiration_date.

A reviewer with an undisclosed conflict, sales-only relationship, referral incentive, affiliate interest, investment interest, provider onboarding quota, or unclear independence can still provide input, but the response stays ADVISORY_INPUT_ONLY until founder/legal/provider routing decides the safe use.

Missing independence or conflict fields default to HOLD_FOR_INDEPENDENCE_REVIEW and cannot approve public claims, provider commitments, legal conclusions, live loans, escrow, repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch.

Independence evidence expires when reviewed files, scope, laws, provider terms, product behavior, or live-risk gates change; stale independence evidence must be refreshed before reuse.

## Informal Reviewer Response Non-Approval Boundary

Informal emails, calls, chat replies, verbal notes, calendar discussions, sales demos, or provider marketing statements are not approval.

Only written reviewer responses mapped to reviewer role, reviewed files, decision, required changes, blocked public claims, blocked live actions, follow-up evidence requested, date, and owner can support APPROVE_FOR_NEXT_INTERNAL_STEP.

Ambiguous, partial, outdated, sales-only, non-reviewer, or wrong-role responses default to HOLD or REVISE.

An informal reviewer response must never enable live loan origination, live escrow custody, real repayment routing, stablecoin settlement, token collateral, production provider API calls, public launch, legal conclusions, provider commitments, or compliance claims.

## Reviewer Response Evidence Ledger

Each reviewer response evidence ledger entry must capture response_id, reviewer_role, reviewer_org_or_source, reviewed_file_versions, decision, required_changes, blocked_claims, blocked_live_actions, follow_up_evidence_requested, received_at, owner, and status.

Screenshots, forwarded messages, call notes, meeting transcripts, and sales decks are intake evidence only until a written reviewer response is mapped into the ledger.

Missing reviewer role, missing file version, missing decision, or missing blocked-live-action fields default the ledger entry to HOLD.

A ledger entry must not approve public wording, provider commitments, compliance claims, live loans, escrow, repayment routing, stablecoin settlement, token collateral, production API calls, or public launch unless the matching external approval scope is explicit.

## Reviewer Response Source Authenticity Boundary

Before reviewer response evidence can support internal decisions, record source_channel, sender_identity_status, domain_or_org_match_status, attachment_hashes, reviewed_packet_version, received_at, intake_owner, and authenticity_status.

Unverified sender identity, mismatched domain, forwarded-only evidence, edited attachments, missing packet version, screenshots without source files, or unverifiable meeting notes default to HOLD_FOR_SOURCE_AUTHENTICITY_REVIEW.

Source authenticity review can only create LOCAL_DRAFT_AUTHENTICITY_RECORD and must not approve legal conclusions, provider commitments, public claims, live loans, escrow, repayment routing, stablecoin settlement, token collateral, production API calls, or public launch.

## Reviewer Scope-Bound Response Boundary

Reviewer responses must bind reviewer_role, reviewer_identity_reference, packet_id, packet_version, question_ids_answered, response_channel, response_received_at, scope_limitations, source_files_reviewed, redaction_status, and blocked_next_action before they can support any internal wording, architecture, provider, or implementation change.

Generic approval, sales-call notes, forwarded emails, screenshots, copied chat summaries, stale packets, missing question IDs, unknown reviewer authority, mismatched packet versions, or responses outside the reviewer role default to HOLD_FOR_SCOPE_BOUND_REVIEW and BLOCKED_FOR_LIVE.

Scope-bound reviewer responses can only support internal draft updates; they do not approve public claims, legal advice, provider commitments, live lending, payment handling, escrow release, repayment routing, stablecoin settlement, token collateral, deployment, tester invites, or public launch.

## Cross-Scope Response Triage Rules

If a reviewer response contains conclusions outside reviewer_role, split those items into cross_scope_follow_up_required and keep the original ledger entry in HOLD or REVISE.

Legal-only responses cannot approve lender-of-record terms, escrow custody, payment processor setup, production API calls, smart contract deployment, or public launch timing.

Provider-only responses cannot approve legal classification, compliance claims, securities or lending conclusions, token collateral policy, or public whitepaper wording beyond the provider-approved scope.

Security-only responses cannot approve legal compliance, lender terms, payment custody, provider commitments, production launch, or real-money enablement.

Founder-only responses cannot approve legal conclusions, provider commitments, compliance claims, live money movement, token collateral activation, or production payment rails without matching external reviewer records.

## Reviewer Packet Distribution Boundary

Before sending any reviewer packet, the founder must choose reviewer_role, intended_scope, allowed_files, blocked_files, redaction_status, owner, and response_deadline.

Allowed reviewer packets may include only the listed internal docs, redacted summaries, and non-secret evidence indexes; they must not include the whole repository, `.env`, credentials, raw logs, screenshots, recordings, private customer data, provider credentials, Magic Link URLs, tokens, service-role keys, or database connection strings.

If reviewer_role, intended_scope, redaction_status, or allowed_files are missing, the distribution decision defaults to HOLD_FOR_PACKET_REVIEW.

Reviewer packet distribution is not provider outreach approval, legal advice, public launch approval, production deploy approval, payment-provider setup, live loan approval, escrow approval, stablecoin settlement approval, token collateral approval, or external account authorization.

## Reviewer Packet Redaction Checklist

Before a reviewer packet can move from DRAFT to READY_FOR_FOUNDER_SEND, the owner must complete a redaction checklist for secrets, private customer data, tester artifacts, screenshots, recordings, raw logs, database strings, wallet details, and provider credentials.

Redaction evidence must record packet_id, source_files, redaction_owner, redaction_date, removed_items_summary, remaining_risk_notes, intended_audience, and founder_review_status.

If any source file cannot be redacted confidently, the packet remains HOLD_FOR_REDACTION and must be replaced by a short non-secret summary.

A redacted packet still cannot be sent externally until founder review confirms audience, scope, allowed_files, blocked_files, and response_deadline.

## Audience-Specific Reviewer Packet Map

Each reviewer packet must identify one intended audience: attorney, finance_provider, escrow_payment_provider, security_smart_contract_reviewer, or founder_internal_review.

Attorney packets may receive legal classification questions, public-claim risk notes, privacy/consumer-protection questions, and redacted architecture summaries, but not provider credentials, payment setup instructions, private customer data, or unredacted tester artifacts.

Finance-provider packets may receive eligibility, underwriting, repayment waterfall, servicing, borrower-term, adverse-action, and collection questions, but not legal conclusions, smart contract deployment authority, production payment credentials, or public launch approval requests.

Escrow/payment-provider packets may receive custody, release authority, chargeback, refund, callback, payment rail, and provider dispute questions, but not lender-of-record decisions, token collateral activation, legal conclusions, or AI final-approval authority.

Security/smart-contract reviewer packets may receive module split, authority model, audit event map, anti-backdoor checklist, pause/upgrade/rollback questions, and local replay evidence, but not real private keys, deploy authority, live XPR signatures, provider credentials, or money-movement instructions.

Founder internal review packets may include the full local reading order and go/no-go checklist, but they cannot become external packets until the audience-specific allowed_files, blocked_files, redaction_status, and response_deadline are set.

## Reviewer Packet Version Drift And Resend Boundary

Reviewer packet versions must record packet_id, packet_version, source_commit, source_file_versions, generated_at, intended_audience, sent_at, response_deadline, and superseded_by_packet_id.

If any source file, claim language, blocked-live gate, law/provider term, validator result, or redaction status changes after packet generation, the packet defaults to SUPERSEDED_HOLD and cannot be sent, resent, or used for reviewer approval.

Reviewer responses tied to superseded, stale, or unknown packet versions stay ADVISORY_INPUT_ONLY until the reviewer confirms the updated packet_version in writing.

Resending a reviewer packet requires a resend_reason, delta_summary, updated_redaction_status, founder_review_status, and preserved blocked_files list; resend is not approval for provider outreach, legal conclusions, public launch, production deploy, or live money actions.

## Reviewer Contradiction And Override Escalation Boundary

If two reviewer responses conflict on legal classification, lender-of-record, escrow custody, payment release authority, repayment routing, stablecoin settlement, token collateral, security authority, public wording, or launch readiness, the most restrictive response controls until the conflict is resolved.

Contradiction records must capture conflict_id, conflicting_response_ids, affected_scope, restrictive_default, escalation_owner, required_follow_up_roles, decision_deadline, and current_status.

A founder override can prioritize internal drafting or follow-up order, but it cannot override legal, finance-provider, escrow/payment-provider, security, or provider restrictions into public claims, provider commitments, live loans, escrow, repayment routing, stablecoin settlement, token collateral, production API calls, or public launch.

Missing contradiction records, unresolved reviewer conflicts, or undocumented overrides default to HOLD_FOR_CONFLICT_RESOLUTION and BLOCKED_FOR_LIVE.

## Reviewer Question Intake Sanitization Boundary

Reviewer questions must record question_id, reviewer_role, intended_scope, source_file_versions, redaction_status, private_data_screen_status, live_risk_category, owner, and blocked_live_gate_status before they can enter a reviewer packet.

Questions containing secrets, credentials, private customer data, raw logs, Magic Link URLs, payment data, wallet keys, service-role keys, database strings, or live account instructions default to HOLD_FOR_QUESTION_REDACTION and must be replaced with a non-secret summary.

Question intake must separate legal, finance-provider, escrow/payment-provider, security, and founder-internal scopes; mixed-scope questions require split follow-up items before distribution.

Reviewer question intake can only create LOCAL_DRAFT_REVIEW_QUESTION_RECORD and must not send external messages, contact reviewers, create provider commitments, approve public claims, enable production deploys, or move real money.

## Reviewer Founder Send Decision Gate

REVIEWER_FOUNDER_SEND_DECISION_GATE is a founder-present internal send-readiness decision gate before any legal/provider reviewer packet leaves local preparation.

Before founder send, record packet_id, packet_version, intended_audience, reviewer_role, allowed_files, blocked_files, redaction_status, reviewer_question_ids, response_deadline, owner, latest_check_run, and blocked_next_action.

No attorney outreach, finance-provider outreach, escrow/payment-provider outreach, security reviewer outreach, provider commitment, legal conclusion, public claim, production deploy, live Supabase change, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, or public launch is approved by this gate.

## Founder Evening Legal Provider Review Readiness Record

Use this record during founder-present evening mode to decide whether the legal/provider packet is ready for founder send review, not external outreach or approval.

| Founder Evening Legal Provider Review Field | Required Value |
| --- | --- |
| evening_legal_provider_review_state | READY_FOR_FOUNDER_SEND_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_REDACTION_REVIEW, HOLD_FOR_SCOPE_SPLIT, HOLD_FOR_PACKET_VERSION_REFRESH, or NO_GO |
| evening_legal_provider_review_evidence | Packet ID/version, intended audience, allowed files, blocked files, redaction status, question IDs, latest check run, source commit, or reviewer packet version record |
| evening_legal_provider_review_owner | Founder, Codex-local, redaction owner pending, scope owner pending, packet version owner pending, legal reviewer pending, provider reviewer pending, or HOLD_FOR_OWNER |
| evening_legal_provider_review_blocked_action | Do not contact attorneys, finance providers, escrow/payment providers, security reviewers, create provider commitments, state legal conclusions, publish claims, deploy production, change live Supabase, move money, originate loans, hold escrow, route repayments, settle stablecoins, lock token collateral, or launch publicly from this record |

## Founder Evening Legal Provider Reviewer Handoff Matrix

Use this matrix after the readiness record to decide the next internal reviewer packet owner and state. It is for founder-present packet routing only, not external send approval or legal/provider approval.

| Founder Evening Legal Provider Reviewer Handoff Field | Required Value |
| --- | --- |
| legal_provider_reviewer_handoff_state | READY_FOR_FOUNDER_PACKET_REVIEW, NEEDS_SCOPE_CLARIFICATION, HOLD_FOR_REDACTION_REVIEW, HOLD_FOR_ATTORNEY_REVIEW, HOLD_FOR_FINANCE_PROVIDER_REVIEW, HOLD_FOR_ESCROW_PAYMENT_PROVIDER_REVIEW, or NO_GO |
| legal_provider_reviewer_handoff_evidence | Packet ID/version, intended reviewer role, allowed files, blocked files, redaction status, question IDs, source commit, latest check run, unresolved conflicts, or reviewer packet version record |
| legal_provider_reviewer_handoff_owner | Founder, Codex-local, attorney packet owner pending, finance-provider packet owner pending, escrow/payment-provider packet owner pending, redaction owner pending, scope owner pending, or HOLD_FOR_OWNER |
| legal_provider_reviewer_handoff_blocked_action | Do not treat this matrix as legal advice, attorney approval, finance-provider approval, escrow provider approval, payment-provider approval, lender commitment, underwriting approval, public wording approval, production deploy approval, live loan approval, real escrow approval, repayment routing approval, stablecoin settlement approval, token collateral approval, or external send approval |

## Evidence Packet Index

Primary internal sources for reviewer orientation:

- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-legal-provider-handoff.md`
- `docs/whitepaper-v1-2-contract-backed-loan-finance-provider-handoff.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-readiness-matrix.md`
- `docs/whitepaper-v1-2-contract-backed-loan-implementation-blocker-register.md`
- `docs/whitepaper-v1-2-contract-backed-loan-approval-evidence-template.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`

## Allowed Internal Next Steps

Allowed without live/external action:

- prepare local checklists;
- prepare internal drafts;
- prepare redacted reviewer packets;
- prepare schemas and local-only fixtures;
- run local validators and no-real-money tests;
- record blocked-live gates and review questions.

## Blocked Until Explicit External Approval

Blocked until written founder/legal/provider/security approval and live owner action:

- external account setup or provider commitments;
- live Supabase changes;
- production deploy settings;
- real payment, loan, escrow, repayment, stablecoin, or token collateral flows;
- public launch;
- legal conclusions or compliance claims.

## Founder Handoff

For an attorney or provider, send this packet as a non-secret orientation bundle and ask for written answers. Do not send passwords, API keys, seed phrases, service-role keys, private keys, raw database credentials, private customer data, or unredacted tester artifacts.

Required response format:

- reviewer role;
- reviewed files;
- decision: HOLD, REVISE, or APPROVE_FOR_NEXT_INTERNAL_STEP;
- required changes;
- blocked public claims;
- blocked live actions;
- follow-up evidence requested.

## Required Checks

- `npm run check:whitepaper-v1-2-legal-provider-review-prep`
- `npm run check:legal-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-legal-provider-handoff`
- `npm run check:whitepaper-v1-2-contract-backed-loan-finance-provider-handoff`
- `npm run check:real-status-audit`
- `npm run check`
