# SmartContractor Public Beta Day-Six Decision

Date: 2026-05-12 PT

Purpose: make the sixth-day public beta decision explicit before the first weekly closeout, without expanding scope by accident.

## Purpose

Day six is a decision checkpoint. It turns monitoring evidence into one founder-readable decision: continue current group, hold expansion, reduce scope, pause beta, or escalate to founder review.

The beta remains demo only:

- real payments disabled;
- real loans disabled;
- escrow disabled;
- token collateral disabled;
- no loan approval;
- no investment advice;
- no production provider promise.

## Required Inputs

Review these inputs before recording the day-six decision:

- public beta day-five monitoring;
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
- public beta launch readiness;
- public beta go/no-go scorecard;
- public beta tester cohort;
- public beta invite batches;
- public beta session schedule;
- public beta session postmortem;
- public beta privacy notice;
- public beta consent acknowledgement;
- public beta data deletion request;
- public beta data export request;
- public beta data correction request;
- public beta use restriction request;
- request tracing through `X-Request-Id`.

## Decision Order

1. Confirm demo-only scope and disabled real-money gates.
2. Review the day-five monitoring outcome and open issue aging.
3. Check whether P0, P1, Blocked, founder review, legal review, or provider review items are open.
4. Check support load against the support SLA.
5. Check whether known issues, daily status, weekly closeout, and metrics snapshot are current.
6. Check privacy, consent, data deletion, data export, data correction, and use restriction handling.
7. Choose one decision and write one next safe action.
8. Keep all evidence aggregate, redacted, and local.

## Decision Options

| Decision | Required condition |
|----------|--------------------|
| Continue current group | No P0/P1 trust blockers, support SLA healthy, known issues current, privacy/data requests clear. |
| Hold expansion | Product is usable but support, QA, known issues, or evidence review needs cleanup. |
| Reduce scope | Tester confusion repeats or a feature creates too much support/privacy/legal/provider risk. |
| Pause beta | Verified P0, sensitive evidence exposure, real-money confusion, Auth/admin ambiguity, or legal/provider review needed. |
| Founder review | Public URL, deploy, Auth, RLS, admin, legal, provider, payment, loan, escrow, or token collateral decision is needed. |

## Automatic No-Go Gates

Choose `Pause beta` or `Founder review` if any of these appear:

- real payment request;
- real loan request;
- escrow request;
- token collateral request;
- investment advice request;
- legal advice request;
- provider commitment request;
- unresolved P0;
- unresolved trust-impacting P1;
- support SLA breach;
- unredacted screenshot;
- raw recording;
- private contact details;
- wallet data;
- payment data;
- unclear Magic Link/Auth/admin status;
- live Supabase/RLS/admin change needed.

## Safe Decision Template

```text
Date:
Decision: Continue current group / Hold expansion / Reduce scope / Pause beta / Founder review
Evidence source:
Open P0:
Open P1:
Blocked:
Support SLA status:
Known issues current: Yes/No
Daily status current: Yes/No
Weekly closeout current: Yes/No
Metrics snapshot current: Yes/No
Privacy/consent/data requests clear: Yes/No
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

Hard boundary: no SQL, no secrets, no live database changes, and no external account changes belong in this decision step.
