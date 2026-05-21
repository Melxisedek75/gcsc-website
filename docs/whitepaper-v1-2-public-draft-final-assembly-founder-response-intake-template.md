# Whitepaper v1.2 Public Draft Final Assembly Founder Response Intake Template

Status: LOCAL_ONLY_FOUNDER_RESPONSE_INTAKE_TEMPLATE

## Purpose

This template captures the founder response to the local-only final assembly founder handoff packet. It converts founder feedback into structured internal response fields so Codex can route accepted internal wording direction, local revision requests, held sections, claim-risk notes, redaction notes, and next local action without treating the response as public or live approval.

This template does not approve public publication, does not approve website edits, does not approve external sharing, does not approve deployment, does not approve live Supabase, and does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Linked Inputs

- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Response Fields

- `response_intake_id`: local identifier for the founder response intake record.
- `handoff_packet_id`: founder handoff packet id being answered.
- `source_commit`: source commit or local revision used for the response.
- `founder_response_state`: one allowed response state from this template.
- `accepted_sections`: draft sections accepted for internal wording direction only.
- `revision_requested_sections`: draft sections requiring local-only revision before any later founder review.
- `hold_sections`: draft sections held for claim-risk, redaction, legal/provider, or finance review.
- `claim_risk_notes`: founder notes on product, traction, AI, security, loan, escrow, payment, token, securities, tax, return, legal, provider, or finance claim risk.
- `redaction_notes`: founder notes on private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or secret-looking values.
- `blocked_action_acknowledgement`: confirmation that public, live, legal, money, and external actions remain blocked.
- `latest_check_run`: latest local check evidence reviewed with the response.
- `next_local_action`: next internal local-only action, such as update wording locally, update review notes, hold for legal/provider review, or close the response as internal-only.

## Allowed Response States

- ACCEPT_INTERNAL_WORDING_DIRECTION: founder accepts internal wording direction only.
- REQUEST_LOCAL_REVISION: revise the local draft or review notes before another internal review.
- HOLD_FOR_CLAIM_RISK_REVIEW: hold one or more sections until claim-risk review is complete.
- HOLD_FOR_REDACTION: hold one or more sections until redaction confirmed before sharing.
- HOLD_FOR_LEGAL_PROVIDER_REVIEW: hold one or more sections for legal/provider review before external use.
- PUBLICATION_BLOCKED: publication remains blocked.
- INTERNAL_RESPONSE_ONLY: response is retained as internal local evidence only.

Most restrictive source state wins. If the handoff packet, evidence log, execution queue, review report delta ledger, local change packet, founder wording decision record, draft, or review report has a restrictive state, the founder response intake inherits that state.

## Founder Response Rules

- Founder can approve only internal wording direction.
- Founder response cannot become publication approval.
- No new public claims may be introduced by a response intake record.
- Redaction confirmed before sharing remains mandatory.
- Any response that mentions public release, investors, grants, partners, providers, legal, finance, deployment, live Supabase, payment, loan, escrow, repayment routing, stablecoin settlement, token collateral, XPR signature, app-store, or public launch action must stay blocked unless a separate explicit approved live/external process exists.

## Claim And Redaction Gates

- Stronger product, traction, security, AI, loan, escrow, payment, token, securities, tax, return, legal, provider, or finance claims remain HOLD_FOR_CLAIM_RISK_REVIEW.
- Private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, and secret-looking values must not be pasted into the response intake.
- External-facing excerpts require a separate redaction pass and founder/legal/provider review where applicable.
- The response intake can preserve a hold, request local revision, or accept internal wording direction only.

## Blocked Next Actions

The following actions remain blocked:

- publish
- edit whitepaper.html
- send investor, grant, partner, provider, legal, or finance material
- change live Supabase
- deploy
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch

## Required Checks

- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet`
- `npm run check:whitepaper-v1-2-public-draft`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

This template passes when a founder response can be captured by response intake id, handoff packet id, source commit, allowed response state, accepted sections, revision requested sections, held sections, claim-risk notes, redaction notes, blocked-action acknowledgement, latest check run, and next local action without granting public publication, website edits, external sharing, deployment, live Supabase, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.
