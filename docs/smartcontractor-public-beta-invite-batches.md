# SmartContractor Public Beta Invite Batch Tracker

## Purpose

This tracker keeps SmartContractor public beta invites staged in small, reviewable waves without storing private tester identities in repo docs. It is for demo only coordination, not production analytics, legal approval, provider approval, loan approval, payment approval, escrow approval, or token-collateral approval.

Use batch code and tester cohort references instead of names, emails, phone numbers, addresses, account IDs, wallet IDs, or private contact details.

## Safe Batch Fields

Allowed fields:

| Field | Safe Example |
|-------|--------------|
| Batch code | `PB-BATCH-01` |
| Tester cohort | `PB-COHORT-A` |
| Tester role mix | homeowner, contractor, peer reviewer, founder/admin |
| Target count | `5` |
| Invited count | `3` |
| Accepted count | `2` |
| Invite status | planned, sent, accepted, paused, blocked |
| Consent status | not sent, sent, acknowledged, withdrawn, review |
| Privacy notice | not sent, sent, acknowledged, review |
| Quickstart sent | yes/no |
| Support queue | none, open, reviewing, blocked, closed |
| Known issues | none, documented, review, blocked |
| X-Request-Id | safe short request ID only |
| Daily status | pending, included, blocked |
| Weekly closeout | pending, included, blocked |
| Go/no-go scorecard | green, review, no-go, blocked |

## Batch Size Rules

- Batch 0: founder/admin internal only.
- Batch 1: 3-5 trusted testers with homeowner, contractor, peer reviewer, and founder/admin coverage.
- Batch 2: 5-10 testers only after Batch 1 has no P0/P1 blockers.
- No wider public wave until founder review is complete and legal review or provider review is complete where needed.

## Batch Gates

Before marking a batch ready to send:

- public beta launch readiness is green or explicitly approved for review;
- tester cohort tracker is ready;
- public beta launch message is ready;
- public beta tester FAQ is ready;
- public beta consent acknowledgement is ready;
- public beta privacy notice is ready;
- public beta tester quickstart is ready;
- support queue owner is known;
- known issues are documented and acceptable for this batch;
- daily status, weekly closeout, and go/no-go scorecard process are ready;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Batch Table Template

Use this table in a private founder working note, not as a public artifact:

| Batch code | Tester cohort | Tester role mix | Target count | Invited count | Accepted count | Invite status | Consent status | Privacy notice | Quickstart sent | Support queue | Known issues | X-Request-Id | Daily status | Weekly closeout | Go/no-go scorecard |
|------------|---------------|-----------------|--------------|---------------|----------------|---------------|----------------|----------------|-----------------|---------------|--------------|--------------|--------------|-----------------|--------------------|
| PB-BATCH-00 | internal | founder/admin | 1 | 0 | 0 | planned | not sent | not sent | no | none | documented | none | pending | pending | review |
| PB-BATCH-01 | PB-COHORT-A | homeowner, contractor, peer reviewer, founder/admin | 5 | 0 | 0 | planned | not sent | not sent | no | none | documented | none | pending | pending | review |
| PB-BATCH-02 | PB-COHORT-B | homeowner, contractor, peer reviewer | 10 | 0 | 0 | planned | not sent | not sent | no | none | review | none | pending | pending | blocked |

## Pause Rules

Pause a batch and route to founder review when any of these happen:

- any no SQL or no secrets boundary is unclear;
- private contact details, email addresses, phone numbers, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, or service-role keys appear in tester evidence;
- Auth/admin state is confusing to testers;
- payment, loan, escrow, token collateral, investment, legal, or provider language creates confusion;
- support queue has unresolved P0 issues;
- known issues become unacceptable for the next invite wave;
- `npm run check` fails before sending;
- legal review or provider review is needed before continuing.

## Blocked Data

Do not store or paste:

- no SQL;
- no secrets;
- private contact details;
- email addresses;
- phone numbers;
- real customer addresses;
- payment data;
- wallet data;
- database URLs;
- API keys;
- Magic Link tokens;
- service-role keys;
- raw recordings;
- unredacted screenshots.

The invite batch tracker does not authorize external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, legal promises, provider commitments, or production launch claims.

## Founder Summary Template

Use this safe summary:

```text
SmartContractor public beta invite batch
Scope: demo only
Batch code:
Tester cohort:
Tester role mix:
Target count:
Invited count:
Accepted count:
Invite status:
Consent status:
Privacy notice:
Quickstart sent:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Founder review needed:
Legal review needed:
Provider review needed:
Boundaries confirmed: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no private contact details, no email addresses, no phone numbers, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, and no service-role keys included.
```
