# Whitepaper v1.2 Public Draft Final Assembly Checklist

Date: 2026-05-15 PT

Status: LOCAL_ONLY_FINAL_ASSEMBLY_CHECKLIST

## Purpose

Give Codex a step-by-step local-only checklist for executing the whitepaper v1.2 public draft final assembly plan without drifting into publication, website edits, external sharing, deployment, or live/legal/money actions.

This checklist does not approve public publication.

This checklist does not approve website edits.

This checklist does not approve external sharing.

This checklist does not approve deployment.

This checklist does not approve live Supabase.

This checklist does not approve payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Prerequisites

- `docs/whitepaper-v1-2-public-draft-final-assembly-plan.md`
- `docs/whitepaper-v1-2-public-draft-revision-founder-closeout.md`
- `docs/whitepaper-v1-2-public-draft-revision-integration-ledger.md`
- `docs/whitepaper-v1-2-public-draft-revision-output-intake.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

Before assembly starts:

- source_closeout_id recorded;
- source_integration_ids recorded;
- source_intake_ids recorded;
- source_commit recorded;
- latest_check_run recorded;
- sections_to_touch listed;
- sections_not_to_touch listed;
- most restrictive source state wins.

Allowed statuses:

- `PUBLICATION_BLOCKED`
- `INTERNAL_DRAFT_ONLY`
- `REVIEW_REPORT_ONLY`

## Assembly Checklist

- confirm the final assembly plan status is `LOCAL_ONLY_FINAL_ASSEMBLY_PLAN`;
- confirm the founder closeout allows internal wording review only;
- confirm every accepted integration item points to an intake record;
- confirm draft edits are limited to sections_to_touch;
- confirm sections_not_to_touch remain unchanged unless a new local-only record is created;
- confirm rejected, held, or unresolved items are not assembled into the draft;
- confirm the assembled output remains `INTERNAL_DRAFT_ONLY`;
- confirm publication_status remains `PUBLICATION_BLOCKED`.

## Claim Review Checklist

- no new public claims;
- no unreviewed legal, provider, finance, loan, escrow, repayment, stablecoin, token, securities, tax, or return language;
- no implication that legal review, provider review, lender approval, public release, production deploy, live loans, live escrow, repayment routing, stablecoin settlement, token collateral, or XPR signatures are ready;
- any changed claim has a source record, claim_risk_class, owner, and validator result;
- any uncertain claim defaults to HOLD_FOR_CLAIM_RISK_REVIEW.

## Redaction Checklist

- no private data, screenshots, recordings, raw logs, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or secret-looking values;
- no recipient contact details;
- no raw tester evidence;
- no external account details;
- no unredacted founder Auth evidence;
- any redaction uncertainty defaults to HOLD_FOR_REDACTION.

## Review Report Checklist

- review report updated for every assembled change;
- each assembled change records source_closeout_id, source_integration_ids, source_intake_ids, source_commit, and latest_check_run;
- unresolved HOLD items stay visible in the review report;
- blocked live/legal/money actions stay visible in the review report;
- founder-facing notes explain what changed without adding public claims.

## Founder Handoff Checklist

Founder handoff can say only:

```text
Packet: Whitepaper v1.2 public draft final assembly
Allowed use: internal founder wording review only
Publication status: PUBLICATION_BLOCKED
Draft status: INTERNAL_DRAFT_ONLY
Review report status: REVIEW_REPORT_ONLY
Founder can review internal wording direction only
```

The handoff cannot ask for legal, provider, finance, deployment, Supabase, payment, loan, escrow, repayment, stablecoin, token-collateral, XPR-signature, app-store, or public-launch approval through this checklist.

## Stop Conditions

Stop and mark HOLD if any action would:

- publish;
- edit whitepaper.html;
- send investor, grant, partner, provider, legal, or finance material;
- change live Supabase;
- deploy;
- enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

Stop and mark HOLD if source records are missing, validators are stale, redaction is uncertain, claim risk is unresolved, or the founder review scope is broader than internal wording direction.

## Required Checks

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft-final-assembly-checklist
npm run check:whitepaper-v1-2-public-draft-final-assembly-plan
npm run check:whitepaper-v1-2-public-draft-revision-founder-closeout
npm run check:whitepaper-v1-2-public-draft-revision-integration-ledger
npm run check:whitepaper-v1-2-public-draft-revision-output-intake
npm run check:whitepaper-v1-2-public-draft
npm run check:real-status-audit
npm run check
```

## Acceptance Check

Codex can execute the whitepaper v1.2 final assembly plan through a local-only checklist that verifies source ids, commit/check evidence, touched/untouched sections, claim review, redaction, review-report updates, founder handoff limits, and hard stop conditions while publication and live/legal/money actions stay blocked.
