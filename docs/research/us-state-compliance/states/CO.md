# Colorado (CO) — SmartContractor State Compliance File

---

## Section 1: State Summary & Regulatory Overview

| Field | Detail |
|-------|--------|
| **State** | Colorado |
| **Regulatory Complexity** | Moderate-to-High |
| **Primary Insurance Regulator** | Colorado Division of Insurance (doi.colorado.gov) |
| **Financial Services Regulator** | Colorado Department of Regulatory Affairs (DORA) |
| **Consumer Credit Code** | Colorado Uniform Consumer Credit Code (UCCC) — Title 5, Article 2, CRS |
| **Digital Asset Framework** | Colorado Digital Token Act (2019) — crypto-friendly for utility tokens |
| **APR Caps** | 45% absolute max (felony above); 36% tiered on supervised loans |
| **Contractor Licensing** | State + local levels; no state-level general contractor license |
| **Escrow Regulation** | Colorado Real Estate Commission regulates escrow holders |
| **Public Adjuster License** | Required — $20,000 bond, exam, CE, 10% catastrophic fee cap |
| **AOB Status** | Generally permitted post-loss for property insurance (case law) |

**Overall Status**: All GCSC live product features should be marked **BLOCKED** or **LEGAL_REVIEW_REQUIRED** pending state-specific legal counsel review, particularly for token collateral mechanisms, insurance claim advance products, and any lending functions. Colorado presents a moderate-to-high complexity regulatory environment due to its well-developed consumer credit framework, recently enacted mortgage servicer insurance proceeds disbursement requirements (HB24-1011), and the 2024 *Douglas Smith Builders* case raising fresh concerns about AOB enforceability.

**Key Risk Areas**:
- UCCC supervised lender licensing triggers at >12% APR on consumer loans
- 45% APR hard cap (Class 6 felony to exceed)
- HB24-1011 milestone-based disbursement requirements for mortgage servicers
- Token collateral likely does NOT qualify for Digital Token Act consumptive-purpose exemption
- Municipal-only general contractor licensing creates verification complexity
- Unauthorized public adjusting is strictly enforced

---

## Section 2: Official Sources & Regulators

| Agency / Source | URL | Jurisdiction |
|-----------------|-----|--------------|
| Colorado Division of Insurance | https://doi.colorado.gov | Insurance claims, public adjuster licensing, producer regulation |
| Colorado DORA | https://dora.colorado.gov | Financial services, professional licensing, escrow regulation |
| Colorado Attorney General — Consumer Credit Unit | https://coag.gov/office-sections/consumer-protection/consumer-credit-unit/ | UCCC administration, supervised lender licensing |
| Colorado Real Estate Commission | https://doi.colorado.gov | Escrow holder regulation, real estate licensing |
| Colorado Digital Token Act (CRS 11-51-308.7) | https://law.justia.com/codes/colorado/2022/title-11/article-51/part-3/section-11-51-308-7/ | Digital token securities/licensing exemptions |
| CRS Title 10 — Insurance | https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-10.pdf | Insurance statutes including claims, AOB, loss draft |
| CRS Title 5 — Consumer Credit Code | https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-05.pdf | Full UCCC text, rate caps, licensing requirements |
| Colorado HB24-1011 | https://leg.colorado.gov/bill_files/90823/download | Mortgage servicer insurance proceeds disbursement (2024) |
| Colorado HB07-1104 | C.R.S. 10-4-120 | Freedom of choice for restoration contractors |
| Colorado Division of Banking — Crypto Guidance | Via archive | 2018 Interim Guidance on crypto and Money Transmitters Act |
| DOI Regulation 1-2-19 | 3 CCR 702-1-2-19 | Public adjuster bond and licensing requirements |
| DOI Regulation 5-1-14 | 3 CCR 702-5-1-14 | Penalties for failure to promptly pay P&C claims |
| DOI Regulation 1-2-4 | 3 CCR 702-1-2-4 | Continuing education for producers/public adjusters |
| Colorado Securities Act | CRS Title 11, Art 51 | Securities registration, exemptions, broker-dealer licensing |

---

## Section 3: Lending / Finance Licensing

### Supervised Lender License (CRS 5-2-301 et seq.)

A **"supervised loan"** is a consumer loan (including revolving credit) with a finance charge exceeding **12% per year** (CRS 5-1-301(47)). Any person making supervised loans or taking assignments of supervised loans must obtain a **supervised lender license** from the Colorado Attorney General's Office Administrator of the UCCC (CRS 5-2-301).

**Exemptions**:
- Supervised financial organizations (banks, credit unions, savings and loans)
- Collection agencies licensed under CRS 5-16, taking assignments ONLY after loans are in default (CRS 5-2-301(1)(b))

**Rate Caps** (CRS 5-2-201):

