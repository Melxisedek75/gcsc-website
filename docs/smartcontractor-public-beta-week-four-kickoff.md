# SmartContractor Public Beta Week-Four Kickoff

## Purpose

This kickoff checklist starts public beta week four in demo-only mode from the week-four plan. It keeps the cycle limited to safe tester sessions, support review, known-issue review, privacy/data request readiness, stabilization, and focused retests without enabling legal, payment, loan, escrow, token collateral, wallet, live database, deployment, or external account actions.

## Required Inputs

- public beta week-four plan
- public beta week-three closeout
- public beta week-three day-seven readiness
- launch status board
- daily status
- weekly closeout
- support queue
- support SLA
- known issues
- issue escalation matrix
- issue closure rules
- metrics snapshot
- regression checklist
- QA signoff
- tester cohort
- invite batches
- session schedule
- session moderator checklist
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

## Kickoff Fields

- Date:
- Kickoff owner:
- Week-four plan decision:
- Week-three closeout carryover:
- Tester group:
- Invite batch:
- Session schedule:
- Stabilization focus:
- Retest focus:
- New test focus:
- Support queue count:
- Support SLA state:
- Known issue changes:
- Metrics snapshot baseline:
- Regression checklist state:
- QA signoff state:
- Privacy/consent/data request readiness:
- Evidence cleanup readiness:
- Founder review:
- Legal review:
- Provider review:
- Decision:
- Next safe action:
- X-Request-Id:

## Kickoff Decisions

- Start current group: week four starts only for current approved testers and current approved demo-only flows.
- Run focused retest: kickoff is limited to fixed P0/P1 paths, regression checklist paths, support blockers, trust blockers, or confusing flows.
- Stabilize only: no new flows or invite batches start; only support, known issues, metrics, QA, privacy, and evidence cleanup continue.
- Limited expansion: one small invite batch can start only if support SLA, known issues, metrics, QA signoff, regression checklist, privacy, and data request gates are clean.
- Hold kickoff: plan exists, but support, known issues, metrics, privacy, QA, or schedule evidence is not clean enough.
- Reduce scope: only the lowest-risk roles or flows remain active.
- Pause beta: sessions stop until automatic no-go gates are cleared.
- Blocked: founder review, legal review, provider review, Auth/admin, deployment, payment, loan, escrow, token collateral, wallet, live database, or external account action is required.

## Automatic No-Go Gates

- Week-four plan is missing, blocked, or not founder-reviewed when founder review is required.
- Week-three closeout is missing or has unresolved no-go gates.
- Any open P0 exists in trust, privacy, consent, Auth, admin, deployment, payments, loans, escrow, token collateral, wallet, support, data request handling, or tester safety.
- Any aging P1 lacks owner/date/status.
- Support SLA is missed or support queue is growing without owner/date/status.
- Known issues do not reflect recurring tester confusion.
- Metrics snapshot baseline is missing before expansion.
- Regression checklist or QA signoff is missing for focused retest paths.
- Privacy, consent, data deletion request, data export request, data correction request, or use restriction request lacks owner/date/status.
- Founder, legal, or provider review is needed before kickoff or expansion.
- Any kickoff draft contains private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, provider credentials, live account data, legal advice, loan approval language, investment advice, token appreciation claims, or real-money commitments.

## Safe Kickoff Template

```text
Public beta week-four kickoff:
Date:
Decision: Start current group / Run focused retest / Stabilize only / Limited expansion / Hold kickoff / Reduce scope / Pause beta / Blocked
Reason:
Week-four plan:
Week-three closeout:
Tester group:
Invite batch:
Session schedule:
Stabilization focus:
Retest focus:
New test focus:
Support queue:
Support SLA:
Known issues:
Metrics snapshot baseline:
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

Do not store or paste private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, provider credentials, live account data, or legal advice in this kickoff record.

Hard boundary: no SQL, no secrets, no live database changes, no external account changes, no deployment setting changes, no real payments, no real loans, no escrow, no token collateral, no investment advice, no loan approval, and no token appreciation claim belong in this kickoff record.
