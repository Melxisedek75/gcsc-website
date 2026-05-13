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

## Silent Background Mode

During heartbeat-driven autonomous work, Codex should minimize user-facing commentary to save founder time and tokens.

- Do not narrate routine file reads, task selection, edits, checks, staging, commits, or pushes.
- Use tool calls directly and keep progress notes silent unless there is a blocker, a safety boundary, a failed check that changes the plan, or a user explicitly asks for status.
- When reporting is requested, summarize what was completed, what was verified, what was committed/pushed, what remains blocked, and the next safe task.
- Keep mandatory heartbeat XML/final status concise.

## Current App Automation

The Codex app heartbeat automation is updated:

- id: `gcsc-nonstop-next-task-hook`
- name: `GCSC nonstop next task hook`
- interval: every 1 minute
- purpose: wake this thread and force the next safe roadmap action
- target thread must be the current GCSC/SmartContractor work thread, and the automation prompt must remain readable UTF-8, not mojibake/corrupted text.
- health check: `npm run check:automation-health` verifies the heartbeat and hourly worker TOML files stay active and pointed at `C:\gcsc`.

Important limitation: the Codex app heartbeat supports minute-based wakeups, not a reliable 30-second schedule. The practical rule is:

- heartbeat wakes the thread every 1 minute;
- once awake, Codex must continue the safe-task loop inside the same run instead of waiting for the next hour or asking "what next";
- after a scoped task is finished, Codex should immediately repeat the loop when feasible.

## Overnight Worker Automation

The heartbeat above is a chat wake-up hook. It is not the same as a guaranteed long-running worker.

For overnight autonomous progress, there is also a separate Codex cron automation:

- id: `gcsc-hourly-autonomous-builder`
- name: `GCSC hourly autonomous builder`
- interval: every 1 hour
- workspace: `C:\gcsc`
- purpose: run as a standalone local workspace job, pick one safe unblocked backlog item, implement, test, update docs, commit, and push

This hourly worker is a backup layer, not the main "keep going" mechanism. The main anti-stop mechanism is the 1-minute heartbeat plus the rule to keep looping during the same active run.

This cron worker must obey the same safety boundaries:

- no secrets;
- no external account changes;
- no live Supabase changes without explicit approval;
- no real payments, loans, escrow, or token collateral actions;
- no legal decisions.

This cron worker must also use silent worker mode:

- do not write progress chatter;
- create status notes only for blocked/review/live-risk states or requested reports;
- keep commits scoped.

If it finds only blocked/review/live-risk work, it should write a short status note under `docs/autonomous-status/` and commit/push that note.

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
