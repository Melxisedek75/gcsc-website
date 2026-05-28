# Alabama SmartContractor Compliance Research

## 1. Executive Summary

| Product | Status | Justification |
|---------|--------|---------------|
| (a) Contractor workflow | **Medium legal review needed** | Alabama has two contractor licensing boards (Home Builders Licensure Board for residential over $10,000; Licensing Board for General Contractors for commercial over $50,000). SmartContractor can support licensed contractors but must verify license status before any workflow activation. Unlicensed contracting is a misdemeanor. |
| (b) Token-collateral equipment credit | **Blocked until licensed attorney review** | Alabama Monetary Transmission Act (Ala. Code § 8-7A-1 et seq.) explicitly defines "monetary value" to include "virtual or fiat currencies, whether or not redeemable in money." Token lock, liquidation, or exchange likely requires a money transmitter license from the Alabama Securities Commission. Criminal penalties for unlicensed operation include Class C/D felonies. |
| (c) ClaimBridge insurance claim advance | **Blocked until licensed attorney review** | Alabama does not license public adjusters; negotiating claims on behalf of another constitutes the unauthorized practice of law (Wilkey v. State). AOB statute (§ 27-1-19) limited to health/dental only. Consumer Credit Act licensing may apply. Multiple high-risk factors require Alabama-licensed insurance and lending counsel. |
| (d) Escrow-backed contractor advance | **High legal review needed** | No specific Alabama statute governs escrow-backed advances. General commercial lending, UCC Article 9 perfection, and Prompt Payment Act (§ 8-29-1) considerations apply. Assignment of future milestone payments is generally permitted but requires written consent and UCC filing. Consumer lending regulations may be implicated depending on structure. |

**Overall**: Alabama presents a high-complexity, high-risk regulatory environment. All live money features should remain blocked pending Alabama-licensed counsel review. Demo-only mode may be used for market research.

---

## 2. Contractor / Home Improvement Rules

- **Is a contractor license required in Alabama?** **Yes.** Alabama has two separate licensing boards:
  - **Home Builders Licensure Board (HBLB)** — Residential: License required for construction, remodeling, repair, or improvement on residential structures where contract exceeds **$10,000** (or roofing above $2,500). Structures must be under 3 stories with fewer than 4 units. Three license types: Unlimited, Limited, and Roofers. Unlimited requires passing Alabama Home Builders Exams. Financial: Credit report required; $10,000 bond for Roofers. General liability and workers' compensation insurance required.
  - **Alabama Licensing Board for General Contractors (LBGC)** — Non-residential: License required for commercial/public contracts over **$50,000**, or swimming pools over $5,000. Six classifications. Financial: CPA-prepared financial statements, minimum $10,000 net worth/working capital. Three references required.

- **Home improvement contractor rules?** Residential contractors fall under HBLB jurisdiction. No specific "home improvement" statute separate from general contractor licensing. Contracts over $10,000 threshold require licensed contractor.

- **Required disclosures/contract terms?** Alabama does not have a comprehensive home improvement contract statute. General contract law applies. SmartContractor should include: scope of work, payment schedule, start/completion dates, lien notice, and cancellation rights.

- **Cooling-off/cancellation rights?** Alabama does not have a specific statutory cooling-off period for home improvement contracts unless door-to-door sale (Ala. Code § 8-19-5, 3-day right of rescission for certain solicited sales). General contract rescission principles apply for fraud, misrepresentation, or mutual mistake.

- **Restoration/mitigation companies:** Alabama does not require a specific restoration or water damage mitigation license. IICRC certification is industry-standard but not state-mandated. If performing repairs above licensing thresholds, contractor license requirements apply.

- **Implications for SmartContractor:** Platform may only work with properly licensed Alabama contractors. Contractor license verification is mandatory before workflow activation. Unlicensed contracting is a misdemeanor punishable by up to 1 year in jail and $6,000 fine.

