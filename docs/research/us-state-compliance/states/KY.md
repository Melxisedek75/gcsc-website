# Kentucky (KY) — SmartContractor Compliance Report

| Field | Value |
|---|---|
| **State** | Kentucky |
| **Jurisdiction** | Commonwealth of Kentucky |
| **Primary Regulators** | Kentucky Department of Insurance (KY DOI); Kentucky Department of Financial Institutions (KDFI) |
| **State Abbreviation** | KY |
| **Status Date** | July 2025 |
| **Overall Risk Level** | **HIGH** |
| **SmartContractor Operations** | **ALL LIVE OPERATIONS BLOCKED** — Pending legal review |

---

## 1. State Summary / Overview

Kentucky presents a **moderate-to-complex regulatory environment** for SmartContractor products. The Commonwealth lacks a state-level general contractor licensing regime (most contractor regulation is local/municipal), but imposes strict requirements in consumer lending, public adjuster conduct, and digital asset activities. Key findings include:

- **Consumer lending** is regulated under KRS Chapter 286.4 (Consumer Loan Companies) for loans $15,000 and under, requiring a license from the KDFI. An **8% usury cap** applies to loans under $15,000 unless the lender holds a consumer loan license (KRS 360.010). Maximum licensed rates are 3% per month on loans up to $3,000 and 2% per month on loans over $3,000 (KRS 286.4-530).
- **Contractor licensing** is primarily at the **local/municipal level** — Kentucky does NOT have a state-level general contractor license. Only electrical, plumbing, and HVAC contractors require state-level licenses.
- **Assignment of Benefits (AOB)** for property insurance is governed by common law and the Kentucky Supreme Court's 2012 *Wehr Constructors* decision, which held that **post-loss anti-assignment clauses are unenforceable** as against public policy. No comprehensive statutory AOB framework exists for property insurance (auto glass AOB was addressed separately in 2025).
- **Public adjusters** are heavily regulated under KRS 304.9-430 with recent HB 232 (2023) imposing **fee caps of 10–15%**, contract form approval requirements, mandatory surety bonds ($50,000), and strict conflict-of-interest prohibitions.
- **Escrow activities** in Kentucky may be regulated by the KDFI. Escrow-backed contractor advances fall into a regulatory gap with no explicit statutory safe harbor, requiring careful structuring.
- **Token collateral/digital assets**: Kentucky has enacted UCC Article 12 amendments (2023) recognizing digital assets as "controllable electronic records." HB 701 (March 2025) establishes a broad framework supporting blockchain and digital asset use, including clarifications that self-custody wallets do NOT trigger money transmission licensing. However, SB 189 (2026) creates a new virtual currency kiosk licensing regime effective April 2027. Kentucky has been **crypto-neutral** overall — there is no BitLicense equivalent.
- **Money transmission**: KRS Chapter 286.11 (Money Transmitters Act) may apply to virtual currency transmission. KDFI issued guidance in 2022 stating that virtual currency transmission activities may be covered.
- **Insurance claim advances**: Additional Living Expenses (ALE) are standard in homeowner policies but are typically reimbursed after incurred, not advanced. Kentucky's Unfair Claims Settlement Practices Act (KRS 304.12-230) governs claim handling. There is **no statutory right to an emergency advance** on insurance claims.

**Overall Status**: All SmartContractor live operations are **BLOCKED** pending legal review. Token collateral and claim advance products face significant regulatory uncertainty.

---

## 2. Official Sources & Regulators

| Agency | Role | URL |
|---|---|---|
| **Kentucky Department of Insurance (KY DOI)** | Primary insurance regulator; public adjuster licensing; claim settlement rules; property/casualty oversight | https://insurance.ky.gov |
| **Kentucky Department of Financial Institutions (KDFI)** | Consumer loan licensing; money transmitter regulation; mortgage licensing; virtual currency guidance; escrow oversight | https://kfi.ky.gov |
| **Kentucky Legislature (KRS)** | Statutes for lending, insurance, money transmission, consumer protection | https://apps.legislature.ky.gov |
| **Kentucky Department of Housing, Buildings and Construction** | State-level electrical, plumbing, and HVAC contractor licensing | https://dhbc.ky.gov |
| **NMLS / NIPR** | Nationwide licensing systems for mortgage and insurance licensing | https://mortgage.nationwidelicensingsystem.org / https://www.nipr.com |

