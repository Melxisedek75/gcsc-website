---
name: swarm
description: GCSC agent swarm orchestrator. Fans out specialized sub-agents in parallel waves (audit → fix → review) across the website and SmartContractor v3 repos under the hybrid model. Run with «запусти рой» or «swarm».
allowed-tools: [Agent, Read, Write, Edit, Glob, Grep, Bash, TodoWrite]
---

# GCSC Agent Swarm

## Goal
Coordinate many specialized agents to move GCSC toward launch WITHOUT the founder babysitting each step. The orchestrator (you) is the ONLY writer to production unless an agent is explicitly a builder. Read-only agents report; you apply or dispatch fixes.

## The Swarm Roster

| Agent | Type | Owns |
|-------|------|------|
| `narrative-aligner` | reporter | hybrid-model consistency: site ↔ whitepaper ↔ CLAUDE/AGENTS/GEMINI ↔ memory |
| `research` | reporter | external facts: XPR, Stripe, construction, competitors, legal |
| `backend-consolidator` | builder | legacy↔v3 untangle, backend hardening, deploy readiness |
| `frontend-builder` | builder | site off-CDN build, v1.3 hybrid homepage, perf/a11y |
| `payments-engineer` | builder | Stripe Connect + webhooks + escrow (gated, money OFF) |
| `code-reviewer` | reporter | proton-tsc / JS review, Critical→Low + PASS/FAIL |
| `qa` | reporter | generate + run tests, pass/fail |
| `classifier` | reporter | route leads/claims/proposals → JSON |

## Execution Model — 3 Waves

**Wave 1 — AUDIT (parallel, read-only).** Launch together:
- `narrative-aligner` → narrative drift report
- `backend-consolidator` (audit mode only) → architecture/security report
- `research` → any external unknowns for the current task

Collect all reports. Build a TodoWrite plan from CRITICAL/HIGH findings.

**Wave 2 — BUILD (parallel where independent).** Dispatch builders to non-overlapping file sets:
- `frontend-builder` ↔ website + v3/public
- `payments-engineer` ↔ v3/routes/stripe*, services/settlement, escrow
- `backend-consolidator` ↔ entrypoints, middleware, migrations

Rule: two builders must NEVER edit the same file in one wave. If they would, serialize them.

**Wave 3 — VERIFY (parallel, read-only).** Launch together:
- `code-reviewer` on every changed file
- `qa` to run/extend tests
Ship/commit ONLY when both return PASS.

## Safety Gates (STOP — founder required)
Secrets, paid services, live Supabase/Postgres prod, public website replacement, real payments/loans/escrow settlement, `SETTLEMENT_ENABLED=true`, token collateral, FIO registration, XPR mainnet signatures, legal/provider commitments, destructive ops, production release. Builders propose; founder approves.

## Steps
1. Confirm the target task (or read the active plan / backlog).
2. Run Wave 1, read every report, write a Todo plan.
3. Run Wave 2 on independent file sets; serialize conflicts.
4. Run Wave 3; gate on PASS/PASS.
5. Summarize: what changed, what's blocked on a founder gate, next safe item.
6. Commit/push ONLY if user asked and no gate is open.

## Output Format
```
## Swarm Run — <task>
Wave 1 (audit): <agent: verdict> ...
Plan: <todos>
Wave 2 (build): <agent: files changed> ...
Wave 3 (verify): code-reviewer=PASS/FAIL qa=PASS/FAIL
Founder gates open: ...
Next safe item: ...
```

## How to Run
- «запусти рой» / «swarm» — full 3-wave run on the current task.
- «рой аудит» — Wave 1 only (safe, read-only, zero risk).
- «рой <конкретная задача>» — scope the swarm to one task.

## Learnings
- (updated after each run)
