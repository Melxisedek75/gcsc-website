# GCSC State Compliance Packet: Mississippi (MS)

## 1. State Summary & Key Regulators

Mississippi presents a **HIGH COMPLEXITY, MULTI-REGULATOR** environment for SmartContractor (GCSC) products. The state requires licenses for consumer lending under the Small Loan Privilege Tax Law, regulates money transmission (including virtual currency custody) under the Money Transmission Modernization Act, and has enacted specific legislation governing assignment of insurance benefits to residential roofing contractors. Public adjuster licensing was significantly reformed effective July 1, 2025 (HB 1174). Mississippi does NOT have a general unfair claims settlement practices statute, but common law bad faith claims are recognized. The legal rate of interest is 8% per annum, with a 10% usury cap on loans under $2,500 unless the lender holds a small loan license (Miss. Code Ann. 75-67-101). Token/cryptocurrency collateral faces significant legal uncertainty. All GCSC products should be considered **BLOCKED** for live deployment pending legal review.

**Key Regulators:**

| Regulator | URL | Jurisdiction |
|-----------|-----|-------------|
| Mississippi Insurance Department (MID) | https://www.mid.ms.gov | Insurance claims, adjuster licensing, consumer protection |
| Mississippi Department of Banking and Consumer Finance (DBCF) | https://dbcf.ms.gov | Consumer lending, money transmission, virtual currency, escrow regulation |
| Mississippi State Board of Contractors (MSBOC) | https://www.msboc.us | Contractor licensing and enforcement |

**Key Facts at a Glance:**
- **Usury cap**: 10% on loans under $2,500 unless licensed (Miss. Code Ann. 75-67-101)
- **Default legal rate**: 8% per annum (Miss. Code Ann. 75-17-1)
- **Money Transmitter**: Miss. Code Ann. 75-15-1 et seq. and 75-16-1 et seq. (MTMA)
- **Escrow**: Mississippi Department of Banking may regulate escrow activities
- **AOB**: Generally permitted post-loss; heavily restricted for residential roofing contractors
- **Public adjuster license**: Required; $50,000 bond/LOC; 10% fee cap; reforms effective July 1, 2025
- **Consumer protection**: Moderate - Consumer Protection Act (Miss. Code Ann. 75-24-5) applies

---

## 2. Official Sources Reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| Mississippi Insurance Department | https://www.mid.ms.gov | Insurance claims, adjuster licensing, consumer protection |
| Mississippi Dept of Banking and Consumer Finance | https://dbcf.ms.gov | Consumer lending, money transmission, virtual currency |
| Mississippi State Board of Contractors | https://www.msboc.us | Contractor licensing requirements |
| MS Code Ann. 75-24-307 (AOB - Roofing) | https://law.justia.com/codes/mississippi/title-75/chapter-24/ | Assignment of benefits for residential roofing |
| MS Code Ann. 83-17-523 (Public Adjusters) | https://billstatus.ls.state.ms.us/documents/2025/html/HB/1100-1199/HB1174PS.htm | Public adjuster fees, contracts, ethics |
| HB 1174 (2025) - Public Adjuster Reform | https://billstatus.ls.state.ms.us/documents/2025/html/HB/1100-1199/HB1174PS.htm | New public adjuster requirements effective 7/1/2025 |
| HB 1408 (2024) - Roofing Contractor AOB | https://billstatus.ls.state.ms.us/documents/2024/html/HB/1400-1499/HB1408IN.htm | Roofing contractor AOB amendments effective 7/1/2024 |
| MS Code Ann. 75-17-21 (Small Loan Rates) | https://law.justia.com/codes/mississippi/title-75/chapter-17/ | Maximum finance charges for small loans |
| MS Code Ann. 75-67-175 (Installment Loan Act) | https://law.justia.com/codes/mississippi/title-75/chapter-67/article-4/ | Consumer Alternative Installment Loan Act |
| MS Code Ann. 81-19-1 (Loan Broker Act) | https://dbcf.ms.gov/wp-content/uploads/2020/06/Consumer-Loan-Broker-Act-July-1-2005-PDF.pdf | Consumer loan broker licensing |
| MS Money Transmission Modernization Act | https://billstatus.ls.state.ms.us/documents/2026/html/HB/1500-1599/HB1596IN.htm | Money transmission and virtual currency kiosk regulation |
| MS Code Ann. 83-9-5 (Claim Handling) | https://codes.findlaw.com/ms/title-83-insurance/ms-code-sect-83-9-5/ | Insurance claim payment deadlines |
| MS Consumer Protection Act 75-24-5 | https://law.justia.com/codes/mississippi/title-75/chapter-24/ | Unfair/deceptive trade practices |

