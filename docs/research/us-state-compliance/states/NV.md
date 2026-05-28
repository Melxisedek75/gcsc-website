# Nevada (NV) State Compliance — SmartContractor

**Packet Version:** 2.0 | **Last Updated:** 2025-01-17
**Status:** ALL LIVE FEATURES BLOCKED — pending Nevada-specific legal review

---

## 1. Executive Summary & Key Risk Ratings

Nevada presents a **moderate-to-high complexity** regulatory environment for SmartContractor products. The state has no general usury cap but enforces strict licensing regimes for consumer lending, money transmission, and contractor activity. There is no enabling statute for third-party insurance-claim advances, and token-collateral operations trigger case-by-case licensing review by the Nevada Financial Institutions Division (NFID).

| Risk Category | Score | Trigger |
|---|---|---|
| Lending / Consumer Finance | **HIGH** | NRS 675 (installment loans); NRS 604A (deferred deposit/high-interest); 40% cap on certain products; no blanket commercial exemption |
| Insurance Claim Advance | **HIGH** | No enabling statute for third-party claim financing; classification uncertain; unfair-claims practices (NRS 686A.310) may apply |
| Assignment of Benefits | **LOW-MODERATE** | Post-loss AOB generally permitted under common law; no property-insurance AOB restriction statute; hybrid AOB+financing requires counsel review |
| Public Adjuster | **HIGH** | NRS 684A comprehensive licensing; body shops prohibited from licensure; fines up to $50,000 for unlicensed activity |
| Token Collateral / Crypto | **HIGH** | NFID case-by-case determination; custody likely triggers money transmission (NRS 671) and/or trust company (NRS 669) licensing; no DeFi exemption |
| Escrow Regulation | **MODERATE** | Nevada Real Estate Division oversees escrow; escrow-backed advances must comply with NRS 645 / Real Estate Division rules |
| Consumer Protection | **HIGH** | Strong UDAP frameworks; 36% military APR cap (NRS 99.050); data-breach notification required (NRS 675.283) |

**Overall Status:** All SmartContractor live product features are **BLOCKED** pending legal review due to uncertainty around token-collateral classification, absence of a clear insurance-claim-advance enabling statute, and money-transmission implications of repayment routing.

---

## 2. Regulatory Bodies & Official Sources

| Agency / Source | Jurisdiction | URL |
|---|---|---|
| **Nevada Division of Insurance (DOI)** | Insurance claims, ALE, emergency advances, adjuster licensing | https://doi.nv.gov |
| **Nevada Financial Institutions Division (NFID / FID)** | Consumer lending, money transmission, digital-asset regulation | https://www.business.nv.gov/financial-institutions/ |
| **Nevada Real Estate Division** | Escrow regulation, real-estate licensing | https://www.nvrealtydiv.gov/ |
| **Nevada State Contractors Board (NSCB)** | Contractor licensing, bonding, enforcement | https://www.nvcontractorsboard.com/ |
| **Nevada Attorney General** | Consumer protection, UDAP enforcement | https://ag.nv.gov/ |
| **NRS Chapter 604A** | Deferred deposit / high-interest loans | https://www.leg.state.nv.us/nrs/nrs-604a.html |
| **NRS Chapter 604B** | High-interest loans — related provisions | https://www.leg.state.nv.us/nrs/nrs-604b.html |
| **NRS Chapter 604C** | Consumer litigation funding | https://www.leg.state.nv.us/nrs/NRS-604C.html |
| **NRS Chapter 624** | Contractor licensing & requirements | https://www.leg.state.nv.us/nrs/nrs-624.html |
| **NRS Chapter 645B** | Mortgage brokers | https://www.leg.state.nv.us/nrs/nrs-645b.html |
| **NRS Chapter 645F** | Mortgage lending & servicing | https://www.leg.state.nv.us/nrs/nrs-645f.html |
| **NRS Chapter 669** | Trust companies | https://www.leg.state.nv.us/nrs/nrs-669.html |
| **NRS Chapter 669A** | Family trust companies | https://www.leg.state.nv.us/nrs/NRS-669A.html |
| **NRS Chapter 671** | Money transmission | https://www.leg.state.nv.us/nrs/nrs-671.html |
| **NRS Chapter 675** | Installment loans | https://www.leg.state.nv.us/nrs/nrs-675.html |
| **NRS Chapter 684A** | Adjusters (public adjuster licensing) | https://www.leg.state.nv.us/nrs/NRS-684A.html |
| **NRS Chapter 686A** | Unfair/deceptive insurance trade practices | https://www.leg.state.nv.us/nrs/nrs-686a.html |
| **NRS Chapter 657A** | Regulatory Experimentation Program (sandbox) | https://www.leg.state.nv.us/nrs/nrs-657a.html |
| **NFID Statement on Crypto Regulation** | Case-by-case digital-asset licensing policy | https://www.business.nv.gov/news-media/press-releases/2019/financial-institutions/nevada-financial-institutions-division-statement-on-regulation-of-cryptocurrency-in-nevada/ |

