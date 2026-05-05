# SmartContractor Founder Admin Activation Runbook

Date: 2026-05-04

Purpose: exact, safe checklist for turning the first real Supabase Magic Link user into the SmartContractor founder/admin account.

This file is a preparation package only. Do not run live SQL until the founder explicitly approves the final `auth_user_id`.

## Current State

- Supabase project: `smartcontractor-gcsc`
- Project ref: `uhixuyurxsrxayhghjzm`
- Live table exists: `public.admin_memberships`
- Active founder rows: expected `0` until the founder Magic Link user is selected
- Local read-only endpoint: `/api/admin/founder-auth-setup`
- Local UI section: SmartContractor Admin tab -> Founder Auth Setup

## What Must Be True First

1. Supabase connector is authorized in Codex.
2. Backend has Supabase Auth configured with `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
3. Founder email can receive Magic Link.
4. Founder opens the Magic Link in the same browser where SmartContractor MVP is running.
5. Founder Auth Setup shows `Magic Link browser session` as `ready`.
6. Founder has one linked SmartContractor profile where `profiles.auth_user_id` equals the Supabase Auth user ID.

## Founder Steps In The Browser

1. Open local SmartContractor MVP.
2. Open the `Admin` tab.
3. In `Login Email`, enter the founder email.
4. Click `Send Magic Link`.
5. Open the email inbox.
6. Click the Magic Link from Supabase.
7. Make sure it opens the same SmartContractor browser page.
8. Click `Check Founder Auth Setup`.
9. Confirm the screen shows:
   - `Authenticated: yes`
   - `Profile linked: yes`
   - `Admin roles: none` before activation
10. Tell Codex: `Founder Auth Setup ready`.

## Codex Read-Only Verification

Before any live insert, Codex should verify:

```sql
select
  id,
  email,
  created_at,
  last_sign_in_at
from auth.users
where email = '<FOUNDER_EMAIL>';

select
  id,
  auth_user_id,
  role,
  email,
  full_name,
  created_at
from public.profiles
where auth_user_id = '<AUTH_USER_ID>';

select
  role,
  status,
  count(*) as memberships
from public.admin_memberships
group by role, status
order by role, status;
```

Expected result:

- exactly one intended founder Auth user;
- exactly one intended founder profile, or a clearly selected existing profile;
- no active `founder` row unless activation was already done.

## Live Activation SQL Template

Only run after founder approval.

Replace:

- `<AUTH_USER_ID>` with the real Supabase `auth.users.id`;
- `<FOUNDER_NOTE>` with a short non-secret note, for example `Initial founder admin activated after Magic Link verification`.

```sql
insert into public.admin_memberships (
  auth_user_id,
  role,
  status,
  permissions,
  note
) values (
  '<AUTH_USER_ID>'::uuid,
  'founder',
  'active',
  '["founder_all"]'::jsonb,
  '<FOUNDER_NOTE>'
)
on conflict (auth_user_id, role)
where status = 'active'
do update set
  permissions = excluded.permissions,
  note = excluded.note,
  updated_at = now()
returning id, auth_user_id, role, status, permissions, created_at, updated_at;
```

## Post-Activation Checks

Run:

```sql
select
  auth_user_id,
  role,
  status,
  permissions,
  created_at,
  updated_at
from public.admin_memberships
where auth_user_id = '<AUTH_USER_ID>'
order by created_at desc;
```

Then in the local app:

1. Refresh the SmartContractor page.
2. Open `Admin`.
3. Click `Check Founder Auth Setup`.
4. Confirm:
   - `Authenticated: yes`
   - `Profile linked: yes`
   - `Admin roles: founder`
5. Click `Check Session`.
6. Click `Check Linked Profile`.

Then run:

```powershell
cd C:\gcsc\construction-ai
npm run check
```

Optional real-token test later:

```powershell
$env:SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN='<SUPABASE_ACCESS_TOKEN>'
npm run check:auth
Remove-Item Env:\SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN
```

Optional strict founder-role test after the founder membership is active:

```powershell
$env:SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN='<SUPABASE_ACCESS_TOKEN>'
$env:SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER='1'
npm run check:strict-gates
Remove-Item Env:\SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN
Remove-Item Env:\SMARTCONTRACTOR_SMOKE_EXPECT_FOUNDER
```

Do not paste the access token into chat.

## Rollback

If the wrong user was activated, do not delete audit history. Revoke the membership:

```sql
update public.admin_memberships
set
  status = 'revoked',
  note = coalesce(note, '') || ' | revoked after founder review',
  updated_at = now()
where auth_user_id = '<AUTH_USER_ID>'
  and role = 'founder'
  and status = 'active'
returning id, auth_user_id, role, status, updated_at;
```

## Safety Boundaries

- This runbook does not approve real loans.
- This runbook does not release escrow or payments.
- This runbook does not enable strict RLS by itself.
- This runbook does not expose service-role keys.
- This runbook only prepares the first trusted founder/admin identity.

## Next Step After Activation

After founder activation passes, the next safe engineering step is strict admin smoke testing:

1. `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict`
2. `SMARTCONTRACTOR_ROUTE_PROTECTION=strict`
3. real Magic Link access token in local environment only
4. `npm run check:auth`
5. review failures
6. only then prepare strict RLS apply review