### Key Statutes and Regulations

| Citation | Subject |
|---|---|
| KRS 286.4-410 et seq. | Consumer Loan Companies |
| KRS 286.8-010 et seq. | Mortgage Loan Companies/Brokers |
| KRS 286.11-001 et seq. | Money Transmitters Act |
| KRS 286.2-100 et seq. | Money Transmitter provisions (referenced) |
| KRS 288.020 | Consumer loan license threshold ($15,000) |
| KRS 360.010 | Usury cap (8% on loans under $15,000 unless licensed) |
| KRS 304.9-430 | Public Adjuster Licensing |
| KRS 304.9-433 | Public Adjuster Fees |
| KRS 304.12-230 | Unfair Claims Settlement Practices Act |
| KRS 304.14-250 (eff. Jan. 1, 2026) | Policy Assignability |
| KRS 355 (UCC) Article 12 | Controllable Electronic Records |
| 806 KAR 9:030 | Adjuster Licensing Restrictions |
| 806 KAR 12:095 | Unfair Claims Settlement Practices (Property/Casualty) |
| HB 232 (2023) | Public Adjuster Regulation Amendments |
| HB 701 (2025) | Digital Asset/Blockchain Framework |
| SB 189 (2026) | Virtual Currency Kiosk Licensing |

### Key Case Law

| Case | Holding |
|---|---|
| *Wehr Constructors, Inc. v. Assurance Co. of America*, 2012-SC-221 (Ky. Oct. 25, 2012) | Post-loss anti-assignment clauses in insurance policies are unenforceable as against public policy |

---

## 3. Lending & Finance Licensing

### 3.1 Consumer Loan Company License (KRS 286.4-410 et seq.)

- **Required for**: Making loans to consumers for personal, family, or household use in amounts of **$15,000 or less**.
- **Maximum rates**: 3% per month on loans up to $3,000; 2% per month on loans over $3,000.
- **Application fee**: $500 investigation + $500 annual license fee per location.
- **Bonding requirement**: Minimum $50,000 corporate surety bond (increased from $20,000 effective 2020).
- **Managing principal**: Requires at least one managing principal with 2+ years of lending experience at a financial institution.
- **Late fee limitation**: 2% of scheduled installment (KRS 286.4-530(4)).
- **Criminal penalties**: Operating without a license is a **misdemeanor** with fines of $500–$5,000. Unlicensed loans are **void** with no right to collect principal or charges.

### 3.2 Mortgage Loan Company/Broker License (KRS 286.8-010 et seq.)

- Required for making mortgage loans (no dollar limit).
- Late fee limitation: 5% (vs. 2% for consumer loan companies).
- Exemptions exist for certain business-purpose loans, natural persons making loans with own funds, and other categories.

### 3.3 Usury Cap (KRS 360.010)

- Kentucky imposes an **8% usury cap** on loans under **$15,000** unless the lender holds a **consumer loan license**.
- Licensed consumer loan companies may charge rates up to 3% per month ($3,000 and under) or 2% per month (over $3,000).
- **Violations**: Usurious contracts may be unenforceable or subject to penalty interest forfeiture.

### 3.4 Business-Purpose Loan Exemption

- The consumer loan company statute (KRS 286.4-410) applies only to loans for "personal, family, or household use."
- Business-purpose loans are generally exempt from consumer loan licensing but may still require a mortgage loan company/broker license under KRS 286.8 depending on collateral type.
- Kentucky is noted as having "other restrictions" on business-purpose lending that require case-by-case analysis.

### 3.5 Collection Agency Licensing

- **Kentucky does NOT require collection agency licenses** on the state level.

### 3.6 Key Risks for SmartContractor

- If SmartContractor provides financing to homeowners for restoration/repairs, this could trigger consumer loan licensing requirements if the loan is $15,000 or less and for personal/family/household use.
- If SmartContractor provides financing to contractors for business purposes, different rules may apply, but legal review is needed.
- The **8% usury cap** on unlicensed loans under $15,000 is a critical constraint.
- **All lending activity BLOCKED pending legal review.**

---

## 4. Escrow-Backed Contractor Advance Rules

### 4.1 Escrow Regulation in Kentucky

