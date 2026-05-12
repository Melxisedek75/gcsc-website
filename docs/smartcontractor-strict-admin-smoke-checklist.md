# SmartContractor Strict Admin Smoke Checklist

Date: 2026-05-11 PT

Purpose: safe smoke checklist to run after the founder Magic Link user has an active `founder` row in `admin_memberships`, but before strict RLS or public admin protection is treated as ready.

This file is a preparation checklist only. It does not approve live RLS changes, real loans, real escrow, real payment release, or token collateral.

## Safety Boundary

Do not paste or record:

- Supabase access token;
- Magic Link URL;
- service-role key;
- database password;
- API key;
- seed phrase or private key;
- full raw `.env` content.

Do not use this checklist as approval for:

- strict RLS apply;
- real contractor loans;
- real escrow;
- real payment release;
- token collateral locking or liquidation;
- legal or financial launch decisions.

## Preconditions

Run this checklist only after all of these are true:

1. Founder completed Magic Link in the same browser as the local SmartContractor MVP.
2. `docs/smartcontractor-founder-auth-evidence-template.md` shows:
   - `Authenticated: yes`
   - `Profile linked: yes`
   - `Admin roles shown: founder`
3. Founder explicitly approved the live admin membership activation.
4. `docs/smartcontractor-founder-admin-activation-runbook.md` post-activation checks passed.
5. Local backend starts without exposing secrets.
6. Real loans, real escrow, production payments, and token collateral remain disabled.

## Local Backend Preflight

In PowerShell:

```powershell
cd C:\gcsc\construction-ai
npm start
```

Keep that PowerShell window open.

Open another PowerShell window for checks:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
npm run check:strict-gates
```

Expected result:

- anonymous protected routes stay closed;
- draft/demo-safe routes still work;
- checks do not require real payment provider credentials;
- no secret values are printed.

## Optional Real Founder Token Smoke

Only do this locally, only after the founder is present, and never paste the token into chat.

In PowerShell:

```powershell
cd C:\gcsc\construction-ai
$env:SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN='<local-only-token-not-in-chat>'
$env:SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER='1'
npm run check:strict-gates
Remove-Item Env:\SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN
Remove-Item Env:\SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER
```

Expected result:

- `/api/admin/me` recognizes the founder role;
- strict admin routes accept the founder token;
- wrong-owner and anonymous access still fail;
- token value is not logged, copied, or committed.

## Failure Response

If any smoke step fails:

1. Do not apply strict RLS.
2. Do not enable public admin strict mode.
3. Do not enable real payments, loans, escrow, or token collateral.
4. Record only non-secret evidence:

```text
Smoke date:
Local URL:
Backend port:
Command that failed:
Visible non-secret error:
Request ID if visible:
Founder role visible in UI: yes/no
```

5. Ask Codex to fix the local/backend issue before live policy changes.

## Acceptance Check

This checklist is complete when:

- founder Magic Link session is confirmed;
- active founder membership is confirmed;
- anonymous admin access is blocked;
- founder admin access passes using only local ENV token handling;
- token is removed from PowerShell after the smoke test;
- no secrets are pasted into chat or committed;
- strict RLS remains a separate founder-approved step.

