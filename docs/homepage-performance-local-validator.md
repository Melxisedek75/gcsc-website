# Homepage Performance Local Validator

Status: local-only draft quality guard. This does not approve publication, public website replacement, public whitepaper publication, deployment, public URL sharing, tester invites, live Supabase writes, external sends, provider review completion, legal conclusions, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO actions, mobile-store actions, production, or destructive actions.

Command:

```powershell
npm --prefix construction-ai run check:homepage:performance
```

Source target: `index-v1-3-static-draft.html`

Public files checked for draft-content leakage only:

- public `index.html`
- public `whitepaper.html`

## Purpose

`check:homepage:performance` adds a no-package performance budget guard for the static homepage candidate. It complements `check:homepage-v1-3-static-draft`, which already validates content, public-risk wording, local links, visual tokens, and no external asset URLs.

## Local Checks

The validator checks:

- `index-v1-3-static-draft.html` exists;
- `construction-ai/package.json` exposes `check:homepage:performance`;
- the draft keeps one inline style block;
- HTML stays under the local draft budget;
- inline CSS stays under the local draft budget;
- inline or external JavaScript remains absent;
- external asset references remain absent;
- `data:` image/font/application assets remain absent;
- CSS `@import`, CSS `url(...)`, preload/preconnect hints, eager loading, and autoplay media remain absent;
- viewport, description, draft/no-go status, and first-viewport SmartContractor signal remain present;
- public `index.html` and public `whitepaper.html` do not contain static draft-only homepage content.

## Budgets

| Field | Budget |
| --- | ---: |
| HTML bytes | 40,000 |
| Inline CSS bytes | 30,000 |
| Inline JS bytes | 0 |
| External asset references | 0 |
| Data URI references | 0 |

These budgets are intentionally simple and local. They are not Lighthouse scores, CDN policy approvals, production performance claims, public launch approval, or browser QA replacement.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing deploy settings or public routing;
- adding external packages or paid scanners;
- running external URL checks;
- publishing, sharing, inviting testers, or sending packets;
- enabling real payments, loans, escrow, repayment routing, settlement, token collateral, wallet signatures, provider actions, legal actions, or production release.
