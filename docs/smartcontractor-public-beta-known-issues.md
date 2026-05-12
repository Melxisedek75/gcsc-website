# SmartContractor Public Beta Known Issues

Purpose: keep public beta testers, founder review, and technical follow-up aligned on what is already known, what is demo-only, and what must not be treated as production-ready.

This document is safe to use for beta coordination. It is not a public promise, not legal advice, and not a provider approval record.

## No Secrets

Do not record passwords, Magic Link URLs, cookies, Authorization headers, Supabase keys, database URLs, service-role keys, provider keys, private keys, seed phrases, wallet private data, payment card data, identity documents, or private customer contact details.

Use page names, role labels, safe browser/device notes, `PUBLIC_SITE_URL` status, redacted screenshots, and `X-Request-Id` when visible.

## Known Beta Limitations

| Area | Current Limitation | Severity | Safe Status |
|------|--------------------|----------|-------------|
| Public deploy | `PUBLIC_SITE_URL` may still be unset or blocked until founder finishes deploy-account steps | P1 | founder/provider review |
| Auth | Magic Link and Supabase Auth are scaffolded, but real founder/admin identity activation still needs founder approval | P0 | founder review |
| Admin | Admin membership exists, but live founder assignment must not happen without explicit founder approval | P0 | founder review |
| Payments | Production payment capture is not enabled | P0 | real payments disabled |
| Loans | Starter loan flow is demo/scoring only | P0 | real loans disabled |
| Escrow | Milestone and payment intent flows are demo/admin-review only | P0 | escrow disabled |
| Token collateral | Token collateral values are estimates/design scaffolds only | P0 | token collateral disabled |
| Legal | Lending, escrow, lien, contractor control, investment, token, and guarantee language needs attorney review | P0 | legal review |
| Provider setup | Vercel, Supabase production settings, payment providers, email, DNS, and wallet/provider setup require founder/provider action | P1 | provider review |
| Mobile | PWA and Android wrapper prep exist, but native store release is blocked by local toolchain, QA, signing, and store accounts | P1 | founder review |
| Copy and visual polish | Non-blocking wording, layout, and screenshot cleanup can be batched after P0/P1 beta issues | P2 | needs-local-fix |

## Issue States

Use these states for known issues:

- `known-demo-limitation`: expected in public beta, mention in tester notes;
- `needs-local-fix`: safe for Codex to fix locally;
- `needs-founder-review`: account, Auth, deploy, admin, or scope decision;
- `needs-legal-review`: loans, escrow, token collateral, compliance, ownership, guarantees, or investment language;
- `needs-provider-review`: Supabase, Vercel, payment, email, DNS, app store, or wallet/provider setup;
- `blocked-live-risk`: no action until founder/legal/provider review clears it;
- `closed-with-evidence`: fixed or documented with validation and safe evidence.

## Tester-Facing Language

For known demo limitations:

```text
This is a known public beta limitation. The current beta is demo-only: no real payments, no real loans, no escrow release, and no token collateral actions are enabled.
```

For Auth or deploy issues:

```text
Thank you. Please share only the page name, expected result, actual result, browser/device, and X-Request-Id if visible. Do not send Magic Link URLs, passwords, payment data, wallet secrets, or private customer details.
```

For real-money or legal questions:

```text
This part requires founder/legal/provider review before it can move beyond demo mode. It is not enabled in public beta.
```

## Founder-Only Follow-Up

The founder must be present before any of these happen:

- change Supabase Auth, RLS, admin membership, Vercel, DNS, email, payment provider, wallet, GitHub Pages, app store, or production environment settings;
- apply live SQL or migrations;
- activate real founder/admin access;
- enable production payment capture;
- enable real loans, escrow, token collateral, automatic payment release, or financing approval;
- send partner, investor, legal, or provider messages that imply production approval, legal compliance, token price movement, or guaranteed financing.

## Safe Report-Back

```text
Public beta known issues:
New known-demo-limitation: number
Needs local fix: number
Needs founder review: number
Needs legal review: number
Needs provider review: number
Blocked live-risk: number
PUBLIC_SITE_URL: set / not set / blocked / not checked
X-Request-Id coverage: present / missing / mixed / not checked
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
no SQL: confirmed / not confirmed
no secrets: confirmed / not confirmed
Next safe action: fix locally / update tester note / founder review / legal review / provider review / pause beta
```
