# South Dakota (SD) — SmartContractor Compliance Profile

## 1. Executive Summary

South Dakota maintains a **moderate regulatory environment** for SmartContractor products. The state has **no state-level general contractor license** (local/city licensing only), **does not license public adjusters** (one of 16 states), and has **no specific Assignment of Benefits (AOB) statute for property insurance claims**. However, South Dakota enforces robust consumer finance regulation through the **Division of Banking**, including a **12% usury baseline (SDCL 54-3-1.1)** and a **36% all-in rate cap for licensed money lenders (SDCL 54-4-44 / Initiated Measure 21)**. Virtual currency is treated as "monetary value" requiring **money transmission licensure under SDCL 51A-17-1 et seq.**, and the Division of Banking may regulate escrow activities. Insurance claim handling is governed by general unfair claim settlement practice laws with **30-day response requirements (SDCL 58-33-67)**. AOB for property claims falls under general contract law, creating legal uncertainty for claim proceeds transfers.

**Status**: All live transaction features are **BLOCKED** pending legal review of token collateral treatment under money transmission law, AOB validity for property claims, and money lender licensing applicability to claim advance products.

---

## 2. Official Sources & Regulatory Bodies

| Agency / Source | URL | Jurisdiction |
|-----------------|-----|-------------|
| **SD Division of Insurance** | https://dlr.sd.gov/insurance | Primary insurance regulator; licensing, claims guidance, bulletins |
| **SD Division of Banking** | https://dlr.sd.gov/banking | Money lender licensing, money transmission, escrow oversight, virtual currency guidance |
| **SDCL Chapter 54-4 (Money Lending)** | https://sdlegislature.gov/Statutes/54-4 | Consumer lending license requirements, 36% rate cap, exemptions |
| **SDCL 54-3-1.1 (Interest / Usury)** | https://sdlegislature.gov/Statutes/54-3-1.1 | Baseline 12% interest rate; parties may agree in writing to any rate |
| **SDCL 54-4-44 (36% Rate Cap)** | https://sdlegislature.gov/Statutes/54-4-44 | All-in maximum finance charge for licensed money lenders (Initiated Measure 21) |
| **SDCL Chapter 51A-17 (Money Transmission)** | https://sdlegislature.gov/Statutes/51A-17 | Money transmission licensing; virtual currency as "monetary value" |
| **Division of Banking Memo 11-002 (Virtual Currency)** | https://dlr.sd.gov/banking/legal/documents/11_002_virtual_currency_transmission_in_sd.pdf | Crypto = "monetary value" under MT law |
| **SB 58 (2024 MTMA)** | https://sdlegislature.gov/Session/Bill/24779/266881 | Money Transmission Modernization Act adoption |
| **SDCL Chapter 58-33 (Unfair Trade Practices)** | https://sdlegislature.gov/Statutes/58-33 | Unfair claim settlement practices, 30-day rule |
| **SDCL 58-33-67** | https://sdlegislature.gov/Statutes/58-33-67 | Specific unfair claim practices; no private right of action |
| **SDCL 58-39-16.1 (AOB — Dental Only)** | https://sdlegislature.gov/Statutes/58-39-16.1 | Assignment of benefits statute applies only to dental service corps |
| **NAIC Adjuster Licensing Chart** | https://content.naic.org/sites/default/files/model-law-chart-pl-40-adjuster-licensing-requirements.pdf | Confirms SD does not license adjusters |

---

## 3. Lending & Consumer Finance

### 3.1 Money Lender Licensing (SDCL Chapter 54-4)
- **License Required**: Any person engaged in the business of lending money must obtain a money lender license through NMLS (SDCL 54-4-40).
- **Scope**: Includes creating, holding, purchasing, or acquiring retail installment contracts. Payday and title lenders are also licensed as money lenders.
- **36% All-In Rate Cap** (SDCL 54-4-44 / Initiated Measure 21): Applies to all loans originated, refinanced, rolled over, renewed, or flipped after November 15, 2016. Includes "all charges for any ancillary product or service and any other charge or fee incident to the extension of credit."
- **Penalties**: Violation is a **Class 1 misdemeanor**. The loan is **void and uncollectible** as to any principal, fee, interest, or charge.
- **Exemptions** (SDCL 54-4-37): State/national banks, bank holding companies, federally insured financial institutions, SD-chartered trust companies, and "any person selling goods or services and providing financing for such goods or services."
- **Small Volume Exemption** (SDCL 54-4-37.1): Originating, selling, servicing, or acquiring 5 or fewer loans in a 12-month period where total outstanding loans are under a statutory threshold.
- **Commercial Loan Exemption** (SDCL 54-4-44.4): Business-to-business lending is exempt from chapter provisions. Also, commercial-purpose loans of $5,000+ to borrowers with a FEIN not secured by a non-purchase-money motor vehicle security interest.

