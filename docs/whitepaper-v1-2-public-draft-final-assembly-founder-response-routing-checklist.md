# Whitepaper v1.2 Public Draft Final Assembly Founder Response Routing Checklist

Status: LOCAL_ONLY_FOUNDER_RESPONSE_ROUTING_CHECKLIST

## Purpose

This checklist routes a founder response intake record into the next safe internal path for final assembly work. It separates accepted internal wording direction, local revision requests, held sections, claim-risk review, redaction review, legal/provider review, and internal closeout so the response can be handled without implying external or live approval.

This checklist does not approve public publication, does not approve website edits, does not approve external sharing, does not approve deployment, does not approve live Supabase, and does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Linked Inputs

- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-response-intake-template.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-handoff-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-evidence-log.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-edit-execution-queue.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-review-report-delta-ledger.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-local-change-packet.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Routing Fields

- `routing_record_id`: local identifier for the routing decision.
- `response_intake_id`: founder response intake record being routed.
- `handoff_packet_id`: founder handoff packet that produced the response.
- `source_commit`: source commit or local revision reviewed.
- `founder_response_state`: response state from the intake template.
- `route_owner`: local owner responsible for the next internal step.
- `route_reason`: reason the response is routed to wording update, local revision, claim-risk review, redaction review, legal/provider review, publication-blocked, or internal closeout.
- `accepted_sections_route`: accepted sections routed only to local wording update.
- `revision_sections_route`: sections routed to local revision.
- `hold_sections_route`: sections routed to claim-risk, redaction, legal/provider, or publication-blocked hold.
- `claim_risk_route`: claim-risk routing notes and required reviewer type.
- `redaction_route`: redaction routing notes and required cleanup before any sharing.
- `blocked_action_acknowledgement`: confirmation that public, live, legal, money, and external actions remain blocked.
- `latest_check_run`: latest local check evidence used for routing.
- `next_local_action`: one local-only action to perform next.

## Routing States

- ROUTE_TO_LOCAL_WORDING_UPDATE: apply accepted internal wording direction locally only.
- ROUTE_TO_LOCAL_REVISION: revise local draft or review notes before another internal review.
- ROUTE_TO_CLAIM_RISK_REVIEW: hold and route to claim-risk review.
- ROUTE_TO_REDACTION_REVIEW: hold and route to redaction review.
- ROUTE_TO_LEGAL_PROVIDER_REVIEW: hold for legal/provider review before external use.
- ROUTE_TO_PUBLICATION_BLOCKED: keep publication blocked.
- ROUTE_TO_INTERNAL_CLOSEOUT_ONLY: close the response as internal-only evidence.

Most restrictive source state wins. If the response intake, handoff packet, evidence log, execution queue, review report delta ledger, local change packet, draft, or review report has a restrictive state, the routing checklist inherits that state.

## Routing Rules

- Founder can approve only internal wording direction.
- Founder response routing cannot become publication approval.
- Route does not execute changes automatically.
- No new public claims may be introduced by routing.
- Redaction confirmed before sharing remains mandatory.
- Any route touching public release, investors, grants, partners, providers, legal, finance, deployment, live Supabase, payment, loan, escrow, repayment routing, stablecoin settlement, token collateral, XPR signature, app-store, or public launch action stays blocked until a separate explicit live/external approval process exists.

## Claim And Redaction Gates

- Product, traction, security, AI, loan, escrow, payment, token, securities, tax, return, legal, provider, or finance claim changes route to ROUTE_TO_CLAIM_RISK_REVIEW unless already held more strictly.
- Private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, and secret-looking values route to ROUTE_TO_REDACTION_REVIEW.
- Any external-facing wording route must preserve the publication block and require separate founder/legal/provider review where applicable.
- Local wording updates may only update internal draft material or review notes and must not edit `whitepaper.html`.

## Blocked Next Actions

The following actions remain blocked:

- publish
- edit whitepaper.html
- send investor, grant, partner, provider, legal, or finance material
- change live Supabase
- deploy
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch

## Required Checks

- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-response-routing-checklist`
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

This checklist passes when a founder response can be routed by routing record id, response intake id, handoff packet id, source commit, founder response state, route owner, route reason, accepted sections route, revision sections route, hold sections route, claim-risk route, redaction route, blocked-action acknowledgement, latest check run, and next local action without granting public publication, website edits, external sharing, deployment, live Supabase, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.
