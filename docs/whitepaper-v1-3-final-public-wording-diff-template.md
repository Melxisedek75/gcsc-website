# GCSC Whitepaper v1.3 Final Public Wording Diff Template

Status: internal final public wording diff template. No final public wording diff is recorded here.

This template does not approve public publication, public website replacement, PDF publishing, routing changes, provider outreach, legal conclusions, provider commitments, live Supabase changes, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or Metallicus/XPR partnership claims.

## Purpose

This template defines the future review rows required before any public v1.3 wording replaces legacy public files. It separates public-safe language review from publication approval.

## Source Pairing

| Evidence ID | Legacy Public Source | Local v1.3 Candidate | Current State |
|---|---|---|---|
| V13-DIFF-WP-01 | `whitepaper.html` | `whitepaper-v1-3-draft.html` | PENDING_DIFF |
| V13-DIFF-HOME-01 | `index.html` | `index-v1-3-draft.html` | PENDING_DIFF |
| V13-DIFF-PDF-01 | future public PDF target | future v1.3 PDF draft | PENDING_DIFF |

## Diff Review Record Template

| Field | Value |
|---|---|
| diff review id | PENDING_REVIEW_ID |
| review date | PENDING_DATE |
| reviewer | PENDING_FOUNDER_OR_APPROVED_REVIEWER |
| source commit | PENDING_COMMIT |
| public file replacement approved? | NO by default |
| publication approved? | NO by default |
| legal/provider review recorded? | NO by default |
| final public wording diff complete? | NO |
| final state | PENDING_FINAL_WORDING_DIFF |

## Required Review Rows

| Evidence ID | Review Area | Required Check | Current State |
|---|---|---|---|
| V13-DIFF-WP-HERO | whitepaper title and hero | no token-first, investment, yield, or partnership-first positioning | PENDING_DIFF |
| V13-DIFF-WP-FINANCE | working-capital, lending, and escrow language | future/provider-reviewed/not-live context is explicit | PENDING_DIFF |
| V13-DIFF-WP-WEB3 | FIO, XPR, WebAuth, Metal, Metallicus, smart-contract wording | no partnership, live settlement, wallet-signature, or token-collateral claim | PENDING_DIFF |
| V13-DIFF-WP-RISK | risk factors and review gates | founder/legal/provider/evidence blockers remain visible | PENDING_DIFF |
| V13-DIFF-HOME-HERO | homepage hero and primary CTA | Construction Trust Infrastructure first, no public investment-token pitch | PENDING_DIFF |
| V13-DIFF-HOME-PRODUCT | homepage product sections | SmartContractor remains workflow/demo-safe, not live finance | PENDING_DIFF |
| V13-DIFF-HOME-WEB3 | homepage Web3 references | future optional regulated layer only | PENDING_DIFF |
| V13-DIFF-HOME-CTA | homepage CTAs and contact paths | no provider outreach, wallet action, payment, loan, escrow, FIO, or XPR action is implied | PENDING_DIFF |

## Allowed Result States

- PENDING_DIFF;
- PASS_REVIEWED_LATER;
- FAIL_REVIEWED_LATER;
- BLOCKED_FOR_REWRITE.

## Required Before Any PASS

- founder local direction or publication decision is current-thread recorded;
- legal/provider review is recorded for regulated claims;
- finance/escrow/payment wording has provider or counsel review where needed;
- final candidate diff is reviewed against `docs/whitepaper-v1-3-claim-risk-hardening-checklist.md`;
- `npm run check:whitepaper-v1-3-public-html-plan` passes;
- `git diff -- whitepaper.html index.html` is reviewed after any future public file operation.

## Stop Boundary

This template cannot be used to approve public wording, replace public files, publish a PDF, change routing, send provider outreach, claim legal/provider review is complete, touch live Supabase, move money, approve loans, hold escrow, settle stablecoins, lock token collateral, register FIO names, or sign XPR actions.