- The **Kentucky Department of Financial Institutions (KDFI)** may regulate escrow activities in the Commonwealth. There is **no standalone state escrow agent licensing statute** of general application comparable to some other states.
- Escrow activities related to real estate transactions are typically conducted by **title companies, attorneys, or licensed financial institutions**.
- KDFI has authority over certain escrow arrangements that intersect with consumer lending, mortgage lending, or money transmission.

### 4.2 Applicability to Contractor Advances

- **Escrow-backed contractor advances** — arrangements in which funds are held in escrow and released to contractors upon milestone completion — fall into a **regulatory gap** in Kentucky.
- No explicit Kentucky statute authorizes or prohibits escrow-backed advance products for residential construction or restoration work.
- Key structural considerations:
  - If the escrow arrangement involves **holding client funds for disbursement**, it may be characterized as a trust or fiduciary activity rather than a regulated escrow.
  - If the arrangement involves **advancing funds against future insurance proceeds or construction completion**, it may trigger consumer loan licensing (KRS 286.4-410) or usury rules (KRS 360.010).
  - If the escrow agent is a **licensed financial institution or attorney**, the arrangement may be shielded from certain regulatory requirements.

### 4.3 Structuring Considerations

| Factor | Status | Notes |
|---|---|---|
| State escrow license required | **No** (general) | No general escrow agent license; specific activities may require KDFI oversight |
| Attorney escrow | Permitted | Kentucky attorneys may hold client funds in IOLTA or dedicated escrow accounts |
| Title company escrow | Permitted | Licensed title companies may conduct escrow for real estate transactions |
| Bank/financial institution escrow | Permitted | Banks and credit unions may offer escrow services |
| Consumer loan trigger | **Risk** | Advances to homeowners ≤$15,000 may require consumer loan license |
| Usury cap applicability | **8%** if unlicensed | KRS 360.010 applies to any loan or forbearance under $15,000 |
| Money transmission risk | **Low–Moderate** | Pure escrow holding without transmission of monetary value to third parties typically does not trigger MT licensing |

### 4.4 SmartContractor-Specific Guidance

1. **Escrow agent selection**: Any escrow-backed advance product should use a **licensed Kentucky bank, credit union, attorney, or title company** as the escrow agent.
2. **Advance vs. loan characterization**: Structure must clearly distinguish between:
   - A true escrow holdback of **client's own funds** (lower risk), and
   - An **advance of third-party funds** to the contractor against future payment (higher risk; may be treated as a loan).
3. **Interest and fees**: Any fees charged in connection with an escrow-backed advance must comply with the **8% usury cap** if the arrangement is characterized as a loan under $15,000 and SmartContractor does not hold a consumer loan license.
4. **Disclosure requirements**: Homeowners must receive clear written disclosure that the escrow arrangement:
   - Does not guarantee insurance claim payment
   - Does not create a debtor-creditor relationship unless explicitly structured as a loan
   - Identifies the escrow agent and their regulatory status
5. **Contractor flow**: Advances to contractors (business purpose) face lower licensing risk but should still be structured to avoid inadvertent consumer loan characterization if the contractor is acting as a pass-through to the homeowner.

### 4.5 Risk Assessment

| Risk | Level | Rationale |
|---|---|---|
| Escrow licensing risk | **LOW** | No general escrow license required; use licensed escrow agents |
| Consumer loan trigger | **HIGH** | Advances to homeowners ≤$15,000 likely require consumer loan license |
| Usury risk | **HIGH** | 8% cap on unlicensed loans under $15,000; criminal penalties for violations |
| Money transmission risk | **MODERATE** | Depends on whether funds are "transmitted" to a third party vs. held in trust |
| Operational risk | **MODERATE** | Lack of clear statutory framework creates uncertainty |

**Status**: Escrow-backed contractor advances for homeowner flows are **BLOCKED** pending legal review. Contractor-flow (business-purpose) escrow advances are **LEGAL_REVIEW_REQUIRED**.

---

## 5. Contractor Licensing & Requirements

### 5.1 State-Level Contractor Licensing

- Kentucky **does NOT issue a state-level general contractor license**.
- Only **electrical, plumbing, and HVAC** contractors require state-level licenses through the Department of Housing, Buildings and Construction (DHBC).
- **General contractors are licensed at the local/municipal level** (city/county).

