# Kimi Stream J Work Order: Smart Contract Local Build Map

Date: 2026-05-14 PT

Status: internal parallel-agent work order. Safe for Kimi/local agents. Not approval for live XPR deployment.

Purpose: give Kimi a precise Stream J package for mapping the approved SmartContractor smart contract module split into local-only implementation tasks, replay fixtures, anti-backdoor checks, and review reports without touching live XPR, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, external accounts, or secrets.

This work order is not legal advice, not financial advice, not audit certification, not deployment approval, not public launch approval, and not approval for real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, live Supabase changes, XPR signatures, account permission changes, external account changes, or secrets handling.

## Required Starting Prompt For Kimi

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Mission: execute Stream J only: create a local smart contract build map and missing fixture/test recommendations for the approved SmartContractor module split. Do not deploy anything. Do not sign anything. Do not move tokens. Do not edit live/public files.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md
- docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md
- docs/gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md
- every source file listed in "Required Source Files"

Safety:
- No secrets.
- No live Supabase changes.
- No external account changes.
- No XPR deployment, signatures, authority changes, token transfers, or account creation.
- No real payments, loans, escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal conclusions.
- No public launch.
- Do not edit files outside your assigned file set.
- Do not edit AGENTS.md, GEMINI.md, .claude/CLAUDE.md, .env, package.json, server.js, whitepaper.html, index.html, deploy/account files, or live contract folders unless explicitly assigned by the integrator.

Output:
- Short Russian summary.
- Files created/modified.
- Exact commands run and result.
- Findings/blockers ranked Critical/High/Medium/Low.
- Proposed integrator actions.
- Confirmation that no live/legal/money/external/secrets/XPR boundary was crossed.
```

## Stream J Goal

Create a local-only build map that lets Kimi/Codex later implement or verify the approved smart contract modules in small safe packages.

The build map must answer:

- Which approved modules already have local helper/state/replay coverage?
- Which modules are docs-only?
- Which local fixtures are missing?
- Which anti-backdoor checks must exist before any future live deployment conversation?
- Which existing XPR/proton-tsc contract folders are related but not yet safe to deploy?
- Which files each future worker may touch without conflicts?

## Required Source Files

Kimi Stream J must read:

- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/smartcontractor-smart-contract-implementation-gate.md`
- `docs/smartcontractor-smart-contract-authority-model.md`
- `docs/smartcontractor-smart-contract-test-fixtures.md`
- `docs/smartcontractor-smart-contract-action-register.md`
- `docs/smartcontractor-smart-contract-state-machine.md`
- `docs/smartcontractor-smart-contract-audit-event-map.md`
- `docs/smartcontractor-backend-to-chain-map.md`
- `docs/smartcontractor-smart-contract-deployment-blockers.md`
- `docs/smartcontractor-smart-contract-local-replay-packet.md`
- `docs/smartcontractor-smart-contract-local-replay-live-gate.md`
- `docs/smartcontractor-smart-contract-local-replay-founder-packet.md`
- `construction-ai/src/smart-contracts/`
- `construction-ai/scripts/validate-smart-contract-state-helpers-local.mjs`
- `construction-ai/scripts/validate-smart-contract-local-replay.mjs`
- `construction-ai/scripts/validate-whitepaper-v1-2-smart-contract-module-split-anti-backdoor.mjs`

If needed for read-only comparison only:

- `gcsctoken111/`
- `gcscbuild11/`
- `xprclaw/`

Do not deploy, compile for deployment, sign, transfer, create accounts, or modify live contract folders during this stream.

## Approved Module Split

The build map must cover these modules:

1. Authority/Admin
2. Project Registry
3. Milestone State
4. Loan Ledger
5. Repayment Router
6. Collateral/Risk
7. Reputation/Review
8. Dispute/Override
9. Audit/Compliance

Each module must be classified as:

- `CODE_BACKED_LOCAL`
- `DOCS_ONLY_READY_FOR_LOCAL_SCAFFOLD`
- `PARTIAL_COVERAGE`
- `BLOCKED_FOR_LIVE`
- `REQUIRES_FOUNDER_LEGAL_PROVIDER_REVIEW`

## Assigned File Set

Kimi Stream J may create:

- `docs/smartcontractor-smart-contract-kimi-build-map.md`
- `docs/smartcontractor-smart-contract-kimi-fixture-gap-report.md`
- `docs/smartcontractor-smart-contract-kimi-worker-split.md`

Kimi Stream J may propose, but should not directly apply unless assigned by the integrator:

- new local replay fixture files under `construction-ai/src/smart-contracts/fixtures/`;
- new local-only validator files under `construction-ai/scripts/`;
- `construction-ai/package.json` script additions.

Reason: one integrator should apply shared scripts and code changes after reviewing the build map.

## Output 1: Build Map

`docs/smartcontractor-smart-contract-kimi-build-map.md` must include:

- executive summary;
- required source files read;
- module-by-module coverage table;
- current local code files mapped to each module;
- current validators mapped to each module;
- current docs mapped to each module;
- missing local helper/fixture/test coverage;
- anti-backdoor checklist status;
- XPR/proton-tsc folder relationship notes;
- future worker ownership table;
- blocked-live gates;
- no-touch confirmation.

Required table:

| Module | Current Coverage | Local Files | Validators | Missing Fixtures | Live Status | Next Worker |
| --- | --- | --- | --- | --- | --- | --- |

## Output 2: Fixture Gap Report

`docs/smartcontractor-smart-contract-kimi-fixture-gap-report.md` must include fixture requirements for:

- hidden owner drain rejected;
- hidden upgrade path rejected;
- arbitrary balance mutation rejected;
- contractor self-approval rejected;
- AI-only final approval rejected;
- dispute-to-release bypass rejected;
- overpayment above outstanding balance rejected;
- negative contractor payout rejected;
- token collateral live enablement rejected;
- repayment without approved milestone rejected;
- escrow release while dispute is open rejected;
- live deployment remains `BLOCKED_FOR_LIVE`.

For each fixture:

- module owner;
- input facts;
- expected status;
- expected blocked reason;
- local file proposal;
- validator proposal;
- dependencies;
- whether founder/legal/provider/security review is required before live use.

## Output 3: Worker Split

`docs/smartcontractor-smart-contract-kimi-worker-split.md` must define future independent workers:

| Worker | Module | May Create/Modify | Must Not Touch | Checks |
| --- | --- | --- | --- | --- |

Workers:

- J01 Authority/Admin
- J02 Project Registry
- J03 Milestone State
- J04 Loan Ledger
- J05 Repayment Router
- J06 Collateral/Risk
- J07 Reputation/Review
- J08 Dispute/Override
- J09 Audit/Compliance
- J10 Anti-Backdoor Fixture Matrix

## Anti-Backdoor Rules

The build map must preserve these hard rules:

- no hidden owner drain;
- no hidden upgrade path;
- no arbitrary balance mutation;
- no bypass around milestone approval;
- no contractor self-approval;
- no AI-only final approval;
- no dispute bypass to payment release;
- no overpayment above outstanding balance;
- no negative contractor payout;
- no token collateral live enablement;
- no live deployment authority from local helpers;
- all future live activation remains blocked for founder/legal/provider/security/XPR authority review.

## XPR/Proton-tsc Read-Only Audit Boundaries

If Stream J reads `gcsctoken111/`, `gcscbuild11/`, or `xprclaw/`, the output must label findings as read-only.

Do not:

- run live deployment;
- sign transactions;
- create accounts;
- change active permissions;
- transfer XPR/GCSC/GCST/GCSCBUILD;
- compile for deployment unless the command is clearly local-only and already documented;
- change token supply, issuer, treasury, or authority logic.

Any concern found in these folders must be written as a report item, not fixed inside this stream unless explicitly assigned later.

## Commands To Run

Start with:

```powershell
cd C:\gcsc\construction-ai
npm run check:smart-contract-state-helpers-local
npm run check:smart-contract-local-replay
npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor
npm run check:smart-contract-deployment-blockers
```

If Kimi only creates docs and no code validators, also run:

```powershell
cd C:\gcsc
git diff --check
```

If Kimi proposes or changes local smart-contract helper code later, run full:

```powershell
cd C:\gcsc\construction-ai
npm run check
```

## Definition Of Done

Stream J is done only when:

- build map exists;
- fixture gap report exists;
- future worker split exists;
- every approved module is classified;
- every module has local files/docs/validators mapped or an explicit gap;
- anti-backdoor rules are explicitly checked;
- live XPR deployment remains blocked;
- real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, provider calls, and AI final approval remain blocked;
- commands run are listed with exact results;
- no locked files were modified;
- no secrets or external accounts were touched.

## Handoff To Codex And Claude

After Kimi completes Stream J:

1. Codex reviews the three docs first.
2. Codex checks for locked-file changes and live-risk claims.
3. Codex decides which future worker package can safely create local fixtures.
4. Claude reviews module authority, audit trail, and anti-backdoor coverage before any live XPR conversation.
5. Founder/legal/provider/security/XPR authority review remains required before any deployment or real-money action.

## Stop Conditions

Stop and report instead of continuing if Kimi encounters:

- passwords, API keys, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, raw database passwords, or private XPR authority material;
- live Supabase changes;
- XPR account creation, authority changes, signatures, deployment, or token transfer requirements;
- real loan, real payment, real escrow, repayment routing, stablecoin settlement, token collateral, or production money movement;
- legal, securities, escrow, lending, custody, AML, tax, provider, security certification, or public launch decisions;
- need to edit locked files or live contract folders to complete the assigned stream.
