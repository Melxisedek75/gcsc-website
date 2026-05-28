# SmartContractor State Compliance: Oklahoma (OK)

<!-- OKLAHOMA — MODERATE REGULATION -->

---

## 1. State Summary

Oklahoma presents a **HIGH-RISK** regulatory environment for SmartContractor products, primarily due to the enactment of **House Bill 1084 (effective November 1, 2025)**, which **prohibits post-loss Assignment of Benefits (AOB)** for property damage claims under residential, commercial, and auto property insurance policies. AOB agreements are declared "against public policy and null and void." This is a critical blocker for the ClaimBridge product, which relies on assignment of claim proceeds for repayment routing.

On the digital asset front, Oklahoma enacted **HB 3594 (effective November 1, 2024)**, which creates a favorable environment for digital asset mining, self-custody, and node operation, and explicitly exempts miners/stakers from money transmitter licensing. However, **no statutory framework exists for token-collateralized lending**, leaving this area as UNKNOWN_REQUIRES_COUNSEL_REVIEW.

For lending, Oklahoma's **Uniform Consumer Credit Code (Title 14A)** and **Small Lenders Act (Title 59)** regulate consumer loans through the **Oklahoma Department of Consumer Credit**. Commercial/business-purpose loans may fall outside UCCC scope if properly structured. General contractors face **no state-level licensing requirement**, but trade-specific contractors (roofing, electrical, plumbing, HVAC) must be licensed through the **Oklahoma Construction Industries Board**. **HB 1940 (effective November 1, 2022)** prohibits roofing contractors from waiving or paying insurance deductibles.

Public adjusters are licensed by the **Oklahoma Insurance Department (OID)**, with a **10% fee cap** applicable to political subdivision claims per HB 1501 (effective November 1, 2025). Contractors and SmartContractor must **not** engage in public adjuster activities without proper licensing.

| Risk Area | Status |
|-----------|--------|
| Token Collateral / Equipment Credit | UNKNOWN_REQUIRES_COUNSEL_REVIEW |
| ClaimBridge (AOB-based) | **BLOCKED** (HB 1084) |
| Contractor Financing | LEGAL_REVIEW_REQUIRED |
| Consumer Lending | LEGAL_REVIEW_REQUIRED |

**Primary Regulators:**
- Oklahoma Insurance Department (OID) — oid.ok.gov
- Oklahoma Department of Consumer Credit — oklahoma.gov/okdocc.html
- Oklahoma Construction Industries Board (CIB) — oklahoma.gov/cib.html

---

## 2. Official Sources Reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| Oklahoma Insurance Department (OID) | https://www.oid.ok.gov | Primary insurance regulator; AOB bulletin 2025-07 |
| Oklahoma Department of Consumer Credit | https://oklahoma.gov/okdocc.html | Consumer lending, small lenders, supervised lenders, escrow regulation |
| Oklahoma Construction Industries Board | https://oklahoma.gov/cib.html | Contractor licensing (trade-specific) |
| Oklahoma State Banking Department | https://www.oklahoma.gov/banking.html | Money transmitter licensing |
| Oklahoma Legislature - OSCN | https://www.oscn.net | Official statutes (Title 14A, Title 36, Title 59) |
| OID Bulletin 2025-07 (HB 1084, HB 1501) | https://www.oid.ok.gov/bulletin-no-2025-07/ | AOB prohibition and public adjuster fee caps |
| Oklahoma Bill Tracking - HB 3594 | https://www.oklegislature.gov | Blockchain/digital asset mining law |
| Justia Oklahoma Statutes Title 36 | https://law.justia.com/codes/oklahoma/title-36/ | Insurance code, public adjuster rules |
| Justia Oklahoma Statutes Title 14A | https://law.justia.com/codes/oklahoma/title-14a/ | Uniform Consumer Credit Code |
| Oklahoma Senate Statute Archives | https://oksenate.gov | Official session laws and statutes |
| NAIC / OID Consumer Resources | https://www.oid.ok.gov/consumers/ | Consumer protection guidance |
| Freeman Law - Oklahoma Crypto | https://freemanlaw.com/cryptocurrency/oklahoma/ | Secondary source: crypto regulatory landscape |

