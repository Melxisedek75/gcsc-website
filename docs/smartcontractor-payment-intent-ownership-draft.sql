-- SmartContractor payment intent ownership draft.
-- Date: 2026-05-04
--
-- IMPORTANT:
-- Local draft only. Do not run live until reviewed with the strict RLS package.
--
-- Why:
-- payment_intents currently has text `reference_id` and `payer_role`.
-- That is not strong enough for safe row-level security.
-- This draft adds typed ownership columns so each payment can be tied to a real
-- homeowner, contractor, job, loan, project contract, or milestone.

begin;

alter table public.payment_intents
  add column if not exists payer_profile_id uuid references public.profiles(id) on delete set null,
  add column if not exists homeowner_id uuid references public.homeowners(id) on delete set null,
  add column if not exists contractor_id uuid references public.contractors(id) on delete set null,
  add column if not exists job_id uuid references public.jobs(id) on delete set null,
  add column if not exists loan_id uuid references public.contractor_loans(id) on delete set null,
  add column if not exists project_contract_id uuid references public.project_contracts(id) on delete set null,
  add column if not exists milestone_id uuid references public.milestones(id) on delete set null;

create index if not exists payment_intents_payer_profile_id_idx
on public.payment_intents (payer_profile_id);

create index if not exists payment_intents_homeowner_id_idx
on public.payment_intents (homeowner_id);

create index if not exists payment_intents_contractor_id_idx
on public.payment_intents (contractor_id);

create index if not exists payment_intents_job_id_idx
on public.payment_intents (job_id);

create index if not exists payment_intents_loan_id_idx
on public.payment_intents (loan_id);

create index if not exists payment_intents_project_contract_id_idx
on public.payment_intents (project_contract_id);

create index if not exists payment_intents_milestone_id_idx
on public.payment_intents (milestone_id);

comment on column public.payment_intents.payer_profile_id is
  'Profile that initiated or owns visibility into this payment intent.';

comment on column public.payment_intents.homeowner_id is
  'Homeowner owner/participant for milestone, membership, lead, or SmartContractor payment visibility.';

comment on column public.payment_intents.contractor_id is
  'Contractor owner/participant for loan repayment, bid unlock, milestone payout, or token collateral visibility.';

comment on column public.payment_intents.job_id is
  'Optional typed job reference replacing unsafe generic reference_id usage.';

comment on column public.payment_intents.loan_id is
  'Optional typed contractor loan reference for loan repayment payment intents.';

comment on column public.payment_intents.project_contract_id is
  'Optional typed project contract reference for contract/milestone payments.';

comment on column public.payment_intents.milestone_id is
  'Optional typed milestone reference for progress payment intents.';

-- Replacement policy to use after typed ownership columns are populated.
drop policy if exists "payment_intents_select_none_from_browser" on public.payment_intents;
drop policy if exists "payment_intents_select_participants" on public.payment_intents;

create policy "payment_intents_select_participants"
on public.payment_intents for select
to authenticated
using (
  payer_profile_id = (select private.current_profile_id())
  or homeowner_id = (select private.current_homeowner_id())
  or contractor_id = (select private.current_contractor_id())
  or exists (
    select 1
    from public.jobs j
    where j.id = payment_intents.job_id
      and (
        j.homeowner_id = (select private.current_homeowner_id())
        or j.awarded_contractor_id = (select private.current_contractor_id())
      )
  )
  or exists (
    select 1
    from public.contractor_loans l
    where l.id = payment_intents.loan_id
      and l.contractor_id = (select private.current_contractor_id())
  )
  or exists (
    select 1
    from public.project_contracts pc
    where pc.id = payment_intents.project_contract_id
      and (
        pc.homeowner_id = (select private.current_homeowner_id())
        or pc.contractor_id = (select private.current_contractor_id())
      )
  )
  or exists (
    select 1
    from public.milestones m
    join public.project_contracts pc on pc.id = m.project_contract_id
    where m.id = payment_intents.milestone_id
      and (
        pc.homeowner_id = (select private.current_homeowner_id())
        or pc.contractor_id = (select private.current_contractor_id())
      )
  )
);

-- Browser writes should still stay closed.
-- Payment intent creation/update should happen through backend endpoints because
-- providers, webhooks, idempotency, platform fees, and audit logs must be enforced server-side.

-- Review query:
-- select id, provider, purpose, payer_role, reference_id,
--        payer_profile_id, homeowner_id, contractor_id, job_id, loan_id,
--        project_contract_id, milestone_id
-- from public.payment_intents
-- order by created_at desc;

commit;

