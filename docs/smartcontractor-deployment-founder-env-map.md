# SmartContractor Deployment Founder Environment Map

Date: 2026-05-15 PT

Status: INTERNAL_DEPLOYMENT_ENV_MAP_ONLY

Purpose: separate founder-owned deployment values from Codex-owned local prep before the first hosted SmartContractor beta. This map is not approval to deploy, not approval to change Vercel, GitHub Pages, Namecheap, Supabase, payment provider, app store, or external account settings, and not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, or public launch.

## Environment Categories

| Name | Category | Owner | Expected surface | Repo handling |
| --- | --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | Public runtime URL | founder-owned | Hosting dashboard after deploy target exists | placeholder-only |
| `ALLOWED_ORIGINS` | Public runtime URL list | founder-owned | Hosting or backend environment dashboard | placeholder-only |
| `SUPABASE_URL` | Public project endpoint | founder-owned | Hosting dashboard and local `.env` template | placeholder-only |
| `SUPABASE_ANON_KEY` | Public browser key | founder-owned | Hosting dashboard and browser-safe app runtime | placeholder-only |
| `SUPABASE_PUBLISHABLE_KEY` | Public browser key alias | founder-owned | Hosting dashboard and browser-safe app runtime | placeholder-only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret | founder-owned | External dashboard only, never chat or repo | no value in repo |
| `SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN` | Temporary smoke-test token | founder-owned | External dashboard or founder local shell | no value in repo |
| `PAYMENT_PROVIDER_SECRET` | Payment/provider secret | founder-owned | Provider dashboard only after legal/provider review | no value in repo |
| `METAL_PAY_SECRET` | Payment/provider secret | founder-owned | Provider dashboard only after legal/provider review | no value in repo |
| `XPR_PRIVATE_KEY` | Signing key | founder-owned | Wallet/signing custody only | no value in repo |
| `APPLE_TEAM_ID` | Mobile release account value | founder-owned | Apple Developer dashboard only | placeholder-only |
| `ANDROID_KEYSTORE_PASSWORD` | Mobile signing secret | founder-owned | Local signing vault or store workflow only | no value in repo |

Public values are still founder-owned because they identify real external accounts, redirect surfaces, and deploy targets. Codex may document variable names, categories, expected surfaces, and blocked-live gates, but Codex must not request, receive, store, print, commit, or paste real secret values.

## Founder-Owned Values

The founder enters real values directly in the relevant external dashboard or local secure shell when a founder-controlled live step is approved. That includes hosting variables, Supabase values, redirect URLs, payment/provider values, wallet/signing values, app-store values, and mobile signing values.

Allowed founder report-back is limited to safe confirmations such as:

- which platform was selected;
- whether a value was entered directly in the dashboard;
- whether the app shell, health endpoint, request ID, security headers, Auth redirect status, and no-real-money gates passed;
- whether the decision is HOLD, REVIEW, or READY_FOR_FOUNDER_CONTROLLED_DEPLOY.

## Codex-Owned Local Prep

Codex may prepare local-only docs, validators, placeholder examples, checklists, smoke command templates, and evidence fields. Codex may also run local checks from `C:\gcsc\construction-ai` and update tracked docs when those docs do not contain secrets, passwords, tokens, service-role keys, private keys, seed phrases, Magic Link URLs, raw .env files, database connection strings, provider credentials, signing keys, and payment data.

Codex must stop before:

- entering or changing values in Vercel, GitHub Pages, Namecheap, Supabase, payment/provider dashboards, Apple Developer, Google Play, wallet tools, or any external account;
- requesting raw `.env` files, Magic Link URLs, service-role keys, private keys, seed phrases, passwords, database URLs, webhook secrets, provider credentials, signing keys, or payment data;
- enabling real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, production provider API calls, public beta URL sharing, mobile store submission, or public launch.

## Do Not Put In Chat

Never paste secrets, passwords, tokens, service-role keys, private keys, seed phrases, Magic Link URLs, raw .env files, database connection strings, provider credentials, signing keys, and payment data into chat, docs, screenshots, GitHub issues, public beta feedback, investor packets, or support logs.

If any of those values appear in a working artifact, the state becomes HOLD_FOR_REDACTION and the artifact cannot support deployment, beta invites, investor sharing, legal/provider review, mobile release, or public launch.

## Pre-Deploy Evidence Record

Use this safe evidence shape. Fill values with non-secret labels, IDs, yes/no confirmations, or redacted references only:

```text
environment_record_id:
target_platform:
target_url:
source_commit:
environment_label:
founder_owner:
secrets_entered_by_founder_in_dashboard:
no_real_money_flags_confirmed:
auth_redirect_review_status:
rollback_owner:
decision: HOLD, REVIEW, or READY_FOR_FOUNDER_CONTROLLED_DEPLOY
```

Missing source commit, founder owner, no-real-money confirmation, Auth redirect status, rollback owner, or decision keeps the record in HOLD.

## Preview/Beta URL Hold

Hosted preview or public beta URL sharing remains HOLD until deployment smoke evidence records app shell, health endpoint, security headers, request ID, Auth redirect status, no-real-money banner, disabled payment/loan actions, result, and rollback_or_hold_decision.

Preview or beta URL evidence does not approve production deploy, DNS changes, Supabase Auth redirects, tester invites, payment/provider setup, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, mobile store submission, or public launch.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:deployment-founder-env-map
npm run check:deployment-decision-prep
npm run check:deployment-live-action-decision-packet
npm run check:vercel-founder-setup-walkthrough
npm run check:public-beta-first-cohort-launch-packet
npm run check:real-status-audit
npm run check
```

This map is ready when the founder can see which values they own, which prep Codex can do locally, which values never belong in chat, and why public beta URL sharing stays held until founder-controlled smoke evidence exists.