---

## 3. Lending & Finance Licensing

### Uniform Consumer Credit Code (UCCC) — Okla. Stat. tit. 14A

Oklahoma's UCCC applies to **consumer loans**, including consumer credit sales, consumer leases, and supervised loans (14A O.S. § 1-201 et seq.).

- A "consumer loan" is a loan to a natural person primarily for personal, family, or household purposes (14A O.S. § 3-104)
- **Business-purpose loans** may fall outside UCCC scope if the predominant purpose is commercial and documented properly
- **Supervised loans**: Consumer loans with a loan finance charge exceeding **10% per year** (14A O.S. § 3-502) — this is Oklahoma's baseline usury threshold unless otherwise agreed under Okla. Const. Art. XIV, § 3
- **Supervised lender license** required for making or taking assignment of supervised loans; issued by the **Oklahoma Department of Consumer Credit**
  - Requirements: Net assets of at least $25,000; $5,000 surety bond (14A O.S. § 3-504)
  - License fees: Application fee + annual fee; calendar year expiration (December 31)

### Oklahoma Small Lenders Act (Title 59, post-2019)

- Replaced the Deferred Deposit Lending Act effective August 1, 2020
- Requires **Oklahoma Small Lender License** through the Department of Consumer Credit
  - $1,900 filing fee per location ($700 filing + $500 license + $700 supervision)
  - $50,000 tangible net worth per location
  - $25,000 surety bond per location (max $200,000 aggregate)
  - 3-year license period
- Applies to loans of $1,820.50 or less (amount adjusted periodically)
- Interest rate cap: 17% monthly on first $300; subsequent tiers apply
- **Ability-to-repay** requirement mandated

### Mortgage Lending

- Mortgage brokers, mortgage lenders, and mortgage loan originators licensed through Department of Consumer Credit
- Oklahoma Mortgage Broker Licensure Act applies

### Commercial / Business-Purpose Loans

- Loans made **primarily for business purposes** may be exempt from UCCC if properly documented
- Exclusions under UCCC include: extensions of credit to government, FHA loans, pawn transactions (14A O.S. § 1-202)
- **SmartContractor contractor/equipment financing** structured as true commercial loans may fall outside UCCC but require legal review
- No "commercial lender license" generally required in Oklahoma for business-purpose loans

### Credit Service Organizations (CSO)

- Title 24 O.S. §§ 131-148 regulates CSOs
- CSOs cannot operate from any location where a Title 14A licensee operates (24 O.S. § 148)
- $10,000 surety bond required
- **SmartContractor must not** structure as a CSO to evade lending laws

### Key Licensing Requirements at a Glance

| License Type | Regulator | Key Requirement |
|-------------|-----------|-----------------|
| Small Lender | OK Dept. of Consumer Credit | $50K net worth/location; $25K bond |
| Supervised Lender | OK Dept. of Consumer Credit | $25K net assets; $5K bond |
| Mortgage Lender | OK Dept. of Consumer Credit | Net worth, surety bond |
| Money Transmitter | OK State Banking Dept. | $275K-$3M net worth; statutory exemptions for miners (HB 3594) |

---

## 4. Escrow, Money Transmission & Usury

> **NEW SECTION** — Oklahoma-specific escrow, money transmission, and constitutional usury framework.

### Money Transmitter Licensing — Okla. Stat. tit. 6, § 1511 et seq.

- Oklahoma Money Transmitter Act (Title 6, § 1512; § 2101 et seq.) applies to "receiving money for transmission"
- Statutory definition of "money" = "a medium of exchange authorized or adopted by the United States or a foreign government"
- **Virtual currencies likely fall outside the definition of "money"** under the plain statutory text
- However, crypto-fiat exchange businesses may still be treated as money transmitters by the Banking Department on a case-by-case basis
- **HB 3594 exemption**: Digital asset miners, node operators, and blockchain stakers are **explicitly exempted** from Oklahoma money transmitter licensing: "A person shall not be required to obtain a money transmitter license for engaging in digital asset mining, operating a node, or providing staking services"

