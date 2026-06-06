# SmartContractor Week 2 Auth/Admin Readiness Recheck

Status: LOCAL_RECHECK_ONLY.

This packet is not approval to run live SQL, not approval to insert or update `public.admin_memberships`, not approval to edit `profiles.auth_user_id`, not approval to apply strict RLS, not approval to change Supabase settings, not approval to deploy production, and not approval to enable real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, public beta, or public launch.

## Purpose

Recheck the Week 2 Auth/Admin path for clarity before the founder performs the real Magic Link login. This file turns the existing runbooks into one short evening reading order and report-back checklist.

## Source Documents

- `docs/smartcontractor-founder-auth-admin-activation-prep.md`
- `docs/smartcontractor-founder-auth-admin-live-decision-packet.md`
- `docs/smartcontractor-founder-auth-admin-live-request-draft.md`
- `docs/smartcontractor-founder-auth-admin-evidence-closeout.md`
- `docs/smartcontractor-founder-auth-evidence-template.md`
- `docs/smartcontractor-founder-auth-troubleshooting.md`
- `docs/smartcontractor-strict-admin-smoke-checklist.md`
- `docs/smartcontractor-strict-rls-live-apply-decision-packet.md`

## Current Safe State

| Area | Current state | Boundary |
| --- | --- | --- |
| Magic Link | Founder-controlled live login still required | Do not paste Magic Link URL, token, or session value into chat |
| Founder profile | Must be verified from the same browser after login | Do not edit `profiles.auth_user_id` from this recheck |
| Admin membership | Live activation still requires exact separate founder approval | Do not insert or update `public.admin_memberships` |
| Strict admin smoke | Prepared only after admin membership is active | Do not run live-token smoke from chat |
| Strict RLS | Separate later decision packet | Do not apply strict RLS from this recheck |

## Week 2 Auth/Admin Recheck Sequence

1. Start local backend from `C:\gcsc\construction-ai`.
2. Open `http://localhost:3001/smartcontractor.html`.
3. Use the Admin tab and Founder Auth Setup panel.
4. Send the Magic Link to the founder email from the local UI only.
5. Open the Magic Link in the same browser.
6. Click `Check Founder Auth Setup`.
7. Confirm the visible, non-secret state:

```text
Authenticated: yes/no
Profile linked: yes/no
Admin roles shown: none/founder/admin/unknown
Selected Auth user confirmed on founder screen: yes/no/not shown
Request ID visible: yes/no
```

8. If the state is not clean, use `docs/smartcontractor-founder-auth-troubleshooting.md`.
9. If the state is clean, move only to the founder report-back below.
10. Stop before any live admin membership, profile repair, strict RLS, deploy, public beta, payment, loan, escrow, stablecoin, token collateral, legal/provider, or production action.

## Founder Safe Report-Back

Founder may paste only this non-secret status block:

```text
Week 2 Auth/Admin recheck
Local URL opened: http://localhost:3001/smartcontractor.html
Magic Link email received: yes/no
Magic Link opened in same browser: yes/no
Check Founder Auth Setup clicked: yes/no
Authenticated: yes/no
Profile linked: yes/no
Admin roles shown: none/founder/admin/unknown
Selected Auth user confirmed on founder screen: yes/no/not shown
Request ID visible: yes/no
Evidence age minutes: [number only]
Visible non-secret issue, if any: [short text only]
I did not paste any Magic Link URL, Auth token, refresh token, service-role key, password, database URL, or raw .env value.
```

This report-back can support readiness classification only. It is not live approval.

## Decision State Matrix

| State | Use when | Allowed next local action |
| --- | --- | --- |
| READY_TO_REQUEST_LIVE_APPROVAL | Same-browser Magic Link works, profile is linked, selected founder user is confirmed, admin roles show `none`, request ID exists, and evidence age is under 30 minutes | Prepare or show the live admin activation approval request draft |
| NOT_READY | Magic Link, same-browser status, profile link, selected-user confirmation, request ID, or evidence age is unclear | Use troubleshooting and repeat the same-browser check |
| BLOCKED_FOR_LIVE_ACTION | The next step requires live Supabase write, service-role use, strict RLS apply, deploy/account change, public beta flip, real finance action, legal/provider decision, or production action | Stop for founder-controlled live/external/legal/money approval |

## Separate Approval Boundaries

The exact standalone phrase for future founder admin activation remains:

```text
I approve live founder admin activation for the verified founder Auth user.
```

That phrase only applies to the verified founder Auth user admin activation. It is not approval for strict RLS, production deploy, public beta, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, external accounts, destructive actions, or public launch.

The exact standalone phrase for a later strict RLS decision remains:

```text
I approve live strict RLS apply for the reviewed SmartContractor SQL draft only.
```

Strict RLS remains separate and only becomes reviewable after founder admin membership is active, strict admin smoke evidence is clean, rollback owner is named, and the founder explicitly approves that separate step.

## Codex Scope During This Recheck

Codex may:

- read these docs;
- validate the local recheck packet;
- summarize missing non-secret evidence;
- update local docs/backlog/context;
- run local validators;
- create a scoped commit.

Codex must not:

- request or store Magic Link URLs, Auth tokens, refresh tokens, service-role keys, database passwords, raw `.env` content, or screenshots containing secrets;
- infer the founder Auth user from email text alone;
- insert or update `public.admin_memberships`;
- edit `profiles.auth_user_id`;
- apply strict RLS;
- use live Supabase service-role access;
- change deployment settings;
- invite testers or flip public beta;
- enable or approve real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, FIO registration, legal/provider commitments, production, or public launch.

## Acceptance Check

This recheck is complete when the founder can see:

- the exact same-browser Magic Link evidence needed;
- the exact non-secret report-back block;
- the READY / NOT_READY / BLOCKED decision states;
- the separate admin activation and strict RLS approval phrases;
- the no-secret, no-live-Supabase, no-admin-membership, no-profile-repair, no-strict-RLS, no-deploy, no-public-beta, no-money, no-legal/provider, and no-production boundaries.

## Required Checks

Run from `C:\gcsc\construction-ai`:

```powershell
npm run check:founder-auth-admin-activation-prep
npm run check:founder-auth-admin-live-decision-packet
```
