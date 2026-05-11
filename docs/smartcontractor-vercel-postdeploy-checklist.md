# SmartContractor Vercel Post-Deploy Checklist

Date: 2026-05-11

Purpose: define the safe checks to run after the first Vercel beta deployment, without changing external accounts, exposing secrets, enabling real payments, or applying live Supabase changes.

## Scope

This checklist starts only after the founder has imported the project into Vercel and Vercel has produced a preview or production URL.

It is read-only. It does not approve public launch, real loans, escrow, token collateral, production payments, or strict RLS.

## Required Local Baseline

Before trusting a deployed URL, run from `C:\gcsc\construction-ai`:

```powershell
npm run check
```

Expected result: every local validator passes, including Auth smoke checks, route gates, ENV example, Vercel preflight, Vercel ENV matrix, public beta handoff, security headers, and request-id tracing.

## Safe Deployed URL Checks

Replace `<DEPLOYED_URL>` with the Vercel URL or custom domain:

```powershell
curl.exe -I --max-time 20 <DEPLOYED_URL>/api/health
curl.exe -L --max-time 20 <DEPLOYED_URL>/api/health
curl.exe -I --max-time 20 <DEPLOYED_URL>/smartcontractor.html
```

Expected result:

- `/api/health` returns HTTP 200;
- `X-Request-Id` is present;
- `X-Content-Type-Options` is `nosniff`;
- `X-Frame-Options` is `DENY`;
- `Referrer-Policy` is `strict-origin-when-cross-origin`;
- `Permissions-Policy` disables camera, microphone, and geolocation by default;
- `smartcontractor.html` loads over HTTPS;
- no response body exposes `SUPABASE_SERVICE_ROLE_KEY`, provider secrets, private keys, or database passwords.

## Readiness Endpoints

After the deployed URL answers, inspect these read-only endpoints:

- `<DEPLOYED_URL>/api/admin/launch-readiness`
- `<DEPLOYED_URL>/api/admin/mobile-install-readiness`
- `<DEPLOYED_URL>/api/admin/founder-action-center`
- `<DEPLOYED_URL>/api/auth/protection-status`

Expected result:

- demo/beta scope is visible;
- real loans remain disabled;
- real escrow remains disabled;
- token collateral settlement remains disabled;
- production payment capture remains disabled;
- admin assignment remains founder-controlled;
- strict Auth/RLS remains blocked until founder Magic Link, admin membership activation, and smoke tests are complete.

## Supabase Auth Redirect Review

The founder must review Supabase Auth redirect URLs before testing Magic Link on the deployed domain.

Required safe redirect origins:

- local testing: `http://localhost:3002`
- public site: `https://xprnet.org`
- public www site: `https://www.xprnet.org`
- Vercel preview/production URL selected by the founder

Do not paste database passwords, service-role keys, private keys, or provider secrets into chat.

## Stop Conditions

Stop and do not promote the deployment if any of these happen:

- HTTP is available but HTTPS is not available;
- `/api/health` is not HTTP 200;
- `X-Request-Id` is missing;
- baseline security headers are missing;
- frontend exposes service-role or payment-provider secrets;
- route protection is strict but no founder admin user is active;
- real loans, escrow, token collateral, or production payment capture appear enabled without legal/provider/founder approval.

## Founder Next Step

If every read-only post-deploy check passes, the next founder-present action is:

1. add the deployed Vercel URL to Supabase Auth redirect settings;
2. send Magic Link to the founder email;
3. open the Magic Link in the same browser;
4. verify Founder Auth Setup;
5. only after explicit approval, activate the founder row in `admin_memberships`;
6. run strict admin smoke tests before any public beta announcement.
