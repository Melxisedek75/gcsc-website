# SmartContractor Beta Decision Log

Date: 2026-05-11 PT

Purpose: non-secret decision log for controlled beta findings. Use this file after each beta session summary to record what will be fixed now, deferred, blocked, or escalated to founder/legal/provider review.

This file is not legal advice, lending approval, payment approval, escrow approval, token approval, or production launch approval.

## Safety Boundary

Do not record:

- passwords;
- Magic Link URLs;
- Supabase access tokens;
- service-role keys;
- database passwords;
- API keys;
- private keys or seed phrases;
- full card, bank, SSN, EIN, or government ID data;
- private homeowner or contractor address details;
- real legal conclusions.

Do not use this log to approve:

- real loans;
- real escrow;
- real payment release;
- production payment provider mode;
- token collateral lock, liquidation, or margin call;
- strict RLS apply;
- founder/admin live role assignment.

## Decision Categories

Use exactly one category for each decision:

- `fix-now` - must be fixed before the next tester session.
- `fix-before-public-beta` - can wait for controlled testing, but blocks public beta.
- `defer` - useful, but not blocking demo or public beta.
- `founder-review` - needs founder business decision.
- `legal-review` - needs attorney/payment/lending review.
- `provider-review` - needs payment, identity, wallet, cloud, or deployment provider review.
- `blocked` - cannot move until a required account, secret, approval, or external setup exists.

## Decision Entry Template

Copy one block per decision.

```text
Decision ID:
Date/time:
Source: beta-session-summary/issue-log/founder-review/local-test
Related issue IDs:
Category: fix-now/fix-before-public-beta/defer/founder-review/legal-review/provider-review/blocked
Area: auth/admin/rls/payment/loan/escrow/dispute/mobile/ui/backend/docs/legal/provider
Decision:
Reason:
Founder-visible impact:
Risk if ignored:
Owner:
Target before: next-session/public-beta/real-money-pilot/later
Validation needed:
Status: open/in-progress/done/blocked/review
Secrets/private data included: no
Real money approved: no
```

## Launch Gate Rules

Keep public beta blocked if any open decision has:

- category `fix-now`;
- area `auth`, `admin`, `rls`, `payment`, `loan`, or `escrow` with P0/P1 impact;
- status `blocked` or `review` for a live-risk surface;
- missing validation for a core homeowner, contractor, dispute, payment-intent, or admin flow.

Keep real-money pilot blocked unless all of these are complete:

- attorney review for loans, escrow, contractor credit, token collateral, and business-control language;
- payment/provider review for production payment mode;
- strict RLS apply and smoke tests;
- founder/admin live role activation and strict admin smoke tests;
- production deployment security review;
- written founder approval.

## Review Cadence

After each controlled beta session:

1. Read the session summary.
2. Read the issue log.
3. Add or update decisions here.
4. Mark P0/P1 items that block the next tester round.
5. Keep all legal/payment/provider decisions in review until the right human or vendor approves them.
6. Run relevant validators before changing launch status.