### Escrow Regulation

- The **Oklahoma Department of Consumer Credit** may regulate escrow activities related to lending and consumer credit transactions
- No standalone "escrow agent" license is generally required for escrow services incidental to lending
- **SmartContractor implications**: Any escrow or fund-holding mechanism for loan proceeds or claim payments should be reviewed for potential licensure triggers under the Department of Consumer Credit's supervisory authority
- Escrow agents handling real estate transactions may fall under separate regulatory oversight

### Usury Cap — Okla. Const. Art. XIV, § 3

- Oklahoma Constitution sets a **10% per annum usury cap** on loans unless otherwise agreed
- The UCCC operationalizes this through the supervised loan threshold: loans with finance charges exceeding 10% per year require a supervised lender license (14A O.S. § 3-502)
- Parties may contract for higher rates **if properly documented and licensed** under the UCCC or other applicable statutes
- Violations of usury limits may result in forfeiture of excess interest and potential civil penalties

### Key Thresholds

| Topic | Statute | Threshold |
|-------|---------|-----------|
| General usury cap | Okla. Const. Art. XIV, § 3 | 10% per annum |
| Supervised loan trigger | 14A O.S. § 3-502 | >10% finance charge |
| Money transmitter exemption | HB 3594 (Title 6) | Miners, node operators, stakers |
| Escrow oversight | Dept. of Consumer Credit | Lending-related escrow |

---

## 5. Contractor Licensing & Financing

### General Contractor Licensing

- **Oklahoma does NOT require a state-level license for general contractors** (Oklahoma Construction Industries Board official statement)
- Local jurisdictions (cities/counties) may impose their own licensing requirements
- General contractors should verify local requirements in each jurisdiction

### Trade-Specific Licensing (Required)

The following trades MUST be licensed through the **Oklahoma Construction Industries Board (CIB)**:

| Trade | License | Bond | Insurance |
|-------|---------|------|-----------|
| Electrical | Unlimited/Residential Electrical Contractor | $5,000 | $50,000 CGL |
| Plumbing | Plumbing Contractor | $5,000 | $50,000 CGL |
| Mechanical/HVAC | Mechanical Contractor | $5,000 | $50,000 CGL |
| Roofing | Roofing Contractor Registration | N/A | $500,000 CGL ($1M commercial) |

### Roofing-Specific Restrictions

- **HB 1940 (59 O.S. § 1151.30)**: Roofing contractors are **prohibited** from:
  - Advertising or promising to pay any part of an insurance deductible
  - Offering to compensate an insured for providing services
  - Offering "free roofs" or deductible waivers as inducement
- Penalty: The insurer **is not obligated to consider the estimate** of a violating contractor
- Mandatory written notification of these requirements must accompany initial estimates

### Contractor Financing Structure

- Equipment financing / working capital loans to licensed contractors may be structured as **commercial loans**
- If loans are truly business-purpose (not to a natural person for personal/family/household use), UCCC may not apply
- **SmartContractor must obtain legal review** to confirm business-purpose characterization
- Contractor financing must comply with Oklahoma's general contract and UCC Article 9 (secured transactions) laws

### Consumer Protection for Homeowner Transactions

- Any financing offered to homeowners for repairs may trigger UCCC applicability
- Home solicitation sales have special cancellation rights under UCCC
- Deceptive Trade Practices Act (Title 15, §§ 751-765) applies to commercial conduct

---

## 6. Token Collateral & Digital Assets

### Current Oklahoma Digital Asset Framework

**HB 3594 (signed May 13, 2024; effective November 1, 2024)** — Key provisions:

1. **Prohibits state/local government** from restricting:
   - Use of digital assets for legal purchases
   - Self-custody of digital assets via self-hosted or hardware wallets

2. **Digital asset mining authorized**:
   - Home mining permitted in residential zones (subject to local noise ordinances)
   - Commercial mining permitted in industrial zones

