# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Intake Log

Status: LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_INTAKE. This is not legal advice, not provider approval, not lender approval, not a denial notice, not approval to send notices, not approval to deny real credit, not approval for credit-bureau reporting, and not contractor-facing live copy.

## Purpose

This log gives the founder one local-only format for recording adverse-action reviewer responses after the legal/provider, finance-provider, compliance, human-review, founder, or technical review packet is shared outside autonomous Codex work. It keeps responses role-scoped, source-versioned, redacted, HOLD-defaulted, and blocked from contractor-facing notices, real credit decisions, credit-bureau reporting, provider obligations, repayment routing, escrow activation, stablecoin settlement, token collateral, or public claims.

## Intake Record Fields

Every reviewer response intake record must capture:

- response_id;
- reviewer_role;
- reviewer_org_or_source;
- received_at;
- reviewed_files;
- reviewed_file_versions;
- decision;
- required_changes;
- approved_scope;
- blocked_public_claims;
- blocked_live_actions;
- follow_up_evidence_requested;
- redaction_status;
- owner;
- status.

Missing fields default the record to HOLD_FOR_INTAKE_COMPLETION.

## Allowed Response Decisions

Use only these decision values:

- HOLD;
- REVISE;
- APPROVE_FOR_NEXT_INTERNAL_STEP;
- ADVISORY_INPUT_ONLY.

APPROVE_FOR_NEXT_INTERNAL_STEP only means the recorded response can support the next internal review step for that same reviewer_role and approved_scope. It does not approve contractor-facing notices, denial notices, real credit decisions, credit-bureau reporting, provider obligations, repayment routing, escrow activation, stablecoin settlement, token collateral, public claims, or production release.

## Scope And Role Check

Classify every response into exactly one reviewer_role:

- founder;
- legal_provider;
- finance_provider;
- compliance_reviewer;
- human_reviewer;
- technical_reviewer.

The reviewer_role must match reviewed_files, reviewed_file_versions, decision, approved_scope, required_changes, blocked_public_claims, blocked_live_actions, follow_up_evidence_requested, redaction_status, owner, and status.

Legal_provider responses cannot approve finance_provider, technical, production, repayment routing, escrow, stablecoin, token collateral, or public launch scope.

Finance_provider responses cannot approve legal wording, jurisdiction handling, credit-bureau reporting, compliance redaction, escrow custody, token collateral, security, deployment, or public launch scope.

Compliance_reviewer responses cannot approve legal conclusions, lender/provider obligations, APR/fee terms, repayment routing, escrow custody, token collateral, deployment, or public launch scope.

Human_reviewer responses can confirm trace quality and reason-code review, but cannot replace legal_provider, finance_provider, compliance_reviewer, technical_reviewer, or founder approval.

Technical_reviewer responses can confirm source files, source commits, latest check runs, request traceability, and no-secret handling, but cannot approve legal, lender, provider, repayment, escrow, stablecoin, token collateral, credit-bureau, or public wording scope.

Founder responses can route and prioritize internal work, but cannot replace legal/provider/finance/compliance/technical written approval for external or live-risk actions.

If a response mixes scopes or reaches outside the reviewer_role, wrong-role conclusions stay HOLD_FOR_SCOPE_SPLIT until split follow-up is recorded.

## Claim And Live-Action Hold

Contractor-facing notices, real credit decisions, credit-bureau reporting, provider obligations, repayment routing, escrow activation, stablecoin settlement, token collateral, public claims, production provider API calls, production deploys, and public launch remain blocked unless the matching approval scope is explicit and externally approved outside autonomous Codex work.

If a reviewer says "looks good" without reviewed_file_versions, approved_scope, blocked_public_claims, blocked_live_actions, redaction_status, and required_changes, store the response as ADVISORY_INPUT_ONLY.

If reviewers disagree, the most restrictive response controls until contradiction follow-up is recorded.

This log must not be used to send notices, deny real credit, approve real credit, report to credit bureaus, create legal determinations, route repayments, activate escrow, settle stablecoins, lock token collateral, create provider obligations, publish contractor-facing copy, or approve public claims.

## Follow-Up Routing

Route follow-up by status:

- HOLD_FOR_INTAKE_COMPLETION: missing required intake fields;
- HOLD_FOR_SCOPE_SPLIT: mixed reviewer roles or wrong-role conclusions;
- HOLD_FOR_REDACTION: unsafe private data or secret-looking content was included;
- HOLD_FOR_CONFLICT_RESOLUTION: reviewer responses conflict;
- READY_FOR_INTERNAL_REVISION: required_changes are clear and local-only;
- READY_FOR_NEXT_INTERNAL_STEP: matching approved_scope is explicit and no live action is implied.

Any follow-up that asks for secrets, account access, live credentials, production payment setup, escrow setup, legal conclusions outside the reviewer role, loan activation, credit-bureau reporting, token collateral activation, deployment changes, external account actions, or public launch approval remains BLOCKED_FOR_FOUNDER_OWNER_REVIEW.

## Secret And Private Data Handling

Secrets, credentials, Magic Link URLs, tokens, service-role keys, private keys, wallet keys, database connection strings, payment data, raw logs, screenshots, recordings, credit reports, raw applicant personal data, provider credentials, and private customer data must be removed or summarized before the response can be stored or shared.

When a reviewer response includes unsafe material, record only a redacted summary, owner, received_at, reviewer_role, affected reviewed_files, and the reason the raw response is not stored in the packet.

Do not paste raw reviewer emails. Do not paste raw chat transcripts. Do not paste raw screenshots. Do not paste customer data. Do not paste production URLs with tokens. Do not paste provider credentials. Do not paste wallet details. Do not paste account identifiers into this log.

## Required Linked Files

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md`

## Required Checks

- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy`
- `npm run check`
