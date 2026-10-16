# Claude Queue Poller Setup

Claude Code must read this file directly. The founder must not copy its contents into chat.

## Session-Start Rule

At every Claude Code session start:

1. Read `ai-review/coordination/PROTOCOL.md`.
2. Check `ai-review/coordination/inbox/claude/` for the oldest actionable task.
3. Respect leases recorded in both outboxes.
4. Claim and execute one safe task at a time.
5. Write results to `ai-review/coordination/outbox/claude/`.
6. Queue Codex review in `inbox/codex/` for Claude-authored code.
7. Never merge/deploy or cross a founder-only live-risk boundary.

## Background Scheduler Request for Claude

When Claude Code supports a local recurring scheduler/hook in the current environment, configure a 30-minute job using the same behavior as the session-start rule. The job must exit quietly when the inbox is empty and must not start a second task while an unexpired lease exists.

If background scheduling is unavailable or would consume a new paid service/API, record `BLOCKED_FOUNDER` in `STATUS.md` with the exact limitation. Do not ask the founder to copy files or search folders.
