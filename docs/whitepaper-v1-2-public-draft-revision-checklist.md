# Whitepaper v1.2 Public Draft Revision Checklist

Date: 2026-05-15 PT

Status: internal local-only checklist for executing approved revision batches from `docs/whitepaper-v1-2-public-draft-revision-plan.md`.

This checklist does not approve public publication, website edits, PDF release, investor outreach, grant submission, legal advice, provider commitments, live Supabase changes, deployment, external account changes, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Checklist Boundary

Use this checklist only after a founder response intake item has been sorted into a revision batch.

Every checked item remains internal and local until the public draft, review report, claim review, publication go/no-go, and required founder/legal/provider/security approvals are recorded separately.

Do not use this checklist to store secrets, Magic Link URLs, private keys, seed phrases, API keys, service-role keys, database passwords, wallet material, private customer data, provider credentials, legal advice, or private attorney/provider messages.

## Required Inputs

| Input | Required State |
| --- | --- |
| Founder response intake | Non-secret founder note captured |
| Revision plan | Matching `WP12-RP-*` batch selected |
| Public draft | Current internal draft identified |
| Review report | Source and claim-risk update target identified |
| Claim review matrix | Blocked or review-required claims checked |
| Publication go/no-go checklist | Public use remains blocked |

## Execution Checklist

| Step | Check | Required Result |
| --- | --- | --- |
| 1 | Confirm request contains no secrets or private customer/provider/legal data | PASS or STOP |
| 2 | Classify the request as wording, structure, claim-risk, legal-provider, finance-provider, technical-security, or publication | One risk type selected |
| 3 | Match the request to `WP12-RP-001` through `WP12-RP-006` | Batch selected |
| 4 | Confirm whether any live-risk wording is involved | If yes, mark `HOLD_FOR_REVIEW` |
| 5 | Draft only local changes to the internal whitepaper draft | No public file edited |
| 6 | Update the review report with source and claim-risk notes | Report updated |
| 7 | Run targeted validators | PASS before commit |
| 8 | Run full check if package wiring or shared docs changed | PASS before commit |
| 9 | Commit only scoped local files | No unrelated files staged |

## Automatic Stop Conditions

Stop and route to founder/legal/provider/finance/security review if the revision request asks to:

- publish, send, submit, announce, deploy, or update public files now;
- say real loans are live, available, approved, funded, originated, or underwritten;
- say escrow is live, funds are held, repayment routing is live, stablecoin settlement is live, or token collateral is active;
- guarantee token price, yield, liquidity, appreciation, buybacks, income, legal status, or collateral value;
- say AI makes final legal, financial, lending, insurance, compliance, escrow, payment-release, or admin decisions;
- say legal/provider/security review is complete without recorded approval evidence;
- touch live Supabase, deploy settings, external accounts, payment providers, XPR signatures, app stores, or secrets.

## Required Verification

Run these after any checklist-driven revision:

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft-revision-checklist
npm run check:whitepaper-v1-2-public-draft-revision-plan
npm run check:whitepaper-v1-2-public-draft-founder-response-intake
npm run check:whitepaper-v1-2-public-draft
```
