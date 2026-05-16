# SmartContractor Founder Auth/Admin Live Request Draft

Status: INTERNAL_REQUEST_DRAFT_ONLY

This draft is not approval to run live SQL, not approval to assign a founder/admin role, not approval to apply strict RLS, not approval to change Supabase settings, not approval to deploy production, and not approval to enable real payments, real loans, real escrow, real repayment routing, stablecoin settlement, or token collateral.

## Purpose

Give Codex and the founder one safe message draft for the narrow moment after the local Founder Auth/Admin live decision packet reaches READY_TO_REQUEST_LIVE_APPROVAL. This keeps the approval request separate, current, evidence-based, and limited to the verified founder Auth user.

## Required Current Evidence

Do not use this draft unless all current-thread evidence is present:

- READY_TO_REQUEST_LIVE_APPROVAL;
- report_back_recorded_at;
- local_check_time;
- selected_user_confirmed_at;
- request_id_present;
- evidence_age_minutes;
- Authenticated: yes;
- Profile linked: yes;
- Admin roles shown: none;
- Selected Auth user confirmed on founder screen: yes.

If evidence_age_minutes is more than 30, the request draft returns to NOT_READY and the founder must repeat the same-browser Founder Auth Setup check.

## Request Draft Template

Use this exact request format when current evidence is fresh and complete:

```text
Founder Auth/Admin live request draft

Current local evidence status: READY_TO_REQUEST_LIVE_APPROVAL
Evidence age: [number] minutes
Local check time: [time]
Request ID present: yes/no
Selected Auth user confirmed on founder screen: yes
Authenticated: yes
Profile linked: yes
Admin roles shown: none

To approve only the verified founder Auth user admin activation, reply with this exact standalone phrase:

I approve live founder admin activation for the verified founder Auth user.

This approval is only for preparing and executing the founder admin membership activation request for the verified founder Auth user.

This approval is not approval for strict RLS, production deploy, payment/provider setup, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal/provider commitments, public launch, or destructive action.
```

Do not bundle this request with any other live, external, legal, money, deploy, RLS, payment, loan, escrow, stablecoin, token collateral, provider, public launch, or destructive action request.

## Allowed Codex Scope After Approval

After the exact approval phrase appears as a clean standalone founder message and current evidence is still fresh:

- Codex may prepare the final SQL/request draft from docs/smartcontractor-founder-admin-activation-runbook.md;
- Codex may run local validators and read-only checks;
- Codex may update docs/backlog/context/audit with the approval-request status;
- Codex may commit and push scoped local files after checks pass.

Codex must stop before asking for or handling service-role keys, tokens, passwords, Magic Link URLs, raw .env values, or direct Supabase dashboard access in chat.

## Blocked Scope

Strict RLS stays separate.

Production deploy stays separate.

Payment/provider setup stays separate.

Real loan, escrow, repayment routing, stablecoin settlement, and token collateral stay separate.

Legal/provider commitments stay separate.

Public launch stays separate.

Any approval message that includes extra scope becomes BLOCKED_FOR_LIVE_ACTION and must be split into separate founder-controlled decisions.

## Recheck Before Use

Before using the request draft, re-run or confirm:

- same browser is still being used;
- selected Auth user is still shown and founder-confirmed;
- no Magic Link URL, token, service-role key, password, raw .env value, or private customer data was pasted into chat;
- the founder understands this is a live Supabase admin membership activation request only;
- no strict RLS, deploy, public launch, payment, loan, escrow, stablecoin, token collateral, legal, provider, or destructive scope is included.

## Required Checks

```powershell
npm run check:founder-auth-admin-live-request-draft
npm run check:founder-auth-admin-live-decision-packet
npm run check:founder-auth-admin-activation-prep
npm run check:founder-admin-runbook
npm run check:real-status-audit
npm run check
```
