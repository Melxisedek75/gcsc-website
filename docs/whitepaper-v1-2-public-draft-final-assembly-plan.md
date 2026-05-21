# Whitepaper v1.2 Public Draft Final Assembly Plan

Date: 2026-05-15 PT

Status: LOCAL_ONLY_FINAL_ASSEMBLY_PLAN

## Purpose

Give Codex one local-only plan for assembling the reviewed whitepaper v1.2 public draft wording into a founder-reviewable internal packet after the revision intake, integration ledger, and founder closeout are complete.

This plan turns accepted revision outputs into a controlled final assembly pass without publishing, editing the live website, sharing externally, deploying, or approving any live/legal/money action.

## What This Does Not Approve

This plan does not approve public publication.

This plan does not approve website edits.

This plan does not approve investor, grant, partner, provider, legal, or finance sharing.

This plan does not approve live Supabase changes, deployment, external account changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, public launch, or money movement.

## Required Source Inputs

- `docs/whitepaper-v1-2-public-draft-revision-founder-closeout.md`
- `docs/whitepaper-v1-2-public-draft-revision-integration-ledger.md`
- `docs/whitepaper-v1-2-public-draft-revision-output-intake.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`
- `docs/whitepaper-v1-2-publication-go-no-go-checklist.md`
- `docs/whitepaper-v1-2-publication-dry-run.md`

## Assembly Packet Fields

```text
assembly_id:
source_closeout_id:
source_integration_ids:
source_intake_ids:
target_draft_version:
source_commit:
latest_check_run:
sections_to_touch:
sections_not_to_touch:
claim_risk_class:
redaction_status:
review_report_update_required:
publication_status:
founder_review_status:
blocked_next_actions:
assembly_evidence:
```

## Allowed Assembly States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| `READY_FOR_LOCAL_ASSEMBLY` | Source closeout, intake, and ledger records are complete enough for internal assembly | Codex may prepare local draft/review-report edits only |
| `ASSEMBLED_LOCAL_ONLY` | Internal draft packet was assembled and checked locally | Founder can review wording direction only |
| `REVISE_LOCAL_ONLY` | Assembly needs local wording or evidence cleanup | Codex may revise local tracked docs and re-run checks |
| `HOLD_FOR_REDACTION` | Private, raw, secret, screenshot, recording, log, wallet, payment, or credential risk exists | Redact before further review |
| `HOLD_FOR_CLAIM_RISK_REVIEW` | Wording could imply public, live, legal, provider, finance, loan, escrow, repayment, stablecoin, token, AI, deployment, or launch readiness | Route to claim-risk review |
| `HOLD_FOR_FOUNDER_REVIEW` | Founder direction is needed before assembly can continue | Stop for founder review |
| `HOLD_FOR_LEGAL_PROVIDER_REVIEW` | Legal, provider, finance-provider, lender, loan, escrow, repayment, stablecoin, or token-collateral wording needs outside judgment | Keep internal and collect external review later |

Allowed document statuses after assembly:

- `PUBLICATION_BLOCKED`
- `INTERNAL_DRAFT_ONLY`
- `REVIEW_REPORT_ONLY`

## Assembly Sequence

1. Confirm the founder closeout allows internal wording review only.
2. List every source_integration_ids and source_intake_ids used for the assembly pass.
3. Record source_commit and latest_check_run before changing local draft files.
4. Identify sections_to_touch and sections_not_to_touch before edits begin.
5. Apply only accepted or revised-local wording that already passed intake and integration rules.
6. Update the review report with every assembled change, reviewer concern, and remaining HOLD.
7. Keep the most restrictive source state wins rule across intake, ledger, closeout, and publication gates.
8. Run the required checks before any founder handoff.

## Claim And Redaction Gates

- no new public claims;
- no unreviewed legal, provider, finance, loan, escrow, repayment, stablecoin, token, securities, tax, or return language;
- redaction confirmed before sharing;
- review report updated with every assembled change;
- most restrictive source state wins when records disagree;
- any missing source id, stale validator result, unresolved redaction status, or unsupported claim defaults to HOLD_FOR_CLAIM_RISK_REVIEW or HOLD_FOR_REDACTION;
- founder can approve only internal wording direction.

## Founder Review Output

The founder review output can record only:

```text
Decision: READY_FOR_LOCAL_ASSEMBLY / ASSEMBLED_LOCAL_ONLY / REVISE_LOCAL_ONLY / HOLD_FOR_REDACTION / HOLD_FOR_CLAIM_RISK_REVIEW / HOLD_FOR_FOUNDER_REVIEW / HOLD_FOR_LEGAL_PROVIDER_REVIEW
Scope reviewed: whitepaper v1.2 public draft final assembly packet
Allowed use: internal founder wording review only
Publication status: PUBLICATION_BLOCKED
Draft status: INTERNAL_DRAFT_ONLY
Review report status: REVIEW_REPORT_ONLY
Notes:
```

## Still Blocked After Assembly

Do not publish.

Do not edit whitepaper.html.

Do not send investor, grant, partner, provider, legal, or finance material.

Do not change live Supabase.

Do not deploy.

Do not enable payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, or public launch.

## Required Checks

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft-final-assembly-plan
npm run check:whitepaper-v1-2-public-draft-revision-founder-closeout
npm run check:whitepaper-v1-2-public-draft-revision-integration-ledger
npm run check:whitepaper-v1-2-public-draft-revision-output-intake
npm run check:whitepaper-v1-2-public-draft
npm run check:whitepaper-v1-2-publication-go-no-go
npm run check:real-status-audit
npm run check
```

## Acceptance Check

Codex can assemble the whitepaper v1.2 public draft into a founder-reviewable internal packet with source closeout, intake, ledger, commit, check-run, section, claim-risk, redaction, review-report, publication-block, and blocked-next-action evidence while public publication and live/legal/money actions remain blocked.
