# GCSC Whitepaper v1.3 Draft Static Asset Manifest

Status: internal draft static asset manifest. Draft static asset review is PENDING_EXTERNAL_ASSET_REVIEW. Current publication decision remains NO-GO.

This manifest does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registration, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

Use this manifest to track static asset dependencies for the local v1.3 draft website files before any future publication review. It keeps local draft checks separate from public-file replacement approval.

## Draft File Asset Map

| Draft File | Asset Or Dependency | Current Use | Review State |
|---|---|---|---|
| `whitepaper-v1-3-draft.html` | `whitepaper-v1-3-draft.css` | local draft stylesheet | PASS_LOCAL_ASSET |
| `whitepaper-v1-3-draft.html` | `https://fonts.googleapis.com` | draft typography only | PENDING_EXTERNAL_ASSET_REVIEW |
| `whitepaper-v1-3-draft.html` | `index.html` | navigation link to current public homepage | NO_PUBLIC_REPLACEMENT |
| `whitepaper-v1-3-draft.html` | `whitepaper.html` | navigation link to current public whitepaper | NO_PUBLIC_REPLACEMENT |
| `index-v1-3-draft.html` | `https://cdn.tailwindcss.com` | draft-only utility CSS loader | PENDING_EXTERNAL_ASSET_REVIEW |
| `index-v1-3-draft.html` | `https://fonts.googleapis.com` | draft typography only | PENDING_EXTERNAL_ASSET_REVIEW |
| `index-v1-3-draft.html` | inline `<style>` block | draft-only local styling | PASS_LOCAL_ASSET |
| `index-v1-3-draft.html` | `whitepaper-v1-3-draft.html` | local draft navigation link | PASS_LOCAL_ASSET |

## Blocked Legacy Dependencies

These dependencies must not return to v1.3 draft files:

- `css/style.css`;
- `css/whitepaper.css`;
- `assets/gcsc-logo.png`;
- missing root `css/` files;
- missing image logo dependencies;
- CDN dependency treated as publication approval.

## Publication Asset Review Still Required

Before any future public replacement, the founder or reviewer must decide whether external draft dependencies should be bundled, replaced, allowed, or removed:

- Tailwind CDN usage in `index-v1-3-draft.html`;
- Google Fonts usage in both local draft files;
- current-public-file navigation links from draft files;
- mobile performance and no-horizontal-overflow checks;
- screenshot redaction review and visual QA evidence.

## Local Checks

The local validator must confirm:

- `whitepaper-v1-3-draft.html` uses `whitepaper-v1-3-draft.css`;
- `whitepaper-v1-3-draft.html` does not depend on legacy `css/style.css`;
- `whitepaper-v1-3-draft.html` does not depend on legacy `css/whitepaper.css`;
- v1.3 draft files do not depend on `assets/gcsc-logo.png`;
- draft external assets are recorded as `PENDING_EXTERNAL_ASSET_REVIEW`;
- no public file content is changed by this manifest.

## Stop Boundary

Do not use this manifest to publish, replace public files, approve final wording, approve CDN production usage, create archive copies, run rollback commands, contact providers, send reviewer packets, post announcements, send emails, submit grants, distribute decks, record legal/provider clearance, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, or claim a FIO, XPR, WebAuth, Metal, or Metallicus partnership.
