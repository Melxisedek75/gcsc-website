# Working Capital Language Style Guide

Date: 2026-06-06 PT

Status: WORKING_CAPITAL_LANGUAGE_STYLE_GUIDE_REVIEW_ONLY

Purpose: give Codex, Kimi, and future reviewers one conservative language guide for SmartContractor working-capital, contract-backed loan, repayment waterfall, escrow-ready milestone, and provider-review wording.

This guide does not approve public website replacement, public whitepaper publication, lender/provider outreach, legal conclusions, provider commitments, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, XPR/FIO signatures, production release, or AI final authority.

## Source Documents

- `docs/whitepaper-v1-3-claim-risk-register.md`
- `docs/whitepaper-v1-3-public-draft.md`
- `docs/whitepaper-v1-3-smartcontractor-wording-alignment.md`
- `docs/whitepaper-v1-3-smartcontractor-wording-review-status.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/repayment-waterfall-algorithm-spec-review-only.md`
- `docs/smart-contract-complete-boundary-matrix.md`
- `docs/smartcontractor-loan-legal-risk-model.md`

## Core Rule

SmartContractor may describe working capital as readiness, records, evidence, review packets, and provider-reviewed future paths. It must not describe working capital as live credit approval, live loan origination, lender commitment, escrow release, payment movement, token collateral, stablecoin settlement, or AI-approved finance.

## Allowed Current Wording

Use these phrases when describing the current local/demo product:

- working-capital readiness;
- partner-reviewed working-capital readiness;
- lender/provider-reviewed working-capital data;
- signed-project-contract readiness packet;
- contractor funding readiness record;
- milestone evidence for future provider review;
- repayment waterfall draft;
- local repayment allocation preview;
- escrow-ready milestone records;
- payment-intent record;
- audit trail;
- request ID;
- no-real-money beta;
- local review only;
- review-required;
- blocked for live action.

## Future Or Review-Required Wording

Use these only with clear future/review context:

| Topic | Required Context |
| --- | --- |
| working capital | future, partner-reviewed, or provider-reviewed unless explicitly local readiness only |
| loan | future provider-reviewed loan path; not GCSC approval, funding, servicing, or guarantee |
| repayment waterfall | local draft allocation or future provider/payment/legal reviewed routing |
| escrow | escrow-ready record or licensed/provider-reviewed escrow path |
| stablecoin settlement | future provider-reviewed settlement path, not live |
| token collateral | future token-collateral review, not live lock/custody/liquidation |
| AI risk review | recommendation or summary only, never final approval |
| lender/provider | candidate, reviewer, or future partner only unless written approval exists |

## Blocked Wording

Do not use these phrases in public, product-facing, investor, partner, Kimi, or founder-ready copy unless the sentence is explicitly a risk register, blocked-action row, or correction note:

- instant loan approval;
- guaranteed loan;
- GCSC approves loans;
- GCSC funds contractors;
- GCSC services loans;
- GCSC holds escrow;
- automatic escrow release;
- automatic repayment routing;
- guaranteed homeowner protection;
- guaranteed contractor funding;
- reputation as collateral;
- token collateral is live;
- stablecoin settlement is live;
- AI approves credit;
- AI releases funds;
- lender approved;
- provider approved;
- legally approved;
- escrow licensed;
- risk-free;
- guaranteed return;
- passive income;
- investment token;
- public NFT investment;
- Metallicus approved;
- FIO payment approval;
- XPR settlement is live.

## Replacement Table

| Risky Wording | Safer Replacement |
| --- | --- |
| instant loan | working-capital readiness review |
| loan approval | provider-reviewed financing decision |
| GCSC provides contractor loans | GCSC organizes lender/provider-reviewed working-capital data |
| contractor funding is guaranteed | contractor funding path requires provider/founder/legal review |
| smart escrow | escrow-ready milestone record |
| escrow release | milestone release recommendation or provider-reviewed release path |
| repayment routing | local repayment allocation preview or future provider-reviewed routing |
| reputation as collateral | reputation as underwriting context |
| token collateral | future token-collateral review |
| stablecoin settlement | future provider-reviewed settlement path |
| AI underwriting approval | AI-assisted review note |
| FIO payment request | future FIO UX research path |
| Metallicus/XPR integration | Metallicus/XPR candidate infrastructure research path |