| Loan Tier | Maximum Finance Charge |
|-----------|----------------------|
| Non-supervised consumer loans | **12% APR** |
| Supervised loans <= $1,000 | **36% APR** |
| Supervised loans $1,000–$3,000 | **21% APR** |
| Supervised loans > $3,000 | **15% APR** |
| Revolving supervised loans | **21% APR** |
| **Absolute maximum** | **45% APR** (CRS 18-15-104; Class 6 felony above) |

**Recent Legislation**:
- **HB23-1229** (effective July 1, 2024): Extended Colorado rate caps to out-of-state state-chartered banks lending to Colorado residents via DIDA opt-out (CRS 5-13-106).
- **SB23-248** (effective August 2023): Changed supervised lender license renewal deadline to annually by July 1 (previously January 31).

### Loan Brokering / Arranging

Under CRS 5-1-301(31), a **"loan broker"** is a person who, for compensation, arranges or offers to arrange loans. Disclosure requirements apply (CRS 5-3-308), including:
- Amount of any non-refundable fee
- Amount of compensation
- Loan terms if known
- Statement that consumer is not obligated to complete the transaction

### Commercial / Business-Purpose Loans

The UCCC applies to **"consumer credit transactions"** (CRS 5-1-301(15)). Business-purpose loans are generally exempt from UCCC rate and licensing requirements if they are bona fide business transactions. GCSC equipment credit / contractor working capital products that are business-purpose may be exempt, but this determination requires counsel review on a transaction-by-transaction basis.

> **Key Risk**: If a loan to a contractor/sole proprietor is deemed consumer-purpose, the full UCCC applies — including rate caps, licensing, and disclosure requirements.

### Servicing / Collections

- No separate servicing license required in Colorado beyond supervised lender license for non-defaulted loans.
- Collection agencies require a separate license under CRS 5-16 (Colorado Fair Debt Collection Practices Act).

---

## Section 4: Escrow-Backed Contractor Advance Rules (NEW)

### Colorado Escrow Regulatory Framework

The **Colorado Real Estate Commission** (within DORA) regulates escrow holders and escrow activities in the state. Any GCSC product involving escrow-backed contractor advances must account for this regulatory layer.

| Requirement | Detail |
|-------------|--------|
| **Escrow Holder License** | Required for persons engaging in escrow business (CRS 12-61-1001 et seq.) |
| **Exemptions** | Banks, trust companies, credit unions, savings and loan associations, and licensed attorneys handling escrows incident to practice |
| **Bond** | Escrow agents must maintain a surety bond or E&O policy as prescribed by the Commission |
| **Fiduciary Duty** | Escrow holders owe strict fiduciary duties to all parties; commingling is prohibited |

### Escrow-Backed Advance Structure for GCSC

An escrow-backed contractor advance product would hold insurance proceeds or homeowner funds in an escrow account, disbursing to the contractor based on verified milestones. Colorado-specific requirements:

1. **Escrow Agreement Requirements**:
   - All parties (homeowner, contractor, escrow agent) must execute written escrow agreement
   - Agreement must specify: deposit amount, disbursement conditions, milestone verification process, and closing conditions
   - Escrow agent must be licensed or exempt under Colorado law
   - Interest on escrowed funds: must be held in interest-bearing account if funds held >30 days (general fiduciary principle)

2. **Milestone-Based Disbursement** (parallel to HB24-1011 structure):
   - Disbursement tied to verified completion milestones
   - Independent inspection or third-party verification recommended
   - Partial retainage (up to 15% per CRS 10-4-112) may be held until final completion

3. **GCSC Platform as Escrow Coordinator (NOT Escrow Holder)**:
   - GCSC should NOT hold escrow funds directly unless properly licensed as an escrow agent
   - GCSC may partner with a licensed Colorado escrow agent or financial institution
   - Smart contract milestone verification may serve as input to escrow disbursement but does NOT replace licensed escrow holder's fiduciary determination

4. **Fee Structure Considerations**:
   - Escrow fees must be disclosed upfront per UCCC if transaction is deemed consumer credit
   - If advance includes any finance charge >12%, supervised lender licensing applies
   - Escrow fees are generally not treated as finance charges if bona fide third-party fees paid to independent escrow agent

5. **Compliance Checklist for Escrow-Backed Advances**:

```
□ Licensed Colorado escrow agent engaged as escrow holder
□ Written escrow agreement executed by all parties
□ Milestone schedule attached as exhibit to escrow agreement
□ Independent inspection/verification process defined
□ UCCC applicability analysis completed (is this a supervised loan?)
□ If supervised loan: supervised lender license confirmed
□ Rate cap analysis completed (36%/21%/15% tiered caps)
□ Consumer disclosures provided if UCCC applies
□ Escrow funds held in non-commingled, interest-bearing account
□ Public adjuster unauthorized practice firewall confirmed
□ Contractor municipal license verified in jurisdiction of work
```

6. **Intersection with HB24-1011**:
   - If the property is mortgaged, the mortgage servicer's milestone disbursement under HB24-1011 may overlap or conflict with an escrow-backed contractor advance
   - GCSC must coordinate timing: mortgage servicer's first disbursement (14–30 days) vs. contractor advance timing
   - Escrow advance should be structured as subordinate to or in coordination with mortgage servicer disbursement schedule

