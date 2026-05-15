# GCSC Codex Kimi Integration Merge Queue Template

Date: 2026-05-14 PT

Status: required Codex intake queue template after Kimi Wave One and Claude audit.

Purpose: turn Kimi worker reports plus Claude audit verdicts into a safe, ordered Codex integration queue with one scoped commit per accepted stream.

This template does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Required File Naming

Codex should create one queue file named:

```text
docs/codex-kimi-integration-merge-queue-wave-one-[date].md
```

Example:

```text
docs/codex-kimi-integration-merge-queue-wave-one-2026-05-15.md
```

## Required Inputs

Codex must read these before creating or updating the merge queue:

1. Kimi controller summary.
2. Kimi worker reports.
3. Kimi-created or Kimi-modified local files.
4. `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md`.
5. Claude audit report using `docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md`.
6. `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md`.
7. Current `git status --short --branch`.

## Required Header

```text
# Codex Kimi Integration Merge Queue: Wave One

Date:
Prepared by:
Kimi controller summary reviewed: yes/no
Claude audit report reviewed: yes/no
Current branch:
Overall queue status: READY_LOCAL_ONLY | PARTIAL_READY | REWORK_REQUIRED | BLOCKED_EXTERNAL_REVIEW | FAIL_UNSAFE
```

## Required Sections

Keep these headings in this exact order:

```text
## Source Inputs
## Hard Reject Precheck
## Stream Queue Matrix
## Accepted Local-Only Streams
## Streams Requiring Rework
## Streams Blocked For Founder External Review
## Commit Plan
## Required Local Checks
## Shared File Edit Plan
## Safety Confirmation
## Final Codex Intake Verdict
```

If a section has no items, write `None`.

## Hard Reject Precheck

Codex must mark `FAIL_UNSAFE` if any Kimi or Claude-returned content includes:

- passwords, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, raw database passwords, Magic Link URLs, or private session links;
- live Supabase writes, live RLS apply, admin membership insert, production SQL, service-role instructions, deployment, DNS, app-store, provider, wallet, or external account changes;
- real payment, real loan, escrow release, repayment routing, stablecoin settlement, token collateral lock, XPR signature, token transfer, or money movement actions;
- legal, securities, escrow, lending, custody, AML, tax, provider, compliance, public launch, lender approval, escrow readiness, stablecoin readiness, token collateral readiness, or production readiness conclusions;
- public website, public whitepaper, deck, email, social, grant, investor, or outreach edits outside an explicitly approved local-only draft path.

## Stream Queue Matrix

Codex must fill this table before integration:

| Stream | Kimi worker verdict | Claude verdict | Codex intake state | Files proposed | Required checks | Commit allowed |
| --- | --- | --- | --- | --- | --- | --- |
| N |  |  |  |  |  | yes/no |
| F |  |  |  |  |  | yes/no |
| A |  |  |  |  |  | yes/no |
| J |  |  |  |  |  | yes/no |
| K |  |  |  |  |  | yes/no |
| L |  |  |  |  |  | yes/no |
| H |  |  |  |  |  | yes/no |
| I |  |  |  |  |  | yes/no |
| O |  |  |  |  |  | yes/no |
| M |  |  |  |  |  | yes/no |
| Q |  |  |  |  |  | yes/no |
| S |  |  |  |  |  | yes/no |

Allowed Codex intake states:

- `ACCEPT_LOCAL_ONLY`
- `ACCEPT_AFTER_INTEGRATOR_EDIT`
- `REWORK_REQUIRED`
- `REJECT_UNTIL_REWORKED`
- `BLOCKED_FOR_FOUNDER_OR_EXTERNAL_REVIEW`

## Commit Plan

Use one row per scoped commit:

| Order | Stream | Commit name | Files to stage | Checks before commit | Checks after commit |
| ---:| --- | --- | --- | --- | --- |
| 1 | N |  |  |  |  |
| 2 | F |  |  |  |  |
| 3 | A |  |  |  |  |
| 4 | J |  |  |  |  |
| 5 | K |  |  |  |  |
| 6 | L |  |  |  |  |
| 7 | H |  |  |  |  |
| 8 | I |  |  |  |  |
| 9 | O |  |  |  |  |
| 10 | M |  |  |  |  |

Do not create a combined mega-commit across unrelated streams.

## Required Local Checks

Minimum checks after each accepted stream:

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

## Shared File Edit Plan

Codex integrator owns edits to shared files:

- `construction-ai/package.json`;
- `construction-ai/scripts/run-checks.mjs`;
- `docs/gcsc-active-context.md`;
- `docs/smartcontractor-backlog.md`;
- `docs/gcsc-real-status-audit-2026-05-11.md`;
- any central validator.

Kimi worker changes to these files must be treated as proposals, not accepted patches.

## Safety Confirmation

Codex must copy and complete:

```text
Safety Confirmation:
- No secrets in accepted files: yes/no
- No live Supabase changes: yes/no
- No external account changes: yes/no
- No public file edits without approval: yes/no
- No legal/provider conclusions accepted as facts: yes/no
- No real payment/loan/escrow/repayment/stablecoin/token-collateral action: yes/no
- No deployment/app-store/XPR signature action: yes/no
```

Any `no` answer blocks integration.

## Final Codex Intake Verdict

Choose exactly one:

| Verdict | Meaning |
| --- | --- |
| `READY_LOCAL_ONLY` | at least one stream can be integrated safely now |
| `PARTIAL_READY` | some streams can be integrated, others need rework or external review |
| `REWORK_REQUIRED` | nothing should be integrated until Kimi fixes specific items |
| `BLOCKED_EXTERNAL_REVIEW` | founder/legal/provider/security/account review is needed before integration |
| `FAIL_UNSAFE` | unsafe content exists and must be removed before any merge |

Codex must commit only scoped files from `READY_LOCAL_ONLY` or safe portions of `PARTIAL_READY`.
