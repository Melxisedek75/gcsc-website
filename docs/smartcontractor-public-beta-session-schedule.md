# SmartContractor Public Beta Session Schedule

## Purpose

This schedule keeps SmartContractor public beta sessions organized without storing private tester identities or meeting details in repo docs. It is for demo only coordination, not production analytics, legal approval, provider approval, loan approval, payment approval, escrow approval, or token-collateral approval.

Use session code, batch code, and tester cohort references instead of names, email addresses, phone numbers, calendar links, meeting links, account IDs, wallet IDs, or private contact details.

## Safe Schedule Fields

Allowed fields:

| Field | Safe Example |
|-------|--------------|
| Session code | `PB-SESSION-001` |
| Batch code | `PB-BATCH-01` |
| Tester cohort | `PB-COHORT-A` |
| Tester role | homeowner, contractor, peer reviewer, founder/admin |
| Session type | walkthrough, role test, issue replay, founder review |
| Time window | morning, afternoon, evening |
| Timezone | PT, ET, UTC |
| Invite status | planned, sent, accepted, paused, blocked |
| Consent status | not sent, sent, acknowledged, withdrawn, review |
| Privacy notice | not sent, sent, acknowledged, review |
| Quickstart sent | yes/no |
| Session status | unscheduled, scheduled, complete, no-show, rescheduled, stopped, blocked |
| Support queue | none, open, reviewing, blocked, closed |
| Known issues | none, documented, review, blocked |
| X-Request-Id | safe short request ID only |
| Daily status | pending, included, blocked |
| Weekly closeout | pending, included, blocked |
| Go/no-go scorecard | green, review, no-go, blocked |

## Session Types

- walkthrough: founder/admin watches the tester follow the demo path;
- role test: homeowner, contractor, or peer reviewer checks one role-specific flow;
- issue replay: tester repeats a known issue after a fix;
- founder review: founder/admin checks support, known issues, daily status, weekly closeout, and go/no-go scorecard.

## Session Gates

Before marking a session scheduled:

- the public beta invite batch tracker is ready;
- the tester cohort tracker is ready;
- invite status is accepted or explicitly planned for founder review;
- consent status is acknowledged or routed to founder review;
- privacy notice is acknowledged or routed to founder review;
- quickstart sent is yes;
- known issues are acceptable for this session;
- support queue owner is known;
- daily status, weekly closeout, and go/no-go scorecard process are ready;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Schedule Table Template

Use this table in a private founder working note, not as a public artifact:

| Session code | Batch code | Tester cohort | Tester role | Session type | Time window | Timezone | Invite status | Consent status | Privacy notice | Quickstart sent | Session status | Support queue | Known issues | X-Request-Id | Daily status | Weekly closeout | Go/no-go scorecard |
|--------------|------------|---------------|-------------|--------------|-------------|----------|---------------|----------------|----------------|-----------------|----------------|---------------|--------------|--------------|--------------|-----------------|--------------------|
| PB-SESSION-001 | PB-BATCH-00 | internal | founder/admin | founder review | evening | PT | planned | acknowledged | acknowledged | yes | unscheduled | none | documented | none | pending | pending | review |
| PB-SESSION-002 | PB-BATCH-01 | PB-COHORT-A | homeowner | role test | evening | PT | planned | not sent | not sent | no | unscheduled | none | documented | none | pending | pending | review |
| PB-SESSION-003 | PB-BATCH-01 | PB-COHORT-A | contractor | role test | evening | PT | planned | not sent | not sent | no | unscheduled | none | documented | none | pending | pending | review |
| PB-SESSION-004 | PB-BATCH-01 | PB-COHORT-A | peer reviewer | role test | evening | PT | planned | not sent | not sent | no | unscheduled | none | documented | none | pending | pending | review |

## No-Show And Reschedule Rules

- Mark a missed session as no-show, not failed.
- Reschedule only after consent status, privacy notice, quickstart sent, support queue, and known issues are still safe.
- Do not store calendar links, meeting links, email addresses, phone numbers, or private contact details in repo docs.
- If a tester asks legal, payment, loan, escrow, token collateral, or provider questions, route to founder review, legal review, or provider review.

## Pause Rules

Pause a session and route to founder review when any of these happen:

- any no SQL or no secrets boundary is unclear;
- private contact details, email addresses, phone numbers, calendar links, meeting links, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, or service-role keys appear in tester evidence;
- Auth/admin state is confusing to testers;
- payment, loan, escrow, token collateral, investment, legal, or provider language creates confusion;
- support queue has unresolved P0 issues;
- known issues become unacceptable for the scheduled session;
- `npm run check` fails before the session;
- legal review or provider review is needed before continuing.

## Blocked Data

Do not store or paste:

- no SQL;
- no secrets;
- private contact details;
- email addresses;
- phone numbers;
- calendar links;
- meeting links;
- real customer addresses;
- payment data;
- wallet data;
- database URLs;
- API keys;
- Magic Link tokens;
- service-role keys;
- raw recordings;
- unredacted screenshots.

The session schedule does not authorize external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, legal promises, provider commitments, or production launch claims.

## Founder Summary Template

Use this safe summary:

```text
SmartContractor public beta session schedule
Scope: demo only
Session code:
Batch code:
Tester cohort:
Tester role:
Session type:
Time window:
Timezone:
Invite status:
Consent status:
Privacy notice:
Quickstart sent:
Session status:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Founder review needed:
Legal review needed:
Provider review needed:
Boundaries confirmed: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, and no service-role keys included.
```
