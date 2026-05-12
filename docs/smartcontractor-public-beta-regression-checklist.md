# SmartContractor Public Beta Regression Checklist

## Purpose

This checklist keeps every fixed public beta issue tied to a demo only regression pass before it is treated as verified. It protects the homeowner, contractor, peer reviewer, and founder/admin paths from accidental breakage while keeping real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

Regression review does not authorize live Supabase changes, external account changes, legal decisions, provider commitments, production launch claims, money movement, real loans, escrow, or token collateral.

## When To Run

Run this checklist when:

- an issue moves from open to fixed locally;
- an issue moves from fixed locally to verified;
- a P0 or P1 issue is reopened;
- support queue, known issues, daily status, weekly closeout, or go/no-go scorecard would change;
- product fix or technical fix touches job post, bid submission, starter loan, milestone, dispute, evidence, peer review, admin review, Auth display, payment-intent display, or mobile/PWA shell behavior.

## Regression Inputs

Use only these safe inputs:

| Input | Safe format |
|-------|-------------|
| Issue ID | Safe issue ID from issue log, support queue, closure rules, or postmortem |
| Closure state | open, fixed locally, verified, blocked, deferred, or reopened |
| X-Request-Id | Safe request ID when available |
| Tester role | homeowner, contractor, peer reviewer, or founder/admin |
| Route | product fix, technical fix, founder review, legal review, provider review, or blocked |
| Support queue | Queue state without private contact details |
| Known issues | Known issue code or safe summary |
| Scorecard impact | go/no-go scorecard status without private data |

## Core Paths

Retest only demo only flows:

| Path | Regression check |
|------|------------------|
| Homeowner job post | Job post still creates or displays expected demo data with no private contact details |
| Contractor bid submission | Bid submission still validates amount, scope, and contractor role safely |
| Starter loan | Starter loan request still displays demo-only scoring and does not approve real loans |
| Milestone | Milestone state still shows payment progress without money movement |
| Dispute | Dispute creation still accepts safe evidence metadata only |
| Evidence | Evidence notes still avoid raw recordings, unredacted screenshots, payment data, wallet data, and real customer addresses |
| Peer review | Peer reviewer scoring still records demo recommendation without legal or payment authority |
| Admin review | Founder/admin review still routes sensitive items to founder review, legal review, provider review, or blocked |
| Support queue | Support queue status still matches the issue state and response promise |
| Known issues | Known issues still describe limitations without secrets or live-risk promises |

## Safety Gates

The regression pass is blocked if any check requires:

- live Supabase changes;
- SQL execution;
- service-role keys;
- database URLs;
- API keys;
- Magic Link tokens;
- external account login;
- private contact details;
- email addresses;
- phone numbers;
- calendar links;
- meeting links;
- real customer addresses;
- payment data;
- wallet data;
- raw recordings;
- unredacted screenshots;
- real payments;
- real loans;
- escrow;
- token collateral;
- legal advice;
- provider commitments.

## Retest Matrix

| Severity | Required retest |
|----------|-----------------|
| P0 | Founder review plus affected role path; keep issue blocked or reopened if any trust path still fails |
| P1 | Affected role path plus support queue, known issues, daily status, weekly closeout, and go/no-go scorecard update |
| P2 | Affected role path plus safe report note |
| P3 | Targeted retest or deferred note when the limitation is non-blocking |

Each retest must keep real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Issue Linkage

Every regression report must link:

- issue ID;
- closure state;
- X-Request-Id when available;
- affected role: homeowner, contractor, peer reviewer, or founder/admin;
- affected path: job post, bid submission, starter loan, milestone, dispute, evidence, peer review, admin review, support queue, known issues, daily status, weekly closeout, or go/no-go scorecard;
- route: product fix, technical fix, founder review, legal review, provider review, or blocked;
- final state: verified, reopened, blocked, or deferred.

## Regression Report Template

```text
SmartContractor public beta regression report
Scope: demo only
Issue ID:
Closure state: open / fixed locally / verified / blocked / deferred / reopened
X-Request-Id:
Tester role: homeowner / contractor / peer reviewer / founder-admin
Affected path:
Route: product fix / technical fix / founder review / legal review / provider review / blocked
Retest result: verified / reopened / blocked / deferred
Support queue:
Known issues:
Daily status:
Weekly closeout:
Go/no-go scorecard:
Safety gates: real payments disabled, real loans disabled, escrow disabled, token collateral disabled.
Blocked data check: no SQL, no secrets, no private contact details, no email addresses, no phone numbers, no calendar links, no meeting links, no raw recordings, no unredacted screenshots, no real customer addresses, no payment data, no wallet data, no database URLs, no API keys, no Magic Link tokens, no service-role keys.
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
