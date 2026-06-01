# GCSC Whitepaper v1.3 Draft External Asset Review Intake Checklist

Status: internal draft external asset review intake checklist. Draft external asset review remains PENDING_EXTERNAL_ASSET_REVIEW. Current publication decision remains NO-GO.

This checklist does not approve public publication, public website replacement, PDF publishing, CDN production usage, font provider usage, routing changes, provider outreach, reviewer outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This checklist controls how future review of draft external assets is recorded. It keeps Tailwind CDN usage, Google Fonts usage, current-public-file draft links, performance review, privacy review, fallback review, and publication decisions separate.

## Assets In Scope

| Asset Or Dependency | Current File | Current Use | Current State |
|---|---|---|---|
| `https://fonts.googleapis.com` | `whitepaper-v1-3-draft.html` | draft typography only | PENDING_EXTERNAL_ASSET_REVIEW |
| `https://cdn.tailwindcss.com` | `index-v1-3-draft.html` | draft-only utility CSS loader | PENDING_EXTERNAL_ASSET_REVIEW |
| `https://fonts.googleapis.com` | `index-v1-3-draft.html` | draft typography only | PENDING_EXTERNAL_ASSET_REVIEW |
| `index.html` | `whitepaper-v1-3-draft.html` | legacy homepage reference | SCAN_ONLY_BOUNDARY |
| `whitepaper.html` | both draft HTML files | current public whitepaper reference | SCAN_ONLY_BOUNDARY |
| `whitepaper-v1-3-draft.css` | `whitepaper-v1-3-draft.html` | local draft stylesheet | PASS_LOCAL_ASSET |

## Intake Requirements

| Requirement | Current State | Required Before Public Use |
|---|---|---|
| external asset owner identified | TO_FILL | founder or reviewer names who accepts public dependency treatment |
| Tailwind CDN treatment | PENDING_EXTERNAL_ASSET_REVIEW | allow draft-only, bundle locally, replace, or remove before public use |
| Google Fonts treatment | PENDING_EXTERNAL_ASSET_REVIEW | allow draft-only, self-host, replace, or remove before public use |
| privacy/data-sharing review | PENDING_PRIVACY_REVIEW | decide whether external asset requests are acceptable for public users |
| mobile performance review | PENDING_PERFORMANCE_REVIEW | measure or manually review mobile load and layout impact |
| fallback rendering review | PENDING_FALLBACK_REVIEW | confirm usable typography/layout if external assets fail |
| current-public-file link treatment | PENDING_PUBLIC_ROUTING_REVIEW | decide whether legacy references stay, change, or are removed in final candidate |
| browser evidence cross-reference | PENDING_BROWSER_EVIDENCE | connect to screenshot, click, and visual QA evidence only after evidence exists |

## Allowed Intake States

- PENDING_EXTERNAL_ASSET_REVIEW;
- ALLOW_DRAFT_ONLY;
- BUNDLE_BEFORE_PUBLIC_USE;
- SELF_HOST_BEFORE_PUBLIC_USE;
- REMOVE_BEFORE_PUBLIC_USE;
- NEEDS_PERFORMANCE_REVIEW;
- NEEDS_PRIVACY_REVIEW;
- NEEDS_FALLBACK_REVIEW;
- HOLD_NO_PUBLIC_USE.

No allowed intake state approves publication, public routing, provider outreach, legal/provider clearance, production CDN usage, or live finance/Web3 actions.

## Reviewer Record Template

| Field | Value |
|---|---|
| reviewer | TO_FILL |
| review date | TO_FILL |
| source commit | TO_FILL |
| Tailwind CDN decision | PENDING_EXTERNAL_ASSET_REVIEW |
| Google Fonts decision | PENDING_EXTERNAL_ASSET_REVIEW |
| privacy decision | PENDING_PRIVACY_REVIEW |
| performance decision | PENDING_PERFORMANCE_REVIEW |
| fallback decision | PENDING_FALLBACK_REVIEW |
| public routing decision | PENDING_PUBLIC_ROUTING_REVIEW |
| publication decision | NO-GO |

## Required Source Documents

- `docs/whitepaper-v1-3-draft-static-asset-manifest.md`;
- `docs/whitepaper-v1-3-publication-evidence-current-status.md`;
- `docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md`;
- `docs/whitepaper-v1-3-internal-review-master-index.md`;
- `docs/whitepaper-v1-3-publication-gate.md`;
- `docs/whitepaper-v1-3-draft-link-cta-static-checklist.md`;
- `docs/whitepaper-v1-3-browser-qa-evidence-flow.md`;
- `docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md`.

## No Shortcut Rules

- A static manifest is not external asset approval.
- A local validator is not CDN production approval.
- Tailwind CDN usage in a draft does not approve public Tailwind CDN usage.
- Google Fonts usage in a draft does not approve public Google Fonts usage.
- A current-public-file link in a draft does not approve public routing.
- Browser screenshots do not replace privacy, performance, and fallback review.
- External asset review does not approve publication, public replacement, provider outreach, legal/provider clearance, or live finance/Web3 actions.

## Stop Boundary

Do not use this checklist to publish, replace public files, approve production CDN usage, approve Google Fonts production usage, approve public routing, approve final wording, create archive copies, run rollback commands, contact providers, send reviewer packets, post announcements, send emails, submit grants, distribute decks, record legal/provider clearance, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, sign XPR actions, or claim a FIO, XPR, WebAuth, Metal, or Metallicus partnership.
