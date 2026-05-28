# SmartContractor State Compliance: Maine (ME)

> **Version:** 1.0 | **Date:** 2025-06-25 | **Status:** LEGAL_REVIEW_REQUIRED — All live operations BLOCKED pending Maine-licensed counsel review
>
> *This document is for research purposes only and does not constitute legal advice. Statutory references should be independently verified before reliance.*

---

## 1. State Summary & Risk Overview

Maine presents a **moderate-to-high regulatory complexity** environment for SmartContractor products. The state maintains a comprehensive consumer credit regulatory framework (Title 9-A Maine Consumer Credit Code), recently enacted virtual currency/money transmission legislation (Title 32 Chapter 79-A, effective 2023), and is implementing a new residential contractor licensing regime (LD 1226, effective January 1, 2027). Maine does not have a specific Assignment of Benefits statute for property/casualty insurance claims — AOBs in the property context appear governed by common law contract principles. The state's adjuster licensing regime does not distinguish between public and independent adjusters. Token collateral activities likely trigger virtual currency business activity licensing requirements, but there is an important exemption for secured creditors taking virtual currency as collateral (32 MRSA §6074(2)(G)). All SmartContractor live operations should be treated as **BLOCKED** pending Maine-specific legal review.

### Key Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **High** | Maine Consumer Credit Code (Title 9-A) requires supervised lender license for consumer loans. Mortgage servicers also require licensing. Any credit to homeowners for restoration is likely consumer-purpose and requires licensing. Strong enforcement history. |
| Insurance Claim Risk | **Medium-High** | Unfair Claims Settlement Practices Act (§2436-A) creates private cause of action with attorney's fees and 18% annual interest. 30-day payment requirement. No specific emergency advance statute. Mortgagee involvement complicates repayment. |
| AOB Risk | **Medium-High** | No specific property/casualty AOB statute; governed by common law. Post-loss assignments generally valid but scope uncertain. Anti-assignment clauses in policies may be enforceable pre-loss. Broad assignment language risks assigning all policy rights. |
| Public Adjuster Risk | **High** | Maine does not differentiate between independent and public adjusters. Any claim negotiation on behalf of homeowner without adjuster license may violate 24-A MRSA. Contractor cannot simultaneously repair and negotiate claims. |
| Token Collateral Risk | **High** | Comprehensive virtual currency licensing regime (32 MRSA Ch. 79-A, Subchapter 13). Token lock/holding/liquidation likely constitutes licensable virtual currency business activity. Secured creditor exemption (§6074(2)(G)) provides potential pathway but requires careful legal analysis. Recent enforcement actions (BlockFi, Nexo) demonstrate active regulation. |
| Consumer Protection Risk | **High** | Maine has strong consumer protection laws. Home Construction Contract Act (10 MRSA §1487) mandates specific disclosures; violations are unfair trade practices. Unfair Claims Settlement Practices Act creates private rights of action. New contractor licensing law (effective 2027) adds additional compliance requirements. |
| Escrow-Backed Advance Risk | **Medium** | Maine Office of Securities may regulate escrow activities. Contractor advance products structured through escrow arrangements require analysis under consumer lending and money transmission frameworks. No specific escrow statute for contractor advances. |

---

## 2. Regulatory Bodies & Official Sources

