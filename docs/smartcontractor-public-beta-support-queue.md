# SmartContractor Public Beta Support Queue

Purpose: keep public beta support messages, bug reports, and founder follow-ups organized without collecting secrets, approving live-risk actions, or losing construction workflow context.

This is a lightweight operating checklist, not a customer support SaaS setup and not a legal/payment/provider approval process.

## No Secrets

Do not collect or paste secrets in the support queue. Never store cookies, Authorization headers, Magic Link URLs, Supabase keys, database URLs, service-role keys, provider keys, private keys, seed phrases, wallet private data, customer contact details, payment card data, or identity documents.

## Intake Channels

Allowed during public beta:

- founder-written issue notes;
- tester feedback copied without private contact details;
- redacted screenshots;
- endpoint names and `X-Request-Id`;
- role labels: homeowner, contractor, peer reviewer, founder, or anonymous demo;
- public beta page names and safe browser/device notes.

Not allowed:

- raw email inbox exports;
- private phone numbers;
- unredacted customer or worker data;
- payment provider dashboards;
- Supabase SQL results with private rows;
- wallet secrets or Magic Link URLs.

## Queue Fields

Use these fields for every support item:

| Field | Allowed Values |
|-------|----------------|
| Queue ID | `PBQ-YYYYMMDD-001` style |
| Severity | P0, P1, P2 |
| Role | homeowner, contractor, peer reviewer, founder, anonymous demo |
| Area | onboarding, Auth, job, bid, loan demo, milestone demo, dispute, peer review, admin, mobile, public URL, readiness API, grant/investor packet |
| PUBLIC_SITE_URL | set, not set, blocked |
| X-Request-Id | present, missing, not checked |
| Real-money gates | real payments disabled, real loans disabled, escrow disabled, token collateral disabled |
| Routing | founder, legal, provider, product, technical, grant, investor, blocked |
| Next safe action | fix locally, collect redacted evidence, pause beta, update docs, founder review, legal review, provider review |

## Routing Rules

Route to founder when:

- a tester asks whether real work, real loans, real escrow, or real payments are available;
- admin access, Auth, Supabase redirect, public URL, or public beta scope is unclear;
- a P0 incident appears.

Route to legal when:

- credit, lending, repayment, escrow, contractor ownership, token collateral, investment, token price, or guarantee language is questioned.

Route to provider when:

- Supabase, Vercel, Stripe, Metal Pay, XPR/WebAuth, PayPal, Coinbase, BTCPay, email delivery, or domain configuration needs production setup.

Route to technical when:

- the issue is reproducible locally, has safe evidence, and does not require secrets, live SQL, external account changes, legal decisions, or production payments.

## Response Templates

For tester confusion:

```text
Thank you. This beta is demo-only: no real payments, no real loans, no escrow release, and no token collateral actions are enabled. We will review your feedback and use it to improve the next test build.
```

For a bug report:

```text
Thank you. Please send only the page name, role, what you expected, what happened, device/browser, and X-Request-Id if visible. Do not send passwords, Magic Link URLs, payment data, wallet secrets, or private customer details.
```

For a live-risk request:

```text
This action needs founder/legal/provider review before it can move beyond demo mode. It is not enabled in public beta.
```

## Do Not Do

Do not:

- run live SQL or migrations from a support item;
- change Supabase, Vercel, DNS, payment, email, or wallet settings;
- enable production payment capture;
- approve real loans, escrow, token collateral, automatic release, or investment claims;
- request or store secrets;
- promise launch dates, token price movement, financing approval, or legal outcomes;
- turn tester feedback into a real-money workflow without founder/legal/provider review.

## Safe Report-Back

```text
Public beta support queue:
New items: number
P0 items: number
P1 items: number
P2 items: number
Roles seen: homeowner / contractor / peer reviewer / founder / anonymous demo
X-Request-Id coverage: present / missing / mixed / not checked
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
Routing needed: founder / legal / provider / product / technical / grant / investor / blocked / none
no SQL: confirmed / not confirmed
no secrets: confirmed / not confirmed
Next safe action: fix locally / collect redacted evidence / pause beta / update docs / founder review / legal review / provider review
```
