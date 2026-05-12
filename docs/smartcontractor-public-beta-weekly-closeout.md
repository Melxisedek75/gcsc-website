# SmartContractor Public Beta Weekly Closeout

## Purpose

This document gives the founder a weekly closeout template for SmartContractor public beta progress, risks, tester feedback, support queue state, and next safe decisions.

This is for demo only public beta work. It is not legal advice, investment advice, loan approval, production readiness approval, or permission to enable live money movement. Before wider launch, founder review, legal review, provider review, Auth/RLS review, and deployment review remain required.

## When To Use This

Use this at the end of each public beta week to summarize:

- tester count and tester role coverage;
- known issues and support queue status;
- daily status trends;
- issue ID and X-Request-Id patterns;
- consent acknowledgement and privacy notice status;
- consent withdrawal request, data deletion request, data export request, data correction request, and use restriction request items;
- go/no-go scorecard changes;
- next safe actions for the following week.

## Safe Closeout Fields

The founder can record only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Week label | 2026-W20 |
| Tester count | 3 |
| Tester role coverage | homeowner, contractor, peer reviewer |
| Issue ID range | `BETA-001` to `BETA-009` |
| X-Request-Id examples | safe short request IDs only |
| Support queue status | open, reviewing, closed, or blocked |
| Known issues status | fixed, accepted limitation, blocked, or under review |
| Consent/privacy status | current, pending review, blocked, or escalated |
| Founder decision | continue, hold, fix first, founder review, legal review, or provider review |

Do not store private contact details, personal IDs, payment data, wallet data, real customer addresses, no SQL, no secrets, database URLs, API keys, Magic Link tokens, or service-role keys in the closeout log.

## Weekly Review Sections

Review these sections every week:

1. Demo flow health: jobs, bids, loans, milestones, disputes, peer review, and admin review.
2. Trust feedback: what made homeowners or contractors trust or distrust the flow.
3. Credit clarity: whether tester language confused demo starter loans with real loan approval.
4. Payment clarity: whether testers understood real payments disabled, escrow disabled, and token collateral disabled.
5. Support queue: open issues, blocked issues, repeated questions, and response timing.
6. Evidence safety: screenshots, recordings, redacted summaries, and artifact review state.
7. Consent and privacy: consent acknowledgement, privacy notice, consent withdrawal request, deletion/export/correction/use restriction requests.
8. Launch gates: Auth/RLS, admin membership, deployment, legal review, provider review, and external account blockers.

## Founder Decision Options

Choose one weekly decision:

- continue public beta with same demo only scope;
- continue but fix P0/P1 issues first;
- hold tester invites until Auth/RLS/admin/deploy clarity improves;
- route to founder review;
- route to legal review;
- route to provider review;
- stop public beta until a live-risk concern is resolved.

No option enables real payments, real loans, escrow, token collateral, live Supabase changes, or external account changes.

## Closeout Log Format

Use this safe log format:

```text
SmartContractor public beta weekly closeout
Scope: demo only
PUBLIC_SITE_URL:
Week label:
Tester count:
Tester role coverage:
Issue ID range:
X-Request-Id examples:
Support queue status:
Known issues status:
Daily status summary:
Go/no-go scorecard result:
Consent acknowledgement status:
Privacy notice status:
Consent withdrawal request status:
Data deletion request status:
Data export request status:
Data correction request status:
Use restriction request status:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
Legal review required: yes/no
Provider review required: yes/no
Next safe action:
```

The log must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This closeout template does not authorize:

- live Supabase SQL changes;
- external account changes;
- production deploy changes;
- legal promises;
- investment claims;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- sharing private tester contact details.

Those actions require founder review, legal review, provider review, and the final public launch process.

## Founder Summary Template

Use this short summary when reviewing the week:

```text
This week SmartContractor public beta remained demo only.

Tester count:
Tester role coverage:
Main trust signal:
Main blocker:
Highest-severity issue ID:
Support queue status:
Consent/privacy status:
Go/no-go scorecard:
Next safe action:

Boundaries still active: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no personal IDs, no private contact details, no payment data, no wallet data, no real customer addresses, no database URLs, no API keys, no Magic Link tokens, and no service-role keys are included.
```
