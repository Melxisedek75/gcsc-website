# Whitepaper v1.2 Public Draft Final Assembly Local Edit Execution Queue

Status: LOCAL_ONLY_EDIT_EXECUTION_QUEUE

## Purpose

This queue converts an approved internal final assembly local change packet into exact local draft and review report edit items. It keeps each item tied to the review report delta ledger, local change packet, founder wording decision record, final assembly review packet, checklist, plan, draft, and review report before any wording is applied.

This queue does not approve public publication, does not approve website edits, does not approve external sharing, does not approve deployment, does not approve live Supabase, and does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Linked Inputs

- `docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-plan.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Queue Entry Fields

- `queue_item_id`: local identifier for the edit queue item.
- `change_packet_id`: local change packet that authorizes internal wording direction only.
- `delta_ledger_id`: review report delta ledger entry paired with this edit.
- `draft_section`: exact local draft section to edit.
- `review_report_section`: exact review report section to update with the paired delta.
- `edit_type`: wording cleanup, claim-softening, source alignment, redaction note, or blocked-action note.
- `source_before_summary`: summary of current draft and review report wording.
- `local_after_summary`: summary of intended local-only wording and review report delta.
- `claim_risk_delta`: claim risk added, reduced, or unchanged.
- `redaction_delta`: redaction requirement added, reduced, or unchanged.
- `blocked_action_delta`: blocked action note added, reduced, or unchanged.
- `latest_check_run`: latest local check evidence before execution.
- `owner`: internal owner responsible for applying or reviewing the local edit.

## Allowed Queue States

- READY_FOR_LOCAL_EDIT: all linked inputs allow local edit preparation.
- APPLY_LOCAL_DRAFT_EDIT: apply only to the local public draft markdown file.
- APPLY_REVIEW_REPORT_DELTA_LOCAL_ONLY: apply only to the local review report and delta ledger.
- REVISE_QUEUE_ITEM_LOCAL_ONLY: revise this queue item before any edit.
- HOLD_FOR_FOUNDER_REVIEW: wait for founder review of wording direction.
- HOLD_FOR_CLAIM_RISK_REVIEW: wait for claim-risk review.
- HOLD_FOR_REDACTION: wait until redaction confirmed before sharing.
- HOLD_FOR_LEGAL_PROVIDER_REVIEW: wait for legal/provider review before external use.
- PUBLICATION_BLOCKED: public publication remains blocked.
- INTERNAL_QUEUE_ONLY: queue item is planning-only and cannot change public-facing material.

Most restrictive source state wins. If the review report delta ledger, local change packet, founder wording decision record, review packet, checklist, plan, draft, or review report has a restrictive state, the queue item inherits that state.

## Execution Rules

- Draft edit and review report delta must be paired.
- Local edit queue cannot touch website files, deployment files, live Supabase settings, external account settings, payment systems, loan systems, escrow systems, repayment routing, stablecoin settlement, token collateral, XPR signing flows, app-store material, or launch material.
- The local draft edit must stay inside the exact `draft_section` named in the queue item.
- The local review report update must stay inside the exact `review_report_section` named in the queue item.
- If either side of the pair cannot be applied in the same scoped local change, the queue item must stay REVISE_QUEUE_ITEM_LOCAL_ONLY or HOLD_FOR_FOUNDER_REVIEW.

## Claim And Redaction Gates

- No new public claims may be introduced by this queue.
- Any stronger product, traction, security, AI, loan, escrow, payment, token, securities, tax, return, legal, provider, or finance claim must stay HOLD_FOR_CLAIM_RISK_REVIEW.
- Redaction confirmed before sharing remains mandatory.
- Private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, and secret-looking values must not appear in the queue.

## Blocked Next Actions

The following actions remain blocked:

- publish
- edit whitepaper.html
- send investor, grant, partner, provider, legal, or finance material
- change live Supabase
- deploy
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch

## Required Checks

- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-plan`
- `npm run check:whitepaper-v1-2-public-draft`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

This queue passes when each local final assembly edit item links to the local change packet and review report delta ledger, exact draft and review report sections are named, paired local edits are required, most restrictive source state wins, claim and redaction gates remain active, website files cannot be touched, and publication, website edits, external sharing, deployment, live Supabase, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, and public launch remain blocked.
