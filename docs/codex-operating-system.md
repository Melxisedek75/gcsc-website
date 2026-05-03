# Codex Operating System for GCSC

Date: 2026-05-03

## Goal

Create a repeatable work system so GCSC and SmartContractor move every day without restarting from zero.

This operating system answers five questions:

1. What is the next most important work?
2. What can Codex do without the founder?
3. What requires founder action?
4. What should be delegated to agents?
5. What should be checked before code is committed or deployed?

## Source Of Truth

Project root:

```text
C:\gcsc
```

Primary files:

- `AGENTS.md` - project rules for Codex and other agents.
- `docs/smartcontractor-backlog.md` - product and engineering backlog.
- `docs/weekly-plan-2026-05-03.md` - current weekly execution plan.
- `docs/hooks-and-automation-plan.md` - planned hooks, checks, and recurring automations.
- `.claude/skills/smartcontractor-daily-build/SKILL.md` - daily build workflow.

## Work Modes

### Mode 1: Founder Present

Use when the founder is available to click, log in, approve, pay, or make product decisions.

Best tasks:

- Namecheap, Vercel, Google, Microsoft, Apple, Google Play, and wallet actions.
- Legal/business decisions.
- Product priority decisions.
- Reviewing UX in the browser.
- Approving external tools or paid services.

### Mode 2: Founder Away

Use when Codex should continue alone.

Codex can do:

- read project files;
- update docs;
- write frontend/backend code;
- run local backend;
- run syntax checks;
- test API routes;
- use Supabase MCP;
- inspect Git state;
- prepare commits;
- push safe scoped changes;
- prepare status email text.

Codex must not do without approval:

- expose secrets;
- pay for services;
- change domain ownership;
- delete project folders;
- sign legal documents;
- move production data destructively;
- add a permanent paid external dependency.

### Mode 3: Parallel Agent Work

Use only when the founder explicitly says:

```text
Запусти агентов параллельно
```

Recommended agent split:

| Agent | Work |
|------|------|
| Frontend worker | SmartContractor UI screens and responsive layout |
| Backend worker | Express routes, Supabase integration, validation |
| QA worker | Browser/API tests, regression checklist |
| Docs worker | Whitepaper, grant docs, product docs |
| Security reviewer | RLS, secrets, API safety, loan/compliance risk |

Parent Codex remains responsible for integration, final review, and Git.

## Daily Build Loop

Run this loop every work session:

1. Read `AGENTS.md`.
2. Check `git status --short`.
3. Check backend health if it should be running.
4. Read `docs/smartcontractor-backlog.md`.
5. Pick one main task and one small support task.
6. Implement.
7. Verify with syntax/API/browser checks.
8. Update docs if behavior changed.
9. Commit and push scoped changes.
10. Send or prepare a short status summary.

## Decision Rules

- If a task moves MVP closer to a clickable demo, prioritize it.
- If a task reduces launch risk, prioritize it.
- If a task only makes the project prettier but not more testable, defer it.
- If a task needs paid services or passwords, prepare exact step-by-step instructions for the founder.
- If a new tool/update appears, follow Rule 5 in `AGENTS.md` before adopting it.

## MVP Definition

SmartContractor MVP is ready for first demos when this flow works:

```text
homeowner creates job
-> contractor sees open bid
-> contractor submits bid
-> contractor requests starter loan
-> platform calculates risk/credit tier
-> homeowner approves milestone
-> repayment route is shown
-> dispute can be opened
-> peer contractor review can be submitted
```

## Weekly Review

Every Sunday:

1. List completed work.
2. List blocked work.
3. Check GitHub state.
4. Check website/domain state.
5. Check Supabase advisors.
6. Update next weekly plan.
7. Send summary to `gcsc@xprnet.org` if email hook is available.

