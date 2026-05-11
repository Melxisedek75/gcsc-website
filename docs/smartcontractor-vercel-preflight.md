# SmartContractor Vercel Preflight

Date: 2026-05-11

Purpose: prepare the first public beta deployment path without logging into Vercel, changing external accounts, pasting secrets, or enabling real-money features.

## Scope

This is a preflight checklist only. It does not deploy the app and does not require passwords, API keys, Supabase service-role keys, payment-provider keys, or live Supabase changes.

## Recommended First Beta Target

Use Vercel for the first SmartContractor public beta because the MVP needs:

- Node/Express backend routes;
- server-only environment variables;
- Supabase Auth redirect support;
- public HTTPS domain support;
- simple GitHub-based deploys;
- a clean path to later move heavier backend work to Azure or Supabase Edge Functions.

## Founder-Controlled Actions

The founder must be present for:

1. Vercel account login.
2. GitHub repository import.
3. Production domain selection.
4. Environment variable setup.
5. Supabase Auth redirect URL setup.
6. Any decision to enable strict Auth/RLS.
7. Any payment-provider mode change.

## Local Checks Before Import

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check
```

Expected result: all local validators pass. Passing local checks does not approve legal, payment, lending, escrow, or token-collateral launch.

## Vercel Project Settings Draft

Use these as review notes when importing the project:

| Setting | Draft Value | Notes |
|---------|-------------|-------|
| Framework preset | Other | MVP is Node/Express-style, not a full Next.js app. |
| Root directory | `construction-ai` | Use the app folder that contains `server.js` and `package.json`. |
| Install command | `npm ci` | Uses lockfile when present. |
| Build command | `npm run check` | Safe first beta gate. |
| Output directory | none | Backend routes serve static files from `public`. |

## Environment Variables Draft

Start with public/demo-safe values only:

- `PUBLIC_SITE_URL`
- `ALLOWED_ORIGINS`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SMARTCONTRACTOR_AUTH_MODE`
- `SMARTCONTRACTOR_ROUTE_PROTECTION`
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE`
- `GCSC_XPR_RECEIVER_ACCOUNT`
- `METAL_PAY_CONNECT_ENV`

Do not paste these until founder review:

- `SUPABASE_SERVICE_ROLE_KEY`;
- `METAL_PAY_CONNECT_SECRET_KEY`;
- `STRIPE_SECRET_KEY`;
- `PAYPAL_CLIENT_SECRET`;
- `COINBASE_COMMERCE_API_KEY`;
- `BTCPAY_API_KEY`;
- any legal, escrow, lender, bank, or production payment credential.

## Disabled For First Public Beta

Keep these disabled or simulated:

- real contractor loans;
- real escrow or stored-value handling;
- automatic payment release;
- token collateral locking, liquidation, or settlement;
- production payment capture;
- automatic admin assignment;
- broad Supabase RLS policies such as `USING true`;
- service-role keys in browser code, screenshots, chat, or public GitHub files.

## Acceptance Criteria

The project is ready for founder-present Vercel import when:

- `npm run check` passes locally;
- Vercel root directory is confirmed as `construction-ai`;
- required demo-safe environment variables are listed;
- secret variables are explicitly marked founder-only;
- Supabase Auth redirect URL remains a founder setup step;
- real loans, escrow, token collateral, and production payments remain disabled.