---

## 3. Lending / Finance Licensing Notes

### 3.1 Installment Loans — NRS Chapter 675
- **License requirement**: NRS 675.060 — no person may engage in the lending business in Nevada without a license from the Commissioner for each office or place of business.
- **Exemptions** (NRS 675.040): Banks, credit unions, mortgage companies, pawnbrokers, insurance companies, REITs, employee-benefit plans, attorneys at law (loans secured by real property), real-estate brokers, approved FNMA/HUD/VA lenders, nonrestricted state gaming licensees, persons licensed under NRS 604A, and participants in the Regulatory Experimentation Program (sandbox) under NRS Chapter 657A.
- **Commercial/business loans**: NRS 675 does **not** have a blanket commercial-purpose exemption. NRS 675.040(11) exempts only persons who "exclusively extend credit to any person who is not a resident of this State for any business, commercial or agricultural purpose that is located outside of this State."
- **Anti-evasion**: NRS 675.035 targets affiliates attempting to evade licensing through shell arrangements.

### 3.2 Deferred Deposit / High-Interest Loans — NRS Chapter 604A
- Regulates payday loans, title loans, and high-interest loans with detailed rate and term restrictions.
- NRS 604A.400: Operating without a license is a criminal offense.
- NRS 604A.5048(1): High-interest loan licensees **shall not accept collateral as security** for a high-interest loan.
- NRS 604A.5048(1)(b): Prohibits accepting "an assignment of wages, salary, commissions or other compensation for services, whether earned or to be earned, as security for a high-interest loan."
- NRS 604A.910: Administrative fines up to $50,000 for unlicensed activity.

### 3.3 Mortgage Lending — NRS 645B / 645F
- Mortgage Broker license required for brokering both residential and commercial loans.
- AB 398 (2019): Created exemption for wholesale lenders who only fund or purchase commercial mortgage loans.
- Mortgage Servicer license required under NRS 645F.510.
- Small servicers with **10 or fewer** residential mortgage loans are exempt (NRS 645F.500(8)).

### 3.4 Interest Rate / Usury
- NRS 99.050: **No general usury cap** — parties may agree to any rate of interest.
- NRS 99.050(2): Military consumer credit capped at lesser of 36% APR or federal maximum.
- NRS Chapter 604B: High-interest loans subject to 40% annual cap on certain charges.

### 3.5 Consumer Litigation Funding — NRS 604C (Analogous Framework)
- NRS 604C.220: Contingent right to receive legal-claim proceeds is assignable by a consumer.
- Compliant litigation-funding transactions are expressly **not deemed loans** and are **not subject to loan statutes**.
- Applies only to litigation claims, not insurance claims, but provides a model for claim-based financing carve-outs.

### 3.6 Key Takeaway for SmartContractor
- **Business-purpose commercial loans** to licensed Nevada contractors may qualify for certain exemptions, but the exemption landscape is complex and fact-specific.
- Any loan product offered to homeowners/consumers would likely require an installment-loan license under NRS 675 or compliance with NRS 604A.
- **Assignment of insurance claim proceeds as loan security** has not been clearly addressed in Nevada statute. → **COUNSEL_REVIEW_REQUIRED**.

---

## 4. Escrow-Backed Contractor Advance Rules

> **NEW SECTION** — Nevada-specific escrow regulation overlay for contractor advance products.