---

## 3. Lending / Finance Licensing Notes

### Consumer Lending Licensing Requirements

**Small Loan Regulatory Law** (Miss. Code Ann. 75-67-101 et seq.) and **Small Loan Privilege Tax Law** (75-67-201 et seq.):
- Administered by the DBCF
- License required to engage in the business of lending money to consumers
- **10% usury cap on loans under $2,500** unless the lender is licensed under the Small Loan Privilege Tax Law
- Licensed lenders may charge tiered rates under 75-17-21 (see below)

**Consumer Alternative Installment Loan Act** (75-67-175 et seq.):
- Applies to consumer installment loans of $4,000 or less
- Licensees may charge up to 59% APR
- Loans must be fully amortizing with minimum 9 monthly payments over at least 272 days

**Consumer Loan Broker Act** (81-19-1 et seq.):
- Requires license and $25,000 surety bond for anyone brokering consumer loans
- Maximum service charge: 3% of principal or $25, whichever is greater
- **No advance fees permitted** before loan closing
- Violation is a misdemeanor punishable by fine up to $1,000 and/or up to 6 months imprisonment

**Credit Availability Act** (75-67-601 et seq.):
- Regulates credit availability services

**Exemption**: Loans "primarily for business or commercial purposes" are exempt from consumer installment loan acts.

### Maximum Finance Charges (Licensed Small Loan Lenders)

Under Miss. Code Ann. 75-17-21, licensed small loan lenders may charge:

| Balance Tier | Maximum Annual Rate |
|-------------|-------------------|
| First $1,000 | 36% per year |
| $1,000 - $2,500 | 33% per year |
| $2,500 - $5,000 | 24% per year |
| Over $5,000 | 14% per year |

Plus closing fee: 4% of total payments or $25 (whichever is greater) for loans <= $10,000; $500 maximum for loans > $10,000. Rates may be increased when the federal discount rate exceeds certain thresholds.

### Legal Rate of Interest Summary

| Rate Type | Statute | Rate |
|-----------|---------|------|
| Default legal rate | 75-17-1 | 8% per annum |
| Maximum contract rate | 75-17-1 | Greater of 10% or 5% above Federal Reserve discount rate |
| Judgment rate | 75-17-7 | Up to 10% |
| Usury cap (loans under $2,500) | 75-67-101 | 10% unless licensed |

### Key Implications for GCSC
- Any homeowner loan product offering consumer-purpose financing requires a Small Loan Privilege Tax Law license or partnership with a licensed lender
- Business-purpose contractor financing (e.g., working capital for restoration companies) may fall under commercial loan exemptions
- Loan brokering/arranging without a license is a criminal offense
- **LIVE LOAN CREATION: BLOCKED** pending confirmation of applicable license or licensed partner arrangement

---

## 4. Escrow-Backed Contractor Advance Rules

> **NEW SECTION** - This section addresses escrow-backed advances as a potential alternative to traditional lending for contractor financing in Mississippi.

### Escrow Regulatory Framework in Mississippi

The **Mississippi Department of Banking and Consumer Finance** has authority to regulate escrow activities in the state. While Mississippi does not have a standalone, comprehensive escrow agent licensing statute comparable to some states, escrow activities connected to real property transactions, lending, and insurance proceeds fall within the DBCF's broad supervisory jurisdiction.

- Escrow activities incident to lending are generally governed by the DBCF through its authority under Title 75
- Real estate settlement escrows may also fall under the Mississippi Real Estate Commission's oversight when performed by real estate brokers
- Third-party escrow of insurance claim proceeds is not specifically addressed by statute but would likely be characterized as money transmission or regulated escrow activity

### Escrow-Backed Advance Structure Analysis

