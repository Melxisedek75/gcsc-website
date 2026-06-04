# SmartContractor Public Homepage Browser QA Evidence Status

Status: internal browser QA evidence captured for the local draft. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Record the current browser QA evidence state for the local homepage draft so the founder and future agents do not confuse local-only browser evidence with public publication approval.

This file is a status record, not a public publication PASS report.

## Current Browser QA State

| Area | State | Evidence |
|---|---|---|
| Homepage browser URL check | PASS_LOCAL_HTTP_200 | `http://127.0.0.1:43119/index-v1-3-draft.html` returned 200 from a local-only static server started in `C:\gcsc`. |
| Direct local file review | SOURCE_DRAFT_CONFIRMED | `C:\gcsc\index-v1-3-draft.html` exists as the local source draft. |
| In-app browser automation | PASS_BROWSER_SESSION | Codex in-app Browser loaded cache-busted local draft URLs and returned DOM, screenshot, title, console, and click evidence. |
| Headless browser automation | NOT_AVAILABLE_IN_CURRENT_DEPS | Playwright was not available in the Node runtime, and local Chrome/Edge CLI executables were not found for headless screenshots. |
| Screenshot evidence | PASS_SESSION_CAPTURE_NOT_COMMITTED | Desktop hero, desktop products, desktop review boundary, mobile hero, mobile products, and mobile review screenshots were captured in session; screenshots were not committed as repo artifacts. |
| Redaction review | PASS_FULL_DOM_AND_STATIC_SCAN | Cache-busted browser DOM and static `rg` scan found zero hits for explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral terms in `index-v1-3-draft.html`. |
| Desktop visual QA | PASS_BROWSER_SESSION | Desktop hero, product cards, and review boundary render without obvious overlap in session screenshots. |
| Mobile visual QA | PASS_BROWSER_SESSION | Mobile hero, product stack, and review boundary render without obvious horizontal overflow in session screenshots. |
| Link and CTA click QA | PASS_BROWSER_CLICK | `View Product Layers` resolved to one link and navigated to `#products`; static check also found all local anchors and local whitepaper links present. |
| First-viewport risky wording check | PASS_BROWSER_AND_STATIC_LOCAL | Static first-viewport scan and cache-busted browser DOM found no blockchain/token/DeFi/stablecoin/XPR/FIO/LOAN/escrow-release leading terms. |
| Risky publication claim scan | PASS_STATIC_LOCAL_ONLY | Static scan found zero hits for instant loan approval, escrow release, stablecoin-live, token-collateral-live, Metallicus/LOAN partnership-approved, legal/provider-complete, or production-approved claims. |
| Console health | PASS_WITH_DRAFT_WARNING | Browser console recorded zero errors. The only warning is Tailwind CDN's normal production warning for `cdn.tailwindcss.com`, which remains a draft/publication-readiness item, not a runtime failure. |
| Public homepage replacement | NO-GO | Public `index.html` remains unchanged. |
| Public whitepaper replacement | NO-GO | Public `whitepaper.html` remains unchanged. |

## Local URL Attempts

| Check | Result |
|---|---|
| Prior URL | `http://127.0.0.1:43118/index-v1-3-draft.html` |
| Prior result | 404 Not Found |
| Updated local URL | `http://127.0.0.1:43119/index-v1-3-draft.html` |
| Updated result | 200 OK |
| Interpretation | The previous port was not serving the repository root draft, but a local-only static server from `C:\gcsc` on port `43119` serves the draft correctly. |
| Required next action | Founder review can use the working local URL, but public replacement still requires standalone `PUBLICATION_GO`. |

Do not change GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings to solve this local preview issue.

## Static QA Evidence Captured

| Check | Result |
|---|---|
| `index-v1-3-draft.html` exists | PASS |
| `http://127.0.0.1:43119/index-v1-3-draft.html` | 200 OK |
| Page title | `GCSC - Construction Trust Infrastructure` |
| Viewport meta | PRESENT |
| Required draft/no-go phrases | PRESENT |
| Missing in-page anchors | NONE |
| Missing local links | NONE |
| `whitepaper-v1-3-draft.html` local HTTP | 200 OK |
| `whitepaper.html` local HTTP | 200 OK |
| First-viewport blocked terms | NONE |
| Full draft blocked terms after redaction | NONE |
| Risky publication claim hits | NONE |

## Browser QA Evidence Captured

