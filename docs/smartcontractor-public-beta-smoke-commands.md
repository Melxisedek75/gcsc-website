# SmartContractor Public Beta Smoke Commands

Purpose: give the founder a safe read-only PowerShell smoke checklist for a deployed public beta URL. These checks only read pages and endpoints, then verify request IDs, security headers, readiness responses, and demo-only gates.

This checklist does not deploy, change Vercel, change Supabase, send Magic Link emails, move money, create loans, release escrow, or lock token collateral.

## No Secrets

Do not paste secrets into chat or terminal output. Do not share cookies, Authorization headers, Magic Link URLs, Supabase keys, database URLs, payment provider keys, private keys, seed phrases, wallet data, or customer contact details.

## Before Running

Set the public URL locally in PowerShell:

```powershell
$env:PUBLIC_SITE_URL="https://your-public-beta-url.example"
```

Use the real deployed URL only. Do not include passwords or tokens.

## Read-Only Commands

```powershell
$base=$env:PUBLIC_SITE_URL.TrimEnd("/")
Invoke-WebRequest -Uri "$base/" -Method GET
Invoke-WebRequest -Uri "$base/api/health" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/beta-readiness" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/mobile-install-readiness" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/production-readiness" -Method GET
```

## What To Check

- page loads without blank screen;
- `/api/health` returns JSON;
- `/api/admin/beta-readiness` returns demo/public beta status;
- `/api/admin/mobile-install-readiness` returns mobile/PWA readiness;
- `/api/admin/production-readiness` shows real payments disabled, real loans disabled, escrow disabled, token collateral disabled, or clearly blocked;
- every API response includes `X-Request-Id` or a safe request ID field;
- security headers are present, especially content type, frame, referrer, and permissions policies.

## Do not run

Do not run:

- POST/PUT/PATCH/DELETE requests against public beta;
- payment webhook tests against real providers;
- loan approval/origination actions;
- escrow release actions;
- token collateral lock/liquidation actions;
- Supabase SQL, migrations, or policy changes;
- commands containing cookies, Authorization headers, service-role key, or Magic Link URL.

## Safe Report-Back

```text
Public beta smoke:
PUBLIC_SITE_URL: set / not set / blocked
Home page: passed / failed / blocked
/api/health: passed / failed / blocked
/api/admin/beta-readiness: passed / failed / blocked
/api/admin/mobile-install-readiness: passed / failed / blocked
/api/admin/production-readiness: passed / failed / blocked
X-Request-Id: present / missing / not checked
security headers: present / missing / not checked
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
Founder Decision: Go / Review / No-Go
```
