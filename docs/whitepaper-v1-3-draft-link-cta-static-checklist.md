# GCSC Whitepaper v1.3 Draft Link CTA Static Checklist

Status: internal draft link and CTA static checklist. Browser click QA remains PENDING_BROWSER_CLICK_REVIEW. Mobile tap QA remains PENDING_MOBILE_TAP_REVIEW. Current publication decision remains NO-GO.

This checklist does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This checklist verifies the local v1.3 draft links and CTA boundaries before any browser click evidence exists. It keeps static link safety separate from actual desktop/mobile click QA, screenshot QA, founder approval, legal/provider review, and public routing decisions.

## Files Checked

| File | Current Role | Allowed Action |
|---|---|---|
| `whitepaper-v1-3-draft.html` | local whitepaper draft | static link and CTA validation only |
| `index-v1-3-draft.html` | local homepage draft | static link and CTA validation only |
| `whitepaper.html` | legacy public whitepaper | scan-only reference, not v1.3 publication |
| `index.html` | legacy public homepage | scan-only reference, not v1.3 publication |
| `docs/whitepaper-v1-3-draft-static-asset-manifest.md` | external asset boundary | Google Fonts and Tailwind CDN remain draft-only review items |

## Static Link And CTA Checks

| Check | Current State | Notes |
|---|---|---|
| whitepaper draft in-page anchors resolve | PASS_STATIC | `#summary`, `#product`, `#partners`, `#web3`, `#gates`, and table-of-contents anchors map to existing section IDs |
| homepage draft in-page anchors resolve | PASS_STATIC | `#mission`, `#products`, `#technology`, `#review`, and `#products` CTA map to existing section IDs |
| homepage draft opens local whitepaper draft | PASS_STATIC | `whitepaper-v1-3-draft.html` is present for `v1.3 Draft`, `Read v1.3 Draft`, and `Review Draft` links |
| current public whitepaper links are labelled | PASS_STATIC_LEGACY_REFERENCE | `whitepaper.html` links are labelled `Current Public Whitepaper` and remain legacy public references only |
| legacy public homepage link is scan-only | PASS_STATIC_SCAN_ONLY_BOUNDARY | `index.html` appears only as a legacy website reference from the local whitepaper draft |
| external provider action links are absent | PASS_STATIC | no FIO, XPR, WebAuth, Metal, Metallicus, lending, escrow, wallet, registration, signature, or payment action URL is present |
| mailto, tel, form, onclick, target blank, and download actions are absent | PASS_STATIC | no contact form, direct email, phone, browser action handler, new-tab action, or downloadable publication CTA is present |
| publication, replacement, provider outreach, and live finance CTAs are absent | PASS_STATIC | no CTA claims public replacement, provider approval, live loans, live escrow, stablecoin settlement, token collateral, wallet connection, FIO registration, or XPR signature |
| browser click review | PENDING_BROWSER_CLICK_REVIEW | static checks do not prove click behavior, focus position, fixed navigation offset, or target visibility |
| mobile tap review | PENDING_MOBILE_TAP_REVIEW | static checks do not prove mobile tap behavior, mobile overflow, or touch target usability |

## Manual Click Checks Still Required

- open `whitepaper-v1-3-draft.html` locally and click every top navigation, table-of-contents, legacy website, and current public whitepaper link;
- open `index-v1-3-draft.html` locally and click every top navigation, hero CTA, review CTA, local draft CTA, and current public whitepaper link;
- record desktop and mobile viewport results through `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md`;
- route any broken anchor, wrong-file opening, fixed-header overlap, horizontal overflow, or risky CTA wording into `docs/whitepaper-v1-3-draft-qa-issue-register.md`;
- keep screenshot evidence, browser report rows, and issue intake separate until redaction review and browser QA evidence exist.

## Required Source Documents

- `docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md`;
- `docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md`;
- `docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md`;
- `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md`;
- `docs/whitepaper-v1-3-browser-qa-evidence-flow.md`;
- `docs/whitepaper-v1-3-draft-static-asset-manifest.md`;
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`;
- `docs/whitepaper-v1-3-publication-gate.md`.

## Stop Boundary

Do not use this checklist to infer:

- completed browser click QA;
- completed mobile tap QA;
- screenshot evidence;
- CTA approval for publication;
- public routing approval;
- public file replacement permission;
- legal/provider approval;
- provider outreach approval;
- partnership approval;
- live payment, live loan, escrow, stablecoin settlement, token collateral, wallet connection, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 permission.
