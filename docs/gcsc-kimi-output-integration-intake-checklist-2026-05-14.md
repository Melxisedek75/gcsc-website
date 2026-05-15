# GCSC / SmartContractor Kimi Output Integration Intake Checklist

Date: 2026-05-14 PT

Status: internal Codex/Claude intake checklist for Kimi output review.

Purpose: make Kimi's parallel output fast to accept, reject, or route without letting 100 agents create unsafe merges, shared-file conflicts, public overclaims, live-system drift, or secret leakage.

This checklist is not approval for public launch, deployment, live Supabase changes, external account changes, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, legal decisions, provider commitments, secrets handling, or destructive actions.

## Intake Rule

No Kimi output is merged only because it exists. Every package must pass this intake sequence:

1. Identify stream and assigned file set.
2. Confirm no locked files changed.
3. Confirm no stop boundary was crossed.
4. Read worker report before reading code/docs.
5. Run targeted validators.
6. Review public/legal/money/security claims.
7. Batch shared-file changes through one Codex integrator.
8. Commit only scoped accepted files.

## Required Worker Report Fields

Reject or send back any worker package that does not follow `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md` and include:

- worker ID and stream;
- files read;
- files created or modified;
- exact commands run and results;
- findings ranked by severity when relevant;
- proposed integrator actions;
- safety confirmation;
- remaining blockers;
- explicit no-touch confirmation for live/external/legal/money/secrets.

## Locked File Check

Before reviewing content, run:

```powershell
cd C:\gcsc
git status --short --branch
git diff --name-only
```

Flag as `REJECT_UNTIL_REWORKED` if a non-integrator worker changed:

- `construction-ai/package.json`;
- `construction-ai/server.js`;
- `whitepaper.html`;
- `index.html`;
- `AGENTS.md`;
- `GEMINI.md`;
- `.claude/CLAUDE.md`;
- `.env*`;
- deploy/account/provider/store/wallet files;
- live Supabase migration/apply files not explicitly assigned.

## Stop Boundary Check

Flag as `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW` if output includes:

- passwords, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, or raw database passwords;
- live Supabase writes or live SQL apply instructions;
- Vercel, Namecheap, GitHub Pages, payment provider, app store, wallet, or external account changes;
- real payment, loan, escrow, repayment routing, stablecoin settlement, token collateral, or production money movement;
- legal, securities, escrow, lending, custody, AML, tax, provider, or public launch conclusions;
- public claim that GCSC is approved, certified, insured, audited, registered, compliant, live-funded, or revenue-guaranteed without approved evidence.

## Intake States

| State | Meaning | Codex Action |
| --- | --- | --- |
| `ACCEPT_LOCAL_ONLY` | scoped, safe, checks pass | stage, commit, push |
| `ACCEPT_AFTER_INTEGRATOR_EDIT` | good output but needs shared-file script/config wiring | keep worker files, batch shared edit separately |
| `REWORK_REQUIRED` | useful but incomplete, unclear, or missing report/checks | return exact rework notes |
| `REJECT_UNTIL_REWORKED` | edited locked files or conflicts with source of truth | do not merge |
| `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW` | touches live/legal/money/secrets/provider/public launch | stop and escalate |

## Stream-Specific Intake

### Stream A: Public Whitepaper v1.2 Draft

Required files:

- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`
- `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs`

Required checks:

```powershell
cd C:\gcsc\construction-ai
node scripts/validate-whitepaper-v1-2-public-draft.mjs
npm run check:whitepaper-v1-2-public-wording-package
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-publish-gate
```

Reject if the draft implies live lending, live escrow, automatic payment release, stablecoin settlement, token collateral, AI final approval, guaranteed yield, token appreciation, regulatory approval, or public publication approval.

### Stream F: API/OpenAPI Inventory

Required files:

- `docs/smartcontractor-openapi-inventory.md`
- `docs/smartcontractor-api-contract-v1.yaml`
- `construction-ai/scripts/validate-openapi-inventory.mjs`

Required checks:

```powershell
cd C:\gcsc\construction-ai
node scripts/validate-openapi-inventory.mjs
npm run check:auth
```

Reject if any `/api/*` route is omitted, request_id behavior is missing, production URLs/secrets are included, or live-risk boundaries are absent.

### Stream N: Public Artifact Safety

Required files:

- `docs/public-artifact-safety-audit.md`
- `construction-ai/scripts/validate-public-artifact-safety.mjs`

Required checks:

```powershell
cd C:\gcsc\construction-ai
node scripts/validate-public-artifact-safety.mjs
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-public-excerpt-guard
```

Critical or High findings must be reviewed before any other Kimi output is merged.

### Stream J: Smart Contract Local Build Map

Required output:

- `docs/smartcontractor-smart-contract-kimi-build-map.md`
- local-only fixture or validator proposals if assigned.

Required checks depend on touched files, but start with:

```powershell
cd C:\gcsc\construction-ai
npm run check:smart-contract-state-helpers-local
npm run check:smart-contract-local-replay
npm run check:whitepaper-v1-2-smart-contract-module-split-anti-backdoor
```

Reject if any output enables live XPR signatures, token movement, hidden owner powers, arbitrary balance mutation, AI-only final approval, dispute bypass, or live deployment authority.

## Shared Package Script Intake

Workers may propose package scripts. Only Codex integrator applies them.

Allowed proposed names:

- `check:whitepaper-v1-2-public-draft`
- `check:openapi-inventory`
- `check:public-artifact-safety`

Before adding any script:

1. Confirm script target exists under `construction-ai/scripts/`.
2. Confirm script uses local deterministic reads only.
3. Confirm script does not call network, live Supabase, provider APIs, wallets, or external accounts.
4. Run the script directly with `node`.
5. Add script in one scoped integrator commit.

## Merge Commit Template

```text
Integrate Kimi [stream] [short package name]

- accepted files:
- checks:
- rejected/deferred files:
- safety:
```

## Founder/Claude Escalation Triggers

Escalate before merge if:

- public whitepaper wording is persuasive but close to legal/financial claims;
- Stream N reports Critical or High findings;
- OpenAPI inventory discovers undocumented auth/admin route ambiguity;
- smart contract review finds hidden authority or live-deployment ambiguity;
- deployment/beta output asks for account login, DNS, env secrets, provider setup, or public URL launch;
- any output materially changes GCSC positioning, token economics, lending language, escrow language, or public launch timing.

## Final Integration Verification

After accepting any Kimi package:

```powershell
cd C:\gcsc
git diff --check
cd C:\gcsc\construction-ai
npm run check:real-status-audit
```

Run full `npm run check` when:

- package scripts changed;
- backend/frontend/smart-contract files changed;
- more than one stream is integrated;
- any safety validator changed;
- public whitepaper or website files are touched by a later approved integration.

Before any post-Claude integration batch, create a merge queue using `docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md`.

## Current Safe Intake Priority

1. Stream N safety output.
2. Stream F API/OpenAPI output.
3. Stream A public whitepaper draft.
4. Stream J smart contract local build map.
5. Wave 2 public surface prep.
6. Wave 3 backend/auth/deploy/mobile/AI/XPR outputs.
