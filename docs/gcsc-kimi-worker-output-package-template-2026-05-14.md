# GCSC Kimi Worker Output Package Template

Date: 2026-05-14 PT

Status: required worker output template for Kimi Wave One.

Purpose: make every Kimi worker result easy for Claude and Codex to audit, accept, reject, or send back for rework without rereading the full chat or guessing what changed.

This template does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Required File Naming

Each Kimi worker must return one report named:

```text
docs/kimi-worker-output-[stream]-[worker-id]-[short-topic].md
```

Examples:

- `docs/kimi-worker-output-a-a03-whitepaper-claims.md`
- `docs/kimi-worker-output-f-f07-api-inventory.md`
- `docs/kimi-worker-output-j-j04-loan-ledger-map.md`
- `docs/kimi-worker-output-q-q02-intake-dry-run.md`
- `docs/kimi-worker-output-s-s03-secret-safety-scan.md`

Use lowercase stream and worker IDs in filenames. Do not overwrite another worker report.

## Required Header

Copy this header exactly and fill in the values:

```text
# Kimi Worker Output: [Stream] [Worker ID] [Short Topic]

Date:
Stream:
Worker ID:
Assigned work order:
Status: ACCEPT_LOCAL_ONLY | ACCEPT_AFTER_INTEGRATOR_EDIT | REWORK_REQUIRED | REJECT_UNTIL_REWORKED | BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW
```

## Required Sections

Every worker report must include these sections in this order:

```text
## Assignment
## Files Read
## Files Created Or Modified
## Commands Run
## Findings
## Proposed Integrator Actions
## Safety Confirmation
## Remaining Blockers
## No-Touch Confirmation
## Worker Final Verdict
```

If a section does not apply, write `None` under the heading. Do not delete the heading.

## Assignment

Include:

- exact stream name;
- exact worker ID;
- assigned work-order file;
- scope in one paragraph;
- expected output files.

## Files Read

List every file read by the worker. Use project-relative paths only.

Example:

```text
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md
```

## Files Created Or Modified

List every created or modified file. If the worker only reports findings, write `None`.

Do not include:

- `.env` files;
- credentials;
- Magic Link URLs;
- screenshots with private content;
- external account exports;
- live Supabase dumps.

## Commands Run

List exact local commands and results. If Kimi cannot run commands, write:

```text
Not run by Kimi. Codex must verify locally.
```

## Findings

Use severity labels:

- `Critical`
- `High`
- `Medium`
- `Low`
- `Info`

Every finding must include:

- source file;
- short issue or observation;
- why it matters;
- proposed local-only next step.

## Proposed Integrator Actions

Give Codex exact next actions, but keep them local-only.

Allowed examples:

- create a new internal doc;
- add a deterministic local validator;
- update a package script through Codex integrator only;
- run a named existing check;
- route to Claude for audit;
- route to founder/legal/provider review.

Forbidden examples:

- apply live Supabase SQL;
- deploy to Vercel or GitHub Pages;
- change DNS;
- send tester invites;
- contact investors, attorneys, providers, or lenders;
- approve real loans, escrow, repayment routing, stablecoin settlement, token collateral, or money movement.

## Safety Confirmation

The worker must copy and complete this block:

```text
Safety Confirmation:
- No secrets included: yes/no
- No live Supabase changes: yes/no
- No external account changes: yes/no
- No public file edits: yes/no
- No legal/provider conclusions: yes/no
- No real payment/loan/escrow/repayment/stablecoin/token-collateral action: yes/no
- No deployment/app-store/XPR signature action: yes/no
```

Any `no` answer means the package status must be `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW` or `REJECT_UNTIL_REWORKED`.

## Remaining Blockers

Use one of these blocker classes:

- `FOUNDER_DECISION`
- `LEGAL_REVIEW`
- `FINANCE_PROVIDER_REVIEW`
- `PAYMENT_OR_ESCROW_PROVIDER_REVIEW`
- `SECURITY_REVIEW`
- `LIVE_SUPABASE_APPROVAL`
- `DEPLOY_ACCOUNT_ACTION`
- `MOBILE_STORE_ACCOUNT_ACTION`
- `SECRET_REQUIRED`
- `NONE`

## No-Touch Confirmation

The worker must copy this sentence exactly:

```text
I did not touch secrets, live systems, external accounts, public files, provider setup, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app stores, deployment, or destructive actions.
```

## Worker Final Verdict

Choose exactly one:

| Verdict | Meaning |
| --- | --- |
| `ACCEPT_LOCAL_ONLY` | scoped, safe, complete enough for Codex local intake |
| `ACCEPT_AFTER_INTEGRATOR_EDIT` | useful, but Codex must wire shared files or validators |
| `REWORK_REQUIRED` | useful, but missing detail, files, commands, or evidence |
| `REJECT_UNTIL_REWORKED` | changed locked files, crossed structure rules, or conflicts with source of truth |
| `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW` | touches live/legal/money/secrets/provider/public launch decisions |

## Controller Bundle Requirement

The Kimi controller must return:

- one controller summary;
- one worker report per dispatched agent;
- a missing-report list;
- a created/modified file index grouped by stream;
- a rejected locked-file edit list;
- a blocked-for-founder/external review list;
- a recommended Codex merge order.

Codex and Claude should reject the bundle if worker reports are missing required sections.