| Source | URL | Relevance |
|--------|-----|-----------|
| Maine Bureau of Insurance | https://www.maine.gov/pfr/insurance | Primary insurance regulator; claims handling rules, adjuster licensing |
| Maine Office of Securities | https://www.maine.gov/pfr/securities | Securities enforcement; digital asset investor alerts; crypto lending enforcement (BlockFi, Nexo); escrow regulation |
| Maine Bureau of Consumer Credit Protection | https://www.maine.gov/pfr/consumercredit | Consumer lending licensing (supervised lender, loan broker); money transmitter licensing |
| Title 9-A Maine Consumer Credit Code | https://legislature.maine.gov/statutes/9-A/title9-A.pdf | Comprehensive consumer lending, mortgage servicing, and credit regulation |
| Title 24-A Maine Insurance Code | https://legislature.maine.gov/statutes/24-A/ | Insurance contracts, claims settlement, unfair claims practices, adjuster licensing |
| Title 32 Chapter 79-A: Money Transmitters (incl. Virtual Currency) | https://legislature.maine.gov/statutes/32/title32ch79-Asec0.html | Money transmission and virtual currency business activity licensing |
| Title 32 Chapter 80: Money Transmitters | https://legislature.maine.gov/statutes/32/title32ch80.html | Money transmission licensing requirements |
| Title 10 §1487: Home Construction Contracts | https://legislature.maine.gov/statutes/10/title10sec1487.html | Contractor written contract requirements, warranties, dispute resolution |
| Title 32 Chapter 134: Maine Home Contractor Licensing Act (LD 1226) | https://legislature.maine.gov/statutes/32/title32ch134.html | New residential contractor licensing effective January 1, 2027 |
| Bureau of Insurance Adjusters FAQs | https://www.maine.gov/pfr/insurance/frequently-asked-questions/adjusters | Adjuster licensing requirements, lines of authority, staff adjuster exemptions |
| Bureau of Insurance Homeowners Claims | https://www.maine.gov/pfr/insurance/consumers/homeowners-or-renters-insurance/homeowners-renters-claims | Claims process guidance, ALE documentation, mortgagee check rules |
| NASAA Informed Investor Advisory: Cryptocurrencies | https://www.nasaa.org/44848/informed-investor-advisory-cryptocurrencies/ | Investor education on crypto risks (referenced by Maine Office of Securities) |
| Pierce Atwood: Maine Office of Securities Enforcement Update | https://www.pierceatwood.com/alerts/maine-office-securities-enforcement-update | Details on BlockFi and Nexo crypto lending enforcement actions |
| C.M.R. 02-030 Ch. 709: Money Transmitter NMLS Rules | https://www.law.cornell.edu/regulations/maine/department-02/division-030/chapter-709 | NMLS licensing procedures for money transmitters |

---

## 3. Lending / Finance Licensing Notes

### Supervised Lender License (9-A MRSA §2-301, §2-302)
- **Required for**: Making "supervised loans" (consumer loans with finance charges exceeding certain thresholds, or secured by real estate)
- **Administrator**: Bureau of Consumer Credit Protection (BCCP)
- **Net worth requirement**: $25,000 per office (§2-302(3-B))
- **Surety bond**: $50,000 (§2-302(1-A))
- **NMLS**: Applications processed through NMLS
- **Annual renewal**: By December 31 each year
- **Exemptions**: Supervised financial organizations (banks, credit unions, etc.)

### Usury Cap (9-A MRSA §150)
- **18% annual interest rate cap** applies to loans under $10,000 unless the lender holds a supervised lender license
- Any extension of credit to a Maine consumer for personal, family, or household purposes exceeding 18% APR without proper licensing may violate the usury statute
- **Critical**: Unlicensed lending above 18% APR is a serious violation with potential criminal and civil consequences

### Mortgage Loan Servicing (9-A MRSA §2-301 et seq., as amended by SP 444)
- **Mortgage servicers must obtain Supervised Lender License** effective November 1, 2017
- A person servicing mortgage loans (direct collection of payments from or enforcement of rights against debtors arising from supervised loans secured by a dwelling) must be licensed

### Loan Broker License (9-A MRSA §10-201 et seq.)
- **Required for**: Acting as intermediary between borrowers and lenders for a fee
- **Bond**: $25,000
- **Fee**: $150 annual license fee
- **Registration**: All loan officers must be registered

### Money Transmitter License (32 MRSA Chapter 79-A & Chapter 80)
- **Required for**: Engaging in money transmission or virtual currency business activity
- **Administrator**: Bureau of Consumer Credit Protection
- **Surety bond**: $100,000 (§6100-S)
- **Net worth**: Greater of $100,000 or 3% of total assets for first $100M (§6100-R)
- **NMLS**: Applications processed through NMLS

### Commercial/Business-Purpose Loans
- **Commercial loans not covered by Title 9-A** generally do not require a supervised lender license
- However, any loan to an individual for personal, family, or household purposes may trigger consumer credit regulation
- **UNKNOWN_REQUIRES_COUNSEL_REVIEW**: Whether contractor equipment credit through SmartContractor constitutes a "consumer loan" or "supervised loan" depends on specific facts and requires legal analysis

### Key Risk
Any SmartContractor product offering credit to homeowners for repairs/restoration would likely be characterized as a **consumer purpose loan** and require supervised lender licensing or partnership with a licensed supervised lender. The 18% usury cap for loans under $10,000 makes unlicensed consumer lending particularly risky.

---

## 4. Escrow-Backed Contractor Advance Rules

> **NEW SECTION** — Escrow-backed contractor advances are a specialized product category that intersects consumer lending, money transmission, and contractor financing regimes in Maine.

### Regulatory Framework for Escrow Activities

The **Maine Office of Securities** (within the Department of Professional and Financial Regulation) has regulatory authority over escrow activities, particularly those involving consumer transactions, securities, or money transmission. While Maine does not have a single comprehensive escrow statute applicable to contractor advances, multiple regulatory frameworks may apply:

