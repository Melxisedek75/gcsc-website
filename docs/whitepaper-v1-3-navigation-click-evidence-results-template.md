# GCSC Whitepaper v1.3 Navigation Click Evidence Results Template

Status: internal navigation click evidence results template. No browser click evidence is recorded.

This template does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This template is for the future manual browser-click run after a founder or reviewer opens the local v1.3 draft files. It records click results without turning them into publication approval.

## Required Inputs

| Input | Current State | Source |
|---|---|---|
| navigation readiness closeout | READY_LOCAL_STATIC | `docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md` |
| navigation click QA handoff | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md` |
| navigation click evidence intake checklist | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md` |
| issue register | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| publication evidence ledger | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-publication-evidence-current-status.md` |
| actual browser click run | PENDING | not captured |
| publication decision | NO-GO | separate founder publication record required |

## Run Record Template

| Field | Value |
|---|---|
| run date | TO_FILL |
| reviewer | TO_FILL |
| browser | TO_FILL |
| browser version | TO_FILL |
| desktop viewport | TO_FILL |
| mobile viewport | TO_FILL |
| local file source | TO_FILL |
| screenshots captured? | NO by default |
| screenshot redaction reviewed? | PENDING |
| issues found? | PENDING |
| publication decision | NO-GO |

## Click Results Template

| Evidence ID | Local File | Click Target | Viewport | Expected Result | Result State | Issue ID |
|---|---|---|---|---|---|---|
| V13-NAV-WP-01 | `whitepaper-v1-3-draft.html` | `#summary` | desktop/mobile | Executive Summary visible | PENDING_CLICK | TO_FILL |
| V13-NAV-WP-02 | `whitepaper-v1-3-draft.html` | `#product` | desktop/mobile | SmartContractor Product Layer visible | PENDING_CLICK | TO_FILL |
| V13-NAV-WP-03 | `whitepaper-v1-3-draft.html` | `#partners` | desktop/mobile | Licensed Partner Model visible | PENDING_CLICK | TO_FILL |
| V13-NAV-WP-04 | `whitepaper-v1-3-draft.html` | `#web3` | desktop/mobile | Future Regulated Web3 Layer visible | PENDING_CLICK | TO_FILL |
| V13-NAV-WP-05 | `whitepaper-v1-3-draft.html` | `#gates` | desktop/mobile | Review Gates visible | PENDING_CLICK | TO_FILL |
| V13-NAV-WP-06 | `whitepaper-v1-3-draft.html` | sidebar table of contents links | desktop/mobile | each target opens without broken anchor behavior | PENDING_CLICK | TO_FILL |
| V13-NAV-HOME-01 | `index-v1-3-draft.html` | `#mission` | desktop/mobile | The Problem We Solve visible | PENDING_CLICK | TO_FILL |
| V13-NAV-HOME-02 | `index-v1-3-draft.html` | `#products` | desktop/mobile | Product Layers visible | PENDING_CLICK | TO_FILL |
| V13-NAV-HOME-03 | `index-v1-3-draft.html` | `#technology` | desktop/mobile | Future regulated Web3 infrastructure visible | PENDING_CLICK | TO_FILL |
| V13-NAV-HOME-04 | `index-v1-3-draft.html` | `#review` | desktop/mobile | Review Boundary visible | PENDING_CLICK | TO_FILL |
| V13-NAV-HOME-05 | `index-v1-3-draft.html` | `whitepaper-v1-3-draft.html` | desktop/mobile | local whitepaper draft opens, not the legacy public file | PENDING_CLICK | TO_FILL |

## Result State Rules

- PENDING_CLICK means no browser result exists.
- PASS_LOCAL_ONLY means the link worked locally and does not approve publication.
- ISSUE_FOUND means the issue must be routed to `docs/whitepaper-v1-3-draft-qa-issue-register.md`.
- NEEDS_LOCAL_FIX means the local draft needs a repair before another click pass.
- HOLD_NO_PUBLIC_USE means the evidence cannot support public replacement.

## Required Before Any PASS_LOCAL_ONLY

- desktop and mobile click path is recorded;
- expected section is visible;
- fixed navigation does not cover the heading;
- no horizontal overflow is visible;
- wrong public file is not opened;
- any screenshot is redaction-reviewed before reference;
- publication evidence ledger still says NO-GO.

## Stop Boundary

Do not use this template to infer permission for:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, website update, or investor/provider packet;
- treating browser clicks as founder approval, legal approval, provider approval, partnership approval, or publication approval;
- contacting providers or reviewers;
- creating accounts or changing external settings;
- activating any real payment, loan, escrow, stablecoin settlement, token collateral, wallet signature, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 action.