An escrow-backed contractor advance, where funds are held in escrow by a licensed fiduciary and disbursed upon verified completion milestones, differs structurally from a traditional loan:

| Feature | Traditional Loan | Escrow-Backed Advance |
|---------|---------------|----------------------|
| Funds flow | Lender to borrower | Funder to escrow, then to contractor upon verification |
| Repayment source | Borrower's general obligation | Insurance proceeds, property owner payment, or sale proceeds |
| Licensing trigger | Small Loan Privilege Tax Law | Potentially exempt from lending laws if true escrow structure |
| Usury application | 10% cap under $2,500 unless licensed | May not apply if not a "loan" under 75-67-101 |
| Consumer protections | Full lending law stack | Escrow fiduciary duties + Consumer Protection Act |

### Critical Requirements for Escrow-Backed Advances

To maintain escrow-backed advance status (and avoid recharacterization as a loan):

1. **Independent Escrow Agent**: The escrow holder must be independent of both the contractor and the funding party. The escrow agent should be a licensed escrow provider, attorney trust account, or chartered bank.

2. **Milestone-Based Disbursement**: Funds must be released only upon verified completion of specific construction milestones, not as a lump sum advance to the contractor.

3. **No Direct Borrower Obligation**: The property owner should not sign a promissory note or personal guaranty that creates a debt obligation independent of the escrowed funds. Any repayment obligation must be contingent upon and sourced from the escrowed proceeds.

4. **Full Disclosure**: All parties must understand that the transaction is an escrow disbursement arrangement, not a loan. Written disclosure required.

5. **Escrow Agreement Requirements**:
   - Written escrow agreement signed by all parties
   - Itemized description of work and corresponding disbursement triggers
   - Timeline for completion and disbursement
   - Procedure for dispute resolution
   - Procedure for return of unused funds

### Regulatory Risks & Blocking Status

| Risk Factor | Assessment |
|-------------|-----------|
| Recharacterization as lending | HIGH - DBCF may view escrow-backed advance as a disguised loan if there is any direct borrower repayment obligation |
| Money transmission trigger | MEDIUM - If GCSC controls or directs movement of funds, MTMA (75-15-1 et seq.) may apply |
| Escrow licensing requirement | MEDIUM - DBCF may require escrow registration if activities are deemed regulated |
| Consumer Protection Act applicability | HIGH - Miss. Code Ann. 75-24-5 applies to all consumer transactions regardless of lending status |
| Insurance claim proceeds handling | HIGH - If escrow involves insurance proceeds, mortgagee interests and loss draft procedures must be respected |

### GCSC Escrow-Backed Advance Status

**ESCROW-BACKED CONTRACTOR ADVANCE: BLOCKED FOR LIVE DEPLOYMENT**

- **Blocked actions**: Live escrow disbursement, milestone verification, repayment routing
- **Required reviews**: Legal opinion on recharacterization risk, DBCF consultation on escrow licensing, MID consultation if insurance proceeds involved
- **Permitted**: DEMO-ONLY mock escrow workflows; hash/reference-only audit records
- **Notes**: Even with a "true" escrow structure, Mississippi regulators may recharacterize the transaction as lending. Counsel must opine on structure before any live deployment. If the property owner has any direct repayment obligation outside the escrowed funds, the transaction WILL be treated as a loan requiring licensure.

---

## 5. Contractor Licensing & Roofing-Specific Rules

### Mississippi State Board of Contractors (MSBOC) Requirements

All commercial and residential contractors must be licensed by the MSBOC:

**Commercial License:**
- Required for commercial projects exceeding $50,000
- Also required for fire sprinkler work over $5,000
- Net worth: $50,000 (major classifications) or $20,000 (specialties)
- General liability insurance: $300,000 required

**Residential License:**
- Required for residential construction over $50,000
- Classifications: Residential Builder, Remodeler, and Roofer

**Trade Licenses (Plumbers, Electricians, HVAC):**
- Commercial license required for work over $10,000

**General Requirements:**
- Reference letters, proof of insurance, workers' compensation (if 5+ employees)
- Examination required for all classifications

### Residential Roofing Contractor-Specific Rules

Under the **Insurance Benefits Roofing Repair Consumer Protection Act** (Miss. Code Ann. 75-24-301 et seq.):