---

## Section 5: Contractor Licensing & Financing

### Contractor Licensing

**No State-Level General Contractor License**: Colorado does NOT require a state-level license for general contractors. Licensing is handled entirely at the **local/municipal level**.

| Contractor Type | State License Required? | Regulator |
|-----------------|------------------------|-----------|
| General Contractor | **NO** — municipal only | Local jurisdiction |
| Electrical Contractor | YES | Colorado Electrical Board / DORA |
| Plumbing Contractor | YES | Colorado State Plumbing Board / DORA |
| Fire Suppression | YES (specialty) | Various state boards |

**Major Municipal Requirements**:

| City / County | License Classes | Key Requirements |
|---------------|-----------------|------------------|
| **Denver** | Class A, B, B-2, C, D | Supervisor Certificate; ICC exam required |
| **Colorado Springs** | Class A, B, C | ICC exam + proof of insurance |
| **Boulder** | Class A, B, C | ICC system; local requirements |
| Other municipalities | Varies | Verify locally before work begins |

### Financing to Contractors

**Business-Purpose Exemption**: Equipment financing and working capital loans to properly licensed contractors likely fall outside the UCCC if a bona fide business purpose is established.

**UCCC Applies If**:
- Contractor is a sole proprietor where loan proceeds could be deemed for consumer use
- Finance charge exceeds 12% and transaction is deemed consumer credit

**Disclosure Requirements**: If UCCC applies, extensive disclosures are required including finance charge, APR, and payment schedule (CRS 5-3-101 et seq.).

### Restoration Contractor Specific Rules

**HB07-1104 (CRS 10-4-120)**: Insurers **CANNOT**:
- Require that repairs be made by a specific repair business
- Coerce, threaten, or induce by incentive (except warranty/guaranty repairs)
- Use disincentives for contractor choice
- Solicit or accept referral fees

Insurers **MUST**:
- Provide estimate copy
- Ensure estimate is adequate to restore property
- Pay prevailing competitive prices
- Orally and in writing disclose free choice of repair business
- Assume all reasonable costs
- Promptly pay repair services
- Disclose ownership interests in recommended businesses

---

## Section 6: Token Collateral / Crypto

### Colorado Digital Token Act (SB19-023 / CRS 11-51-308.7, enacted March 6, 2019)

The Digital Token Act provides **limited exemptions** from securities registration and broker-dealer/salesperson licensing for persons dealing in **"digital tokens"** with a **primarily consumptive purpose**.

| Element | Definition |
|---------|------------|
| **"Digital Token"** | A digital unit created via blockchain, recorded on a decentralized ledger, and capable of being traded/transferred without an intermediary (CRS 11-51-308.7(4)(b)) |
| **"Consumptive Purpose"** | To provide or receive goods, services, or content, including access to goods, services, or content |

**Exemptions Available**:

1. **Issuer Exemption** (from securities registration) — Available if:
   - Primary purpose of digital token is consumptive
   - Token is marketed for consumptive purpose, NOT speculative/investment
   - Consumptive purpose available at time of sale OR within 180 days, with resale restrictions until available
   - Buyer provides knowing/clear acknowledgment of consumptive intent
   - Notice filed with Securities Commissioner

2. **Licensing Exemption** (from broker-dealer) — Available if:
   - Person effects purchase/sale/transfer after rules promulgated
   - Digital token can be used for consumptive purpose at time of transaction
   - Person takes reasonably prompt action to cease trading tokens not meeting requirements
   - Notice filed (Form DT-2)

**Relevance to GCSC Token Collateral**:
- GCSC's token collateral/lock mechanism involves **holding tokens as security/collateral for a loan**, not purchasing tokens for consumptive purposes.
- The Digital Token Act exemptions are designed for **consumptive purpose tokens** (utility tokens), not collateral/security arrangements.
- **GCSC's token collateral mechanism likely DOES NOT qualify for the Digital Token Act exemption** because it involves holding tokens as investment/collateral security, not for consumptive use.
- **No presumption of violation** arises solely from participating in digital token issuance/purchase/sale/transfer if the consumptive purpose exemption is not met (safe harbor in CRS 11-51-308.7(6)).

### Money Transmitter Act & Cryptocurrency

**2018 Colorado Division of Banking Interim Guidance** ("Cryptocurrency and the Colorado Money Transmitters Act"):

| Scenario | License Required? |
|----------|-----------------|
| Transmitting **only cryptocurrencies** (no fiat) | **NO** — cryptocurrencies are NOT legal tender under the Act |
| Selling/buying crypto for fiat + allowing Colorado customer to transfer crypto to another customer within exchange + allowing transfer of fiat through crypto medium | **YES** — all three conditions must be met |