### 4.1 Nevada Escrow Regulatory Framework
- The **Nevada Real Estate Division** (NRED), under the Department of Business and Industry, regulates escrow agents and companies pursuant to NRS Chapter 645A and NAC Chapter 645A.
- An **escrow agent** is defined as a person engaged in the business of receiving escrows for deposit or delivery (NRS 645A.010).
- **License required**: NRS 645A.040 — no person may engage in escrow business without a license from the Real Estate Division.
- **Exemptions** (NRS 645A.040(2)): Banks, credit unions, trust companies, attorneys, title insurers, and licensed real-estate brokers performing escrow services incident to a real-estate transaction.

### 4.2 Escrow-Backed Advance Product Structure
A SmartContractor "escrow-backed contractor advance" is a product in which:
1. The homeowner's insurance proceeds are deposited into an escrow account controlled by a licensed escrow agent or exempt institution.
2. The contractor receives staged (draw-based) disbursements from escrow upon completion of milestones.
3. SmartContractor provides an advance to the contractor against the escrowed funds, secured by the contractor's right to future escrow disbursements.

### 4.3 Nevada Compliance Requirements for Escrow-Backed Advances

| Requirement | Status | Details |
|---|---|---|
| Escrow agent licensing | **REQUIRED** | NRS 645A.040 — escrow must be held by Nevada-licensed escrow agent or exempt entity (bank/credit union/title insurer) |
| Escrow agreement | **REQUIRED** | Must specify disbursement conditions, milestone verification, and dispute resolution; NAC 645A.190 governs escrow instructions |
| Independent escrow officer | **REQUIRED** | Escrow agent must be independent of the contractor and the funding entity; no dual-relationship permitted |
| Milestone inspection | **RECOMMENDED** | NAC 645A.200 — prior to disbursement, escrow agent should verify milestone completion via independent inspection or third-party certification |
| Record retention | **REQUIRED** | NAC 645A.210 — escrow records must be maintained for 5 years |
| Fiduciary duty | **APPLIES** | Escrow agents owe fiduciary duties to all parties; commingling of escrow funds is prohibited (NRS 645A.070) |
| Interest on deposits | **DISCLOSE** | Escrowed funds may earn interest; disposition must be specified in escrow agreement per NRS 645A.120 |

### 4.4 Advance Against Escrowed Funds — Lending Analysis
- An advance to a contractor secured by the contractor's contingent right to escrow disbursements has **not been directly addressed** in Nevada case law or statute.
- **Potential characterization**: Such an advance may be treated as:
  - A **commercial loan** (if properly structured as business-purpose and documented);
  - A **purchase of receivables** (if structured as true-sale of escrow distribution rights);
  - A **secured financing transaction** (if secured by assignment of escrow proceeds).
- If the advance is repayable from escrow proceeds routed through SmartContractor, money-transmission analysis under NRS 671 may be triggered.

### 4.5 Escrow + Token Collateral Hybrid Products
- Products that combine escrow-backed advances with token collateral must satisfy **both** escrow licensing (NRS 645A) **and** digital-asset licensing (NRS 671 / 669) requirements.
- Smart contracts that control escrow disbursement triggers must not be deemed unlicensed escrow activity.
- **Mitigation**: Use a licensed Nevada escrow agent as the disbursement fiduciary; limit the smart contract to recording and attestation functions.

### 4.6 Key Takeaway for SmartContractor
- Escrow-backed contractor advances are **theoretically viable** in Nevada but require a licensed escrow agent or exempt institution.
- The advance itself must be carefully structured to avoid unintended classification under NRS 675 (installment loans) or NRS 604A (high-interest loans).
- All escrow-backed advance products must obtain **Nevada-specific counsel review** before launch.
- Escrow agents should be independently selected by the homeowner (not the contractor or funder) to avoid conflicts of interest.

---

## 5. Token Collateral / Crypto Notes

### 5.1 Regulatory Framework
Nevada has **no comprehensive cryptocurrency statute**. The NFID issued a formal statement on August 19, 2019:

> "Any entity that facilitates the transmission of or holds fiat or digital currency by way of brick-and-mortar, kiosk, mobile, internet or any other means, should contact the NFID to request a licensure determination."

