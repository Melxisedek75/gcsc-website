# GCSC Whitepaper v1.3 Browser QA Evidence Flow

Status: internal browser QA evidence flow map. Browser QA evidence remains PENDING_FLOW. Current publication decision remains NO-GO.

This flow map does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registration, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

Use this map to keep browser QA evidence in the correct order. It prevents local runbooks, templates, screenshots, click checks, visual checks, reports, and issue intake rows from being treated as publication approval.

## Evidence Flow

| Step | Source | Output | Required State |
|---|---|---|---|
| 1 | `docs/whitepaper-v1-3-founder-browser-qa-runbook.md` | founder opens local draft files and follows local-only QA steps | PENDING_BROWSER_QA_RUN |
| 2 | `docs/whitepaper-v1-3-screenshot-evidence-manifest.md` and `docs/whitepaper-v1-3-screenshot-evidence-results-template.md` | screenshot evidence IDs and redaction-reviewed result rows | PENDING_CAPTURE |
| 3 | `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md` | desktop and mobile click result rows | PENDING_CLICK |
| 4 | `docs/whitepaper-v1-3-visual-qa-evidence-template.md` | desktop, mobile, and content visual QA rows | PENDING_VISUAL_QA |
| 5 | `docs/whitepaper-v1-3-founder-browser-qa-report-template.md` | founder browser QA report summary | PENDING_BROWSER_QA_REPORT |
| 6 | `docs/whitepaper-v1-3-founder-browser-qa-issue-intake-template.md` | browser QA findings routed into local issue rows | PENDING_ISSUE_ROUTING |
| 7 | `docs/whitepaper-v1-3-draft-qa-issue-register.md` | local issue register with open/fixed/hold states | HOLD_NO_PUBLIC_USE |
| 8 | `docs/whitepaper-v1-3-publication-evidence-current-status.md` | publication evidence ledger remains blocked until all gates clear | NO-GO |

## Required Source Documents

- `docs/whitepaper-v1-3-founder-browser-qa-runbook.md`;
- `docs/whitepaper-v1-3-founder-browser-qa-report-template.md`;
- `docs/whitepaper-v1-3-founder-browser-qa-issue-intake-template.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-manifest.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-results-template.md`;
- `docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md`;
- `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md`;
- `docs/whitepaper-v1-3-visual-qa-evidence-template.md`;
- `docs/whitepaper-v1-3-draft-qa-issue-register.md`;
- `docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md`;
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`;
- `docs/whitepaper-v1-3-publication-blocker-status-matrix.md`;
- `docs/whitepaper-v1-3-publication-gate.md`.

## Allowed State Progression

| From | To | Rule |
|---|---|---|
| EMPTY_TEMPLATE | PENDING_BROWSER_QA_RUN | runbook exists, but local browser QA has not been performed |
| PENDING_BROWSER_QA_RUN | PENDING_CAPTURE | screenshot capture is planned but not recorded |
| PENDING_CAPTURE | PENDING_REDACTION_REVIEW | screenshot files exist and need private-data review |
| PENDING_REDACTION_REVIEW | PENDING_CLICK | redaction is acceptable, but navigation clicks are not complete |
| PENDING_CLICK | PENDING_VISUAL_QA | click evidence exists, but visual QA rows are not complete |
| PENDING_VISUAL_QA | PENDING_BROWSER_QA_REPORT | visual rows exist, but founder browser QA report is not filled |
| PENDING_BROWSER_QA_REPORT | PENDING_ISSUE_ROUTING | report exists, but issues are not routed |
| PENDING_ISSUE_ROUTING | HOLD_NO_PUBLIC_USE | issue routing exists, but public use remains blocked until all gates clear |

## No Shortcut Rules

- A runbook is not browser evidence.
- A template is not a filled evidence record.
- A screenshot without redaction review is not usable evidence.
- Static anchor checks are not browser click evidence.
- Visual QA rows are not publication approval.
- Browser QA issue intake is not issue resolution.
- Issue resolution is not legal/provider clearance.
- Local QA completion is not public publication approval.

## Stop Boundary

Do not use this flow to publish, replace public files, approve final wording, create archive copies, run rollback commands, contact providers, send reviewer packets, post announcements, send emails, submit grants, distribute decks, record legal/provider clearance, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, or claim a FIO, XPR, WebAuth, Metal, or Metallicus partnership.
