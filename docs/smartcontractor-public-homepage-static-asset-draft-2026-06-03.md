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
| First viewport product signal | `SmartContractor by GCSC` is visible in the hero before the headline |
| Product section order | Traditional product review order from homeowner request through future reviewed infrastructure |
| Integration readiness ports | Contractor profile, project contract, milestone evidence, working-capital readiness, repayment context, dispute evidence, request-id/audit, and public wording ports with traditional/provider/future-review states |
| Font stack | System UI stack |
| Visual palette | Reworked on 2026-06-04 PT to a construction trust palette, not the old dark-purple launch-page look |
| Decorative hero glow | Removed |
| Card/button radius | 8px |
| Responsive type | Fixed desktop/tablet/mobile breakpoints, no viewport-scaled `clamp()` type |
| Static visual regression guard | Added to validator, final QA preflight endpoint, Admin UI, and smoke tests |
| Performance budget guard | Added through `check:homepage:performance` for local file-size, inline CSS/JS, external-asset, and data-URI budgets |
| SEO metadata guard | Added through `check:homepage:seo` for title, description, noindex/nofollow, no canonical, no social metadata, and heading structure |
| Public `index.html` edit | No |
| Public `whitepaper.html` edit | No |
| Deploy setting change | No |
| Public URL sharing | No |
| Live action | No |

## 2026-06-04 Visual Polish Update

The static candidate now uses a calmer product-interface direction:

- steel blue, teal, safety amber, green success, and neutral work-surface colors;
- no dominant purple/purple-blue palette;
- no decorative radial hero glow;
- 8px card/button/tool radius;
- fixed responsive heading sizes instead of viewport-scaled type;
- local desktop and mobile Browser QA with no horizontal overflow.

This update improves founder review quality only. It does not approve publication, replace public files, change deploy settings, share public URLs, invite testers, or enable live finance/provider actions.

## 2026-06-04 Static Visual Guard Update

The static candidate visual standard is now enforced by code:

- `npm --prefix construction-ai run check:homepage-v1-3-static-draft` requires the construction trust palette, 8px radius, and fixed responsive type declarations;
- the same validator blocks legacy purple launch-page tokens, `hero::before`, decorative `radial-gradient`, and viewport-scaled `clamp()` type;
- `/api/admin/homepage-publication-final-qa-preflight` returns `static_visual_style_guard`, `visual_style_findings`, `missing_visual_tokens`, and `required_visual_tokens`;
- the Admin preflight panel displays visual findings and missing visual tokens;
- `npm --prefix construction-ai run check:smartcontractor` and `npm --prefix construction-ai run check:auth` verify the guard.

This is a local regression guard only. It does not replace public files, run archive commands, change deploy settings, share URLs, invite testers, or approve publication.

## 2026-06-07 Performance Budget Guard Update

The static candidate now has a narrow local performance budget guard:

- `npm --prefix construction-ai run check:homepage:performance` validates `index-v1-3-static-draft.html`;
- the guard requires one inline style block, zero inline/external JavaScript, zero external asset references, and zero `data:` image/font/application assets;
- the guard checks simple local budgets for HTML bytes and inline CSS bytes;
- the guard blocks CSS imports, CSS `url(...)` asset fetches, preload/preconnect hints, eager loading, and autoplay media;
- the guard checks public `index.html` and public `whitepaper.html` only for static draft-content leakage.

This is local performance readiness evidence only. It does not approve publication, replace public files, change deploy settings, share URLs, invite testers, approve provider review, approve legal review, or enable live finance.

## 2026-06-07 SEO Metadata Guard Update

The static candidate now has a local SEO metadata and heading guard:

- `npm --prefix construction-ai run check:homepage:seo` validates `index-v1-3-static-draft.html`;
- the guard checks title, meta description, HTML language, charset, viewport, H1/H2 structure, and blocked public-risk claim terms in title/meta/H1;
- the draft now carries `noindex,nofollow` while it remains internal;
- canonical public URL metadata remains blocked until standalone `PUBLICATION_GO` plus deploy/public URL decision;
- Open Graph and Twitter/X public-sharing metadata remains blocked until publication approval;
- the guard checks public `index.html` and public `whitepaper.html` only for static draft SEO metadata leakage.

This is local structural readiness evidence only. It does not approve publication, replace public files, choose a canonical public URL, add public social metadata, change deploy settings, share URLs, invite testers, approve provider review, approve legal review, or enable live finance.

## 2026-06-04 First Viewport Product Signal Guard Update

The static candidate now treats first-viewport product identity as a required publication-review signal:

- the hero displays `SmartContractor by GCSC` before the construction trust role and headline;
- `npm --prefix construction-ai run check:homepage-v1-3-static-draft` requires the visible product signal;
- `/api/admin/homepage-publication-final-qa-preflight` returns `first_viewport_product_signal_guard`, `missing_first_viewport_signals`, and `required_first_viewport_signals`;
- the Admin preflight panel displays missing and required first-viewport signals;
- `npm --prefix construction-ai run check:smartcontractor` and `npm --prefix construction-ai run check:auth` verify the guard.

This update answers the end-of-week first-viewport requirement without editing public `index.html` or `whitepaper.html`, changing deploy settings, sharing a public URL, inviting testers, or approving publication.

## 2026-06-04 Product Section Order Guard Update

The static candidate now renders and validates the end-of-week traditional product section order:

1. Homeowner project request.
2. Contractor profile and verification readiness.
3. Bid records and project contract records.
4. Milestone evidence and approval readiness.
5. Dispute evidence and peer review.
6. Contractor reputation and completion history.
7. Working-capital readiness packet for future provider review.
8. Admin audit trail and request IDs.
9. Future reviewed infrastructure layer.

