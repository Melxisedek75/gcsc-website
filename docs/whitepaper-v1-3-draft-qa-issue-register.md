# GCSC Whitepaper v1.3 Draft QA Issue Register

Status: internal draft QA issue register. Current publication decision remains NO-GO.

This register does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, legal conclusions, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

Use this register to record local draft QA findings from visual review, screenshot evidence, wording scans, browser review, and founder/reviewer feedback.

## Scope

| File | Role | Allowed Action |
|---|---|---|
| `whitepaper-v1-3-draft.html` | local v1.3 whitepaper draft | local QA only |
| `index-v1-3-draft.html` | local v1.3 homepage draft | local QA only |
| `docs/whitepaper-v1-3-public-draft.md` | source narrative | local QA only |
| `whitepaper.html` | current public whitepaper | scan only |
| `index.html` | current public homepage | scan only |

## Issue Severity

| Severity | Meaning | Action |
|---|---|---|
| BLOCKER | could mislead public users or create legal/provider/live-risk confusion | fix before any future GO |
| HIGH | harms trust, clarity, or mobile/desktop usability | fix before reviewer/publication route |
| MEDIUM | wording or layout polish needed | fix during local polish |
| LOW | non-blocking typo, formatting, or optional cleanup | batch with polish |

## Issue Categories

- visual overlap;
- mobile overflow;
- unclear NO-GO boundary;
- risky finance wording;
- risky escrow wording;
- risky Web3 wording;
- risky partner wording;
- private-data exposure;
- broken navigation;
- inconsistent Construction Trust Infrastructure wording;
- missing provider-review context;
- missing future/review-required context.

## Issue Register Template

| ID | Severity | Category | Source | Evidence | Required Fix | Status |
|---|---|---|---|---|---|---|
| V13-QA-001 | TO_FILL | TO_FILL | TO_FILL | TO_FILL | TO_FILL | OPEN |

## Resolution Rules

- Every BLOCKER must stay OPEN until a local fix is verified.
- Every HIGH issue must have an owner note or a hold reason.
- Any wording issue involving lending, escrow, stablecoin settlement, token collateral, FIO, XPR, WebAuth, Metal, Metallicus, Value Mirror, or AI decisioning must keep future/review-required/provider-controlled context.
- Screenshot issues must reference the matching Evidence ID from `docs/whitepaper-v1-3-screenshot-evidence-manifest.md`.
- Reviewer issues must reference the reviewer type and response intake record.
- A closed issue does not approve public use.

## Safe Status Values

- OPEN;
- NEEDS_LOCAL_FIX;
- NEEDS_FOUNDER_REVIEW;
- NEEDS_EXTERNAL_REVIEW;
- FIXED_LOCAL;
- HOLD_NO_PUBLIC_USE.

## Stop Boundary

This register does not approve:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF;
- changing public routing;
- sending provider outreach;
- closing publication blockers as authorization for public use;
- claiming founder, legal, provider, screenshot, or publication approval;
- activating any live payment, loan, escrow, stablecoin settlement, token collateral, wallet signature, FIO registration, or production Web3 action.
