-- SmartContractor profile ownership binding draft.
-- Date: 2026-05-04
--
-- IMPORTANT:
-- This is a local review draft. Do not apply to production until:
-- 1. Supabase Auth Magic Link is approved and enabled.
-- 2. The backend is deployed with session verification.
-- 3. Existing demo/anonymous rows are reviewed or migrated.
-- 4. Anonymous, homeowner, contractor, and admin smoke tests pass.

alter table public.profiles
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create unique index if not exists profiles_auth_user_id_unique
  on public.profiles(auth_user_id)
  where auth_user_id is not null;

create index if not exists profiles_role_auth_user_id_idx
  on public.profiles(role, auth_user_id);

comment on column public.profiles.auth_user_id is
  'Owner link between SmartContractor profile and Supabase auth.users.id. Required before strict RLS.';

-- Review query: rows without auth_user_id must stay demo/system rows or be migrated.
select
  role,
  count(*) as total_profiles,
  count(auth_user_id) as linked_profiles,
  count(*) - count(auth_user_id) as unlinked_profiles
from public.profiles
group by role
order by role;
