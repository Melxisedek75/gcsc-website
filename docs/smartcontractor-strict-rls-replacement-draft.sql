-- SmartContractor strict RLS replacement draft.
-- Date: 2026-05-04
--
-- IMPORTANT:
-- This is a local review draft only.
-- Do not run this against live Supabase until:
-- 1. Founder approves the exact SQL.
-- 2. Supabase Auth Magic Link users are tested.
-- 3. `profiles.auth_user_id` is populated for real users.
-- 4. `admin_memberships` is ready for founder/admin access.
-- 5. Backend service-role secret is configured only in the server/deploy environment.
--
-- Goal:
-- Replace permissive development policies with owner/participant RLS policies.
-- Keep backend-only ledger/provider tables closed to browser writes.

begin;

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

-- Advisor fixes: missing indexes for foreign keys.
create index if not exists project_contracts_accepted_bid_id_idx
on public.project_contracts (accepted_bid_id);

create index if not exists token_collateral_locks_price_snapshot_id_idx
on public.token_collateral_locks (price_snapshot_id);

-- Enable RLS on all public SmartContractor tables.
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

-- Remove development policies that currently allow public true/true access.
drop policy if exists "dev audit events insert" on public.audit_events;
drop policy if exists "dev audit events read" on public.audit_events;
drop policy if exists "dev insert bid unlocks" on public.bid_unlocks;
drop policy if exists "dev read bid unlocks" on public.bid_unlocks;
drop policy if exists "dev insert bids" on public.bids;
drop policy if exists "dev read bids" on public.bids;
drop policy if exists "dev update bids" on public.bids;
drop policy if exists "dev insert contractor loans" on public.contractor_loans;
drop policy if exists "dev read contractor loans" on public.contractor_loans;
drop policy if exists "dev update contractor loans" on public.contractor_loans;
drop policy if exists "dev insert contractors" on public.contractors;
drop policy if exists "dev read contractors" on public.contractors;
drop policy if exists "dev update contractors" on public.contractors;
drop policy if exists "dev insert dispute evidence" on public.dispute_evidence;
drop policy if exists "dev read dispute evidence" on public.dispute_evidence;
drop policy if exists "dev insert dispute reviews" on public.dispute_reviews;
drop policy if exists "dev read dispute reviews" on public.dispute_reviews;
drop policy if exists "dev insert disputes" on public.disputes;
drop policy if exists "dev read disputes" on public.disputes;
drop policy if exists "dev update disputes" on public.disputes;
drop policy if exists "dev insert homeowners" on public.homeowners;
drop policy if exists "dev read homeowners" on public.homeowners;
drop policy if exists "dev update homeowners" on public.homeowners;
drop policy if exists "dev insert jobs" on public.jobs;
drop policy if exists "dev read jobs" on public.jobs;
drop policy if exists "dev update jobs" on public.jobs;
drop policy if exists "dev insert loan repayments" on public.loan_repayments;
drop policy if exists "dev read loan repayments" on public.loan_repayments;
drop policy if exists "dev milestones insert" on public.milestones;
drop policy if exists "dev milestones read" on public.milestones;
drop policy if exists "dev milestones update" on public.milestones;
drop policy if exists "dev payment events insert" on public.payment_events;
drop policy if exists "dev payment events read" on public.payment_events;
drop policy if exists "dev payment intents insert" on public.payment_intents;
drop policy if exists "dev payment intents read" on public.payment_intents;
drop policy if exists "dev payment intents update" on public.payment_intents;
drop policy if exists "dev insert profiles" on public.profiles;
drop policy if exists "dev read profiles" on public.profiles;
drop policy if exists "dev update profiles" on public.profiles;
drop policy if exists "dev project contracts insert" on public.project_contracts;
drop policy if exists "dev project contracts read" on public.project_contracts;
drop policy if exists "dev project contracts update" on public.project_contracts;
drop policy if exists "dev insert ratings" on public.ratings;
drop policy if exists "dev read ratings" on public.ratings;
drop policy if exists "dev token collateral locks insert" on public.token_collateral_locks;
drop policy if exists "dev token collateral locks read" on public.token_collateral_locks;
drop policy if exists "dev token collateral locks update" on public.token_collateral_locks;
drop policy if exists "dev token price snapshots insert" on public.token_price_snapshots;
drop policy if exists "dev token price snapshots read" on public.token_price_snapshots;
drop policy if exists "dev verification checks insert" on public.verification_checks;
drop policy if exists "dev verification checks read" on public.verification_checks;
drop policy if exists "dev verification checks update" on public.verification_checks;
drop policy if exists "dev verification provider events insert" on public.verification_provider_events;
drop policy if exists "dev verification provider events read" on public.verification_provider_events;

