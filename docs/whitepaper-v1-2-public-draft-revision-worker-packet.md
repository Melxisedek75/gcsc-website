# Whitepaper v1.2 Public Draft Revision Worker Packet

Date: 2026-05-15 PT

Status: internal local-only worker packet for splitting approved public draft revision work across Codex, Kimi, and Claude.

This packet does not approve public publication, website edits, PDF release, investor outreach, grant submission, legal advice, provider commitments, live Supabase changes, deployment, external account changes, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Worker Packet Boundary

Use this packet only after a non-secret founder response has been captured and sorted through:

1. `docs/whitepaper-v1-2-public-draft-founder-response-intake.md`
2. `docs/whitepaper-v1-2-public-draft-revision-plan.md`
3. `docs/whitepaper-v1-2-public-draft-revision-checklist.md`

Workers may draft local changes, reports, checklists, and review notes. Workers must not publish, deploy, contact providers, edit public surfaces, touch live systems, move money, sign XPR transactions, or make legal/finance/provider commitments.

## Source Files

| Source | Purpose |
| --- | --- |
| `docs/whitepaper-v1-2-public-draft.md` | Internal draft to revise locally |
| `docs/whitepaper-v1-2-public-draft-review-report.md` | Source coverage and claim-risk report |
| `docs/whitepaper-v1-2-public-draft-founder-review-packet.md` | Founder review surface |
| `docs/whitepaper-v1-2-public-draft-founder-response-intake.md` | Non-secret founder feedback intake |
| `docs/whitepaper-v1-2-public-draft-revision-plan.md` | Revision batch plan |
| `docs/whitepaper-v1-2-public-draft-revision-checklist.md` | Execution checklist |
| `docs/whitepaper-v1-2-claim-review-matrix.md` | Claim-risk guard |
| `docs/whitepaper-v1-2-publication-go-no-go-checklist.md` | Publication gate |

## Parallel Worker Assignments

| Worker | Scope | Output | Must Not Do |
| --- | --- | --- | --- |
| Kimi-A | Wording and structure pass | Proposed local wording patch notes by section | Publish or edit public surfaces |
| Kimi-B | Claim-risk pass | List of risky phrases and safe replacements | Claim legal/provider approval |
| Kimi-C | Contract-backed loan pass | Check all loan wording against exact sentence and provider-review gates | Say real loans are live |
| Kimi-D | Token / GCST / XPR pass | Check roadmap/utility wording against no-yield/no-price/no-collateral rules | Promise token value, yield, or liquidity |
| Kimi-E | AI boundary pass | Check AI stays assistive and non-final | Give AI legal, finance, escrow, or admin authority |
| Claude | Independent audit | PASS/REVISE/HOLD report with severity findings | Merge or publish autonomously |
| Codex | Integration owner | Apply safe local changes, run validators, commit scoped files | Accept live/legal/money actions |

## Worker Output Format

Each worker report must use this format:

```text
Worker:
Source files read:
Sections reviewed:
Findings:
Proposed local-only changes:
Blocked or HOLD items:
Required validators:
PASS / REVISE / HOLD:
```

## Integration Rules

1. Codex integrates only local-only wording/report changes that pass the revision checklist.
2. Any loan, escrow, repayment routing, stablecoin, token collateral, AI final authority, legal/provider, security, public launch, deployment, external account, or money movement request is marked `HOLD`.
3. Every integrated draft change must update the review report.
4. No public website, PDF, deck, investor packet, grant packet, email, social post, announcement, deployment config, external account, live Supabase setting, XPR signature, payment provider, or app-store file may be edited from this packet.
5. Scoped commits must include only the approved local docs and validator changes.

## Verification Commands

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft-revision-worker-packet
npm run check:whitepaper-v1-2-public-draft-revision-checklist
npm run check:whitepaper-v1-2-public-draft-revision-plan
npm run check:whitepaper-v1-2-public-draft
```
