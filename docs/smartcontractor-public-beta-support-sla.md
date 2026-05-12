# SmartContractor Public Beta Support SLA

Purpose: define simple public beta response windows, escalation rules, and closure rules without turning demo feedback into legal, payment, loan, escrow, token collateral, or provider commitments.

This is an internal beta operating guide. It is not a customer contract, not legal advice, and not a promise of production support availability.

## No Secrets

Support notes must never include passwords, Magic Link URLs, Authorization headers, cookies, Supabase keys, database URLs, service-role keys, provider keys, private keys, seed phrases, wallet private data, payment card data, identity documents, or private customer contact details.

Use only redacted evidence, page names, role labels, safe device/browser notes, `PUBLIC_SITE_URL` status, and `X-Request-Id` when visible.

## Severity Windows

| Severity | Meaning | First Response Target | Safe Action Target |
|----------|---------|-----------------------|--------------------|
| P0 | Beta must pause: security concern, secret exposure risk, real-money confusion, Auth/admin ambiguity, public URL broken, or data visibility concern | 15 minutes when founder is available | Pause beta, collect redacted evidence, route to founder/legal/provider |
| P1 | Core demo flow blocked: homeowner, contractor, bid, milestone demo, dispute, peer review, admin readiness, mobile/PWA install, or readiness API issue | 4 hours | Reproduce locally, fix if safe, or route to founder/provider |
| P2 | Confusion, copy issue, visual bug, missing explanation, non-blocking mobile/browser issue, or grant/investor packet wording | 2 business days | Batch into local fixes or docs updates |

If the founder is unavailable, do not expand scope. Mark the item as `blocked-founder-review` and keep real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.

## Escalation Rules

Escalate to founder when:

- public beta scope is unclear;
- a tester asks for live payments, real loans, escrow release, token collateral, contractor financing approval, or production account setup;
- `PUBLIC_SITE_URL`, Supabase Auth redirects, admin access, or deployment state needs external-account action;
- a P0 item appears.

Escalate to legal when:

- lending, repayment, escrow, lien waivers, contractor ownership, token collateral, investment language, price movement, guarantees, or compliance wording is involved.

Escalate to provider when:

- Supabase, Vercel, Stripe, Metal Pay, XPR/WebAuth, PayPal, Coinbase, BTCPay, email, DNS, or app store setup requires account access, API keys, contracts, partner approval, or production configuration.

Route to technical only when:

- the issue has safe redacted evidence;
- no SQL, no secrets, no account setting changes, and no real-money action are required;
- the change can be tested locally.

## Founder-Present Actions

These actions are allowed only when the founder is at the computer and explicitly approves the exact step:

- changing Supabase, Vercel, DNS, email, payment provider, wallet, GitHub Pages, or app store settings;
- adding a live founder/admin user;
- applying live Supabase SQL or RLS changes;
- enabling production payment, real loan, escrow, or token collateral behavior;
- sending support or partner messages that discuss legal, financial, or production commitments.

## Closure Rules

A support item can close only when one of these is true:

- fixed locally and validated with a relevant check;
- converted into a backlog item with severity, role, page, expected result, actual result, and `X-Request-Id` status;
- routed to founder, legal, provider, product, technical, grant, investor, or blocked review;
- marked duplicate with the original queue ID;
- paused because it would require secrets, live SQL, external account changes, real payments, real loans, escrow, token collateral, or legal decisions.

Do not close P0 items until the founder confirms beta can continue.

## Safe Report-Back

```text
Public beta support SLA:
New P0 within 15 minutes: yes / no / none
New P1 within 4 hours: yes / no / none
New P2 within 2 business days: yes / no / none
PUBLIC_SITE_URL status: set / not set / blocked / not checked
X-Request-Id coverage: present / missing / mixed / not checked
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
no SQL: confirmed / not confirmed
no secrets: confirmed / not confirmed
Escalation needed: founder / legal / provider / product / technical / grant / investor / blocked / none
Next safe action: pause beta / fix locally / collect redacted evidence / update docs / founder review / legal review / provider review
```