### 5.2 Major Local Jurisdiction Requirements

| Jurisdiction | License Type | Key Requirements |
|---|---|---|
| **Louisville-Jefferson County** | Type A ($125) / Type B ($50) | Liability insurance ($250,000), worker's comp, 6 hrs CE for Type A |
| **Lexington-Fayette** | Registration-based | Liability insurance ($500K commercial / $250K residential / $100K specialty) |
| **Bowling Green / Warren County** | License required | Liability insurance ($100,000), worker's comp |

### 5.3 Business Registration

- All businesses must register with the **Kentucky Department of Revenue**.
- Must obtain **Federal EIN** if employees.
- Must register with state, county, and local governments.

### 5.4 Implications for SmartContractor

- SmartContractor contractor partners **must be properly licensed at the local level** where they operate.
- SmartContractor should verify contractor licensing status at the applicable city/county level.
- Equipment financing or working capital loans to contractors may be treated as **business-purpose loans**, potentially exempt from consumer loan licensing but subject to different rules.
- **Contractor flow status**: `LEGAL_REVIEW_REQUIRED` due to local-level licensing complexity.

---

## 6. Insurance, AOB & Public Adjuster Rules

### 6.1 Assignment of Benefits (AOB)

**Status: ALLOWED (Post-Loss) — NO COMPREHENSIVE STATUTORY FRAMEWORK FOR PROPERTY INSURANCE**

#### Legal Framework
- **Kentucky Supreme Court, *Wehr Constructors, Inc. v. Assurance Company of America*, 2012-SC-221 (Ky. Oct. 25, 2012)**:
  - Held that **anti-assignment clauses in insurance policies are NOT enforceable for post-loss assignments**.
  - Adopted the "majority rule" — once a loss occurs, the insured's right to recover becomes a "chose in action" (property right), and restricting its transfer violates public policy.

#### Post-Loss Assignment Rights
- **Homeowners CAN assign their post-loss claim rights to contractors** without insurer consent.
- The assignment can include the right to receive payment directly from the insurer.
- The assignment does **NOT** transfer the entire policy — only the specific rights related to the loss.

#### What Kentucky Does NOT Have (for Property Insurance)
- No comprehensive AOB statute like Florida's.
- No required AOB contract forms approved by the DOI.
- No mandatory 3-day cancellation window specifically for AOB (though public adjuster contracts have a 3-day rescission period).
- No font-size/signature rules specifically for AOB.
- **No prohibition on contractors receiving AOB for property insurance**.

#### Auto Glass AOB (KY S 29, 2025)
- Kentucky enacted a law **ending AOB for auto glass repair and replacement** in 2025.
- This law does **NOT** apply to property insurance or contractor assignments.
- It demonstrates legislative willingness to regulate AOB in specific contexts.

#### Key Restrictions
- AOB contracts are subject to general contract law.
- AOB should be in writing and clearly specify what rights are being assigned.
- The assignment should be limited to the scope of work performed.
- **Contractors CANNOT act as public adjusters** on the same claim.
- **SmartContractor must ensure that any AOB process does not constitute unauthorized public adjusting or legal representation.**

### 6.2 Public Adjuster Licensing (KRS 304.9-430)

- **License required** — no person shall act as a public adjuster without a license.
- **Exceptions** (no license required):
  - Attorneys licensed in Kentucky acting in professional capacity
  - Licensed insurance agents with claim authority from insurer
  - Persons employed solely to obtain facts/technical assistance
  - Licensed health care providers preparing health claims
  - Insurer employees

#### Recent Changes: HB 232 (Effective June 29, 2023)
- **Fee caps**:
  - **Non-catastrophic claims**: 2.5% of first $25,000 + 10% of recovery exceeding $25,000
  - **Catastrophic claims**: 10% of total insurance recovery
- **Contract requirements**:
  - All public adjuster contracts must be **submitted to KY DOI for approval** before execution.
  - Copy of executed contract must be sent to DOI within **3 business days**.
- **3-day rescission period**: Insured has 3 business days to cancel without penalty.
- **Surety bond**: Increased to **$50,000** from $20,000.
- **Conflict of interest prohibitions**:
  - Public adjusters **cannot receive compensation from contractors** or their affiliates.
  - Must disclose any direct/indirect financial interest in construction firms.