### 5.2 Money Transmission — NRS Chapter 671
- NFID resumed licensing crypto businesses as money transmitters after SB195 (2019) failed.
- NRS 671.092 / 671.099: Applications processed through NMLS.
- 2023 revision: Minimum surety bond increased to **$100,000** (from prior $10,000), capped at $500,000.
- Minimum net worth: **$100,000**.
- Entities holding or transmitting digital currency likely need a money transmitter license.
- **CRITICAL**: A smart contract that locks token collateral and releases it upon loan repayment or liquidation may be construed as "transmitting" or "holding" digital currency, triggering MTL requirements.

### 5.3 Trust Company — NRS Chapter 669
- NFID: "If an entity proposes to serve as a digital custodian for any form of digital currency, then the business may be regulated as a trust company under NRS Chapter 669."
- Retail trust companies: Minimum stockholders' equity of **$1 million**; NFID licensing required.
- Family Trust Companies (NRS 669A): Provide custody services for family members only; not available to the general public.
- **Token collateral lock/custody**: If SmartContractor holds token collateral on behalf of users, this could trigger trust-company regulation.

### 5.4 Virtual Currency as Property
- AB 15 (2019): Integrated virtual currency into Nevada's financial crimes statutes.
- Virtual currency is treated as **property** under Nevada's Unclaimed Property Act (NRS 120A.500(1)(q)).
- Must be liquidated before reporting to the Nevada Unclaimed Property Division.

### 5.5 Failed Legislation — SB195 (2019)
- Would have created the Uniform Regulation of Virtual Currency Businesses Act.
- Failed to pass. NFID resumed MTL licensing determinations after the bill's failure.

### 5.6 Regulatory Sandbox — NRS Chapter 657A
- Nevada's "Regulatory Experimentation Program for Product Innovation" may provide limited exemptions from certain licensing requirements.
- Participants in the sandbox are exempt from NRS 675 licensing (NRS 675.040(12)).
- Requires Director approval under NRS 657A.430 / 657A.620.
- Could provide a pilot pathway for token-collateral products, but does not exempt money-transmission or trust-company requirements.

### 5.7 Key Takeaway for SmartContractor
- **TOKEN_COLLATERAL_BLOCKED** — Token collateral lock, liquidation, and automated repayment routing via smart contract likely trigger Nevada money-transmission and/or trust-company regulation.
- No explicit exemption for decentralized finance (DeFi) protocols.
- NFID makes licensing determinations **case-by-case**.
- SmartContractor should formally request a licensure determination from NFID before any live token-collateral operations.

---

## 6. Insurance Claim Advance Notes

### 6.1 Nevada DOI Guidance on Emergency Advances
The Nevada Division of Insurance has issued press releases acknowledging that:

> "Your full claim may come in multiple payments. The first will likely be an emergency advance and may include additional living expenses."

This confirms:
1. Emergency advance payments are a recognized practice in Nevada.
2. Additional Living Expense (ALE) coverage exists in Nevada homeowner policies.
3. The DOI considers claim payments as potentially coming in multiple installments.

### 6.2 Additional Living Expenses (ALE)
- Nevada homeowner policies typically include ALE / "Loss of Use" coverage.
- ALE covers necessary increases in living expenses when a home is uninhabitable due to a covered loss.
- ALE payments are generally not subject to mortgagee endorsement requirements.

### 6.3 Third-Party Insurance Claim Advance Status
- Nevada **does not have a specific statute** enabling or regulating third-party "insurance claim advances" as a financing product.
- Unlike consumer litigation funding (NRS 604C), there is no Nevada equivalent for insurance-claim financing.
- **UNKNOWN_REQUIRES_COUNSEL_REVIEW** on whether claim-advance products would be classified as loans, investments, or something else under Nevada law.

### 6.4 Unfair Claims Settlement Practices — NRS 686A
- NRS 686A.310: Prohibits unfair methods, acts, or practices in insurance.
- Could potentially apply if an entity interferes with the claims process in a deceptive manner or induces a policyholder to waive rights.

### 6.5 Key Takeaway for SmartContractor
- Insurance companies making emergency advance payments is standard and DOI-recognized practice.
- A **third party** (like SmartContractor) providing financing against expected insurance proceeds is **not directly addressed** in Nevada law.
- Whether such financing requires a license, is subject to usury limits, or is even permissible requires Nevada counsel review.

---

