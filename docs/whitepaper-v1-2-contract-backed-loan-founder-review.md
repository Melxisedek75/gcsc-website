# GCSC Whitepaper v1.2 Contract-Backed Loan Founder Review

Status: internal founder-review worksheet only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing.

Public whitepaper remains unchanged until founder, legal/provider, and technical review gates are recorded.

## Purpose

This worksheet turns the founder's new idea into a safe decision surface before any v1.2 whitepaper edit:

After a homeowner/property owner and contractor sign a SmartContractor project contract, that signed project contract creates expected milestone receivables. Those receivables can support future contractor working-capital underwriting, and approved milestone payments can follow a repayment-first payment waterfall.

The important safety line: GCSC should describe this first as contract-backed working-capital eligibility and receivables-based underwriting, not as active contract collateral or live lending until legal/provider review approves exact terms.

## Founder Decisions

| Decision | Recommended Choice | Why |
|---|---|---|
| Public label | Use `contract-backed working-capital eligibility` | Explains the idea without claiming that the signed contract is legal collateral today. |
| Secondary label | Use `receivables-based underwriting` | Makes it clear the financing logic is based on expected milestone receivables. |
| Legal-review label | Keep `contract collateral` for attorney/provider review only | The word collateral can imply lien, security interest, assignment of receivables, UCC filing, lender rights, or enforcement terms. |
| Product placement | Put it after accepted bid/project contract | The financing logic starts only after a real project contract exists. |
| MVP status | Treat as roadmap / future provider-reviewed flow | The current product can model the data and workflow, but no real loan or escrow should launch autonomously. |
| Public wording style | Say `working capital` or `financing partner`; use `loan` only with review context | This keeps the language useful for users while reducing accidental legal promises. |
| Repayment language | Use `repayment-first payment waterfall` | It describes the flow without promising enforceability before provider/legal approval. |
| AI boundary | AI may help with risk and milestone evidence, but cannot be the final lender, legal, or payment-release authority | Keeps human/provider override and dispute review in the architecture. |

## Recommended Public Wording

Use this as the safest first draft for the future whitepaper:

> After a project contract is signed, SmartContractor can use verified project data and expected milestone receivables to support future contractor working-capital underwriting. If approved by a finance provider, milestone payments can follow a repayment-first waterfall: approved repayment is routed first, and remaining proceeds go to the contractor.

Shorter version:

> A signed SmartContractor project contract can support future contract-backed working-capital eligibility, where approved milestone receivables help underwrite contractor funding and route repayment before net contractor payout.

## Review-Required Wording

These terms can be useful, but they need legal/provider review before public use:

- collateral;
- contract collateral;
- lien;
- security interest;
- assignment of receivables;
- legally enforceable repayment;
- lender-approved escrow;
- escrow-approved repayment routing;
- provider-approved credit facility;
- stablecoin repayment;
- token collateral;
- UCC filing;
- loan approval;
- credit guarantee.

## Blocked Wording

Do not use these claims in the public whitepaper, site, deck, grant packet, partner packet, investor packet, email, social post, or announcement:

- signed contracts are legal collateral today;
- loans are guaranteed;
- every contract qualifies;
- real escrow is live;
- repayment routing is live;
- token collateral is live;
- stablecoin repayment is live;
- AI approves loans or releases payments automatically;
- homeowners have zero risk;
- lenders have guaranteed repayment;
- GCSC already acts as a licensed lender, escrow agent, broker, or legal collateral platform.

## Placement In The Three-Part Whitepaper

### 1. SmartContractor Platform

Place the idea after the accepted bid becomes a project contract:

- homeowner posts job;
- contractor submits bid;
- accepted bid becomes signed project contract;
- signed project contract creates expected milestone receivables;
- contractor may request working capital against those receivables.

### 2. Trust Infrastructure

Connect the idea to risk controls:

- contractor identity, EIN, license, insurance, and reputation;
- project scope, milestone schedule, bid accuracy, and dispute history;
- AI-assisted evidence review;
- human override, provider review, and dispute pause;
- audit trail for underwriting, milestone approval, repayment, and contractor net payout.

### 3. Settlement & Tokenized Construction Network

Keep this as future architecture:

- repayment-first payment waterfall;
- escrow-ready payment state machine;
- future stablecoin settlement router;
- tokenized construction agreement layer;
- GCSC/GCST utility hooks only after legal/provider/founder approval;
- no live loan, escrow, token collateral, or automatic repayment activation from whitepaper language alone.

## Required Checks Before Public Use

Run these before any public v1.2 wording uses this idea:

- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-flow`
- `npm run check:whitepaper-v1-2-contract-backed-loan-addendum`
- `npm run check:whitepaper-v1-2-claim-review`
- `npm run check`

Public use is blocked until the founder has accepted/revised/rejected this worksheet and legal/provider review has approved any lending, escrow, collateral, stablecoin, repayment, lien, or assignment-of-receivables wording.