#### Potential Licensing Triggers
- **Money Transmission (32 MRSA Chapter 79-A & Chapter 80)**: If an escrow-backed advance involves receiving funds "for transmission" or holding funds on behalf of others, money transmitter licensing may be triggered. 32 MRSA Chapter 80 governs money transmission licensing requirements.
- **Supervised Lender License (9-A MRSA §2-301)**: If the escrow advance is structured as a loan (rather than a true escrow holding), supervised lender licensing may be required, especially when the ultimate obligor is a consumer.
- **Consumer Credit Code (9-A MRSA Title 9-A)**: Any escrow arrangement where a contractor or intermediary advances funds to a consumer and holds claim proceeds as repayment may constitute a "supervised loan" requiring licensing.

### Escrow-Backed Advance Structure Analysis

| Structural Element | Regulatory Treatment | Risk Level |
|--------------------|---------------------|------------|
| Third-party escrow agent (licensed/title company) holds funds | Generally lowest risk; does not implicate lending if agent is independent | Low |
| SmartContractor or affiliate holds funds in escrow | Likely constitutes money transmission or deposit-taking; requires licensing | High |
| Contractor holds homeowner's insurance proceeds in escrow | Potential consumer protection violation; may trigger usury if fees/interest charged | High |
| Escrow funded by advance from SmartContractor to contractor | If repaid from insurance proceeds, may be a disguised loan to consumer; 18% usury cap applies | Medium-High |
| True escrow — funds held pending work completion | May not require lending license if no extension of credit; administrative escrow rules may apply | Medium |

### Key Compliance Requirements for Escrow-Backed Advances

1. **Independent Escrow Agent**: Use a Maine-licensed title insurance company, attorney escrow account, or federally insured bank as the escrow agent. SmartContractor should not directly hold consumer funds.

2. **Written Escrow Agreement**: All escrow arrangements must be documented in writing, specifying:
   - The escrow agent's duties and limitations
   - Conditions for disbursement (e.g., inspection completion, lien waiver submission)
   - Fee structures and who pays escrow fees
   - Timeline for disbursement
   - Dispute resolution procedures

3. **Usury Compliance (9-A MRSA §150)**: Any fees, charges, or implicit interest in connection with an escrow-backed advance must be aggregated to determine whether the total cost exceeds 18% APR for advances under $10,000. If the all-in rate exceeds 18%, a supervised lender license is required.

4. **Disclosure Requirements**: Under Maine's strong consumer protection framework, all material terms of an escrow-backed advance must be disclosed in writing before the consumer becomes obligated, including:
   - Total amount of the advance
   - All fees and charges
   - Annual percentage rate (APR)
   - Repayment terms and source of repayment
   - Consequences of insurance proceeds being insufficient
   - Mortgagee's priority interest, if applicable

5. **Mortgagee Notification**: If the property securing the repair work has a mortgage, the mortgagee's loss draft department must be notified of any escrow arrangement involving insurance proceeds. The mortgagee typically has a superior security interest in insurance claim payments.

6. **No Commingling**: Escrow funds must be maintained in a segregated account and not commingled with the escrow agent's operating funds or the contractor's business funds.

### SmartContractor-Specific Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| Disguised consumer lending | An "advance" to a contractor repaid from insurance proceeds may be recharacterized as a loan to the homeowner | Structure as true commercial advance to contractor; ensure homeowner is not the obligor; COUNSEL_REVIEW_REQUIRED |
| Money transmission | Holding or transferring funds on behalf of homeowners or contractors may require money transmitter license | Use licensed third-party escrow agent; do not take possession of funds |
| Usury violation | Combined fees and implicit interest exceeding 18% APR on advances under $10,000 | Calculate all-in APR; obtain supervised lender license if threshold exceeded |
| Unfair trade practice | Violation of Maine consumer protection law (5 MRSA §207) by failing to disclose material terms | Full written disclosure; conspicuous fee schedules; right of rescission where applicable |
| Mortgagee priority | Disbursing funds without accounting for mortgagee's interest | Coordinate with mortgage servicer; name mortgagee on all claim-related checks |

### Status: LEGAL_REVIEW_REQUIRED
Escrow-backed contractor advances in Maine require significant legal analysis to determine the applicable regulatory framework. The intersection of consumer lending, money transmission, and escrow regulation creates complexity that cannot be resolved without Maine-specific legal review.

---

## 5. Contractor Licensing & Construction Law

