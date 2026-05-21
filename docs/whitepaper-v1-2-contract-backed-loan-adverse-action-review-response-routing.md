# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Routing

Status: LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_ROUTING

This routing page is not legal advice, not provider approval, not lender approval, and not approval for live adverse-action operations.

## Purpose

Convert redacted adverse-action reviewer response intake records into one local-only routing decision before any internal contract-backed loan, notice-template, reason-code, approval-evidence, or public wording work relies on those responses.

The goal is to keep every response role-scoped, source-versioned, conflict-aware, tied to approval evidence when it claims approval, and blocked from live/legal/money action until the founder and matching reviewer explicitly control the next step.

## What This Does Not Approve

This routing does not approve contractor-facing notices.

This routing does not approve adverse-action delivery.

This routing does not approve real credit denial.

This routing does not approve real credit approval.

This routing does not approve credit-bureau reporting.

This routing does not approve public claims.

This routing does not approve live loans, real escrow, repayment routing, stablecoin settlement, token collateral, production payments, provider API calls, production deploys, XPR signatures, or public launch.

## Source Documents

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md`

## Routing States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| `HOLD_FOR_INTAKE_COMPLETION` | Required response metadata is missing | Complete the local intake record |
| `HOLD_FOR_SCOPE_SPLIT` | Response mixes reviewer roles or reaches outside its scope | Split into separate role-scoped records |
| `HOLD_FOR_REDACTION` | Private, secret, raw-log, screenshot, credit-report, wallet, or credential risk exists | Store only a redacted summary |
| `HOLD_FOR_CONFLICT_RESOLUTION` | Reviewer responses conflict or create ambiguity | Keep the most restrictive response controls and request clarification |
| `HOLD_FOR_APPROVAL_EVIDENCE` | Response claims approval without linked approval evidence | Create or complete the local approval evidence record |
| `READY_FOR_INTERNAL_REVISION` | Required changes are local-only and do not imply live action | Update tracked internal docs and run validators |
| `READY_FOR_NEXT_INTERNAL_STEP` | Same-scope reviewer response can support the next internal review packet | Prepare the next local packet only |
| `BLOCKED_FOR_FOUNDER_OWNER_REVIEW` | Next step touches external, live, legal, provider, account, deployment, money, credit-bureau, notice-delivery, or public-launch boundaries | Stop for founder-controlled owner action |

APPROVE_FOR_NEXT_INTERNAL_STEP remains same-scope only. It cannot approve another reviewer role, contractor-facing notices, real credit decisions, credit-bureau reporting, legal conclusions, provider commitments, repayment routing, escrow custody, token collateral, production deployment, or public launch.

## Role-Specific Allowed Use

| Reviewer Role | May Support Internally | Cannot Approve |
| --- | --- | --- |
| `founder` | Priority, sequencing, internal product direction, and owner-controlled HOLD/next-step decisions | Legal/provider approval, lender approval, adverse-action delivery, public claims, money movement |
| `legal_provider` | Legal issue list, notice-template review questions, correction/appeal boundaries, retention/redaction questions | Lender/provider setup, underwriting terms, escrow custody, payment rails, token collateral, deployment, public launch |
| `finance_provider` | Loan eligibility, underwriting, servicing, repayment-waterfall, adverse-action trigger, and provider role requirements | Legal conclusions, notice delivery, credit-bureau reporting, escrow custody, token collateral, deployment, public launch |
| `compliance_reviewer` | Internal compliance checklist items, data-source labels, retention questions, reviewer-authority gaps | Legal conclusions, finance terms, provider commitments, live notices, public claims |
| `human_reviewer` | Manual QA notes, missing evidence flags, response clarity, source-version checks | Legal/provider/lender approval, live actions, public wording approval |
| `technical_reviewer` | Validator, audit trail, role/scope, redaction, local workflow, and blocked-live implementation requirements | Legal conclusions, finance terms, notice delivery, provider commitments, money movement |

## Required Evidence Before Routing

Every routed response must record:

- response_id;
- reviewer_role;
- reviewed_files;
- reviewed_file_versions;
- decision;
- required_changes;
- approved_scope;
- blocked_public_claims;
- blocked_live_actions;
- follow_up_evidence_requested;
- redaction_status;
- routing_owner;
- next_internal_action;
- approval_evidence_id when the response claims approval.

## Automatic HOLD Rules

Any missing response_id, reviewer_role, reviewed_file_versions, decision, approved_scope, blocked_public_claims, blocked_live_actions, redaction_status, routing_owner, or next_internal_action defaults to HOLD_FOR_INTAKE_COMPLETION.

Any mixed founder, legal, finance-provider, compliance, technical, payment, lending, custody, token, credit-bureau, or public-claim conclusion defaults to HOLD_FOR_SCOPE_SPLIT.

Any private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, raw reviewer emails, credit reports, applicant personal data, or secret-looking value defaults to HOLD_FOR_REDACTION.

Any conflicting reviewer response defaults to HOLD_FOR_CONFLICT_RESOLUTION.

Any response that claims approval but lacks a linked approval_evidence_id defaults to HOLD_FOR_APPROVAL_EVIDENCE.

Any next step that needs external contact, legal conclusion, provider commitment, account login, live Supabase change, production deploy, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, credit-bureau reporting, adverse-action delivery, XPR signature, or public launch defaults to BLOCKED_FOR_FOUNDER_OWNER_REVIEW.

## Founder Next-Step Summary

Use this routing page after an adverse-action reviewer response has already been captured in the intake log.

Safe local next steps:

- revise internal notice-template wording;
- revise internal reason-code labels;
- update the approval evidence record;
- update the legal/provider review packet;
- prepare the next internal packet;
- record a HOLD reason;
- list follow-up evidence needed.

Blocked next steps:

- send notices;
- deny real credit;
- approve real credit;
- report to credit bureaus;
- create legal determinations;
- route repayments;
- activate escrow;
- settle stablecoins;
- lock token collateral;
- create provider obligations;
- change public files;
- deploy or change live Supabase;
- enable payments, loans, XPR signatures, or public launch.

## Required Checks

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy
npm run check:real-status-audit
npm run check
```

## Acceptance Check

Future adverse-action reviewer responses can be routed into role-scoped local next steps or explicit HOLD states before any internal revision relies on them, while contractor-facing notices, real credit decisions, credit-bureau reporting, provider obligations, repayment routing, escrow, stablecoin, token-collateral, payment, XPR-signature, public-claim, and public-launch actions remain blocked.
