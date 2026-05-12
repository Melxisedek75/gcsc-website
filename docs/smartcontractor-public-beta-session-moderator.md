# SmartContractor Public Beta Session Moderator Checklist

## Purpose

This checklist gives the founder or admin a safe moderator path for SmartContractor public beta sessions. It keeps every session demo only, avoids private tester data in repo docs, and prevents accidental approval of real payments, real loans, escrow, token collateral, legal commitments, provider commitments, or production launch claims.

Use session code, batch code, and tester cohort references instead of names, email addresses, phone numbers, calendar links, meeting links, account IDs, wallet IDs, or private contact details.

## Before Session

Confirm these items before starting:

- session code exists in the public beta session schedule;
- batch code exists in the public beta invite batch tracker;
- tester cohort and tester role are known;
- consent status is acknowledged or routed to founder review;
- privacy notice is acknowledged or routed to founder review;
- quickstart sent is yes;
- support queue owner is known;
- known issues are acceptable for this session;
- daily status, weekly closeout, and go/no-go scorecard process are ready;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Opening Script

Use this short opening:

```text
This is a SmartContractor demo only beta session. Please do not enter real customer addresses, private contact details, payment data, wallet data, passwords, Magic Link tokens, API keys, or service-role keys. We are testing clarity, trust, workflow, and safety. Real payments, real loans, escrow, and token collateral are disabled.
```

If the tester asks for legal, investment, loan approval, escrow, token collateral, payment provider, or production launch decisions, pause that topic and route it to founder review, legal review, or provider review.

## Role Flow Prompts

Homeowner:

- Can you understand how to post a job?
- Can you compare contractor bids?
- Can you understand milestone approval without making a real payment?
- Can you explain when you would open a dispute?

Contractor:

- Can you understand open bids?
- Can you submit a bid in the demo flow?
- Can you understand simulated starter loan language without treating it as loan approval?
- Can you understand verification and payment status language?

Peer reviewer:

- Can you understand evidence review?
- Can you submit a score and recommendation?
- Can you understand that rewards and reputation are demo only?

Founder/admin:

- Can you read support queue state?
- Can you map known issues to issue ID values?
- Can you update daily status and weekly closeout safely?
- Can you keep the go/no-go scorecard conservative?

## Evidence Rules

Allowed evidence:

- session code;
- batch code;
- tester cohort;
- tester role;
- safe issue ID;
- safe X-Request-Id;
- redacted screenshot notes;
- flow result: passed, confusing, blocked, stopped;
- support queue status;
- known issues status.

Do not store private contact details, email addresses, phone numbers, calendar links, meeting links, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots.

## Stop Conditions

Stop the session immediately when:

- no SQL or no secrets boundary becomes unclear;
- the tester enters private contact details, email addresses, phone numbers, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, or service-role keys;
- Auth/admin state is confusing or appears unsafe;
- payment, loan, escrow, token collateral, investment, legal, or provider language sounds like approval or advice;
- support queue has a P0 issue;
- known issues block the current role flow;
- `npm run check` is failing before the session;
- founder review, legal review, or provider review is needed.

## After Session

Record only a safe summary:

- session code;
- batch code;
- tester cohort;
- tester role;
- flow result;
- issue ID values;
- safe X-Request-Id values;
- support queue status;
- known issues status;
- daily status update needed;
- weekly closeout update needed;
- go/no-go scorecard impact;
- founder review, legal review, or provider review needed.

Do not record private identity details or raw evidence in repo docs. Keep any raw screenshots or recordings local, redacted, and handled under the beta evidence checklist.

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

The moderator checklist does not authorize external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, legal promises, provider commitments, or production launch claims.

## Founder Summary Template

Use this safe summary:

```text
SmartContractor public beta session moderator summary
Scope: demo only
Session code:
Batch code:
Tester cohort:
Tester role:
Flow result:
Issue ID:
X-Request-Id:
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
