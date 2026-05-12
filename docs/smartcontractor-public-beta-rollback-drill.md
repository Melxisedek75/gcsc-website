# SmartContractor Public Beta Rollback Drill

Purpose: give the founder a safe rollback plan before sharing a public beta link. This drill is read-only until the founder chooses a rollback path inside the hosting account.

This drill does not change Vercel, Supabase, GitHub, Namecheap, payments, loans, escrow, token collateral, or legal settings by itself.

## No Secrets

Do not paste secrets into chat, screenshots, terminal output, or issue notes. Do not share cookies, Authorization headers, Magic Link URLs, Supabase keys, database URLs, service-role keys, provider keys, private keys, seed phrases, wallet data, or customer contact details.

## Trigger Conditions

Start the rollback drill if any public beta check shows:

- home page is blank or broken;
- `/api/health` does not answer;
- `/api/admin/beta-readiness` does not answer;
- `/api/admin/production-readiness` does not answer;
- `X-Request-Id` is missing from API responses;
- security headers are missing;
- real payments disabled cannot be confirmed;
- real loans disabled cannot be confirmed;
- escrow disabled cannot be confirmed;
- token collateral disabled cannot be confirmed;
- Supabase Auth redirect sends users to the wrong site;
- admin access is open to non-founder users;
- sensitive data appears in the browser, logs, screenshots, or response bodies.

## Founder-Controlled Rollback Paths

Choose the smallest rollback that fixes the issue.

1. Safer app mode rollback:
   - set `SMARTCONTRACTOR_ROUTE_PROTECTION=draft`;
   - set `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=draft`;
   - redeploy or restart the deployment;
   - keep real payments, real loans, escrow, and token collateral disabled.

2. Vercel deployment rollback:
   - open the Vercel project;
   - go to Deployments;
   - pick the last known good previous deployment;
   - use Vercel rollback/promote controls;
   - do not add or reveal secrets in chat.

3. Supabase Auth redirect rollback:
   - open Supabase Auth URL settings;
   - remove or correct only the bad public beta URL;
   - keep localhost and approved public origins;
   - do not touch database password, service-role key, or SQL policies.

4. Public announcement rollback:
   - stop sharing the beta link;
   - mark the issue in the beta decision log;
   - keep screenshots and logs local until redacted;
   - do not promise a real-money launch date.

## Read-Only Verification

Set the public URL locally:

```powershell
$env:PUBLIC_SITE_URL="https://your-public-beta-url.example"
$base=$env:PUBLIC_SITE_URL.TrimEnd("/")
```

Run the safe checks:

```powershell
npm run check
Invoke-WebRequest -Uri "$base/api/health" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/beta-readiness" -Method GET
Invoke-WebRequest -Uri "$base/api/admin/production-readiness" -Method GET
```

After rollback, confirm:

- `/api/health` works;
- `/api/admin/beta-readiness` works;
- `/api/admin/production-readiness` works;
- `X-Request-Id` is present;
- real payments disabled is still true or clearly blocked;
- real loans disabled is still true or clearly blocked;
- escrow disabled is still true or clearly blocked;
- token collateral disabled is still true or clearly blocked;
- no SQL was run;
- no secrets were copied into chat, screenshots, docs, or logs.

## Do Not Do

Do not:

- run live SQL or migrations as part of this drill;
- add broad `USING true` RLS policies;
- expose a service-role key to frontend JavaScript;
- switch payment providers to production mode;
- approve real loans, escrow, token collateral, or payment capture;
- paste passwords, keys, database URLs, Magic Link URLs, or bearer tokens into chat;
- delete production data;
- change DNS or domain settings unless the founder explicitly chooses that path.

## Safe Report-Back

```text
Public beta rollback drill:
PUBLIC_SITE_URL: set / not set / blocked
Trigger: health / beta readiness / production readiness / security headers / Auth redirect / admin access / sensitive data / other
Rollback path used: app mode / Vercel previous deployment / Supabase Auth redirect / public announcement pause / none
npm run check: passed / failed / not run
/api/health: passed / failed / blocked
/api/admin/beta-readiness: passed / failed / blocked
/api/admin/production-readiness: passed / failed / blocked
X-Request-Id: present / missing / not checked
real payments disabled: confirmed / not confirmed
real loans disabled: confirmed / not confirmed
escrow disabled: confirmed / not confirmed
token collateral disabled: confirmed / not confirmed
no SQL: confirmed / not confirmed
no secrets: confirmed / not confirmed
Founder Decision: keep beta paused / retry smoke checks / review with Codex / no-go
```
