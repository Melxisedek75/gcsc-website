# SmartContractor Public Beta Metrics Snapshot

## Purpose

This document gives the founder a safe, non-secret template for summarizing SmartContractor public beta usage signals without exposing raw user data, private contact details, wallet data, payment data, or live database records.

This is for demo only public beta tracking. It is not analytics implementation, legal advice, investor reporting, production readiness approval, or permission to query live systems. Before public launch, analytics, privacy, data retention, provider review, and legal review remain required.

## When To Use This

Use this when preparing a daily status, weekly closeout, founder review packet, partner packet, grant packet, or go/no-go scorecard and you need safe summary numbers.

Do not use this to export raw database rows, run SQL, copy logs with secrets, identify testers, approve real payments, approve real loans, release escrow, or use token collateral.

## Safe Metrics Fields

The founder can record only these safe fields:

| Field | Safe Example |
|-------|--------------|
| Public beta URL | `PUBLIC_SITE_URL` |
| Week label | Week 1 public beta |
| Snapshot date | 2026-05-12 |
| Tester count | 3 |
| Tester role coverage | homeowner, contractor, peer reviewer |
| Session count | 4 demo sessions |
| Issue ID range | `BETA-001` to `BETA-009` |
| X-Request-Id examples | safe short request IDs only |
| Support queue status | open, reviewing, closed, or blocked |
| Known issues status | fixed, accepted limitation, blocked, or under review |
| Daily status link or note | daily status drafted, reviewed, or blocked |
| Weekly closeout link or note | weekly closeout drafted, reviewed, or blocked |
| Go/no-go scorecard result | go, review, no-go, or blocked |

Do not store private contact details, personal IDs, payment data, wallet data, real customer addresses, no SQL, no secrets, database URLs, API keys, Magic Link tokens, or service-role keys in the metrics snapshot.

## Metric Groups

Record only aggregated counts:

- tester count by tester role;
- session count by role and day;
- job posts created in demo mode;
- bid submissions created in demo mode;
- starter loan requests created in demo mode;
- milestone views or milestone status checks;
- dispute submissions created in demo mode;
- peer review submissions created in demo mode;
- admin review views or founder dashboard checks;
- support queue items opened, closed, and blocked;
- known issues by severity;
- completion rate for the safe demo flow;
- trust signal notes, such as whether testers understood verified contractors, milestones, disputes, and peer review;
- blocked flow notes, such as where users stopped or needed help;
- daily status and weekly closeout readiness;
- go/no-go scorecard outcome.

## Founder Review Rules

Use these rules when reading the numbers:

- Low usage may mean onboarding is unclear, not that the product is weak.
- High starter loan requests do not mean loan approval demand, because real loans disabled.
- Payment or escrow interest does not authorize money movement, because real payments disabled and escrow disabled.
- Token collateral interest does not authorize collateral use, because token collateral disabled.
- Repeated support queue questions should become UX fixes before broader tester invites.
- Any privacy, consent, or legal concern routes to founder review, legal review, and provider review.
- Metrics are directional founder review inputs, not investor traction claims, legal approval, loan approval, provider approval, or production analytics proof.

## Metrics Snapshot Format

Use this safe log format:

```text
SmartContractor public beta metrics snapshot
Scope: demo only
PUBLIC_SITE_URL:
Week label:
Snapshot date:
Tester count:
Tester role coverage:
Session count:
Job posts:
Bid submissions:
Starter loan requests:
Milestone views:
Dispute submissions:
Peer review submissions:
Admin review views:
Issue ID range:
X-Request-Id examples:
Support queue status:
Known issues status:
Daily status:
Weekly closeout:
Completion rate:
Trust signal:
Blocked flow:
Go/no-go scorecard result:
Live-risk gates: real payments disabled / real loans disabled / escrow disabled / token collateral disabled
Founder review required: yes/no
Legal review required: yes/no
Provider review required: yes/no
```

The log must not include SQL, secrets, personal IDs, private contact details, payment data, wallet data, real customer addresses, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Blocked Actions

This metrics snapshot does not authorize:

- live Supabase SQL changes;
- external account changes;
- production analytics setup;
- legal promises;
- investment claims;
- processing real payments;
- approving real loans;
- releasing escrow;
- using token collateral;
- sharing private tester contact details.

Those actions require founder review, legal review, provider review, and the final public launch process.

## Founder Summary Template

Use this short summary:

```text
SmartContractor public beta metrics snapshot remained demo only.

Tester count:
Tester role coverage:
Session count:
Job posts:
Bid submissions:
Starter loan requests:
Dispute submissions:
Peer review submissions:
Support queue status:
Known issues status:
Daily status:
Weekly closeout:
Completion rate:
Trust signal:
Blocked flow:
Go/no-go scorecard:

Boundaries still active: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no personal IDs, no private contact details, no payment data, no wallet data, no real customer addresses, no database URLs, no API keys, no Magic Link tokens, and no service-role keys are included.
```
