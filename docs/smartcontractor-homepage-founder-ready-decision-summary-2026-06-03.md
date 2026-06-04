# SmartContractor Homepage Founder-Ready Decision Summary

Status: internal founder decision summary. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, after local browser QA evidence capture.

## Purpose

Give the founder one concise decision surface for the end-of-week homepage work.

This summary reflects the current local draft after the new standard was applied: public-facing copy is traditional construction workflow first, and explicit blockchain/Web3/token/network/provider terms are hidden from the homepage draft.

## Current State

| Area | State | Meaning |
|---|---|---|
| Local homepage draft | READY_FOR_FOUNDER_REVIEW | `index-v1-3-draft.html` is the current draft. |
| Public homepage | NO-GO | Public `index.html` remains unchanged. |
| Public whitepaper | NO-GO | Public `whitepaper.html` remains unchanged. |
| Local preview | PASS_LOCAL_HTTP_200 | `http://127.0.0.1:43119/index-v1-3-draft.html` served from `C:\gcsc`. |
| Browser QA | PASS_INTERNAL_BROWSER_SESSION | Desktop/mobile screenshots, CTA click, DOM, and console evidence were captured in session. |
| Risky homepage wording | PASS_LOCAL_DRAFT_SCAN | Explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral wording is removed from the homepage draft. |
| Console health | PASS_WITH_DRAFT_WARNING | Zero console errors; Tailwind CDN production warning remains a public-readiness decision. |
| Publication decision | BLOCKED | Requires standalone `PUBLICATION_GO` after final public diff and asset decision. |

## What Changed In The Draft

| Previous Direction | Current Direction |
|---|---|
| Future Web3 layer was visible on the homepage draft. | Future infrastructure is generic, private, and founder/provider/legal-review-only. |
| Specific ecosystem names were visible in homepage copy. | Specific network/provider names are hidden from homepage draft copy. |
| Escrow/lending/payment wording appeared in product sections. | Partner layer now says compliance, insurance, identity, valuation, and dispute review. |
| Review boundary listed detailed blockchain/finance examples. | Review boundary now blocks publication, provider commitments, live payments, live financing, regulated financial products, external infrastructure integrations, legal conclusions, and launch. |

## Founder Decisions Needed

| Decision | Exact Phrase | What It Allows |
|---|---|---|
| Approve traditional-first public direction | `APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION` | Continue final homepage prep around construction records, milestone evidence, disputes, request IDs, and partner-reviewed readiness. |
| Approve hidden future-infrastructure language | `APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE` | Keep blockchain/Web3/provider specifics out of homepage copy while preserving the future plug-in architecture internally. |
| Accept internal browser QA evidence | `ACCEPT_LOCAL_BROWSER_QA_EVIDENCE` | Use the captured local browser session as internal evidence for draft readiness, not publication approval. |
| Decide Tailwind asset policy | `ALLOW_TAILWIND_CDN_FOR_DRAFT_ONLY` or `REQUIRE_COMPILED_PUBLIC_CSS` | Choose whether public page work must replace Tailwind CDN before publication. |
| Keep public replacement blocked | `KEEP_PUBLIC_REPLACEMENT_ON_HOLD` | Continue internal prep without editing public `index.html`. |
| Approve public replacement later | `PUBLICATION_GO` | Only after final diff, rollback path, asset decision, and founder review are complete. |

`PUBLICATION_GO` must be standalone and explicit. Do not infer it from copy, QA, or design approval.

## Recommended Founder Response For Now

```text
APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION
APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE
ACCEPT_LOCAL_BROWSER_QA_EVIDENCE
REQUIRE_COMPILED_PUBLIC_CSS
KEEP_PUBLIC_REPLACEMENT_ON_HOLD
```

Reason:

- the draft now matches the current standard: construction workflow first, future infrastructure hidden;
- local browser evidence is enough for internal review;
- Tailwind CDN should be treated as draft-only until a public asset decision is made;
- public replacement should still wait for an exact public diff and standalone `PUBLICATION_GO`.

## Remaining Work Before Public Replacement

| Step | Owner | Status |
|---|---|---|
| Final public diff package from `index-v1-3-draft.html` to public `index.html` | Codex | Pending |
| Rollback path for current public homepage | Codex | Pending |
| Tailwind/Google Fonts public asset decision | Founder + Codex | Decision packet prepared; founder decision pending |
| Final claim-risk scan on exact public replacement copy | Codex | Pending |
| Founder publication approval | Founder | Not approved |
| Public `index.html` replacement | Codex | Blocked until `PUBLICATION_GO` |

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, lenders, insurers, banks, appraisers, regulators, or infrastructure partners;
- claiming legal/provider review is complete;
- enabling real payments, real financing, regulated financial products, wallet signatures, external network actions, or production release.

## Working Summary

The local homepage draft is now in founder-ready review shape for the new standard. It is not public-ready until the founder approves the exact public replacement path with standalone `PUBLICATION_GO`.