3. **Money transmitter exemption**:
   - Digital asset miners, node operators, and blockchain stakers are **explicitly exempted** from Oklahoma money transmitter licensing
   - "A person shall not be required to obtain a money transmitter license for engaging in digital asset mining, operating a node, or providing staking services"

4. **Non-discrimination**:
   - Oklahoma Corporation Commission prohibited from creating discriminatory electricity rates for mining businesses

5. **Liability limitation**:
   - Miners/node operators have limited liability for transaction validation activities

### Token Collateral for Loans

- **NO SPECIFIC STATUTORY FRAMEWORK** exists in Oklahoma for:
  - Digital asset collateral in lending transactions
  - Smart contract-based collateral lock mechanisms
  - Automated liquidation of token collateral
  - Crypto-secured equipment financing
- Oklahoma has **NOT** enacted the Uniform Commercial Code Article 12 (controlling digital assets) as of this research date
- UCC Article 9 (secured transactions) may apply to digital asset collateral through general intangible or other classification

### TOKEN_COLLATERAL_ASSESSMENT: UNKNOWN_REQUIRES_COUNSEL_REVIEW

| Factor | Status |
|--------|--------|
| State crypto licensing for miners | EXEMPT (HB 3594) |
| State crypto licensing for lenders | NOT EXPLICITLY ADDRESSED |
| Token collateral statutory framework | NONE FOUND |
| Smart contract enforceability | General contract law applies |
| UCC Article 12 adopted | NOT FOUND |
| Liquidation mechanism | NO STATUTORY PROTECTION |

---

## 7. Insurance Claims, AOB & Claim Advances

### Claim Handling Timeframes (36 O.S. § 1250.7)

- Insurer must acknowledge claim within **30 days** of notification
- Insurer must advise claimant of acceptance/denial within **60 days** of receiving properly executed proofs of loss
- Investigation must be completed within **60 days** unless more time is needed (notification required)
- Maximum investigation time: **120 days** (except fraud/arson investigations)
- Governor-declared catastrophes: deadlines may be extended by 20 days

### Unfair Claims Settlement Practices (36 O.S. § 1250.5)

Prohibited practices include:
- Failing to fully disclose benefits/coverages pertinent to a claim
- Failing to adopt reasonable standards for prompt investigation
- Not attempting in good faith to effectuate prompt, fair settlement
- Compelling policyholders to sue by offering substantially less than amounts ultimately recovered

### Additional Living Expenses (ALE)

- ALE coverage is standard in most Oklahoma homeowners policies
- Covers temporary housing costs when home is uninhabitable due to covered peril
- Policyholder must keep receipts; reimbursement is for costs **above and beyond** normal living expenses
- Time and dollar limits vary by policy
- **NFIP flood policies do NOT cover loss of use** — this is a significant gap for Oklahoma homeowners

### Emergency Claim Advances

- No specific Oklahoma statute found requiring insurers to provide emergency claim advances
- Some insurers offer advance payments for ALE or emergency repairs at their discretion
- Policy terms govern advance payment rights
- SmartContractor cannot rely on statutory right to claim advances for repayment routing

### KEY BLOCKER: HB 1084 on Assignment of Benefits

**36 O.S. § 1230(B)** (new statute, effective November 1, 2025):

> "A person shall not solicit or accept an assignment, in whole or in part, of any post-loss insurance benefit for property damage under an auto collision or comprehensive policy, residential property insurance policy, or commercial property insurance policy. **An assignment agreement is against public policy and is null and void, and any contract entered in violation of this section shall be void and unenforceable.**"

**Exceptions** (AOB prohibition does NOT apply to):
- Assignments to **federally insured financial institutions**
- Assignments to **mortgagees**
- Assignments to **subsequent purchasers of property**
- **Liability coverage** under any policy

**Violations** = unfair or deceptive trade practices under Oklahoma insurance law

**Implications for SmartContractor:**
- SmartContractor **CANNOT** use post-loss AOB as repayment mechanism for residential property claims
- AOB-based claim financing model is **BLOCKED** for property damage in Oklahoma
- Potential alternative: Structure as loan to insured with separate repayment obligation (not tied to AOB)
- Mortgagee/loss draft structures may still be viable for mortgaged properties

