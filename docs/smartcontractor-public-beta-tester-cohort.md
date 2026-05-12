# SmartContractor Public Beta Tester Cohort Tracker

## Purpose

This tracker keeps the first SmartContractor public beta cohort organized without storing private tester identities in repo docs. It is for demo only coordination, not production analytics, legal approval, provider approval, loan approval, payment approval, escrow approval, or token-collateral approval.

Use tester codes instead of names, emails, phone numbers, addresses, account IDs, wallet IDs, or other personal IDs.

## Safe Cohort Fields

Allowed fields:

| Field | Safe Example |
|-------|--------------|
| Tester code | `PB-HO-001` |
| Tester role | homeowner, contractor, peer reviewer, founder/admin |
| Invite status | planned, sent, accepted, declined, paused |
| Consent status | not sent, sent, acknowledged, withdrawn, review |
| Privacy notice | not sent, sent, acknowledged, review |
| Quickstart sent | yes/no |
| Session status | unscheduled, scheduled, complete, blocked, stopped |
| Support queue | none, open, reviewing, closed, blocked |
| Issue ID | `BETA-001` |
| X-Request-Id | safe short request ID only |
| Daily status | included, pending, blocked |
| Weekly closeout | included, pending, blocked |
| Go/no-go scorecard | green, review, no-go, blocked |

## Allowed Statuses

Use only simple status words:

- planned;
- sent;
- accepted;
- declined;
- paused;
- acknowledged;
- withdrawn;
- unscheduled;
- scheduled;
- complete;
- blocked;
- stopped;
- green;
- review;
- no-go.

Any confusing consent, privacy, payment, loan, escrow, token, legal, or provider question routes to founder review, legal review, or provider review.

## Role Coverage

The first cohort should include safe role coverage:

- homeowner tester for job intake, bid review, milestone clarity, dispute clarity, and trust language;
- contractor tester for bid submission, simulated starter loan request, verification clarity, and payment-status clarity;
- peer reviewer tester for evidence review, scoring, recommendation language, and reward/reputation clarity;
- founder/admin tester for Founder Action Center, support queue, known issues, daily status, weekly closeout, and go/no-go scorecard.

## Invite Rules

Before marking an invite as sent:

- public beta launch readiness is green or explicitly approved for review;
- public beta launch message is ready;
- public beta tester FAQ is ready;
- public beta consent acknowledgement is ready;
- public beta privacy notice is ready;
- public beta tester quickstart is ready;
- support queue owner is known;
- known issues are documented;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Cohort Table Template

Use this table in a private founder working note, not as a public artifact:

| Tester code | Tester role | Invite status | Consent status | Privacy notice | Quickstart sent | Session status | Support queue | Issue ID | X-Request-Id | Daily status | Weekly closeout | Go/no-go scorecard |
|-------------|-------------|---------------|----------------|----------------|-----------------|----------------|---------------|----------|--------------|--------------|-----------------|--------------------|
| PB-HO-001 | homeowner | planned | not sent | not sent | no | unscheduled | none | none | none | pending | pending | review |
| PB-CO-001 | contractor | planned | not sent | not sent | no | unscheduled | none | none | none | pending | pending | review |
| PB-PR-001 | peer reviewer | planned | not sent | not sent | no | unscheduled | none | none | none | pending | pending | review |
| PB-AD-001 | founder/admin | planned | not sent | not sent | no | unscheduled | none | none | none | pending | pending | review |

## Blocked Data

Do not store or paste:

- no SQL;
- no secrets;
- personal IDs;
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

The cohort tracker does not authorize external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, legal promises, or production launch claims.

## Founder Summary Template

Use this safe summary:

```text
SmartContractor public beta tester cohort
Scope: demo only
Homeowner testers:
Contractor testers:
Peer reviewer testers:
Founder/admin testers:
Invites sent:
Consent acknowledged:
Privacy notice acknowledged:
Sessions complete:
Support queue:
Known issue IDs:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Founder review needed:
Legal review needed:
Provider review needed:
Boundaries confirmed: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
No SQL, no secrets, no personal IDs, no private contact details, no email addresses, no phone numbers, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, and no service-role keys included.
```
