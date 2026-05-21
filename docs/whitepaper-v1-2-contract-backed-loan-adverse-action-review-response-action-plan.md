# GCSC Whitepaper v1.2 Contract-Backed Loan Adverse-Action Review Response Action Plan

Status: LOCAL_ONLY_ADVERSE_ACTION_RESPONSE_ACTION_PLAN

This action plan is not legal advice, not provider approval, not lender approval, not approval to send notices, not approval to deny real credit, not approval for credit-bureau reporting, and not public wording approval.

## Purpose

Turn a routed adverse-action reviewer response into a concrete local-only action plan that can be tracked without implying live credit, notice-delivery, legal, provider, repayment, escrow, stablecoin, token-collateral, deployment, XPR-signature, or public-launch authority.

The action plan exists to preserve the most restrictive response controls and make the next internal step explicit before any internal document revision or next packet uses reviewer feedback.

## Inputs

Use this file only after these local records exist:

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md`

## Action Plan Fields

Each action plan record must include:

| Field | Required Meaning |
| --- | --- |
| `action_plan_id` | Local identifier for this plan |
| `source_response_id` | Intake response being acted on |
| `routing_state` | Final routing state from the response routing page |
| `action_type` | One allowed action type from this file |
| `action_owner` | Internal owner responsible for the local action |
| `source_files` | Files reviewed before the action was created |
| `source_file_versions` | Commit hash, file date, or version label for every source file |
| `required_local_change` | Specific local-only edit or packet step |
| `required_follow_up_evidence` | Evidence needed before the plan can close |
| `approval_evidence_id` | Required when the action relies on an approval claim |
| `manual_checkpoints` | Required human/manual checks before action closeout |
| `blocked_live_actions` | Live, external, legal, money, or public actions still blocked |
| `status` | Current local plan status |
| `due_before` | Internal target date or `NOT_SCHEDULED` |
| `closeout_evidence` | Non-secret proof that the local action was completed or held |

## Allowed Action Types

| Action Type | Meaning | Boundary |
| --- | --- | --- |
| `RECORD_HOLD` | Record why the response remains blocked | No document or packet may rely on the response yet |
| `REQUEST_CLARIFICATION_DRAFT` | Draft a clarification request for founder review | Founder must control any external send |
| `UPDATE_INTERNAL_DOC` | Update a local-only internal doc | No public file, live system, or contractor-facing copy changes |
| `UPDATE_APPROVAL_EVIDENCE` | Add non-secret evidence to the approval template | Does not create approval by itself |
| `PREPARE_NEXT_INTERNAL_PACKET` | Prepare a next internal review packet | Packet remains local-only until founder/external owner action |
| `BLOCK_FOR_FOUNDER_OWNER_REVIEW` | Stop because owner-controlled action is required | No live, legal, provider, money, or public step may proceed |

## Manual Checkpoints

Every action plan must record these checkpoints before closeout:

- `founder_reviews_routing_state`
- `legal_provider_scope_confirmed`
- `finance_provider_scope_confirmed`
- `compliance_scope_confirmed`
- `technical_scope_confirmed`
- `redaction_confirmed`
- `approval_evidence_linked`
- `no_live_authority_confirmed`

If a checkpoint is not applicable, record `NOT_APPLICABLE_WITH_REASON`; do not leave it blank.

## Live Action Blocks

The following remain blocked from this action plan:

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

## Owner Handoff Rules

Use `HOLD_ACTION_PLAN` when routing is incomplete, redaction is incomplete, source versions are unclear, or action ownership is missing.

Use `READY_FOR_LOCAL_DOC_REVISION` only when the action is limited to internal docs and no external/live/public boundary is touched.

Use `READY_FOR_INTERNAL_PACKET_PREP` only when the action prepares a local packet and the packet itself repeats the blocked-live boundaries.

Use `BLOCKED_FOR_FOUNDER_OWNER_REVIEW` when external contact, legal conclusion, provider commitment, account login, live Supabase change, production deploy, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, credit-bureau reporting, adverse-action delivery, XPR signature, or public launch is needed.

Use `CLOSED_LOCAL_ONLY` only after closeout_evidence is non-secret, source-versioned, and confirms no live authority was created.

## Required Linked Files

- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-routing.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-intake-log.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-approval-evidence-template.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-notice-template-boundary.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-legal-provider-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-adverse-action-reason-code-taxonomy.md`

## Required Checks

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-contract-backed-loan-adverse-action-review-response-action-plan
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

Routed adverse-action reviewer responses can now become explicit local action plans with source versions, owners, manual checkpoints, approval-evidence requirements, closeout evidence, and blocked-live actions before any internal revision or packet depends on them.
