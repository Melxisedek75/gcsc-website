# SmartContractor Public Beta Next-Day Follow-Up

## Purpose

This follow-up keeps the morning after a SmartContractor public beta launch in demo only scope. It turns the launch day recap into safe support review, issue routing, tester follow-up, and status updates without touching SQL, secrets, live Supabase settings, external accounts, legal decisions, or real-money systems.

This document does not approve production launch, live migrations, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, token collateral, or money movement.

## Required Inputs

Review only safe summaries from:

- launch day recap;
- launch status board;
- launch day checklist;
- launch decision record;
- QA signoff;
- go/no-go scorecard;
- launch readiness;
- support queue;
- known issues;
- daily status;
- weekly closeout;
- tester FAQ;
- consent acknowledgement;
- privacy notice;
- safe X-Request-Id examples.

## Next-Day Order

1. Read the launch day recap and confirm whether the outcome was Green, Yellow, Red, or Blocked.
2. Review support queue items from homeowner, contractor, peer reviewer, and founder/admin paths.
3. Compare open issues against known issues and daily status so duplicate reports are not over-counted.
4. Route P0 and sensitive P1 items before sending any tester follow-up.
5. Update launch status board, known issues, daily status, weekly closeout, launch readiness, and go/no-go scorecard only with safe summaries.
6. Confirm real payments disabled, real loans disabled, escrow disabled, and token collateral disabled are still true.
7. Escalate anything requiring founder review, legal review, provider review, external accounts, live Supabase, SQL, or secrets.

## Issue Routing

Use these routes:

| Route | Use When | Allowed Next Action |
|-------|----------|---------------------|
| P0 | Blocks the demo, exposes unsafe data, breaks Auth/admin clarity, or suggests live-risk behavior | Stop expansion and route to founder review |
| P1 | Damages trust, confuses role workflow, breaks evidence/reporting, or affects launch readiness | Fix locally or keep in review until verified |
| P2 | Usability issue that does not block demo only public beta | Add to known issues and daily status |
| Founder review | Needs business decision, deploy setting, Auth/admin action, or live Supabase approval | Founder decides next step |
| Legal review | Touches loans, escrow, payments, token collateral, guarantees, contractor compliance, or user terms | Keep blocked until legal review |
| Provider review | Depends on payment, identity, license, bank, email, hosting, or wallet provider behavior | Keep blocked until provider review |
| Blocked | Needs SQL, secrets, external account login, real payment, real loan, escrow, token collateral, or production authority | Do not proceed autonomously |

## Tester Follow-Up

Send follow-up only after issue routing is updated.

Allowed:

- thank testers for demo only feedback;
- ask which role they tested: homeowner, contractor, peer reviewer, or founder/admin;
- ask for safe issue category, screen name, browser/device, and X-Request-Id if visible;
- point to tester FAQ, consent acknowledgement, and privacy notice;
- say known issues are being reviewed.

Not allowed:

- ask for passwords, Magic Link tokens, API keys, database URLs, wallet data, payment data, or screenshots with private contact details;
- promise loan approval, investment return, legal result, payment release, escrow protection, token collateral value, or provider acceptance;
- request email addresses, phone numbers, calendar links, meeting links, raw recordings, unredacted screenshots, real customer addresses, or private documents in chat.

## Founder Decision Rules

The next-day status remains Green only if:

- no open P0 exists;
- sensitive P1 items have a safe owner and route;
- support queue and known issues are current;
- launch readiness and go/no-go scorecard still support demo only public beta;
- real payments disabled, real loans disabled, escrow disabled, and token collateral disabled are still true;
- no SQL, no secrets, no live Supabase changes, no external account changes, no legal/provider decisions, and no money movement are required.

Move to Yellow, Red, or Blocked if any condition above fails.

## Safe Follow-Up Template

```text
SmartContractor public beta next-day follow-up
Scope: demo only
Launch day recap:
Launch status board:
Support queue:
Known issues:
Daily status:
Weekly closeout:
Launch readiness:
Go/no-go scorecard:
Tester FAQ:
Consent acknowledgement:
Privacy notice:
Role coverage: homeowner / contractor / peer reviewer / founder/admin
Open P0:
Sensitive P1:
Founder review:
Legal review:
Provider review:
Blocked:
X-Request-Id examples:
Tester follow-up sent: yes / no
Next safe action:
Disabled gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Safety check: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no raw recordings, no unredacted screenshots, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys.
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
