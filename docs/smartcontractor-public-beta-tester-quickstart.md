# SmartContractor Public Beta Tester Quickstart

Purpose: give a tester a short, safe path through SmartContractor public beta without exposing secrets, using real money, or treating demo flows as production approvals.

This is a demo-only guide for the first public beta checks.

## Before You Start

The founder should give the tester only:

- `PUBLIC_SITE_URL` or the local demo URL;
- the role to test: homeowner, contractor, peer reviewer, or founder demo;
- the exact demo task list below;
- the rule that real payments disabled, real loans disabled, escrow disabled, and token collateral disabled must remain true.

The tester should use a normal browser or mobile browser. Do not ask the tester to install wallet software, paste secrets, open Supabase, run SQL, or enter payment card data.

## Test Roles

Homeowner:

- open the SmartContractor page;
- review available job/request flow;
- check whether the bid, milestone, and dispute language is understandable.

Contractor:

- review open bids;
- submit a demo bid;
- open starter loan demo/scoring;
- confirm it is clear that no real loan is approved.

Peer reviewer:

- open dispute/peer review flow;
- review evidence fields;
- submit a demo score or recommendation;
- confirm it is clear this is not a legal inspection or payment-release approval.

Founder:

- check readiness/admin pages only if explicitly assigned;
- confirm `X-Request-Id` appears when visible;
- do not activate live admin, Supabase Auth, RLS, real payments, loans, escrow, or token collateral from this quickstart.

## Demo Tasks

Ask every tester to complete only safe demo tasks:

1. Open the public beta page.
2. Confirm the page loads on desktop or mobile.
3. Follow the assigned role flow.
4. Note any confusing text, broken button, mobile layout issue, or missing explanation.
5. Capture only redacted screenshots if needed.
6. Copy `X-Request-Id` only if it is visible in the UI or response.
7. Stop immediately if the flow asks for secrets, payment data, identity documents, wallet private data, or a real construction commitment.

## What To Report

Allowed report fields:

- role tested: homeowner / contractor / peer reviewer / founder;
- page or button name;
- expected result;
- actual result;
- browser/device;
- mobile or desktop;
- `PUBLIC_SITE_URL` status: loaded / blocked / not checked;
- `X-Request-Id`: present / missing / not checked;
- severity guess: P0 / P1 / P2;
- redacted screenshot filename if available.

## What Not To Send

Do not send:

- passwords;
- Magic Link URLs;
- Authorization headers;
- cookies;
- Supabase keys;
- database URLs;
- service-role keys;
- private keys or seed phrases;
- wallet private data;
- payment card data;
- identity documents;
- private names, phones, emails, addresses, or customer details;
- SQL results;
- real job commitments, real payment approvals, real loan approvals, escrow release approvals, or token collateral approvals.

## Safe Report-Back

```text
Public beta tester quickstart:
Tester role: homeowner / contractor / peer reviewer / founder
Device: desktop / mobile / both
PUBLIC_SITE_URL: loaded / blocked / not checked
X-Request-Id: present / missing / not checked
Flow completed: yes / no
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
no SQL: confirmed / not confirmed
no secrets: confirmed / not confirmed
Top issue: short description
Severity guess: P0 / P1 / P2
Next safe action: fix locally / collect redacted evidence / founder review / legal review / provider review / pause beta
```
