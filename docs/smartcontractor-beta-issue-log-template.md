# SmartContractor Beta Issue Log Template

Date: 2026-05-11 PT

Purpose: simple non-secret issue log for SmartContractor controlled beta testing.

Use this file when a founder, homeowner tester, contractor tester, peer reviewer, or admin finds a problem during local or public beta testing.

## Safety Boundary

Do not record:

- passwords;
- Supabase access tokens;
- Magic Link URLs;
- service-role keys;
- database passwords;
- API keys;
- private keys or seed phrases;
- full card, bank, SSN, EIN, or government ID data;
- private customer address details;
- real legal conclusions.

Do not use this issue log to approve:

- real loans;
- real escrow;
- real payment release;
- token collateral;
- strict RLS apply;
- production payment mode.

## Issue Entry Template

Copy one block per issue.

```text
Issue ID:
Date/time:
Tester role: founder/admin/homeowner/contractor/peer-reviewer
Environment: local/public-beta
URL:
Browser/device:
Scenario:
Steps to reproduce:
Expected result:
Actual result:
Visible non-secret error:
Request ID if visible:
Screenshot filename if saved locally:
Severity: P0/P1/P2/P3
Live-risk category: auth/admin/rls/payment/loan/escrow/mobile/ui/backend/docs
Contains secrets or private data: no
Real money involved: no
Current status: open/in-progress/fixed/retest/closed
Owner:
Next action:
```

## Severity Guide

Use simple severity:

- P0 - blocks safe demo or exposes data/risk.
- P1 - breaks important flow such as login, job, bid, dispute, admin review, or payment intent simulation.
- P2 - confusing behavior but workaround exists.
- P3 - copy, layout, polish, or documentation issue.

## Live-Risk Triage

If an issue touches any of these areas, keep public launch blocked until reviewed:

- Auth session or wrong-user access.
- Admin role access.
- RLS policy behavior.
- Payment intent visibility.
- Loan approval language.
- Escrow/payment release language.
- Token collateral language.
- Production provider credentials.

## Retest Checklist

Before closing an issue:

1. Reproduce the original failure.
2. Apply the local fix.
3. Run relevant local checks.
4. Retest the same scenario.
5. Record request ID if visible.
6. Confirm no secrets were added to docs, screenshots, commits, or chat.

## Exit Criteria

An issue can be closed when:

- the original scenario passes;
- no real-money action occurred;
- no secret was recorded;
- relevant validator or smoke test passes;
- founder-facing behavior is clear enough for a 12-year-old beginner to follow.

