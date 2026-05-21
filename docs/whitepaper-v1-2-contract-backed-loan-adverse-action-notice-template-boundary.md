# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Notice Template Boundary

Status: LOCAL_ONLY_NOTICE_TEMPLATE_BOUNDARY. This is not legal advice, not a denial notice, not provider approval, not lender approval, not approval to send notices, not approval to deny real credit, not approval for credit-bureau reporting, and not contractor-facing live copy.

## Purpose

This boundary defines what a local adverse-action notice template may contain before founder, legal/provider, finance-provider, compliance, and technical review. It keeps more-info-needed, held, reduced, and declined working-capital outcomes in placeholder form only, so GCSC can review required fields and process controls without creating final wording, lender obligations, provider obligations, real denials, live notices, credit-bureau reporting, repayment routing, escrow activation, stablecoin settlement, or token collateral actions.

Source documents:

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`

## Status Boundary

Allowed local template states:

- `MORE_INFO_NEEDED_DRAFT`
- `HELD_FOR_REVIEW_DRAFT`
- `REDUCED_AMOUNT_DRAFT`
- `DECLINED_DRAFT`
- `HOLD_FOR_ADVERSE_ACTION_REVIEW`
- `LOCAL_DRAFT_ADVERSE_ACTION_TRACE`
- `BLOCKED_FOR_LIVE_LOAN`

Every state is a local review marker only. It cannot be used to send notices, deny real credit, approve real credit, report to credit bureaus, create legal determinations, create provider obligations, route repayments, activate escrow, settle stablecoins, or lock token collateral.

## Placeholder Template Fields

Every local placeholder template record must preserve these fields without raw applicant personal data:

| Field | Local purpose | Boundary |
| --- | --- | --- |
| `notice_template_version` | Identifies the local placeholder version under review. | No final adverse-action wording. |
| `applicant_profile_id` | References the internal profile without exposing raw personal data in the template packet. | Redacted before legal/provider review. |
| `request_id` | Links the placeholder to a traceable local request. | No external delivery authority. |
| `decision_type` | Records whether the local state is more-info-needed, held, reduced, or declined draft. | No credit decision. |
| `principal_reasons` | Lists draft reason-code references from the taxonomy. | No automated-only AI explanation. |
| `data_sources_used` | Lists local source labels reviewed by humans. | No credit reports or raw sensitive source data. |
| `reviewer_role` | Records who reviewed the placeholder internally. | Human reviewer required. |
| `appeal_window_status` | Marks whether appeal/correction handling is undefined, pending review, or externally approved. | Legal/provider approval required. |
| `delivery_status` | Defaults to local-only and unsent. | No approval to send notices. |
| `retention_status` | Records whether retention rules are pending or reviewed. | Legal/provider approval required. |
| `redaction_status` | Records whether the packet is redacted before sharing. | No secrets or raw applicant personal data. |
| `source_commit` | Links the template packet to a source commit. | Local evidence only. |

## Required Placeholder Sections

Any local placeholder must contain only section labels and review notes until externally approved:

- applicant/request reference placeholder;
- local draft status placeholder;
- draft principal-reason references;
- data-source label references;
- human reviewer trace;
- appeal/correction placeholder;
- delivery and retention placeholder;
- redaction and source evidence placeholder.

No final adverse-action wording, final denial wording, final reduced-amount wording, final APR language, final fee language, repayment promise, escrow instruction, stablecoin instruction, token-collateral instruction, or provider commitment is allowed in this packet.

## Language Boundaries

The local template boundary requires:

- No final adverse-action wording.
- No automated-only AI explanation.
- No APR, fee, repayment, escrow, stablecoin, token collateral, or provider commitment.
- Human reviewer required.
- Legal/provider approval required.
- Finance-provider approval required.
- Founder approval required.

AI risk signals may only be referenced as support-only inputs for human review. They must not be presented as an automated denial reason or a standalone contractor-facing explanation.

## Delivery And Retention Boundary

Before any live delivery, the following must be written and reviewed outside autonomous Codex work:

- allowed delivery method;
- notice timing;
- retention period;
- appeal or correction workflow;
- redaction rules;
- reviewer authority;
- jurisdiction/provider-specific wording.

Until those items are externally approved, every template remains local-only, unsent, and blocked from contractor-facing use.

## Reviewer Approval Boundary

Required approvals before live use:

- Founder approval required for business scope and go/no-go.
- Legal/provider approval required for adverse-action wording, notice timing, delivery, retention, appeal/correction, and jurisdiction/provider boundaries.
- Finance-provider approval required for eligibility, underwriting, APR/fee language, repayment waterfall, provider role, and any lending workflow dependency.
- Human reviewer required for every adverse-action trace before a contractor-facing decision is considered.

Approval records must avoid secrets. Do not send passwords, private keys, API keys, service-role keys, wallet seed phrases, bank data, credit reports, raw applicant personal data, or provider credentials in chat, docs, founder packets, legal packets, provider packets, public wording, grants, investor materials, or screenshots.

## Blocked Live Actions

This boundary must not be used to:

- send notices;
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

- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review`
- `npm run check`
