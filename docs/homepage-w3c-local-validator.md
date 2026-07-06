# Homepage W3C Local Validator

Status: local W3C-style HTML structure guard. This does not approve publication, public website replacement, public whitepaper publication, deployment, public URL sharing, tester invites, live Supabase writes, external W3C validation, provider review completion, legal conclusions, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO actions, mobile-store actions, production, or destructive actions.

Command:

```powershell
npm --prefix construction-ai run check:homepage:w3c
```

Source target: `index-v1-3-static-draft.html`

Public files checked for draft-content leakage only:

- public `index.html`
- public `whitepaper.html`

## Purpose

`check:homepage:w3c` provides a no-package local W3C-style guard for the static homepage candidate. It is not a replacement for the official W3C validator and does not call external services. Its job is to catch local structural regressions before founder publication review.

## Local Checks

The validator checks:

- `index-v1-3-static-draft.html` exists;
- `construction-ai/package.json` exposes `check:homepage:w3c`;
- the draft starts with `<!DOCTYPE html>`;
- `html`, `head`, `body`, `main`, and `title` have one opening and one closing tag;
- head appears before body;
- tag nesting is balanced after excluding raw `style` content;
- IDs are not duplicated;
- required section IDs remain present: `mission`, `products`, `technology`, `review`;
- fragment links point to existing IDs;
- links stay local and avoid `http`, `mailto`, `tel`, `javascript`, `data`, or protocol-relative URLs;
- every local link target resolves to a file that exists on disk (no dangling local links such as a missing `whitepaper-v1-3-draft.html`);
- semantic section, nav, and footer counts remain present;
- public `index.html` and public `whitepaper.html` do not contain static draft-only W3C or draft metadata.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- calling the official W3C validator or any external scanner;
- changing deploy settings or public routing;
- publishing, sharing, inviting testers, or sending packets;
- enabling real payments, loans, escrow, repayment routing, settlement, token collateral, wallet signatures, provider actions, legal actions, or production release.