### Current Contractor Licensing (Pre-January 1, 2027)
- Maine does **NOT** currently have a statewide general contractor license
- Electricians, plumbers, and fuel technicians are licensed at the state level through the Office of Professional and Occupational Regulation (OPOR)
- General contractors, roofers, siding installers, painters, etc. are regulated at the **municipal level** through local business licenses and building permits
- Written contract required for any home construction contract exceeding **$3,000** (10 MRSA §1487)
  - Must include: names of parties, property location, work dates, contract price, payment method (down payment capped at 1/3), warranty statement, dispute resolution method, change order provision, consumer protection information
  - Violation is an unfair trade practice (10 MRSA §1490)

### New Law: LD 1226 — Maine Home Contractor Licensing Act (Effective January 1, 2027)
- **State license required** for residential construction projects exceeding **$15,000**
- Creates a **Residential Construction Board** within DPR
- **Insurance requirements**: $300,000 per person/$500,000 per occurrence personal injury; $50,000 property damage
- **Continuing education**: 6 hours per annual cycle
- **Civil fines**: Up to $10,000 for violations
- **Unlicensed contractors barred from filing mechanic's lien claims**
- Violations treated as **unfair trade practices** under Maine consumer protection law

### Contractor Financing
- No specific statute regulates contractor working capital financing
- Equipment financing for business purposes generally not subject to consumer credit regulation
- Key question is whether the ultimate obligation falls on a consumer (homeowner) or business entity

### Smart Contract Implications — Contractor Flow

| Feature | Status | Rationale |
|---------|--------|-----------|
| Contractor registration/profile creation | **ALLOW** with compliance checks | Verify municipal license (pre-2027) or state license (post-2027); confirm insurance |
| Equipment credit to licensed contractors | **LEGAL_REVIEW_REQUIRED** | Commercial-purpose loans may not require supervised lender license; verify business purpose |
| Advance payments to contractors via escrow | **LEGAL_REVIEW_REQUIRED** | See Section 4; escrow structure determines licensing requirements |
| Lien waiver processing | **ALLOW** | Administrative function; does not constitute legal advice if using standard forms |
| Demo-only records | **ALLOW** | Demonstration/mockup mode with no actual funds or enforceable obligations may be permissible |

---

## 6. Token Collateral / Crypto Notes

### Maine Money Transmission Modernization Act (Title 32 Chapter 79-A, enacted 2023)
Maine adopted comprehensive money transmission and virtual currency legislation in 2023, effective with NMLS transition in late 2023/early 2024.

### Virtual Currency Business Activity License Required
- **32 MRSA §6100-QQ**: "A person may not engage in virtual currency business activity... with or on behalf of another person unless the person is licensed in this State"
- **Virtual currency business activity** defined (§6100-OO) as:
  - Exchanging, transferring or storing virtual currency
  - Virtual currency administration
  - Holding electronic precious metals or certificates on behalf of another
- A person licensed for virtual currency business activity is **engaged in the business of money transmission** (§6100-QQ(2))
- **License required**: Money transmitter license through NMLS
- **Net worth**: Greater of $100,000 or 3% of total assets for first $100M (§6100-R)
- **Surety bond**: $100,000 (§6100-S)

### Virtual Currency Definition
- **"Virtual currency"** means a digital representation of value that: (A) Is used as a medium of exchange, unit of account or store of value; and (B) **Is not money**, whether or not denominated in money (§6100-OO)

### Critical Secured Creditor Exemption
- **32 MRSA §6074(2)(G)**: Exempts "A secured creditor under Title 11, article 9-A or creditor with a judicial lien or lien arising by operation of law on collateral that is virtual currency, if the virtual currency business activity of the creditor is limited to enforcement of the security interest or lien in compliance with the applicable law"
- **Implication**: A lender taking virtual currency as collateral and only engaging in enforcement activities may be exempt from licensing. **COUNSEL REVIEW REQUIRED** to determine whether SmartContractor's token collateral lock and potential liquidation activities fit within this exemption.

### Additional Exemptions
- Person using virtual currency solely on own behalf, for personal/family/household purposes (§6074(2)(B))
- Person with aggregate activity valued at $5,000 or less annually (§6074(2)(C))
- Securities/commodities intermediaries regulated under federal law (§6074(2)(F))
- Virtual currency control-services vendors (§6074(2)(H))

### Virtual Currency Disclosure Requirements
- Licensees must provide detailed disclosures including fee schedules, insurance coverage, irrevocability, error resolution, and statement that "virtual currency is not money" (§6100-RR)
- Transaction confirmations required (§6100-RR(3))

### Unhosted Wallet Requirements
- Licensee must identify recipient of virtual currency transferred to unhosted wallet; sender attestation alone is insufficient (§6100-UU)