`/api/admin/homepage-publication-final-qa-preflight` now returns `product_section_order_guard`, `missing_product_section_signals`, and `required_product_section_signals`; the Admin preflight panel displays those fields; `npm --prefix construction-ai run check:smartcontractor` and `npm --prefix construction-ai run check:auth` verify the guard.

This is still local-only review evidence. It does not replace public files, change deploy settings, share URLs, invite testers, approve provider review, or enable live finance.

## 2026-06-04 Integration Port State Guard Update

The static candidate now preserves the future architecture plug-in shape without public live-claim language:

- contractor profile port;
- project contract port;
- milestone evidence port;
- working-capital readiness port;
- repayment context port;
- dispute evidence port;
- request-id and audit port;
- public wording port.

The local page and Admin preflight now require three non-live states: `traditional_only`, `provider_ready`, and `future_review_required`. This keeps the traditional product useful now while preserving a clean place to connect future reviewed infrastructure after founder, legal, provider, licensing, security, and technical approval.

`/api/admin/homepage-publication-final-qa-preflight` now returns `integration_port_state_guard`, `missing_integration_port_signals`, and `required_integration_port_signals`; the Admin preflight panel displays those fields; `npm --prefix construction-ai run check:smartcontractor` and `npm --prefix construction-ai run check:auth` verify the guard.

This is local-only architecture readiness evidence. It does not replace public files, change deploy settings, share URLs, invite testers, approve providers, approve future infrastructure, or enable live finance.

`/api/admin/beta-readiness` also includes `homepage_integration_port_state_guard` inside `homepage_publication_evidence_checklist` with `PASS_STATIC_GUARD_LOCAL_ONLY` so the founder readiness board can see the port guard without opening the separate final QA preflight panel.

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
npm --prefix construction-ai run check:homepage:performance
npm --prefix construction-ai run check:homepage:seo
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
| Desktop browser screenshot | PASS_LOCAL_ONLY at `http://127.0.0.1:43124/index-v1-3-static-draft.html?visual=20260604` in 1280 x 720 in-app Browser viewport |
| Mobile browser screenshot | PASS_LOCAL_ONLY at `http://127.0.0.1:43124/index-v1-3-static-draft.html?visual=20260604-mobile` in 390 x 844 in-app Browser viewport |
| CTA/link click QA | PASS_LOCAL_ONLY: `View Product Layers` updates URL to `#products`, shows the Product Layers section, and keeps no horizontal overflow |
| Static visual guard | PASS via static validator and `/api/admin/homepage-publication-final-qa-preflight` with `visual_style_findings: []` and `missing_visual_tokens: []` |
| First viewport product signal guard | PASS via static validator and `/api/admin/homepage-publication-final-qa-preflight` with `missing_first_viewport_signals: []` and required `SmartContractor by GCSC` product signal |
| Product section order guard | PASS via static validator and `/api/admin/homepage-publication-final-qa-preflight` with `missing_product_section_signals: []` and required traditional product review order signals |
| Integration port state guard | PASS via static validator and `/api/admin/homepage-publication-final-qa-preflight` with `missing_integration_port_signals: []`, required integration readiness ports, and traditional/provider/future-review states |
| Integration port evidence checklist | PASS_LOCAL_ONLY via `/api/admin/beta-readiness` with `homepage_integration_port_state_guard` and `PASS_STATIC_GUARD_LOCAL_ONLY` in `homepage_publication_evidence_checklist` |
| Console health | REVIEW: Browser log API still retained older Tailwind CDN warnings from previous `index-v1-3-draft.html` tabs, but the fresh static draft DOM inspection found `externalAssets: []`, no framework overlay, no decorative radial hero pseudo-element, and no blocked public-risk terms |
| Public diff package | Still blocked until standalone `PUBLICATION_GO` |
| Public replacement | Still blocked |

## Local Browser QA Evidence

Fresh in-app Browser check:

- URL: `http://127.0.0.1:43124/index-v1-3-static-draft.html?visual=20260604`
- Title: `GCSC - Static Homepage Draft`
- Viewport: 1280 x 720
- Meaningful content: present
- Static status chip: present
- Publication gate: `NO-GO`
- Runtime font family: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Root palette: `--bg #101214`, `--brand #2f6f8f`, `--brand-2 #38a3a5`, `--orange #f59e0b`, `--radius 8px`
- Hero radial pseudo-element: absent
- Heading type: `h1 70px`, `h2 48px`
- Blocked public-risk terms in visible body text: none found for blockchain, Web3, token, XPR, FIO, stablecoin, escrow, lending, loan, collateral, or Metallicus
- External asset URLs in current DOM: none
- Framework overlay: false
- Interaction: `View Product Layers` -> `#products`
- Screenshot: captured outside the repo in the local temp folder for non-committed QA evidence

Mobile in-app Browser check:

- URL: `http://127.0.0.1:43124/index-v1-3-static-draft.html?visual=20260604-mobile`
- Viewport override: 390 x 844
- Client width / scroll width: 375 / 375
- Horizontal overflow: false
- Main nav links: hidden at mobile breakpoint
- Hero record panel: hidden at mobile breakpoint
- Primary hero buttons: visible and full-width within viewport
- Heading type: `h1 38px`, `h2 32px`
- Offscreen checked elements: none for headline, lead, buttons, status chips, cards, or review box
- Product, technology, and review sections: present
- Blocked public-risk terms in visible body text: none found for blockchain, Web3, token, XPR, FIO, stablecoin, escrow, lending, loan, collateral, or Metallicus
- External asset URLs in current DOM: none
- Runtime font family: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
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