### 3.2 Interest Rate / Usury (SDCL 54-3-1.1)
- **Baseline Rate**: Unless otherwise agreed in writing, the maximum lawful rate of interest is **12% per annum** (SDCL 54-3-1.1).
- **Written Agreement Exception**: Parties may contract for any rate of interest in writing, with no statutory ceiling for non-regulated lenders.
- **Regulated Lender Exemption**: Licensed/regulated lenders are exempt from all interest rate limitations (SDCL 54-3-13).
- **Practical Impact**: The 36% all-in cap under SDCL 54-4-44 governs licensed money lenders regardless of written agreement terms.

### 3.3 Mortgage Licensing
- Mortgage lenders, brokers, and servicers must be licensed through NMLS under the South Dakota Division of Banking.

### 3.4 Key Risk for SmartContractor
- Any advance of funds to homeowners with an expectation of repayment from insurance proceeds may be characterized as a "loan" requiring a money lender license unless an exemption applies.
- The **36% all-in rate cap** severely limits revenue potential on small-dollar, short-duration advances.
- **Provider partnership model**: Partnering with an exempt entity (bank, federally insured institution) may apply the seller-financing or banking exemption. Requires specific legal analysis.

---

## 4. Escrow, Money Transmission & Fiduciary Obligations *(NEW)*

### 4.1 Money Transmission Framework (SDCL 51A-17-1 et seq.)
- **License Required**: No person may engage in the business of money transmission without a license from the Division of Banking (SDCL 51A-17-4).
- **Definition**: "Money transmission" means receiving monetary value for transmission to another location. South Dakota treats **virtual currencies, including cryptocurrencies, as "monetary value"** under this chapter (Division of Banking Memo 11-002, May 25, 2019).
- **MTMA Adoption**: SB 58 (2024, effective July 1, 2024) adopted the Money Transmission Modernization Act (MTMA), updating licensing standards, permissible investments, and net worth requirements.
- **Virtual Currency Kiosks**: SB 98 (2026, signed March 11, 2026) regulates virtual currency kiosks with $1,000 daily caps per user, $10,000/30-day caps, 3% fee caps, and 72-hour fraud victim refund requirements.

### 4.2 Escrow Regulation
- The **SD Division of Banking** has authority to regulate escrow activities conducted in connection with consumer lending, mortgage transactions, and money transmission.
- **No standalone escrow agent statute** was found for general real estate or construction escrow.
- Escrow activities incidental to licensed lending or money transmission are generally covered under the primary license.
- **Third-party escrow of insurance claim proceeds**: Falls into a regulatory gap — not explicitly licensed at the state level unless conducted by a bank, title company, or licensed money transmitter.

### 4.3 Fiduciary Obligations for Claim Proceeds
- Any entity holding insurance claim proceeds on behalf of a homeowner or contractor assumes **fiduciary duties** under general South Dakota common law.
- Commingling of claim proceeds with operating funds may violate trust accounting principles and expose the holder to conversion or breach-of-fiduciary-duty claims.
- SmartContractor's automated repayment routing from claim proceeds may constitute money transmission or escrow activity requiring licensure.

### 4.4 Status
```
ESCROW_ACTIVITY: UNKNOWN_REQUIRES_COUNSEL_REVIEW
MONEY_TRANSMISSION: LICENSE_REQUIRED_FOR_VIRTUAL_CURRENCY
FIDUCIARY_STATUS: APPLIES_IF_HOLDING_CLIENT_FUNDS
```

---

## 5. Contractor Licensing & Regulation

### 5.1 State-Level Licensing
- **No state-level general contractor license** in South Dakota.
- State-level licenses are required only for: **electrical contractors** and **plumbing contractors** (through the SD Department of Labor and Regulation).
- All other construction trades are regulated at the **local/city level**.

### 5.2 Major Local Licensing Requirements
| City / Municipality | License Type | Key Requirements |
|---------------------|-------------|------------------|
| **Sioux Falls** | Residential building contractor | $20,000 bond, $300K liability insurance, examination |
| **Rapid City** | Local contractor license | City-specific application and bonding |
| **Aberdeen** | Residential building contractor | Local licensing required |
| **Brookings** | Plumbing / residential contractor | City-level registration |
| **Watertown** | Residential contractor | $500K liability insurance required |

