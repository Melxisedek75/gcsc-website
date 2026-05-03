---
name: smartcontractor-daily-build
description: Daily execution workflow for GCSC SmartContractor MVP. Use when the user says to start daily build, continue SmartContractor MVP, work the backlog, prepare daily status, or run the Codex operating system for GCSC.
---

# SmartContractor Daily Build

## Goal

Move SmartContractor forward every session with a small verified increment.

## Required Context

Start from:

```text
C:\gcsc
```

Read, in order:

1. `AGENTS.md`
2. `docs/codex-operating-system.md`
3. `docs/smartcontractor-backlog.md`
4. `docs/weekly-plan-2026-05-03.md`

## Daily Loop

1. Check `git status --short`.
2. Identify unrelated untracked or dirty files and avoid touching them.
3. Check backend health if relevant:

```powershell
Invoke-WebRequest -Uri "http://localhost:3002/api/health" -UseBasicParsing
```

4. Pick one primary task from `NOW`.
5. Pick one small support task if it helps the primary task.
6. Implement in the smallest useful slice.
7. Verify with the strongest cheap check available:
   - `node -c construction-ai/server.js`
   - API smoke test
   - browser test
   - Supabase advisor
   - mobile viewport check
8. Update docs if behavior or product logic changed.
9. Commit and push only scoped files.
10. Final response must include:
   - what changed;
   - where it changed;
   - what was tested;
   - what remains next.

## Priorities

Default priority order:

1. Clickable MVP flow.
2. Backend/API correctness.
3. Supabase data integrity and security.
4. Mobile usability.
5. Whitepaper/grant readiness.
6. Deployment.
7. Smart contracts.

## Founder-Action Boundary

Do not proceed without founder approval when a step requires:

- payment;
- login/password;
- production deploy;
- permanent external service adoption;
- legal agreement;
- destructive database or filesystem action;
- exposing secrets.

When founder action is needed, write exact step-by-step instructions for a beginner.

## Agent Delegation

Only use subagents when the founder explicitly asks for parallel agents.

Recommended split:

- Frontend: UI and responsive layout.
- Backend: API routes and Supabase integration.
- QA: browser/API testing.
- Docs: whitepaper, grant, demo script.
- Security: RLS, secrets, loan/legal risk.

Parent Codex integrates and verifies all results.

## Status Format

Use this concise format:

```text
Сегодня сделано:
- ...

Проверено:
- ...

Нужен ты:
- ...

Следующий шаг:
- ...
```