- Residential roofing contractors are defined as those contracting to repair/replace roof systems where all or part of cost is expected to be paid by insurance
- **Cannot require payment** from insured until the 5-day cancellation period has expired (HB 1408, effective July 1, 2024)
- **Cannot represent a property owner on insurance claims**
- **Cannot receive payment from an attorney for claim referrals**
- **"Roof system"** defined as: roof coverings, roof sheathing, roof weatherproofing, roof framing, roof ventilation system, and insulation

### Contractor Financing Implications

- Equipment financing for contractors may qualify as business-purpose credit exempt from consumer lending laws
- Any financing product marketed to homeowners through contractors triggers consumer lending license requirements
- GCSC must NOT enable unlicensed contractor lending or advance fee arrangements
- **CONTRACTOR FLOW STATUS: BLOCKED** for live financing origination pending legal review of business-purpose exemption applicability

---

## 6. Assignment of Benefits (AOB) Notes

### Residential Roofing Contractor AOB (75-24-307)

Mississippi has enacted **specific legislation** governing assignment of benefits to residential roofing contractors. This is the primary AOB framework:

**Permitted with Restrictions:**
- A post-loss assignment by a named insured to a residential roofing contractor **only authorizes the contractor to be named as a co-payee** for payment of benefits
- The assignment **does NOT** transfer the insured's right to negotiate, settle, or direct the claim

**Required Contents:**
- (a) Itemized description of work to be performed
- (b) Itemized description of materials, labor and fees
- (c) Total itemized amount to be paid
- (d) Statement that contractor makes no assurances that loss will be fully covered
- (e) **14-point capitalized notice**: "YOU ARE AGREEING TO GIVE UP CERTAIN RIGHTS YOU HAVE UNDER YOUR INSURANCE POLICY. PLEASE READ AND UNDERSTAND THIS DOCUMENT BEFORE SIGNING. THE ITEMIZED DESCRIPTION OF THE WORK TO BE DONE SHOWN IN THIS ASSIGNMENT FORM HAS NOT BEEN AGREED TO BY THE INSURER. THE INSURER HAS THE RIGHT TO PAY ONLY FOR THE COST TO REPAIR OR REPLACE DAMAGED PROPERTY CAUSED BY A COVERED PERIL."

**Procedural Requirements:**
- Copy of executed assignment must be provided to insurer **within 5 business days**
- Assignment **shall not impair** the interest of a mortgagee listed on the declarations page
- Assignment **shall not prevent** insurer from communicating with named insured or mortgagee
- 5-day cancellation period required (per HB 1408, effective July 1, 2024)

**Prohibited Acts:**
- Roofing contractor **cannot represent** property owner on insurance claims
- Roofing contractor **cannot receive payment** from an attorney for claim referrals

### General AOB (Non-Roofing)

- Mississippi Code Ann. 83-9-5(1)(i) addresses assignment of benefits for **health insurance** - permits assignment to healthcare providers
- **No general AOB statute** for property/casualty claims outside the roofing context
- General principles of contract law apply: assignments of claims are generally permitted unless prohibited by policy
- AOB is **generally permitted post-loss** in Mississippi for non-roofing claims

### AOB Risk Assessment

| Category | Status | Notes |
|----------|--------|-------|
| Roofing AOB | HEAVILY REGULATED | Specific form, 14-point font, notice, timing requirements (75-24-307) |
| General AOB (non-roofing) | PERMITTED (post-loss) | No specific statute; general contract principles apply |
| Pre-loss AOB | RESTRICTED | Likely unenforceable or heavily scrutinized |

- GCSC must NOT facilitate AOB documentation that violates 75-24-307 for roofing or circumvents public adjuster licensing
- **AOB STATUS: RESTRICTED (roofing) / PERMITTED (general, post-loss)**

---

## 7. Public Adjuster & Insurance Representation Notes

### Licensing Requirements (HB 1174, Effective July 1, 2025)

Significant reforms enacted in 2025:

**Individual License:**
- Must be at least 18 years old
- Must be trustworthy, reliable, of good reputation (investigation by commissioner)
- Must pass examination
- Must demonstrate financial responsibility: **$50,000 surety bond** or **irrevocable letter of credit**
- Cannot have committed acts specified in 83-17-519 (fraud, felony, misappropriation, etc.)

