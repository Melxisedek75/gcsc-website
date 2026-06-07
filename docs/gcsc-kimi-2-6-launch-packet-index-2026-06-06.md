# GCSC Kimi 2.6 Launch Packet Index

Date: 2026-06-06 PT

Status: founder/Codex local-only index for the Kimi 2.6 100-bot delegation packet.

This index does not approve Kimi worker dispatch, public website replacement, public whitepaper publication, live Supabase writes, admin activation, strict RLS apply, deployment setting changes, public beta launch, tester invites, legal conclusions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, app-store actions, secrets handling, production release, or destructive actions.

## Current Packet State

| Stage | Status | Owner | File |
| --- | --- | --- | --- |
| Founder simple launch instructions | READY_LOCAL_ONLY | Founder uses, Codex verifies | `docs/gcsc-kimi-2-6-founder-copy-paste-runbook-2026-06-06.md` |
| Master Kimi prompt | READY_LOCAL_ONLY | Founder pastes into Kimi | `docs/gcsc-kimi-2-6-100-bot-delegation-master-prompt-2026-06-06.md` |
| First-report Codex review gates | READY_LOCAL_ONLY | Codex reviews Kimi output | `docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md` |
| First-report intake record template | READY_LOCAL_ONLY | Codex records review without secrets | `docs/gcsc-kimi-2-6-understanding-report-intake-template-2026-06-06.md` |
| Post-approval 100-worker board | READY_BUT_NOT_ACTIVE | Kimi may use only after Codex approval phrase | `docs/gcsc-kimi-2-6-100-worker-dispatch-board-2026-06-06.md` |

## Required Order

Use this file as the current Kimi 2.6 launch index. Do not use older Wave One prompts or old whitepaper micro-validator instructions to start the Kimi 2.6 worker run.

1. Founder opens Kimi 2.6 and follows `docs/gcsc-kimi-2-6-founder-copy-paste-runbook-2026-06-06.md`.
2. Founder uploads/pastes only allowed local docs.
3. Founder pastes the master prompt from `docs/gcsc-kimi-2-6-100-bot-delegation-master-prompt-2026-06-06.md`.
4. Kimi must return only an `UNDERSTANDING REPORT`.
5. Kimi must end with:

```text
WAITING_FOR_CODEX_APPROVAL
```

6. Founder pastes that Kimi report back into Codex.
7. Codex reviews with `docs/gcsc-kimi-2-6-understanding-report-review-checklist-2026-06-06.md`.
8. Codex records a safe intake using `docs/gcsc-kimi-2-6-understanding-report-intake-template-2026-06-06.md` if useful.
9. Codex either sends a revision response or the exact approval phrase.
10. Only after the exact approval phrase may Kimi use the 100-worker dispatch board.

## Exact Approval Phrase

```text
APPROVED_TO_DISPATCH_KIMI_WAVE_TWO_LOCAL_ONLY
```

Do not shorten, translate, or paraphrase the approval phrase.

## Exact Revision Phrase

```text
NOT_APPROVED_REVISE_UNDERSTANDING_REPORT
```

## Files Founder Should Not Upload

Do not upload:

- `.env` or `.env.*`
- credentials
- Magic Link URLs
- screenshots with private data
- wallet files
- private backups
- `_collected`
- raw customer data
- provider credentials
- attorney advice
- deployment exports
- payment data
- private mobile/device identifiers

## Active No-Touch Boundaries

Kimi, Codex, and any worker must not:

- edit `index.html` or `whitepaper.html`;
- publish or replace public artifacts;
- change deploy settings, DNS, Vercel, GitHub Pages, Namecheap, Supabase redirect settings, or app-store settings;
- request or store secrets;
- apply live Supabase SQL, activate admins, repair live profiles, or apply strict RLS;
- approve or move real payments, loans, escrow, repayment routing, stablecoin settlement, token collateral, or token custody;
- contact legal/provider/lender/reviewer recipients or claim legal/provider approval;
- sign XPR actions, create XPR accounts, deploy WASM/ABI, register FIO, or request wallet signatures;
- launch beta, invite testers, share public URLs, or push production.

## First Kimi Report Acceptance Summary

Codex can approve Kimi only if the first report proves:

1. Updated v1.3 whitepaper direction is understood as traditional-first Construction Trust Infrastructure.
2. Web3/token/loan/escrow claims are review-gated, future-regulated, or internal-only.
3. No workers were dispatched.
4. No files were created or edited.
5. Worker count is exactly 100 across streams A-J.
6. Kimi remains report-only.
7. Codex remains integrator.
8. Founder remains live/legal/money/public decision owner.
9. Kimi preserved every no-touch boundary.
10. Final verdict is `WAITING_FOR_CODEX_APPROVAL`.

## Post-Approval Intake Summary

After approval and Kimi worker output:

1. Reject unsafe reports first.
2. Group reports by stream A-J.
3. Prefer concrete missing tests, validator gaps, stale-doc findings, request-id issues, fixture gaps, and safe wording deltas.
4. Ignore any recommendation that touches public/live/legal/money/XPR/FIO/provider/mobile-store boundaries.
5. Integrate only small scoped local changes through Codex.
6. Run targeted checks.
7. Confirm public `index.html` and `whitepaper.html` remain unchanged.
8. Commit only scoped accepted files.

## Current Recommended Next Action

Founder should run only the first Kimi understanding pass, then paste Kimi's report into Codex for review.

Do not start the 100-worker dispatch until Codex explicitly approves the understanding report.
