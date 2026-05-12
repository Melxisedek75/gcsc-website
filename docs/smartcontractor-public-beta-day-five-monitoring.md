# SmartContractor Public Beta Day-Five Monitoring

Date: 2026-05-12 PT

Purpose: keep the demo-only public beta observable on day five without widening scope, touching live systems, or weakening safety boundaries.

## Purpose

Day five is a monitoring checkpoint. It turns the first week of public beta activity into a simple operating rhythm: observe, classify, update, decide, and keep risky actions blocked until founder, legal, provider, Auth, and deployment gates are clear.

The public beta remains demo only:

- real payments disabled;
- real loans disabled;
- escrow disabled;
- token collateral disabled;
- no loan approval;
- no investment advice;
- no production provider promise.

## Required Inputs

Review these inputs before changing any status:

- public beta day-four stabilization;
- public beta day-three review;
- public beta day-two checkpoint;
- public beta next-day follow-up;
- public beta launch day recap;
- public beta launch status board;
- public beta daily status;
- public beta weekly closeout;
- public beta metrics snapshot;
- public beta support queue;
- public beta support SLA;
- public beta known issues;
- public beta issue escalation matrix;
- public beta issue closure rules;
- public beta regression checklist;
- public beta QA signoff;
- public beta tester cohort;
- public beta invite batches;
- public beta session schedule;
- public beta session postmortem;
- public beta consent acknowledgement;
- public beta privacy notice;
- public beta data deletion request;
- public beta data export request;
- public beta data correction request;
- public beta use restriction request;
- request tracing through `X-Request-Id`.

## Monitoring Cadence

Use this order once per day while public beta remains active:

1. Confirm demo-only scope and disabled real-money gates.
2. Review open P0, P1, Blocked, founder review, legal review, and provider review items.
3. Check support queue age against the support SLA.
4. Check known issues for stale or missing tester-facing language.
5. Refresh daily status and metrics snapshot with aggregate-only counts.
6. Check privacy, consent, data deletion, data export, data correction, and use restriction requests.
7. Decide whether to continue current group, hold expansion, reduce scope, or pause beta.
8. Record next safe action without SQL, secrets, raw evidence, or external account changes.

## Monitoring Thresholds

| Signal | Healthy | Caution | Stop or founder review |
|--------|---------|---------|------------------------|
| P0 issues | 0 open | 1 suspected | Any verified P0 |
| P1 issues | 0-1 with workaround | 2 open or aging | Any trust/payment/Auth/admin risk |
| Support load | Within support SLA | Approaching SLA | Exceeds support SLA |
| Known issues | Updated | Missing one tester note | Stale or misleading |
| Evidence safety | Redacted summaries only | Needs founder review | Raw recordings or unredacted screenshots |
| Privacy/data requests | Clear | Needs clarification | Unresolved deletion/export/correction/restriction |
| Scope | Demo only | Tester confusion | Real payment, loan, escrow, or token collateral request |

## Decision Rules

Use one decision per monitoring cycle:

- Continue current group: metrics are stable, support load is healthy, and no P0/P1 trust blockers are open.
- Hold expansion: support load, known issues, QA signoff, or privacy/data request handling needs cleanup.
- Reduce scope: testers repeatedly misunderstand a flow, evidence capture is risky, or known issues are too noisy.
- Pause beta: verified P0, sensitive evidence exposure, real-money confusion, Auth/admin ambiguity, or legal/provider review need.
- Founder review: any decision affects external accounts, public URL status, legal language, provider commitments, or live Supabase/Auth/admin behavior.

## Safe Monitoring Template

```text
Date:
Decision: Continue current group / Hold expansion / Reduce scope / Pause beta / Founder review
Open P0:
Open P1:
Blocked:
Support load:
Support SLA status:
Known issues updated: Yes/No
Daily status updated: Yes/No
Metrics snapshot updated: Yes/No
Privacy/consent/data requests clear: Yes/No
Evidence redacted: Yes/No
Founder review needed: Yes/No
Legal review needed: Yes/No
Provider review needed: Yes/No
Real payments disabled: Yes
Real loans disabled: Yes
Escrow disabled: Yes
Token collateral disabled: Yes
Next safe action:
```

## Blocked Data

Do not include:

- SQL;
- secrets;
- database URLs;
- API keys;
- service-role keys;
- Magic Link tokens;
- passwords;
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
- full request bodies.

Keep day-five monitoring aggregate, redacted, local, and tied to issue IDs or `X-Request-Id` values when available.

Hard boundary: no SQL, no secrets, no live database changes, and no external account changes belong in this monitoring step.
