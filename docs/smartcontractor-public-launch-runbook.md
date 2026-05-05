# SmartContractor Public Launch Runbook

Date: 2026-05-04

Purpose: simple step-by-step launch checklist for moving SmartContractor from local/demo mode toward public beta without exposing secrets or enabling real-money risk too early.

## Phase 0: What Must Stay Off Until Reviewed

Do not enable these for the public until reviewed:

- real contractor loans;
- automatic loan approval;
- real escrow or stored-value claims;
- automatic token collateral liquidation;
- legal ownership transfer language;
- real payment provider production mode;
- live service-role key in frontend or chat.

## Phase 1: Founder-Only Setup

Founder actions:

1. Open Supabase project `smartcontractor-gcsc`.
2. Confirm project is healthy.
3. Confirm Supabase Auth email provider is enabled.
4. Add site URL and redirect URL for the deployed SmartContractor domain.
5. Create or sign in with founder Magic Link email.
6. Confirm founder profile exists in `profiles`.
7. Link founder `profiles.auth_user_id` to the Supabase Auth user ID.
8. Add founder row to `admin_memberships` after reviewing the admin role model SQL.

Codex actions after founder is present:

1. Verify project list through connector.
2. Verify tables and advisors.
3. Verify founder profile/admin membership through read-only SQL.
4. Prepare exact migration/apply plan.

## Phase 2: Strict RLS Review

Files to review:

- `docs/smartcontractor-strict-rls-review.md`
- `docs/smartcontractor-strict-rls-replacement-draft.sql`
- `docs/smartcontractor-payment-ownership-plan.md`
- `docs/smartcontractor-payment-intent-ownership-draft.sql`

Founder decision:

- approve applying to Supabase staging/live;
- request edits;
- keep demo mode until more testing.

Codex must not apply live SQL before the founder explicitly approves the exact SQL.

## Phase 3: Test Users

Create three test users:

1. founder/admin;
2. homeowner;
3. contractor.

Test each user:

- Magic Link login;
- profile creation;
- homeowner/contractor role creation;
- route access;
- blocked wrong-role access;
- job/bid/loan/dispute read/write behavior;
- payment-intent visibility after ownership columns are added.

## Phase 4: Environment Variables

Server-only deployment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMARTCONTRACTOR_AUTH_MODE=magic_link`
- `SMARTCONTRACTOR_ROUTE_PROTECTION=strict`
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict`

Payment provider variables remain disabled until provider setup is reviewed.

Never put `SUPABASE_SERVICE_ROLE_KEY` in:

- frontend JavaScript;
- GitHub public files;
- screenshots;
- chat messages;
- `.env.example` as a real value.

## Phase 5: Deployment Gate

Before public beta:

1. `npm run check` passes locally.
2. GitHub Actions pass.
3. Supabase security advisors have no critical launch blockers.
4. No public `true` RLS policies remain.
5. Anonymous users cannot read protected data.
6. Admin console is strict-mode protected.
7. Payment provider production mode is still off unless approved.
8. Loan/escrow/token collateral copy is marked as draft or reviewed by attorney.

Current database note:

- Supabase migration `20260505033416 add_missing_fk_indexes` was applied live to add indexes for `project_contracts.accepted_bid_id` and `token_collateral_locks.price_snapshot_id`.
- Remaining performance advisor notes are unused-index INFO items from low demo traffic; do not remove them until real query patterns are known.

## Phase 6: Public Beta Scope

Allowed for public beta:

- contractor/homeowner onboarding;
- demo jobs;
- bids;
- simulated starter loan requests;
- simulated milestone payments;
- disputes and evidence metadata;
- peer review workflow;
- admin review console;
- payment provider setup placeholders.

Not allowed yet:

- real lending;
- real escrow;
- irreversible on-chain settlement;
- automatic payment release;
- automatic collateral liquidation.

## Emergency Rollback

If strict mode breaks access:

1. Set deployment env `SMARTCONTRACTOR_ROUTE_PROTECTION=draft`.
2. Set deployment env `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=draft`.
3. Restart deployment.
4. Keep RLS strict if data is public-facing; fix app auth flow instead of reopening database policies.

If RLS blocks legitimate users:

1. Do not create broad `USING true` policies.
2. Check `profiles.auth_user_id`.
3. Check homeowner/contractor `profile_id`.
4. Check admin membership.
5. Add targeted owner/participant policy only after review.
