# SmartContractor Public Beta Week-One Decision

## Purpose

This week-one decision record turns the first public beta week into one demo-only founder decision before any larger invite wave, public claim, partner packet, grant packet, investor packet, or production planning step. It keeps support, known issues, metrics, privacy, consent, Auth/admin, deployment, and disabled real-money gates in one conservative review.

## Required Inputs

- public beta day-seven readiness
- day-six decision
- day-five monitoring
- day-four stabilization
- day-three review
- day-two checkpoint
- next-day follow-up
- launch day recap
- launch status board
- daily status
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
- session postmortem
- privacy notice
- consent acknowledgement
- consent withdrawal request
- data deletion request
- data export request
- data correction request
- use restriction request
- X-Request-Id

## Decision Options

- Continue current group: keep the same tester scope and continue demo-only sessions.
- Expand one small batch: only if no P0 is open, P1 issues have owners, support SLA is healthy, known issues are tester-facing, and privacy/consent/data request handling is ready.
- Hold expansion: keep the beta live for the current group but do not add testers.
- Reduce scope: remove a role, flow, or invite segment that creates repeated P1 issues or support load.
- Pause beta: stop sessions until P0, privacy, consent, Auth/admin, deployment, legal/provider, or real-money confusion is resolved.
- Blocked: use when founder review, legal review, provider review, external account setup, live Supabase work, or secrets are required.

## Required Checks

1. Confirm demo only scope is still visible in tester-facing materials.
2. Confirm real payments disabled, real loans disabled, escrow disabled, and token collateral disabled remain true.
3. Review every P0 and P1 against support queue, known issues, issue escalation matrix, issue closure rules, regression checklist, QA signoff, launch readiness, and go/no-go scorecard.
4. Confirm privacy notice, consent acknowledgement, consent withdrawal request, data deletion request, data export request, data correction request, and use restriction request can be handled without live SQL.
5. Confirm no founder review, legal review, provider review, Auth/admin, payment, loan, escrow, token collateral, wallet, deployment, or live database decision is being made by automation.

## Automatic No-Go Gates

- Any open P0 touching trust, privacy, Auth, admin, deployment, payments, loans, escrow, token collateral, wallet data, payment data, real customer addresses, or sensitive evidence.
- Any support SLA miss without owner/date/status.
- Any missing tester-facing known issue for a recurring P1.
- Any request to include private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, or passwords.
- Any production claim, legal claim, loan approval, investment advice, token appreciation claim, payment-provider readiness claim, or launch-readiness claim without founder/legal/provider approval.

## Safe Decision Template

```text
Public beta week-one decision:
Decision: Continue current group / Expand one small batch / Hold expansion / Reduce scope / Pause beta / Blocked
Reason:
Open P0:
Open P1:
Support queue:
Support SLA:
Known issues:
Metrics snapshot:
Privacy/consent/data requests:
QA/regression status:
Founder review:
Legal review:
Provider review:
Next safe action:
X-Request-Id:
```

## Blocked Data

Do not store or paste private contact details, email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, private keys, passwords, or provider credentials in this decision record.

Hard boundary: no SQL, no secrets, no live database changes, no external account changes, no real payments, no real loans, no escrow, and no token collateral actions belong in this week-one decision.
