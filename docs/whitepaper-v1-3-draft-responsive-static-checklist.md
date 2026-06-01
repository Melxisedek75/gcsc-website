# GCSC Whitepaper v1.3 Draft Responsive Static Checklist

Status: internal draft responsive static checklist. Responsive browser QA remains PENDING_RESPONSIVE_BROWSER_REVIEW. Current publication decision remains NO-GO.

This checklist does not approve public publication, public website replacement, PDF publishing, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This checklist records static responsive safeguards in the local v1.3 draft files before any browser viewport screenshots, mobile checks, zoom checks, or manual responsive QA can be treated as evidence.

## Scope

| File | Review Scope | Public Action |
|---|---|---|
| `whitepaper-v1-3-draft.html` | viewport metadata and local draft structure | local review only |
| `index-v1-3-draft.html` | viewport metadata and responsive utility classes | local review only |
| `whitepaper-v1-3-draft.css` | static CSS responsive guards | local review only |
| `whitepaper.html` | unchanged public legacy file | scan only |
| `index.html` | unchanged public legacy file | scan only |

## Static Checks

| Check | Static Status | Evidence |
|---|---|---|
| viewport meta present | PASS_STATIC | both draft HTML files include `<meta name="viewport"` |
| horizontal overflow guard present | PASS_STATIC | draft CSS uses `overflow-x: hidden`; homepage draft body uses `overflow-x-hidden` |
| media can shrink | PASS_STATIC | `img`, `svg`, and `video` are constrained with `max-width: 100%` and `height: auto` |
| text can wrap | PASS_STATIC | draft CSS uses `overflow-wrap: anywhere` for text-heavy elements |
| whitepaper layout collapses below tablet width | PASS_STATIC | `.wp-layout` and `.wp-grid` switch to one-column layouts under `@media (max-width: 920px)` |
| mobile buttons avoid narrow inline squeeze | PASS_STATIC | `.btn` switches to `width: 100%` under `@media (max-width: 520px)` |
| tables have small-screen overflow handling | PASS_STATIC | `.wp-table` becomes block-level and uses `overflow-x: auto` under tablet width |
| homepage responsive utilities are present | PASS_STATIC | homepage draft uses Tailwind responsive classes such as `md:grid-cols-2`, `md:grid-cols-3`, `hidden md:flex`, and `hidden md:block` |
| desktop/mobile screenshots recorded | PENDING_RESPONSIVE_BROWSER_REVIEW | static checklist is not browser evidence |
| manual mobile tap, zoom, and orientation review recorded | PENDING_MOBILE_MANUAL_REVIEW | no manual responsive evidence is recorded |

## Manual Checks Still Required

These checks must remain pending until browser/manual evidence exists:

- 360px, 390px, 768px, 1024px, and 1440px viewport screenshots;
- horizontal overflow review for every draft section;
- top navigation wrap/collapse behavior;
- hero headline, badges, buttons, and CTA wrapping;
- whitepaper table scroll behavior on small screens;
- tap-target spacing on mobile;
- 200% zoom readability;
- portrait and landscape review on a real or emulated mobile viewport;
- private-data redaction review for any captured screenshots.

## Required Source Documents

This checklist must stay connected to:

- `docs/whitepaper-v1-3-browser-qa-evidence-flow.md`;
- `docs/whitepaper-v1-3-visual-qa-evidence-template.md`;
- `docs/whitepaper-v1-3-screenshot-evidence-results-template.md`;
- `docs/whitepaper-v1-3-local-browser-review-notes.md`;
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`;
- `docs/whitepaper-v1-3-publication-gate.md`.

## Stop Boundary

Do not use this checklist to claim:

- completed responsive QA;
- completed mobile QA;
- completed browser responsive review;
- completed screenshot QA;
- completed publication readiness;
- approved public replacement.

This checklist only confirms that static responsive guards exist in the local draft files. It does not replace desktop/mobile viewport evidence or founder/legal/provider approval.