## 7. Assignment of Benefits (AOB) Notes

### 7.1 Nevada AOB Status: NOT EXPRESSLY RESTRICTED BY STATUTE
Nevada does **not** have a specific statute governing Assignment of Benefits for property/casualty insurance claims.

### 7.2 Applicable Law — Common Law
- Nevada follows the **majority/common law rule**: Post-loss assignments of insurance claims are generally valid and enforceable even when the insurance policy contains an anti-assignment clause.
- The reasoning: After a loss, the assignment is of a vested claim (chose in action), not the policy itself, so the insurer's risk is not increased.
- Nevada courts have not carved out a specific exception to this general rule for property insurance AOBs.

### 7.3 Health Insurance AOB — NRS 689A.135
- Nevada has an AOB statute for **health insurance** permitting assignment of benefits to healthcare providers.
- **This does not apply to property insurance** but demonstrates the legislature addresses AOB in specific contexts.

### 7.4 Implications for SmartContractor
- A homeowner may legally assign their insurance claim proceeds to a contractor or financing entity under Nevada common law.
- The assignment would be subject to general contract law; no specific AOB cancellation windows, font-size requirements, or mandatory notices apply.
- If the assignment operates as a **security interest for a loan**, additional requirements may apply under Nevada's Uniform Commercial Code.
- **CRITICAL**: A contractor acting as an advocate for the homeowner in claim negotiations while also having a financial interest in the claim outcome may face scrutiny under NRS 684A (adjuster restrictions) or NRS 686A (unfair practices).

---

## 8. Public Adjuster / Insurance Representation Notes

### 8.1 Comprehensive Licensing Framework — NRS 684A
Nevada regulates adjusters through NRS Chapter 684A and NAC Chapter 684A.

### 8.2 Who Must Be Licensed
- NRS 684A.040: Acting as an adjuster without a license subjects the person to an administrative fine of not more than $50,000.
- NRS 684A.060: Exemptions include licensed attorneys, certain company employees, and persons settling their own claims.

### 8.3 Critical Prohibitions
- **NRS 684A.055**: "The Commissioner shall not issue a license as an adjuster to a person who is in the business of repairing bodies of automobiles."
- **Interpretation**: While this specifically mentions auto body shops, the underlying principle is that persons with a **financial interest in the repair/settlement outcome** cannot be licensed as adjusters.
- **NRS 684A.050**: Concurrent licensing as independent, public, company, and staff adjuster is prohibited. A licensee may hold only one type of adjuster license.

### 8.4 Public Adjuster Licensing Requirements
- Must be at least 18 years old and a Nevada resident (or non-resident in good standing in home state).
- Must complete pre-licensing education: at least 20 hours (5 hours Nevada insurance laws; 15 hours insurance principles, adjusting processes, ethics, and government regulation).
- Must pass examination with score of 70 or higher.
- Must complete 24 hours of continuing education every 3 years (3 hours ethics).
- Fingerprint and background check required.

