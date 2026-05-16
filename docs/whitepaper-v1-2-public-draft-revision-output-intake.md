# Whitepaper v1.2 Public Draft Revision Output Intake

Date: 2026-05-15 PT

Status: INTERNAL_OUTPUT_INTAKE_ONLY

## Purpose

Give Codex one local-only intake record for handling future Kimi, Claude, or Codex whitepaper v1.2 public draft revision outputs before any local draft integration happens.

This intake turns worker output into auditable local decisions: accept, revise, reject, or hold.

## What This Does Not Approve

This intake does not approve public publication.

This intake does not approve website edits.

This intake does not approve investor outreach.

This intake does not approve legal/provider decisions.

This intake does not approve live Supabase changes.

This intake does not approve deployment.

This intake does not approve real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, or money movement.

## Source Documents

- `docs/whitepaper-v1-2-public-draft-revision-worker-packet.md`
- `docs/whitepaper-v1-2-public-draft-revision-checklist.md`
- `docs/whitepaper-v1-2-public-draft-revision-plan.md`
- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`

## Allowed Intake Sources

Allowed source workers:

- `Kimi-A`
- `Kimi-B`
- `Kimi-C`
- `Kimi-D`
- `Kimi-E`
- `Claude-Audit`
- `Codex-Integration`

Only non-secret local text reports are allowed. Do not paste screenshots, recordings, raw logs, private customer data, tester identities, Magic Link URLs, provider credentials, API keys, database URLs, wallet data, payment data, or legal/provider private messages into this intake.

## Required Intake Record

Each proposed worker output item must be reduced to this record before Codex can touch the internal draft:

```text
source_worker:
source_files_read:
sections_reviewed:
proposed_local_change_id:
affected_sections:
claim_risk_class: low / medium / high / blocked-live
decision:
required_validator:
owner:
publication_status:
redaction_status:
notes:
```

## Decision States

| State | Meaning | Allowed Next Step |
| --- | --- | --- |
| `ACCEPT_LOCAL_ONLY` | Safe local wording or review-report change may be integrated | Run required validators before commit |
| `REVISE_LOCAL_ONLY` | Worker idea is useful but needs local rewrite | Rewrite locally and re-check |
| `REJECT` | Output is not useful or conflicts with source docs | Record reason, do not integrate |
| `HOLD_FOR_REVIEW` | Metadata or evidence is missing | Request or prepare safer evidence |
| `HOLD_FOR_REDACTION` | Private, secret, or raw evidence risk exists | Redact outside tracked docs before reuse |
| `HOLD_FOR_CLAIM_RISK_REVIEW` | Claim could imply live finance, legal, provider, token, AI, or deployment readiness | Route through claim matrix and founder/legal/provider review |
| `HOLD_FOR_FOUNDER_REVIEW` | Needs founder decision or external/live boundary | Stop before action |

Allowed publication statuses:

- `INTERNAL_DRAFT_ONLY`
- `REVIEW_REPORT_ONLY`
- `PUBLICATION_BLOCKED`

Worker output cannot set `PUBLICATION_APPROVED`, `WEBSITE_READY`, `INVESTOR_READY`, `PROVIDER_READY`, `LEGAL_APPROVED`, `DEPLOY_READY`, or `LIVE_READY`.

## Acceptance Rules

Any missing source_worker, source_files_read, claim_risk_class, required_validator, owner, publication_status, or redaction_status defaults to HOLD_FOR_REVIEW.

Any private customer data, tester identities, Magic Link URLs, screenshots, recordings, raw logs, secrets, provider credentials, API keys, database URLs, wallet data, or payment data defaults to HOLD_FOR_REDACTION.

Any claim-risk class of `blocked-live` defaults to HOLD_FOR_CLAIM_RISK_REVIEW unless the change removes or weakens the risky claim.

Kimi and Claude output is advisory only.

Codex may integrate only local wording or review-report updates after validator evidence is recorded.

## Automatic HOLD Rules

Any request to publish, deploy, edit public surfaces, contact providers, send investor material, make legal/provider commitments, move money, enable loans, release escrow, route repayment, settle stablecoins, lock token collateral, sign XPR actions, or change live Supabase defaults to HOLD_FOR_FOUNDER_REVIEW.

Any output that says real loans are live, escrow is active, repayment routing is active, stablecoin settlement is active, token collateral is available, AI makes final legal/finance decisions, provider review is complete, legal review is complete, or public launch is approved defaults to HOLD_FOR_CLAIM_RISK_REVIEW.

Any output with private names, emails, phone numbers, addresses, account IDs, wallet IDs, Magic Link URLs, cookies, Authorization headers, screenshots, recordings, raw logs, API keys, service-role keys, database URLs, or provider credentials defaults to HOLD_FOR_REDACTION.

## Codex Integration Steps

1. Read the worker output and reduce it to the required intake record.
2. Assign a decision state.
3. If the state is HOLD, stop and record the reason.
4. If the state is `REVISE_LOCAL_ONLY`, rewrite locally without carrying unsafe claims forward.
5. If the state is `ACCEPT_LOCAL_ONLY`, update only the internal public draft or review report.
6. Run targeted validators.
7. Run the full check if package wiring, shared docs, or validator behavior changed.
8. Commit only scoped local files.

## Required Checks

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft-revision-output-intake
npm run check:whitepaper-v1-2-public-draft-revision-worker-packet
npm run check:whitepaper-v1-2-public-draft-revision-checklist
npm run check:whitepaper-v1-2-public-draft
npm run check:real-status-audit
npm run check
```

## Acceptance Check

Future worker outputs can be intake-reviewed with required metadata, decision states, redaction gates, claim-risk gates, founder-review holds, validator evidence, and local-only integration rules before any internal whitepaper draft change is accepted.
