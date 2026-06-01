# GCSC Whitepaper v1.3 Draft Accessibility Static Checklist

Status: internal draft accessibility static checklist. Accessibility review remains PENDING_BROWSER_A11Y_REVIEW. Current publication decision remains NO-GO.

This checklist does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, Metallicus/XPR partnership claims, or accessibility compliance claims.

## Purpose

This checklist records static accessibility checks for the local v1.3 draft files before browser, keyboard, contrast, zoom, and screen-reader review.

## Scope

| File | Scope |
|---|---|
| `whitepaper-v1-3-draft.html` | local whitepaper draft only |
| `index-v1-3-draft.html` | local homepage draft only |
| `whitepaper-v1-3-draft.css` | local draft CSS only |
| `whitepaper.html` | public legacy file, scan only |
| `index.html` | public legacy file, scan only |

Public files remain unchanged legacy files until a separate publication GO record exists.

## Static Checks

| Check | Current Status | Evidence |
|---|---|---|
| viewport meta present | PASS_STATIC | draft HTML files include viewport metadata |
| language attribute present | PASS_STATIC | draft HTML files include `html lang="en"` |
| page title present | PASS_STATIC | draft HTML files include non-empty title elements |
| internal draft and NO-GO badges visible | PASS_STATIC | drafts show internal draft and publication NO-GO language |
| in-page anchors resolve | PASS_STATIC | local `href="#..."` targets are present in draft HTML ids, with top-link exceptions only for `href="#"` |
| button and link text is not empty | PASS_STATIC | draft links and buttons have visible text content or an allowed top-link target |
| no legacy asset dependencies | PASS_STATIC | draft files do not depend on `css/style.css`, `css/whitepaper.css`, or `assets/gcsc-logo.png` |
| no screenshot/browser/manual keyboard evidence | PENDING_BROWSER_A11Y_REVIEW | static checklist is not browser accessibility evidence |
| no screen-reader review | PENDING_SCREEN_READER_REVIEW | no screen-reader pass has been recorded |

## Manual Checks Still Required

- keyboard tab order;
- focus visibility;
- color contrast review;
- screen-reader landmarks and reading order;
- mobile zoom and horizontal overflow;
- reduced-motion behavior;
- browser screenshots and issue routing.

## Required Source Documents

- `docs/whitepaper-v1-3-browser-qa-evidence-flow.md`;
- `docs/whitepaper-v1-3-visual-qa-evidence-template.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-results-template.md`;
- `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md`;
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`;
- `docs/whitepaper-v1-3-publication-gate.md`.

## Stop Boundary

Do not use this checklist to claim:

- accessibility compliance;
- WCAG compliance;
- browser QA completion;
- keyboard QA completion;
- contrast QA completion;
- screen-reader QA completion;
- screenshot QA completion;
- publication readiness;
- public file replacement readiness;
- legal, provider, partnership, payment, loan, escrow, stablecoin, token-collateral, FIO, XPR, or production Web3 readiness.
