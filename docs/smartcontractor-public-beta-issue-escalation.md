# SmartContractor Public Beta Issue Escalation Matrix

## Purpose

This matrix turns SmartContractor public beta findings into safe escalation decisions after a demo only tester session. It helps the founder decide whether an issue is a product fix, technical fix, founder review, legal review, provider review, or blocked item without storing sensitive data or approving live-risk actions.

Use this after the session moderator checklist and session postmortem. Keep real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Escalation Inputs

Record only these safe inputs:

| Input | Safe format |
|-------|-------------|
| Session code | Code from the session schedule |
| Batch code | Code from invite batch tracker |
| Tester cohort | Non-identifying cohort label |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Flow result | passed, confusing, blocked, stopped, no-show, or rescheduled |
| Issue ID | Safe issue ID from beta issue log or support queue |
| X-Request-Id | Safe request ID when available |
| Known issues | Existing known issue code or summary |
| Trust blocker | Plain-language blocker without private data |
| Severity | P0, P1, P2, or P3 |
| Next action | Product fix, technical fix, founder review, legal review, provider review, or blocked |

Do not include private contact details, email addresses, phone numbers, calendar links, meeting links, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, unredacted screenshots, SQL, or secrets.

## Severity Matrix

| Severity | Meaning | Default action |
|----------|---------|----------------|
| P0 | Trust, privacy, Auth/admin, payment, loan, escrow, token collateral, legal, provider, or security boundary is unsafe | Stop session, update support queue, mark go/no-go scorecard as no-go or blocked, route to founder review |
| P1 | Core homeowner, contractor, peer reviewer, or founder/admin flow is blocked or misleading in the demo | Add issue ID, update daily status, route to product fix or technical fix |
| P2 | Flow works but language, trust, evidence, known issues, or next action is confusing | Add issue ID, keep weekly closeout note, route to product fix |
| P3 | Cosmetic, wording, ordering, or non-blocking beta polish | Add issue ID only if useful, route to backlog |

P0 and sensitive P1 issues must never be solved by autonomous live changes. They require founder review, legal review, provider review, or a blocked state when they touch real payments, real loans, escrow, token collateral, legal claims, production Auth, external accounts, or sensitive data.

## Routing Matrix

| Signal | Route |
|--------|-------|
| Homeowner cannot understand safe milestone approval | Product fix or founder review if the risk language changes policy |
| Contractor treats demo starter loan as approval | Legal review and product fix |
| Peer reviewer cannot understand evidence/recommendation impact | Product fix |
| Founder/admin cannot map support queue, known issues, daily status, weekly closeout, or go/no-go scorecard | Technical fix or product fix |
| Auth/admin state is unclear | Founder review; technical fix only in local code |
| Payment provider, Metal Pay, Stripe, PayPal, Coinbase, BTCPay, ACH, or verification provider question appears | Provider review |
| Loan, escrow, lien, contractor credit, token collateral, privacy, consent, terms, or investment language appears | Legal review |
| Real payment, real loan, escrow, token collateral, live Supabase, production deploy, external account, or secret is needed | Blocked |

## Stop Conditions

Stop the session and escalation work when:

- no SQL or no secrets boundary becomes unclear;
- private contact details, email addresses, phone numbers, calendar links, meeting links, real customer addresses, payment data, wallet data, database URLs, API keys, Magic Link tokens, service-role keys, raw recordings, or unredacted screenshots enter the workflow;
- real payments disabled, real loans disabled, escrow disabled, or token collateral disabled is no longer true;
- an issue requires live Supabase changes, external account changes, production deployment, provider credentials, money movement, legal advice, or founder-only business decisions.

## Owner Handoff

Use these owner labels:

- product fix: local copy, UX, workflow, demo-data, or runbook clarity.
- technical fix: local backend/frontend/test/CI issue.
- founder review: account, deploy, Auth/admin role, public launch, packet sharing, or business decision.
- legal review: loans, escrow, contractor credit, lien waivers, token collateral, privacy, consent, terms, or investment language.
- provider review: payment, verification, banking, Metal Pay, Stripe, PayPal, Coinbase, BTCPay, ACH, or external API.
- blocked: unsafe without founder approval, legal/provider decision, external account, live Supabase, secret, or real-money control.

## Escalation Template

```text
SmartContractor public beta issue escalation
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
Trust blocker:
Severity: P0 / P1 / P2 / P3
Route: product fix / technical fix / founder review / legal review / provider review / blocked
Next action:
Daily status update:
Weekly closeout update:
Go/no-go scorecard impact:
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

This matrix does not authorize external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, legal promises, provider commitments, production launch claims, or autonomous approval of money movement.

## Founder Summary Template

```text
Public beta issue escalation summary
Session code:
Batch code:
Tester cohort:
Tester role:
Issue ID:
Severity:
Trust blocker:
Route:
Next action:
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