### 5.3 Contractor Excise Tax
- All contractors must obtain a **Contractor's Excise Tax License** from the South Dakota Department of Revenue (SDCL Title 10).
- Failure to obtain the license is a **Class 1 Misdemeanor** (up to $1,000 fine, 1 year imprisonment). Repeat violations: up to $4,000 fine, 2 years imprisonment.

### 5.4 Contractor Financing Implications
- Contractor working capital loans fall under SDCL Chapter 54-4 if not exempt.
- **Business-to-business loans are exempt** from money lender licensing requirements (SDCL 54-4-44.4).
- Equipment financing to licensed contractors generally qualifies as commercial/business-purpose lending.
- SmartContractor's equipment credit products for contractors should be structured to fall within the B2B or commercial loan exemption.

---

## 6. Token Collateral & Digital Asset Framework

### 6.1 Virtual Currency as Monetary Value
- South Dakota explicitly treats **virtual currencies, including cryptocurrencies, as "monetary value"** under SDCL Chapter 51A-17 (Division of Banking Memo 11-002).
- Entities receiving virtual currency for transmission must obtain a **money transmission license**.
- The state adopted the MTMA via SB 58 (2024) but **excluded the optional virtual currency article**.

### 6.2 Virtual Currency Custody & Reserve Requirements
- Licensees transmitting virtual currency must "hold like-kind virtual currencies of the same volume as that held by the licensee but that is obligated to consumers" (SB 58).
- This reserve requirement creates operational complexity for any token-collateral product.

### 6.3 Token Collateral for Equipment Credit
- **No specific statute** governs token collateral, digital asset lending, or smart contract-based collateral lock/liquidation in South Dakota.
- Whether token collateral lock and liquidation constitutes "money transmission," "escrow," or "lending" is **legally untested**.
- The use of token collateral for equipment credit is **unprecedented** under South Dakota law and likely triggers money transmission licensing analysis.
- Collateral liquidation mechanics may implicate lending, money transmission, or securities regulations.

### 6.4 Status
```
TOKEN_COLLATERAL: UNKNOWN_REQUIRES_COUNSEL_REVIEW
```
- All token collateral features are **BLOCKED** pending determination of whether activity constitutes money transmission, lending, or securities activity.

---

## 7. Insurance Claim Advances & Settlement Practices

### 7.1 Claim Handling Requirements (SDCL 58-33-67)
- Insurer must **acknowledge and act on claim communications within 30 days**.
- Insurer must adopt reasonable standards for **prompt investigation**.
- Claims payments must be accompanied by a **statement of coverage**.
- Insurer must promptly provide **reasonable explanation for denial or compromise settlement**.
- **No private right of action** for unfair claim settlement practices (SDCL 58-33-69).

### 7.2 Additional Living Expenses (ALE / Loss of Use)
- ALE coverage (Coverage D) is standard in homeowner policies.
- Covers necessary living expenses when the home is uninhabitable due to a covered peril.
- Policyholder must document expenses with receipts.
- Limitations: Time limits (commonly 12 months) and dollar limits apply per policy.

### 7.3 Emergency Advance Payments
- **No specific South Dakota statute** requires emergency advance payments for homeowner claims.
- General unfair claim settlement practice law requires prompt handling but does not mandate advance payments.

### 7.4 Loss Draft / Mortgagee Check Rules
- **No specific South Dakota statute** governs loss draft checks or mortgagee involvement in claim proceeds.
- Standard industry practice applies: when a mortgagee is named on the policy, insurance claim checks over a threshold (typically $40,000) are issued jointly to the homeowner and mortgagee.
- Mortgagee endorses and holds funds in escrow, disbursing in stages as repairs progress.

### 7.5 Key Risk for SmartContractor
- Advancing funds to homeowners based on pending insurance claims, with repayment from claim proceeds, may be characterized as **regulated lending** or may fall under **insurance premium finance** regulations.
- Any arrangement that guarantees claim proceeds or assumes insurance risk may trigger **insurance regulatory scrutiny**.
- **Repayment routing from claim proceeds** is BLOCKED pending lending characterization review.

---

## 8. Assignment of Benefits & Claim Proceeds Transfers

