# GCSC Kimi Wave One Founder Handoff Index

Date: 2026-05-14 PT

Status: current founder/Kimi controller index for the first safe 100-agent wave.

Purpose: give the founder one clean handoff file for Kimi so the parallel work can start without reading the whole chat. This index points to the current work-order-backed streams, the safe agent allocation, the first files to give Kimi, the merge order, and the stop boundaries.

This is not approval for deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Use This File First

Give Kimi this file first, then the files listed below.

Required controller start files:

- `AGENTS.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md`
- `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`
- `docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md`
- `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`

Controller rule: each worker gets exactly one stream work order and writes only the files allowed by that work order.

## Current Work-Order-Backed Streams

| Stream | Agents | Work Order | Main Output | Start Now |
| --- | ---:| --- | --- | --- |
| A | 20 | `docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md` | safe public whitepaper v1.2 draft package | yes |
| F | 12 | `docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md` | API/OpenAPI inventory | yes |
| N | 8 | `docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md` | public artifact safety audit | yes |
| J | 10 | `docs/gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md` | smart contract local build map | yes |
| H | 6 | `docs/gcsc-kimi-stream-h-auth-rls-admin-work-order.md` | Auth/RLS/Admin readiness package | yes |
| I | 6 | `docs/gcsc-kimi-stream-i-deployment-public-beta-work-order.md` | deployment/public beta readiness package | yes |
| O | 6 | `docs/gcsc-kimi-stream-o-investor-partner-alignment-work-order.md` | investor/grant/partner alignment package | yes |
| M | 5 | `docs/gcsc-kimi-stream-m-mobile-readiness-work-order.md` | mobile readiness package | yes |
| K | 8 | `docs/gcsc-kimi-stream-k-contract-backed-loan-implementation-work-order.md` | contract-backed loan implementation gap package | yes |
| L | 8 | `docs/gcsc-kimi-stream-l-legal-provider-review-work-order.md` | legal/provider review prep package | yes |
| Q | 6 | `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md` | cross-stream intake dry-run reports only | yes |
| S | 5 | this file plus all work orders | cross-stream safety/no-touch review only | yes |

Total first wave: 100 agents.

## Agent ID Allocation

| Agent IDs | Assignment | May Create |
| --- | --- | --- |
| A01-A20 | Stream A | only Stream A assigned outputs |
| F01-F12 | Stream F | only Stream F assigned outputs |
| N01-N08 | Stream N | only Stream N assigned outputs |
| J01-J10 | Stream J | only Stream J assigned outputs |
| H01-H06 | Stream H | only Stream H assigned outputs |
| I01-I06 | Stream I | only Stream I assigned outputs |
| O01-O06 | Stream O | only Stream O assigned outputs |
| M01-M05 | Stream M | only Stream M assigned outputs |
| K01-K08 | Stream K | only Stream K assigned outputs |
| L01-L08 | Stream L | only Stream L assigned outputs |
| Q01-Q06 | Intake dry run | `docs/kimi-intake-dry-run-qXX.md` reports only |
| S01-S05 | Safety review | `docs/kimi-safety-review-sXX.md` reports only |

Q and S agents are read-only reporters. They must not modify stream outputs.

## Current Priority Order

1. Stream N first, because public artifact safety findings can block public wording and investor materials.
2. Stream A next, because public whitepaper v1.2 wording is the source for several public-facing packages.
3. Streams F and J in parallel, because API inventory and smart contract mapping unblock implementation work.
4. Streams K and L in parallel, because loan implementation and legal/provider review must stay aligned.
5. Streams H and I in parallel, because Auth/RLS and deployment/public beta depend on each other but can be audited locally.
6. Streams O and M after initial A/N safety output, because investor/mobile language must inherit the safe public-claim boundaries.
7. Q/S after each stream produces a draft report.

## Global Stop Boundaries

All workers must stop and report if they encounter or are asked to use:

- passwords, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, raw database passwords, Magic Link URLs, environment variable values, provider credentials, payment keys, stablecoin credentials, or keystore material;
- live Supabase writes, migrations, RLS apply, admin membership insert, production SQL, or service-role actions;
- Vercel, GitHub Pages, Namecheap, DNS, Google Play, App Store, Apple Developer, payment provider, escrow provider, lender, wallet, or external account actions;
- public website, whitepaper, deck, email, grant, investor, partner, or social publication;
- real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, wallet funding, liquidation, XPR signature, token transfer, deployment, or money movement;
- legal, securities, lending, escrow, custody, AML, tax, privacy, app-store, provider, or public-launch conclusions.

Default state for unclear items: `HOLD`, `REVIEW`, or `BLOCKED_FOR_LIVE`.

## Locked Files

Workers must not edit these unless a later Codex integrator package explicitly assigns the file:

- `AGENTS.md`
- `GEMINI.md`
- `.claude/CLAUDE.md`
- `.env`, `.env.*`
- `construction-ai/package.json`
- `construction-ai/server.js`
- public website and whitepaper files
- Supabase live migration/apply files
- deploy/account/provider/app-store/wallet files
- smart contract source or XPR contract folders
- bid/outreach/email-send files

## Required Worker Report Format

Every worker must finish with:

```text
Worker ID:
Stream:
Files read:
Files created/modified:
Commands run:
Result:
Findings by severity:
Proposed integrator action:
Stop boundaries checked:
No-touch confirmation:
Remaining blockers:
```

Missing report fields mean the package goes to `REWORK_REQUIRED`.

## Intake Sequence For Codex/Claude

1. Read the worker report first.
2. Run `git status --short --branch`.
3. Run `git diff --name-only`.
4. Reject locked-file edits by non-integrators.
5. Search for secrets or secret-looking values.
6. Search for live/legal/money/public overclaims.
7. Run stream-specific validators from the work order.
8. Apply only scoped, safe, local changes.
9. Commit by stream, not as one giant merge.

## First Founder/Kimi Command

Use this exact controller instruction:

```text
Run Wave One only. Use docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md as the controller index. Dispatch A/F/N/J/H/I/O/M/K/L/Q/S exactly as assigned. Do not touch secrets, live systems, external accounts, public files, provider setup, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app stores, or deployment. Return one report per worker and one controller summary.
```

## What Codex Keeps

Codex should keep these responsibilities:

- final integration decisions;
- shared file edits;
- package script edits;
- backend or validator implementation after Kimi reports;
- final claim-risk review;
- final scoped commits/pushes;
- stopping before founder/live/legal/external/money gates.

## What Claude Should Review

Claude should review:

- public whitepaper wording from Stream A;
- public claim and investor/provider language from Streams N/O/L;
- smart contract authority and anti-backdoor assumptions from Stream J/K;
- Auth/RLS/deployment assumptions from Streams H/I;
- any proposed public or legal/provider-facing language before founder external use.

## Definition Of Done For Wave One

Wave One is complete when:

- every assigned worker report exists;
- every stream has its required output files or a blocker report;
- Q intake agents classify each output as `ACCEPT_LOCAL_ONLY`, `ACCEPT_AFTER_INTEGRATOR_EDIT`, `REWORK_REQUIRED`, `REJECT_UNTIL_REWORKED`, or `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW`;
- S safety agents confirm no secret/live/legal/money/external/public-launch boundary was crossed;
- Codex has a merge queue that can be processed stream by stream.