**Relevance to GCSC**:
- If GCSC token collateral system locks tokens as collateral without involving fiat currency transmission, money transmitter licensing may not be required under the 2018 guidance.
- However, if any loan disbursement involves fiat currency transmission routed through the token system, money transmitter licensing may be triggered.
- **STATUS: TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW** — The application of Colorado money transmitter law to token-collateralized lending platforms is untested. The Digital Token Act does not provide exemptions for collateral/secured lending arrangements.

---

## Section 7: Insurance Claim Advances

### Claim Settlement Timing (CRS 10-3-1115, 10-3-1116 & DOI Regulation 5-1-14)

| Requirement | Detail |
|-------------|--------|
| Decision / Payment Deadline | **60 days** after receipt of valid and complete claim unless reasonable dispute exists |
| Late Payment Penalty | 8% annual interest on benefits due + civil penalty of **$100/day** payable to the state |
| Valid Claim Trigger | All documentation received, investigation complete, coverage established, no indicators requiring additional investigation |

### Bad Faith Statutory Claims

- **CRS 10-3-1115**: Prohibits insurers from unreasonably delaying or denying payment of a claim for benefits owed to a first-party claimant.
- **CRS 10-3-1116**: First-party claimant whose claim was unreasonably delayed/denied may recover **2x the covered benefit + attorney fees + costs**.
- **"First-party claimant" includes repair vendors** who provide services on behalf of an insured (*My Roofer, Inc. v. State Farm*, Colorado Court of Appeals).

### Additional Living Expenses (ALE)

| Requirement | Detail |
|-------------|--------|
| ALE Coverage | Covers increased living expenses during time required to repair/replace damage (CRS 10-4-110.8(3)(a)) |
| Wildfire-Specific Minimum | **24 months** ALE; extensions available (CRS 10-4-110.8(13)(c)) |
| ALE Payment Timing | Within **20 days** after receiving documentation (CRS 10-4-110.8(13)(e)) |

### Emergency Advance Payments

No specific Colorado statute requires insurers to provide emergency advance payments before full claim settlement. However:
- The 60-day decision requirement and bad faith statutes create pressure for timely advance payments where liability is reasonably clear
- Insurers must act promptly and cannot unreasonably delay payment

### Mortgage Servicer Insurance Proceeds Disbursement (HB24-1011, effective 2024)

**CRITICAL NEW LAW FOR GCSC**: HB24-1011 adds significant requirements for mortgage servicers handling insurance proceeds:

| Element | Requirement |
|---------|-------------|
| **Disclosure** | Upon borrower request, servicer must promptly disclose specific conditions for insurance proceeds disbursement |
| **Repair/Rebuild Plan** | Borrower (after consulting with contractor) must create repair/rebuild plan with milestones; servicer must approve/deny within **30 days** |
| **Claim <$5,000** | Entire amount disbursed in one payment |
| **Claim $5,000–$40,000** | Initial 25% disbursement (max $10,000); remainder in milestone-based payments not exceeding 25% of remaining proceeds |
| **Claim >$40,000** or borrower >31 days delinquent | Milestone-based disbursement; no disbursement until servicer inspects repairs |
| **First Disbursement Timing** | Within **14 days** (federally insured/securitized loans) or **30 days** (other loans) after servicer receives proceeds |
| **Interest-Bearing Account** | Undisbursed proceeds held at rate no less than federal money market rate; interest credited to borrower |
| **Excess Proceeds** | Promptly disburse any amount exceeding remaining mortgage balance (subject to affordable rental property restrictions) |

**Implications for GCSC**: Any GCSC product involving claim proceeds routed through or coordinated with mortgage servicers must account for these milestone-based disbursement requirements.

---

## Section 8: Assignment of Benefits

### AOB Status: **GENERALLY PERMITTED FOR PROPERTY INSURANCE (WITH SIGNIFICANT CAVEATS)**

**Key Colorado Case Law**:

| Case | Court | Year | Holding |
|------|-------|------|---------|
| *Parrish v. Rocky Mountain HMO* | Colo. Supreme Ct. | 1998 | AOBs void for health insurance (non-assignment clauses). **NOT extended to property insurance.** |
| *My Roofer, Inc. v. State Farm Fire & Casualty Co.* | Colo. Ct. of Appeals | 2017 | AOB upheld for property damage. Repair vendor with AOB = "first-party claimant" under CRS 10-3-1115. Allows direct suit for bad faith. |
| *Rooftop Restoration, Inc. v. Ohio Security Ins. Co.* | D. Colo. | 2016 | AOB upheld for property damage; statutory penalty claims NOT assignable. |
| *Douglas Smith Builders v. State Farm Fire & Casualty Co.* | D. Colo. | **2024** | AOB **invalid** — underlying contract was **illusory** (lacked consideration, no obligation to perform specific work). **Key warning for GCSC.** |

### Practical AOB Requirements in Colorado

