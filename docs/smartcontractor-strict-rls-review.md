# SmartContractor Strict RLS Review

Date: 2026-05-04

## Status

Prepared locally only. Nothing in live Supabase was changed.

## Why This Exists

The live Supabase project has RLS enabled on the SmartContractor tables, but many current policies are development policies with broad `true` access. That is acceptable for early local/demo work, but not acceptable for public launch, real users, payments, loans, disputes, or verified contractor records.

## Live Audit Summary

Project:

- Supabase project: `smartcontractor-gcsc`
- Project ref: `uhixuyurxsrxayhghjzm`
- Status at last connector check: active/healthy

Security finding:

- RLS is enabled on the public SmartContractor tables.
- Many policies are still permissive development policies.
- Examples include public read/insert/update policies for profiles, homeowners, contractors, jobs, bids, loans, payments, disputes, evidence, reviews, verification, token collateral, and audit/payment ledgers.

Performance finding:

- Missing FK index for `project_contracts.accepted_bid_id`.
- Missing FK index for `token_collateral_locks.price_snapshot_id`.
- Unused-index cleanup should wait because the project still has small demo data and schema is actively changing.

## Prepared File

`docs/smartcontractor-strict-rls-replacement-draft.sql`

This draft:

- drops the known permissive development policies;
- keeps RLS enabled on all SmartContractor public tables;
- recreates owner/participant policies for profiles, homeowners, contractors, jobs, bids, loans, disputes, evidence, reviews, project contracts, milestones, ratings, verification checks, and token collateral;
- keeps audit events, payment events, verification provider events, and token price snapshots backend-only;
- blocks direct browser reads of payment intents until payer ownership columns are added;
- adds the two missing foreign-key indexes reported by Supabase advisors;
- includes post-apply verification queries.

## Important Design Choice

Payment intents are currently blocked from direct browser reads in the strict draft.

Reason: the current `payment_intents` table has `payer_role` and `reference_id`, but it does not yet have strong typed ownership columns such as:

- `payer_profile_id`;
- `homeowner_id`;
- `contractor_id`;
- `job_id`;
- `loan_id`;
- `project_contract_id`;
- `milestone_id`.

Until those exist, a broad authenticated select policy could leak payment rows between users. The safer MVP path is to read payment state through backend endpoints that verify ownership.

## Before Applying Live

Do not apply this SQL until these are ready:

1. Supabase Auth Magic Link works with real test users.
2. `profiles.auth_user_id` is linked for founder, homeowner test user, and contractor test user.
3. `admin_memberships` has at least the founder admin role.
4. Backend has server-only service-role key configured in deployment environment, not frontend.
5. Local smoke tests pass in draft mode.
6. Strict-mode smoke tests pass with real Supabase access tokens.
7. Founder approves the exact SQL.

## After Applying Live

Run:

1. Supabase security advisors.
2. Supabase performance advisors.
3. Query for remaining `qual = 'true'` or `with_check = 'true'` policies.
4. Test anonymous user cannot read protected data.
5. Test homeowner can read only own homeowner/project records.
6. Test contractor can read own bids/loans/disputes and open jobs.
7. Test backend/admin endpoints still work through service role.

## Next Engineering Step

Add typed ownership columns to `payment_intents` so payment status can safely be shown to the correct homeowner or contractor through RLS, not only through backend-owned reads.

