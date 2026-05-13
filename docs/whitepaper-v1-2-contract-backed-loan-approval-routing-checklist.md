# GCSC Whitepaper v1.2 Contract-Backed Loan Approval Routing Checklist

Status: internal approval routing checklist only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing. The public whitepaper remains unchanged until every route below is satisfied or explicitly marked blocked.

## Purpose

This checklist routes the selected contract-backed working-capital wording through the right review owners before it appears in any whitepaper, website, PDF, partner packet, grant packet, investor deck, email, social post, or announcement.

The concept must stay limited to contract-backed working-capital eligibility, receivables-based underwriting, provider-reviewed funding, and a repayment-first waterfall. It must not describe signed project contracts as legal collateral, live lending, live escrow, token collateral, or automatic AI payment approval.

## Required Inputs

| Input | Source | Status |
|-------|--------|--------|
| Selected wording option | `docs/whitepaper-v1-2-contract-backed-loan-wording-selection-record.md` | Required |
| Public wording options | `docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md` | Required |
| Founder review decision | `docs/whitepaper-v1-2-contract-backed-loan-founder-review.md` | Required |
| Review questions | `docs/whitepaper-v1-2-contract-backed-loan-review-questions.md` | Required |
| Claim review matrix | `docs/whitepaper-v1-2-claim-review-matrix.md` | Required |
| Public excerpt guard | `docs/whitepaper-v1-2-public-excerpt-guard.md` | Required |

## Approval Routes

| Route | Owner | Must Confirm | Status |
|-------|-------|--------------|--------|
| Founder route | Founder | Safest Option, Moderate Option, Provider-Review Option, or Reject for now is selected | Blocked until founder approval |
| Legal route | Attorney/legal reviewer | No contract collateral, assignment of receivables, lien, security interest, guaranteed funding, or legal-collateral implication is published without review | Blocked until legal/provider review |
| Finance provider route | Finance provider or lending partner | Any provider-reviewed funding, underwriting, repayment-first waterfall, or milestone receivable language matches provider policy | Blocked until provider review |
| Technical route | Codex/engineering | Backend and smart-contract wording stays roadmap-only, disabled real-money gates remain documented, and public whitepaper remains unchanged until approval | Internal ready |
| Public-use route | Founder + reviewer | Public excerpt guard and claim review matrix pass before use in site, deck, packet, email, social, or announcement language | Blocked until final approval |

## Blocked Claims

Do not publish:

- contract collateral;
- assignment of receivables;
- lien;
- security interest;
- loans are guaranteed;
- every contract qualifies;
- real escrow is live;
- token collateral is active;
- stablecoin settlement is live;
- AI approves loans or releases payments automatically.

Use safer replacements:

- "signed project contract as an underwriting input";
- "provider-reviewed milestone receivable analysis";
- "contract-backed working-capital eligibility";
- "receivables-based underwriting";
- "repayment-first waterfall where legally and technically enabled";
- "escrow-ready payment-state design";
- "AI-assisted review with human/provider override."

## Approval Outcome States

Use one outcome for each public wording target:

- Approved for internal draft only.
- Approved for founder-only review.
- Approved for legal/provider review.
- Approved for public excerpt.
- Approved for whitepaper v1.2 draft.
- Rejected for now.
- Blocked pending legal/provider review.

No route should be marked public-ready if any reviewer asks for legal advice, real loan activation, real escrow activation, token collateral activation, production payment routing, or external account/provider setup.

## Required Checks Before Public Use

Run these checks before the selected wording is used outside internal review:

- `npm run check:whitepaper-v1-2-contract-backed-loan-approval-routing`
- `npm run check:whitepaper-v1-2-contract-backed-loan-wording-selection-record`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-wording-options`
- `npm run check:whitepaper-v1-2-public-excerpt-guard`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check`

Public use remains blocked if the selected language has not passed founder approval, legal/provider review, finance provider route review where applicable, technical route review, and public-use route review.
