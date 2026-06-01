# GCSC Whitepaper v1.3 Draft Navigation Click QA Handoff

Status: internal draft navigation click QA handoff. Manual click QA remains PENDING.

This handoff does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This handoff gives the future browser tester one safe checklist for clicking local v1.3 draft navigation. It does not run browser automation, does not record screenshots, and does not turn static anchor readiness into publication evidence.

## Files To Open

| File | Test Mode | Boundary |
|---|---|---|
| `whitepaper-v1-3-draft.html` | local browser click QA | local draft only |
| `index-v1-3-draft.html` | local browser click QA | local draft only |
| `whitepaper.html` | do not test as v1.3 | legacy public scan-only |
| `index.html` | do not test as v1.3 | legacy public scan-only |

## Whitepaper Click Sequence

Open `whitepaper-v1-3-draft.html` locally and click these links:

| Evidence ID | Link | Expected Result | Current State |
|---|---|---|---|
| V13-NAV-WP-01 | `#summary` | Executive Summary section is visible | PENDING_CLICK |
| V13-NAV-WP-02 | `#product` | SmartContractor Product Layer section is visible | PENDING_CLICK |
| V13-NAV-WP-03 | `#partners` | Licensed Partner Model section is visible | PENDING_CLICK |
| V13-NAV-WP-04 | `#web3` | Future Regulated Web3 Layer section is visible | PENDING_CLICK |
| V13-NAV-WP-05 | `#gates` | Review Gates section is visible | PENDING_CLICK |
| V13-NAV-WP-06 | sidebar table of contents links | each target section opens without broken anchor behavior | PENDING_CLICK |

## Homepage Click Sequence

Open `index-v1-3-draft.html` locally and click these links:

| Evidence ID | Link | Expected Result | Current State |
|---|---|---|---|
| V13-NAV-HOME-01 | `#mission` | The Problem We Solve section is visible | PENDING_CLICK |
| V13-NAV-HOME-02 | `#products` | Product Layers section is visible | PENDING_CLICK |
| V13-NAV-HOME-03 | `#technology` | Future regulated Web3 infrastructure section is visible | PENDING_CLICK |
| V13-NAV-HOME-04 | `#review` | Review Boundary section is visible | PENDING_CLICK |
| V13-NAV-HOME-05 | `whitepaper-v1-3-draft.html` | local whitepaper draft opens, not the legacy public file | PENDING_CLICK |

## What To Record

For each Evidence ID, record:

- browser used;
- viewport width;
- clicked link;
- target section visible? yes/no;
- fixed navigation covers heading? yes/no;
- horizontal overflow? yes/no;
- screenshot filename, if captured later;
- redaction status, if screenshot exists;
- issue ID if any problem is found.

## Issue Routing

| Finding | Required Route |
|---|---|
| broken anchor | add HIGH issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| fixed navigation covers heading | add MEDIUM issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| mobile horizontal overflow | add HIGH issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| public file opened instead of local draft | add BLOCKER issue before publication use |
| private data visible in screenshot | redact or discard; do not reference publicly |

## Required Before Any PASS

- every Evidence ID above is clicked in a browser;
- mobile and desktop viewports are checked;
- any screenshot is redaction-reviewed before evidence use;
- every issue is logged or explicitly held;
- publication evidence ledger still says NO-GO.

## Stop Boundary

Do not use this handoff to infer permission for:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, investor packet, provider packet, or website update;
- changing public website routing;
- contacting providers or reviewers;
- creating accounts or changing external settings;
- making legal, securities, lending, escrow, money-transmission, tax, insurance, appraisal, or contractor-licensing conclusions;
- touching live Supabase;
- activating real payment, loan, escrow, repayment routing, stablecoin settlement, token collateral, wallet signature, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 action.
