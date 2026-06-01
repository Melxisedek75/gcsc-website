# GCSC Whitepaper v1.3 Screenshot Evidence Intake Checklist

Status: internal screenshot evidence intake checklist. Screenshot QA remains PENDING.

This checklist does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This checklist controls how future screenshot files move from founder capture into the local evidence manifest and QA issue register. It prevents raw screenshots, private data, browser tabs, account details, wallet data, payment data, or approval-sounding notes from becoming publication evidence without review.

## Intake Readiness

| Requirement | Current State | Source |
|---|---|---|
| screenshot handoff exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md` |
| screenshot manifest exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-screenshot-evidence-manifest.md` |
| visual QA evidence template exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-visual-qa-evidence-template.md` |
| issue register exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| publication evidence ledger exists | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-publication-evidence-current-status.md` |
| actual screenshot files captured | PENDING | founder-controlled local folder required |
| private-data review complete | PENDING | redaction review required |
| screenshot QA state | PENDING | no completed evidence recorded |
| publication decision | NO-GO | separate publication decision required |

## Evidence ID Requirements

Every screenshot intake must map to one of these Evidence IDs:

| Evidence ID | Required File | Required View |
|---|---|---|
| V13-WP-DESKTOP-01 | `whitepaper-v1-3-draft.html` | desktop top status boundary |
| V13-WP-DESKTOP-02 | `whitepaper-v1-3-draft.html` | desktop Web3/FIO/Metallicus review-required sections |
| V13-WP-MOBILE-01 | `whitepaper-v1-3-draft.html` | mobile top status boundary |
| V13-WP-MOBILE-02 | `whitepaper-v1-3-draft.html` | mobile wrapping and no horizontal overflow |
| V13-HOME-DESKTOP-01 | `index-v1-3-draft.html` | desktop first viewport and publication gate |
| V13-HOME-MOBILE-01 | `index-v1-3-draft.html` | mobile first viewport and publication gate |

## Redaction Review

Before any screenshot can be referenced outside local founder/admin review, confirm:

- browser tabs do not reveal private accounts, email, docs, wallets, dashboards, or unrelated work;
- URLs do not expose tokens, private routes, account IDs, invite codes, or internal-only live links;
- no wallet address, seed phrase, private key, signature request, payment account, card data, bank data, or API key is visible;
- no homeowner, contractor, customer, property address, email, phone, license number, EIN, or private project data is visible;
- no live provider dashboard, Supabase dashboard, GitHub token, deployment secret, or paid-service account is visible;
- any crop, blur, or redaction is recorded as a local note before sharing.

## Issue Routing

| Finding | Required Route |
|---|---|
| layout overlap or mobile overflow | add issue to `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| missing NO-GO boundary | add BLOCKER issue before any future public use |
| risky lending, escrow, stablecoin, token, FIO, XPR, Metallicus, Value Mirror, or AI decision wording | add BLOCKER or HIGH issue with required safe wording |
| private data visible | keep screenshot local, redact or discard, and do not reference publicly |
| public-file screenshot captured by mistake | mark scan-only and do not treat as v1.3 publication evidence |
| clean local draft screenshot | record Evidence ID, filename, viewport, date, reviewer, and PASS_LOCAL_ONLY |

## Acceptable Intake States

- PENDING_CAPTURE;
- PENDING_REDACTION_REVIEW;
- ISSUE_FOUND;
- REDACT_OR_DISCARD;
- PASS_LOCAL_ONLY;
- HOLD_NO_PUBLIC_USE.

No intake state can become publication approval, public replacement approval, legal/provider approval, provider commitment, partnership approval, or live-action approval.

## Stop Boundary

This checklist does not approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, website update, or investor/provider packet;
- treating screenshots as founder approval, legal approval, provider approval, partnership approval, or publication approval;
- contacting providers or reviewers;
- creating accounts or changing external settings;
- activating any real payment, loan, escrow, stablecoin settlement, token collateral, wallet signature, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 action.
