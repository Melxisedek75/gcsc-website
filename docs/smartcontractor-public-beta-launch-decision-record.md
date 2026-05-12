# SmartContractor Public Beta Launch Decision Record

## Purpose

This record gives the founder one safe place to decide whether SmartContractor public beta can move forward in demo only scope. It ties together QA signoff, go/no-go scorecard, launch readiness, support queue, known issues, daily status, weekly closeout, launch message, tester FAQ, consent acknowledgement, privacy notice, rollback drill, and incident response.

This decision record does not approve production launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, token collateral, or money movement.

## Decision Options

| Decision | Meaning |
|----------|---------|
| Go | Founder approves demo only public beta sharing after all required inputs are safe |
| Review | Founder wants one or more items clarified before sharing the beta link |
| No-Go | Public beta sharing is blocked until listed issues are fixed or routed |

## Required Inputs

The founder decision must reference:

- QA signoff;
- go/no-go scorecard;
- launch readiness;
- support queue;
- known issues;
- daily status;
- weekly closeout;
- launch message;
- tester FAQ;
- consent acknowledgement;
- privacy notice;
- rollback drill;
- incident response;
- public beta URL if available;
- X-Request-Id examples from safe smoke checks when available;
- disabled gates: real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Automatic No-Go

Decision must stay No-Go when:

- any open P0 affects homeowner, contractor, peer reviewer, or founder/admin trust;
- any sensitive P1 is not verified, routed, or documented in known issues;
- support queue has unresolved founder review, legal review, provider review, or blocked items;
- QA signoff is missing or says Review/No-Go;
- go/no-go scorecard says No-Go;
- launch readiness says No-Go;
- launch message, tester FAQ, consent acknowledgement, or privacy notice is missing;
- rollback drill or incident response is missing;
- public beta URL has not been checked when a URL is available;
- evidence includes SQL, secrets, private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, or service-role keys;
- real payments disabled, real loans disabled, escrow disabled, or token collateral disabled is not true.

## Founder Decision Template

```text
SmartContractor public beta launch decision
Scope: demo only
Decision: Go / Review / No-Go
Founder decision date:
Public beta URL:
QA signoff:
Go/no-go scorecard:
Launch readiness:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Launch message:
Tester FAQ:
Consent acknowledgement:
Privacy notice:
Rollback drill:
Incident response:
Open P0:
Sensitive P1:
Founder review:
Legal review:
Provider review:
Blocked items:
X-Request-Id examples:
Disabled gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety check: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no raw recordings, no unredacted screenshots, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys.
```

## Safe Evidence

Allowed evidence:

- aggregate support queue status;
- known issues code or safe summary;
- go/no-go scorecard decision;
- QA signoff decision;
- launch readiness decision;
- daily status summary;
- weekly closeout summary;
- public beta URL checked status;
- X-Request-Id examples;
- founder review, legal review, provider review, or blocked labels.

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

## After Decision

If the decision is Go:

- keep scope demo only;
- share only approved launch message and tester FAQ;
- keep consent acknowledgement and privacy notice visible;
- keep rollback drill and incident response ready;
- continue monitoring support queue, known issues, daily status, weekly closeout, and go/no-go scorecard.

If the decision is Review or No-Go:

- route issues to product fix, technical fix, founder review, legal review, provider review, or blocked;
- do not send the public beta URL;
- do not change live Supabase, external accounts, legal positions, real payments, real loans, escrow, or token collateral.