### Enforcement History
- Maine Office of Securities participated in multi-state BlockFi ($943,396 civil fine to Maine) and Nexo consent orders for unregistered crypto interest-bearing accounts
- Maine securities administrator takes the position that interest-bearing crypto accounts may be securities under Maine Uniform Securities Act

### TOKEN COLLATERAL STATUS: **LEGAL_REVIEW_REQUIRED**
Whether SmartContractor's token collateral lock, holding, and potential liquidation activities constitute "virtual currency business activity" requiring a money transmitter license depends on interpretation of the secured creditor exemption and the scope of activities. The secured creditor exemption (§6074(2)(G)) provides a potential pathway but requires careful legal analysis.

### Required Disclosures — Token Collateral

```
[COUNSEL_APPROVED_TEXT_REQUIRED]

IMPORTANT NOTICE REGARDING VIRTUAL CURRENCY COLLATERAL

Under Maine law (Title 32, Chapter 79-A), virtual currency is defined as a
digital representation of value used as a medium of exchange, unit of account,
or store of value that IS NOT MONEY, whether or not denominated in money.
Engaging in virtual currency business activity, including exchanging,
transferring, or storing virtual currency on behalf of another person, may
require a money transmitter license from the Maine Bureau of Consumer Credit
Protection. Virtual currency held as collateral may not have the same
protections as money held in a bank account and is not insured by the FDIC.
[COUNSEL TO DRAFT SPECIFIC DISCLOSURE LANGUAGE]
```

---

## 7. Insurance Claims & Settlement Practices

### Unfair Claims Settlement Practices Act (24-A MRSA §2436, §2436-A)

#### Timing Requirements
- **Non-fire claims**: Payable within **30 days** of proof of loss (§2436(1)(A))
- **Fire claims**: Payable within **60 days** of proof of loss
- Insurer may request further proof within initial period, triggering a second 30-day (or 60-day for fire) clock
- **Private cause of action** exists for insurer's failure to adhere to §2436 requirements

#### Interest on Overdue Claims
- 1.5% per month (18% annual) on undisputed claims not paid within 30 days
- Recent legislative proposals (LD 1244) sought to increase this to 10% per month but status unclear

#### Unfair Claims Settlement Practices — Private Right of Action (§2436-A)
An insured may bring civil action against their own insurer for:
- Knowingly misrepresenting pertinent facts or policy provisions
- Failing to acknowledge/review claims within reasonable time
- Threatening to appeal arbitration award to compel lower settlement
- Failing to affirm or deny coverage after investigation
- **Without just cause, failing to effectuate prompt, fair and equitable settlement** where liability is clear
- Remedy: Damages, costs, attorney's fees, 1.5%/month interest

### Additional Living Expenses (ALE) / Loss of Use
- Standard component of homeowners policies
- Covers necessary increase in living expenses so household can maintain normal standard of living
- Policyholder must document regular expenses vs. post-loss additional expenses
- Only covers the **difference** between normal and post-loss expenses
- May have dollar limits and/or time limits
- Reimbursement basis; receipts required

### Emergency Advance Payments
- No specific Maine statute found requiring insurers to make emergency advance payments
- Standard practice governed by policy terms and Unfair Claims Settlement Practices Act

### Claim Payments and Mortgagee Checks
- If property has a mortgage, the insurance check "will generally be made out to both you and your lender" (Maine Bureau of Insurance consumer guidance)
- Lenders typically put money in escrow for large claims and pay as work is completed
- Governed by mortgage terms and federal GSE (Fannie Mae/Freddie Mac) guidelines

### Loss Draft / Mortgage Servicing Rules
- **Mortgagee named on checks**: Standard practice in Maine; if homeowner has a mortgage, insurance claim check will generally be made out to both homeowner and lender
- Lenders typically place funds in an escrow account and disburse as repairs are completed
- For large claims, lenders often require inspections at 50% completion and 95-100% completion
- Federal GSE guidelines apply:
  - Current loans (< 31 days delinquent): Initial disbursement up to greater of $40,000, 33% of proceeds, or amount exceeding UPB + accrued interest + advances
  - Delinquent loans (31+ days): More restrictive disbursement schedule
  - Abandoned/foreclosure properties: Servicer must remit proceeds to GSE

### Homeowner's Duties
- Must cooperate with insurer investigation
- Must submit to examination under oath if required
- Must mitigate further damage (temporary repairs)
- Must provide proof of loss and documentation