**Business Entity License:**
- Must designate licensed public adjuster responsible for compliance
- Must have good standing in home state

**Non-Resident Licensing:**
- Reciprocity available if home state licenses Mississippi residents
- Must maintain resident license; non-resident license terminates if resident license terminates

### Contract Requirements

- **Written contract required**, pre-filed with and approved by commissioner
- Contract must be executed before services provided (except emergency circumstances)
- Must include: adjuster's full name, business address, license number, title "Public Adjuster Contract", insured's information, loss description, services description, signatures, dates
- **10% maximum fee** of any insurance settlement or claim proceeds
- **No advance fees** permitted before partial or full settlement
- **5-day cancellation period** for insured (cancel without cause, without penalty)
- Costs to be reimbursed must be specified by kind and estimated amounts

### Ethical Restrictions

| Restriction | Statute |
|-------------|---------|
| Cannot participate in reconstruction/repair of property they adjust | 83-17-523 |
| Cannot split fees with attorneys | 83-17-523 |
| Cannot receive anything of value from attorneys for claim referrals | 83-17-523 |
| Cannot require insured to authorize insurer to issue check only in adjuster's name | 83-17-523 |
| Cannot testify as expert witness while maintaining pecuniary interest | 83-17-523 |
| Must advise insured of right to retain attorney | 83-17-523 |
| Fiduciary duty for funds - deposit in non-interest-bearing trust account within 2 days | 83-17-523 |

### Who May Negotiate with Insurance Company

- **Licensed public adjusters** (individual or business entity license)
- **Attorneys** licensed to practice law in Mississippi
- **Insurance company adjusters** (staff or independent)
- **Licensed independent adjusters**
- **The insured themselves**

### GCSC Must NOT

- Act as a public adjuster without proper licensing
- Facilitate unlicensed public adjusting by contractors or restoration companies
- Enable fee-sharing between adjusters and attorneys
- Enable contractor representation of insureds on insurance claims
- Process claim proceeds payments to unlicensed adjusters

---

## 8. Token Collateral / Crypto Notes

### Regulatory Framework

Mississippi has adopted the **Money Transmission Modernization Act** (MTMA), codified at Miss. Code Ann. 75-16-1 et seq., administered by the DBCF. The predecessor Money Transmitter Act is at 75-15-1 et seq.

Key provisions:
- **Virtual currency kiosks** are expressly regulated under the MTMA. Kiosk operators must be licensed as money transmitters (HB 1625, 2026)
- **HB 1596** (signed April 2026, effective July 1, 2026) creates the "Data Security for Money Transmitters Act" imposing cybersecurity requirements on MTMA licensees
- Virtual currency is defined broadly to include maintaining possession, custody, or control over virtual currency on behalf of another person
- **No specific statute** authorizing cryptocurrency as collateral for loans was found
- Mississippi has NOT enacted the Uniform Commercial Code Article 12 amendments for controllable electronic records

### Token Collateral Status Assessment

| Factor | Assessment |
|--------|-----------|
| Using token/cryptocurrency as loan collateral | Likely requires **money transmitter licensure** under MTMA |
| Smart contract-based collateral locks | May be interpreted as money transmission activity |
| Liquidation of token collateral | Raises additional money transmission and lending law questions |
| UCC Article 12 | Not adopted - no clear statutory framework for digital asset collateral |

**TOKEN COLLATERAL STATUS: UNKNOWN_REQUIRES_COUNSEL_REVIEW**

- **Blocked actions**: live_token_collateral_lock, liquidation, repayment_routing
- **Required reviews**: legal, DBCF_money_transmitter, security
- **Notes**: Mississippi law does not clearly permit or prohibit token collateral for loans. The MTMA's application to collateral custody is untested.

---

## 9. Consumer Protection, Usury & Enforcement

### Consumer Protection Act

Mississippi's Consumer Protection Act (Miss. Code Ann. 75-24-5) prohibits unfair or deceptive trade practices, including:

- False representation of source, sponsorship, approval, or certification
- Misrepresentation of goods or services
- Deceptive pricing or bait-and-switch tactics
- Unconscionable practices in consumer transactions

