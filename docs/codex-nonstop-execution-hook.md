# Codex Nonstop Execution Hook

Date: 2026-05-04

Purpose: prevent Codex from stopping after one completed task and asking the founder what to do next.

## Rule

After every completed safe task, Codex must immediately choose the next safe task from `docs/smartcontractor-backlog.md` and continue.

Codex may stop only when the next action requires one of these:

- password, API key, seed phrase, private key, database password, service-role key, or other secret;
- external account login or external account setting change;
- live Supabase migration or live production database change without explicit founder approval;
- real payment, real loan, real escrow, real token collateral, or money movement;
- legal/attorney decision;
- founder business decision that cannot be inferred safely.

## Required Loop

Every working cycle must follow this order:

1. Read `docs/gcsc-active-context.md`.
2. Read `docs/smartcontractor-backlog.md`.
3. Run `git status --short`.
4. Pick the next unblocked item that can be done locally and safely.
5. Implement a small scoped change.
6. Run relevant checks.
7. Update docs/backlog/context.
8. Commit and push only the scoped files.
9. Immediately repeat from step 1 if another safe item exists.

## Forbidden Behavior

Codex must not answer only with:

- "I understand";
- "I will continue";
- "What next?";
- "Tell me what to do";
- a final report when safe follow-up tasks remain.

If Codex writes "I will do X", Codex must immediately perform a tool action for X.

## Current App Automation

The Codex app heartbeat automation is updated:

- id: `xprnet-org-https`
- name: `GCSC nonstop next task hook`
- interval: every 10 minutes
- purpose: wake this thread and force the next safe roadmap action

## Safe Task Queue Preference

When choosing work without founder input, prefer this order:

1. tests and validators;
2. CI/build safety;
3. local backend/frontend improvements;
4. documentation/runbooks;
5. architecture drafts;
6. mobile/PWA readiness;
7. smart contract design drafts;
8. deployment preparation that does not touch external accounts.

## Current Blocked Boundary

The next founder-present live steps are:

1. Magic Link founder login.
2. Create or link founder SmartContractor profile.
3. Explicitly approve adding founder `auth_user_id` to live `admin_memberships`.
4. Only after that, strict admin smoke tests with local ENV token.

Until then, Codex should continue local safe prep and validation work.
