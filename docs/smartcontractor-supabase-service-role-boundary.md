# SmartContractor Supabase Service-Role Boundary

Date: 2026-05-04

Status: backend boundary scaffold done. Secret value is not stored in docs and must never be pasted into chat.

## Goal

Separate Supabase usage into two clear lanes:

| Lane | Client | Key | Used For | Browser Safe |
|------|--------|-----|----------|--------------|
| Auth lane | `supabaseAuth` | `SUPABASE_PUBLISHABLE_KEY` | Magic Link and access-token verification | Yes |
| Trusted backend lane | `supabaseAdmin` | `SUPABASE_SERVICE_ROLE_KEY` | Server-side database writes and admin/system reads | No |

## Current Backend Behavior

The backend now creates:

```text
supabaseAuth  = publishable client
supabaseAdmin = service-role client, only if SUPABASE_SERVICE_ROLE_KEY is configured
supabase      = supabaseAdmin first, then publishable demo fallback
```

Auth endpoints use `supabaseAuth`:

```text
POST /api/auth/magic-link
GET /api/auth/session-check
GET /api/auth/profile
```

Database endpoints use `supabase`, which prefers `supabaseAdmin` when available.

## Safe Status Endpoint

```http
GET /api/admin/supabase-boundary
```

Returns only safe status values:

- auth client configured/missing;
- database client configured/missing;
- database client mode;
- service-role configured/missing;
- safe next steps.

It never returns secret values.

## Public Launch Rule

Public launch remains blocked when:

```text
SUPABASE_SERVICE_ROLE_KEY is missing or placeholder
```

Local demo may still run with publishable fallback, but that is not production-safe.

## Founder Step Later

When we are ready:

1. Open Supabase dashboard.
2. Copy the service-role key from project API settings.
3. Put it only into backend/deployment environment variables.
4. Do not paste it into chat.
5. Run:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
```

## Why This Matters

The service-role key bypasses RLS. If it leaks to frontend code, a malicious user could access or change data they should never touch.

So the rule is simple:

```text
service-role key lives only on the backend.
```
