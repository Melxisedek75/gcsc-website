# SmartContractor Founder Auth/Admin Activation Prep

Status: INTERNAL_PREP_ONLY

Purpose: give the founder and Codex one exact, safe prep packet for the first real founder identity path. This packet is not approval to run live SQL, not approval to assign an admin role, not approval to apply strict RLS, not approval to deploy production, and not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Current Scope

This prep packet combines the existing local-only Founder Auth documents into one evening sequence:

- `docs/smartcontractor-founder-tonight-checklist.md`
- `docs/smartcontractor-founder-auth-troubleshooting.md`
- `docs/smartcontractor-founder-auth-evidence-template.md`
- `docs/smartcontractor-founder-admin-activation-runbook.md`
- `docs/smartcontractor-strict-admin-smoke-checklist.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `docs/smartcontractor-strict-rls-review.md`

Codex can prepare this packet, run local validators, and keep the next-step order clear. Codex must stop before live Supabase writes, external account changes, secrets, production deploy settings, real-money actions, or legal/financial decisions.

## Founder Evening Sequence

The founder-present sequence is:

1. Start the local backend from `C:\gcsc\construction-ai`.
2. Open the local SmartContractor MVP at `http://localhost:3001/smartcontractor.html`.
3. Send the Supabase Magic Link to the founder email from the Admin tab.
4. Open the Magic Link in the same browser.
5. Click `Check Founder Auth Setup`.
6. Record only non-secret status in `docs/smartcontractor-founder-auth-evidence-template.md`.
7. Confirm whether the screen shows:
   - `Authenticated: yes`
   - `Profile linked: yes`
   - `Admin roles shown: none`
8. If ready, move to read-only verification.
9. If not ready, use `docs/smartcontractor-founder-auth-troubleshooting.md`.
10. Stop before any live founder role assignment unless the founder gives explicit live approval for the selected `auth_user_id`.

## Codex Internal Work Allowed

Standing-approved internal work:

- keep runbooks and evidence templates aligned;
- validate that the Founder Auth flow remains documented;
- prepare non-secret read-only verification fields;
- prepare strict admin smoke test order;
- prepare rollback wording;
- update backlog/context/audit records;
- commit and push scoped docs and validators after checks pass.

## Codex Must Stop Before

Codex must stop before:

- asking for or handling Supabase access tokens in chat;
- asking for service-role keys, private keys, database passwords, seed phrases, or raw `.env` content;
- applying live Supabase SQL;
- inserting or updating `public.admin_memberships`;
- linking or editing live `profiles.auth_user_id`;
- applying strict RLS;
- changing production deployment settings;
- touching external accounts;
- enabling real payments, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral.

## Ready State

The local screen should show:

```text
Authenticated: yes
Profile linked: yes
Admin roles shown: none
```

Meaning:

- the Magic Link session worked;
- the browser has a real Supabase Auth session;
- one SmartContractor profile is linked to that user;
- no founder role has been activated yet;
- live founder role activation still needs explicit approval for the selected `auth_user_id`.

## Not Ready States

If `Authenticated: no`:

- do not run live SQL;
- check backend URL, Supabase Auth settings, Magic Link expiry, and same-browser opening.

If `Profile linked: no`:

- do not manually edit live rows;
- review profile ownership state;
- prepare the safest linking step separately.

If `Admin roles shown: founder`:

- do not insert another founder row;
- run read-only membership verification;
- proceed to strict admin smoke prep only after confirming the row belongs to the intended founder.

## Read-Only Verification Fields

When founder says `Founder Auth Setup ready`, Codex may ask for or record only non-secret summary fields:

```text
Founder Auth Setup ready: yes/no
Founder email confirmed by founder: yes/no
Auth user count for founder email: [number only]
Linked profile count: [number only]
Active founder membership count: [number only]
Visible admin role status: none/founder/problem
Read-only verification result: ready/needs-fix/blocked
```

Codex must not request raw tokens, Magic Link URLs, service-role keys, or full database rows in chat.

## Same-Browser Session Freshness Boundary

Same-browser session freshness is required for any founder Auth/Admin live approval request.

Use a fresh local `Check Founder Auth Setup` result from the same browser before any live approval request.

Do not rely on stale screenshots, forwarded Magic Link tabs, copied session URLs, browser profiles from another device, or old request IDs.

If the browser, device, email tab, selected user, or request ID changes, the state returns to NOT_READY until the founder repeats the same-browser check.

Record only non-secret freshness evidence: check time, local URL, visible ready/not-ready state, selected-user confirmation, and request ID presence.

## Founder Evening Activation Decision Gate

FOUNDER_EVENING_AUTH_DECISION_GATE is the founder-present internal Auth/Admin readiness decision before any future live admin activation request.

Use `Ready/Review/Hold` only for internal readiness:

- `Ready`: same-browser Magic Link is fresh, Founder Auth Setup is current, selected user is founder-confirmed, profile is linked, visible admin role state is understood, and the next action is still only a written live approval request.
- `Review`: one evidence, selected-user, profile link, role state, request ID, browser freshness, owner, or rollback question needs a named owner before a live approval request can be drafted.
- `Hold`: any secret, unclear user, stale browser session, missing profile link, unexpected admin role, live SQL, strict RLS, deploy, money, legal/provider, or public-launch question is unresolved.

For each `Ready/Review/Hold` line, record same-browser check time, selected-user confirmation, visible admin role state, request ID presence, evidence owner, rollback owner, and blocked next action.

No live Supabase SQL, admin_memberships insert or update, strict RLS apply, production deploy, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal decision, provider commitment, or public launch is approved by this gate.

## Live Approval Boundary

The phrase `Founder Auth Setup ready` is not live approval to insert a founder role.

A separate live approval must name the selected `auth_user_id` or confirm that the displayed selected `auth_user_id` is correct. Until then:

- `public.admin_memberships` remains unchanged by Codex;
- strict RLS remains unapplied;
- production admin enforcement remains blocked;
- public beta remains demo-only.

## Post-Activation Prep

After a future live founder activation is completed by approved owner action, the next local checks are:

```powershell
cd C:\gcsc\construction-ai
npm run check:auth
npm run check:strict-gates
npm run check:strict-admin-smoke
```

Optional real-token checks must use local environment variables only and must remove the token from the shell after use. Do not paste the token into chat.

## Acceptance Check

This prep packet is acceptable when:

- it links the existing Founder Auth docs;
- it keeps the exact founder evening sequence clear;
- it separates internal prep from live approval;
- it blocks secrets, live Supabase writes, strict RLS, production deployment, and real-money features;
- it points to local checks only.

## Required Checks

- `npm run check:founder-auth-admin-activation-prep`
- `npm run check:founder-tonight`
- `npm run check:founder-auth-troubleshooting`
- `npm run check:founder-auth-evidence`
- `npm run check:founder-admin-runbook`
- `npm run check:strict-admin-smoke`
- `npm run check:real-status-audit`
- `npm run check`
