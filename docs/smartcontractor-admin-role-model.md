# SmartContractor Admin Role Model

Date: 2026-05-04

Status: draft ready. Not enforced in production yet.

## Goal

Separate founder/admin review work from normal homeowner and contractor accounts.

This matters because GCSC will handle sensitive workflows:

- starter loan review;
- payment exceptions;
- dispute and evidence review;
- contractor verification;
- token collateral review;
- legal review before real loans or escrow;
- treasury review before money movement.

## Backend Endpoint

```http
GET /api/admin/access-model
```

This endpoint returns the planned admin role model and protected surfaces.

It does not grant permissions and does not execute decisions.

## Roles

| Role | Purpose |
|------|---------|
| `founder` | Overall founder/admin control, can review all queues but cannot skip legal/payment/audit gates |
| `risk_reviewer` | Loan, dispute, collateral risk review |
| `compliance_reviewer` | License, insurance, identity, business verification review |
| `treasury_reviewer` | Payment exceptions, loan pool, collateral and treasury queue review |
| `legal_reviewer` | Loan terms, escrow terms, contract language review |
| `support` | User support notes and evidence requests, no money or secret access |

## Protected Surfaces

Before public launch, these must be role-gated:

- `/api/admin/risk-console`;
- `/api/admin/launch-readiness`;
- `/api/admin/supabase-boundary`;
- real loan approval;
- real payment/escrow release;
- verification override;
- provider setup review.

## Database Draft

```text
C:\gcsc\docs\smartcontractor-admin-role-model-draft.sql
```

The draft creates:

- `public.admin_memberships`;
- role/status checks;
- unique active role membership index;
- review query.

It is not applied live yet.

## Enforcement Rule

Admin permissions must be checked server-side.

The browser can show or hide UI, but it must never be trusted for admin authorization.

Backend enforcement scaffold:

```text
C:\gcsc\docs\smartcontractor-admin-enforcement-scaffold.md
```

The scaffold prepares `GET /api/admin/me`, `getAdminAccess(...)`, and `requireAdminPermissions(...)`. It defaults to draft mode for local MVP testing and must be switched to strict mode before public launch.

## Public Launch Gate

Public launch is blocked until:

1. founder/admin user is chosen;
2. admin role table is reviewed;
3. service-role boundary is configured server-side;
4. admin endpoints verify Supabase access token;
5. admin endpoints check role membership;
6. admin actions write audit events;
7. real loan/payment/legal actions remain blocked until legal review.
