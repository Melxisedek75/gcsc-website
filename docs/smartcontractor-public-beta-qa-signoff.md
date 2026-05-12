# SmartContractor Public Beta QA Signoff

## Purpose

This document defines the demo only QA signoff package before SmartContractor public beta scope is treated as ready for founder review. It ties issue closure, regression checklist results, role coverage, support queue status, known issues, daily status, weekly closeout, and go/no-go scorecard into one safe decision record.

QA signoff does not authorize production launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, or token collateral.

## Signoff Inputs

Use only these safe inputs:

| Input | Safe format |
|-------|-------------|
| Public beta scope | demo only |
| Go/no-go scorecard | Go, Review, or No-Go with safe reason |
| Daily status | Safe summary without private data |
| Weekly closeout | Safe summary without private data |
| Support queue | Counts and issue IDs, no private contact details |
| Known issues | Known issue code or safe summary |
| Issue ID | Safe issue ID from the issue log |
| Closure state | open, verified, reopened, blocked, deferred, or fixed locally |
| Regression checklist | Passed, Review, Blocked, or Not run |
| X-Request-Id | Safe request ID when available |

## Required Evidence

QA signoff needs:

- `npm run check` passing locally;
- go/no-go scorecard updated;
- daily status updated;
- weekly closeout updated;
- support queue reviewed;
- known issues reviewed;
- all P0 issues verified or blocked for founder review;
- sensitive P1 issues verified, reopened, or routed to founder review, legal review, provider review, or blocked;
- regression checklist completed for product fix and technical fix items;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Role Coverage

| Role | Required demo-only proof |
|------|--------------------------|
| homeowner | Can understand job post, milestone, dispute, support queue, and known issues limits |
| contractor | Can understand bid submission, starter loan demo state, milestone payment display, and disabled real-loan boundary |
| peer reviewer | Can understand peer review scoring, evidence limits, and no legal/payment authority |
| founder/admin | Can understand admin review, issue gates, go/no-go scorecard, and blocked live-risk routing |

## Issue Gates

| Severity | Signoff requirement |
|----------|---------------------|
| P0 | Must be verified, blocked for founder review, or kept No-Go |
| P1 | Must be verified, reopened, or routed to founder review, legal review, provider review, product fix, technical fix, or blocked |
| P2 | Must be verified, deferred with known issues, or assigned to a safe owner |
| P3 | Can be deferred when known issues and tester-facing language are clear |

## No-Go Conditions

QA signoff must stay No-Go when:

- any unresolved P0 affects homeowner, contractor, peer reviewer, or founder/admin trust;
- any support queue item implies legal review, provider review, or founder review and is not routed;
- known issues hide a limitation that testers must know;
- go/no-go scorecard, daily status, or weekly closeout would be misleading;
- regression checklist for a product fix or technical fix is missing;
- evidence includes SQL, secrets, private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, or service-role keys;
- real payments disabled, real loans disabled, escrow disabled, or token collateral disabled is not true.

## Signoff Template

```text
SmartContractor public beta QA signoff
Scope: demo only
Decision: Go / Review / No-Go
Go/no-go scorecard:
Daily status:
Weekly closeout:
Support queue:
Known issues:
Open P0:
Open sensitive P1:
Verified issue IDs:
Reopened issue IDs:
Blocked issue IDs:
Regression checklist: Passed / Review / Blocked / Not run
X-Request-Id examples:
Role coverage: homeowner / contractor / peer reviewer / founder-admin
Founder review:
Legal review:
Provider review:
Product fix:
Technical fix:
Safety gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Blocked data check: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no raw recordings, no unredacted screenshots, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys.
```

## Blocked Data

Do not store or paste:

- no SQL;
- no secrets;
- private contact details;
- email addresses;
- phone numbers;
- calendar links;
- meeting links;
- raw recordings;
- unredacted screenshots;
- real customer addresses;
- payment data;
- wallet data;
- database URLs;
- API keys;
- Magic Link tokens;
- service-role keys.

## Founder Summary Template

```text
Public beta QA summary
Decision:
Demo-only scope:
Checks:
Role coverage:
P0 status:
P1 status:
Support queue:
Known issues:
Regression checklist:
Go/no-go scorecard:
Daily status:
Weekly closeout:
Founder review:
Legal review:
Provider review:
Blocked reason:
Real-money gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no raw recordings, no unredacted screenshots, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys.
```