### 8.1 AOB Status: NOT SPECIFICALLY REGULATED FOR PROPERTY INSURANCE
- **No statute** specifically governs assignment of benefits for property/casualty insurance claims to contractors in South Dakota.
- SDCL 58-39-16.1 references assignment of benefits but applies **only to dental service corporations**. It has **no relevance to property insurance claims**.
- South Dakota does **not** have:
  - An AOB restriction statute for property insurance
  - AOB required notice/cancellation window
  - Font-size/signature rules for AOB documents
  - Contractor AOB limitation statutes

### 8.2 Governing Law
- Assignment of benefits for property insurance claims is governed by **general contract law** and **insurance policy terms**.
- Insurance policies may contain **anti-assignment clauses** or provisions requiring insurer consent.
- **Post-loss assignment** is generally treated differently from **pre-loss assignment** under common law.

### 8.3 Implications
- **Legal uncertainty** exists regarding whether an AOB gives contractors standing to sue insurers directly or to negotiate claims on behalf of policyholders.
- General contract assignment principles apply to claim proceeds transfers.
- Anti-assignment clauses in policies may restrict assignment without insurer consent.

### 8.4 Status
```
AOB_STATUS: UNKNOWN_REQUIRES_COUNSEL_REVIEW
```
- All AOB-related features are **BLOCKED** pending confirmation of AOB validity for property claims under South Dakota law.

---

## 9. Public Adjuster & Third-Party Claims Representation

### 9.1 Public Adjuster Licensing: NOT REQUIRED / NOT AVAILABLE
- South Dakota is **one of 16 states that do not license insurance adjusters at all** (NAIC chart; Division of Insurance website).
- No public adjuster, independent adjuster, or staff adjuster licensing requirement exists.
- The Division of Insurance only registers company-employed adjusters for **informational purposes**.
- South Dakota does **not define or regulate "public adjusting"** as a profession.

### 9.2 Who May Negotiate With Insurance Company
- **Licensed attorneys** may represent policyholders in insurance claim negotiations.
- **Policyholders themselves** may negotiate directly.
- **Any person** (including contractors) may theoretically assist, but representing an insured for compensation in insurance claim negotiations may fall under **unauthorized practice of law** restrictions.
- SDCL Title 58 does not define or regulate public adjusting.

### 9.3 SmartContractor Implications
- GCSC or a contractor negotiating with an insurance company on behalf of a homeowner is **not specifically prohibited by adjuster licensing law** because no such law exists.
- However, such activity may constitute **unauthorized practice of law** or may implicate **insurer-agent licensing** requirements depending on the scope of representation.
- Contractors **must not** hold themselves out as "public adjusters" or claim to be "licensed adjusters," as these representations could be deceptive or fraudulent.

---

## 10. Risk Dashboard & Compliance Matrix

### 10.1 SmartContractor Product Status

| Product Feature | Status | Notes |
|-----------------|--------|-------|
| Token Collateral Equipment Credit | **BLOCKED** | Virtual currency = "monetary value"; MT license likely required; token collateral lock/liquidation untested |
| Insurance Claim Advance | **BLOCKED** | May constitute lending under SDCL 54-4; 36% all-in rate cap applies to licensed lenders |
| Assignment of Benefits | **BLOCKED** | No SD property AOB statute; general contract law applies; validity untested |
| Repayment from Claim Proceeds | **BLOCKED** | Pending lending characterization and AOB validity review |
| Contractor B2B Financing | **DEMO ONLY** | Commercial exemption may apply; requires legal structuring confirmation |
| Homeowner Flow | **BLOCKED** | All homeowner-facing financial products blocked pending review |
| Contractor Flow | **DEMO ONLY** | Demo/mockup mode allowed for UI/UX testing; no live transactions |
| Restoration Company Flow | **DEMO ONLY** | Demo/mockup mode allowed for UI/UX testing; no live transactions |

### 10.2 Risk Scores

