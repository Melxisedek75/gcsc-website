# SmartContractor Auth Smoke Tests

Date: 2026-05-04

Status: local harness ready. Real Supabase session checks are optional until founder approves Magic Link and test users.

## Goal

Give GCSC a repeatable auth safety check before strict RLS is enabled.

The harness verifies:

- auth endpoints exist;
- health endpoint advertises auth implementation features;
- anonymous calls to protected auth endpoints return `401`;
- role ownership guard code exists for profile/homeowner/contractor protected writes;
- optional real Supabase access-token checks can be run later without changing code.

## Command

From the backend folder:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
```

Full project check now includes this automatically:

```powershell
cd C:\gcsc\construction-ai
npm run check
```

## Safe Default Mode

By default, the script does not need passwords, secrets, or real user tokens.

It starts the Express app on a random local port and checks:

```text
GET /api/health
GET /api/auth/session-check
GET /api/auth/profile
POST /api/auth/magic-link with invalid email
```

No real email is sent in the default test.

## Optional Real Session Mode

After Magic Link is approved and a test user exists, set:

```powershell
$env:SMARTCONTRACTOR_SMOKE_ACCESS_TOKEN="PASTE_TEST_ACCESS_TOKEN"
```

Then run:

```powershell
npm run check:auth
```

Optional wrong-owner checks:

```powershell
$env:SMARTCONTRACTOR_SMOKE_FOREIGN_HOMEOWNER_ID="HOMEOWNER_UUID_NOT_OWNED_BY_TEST_USER"
$env:SMARTCONTRACTOR_SMOKE_FOREIGN_CONTRACTOR_ID="CONTRACTOR_UUID_NOT_OWNED_BY_TEST_USER"
npm run check:auth
```

Expected result:

- valid token returns `200` for session/profile;
- wrong `homeowner_id` job creation returns `403`;
- wrong `contractor_id` loan request returns `403`.

## Important Safety Rule

Do not paste tokens or passwords into chat.

When we run real token checks, the token should be set locally in PowerShell only. It should not be committed, emailed, or stored in docs.

## Public Launch Gate

Before public launch, this must pass in two modes:

1. default local mode;
2. real Supabase test-user mode.

Then strict RLS can be tested in staging.
