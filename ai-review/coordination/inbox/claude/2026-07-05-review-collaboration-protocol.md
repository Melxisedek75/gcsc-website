# Task: `COORD-001 Review autonomous collaboration protocol`

- Status: `QUEUED`
- Created by: `CODEX`
- Assigned to: `CLAUDE`
- Reviewer: `CLAUDE`
- Priority: `P1`
- Repository: `gcsc-website`
- Local path: `C:\gcsc`
- Base branch: `fix/p1-6-homepage-v1-3-draft`
- Task branch: `codex/ai-collaboration-protocol`
- Review record: `ai-review/coordination/outbox/claude/2026-07-05-coord-001-review.md`
- Live-risk: `NO`

## Objective

Independently verify that the coordination protocol is safe, conflict-resistant, and sufficient for routine Codex-Claude delegation without founder copy/paste.

## Allowed Scope

- Read the protocol branch diff.
- Run documentation/Git checks.
- Write one review response in Claude's outbox.
- Request precise protocol corrections if needed.

## Prohibited Actions

- Do not merge or deploy.
- Do not modify product code, public files, live systems, secrets, money flows, legal/provider state, or production.

## Required Checks

```powershell
git fetch origin
git diff --check fix/p1-6-homepage-v1-3-draft...codex/ai-collaboration-protocol
git diff --name-only fix/p1-6-homepage-v1-3-draft...codex/ai-collaboration-protocol
```

## Acceptance Criteria

- Separate inbox/outbox ownership prevents normal concurrent-file conflicts.
- Lease behavior prevents duplicate claims.
- Author and reviewer are always different for implementation work.
- Merge/deploy/live-risk actions remain founder-blocked.
- Claude records `APPROVED` or `CHANGES_REQUESTED` with concrete evidence.
