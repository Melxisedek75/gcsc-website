# Whitepaper v1.2 Public Draft Revision Plan

Date: 2026-05-15 PT

Status: internal local-only revision plan for applying non-secret founder feedback from `docs/whitepaper-v1-2-public-draft-founder-response-intake.md`.

This plan does not approve public publication, website edits, PDF release, investor outreach, grant submission, legal advice, provider commitments, live Supabase changes, deployment, external account changes, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Revision Plan Boundary

Use this file only after founder comments have been captured in the founder response intake.

Every revision remains local and internal until the public draft, review report, claim-review guard, and publication go/no-go records pass their separate approvals.

Do not use this file to record secrets, Magic Link URLs, private keys, seed phrases, API keys, service-role keys, database passwords, wallet material, private customer data, provider credentials, legal advice, or private attorney/provider messages.

## Inputs

| Source | Required Before Revision |
| --- | --- |
| `docs/whitepaper-v1-2-public-draft-founder-response-intake.md` | Founder comments captured as ACCEPT / REVISE / HOLD |
| `docs/whitepaper-v1-2-public-draft-founder-review-packet.md` | Review area and report-back format available |
| `docs/whitepaper-v1-2-public-draft.md` | Current internal draft under edit |
| `docs/whitepaper-v1-2-public-draft-review-report.md` | Source and claim coverage report |
| `docs/whitepaper-v1-2-claim-review-matrix.md` | Safe, review-required, and blocked claim guard |
| `docs/whitepaper-v1-2-publication-go-no-go-checklist.md` | Publication gate remains separate |

## Revision Batches

| Batch | Scope | Trigger | Safe Output | Status |
| --- | --- | --- | --- | --- |
| WP12-RP-001 | Wording-only cleanup | Founder marks REVISE for clarity, tone, order, or readability | Local draft wording patch plus updated review report note | READY_WHEN_INTAKE_EXISTS |
| WP12-RP-002 | Claim-risk correction | Founder/legal/provider/security flags a claim as too strong | Replace claim with safer wording or move to HOLD list | READY_WHEN_REVIEWED |
| WP12-RP-003 | Structure adjustment | Founder asks to reorder sections or move concept placement | Local outline patch with source-map check | READY_WHEN_INTAKE_EXISTS |
| WP12-RP-004 | Contract-backed loan wording | Founder asks to tune working-capital language | Use exact sentence register and public use gate before any public wording | HOLD_FOR_PROVIDER_REVIEW |
| WP12-RP-005 | Token / GCST / XPR wording | Founder asks to tune utility or roadmap language | Keep as roadmap/utility language with no price, yield, collateral, or live settlement claim | HOLD_FOR_CLAIM_REVIEW |
| WP12-RP-006 | AI wording | Founder asks to strengthen AI claims | Keep AI as assistive review/routing only, never final legal, finance, escrow, payment-release, or admin authority | HOLD_FOR_CLAIM_REVIEW |

## Draft Change Rules

1. Preserve the public draft's no-real-money, no-live-loan, no-live-escrow, no-token-collateral, no-provider-commitment, no-legal-advice, and no-publication boundary.
2. Keep all founder feedback non-secret and local.
3. For every changed section, update the review report with source and claim-risk notes.
4. If a revision touches lending, escrow, stablecoin, repayment routing, token collateral, legal/compliance, AI authority, or provider roles, mark it `HOLD_FOR_REVIEW` until the matching review packet approves it.
5. Do not edit public website, PDF, investor packet, grant packet, deck, email, social post, or announcement files from this plan.

## Blocked Revision Requests

Route to `HOLD` if a request asks Codex to:

- publish, send, submit, announce, deploy, or update public files now;
- say real loans are live, available, approved, funded, originated, or underwritten;
- say escrow is live, funds are held, repayment routing is live, stablecoin settlement is live, or token collateral is active;
- guarantee token price, yield, liquidity, appreciation, buybacks, income, legal status, or collateral value;
- say AI makes final legal, financial, lending, insurance, compliance, escrow, payment-release, or admin decisions;
- say legal/provider/security review is complete without recorded approval evidence;
- touch live Supabase, deploy settings, external accounts, payment providers, XPR signatures, app stores, or secrets.

## Verification Commands

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft-revision-plan
npm run check:whitepaper-v1-2-public-draft-founder-response-intake
npm run check:whitepaper-v1-2-public-draft
```
