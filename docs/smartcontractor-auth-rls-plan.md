# SmartContractor Auth And RLS Plan

Date: 2026-05-03

Status: ready for founder approval before live Supabase changes.

## Recommendation

Use Supabase Auth with email magic link for the first public MVP.

Why magic link first:

- simplest for non-technical homeowners and contractors;
- no password reset support needed on day one;
- reduces leaked-password risk;
- works well for mobile PWA and later iOS/Android wrappers;
- lets us bind every SmartContractor profile to `auth.users.id`.

Use password login later when:

- contractors need frequent dashboard access;
- mobile apps have polished account recovery;
- fraud controls and support process are ready.

## Production Access Model

### Browser

The browser may use only:

- `SUPABASE_URL`;
- `SUPABASE_PUBLISHABLE_KEY`;
- authenticated user session token.

The browser must never receive:

- `SUPABASE_SERVICE_ROLE_KEY`;
- Metal Pay secret key;
- Stripe secret key;
- PayPal secret;
- private wallet keys.

### Backend

The Express backend should become the main trusted API layer.

Backend may use:

- `SUPABASE_SERVICE_ROLE_KEY`, server-side only;
- payment provider secret keys;
- webhook signature secrets;
- verification provider API keys.

Backend must:

- verify the user session before user-owned actions;
- write audit events for sensitive actions;
- reject requests where the logged-in profile does not match the requested homeowner or contractor ID.

## Identity Binding

`profiles.auth_user_id` is the owner link.

Required rule:

```text
auth.users.id = profiles.auth_user_id
```

Role records then connect through:

```text
profiles.id -> homeowners.profile_id
profiles.id -> contractors.profile_id
```

## RLS Policy Goals

### Public/Anonymous

Anonymous users should only be able to:

- read public/open job previews if we intentionally expose them;
- not create jobs, bids, loans, disputes, payments, or verification records.

### Authenticated Homeowner

Homeowner can:

- read and update own profile;
- read and update own homeowner record;
- create jobs for own homeowner record;
- read own jobs;
- read bids on own jobs;
- create disputes for own jobs;
- add evidence to own disputes;
- read milestones and contracts where they are the homeowner.

Homeowner cannot:

- see contractor private verification raw results;
- create contractor loans;
- alter payment provider events;
- alter audit events.

### Authenticated Contractor

Contractor can:

- read and update own profile;
- read and update own contractor record;
- read open jobs;
- create bids for own contractor record;
- read own bids;
- request loans for own contractor record;
- read own loans and repayments;
- create disputes where they are the contractor;
- add evidence to own disputes;
- submit peer reviews as their own contractor profile.

Contractor cannot:

- edit homeowner jobs they do not own;
- view competitor bid details without paid unlock logic;
- write payment webhook events;
- write audit events directly.

### Admin / System

Admin and system actions should go through the backend service role and audit ledger.

Do not rely on `user_metadata` for admin authorization. If admin JWT claims are used later, use `app_metadata`, not user-editable metadata.

## Tables That Should Be Backend-Only

These tables should not allow direct browser writes:

- `payment_events`;
- `verification_provider_events`;
- `audit_events`;
- `token_price_snapshots`;
- payment webhook updates;
- provider raw events.

Reason: they are system records, not normal user content.

## Required Backend Changes Before Applying Strict RLS

1. Add Supabase Auth endpoints or frontend auth client.
2. Add session verification middleware to Express.
3. Store `auth_user_id` when creating a profile. BACKEND DONE; database draft pending founder review.
4. Add backend role ownership guards for user-owned writes. DONE.
5. Stop using publishable-only Supabase client for privileged backend writes. BOUNDARY DONE; production secret still founder/deployment step.
6. Add admin enforcement helper for admin-only surfaces. DONE; strict mode remains blocked until real admin user and table setup.
7. Add `SUPABASE_SERVICE_ROLE_KEY` to backend environment only. BLOCKED until founder/deployment secret setup.
8. Keep all provider webhooks server-only.
9. Apply RLS policy SQL in staging first.
10. Run smoke tests with homeowner, contractor, admin, and anonymous sessions. HARNESS DONE for local/draft; real test-user mode pending founder-approved token.

## Founder Decision

Recommended decision for MVP:

```text
Use Supabase magic link first. Add password login later.
```

Founder needs to approve before we apply strict RLS to production because current demo endpoints still use backend-created demo records.

## Profile Ownership Binding Draft

Backend scaffold is prepared:

- valid Supabase bearer token is verified by Express;
- `POST /api/smartcontractor/profiles` stores `profiles.auth_user_id` when a token is present;
- `GET /api/auth/profile` returns the linked profile, homeowner record, and contractor record for the authenticated user.

Database draft:

```text
C:\gcsc\docs\smartcontractor-profile-ownership-draft.sql
```

This draft adds the `profiles.auth_user_id` column, unique partial index, and review query. It must be reviewed before applying to Supabase.

## Role Ownership Guards

Backend guard scaffold is prepared:

- authenticated `profile_id` writes must match `profiles.auth_user_id`;
- authenticated `homeowner_id` writes must belong to the logged-in profile;
- authenticated `contractor_id` writes must belong to the logged-in profile;
- authenticated evidence and peer-review writes verify profile/contractor ownership;
- anonymous demo flows still work until strict Auth/RLS is enabled.

Detailed document:

```text
C:\gcsc\docs\smartcontractor-role-ownership-guards.md
```

## Auth Smoke-Test Harness

Local harness:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
```

The harness checks anonymous protected-route behavior, health feature flags, static role-guard coverage, and optional real Supabase access-token behavior.

Detailed document:

```text
C:\gcsc\docs\smartcontractor-auth-smoke-tests.md
```

## Supabase Service-Role Boundary

Backend boundary scaffold is prepared:

- `supabaseAuth` uses the publishable key for Magic Link and token verification;
- `supabaseAdmin` uses `SUPABASE_SERVICE_ROLE_KEY` only when configured server-side;
- database operations prefer `supabaseAdmin`;
- local demo can fall back to publishable mode, but public launch remains blocked until service role is configured server-side.

Safe status endpoint:

```http
GET /api/admin/supabase-boundary
```

Detailed document:

```text
C:\gcsc\docs\smartcontractor-supabase-service-role-boundary.md
```

## Admin Role Model

Admin/founder role model is drafted for the sensitive review surfaces:

- founder;
- risk reviewer;
- compliance reviewer;
- treasury reviewer;
- legal reviewer;
- support.

Safe status endpoint:

```http
GET /api/admin/access-model
```

Detailed documents:

```text
C:\gcsc\docs\smartcontractor-admin-role-model.md
C:\gcsc\docs\smartcontractor-admin-role-model-draft.sql
```

This is not enforced in production yet. Public admin endpoints must be protected with Supabase Auth, service-role backend checks, role membership checks, and audit events before launch.

## Admin Enforcement Scaffold

Backend admin enforcement scaffold is prepared:

- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=draft` keeps local MVP admin screens usable;
- `SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict` requires a valid bearer token and active admin membership;
- `GET /api/admin/me` reports current access state without exposing secrets;
- `requireAdminPermissions(...)` is ready for future admin-only endpoints.

Detailed document:

```text
C:\gcsc\docs\smartcontractor-admin-enforcement-scaffold.md
```

Strict mode must not be used for public launch until a founder/admin Supabase user exists, `admin_memberships` is applied in staging, and real admin smoke tests pass.
