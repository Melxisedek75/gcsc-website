# SmartContractor Public Homepage Static Asset Draft

Status: internal static-asset candidate. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, dependency installation, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Source candidate: `index-v1-3-static-draft.html`

Related current draft: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Create a local homepage candidate that removes the remaining public-readiness asset concern from the current draft.

The current `index-v1-3-draft.html` remains the browser-QA evidence source already captured with Tailwind CDN and Google Fonts. The new `index-v1-3-static-draft.html` is a separate local candidate for the future public asset path.

## What Changed

| Area | Static Candidate State |
|---|---|
| Tailwind CDN | Removed |
| Google Fonts | Removed |
| AOS | Not used |
| External asset URLs | Not used |
| JavaScript | Not used |
| Font stack | System UI stack |
| Public `index.html` edit | No |
| Public `whitepaper.html` edit | No |
| Deploy setting change | No |
| Public URL sharing | No |
| Live action | No |

## Local Candidate Scope

The static candidate keeps the same traditional-first homepage direction:

- construction trust infrastructure;
- verified project records;
- milestone evidence;
- dispute packets;
- partner-reviewed working-capital readiness;
- request IDs and admin review;
- generic future reviewed infrastructure only.

It does not expose public blockchain, Web3, token, XPR, FIO, stablecoin, escrow, lending, loan, collateral, Metallicus, LOAN-style, provider-approved, legal-approved, public-launch-approved, or production-approved claims.

## Validation Command

Run from `C:\gcsc`:

```powershell
npm --prefix construction-ai run check:homepage-v1-3-static-draft
```

This validator checks:

- `index-v1-3-static-draft.html` exists;
- no external asset URLs are present;
- no Tailwind CDN, Google Fonts, AOS, or external script dependency remains;
- required anchors and local whitepaper links exist;
- required draft/no-go/status wording exists;
- blocked public-risk terms are absent;
- public `index.html` and `whitepaper.html` do not contain static draft-only content.

`npm --prefix construction-ai run check:smartcontractor` also runs this validator.

## Evidence Still Needed

| Evidence | Current State |
|---|---|
| Static validator | PASS via `npm --prefix construction-ai run check:homepage-v1-3-static-draft` |
| Desktop browser screenshot | PASS_LOCAL_ONLY at `http://127.0.0.1:43119/index-v1-3-static-draft.html` in 1280 x 720 in-app Browser viewport |
| Mobile browser screenshot | Pending |
| CTA/link click QA | PASS_LOCAL_ONLY: `View Product Layers` updates URL to `#products` and shows the Product Layers section |
| Console health | REVIEW: Browser log API still retained older Tailwind CDN warnings from the previous `index-v1-3-draft.html` tab, but the fresh static draft DOM inspection found `externalAssets: []`, no framework overlay, and no blocked public-risk terms |
| Public diff package | Still blocked until standalone `PUBLICATION_GO` |
| Public replacement | Still blocked |

## Local Browser QA Evidence

Fresh in-app Browser check:

- URL: `http://127.0.0.1:43119/index-v1-3-static-draft.html`
- Title: `GCSC - Static Homepage Draft`
- Viewport: 1280 x 720
- Meaningful content: present
- Static status chip: present
- Publication gate: `NO-GO`
- Runtime font family: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Blocked public-risk terms in visible body text: none found for blockchain, Web3, token, XPR, FIO, stablecoin, escrow, lending, loan, collateral, or Metallicus
- External asset URLs in current DOM: none
- Framework overlay: false
- Interaction: `View Product Layers` -> `#products`
- Screenshot: captured outside the repo in the local temp folder for non-committed QA evidence

The Browser log API still returned older Tailwind CDN warnings from prior `index-v1-3-draft.html` checks. That stale log caveat does not change the static draft DOM result, but the console state should be rechecked in a clean browser session before any future public replacement.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, redirects, or deploy settings;
- installing dependencies or adding build tooling without a scoped founder decision;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, lenders, insurers, banks, appraisers, regulators, or infrastructure partners;
- claiming legal/provider review is complete;
- enabling real payments, real financing, regulated financial products, wallet signatures, external infrastructure integrations, or production release.

## Working Summary

`index-v1-3-static-draft.html` is the local no-external-asset alternative for the homepage replacement path. It gives the founder a concrete static CSS option before deciding whether future public replacement should require compiled/static CSS. Public files and deployment remain unchanged until standalone `PUBLICATION_GO`.