- No specific statute governing AOB format/content for property insurance (unlike Florida's detailed AOB statute)
- Contract must have **adequate consideration and definite terms** to avoid being deemed "illusory" (*Douglas Smith Builders*)
- AOB should be combined with:
  1. Privacy waiver/authorization for insurance company communication
  2. Mortgagee notification
  3. Specific scope of work
- AOB should clearly identify what claim components are assigned (e.g., dwelling but not ALE or contents)
- AOB + contract for specific work is more defensible than standalone AOB

### Restrictions

- Statutory bad faith claims (CRS 10-3-1116) — while *My Roofer* allowed them, this remains contested territory
- Insurers may include non-assignment clauses in policies; courts evaluate on case-by-case basis
- No prohibition on post-loss assignment of property insurance claims found in Colorado statutes

---

## Section 9: Public Adjuster / Insurance Representation

### Licensing Requirements (CRS 10-2-417)

| Requirement | Detail |
|-------------|--------|
| **License Required?** | YES — any person acting as a "public insurance adjuster" must be licensed by the Colorado Division of Insurance |
| **Definition** | A person who, for compensation, acts on behalf of an insured in negotiating for or effecting settlement of a claim for loss or damage under a property/casualty insurance policy |
| **Bond** | **$20,000** surety bond required (CRS 10-2-417(2); DOI Regulation 1-2-19) |
| **Exam** | State licensing exam required |
| **Continuing Education** | Required per DOI Regulation 1-2-4 |
| **Independent Adjusters** | Colorado does NOT license independent adjusters (who work for insurers). Only public adjusters require licensing. |

### Conduct Standards (CRS 10-2-417)

Public adjuster contracts must be **in writing** and include:
- Adjuster's license number
- Clear fee disclosure
- Description of services
- **3-business-day right to cancel**
- Signatures of both parties

**Fee Cap**: Cannot charge more than **10%** of claim settlement for losses related to a **declared catastrophic disaster**.

**Prohibited Acts**:
- Representing as a public adjuster while not licensed
- Making false statements
- Misrepresenting policy terms
- Charging unconscionable fees
- Permitting unlicensed employee/representative to conduct business requiring a license

### GCSC Implications

> **CRITICAL**: GCSC and/or its contractor partners **MUST NOT act as public adjusters** unless properly licensed.

- GCSC contractors should **not negotiate insurance claims on behalf of homeowners** — this would constitute unauthorized public adjusting
- GCSC can facilitate connections between homeowners and **licensed public adjusters**, but must not control or direct the public adjuster's work
- Any GCSC platform features that assist with claim documentation should be carefully designed to avoid crossing into "representing the insured" territory

---

## Section 10: Dashboard Rules, Disclosures, Smart Contracts & Risk Scores

### Product Status Dashboard

```json
{
  "state": "CO",
  "state_name": "Colorado",
  "regulators": {
    "insurance": "Colorado Division of Insurance (doi.colorado.gov)",
    "financial_services": "Colorado DORA",
    "consumer_credit": "CO Attorney General - Consumer Credit Unit",
    "escrow": "Colorado Real Estate Commission"
  },
  "token_collateral_equipment_credit": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "securities", "security"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "DIGITAL_TOKEN_ACT_CONSUMPTIVE_PURPOSE_ANALYSIS_REQUIRED",
      "MONEY_TRANSMITTER_ANALYSIS_REQUIRED",
      "UCCC_RATE_CAP_DISCLOSURE_36_21_15_TIERED"
    ],
    "notes": "Colorado Digital Token Act provides limited exemptions only for consumptive-purpose tokens. Token collateral/lock for lending likely DOES NOT qualify. Money Transmitter Act may apply if fiat involved. UCCC supervised lender licensing may apply if finance charge >12% and transaction deemed consumer credit. 45% APR absolute max (Class 6 felony above). HB23-1229 extends rate caps to out-of-state banks. Token collateral product BLOCKED pending: (1) securities counsel opinion on Digital Token Act applicability, (2) money transmitter analysis, (3) UCCC licensing analysis, (4) smart contract audit."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "insurance"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "PUBLIC_ADJUSTER_UNAUTHORIZED_PRACTICE_WARNING",
      "CONTRACTOR_CHOICE_DISCLOSURE",
      "HB24_1011_MORTGAGE_SERVICER_PROCEEDS_DISCLOSURE"
    ],
    "notes": "Colorado allows Assignment of Benefits for property insurance per case law (My Roofer v. State Farm), but recent Douglas Smith Builders case (2024) shows AOBs can be invalidated if contract is illusory. Public adjuster licensing strictly enforced - GCSC/contractors must not negotiate claims on behalf of insureds. HB24-1011 creates complex milestone-based disbursement requirements for mortgage servicers handling insurance proceeds. Claim advance products may trigger UCCC supervised lender licensing if >12% finance charge. CRS 10-4-120 prohibits insurer interference with contractor choice. BLOCKED pending: (1) AOB enforceability opinion, (2) public adjuster unauthorized practice analysis, (3) UCCC licensing determination for claim advances, (4) mortgage servicer coordination analysis under HB24-1011."
  },
  "escrow_backed_contractor_advance": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": ["licensed_contractors_municipal"],
    "blocked_actions": ["gcsc_acting_as_escrow_holder"],
    "required_reviews": ["legal", "provider", "escrow"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "ESCROW_AGENT_LICENSE_VERIFICATION",
      "MILESTONE_DISBURSEMENT_TERMS",
      "UCCC_APPLICABILITY_ANALYSIS"
    ],
    "notes": "Escrow-backed contractor advances are a potential viable pathway in Colorado if structured with a licensed escrow agent, milestone-based disbursement, and UCCC compliance. Colorado Real Estate Commission regulates escrow holders. GCSC must NOT hold escrow funds directly without an escrow license. Must partner with licensed escrow agent or financial institution. UCCC analysis required if any finance charge applies. Intersection with HB24-1011 if mortgaged property."
  },
  "contractor_flow_status": "RESTRICTED_MUNICIPAL_LICENSE_REQUIRED - Colorado has no state-level general contractor license; all contractor licensing is municipal. GCSC must verify contractor holds valid license in each municipality where work is performed. Denver, Colorado Springs, Boulder have specific ICC exam requirements.",
  "homeowner_flow_status": "PROCEED_WITH_COUNSEL_APPROVED_DISCLOSURES ONLY - Homeowners have freedom of contractor choice under CRS 10-4-120/HB07-1104. All disclosures must be approved by Colorado counsel. Homeowner cannot be steered to specific contractors.",
  "restoration_company_flow_status": "RESTRICTED_LICENSE_REQUIRED - Restoration companies must be properly licensed at municipal level. Cannot negotiate insurance claims without public adjuster license. Can accept AOBs if properly structured with consideration and definite terms."
}
```

### Required Disclosures

#### UCCC Required Disclosure (if supervised loan)
```
COUNSEL_APPROVED_TEXT_REQUIRED

[Before consummation of a consumer credit transaction, creditor must 
disclose: amount financed, finance charge expressed as dollar amount 
and APR, payment schedule, total of payments, etc. per CRS 5-3-101.]

The finance charge does not exceed the maximum permitted by the 
Colorado Uniform Consumer Credit Code (CRS Title 5, Articles 1-9).
```

#### Rate Cap Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

The annual percentage rate (APR) on this transaction does not exceed 
the maximum rate permitted by Colorado law. Under Colorado Revised 
Statutes Section 5-2-201, the maximum finance charge for this type 
of transaction is [RATE]%. Charging an APR exceeding 45% is a 
felony under Colorado law (CRS 18-15-104).
```

#### Digital Token Act Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

The tokens being used as collateral are not being offered or sold for 
a "consumptive purpose" as defined by the Colorado Digital Token Act 
(CRS 11-51-308.7). This transaction involves holding digital assets 
as security for a loan, which may not qualify for the limited 
exemptions available under Colorado securities law. 

This transaction has not been reviewed or approved by the Colorado 
Securities Commissioner. You should consult with your own legal and 
financial advisors before participating.
```

#### Cryptocurrency Risk Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

Digital assets are highly volatile and may lose value rapidly. 
Collateral liquidation may occur if collateral value falls below 
required thresholds. Colorado law does not provide the same 
protections for digital asset transactions as for traditional 
financial products. The Colorado Division of Banking has issued 
guidance that certain cryptocurrency activities may not require 
money transmitter licensing, but this does not mean the transaction 
is risk-free or regulated.
```

#### Assignment of Benefits Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

By signing this Assignment of Benefits, you are transferring certain 
rights under your insurance policy to the assignee. Under Colorado 
law, assignments of property insurance benefits have been upheld by 
courts in certain circumstances, but enforceability depends on the 
specific terms of this agreement and your insurance policy.

You retain the right to choose your own repair contractor under 
Colorado law (CRS 10-4-120). No person can require you to assign 
your insurance benefits as a condition of receiving services.

You have the right to consult with an attorney, licensed public 
adjuster, or the Colorado Division of Insurance before signing this 
document. 

[Three-business-day cancellation right if public adjuster involved]
```

#### Public Adjuster Unauthorized Practice Warning
```
COUNSEL_APPROVED_TEXT_REQUIRED

[GCSC/Contractor name] is NOT a licensed public insurance adjuster. 
We cannot and will not negotiate your insurance claim on your behalf 
or represent you in any dispute with your insurance company. Only a 
licensed public insurance adjuster or attorney can represent you in 
negotiations with your insurer.

If you would like assistance with your insurance claim, you may 
contact a licensed public adjuster or the Colorado Division of 
Insurance at 303-894-7855 or https://doi.colorado.gov.
```

#### Contractor Choice Disclosure (CRS 10-4-120)
```
COUNSEL_APPROVED_TEXT_REQUIRED

Under Colorado law (CRS 10-4-120), you have the right to choose any 
qualified repair business to perform work on your property. No 
insurance company, contractor, or other person can require you to use 
a specific repair business, or threaten that your claim will not be 
paid or will be delayed based on your choice of repair business.

[Name of business] does not have any ownership interest in or 
affiliation with the following recommended repair businesses: [LIST 
OR STATE "NONE"].
```

#### Mortgage Servicer Proceeds Disclosure (HB24-1011)
```
COUNSEL_APPROVED_TEXT_REQUIRED

If your property is subject to a mortgage, your mortgage servicer 
may be required to hold all or a portion of your insurance proceeds 
and disburse them according to a milestone-based repair plan under 
Colorado law (HB24-1011). This may result in delays in accessing 
funds to pay for repairs. Your mortgage servicer must disclose the 
specific conditions for disbursement upon your request.

Initial disbursement rules:
- Claims under $5,000: Full disbursement
- Claims $5,000-$40,000: 25% initial disbursement (max $10,000)
- Claims over $40,000: Milestone-based disbursement after inspection

Your mortgage servicer must hold undisbursed funds in an 
interest-bearing account, with interest credited to you.
```

#### Escrow-Backed Advance Disclosure (NEW)
```
COUNSEL_APPROVED_TEXT_REQUIRED

Your contractor advance will be held in escrow by [LICENSED ESCROW 
AGENT NAME], a [licensed Colorado escrow agent / federally insured 
financial institution]. Funds will be disbursed to your contractor 
based on verified completion milestones as described in the attached 
milestone schedule.

You have the right to request information about the escrow holder's 
licensing status. Escrowed funds will be held in a non-commingled, 
interest-bearing account in accordance with Colorado law.

[If applicable: This transaction may be subject to the Colorado 
Uniform Consumer Credit Code. A copy of the required disclosures 
has been provided separately.]
```

### Smart Contract Implications

| Feature | Smart Contract Action | Status | Notes |
|---------|----------------------|--------|-------|
| Live Loan Creation | `createLoan()` | **BLOCK** | Requires UCCC supervised lender license if finance charge >12% |
| Token Collateral Lock | `lockCollateral()` | **BLOCK** | Digital Token Act exemption unlikely to apply; securities law risk |
| Token Liquidation | `liquidateCollateral()` | **BLOCK** | Money transmitter analysis required; UCCC compliance required |
| Repayment Routing | `routeRepayment()` | **BLOCK** | If from insurance proceeds, must comply with HB24-1011 milestone requirements |
| Escrow Milestone Verification | `verifyMilestone()` | **LEGAL_REVIEW** | May serve as input to escrow disbursement but does NOT replace licensed escrow holder's fiduciary duty |
| AOB Recording | `recordAOB()` | **DEMO ONLY** | AOB enforceability uncertain per *Douglas Smith Builders*; hash-only record |
| Claim Proceeds Assignment | `assignClaimProceeds()` | **BLOCK** | Must not constitute unauthorized public adjusting; complex under HB24-1011 |
| Insurance Claim Status | `recordClaimStatus()` | **HASH ONLY** | Can record hash/reference for audit trail; no live transaction processing |
| Contractor Verification | `verifyLicense()` | **PERMITTED** | Can verify municipal contractor license status via public records |

### Colorado-Specific Smart Contract Rules

```json
{
  "smart_contract_rules": {
    "block_live_loan_creation": true,
    "block_token_collateral_lock": true,
    "block_liquidation": true,
    "block_assignment_of_claim_proceeds": true,
    "block_repayment_routing_from_insurance_proceeds": true,
    "block_gcsc_escrow_holding": true,
    "allow_demo_only_records": true,
    "allow_hash_reference_only_audit_records": true,
    "allow_milestone_verification_input": true,
    "colorado_specific": {
      "hb24_1011_milestone_compliance": "SMART_CONTRACT_MUST_ACCOUNT_FOR_MILESTONE_BASED_DISBURSEMENT",
      "digital_token_act_safe_harbor": "NO_PRESUMPTION_OF_VIOLATION_BUT_EXEMPTION_UNLIKELY_FOR_COLLATERAL",
      "uccc_rate_check": "SMART_CONTRACT_MUST_ENFORCE_36_21_15_TIERED_RATE_CAP",
      "public_adjuster_wall": "SMART_CONTRACT_MUST_NOT_FACILITATE_UNLICENSED_CLAIM_NEGOTIATION",
      "escrow_agent_requirement": "GCSC_CANNOT_HOLD_ESCROW_DIRECTLY_WITHOUT_LICENSE",
      "contractor_license_verification": "MUST_VERIFY_MUNICIPAL_LICENSE_NOT_STATE_LICENSE"
    }
  }
}
```

### Risk Scores

| Risk Category | Score | Rationale |
|---------------|-------|-----------|
| **Lending Risk** | **HIGH** | UCCC requires supervised lender license for >12% finance charge. 36%/21%/15% tiered rate caps. 45% max (Class 6 felony). HB23-1229 extends caps to out-of-state banks. |
| **Insurance Claim Risk** | **HIGH** | HB24-1011 creates complex milestone-based disbursement requirements. 60-day prompt payment rule with $100/day penalties. 2x statutory damages for bad faith. Contractor choice protections restrict coordination. |
| **AOB Risk** | **MEDIUM** | Colorado courts generally uphold AOBs for property insurance, but *Douglas Smith Builders* (2024) shows invalidation risk if contract is illusory. No specific AOB statute for property insurance. |
| **Public Adjuster Risk** | **HIGH** | Strict licensing required ($20K bond, exam, CE). Only licensed public adjusters can negotiate with insurers on behalf of insured. 10% fee cap for catastrophic disasters. |
| **Token Collateral Risk** | **HIGH** | Digital Token Act limited to consumptive-purpose tokens; collateral/lock likely doesn't qualify. Money transmitter analysis required if fiat involved. Untested legal territory. |
| **Escrow-Backed Advance Risk** | **MEDIUM** | Viable pathway if structured with licensed escrow agent and UCCC compliance. Key risk is GCSC accidentally acting as unlicensed escrow holder or triggering supervised lender licensing. |
| **Consumer Protection Risk** | **HIGH** | Strong consumer protections: UCCC rate caps, 2x bad faith damages, contractor freedom of choice, HB24-1011 borrower protections, public adjuster fee caps. Colorado AG actively enforces. |

---

## Appendix A: Key Colorado Statutes Reference

| Statute | Citation | Subject |
|---------|----------|---------|
| Uniform Consumer Credit Code | CRS Title 5, Articles 1-9 | Consumer lending, rate caps, licensing |
| Supervised Lender License | CRS 5-2-301, 5-2-302 | Lender licensing requirements |
| Finance Charge Limits | CRS 5-2-201 | Rate caps (36%/21%/15%) |
| Usury / Felony Rate | CRS 18-15-104 | 45% max APR (Class 6 felony above) |
| Digital Token Act | CRS 11-51-308.7 | Securities/licensing exemption for consumptive tokens |
| Colorado Securities Act | CRS Title 11, Art 51 | Securities registration, broker-dealer licensing |
| Insurance Unfair Practices | CRS 10-3-1104, 10-3-1115, 10-3-1116 | Bad faith, prompt payment, penalties |
| Loss Payee Retainage | CRS 10-4-112 | 15% retainage allowed until completion |
| Contractor Choice | CRS 10-4-120 / HB07-1104 | Freedom to choose repair business |
| Homeowner's Insurance Practices | CRS 10-4-110.8 | ALE, replacement cost, claim handling |
| Public Adjuster Licensing | CRS 10-2-417 | License, bond, conduct standards |
| Mortgage Servicer Proceeds | HB24-1011 | Disclosure, milestone disbursement, timing |
| DIDA Opt-Out | CRS 5-13-106 | Rate cap extension to out-of-state banks |
| Money Transmitter Act | CRS Title 11, Art 52 | Money transmission licensing |
| Escrow Regulation | CRS 12-61-1001 et seq. | Escrow agent licensing, fiduciary duties |

## Appendix B: Recent Legislative Developments

| Bill | Year | Effect |
|------|------|--------|
| **HB24-1011** | 2024 | New mortgage servicer insurance proceeds disbursement requirements |
| **HB23-1229** | 2024 | Extended Colorado UCCC rate caps to out-of-state state-chartered banks via DIDA opt-out (effective July 1, 2024) |
| **SB23-248** | 2023 | Changed supervised lender license renewal to July 1; created Consumer Credit Unit Cash Fund (effective August 7, 2023) |
| **HB20-1031** | 2020 | Various UCCC amendments |
| **SB19-023 / Digital Token Act** | 2019 | Enacted March 6, 2019. Limited securities/licensing exemptions for consumptive-purpose digital tokens |

## Appendix C: Case Law Summary

| Case | Court | Year | Holding |
|------|-------|------|---------|
| *Parrish v. Rocky Mountain HMO* | Colo. Supreme Ct. | 1998 | AOBs void for health insurance; NOT extended to property insurance |
| *My Roofer, Inc. v. State Farm* | Colo. Ct. of Appeals | 2017 | AOB upheld for property; contractor = first-party claimant |
| *Rooftop Restoration v. Ohio Sec. Ins.* | D. Colo. | 2016 | AOB upheld but statutory penalties not assignable |
| *Douglas Smith Builders v. State Farm* | D. Colo. | **2024** | AOB invalid as illusory contract; warning about poorly drafted AOBs |
| *Kyle W. Larson Enterprises v. Allstate* | Colo. Ct. of Appeals | 2012 | Repair vendor can be first-party claimant |

---

*This file was prepared for informational and research purposes only. It does not constitute legal advice. All product features must be reviewed by Colorado-licensed legal counsel before deployment. All statutes and regulations should be independently verified against official sources.*

*File prepared: 2025*
*Research sources: Official Colorado statutes, Colorado Division of Insurance, Colorado Attorney General, Colorado Division of Banking, Colorado Real Estate Commission, court opinions*
