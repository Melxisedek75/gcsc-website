# SmartContractor Public Beta Week-Two Day-Two Checkpoint

## Purpose

This checkpoint reviews the second day of public beta week two in demo-only mode. It decides whether the beta stays with the current group, adds one small batch, runs targeted retests, holds expansion, reduces scope, pauses, or becomes blocked before any live-risk action.

## Required Inputs

- public beta week-two plan
- public beta week-two kickoff
- public beta week-two day-one status
- public beta week-one decision
- launch status board
- daily status
- support queue
- support SLA
- known issues
- metrics snapshot
- regression checklist
- QA signoff
- tester cohort
- invite batches
- session schedule
- session postmortem
- privacy notice
- consent acknowledgement
- consent withdrawal request
- data deletion request
- data export request
- data correction request
- use restriction request
- public beta terms summary
- tester offboarding
- X-Request-Id

## Checkpoint Fields

- Date:
- Checkpoint owner:
- Current week-two scope:
- Day-one carryover issues:
- Sessions completed:
- Sessions scheduled:
- Tester cohort codes:
- Invite batch codes:
- Open P0:
- Open P1:
- Support queue count:
- Support SLA state:
- Known issue changes:
- Metrics snapshot changes:
- Regression checklist state:
- QA signoff state:
- Privacy/consent/data requests:
- Evidence cleanup state:
- Founder review:
- Legal review:
- Provider review:
- Decision:
- Next safe action:
- X-Request-Id:

## Decision Options

- Continue current group: current tester group continues with no new invite batch.
- Add one small batch: one controlled invite batch is added only if support, QA, privacy, consent, data request, known issue, and metrics gates are clear.
- Run targeted retest: only P0/P1 fixes, regression checklist paths, and trust blockers are retested.
- Hold expansion: current testers may continue, but no new invite batch starts.
- Reduce scope: fewer sessions, fewer roles, or fewer flows continue until support and issue load stabilize.
- Pause beta: sessions stop until automatic stop gates are cleared.
- Blocked: founder review, legal review, provider review, Auth/admin, deployment, payment, loan, escrow, token collateral, wallet, live database, or external account action is required.

## Automatic Stop Gates

- Any open P0 involving trust, privacy, consent, Auth, admin, deployment, payments, loans, escrow, token collateral, wallet data, payment data, real customer addresses, sensitive evidence, or legal/provider ambiguity.
- Any P1 without owner/date/status when it affects homeowner trust, contractor trust, dispute confidence, support load, beta comprehension, or tester safety.
- Any support SLA miss without owner/date/status.
- Any recurring tester confusion missing from known issues.
- Any privacy, consent, data deletion request, data export request, data correction request, or use restriction request without owner/date/status.
- Any request for private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, provider credentials, or live account data.

## Safe Checkpoint Template

```text
Public beta week-two day-two checkpoint:
Date:
Decision: Continue current group / Add one small batch / Run targeted retest / Hold expansion / Reduce scope / Pause beta / Blocked
Reason:
Day-one carryover issues:
Sessions completed:
Sessions scheduled:
Tester cohort codes:
Invite batch codes:
Open P0:
Open P1:
Support queue:
Support SLA:
Known issues:
Metrics snapshot:
Regression checklist:
QA signoff:
Privacy/consent/data requests:
Evidence cleanup:
Founder review:
Legal review:
Provider review:
Next safe action:
X-Request-Id:
```

## Blocked Data

Do not store or paste private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, provider credentials, live account data, or legal advice in this checkpoint.

Hard boundary: no SQL, no secrets, no live database changes, no external account changes, no real payments, no real loans, no escrow, no token collateral, no investment advice, no loan approval, and no token appreciation claim belong in this checkpoint.