**Remedies:** Private right of action; actual damages; attorney fees; possible punitive damages for willful violations.

### Usury & Interest Rate Enforcement

| Violation | Penalty |
|-----------|---------|
| Excess charges over licensed rates | Forfeiture of principal and interest (75-67-119) |
| Lending without required license | Misdemeanor; fine up to $1,000 and/or up to 6 months imprisonment |
| Loan brokering without license | Misdemeanor; fine up to $1,000 and/or up to 6 months imprisonment |
| Charging >100% in excess of lawful rate | Principal forfeiture |

### Insurance Claim Handling Standards

Mississippi **has NOT adopted** the NAIC Unfair Claims Settlement Practices Act. Limited standards found at Miss. Code Ann. 83-9-5:

| Requirement | Timeline |
|-------------|----------|
| Pay benefits after receipt of electronic clean claim | 25 days |
| Pay benefits after receipt of paper clean claim | 35 days |
| Furnish claim forms after notice of claim | 15 days |

### Additional Living Expenses (ALE)

- ALE coverage is standard in Mississippi homeowners policies under "Coverage D - Loss of Use"
- ALE covers necessary increase in living expenses when residence is uninhabitable due to covered loss
- No Mississippi statute mandates insurers to advance ALE payments
- Mississippi recognizes common law bad faith claims for unreasonable delay (Caldwell v. ALFA Ins. Co., 686 So. 2d 1092 (Miss. 1996))

### Mortgagee / Loss Draft Notes

- **No specific Mississippi statute** governing loss draft checks or mortgagee involvement in insurance claim proceeds
- The Insurance Benefits Roofing Repair Consumer Protection Act (75-24-307(7)) confirms AOB "shall not impair the interest of a mortgagee listed on the declarations page"
- Mortgage companies are typically named as co-payee on insurance claim checks when property has a mortgage
- Fannie Mae/Freddie Mac servicing guides apply for conventional mortgages; FHA/HUD guidelines apply for government-backed loans
- **REPAYMENT_ROUTING_FROM_INSURANCE_PROCEEDS: BLOCKED** pending legal review of mortgagee priority and compliance with loss draft procedures

---

## 10. Dashboard Rules, Final Risk Scores & Disclosures

### Dashboard Rules (JSON)

```json
{
  "state": "MS",
  "state_name": "Mississippi",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "dbcf_money_transmitter", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Mississippi Money Transmission Modernization Act (75-15-1 et seq., 75-16-1 et seq.) regulates virtual currency custody. Token collateral lock likely requires money transmitter license. No statute explicitly authorizing digital asset collateral found. Smart contract liquidation may violate lending and money transmission laws."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "No explicit statute authorizing third-party insurance claim advances. Residential roofing AOB heavily regulated under 75-24-307. Public adjuster licensing reformed July 2025. Claim advance products likely constitute regulated lending. Mississippi has no unfair claims practices statute. Common law bad faith claims recognized."
  },
  "escrow_backed_advance": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["live_escrow_disbursement", "milestone_verification", "repayment_routing"],
    "required_reviews": ["legal", "dbcf_escrow", "mid_if_insurance_proceeds"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Escrow-backed contractor advances may avoid lending licensure if structured as true escrow with independent agent, milestone disbursement, and no direct borrower repayment obligation. HIGH risk of recharacterization as lending. Mississippi Department of Banking may regulate escrow activities. DEMO-ONLY pending counsel opinion."
  },
  "contractor_flow_status": "BLOCKED for live financing origination. DEMO_ONLY permitted. Business-purpose equipment financing may be eligible after counsel review of commercial loan exemption. Contractor must hold valid MSBOC license.",
  "homeowner_flow_status": "BLOCKED for live loan creation. DEMO_ONLY permitted. Consumer lending license (Small Loan Privilege Tax Law) required. 10% usury cap on loans under $2,500 unless licensed. Homeowner loans must comply with 75-17-21 rate tiers and AOB restrictions for roofing.",
  "restoration_company_flow_status": "BLOCKED for live financing. DEMO_ONLY permitted. May qualify for commercial-purpose exemption if loan is for business purposes only. Must not engage in public adjuster activities without license. Must comply with 75-24-307 if performing roofing work. $50,000 bond required for public adjuster license."
}
```

### Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **HIGH** | Multiple license requirements (small loan, loan broker, money transmitter). 10% usury cap under $2,500. Tiered rate structure under 75-17-21. Severe penalties for violations (principal forfeiture for >100% excess charges). Commercial purpose exemption may apply to contractor financing. |
| Insurance Claim Risk | **HIGH** | No general unfair claims practices statute creates uncertainty. Claim handling standards at 83-9-5 are limited. Roofing AOB heavily regulated. No explicit claim advance authorization. Bad faith claims recognized under common law. |
| AOB Risk | **MEDIUM** | Roofing contractor AOB heavily regulated with specific form, 14-point font, notice, timing requirements (75-24-307). General property AOB (non-roofing) permitted post-loss. Health insurance AOB permitted. 5-day cancellation right. |
| Public Adjuster Risk | **HIGH** | Significant 2025 reforms (HB 1174). $50,000 bond/LOC required. 10% fee cap. Written contract must be pre-filed. Cannot participate in repair work. Cannot share fees with attorneys. Fiduciary duties. Unlicensed adjusting is a misdemeanor. |
| Token Collateral Risk | **HIGH** | MTMA applies to virtual currency custody. Money transmitter license likely required for collateral lock. No specific statute authorizing digital asset collateral. Smart contract liquidation untested. 2026 kiosk regulations show increasing regulatory attention. |
| Escrow-Backed Advance Risk | **HIGH** | Recharacterization as lending is the primary risk. DBCF may view structure as disguised loan. Money transmission trigger if GCSC directs funds. Escrow licensing may be required. Insurance proceeds handling adds complexity. |
| Consumer Protection Risk | **HIGH** | Consumer Protection Act (75-24-5) applies. Specific roofing contractor protections. No attorney fee restrictions found for consumer loan violations. DBCF examination authority. Excessive finance charges trigger principal forfeiture. |

### Required Disclosures

**DISCLOSURE 1 - LENDING LICENSE STATUS**
```
COUNSEL_APPROVED_TEXT_REQUIRED

[GCSC Entity] is not licensed as a small loan lender, consumer loan broker,
or money transmitter in Mississippi. No loan product, financing arrangement,
or credit advance is offered, arranged, or facilitated by [GCSC Entity] in
Mississippi. All lending services are provided by [LICENSED PARTNER NAME],
which holds [SPECIFY LICENSE(S)] issued by the Mississippi Department of
Banking and Consumer Finance. For questions or complaints, contact the
Mississippi Department of Banking and Consumer Finance at (601) 321-6901
or P.O. Box 12129, Jackson, MS 39236-2129.
```

**DISCLOSURE 2 - ESCROW-BACKED ADVANCE NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

[GCSC Entity] is facilitating an escrow-backed advance arrangement. This is
NOT a loan. Funds are held in escrow by [ESCROW AGENT NAME] and will be
disbursed to the contractor only upon verification of completed work milestones.
You may have repayment obligations contingent upon insurance proceeds or other
designated funding sources. If insurance proceeds are insufficient, you may be
responsible for the balance. This transaction is regulated by the Mississippi
Department of Banking and Consumer Finance. You have the right to cancel this
agreement within five (5) business days without penalty.
```

**DISCLOSURE 3 - TOKEN COLLATERAL RISK**
```
COUNSEL_APPROVED_TEXT_REQUIRED

Virtual currency and digital asset collateral involve significant risks,
including but not limited to: (a) virtual currency is not backed or insured
by the government; (b) the value of virtual currency is highly volatile and
may result in permanent and total loss of value; (c) virtual currency
transactions may be irreversible; and (d) bond or security maintained by
the collateral custodian may not be sufficient to cover all losses.
[COUNSEL TO DRAFT STATE-SPECIFIC LANGUAGE REGARDING MISSISSIPPI MONEY
TRANSMISSION MODERNIZATION ACT COMPLIANCE STATUS]
```

**DISCLOSURE 4 - INSURANCE CLAIM ADVANCE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

[GCSC Entity] does not provide insurance claim advances, assignment of
benefits services, or public adjusting services. Any advance provided is
a loan subject to Mississippi lending laws, not an insurance claim payment.
You are not required to use [GCSC Entity] or any affiliated service to
process your insurance claim. You may file your claim directly with your
insurance company at no cost. For assistance with insurance complaints,
contact the Mississippi Insurance Department Consumer Help Line at
1-800-562-2957.
```

