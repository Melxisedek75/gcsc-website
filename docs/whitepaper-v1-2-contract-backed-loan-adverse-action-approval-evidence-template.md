# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Approval Evidence Template

Status: LOCAL_ONLY_ADVERSE_ACTION_APPROVAL_EVIDENCE. This is not legal advice, not a denial notice, not provider approval, not lender approval, not approval to send notices, not approval to deny real credit, not approval for credit-bureau reporting, and not contractor-facing live copy.

## Purpose

This template records non-secret approval evidence for adverse-action notice templates, reason-code taxonomy, reviewer authority, delivery, retention, appeal/correction, and redaction boundaries. It lets founder, legal/provider, finance-provider, compliance, human reviewer, and technical reviewer notes be tracked without turning review evidence into live notices, real denials, credit-bureau reporting, repayment routing, escrow activation, stablecoin settlement, token collateral, provider obligations, or public claims.

## Evidence Record

| Field | Entry |
| --- | --- |
| Evidence ID | TBD_LOCAL_ONLY |
| Evidence date | TBD_LOCAL_ONLY |
| Source file | `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md` |
| Source commit | TBD_LOCAL_ONLY |
| Latest check run | `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template` |
| Reviewer role | Founder, legal/provider, finance-provider, compliance reviewer, human reviewer, or technical reviewer |
| Reviewer decision | APPROVED, REVISION_REQUIRED, REJECTED, or HOLD |
| Reviewed artifact | Notice template boundary, legal/provider review packet, reason-code taxonomy, data-source labels, delivery rules, retention rules, appeal/correction rules, or redaction rules |
| Notice template version | TBD_LOCAL_ONLY |
| Reason-code taxonomy version | TBD_LOCAL_ONLY |
| Decision type scope | MORE_INFO_NEEDED_DRAFT, HELD_FOR_REVIEW_DRAFT, REDUCED_AMOUNT_DRAFT, DECLINED_DRAFT, HOLD_FOR_ADVERSE_ACTION_REVIEW, LOCAL_DRAFT_ADVERSE_ACTION_TRACE, or BLOCKED_FOR_LIVE_LOAN |
| Principal reasons reviewed | TBD_LOCAL_ONLY |
| Data sources reviewed | TBD_LOCAL_ONLY |
| Delivery status reviewed | LOCAL_ONLY_UNSENT unless externally approved |
| Retention status reviewed | HOLD unless externally approved |
| Appeal/correction status reviewed | HOLD unless externally approved |
| Redaction status reviewed | REDACTED_REQUIRED before sharing |
| Public-use status | BLOCKED unless founder/legal/provider approve public wording separately |
| Live-use status | BLOCKED unless founder/legal/provider/finance/provider/technical gates approve outside autonomous mode |

## Required Approval Roles

Required approval roles before any live use:

- Founder approval required for business scope and go/no-go.
- Legal/provider approval required for adverse-action wording, notice timing, delivery, retention, appeal/correction, jurisdiction/provider boundaries, and credit-bureau boundaries.
- Finance-provider approval required for lending role, underwriting dependency, APR/fee references, repayment waterfall, and provider process boundaries.
- Human reviewer required for every adverse-action trace before any contractor-facing decision is considered.
- Compliance reviewer required for data-source labels, redaction, retention, appeal/correction, and evidence-sharing limits.
- Technical reviewer required for source file, source commit, latest check run, request traceability, and no-secret evidence handling.

## Default HOLD Rules

If any required approval field is missing or unclear, the decision remains HOLD.

HOLD blocks:

- contractor-facing notice wording;
- real credit decision;
- credit-bureau reporting;
- provider obligation;
- repayment routing;
- escrow activation;
- stablecoin settlement;
- token collateral.

No HOLD evidence can be interpreted as approval to send notices, deny real credit, approve real credit, report to credit bureaus, create legal determinations, route repayments, activate escrow, settle stablecoins, lock token collateral, create provider obligations, or publish contractor-facing copy.

## Safe Evidence Rules

- Do not record passwords, private keys, API keys, service-role keys, wallet seed phrases, bank data, credit reports, raw applicant personal data, provider credentials, Magic Link URLs, unredacted screenshots, database connection strings, payment credentials, or live provider logs.
- Keep reviewer notes concise, redacted, and tied to local source files.
- Keep public-use status BLOCKED unless a separate public-use gate approves exact wording.
- Keep live-use status BLOCKED unless founder, legal/provider, finance-provider, compliance, technical, Auth/RLS, payment/provider, and production gates approve it outside autonomous Codex work.
- Keep AI signals support-only and never treat AI output as automated-only adverse-action explanation or denial authority.

## Blocked Live Actions

This evidence template must not be used to:

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

## Required Linked Files

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md`

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy`
- `npm run check`
