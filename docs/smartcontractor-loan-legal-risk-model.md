# SmartContractor Loan Legal Risk Model

Date: 2026-05-03

## Important Legal Note

This document is a product and legal-risk design draft, not final legal advice. Before public launch, GCSC must have a licensed attorney review the contractor loan agreement, security agreement, UCC filing process, state lending rules, consumer/business lending compliance, and collection language.

## Core Idea

SmartContractor can offer small starter business loans to verified contractors. The first loan limit should be intentionally conservative and tied to real business replacement friction.

For Washington contractors, the platform can use the contractor's Unified Business Identifier (UBI) as one of the verification anchors. Washington Department of Revenue describes the UBI as a nine-digit identifier used to identify registered businesses. A contractor who abandons a registered business may need to spend time and money forming, licensing, insuring, and rebuilding a new business identity.

The product rule:

```text
Starter loan size should not exceed the estimated real-world cost and friction of replacing the verified business identity.
```

Recommended early range:

```text
$3,500 to $4,000 maximum starter loan
```

This amount is large enough to help with materials, tools, permits, or project startup costs, but small enough to reduce platform risk while the contractor is still building reputation.

## Why This Helps

The business identity creates accountability:

- verified UBI/business registration;
- EIN or tax identity where applicable;
- active license where required;
- insurance or bond documentation where required;
- verified owner/officer identity;
- linked platform wallet;
- platform job history;
- repayment history;
- dispute and complaint history.

If a contractor takes a loan and tries to disappear, they risk damaging:

- their business record;
- platform reputation;
- future loan eligibility;
- access to homeowner leads;
- token rewards;
- wallet-linked identity;
- possible legal collection exposure.

This makes dishonest behavior less attractive without making the system unfair to honest contractors.

## Correct Legal Structure

The platform should not say:

```text
While the loan is unpaid, the contractor company belongs to GCSC.
```

That wording is risky and may be legally incorrect.

The stronger and more professional structure is:

```text
The contractor remains the owner of the business, but grants GCSC a secured interest and repayment rights until the loan is fully repaid.
```

The loan package should include:

1. Business loan agreement
2. Security agreement
3. Platform payout assignment
4. Repayment authorization
5. Fraud/no-bad-intent certification
6. Covenant not to transfer or hide collateral
7. Default remedies
8. Optional personal guarantee, only after attorney review
9. Optional UCC-1 financing statement where appropriate

## Security Interest Instead Of Ownership Transfer

A security interest is a lender's legal claim against agreed collateral if the borrower defaults. For a contractor business loan, collateral may include:

- platform receivables;
- future milestone payments;
- equipment purchased with loan proceeds;
- business accounts receivable;
- platform token rewards;
- certain contract rights;
- other business assets allowed by law and agreement.

If legally appropriate, GCSC can file a UCC-1 financing statement. In Washington, the Department of Licensing provides official UCC filing and search systems. A UCC filing gives public notice that a secured party may have an interest in specified collateral.

## Platform Repayment Priority

SmartContractor should make repayment automatic inside the platform:

1. Contractor receives approved working capital loan.
2. Contractor starts work and submits milestone progress.
3. Homeowner approves milestone.
4. Platform routes the agreed repayment amount first.
5. Remaining milestone funds go to contractor.
6. Full repayment increases credit score and future loan limit.

This is safer than asking the contractor to manually repay later.

## Fraud And Bad Intent Certification

Every contractor loan document should require a clear certification:

```text
Borrower certifies that all information submitted to GCSC is true, complete, and not misleading. Borrower certifies that the loan is requested for legitimate business purposes related to contractor operations or an approved SmartContractor project. Borrower further certifies that Borrower has no present intention to misuse the loan proceeds, abandon the project, conceal assets, transfer collateral to avoid repayment, or otherwise prevent repayment of the loan.
```

Plain-language version for the UI:

```text
I confirm that I am taking this loan for a real contractor business purpose. I am not taking this loan with the intention of disappearing, hiding assets, avoiding repayment, or harming GCSC, the homeowner, or the platform.
```

## Suggested Loan Agreement Clause

Draft clause for attorney review:

```text
Business Purpose; No Fraudulent Intent. Borrower represents and warrants that the loan proceeds will be used only for legitimate business purposes, including materials, labor, equipment, permits, mobilization, or other approved project-related expenses. Borrower represents that Borrower is not requesting the loan with the intent to defraud, delay, hinder, or avoid repayment to GCSC or any affiliated lender, treasury, DAO, or platform participant.

Security Interest and Platform Repayment Rights. Until all amounts owed under this loan are paid in full, Borrower grants GCSC a continuing security interest, to the extent permitted by law, in the collateral described in the loan documents, including approved platform receivables, milestone payments, loan-funded materials or equipment, and related proceeds. Borrower authorizes SmartContractor to apply approved milestone payments, platform payouts, token rewards, or other platform-controlled amounts toward repayment according to the agreed repayment schedule.

No Transfer or Concealment. Borrower agrees not to sell, transfer, hide, pledge, encumber, abandon, or materially impair collateral or platform receivables for the purpose of avoiding repayment. Borrower agrees to notify GCSC before any material change in business ownership, business name, license status, UBI status, insurance status, or contractor operations while the loan remains unpaid.

Default. If Borrower fails to repay, submits false information, misuses loan proceeds, abandons an approved project, or attempts to avoid repayment, GCSC may suspend loan eligibility, pause platform payouts, apply available platform receivables to repayment, reduce reputation and credit score, initiate dispute or collection procedures, and exercise any other remedies allowed by the loan documents and applicable law.
```