## Audience Rules

| Audience | Allowed Level |
| --- | --- |
| Homeowner | evidence, milestone status, no-real-money beta, dispute packet, provider-reviewed future payment/escrow path |
| Contractor | readiness packet, required evidence, review state, no guarantee, no live funding promise |
| Admin/founder | local labels, blocker states, request IDs, required review gates, exact blocked next action |
| Investor/grant reviewer | construction trust infrastructure, partner-reviewed finance path, no live finance claim |
| Provider/legal reviewer | question packet, technical requirements, blocked-live gates, not final legal conclusion |
| Kimi/Codex worker | local-only classification, no public edit, no live action, no approval language |

## Required Sentence Pattern

When writing about working capital, include all four parts when practical:

```text
SmartContractor currently [does local thing] for [review purpose].
It does not [blocked live thing].
Any real [loan/payment/escrow/repayment/collateral] action requires [founder/legal/provider/security review].
Current status: [LOCAL_ONLY / REVIEW_REQUIRED / BLOCKED_FOR_LIVE].
```

Example:

```text
SmartContractor currently prepares working-capital readiness packets from signed project contracts, milestone evidence, contractor records, and repayment waterfall drafts. It does not approve, fund, service, or guarantee loans. Any real financing, payment movement, escrow release, repayment routing, stablecoin settlement, or token collateral requires founder, legal, provider, finance-provider, and security review. Current status: BLOCKED_FOR_LIVE.
```

## Modal Verb Rules

| Use | Avoid |
| --- | --- |
| may support | supports as live |
| can prepare | provides |
| can organize | approves |
| future reviewed path | active product |
| provider-reviewed | guaranteed |
| review-required | ready |
| local-only | production |
| draft allocation | repayment routing |
| readiness record | loan decision |

## State Labels

Use these state labels consistently:

- `LOCAL_ONLY`
- `REVIEW_REQUIRED`
- `PROVIDER_REVIEW_REQUIRED`
- `LEGAL_PROVIDER_REQUIRED`
- `FOUNDER_REVIEW_REQUIRED`
- `SECURITY_REVIEW_REQUIRED`
- `BLOCKED_FOR_LIVE`
- `NO_REAL_MONEY`
- `NO_PUBLICATION_GO`

Do not use `APPROVED`, `GO`, `READY`, `LIVE`, `PASSED`, or `COMPLETE` near working-capital claims unless the sentence clearly says what local-only check passed and what live action remains blocked.

## Red-Flag Rewrite Checks

Before accepting a working-capital sentence, ask:

1. Could a contractor think funding is guaranteed?
2. Could a homeowner think GCSC is holding or releasing escrow?
3. Could a provider think GCSC is claiming a lender or broker role?
4. Could a regulator read this as a public lending, securities, escrow, payment, or money-transmission claim?
5. Could Kimi or another worker treat this as live approval?
6. Does the sentence name the live blocker and review owner?

If any answer is yes or unclear, rewrite the sentence with local-only, future, provider-reviewed, or blocked-live wording.

## Publication Boundary

This guide may support local drafts, review packets, admin copy, and Kimi/Codex worker instructions. It does not approve use in `index.html`, `whitepaper.html`, PDFs, decks, emails, social posts, public beta invites, provider outreach, investor sends, grant submissions, or public announcements.

## Required Local Checks

Use the relevant existing checks before relying on this guide:

```powershell
npm --prefix construction-ai run check:whitepaper-v1-3-smartcontractor-wording
npm --prefix construction-ai run check:whitepaper-v1-3-claim-risk-hardening
npm --prefix construction-ai run check:whitepaper-v1-3-public-wording-scan-status
npm --prefix construction-ai run check:whitepaper-v1-2-contract-backed-loan-technical-requirements
npm --prefix construction-ai run check:smartcontractor
```

If any check fails, working-capital language stays `HOLD_FOR_REWRITE` and `BLOCKED_FOR_LIVE`.
