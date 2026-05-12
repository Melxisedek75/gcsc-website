# SmartContractor Public Beta Week-Two Plan

## Purpose

This week-two plan keeps the next public beta cycle demo-only after the week-one decision. It defines safe scope for one more week of tester sessions, support review, known-issue handling, metrics review, privacy/consent/data request readiness, and founder/legal/provider gates without approving production, real payments, real loans, escrow, token collateral, live SQL, or external account changes.

## Required Inputs

- public beta week-one decision
- public beta day-seven readiness
- weekly closeout
- metrics snapshot
- support queue
- support SLA
- known issues
- issue escalation matrix
- issue closure rules
- regression checklist
- QA signoff
- launch readiness
- go/no-go scorecard
- tester cohort
- invite batches
- session schedule
- session moderator checklist
- session postmortem
- launch status board
- daily status
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

## Week-Two Scope

- Continue current group: keep the same tester cohort and repeat only the demo flows already covered by week one.
- Expand one small batch: add only one controlled invite batch when week-one decision explicitly allows it and support capacity is healthy.
- Targeted retest: focus on P0/P1 fixes, regression checklist items, known issues, support SLA, and role-specific tester success signals.
- Evidence cleanup: confirm raw recordings, unredacted screenshots, local logs, and sensitive notes are purged or reduced to redacted summaries before outside sharing.
- Founder review: any Auth/admin, deployment, public claim, legal, provider, payment, loan, escrow, token collateral, wallet, or live database decision stays outside autonomous scope.

## Weekly Cadence

1. Start with the week-one decision and write the week-two decision goal as Continue current group, Expand one small batch, Hold expansion, Reduce scope, Pause beta, or Blocked.
2. Run local checks before new sessions: support queue, support SLA, known issues, regression checklist, QA signoff, metrics snapshot, and launch status board.
3. Schedule tester sessions only with session codes, role coverage, consent status, privacy notice status, and no calendar links or meeting links in the plan.
4. Capture only safe evidence: issue id, role, flow, severity, request id, redaction status, expected result, actual result, next owner, and next date.
5. Close the week with a weekly closeout, metrics snapshot, known-issue update, issue closure review, and founder decision record.

## Automatic Hold Gates

- Any open P0 involving trust, privacy, consent, Auth, admin, deployment, payments, loans, escrow, token collateral, wallet data, payment data, real customer addresses, sensitive evidence, or legal/provider ambiguity.
- Any P1 without owner/date/status when it affects homeowner trust, contractor trust, loan confidence, dispute confidence, support load, or beta comprehension.
- Any support SLA miss without a visible owner.
- Any missing known issue for a repeated tester confusion.
- Any request to add private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, or provider credentials.

## Safe Plan Template

```text
Public beta week-two plan:
Scope: Continue current group / Expand one small batch / Targeted retest / Hold expansion / Reduce scope / Pause beta / Blocked
Reason:
Tester cohort:
Invite batches:
Session schedule:
Open P0:
Open P1:
Support queue:
Support SLA:
Known issues:
Metrics snapshot:
Privacy/consent/data requests:
Evidence cleanup:
Founder review:
Legal review:
Provider review:
Next safe action:
X-Request-Id:
```

## Blocked Data

Do not store or paste private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, provider credentials, or live account data in this week-two plan.

Hard boundary: no SQL, no secrets, no live database changes, no external account changes, no real payments, no real loans, no escrow, no token collateral, no investment advice, no loan approval, and no token appreciation claim belong in this week-two plan.