#### Prohibited Contract Terms
- Fee collected when money is due but not paid
- Fee collected from first check only (rather than percentage of each check)
- Requires insurer to issue check only in public adjuster's name
- Collection costs or late fees

#### Key Implications for SmartContractor
- **SmartContractor and its contractor partners MUST NOT engage in activities that constitute public adjusting.**
- Negotiating with insurance companies on behalf of homeowners likely requires a public adjuster license.
- **Any claim negotiation or settlement assistance is BLOCKED pending legal review.**

### 6.3 Insurance Claim Advances

#### Additional Living Expenses (ALE) / Loss of Use
- ALE is standard coverage in homeowner insurance policies.
- **ALE is reimbursed after expenses are incurred**, not advanced.
- ALE covers: temporary housing, extra fuel/mileage, meals, laundry, pet boarding, storage.
- **There is no general statutory right to an "emergency advance"** on insurance claims in Kentucky.

#### Unfair Claims Settlement Practices (KRS 304.12-230 / 806 KAR 12:095)
- Kentucky's UCSPA prohibits 17 specific unfair practices.
- **No statutory private cause of action** — enforcement is by the Department of Insurance only.

#### Key Assessment
- **Claim advances are NOT a well-established statutory product in Kentucky**.
- Any product offering claim financing/advances would be in legally uncertain territory.
- **All claim advance activity BLOCKED pending legal review.**

### 6.4 Mortgage / Loss Draft

- When a mortgagee is named on a property insurance policy, loss payments are typically made jointly to the insured and the mortgagee.
- No specific Kentucky statute governing loss draft checks.
- Mortgage companies may hold claim proceeds in escrow and release them as repairs are completed.
- The *Wehr Constructors* decision confirms that post-loss assignment of claim proceeds is permitted.
- **Repayment routing from insurance proceeds is BLOCKED pending legal review.**

---

## 7. Token Collateral & Digital Asset Rules

### 7.1 UCC Article 12 — Digital Assets as Controllable Electronic Records

- Kentucky enacted the **2022 UCC Amendments including Article 12** in 2023.
- Article 12 creates a new property classification: **"Controllable Electronic Records" (CERs)**.
- Digital assets including cryptocurrencies and NFTs are recognized as a form of intangible personal property.
- **Control** is the key concept: power to avail benefits, prevent others from availing benefits, and transfer control.
- Secured parties can perfect security interests in CERs by **control** (super-priority) or by **filing** UCC-1.
- A "qualifying purchaser" who obtains control for value, in good faith, and without notice takes **free of competing property claims**.

### 7.2 HB 701 (Enacted March 24, 2025)

- Establishes a statutory framework supporting blockchain-based activity.
- Key provisions:
  - **Individuals may use digital assets** to purchase goods/services without additional taxes/fees.
  - **Self-custody wallets are explicitly exempt** from money transmission licensing.
  - **Node operation and staking services are authorized**.
  - **Staking is NOT a securities offering**.

### 7.3 Key Assessment for SmartContractor Token Collateral

- Kentucky law recognizes digital assets as property under UCC Article 12.
- Security interests in digital assets can be perfected by control.
- However, **using token collateral for lending purposes** involves uncertain regulatory territory:
  - If SmartContractor accepts and holds cryptocurrency as collateral, does this constitute money transmission?
  - If SmartContractor facilitates token lock/liquidation, is this a regulated activity?
  - Does the lending itself require a consumer loan or other license?
- **TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW** — no clear official guidance exists on token-collateralized lending specifically.
- Kentucky's **crypto-neutral stance** means there is no BitLicense equivalent, but this also means less regulatory clarity.

---

## 8. Consumer Protection & Usury

### 8.1 Usury (KRS 360.010)

- **8% per annum** legal rate of interest on loans under **$15,000** unless licensed as a consumer loan company.
- Licensed consumer loan companies may charge:
  - **3% per month** (36% APR) on loans up to $3,000
  - **2% per month** (24% APR) on loans over $3,000
- Contracts exceeding usury limits may be **void** or subject to penalty interest forfeiture.
- **Willful usury** (charging more than 4% above the legal rate) results in forfeiture of all interest and may subject the lender to penalties.

