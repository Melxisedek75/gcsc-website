# GCSC Kimi Wave One Founder Copy-Paste Prompt

Date: 2026-05-15 PT

Status: founder-ready launch prompt for Kimi Wave One.

Purpose: give the founder one exact message to paste into Kimi after uploading the handoff bundle, so Kimi can start the 100-agent local drafting wave without extra interpretation.

This prompt does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Before Pasting

Upload or paste the files from `docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md` and `docs/gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md`.

Fast local bundle command:

```powershell
cd C:\gcsc\construction-ai
npm run prepare:kimi-handoff-bundle
```

Use only the generated bundle under `C:\gcsc\.tmp\kimi-wave-one-handoff-*`. Do not upload `.env`, credentials, private screenshots, customer private data, wallet material, Magic Link URLs, Supabase secrets, provider keys, deployment secrets, or files outside the generated bundle.

## Copy-Paste Prompt For Kimi

```text
You are the Kimi controller for GCSC/SmartContractor Wave One.

Read AGENTS.md first. Then read docs/gcsc-active-context.md, docs/gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md, docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md, docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md, docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md, docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md, docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md, docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md, and docs/gcsc-kimi-worker-output-package-template-2026-05-14.md before dispatching workers.

Dispatch exactly 100 agents for Wave One using the stream allocation from the founder handoff index and the accelerated build master plan. Do not invent new streams unless the controller summary marks them as proposed later work.

Each worker must produce one local-only report using docs/gcsc-kimi-worker-output-package-template-2026-05-14.md. Each worker must list files read, files created or proposed, commands run, findings by severity, proposed Codex integrator action, stop boundaries checked, no-touch confirmation, and remaining blockers.

Return one controller summary plus one worker report per agent. The controller summary must include stream-level status, missing reports, rework needed, blocked items, files created/proposed, and a recommended Codex merge order.

Allowed work: local/internal draft reports, checklists, review packets, inventories, acceptance criteria, implementation plans, QA matrices, and conservative wording proposals.

Do not touch secrets, live Supabase, external account settings, deployment settings, public website files, production SQL, provider setup, legal conclusions, lender approvals, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app stores, wallet keys, destructive actions, or public launch claims.

If a task requires a secret, external account, legal/provider decision, live system change, real money movement, real loan, escrow release, repayment routing, stablecoin settlement, token collateral, XPR signature, app-store action, public publishing, or destructive action, mark it BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW and continue with safe local alternatives.

Final verdict must be one of: PASS_LOCAL_ONLY, PARTIAL_REWORK_REQUIRED, BLOCKED_EXTERNAL_REVIEW, or FAIL_UNSAFE.
```

## Expected Kimi Return

Kimi should return:

- one controller summary;
- 100 worker reports;
- local draft files only, if it creates files;
- no public edits, no live actions, no secrets, no legal approval claims, no real-money claims.

## Stop Immediately If

- Kimi asks for passwords, keys, Magic Link URLs, wallet material, Supabase service-role values, provider credentials, or account logins;
- Kimi says it can deploy, publish, approve legal status, approve lending, release escrow, settle stablecoins, route repayments, lock token collateral, or sign XPR transactions;
- Kimi edits or proposes direct changes to `.env`, production deployment settings, live Supabase apply files, public website publication files, app-store files, provider account files, wallet/signature files, or destructive scripts.

## Founder Verdict

READY_LOCAL_ONLY_FOR_KIMI_COPY_PASTE_LAUNCH.
