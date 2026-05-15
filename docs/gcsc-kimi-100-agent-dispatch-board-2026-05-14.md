# GCSC / SmartContractor Kimi 100-Agent Dispatch Board

Date: 2026-05-14 PT

Status: internal acceleration board for Kimi/multi-agent execution.

Purpose: convert the Kimi audit and work orders into a controller-ready dispatch board so 100 independent agents can start quickly without fighting over files, touching live systems, or waiting for Codex to explain the same boundaries repeatedly.

This board is not approval for public launch, deployment, live Supabase changes, external account changes, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, provider commitments, secrets handling, or destructive actions.

## Controller Instruction

Use this board as the Kimi controller's first screen.

1. Freeze the repo before dispatch.
2. Give every worker the global prompt below.
3. Assign only one stream package per worker.
4. Enforce exclusive file ownership.
5. Collect worker reports before merging.
6. Let one integrator edit shared files such as `construction-ai/package.json`.
7. Keep `whitepaper.html`, `index.html`, live/deploy/account files, secrets, and instruction files locked unless Codex/founder explicitly assigns a later integration step.

## Global Worker Prompt

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- the dispatch/work-order file assigned to your stream
- all source files listed in your assigned stream

Safety:
- No secrets.
- No live Supabase changes.
- No external account changes.
- No production deploy/account settings.
- No real payments, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal, securities, escrow, lending, tax, custody, AML, or provider conclusions.
- No public launch.
- Do not edit files outside your assigned file set.
- Do not edit shared package/config files unless you are the named integrator.

