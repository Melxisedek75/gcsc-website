# GCSC Whitepaper v1.2 Legal/Provider Review Founder Send Checklist

Status: INTERNAL_FOUNDER_SEND_PREP_ONLY

This checklist is not approval to contact reviewers, not legal advice, not provider approval, and not approval to launch real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production payments, or public launch.

## Purpose

Give the founder a short local checklist for assembling a redacted legal/provider review packet before any attorney, finance provider, escrow/payment provider, security reviewer, or founder-internal reviewer receives material.

## Pre-Send Packet Assembly

Every draft packet must record:

- packet_id;
- intended_audience;
- allowed_files;
- blocked_files;
- source_file_versions;
- redaction_owner;
- redaction_status;
- response_deadline;
- founder_review_status.

Allowed starting files:

- `docs/whitepaper-v1-2-legal-provider-review-executive-brief.md`
- `docs/whitepaper-v1-2-legal-provider-review-prep.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`

## Redaction Gate

Before the packet can leave local review, confirm it contains no secrets, credentials, Magic Link URLs, tokens, service-role keys, private keys, wallet keys, database connection strings, raw logs, screenshots, recordings, private customer data, provider credentials, or unredacted tester artifacts.

If redaction is uncertain, replace the source with a non-secret summary and keep the packet in HOLD_FOR_REDACTION.

## Audience And Scope Gate

Choose exactly one intended audience:

- attorney;
- finance_provider;
- escrow_payment_provider;
- security_smart_contract_reviewer;
- founder_internal_review.

The packet scope must match the intended audience. Mixed legal, finance_provider, escrow_payment_provider, security_smart_contract_reviewer, and founder_internal_review questions must be split into separate packet items before sending.

## Response Request Template

Ask the reviewer for a written response with:

- reviewer_role;
- reviewed_files;
- decision: HOLD, REVISE, or APPROVE_FOR_NEXT_INTERNAL_STEP;
- required_changes;
- blocked_public_claims;
- blocked_live_actions;
- follow_up_evidence_requested.

## Do Not Send

Do not send the whole repository.

Do not send `.env`.

Do not send payment setup instructions.

Do not send real production values.

Do not send provider credentials.

Do not send unredacted tester artifacts.

Do not ask a reviewer to approve real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, production deploys, external account changes, legal conclusions outside their role, or public launch in a casual response.

## Founder Stop Conditions

Founder must stop if a reviewer asks for secrets, account access, live credentials, payment setup, escrow setup, production API calls, loan activation, legal conclusions, or public launch approval.

If any stop condition appears, record a local follow-up note and route it to founder/legal/provider/security review without sending secrets or taking live action.

## Required Checks

```bash
npm run check:whitepaper-v1-2-legal-provider-review-founder-send-checklist
npm run check:whitepaper-v1-2-legal-provider-review-executive-brief
npm run check:whitepaper-v1-2-legal-provider-review-prep
npm run check:real-status-audit
npm run check
```