| Check | Result |
|---|---|
| Browser URL | `http://127.0.0.1:43119/index-v1-3-draft.html?qa2=<cache-bust>` |
| Page identity | `GCSC - Construction Trust Infrastructure` |
| Blank-page check | PASS: meaningful nav, draft status chips, hero, product, and review content rendered. |
| Framework overlay check | PASS: no error overlay visible in DOM or screenshots. |
| Console health | PASS_WITH_DRAFT_WARNING: zero errors; Tailwind CDN production warning only. |
| CTA interaction | PASS: `View Product Layers` count was `1`; click changed route to `#products`. |
| Full-DOM redaction scan | PASS: zero explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral hits. |
| Desktop screenshots | Captured in session for hero, products, and review boundary; not committed. |
| Mobile screenshots | Captured in session for hero, products, and review boundary; not committed. |

## Required Evidence Still Missing

| Evidence ID | Required Result | Current State |
|---|---|---|
| SCHOME-VIS-DESKTOP-01 | Top status chips visible: internal draft, publication NO-GO, no real money | PASS_SESSION_CAPTURE |
| SCHOME-VIS-DESKTOP-02 | First viewport headline readable with no overlap | PASS_SESSION_CAPTURE |
| SCHOME-VIS-DESKTOP-03 | First viewport does not lead with blockchain/token/DeFi/stablecoin/XPR/FIO/LOAN/escrow release language | PASS_SESSION_CAPTURE_AND_STATIC_SCAN |
| SCHOME-VIS-DESKTOP-04 | Product cards do not imply live finance | PASS_SESSION_CAPTURE |
| SCHOME-VIS-DESKTOP-05 | Future infrastructure remains generic/private and not public blockchain wording | PASS_SESSION_CAPTURE_AND_FULL_DOM_SCAN |
| SCHOME-VIS-DESKTOP-06 | Review Boundary blocks publication, provider commitments, live finance, legal conclusions, and launch | PASS_SESSION_CAPTURE |
| SCHOME-VIS-MOBILE-01 | Mobile nav, chips, headline, copy, and CTAs fit without horizontal overflow | PASS_SESSION_CAPTURE |
| SCHOME-VIS-MOBILE-02 | Mobile hero wraps cleanly and does not collide with fixed nav | PASS_SESSION_CAPTURE |
| SCHOME-VIS-MOBILE-03 | Mobile status chips remain readable | PASS_SESSION_CAPTURE |
| SCHOME-VIS-MOBILE-04 | Mobile product cards stack cleanly | PASS_SESSION_CAPTURE |
| SCHOME-VIS-MOBILE-05 | Mobile Review Boundary remains readable | PASS_SESSION_CAPTURE |

## Safe Local Capture Options

| Option | Use When | Boundary |
|---|---|---|
| Direct file open | Founder or reviewer can open `C:\gcsc\index-v1-3-draft.html` in a browser. | No public files change. |
| Temporary local static preview | Reviewer starts a local server from `C:\gcsc` on an unused localhost port. | Local-only preview; no deploy or account change. |
| Headless browser run | Playwright/Puppeteer is installed later as an approved local dev dependency. | Do not install new dependencies or browsers as a live/deploy action; keep screenshots redacted. |

## Result Recording Rules

Use only these states until public replacement is explicitly approved:

- `PENDING_CAPTURE`;
- `PENDING_REDACTION_REVIEW`;
- `PENDING_VISUAL_QA`;
- `PENDING_CLICK`;
- `PASS_LOCAL_ONLY`;
- `PASS_SESSION_CAPTURE`;
- `PASS_BROWSER_SESSION`;
- `ISSUE_FOUND`;
- `REDACT_OR_DISCARD`;
- `HOLD_NO_PUBLIC_USE`.

Do not write `PASS_LOCAL_ONLY`, `PASS_SESSION_CAPTURE`, or `PASS_BROWSER_SESSION` unless:

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
- claiming public visual QA has passed without recorded browser evidence and founder approval;
- claiming legal/provider review is complete;
- enabling real payments, real loans, escrow custody, repayment routing, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production release.

## Working Summary

The local homepage draft now serves successfully from `http://127.0.0.1:43119/index-v1-3-draft.html`. Static checks passed for title, viewport meta, required no-go wording, anchors, local links, full-homepage risky wording, and risky publication claims. In-app Browser QA captured desktop/mobile screenshots, CTA click evidence, DOM evidence, and console health evidence with zero console errors and one non-blocking Tailwind CDN draft warning. Public `index.html` and `whitepaper.html` remain unchanged, and publication remains `NO-GO` until the founder gives standalone `PUBLICATION_GO`.
