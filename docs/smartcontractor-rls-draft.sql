-- SmartContractor production RLS draft.
-- Date: 2026-05-03
--
-- IMPORTANT:
-- This file is a local draft. Do not run directly in production until:
-- 1. Supabase Auth is enabled for the app.
-- 2. profiles.auth_user_id is populated for real users.
-- 3. Backend uses a server-only service role key for trusted system writes.
-- 4. Smoke tests pass for homeowner, contractor, and anonymous access.

create schema if not exists private;

create or replace function private.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public, private
as $$
  select id
  from public.profiles
  where auth_user_id = (select auth.uid())
  limit 1
$$;

create or replace function private.current_homeowner_id()
returns uuid
language sql
stable
security definer
set search_path = public, private
as $$
  select h.id
  from public.homeowners h
  join public.profiles p on p.id = h.profile_id
  where p.auth_user_id = (select auth.uid())
  limit 1
$$;

create or replace function private.current_contractor_id()
returns uuid
language sql
stable
security definer
set search_path = public, private
as $$
  select c.id
  from public.contractors c
  join public.profiles p on p.id = c.profile_id
  where p.auth_user_id = (select auth.uid())
  limit 1
$$;

-- Enable RLS everywhere user or platform data exists.
alter table public.profiles enable row level security;
alter table public.homeowners enable row level security;
alter table public.contractors enable row level security;
alter table public.jobs enable row level security;
alter table public.bids enable row level security;
alter table public.bid_unlocks enable row level security;
alter table public.contractor_loans enable row level security;
alter table public.loan_repayments enable row level security;
alter table public.disputes enable row level security;
alter table public.dispute_evidence enable row level security;
alter table public.dispute_reviews enable row level security;
alter table public.ratings enable row level security;
alter table public.project_contracts enable row level security;
alter table public.milestones enable row level security;
alter table public.payment_intents enable row level security;
alter table public.payment_events enable row level security;
alter table public.verification_checks enable row level security;
alter table public.verification_provider_events enable row level security;
alter table public.audit_events enable row level security;
alter table public.token_price_snapshots enable row level security;
alter table public.token_collateral_locks enable row level security;

-- Profiles.
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) is not null and auth_user_id = (select auth.uid()));

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) is not null and auth_user_id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth_user_id = (select auth.uid()))
with check (auth_user_id = (select auth.uid()));

-- Homeowners.
create policy "homeowners_select_own"
on public.homeowners for select
to authenticated
using (profile_id = (select private.current_profile_id()));

create policy "homeowners_insert_own"
on public.homeowners for insert
to authenticated
with check (profile_id = (select private.current_profile_id()));

create policy "homeowners_update_own"
on public.homeowners for update
to authenticated
using (profile_id = (select private.current_profile_id()))
with check (profile_id = (select private.current_profile_id()));

-- Contractors.
create policy "contractors_select_own_or_public_verified"
on public.contractors for select
to authenticated
using (
  profile_id = (select private.current_profile_id())
  or verification_status = 'verified'
);

create policy "contractors_insert_own"
on public.contractors for insert
to authenticated
with check (profile_id = (select private.current_profile_id()));

create policy "contractors_update_own"
on public.contractors for update
to authenticated
using (profile_id = (select private.current_profile_id()))
with check (profile_id = (select private.current_profile_id()));

-- Jobs.
create policy "jobs_select_open_or_participant"
on public.jobs for select
to authenticated
using (
  status = 'open'
  or homeowner_id = (select private.current_homeowner_id())
  or awarded_contractor_id = (select private.current_contractor_id())
);

create policy "jobs_insert_own_homeowner"
on public.jobs for insert
to authenticated
with check (homeowner_id = (select private.current_homeowner_id()));

create policy "jobs_update_own_homeowner"
on public.jobs for update
to authenticated
using (homeowner_id = (select private.current_homeowner_id()))
with check (homeowner_id = (select private.current_homeowner_id()));

-- Bids.
create policy "bids_select_participant_or_public_preview"
on public.bids for select
to authenticated
using (
  contractor_id = (select private.current_contractor_id())
  or exists (
    select 1 from public.jobs j
    where j.id = bids.job_id
      and j.homeowner_id = (select private.current_homeowner_id())
  )
  or is_public_preview = true
);

