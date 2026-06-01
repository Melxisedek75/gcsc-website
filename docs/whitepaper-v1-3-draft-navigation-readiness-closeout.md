# GCSC Whitepaper v1.3 Draft Navigation Readiness Closeout

Status: internal draft navigation readiness closeout. This is static QA only.

This closeout does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This closeout confirms that the local v1.3 draft navigation targets are statically mapped and ready for future browser click testing. It does not claim manual click QA, screenshot QA, mobile visual QA, or publication readiness is complete.

## Files Checked

| File | Current Role | Allowed Action |
|---|---|---|
| `whitepaper-v1-3-draft.html` | local whitepaper draft | static anchor validation and local polish only |
| `index-v1-3-draft.html` | local homepage draft | static anchor validation and local polish only |
| `whitepaper.html` | legacy public whitepaper | scan only |
| `index.html` | legacy public homepage | scan only |

## Whitepaper Draft Anchor Map

| Link Group | Required Targets | Current State |
|---|---|---|
| top navigation | `#summary`, `#product`, `#partners`, `#web3`, `#gates` | PASS_LOCAL_STATIC |
| sidebar table of contents | `#summary`, `#problem`, `#product`, `#milestones`, `#capital`, `#partners`, `#web3`, `#fio`, `#metal`, `#value-mirror`, `#gates` | PASS_LOCAL_STATIC |
| public file links | `index.html`, `whitepaper.html` | SCAN_ONLY_BOUNDARY |

## Homepage Draft Anchor Map

| Link Group | Required Targets | Current State |
|---|---|---|
| top navigation | `#mission`, `#products`, `#technology`, `#review` | PASS_LOCAL_STATIC |
| hero and CTA links | `#products`, `whitepaper-v1-3-draft.html`, `whitepaper.html` | PASS_LOCAL_STATIC |
| public file links | `whitepaper.html` | SCAN_ONLY_BOUNDARY |

## Manual QA Still Required

- browser click check for every in-page anchor;
- keyboard focus check for top navigation and call-to-action links;
- desktop screenshot of the opened target sections;
- mobile screenshot after anchor jumps;
- confirmation that fixed navigation does not cover the target heading;
- redaction review before any screenshot reference is used outside local founder/admin review.

## Current Limitation

Navigation readiness is PASS_LOCAL_STATIC only. Manual browser click evidence and screenshot evidence are PENDING.

## Stop Boundary

Do not use this closeout to infer permission for:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, investor packet, provider packet, or website update;
- changing public website routing;
- contacting providers or reviewers;
- creating accounts or changing external settings;
- making legal, securities, lending, escrow, money-transmission, tax, insurance, appraisal, or contractor-licensing conclusions;
- touching live Supabase;
- activating real payment, loan, escrow, repayment routing, stablecoin settlement, token collateral, wallet signature, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 action.
