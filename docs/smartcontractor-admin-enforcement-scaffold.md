# SmartContractor Admin Enforcement Scaffold

Date: 2026-05-04

Status: scaffold ready. Strict enforcement is not enabled by default.

## Goal

Prepare backend authorization for admin-only SmartContractor surfaces without breaking local MVP development.

Admin surfaces include:

- Risk Console;
- Launch Readiness;
- Supabase Boundary;
- future loan approvals;
- future payment/escrow release;
- verification overrides;
- treasury/legal review queues.

## Enforcement Modes

Environment variable:

```text
SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=draft
```

or:

```text
SMARTCONTRACTOR_ADMIN_ENFORCEMENT_MODE=strict
```

### Draft Mode

Default mode.

Purpose:

- keep local MVP admin screens usable;
- expose admin-access state for testing;
- avoid pretending production admin security is finished.

Behavior:

- `/api/admin/me` returns local draft access state;
- no real admin permission is granted;
- public launch remains blocked.

### Strict Mode

Future production/staging mode.

Purpose:

- require a valid Supabase bearer token;
- load active `admin_memberships`;
- check required permissions;
- block access when the role is missing.

Strict mode should be enabled only after:

1. Magic Link works with test users;
2. `SUPABASE_SERVICE_ROLE_KEY` is configured server-side only;
3. `admin_memberships` draft is applied in staging;
4. founder/admin user is added;
5. smoke tests pass.

## Backend Helpers

Implemented helpers:

```text
getAdminAccess(req, requiredPermissions)
requireAdminPermissions(requiredPermissions)
```

Current endpoint:

```http
GET /api/admin/me
```

This endpoint reports:

- enforcement mode;
- logged-in user when token exists;
- active admin roles;
- calculated permissions;
- whether draft bypass is active.

## Important Boundary

This scaffold does not approve loans, release money, or change legal status.

It prepares the gate that must exist before those actions are ever implemented.
