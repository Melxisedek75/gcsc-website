# SmartContractor Public Homepage Visual QA And Rollback Checklist

Status: internal homepage QA and rollback checklist. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, Metallicus/XPR/LOAN partnership claims, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Date context: prepared during founder-present evening mode on 2026-06-03 PT after local homepage wording was tightened for traditional-first public review.

## Purpose

Give the founder a precise checklist for reviewing the local homepage draft visually and preparing rollback evidence before any future public homepage replacement.

This file is not evidence that visual QA has passed. It defines the evidence that must be collected.

## Current Publication State

| Area | State |
|---|---|
| Local homepage draft review | READY_FOR_VISUAL_QA |
| Public `index.html` replacement | NO-GO |
| Public `whitepaper.html` replacement | NO-GO |
| GitHub Pages / Vercel / DNS change | NO-GO |
| External announcement / provider packet | NO-GO |
| Live finance / escrow / payment / Web3 action | NO-GO |

## Required Local Review Targets

| Target | Local Path Or URL | Purpose |
|---|---|---|
| Homepage draft file | `index-v1-3-draft.html` | Main visual QA target |
| Browser URL if local static server is active | `http://127.0.0.1:43118/index-v1-3-draft.html` | Quick in-app browser review target |
| Draft whitepaper CTA target | `whitepaper-v1-3-draft.html` | CTA link review only, not publication |
| Current public whitepaper CTA target | `whitepaper.html` | Confirm legacy route is still intentionally linked |

If the local static server URL is unavailable, use the file directly or restart the local static preview. Do not change deploy settings.

## Desktop Visual QA Evidence

| Evidence ID | Viewport | Required Result | Status |
|---|---|---|---|
| SCHOME-VIS-DESKTOP-01 | 1440 x 900 | Top status chips are visible: internal draft, publication NO-GO, no real money | PENDING_VISUAL_QA |
| SCHOME-VIS-DESKTOP-02 | 1440 x 900 | First viewport headline is readable and does not overlap nav, chips, CTAs, or visual panel | PENDING_VISUAL_QA |
| SCHOME-VIS-DESKTOP-03 | 1440 x 900 | First viewport does not lead with blockchain, token, DeFi, stablecoin, XPR, FIO, LOAN, or escrow release language | PENDING_VISUAL_QA |
| SCHOME-VIS-DESKTOP-04 | 1440 x 900 | Product cards show SmartContractor, Partner Layer, and Future Web3 Layer without implying live finance | PENDING_VISUAL_QA |
| SCHOME-VIS-DESKTOP-05 | 1440 x 900 | Technology section keeps Web3 lower on the page and framed as future candidate infrastructure | PENDING_VISUAL_QA |
| SCHOME-VIS-DESKTOP-06 | 1440 x 900 | Review Boundary section is visible and blocks publication, provider commitments, live finance, legal conclusions, and launch | PENDING_VISUAL_QA |

## Mobile Visual QA Evidence

| Evidence ID | Viewport | Required Result | Status |
|---|---|---|---|
| SCHOME-VIS-MOBILE-01 | 390 x 844 | Nav, status chips, headline, paragraph, and CTAs fit without horizontal overflow | PENDING_VISUAL_QA |
| SCHOME-VIS-MOBILE-02 | 390 x 844 | Hero text wraps cleanly and does not collide with fixed nav | PENDING_VISUAL_QA |
| SCHOME-VIS-MOBILE-03 | 390 x 844 | Status chips remain readable and do not crowd the first viewport beyond usability | PENDING_VISUAL_QA |
| SCHOME-VIS-MOBILE-04 | 390 x 844 | Product cards stack cleanly and no card text overflows | PENDING_VISUAL_QA |
| SCHOME-VIS-MOBILE-05 | 390 x 844 | Review Boundary text remains readable without clipped lines | PENDING_VISUAL_QA |

## Link And CTA QA

