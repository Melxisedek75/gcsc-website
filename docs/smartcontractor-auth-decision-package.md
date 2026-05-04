# SmartContractor Auth Decision Package

Date: 2026-05-04

## Decision Needed

Before public launch, the founder must choose the first login method:

```text
Recommended: Magic Link
Alternative: Email + Password
```

This document does not enable Supabase Auth and does not apply RLS. It prepares the decision and the implementation path.

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

1. Add frontend login/logout/session state.
2. Use Supabase Auth client in browser with publishable key only.
3. Bind `profiles.auth_user_id` to `auth.users.id`.
4. Add Express middleware to verify Supabase access tokens.
5. Move privileged writes behind server-side authorization.
6. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
7. Run anonymous, homeowner, contractor, and admin/system smoke tests.
8. Apply strict RLS only after smoke tests pass.

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
- Auth/RLS plan exists;
- RLS SQL exists as draft only;
- no live auth or RLS changes were applied.