### AOB Status Summary

| Aspect | Status |
|--------|--------|
| Post-loss AOB for property damage | **PROHIBITED** (HB 1084, eff. 11/1/2025) |
| Pre-loss AOB | Not addressed in statute |
| AOB for liability claims | PERMITTED (explicitly excluded from ban) |
| AOB to financial institutions | PERMITTED (explicit exception) |
| AOB to mortgagees | PERMITTED (explicit exception) |
| Direction to pay | Permitted but not enforceable against insurer |

---

## 8. Public Adjuster & Insurance Representation

### Licensing Requirements

- **License required** through Oklahoma Insurance Department (36 O.S. § 6201 et seq.)
- Must pass Oklahoma property & casualty adjuster exam (70% passing score)
- Surety bond required (typically $5,000)
- Must be at least 18 years old
- Application through National Insurance Producer Registry (NIPR)

### Public Adjuster Responsibilities (36 O.S. § 6223)

Key requirements:
- **Written disclosure document** required before contract signing explaining:
  - Three types of adjusters (company, independent, public)
  - Insured is not required to hire a public adjuster
  - Public adjuster is not a representative of the insurer
  - Fee/commission is the obligation of the insured, not the insurer
- **Notification letter** to insurer signed by insured authorizing representation
- Must serve with **objectivity and complete loyalty** to the insured
- **Cannot solicit** during a loss-producing occurrence
- Must maintain records for **5 years**

### Fee Limitations

- **HB 1501 (36 O.S. § 6224, effective 11/1/2025)**: Total compensation to public adjuster cannot exceed **10% of insurance settlement** when adjusting for political subdivisions and agencies
- For **private policyholders**: No statutory fee cap, but fees must be "reasonable"
- **No advance fees** on percentage fee contracts (cannot require fee before claim proceeds are paid)

### Prohibited Conduct (36 O.S. § 6223)

- Cannot split commissions with unlicensed persons
- Cannot acquire interest in salvage without written permission
- Cannot refer repairs to persons with whom they have a financial interest
- Must disclose any third-party compensation
- Cannot enter into contract giving them authority to choose repair persons
- Cannot agree to settlement without insured's knowledge and consent

### SmartContractor Implications

- **SmartContractor employees/agents MUST NOT** negotiate with insurers on behalf of homeowners
- **SmartContractor employees/agents MUST NOT** prepare, present, or settle insurance claims for compensation
- Any claim assistance must be limited to **non-licensed activities** (e.g., technology platform, document management)
- If SmartContractor contractors provide claim support, they must NOT hold themselves out as public adjusters
- Violation = unauthorized practice, subject to OID enforcement

---

## 9. Mortgage, Loss Draft & Required Disclosures

### Loss Draft / Mortgagee Check Rules

- When a mortgagee is named on a property insurance policy, claim checks are typically issued as **two-party checks** payable to both the insured and the mortgagee
- The mortgage company's **loss draft department** handles insurance proceeds
- The mortgagee typically holds funds in escrow and disburses in stages as repairs progress
- Inspections may be required before additional funds are released

### Oklahoma Mortgagee Provisions

- HB 1084 explicitly **exempts** assignments to mortgagees from the AOB prohibition
- This means mortgagees can still receive claim proceeds directly
- Standard mortgagee clauses in Oklahoma policies provide the mortgagee with:
  - Right to receive claim payments
  - Right to foreclose on insurance proceeds in event of default
  - Right to require repair of damaged property

### Loss Draft Process (Industry Standard)

1. Insurance company issues two-party check (insured + mortgagee)
2. Both parties endorse the check
3. Mortgagee deposits into escrow / loss draft account
4. Mortgagee inspects and disburses in draws (typically 3-4)
5. Final disbursement after certificate of completion

### Required Disclosures

#### Disclosure 1: No Legal or Insurance Advice