| Risk Category | Score | Rationale |
|---------------|-------|-----------|
| **Lending Risk** | **HIGH** | Broad money lender licensing (SDCL 54-4); strict 36% all-in rate cap; loans made in violation are void and uncollectible; Class 1 misdemeanor. Commercial/B2B exemptions may apply but require careful structuring. |
| **Insurance Claim Risk** | **MEDIUM** | 30-day claim handling requirement exists but is procedural only; no private right of action for unfair claim practices; no specific emergency advance statute; ALE coverage is standard but reimbursement-based. Main risk is characterization of claim advances as regulated lending. |
| **AOB Risk** | **UNKNOWN** | No specific AOB statute for property insurance. General contract law applies. Validity of post-loss assignment to contractors untested in South Dakota courts. Insurer policy terms may restrict assignment. |
| **Public Adjuster Risk** | **LOW** | South Dakota does not license public adjusters. No licensing requirement means no licensing violation risk. However, unauthorized practice of law and insurance representation restrictions may still apply. |
| **Token Collateral Risk** | **HIGH** | Virtual currency is "monetary value" requiring MT license. Token collateral lock/liquidation likely triggers MT licensing analysis. SB 58 (2024) and SB 98 (2026) demonstrate active regulatory attention to virtual currency. No lending-specific crypto framework exists. |
| **Escrow / Fiduciary Risk** | **MEDIUM** | Division of Banking may regulate escrow; third-party claim proceeds holding creates fiduciary duties under common law; automated repayment routing may constitute escrow or MT activity. |
| **Consumer Protection Risk** | **MEDIUM** | Strong consumer protection framework (36% rate cap, unfair trade practices, deceptive practices law). SDCL 58-33-46.1 allows private actions for prohibited UTPA practices. Class 1 misdemeanor for rate cap violations. |

### 10.3 Required Disclosures

| Disclosure | Status | Trigger |
|------------|--------|---------|
| Not a Licensed Money Lender | `COUNSEL_APPROVED_TEXT_REQUIRED` | All lending-adjacent products |
| 12% Baseline / 36% Rate Cap Notice | `REQUIRED` | All consumer financing products |
| Not Insurance / Not an Adjuster | `COUNSEL_APPROVED_TEXT_REQUIRED` | All claim-adjacent products |
| Not a Bank / Not a Money Transmitter | `COUNSEL_APPROVED_TEXT_REQUIRED` | All token collateral products |
| AOB Limitation / No SD Property AOB Statute | `COUNSEL_APPROVED_TEXT_REQUIRED` | Any assignment feature |
| No Guarantee of Insurance Payment | `REQUIRED` | All claim advance products |
| Fiduciary / Escrow Disclaimer | `COUNSEL_APPROVED_TEXT_REQUIRED` | Any claim proceeds holding or routing |

### 10.4 Required Legal Reviews

| Review Type | Priority | Scope |
|-------------|----------|-------|
| **Banking / Lending** | CRITICAL | Money lender licensing applicability; rate cap compliance; exemption analysis |
| **Money Transmission** | CRITICAL | Virtual currency treatment; token collateral lock/liquidation licensing |
| **Insurance** | HIGH | Claim advance characterization; AOB validity; UTPA compliance |
| **Escrow / Fiduciary** | HIGH | Third-party claim proceeds holding; automated repayment routing |
| **Consumer Protection** | MEDIUM | UTPA disclosures; deceptive practice avoidance; rate cap notices |
| **Securities** | MEDIUM | Token collateral liquidation; digital asset treatment |

---

## Appendix: Key Statutes Quick Reference

| Statute | Subject | Key Provision |
|---------|---------|-------------|
| SDCL 54-3-1.1 | Interest rate / usury | 12% baseline unless agreed in writing; no ceiling for non-regulated lenders with written agreement |
| SDCL 54-3-13 | Regulated lender exemption | Licensed lenders exempt from interest rate limitations |
| SDCL 54-4-40 | Money lender license | NMLS licensing required for lending business |
| SDCL 54-4-44 | 36% all-in rate cap | Initiated Measure 21; violation = Class 1 misdemeanor; loan void |
| SDCL 54-4-37 | Lending exemptions | Banks, sellers financing own goods, certain nonprofits |
| SDCL 54-4-37.1 | Small volume exemption | 5 or fewer loans in 12 months |
| SDCL 54-4-44.4 | Commercial loan exemption | B2B lending exempt from chapter |
| SDCL 51A-17-1(13) | Money transmission definition | Virtual currency = "monetary value" |
| SDCL 51A-17-4 | MT license required | No person may engage in MT without license |
| SDCL 58-33-67 | Unfair claim practices | 30-day acknowledgment; prompt investigation |
| SDCL 58-33-69 | No private right of action | UTPA claim practices statute does not create private action |
| SDCL 58-33-46.1 | Private UTPA actions | Private actions allowed for prohibited unfair trade practices |
| SDCL 58-39-16.1 | AOB (dental only) | Only applies to dental service corporations |

---

*Document compiled: 2025-07-09*
*Sources: Official South Dakota statutes, Division of Banking, Division of Insurance, NAIC, NMLS/CSBS*
*Disclaimer: This document is for research purposes only and does not constitute legal advice. All product features are BLOCKED pending state-specific legal review.*
