# GCSC Whitepaper v1.2 Contract-Backed Loan Public Wording Options

Status: internal wording options only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing.

Public whitepaper remains unchanged until the founder chooses one wording option and legal/provider review approves any language that sounds like lending, collateral, lien, assignment of receivables, escrow, stablecoin settlement, or repayment enforcement.

## Purpose

This document gives the founder three conservative wording levels for the signed-contract working-capital idea. The goal is to preserve the business insight without accidentally saying GCSC is already a lender, escrow agent, broker, collateral platform, or automatic payment-release system.

## Safest Option

Use this option for the first public v1.2 draft if legal/provider review is not complete:

> After a SmartContractor project contract is signed, the platform can use verified project data, milestone structure, and expected receivables to support future contract-backed working-capital eligibility. This is designed to reduce risky upfront deposits and help contractors prepare for project costs while keeping funding, repayment, and payment-release decisions subject to provider, legal, and human review.

Best placement:

- Part 1: SmartContractor Platform;
- Part 2: Trust Infrastructure;
- short reference only in Part 3: Settlement & Tokenized Construction Network.

Why this is safest:

- says signed project contract creates expected milestone receivables;
- uses contract-backed working-capital eligibility;
- avoids contract collateral;
- avoids repayment guarantee;
- keeps provider and legal review visible.

## Moderate Option

Use this only after founder approval and a first legal/provider review:

> SmartContractor can support receivables-based underwriting by connecting a signed project contract, verified milestone schedule, contractor reputation, and project evidence into a reviewable funding workflow. When a finance provider approves funding, milestone payments can be modeled with a repayment-first waterfall before the remaining contractor net payout is released.

Best placement:

- Part 2: Trust Infrastructure;
- Part 3: Settlement & Tokenized Construction Network.

Why this needs more review:

- uses receivables-based underwriting;
- mentions repayment-first waterfall;
- references finance provider approval;
- still does not claim that repayment routing is live.

## Provider-Review Option

Use this only after attorney/provider approval:

> Future provider-reviewed funding may allow a signed SmartContractor project contract and related milestone receivables to support contractor working capital. Any collateral, contract collateral, lien, security interest, assignment of receivables, escrow, stablecoin repayment, or repayment-routing structure would depend on applicable law, provider underwriting, contract terms, and explicit participant consent.

Best placement:

- Part 3 only: Settlement & Tokenized Construction Network.

Why this is review-heavy:

- uses collateral-sensitive terms;
- names assignment of receivables, lien, and security interest;
- should not be published without legal/provider review.

## Do Not Publish Yet

Do not publish wording that says or implies:

- signed contracts are legal collateral today;
- loans are guaranteed;
- every contract qualifies;
- real escrow is live;
- repayment routing is live;
- stablecoin repayment is live;
- token collateral is live;
- AI approves loans or releases payments automatically;
- GCSC is already a licensed lender, escrow agent, broker, or collateral platform.

## Founder Selection Rule

Before public use, the founder should choose one wording option:

1. Safest Option - recommended before legal/provider review is complete.
2. Moderate Option - only after first review.
3. Provider-Review Option - only after attorney/provider wording approval.

If no explicit selection exists, default to the Safest Option and keep all lending, collateral, escrow, stablecoin, and automatic repayment details inside internal review documents.

## Required Checks Before Public Use

- `npm run check:whitepaper-v1-2-contract-backed-loan-public-wording-options`
- `npm run check:whitepaper-v1-2-contract-backed-loan-review-questions`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-review`
- `npm run check`
