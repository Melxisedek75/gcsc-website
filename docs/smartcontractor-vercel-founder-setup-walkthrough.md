# SmartContractor Vercel Founder Setup Walkthrough

Status: INTERNAL_FOUNDER_SETUP_WALKTHROUGH_ONLY. This document does not connect Vercel, GitHub, Supabase, Namecheap, DNS, payment providers, app stores, or any other external account. It does not approve production deploy, public launch, real payments, real loans, real escrow, real repayment routing, stablecoin settlement, token collateral, legal/provider commitments, or secret entry in chat.

Purpose: give the founder a simple step-by-step checklist for the future Vercel setup session, so the external account work can be done calmly and safely while Codex stays out of passwords, secrets, and live account controls.

## Source Documents

Read these before using the walkthrough:

- `docs/smartcontractor-deployment-live-action-decision-packet.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-vercel-preflight.md`
- `docs/smartcontractor-vercel-env-matrix.md`
- `docs/smartcontractor-vercel-postdeploy-checklist.md`
- `docs/smartcontractor-public-beta-env-report-template.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`

## Use This Only When

Use this walkthrough only when all of these are true:

- `npm run check` passed locally in `C:\gcsc\construction-ai`;
- the founder is present at the computer;
- the deployment target is Vercel for demo-only public beta;
- the GitHub repository is already pushed;
- environment variable names are known, but secret values are not placed in chat;
- the founder understands that first public beta remains no-real-money.

If any item is missing, stop and use `docs/smartcontractor-deployment-live-action-decision-packet.md` instead.

## Founder Steps In Vercel

1. Open the Vercel dashboard in the founder browser.
2. Choose `Add New Project`.
3. Select the GCSC GitHub repository.
4. Set Root Directory to `construction-ai`.
5. Set Framework Preset to `Other`.
6. Set Install Command to `npm ci`.
7. Set Build Command to `npm run check`.
8. Leave Output Directory empty unless Vercel requires a value during import.
9. Add only reviewed environment variables in the Vercel dashboard.
10. Keep every secret value out of chat, screenshots, terminal output, public GitHub files, and browser console captures.
11. Deploy only after the founder confirms no-real-money beta scope.
12. Copy only the public URL and safe request IDs into the environment report template.

## Environment Entry Rules

Safe names that may be discussed:

- `PUBLIC_SITE_URL`
- `ALLOWED_ORIGINS`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SMARTCONTRACTOR_AUTH_MODE`
- `SMARTCONTRACTOR_ROUTE_PROTECTION`
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE`
- `GCSC_XPR_RECEIVER_ACCOUNT`
- `METAL_PAY_CONNECT_ENV`

Founder-only values that must never be pasted into chat:

- `SUPABASE_SERVICE_ROLE_KEY`
- payment-provider secrets;
- lender or finance-provider credentials;
- database passwords;
- private keys;
- seed phrases;
- signing keys;
- raw access tokens;
- Magic Link URLs;
- authorization headers;
- cookies.

## Supabase Redirect Rule

Do not change Supabase Auth redirect URLs until a deployed Vercel URL exists and the founder decides the exact callback/origin values.

After the URL exists, the founder may review:

- public app origin;
- Auth callback path;
- local development origin that should remain allowed;
- whether strict route protection is still disabled or ready for founder/admin testing.

Codex must not change Supabase dashboard settings autonomously.

## Post-Deploy Smoke Checks

After Vercel returns a URL, verify only safe demo checks:

```powershell
npm run check
```

Then use the public URL to check:

- app shell loads;
- `/api/health` responds;
- security headers exist;
- `X-Request-Id` appears;
- readiness endpoints do not expose secrets;
- Magic Link request flow is demo-safe;
- real payments remain disabled;
- real loans remain disabled;
- real escrow remains disabled;
- real repayment routing remains disabled;
- stablecoin settlement remains disabled;
- token collateral remains disabled.

## Automatic Stop Conditions

Stop immediately if:

- Vercel asks for a password, key, secret, token, or payment method that the founder is unsure about;
- a service-role key appears in a frontend value, screenshot, log, chat, or public file;
- the public URL exposes localhost-only settings;
- CORS uses a wildcard for public beta;
- Supabase Auth redirect settings are unclear;
- any real payment, loan, escrow, repayment, stablecoin, or token collateral feature appears enabled;
- a tester invite or public launch announcement is requested before smoke checks and founder go/no-go.

## Report Back Format

After the founder completes or stops the setup, report only this:

```text
Vercel setup walkthrough:
Project import: completed / blocked / not started
Root directory: construction-ai / wrong / not checked
Build command: npm run check / wrong / not checked
Public URL: safe URL only / not available
Supabase redirect: configured / not configured / blocked
Real payments disabled: confirmed / not confirmed
Real loans disabled: confirmed / not confirmed
Real escrow disabled: confirmed / not confirmed
Token collateral disabled: confirmed / not confirmed
Decision: Go / Review / No-Go
Notes: one short sentence, no secrets
```

## Required Checks

Before treating this walkthrough as complete, run:

```powershell
npm run check:vercel-founder-setup-walkthrough
npm run check:deployment-live-action-decision-packet
npm run check:vercel-preflight
npm run check:vercel-env-matrix
npm run check:vercel-postdeploy
npm run check:public-beta-env-report
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This walkthrough passes only when it gives the founder clear Vercel import steps, keeps root directory/build settings explicit, keeps secret values out of chat and public files, keeps Supabase redirects founder-controlled, keeps first public beta no-real-money, defines automatic stop conditions, and blocks production deploy, public launch, payment/provider setup, legal/provider commitments, real loans, real escrow, repayment routing, stablecoin settlement, and token collateral until separate founder-controlled approval.
