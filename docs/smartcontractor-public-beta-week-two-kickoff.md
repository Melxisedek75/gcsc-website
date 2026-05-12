# SmartContractor Public Beta Week-Two Kickoff

## Purpose

This kickoff checklist starts week two of public beta in demo-only mode. It confirms the week-two plan can begin with the current tester cohort, support queue, known issues, metrics snapshot, privacy/consent/data request readiness, and safe evidence handling before any new session, invite batch, public claim, partner packet, grant packet, investor packet, or production step.

## Required Inputs

- public beta week-two plan
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
- launch status board
- daily status
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

## Kickoff Order

1. Confirm public beta remains demo only and that real payments disabled, real loans disabled, escrow disabled, and token collateral disabled remain true.
2. Confirm the week-one decision allows the week-two scope: Continue current group, Expand one small batch, Targeted retest, Hold expansion, Reduce scope, Pause beta, or Blocked.
3. Confirm the tester cohort, invite batches, session schedule, and session moderator checklist do not include calendar links, meeting links, email addresses, phone numbers, or private contact details.
4. Review support queue, support SLA, known issues, metrics snapshot, regression checklist, QA signoff, launch status board, and daily status before any new session.
5. Confirm privacy notice, consent acknowledgement, consent withdrawal request, data deletion request, data export request, data correction request, and use restriction request are ready without live SQL or external account changes.
6. Confirm evidence cleanup rules are active before collecting screenshots, recordings, logs, or issue notes.

## Kickoff Outcomes

- Start current group: allowed only when no P0 is open and P1 issues have owner/date/status.
- Start targeted retest: allowed only for specific P0/P1 fixes, regression checklist items, known issues, or support SLA improvements.
- Hold expansion: use when current sessions may continue but no new invite batch should be sent.
- Reduce scope: use when a role, flow, or session type creates repeated P1 issues.
- Pause beta: use when P0, privacy, consent, Auth/admin ambiguity, deployment ambiguity, support overload, or sensitive evidence risk appears.
- Blocked: use when founder review, legal review, provider review, live Supabase work, external account setup, real payment, real loan, escrow, token collateral, or secrets are required.

## Automatic Stop Gates

- Any open P0 involving trust, privacy, consent, Auth, admin, deployment, payments, loans, escrow, token collateral, wallet data, payment data, real customer addresses, or sensitive evidence.
- Any support SLA miss without owner/date/status.
- Any recurring P1 missing a known issue entry or tester-facing explanation.
- Any request to store private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, or provider credentials.
- Any legal, investment, loan approval, token appreciation claim, payment provider readiness claim, production readiness claim, or launch readiness claim without founder/legal/provider review.

## Safe Kickoff Template

```text
Public beta week-two kickoff:
Decision: Start current group / Start targeted retest / Hold expansion / Reduce scope / Pause beta / Blocked
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

Do not store or paste private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, provider credentials, or live account data in this kickoff checklist.

Hard boundary: no SQL, no secrets, no live database changes, no external account changes, no real payments, no real loans, no escrow, no token collateral, no investment advice, no loan approval, and no token appreciation claim belong in this week-two kickoff.
