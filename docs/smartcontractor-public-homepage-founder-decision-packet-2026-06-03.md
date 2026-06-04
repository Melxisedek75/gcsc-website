# SmartContractor Public Homepage Founder Decision Packet

Status: internal founder decision packet. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Give the founder one page for deciding what can move forward before the end-of-week homepage redesign work.

This packet connects:

- founder copy review;
- publication readiness gate;
- claim-risk scan;
- desktop/mobile visual QA checklist;
- rollback preparation;
- exact decision phrases.

It keeps the project aligned with the founder direction: public positioning should be traditional construction trust infrastructure first, while future blockchain/Web3/provider specifics stay hidden from homepage copy, private, provider-reviewed, and founder-review-only unless separately approved.

## Current Conclusion

| Area | Current State | Meaning |
|---|---|---|
| Local homepage copy direction | READY_FOR_FOUNDER_COPY_DECISION | The message is traditional-first and can be reviewed. |
| Local visual QA evidence | PASS_INTERNAL_BROWSER_SESSION | Desktop/mobile screenshots, CTA click, DOM, and console evidence were captured for the local draft. |
| Claim-risk posture | REVIEW_LOCAL_PASS | The homepage draft has local risky-term and claim scans, but final public-copy scan is still required. |
| Rollback preparation | DEFINED_NOT_EXECUTED | Rollback steps are listed, but no public edit is approved. |
| Public homepage replacement | NO-GO | Public `index.html` stays unchanged. |
| Public whitepaper replacement | NO-GO | Public `whitepaper.html` stays unchanged. |
| Live provider/finance/Web3 actions | NO-GO | No external, legal, provider, money, wallet, or deploy action is approved. |

## What The Founder Can Approve Now

The founder can safely approve or revise these internal items:

| Decision Area | Safe Decision | What It Allows |
|---|---|---|
| Public promise | `APPROVE_COPY_DIRECTION_ONLY` or `REQUEST_REVISIONS` | Continue local homepage QA and wording cleanup. |
| Section order | `APPROVE_SECTION_ORDER_ONLY` or `REQUEST_SECTION_ORDER_REVISIONS` | Keep or revise the draft page structure. |
| Future infrastructure visibility | `APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE` or `REQUEST_INFRASTRUCTURE_LANGUAGE_REVISIONS` | Decide whether the current generic/private wording is hidden enough. |
| Browser QA evidence | `ACCEPT_LOCAL_BROWSER_QA_EVIDENCE` or `REQUEST_MORE_QA` | Accept or expand the local desktop/mobile browser evidence. |
| Public replacement | `KEEP_PUBLIC_REPLACEMENT_ON_HOLD` | Continue internal prep without editing public files. |

None of these decisions approve publication.

## Exact Phrases

Use these exact phrases to avoid accidental publication approval:

| Phrase | Meaning |
|---|---|
| `APPROVE_COPY_DIRECTION_ONLY` | Founder likes the traditional-first message for internal preparation. |
| `REQUEST_REVISIONS` | Founder wants copy changes before QA or publication prep continues. |
| `APPROVE_SECTION_ORDER_ONLY` | Founder likes the draft page flow for internal preparation. |
| `APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE` | Future infrastructure stays generic/private; explicit ecosystem/provider terms stay off homepage copy. |
| `REQUEST_INFRASTRUCTURE_LANGUAGE_REVISIONS` | Founder wants the future infrastructure wording revised before public prep continues. |
| `ACCEPT_LOCAL_BROWSER_QA_EVIDENCE` | Founder accepts current local browser evidence for internal review only. |
| `KEEP_PUBLIC_REPLACEMENT_ON_HOLD` | Public files remain unchanged. |
| `PUBLICATION_GO` | Separate future approval after all evidence is complete. |

`PUBLICATION_GO` must be standalone and explicit. Do not infer it from any other approval phrase.

## Recommended Founder Decision Tonight

Recommended:

```text
APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION
APPROVE_SECTION_ORDER_ONLY
APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE
ACCEPT_LOCAL_BROWSER_QA_EVIDENCE
KEEP_PUBLIC_REPLACEMENT_ON_HOLD
```

Reason:

- the draft is now aligned with construction trust infrastructure first;
- the future infrastructure path is preserved internally without making it the public promise;
- local browser QA evidence is now captured;
- public files remain protected until publication evidence is complete.

## End-Of-Week Sequence

| Step | Owner | Status | Stop Boundary |
|---|---|---|---|
| 1. Founder copy decision | Founder | Pending | Does not publish. |
| 2. Founder browser QA evidence decision | Founder | Pending | Does not publish. |
| 3. Desktop/mobile visual QA evidence | Codex | Complete for local draft | No public edit. |
| 4. Final claim-risk scan against exact public replacement copy | Codex | Pending after final diff | No legal/provider conclusion. |
| 5. Public wording diff package | Codex | Pending after prior evidence | No public edit without `PUBLICATION_GO`. |
| 6. Archive/rollback evidence | Codex | Pending after prior evidence | No destructive git reset. |
| 7. Founder publication decision | Founder | Pending | Requires standalone `PUBLICATION_GO`. |
| 8. Public homepage replacement package | Codex | Blocked until `PUBLICATION_GO` | Still no deploy/account/provider/live-money action. |

## Public Story To Preserve

The public homepage should say:

```text
GCSC / SmartContractor helps homeowners and contractors organize verified project records, milestone evidence, dispute packets, request IDs, and partner-reviewed readiness data.
```

It should not say:

```text
GCSC provides loans, holds escrow, releases funds, settles stablecoins, locks token collateral, guarantees contractor qualification, or has approved Metallicus/XPR/FIO/WebAuth/LOAN provider partnerships.
```

## Future Infrastructure Plug-In Position

The future architecture can remain in internal and lower-page language as:

```text
Future reviewed infrastructure candidates may support construction records, identity UX, audit references, and regulated provider paths after founder, legal, provider, licensing, and technical review.
```

This preserves the plug-in path without claiming:

- live external infrastructure operation;
- live regulated financial products;
- live payment or financing activity;
- provider approval;
- legal clearance;
- public launch.

## Assets And Design Decisions Still Pending

| Topic | Decision Needed |
|---|---|
| Tailwind CDN | Keep CDN for draft only or compile/static CSS before public use. |
| Google Fonts | Keep external fonts or switch to self-hosted/system fonts. |
| Real product/construction visuals | Decide whether the first public homepage should include real screenshots/images instead of CSS-only panels. |
| Public CTA wording | Decide whether homepage should link first to SmartContractor product, whitepaper draft, or founder-review packet. |
| Current public whitepaper link | Decide whether `whitepaper.html` remains current public route until v1.3 publication. |

These are founder/design/tech decisions, not autonomous publication approvals.

## Files To Review

| File | Purpose |
|---|---|
| `index-v1-3-draft.html` | Local homepage draft. |
| `docs/smartcontractor-public-homepage-founder-review-draft-2026-06-03.md` | Founder copy and section review. |
| `docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md` | Publication evidence gate. |
| `docs/smartcontractor-public-homepage-claim-risk-scan-2026-06-03.md` | Claim-risk scan. |
| `docs/smartcontractor-public-homepage-visual-qa-rollback-checklist-2026-06-03.md` | Visual QA and rollback checklist. |

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming legal/provider review is complete;
- claiming partnership, licensing, lender approval, escrow approval, payment approval, wallet approval, FIO approval, XPR approval, or production approval;
- enabling real payments, real loans, escrow custody, repayment routing, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production release.

## Working Summary

The local homepage draft is ready for founder copy, hidden future-infrastructure wording, and local browser QA evidence decisions. It is not ready for public replacement. The safest next move is to approve the traditional-first direction, keep future infrastructure generic/private, and keep public replacement on hold until final public diff, final claim scan, rollback evidence, asset decision, and a standalone `PUBLICATION_GO` exist.
