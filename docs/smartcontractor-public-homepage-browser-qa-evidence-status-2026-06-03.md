# SmartContractor Public Homepage Browser QA Evidence Status

Status: internal browser QA evidence status. Browser screenshot, click, and visual QA evidence remains `PENDING_CAPTURE`. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, Metallicus/XPR/LOAN partnership claims, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Record the current browser QA evidence state for the local homepage draft so the founder and future agents do not confuse prepared QA checklists with completed visual evidence.

This file is a status record, not a PASS report.

## Current Browser QA State

| Area | State | Evidence |
|---|---|---|
| Homepage browser URL check | BLOCKED_LOCAL_ROUTE_404 | `http://127.0.0.1:43118/index-v1-3-draft.html` returned 404 during this run. |
| Direct local file review | AVAILABLE_PENDING_FOUNDER_OR_BROWSER_RUN | `C:\gcsc\index-v1-3-draft.html` exists as the local source draft. |
| Headless browser automation | NOT_AVAILABLE_IN_CURRENT_DEPS | Local `node_modules` did not contain Playwright or Puppeteer in root or `construction-ai`. |
| Screenshot evidence | PENDING_CAPTURE | No screenshot files were captured or committed. |
| Redaction review | PENDING_REDACTION_REVIEW | No screenshot exists to review. |
| Desktop visual QA | PENDING_VISUAL_QA | No desktop browser review result is recorded. |
| Mobile visual QA | PENDING_VISUAL_QA | No mobile browser review result is recorded. |
| Link and CTA click QA | PENDING_CLICK | No browser click evidence is recorded. |
| Public homepage replacement | NO-GO | Public `index.html` remains unchanged. |
| Public whitepaper replacement | NO-GO | Public `whitepaper.html` remains unchanged. |

## Attempted Local URL

| Check | Result |
|---|---|
| URL | `http://127.0.0.1:43118/index-v1-3-draft.html` |
| Result | 404 Not Found |
| Interpretation | The active preview server, if any, is not serving the repository root draft homepage at that route. |
| Required next action | Use direct file review or start an approved local static preview from `C:\gcsc` on an unused local port. |

Do not change GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings to solve this local preview issue.

## Required Evidence Still Missing

| Evidence ID | Required Result | Current State |
|---|---|---|
| SCHOME-VIS-DESKTOP-01 | Top status chips visible: internal draft, publication NO-GO, no real money | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-02 | First viewport headline readable with no overlap | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-03 | First viewport does not lead with blockchain/token/DeFi/stablecoin/XPR/FIO/LOAN/escrow release language | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-04 | Product cards do not imply live finance | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-05 | Web3 remains lower on page and framed as future candidate infrastructure | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-06 | Review Boundary blocks publication, provider commitments, live finance, legal conclusions, and launch | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-01 | Mobile nav, chips, headline, copy, and CTAs fit without horizontal overflow | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-02 | Mobile hero wraps cleanly and does not collide with fixed nav | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-03 | Mobile status chips remain readable | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-04 | Mobile product cards stack cleanly | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-05 | Mobile Review Boundary remains readable | PENDING_CAPTURE |

## Safe Local Capture Options

| Option | Use When | Boundary |
|---|---|---|
| Direct file open | Founder or reviewer can open `C:\gcsc\index-v1-3-draft.html` in a browser. | No public files change. |
| Temporary local static preview | Reviewer starts a local server from `C:\gcsc` on an unused localhost port. | Local-only preview; no deploy or account change. |
| Headless browser run | Playwright/Puppeteer is installed later as an approved local dev dependency. | Do not install new dependencies or browsers as a live/deploy action; keep screenshots redacted. |

## Result Recording Rules

Use only these states until actual browser evidence exists:

- `PENDING_CAPTURE`;
- `PENDING_REDACTION_REVIEW`;
- `PENDING_VISUAL_QA`;
- `PENDING_CLICK`;
- `PASS_LOCAL_ONLY`;
- `ISSUE_FOUND`;
- `REDACT_OR_DISCARD`;
- `HOLD_NO_PUBLIC_USE`.

Do not write `PASS_LOCAL_ONLY` unless:

- the exact viewport was reviewed;
- screenshot or manual browser evidence is recorded;
- private-data redaction is complete;
- public wording risk is checked;
- any issue is routed or explicitly held;
- publication remains `NO-GO`.

## Documents Linked

| File | Role |
|---|---|
| `docs/smartcontractor-public-homepage-visual-qa-rollback-checklist-2026-06-03.md` | Defines evidence rows and rollback preparation. |
| `docs/smartcontractor-public-homepage-founder-decision-packet-2026-06-03.md` | Gives founder decision phrases. |
| `docs/smartcontractor-public-homepage-claim-risk-scan-2026-06-03.md` | Keeps copy risk posture at REVIEW, not PUBLICATION_GO. |
| `docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md` | Keeps public replacement blocked until evidence and standalone PUBLICATION_GO exist. |

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming visual QA has passed without recorded browser evidence;
- claiming legal/provider review is complete;
- enabling real payments, real loans, escrow custody, repayment routing, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production release.

## Working Summary

The local homepage draft has a visual QA checklist and founder decision packet, but browser evidence is not captured yet. The currently active local URL does not serve the draft homepage, and no headless browser dependency is available. The next safe action is founder/local browser review from the direct file path or a local-only static server, while public `index.html` and `whitepaper.html` remain unchanged and publication remains `NO-GO`.
