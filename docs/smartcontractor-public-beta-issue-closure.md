# SmartContractor Public Beta Issue Closure Rules

## Purpose

These rules define when a SmartContractor public beta issue can be closed after a demo only session. They keep closure tied to safe verification evidence, support queue status, known issues, daily status, weekly closeout, and go/no-go scorecard impact without storing private data or approving live-risk actions.

Closure does not authorize real payments, real loans, escrow, token collateral, live Supabase changes, external account changes, legal decisions, provider commitments, or production launch claims.

## Closure Inputs

Use only these safe inputs:

| Input | Safe format |
|-------|-------------|
| Issue ID | Safe issue ID from beta issue log, support queue, postmortem, or escalation matrix |
| Session code | Code from the session schedule |
| Batch code | Code from invite batch tracker |
| Tester cohort | Non-identifying cohort label |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| X-Request-Id | Safe request ID when available |
| Support queue | Queue state without private contact details |
| Known issues | Known issue code or safe summary |
| Trust blocker | Plain-language blocker without private data |
| Severity | P0, P1, P2, or P3 |
| Route | product fix, technical fix, founder review, legal review, provider review, or blocked |

## Closure States

| State | Meaning |
|-------|---------|
| open | Issue still needs review or work |
| fixed locally | Product fix or technical fix is implemented locally and awaits verification |
| verified | Safe retest confirms the issue is resolved in demo only scope |
| deferred | Issue is accepted for later and does not block the current beta scope |
| blocked | Issue needs founder review, legal review, provider review, external account, live Supabase, secret, real payment, real loan, escrow, or token collateral decision |
| reopened | Issue returned after verification or new safe evidence |

## Close Criteria

An issue can move to verified only when:

- issue ID exists;
- severity is P1, P2, or P3, or a P0 has explicit founder review confirming demo only closure is safe;
- support queue status is updated;
- known issues are updated if the limitation remains visible;
- daily status and weekly closeout impact are clear;
- go/no-go scorecard impact is updated;
- product fix or technical fix has a local check, screenshot note, X-Request-Id, or safe retest note;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled remain true;
- no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys, no raw recordings, and no unredacted screenshots are included.

## Do Not Close Criteria

Do not close the issue when:

- it needs founder review, legal review, provider review, or blocked routing;
- it touches real payments, real loans, escrow, token collateral, money movement, production Auth, live Supabase, deployment account, external account, or provider credentials;
- the tester still cannot explain the homeowner, contractor, peer reviewer, or founder/admin trust path;
- support queue has an unresolved P0 or sensitive P1;
- known issues, daily status, weekly closeout, or go/no-go scorecard would become misleading;
- verification evidence contains private contact details, email addresses, phone numbers, calendar links, meeting links, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, unredacted screenshots, SQL, or secrets.

## Verification Evidence

Allowed safe evidence:

- issue ID;
- session code;
- batch code;
- tester cohort;
- tester role;
- X-Request-Id;
- support queue state;
- known issues state;
- trust blocker resolved or deferred;
- severity;
- product fix or technical fix summary;
- founder review, legal review, provider review, or blocked label;
- daily status update;
- weekly closeout update;
- go/no-go scorecard impact.

Do not attach raw recordings, unredacted screenshots, private customer data, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, SQL, or secrets.

## Closure Template

```text
SmartContractor public beta issue closure
Scope: demo only
Issue ID:
Session code:
Batch code:
Tester cohort:
Tester role:
X-Request-Id:
Support queue:
Known issues:
Trust blocker:
Severity: P0 / P1 / P2 / P3
Route: product fix / technical fix / founder review / legal review / provider review / blocked
Closure state: open / fixed locally / verified / deferred / blocked / reopened
Verification evidence:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Founder review:
Legal review:
Provider review:
Boundary check: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety check: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys, no raw recordings, no unredacted screenshots.
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
Public beta issue closure summary
Issue ID:
Closure state:
Severity:
Route:
Trust blocker:
Verification evidence:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Founder review:
Legal review:
Provider review:
Blocked reason:
Real-money gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys, no raw recordings, and no unredacted screenshots.
```
