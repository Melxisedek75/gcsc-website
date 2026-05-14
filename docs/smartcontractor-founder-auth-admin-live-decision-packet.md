# SmartContractor Founder Auth/Admin Live Decision Packet

Status: INTERNAL_LIVE_DECISION_PACKET_ONLY. This is not approval to run live SQL, not approval to assign a founder/admin role, not approval to apply strict RLS, not approval to change Supabase settings, not approval to deploy production, and not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

Purpose: give the founder one clear evening decision packet for the first real Founder Auth/Admin activation path. This packet turns the existing runbooks into a simple decision sequence so the founder knows what to check, what Codex can verify locally, what evidence is safe to record, and exactly where Codex must stop before any live action.

## Source Documents

Use these documents as the current source set:

- `docs/smartcontractor-founder-auth-admin-activation-prep.md`
- `docs/smartcontractor-founder-admin-activation-runbook.md`
- `docs/smartcontractor-founder-auth-evidence-template.md`
- `docs/smartcontractor-founder-auth-troubleshooting.md`
- `docs/smartcontractor-strict-admin-smoke-checklist.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `docs/smartcontractor-strict-rls-review.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/gcsc-daily-work-mode-hook.md`

## Decision Goal

The goal is to reach one of three safe states:

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| READY_TO_REQUEST_LIVE_APPROVAL | Magic Link works, profile is linked, no active admin role exists yet, and non-secret evidence is recorded | Founder may explicitly approve the live admin membership insert in a separate message |
| NOT_READY | Magic Link, browser session, profile link, or local backend evidence is incomplete | Use troubleshooting and do not request live approval |
| BLOCKED_FOR_LIVE_ACTION | The next step requires Supabase write access, service-role configuration, production deploy settings, or external account changes | Stop and wait for explicit founder-controlled live action |

## Founder Screen Checklist

The founder should only need to check the local SmartContractor screen:

1. Open PowerShell.
2. Run from `C:\gcsc\construction-ai`:

```powershell
npm start
```

3. Open:

```text
http://localhost:3001/smartcontractor.html
```

4. Open the `Admin` tab.
5. Use Founder Auth Setup.
6. Send Magic Link to the founder email.
7. Open the Magic Link in the same browser.
8. Click `Check Founder Auth Setup`.
9. Confirm only these visible statuses:

```text
Authenticated: yes
Profile linked: yes
Admin roles shown: none
```

10. Record safe evidence in `docs/smartcontractor-founder-auth-evidence-template.md`.

## Safe Evidence To Record

Allowed evidence:

- local URL used;
- browser name;
- backend port;
- Magic Link email received: yes/no;
- Magic Link opened in same browser: yes/no;
- Check Founder Auth Setup clicked: yes/no;
- Authenticated: yes/no;
- Profile linked: yes/no;
- Admin roles shown: none/founder/admin/unknown;
- visible non-secret error text;
- founder confirmation message.

Never record:

- Magic Link URL;
- Supabase access token;
- refresh token;
- service-role key;
- database password;
- API key;
- seed phrase;
- private key;
- full raw `.env` content.

## Codex Read-Only Verification Scope

Codex may prepare and validate:

- local docs and validators;
- read-only verification checklist;
- expected ready/not-ready states;
- strict admin smoke test order;
- rollback checklist wording;
- backlog/context/audit updates;
- scoped commits and pushes after checks pass.

Codex may not autonomously:

- insert into `public.admin_memberships`;
- update `profiles.auth_user_id`;
- apply live Supabase SQL;
- apply strict RLS;
- change Supabase Auth redirect settings;
- change production deployment settings;
- request or handle service-role keys in chat;
- enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Live Approval Boundary

Standing approval covers internal prep only. It does not cover the live admin activation.

Before any live insert, Codex must have a separate founder message that clearly says:

```text
I approve live founder admin activation for the verified founder Auth user.
```

That approval is still not approval for strict RLS, production deploy, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, or legal/provider commitments.

## Ready State

Use READY_TO_REQUEST_LIVE_APPROVAL only when all are true:

- local backend is running;
- SmartContractor opens locally;
- Magic Link email was received;
- Magic Link opened in the same browser;
- Founder Auth Setup was checked;
- `Authenticated: yes`;
- `Profile linked: yes`;
- `Admin roles shown: none`;
- non-secret evidence template is filled;
- founder understands that the next step is a live Supabase admin membership write.

## Not Ready States

Use NOT_READY if any of these are true:

- local backend is not running;
- browser cannot open the app;
- Magic Link email did not arrive;
- Magic Link opened in another browser or device;
- `Authenticated: no`;
- `Profile linked: no`;
- admin role already appears unexpectedly;
- evidence template is blank or contains unsafe values;
- founder cannot identify the visible status confidently.

## Blocked For Live Action

Use BLOCKED_FOR_LIVE_ACTION when the next step requires:

- Supabase dashboard changes;
- service-role environment setup;
- direct database writes;
- production deployment settings;
- external account login;
- payment provider setup;
- legal/provider decision;
- public launch decision.

## Strict RLS Boundary

Founder admin activation is only the first identity step. Strict RLS remains separate.

Strict RLS can only be considered after:

- founder admin membership is active;
- `npm run check:strict-gates` passes;
- `npm run check:strict-admin-smoke` passes;
- founder/admin can access the admin surfaces in strict mode;
- rollback steps are ready;
- founder explicitly approves strict RLS separately.

## Required Checks

Before treating this packet as complete, run:

```powershell
npm run check:founder-auth-admin-live-decision-packet
npm run check:founder-auth-admin-activation-prep
npm run check:founder-admin-runbook
npm run check:founder-auth-evidence
npm run check:founder-auth-troubleshooting
npm run check:strict-admin-smoke
npm run check:auth
npm run check:strict-gates
npm run check:real-status-audit
npm run check
```

## Acceptance Check

This packet passes only when the founder can see the exact local Auth/Admin decision sequence, Codex has a clear read-only scope, safe evidence rules are explicit, the separate live approval phrase is defined, and all Supabase write, strict RLS, deploy, payment, loan, escrow, stablecoin, token collateral, legal, provider, and public-launch actions remain blocked until explicit separate approval.