### 8.5 Permitted Activities
- Public adjusters may represent the financial interests of the policyholder in claim negotiations.
- They may investigate, negotiate, and settle claims (except workers' compensation).
- Cannot be licensed as a producer with property, casualty, or surety lines.

### 8.6 Implications for SmartContractor
- **SmartContractor and its contractor partners MUST NOT act as public adjusters** unless properly licensed under NRS 684A.
- A contractor that negotiates with the insurance company on behalf of the homeowner may be engaging in **unlicensed practice of adjusting**.
- The line between "assisting the homeowner with documentation" and "negotiating the claim" is fact-specific and requires **COUNSEL_REVIEW**.

---

## 9. Smart Contract Controls & Technical Implementation

### 9.1 Nevada-Specific Control Matrix

| Control | Status | Rationale |
|---|---|---|
| Block live loan creation | **true** | All loan creation blocked pending Nevada counsel review |
| Block token collateral lock | **true** | Token custody may trigger money transmission (NRS 671) and/or trust company (NRS 669) licensing |
| Block liquidation | **true** | Liquidation of token collateral may be deemed money transmission |
| Block assignment of claim proceeds | **true** | Unclear whether assignment of insurance proceeds as security is permitted/enforceable |
| Block repayment routing from insurance proceeds | **true** | Automated repayment routing from insurance proceeds may implicate money transmission |
| Block escrow-backed advance (unlicensed escrow) | **true** | Escrow agent must be Nevada-licensed (NRS 645A) before any escrow-backed advance |
| Allow demo-only records | **true** | Demonstration and testing allowed in sandbox or with testnet tokens |
| Allow hash/reference-only audit records | **true** | Immutable audit records of transactions permitted for compliance purposes |

### 9.2 Nevada-Specific Technical Considerations
- **Money Transmission (NRS 671)**: Smart contracts that hold and release digital currency on behalf of users may be deemed money transmission. The NFID determines this on a case-by-case basis.
- **Trust Company (NRS 669)**: If the smart contract custodies token collateral in a way that constitutes fiduciary custody, trust-company licensing may be required.
- **Unclaimed Property (NRS 120A)**: Virtual currency left unclaimed in smart contracts may become subject to Nevada's unclaimed property laws after the dormancy period (typically 3 years). Smart contracts should implement automatic return or liquidation provisions.
- **Escrow Integration (NRS 645A)**: Smart contract-based products that interact with escrow must ensure the escrow agent (not the smart contract) performs the actual disbursement. The smart contract should function as an attestation/milestone-recording layer only.
- **Regulatory Sandbox (NRS 657A)**: Smart contract-based products may be eligible for the Nevada Regulatory Experimentation Program, which could provide limited exemptions from certain licensing requirements for a pilot period.

### 9.3 Smart Contract Architecture Recommendations
1. **Attestation-only model**: Smart contract records milestone completion and triggers notifications to the licensed escrow agent; escrow agent executes actual disbursement.
2. **No direct custody**: Smart contract should not hold fiat currency or digital assets in custody for Nevada users until licensing determination is complete.
3. **Multi-sig with licensed escrow**: If token collateral is used, a licensed Nevada trust company or escrow agent should hold one key in a multi-signature arrangement.
4. **Dormancy handling**: Implement automatic return of collateral after a defined inactivity period to mitigate unclaimed property exposure.

---

## 10. Dashboard Rules, Disclosures & Key Statutes

### 10.1 Dashboard Rules (JSON)

```json
{
  "state": "NV",
  "state_name": "Nevada",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Nevada FID determines crypto licensing on case-by-case basis. Token collateral lock/custody may trigger money transmission (NRS 671) and/or trust company (NRS 669) licensing. No DeFi exemption. SB195 (virtual currency businesses act) failed in 2019. GCSC must request formal licensure determination from NFID before any live operations. Regulatory sandbox (NRS 657A) may provide pilot pathway with Director approval. Commercial loans to licensed contractors may qualify for exemptions from NRS 675."
  },
  "claimbridge": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "No Nevada statute expressly enables or prohibits third-party insurance claim financing. Post-loss AOB appears permitted under common law (no property AOB restriction statute found). However, public adjuster restrictions (NRS 684A) prevent contractors from negotiating claims without license. Consumer litigation funding (NRS 604C) provides analogous framework but applies only to litigation claims. Assignment of insurance proceeds as loan security is untested in Nevada. All claim-related financing requires Nevada counsel review."
  },
  "escrow_backed_contractor_advance": {
    "status": "CONDITIONAL_LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": ["licensed_nscb_contractor"],
    "blocked_actions": ["unlicensed_escrow_agent", "escrow_disbursement_by_smart_contract"],
    "required_reviews": ["legal", "escrow_agent", "provider"],
    "required_disclosures": ["ESCROW_AGENT_LICENSE_VERIFICATION", "MILESTONE_DISBURSEMENT_TERMS", "COUNSEL_APPROVED_TEXT_REQUIRED"],
    "conditions": [
      "Escrow agent must be Nevada-licensed under NRS 645A or exempt (bank/credit union/title insurer)",
      "Escrow agent must be independently selected by homeowner",
      "Advance must be structured as business-purpose commercial loan or true-sale of receivables",
      "Smart contract may only attest to milestone completion; actual disbursement by escrow agent",
      "All parties must execute written escrow agreement per NAC 645A.190"
    ],
    "notes": "Escrow-backed contractor advances are theoretically viable in Nevada but require strict compliance with NRS 645A escrow licensing. The advance itself must avoid classification under NRS 675 (installment loans) or NRS 604A (high-interest loans). Money-transmission analysis (NRS 671) applies if repayment is routed through SmartContractor."
  },
  "contractor_flow_status": "LEGAL_REVIEW_REQUIRED - Contractor must be licensed by NSCB. Financing must be structured as business-purpose commercial loan to avoid NRS 675 licensing. Contractor must not act as public adjuster (NRS 684A.055). Escrow-backed advances require licensed escrow agent.",
  "homeowner_flow_status": "BLOCKED - Homeowner-facing loan products would likely require NRS 675 installment loan license or NRS 604A license. Consumer lending to homeowners is highly regulated in Nevada.",
  "restoration_company_flow_status": "LEGAL_REVIEW_REQUIRED - Similar to contractor flow. Restoration companies must not engage in unlicensed adjuster activity. Business-purpose financing may be permissible with proper structure."
}
```

### 10.2 Required Disclosures

#### Token Collateral Disclosure
```
IMPORTANT NOTICE: This product involves the use of digital assets (cryptocurrency/tokens)
as collateral. Nevada law may regulate certain activities involving digital assets, including
custody and transmission. COUNSEL_APPROVED_TEXT_REQUIRED regarding specific Nevada
licensing status and consumer protections.

- Your digital assets may be held in custody by [Entity] or by smart contract.
- In the event of default, your collateral may be liquidated.
- Digital assets are volatile and their value may decrease.
- This transaction is NOT insured by the FDIC or any government agency.
- COUNSEL_APPROVED_TEXT_REQUIRED for Nevada-specific risks.
```

#### Insurance Claim Advance Disclosure
```
IMPORTANT NOTICE: This product provides an advance against your expected insurance
claim proceeds. Before you proceed, please understand:

- You are NOT required to sign an assignment of your insurance benefits to obtain
  repairs to your property. You may choose to work directly with your insurance company.
- The amount you receive as an advance may be less than the total amount your
  insurance company ultimately pays for your claim.
- If your insurance claim is denied or underpaid, you remain responsible for
  repayment. COUNSEL_APPROVED_TEXT_REQUIRED regarding repayment obligations in Nevada.
- Any assignment of insurance benefits you sign affects only the assigned portion
  of your claim. You retain all other rights under your policy.
- We are NOT a public adjuster and do not negotiate with your insurance company
  on your behalf. Nevada law (NRS 684A) requires a separate license to act as a
  public adjuster.
- Your mortgage lender may have rights to insurance proceeds that take priority
  over this advance. We will coordinate with your lender as required.
- COUNSEL_APPROVED_TEXT_REQUIRED regarding Nevada-specific insurance claim advance terms.
- You have the right to cancel this agreement within [X] days of signing.
  COUNSEL_APPROVED_TEXT_REQUIRED for cancellation period under Nevada law.
```

#### Escrow-Backed Advance Disclosure
```
IMPORTANT NOTICE: This transaction involves an escrow account to hold insurance
proceeds. Before you proceed, please understand:

- Your insurance proceeds will be deposited into an escrow account managed by
  [Escrow Agent Name], a [Nevada-licensed escrow agent / exempt institution].
- You may verify the escrow agent's license at https://www.nvrealtydiv.gov/.
- The escrow agent was selected by you, the homeowner, and is independent of
  both the contractor and [Entity].
- Funds will be released from escrow only upon verification of completed
  work milestones as specified in your escrow agreement.
- [Entity] is providing an advance to your contractor against future escrow
  disbursements. You remain responsible for ensuring the full scope of work
  is completed satisfactorily.
- COUNSEL_APPROVED_TEXT_REQUIRED regarding Nevada escrow-specific terms.
- You have the right to dispute any escrow disbursement in accordance with
  the dispute resolution procedures in your escrow agreement.
```

#### Contractor Relationship Disclosure
```
IMPORTANT NOTICE: [Entity] provides financing to licensed contractors for restoration
services. Please be aware:

- Your contractor is an independent business and is NOT an employee or agent of [Entity].
- [Entity] does not guarantee the quality of the contractor's work.
- You are responsible for reviewing and approving all work performed by the contractor.
- Nevada law requires contractors to be licensed by the Nevada State Contractors Board.
  You may verify your contractor's license at https://www.nvcontractorsboard.com/.
- You are responsible for paying any applicable insurance deductible directly to the
  contractor or as otherwise required by your insurance policy.
- COUNSEL_APPROVED_TEXT_REQUIRED for Nevada-specific contractor relationship terms.
```

#### General Nevada Disclosure
```
This transaction is governed by the laws of the State of Nevada. If you have questions
or complaints, you may contact:

- Nevada Financial Institutions Division: https://www.business.nv.gov/financial-institutions/
- Nevada Division of Insurance: https://doi.nv.gov or (775) 687-0700
- Nevada State Contractors Board: https://www.nvcontractorsboard.com/
- Nevada Real Estate Division (Escrow): https://www.nvrealtydiv.gov/
- Nevada Attorney General's Office: https://ag.nv.gov/

COUNSEL_APPROVED_TEXT_REQUIRED for complete dispute resolution and regulatory
contact information.
```

### 10.3 Key Nevada Statutes Quick Reference

| Statute | Subject | Key Provision |
|---|---|---|
| NRS 99.050 | Interest Rates | No general usury cap; 36% military cap |
| NRS 604A | Deferred Deposit / High-Interest Loans | License required; collateral prohibited for high-interest loans |
| NRS 604B | High-Interest Loans | 40% cap on certain charges; related provisions |
| NRS 604C | Consumer Litigation Funding | License required; not a loan; max 40% annual charge |
| NRS 624 | Contractors | License required by NSCB; contracting without license is a crime |
| NRS 645A | Escrow Agents | License required; fiduciary duties; no commingling |
| NRS 645B | Mortgage Brokers | License required for residential and commercial brokering |
| NRS 645F | Mortgage Lending / Servicing | Servicer license required; 10-loan small-servicer exemption |
| NRS 669 | Trust Companies | $1M equity requirement; retail trust-company licensing |
| NRS 669A | Family Trust Companies | Family members only; no public business |
| NRS 671 | Money Transmission | $100K minimum bond; crypto businesses licensed as MTL |
| NRS 675 | Installment Loans | License required; various exemptions; anti-evasion provisions |
| NRS 684A | Adjusters | Public adjuster licensing; body shops prohibited; $50K fines |
| NRS 686A | Trade Practices | Unfair/deceptive insurance practices prohibited |
| NRS 689A.135 | Health Insurance AOB | AOB permitted for health insurance (not property) |
| NRS 120A | Unclaimed Property | Virtual currency is property subject to unclaimed-property laws |
| NRS 657A | Regulatory Sandbox | Innovation pilot program; potential licensing exemptions |

### 10.4 Recommended Next Steps for Nevada

1. **Request NFID Licensure Determination**: Submit a formal business-model description to the Nevada Financial Institutions Division to obtain a written determination on whether token-collateral operations require money-transmitter or trust-company licensing.
2. **Engage Nevada Insurance Counsel**: Obtain written opinion on whether insurance-claim-advance products require a license and whether assignment of insurance proceeds as security is enforceable.
3. **Engage Nevada Escrow Counsel**: Obtain written opinion on escrow-backed advance structure under NRS 645A and NAC 645A, including proper role of smart contracts in the disbursement chain.
4. **Verify Contractor Partners**: Ensure all contractor partners are properly licensed by the Nevada State Contractors Board at https://www.nvcontractorsboard.com/.
5. **Consider Sandbox Enrollment**: Evaluate the Regulatory Experimentation Program (NRS 657A) as a pilot pathway for product testing with limited regulatory exemptions.
6. **Develop State-Specific Disclosures**: Finalize all disclosure language with Nevada-licensed counsel before any customer-facing activity.
7. **Monitor Legislative Activity**: Track Nevada legislative sessions for developments in cryptocurrency regulation (potential SB195 revival), insurance-claim financing, and escrow modernization.

---

*This packet is for informational purposes only and does not constitute legal advice.*
*All products marked as requiring legal review must obtain Nevada-specific counsel approval before launch.*
*Packet compiled from: Nevada Revised Statutes (leg.state.nv.us), Nevada Division of Insurance (doi.nv.gov), Nevada Financial Institutions Division, Nevada State Contractors Board, Nevada Real Estate Division.*
