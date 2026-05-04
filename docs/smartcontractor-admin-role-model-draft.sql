-- SmartContractor admin role model draft.
-- Date: 2026-05-04
--
-- IMPORTANT:
-- This is a local review draft. Do not apply to production until:
-- 1. Supabase Auth Magic Link is approved and enabled.
-- 2. SUPABASE_SERVICE_ROLE_KEY is configured server-side only.
-- 3. The founder/admin auth user is selected.
-- 4. Admin endpoint role checks and smoke tests pass.

create table if not exists public.admin_memberships (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in (
    'founder',
    'risk_reviewer',
    'compliance_reviewer',
    'treasury_reviewer',
    'legal_reviewer',
    'support'
  )),
  status text not null default 'active' check (status in (
    'active',
    'suspended',
    'revoked'
  )),
  permissions jsonb not null default '[]'::jsonb,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists admin_memberships_active_role_unique
  on public.admin_memberships(auth_user_id, role)
  where status = 'active';

create index if not exists admin_memberships_auth_user_id_idx
  on public.admin_memberships(auth_user_id);

comment on table public.admin_memberships is
  'Server-side admin role memberships for SmartContractor. Must be checked by backend before admin actions.';

comment on column public.admin_memberships.auth_user_id is
  'Supabase auth.users.id for the admin/founder/reviewer account.';

-- Review query: see current admin memberships without exposing secrets.
select
  role,
  status,
  count(*) as memberships
from public.admin_memberships
group by role, status
order by role, status;
