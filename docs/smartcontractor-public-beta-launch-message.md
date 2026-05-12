# SmartContractor Public Beta Launch Message

## Purpose

This is a safe draft the founder can use when inviting early testers to the SmartContractor public beta. It keeps the message simple, honest, and demo-only.

Do not send this until the founder has a working `PUBLIC_SITE_URL`, has reviewed the known issues, and has confirmed the support queue process.

## Short Invite

```text
Hi,

I am opening an early public beta of SmartContractor, a GCSC product for construction workflows.

The beta lets you try demo flows for homeowner job posting, contractor bidding, starter-loan review screens, project milestones, dispute evidence, peer reviewer feedback, and admin/risk review.

Beta link:
PUBLIC_SITE_URL

Please test only with demo information. Do not enter private documents, real payment details, bank data, wallet private keys, passwords, or sensitive customer information.

If something breaks, please send:
- your test role: homeowner, contractor, peer reviewer, or observer;
- page or flow;
- short description;
- screenshot only if it is redacted;
- X-Request-Id if visible.
```

## What Testers Can Do

Testers can safely review:

- homeowner demo flow;
- contractor demo flow;
- bid and project milestone flow;
- dispute evidence simulation;
- peer reviewer scoring;
- Magic Link login behavior if enabled for beta;
- mobile/PWA layout;
- support queue and known issues language.

## What Is Not Live

These features must stay disabled during public beta:

- real payments disabled;
- real loans disabled;
- escrow disabled;
- token collateral disabled;
- no production payment provider approval;
- no investment advice;
- no loan approval;
- no legal/provider commitment.

If a tester thinks one of these is live, stop the session and route it to founder review.

## What To Report

Ask testers to report only safe information:

- test role: homeowner, contractor, peer reviewer, founder/admin, or observer;
- `PUBLIC_SITE_URL` tested;
- page or flow;
- expected result;
- actual result;
- safe `X-Request-Id` if visible;
- whether the issue is P0, P1, or P2;
- whether the issue touches legal, provider, payment, loan, escrow, token collateral, or admin access.

Do not ask for SQL output, Supabase Auth tokens, database URLs, passwords, private keys, payment data, personal IDs, customer addresses, or private contact details.

## Founder Send Checklist

Before sending the invite:

1. Confirm `PUBLIC_SITE_URL` opens.
2. Confirm known issues are current.
3. Confirm the support queue is ready.
4. Confirm real payments disabled.
5. Confirm real loans disabled.
6. Confirm escrow disabled.
7. Confirm token collateral disabled.
8. Confirm no SQL and no secrets are requested in the invite.
9. Confirm legal/provider questions route back to founder review.

## Do Not Promise

Do not promise:

- token price growth;
- investment returns;
- guaranteed loan approval;
- real escrow protection;
- live payment processing;
- legal compliance approval;
- provider approval;
- production readiness;
- app store availability.

Use conservative language: beta, demo, testing, feedback, review, not production.
