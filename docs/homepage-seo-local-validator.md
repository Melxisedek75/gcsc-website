# Homepage SEO Local Validator

Status: local-only draft metadata and heading guard. This does not approve publication, public website replacement, public whitepaper publication, deployment, canonical public URL selection, public social-sharing metadata, public URL sharing, tester invites, live Supabase writes, external sends, provider review completion, legal conclusions, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO actions, mobile-store actions, production, or destructive actions.

Command:

```powershell
npm --prefix construction-ai run check:homepage:seo
```

Source target: `index-v1-3-static-draft.html`

Public files checked for draft-content leakage only:

- public `index.html`
- public `whitepaper.html`

## Purpose

`check:homepage:seo` keeps the static homepage candidate structurally readable without making it publication-ready. The draft stays `noindex,nofollow`, and canonical/Open Graph/Twitter metadata remains blocked until the founder gives standalone `PUBLICATION_GO` plus a deploy/public URL decision.

## Local Checks

The validator checks:

- `index-v1-3-static-draft.html` exists;
- `construction-ai/package.json` exposes `check:homepage:seo`;
- HTML language, charset, viewport, draft status, and publication NO-GO text remain present;
- exactly one title exists and stays within a local length budget;
- exactly one meta description exists and stays within a local length budget;
- the title, meta description, and H1 avoid blocked public Web3/token/loan/escrow claim terms;
- the draft has one robots meta tag with `noindex` and `nofollow`;
- canonical metadata is absent until publication/deploy target approval;
- Open Graph and Twitter/X public-sharing metadata is absent until publication approval;
- exactly one H1 exists, the first heading is H1, and heading levels do not skip;
- required H2 section signals remain present;
- public `index.html` and public `whitepaper.html` do not contain static draft-only SEO or draft metadata.

## Draft SEO Policy

| Area | Current local rule |
| --- | --- |
| Robots | Required `noindex,nofollow` while the page is an internal draft |
| Canonical | Blocked until `PUBLICATION_GO` plus deploy/public URL decision |
| Open Graph / Twitter | Blocked until publication approval |
| Public files | Checked only for draft metadata leakage; not edited |

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- adding a canonical public URL;
- adding public social-sharing metadata;
- changing deploy settings or public routing;
- running external SEO scanners or pinging external URLs;
- publishing, sharing, inviting testers, or sending packets;
- enabling real payments, loans, escrow, repayment routing, settlement, token collateral, wallet signatures, provider actions, legal actions, or production release.
