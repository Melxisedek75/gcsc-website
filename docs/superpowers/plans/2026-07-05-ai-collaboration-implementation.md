# Codex-Claude Autonomous Collaboration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a safe Git-backed coordination protocol and recurring Codex queue poller.

**Architecture:** Separate append-only inbox and outbox directories prevent agents from editing the same queue file. A shared protocol defines task ownership, leases, review gates, safety limits, and reporting.

**Tech Stack:** Markdown, Git/GitHub, Codex heartbeat automation, Claude Code scheduler or session hook.

---

### Task 1: Coordination Protocol

**Files:**
- Create: `ai-review/coordination/README.md`
- Create: `ai-review/coordination/PROTOCOL.md`
- Create: `ai-review/coordination/TASK-TEMPLATE.md`

- [x] Define the canonical entry point and folder ownership.
- [x] Define task states, leases, review flow, and live-risk boundaries.
- [x] Define a complete handoff template with reproducible checks.

### Task 2: Agent Queues and Status

**Files:**
- Create: `ai-review/coordination/inbox/codex/README.md`
- Create: `ai-review/coordination/inbox/claude/README.md`
- Create: `ai-review/coordination/outbox/codex/README.md`
- Create: `ai-review/coordination/outbox/claude/README.md`
- Create: `ai-review/coordination/STATUS.md`
- Create: `ai-review/coordination/FOUNDER-REPORT.md`

- [x] Create separately owned append-only queues.
- [x] Record current collaboration state and founder-facing report format.

### Task 3: Scheduler Handoffs

**Files:**
- Create: `ai-review/coordination/CODEX-AUTOMATION.md`
- Create: `ai-review/coordination/CLAUDE-AUTOMATION.md`
- Create: `ai-review/coordination/inbox/claude/2026-07-05-review-collaboration-protocol.md`

- [x] Define the exact Codex polling behavior.
- [x] Define Claude scheduler activation without founder copy/paste.
- [x] Submit the protocol itself for independent Claude review.

### Task 4: Verification and Publication

- [x] Run `git diff --check`.
- [x] Verify all required protocol headings and queue directories exist.
- [ ] Commit and push only the new coordination files.
- [x] Activate the Codex 30-minute poll through the existing 2-minute heartbeat gate.