-- Remove earlier draft policy names if this script is re-run.
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "homeowners_select_own" on public.homeowners;
drop policy if exists "homeowners_insert_own" on public.homeowners;
drop policy if exists "homeowners_update_own" on public.homeowners;
drop policy if exists "contractors_select_own_or_public_verified" on public.contractors;
drop policy if exists "contractors_insert_own" on public.contractors;
drop policy if exists "contractors_update_own" on public.contractors;
drop policy if exists "jobs_select_open_or_participant" on public.jobs;
drop policy if exists "jobs_insert_own_homeowner" on public.jobs;
drop policy if exists "jobs_update_own_homeowner" on public.jobs;
drop policy if exists "bids_select_participant_or_public_preview" on public.bids;
drop policy if exists "bids_insert_own_contractor" on public.bids;
drop policy if exists "bids_update_own_contractor" on public.bids;
drop policy if exists "bid_unlocks_select_own_contractor" on public.bid_unlocks;
drop policy if exists "contractor_loans_select_own_contractor" on public.contractor_loans;
drop policy if exists "contractor_loans_insert_own_contractor" on public.contractor_loans;
drop policy if exists "loan_repayments_select_own_contractor" on public.loan_repayments;
drop policy if exists "disputes_select_participants" on public.disputes;
drop policy if exists "disputes_insert_participants" on public.disputes;
drop policy if exists "dispute_evidence_select_participants" on public.dispute_evidence;
drop policy if exists "dispute_evidence_insert_participants" on public.dispute_evidence;
drop policy if exists "dispute_reviews_select_dispute_participants_or_reviewer" on public.dispute_reviews;
drop policy if exists "dispute_reviews_insert_own_reviewer" on public.dispute_reviews;
drop policy if exists "project_contracts_select_participants" on public.project_contracts;
drop policy if exists "milestones_select_project_participants" on public.milestones;
drop policy if exists "payment_intents_select_none_from_browser" on public.payment_intents;
drop policy if exists "verification_checks_select_own_subject" on public.verification_checks;
drop policy if exists "token_collateral_locks_select_own_contractor" on public.token_collateral_locks;
drop policy if exists "token_collateral_locks_insert_own_contractor" on public.token_collateral_locks;
drop policy if exists "ratings_select_related_participants" on public.ratings;

-- Profiles.
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth_user_id = (select auth.uid()));

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth_user_id = (select auth.uid()));

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

create policy "bid_unlocks_select_own_contractor"
on public.bid_unlocks for select
to authenticated
using (unlocked_by_contractor_id = (select private.current_contractor_id()));

-- Loans and repayments. Loan approvals/repayments are backend/admin writes only after request creation.
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
with check (uploaded_by_profile_id = (select private.current_profile_id()));

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

-- Project contracts, milestones, and ratings.
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

create policy "ratings_select_related_participants"
on public.ratings for select
to authenticated
using (
  homeowner_id = (select private.current_homeowner_id())
  or contractor_id = (select private.current_contractor_id())
);

-- Payments.
-- Payment intents/events are backend-managed until payer ownership columns are added.
-- This prevents exposing all payment rows through a broad authenticated select policy.
create policy "payment_intents_select_none_from_browser"
on public.payment_intents for select
to authenticated
using (false);

-- Backend-only tables intentionally have no browser insert/update/select policies:
-- audit_events, payment_events, verification_provider_events, token_price_snapshots.
-- Backend uses server-only service role and API endpoints for controlled reads/writes.

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

-- Verification queries to run after applying in a reviewed staging/live window:
--
-- 1. No always-true policies should remain:
-- select schemaname, tablename, policyname, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and (qual = 'true' or with_check = 'true')
-- order by tablename, policyname;
--
-- 2. Confirm backend-only tables have no browser policies:
-- select tablename, count(*) as policy_count
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in (
--     'audit_events',
--     'payment_events',
--     'verification_provider_events',
--     'token_price_snapshots'
--   )
-- group by tablename
-- order by tablename;
--
-- 3. Re-run Supabase security/performance advisors.

commit;