### Implications for SmartContractor
- SmartContractor cannot bypass the mortgagee's interest in claim proceeds
- Any repayment routing from insurance proceeds must account for mortgagee's priority position
- SmartContractor should advise homeowners to contact their mortgage servicer's loss draft department immediately after a loss
- Contractor should be prepared to provide: license/registration, certificate of insurance, W-9, contractor agreement, waivers of lien, draw schedules

---

## 8. Assignment of Benefits (AOB)

### PROPERTY/CASUALTY AOB STATUS: **UNKNOWN_REQUIRES_COUNSEL_REVIEW**

#### Key Finding: No Specific Property/Casualty AOB Statute
Maine does **not** appear to have a statute specifically addressing Assignment of Benefits for property/casualty insurance claims. The AOB statutes found are:

- **24 MRSA §2332-H**: Assignment of benefits for **medical or dental care** (expense-incurred basis)
- **24-A MRSA §2827-A**: Same, for policies and certificates
- **24-A MRSA §2910-A**: Subrogation and assignment of **medical payments coverage in casualty insurance** — medical payments coverage is "assignable only by written agreement between the insured and the casualty insurer on a form prescribed or approved by the superintendent" (recently amended 2025)

#### Implications for SmartContractor
- AOB for property restoration/repair claims in Maine appears governed by **common law contract principles**
- At common law, post-loss assignments of insurance claims are generally valid (Aetna doctrine, followed by Maine courts interpreting similar issues)
- Anti-assignment clauses in insurance policies are typically enforceable **before a loss** but not **after a loss** has occurred
- A properly drafted AOB may allow a contractor to stand in the shoes of the insured and pursue the claim directly
- **AOB is generally permitted post-loss** under Maine common law, but the scope and enforceability depend on policy language

#### Risks
- Without a specific statute, the validity and scope of a property/casualty AOB depends on: (1) the policy's anti-assignment clause; (2) whether the loss has occurred; (3) the specific language of the assignment; and (4) case law interpretation
- An AOB that assigns "any and all insurance rights, benefits, and proceeds" may be interpreted broadly to include all policy coverages (including ALE and personal property), potentially beyond the contractor's intended scope
- Contractor negotiating with insurer on behalf of homeowner could potentially implicate **public adjuster licensing** concerns (see Section 9)

#### Recommendations
- Any SmartContractor AOB must be carefully drafted to limit assignment to specific repair/restoration work only
- COUNSEL_APPROVED_TEXT_REQUIRED for all AOB documents
- Consider including: specific scope of work, limiting language, homeowner rights preservation, rescission rights

### Required Disclosures — AOB

```
[COUNSEL_APPROVED_TEXT_REQUIRED]

ASSIGNMENT OF BENEFITS — IMPORTANT CONSUMER NOTICE

You are considering signing an Assignment of Benefits (AOB) that transfers
certain rights under your insurance policy to a third party. Under Maine law,
this assignment may be governed by common law contract principles and the
terms of your insurance policy. By signing this document, you may be
transferring your right to receive insurance payments directly to the
assignee. You are NOT required to sign an AOB to have your property repaired
or to file an insurance claim. You may cancel or negotiate the terms of
this assignment. [COUNSEL TO DRAFT SPECIFIC DISCLOSURE LANGUAGE]
```

---

## 9. Public Adjuster & Insurance Representation

### Maine Adjuster Licensing (24-A MRSA Chapter 16, Subchapter 6)

#### Key Finding: Maine Does NOT Differentiate Between Independent and Public Adjusters
- **From Maine Bureau of Insurance Adjusters FAQs**: "Maine does not differentiate between Independent and Public Adjusters."
- A single adjuster license is issued; licensees may be independent adjusters, public adjusters, or staff adjusters
- **Staff adjusters who are employees of insurers** are generally exempt from licensing (24-A MRSA §1402)
- **Public adjuster license required** for any person who negotiates with an insurance company on behalf of a policyholder for compensation

