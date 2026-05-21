# Whitepaper v1.2 Public Draft Final Assembly Founder Wording Decision Record

Status: LOCAL_ONLY_FOUNDER_WORDING_DECISION_RECORD

## Purpose

This record captures the founder's internal wording decision after reading the final assembly review packet. It is a local-only decision surface for wording direction, not a launch, publication, legal, provider, finance, deployment, or live-system approval.

This record does not approve public publication, does not approve website edits, does not approve external sharing, does not approve deployment, does not approve live Supabase, and does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Decision Inputs

- `docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-plan.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Decision Record Fields

- `decision_record_id`: local identifier for this decision record.
- `review_packet_id`: matching final assembly review packet id.
- `assembly_id`: matching final assembly packet or checklist id.
- `founder_decision`: one allowed decision from this file.
- `decision_scope`: internal wording direction only.
- `wording_sections_accepted`: sections accepted for local-only internal wording direction.
- `wording_sections_to_revise`: sections that must be revised locally before another review.
- `claim_risk_notes`: founder notes on claims that feel too strong or unsupported.
- `redaction_notes`: founder notes on anything that must be removed before sharing.
- `review_report_update_required`: whether the review report must be updated before the next packet.
- `latest_check_run`: latest local check evidence.
- `blocked_next_actions`: live, external, legal, money, and publication actions that remain blocked.

## Allowed Founder Decisions

- ACCEPT_INTERNAL_WORDING_DIRECTION: founder can approve only internal wording direction.
- REVISE_LOCAL_ONLY: revise wording locally and keep all external use blocked.
- HOLD_FOR_CLAIM_RISK_REVIEW: stop until claim risk is reviewed.
- HOLD_FOR_REDACTION: stop until redaction confirmed before sharing.
- HOLD_FOR_LEGAL_PROVIDER_REVIEW: stop until legal or provider review is complete.
- NO_PUBLICATION_AUTHORITY: no publication authority is granted by this record.

Most restrictive source state wins. If the review packet, checklist, plan, draft, or review report is in HOLD, REVIEW_REPORT_ONLY, INTERNAL_DRAFT_ONLY, PUBLICATION_BLOCKED, or any more restrictive state, this decision record inherits that restriction.

## Founder Wording Notes

- No new public claims may be added through this decision record.
- Founder notes should identify exact sections, phrases, or claims to accept or revise.
- Claim-risk notes should flag legal, provider, finance, loan, escrow, repayment, stablecoin, token, securities, tax, or return language that needs outside review.
- Redaction notes should identify private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or secret-looking values that must stay out of any external packet.

## Non-Approval Boundary

This record is not a public approval, legal approval, provider approval, lender approval, compliance approval, deploy approval, token approval, or payment approval. It cannot authorize a public website update, investor or grant distribution, partner or provider outreach, production deploy, live Supabase change, app-store submission, public beta invite, real payment, real loan, escrow release, repayment routing, stablecoin settlement, token collateral lock, XPR signature, or public launch.

## Post-Decision Routing

- If ACCEPT_INTERNAL_WORDING_DIRECTION: prepare the next local-only assembly change packet and keep publication blocked.
- If REVISE_LOCAL_ONLY: update local wording notes and repeat founder wording review.
- If HOLD_FOR_CLAIM_RISK_REVIEW: route to claim-risk/legal/provider review prep.
- If HOLD_FOR_REDACTION: revise the packet until redaction confirmed before sharing.
- If HOLD_FOR_LEGAL_PROVIDER_REVIEW: prepare legal/provider materials without external sending.
- If NO_PUBLICATION_AUTHORITY: keep the packet internal and update the review report only.

The following actions remain blocked after any decision here:

- publish
- edit whitepaper.html
- send investor, grant, partner, provider, legal, or finance material
- change live Supabase
- deploy
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch

## Required Checks

- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-plan`
- `npm run check:whitepaper-v1-2-public-draft`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

This record passes when the founder can capture an internal wording direction decision, tie it to the review packet and assembly ids, identify accepted and revised sections, record claim-risk and redaction notes, confirm that the most restrictive source state wins, confirm no new public claims are authorized, and see that publication, website edits, external sharing, deployment, live Supabase, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, and public launch remain blocked.
