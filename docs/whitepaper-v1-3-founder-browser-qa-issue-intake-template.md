# GCSC Whitepaper v1.3 Founder Browser QA Issue Intake Template

Status: internal founder browser QA issue intake template. Issue intake is EMPTY_TEMPLATE. Current publication decision remains NO-GO.

This intake template does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registration, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

Use this template after the founder completes local browser QA and records a browser QA report. It routes browser findings into `docs/whitepaper-v1-3-draft-qa-issue-register.md` without changing public files or treating local review as publication readiness.

## Intake Record Template

| Field | Value |
|---|---|
| intake_id | TO_FILL |
| source_browser_qa_report | TO_FILL_OR_NONE |
| source_commit | TO_FILL |
| reviewer | Founder |
| intake_date | TO_FILL |
| files_reviewed | TO_FILL |
| total_findings | TO_FILL |
| blocker_findings | TO_FILL |
| high_findings | TO_FILL |
| redaction_state | PENDING_REDACTION_REVIEW |
| routing_state | PENDING_ISSUE_ROUTING |
| publication_decision | NO-GO |

## Issue Intake Rows

| Draft QA Issue ID | Source Evidence ID | Severity | Category | Source File | Required Routing | Current State |
|---|---|---|---|---|---|---|
| V13-QA-BROWSER-001 | TO_FILL | TO_FILL | TO_FILL | TO_FILL | route to `docs/whitepaper-v1-3-draft-qa-issue-register.md` | PENDING_ISSUE_ROUTING |

## Accepted Source Evidence

Every issue row must reference at least one of these local evidence sources:

- `docs/whitepaper-v1-3-founder-browser-qa-report-template.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-results-template.md`;
- `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md`;
- `docs/whitepaper-v1-3-visual-qa-evidence-template.md`;
- `docs/whitepaper-v1-3-public-wording-scan-current-status.md`.

## Severity Routing

| Severity | Routing Rule | Public State |
|---|---|---|
| BLOCKER | must stay OPEN until fixed and locally rechecked | NO-GO |
| HIGH | must have owner note or hold reason before reviewer routing | NO-GO |
| MEDIUM | can batch into local polish queue | NO-GO |
| LOW | can batch with copy or formatting cleanup | NO-GO |

## Allowed Categories

- visual overlap;
- mobile overflow;
- unclear NO-GO boundary;
- risky finance wording;
- risky escrow wording;
- risky Web3 wording;
- risky partner wording;
- private-data exposure;
- broken navigation;
- inconsistent Construction Trust Infrastructure wording;
- missing provider-review context;
- missing future/review-required context.

## Allowed States

- EMPTY_TEMPLATE;
- PENDING_ISSUE_ROUTING;
- PENDING_REDACTION_REVIEW;
- OPEN;
- NEEDS_LOCAL_FIX;
- NEEDS_FOUNDER_REVIEW;
- NEEDS_EXTERNAL_REVIEW;
- FIXED_LOCAL_RECHECK_REQUIRED;
- HOLD_NO_PUBLIC_USE.

## No Approval Rule

This intake can create local issue-routing rows only. It cannot approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publication, announcement, email, social, deck, grant, investor, partner, or reviewer distribution;
- legal/provider clearance;
- screenshot, navigation, visual, archive, rollback, or final wording evidence as complete;
- live payments, loans, escrow, stablecoin settlement, token collateral, FIO registration, XPR signatures, or production Web3 actions.

## Stop Boundary

Do not use this intake to publish, replace public files, create archive copies, run rollback commands, contact providers, send reviewer packets, post announcements, send emails, submit grants, distribute decks, record legal/provider clearance, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, or claim a FIO, XPR, WebAuth, Metal, or Metallicus partnership.
