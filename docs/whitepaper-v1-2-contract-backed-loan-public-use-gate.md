# GCSC Whitepaper v1.2 Contract-Backed Loan Public Use Gate

Status: internal public-use gate only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing. The public whitepaper remains unchanged until this gate is marked pass with founder, legal/provider, technical, and claim-review evidence.

## Purpose

This gate is the final internal checklist before any contract-backed working-capital wording is copied into a public whitepaper, website, PDF, partner packet, grant packet, investor deck, email, social post, or announcement.

The concept must stay framed as contract-backed working-capital eligibility, receivables-based underwriting, provider-reviewed funding, and a repayment-first waterfall. It must not imply legal collateral, live lending, live escrow, token collateral activation, stablecoin settlement activation, or automatic AI approval.

## Required Evidence

| Evidence | Required Source | Pass Rule |
|----------|-----------------|-----------|
| Founder selection | `docs/whitepaper-v1-2-contract-backed-loan-wording-selection-record.md` | Safest Option, Moderate Option, Provider-Review Option, or Reject for now is recorded |
| Approval routing | `docs/whitepaper-v1-2-contract-backed-loan-approval-routing-checklist.md` | Founder route, legal route, finance provider route, technical route, and public-use route are not skipped |
| Claim review | `docs/whitepaper-v1-2-claim-review-matrix.md` | No blocked claim is used |
| Public excerpt safety | `docs/whitepaper-v1-2-public-excerpt-guard.md` | Excerpt rules pass for the exact sentence |
| Publication gate | `docs/whitepaper-v1-2-publish-gate.md` | Public use is allowed only after approvals are recorded |

## Pass Criteria

This gate may pass only when all criteria are true:

- founder approval is recorded;
- legal/provider review is recorded for any wording stronger than Safest Option;
- finance provider review is recorded for provider-reviewed funding, underwriting, milestone receivable, or repayment-first waterfall wording;
- technical review confirms the statement is roadmap-safe and does not claim live real loans, live real escrow, token collateral activation, stablecoin settlement activation, or automatic AI approval;
- the selected language uses safe terms: contract-backed working-capital eligibility, receivables-based underwriting, provider-reviewed funding, repayment-first waterfall, signed project contract as an underwriting input, and escrow-ready payment-state design;
- the selected language avoids blocked claims.

## Automatic No-Go

Mark this gate NO-GO if the selected wording includes or implies:

- contract collateral;
- assignment of receivables;
- lien;
- security interest;
- loans are guaranteed;
- every contract qualifies;
- real escrow is live;
- token collateral is active;
- stablecoin settlement is live;
- AI approves loans or releases payments automatically;
- GCSC is already operating as a lender, escrow agent, bank, broker, or licensed finance provider.

## Output States

Use exactly one output state:

- GO for internal draft only.
- GO for approved public excerpt.
- GO for whitepaper v1.2 draft.
- REVIEW with founder.
- REVIEW with legal/provider.
- REVIEW with finance provider.
- NO-GO until language is rewritten.
- NO-GO until real legal/provider structure exists.

## Required Checks

Run these checks before marking this gate GO for any public use:

- `npm run check:whitepaper-v1-2-contract-backed-loan-public-use-gate`
- `npm run check:whitepaper-v1-2-contract-backed-loan-approval-routing`
- `npm run check:whitepaper-v1-2-contract-backed-loan-wording-selection-record`
- `npm run check:whitepaper-v1-2-public-excerpt-guard`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check:whitepaper-v1-2-publish-gate`
- `npm run check`

If any check fails, public use remains blocked and the language must return to founder/legal/provider review.
