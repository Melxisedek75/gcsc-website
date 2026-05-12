# SmartContractor Public Beta Daily Status Template

## Purpose

Use this template once per beta day to summarize what is working, what is blocked, what needs founder attention, and what stays disabled.

This is a safe operating report. It must contain no SQL, no secrets, no private customer data, no raw Magic Link URL, no Supabase Auth token, no service-role key, no payment data, and no database connection string.

## Daily Summary

```text
Date:
Reporter:
PUBLIC_SITE_URL:
Overall status: Green / Yellow / Red
One-line summary:
```

Use `Green` only when the beta demo URL, support flow, known issues, and disabled real-money gates are all clear.

## Readiness Snapshot

```text
App shell loads: Passed / Failed / Not checked
Security headers: Passed / Failed / Not checked
X-Request-Id visible: Passed / Failed / Not checked
Magic Link: Passed / Failed / Blocked / Not checked
Supabase Auth redirect: Passed / Failed / Blocked / Not checked
Admin access: Founder only / Failed / Blocked / Not checked
Known issues reviewed: Yes / No
```

If `admin` access is not founder-only, mark the day `Red`.

## Support Snapshot

```text
Support queue total:
P0 open:
P1 open:
P2 open:
Oldest unresolved item:
Most common tester confusion:
Latest safe X-Request-Id:
```

Support notes must reference the support queue and known issues list, not private tester messages.

## Risk Snapshot

```text
Real payments disabled: Yes / No
Real loans disabled: Yes / No
Escrow disabled: Yes / No
Token collateral disabled: Yes / No
Any private data exposed: Yes / No
Any secret-looking value found: Yes / No
Any legal/provider question: Yes / No
```

If real payments disabled, real loans disabled, escrow disabled, or token collateral disabled is `No`, stop beta sharing and route to founder review.

## Founder Decisions Needed

Use this only for decisions that autonomous Codex must not make.

```text
Founder decision 1:
Reason:
Needs legal review: Yes / No
Needs provider review: Yes / No
Needs external account action: Yes / No
Safe evidence available:
```

Examples of founder-only decisions:

- Supabase Auth redirect change;
- admin membership activation;
- payment provider setup;
- loan, escrow, or token collateral language;
- public launch claim;
- legal/provider escalation.

## Safe Next Actions

Use only actions that do not require passwords, API keys, external account changes, live Supabase changes, real payments, real loans, escrow, token collateral, or legal decisions.

```text
Safe action 1:
Owner:
Validation command:

Safe action 2:
Owner:
Validation command:
```

Good safe actions include docs, validators, local smoke checks, public beta report cleanup, UI wording fixes, local backend hardening, and non-secret runbook updates.
