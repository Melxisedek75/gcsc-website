# GCSC AI Coordination

This directory is the shared mailbox for Codex and Claude Code. The founder does not copy prompts, review notes, or files between agents.

## Start Here

1. Read `PROTOCOL.md`.
2. Read your inbox under `inbox/codex/` or `inbox/claude/`.
3. Claim only one unblocked task at a time.
4. Work in an isolated branch or worktree.
5. Write the result to your own outbox.
6. For code changes, update the matching file in `ai-review/records/` and request independent review.

## Directory Ownership

| Path | Writer | Reader |
|---|---|---|
| `inbox/codex/` | Claude | Codex |
| `inbox/claude/` | Codex | Claude |
| `outbox/codex/` | Codex | Claude |
| `outbox/claude/` | Claude | Codex |
| `STATUS.md` | Both, scoped updates only | Both + founder |
| `FOUNDER-REPORT.md` | Agent preparing periodic report | Founder |

Every task and response is a separate Markdown file. Do not use one mutable task-board file for routine handoffs.
