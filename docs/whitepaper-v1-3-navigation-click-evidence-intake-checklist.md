# GCSC Whitepaper v1.3 Navigation Click Evidence Intake Checklist

Status: internal navigation click evidence intake checklist. Manual click evidence remains PENDING.

This checklist does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This checklist controls how future browser click results move from local QA into the evidence ledger and issue register. It keeps static anchor readiness, the click QA handoff, and actual browser evidence separate.

## Intake Readiness

| Requirement | Current State | Source |
|---|---|---|
| navigation readiness closeout exists | READY_LOCAL_STATIC | `docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md` |
| navigation click QA handoff exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md` |
| issue register exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| publication evidence ledger exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-publication-evidence-current-status.md` |
| actual browser clicks recorded | PENDING | browser QA required |
| mobile viewport click review complete | PENDING | browser QA required |
| desktop viewport click review complete | PENDING | browser QA required |
| publication decision | NO-GO | separate publication decision required |

## Evidence ID Requirements

Every navigation click intake must map to one of these Evidence IDs:

| Evidence ID | Required File | Required Link Or Action | Required View |
|---|---|---|---|
| V13-NAV-WP-01 | `whitepaper-v1-3-draft.html` | `#summary` | Executive Summary visible |
| V13-NAV-WP-02 | `whitepaper-v1-3-draft.html` | `#product` | SmartContractor Product Layer visible |
| V13-NAV-WP-03 | `whitepaper-v1-3-draft.html` | `#partners` | Licensed Partner Model visible |
| V13-NAV-WP-04 | `whitepaper-v1-3-draft.html` | `#web3` | Future Regulated Web3 Layer visible |
| V13-NAV-WP-05 | `whitepaper-v1-3-draft.html` | `#gates` | Review Gates visible |
| V13-NAV-WP-06 | `whitepaper-v1-3-draft.html` | sidebar table of contents links | each target opens without broken anchor behavior |
| V13-NAV-HOME-01 | `index-v1-3-draft.html` | `#mission` | The Problem We Solve visible |
| V13-NAV-HOME-02 | `index-v1-3-draft.html` | `#products` | Product Layers visible |
| V13-NAV-HOME-03 | `index-v1-3-draft.html` | `#technology` | Future regulated Web3 infrastructure visible |
| V13-NAV-HOME-04 | `index-v1-3-draft.html` | `#review` | Review Boundary visible |
| V13-NAV-HOME-05 | `index-v1-3-draft.html` | `whitepaper-v1-3-draft.html` | local whitepaper draft opens, not the legacy public file |

## Browser Click Review

For each Evidence ID, record:

- browser name and version if available;
- viewport width and height;
- clicked link or action;
- expected section visible? yes/no;
- fixed navigation covers the heading? yes/no;
- horizontal overflow visible? yes/no;
- wrong file opened? yes/no;
- issue ID if any problem is found;
- screenshot Evidence ID if a screenshot is later captured and redaction-reviewed.

## Issue Routing

| Finding | Required Route |
|---|---|
| broken anchor | add HIGH issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| fixed navigation covers heading | add MEDIUM issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| mobile horizontal overflow | add HIGH issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| public file opened instead of local draft | add BLOCKER issue before any future public use |
| risky finance, escrow, stablecoin, token, FIO, XPR, Metallicus, Value Mirror, or AI decision wording appears during click path | add BLOCKER or HIGH issue with required safe wording |
| private data visible in a later screenshot | redact or discard; do not reference publicly |
| clean local navigation click | record Evidence ID, browser, viewport, date, reviewer, and PASS_LOCAL_ONLY |

## Acceptable Intake States

- PENDING_CLICK;
- PENDING_MOBILE_CLICK;
- PENDING_DESKTOP_CLICK;
- ISSUE_FOUND;
- NEEDS_LOCAL_FIX;
- PASS_LOCAL_ONLY;
- HOLD_NO_PUBLIC_USE.

No intake state can become publication approval, public replacement approval, legal/provider approval, provider commitment, partnership approval, or live-action approval.

## Stop Boundary

This checklist does not approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, website update, or investor/provider packet;
- treating browser clicks as founder approval, legal approval, provider approval, partnership approval, or publication approval;
- contacting providers or reviewers;
- creating accounts or changing external settings;
- activating any real payment, loan, escrow, stablecoin settlement, token collateral, wallet signature, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 action.