### 8.2 Unfair Claims Settlement Practices Act (KRS 304.12-230)

- Prohibits 17 specific practices including:
  - Failing to acknowledge and act promptly on claims
  - Failing to adopt reasonable standards for prompt investigation
  - Refusing to pay claims without reasonable investigation
  - Failing to affirm or deny coverage within a reasonable time
  - Not attempting in good faith to effectuate prompt, equitable settlements
  - Compelling insureds to litigate by offering substantially less than amounts ultimately recovered
- **No statutory private cause of action** — enforcement is by KY DOI.

### 8.3 General Consumer Protection

- Kentucky has strong consumer protection laws enforced by the Attorney General and KDFI.
- Deceptive trade practices are prohibited under KRS Chapter 367.
- SmartContractor must ensure all disclosures are clear, conspicuous, and accurate.
- Any financing product offered to consumers must comply with TILA/Reg Z (federal) and applicable Kentucky lending laws.

---

## 9. Money Transmitter & Virtual Currency Rules

### 9.1 Money Transmitter Act (KRS 286.11)

- Covers "monetary value" defined as a "medium of exchange, whether or not redeemable in money."
- **KDFI Guidance (September 2022)**: Virtual currency transmission activities **MAY be covered** by the Money Transmitter Act if they involve transmitting monetary value to another location.
- **HB 701 (2025)**: Confirms that holding digital assets in a **personal wallet does NOT trigger** money transmission licensing.

### 9.2 Virtual Currency Kiosk Licensing (SB 189, 2026)

- **Effective April 30, 2027**.
- Creates a standalone licensing regime for virtual currency kiosk operators.
- Minimum net worth: **$500,000**; surety bond: **$500,000–$5,000,000**.
- Transaction limits: $2,000/day/user; $10,500 aggregate for new users in first 30 days.
- Fee cap: greater of $5 or 18% of transaction value.
- Mandatory fraud refunds.
- Operating without a license is a **Class C felony**.

### 9.3 SmartContractor Assessment