**DISCLOSURE 5 - ASSIGNMENT OF BENEFITS (ROOFING)**
```
COUNSEL_APPROVED_TEXT_REQUIRED

If you are agreeing to an assignment of benefits to a residential roofing
contractor, you are giving up certain rights under your insurance policy.
Please read and understand all documents before signing. The itemized
description of work shown in any assignment has not been agreed to by your
insurer. Your insurer has the right to pay only for the cost to repair or
replace damaged property caused by a covered peril. You have the right to
cancel this assignment within five (5) business days without penalty.
Mississippi law prohibits roofing contractors from representing you on
insurance claims. [14-POINT TYPE REQUIRED BY 75-24-307]
```

**DISCLOSURE 6 - PUBLIC ADJUSTER NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

[GCSC Entity] and its contractors are NOT licensed public adjusters and
WILL NOT negotiate with your insurance company on your behalf. If you wish
to hire a public adjuster, verify they are licensed by the Mississippi
Insurance Department and that their contract has been pre-filed with the
Commissioner. You have the right to cancel a public adjuster contract
within five (5) business days without penalty. A public adjuster may not
charge more than 10% of your insurance settlement. You have the right to
retain an attorney of your choice at any time.
```

**DISCLOSURE 7 - MORTGAGEE/LOSS DRAFT NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

If your property is subject to a mortgage, your mortgage company may be
named as a co-payee on your insurance claim check and may control the
disbursement of insurance proceeds. [GCSC Entity] cannot guarantee that
insurance proceeds will be available to repay any advance or loan. You
remain responsible for repayment regardless of whether insurance proceeds
are received.
```

### Smart Contract Blocking Rules (Pseudocode)

```solidity
// PSEUDOCODE - Mississippi Blocking Rules
modifier mississippiComplianceCheck() {
    require(!isLiveLoanCreation, "MS: Live loan creation blocked pending license review");
    require(!isTokenCollateralLock, "MS: Token collateral lock blocked pending MTMA review");
    require(!isLiquidation, "MS: Liquidation blocked pending counsel review");
    require(!isAssignmentOfClaimProceeds, "MS: Claim proceeds assignment blocked pending AOB review");
    require(!isRepaymentFromInsurance, "MS: Insurance repayment routing blocked pending mortgagee review");
    require(!isLiveEscrowDisbursement, "MS: Live escrow disbursement blocked pending escrow licensing review");
    require(isDemoMode || isHashOnlyRecord, "MS: Only demo or hash records permitted");
    _;
}
```

| Action | Should Block | Notes |
|--------|-------------|-------|
| Live loan creation | **true** | Consumer lending license required under Small Loan Privilege Tax Law |
| Token collateral lock | **true** | Likely requires money transmitter license under MTMA; no clear authorization |
| Liquidation | **true** | Token liquidation may violate lending and money transmission laws |
| Assignment of claim proceeds | **true** | Roofing AOB restricted under 75-24-307; general AOB status unclear |
| Repayment routing from insurance | **true** | Mortgagee interests must be preserved; loss draft procedures apply |
| Live escrow disbursement | **true** | DBCF escrow regulation may apply; recharacterization risk |
| Demo-only records | **false** | Demonstration/mock mode permitted |
| Hash/reference-only audit records | **false** | Permitted for record-keeping, compliance, and audit trail purposes |

---

*This compliance packet is prepared for research purposes only and does not constitute legal advice. All product features marked BLOCKED or UNKNOWN_REQUIRES_COUNSEL_REVIEW must be reviewed by Mississippi-licensed counsel before any live deployment. All disclosure text marked COUNSEL_APPROVED_TEXT_REQUIRED must be drafted or approved by qualified legal counsel. This packet reflects research as of the date of preparation and should be updated regularly to reflect changes in law.*

*Packet prepared: 2025*
*State: Mississippi (MS)*
*Primary Regulators: Mississippi Insurance Department (mid.ms.gov), Mississippi Department of Banking and Consumer Finance, Mississippi State Board of Contractors*
