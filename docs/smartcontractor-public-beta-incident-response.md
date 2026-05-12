# SmartContractor Public Beta Incident Response

Purpose: keep public beta failures organized without exposing secrets, changing live systems, approving real-money flows, or making legal/provider decisions too quickly.

This document is for demo/public beta only. It does not authorize production payments, real loans, escrow, token collateral, live SQL, provider setup, or legal decisions.

## No Secrets

Do not paste secrets into chat, tickets, screenshots, terminal output, or email. Do not share cookies, Authorization headers, Magic Link URLs, Supabase keys, database URLs, service-role keys, provider keys, private keys, seed phrases, wallet data, customer contact details, or full payment/identity data.

## Severity Levels

Use the highest matching severity.

| Severity | Meaning | Default Action |
|----------|---------|----------------|
| P0 | Security, privacy, wrong admin access, public secret exposure, real-money gate appears enabled, or public beta is unusable | Stop sharing link and use public beta rollback drill |
| P1 | Main beta flow is broken: login, home page, job, bid, loan demo, dispute, admin readiness, mobile/PWA, or API readiness | Pause affected test and create fix-now issue |
| P2 | UX copy, layout, slow response, confusing status, missing evidence, or non-blocking mobile issue | Log issue and batch for next beta polish pass |

## First 15 Minutes

1. Stop and classify the incident as P0, P1, or P2.
2. Write down the time and PUBLIC_SITE_URL without secrets.
3. Capture only safe evidence: screen name, endpoint name, status code, and `X-Request-Id`.
4. Check read-only endpoints:

```powershell
$base=$env:PUBLIC_SITE_URL.TrimEnd("/")
Invoke-WebRequest -Uri "$base/api/health" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/beta-readiness" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/production-readiness" -Method GET
```

5. Confirm real payments disabled, real loans disabled, escrow disabled, and token collateral disabled.
6. If it is P0, stop sharing the beta link and open the public beta rollback drill.
7. If it touches money, lending, escrow, token collateral, provider accounts, identity, or legal wording, escalate to founder before any change.

## Evidence To Capture

Capture only:

- public beta URL domain, not private preview tokens;
- page or endpoint name;
- HTTP status code;
- `X-Request-Id`;
- browser/device type;
- role used: founder, homeowner, contractor, peer reviewer, or anonymous demo;
- short summary of expected behavior and actual behavior;
- redacted screenshot only if needed;
- whether real payments disabled was confirmed;
- whether real loans disabled was confirmed;
- whether escrow disabled was confirmed;
- whether token collateral disabled was confirmed.

Do not capture secrets, customer data, wallet private data, payment card data, database rows with private details, or Magic Link URLs.

## Escalation Rules

Escalate immediately to founder if:

- an admin page is accessible to the wrong role;
- a secret, key, token, or private URL appears anywhere;
- real payment capture appears possible;
- real loans appear possible;
- escrow release appears possible;
- token collateral lock or liquidation appears possible;
- Supabase Auth redirect is wrong;
- public beta must be paused;
- legal copy about credit, lending, ownership, repayment, token price, or guarantees is confusing.

Escalate to legal before changing credit, loan, escrow, repayment, ownership, token collateral, or guarantee language.

Escalate to provider before changing Stripe, Metal Pay, XPR/WebAuth, PayPal, Coinbase, BTCPay, Supabase, Vercel, or email provider production settings.

## Do Not Do

Do not:

- run live SQL, migrations, or RLS edits;
- add broad `USING true` policies;
- expose service-role keys to frontend JavaScript;
- enable production payment provider mode;
- approve real payments, real loans, escrow, token collateral, or automatic release;
- paste secrets, passwords, database URLs, Magic Link URLs, cookies, or bearer tokens into chat;
- delete production data;
- change DNS, Vercel, Supabase, payment, email, or wallet settings unless the founder explicitly approves that exact action.

## Safe Report-Back

```text
Public beta incident:
Severity: P0 / P1 / P2
PUBLIC_SITE_URL: set / not set / blocked
Area: home page / health / beta readiness / production readiness / Auth / admin / mobile / job / bid / loan demo / dispute / payment demo / other
Role: founder / homeowner / contractor / peer reviewer / anonymous demo
X-Request-Id: present / missing / not checked
Status code: known / unknown
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
Rollback drill needed: yes / no / founder decision
Escalation: founder / legal / provider / technical / none
no SQL: confirmed / not confirmed
no secrets: confirmed / not confirmed
Next safe action: fix locally / pause beta / collect redacted evidence / founder review / legal review / provider review
```
