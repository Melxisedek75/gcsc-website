# Codex-Claude Autonomous Collaboration Design

## Goal

Create a Git-backed coordination channel where Codex and Claude Code can assign, implement, review, and report GCSC work without the founder copying prompts or files between agents.

## Design

The repository is the shared source of truth. Each handoff is a separate Markdown file under `ai-review/coordination/inbox/<agent>/`, which avoids concurrent edits to one task board. The receiving agent writes its response as a new file under its own outbox and updates the corresponding review record when code review is required.

Codex polls the queue every 30 minutes through a Codex heartbeat. Claude uses the same protocol through its own local scheduler or session-start hook. A Markdown file cannot wake Claude Code by itself, so Claude scheduler activation is tracked explicitly and does not block Codex polling.

## Safety

- Author and reviewer must be different agents.
- Work uses a dedicated branch or worktree.
- No automatic merge, deploy, public publication, production change, real payment, loan, escrow, token, XPR/FIO signature, secret use, legal decision, provider commitment, or destructive action.
- A task lease prevents two runs from claiming the same task.
- Founder approval remains mandatory for all live-risk actions.

## Success Criteria

1. Both agents can discover assigned work by reading the repository.
2. Handoffs contain reproducible commands and evidence.
3. No founder copy/paste is needed for normal delegation and review.
4. Codex checks the queue every 30 minutes.
5. The founder receives a concise status report rather than raw agent dialogue.