create policy "bids_insert_own_contractor"
on public.bids for insert
to authenticated
with check (contractor_id = (select private.current_contractor_id()));

create policy "bids_update_own_contractor"
on public.bids for update
to authenticated
using (contractor_id = (select private.current_contractor_id()))
with check (contractor_id = (select private.current_contractor_id()));

-- Contractor loans and repayments.
create policy "contractor_loans_select_own_contractor"
on public.contractor_loans for select
to authenticated
using (contractor_id = (select private.current_contractor_id()));

create policy "contractor_loans_insert_own_contractor"
on public.contractor_loans for insert
to authenticated
with check (contractor_id = (select private.current_contractor_id()));

create policy "loan_repayments_select_own_contractor"
on public.loan_repayments for select
to authenticated
using (
  exists (
    select 1 from public.contractor_loans l
    where l.id = loan_repayments.loan_id
      and l.contractor_id = (select private.current_contractor_id())
  )
);

-- Disputes and evidence.
create policy "disputes_select_participants"
on public.disputes for select
to authenticated
using (
  homeowner_id = (select private.current_homeowner_id())
  or contractor_id = (select private.current_contractor_id())
);

create policy "disputes_insert_participants"
on public.disputes for insert
to authenticated
with check (
  homeowner_id = (select private.current_homeowner_id())
  or contractor_id = (select private.current_contractor_id())
);

create policy "dispute_evidence_select_participants"
on public.dispute_evidence for select
to authenticated
using (
  exists (
    select 1 from public.disputes d
    where d.id = dispute_evidence.dispute_id
      and (
        d.homeowner_id = (select private.current_homeowner_id())
        or d.contractor_id = (select private.current_contractor_id())
      )
  )
);

create policy "dispute_evidence_insert_participants"
on public.dispute_evidence for insert
to authenticated
with check (
  uploaded_by_profile_id = (select private.current_profile_id())
);

create policy "dispute_reviews_select_dispute_participants_or_reviewer"
on public.dispute_reviews for select
to authenticated
using (
  reviewer_contractor_id = (select private.current_contractor_id())
  or exists (
    select 1 from public.disputes d
    where d.id = dispute_reviews.dispute_id
      and (
        d.homeowner_id = (select private.current_homeowner_id())
        or d.contractor_id = (select private.current_contractor_id())
      )
  )
);

create policy "dispute_reviews_insert_own_reviewer"
on public.dispute_reviews for insert
to authenticated
with check (reviewer_contractor_id = (select private.current_contractor_id()));

-- Project contracts and milestones.
create policy "project_contracts_select_participants"
on public.project_contracts for select
to authenticated
using (
  homeowner_id = (select private.current_homeowner_id())
  or contractor_id = (select private.current_contractor_id())
);

create policy "milestones_select_project_participants"
on public.milestones for select
to authenticated
using (
  exists (
    select 1 from public.project_contracts pc
    where pc.id = milestones.project_contract_id
      and (
        pc.homeowner_id = (select private.current_homeowner_id())
        or pc.contractor_id = (select private.current_contractor_id())
      )
  )
);

-- Payments.
create policy "payment_intents_select_related_reference"
on public.payment_intents for select
to authenticated
using (true); -- tighten after reference_id is typed to job/loan/contract IDs.

-- Backend-only tables intentionally have no browser insert/update policies:
-- payment_events, verification_provider_events, audit_events, token_price_snapshots.

-- Verification checks: users can read checks about their own profile/role records.
create policy "verification_checks_select_own_subject"
on public.verification_checks for select
to authenticated
using (
  (subject_type = 'profile' and subject_id = (select private.current_profile_id()))
  or (subject_type = 'homeowner' and subject_id = (select private.current_homeowner_id()))
  or (subject_type = 'contractor' and subject_id = (select private.current_contractor_id()))
);

-- Token collateral.
create policy "token_collateral_locks_select_own_contractor"
on public.token_collateral_locks for select
to authenticated
using (contractor_id = (select private.current_contractor_id()));

create policy "token_collateral_locks_insert_own_contractor"
on public.token_collateral_locks for insert
to authenticated
with check (contractor_id = (select private.current_contractor_id()));