```
[SmartContractor] is not a law firm, insurance company, or public adjuster.
We do not provide legal advice, insurance advice, or claims adjustment services.
All loan decisions are made by [LICENSED LENDER NAME], a [STATE/FEDERALLY] licensed
financial institution. For questions about your insurance claim, contact your
insurance company or a licensed Oklahoma public adjuster.
```

#### Disclosure 2: AOB Prohibition (Oklahoma HB 1084)

```
IMPORTANT NOTICE: Under Oklahoma law (House Bill 1084, effective November 1, 2025),
post-loss assignment of insurance benefits for property damage is prohibited and
declared against public policy. Any agreement purporting to assign your insurance
claim benefits to a third party (other than a federally insured financial
institution, mortgagee, or subsequent property purchaser) is void and unenforceable.
This loan is NOT contingent on or secured by any assignment of your insurance
claim. You remain personally responsible for repayment regardless of the outcome
of your insurance claim.
```

#### Disclosure 3: Token Collateral Risk (Pending Legal Review)

```
Digital assets used as collateral involve significant risks including price
volatility, regulatory uncertainty, and potential loss of collateral. Oklahoma
law does not currently provide a specific statutory framework for token-collateralized
lending. In the event of liquidation, collateral may be sold to satisfy your
obligation. You may lose your entire collateral deposit. This product is offered
on a pilot basis pending legal and regulatory review.
```

#### Disclosure 4: Roofing Contractor Deductible (HB 1940)

```
Under Oklahoma law (59 O.S. 1151.30), roofing contractors are prohibited from
advertising or promising to pay any part of your insurance deductible as an
inducement for repairs. If a roofing contractor violates this law, your insurer
is not obligated to consider that contractor's estimate. You are responsible
for paying your full insurance deductible and any loan obligations.
```

#### Disclosure 5: Public Adjuster Prohibition

```
[SmartContractor] employees and representatives are NOT licensed public
adjusters and WILL NOT negotiate with your insurance company on your behalf.
Only a licensed Oklahoma public adjuster may represent you in dealings with
your insurer. If you need claims representation, you may hire a licensed public
adjuster at your own expense. The Oklahoma Insurance Department maintains a
list of licensed public adjusters.
```

#### Disclosure 6: Loan Obligation Independent of Insurance

```
This loan is a legally binding obligation. Your responsibility to repay this
loan is INDEPENDENT of your insurance claim. Even if your insurance claim is
denied, delayed, or underpaid, you remain fully responsible for all loan
payments. Non-payment may result in default, collection action, and damage
to your credit. Please carefully consider whether you can afford this loan
before proceeding.
```

### SmartContractor Implications

- For **mortgaged properties**, SmartContractor may explore coordination with mortgagees for claim proceeds
- This would require legal review and mortgagee cooperation agreements
- For **non-mortgaged properties**, loss draft / mortgagee channel is unavailable
- SmartContractor should NOT attempt to hold or disburse insurance proceeds without proper licensing
- Direct payment to contractors (direction to pay) may be permitted but is **not legally enforceable** against the insurer

---

## 10. SmartContractor Compliance Dashboard

### Product Status Configuration

```json
{
  "state": "OK",
  "state_name": "Oklahoma",
  "regulatory_tier": "MODERATE",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Oklahoma enacted HB 3594 (11/1/2024) creating favorable environment for digital assets and exempting miners/node operators from money transmitter licensing. However, NO specific statutory framework exists for token-collateralized lending, smart contract collateral lock, or automated liquidation. Oklahoma has not adopted UCC Article 12 (digital assets). Token collateral products require state-specific legal review to determine enforceability under general secured transaction law (UCC Article 9) and general contract principles. 10% usury cap applies unless otherwise agreed."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "CRITICAL BLOCKER: Oklahoma HB 1084 (effective 11/1/2025) at 36 O.S. 1230(B) prohibits solicitation or acceptance of ANY post-loss assignment of insurance benefits for property damage under residential, commercial, or auto property policies. AOB agreements are declared 'against public policy and null and void.' Any contract entered in violation is 'void and unenforceable.' This directly blocks ClaimBridge's core AOB-based repayment model. Exemptions exist for federally insured financial institutions, mortgagees, and subsequent purchasers, but SmartContractor does not qualify. Violations are treated as unfair/deceptive trade practices."
  },
  "contractor_flow_status": "LEGAL_REVIEW_REQUIRED",
  "homeowner_flow_status": "BLOCKED_FOR_AOB_ADVANCES",
  "restoration_company_flow_status": "LEGAL_REVIEW_REQUIRED"
}
```

