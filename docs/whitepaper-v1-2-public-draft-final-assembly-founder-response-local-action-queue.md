# Whitepaper v1.2 Public Draft Final Assembly Founder Response Local Action Queue

Status: LOCAL_ONLY_FOUNDER_RESPONSE_LOCAL_ACTION_QUEUE

## Purpose

This queue converts the founder response routing checklist into specific local-only action records for final assembly work. It defines which internal draft wording updates, review-report note updates, local revisions, claim-risk holds, redaction holds, legal/provider holds, or internal closeout actions may be queued without executing public, live, legal, money, or external actions.

This queue does not approve public publication, does not approve website edits, does not approve external sharing, does not approve deployment, does not approve live Supabase, and does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Linked Inputs

- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Queue Fields

- `local_action_id`: local identifier for the queued action.
- `routing_record_id`: routing checklist record that produced this queued action.
- `response_intake_id`: founder response intake record that produced the routing record.
- `source_commit`: source commit or local revision used for queueing.
- `local_action_state`: one allowed local action state from this queue.
- `target_document`: local document allowed to receive the action, limited to internal docs.
- `target_section`: exact section or review note affected by the queued action.
- `action_summary`: concise local-only action to perform.
- `claim_risk_gate`: claim-risk gate required before the action can move beyond local wording or notes.
- `redaction_gate`: redaction gate required before any material can be shared.
- `blocked_action_acknowledgement`: confirmation that public, live, legal, money, and external actions remain blocked.
- `required_check`: validator or full check required after the local action.
- `latest_check_run`: latest local check evidence before the action is queued.
- `next_local_action`: next internal local-only action, if any.

## Allowed Local Action States

- QUEUE_INTERNAL_DRAFT_WORDING_UPDATE: queue a local internal draft wording update only.
- QUEUE_REVIEW_REPORT_NOTE_UPDATE: queue a local review-report note update only.
- QUEUE_LOCAL_REVISION: queue local revision before another internal review.
- QUEUE_CLAIM_RISK_HOLD: keep the item held for claim-risk review.
- QUEUE_REDACTION_HOLD: keep the item held for redaction review.
- QUEUE_LEGAL_PROVIDER_HOLD: keep the item held for legal/provider review.
- QUEUE_INTERNAL_CLOSEOUT_ONLY: close the item as internal-only evidence.

Most restrictive source state wins. If the routing checklist, response intake, handoff packet, evidence log, execution queue, review report delta ledger, draft, or review report has a restrictive state, the local action queue inherits that state.

## Queue Rules

- Founder can approve only internal wording direction.
- Local action queue cannot become publication approval.
- Queued action does not execute automatically.
- No new public claims may be introduced by a queued action.
- Redaction confirmed before sharing remains mandatory.
- Local wording updates may target only internal draft material or review notes and must not edit `whitepaper.html`.
- Any queued item involving public release, investors, grants, partners, providers, legal, finance, deployment, live Supabase, payment, loan, escrow, repayment routing, stablecoin settlement, token collateral, XPR signature, app-store, or public launch action stays blocked.

## Claim And Redaction Gates

- Product, traction, security, AI, loan, escrow, payment, token, securities, tax, return, legal, provider, or finance claim changes require QUEUE_CLAIM_RISK_HOLD unless already held more strictly.
- Private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, and secret-looking values require QUEUE_REDACTION_HOLD.
- External-facing excerpts require a separate redaction pass and founder/legal/provider review where applicable.
- Internal closeout may only record local evidence and cannot authorize public use.

## Blocked Next Actions

The following actions remain blocked:

- publish
- edit whitepaper.html
- send investor, grant, partner, provider, legal, or finance material
- change live Supabase
- deploy
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch

## Required Checks

- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-local-action-queue`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger`
- `npm run check:whitepaper-v1-2-public-draft`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

This queue passes when founder response routing can be translated into local action id, routing record id, response intake id, source commit, local action state, target document, target section, action summary, claim-risk gate, redaction gate, blocked-action acknowledgement, required check, latest check run, and next local action without granting public publication, website edits, external sharing, deployment, live Supabase, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.
