# GCSC Whitepaper v1.2 Contract-Backed Loan Review Questions

Status: internal review-question list only. This is not legal advice, not approval to launch real loans, not approval to launch real escrow, not approval to launch token collateral, and not approval to launch repayment routing.

Public whitepaper remains unchanged until these questions are answered or explicitly deferred.

## Purpose

This document turns the contract-backed working-capital idea into the exact questions that the founder, attorney, finance provider, and technical team must answer before public v1.2 language says more than "future contract-backed working-capital eligibility" and "receivables-based underwriting."

## Founder Questions

1. Should first public wording use `working capital`, `financing partner`, or `loan`?
2. Should the first version say only that a signed SmartContractor project contract creates expected milestone receivables?
3. Should the whitepaper describe repayment as a repayment-first waterfall only after provider approval?
4. Should the feature appear in Part 1 as a SmartContractor marketplace benefit, or only in Part 3 as future settlement architecture?
5. Should homeowner-facing language focus on reducing risky upfront deposits rather than promising zero risk?

## Legal Questions

1. Can a signed project contract be described as collateral, or must it be described as underwriting support only?
2. Does the model require assignment of receivables language?
3. Would any lien, security interest, or UCC filing be needed before a provider treats the contract as collateral?
4. Who is legally allowed to originate or broker the financing?
5. What disclosures are required for contractors and homeowners?
6. What dispute pause language is required before milestone repayment can be delayed, reversed, or reviewed?
7. Which terms must stay out of public materials until legal review: signed contracts are legal collateral today, loans are guaranteed, every contract qualifies, real escrow is live?

## Finance Provider Questions

1. What data does a provider need before provider-reviewed funding can be considered?
2. What risk signals matter most: contractor identity, EIN, license, insurance, project size, milestone schedule, dispute history, bid accuracy, or payment history?
3. Can expected milestone receivables support working-capital limits without homeowner funds moving first?
4. How should the repayment-first waterfall be calculated?
5. What happens if the milestone is disputed, partially approved, cancelled, or delayed?
6. Does the provider require bank rails, stablecoin rails, escrow rails, or a provider-hosted ledger?

## Technical Architecture Questions

1. Which system is the source of truth for the signed project contract?
2. Which fields must be frozen after contract signing?
3. Which fields can change through amendments?
4. How does SmartContractor record human override and dispute pause events?
5. Which events should later map to smart contracts: contract signed, funding requested, funding approved, milestone approved, repayment routed, contractor net paid, dispute opened?
6. How does the system prove that AI must not approve loans or release payments automatically?

## Public Wording Questions

1. Does this phrase stay safe: `contract-backed working-capital eligibility`?
2. Does this phrase stay safe: `receivables-based underwriting`?
3. Does this phrase need review: `contract collateral`?
4. Can the whitepaper say "repayment-first waterfall" without implying live repayment routing?
5. Should stablecoin settlement be presented only as a future provider/legal-reviewed option?

## Stop Conditions

Stop public wording work if any draft implies:

- signed contracts are legal collateral today;
- loans are guaranteed;
- every contract qualifies;
- real escrow is live;
- repayment routing is live;
- stablecoin repayment is live;
- token collateral is live;
- AI approves loans or releases payments automatically;
- GCSC is already a licensed lender, escrow agent, broker, or collateral platform.

## Required Checks Before Public Use

- `npm run check:whitepaper-v1-2-contract-backed-loan-review-questions`
- `npm run check:whitepaper-v1-2-contract-backed-loan-founder-review`
- `npm run check:whitepaper-v1-2-contract-backed-loan-flow`
- `npm run check`
