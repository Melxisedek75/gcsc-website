# SmartContractor Public Homepage Local Browser QA Runbook

Status: internal local browser QA runbook. Browser screenshot, click, and visual QA evidence remains `PENDING_CAPTURE` until the founder or reviewer actually opens the draft, records results, and completes redaction review. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, Metallicus/XPR/LOAN partnership claims, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Give the founder a simple local-only path to review the local homepage draft in a browser after the current in-app URL returned 404 for `index-v1-3-draft.html`.

This runbook is preparation only. It does not create PASS evidence until the review is actually performed and recorded.

## Current Problem

| Item | Current State |
|---|---|
| Current in-app URL tested | `http://127.0.0.1:43118/index-v1-3-draft.html` |
| Result | 404 Not Found |
| Meaning | That server is not serving the repository root homepage draft. |
| Safe fix | Open the file directly or start a local-only static server from `C:\gcsc`. |

## Before Review

Confirm these files exist:

| File | Required State |
|---|---|
| `C:\gcsc\index-v1-3-draft.html` | exists |
| `C:\gcsc\whitepaper-v1-3-draft.html` | exists |
| `C:\gcsc\docs\smartcontractor-public-homepage-visual-qa-rollback-checklist-2026-06-03.md` | exists |
| `C:\gcsc\docs\smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md` | exists |

## Option A: Direct File Open

Use this when the founder wants the fastest local review.

1. Open File Explorer.
2. Go to `C:\gcsc`.
3. Double-click `index-v1-3-draft.html`.
4. Confirm the browser address starts with a local file path, not a public website URL.
5. Review desktop layout first.
6. Resize the browser to mobile width around 390 px.
7. Record results in the visual QA checklist.

Do not edit `index.html` or `whitepaper.html`.

## Option B: Local Static Server

Use this when file links or browser behavior work better through `http://127.0.0.1`.

Open PowerShell and run:

```powershell
cd C:\gcsc
py -3 -m http.server 43119
```

Then open:

```text
http://127.0.0.1:43119/index-v1-3-draft.html
```

If port `43119` is busy, close the terminal that is using it or choose another unused local port, for example:

```powershell
py -3 -m http.server 43120
```

Stop the local server by clicking the PowerShell window and pressing:

```text
Ctrl+C
```

This is a local preview only. It is not GitHub Pages, Vercel, DNS, Namecheap, production, or public launch.

## Desktop Review Rows

| Evidence ID | What To Check | Result State |
|---|---|---|
| SCHOME-VIS-DESKTOP-01 | Status chips visible: internal draft, publication NO-GO, no real money | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-02 | First viewport headline and CTAs do not overlap | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-03 | First viewport does not lead with blockchain/token/DeFi/stablecoin/XPR/FIO/LOAN/escrow release language | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-04 | Product cards do not imply live finance, loan approval, escrow custody, or provider approval | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-05 | Future Web3 layer stays lower on the page and framed as reviewed/future infrastructure | PENDING_CAPTURE |
| SCHOME-VIS-DESKTOP-06 | Review Boundary blocks publication, provider commitments, live finance, legal conclusions, and launch | PENDING_CAPTURE |

## Mobile Review Rows

| Evidence ID | What To Check | Result State |
|---|---|---|
| SCHOME-VIS-MOBILE-01 | Nav, status chips, headline, copy, and CTAs fit without horizontal overflow | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-02 | Hero text wraps cleanly and does not collide with fixed nav | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-03 | Status chips remain readable | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-04 | Product cards stack cleanly | PENDING_CAPTURE |
| SCHOME-VIS-MOBILE-05 | Review Boundary remains readable | PENDING_CAPTURE |

## Link And CTA Rows

| Evidence ID | Link / CTA | Expected Result | Result State |
|---|---|---|---|
| SCHOME-LINK-01 | Mission nav | Scrolls to `#mission` | PENDING_CLICK |
| SCHOME-LINK-02 | Products nav | Scrolls to `#products` | PENDING_CLICK |
| SCHOME-LINK-03 | Technology nav | Scrolls to `#technology` | PENDING_CLICK |
| SCHOME-LINK-04 | Review Gates nav | Scrolls to `#review` | PENDING_CLICK |
| SCHOME-LINK-05 | v1.3 Draft CTA | Opens `whitepaper-v1-3-draft.html` only | PENDING_CLICK |
| SCHOME-LINK-06 | Current Public Whitepaper CTA | Opens `whitepaper.html` without implying v1.3 publication | PENDING_CLICK |

## Screenshot Redaction Rules

Before any screenshot is shared or committed, confirm:

- no private email, phone, address, account ID, token, API key, password, wallet data, transaction hash, browser tab, extension, desktop notification, Magic Link, Supabase token, or service-role value is visible;
- browser URL shows local file or localhost only;
- the screenshot does not imply public launch, provider approval, legal clearance, payment approval, loan approval, escrow release, stablecoin settlement, token collateral, FIO registration, XPR signature, or Metallicus/XPR/LOAN partnership;
- any screenshot with private or ambiguous data is discarded or redacted before use.

Do not commit bulky screenshot files by default. Record screenshot filenames and results in docs only after redaction review.

## Result States

Use only these states:

- `PENDING_CAPTURE`;
- `PENDING_CLICK`;
- `PENDING_REDACTION_REVIEW`;
- `PASS_LOCAL_ONLY`;
- `ISSUE_FOUND`;
- `REDACT_OR_DISCARD`;
- `HOLD_NO_PUBLIC_USE`.

`PASS_LOCAL_ONLY` means local review evidence exists. It does not mean public publication is approved.

## Where To Record Results

| Result Type | Record In |
|---|---|
| Visual QA rows | `docs/smartcontractor-public-homepage-visual-qa-rollback-checklist-2026-06-03.md` |
| Current blocked or pending state | `docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md` |
| Founder publication decision | `docs/smartcontractor-public-homepage-founder-decision-packet-2026-06-03.md` |
| Claim-risk issues | `docs/smartcontractor-public-homepage-claim-risk-scan-2026-06-03.md` |

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

Use `C:\gcsc\index-v1-3-draft.html` directly or serve `C:\gcsc` locally on `127.0.0.1:43119` for browser QA. Keep every row pending until actual review evidence is recorded. Public `index.html` and `whitepaper.html` remain unchanged, and publication remains `NO-GO`.
