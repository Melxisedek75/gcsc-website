# Whitepaper v1.2 Public Draft Final Assembly Local Change Packet

Status: LOCAL_ONLY_FINAL_ASSEMBLY_CHANGE_PACKET

## Purpose

This packet defines how a founder-approved internal wording direction can become a local-only whitepaper draft change. It keeps the actual edit work tied to the founder wording decision record, final assembly review packet, checklist, plan, draft, and review report before any public-facing file is touched.

This packet does not approve public publication, does not approve website edits, does not approve external sharing, does not approve deployment, does not approve live Supabase, and does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Change Inputs

- `docs/whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-review-packet.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-checklist.md`
- `docs/whitepaper-v1-2-public-draft-final-assembly-plan.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Change Packet Fields

- `change_packet_id`: local identifier for the wording change packet.
- `decision_record_id`: founder wording decision record that allows internal direction only.
- `review_packet_id`: final assembly review packet that supplied the source context.
- `assembly_id`: final assembly plan or checklist id.
- `source_commit`: commit or local revision reviewed before changing wording.
- `target_draft_version`: draft version that would receive local-only wording changes.
- `sections_to_change`: exact draft sections allowed for local editing.
- `sections_not_to_change`: sections explicitly protected from this packet.
- `before_summary`: short summary of current wording.
- `after_summary`: short summary of intended local-only wording.
- `claim_risk_summary`: conservative summary of any claim risk introduced or reduced.
- `redaction_summary`: confirmation that redaction confirmed before sharing remains required.
- `review_report_delta`: review report updates required by the local wording change.
- `latest_check_run`: latest check evidence before change application.
- `blocked_next_actions`: public, live, legal, money, and external actions still blocked.

## Allowed Change States

- READY_FOR_LOCAL_CHANGE: all inputs allow local wording change preparation.
- APPLY_LOCAL_ONLY: apply only to the local draft or local change packet.
- REVISE_LOCAL_ONLY: revise the packet locally before any draft edit.
- HOLD_FOR_FOUNDER_REVIEW: wait for founder review of wording direction.
- HOLD_FOR_CLAIM_RISK_REVIEW: wait for claim-risk review.
- HOLD_FOR_REDACTION: wait until redaction confirmed before sharing.
- HOLD_FOR_LEGAL_PROVIDER_REVIEW: wait for legal/provider review before external use.
- PUBLICATION_BLOCKED: public publication remains blocked.
- INTERNAL_DRAFT_ONLY: internal draft only, no external use.
- REVIEW_REPORT_ONLY: update review records only, do not change public-facing wording.

Most restrictive source state wins. If the founder decision record, review packet, checklist, plan, draft, or review report has a restrictive status, this packet inherits that status.

## Local Change Scope

Founder can approve only internal wording direction. This packet can describe exact local edits to the internal draft and review report, but it cannot authorize website updates, publication, investor or grant sharing, partner or provider outreach, production deploy, live Supabase changes, app-store actions, money movement, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or public launch.

## Claim And Redaction Gates

- No new public claims may be introduced by this packet.
- Any stronger product, traction, security, AI, loan, escrow, payment, token, securities, tax, return, legal, provider, or finance claim must stay HOLD_FOR_CLAIM_RISK_REVIEW.
- Redaction confirmed before sharing remains mandatory.
- Private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, and secret-looking values must not appear in the packet.

## Review Report Update Rules

- Review report updated with every local wording change.
- `review_report_delta` must list each touched section and the reason for the change.
- Claim-risk, redaction, source id, and blocked-action notes must be carried forward.
- If the review report cannot be updated in the same scoped change, the packet must stay REVIEW_REPORT_ONLY or REVISE_LOCAL_ONLY.

## Blocked Next Actions

The following actions remain blocked:

- publish
- edit whitepaper.html
- send investor, grant, partner, provider, legal, or finance material
- change live Supabase
- deploy
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch

## Required Checks

- `npm run check:whitepaper-v1-2-public-draft-final-assembly-local-change-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-founder-wording-decision-record`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-review-packet`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist`
- `npm run check:whitepaper-v1-2-public-draft-final-assembly-plan`
- `npm run check:whitepaper-v1-2-public-draft`
- `npm run check:real-status-audit`
- `npm run check`

## Acceptance Check

This packet passes when a local wording change can be traced from founder wording decision record through review packet, checklist, plan, draft, and review report; allowed and protected sections are explicit; most restrictive source state wins; no new public claims are authorized; review report update requirements are clear; and publication, website edits, external sharing, deployment, live Supabase, payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, and public launch remain blocked.
