# SmartContractor Founder Action Center

Date: 2026-05-04

Status: MVP scaffold ready.

## Goal

Give the founder one clear control surface for actions that Codex cannot safely finish alone.

These actions include:

- external account reconnection;
- server-side secret setup;
- Supabase Auth and RLS approval;
- admin role activation;
- legal review for loans, escrow, and token collateral;
- payment provider selection;
- deployment platform decision.

## Backend Endpoint

```http
GET /api/admin/founder-action-center
```

The endpoint returns:

- action id;
- phase;
- owner;
- status;
- reason;
- step-by-step owner action list;
- safe handling rule for each action.

## Frontend UI

The SmartContractor Admin workspace now includes:

```text
Founder Action Center
```

It shows:

- ready/review/blocked/missing summary;
- owner-only safety rules;
- external account actions;
- secrets actions;
- legal/payment actions;
- deployment actions.

## Safety Rules

Codex may prepare code, docs, scripts, and checklists.

Codex must not:

- receive passwords, API keys, service-role keys, private wallet keys, or recovery phrases in chat;
- apply live RLS, production migrations, real payment keys, or legal loan settings without founder confirmation;
- represent GCSC as a lender, bank, broker, escrow provider, or investment product without attorney review;
- activate real money movement from the MVP admin console.

## Current Blockers

1. Supabase connector token must be refreshed before Codex can inspect live project state through the connector.
2. Supabase service-role key must be configured only server-side.
3. Profile ownership and admin membership SQL must be applied in staging first.
4. Real loan and escrow language must be reviewed by an attorney.
5. First production backend host must be selected.

## Next Safe Step

Reconnect Supabase connector, then let Codex read project tables and advisors before any live schema change.