Output:
- Short summary.
- Files created/modified.
- Exact commands run and result.
- Findings/blockers.
- Suggested next integration step.
- Confirmation that no live/legal/money/external/secrets boundary was crossed.
```

## Dispatch Waves

### Wave 1: Start Immediately

These streams reduce the most risk and have the clearest file ownership.

| Agent IDs | Stream | Count | Work Order | Dependency | Shared File Risk |
| --- | --- | ---:| --- | --- | --- |
| A01-A20 | Stream A: Public Whitepaper v1.2 Draft | 20 | `docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md` | none | proposed package script only |
| F01-F12 | Stream F: API/OpenAPI Inventory | 12 | `docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md` | none | proposed package script only |
| N01-N08 | Stream N: Public Artifact Safety | 8 | `docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md` | none | proposed package script only |
| J01-J10 | Stream J: Smart Contract Local Build Map | 10 | `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md` | none | local smart-contract helper files only |

Wave 1 output target:

- v1.2 public draft package;
- OpenAPI/API inventory;
- public artifact safety audit;
- smart contract local build map and missing fixture list.

### Wave 2: Start After Wave 1 Drafts Exist

These streams should wait until Wave 1 has at least draft outputs.

| Agent IDs | Stream | Count | Source Dependency | Output |
| --- | --- | ---:| --- | --- |
| B01-B08 | Stream B: HTML Whitepaper Replacement Prep | 8 | Stream A draft package | HTML migration report and validator proposal only; do not edit `whitepaper.html` yet |
| C01-C08 | Stream C: Website Copy Alignment | 8 | Stream A draft package + Stream N safety rules | website copy report and proposed diffs only |
| D01-D04 | Stream D: PDF/DOCX Publication Pipeline | 4 | Stream A draft package | artifact plan and PDF export checklist |
| O01-O06 | Stream O: Investor/Grant/Partner Alignment | 6 | Stream A draft + Stream N safety rules | investor alignment report and conservative narrative |

Wave 2 output target:

- public surface migration plan without public edits;
- publication artifact pipeline;
- investor/partner claim-safe alignment.

### Wave 3: Backend, Auth, Deploy, Mobile, AI

These streams can run in parallel after Wave 1 has API/safety outputs.

| Agent IDs | Stream | Count | Source Dependency | Output |
| --- | --- | ---:| --- | --- |
| E01-E10 | Stream E: Backend Modularization Plan | 10 | Stream F route inventory | route ownership plan and first safe extraction candidates |
| G01-G08 | Stream G: Frontend QA/UX Polish | 8 | Stream N safety rules | QA report and safe UI polish issues |
| H01-H06 | Stream H: Auth/RLS Matrix | 6 | current Auth/RLS docs | local-only RLS policy matrix |
| I01-I06 | Stream I: Deployment/Public Beta Prep | 6 | deploy docs + safety rules | Vercel predeploy audit and beta week plan |
| L01-L04 | Stream L: AI Agent Scaffolds | 4 | AI boundaries docs | recommendation-only scaffold map |
| M01-M04 | Stream M: Mobile Readiness | 4 | mobile docs | Android/iOS readiness report |
| K01-K04 | Stream K: XPR Contract Code Audit | 4 | contract folders | read-only proton-tsc audit reports |

Wave 3 output target:

- route refactor plan without risky merge;
- frontend QA list;
- Auth/RLS readiness matrix;
- deploy/beta plan;
- AI recommendation-only map;
- mobile blockers;
- XPR contract audit.

## Exact Agent Group Instructions

### A01-A12 Section Writers

Use `docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md`.

Each agent writes only its assigned section into a temporary report. Do not edit final draft directly unless appointed A-integrator.

### A13-A20 Whitepaper Reviewers

Use the reviewer assignments in the Stream A work order. Review for claim safety, source trace, readability, legal/provider boundaries, validator coverage, public-file lock, exact wording, and integration report quality.

### F01-F08 API Inventory Workers

Read `construction-ai/server.js` and document endpoint groups:

- F01 health/readiness/public info;
- F02 Auth/session/profile;
- F03 SmartContractor core jobs/bids/contracts/milestones;
- F04 loans/repayments/payment intents/payment events;
- F05 disputes/evidence/peer review;
- F06 verification/collateral/audit/admin;
- F07 webhooks/Slack/automation;
- F08 error, request-id, rate-limit, and security-header behavior.

### F09-F12 OpenAPI/Validator Workers

Create YAML draft sections, validator proposal, route coverage checks, and script proposal. Do not edit package scripts.

### N01-N08 Safety Workers

Split scope:

- N01 secret-looking values in docs/public files;
- N02 unsafe finance/lending/escrow claims;
- N03 unsafe token/yield/legal/regulatory claims;
- N04 AI final-decision claims;
- N05 mojibake/public artifact drift;
- N06 validator implementation;
- N07 allowlist proposal;
- N08 final audit report.

### J01-J10 Smart Contract Local Workers

Use Stream J from `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`.

Split by module:

- J01 authority/admin;
- J02 project registry;
- J03 milestone state;
- J04 loan ledger;
- J05 repayment router;
- J06 collateral/risk;
- J07 reputation/review;
- J08 dispute/override;
- J09 audit/compliance;
- J10 anti-backdoor fixture matrix.

No live XPR deployment. No token movement.

## Shared Files Lock

Only the named integrator may edit:

- `construction-ai/package.json`;
- `construction-ai/server.js`;
- `whitepaper.html`;
- `index.html`;
- `AGENTS.md`;
- `GEMINI.md`;
- `.claude/CLAUDE.md`;
- `.env*`;
- deploy config files;
- production/live account files.

All workers must report proposed changes to shared files instead of applying them.

## Merge Queue

Use this order:

1. Stream N safety findings.
2. Stream F API inventory and route coverage.
3. Stream A public whitepaper draft.
4. Stream J smart contract build map.
5. Stream H Auth/RLS matrix.
6. Stream I deploy/beta prep.
7. Stream G frontend QA issues.
8. Streams B/C/D/O public surface and investor alignment.
9. Streams E/L/M/K backend/AI/mobile/XPR follow-up.

Reason: safety and API inventory reduce merge risk for every later stream.

## Report Format

Every worker report must use:

```markdown
# Worker Report: [Agent ID] [Stream]

## Summary

## Files Read

## Files Created Or Modified

## Commands Run

## Findings

| Severity | File | Issue | Recommendation |
| --- | --- | --- | --- |

## Blockers

## Proposed Integrator Actions

## Safety Confirmation

- No secrets handled:
- No live Supabase changes:
- No external account changes:
- No real payments/loans/escrow/repayment/stablecoin/token collateral:
- No legal/provider/public launch decision:
```

## Controller Stop Conditions

Stop the worker or whole wave if any report includes:

- probable real secret;
- request to use a password/key/token/seed phrase;
- live Supabase write/apply;
- production deploy/account setting change;
- real payment/loan/escrow/repayment/stablecoin/token collateral action;
- legal/provider/public-launch decision;
- destructive file operation;
- locked-file edit outside assignment.

## Codex Integration Checklist

Codex should integrate Kimi work only after:

1. `git status --short --branch` is reviewed.
2. Worker reports are read.
3. Locked files are checked.
4. Shared package script additions are batched.
5. Targeted validators pass.
6. `git diff --check` passes.
7. Full `npm run check` passes when the integration is broad.
8. Scoped files are committed and pushed.

## First Three Commands For Kimi Controller

```powershell
cd C:\gcsc
git status --short --branch
rg -n "Stream A|Stream F|Stream N|Stream J|whitepaper.html|package.json|server.js" docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md
```

Then dispatch Wave 1 agents.