#### Qualifications for Adjuster License (24-A MRSA §1472)
- Must be at least 18 years of age
- Competent, trustworthy, financially responsible, good reputation
- Must pass written examination (Property & Casualty, Workers' Compensation, or Multi-Peril Crop)

#### Lines of Authority
- Property & Casualty
- Workers' Compensation
- Multi-Peril Crop
- Limited (non-resident)

#### Critical Limitation for SmartContractor/Contractors
- A contractor or SmartContractor representative **negotiating with an insurance company on behalf of a homeowner** could be construed as acting as an adjuster
- Without an adjuster license, such activity could violate Maine insurance law
- **A contractor CANNOT simultaneously act as a public adjuster and perform repair work** — this raises significant conflict of interest and licensing concerns
- The National Association of Public Insurance Adjusters (NAPIA) takes the position that contractors should not act as public adjusters

#### Catastrophe Adjusters
- An adjuster license is **not required** for an adjuster sent into Maine on behalf of an authorized insurer for "particularly unusual or extraordinary loss" or series of losses from a catastrophe
- This exemption applies to insurer representatives, not contractor representatives

### PUBLIC ADJUSTER RISK: **HIGH**
- SmartContractor and affiliated contractors must be extremely careful not to engage in activities that constitute "adjusting" claims without proper licensure
- Any claim negotiation, valuation, or settlement activity on behalf of a homeowner should be performed only by a Maine-licensed adjuster
- Contractors should focus on repair work, not claim negotiation

### Required Disclosures — Public Adjuster

```
[COUNSEL_APPROVED_TEXT_REQUIRED]

IMPORTANT: This service does NOT include negotiation with your insurance
company on your behalf. Only a licensed insurance adjuster or your attorney
may negotiate with your insurance company regarding the amount or scope of
your claim. Any person representing themselves as able to negotiate with
your insurance company without proper licensing may be in violation of Maine
law (24-A MRSA Chapter 16). [COUNSEL TO DRAFT SPECIFIC DISCLOSURE LANGUAGE]
```

### Home Construction Contract Disclosure

```
[COUNSEL_APPROVED_TEXT_REQUIRED]

Under Maine law (Title 10, Section 1487), any home construction contract
for more than $3,000 must be in writing and must contain: (1) the names of
the parties; (2) property location; (3) estimated work dates; (4) total
contract price; (5) payment terms (down payment may not exceed 1/3 of total
price); (6) warranty statement; (7) dispute resolution method; (8) change
order requirements. You are strongly advised to visit the Maine Attorney
General's website at www.maine.gov/ag for additional consumer protection
information. [COUNSEL TO DRAFT SPECIFIC DISCLOSURE LANGUAGE]
```

### Mortgagee / Loss Draft Disclosure

```
[COUNSEL_APPROVED_TEXT_REQUIRED]

If you have a mortgage on your property, your insurance claim check may be
made payable to both you and your mortgage lender. Your lender may hold the
funds in an escrow account and disburse them as repairs are completed. You
should contact your mortgage servicer's loss draft department immediately
after filing a claim. [COUNSEL TO DRAFT SPECIFIC DISCLOSURE LANGUAGE]
```

---

## 10. SmartContractor Dashboard Rules

```json
{
  "state": "ME",
  "state_name": "Maine",
  "token_collateral_equipment_credit": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Maine enacted comprehensive virtual currency business activity licensing in 2023 (32 MRSA Ch. 79-A, Subchapter 13). Token collateral lock/holding/liquidation may constitute virtual currency business activity requiring money transmitter license. However, 32 MRSA §6074(2)(G) provides an exemption for secured creditors with collateral that is virtual currency if activity is limited to enforcement of security interest. Whether SmartContractor qualifies for this exemption requires Maine-specific legal analysis. Virtual currency is explicitly 'not money' under Maine law. Consumer lending to homeowners for restoration likely requires supervised lender license under Title 9-A. 18% usury cap applies to loans under $10,000 unless licensed (9-A MRSA §150)."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Maine has no specific property/casualty AOB statute; AOB governed by common law. Unfair Claims Settlement Practices Act (24-A §2436-A) provides private cause of action for insurers failing to settle promptly. Public adjuster licensing is a significant concern: Maine does not differentiate between independent and public adjusters, but any claim negotiation on behalf of a homeowner without adjuster license may violate 24-A MRSA. Contractor cannot simultaneously perform repairs and negotiate claims. Mortgagee must be named on claim checks; repayment routing must account for mortgagee priority. Claims for non-fire losses payable within 30 days of proof of loss. No specific emergency advance payment statute found. Strong consumer protections apply."
  },
  "escrow_backed_advance": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": [],
    "blocked_actions": ["escrow_fund_holding", "advance_from_escrow", "escrow_disbursement"],
    "required_reviews": ["legal", "provider", "security", "escrow_agent"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Escrow-backed contractor advances in Maine require analysis under consumer lending (9-A MRSA), money transmission (32 MRSA Ch. 79-A & Ch. 80), and escrow regulation. Maine Office of Securities may regulate escrow activities. Use of independent licensed escrow agent (title company, attorney, bank) strongly recommended. 18% usury cap applies if advance is recharacterized as consumer loan under $10,000. Money transmitter license may be triggered if holding funds for transmission. Full written disclosure required under Maine consumer protection law."
  },
  "contractor_flow_status": "LEGAL_REVIEW_REQUIRED",
  "homeowner_flow_status": "BLOCKED",
  "restoration_company_flow_status": "LEGAL_REVIEW_REQUIRED"
}
```

### Smart Contract Feature Matrix

| Smart Contract Function | Recommendation | Rationale |
|------------------------|----------------|-----------|
| Live loan creation | **BLOCK** | Lending to Maine consumers likely requires supervised lender license under Title 9-A; unlicensed lending may violate consumer credit code. 18% usury cap for loans under $10,000. |
| Token collateral lock | **BLOCK** | May constitute "storing" or "transferring" virtual currency on behalf of another, requiring money transmitter license (32 MRSA §6100-QQ) unless secured creditor exemption applies. |
| Token liquidation | **BLOCK** | Liquidation of virtual currency collateral likely constitutes "exchanging" virtual currency, a licensable activity; enforcement of security interest may qualify for exemption but legal review required. |
| Assignment of claim proceeds | **BLOCK** | No clear statutory framework for property/casualty AOB in Maine; validity depends on common law, policy terms, and case-by-case analysis; significant legal uncertainty. |
| Repayment routing from insurance proceeds | **BLOCK** | Must account for mortgagee priority; GSE guidelines govern disbursement; cannot guarantee repayment routing without lender cooperation. |
| Escrow-backed contractor advance | **LEGAL_REVIEW_REQUIRED** | Intersection of consumer lending, money transmission, and escrow regulation; use licensed third-party escrow agent; COUNSEL_REVIEW_REQUIRED. |
| Contractor profile/registration | **ALLOW** with verification | Verify municipal license (pre-2027) or state license (post-2027); confirm insurance and bonding. |
| Demo-only records | **ALLOW** | Demonstration/mockup mode with no actual funds or enforceable obligations may be permissible for testing and development. |
| Hash/reference-only audit records | **ALLOW** | Reference-only records that do not create legal obligations or hold funds may be permissible. |

### Lending/Finance Disclosure Template

```
[COUNSEL_APPROVED_TEXT_REQUIRED]

IMPORTANT NOTICE: This product involves the extension of credit. Any credit
offered to consumers for personal, family, or household purposes in Maine may
be subject to the Maine Consumer Credit Code (Title 9-A) and may require a
supervised lender license issued by the Maine Bureau of Consumer Credit
Protection. Maine law imposes an 18% annual usury cap on loans under $10,000
unless the lender is properly licensed (9-A MRSA §150). This product has not
been determined to be compliant with Maine consumer lending laws.
[COUNSEL TO DRAFT SPECIFIC DISCLOSURE LANGUAGE]
```

---

## APPENDIX: Key Statute Citations

| Statute | Citation | Subject |
|---------|----------|---------|
| Maine Consumer Credit Code | 9-A MRSA Title 9-A | Consumer lending, supervised loans, mortgage servicing |
| Supervised Lender License | 9-A MRSA §2-301 et seq. | Licensing requirements for consumer lending |
| Loan Broker License | 9-A MRSA §10-201 et seq. | Loan brokering requirements |
| Usury Cap | 9-A MRSA §150 | 18% cap on loans under $10,000 unless licensed |
| Maine Insurance Code | 24-A MRSA Title 24-A | Insurance regulation, claims handling |
| Unfair Claims Settlement Practices | 24-A MRSA §2436, §2436-A | Claims payment timing, private cause of action |
| Adjuster Licensing | 24-A MRSA §1402, §1472 | Adjuster definitions, qualifications |
| AOB — Medical | 24 MRSA §2332-H; 24-A MRSA §2827-A, §2910-A | Medical payments assignment only |
| Home Construction Contracts | 10 MRSA §1486-1490 | Contractor written contract requirements |
| Maine Home Contractor Licensing Act | 32 MRSA Chapter 134 | Residential contractor licensing (effective 1/1/2027) |
| Money Transmission Modernization Act | 32 MRSA Chapter 79-A | Money transmission, virtual currency licensing |
| Money Transmitters | 32 MRSA Chapter 80 | Money transmission licensing |
| Virtual Currency Business Activity | 32 MRSA §6100-OO through §6100-UU | Virtual currency definitions, licensing, exemptions |
| Secured Creditor Exemption | 32 MRSA §6074(2)(G) | Exemption for VC collateral enforcement |
| Maine Consumer Protection Act | 5 MRSA §207 | Unfair trade practices |

---

*This compliance file was prepared based on publicly available sources. It does not constitute legal advice. All SmartContractor products, features, and activities described herein are BLOCKED or marked LEGAL_REVIEW_REQUIRED pending review by Maine-licensed counsel. Statutory references and URLs should be independently verified before reliance.*
