# GCSC Whitepaper v1.3 Local Draft QA Readiness Scorecard

Status: internal local draft QA readiness scorecard. Current publication decision remains NO-GO.

This scorecard does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This scorecard gives the founder a single local QA view for `whitepaper-v1-3-draft.html`, `index-v1-3-draft.html`, `whitepaper-v1-3-draft.css`, and the related v1.3 evidence controls. It separates local readiness from publication readiness.

## Local Draft QA Inputs

| Input | Current State | Source |
|---|---|---|
| draft HTML smoke check | PASS_LOCAL | `npm run check:whitepaper-v1-3-draft-html-smoke` |
| draft CSS QA check | PASS_LOCAL | `npm run check:whitepaper-v1-3-draft-css-qa` |
| public wording scan status | PASS_LOCAL_WITH_PUBLIC_FILES_SCAN_ONLY | `docs/whitepaper-v1-3-public-wording-scan-current-status.md` |
| draft navigation readiness closeout | PASS_LOCAL_STATIC_ONLY | `docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md` |
| draft navigation click QA handoff | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md` |
| navigation click evidence intake checklist | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md` |
| navigation click evidence results template | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-navigation-click-evidence-results-template.md` |
| screenshot QA handoff | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md` |
| screenshot evidence manifest | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-screenshot-evidence-manifest.md` |
| screenshot evidence intake checklist | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md` |
| screenshot evidence results template | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-screenshot-evidence-results-template.md` |
| draft QA issue register | READY_LOCAL_TEMPLATE | `docs/whitepaper-v1-3-draft-qa-issue-register.md` |
| publication blocker matrix | ACTIVE_NO_GO_CONTROL | `docs/whitepaper-v1-3-publication-blocker-status-matrix.md` |
| public draft files | LOCAL_DRAFT_ONLY | `whitepaper-v1-3-draft.html` and `index-v1-3-draft.html` |
| public site files | UNCHANGED_SCAN_ONLY | `whitepaper.html` and `index.html` |

## Readiness Score

| Area | Score | Reason |
|---|---|---|
| local static checks | PASS_LOCAL | local validators pass for draft structure, CSS safety, and claim boundaries |
| navigation and anchor readiness | PASS_LOCAL_STATIC | local anchors and draft links are statically mapped, but browser click evidence remains pending |
| navigation click QA handoff | READY_LOCAL_TEMPLATE | browser click Evidence IDs and issue routing are prepared, but clicks are not recorded |
| navigation click evidence intake | READY_LOCAL_TEMPLATE | future browser click results have intake states and issue routing, but no click evidence is recorded |
| navigation click evidence results | READY_LOCAL_TEMPLATE | future result rows are prepared, but every Evidence ID remains PENDING_CLICK |
| local evidence templates | PASS_LOCAL | handoff, manifest, intake, and issue-register templates are prepared |
| screenshot evidence | PENDING | screenshots are not captured or redaction-reviewed yet |
| screenshot evidence results | READY_LOCAL_TEMPLATE | future screenshot result rows are prepared, but every Evidence ID remains PENDING_CAPTURE |
| legal/provider evidence | PENDING | no written reviewer/provider response is recorded |
| founder publication record | PENDING | no separate dated publication record exists |
| public replacement readiness | NO-GO | required screenshot, archive, rollback, founder, legal/provider, and public-wording evidence is incomplete |

## Required Before Any Future Public Use

- screenshot Evidence IDs are captured and mapped;
- navigation click Evidence IDs are clicked and mapped;
- screenshot private-data review is complete;
- every issue in `docs/whitepaper-v1-3-draft-qa-issue-register.md` is FIXED_LOCAL or explicitly held;
- legal/provider review is recorded for regulated wording;
- archive copy and rollback proof are recorded;
- founder publication record is completed separately;
- publication blocker matrix no longer has unresolved public-file blockers.

## Safe Next QA Actions

- keep local validators green;
- run browser click checks later for draft navigation and table-of-contents anchors;
- capture screenshots only in a founder-controlled local folder;
- run redaction review before referencing screenshots outside local notes;
- route visual or wording problems into the draft QA issue register;
- keep `whitepaper.html` and `index.html` unchanged until a separate publication record exists.

## Stop Boundary

This scorecard does not approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF, deck, social post, email, website update, or investor/provider packet;
- marking screenshot QA, legal/provider review, founder publication approval, public replacement, or live action as complete;
- contacting providers or reviewers;
- creating accounts or changing external settings;
- activating any real payment, loan, escrow, stablecoin settlement, token collateral, wallet signature, FIO registration, XPR signature, minting, staking, bridging, swap, transfer, or production Web3 action.