## Loan Limit Logic

Starter loan:

```text
Max $3,500-$4,000
```

Increase only after:

- verified business identity;
- successful first project;
- no serious unresolved disputes;
- milestone completion;
- repayment on time;
- positive homeowner review;
- peer review participation if applicable;
- no suspicious wallet/account behavior.

Possible tiers:

| Tier | Requirement | Example Limit |
|------|-------------|---------------|
| Starter | UBI/EIN/license verified, no platform history | $3,500-$4,000 |
| Tier 1 | 1-3 completed jobs, clean repayment | $5,000-$10,000 |
| Tier 2 | 5+ completed jobs, strong rating, clean disputes | $10,000-$25,000 |
| Tier 3 | long history, strong cashflow, low dispute rate | $25,000-$50,000 |

## Token Collateral Growth Model

In later phases, contractors that believe in the GCSC ecosystem may buy, earn, stake, and hold project tokens. Those tokens can become part of the contractor's platform credit profile.

Important compliance rule:

```text
GCSC should not promise that tokens will increase in price.
```

Correct wording:

```text
If GCSC/GCSCBUILD tokens have verifiable market value and sufficient liquidity, a contractor may be able to pledge eligible tokens as additional collateral for larger platform loans, subject to risk limits, loan-to-value rules, custody rules, and legal compliance review.
```

Token collateral should not replace business verification. It should be one more layer on top of:

- verified UBI/EIN/business identity;
- license and insurance status;
- completed jobs;
- repayment history;
- dispute history;
- homeowner ratings;
- platform payment history.

### Suggested Token-Backed Loan Rules

Because crypto assets can be volatile, the platform should use conservative loan-to-value (LTV) rules.

Example model for attorney and risk review:

| Collateral Type | Max LTV | Example |
|-----------------|---------|---------|
| New contractor token collateral | 20%-25% | $20,000 tokens -> $4,000-$5,000 loan |
| Strong contractor + token collateral | 30%-40% | $50,000 tokens -> $15,000-$20,000 loan |
| Long-history contractor + token collateral + receivables | 40%-50% | $60,000 mixed collateral -> $24,000-$30,000 loan |

The platform should include:

- collateral lock or escrow;
- reliable market price/oracle source;
- haircut for volatility;
- margin warning threshold;
- liquidation or partial repayment threshold;
- disclosure that token value can fall;
- no guarantee of token price growth;
- clear custody terms;
- clear rules for what happens if token liquidity disappears.

### Why This Helps The Ecosystem

This creates a flywheel:

1. Contractor works on SmartContractor.
2. Contractor earns reputation and token rewards.
3. Contractor may buy or stake additional tokens.
4. Tokens plus job history improve collateral strength.
5. Contractor can qualify for larger loans.
6. Larger loans help contractor complete larger jobs.
7. Successful repayment improves credit tier again.

This rewards long-term platform participants without giving large loans to brand-new or unproven contractors.

## Sources To Verify With Attorney

- Washington Department of Revenue: UBI and business registration
  - https://dor.wa.gov/open-business/new-business-information
- Washington Department of Revenue: UBI is a nine-digit business identifier
  - https://dor.wa.gov/education/industry-guides/insurance-industry-guide/common-terms
- Washington Department of Licensing: UCC online filing and searches
  - https://dol.wa.gov/professional-licenses/uniform-commercial-code-ucc/ucc-online-filing-and-searches
- Washington Department of Licensing: UCC online filing fees
  - https://dol.wa.gov/professional-licenses/uniform-commercial-code-ucc/ucc-online-filing-and-searches/ucc-online-filing-and-search-fees
- FINRA: crypto assets can be highly volatile and risky
  - https://www.finra.org/investors/investing/investment-products/crypto-assets/risks
- SEC Investor.gov: crypto asset lending and interest-bearing products carry risk
  - https://www.investor.gov/index.php/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/investor-bulletin-crypto-asset-interest-bearing-accounts
- CFPB: crypto-assets complaints and consumer risk concerns
  - https://www.consumerfinance.gov/about-us/newsroom/cfpb-publishes-new-bulletin-analyzing-rise-in-crypto-asset-complaints/
