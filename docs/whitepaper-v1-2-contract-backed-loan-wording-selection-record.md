# GCSC Whitepaper v1.2 Contract-Backed Loan Wording Selection Record

Status: internal selection record only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing. The public whitepaper remains unchanged until founder, legal/provider, and technical gates are recorded.

## Purpose

This record is the safe decision bridge between the internal public wording options and a future public whitepaper edit. It captures which contract-backed working-capital eligibility wording the founder selects, where that wording may appear, and which claims remain blocked.

The concept must stay framed as contract-backed working-capital eligibility, receivables-based underwriting, and a repayment-first waterfall. It must not imply that a signed construction contract is legal collateral, that GCSC is originating live loans, or that SmartContractor is operating live escrow.

## Selection Fields

| Field | Founder Entry |
|-------|---------------|
| Selected option | Safest Option / Moderate Option / Provider-Review Option / Reject for now |
| Founder decision date | TBD |
| Selected public wording | TBD |
| Revision notes | TBD |
| Legal/provider review status | Not reviewed / In review / Approved with edits / Rejected |
| Technical readiness status | Draft only / Backend-ready / Provider-ready / Public-ready |
| Public use status | Blocked / Internal only / Approved excerpt / Approved whitepaper |

Selection rule:

- Use Safest Option until legal/provider review says stronger language is allowed.
- Use Moderate Option only after founder approval confirms that the wording still avoids collateral, lien, assignment-of-receivables, and guaranteed-loan implications.
- Use Provider-Review Option only after a finance provider and attorney approve the exact language.
- Use Reject for now if the concept should remain internal until real provider/legal structure exists.

## Allowed Placement

Allowed placement in the future three-part whitepaper structure:

1. SmartContractor Platform: explain signed project contracts, milestones, evidence, and contractor credit readiness as product workflow.
2. Trust Infrastructure: explain reputation, verification, disputes, audit trails, and risk review inputs.
3. Settlement & Tokenized Construction Network: explain future smart-contract/payment-state mapping only as a roadmap after legal/provider approval.

Preferred language:

- "A signed SmartContractor project contract may support contractor working-capital eligibility."
- "Expected milestone receivables can become one underwriting input for provider-reviewed funding."
- "Approved milestone payments can be routed through a repayment-first waterfall where legally and technically enabled."

## Review Evidence

Before any selected wording leaves internal review, the selection record must link or reference:

- founder approval;
- legal/provider review;
- selected option from `docs/whitepaper-v1-2-contract-backed-loan-public-wording-options.md`;
- claim review status from `docs/whitepaper-v1-2-claim-review-matrix.md`;
- public excerpt guard status from `docs/whitepaper-v1-2-public-excerpt-guard.md`;
- technical readiness note for backend fields, payment-state mapping, and disabled live-risk features.

No private lender terms, borrower identity data, wallet addresses, bank details, legal advice, or secret values should be stored here.

## Blocked Terms

Do not use these terms or claims in public wording unless attorney/provider review explicitly approves the exact sentence:

- contract collateral;
- assignment of receivables;
- lien;
- security interest;
- loans are guaranteed;
- real escrow is live;
- AI approves loans or releases payments automatically.

Replacement guidance:

- Replace "contract collateral" with "signed project contract as an underwriting input."
- Replace "assignment of receivables" with "provider-reviewed milestone receivable analysis."
- Replace "lien" or "security interest" with "legal/provider review required."
- Replace "loans are guaranteed" with "eligibility may be reviewed."
- Replace "real escrow is live" with "escrow-ready payment-state design."
- Replace "AI approves loans or releases payments automatically" with "AI-assisted review with human/provider override."

## Required Checks Before Public Use

Run these before any public whitepaper, website, PDF, partner packet, grant packet, investor deck, email, social post, or announcement uses the selected wording:

- `npm run check:whitepaper-v1-2-contract-backed-loan-wording-selection-record`
- `npm run check:whitepaper-v1-2-contract-backed-loan-public-wording-options`
- `npm run check:whitepaper-v1-2-public-excerpt-guard`
- `npm run check`

Public use remains blocked if any selected sentence suggests live real loans, live real escrow, token collateral activation, automatic AI approval, guaranteed funding, or legally perfected collateral.
