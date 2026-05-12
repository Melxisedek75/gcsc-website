# SmartContractor Public Beta Tester FAQ

## Purpose

This FAQ gives early SmartContractor public beta testers simple answers before they open the beta link. It keeps the test focused on demo workflows and prevents accidental secrets, real payments, real loan expectations, or legal/provider promises.

Use this with:

- `docs/smartcontractor-public-beta-launch-message.md`;
- `docs/smartcontractor-public-beta-known-issues.md`;
- `docs/smartcontractor-public-beta-support-queue.md`;
- `docs/smartcontractor-public-beta-tester-quickstart.md`.

## Who This Beta Is For

This beta is for testers who can review the SmartContractor experience as:

- homeowner;
- contractor;
- peer reviewer;
- founder/admin observer;
- construction business feedback reviewer.

The beta is demo only. It is not a production construction marketplace yet.

## What You Can Test

Testers can safely try:

- `PUBLIC_SITE_URL` access;
- Magic Link login if it is enabled for the beta;
- homeowner job-posting demo flow;
- contractor bid demo flow;
- project milestone screens;
- starter-loan review screens;
- dispute evidence simulation;
- peer reviewer scoring;
- mobile/PWA layout;
- known issues and support queue language.

## What You Must Not Enter

Do not enter:

- passwords;
- private keys or seed phrases;
- bank data;
- payment card data;
- real customer addresses;
- personal IDs;
- real contractor license documents;
- Supabase tokens;
- SQL output;
- database URLs;
- screenshots that show private contact details.

If a tester is unsure, they should stop and ask the founder before continuing.

## What Is Not Live Yet

These areas are intentionally disabled:

- real payments disabled;
- real loans disabled;
- escrow disabled;
- token collateral disabled;
- production payment provider approval disabled;
- legal/provider approval disabled;
- no investment advice;
- no loan approval.

If any screen looks like it can move real money, approve a real loan, or lock real collateral, report it as a P0 issue.

## How To Report A Problem

Send only safe details:

- test role: homeowner, contractor, peer reviewer, founder/admin, or observer;
- `PUBLIC_SITE_URL` used;
- page or flow name;
- short problem description;
- expected result;
- actual result;
- safe `X-Request-Id` if visible;
- device and browser;
- redacted screenshot if useful.

Do not send no SQL, no secrets, private documents, payment data, wallet secrets, or unredacted screenshots.

## FAQ

**Is this a real contractor hiring platform today?**  
No. This is an early beta for testing the workflow, trust model, layout, and reporting process.

**Can I use real payment information?**  
No. Real payments disabled during public beta.

**Can a contractor receive a real loan?**  
No. Real loans disabled, and there is no loan approval during beta.

**Is escrow active?**  
No. Escrow disabled during beta.

**Can I use token collateral?**  
No. Token collateral disabled until legal, provider, and founder approvals are complete.

**Should I upload real documents?**  
No. Use demo information only.

**Can I share screenshots?**  
Only if they are redacted and do not show contact details, private addresses, account data, payment data, or wallet data.

**What should I do if I see confusing legal, payment, loan, provider, or investment language?**  
Stop and report it to the founder for review.

## Founder Review Triggers

Route the tester issue to founder review if it mentions:

- legal compliance;
- provider approval;
- payment processing;
- loan approval;
- escrow protection;
- token collateral;
- investment return;
- production readiness;
- private customer data;
- secret-looking values;
- admin access confusion.

These issues must not be solved by public testers.
