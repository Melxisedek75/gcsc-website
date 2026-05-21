# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Reason-Code Taxonomy

Status: LOCAL_ONLY_REASON_CODE_TAXONOMY. This is not legal advice, not a denial notice, not provider approval, not lender approval, not approval to deny real credit, not approval to send notices, and not approval for credit-bureau reporting.

## Purpose

This taxonomy gives founder, legal/provider, finance-provider, compliance, and technical reviewers a local draft structure for adverse-action reason codes. It turns held, reduced, declined, and more-info-needed working-capital outcomes into reviewable categories without creating contractor-facing live copy, real denials, provider commitments, credit-bureau reporting, repayment routing, escrow, stablecoin settlement, or token collateral actions.

Source documents:

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`

## Status Boundaries

Allowed local statuses:

- `MORE_INFO_NEEDED_DRAFT`
- `HELD_FOR_REVIEW_DRAFT`
- `REDUCED_AMOUNT_DRAFT`
- `DECLINED_DRAFT`
- `HOLD_FOR_ADVERSE_ACTION_REVIEW`
- `LOCAL_DRAFT_ADVERSE_ACTION_TRACE`
- `BLOCKED_FOR_LIVE_LOAN`

Every status remains internal until founder/legal/provider review required evidence exists.

## Local Draft Reason Codes

| Reason code | Local draft meaning | Required review boundary |
| --- | --- | --- |
| `MISSING_IDENTITY_OR_BUSINESS_VERIFICATION` | Identity, ownership, EIN/business profile, or contractor account binding evidence is missing or stale. | Human reviewer confirms whether this can be used in notices. |
| `MISSING_LICENSE_OR_INSURANCE_VERIFICATION` | License, insurance, or compliance evidence is missing, expired, unclear, or mismatched. | Legal/provider reviewer confirms permitted wording by jurisdiction and provider role. |
| `INSUFFICIENT_PROJECT_CONTRACT_EVIDENCE` | Signed contract, accepted bid, scope, milestone schedule, owner confirmation, or contract amount evidence is incomplete. | Founder/legal/provider review confirms this is an evidence request, not a legal collateral decision. |
| `UNVERIFIED_OWNER_ACCEPTANCE` | Owner acceptance, work completion, punch-list, photo/video, or dispute-window evidence is missing or unresolved. | Reviewer confirms no escrow release, repayment routing, or legal acceptance is implied. |
| `OPEN_DISPUTE_OR_UNRESOLVED_EVIDENCE` | Active dispute, unresolved evidence, contradictory records, or open dispute window blocks local working-capital review. | Human/legal/provider review required before any applicant-facing explanation. |
| `MATERIAL_DRAW_EVIDENCE_INCOMPLETE` | Material quote, vendor, purchase order, receipt, invoice, budget-line, owner confirmation, or contractor acknowledgement evidence is missing. | Reviewer confirms this is a draw-evidence hold only. |
| `PROVIDER_TERMS_MISSING_OR_EXPIRED` | APR/fee range, repayment priority, provider role, expiration, or reviewed-file evidence is missing, expired, or superseded. | Provider terms must be revalidated before any eligibility or notice use. |
| `REPAYMENT_WATERFALL_DISCLOSURE_INCOMPLETE` | Borrower document, consent, fee/APR disclosure, or repayment waterfall disclosure is missing or unclear. | Legal/provider review required before public or contractor-facing use. |
| `OUTSTANDING_EXPOSURE_REVIEW_REQUIRED` | Active requests, outstanding balances, project concentration, or risk exposure require human review. | Finance-provider and legal/provider review required; no automatic denial. |
| `AI_SIGNAL_REQUIRES_HUMAN_REVIEW` | AI recommendation record flags risk, inconsistency, or missing data. | No automated-only AI reason; AI signal is support-only and must route to human review. |

## Data Source Mapping

Each local reason-code record must preserve:

- `data_sources_used`
- `principal_reasons`
- `reviewer_role`
- `notice_template_version`
- `appeal_window_status`
- `redaction_status`
- `source_commit`

Allowed local source labels before external review:

- identity/business verification record;
- license/insurance verification record;
- project contract and milestone evidence;
- owner acceptance or dispute-window evidence;
- draw evidence or vendor evidence;
- provider term record;
- borrower document and consent record;
- AI recommendation record.

## Notice Template Boundary

Every notice template remains a placeholder until approved in writing by the required reviewers.

Required boundaries:

- No contractor-facing live copy.
- No automatic denial.
- No automated-only AI reason.
- Founder/legal/provider review required before any notice template, reason code, delivery method, appeal window, correction route, retention period, or external packet uses this taxonomy.

## Escalation And Review

Escalate to founder/legal/provider review when:

- a reason code could imply a legal conclusion;
- a reason code could imply a lender, broker, underwriter, payment-provider, escrow, or servicer role;
- a reason code uses credit, payment, identity, license, insurance, dispute, repayment, AI, or provider data;
- a reviewer asks for jurisdiction-specific wording;
- a draft would leave local-only review.

## Blocked Live Actions

This taxonomy must not be used to:

- send denial notices;
- deny real credit;
- approve real credit;
- report to credit bureaus;
- create legal determinations;
- route repayments;
- activate escrow;
- settle stablecoins;
- lock token collateral;
- create provider obligations.

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-technical-requirements`
- `npm run check`