| Link / CTA | Expected Target | Required Result | Status |
|---|---|---|---|
| Nav: Mission | `#mission` | Scrolls to problem section | PENDING_LINK_QA |
| Nav: Products | `#products` | Scrolls to product layers | PENDING_LINK_QA |
| Nav: Technology | `#technology` | Scrolls to future reviewed technology section | PENDING_LINK_QA |
| Nav: Review Gates | `#review` | Scrolls to review boundary | PENDING_LINK_QA |
| CTA: v1.3 Draft | `whitepaper-v1-3-draft.html` | Opens local draft whitepaper only | PENDING_LINK_QA |
| CTA: View Product Layers | `#products` | Scrolls to product layers | PENDING_LINK_QA |
| CTA: Current Public Whitepaper | `whitepaper.html` | Opens current public whitepaper route; does not imply v1.3 publication | PENDING_LINK_QA |

## External Asset Review

| Asset | Current Use | Review Question | Status |
|---|---|---|---|
| Tailwind CDN | `https://cdn.tailwindcss.com` | Is CDN acceptable for public site, or should CSS be compiled/static before publication? | PENDING_FOUNDER_TECH_DECISION |
| Google Fonts | `fonts.googleapis.com` | Is external font loading acceptable for public site privacy/performance, or should fonts be self-hosted/system? | PENDING_FOUNDER_TECH_DECISION |
| No image assets | Visual panel is CSS/text only | Is this acceptable, or should a real construction/product screenshot be added before publication? | PENDING_FOUNDER_DESIGN_DECISION |

## Public Wording QA

| Claim Area | Required Public Result | Status |
|---|---|---|
| First viewport | Traditional construction trust infrastructure first; no blockchain-first or token-first pitch | PENDING_WORDING_QA |
| Working capital | Readiness/provider-review only; no GCSC origination, approval, funding, servicing, or guarantee | PENDING_WORDING_QA |
| Escrow | Escrow-ready records only; no GCSC custody, release, refund, or money movement | PENDING_WORDING_QA |
| Providers | Future/reviewed/after-approval only; no signed provider or partnership implication | PENDING_WORDING_QA |
| Web3 | Lower page, future candidate infrastructure only; no live settlement, wallet, FIO, XPR, token, stablecoin, or collateral claim | PENDING_WORDING_QA |
| Reputation | Readiness/provider-review data only; no collateral, financial asset, automated credit decision, or guaranteed qualification | PENDING_WORDING_QA |
| Review boundary | Public publication, provider commitments, legal conclusions, live finance, and public launch remain blocked | PENDING_WORDING_QA |

## Rollback Preparation Before Any Future Public Edit

These steps are preparation only. Do not execute them until `PUBLICATION_GO` exists.

| Step | Required Before Public Edit | Status |
|---|---|---|
| Record current commit | Save commit hash before public edit | PENDING_PUBLICATION_GO |
| Archive current public homepage | Prepare exact archive path such as `index-v1-0-archive.html` | PENDING_PUBLICATION_GO |
| Prepare public diff | Generate exact diff from `index-v1-3-draft.html` to public `index.html` | PENDING_PUBLICATION_GO |
| Prepare rollback command record | Document how to restore the archived public homepage without destructive reset | PENDING_PUBLICATION_GO |
| Prepare post-publication smoke checklist | Confirm live URL, links, mobile layout, public wording, and rollback path | PENDING_PUBLICATION_GO |
| Founder approval record | Store explicit `PUBLICATION_GO` and date | PENDING_FOUNDER_DECISION |

## Founder Decision Options

| Decision | Meaning | Next Local Action |
|---|---|---|
| `APPROVE_VISUAL_QA_SCOPE_ONLY` | This checklist covers the right evidence. | Run visual QA locally and fill evidence rows. |
| `REQUEST_QA_SCOPE_CHANGES` | Add or remove QA targets before review. | Revise this checklist only. |
| `KEEP_PUBLIC_REPLACEMENT_ON_HOLD` | Continue internal prep but do not approach publication. | Keep public files unchanged. |
| `PUBLICATION_GO` | Explicit future approval after all evidence is complete. | Prepare exact public edit package; still stop before live/deploy/account actions. |

`APPROVE_VISUAL_QA_SCOPE_ONLY` is not publication approval.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming visual QA has passed without recorded screenshot/manual evidence;
- claiming legal/provider review is complete;
- enabling real payments, real loans, escrow custody, repayment routing, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production release.

## Working Summary

The local homepage draft is ready for visual QA scope review. The founder still needs to approve the visual QA scope, review the captured evidence, approve the public promise, and separately record `PUBLICATION_GO` before any public homepage replacement can happen.
