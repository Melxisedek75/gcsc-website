# GCSC Whitepaper v1.3 Autonomous Continuation Rule

Status: internal operating rule for Codex v1.3 work.

## Rule

After every completed safe v1.3 task, Codex must immediately choose the next safe task and continue without waiting for the founder to say "continue".

This v1.3 rule is attached to the main nonstop hook in `docs/codex-nonstop-execution-hook.md`. The active heartbeat automation `gcsc-nonstop-next-task-hook` must read this file and `docs/superpowers/plans/2026-05-31-whitepaper-v1-3-hybrid-web3-implementation.md` before choosing the next safe v1.3 task.

## Safe Tasks Codex May Do Autonomously

- create local docs;
- create or update validators;
- create local HTML drafts;
- scan public files for risky wording;
- prepare review packets;
- prepare visual QA checklists;
- run local checks;
- make scoped commits;
- push scoped commits;
- update local planning docs.

## Tasks That Stop The Loop

Codex must stop before:

- replacing `whitepaper.html`;
- replacing `index.html`;
- publishing a PDF;
- changing public website routing;
- contacting providers;
- logging into external accounts;
- entering or requesting secrets;
- live Supabase changes;
- legal conclusions;
- provider commitments;
- real payments;
- real loans;
- escrow;
- stablecoin settlement;
- token collateral;
- FIO registrations;
- XPR signatures;
- Metallicus partnership claims.

## Current Autonomous Queue

1. Maintain v1.3 validators.
2. Create founder approval-to-review packet.
3. Create local visual QA evidence template.
4. Maintain local browser review notes for `whitepaper-v1-3-draft.html` and `index-v1-3-draft.html`.
5. Improve draft HTML only if validators remain green.
6. Prepare public publication evidence template.
7. Keep publication gate NO-GO until founder approval and review gates are recorded.

## Reporting Rule

Codex should report only after a completed safe block, a failed check, a safety stop, or a direct founder question.

## Live Heartbeat Binding

- Active heartbeat id: `gcsc-nonstop-next-task-hook`.
- Practical interval: every 1 minute.
- Purpose: wake the current GCSC thread and continue the next safe local v1.3 task.
- Current v1.3 files the heartbeat must read: `docs/whitepaper-v1-3-autonomous-continuation-rule.md` and `docs/superpowers/plans/2026-05-31-whitepaper-v1-3-hybrid-web3-implementation.md`.
- If only blocked public/live/legal/provider/money/Web3 tasks remain, Codex must stop and report the exact founder/legal/provider action needed.

## Why This Exists

The founder should not need to repeatedly remind Codex to continue safe local work. The default is forward motion inside the safe boundary.
