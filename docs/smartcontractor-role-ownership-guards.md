# SmartContractor Role Ownership Guards

Date: 2026-05-04

Status: backend scaffold done; public launch still requires Supabase Auth smoke tests and strict RLS review.

## Goal

Prevent an authenticated user from creating records under another user's `profile_id`, `homeowner_id`, or `contractor_id`.

The MVP still allows anonymous demo flows so local testing does not break. The guard activates only when the request includes:

```http
Authorization: Bearer SUPABASE_ACCESS_TOKEN
```

## Current Guard Rule

If a bearer token is present:

```text
token -> Supabase auth.users.id -> profiles.auth_user_id -> role record
```

The backend blocks the request when the submitted id does not belong to the authenticated user.

## Protected Writes

The current backend guard covers:

- creating contractor records from `profile_id`;
- creating homeowner records from `profile_id`;
- creating jobs from `homeowner_id`;
- submitting bids from `contractor_id`;
- unlocking competitor bids from `contractor_id`;
- requesting contractor loans from `contractor_id`;
- recording loan repayments for loans owned by the contractor;
- creating token collateral locks from `contractor_id`;
- opening disputes as homeowner/contractor when authenticated;
- uploading dispute evidence from `uploaded_by_profile_id`;
- submitting peer reviews from `reviewer_contractor_id`;
- creating project contracts from `homeowner_id`.

## Demo Compatibility

If there is no bearer token:

- existing local demo flows keep working;
- demo seed scripts keep working;
- the endpoint does not pretend the user is authenticated.

This is intentional until Magic Link, profile ownership, RLS, and smoke tests are fully approved.

## Remaining Before Public Launch

1. Apply `profiles.auth_user_id` database draft after review.
2. Enable Magic Link in Supabase Auth.
3. Test homeowner session:
   - can create own profile;
   - can create own homeowner record;
   - can create own job;
   - cannot create job for another homeowner.
4. Test contractor session:
   - can create own profile;
   - can create own contractor record;
   - can submit own bid;
   - cannot request loan for another contractor.
5. Apply strict RLS in staging.
6. Repeat smoke tests with RLS enabled.

## Important Boundary

These guards are not a replacement for RLS. They are the backend safety layer that prepares the app for RLS.
