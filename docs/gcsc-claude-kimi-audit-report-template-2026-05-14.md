# GCSC Claude Kimi Audit Report Template

Date: 2026-05-14 PT

Status: required Claude audit report template for Kimi Wave One output.

Purpose: force the post-Kimi Claude review into one structured report that Codex can use to accept, rework, reject, or block each stream without guessing from free-form notes.

This template does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Required File Naming

Claude should return one report named:

```text
docs/claude-kimi-audit-report-wave-one-[date].md
```

Example:

```text
docs/claude-kimi-audit-report-wave-one-2026-05-15.md
```

## Required Header

```text
# Claude Kimi Audit Report: Wave One

Date:
Reviewer:
Kimi wave:
Controller summary reviewed: yes/no
Worker reports reviewed:
Files inspected:
Overall verdict: PASS_LOCAL_ONLY | REWORK | BLOCKED_EXTERNAL_REVIEW | FAIL_UNSAFE
```

## Required Verdicts

Use only these verdicts:

| Verdict | Meaning | Codex action |
| --- | --- | --- |
| `PASS_LOCAL_ONLY` | safe enough for local Codex intake and validators | integrate as one scoped stream commit |
| `REWORK` | useful but incomplete, unclear, missing report fields, or needs Kimi revision | return exact rework notes |
| `BLOCKED_EXTERNAL_REVIEW` | founder, legal, provider, security, account, or live-system decision is needed | do not integrate as implementation |
| `FAIL_UNSAFE` | secrets, locked-file edits, public edits, live actions, or unsafe claims are present | reject until cleaned and re-audited |

## Required Sections

Claude must include these sections in this order:

```text
## Inputs Reviewed
## Overall Verdict
## Stream Verdict Matrix
## Critical Findings
## High Findings
## Medium Findings
## Low Findings
## Locked-File Violations
## Secret And Credential Findings
## Live-System And Money-Movement Findings
## Legal Provider Public-Claim Findings
## Smart Contract Authority Findings
## Auth RLS Admin Findings
## Deployment Public Beta Findings
## Investor Mobile Wording Findings
## Recommended Codex Merge Order
## Required Rework Before Merge
## Founder External Legal Provider Blockers
## No-Touch Confirmation
```

If a section has no findings, write `None`. Do not remove headings.

## Stream Verdict Matrix

Claude must fill this table:

| Stream | Verdict | Evidence reviewed | Key reason | Codex next action |
| --- | --- | --- | --- | --- |
| A |  |  |  |  |
| F |  |  |  |  |
| N |  |  |  |  |
| J |  |  |  |  |
| H |  |  |  |  |
| I |  |  |  |  |
| O |  |  |  |  |
| M |  |  |  |  |
| K |  |  |  |  |
| L |  |  |  |  |
| Q |  |  |  |  |
| S |  |  |  |  |

## Finding Format

Every finding must use:

```text
- Severity:
- Stream:
- File:
- Evidence:
- Risk:
- Required action:
- Blocks merge: yes/no
```

## Hard Fail Rules

Set overall verdict to `FAIL_UNSAFE` if any Kimi output contains:

- passwords, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, or raw database passwords;
- Magic Link URLs or private account/session links;
- live Supabase writes, live RLS apply, admin membership insert, production SQL, or service-role instructions;
- deployment, DNS, app-store, provider, wallet, or external account changes;
- real payment, real loan, escrow release, repayment routing, stablecoin settlement, token collateral lock, XPR signature, or token transfer actions;
- legal, securities, escrow, lending, custody, AML, tax, provider, or public launch conclusions;
- public website, public whitepaper, deck, email, social, grant, investor, or outreach edits;
- missing required worker report fields for accepted streams.

## Recommended Codex Merge Order

Use only stream IDs and one-line reasons:

```text
1. N - [reason]
2. F - [reason]
3. A - [reason]
4. J - [reason]
5. K - [reason]
6. L - [reason]
7. H - [reason]
8. I - [reason]
9. O - [reason]
10. M - [reason]
```

Do not recommend merging a stream with `REWORK`, `BLOCKED_EXTERNAL_REVIEW`, or `FAIL_UNSAFE`.

## No-Touch Confirmation

Claude must copy this sentence exactly:

```text
I did not approve or perform live Supabase changes, external account changes, public publication, provider commitments, legal decisions, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, deployment, or destructive actions.
```

## Codex Intake Rule

Codex may integrate only streams marked `PASS_LOCAL_ONLY`, and only after local validators pass.

Codex must not integrate `REWORK`, `BLOCKED_EXTERNAL_REVIEW`, or `FAIL_UNSAFE` streams as implementation.