- **Cite:** Alabama Department of Labor, Licensing Board for General Contractors (https://genconbld.alabama.gov), Home Builders Licensure Board (https://hblb.alabama.gov)

---

## 3. Lending / Credit Rules

- **Consumer lending:** Alabama Small Loan Act (Ala. Code §§ 5-18-1 et seq.) applies to loans under $1,500; licensing required through Alabama State Banking Department — Bureau of Loans. Alabama Consumer Credit Act (Ala. Code §§ 5-19-1 et seq.) applies to consumer loans of any amount; licensing required through Bureau of Loans for each location (§ 5-19-21). Interest and fees are capped for loans of $2,000 or less (§§ 5-19-3(e), 5-19-16). For loans over $2,000, no statutory interest rate cap, subject only to general unconscionability under § 8-8-5. Net worth requirement: $25,000 minimum tangible net worth/capital.

- **Commercial lending:** Alabama does not generally license commercial lenders who only make business-purpose loans. However, if a loan is structured as consumer credit (to homeowner for property repairs), licensing may apply. **Key risk:** A loan to a homeowner for emergency property repairs is likely deemed a **consumer loan**, not a business loan.

- **Usury/interest caps:** General usury limit is **8% per annum** (Ala. Code § 8-8-1) unless otherwise agreed in writing up to maximum rates set by the Consumer Credit Act for covered loans. For loans over $2,000 outside the Consumer Credit Act, no statutory cap applies but unconscionability doctrine (§ 8-8-5) may limit rates.

- **Loan broker risk:** Brokering loans without a license may be prohibited under Alabama Consumer Credit Act (§ 5-19-21). Facilitating loans between third-party lenders and consumers without proper licensing creates significant regulatory exposure.

- **MCA/factoring risk:** **Not confirmed** whether Alabama regulates merchant cash advances specifically. If structured as true purchase of receivables (factoring), may fall outside lending regulations. If structured as disguised loans, Alabama Consumer Credit Act may apply. Requires licensed attorney review.

- **Payday lending:** Alabama Deferred Presentment Services Act governs short-term cash advances; unlikely relevant unless offering payday-style products.

- **Mortgage lending:** Alabama Mortgage Brokers Licensing Act and Alabama SAFE Act govern mortgage brokering; may be relevant if facilitating mortgage-related financing.

- **Official sources:** Alabama State Banking Department (https://www.banking.alabama.gov), Bureau of Loans, Ala. Code Title 5

---

## 4. Escrow-Backed Contractor Advance Rules

- **Can an advance be secured by future milestone/escrow proceeds in Alabama?** Alabama does not have a specific escrow-backed advance statute. General commercial lending principles, the Alabama Prompt Payment Act (Ala. Code § 8-29-1 et seq.), and UCC Article 9 would apply.

- **Prompt Payment Act considerations:** Under Alabama Code § 8-29-1, owners must pay prime contractors within **35 days** of receiving a proper invoice; prime contractors must pay subcontractors within **7 days** of receiving payment from the owner (§ 8-29-3). Failure to pay accrues interest at **1% per month** on unpaid balances. Retainage is typically withheld at 10% on private projects. These statutory payment timelines create a predictable receivable stream that could theoretically back an advance, but any acceleration or assignment must comply with applicable contract terms and the underlying construction contract.

- **Escrow account/control:** Alabama escrow agents for securities offerings must be commercial banks or trust companies (Ala. Admin. Code r. 830-X-4-.11). For construction escrow arrangements, no specific escrow agent licensing statute was found. General escrow arrangements are governed by contract and common law fiduciary duties. An escrow agent holds funds subject to the terms of the escrow agreement and disburses according to contractual milestones.

- **Assignment of contractor payment rights:** Assignment of contractual payment rights is generally permitted under Alabama contract law unless expressly prohibited by the underlying contract. Many construction contracts contain anti-assignment clauses; these must be reviewed on a case-by-case basis. Post-loss/post-claim assignments may be treated differently from pre-loss assignments under Alabama case law.

- **UCC Article 9 — perfection of security interest in payment rights/account:** A security interest in accounts (defined under UCC § 9-102(a)(2) as a right to payment of a monetary obligation) is perfected by **filing a UCC-1 financing statement with the Alabama Secretary of State** (central filing). Alabama has adopted Revised Article 9 (Ala. Code Title 7, Chapter 9). A security interest in payment intangibles or accounts requires a written security agreement describing the collateral, authenticated by the debtor, and a proper UCC-1 filing. The secured party may enforce its rights against account debtors under § 9-406 once notice of assignment is given.

- **Required contractor consent:** Assignment of payment rights must be **in writing** and must comply with the underlying construction contract. If the contract prohibits assignment without owner/consensus consent, such consent must be obtained. Any attempt to assign government contracts may require additional approvals.

- **Required homeowner disclosure:** The advance structure, including any assignment of payment rights, security interest, or escrow control arrangement, must be **fully disclosed in writing** to the homeowner before contract execution. Any lien or security interest on the property may require recording.

- **Dispute/freeze/refund:** If the construction contract is disputed, the advance should be **frozen** pending resolution. The escrow agreement should specify dispute resolution procedures, including inspection, mediation, or arbitration triggers. If the contract is terminated or the contractor defaults, unearned advance amounts should be refundable.

- **Whether Alabama treats this as loan, factoring, MCA:** **Not confirmed** — requires licensed attorney review. If structured as a true purchase of receivables at a discount (factoring), it may fall outside lending regulations. If structured as a loan with milestone payments as collateral, the Alabama Consumer Credit Act may apply if the advance is to a consumer. Business-purpose advances to licensed contractors may be treated as commercial transactions. The specific structure determines regulatory treatment.

- **Lien law considerations:** Alabama mechanics' lien statutes (Ala. Code § 35-11-1 et seq.) allow contractors, subcontractors, and material suppliers to file liens against real property for unpaid work. Any advance structure must account for existing and potential lien claims.

- **Official sources:** Ala. Code Title 7 (Commercial Code — UCC Article 9), Ala. Code § 8-29-1 (Prompt Payment Act), Ala. Code § 35-11-1 (Mechanics' Lien Act), Alabama Secretary of State UCC Filing Division, Alabama Securities Commission

---

## 5. Token Collateral / Digital Asset Risk

- **Alabama money transmitter risk:** Alabama Monetary Transmission Act (Ala. Code § 8-7A-1 et seq.) explicitly defines "monetary value" to include **"virtual or fiat currencies, whether or not redeemable in money"** (§ 8-7A-2(8)). Money transmission means "the selling or issuing of payment instruments, stored value, or receiving money or monetary value for transmission" (§ 8-7A-2(10)). A license is required through the Alabama Securities Commission. Minimum net worth: $25,000. Surety bond: minimum $100,000. Criminal penalties: Class C felony for unlicensed operation receiving >$5,000; Class D felony for <$5,000.

- **Virtual currency rules:** Alabama has not enacted specific virtual currency legislation beyond the Monetary Transmission Act. Multiple bills introduced in the 2025 legislative session (SB 282/HB 483 on virtual currency preemption; SB 283/HB 482 on state investment in digital assets; SB 284/HB 484 on public blockchain) remain pending but not enacted.

- **Token collateral for lending:** **Not confirmed** whether Alabama specifically regulates crypto-collateralized lending. If tokens are "monetary value," taking custody and liquidating collateral likely constitutes money transmission. Non-custodial smart contract architectures may reduce but do not eliminate risk.

- **Liquidation risk:** Automated liquidation of collateral (selling/exchanging tokens for fiat) **likely requires a money transmitter license** under the Monetary Transmission Act, as it involves exchanging virtual currency for money. Locking tokens in smart contract escrow may trigger "stored value" obligations if SmartContractor controls the lock/release mechanism.

- **Custodial vs. non-custodial:** If SmartContractor takes **custody** of tokens, money transmitter license is almost certainly required. If using **non-custodial** smart contracts where the homeowner retains control, regulatory treatment is unclear but risk remains.

- **Official sources:** Alabama Securities Commission (https://www.asc.alabama.gov), Alabama State Banking Department

---

## 6. Insurance Claim Advance / ClaimBridge Risk

- **Alabama Assignment of Benefits:** Alabama Code § 27-1-19 provides AOB rights only for **health and dental care services**, not for property insurance claims. No Alabama statute expressly authorizes AOB for property/casualty insurance claims. Post-loss assignments may be permitted under common law even with anti-assignment clauses (majority rule), but Alabama courts have not definitively ruled on this issue.

- **Public adjuster licensing:** Alabama **does not license public adjusters.** Negotiating insurance claims on behalf of another person constitutes the **unauthorized practice of law** (Wilkey v. State; Alabama State Bar advisory). Only licensed Alabama attorneys may negotiate claims for insureds. Contractors performing damage assessment and providing repair estimates is allowed; negotiating claim value with insurers is **prohibited.**

- **Insurance claim proceeds:** Governed by Alabama insurance code. Alabama has **not** adopted the NAIC Unfair Claims Settlement Practices Act, but has established P&C claims standards (Ala. Admin. Code r. 482-1-125): acknowledge receipt within 15 days; accept or deny within 30 days of proof of loss; tender payment within 30 days of liability acceptance.

- **Mortgage/loss draft:** Standard mortgagee clause applies. When a mortgagee is named on a homeowners policy, insurance claim checks are typically made payable to both the homeowner(s) and the mortgage company. Mortgage companies have dedicated Loss Draft departments that hold funds in escrow and disburse in increments based on repair progress. No specific Alabama statute governing loss draft procedures; governed by standard mortgagee clauses, Fannie Mae/Freddie Mac servicing guides, and contract law.

- **Additional Living Expenses (ALE):** Standard in homeowners policies under "Loss of Use" (Coverage D), typically 20-30% of dwelling coverage. Alabama has no specific statute mandating ALE advance payments.

- **Whether advance could be treated as consumer loan:** **Possible** — requires attorney review. Any "claim advance" product structured as a loan against anticipated claim proceeds will likely implicate the Alabama Consumer Credit Act if made to a homeowner.

- **Official sources:** Alabama Department of Insurance (https://www.aldoi.gov), Ala. Code Title 27

---

## 7. Dashboard Logic Recommendation

| Condition | Action |
|-----------|--------|
| Unlicensed contractor detected | **Show warning** — block workflow activation |
| Interest rate > usury limit / unconscionability threshold | **Show warning** — block loan creation |
| AOB attempted for property insurance claim | **Show warning** — Alabama AOB statute limited to health/dental |
| Public adjuster / claim negotiation feature | **Block button** — unauthorized practice of law in Alabama |
| Live loan creation | **Block button** — Bureau of Loans licensing required |
| Token collateral lock | **Block button** — money transmitter license may be required |
| Liquidation of token collateral | **Block button** — likely constitutes money transmission |
| Insurance claim advance (live) | **Block button** — AOB restrictions, public adjuster prohibition, lending license risk |
| All lending/advance products | **Required disclosure**: `COUNSEL_APPROVED_TEXT_REQUIRED` |
| All live money features | **Show** "Attorney review required" banner |
| Live lending | **Hide until legal approval** |
| Live token collateral | **Hide until legal approval** |
| Live claim advances | **Hide until legal approval** |

---

## 8. Smart Contract Implications

- **Off-chain checks required:**
  - Contractor license verification (HBLB or LBGC, depending on project type)
  - State residency confirmation
  - Business purpose certification (consumer vs. commercial)
  - Attorney review flag status
  - Money transmitter license status (for token collateral features)

- **Stored fields:**
  - `state_code`: "AL"
  - `license_status`: verified | pending | unlicensed
  - `license_board`: HBLB | LBGC | none
  - `business_purpose_flag`: true (commercial) | false (consumer)
  - `attorney_review_flag`: approved | pending | denied
  - `money_transmitter_status`: licensed | pending | not_applicable
  - `project_value`: numeric (for licensing threshold check)
  - `contract_type`: residential | commercial | restoration

- **Blocked actions (Alabama):**
  - `live_loan_creation` — BLOCKED pending Bureau of Loans licensing
  - `token_collateral_lock` — BLOCKED pending money transmitter analysis
  - `liquidation` — BLOCKED (selling virtual currency = money transmission)
  - `claim_proceeds_assignment` — BLOCKED (AOB limited to health/dental)
  - `repayment_routing_from_insurance` — BLOCKED (mortgagee rights + UPL risk)
  - `public_adjuster_services` — BLOCKED (unauthorized practice of law)

- **Audit events to log:**
  - All denied action attempts with reason code
  - All state-gate checks (pass/fail)
  - All `attorney_review` triggers and outcomes
  - Contractor license verification results
  - Token collateral vault access attempts
  - Insurance claim advance requests

- **Admin approvals required:**
  - `legal_team_approval` — Alabama-licensed counsel sign-off
  - `provider_approval` — lending/compliance provider review
  - `security_audit_passed` — smart contract security audit

- **Oracle confirmations needed:**
  - Contractor license verification (HBLB/LBGC database)
  - Escrow balance and milestone status
  - Insurance claim status (if claim advance feature enabled post-approval)
  - Token price feed (if collateral features enabled post-approval)
  - Mortgagee status / loss draft eligibility

---

## 9. Open Questions For Licensed Attorney

1. Does Alabama require a lending license for business-purpose equipment credit to contractors, or does the commercial-lending exemption apply to SmartContractor's advance structure?

2. Does Alabama's Monetary Transmissions Act apply to token collateral lock/liquidation in a non-custodial smart contract architecture where the homeowner retains control of private keys?

3. Can an escrow-backed advance be structured outside consumer lending regulations in Alabama by (a) making advances only to licensed contractors, (b) securing advances by assignment of future milestone payments rather than consumer loan structures, and (c) using true-sale factoring rather than loan documentation?

4. Does Alabama treat assignment of future milestone payments as a secured transaction requiring UCC-1 perfection filing with the Secretary of State, or as a true sale of receivables exempt from Article 9?

5. What disclosures are required for an escrow-backed contractor advance in Alabama — Truth in Lending, construction lien notice, assignment notification to owner, and/or others?

6. Does the Alabama Prompt Payment Act (§ 8-29-1) create statutory payment rights that are assignable by subcontractors, or do anti-assignment clauses in construction contracts override these rights?

7. Can SmartContractor operate as an escrow agent for construction milestone payments without being a licensed bank or trust company, or must it partner with a licensed financial institution?

8. Does a contractor's acceptance of an advance secured by future escrow proceeds trigger the Alabama Consumer Credit Act if the contractor is an individual (sole proprietor) rather than a corporate entity?

9. What criminal liability exposure exists for SmartContractor if a contractor uses platform features to negotiate insurance claims with homeowners (unauthorized practice of law aiding and abetting)?

10. Would a money transmitter license be required for a demo-only / testnet token collateral feature that does not involve actual monetary value transmission?

---

## 10. Sources

- Alabama Department of Insurance: https://www.aldoi.gov
- Alabama State Banking Department — Bureau of Loans: https://www.banking.alabama.gov
- Alabama Licensing Board for General Contractors: https://genconbld.alabama.gov
- Alabama Home Builders Licensure Board: https://hblb.alabama.gov
- Alabama Securities Commission: https://www.asc.alabama.gov
- Alabama Monetary Transmission Act: https://asc.alabama.gov/statute-2/alabama-securities-act-title-8-section-7a/
- Ala. Code Title 5 (Banking — Small Loan Act, Consumer Credit Act)
- Ala. Code Title 7 (Commercial Code — UCC Article 9)
- Ala. Code Title 8 (Interest/Usury; Monetary Transmission)
- Ala. Code Title 27 (Insurance)
- Ala. Code § 8-29-1 (Prompt Payment Act)
- Ala. Code § 35-11-1 (Mechanics' Lien Act)
- Ala. Admin. Code r. 482-1-125 (P&C Claims Standards)
- Ala. Admin. Code r. 830-X-4-.11 (Escrow of Proceeds)
- Alabama Secretary of State UCC Filing Division: https://www.sos.alabama.gov
- Justia — Alabama Code: https://law.justia.com/codes/alabama/
- Merlin Law Group — Public Adjusting Is Illegal in Alabama: https://www.propertyinsurancecoveragelaw.com/blog/public-adjusting-is-illegal-in-alabama/
- NCLC — Alabama Lending Laws Summary: https://www.nclc.org/wp-content/uploads/2024/02/installmentLoans2018-appendixB-1.pdf
- Alabama Construction Payment Concepts: https://alabamacommercialauthority.com/alabama-construction-payment-concepts/