### Smart Contract Settings

| Action | Setting | Rationale |
|--------|---------|-----------|
| Block live loan creation | `true` | Both Token Collateral and ClaimBridge require legal review before live deployment |
| Block token collateral lock | `true` | No statutory framework for token collateral in Oklahoma; unknown enforceability |
| Block liquidation | `true` | Liquidation mechanism lacks statutory protection; potential legal risk |
| Block assignment of claim proceeds | `true` | HB 1084 explicitly prohibits post-loss AOB; any such assignment is void |
| Block repayment routing from insurance proceeds | `true` | Tied to prohibited AOB mechanism; alternative structures need legal review |
| Allow demo-only records | `true` | Demo mode permitted for product development and investor demonstrations |
| Allow hash/reference-only audit records | `true` | Non-binding audit records on blockchain permitted for transparency |

### Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **MEDIUM** | UCCC and Small Lenders Act create clear licensing framework. Business-purpose loans may be exempt but require careful structuring and legal review. Consumer lending requires Oklahoma Department of Consumer Credit license. 10% constitutional usury cap. |
| Insurance Claim Risk | **HIGH** | HB 1084 (eff. 11/1/2025) makes post-loss AOB void and unenforceable. This is a structural blocker for claim-proceeds-dependent products. Claim advances are discretionary, not statutory. |
| AOB Risk | **HIGH** | Post-loss AOB for property damage is PROHIBITED with civil penalties. SmartContractor cannot use AOB as repayment mechanism. Exception for financial institutions/mortgagees does not apply to SmartContractor. |
| Public Adjuster Risk | **MEDIUM** | Licensing required; 10% fee cap for public entity claims. SmartContractor must not engage in claims negotiation or representation. Clear separation of platform vs. claims services needed. |
| Token Collateral Risk | **HIGH-UNKNOWN** | HB 3594 creates favorable mining/self-custody framework but provides NO lending/collateral framework. No UCC Article 12 adoption found. Token collateral enforceability under general secured transaction law is untested in Oklahoma courts. |
| Escrow Risk | **MEDIUM** | Oklahoma Department of Consumer Credit may regulate escrow activities. Any fund-holding mechanism requires licensure review. |
| Money Transmitter Risk | **LOW-MEDIUM** | HB 3594 exempts miners/stakers. Crypto-fiat exchanges may still trigger licensing on case-by-case basis. |
| Consumer Protection Risk | **MEDIUM** | Oklahoma UCCC, Deceptive Trade Practices Act, and OID consumer protection rules create standard compliance obligations. HB 1940 adds contractor-specific restrictions. No unusual consumer protection burdens identified beyond standard requirements. |

### Overall Risk Assessment: HIGH

**Primary Blockers:**
1. **HB 1084 AOB Prohibition** — Blocks ClaimBridge core model
2. **No token collateral framework** — Unknown enforceability
3. **Contractor licensing variability** — Local requirements may apply

**Mitigation Path:**
- Obtain Oklahoma counsel opinion on alternative claim financing structures (non-AOB)
- Evaluate mortgagee-channel approach for mortgaged properties
- Pursue legal review of token collateral under UCC Article 9
- Confirm escrow activity does not trigger Department of Consumer Credit licensure
- Consider pilot program after counsel clearance with appropriate disclosures
- Monitor for 2026 legislative session amendments to HB 1084

---

*File prepared: 2025*
*Research based on statutes effective through November 2025*
*All SmartContractor products in Oklahoma are BLOCKED pending legal review*
*This file is for research purposes only and does not constitute legal advice*