- Pure **self-custody wallet** use (holding one's own keys) does **not** trigger money transmission licensing per HB 701.
- If SmartContractor **accepts, holds, or transmits** virtual currency on behalf of others, money transmission analysis is required.
- The **2022 KDFI guidance** suggests virtual currency transmission may be covered — counsel review is essential.
- SB 189 (kiosk licensing) does **not directly affect** token-collateralized lending but signals increasing regulatory attention to virtual currency activities.

---

## 10. SmartContractor Dashboard Rules & Risk Scores

### 10.1 Product Status Flags

```json
{
  "state": "KY",
  "state_name": "Kentucky",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security", "compliance"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED", "UCC_ARTICLE_12_DISCLOSURE", "VIRTUAL_CURRENCY_RISK_DISCLOSURE"],
    "notes": "KY recognizes digital assets as property under UCC Article 12 (controllable electronic records). HB 701 (2025) exempts self-custody wallets from money transmission licensing. However, token-collateralized lending with automated lock/liquidation has no clear regulatory guidance. Money Transmitter Act (KRS 286.11) may apply to certain virtual currency transmission activities. KDFI 2022 guidance indicates virtual currency transmission may be covered. All token collateral activities require counsel review for money transmission, consumer lending, and securities law implications. SB 189 (2026) creates kiosk licensing effective April 2027 but does not directly affect collateralized lending."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security", "compliance"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED", "NOT_PUBLIC_ADJUSTER_DISCLOSURE", "NO_CLAIM_ADVANCE_GUARANTEE_DISCLOSURE"],
    "notes": "Kentucky does not have a statutory framework for insurance claim advances. ALE is reimbursed, not advanced. Post-loss AOB is permitted under common law (Wehr Constructors, 2012) but no comprehensive statute governs the process. Public adjuster licensing is strict (HB 232, 2023) with 10-15% fee caps. Contractors cannot act as public adjusters. Any claim financing product would likely require consumer loan licensing if provided to homeowners. AOB for property insurance is not prohibited but lacks regulatory clarity. Heavy consumer protection risk."
  },
  "escrow_backed_contractor_advance": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["homeowner_escrow_advance", "escrow_fund_disbursement_to_homeowner"],
    "required_reviews": ["legal", "provider", "compliance"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED", "ESCROW_AGENT_DISCLOSURE", "NOT_A_LOAN_DISCLOSURE", "NO_CLAIM_GUARANTEE_DISCLOSURE"],
    "notes": "Escrow-backed contractor advances fall into a regulatory gap. No general escrow license is required, but advances to homeowners ≤$15,000 may trigger consumer loan licensing (KRS 286.4-410) and the 8% usury cap (KRS 360.010). Use of licensed escrow agents (banks, attorneys, title companies) reduces risk. Money transmission analysis required if funds are transmitted to third parties. Contractor-flow (business purpose) advances require legal review but face lower licensing risk. Homeowner-flow is BLOCKED."
  },
  "contractor_flow_status": "LEGAL_REVIEW_REQUIRED",
  "homeowner_flow_status": "BLOCKED",
  "restoration_company_flow_status": "LEGAL_REVIEW_REQUIRED"
}
```

### 10.2 Smart Contract Configuration

| Feature | Setting | Rationale |
|---|---|---|
| **Block live loan creation** | `true` | Consumer loan licensing may be required for loans to homeowners. All lending blocked pending legal review. 8% usury cap applies to unlicensed loans under $15,000. |
| **Block token collateral lock** | `true` | Money transmission law and consumer lending law may apply. Token collateral status unknown. |
| **Block liquidation** | `true` | Liquidation of token collateral triggers multiple regulatory concerns. Blocked pending legal review. |
| **Block assignment of claim proceeds** | `true` | AOB permitted under KY common law but lacks comprehensive regulatory framework. High legal risk without counsel-approved structure. |
| **Block repayment routing from insurance proceeds** | `true` | Mortgagee involvement, public adjuster restrictions, and consumer lending law create significant risk. |
| **Block escrow-backed homeowner advance** | `true` | May trigger consumer loan licensing and usury caps. Regulatory gap creates uncertainty. |
| **Allow demo-only records** | `true` | Demonstration/mockup mode is permissible for product development and marketing. |
| **Allow hash/reference-only audit records** | `true` | Reference-only records (hashes, metadata) that do not create legal obligations may be stored on-chain. |

### 10.3 Final Risk Scores

| Risk Category | Score | Notes |
|---|---|---|
| **Lending Risk** | **HIGH** | Consumer loan licensing required for loans $15,000 or less to consumers. Unlicensed lending is a criminal misdemeanor and loans are void. 8% usury cap on unlicensed loans. Business-purpose loan exemption may apply to contractor financing but needs legal confirmation. |
| **Insurance Claim Risk** | **HIGH** | No statutory framework for claim advances. ALE is reimbursed, not advanced. UCSPA provides claim handling standards but no private right of action. Significant consumer protection concerns. |
| **AOB Risk** | **MEDIUM** | Post-loss AOB is permitted under KY Supreme Court precedent (*Wehr Constructors*, 2012). However, no comprehensive regulatory framework exists. Auto glass AOB was prohibited in 2025, showing legislative willingness to restrict AOB. Confusion with public adjuster rules creates risk. |
| **Public Adjuster Risk** | **HIGH** | KY has strict public adjuster regulations with recent HB 232 (2023) imposing fee caps, contract approval requirements, and conflict-of-interest rules. Contractors cannot act as public adjusters. Any activity resembling claim negotiation on behalf of homeowners carries high risk. |
| **Token Collateral Risk** | **UNKNOWN** | UCC Article 12 recognizes digital assets as property. HB 701 (2025) provides some regulatory clarity. However, token-collateralized lending with automated lock/liquidation has no clear regulatory guidance. Money transmitter law may apply. Kentucky is crypto-neutral with no BitLicense equivalent. |
| **Escrow-Backed Advance Risk** | **MODERATE–HIGH** | No general escrow license required, but consumer loan and usury risks attach depending on advance structure. Use of licensed escrow agents mitigates some risk. Homeowner advances are high risk; contractor advances are moderate risk. |
| **Consumer Protection Risk** | **HIGH** | KY has strong consumer protection laws. Unfair Claims Settlement Practices Act, consumer loan usury rules, and public adjuster protections all create compliance obligations. KY DOI is active in consumer protection enforcement. |

### 10.4 Required Disclosures

#### [DISCLOSURE 1: NOT A PUBLIC ADJUSTER]
```
COUNSEL_APPROVED_TEXT_REQUIRED

SmartContractor [and its contractor partners] are NOT licensed public adjusters in the 
Commonwealth of Kentucky. We do NOT negotiate with insurance companies on your 
behalf or represent you in any insurance claim. If you need assistance with your 
insurance claim, you may hire a licensed public adjuster, whose fees are capped by 
Kentucky law at 10% for catastrophic claims and 2.5% of the first $25,000 plus 10% 
of amounts above $25,000 for non-catastrophic claims.
```

#### [DISCLOSURE 2: NOT A LENDER / NOT A LOAN]
```
COUNSEL_APPROVED_TEXT_REQUIRED

SmartContractor is not a licensed lender in Kentucky. Any financing arrangement described 
herein is not a loan and does not create a debtor-creditor relationship governed 
by Kentucky consumer lending laws. If you are seeking a loan, you should contact 
a licensed consumer loan company or financial institution.
```

#### [DISCLOSURE 3: TOKEN COLLATERAL RISK]
```
COUNSEL_APPROVED_TEXT_REQUIRED

Digital assets used as collateral are subject to significant risk, including but not 
limited to: price volatility, smart contract risk, regulatory uncertainty, and the 
possibility of total loss. Kentucky law recognizes digital assets as property under 
UCC Article 12. If your collateral is liquidated, you may lose your digital assets 
and still owe additional amounts. COUNSEL_APPROVED_TEXT_REQUIRED.
```

#### [DISCLOSURE 4: AOB INFORMATION]
```
COUNSEL_APPROVED_TEXT_REQUIRED

You may have the right to assign your post-loss insurance claim benefits to a 
contractor under Kentucky law. This assignment does not transfer your entire 
insurance policy — only the rights related to the specific repair work. You are 
not required to sign an assignment of benefits. You have the right to cancel any 
contract within the time period specified in the contract. If you have questions, 
you should consult an attorney.
```

#### [DISCLOSURE 5: NO GUARANTEE OF INSURANCE PAYMENT]
```
COUNSEL_APPROVED_TEXT_REQUIRED

SmartContractor cannot guarantee that your insurance company will approve your claim, 
pay any specific amount, or provide an advance payment. Insurance claim payments 
are subject to your policy terms, deductibles, coverage limits, and your insurance 
company's claims handling procedures. Additional Living Expense coverage is 
typically reimbursed after you incur the expenses, not in advance.
```

#### [DISCLOSURE 6: MORTGAGEE/LOSS PAYEE]
```
COUNSEL_APPROVED_TEXT_REQUIRED

If your property is subject to a mortgage, your mortgage lender may have rights 
to insurance claim proceeds. Any payment arrangement may require the mortgage 
lender's involvement or endorsement. You should notify your mortgage lender of 
any loss and contact them regarding claim proceeds.
```

#### [DISCLOSURE 7: ESCROW AGENT AND ADVANCE TERMS]
```
COUNSEL_APPROVED_TEXT_REQUIRED

Any funds held in connection with your project are maintained by an independent 
escrow agent [name and license/status of agent]. This escrow arrangement does 
not guarantee that funds will be advanced to you or your contractor. Disbursement 
is contingent upon [milestone completion / verification of work / other conditions]. 
If any fees or charges apply, they will be disclosed in writing before you enter 
into this arrangement. This is not a loan unless explicitly stated in a separate 
loan agreement prepared by a licensed lender.
```

---

## Appendix: Important Dates

| Date | Event |
|---|---|
| Oct. 25, 2012 | KY Supreme Court *Wehr Constructors* decision — post-loss anti-assignment clauses unenforceable |
| June 29, 2023 | HB 232 public adjuster amendments effective |
| March 24, 2025 | HB 701 digital asset framework enacted |
| January 1, 2026 | KRS 304.14-250 (policy assignability) effective |
| April 30, 2027 | SB 189 virtual currency kiosk licensing effective |

---

*This compliance report was prepared for informational purposes only. It does not constitute legal advice. All SmartContractor products and services in Kentucky are BLOCKED pending legal review by qualified Kentucky counsel. The information contained herein is based on publicly available sources and may not reflect the most current legal developments.*

*Last Updated: July 2025*
