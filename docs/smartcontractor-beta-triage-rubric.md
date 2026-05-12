# SmartContractor Beta Triage Rubric

Date: 2026-05-11

## Purpose

This rubric turns controlled beta feedback into clear product decisions without drifting into real-money launch decisions. It helps the founder decide what must be fixed before sharing SmartContractor more widely.

## Severity Levels

| Severity | Meaning | Default Action |
|----------|---------|----------------|
| P0 | Blocks the demo, creates trust confusion, leaks private data, or suggests live-risk behavior | Stop the session and fix before the next tester |
| P1 | Does not block the whole demo, but weakens homeowner, contractor, dispute, or admin trust | Fix before public beta handoff |
| P2 | Usability issue, unclear copy, missing empty state, mobile polish, or low-risk workflow friction | Schedule after core beta path is stable |
| P3 | Nice-to-have improvement, visual polish, or future workflow suggestion | Add to later roadmap |

## Trust Categories

Classify every beta issue into one primary category:

- auth/session;
- contractor trust;
- homeowner trust;
- payment simulation;
- dispute evidence;
- peer review;
- admin/risk review;
- mobile/PWA.

## Decision Routing

Use this routing before changing code:

- P0 auth/session or admin/risk review issue: fix locally, rerun auth and strict-gate checks, then retest the same flow.
- P0 contractor trust, homeowner trust, dispute evidence, or peer review issue: fix the MVP flow or wording before inviting another tester.
- P1 payment simulation issue: keep it demo-only and confirm no production payment capture is implied.
- P2 mobile/PWA issue: queue it if desktop beta trust is intact.
- P3 future suggestion: add it to backlog only if it supports construction finance, verification, disputes, payments, or admin review.

## Founder-Only Escalations

These topics cannot be approved by Codex alone:

- real loan terms, underwriting, origination, repayment, or default handling;
- real escrow, stored-value, custody, or payment release;
- token collateral, liquidation, staking-backed credit, or token value language;
- production payment provider capture or settlement;
- live Supabase RLS replacement, admin membership activation, or production database policy changes;
- legal/provider review for lending, escrow, payments, identity, contractor verification, and financial claims.

## Required Evidence

Every issue should include:

- request_id when an API call is involved;
- browser and operating system;
- viewport or device size;
- tester role;
- expected result;
- actual result;
- screenshot or short video;
- whether the issue touches real-money, identity, legal, or live Supabase risk.

## Acceptance Criteria

- P0 issues are fixed or explicitly blocked before inviting the next tester.
- P1 issues are reviewed before public beta handoff.
- No issue authorizes real loan, real escrow, token collateral, production payment, live Supabase, or legal/provider review actions.
- Every accepted fix is linked back to a beta issue, decision log entry, or request_id.
