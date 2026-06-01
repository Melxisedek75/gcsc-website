# GCSC Whitepaper v1.3 Founder Browser QA Runbook

Status: internal founder browser QA runbook. Browser QA remains PENDING. Current publication decision remains NO-GO.

This runbook does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registration, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This runbook gives the founder a simple local-only path to collect browser screenshot, visual, and navigation-click evidence for the v1.3 draft files. It is preparation only. It does not create evidence until the founder actually opens the local files, reviews them, records results, and checks redaction.

## Files To Open

| File | Review Scope | Current State |
|---|---|---|
| `whitepaper-v1-3-draft.html` | whitepaper desktop/mobile visual, screenshot, and navigation review | LOCAL_DRAFT_ONLY |
| `index-v1-3-draft.html` | homepage desktop/mobile visual, screenshot, and navigation review | LOCAL_DRAFT_ONLY |
| `whitepaper.html` | legacy public file reference only | SCAN_ONLY |
| `index.html` | legacy public file reference only | SCAN_ONLY |

## Founder Steps

1. Open `C:\gcsc\whitepaper-v1-3-draft.html` in a browser.
2. Review desktop view first, then mobile width around 390px.
3. Open `C:\gcsc\index-v1-3-draft.html` in a browser.
4. Review desktop view first, then mobile width around 390px.
5. Capture screenshots only if no private tabs, URLs, emails, wallet data, account data, or desktop-sensitive information is visible.
6. Record results in `docs/whitepaper-v1-3-screenshot-evidence-results-template.md`.
7. Click the draft navigation links and record results in `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md`.
8. Record visual layout results in `docs/whitepaper-v1-3-visual-qa-evidence-template.md`.
9. Leave every unresolved row as PENDING_CAPTURE, PENDING_CLICK, or PENDING_VISUAL_QA.
10. Do not replace `whitepaper.html` or `index.html`.

## Required Evidence IDs

| Evidence Group | Required IDs | Destination |
|---|---|---|
| whitepaper screenshots | V13-WP-DESKTOP-01, V13-WP-DESKTOP-02, V13-WP-MOBILE-01, V13-WP-MOBILE-02 | `docs/whitepaper-v1-3-screenshot-evidence-results-template.md` |
| homepage screenshots | V13-HOME-DESKTOP-01, V13-HOME-MOBILE-01 | `docs/whitepaper-v1-3-screenshot-evidence-results-template.md` |
| whitepaper navigation clicks | V13-NAV-WP-01, V13-NAV-WP-02, V13-NAV-WP-03, V13-NAV-WP-04, V13-NAV-WP-05, V13-NAV-WP-06 | `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md` |
| homepage navigation clicks | V13-NAV-HOME-01, V13-NAV-HOME-02, V13-NAV-HOME-03, V13-NAV-HOME-04, V13-NAV-HOME-05 | `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md` |
| visual QA rows | V13-VISUAL-WP-DESKTOP-01, V13-VISUAL-WP-DESKTOP-02, V13-VISUAL-WP-MOBILE-01, V13-VISUAL-WP-MOBILE-02, V13-VISUAL-HOME-DESKTOP-01, V13-VISUAL-HOME-MOBILE-01 | `docs/whitepaper-v1-3-visual-qa-evidence-template.md` |

## Redaction Check

Before any screenshot or note can be used outside local founder review, confirm:

- no private email, phone, address, account ID, token, API key, password, wallet data, transaction hash, browser tab, extension, or desktop notification is visible;
- no legal/provider approval, partnership, publication, live finance, lending, escrow, stablecoin, token collateral, FIO, XPR, WebAuth, Metal, or Metallicus approval is implied;
- the target file is a local draft file, not a replaced public file.

## Result States

Use only these result states until the founder records actual evidence:

- PENDING_CAPTURE;
- PENDING_CLICK;
- PENDING_VISUAL_QA;
- PASS_LOCAL_ONLY_REVIEWED_LATER;
- FAIL_REWORK_REQUIRED_LATER;
- BLOCKED_REDACTION_REVIEW_LATER.

## Stop Boundary

Do not use this runbook to publish, replace public files, create archive copies, run rollback commands, contact providers, send reviewer packets, post announcements, send emails, submit grants, distribute decks, record legal/provider clearance, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, or claim a FIO, XPR, WebAuth, Metal, or Metallicus partnership.
