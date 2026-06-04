# SmartContractor Public Homepage Asset Decision Packet

Status: internal asset decision packet. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, dependency installation, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode, after local browser QA and rollback packet prep.

## Purpose

Resolve the remaining public-readiness asset question before any future homepage replacement.

The local browser QA passed with zero runtime errors, but it recorded one warning from `cdn.tailwindcss.com`. That warning does not break the local draft. It does mean the founder should decide whether public homepage publication must remove CDN Tailwind before `PUBLICATION_GO`.

## Asset Inventory

| File | External Assets Found | Meaning |
|---|---|---|
| `index-v1-3-draft.html` | Tailwind CDN, Google Fonts Inter | Current replacement candidate is still draft-grade from an asset policy standpoint. |
| `index-v1-3-static-draft.html` | None; local static CSS with system font stack | Local no-external-asset candidate prepared for the future public asset path, without changing public files. |
| `index.html` | Tailwind CDN, AOS CDN JS/CSS, Google Fonts Inter | Current public homepage already uses external CDN assets. |
| `whitepaper-v1-3-draft.html` | Local CSS plus Google Fonts | Whitepaper draft has a more static CSS structure but still uses external fonts. |
| `whitepaper.html` | Local CSS/JS plus Google Fonts | Current public whitepaper keeps external font loading. |

## Observed Current State

| Check | Result |
|---|---|
| Homepage draft console errors | `0` |
| Homepage draft console warnings | Tailwind CDN production warning only |
| Root Tailwind/PostCSS config found | None in tracked project root by `rg --files` |
| Static homepage candidate | `index-v1-3-static-draft.html` prepared local-only with no external asset URLs |
| Static homepage validator | `npm --prefix construction-ai run check:homepage-v1-3-static-draft` |
| Public file edits made | None |
| Dependency install attempted | No |
| Publication decision | `NO-GO` |

## Decision Options

| Option | Exact Phrase | Pros | Tradeoff |
|---|---|---|---|
| Keep CDN only for local draft | `ALLOW_TAILWIND_CDN_FOR_DRAFT_ONLY` | No delay for founder review; current browser QA stays valid for draft. | Public replacement still needs CSS decision before `PUBLICATION_GO`. |
| Require compiled CSS before public use | `REQUIRE_COMPILED_PUBLIC_CSS` | Removes Tailwind CDN warning; better public performance and control. | Requires a local CSS build/extraction step before replacing public `index.html`. |
| Allow Google Fonts publicly | `ALLOW_GOOGLE_FONTS_PUBLIC` | Preserves Inter typography with minimal design changes. | External font request remains; privacy/performance review may be needed. |
| Require system/self-hosted fonts | `REQUIRE_SYSTEM_OR_SELF_HOSTED_FONTS` | Stronger privacy/performance posture. | Design may shift unless fonts are self-hosted or CSS is adjusted. |
| Keep AOS off the new homepage draft | `KEEP_AOS_OFF_HOMEPAGE_DRAFT` | Avoids adding the current public page's extra animation dependency to the new draft. | New homepage remains less animated than legacy page. |

## Recommended Decision For The New Homepage

```text
ALLOW_TAILWIND_CDN_FOR_DRAFT_ONLY
REQUIRE_COMPILED_PUBLIC_CSS
REQUIRE_SYSTEM_OR_SELF_HOSTED_FONTS
KEEP_AOS_OFF_HOMEPAGE_DRAFT
KEEP_PUBLIC_REPLACEMENT_ON_HOLD
```

Reason:

- Tailwind CDN is acceptable for local founder review but should not be carried into a new public homepage if we want a clean production QA story.
- System or self-hosted fonts reduce external dependencies for the public homepage.
- The new draft does not need AOS; avoiding it keeps the replacement simpler.
- Public replacement still requires standalone `PUBLICATION_GO`.

## Safe Implementation Paths After Founder Decision

| Path | When To Use | Boundary |
|---|---|---|
| Hand-authored static CSS for draft | If founder wants no new build tooling. | Keep work local; verify screenshots again; no public edit without `PUBLICATION_GO`. |
| Add local Tailwind build setup | If founder accepts a dev dependency/build workflow. | Do not install or commit dependency changes without a scoped implementation decision. |
| Keep CDN for public temporarily | If founder prioritizes speed over production warning. | Must be an explicit founder decision; still no public edit without `PUBLICATION_GO`. |

## Required Evidence If CSS Is Changed

| Evidence | Required Result |
|---|---|
| Desktop browser screenshot | Hero, products, and review boundary still render correctly. |
| Mobile browser screenshot | Hero, products, and review boundary still fit at 390 x 844. |
| Console health | Tailwind CDN warning gone if compiled/static CSS path is selected. |
| Link/CTA QA | `#products` and whitepaper links still work. |
| Risky wording scan | Explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral terms remain absent from homepage draft. |
| Public HTML diff | Empty until standalone `PUBLICATION_GO`. |

## Stop Boundary

Stop before:

- installing dependencies;
- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, lenders, insurers, banks, appraisers, regulators, or infrastructure partners;
- claiming legal/provider review is complete;
- enabling real payments, real financing, regulated financial products, external infrastructure integrations, wallet signatures, or production release.

## Working Summary

The asset decision is now isolated from copy approval and publication approval. The safest path is to keep Tailwind CDN as draft-only, prepare a compiled/static CSS path before public replacement, keep AOS out of the new homepage, and require standalone `PUBLICATION_GO` before any public `index.html` edit.
