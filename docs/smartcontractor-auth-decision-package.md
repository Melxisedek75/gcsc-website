# SmartContractor Auth Decision Package

Date: 2026-05-04

## Decision Needed

Before public launch, the founder must choose the first login method:

```text
Recommended: Magic Link
Alternative: Email + Password
```

This document does not apply RLS and does not make the app public. It prepares the founder decision and records the safe MVP implementation scaffold.

## Recommendation

Use **Supabase Magic Link** for the first public MVP.

Why:

- easiest for homeowners and contractors;
- no password reset process needed on day one;
- lower leaked-password risk;
- works well for browser, PWA, Android wrapper, and iPhone wrapper;
- lets GCSC bind each profile to `auth.users.id`.

## Magic Link Tradeoffs

- user must have access to email;
- email deliverability must be monitored;
- frequent contractor users may later want password login or passkeys.

## Password Login Tradeoffs

Password login can be added later.

It needs:

- password reset;
- support process;
- account recovery;
- more user education;
- stronger abuse monitoring.

## Founder Action

Approve one value:

```text
SMARTCONTRACTOR_AUTH_MODE=magic_link
```

or:

```text
SMARTCONTRACTOR_AUTH_MODE=password
```

Recommended answer:

```text
magic_link
```

## Implementation Checklist

1. Add frontend login/logout/session state. DONE.
2. Add Magic Link request endpoint. DONE.
3. Add Express middleware to verify Supabase access tokens. DONE.
4. Use publishable Supabase key for browser-started auth only. REVIEW.
5. Bind `profiles.auth_user_id` to `auth.users.id`. BACKEND DONE / DATABASE REVIEW.
6. Add backend role ownership guards. DONE.
7. Move privileged writes behind server-side authorization. REVIEW.
8. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. REVIEW.
9. Run anonymous, homeowner, contractor, and admin/system smoke tests. REVIEW.
10. Apply strict RLS only after smoke tests pass. REVIEW.

## Auth Implementation Scaffold

Backend endpoints:

```http
POST /api/auth/magic-link
GET /api/auth/session-check
GET /api/auth/profile
```

`POST /api/auth/magic-link`:

- validates the email address;
- validates the redirect URL against localhost, `xprnet.org`, `www.xprnet.org`, `PUBLIC_SITE_URL`, or `ALLOWED_AUTH_REDIRECT_ORIGINS`;
- sends a Supabase Magic Link only when `SMARTCONTRACTOR_AUTH_MODE=magic_link`;
- writes an audit event with a masked email hint only.

`GET /api/auth/session-check`:

- requires `Authorization: Bearer ACCESS_TOKEN`;
- verifies the token with Supabase Auth;
- returns the authenticated user id, email, and role.

`GET /api/auth/profile`:

- requires `Authorization: Bearer ACCESS_TOKEN`;
- finds `profiles.auth_user_id = auth.users.id`;
- returns the linked SmartContractor profile plus homeowner/contractor role record when present;
- returns a safe “not linked yet” message when the user has no SmartContractor profile.

Frontend scaffold:

- Admin panel has Magic Link email input;
- user can request a Magic Link;
- browser captures `access_token` from the returned URL hash;
- user can check session, check linked profile, or clear local token;
- token is stored only in local browser storage for MVP testing.

Database draft:

```text
C:\gcsc\docs\smartcontractor-profile-ownership-draft.sql
```

This draft adds `profiles.auth_user_id`, a unique partial index, and a review query. It is not applied live.

## Public Launch Blockers

Public launch is blocked until:

- auth mode is approved;
- session verification exists;
- profile ownership is bound;
- strict RLS is applied and tested;
- demo endpoints cannot create other users' data.

## Safe Current State

Current safe state:

- Auth decision endpoint exists;
- Auth decision UI exists inside Admin Console;
- Magic Link request endpoint exists;
- Session-check endpoint exists;
- Profile ownership lookup endpoint exists;
- Frontend auth panel exists;
- Backend profile creation binds `auth_user_id` when a valid Supabase bearer token is present;
- `profiles.auth_user_id` database draft exists;
- Role ownership guards exist for authenticated user-owned writes;
- Auth/RLS plan exists;
- RLS SQL exists as draft only;
- no live auth or RLS changes were applied.
