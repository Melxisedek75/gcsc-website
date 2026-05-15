# GCSC Kimi Wave One Launch Ready Brief

Date: 2026-05-15 PT

Status: ready for founder-controlled Kimi Wave One launch.

Purpose: give the founder one short pre-flight brief before sending the generated Kimi handoff bundle to Kimi.

This brief does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Current Ready State

Kimi Wave One is ready to start as local/internal work only.

Prepared local package:

- Handoff generator: `npm run prepare:kimi-handoff-bundle`
- Handoff validator: `npm run check:kimi-handoff-bundle`
- Controller launch packet: `docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md`
- Accelerated master plan: `docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md`
- Founder quick start: `docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md`
- Bundle manifest: `docs/gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md`

## What To Give Kimi

Give Kimi only the generated `.tmp/kimi-wave-one-handoff-*` bundle or the exact files listed in the controller launch packet.

Do not add extra folders, screenshots, `.env` files, credentials, customer data, wallet data, provider data, live Supabase values, payment account data, Magic Link URLs, or private legal/provider communications.

## First Kimi Instruction

Use the copy-paste controller prompt from:

```text
docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md
```

Kimi must run Wave One only and return:

- one controller summary;
- one report per worker;
- local-only created or modified draft files;
- explicit blocked/rework labels for anything unsafe or incomplete.

## What To Expect Back

The expected return package is not a finished product. It is raw parallel output that must be audited.

Expected safe output:

- local markdown reports;
- local draft docs;
- API inventories;
- public wording risk notes;
- smart contract gap maps;
- Auth/RLS readiness notes;
- deployment/public beta blocker notes;
- investor/mobile/legal/provider prep notes.

Unsafe output must be blocked, not integrated.

## Stop Conditions

Stop and route to Claude/Codex/founder review if Kimi:

- asks for secrets, passwords, private keys, service-role keys, wallet material, or Magic Link URLs;
- edits or asks to edit live Supabase, external accounts, deployment settings, app stores, provider accounts, or public launch surfaces;
- claims legal approval, lender approval, escrow readiness, production readiness, stablecoin settlement readiness, token collateral readiness, or public launch readiness;
- proposes real payments, real loans, real escrow, repayment routing, token collateral locks, XPR signatures, or money movement;
- changes locked shared files instead of returning draft reports.

## After Kimi Returns

1. Save the controller summary and worker reports.
2. Run `npm run prepare:kimi-output-intake`.
3. Place output into the matching stream folders.
4. Run `npm run summarize:kimi-output-intake`.
5. Run `npm run audit:kimi-worker-reports`.
6. Run `npm run prepare:kimi-merge-queue`.
7. Send Kimi output to Claude for audit.
8. Let Codex integrate only streams marked `PASS_LOCAL_ONLY`.

## Launch Verdict

Verdict: `READY_LOCAL_ONLY_FOR_KIMI_WAVE_ONE`

Meaning: safe to start Kimi for internal drafting and reporting. Not safe for live systems, public launch, legal/provider decisions, or money movement.
