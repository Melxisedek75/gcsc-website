# Arizona (AZ) — SmartContractor State Compliance

## 1. State Summary

Arizona presents a **moderately complex regulatory environment** for SmartContractor products. The state is notably innovation-friendly — it was the **first U.S. state to create a fintech regulatory sandbox** (2018), explicitly **recognizes blockchain signatures, records, and smart contracts as legally valid** (A.R.S. Section 44-7061), and has enacted **detailed Assignment of Benefits statutes** (A.R.S. Sections 20-1122.01, 20-1122.02) that permit post-loss AOBs with specific procedural safeguards. However, Arizona **strictly prohibits contractors from negotiating insurance claims** on behalf of insureds (A.R.S. Section 32-1158.02(L)), requires **consumer lender licensing** for entities making more than 3 closed-end loans per year to Arizona residents (A.R.S. Section 6-601 et seq.), and subjects cryptocurrency/fiat exchanges to **money transmitter licensing** (A.R.S. Section 6-1201 et seq.). All SmartContractor product components involving live lending, token collateral lock, liquidation, insurance claim advances, and assignment of benefits require legal review before any pilot or live deployment.

---

## 2. Lending / Finance Licensing

### 2.1 Consumer Lender Licensing (A.R.S. Section 6-601 et seq.)

| Requirement | Detail |
|-------------|--------|
| **Regulator** | Arizona Dept. of Insurance & Financial Institutions (DIFI) |
| **License Required** | A person may not engage in the business of a "consumer lender" without first being licensed by DIFI (A.R.S. Section 6-603). |
| **"Consumer Lender" Definition** | A person who advertises to make or procure, solicits, holds itself out to make or procure, or makes/procures "consumer lender loans" to consumers in Arizona (A.R.S. Section 6-601(5)). |
| **"Regularly Engaged" Threshold** | Advertising/soliciting Arizona residents OR making **3 or more consumer loans** within a calendar year to Arizona residents (A.R.S. Section 6-601(16)). |
| **"Consumer Loan" Definition** | A direct closed-end loan of money in an amount of **$10,000 or less** that is subject to a finance charge (A.R.S. Section 6-601(7)). |
| **Finance Charge Limitations** | A.R.S. Section 6-632 prescribes maximum finance charges; compounded finance charges prohibited (A.R.S. Section 6-633(C)). |
| **Loan Brokering** | A.R.S. Section 6-601(5) includes "procuring" consumer loans. A person who seeks to avoid the Consumer Lender Act by "any device, subterfuge or pretense" is subject to licensure (A.R.S. Section 6-603(B)). |

**Exemptions from Chapter 5** (A.R.S. Section 6-602):
- Banks, savings banks, trust companies, savings and loan associations, credit unions, insurance companies
- Persons **not regularly engaged** in the business of making consumer lender loans
- Licensed pawnbrokers (to the extent governed by Title 44, Chapter 11, Article 3)
- **Closed-end loans of more than $10,000** (exempt from requirements of Chapter 5)
- Commercial/business-purpose loans that do not meet the consumer loan definition

**License Application Requirements** (per DIFI):
| Requirement | Detail |
|-------------|--------|
| Application Fee | $1,000 |
| License Fee | Varies by month applied |
| Biographical Statements | Required for owners with >20% interest, officers, directors, partners, key employees |
| Business Plan | Required |
| Letter of Good Standing | Dated within 6 months |
| Organizational Chart | Showing ownership percentages |
| Financial Solvency | Minimum **$25,000 in liquid assets** per licensed location |
| Financial Statements | Unaudited Balance Sheet & P&L required |

**Renewal**: Annual renewal required by June 30; license automatically expires July 31 if not renewed (A.R.S. Section 6-604, as amended by HB 2010, 2024).

**Consequences of Unlicensed Lending** (A.R.S. Section 6-613):
| Loan Amount | Consequence |
|-------------|-------------|
| $5,000 or less | Loan is **voidable** — licensee has no right to collect principal, finance charges, or fees |
| Over $5,000 | No right to collect finance charges |
| Any unlicensed loan | No right to collect, receive, or retain any principal, finance charges, or fees |

### 2.2 Money Transmitter Licensing (A.R.S. Section 6-1201 et seq.)

| Requirement | Detail |
|-------------|--------|
| **Regulator** | DIFI |
| **Definition** | A "money transmitter" includes persons who: (a) sell/issue payment instruments; (b) engage in receiving money for transmission; (c) engage in exchanging payment instruments or money into any form of money or payment instrument (A.R.S. Section 6-1201). |
| **Cryptocurrency Treatment** | Arizona treats cryptocurrency under **existing money transmitter laws** (no separate crypto license). Exchanges, ATMs, and OTC with fiat must obtain an AZ Money Transmitter License from DIFI. |
| **Key Exemption** | Operators of payment systems providing processing/clearing/settlement services in connection with wire transfers, credit/debit card transactions, stored value transactions, ACH transfers, or similar transfers are exempt (A.R.S. Section 6-1202(A)(1)). |

### 2.3 Earned Wage Access / Non-Recourse Advance Guidance

Arizona Attorney General Opinion I22-005 (December 2022) held that a non-recourse, no-interest Earned Wage Access product is **NOT** a "consumer loan" requiring licensure because:
- It represents payment of wages already earned (not a "loan of money")
- No finance charge is imposed

**Implication for SmartContractor**: Non-recourse advances (without finance charges) to homeowners based on insurance claim proceeds may fall outside consumer lender licensing, but this requires state-specific legal analysis.

### 2.4 Fintech Sandbox (A.R.S. Title 41, Chapter 55)

| Parameter | Limit |
|-----------|-------|
| **Administrator** | Arizona Attorney General's Office |
| **Duration** | 24-month testing period |
| **Consumer Loan Limit** | $15,000 per transaction / $50,000 aggregate per consumer |
| **Money Transmitter Limit** | $2,500 per transaction / $25,000 aggregate (increasable to $15K/$50K) |
| **Consumer Cap** | Maximum 10,000 consumers (increasable to 17,500) |
| **Sunset** | July 1, 2028 |
| **Federal Law** | Participants deemed to possess appropriate state license for purposes of federal law |

---

## 3. Token Collateral / Digital Asset Rules

### 3.1 Arizona's Crypto-Friendly Legal Framework

A.R.S. Section 44-7061 (enacted 2017, amended) explicitly recognizes:

| Element | Legal Status |
|---------|-------------|
| Blockchain-secured signature | = **Electronic signature** |
| Blockchain-secured record/contract | = **Electronic record** |
| Smart contracts in commerce | A contract may **not be denied legal effect** solely because it contains a smart contract term |
| Ownership rights | A person using blockchain to secure information retains the same rights of ownership/use |

**Definitions under A.R.S. Section 44-7061**:
- **"Blockchain technology"** = distributed ledger using cryptography, immutable, auditable
- **"Smart contract"** = event-driven program running on distributed ledger that can take custody and instruct transfer of assets

**HB 2749 (2025)**: Creates "Bitcoin and Digital Assets Reserve Fund" for unclaimed digital assets; establishes procedures for reporting, holding, and transferring unclaimed digital assets; sets 3-year dormancy period for digital assets; authorizes staking by state custodians.

### 3.2 Token Collateral for Loans

- **No Arizona statute specifically addresses** the use of cryptocurrency or digital assets as collateral for a loan.
- A.R.S. Section 44-7061 provides a foundation for smart contracts securing information/rights, including transfer of assets on a ledger.
- General secured transaction principles under Arizona UCC would apply.

**SmartContractor Assessment**: The concept of token collateral lock, liquidation, and repayment routing via smart contract is novel under Arizona law. While the state's crypto-friendly posture (blockchain recognition, fintech sandbox) suggests openness, there is no explicit statutory authorization for automated token collateral liquidation in a lending context.

**STATUS**: **TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW**

### 3.3 Potential Pathways

| Pathway | Notes |
|---------|-------|
| Fintech Sandbox | May provide a regulatory pathway for testing (expires July 2028) |
| Licensed Partner | Partnership with a licensed Arizona consumer lender or money transmitter may enable compliance |
| UCC Article 9 | A security-interest approach under UCC Article 9 may be viable but requires legal analysis |

---

## 4. Escrow-Backed Contractor Advance Rules

### 4.1 Overview

Arizona has **no specific escrow-backed contractor advance statute**. There is no dedicated regulatory framework governing contractor advances funded through escrow accounts, third-party escrow services, or platform-mediated advances secured by insurance proceeds held in trust. However, several overlapping statutory regimes govern related activities, and an escrow-backed advance product would need to navigate the following regulatory considerations.

### 4.2 Applicable Regulatory Framework

| Statute / Regulation | Relevance to Escrow-Backed Advances |
|---------------------|-------------------------------------|
| **A.R.S. Section 6-601 et seq.** (Consumer Lenders) | If an escrow-backed advance is structured as a loan of $10,000 or less with a finance charge, consumer lender licensing applies. Non-recourse advances without finance charges may fall outside this framework. |
| **A.R.S. Section 6-1201 et seq.** (Money Transmitters) | If escrow involves receiving money for transmission or exchanging into digital form, money transmitter licensing may apply. |
| **A.R.S. Section 32-1158 et seq.** (Contractor Contracts) | All contractor contracts over $1,000 must contain required disclosures. Post-storm contracts have additional requirements (see Section 6). |
| **A.R.S. Section 20-1122.01/20-1122.02** (Assignment of Benefits) | If escrow-backed advance includes assignment of insurance claim proceeds, full AOB compliance is required. |
| **A.R.S. Title 44, Ch. 7** (Arizona Uniform Commercial Code) | Escrow arrangements creating security interests in personal property (including digital assets) must comply with UCC Article 9 perfection requirements. |
| **A.R.S. Section 44-7061** (Blockchain/Smart Contracts) | Smart contract-managed escrow accounts are recognized as electronic records, but do not override licensing requirements. |

### 4.3 Escrow Licensing Requirements

- Arizona **does not have a standalone escrow agent license** for non-real-estate transactions.
- Title insurance escrow agents are regulated under A.R.S. Title 20, Chapter 6, Article 5.
- A general escrow service for contractor advances would fall under other regulatory frameworks (consumer lending, money transmission, or trust company regulation) depending on structure.

### 4.4 Structuring Considerations for Escrow-Backed Advances

| Factor | Consideration |
|--------|---------------|
| **Advance as Non-Recourse** | If structured as a non-recourse purchase of receivables (not a loan), may avoid consumer lender licensing. AG Opinion I22-005 supports non-recourse/no-interest = not a "consumer loan." |
| **Escrow Agent Role** | A neutral third-party escrow agent holding insurance proceeds for disbursement to contractors may not need a specific escrow license but must not engage in money transmission without a license. |
| **Interest / Finance Charge** | Any finance charge triggers consumer lender licensing if $10,000 or less. Advances over $10,000 are exempt from Chapter 5 but still subject to general usury limitations. |
| **Smart Contract Escrow** | A smart contract holding funds in escrow is legally recognized as an electronic record (A.R.S. 44-7061), but automated disbursement logic does not exempt the arrangement from licensing. |
| **Insurance Proceeds as Source** | If repayment comes from insurance proceeds, AOB rules (Section 7) and mortgagee rights (Section 9) must be addressed. |

### 4.5 Required Disclosures for Escrow-Backed Advance Products

Any escrow-backed contractor advance product marketed in Arizona should include:

1. **The escrow agent's identity and role** (neutral third party, not affiliated with contractor or insurer)
2. **The total amount of the advance** and any fees charged
3. **The source of repayment** (insurance proceeds, homeowner funds, or other)
4. **Whether the advance is recourse or non-recourse** against the homeowner
5. **Interest rate or finance charge**, if any (and licensing disclosure if applicable)
6. **Cancellation rights** under applicable contractor law (3-14 days depending on claim size)
7. **Mortgagee notification requirements** if a mortgage exists on the property
8. **Blockchain/smart contract disclosure** if escrow is managed via distributed ledger

### 4.6 SmartContractor Assessment

| Element | Status | Notes |
|---------|--------|-------|
| Escrow-Backed Advance Product | **NO_STATUTE** | No specific Arizona statute authorizes or prohibits escrow-backed contractor advances |
| Consumer Lender License | **REQUIRED_IF** | Required if advance is a loan of $10,000 or less with a finance charge |
| Money Transmitter License | **MAYBE_REQUIRED** | Depends on whether escrow involves transmission/exchange of monetary value |
| AOB Compliance | **REQUIRED_IF** | Required if advance is repaid from assigned insurance proceeds |
| Contractor Licensing | **REQUIRED** | All contractors must hold valid ROC license |
| Smart Contract Escrow | **LEGALLY_RECOGNIZED** | Blockchain-secured escrow recognized but does not override licensing |

**STATUS**: **ESCROW_ADVANCE_UNKNOWN_REQUIRES_COUNSEL_REVIEW**

---

## 5. Insurance Claim Advance Rules

### 5.1 Claim Payment Timing Requirements

| Statute | Requirement |
|---------|-------------|
| **A.R.S. Section 20-462** | Any first-party claim **not paid within 30 days** after receipt of acceptable proof of loss must pay **interest at the legal rate** from the date claim was received. |
| **Scope** | Applies to claims paid directly to the insured, named beneficiary, or provider assigned benefits by the insured. |
| **Exception** | Not applicable to claims denied in good faith within 30 days. |

### 5.2 Unfair Claims Settlement Practices (A.R.S. Section 20-461; Admin. Code R20-6-801)

| Timeline | Requirement |
|----------|-------------|
| 10 working days | Acknowledge receipt of claim OR make payment |
| 10 working days | Reply to pertinent communications from claimant |
| 30 days | Complete investigation of claim (unless cannot reasonably be done) |
| 15 working days | Advise acceptance or denial after receipt of properly executed proofs of loss |
| 45 days | If investigation incomplete, send letter with reasons; repeat every 45 days |
| 30 days (first party) | Notify claimant before statute of limitations / policy time limit expires |

### 5.3 Additional Living Expenses (ALE)

**A.R.S. Section 20-1511(B)** (enacted 2024): A policy may NOT require an insured to provide an **itemized list of lost assets** before receiving ALE coverage for total loss claims or claims rendering property uninhabitable.

ALE coverage typically includes temporary housing, additional transportation, increased food expenses, laundry, pet boarding.

### 5.4 Emergency / Partial Claim Payments

- Arizona does not have a specific statute mandating emergency advance payments on property claims, unlike some states.
- **A.R.S. Section 20-1352**: "Time for payment of claims" — standard policy provision.
- **A.R.S. Section 20-1353**: "Payment of claims" — governs to whom claims are paid.
- Insurers cannot issue partial settlement checks with language releasing total liability (A.R.S. Section 20-461).

### 5.5 Direct Payment to Contractors

| Statute | Provision |
|---------|-----------|
| **A.R.S. Section 32-1158.02(M)** | With policyholder's **written consent**, an insurer may issue its check in the name of **both the policyholder and the contractor** (with contractor's license number noted). |
| **A.R.S. Section 20-1122.01(D)** | Does not prohibit/limit an insured from assigning a **direct payment** to a third party for services/repairs if the insured **notifies the insurer** of the proposed assignment. |

This suggests a pathway for SmartContractor-recommended "direct payment" workflows with insurer notification.

---

## 6. Contractor / Construction Licensing

### 6.1 Arizona Registrar of Contractors (ROC) Licensing

| Requirement | Detail |
|-------------|--------|
| **Who Must Be Licensed** | Any business that contracts or offers to contract to build, alter, repair, add to, subtract from, improve, move, wreck, or demolish any building, highway, road, railroad, excavation, or other structure where labor and materials exceed **$1,000** OR a permit is required (A.R.S. Section 32-1121, 32-1122). |
| **"Handyman Exemption"** | Generally, if labor and materials exceed $1,000 OR a permit is required, a license is required. |
| **Restoration Companies** | Water damage restoration, mold remediation, and reconstruction contractors performing structural work exceeding $1,000 require ROC licensing. |
| **Qualifying Party** | Must have minimum 4 years of verifiable experience, pass SRE exam and trade exam (70% minimum score) (A.R.S. Section 32-1122(F)). |

**Bond Requirements** (varies by classification and volume):
| License Type | Volume | Bond Amount |
|-------------|--------|-------------|
| General Residential | <$750K | $9,000 |
| General Residential | >=$750K | $15,000 |
| Specialty Residential | <$375K | $4,250 |
| Specialty Residential | >=$375K | $7,500 |
| General Commercial | <$150K | $5,000 |
| General Commercial | $150K-$500K | $15,000 |
| General Commercial | $500K-$1M | $25,000 |
| General Commercial | $1M-$5M | $50,000 |
| General Commercial | $5M-$10M | $75,000 |
| General Commercial | >=$10M | $100,000 |

### 6.2 Contract Requirements (A.R.S. Section 32-1158)

All contracts over **$1,000** must contain in writing:
- Contractor name, address, license number
- Owner name, address, jobsite address
- Date of contract, estimated completion date
- Description of work
- Total dollar amount (including taxes)
- Amount of any advance deposit or progress payments
- Notice of right to file complaint with ROC (in **10-point bold type**)
- All changes must be in writing and signed by owner

### 6.3 Post-Storm Residential Repair Additional Requirements (A.R.S. Section 32-1158.02)

Applies to repair/replacement of damage from "catastrophic storm" (wind, rain, flood, etc.):

| Requirement | Detail |
|-------------|--------|
| **Cancellation — Claim Denial** | Statement in **10-point bold type**: "You may cancel this contract within 72 hours after being notified your insurer has denied your claim" |
| **Cancellation — General** | Statement in **10-point bold type**: "You may cancel this contract within 4 business days after signing for any reason" |
| **Repair Estimate** | Copy of repair estimate with detailed damage description |
| **Coverage Disclaimer** | Disclosure that contractor makes no assurances insurance will cover the loss |
| **Down Payment Limit** | No more than **50%** of total contract price |
| **Cancellation Refund** | Within 10 days of cancellation; contractor entitled to reasonable compensation for emergency services |
| **Work Start** | Contractor cannot begin work until insurer approves or denies claim (except emergency work to prevent further loss) (A.R.S. Section 32-1158.02(J)) |
| **Non-Licensed Persons** | Cannot sue homeowners for residential repair work (A.R.S. Section 32-1158.02(K)) |
| **Violation Penalty** | License suspension or revocation (A.R.S. Section 32-1158.02(H)) |

### 6.4 Prohibited Conduct (A.R.S. Section 32-1158.02(L))

- Contractor **shall NOT act on behalf of insured owner in negotiating settlement of a claim** for loss or damage under any insurance policy.
- Contractor **shall NOT make any assurance** that proposed repair will be covered by insurance.
- Contractor MAY communicate with insurer to assist in claim disputes IF: (1) insured owner gives permission, AND (2) contractor is **not compensated** for the communication.

### 6.5 Contractor Financing to Homeowners

- No specific Arizona statute found authorizing or prohibiting contractors from offering financing directly to homeowners.
- If financing involves a consumer loan ($10,000 or less, with finance charge), contractor may need consumer lender license.
- Business-purpose equipment financing for contractors would generally fall outside consumer lending rules.
- **Status**: UNKNOWN_REQUIRES_COUNSEL_REVIEW for contractor-originated financing arrangements.

---

## 7. Assignment of Benefits (AOB)

### 7.1 AOB Status: **HEAVILY REGULATED BUT PERMITTED (Post-Loss)**

Arizona has one of the most detailed AOB statutory frameworks in the United States. Post-loss assignments are expressly protected.

### 7.2 Key Statutes: A.R.S. Sections 20-1122.01 and 20-1122.02

#### For Claims Under $1,500 (A.R.S. Section 20-1122.01)

| Requirement | Detail |
|-------------|--------|
| **Pre-Assignment Filing** | Insured must **file claim with insurer BEFORE** claim can be assigned |
| **Type Size** | Assignee must provide form of assignment agreement with key provisions in at least **12-point type** |
| **Required Disclosures** | Whether insured remains liable for uncovered costs; interest rate assignee will charge if payment delayed >30 days; agreement does not require insured to indemnify assignee; whether assignment authorizes assignee to sue insurer |
| **Rescission Right** | Insured may rescind within **3 business days** after signing |
| **Notice to Insurer** | Assignee must notify insurer within **3 days** after insured signs; provide copy of agreement, description of services, and estimate |
| **Compliance** | Assignee/insured must comply with all policy requirements (proof of loss, duties after loss, inspection, cooperation, appraisal, arbitration) |
| **Inducements Prohibited** | **No gifts, compensation, or inducements** (including deductible waiver) to sign |
| **Emergency Limitation** | If urgent/emergency circumstance, assignee may not receive assignment of post-loss benefits exceeding greater of **$5,000 or 1% of coverage limit** |
| **"Urgent or emergency" Definition** | Situation where loss to property, if not addressed immediately, will result in additional damage |
| **Non-Compliance** | Non-compliant assignment agreements are **VOID** |
| **Damages in Litigation** | Assignee's damages = **fair market value** of covered services/repairs |

#### For Claims $1,500 or More (A.R.S. Section 20-1122.02)

Same basic requirements as under-$1,500 claims, PLUS:

| Additional Requirement | Detail |
|----------------------|--------|
| **Litigation Notice** | If assignment authorizes assignee to sue insurer, must include notice in **14-point bold type** (CAPITAL LETTERS): "YOU ARE AGREEING TO GIVE UP CERTAIN RIGHTS YOU HAVE UNDER YOUR INSURANCE POLICY TO A THIRD PARTY, WHICH MAY RESULT IN LITIGATION AGAINST YOUR INSURER. PLEASE READ AND UNDERSTAND THIS DOCUMENT BEFORE SIGNING IT. YOU HAVE THE RIGHT TO CANCEL THIS AGREEMENT WITHOUT PENALTY WITHIN 14 DAYS AFTER THE DATE THIS AGREEMENT IS EXECUTED. HOWEVER, YOU MAY BE OBLIGATED TO PAY FOR ANY CONTRACTED WORK THAT WAS PERFORMED BEFORE THE AGREEMENT IS RESCINDED. THIS AGREEMENT DOES NOT CHANGE YOUR OBLIGATION TO PERFORM THE DUTIES THAT ARE REQUIRED UNDER YOUR PROPERTY INSURANCE POLICY." |
| **Rescission Right** | 14 days after execution, OR 30 days after scheduled work begin date if assignee has not substantially performed |
| **Waiver of Claims** | Assignee's acceptance waives claims against insured assignor for amounts beyond deductible/cost-sharing, amounts insurer pays directly to insured, and charges for services beyond necessary repairs |
| **Prohibited Collection Practices** | Assignee cannot collect from insured, maintain actions against insured, claim a lien on real property, or report insured to credit agency for payments other than agreed cost-sharing |

### 7.3 Post-Loss Assignment Protection

| Provision | Detail |
|-----------|--------|
| **A.R.S. Section 20-461(A)(7)** | It is an unfair claim settlement practice for a property/casualty insurer to **fail to recognize a valid assignment of a claim** after a loss has occurred. The insurer retains all policy defenses but may not otherwise restrict post-loss assignment. |
| **Case Law** | *Farmers Ins. Exchange v. Udall* (Ariz. Ct. App. 2018) — valid post-loss assignments of breach of contract claims to contractors; assignee stands in shoes of insured. |
| **Anti-Assignment Clauses** | Policy anti-assignment clauses are **NOT enforceable for post-loss assignments** in Arizona. Post-loss assignments are of a "chose in action" (claim under the policy), not of the policy itself. |

### 7.4 SmartContractor Implications

AOB is **permitted but heavily regulated**. SmartContractor cannot simply facilitate standard AOBs without full compliance with the detailed statutory requirements. The emergency $5,000/1% limitation may constrain AOB-based claim advances for emergency mitigation work. The 14-point bold type notice, 14-day rescission window, and specific disclosure requirements must be built into any AOB workflow.

---

## 8. Public Adjuster / Claim Representation Rules

### 8.1 Licensing Requirements

| Requirement | Detail |
|-------------|--------|
| **Definition** (A.R.S. Section 20-321) | "Adjuster" = any person who for compensation adjusts, investigates, or negotiates settlement of claims arising under property/casualty insurance contracts on behalf of insurer OR insured. |
| **Eligibility** (A.R.S. Section 20-321.01) | Must be at least 18 years of age; Arizona resident (or resident of state that reciprocates); pass exam (unless licensed in home state with reciprocity); submit to background check. |
| **Office Requirement** | Public adjusters must maintain an office accessible to the public in Arizona. |

### 8.2 Exclusions from Adjuster Licensing

- Licensed attorneys
- Salaried employees of insurers
- Licensed insurance producers (for losses under policies they sold)
- Independent contractors retained by licensed adjuster for technical assistance (photography, estimation, engineering)
- Government officials performing official duties

### 8.3 Contractor Prohibition

| Statute | Prohibition |
|---------|-------------|
| **A.R.S. Section 32-1158.02(L)** | A contractor providing post-storm repair services **shall not act on behalf of an insured owner in negotiating for the settlement of a claim** for loss or damage under any insurance policy. |
| **Compensated Communication** | A contractor shall not make any assurance that proposed repairs will be covered by insurance. A contractor MAY communicate with insurer to assist in claim disputes IF: (1) insured gives permission, AND (2) contractor is **not compensated** for the communication. |
| **SB 1206 (2024)** | Additional prohibitions on adjusters: Cannot propose to insured that adjuster represents insured while loss-producing occurrence is continuing or public safety services are engaged; cannot participate in restoration/reconstruction/repair of damaged premises that is subject of claim they adjusted; cannot endorse payment instruments issued to insured without insured's direct endorsement and signature. |

### 8.4 SmartContractor Implications

**SmartContractor and its contractor partners MUST NOT negotiate claims** on behalf of homeowners. SmartContractor can facilitate communication between contractor and insurer, but only if:
- Homeowner explicitly gives permission
- SmartContractor/contractor is not compensated for the communication/negotiation activity

SmartContractor should consider building a clear firewall between claim facilitation and claim negotiation. Any claim negotiation/advocacy function should be performed only by licensed public adjusters or attorneys.

---

## 9. Mortgage / Loss Draft / Escrow Rules

### 9.1 Standard Mortgagee Protections

- Homeowner's insurance policies typically include a "standard mortgage clause" naming the lender/mortgagee as additional insured and loss payee.
- Covered losses are payable to mortgagees "to the extent of their interest and in the order of precedence."
- The mortgage clause protects the mortgagee's interest even if the insured has committed acts that might void coverage (increase in hazard, criminal acts, failure to preserve property, etc.).

### 9.2 Loss Draft / Claim Check Handling

Where a mortgage exists, insurance companies typically issue claim checks jointly to the **insured homeowner AND the mortgagee/lender**. The lender/servicer then manages disbursement of funds for repairs:

| Loan Status | Fannie Mae/Freddie Mac Disbursement Guidelines |
|-------------|-----------------------------------------------|
| **Current loans** | Initial disbursement up to greater of $40,000, 33% of proceeds, or amount exceeding UPB + accrued interest |
| **Delinquent loans (31+ days)** | More restrictive disbursement, evaluation for workout |
| **Multiple disbursements** | Require inspection of repair progress |

**A.R.S. Section 20-462(D)**: Timely payment statute applies to claims paid directly to insured, beneficiary, or provider assigned benefits.

### 9.3 Mortgagee Consent for Assignment

Assignment of benefits does **not override** mortgagee rights to claim proceeds. Any SmartContractor workflow involving claim proceeds must account for mortgagee/lender interest. If claim proceeds are subject to a mortgagee clause, the mortgagee's consent may be required for assignment of those proceeds.

---

## 10. Dashboard Rules

```json
{
  "state": "AZ",
  "state_name": "Arizona",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Arizona is crypto-friendly (A.R.S. 44-7061 recognizes blockchain/smart contracts; fintech sandbox available through 2028), but no specific statute addresses token collateral for loans. Money transmitter license required for crypto-fiat exchanges. Consumer lender license required for 3+ closed-end loans/year of $10K or less. Closed-end loans over $10K are exempt from consumer lender requirements. Fintech sandbox may provide 24-month testing pathway. Token collateral lock, liquidation, and repayment routing via smart contract have NO explicit statutory authorization. Legal review required before any pilot."
  },
  "claimbridge": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Arizona permits post-loss AOB with extensive statutory requirements (A.R.S. 20-1122.01, 20-1122.02). 12-point type minimum for disclosures; 14-point bold type for litigation authorization; 14-day rescission for claims $1,500+; 3-day rescission for claims under $1,500; $5,000/1% emergency cap. Contractors CANNOT negotiate claims on behalf of insureds (A.R.S. 32-1158.02(L)). Direct payment to contractor possible with insured written consent and insurer notification. 30-day payment deadline or interest accrues (A.R.S. 20-462). No statute mandating emergency advance payments specifically. ALE coverage cannot be conditioned on itemized asset list for total loss claims (A.R.S. 20-1511(B)). All AOB and claim advance functions require legal review and counsel-approved forms."
  },
  "escrow_backed_advance": {
    "status": "NO_STATUTE_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["escrow_advance_live_deploy"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Arizona has no specific escrow-backed contractor advance statute. Product would need to navigate consumer lender licensing (if loan under $10K with finance charge), money transmitter licensing (if transmission involved), AOB compliance (if repaid from insurance proceeds), UCC Article 9 (if security interest in personal property), and contractor licensing requirements. Non-recourse advance without finance charge may fall outside consumer lender licensing per AG Opinion I22-005. Smart contract escrow recognized under A.R.S. 44-7061 but does not override licensing. Neutral third-party escrow agent role may not require specific escrow license for non-real-estate transactions. Full legal review required before any pilot."
  },
  "contractor_flow_status": "LEGAL_REVIEW_REQUIRED - Contractor may participate in SmartContractor platform but CANNOT negotiate insurance claims or assure coverage. All storm-damage contracts require specific disclosures (A.R.S. 32-1158.02). Down payment limited to 50%. Must hold valid ROC license and bond.",
  "homeowner_flow_status": "LEGAL_REVIEW_REQUIRED - Homeowners may assign post-loss benefits with full statutory compliance. Cancellation rights (3-14 days depending on claim size). Cannot be required to provide itemized asset list before ALE for total loss. Must be notified of all assignment implications in required font sizes.",
  "restoration_company_flow_status": "LEGAL_REVIEW_REQUIRED - Restoration companies must be ROC-licensed for structural work >$1,000. IICRC certification is industry standard but not state-mandated. Cannot negotiate claims. Can communicate with insurer only with homeowner permission and without compensation for communication. Must include all required contract disclosures."
}
```

---

## 11. Required Disclosures

### Disclosure 1: General SmartContractor Platform Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

[SmartContractor] is a technology platform that connects homeowners with licensed
contractors and facilitates information sharing with insurance companies. [SmartContractor] is not
a licensed insurance adjuster, public adjuster, insurance agent, or attorney. [SmartContractor] does
not negotiate insurance claims on your behalf.

Any communication between [SmartContractor] or its contractor partners and your insurance company
is done only with your express written permission and for informational purposes only.
We do not receive compensation for communicating with your insurance company.

For residents of Arizona: You have the right to negotiate your insurance claim directly
with your insurer or to hire a licensed public adjuster or attorney to represent you.
```

### Disclosure 2: Escrow-Backed Advance Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

[SmartContractor] offers escrow-backed advances for contractor services. This product involves
a neutral third-party escrow agent holding funds for disbursement to licensed contractors.

KEY TERMS:
- The total amount of your advance: [AMOUNT]
- Any fees charged: [FEES]
- The source of repayment: [INSURANCE PROCEEDS / HOMEOWNER FUNDS / OTHER]
- Whether this advance is recourse or non-recourse: [RECOURSE / NON-RECOURSE]
- Interest rate or finance charge, if any: [RATE]
- Cancellation rights: [3-14 DAYS DEPENDING ON CLAIM SIZE]

If a mortgage exists on your property, your mortgagee may have rights to insurance proceeds
that could affect this advance. Your mortgagee may need to be notified and may need to consent
to any assignment of claim proceeds.

If this advance is repaid from insurance proceeds, additional Assignment of Benefits
requirements may apply. You will receive all required disclosures before signing.

If your transaction involves a loan of $5,000 or less and the lender is not properly licensed
in Arizona, the loan may be VOIDABLE under A.R.S. Section 6-613.
```

### Disclosure 3: Assignment of Benefits Disclosure (For Claims $1,500+)
```
COUNSEL_APPROVED_TEXT_REQUIRED

This document must be printed in at least 12-point type (and 14-point bold capital letters
for the litigation notice section).

YOU ARE AGREEING TO GIVE UP CERTAIN RIGHTS YOU HAVE UNDER YOUR INSURANCE POLICY TO A
THIRD PARTY, WHICH MAY RESULT IN LITIGATION AGAINST YOUR INSURER. PLEASE READ AND
UNDERSTAND THIS DOCUMENT BEFORE SIGNING IT. YOU HAVE THE RIGHT TO CANCEL THIS AGREEMENT
WITHOUT PENALTY WITHIN 14 DAYS AFTER THE DATE THIS AGREEMENT IS EXECUTED. HOWEVER, YOU
MAY BE OBLIGATED TO PAY FOR ANY CONTRACTED WORK THAT WAS PERFORMED BEFORE THE AGREEMENT
IS RESCINDED. THIS AGREEMENT DOES NOT CHANGE YOUR OBLIGATION TO PERFORM THE DUTIES THAT
ARE REQUIRED UNDER YOUR PROPERTY INSURANCE POLICY.

[Additional required disclosures in 12-point type:]
- Whether you remain liable for any costs not covered by your insurance policy
- The interest rate, if any, that will be charged if payment is delayed more than 30 days
- This agreement does not require you to indemnify the assignee against any claims arising
  out of services or repairs provided
- Whether this agreement authorizes the assignee to sue your insurer on your behalf
- You have the right to rescind this agreement without fee or penalty within 14 days of
  execution, or 30 days after the scheduled work begin date if work has not substantially
  begun
```

### Disclosure 4: Token Collateral / Digital Asset Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

[SmartContractor] uses blockchain-based smart contracts to secure certain transactions. Arizona law
recognizes blockchain-secured signatures and smart contracts as legally valid (A.R.S.
Section 44-7061). However, the use of digital assets as collateral for loans involves
novel legal and regulatory considerations that are not specifically addressed by Arizona
statute.

YOU SHOULD CONSULT WITH YOUR OWN LEGAL AND FINANCIAL ADVISORS BEFORE USING DIGITAL
ASSETS AS COLLATERAL. The value of digital assets can fluctuate significantly. In the
event of liquidation, you may lose your collateral. [SmartContractor] is not a bank, credit union,
or licensed financial institution in Arizona.
```

### Disclosure 5: Contractor Non-Representation Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

[Contractor name and ROC license number] is a licensed Arizona contractor. We do NOT
negotiate insurance claims on your behalf. We do NOT assure you that any proposed repair
or replacement will be covered by your insurance policy. You are responsible for payment
for all work performed, including any amounts not covered by your insurance.

If your insurer denies all or part of your claim, you remain responsible for payment of
all work performed. You have the right to cancel this contract within 72 hours of being
notified of your insurer's claim denial, or within 4 business days of signing for any
reason. Any cancellation must be in writing.
```

### Disclosure 6: Finance Charge / Lending Disclosure
```
COUNSEL_APPROVED_TEXT_REQUIRED

If your transaction involves a loan or financing arrangement:
- The total amount financed
- The finance charge (annual percentage rate)
- The total number of payments and amount of each payment
- Any fees or charges allowed under Arizona law
- Your right to prepay without penalty

If the original principal amount is $5,000 or less and the lender is not properly licensed
in Arizona, the loan may be VOIDABLE under A.R.S. Section 6-613.
```

---

## 12. Smart Contract Implications

| Function | Status | Notes |
|----------|--------|-------|
| Block live loan creation | **TRUE** | Pending legal review of lending license requirements and token collateral status |
| Block token collateral lock | **TRUE** | No explicit statutory authorization for automated token collateral lock in Arizona; legal review required |
| Block liquidation | **TRUE** | Automated liquidation of token collateral not addressed by Arizona statute; legal review required |
| Block assignment of claim proceeds | **TRUE** | AOB permitted but requires strict compliance with A.R.S. 20-1122.01/20-1122.02; counsel-approved forms required |
| Block escrow-backed advance | **TRUE** | No specific escrow-backed contractor advance statute; legal review required |
| Block repayment routing from insurance proceeds | **TRUE** | Repayment routing must account for mortgagee rights, AOB requirements, and contractor negotiation prohibitions |
| Allow demo-only records | **TRUE** | Demonstration/mockup mode permitted for platform development and testing |
| Allow hash/reference-only audit records | **TRUE** | Arizona recognizes blockchain records as electronic records (A.R.S. 44-7061); hash-only audit trails may be used for recordkeeping |

### Specific Smart Contract Considerations for Arizona

- **A.R.S. Section 44-7061** provides a statutory basis for recognizing smart contract terms, but does not override other licensing/registration requirements.
- Smart contracts may be used for **recordkeeping, audit trails, and document verification** without restriction.
- Smart contracts involving **automated lending decisions, collateral liquidation, escrow-backed advances, or claim payment routing** must be reviewed by Arizona-licensed counsel.
- The **fintech sandbox** (through July 2028) may provide a 24-month testing window for innovative smart contract-based financial products.
- **Multi-signature requirements**: Consider requiring homeowner, contractor, and (if applicable) mortgagee signatures for any claim proceeds disbursement.

---

## 13. Official Sources

| Source | URL |
|--------|-----|
| Arizona Dept. of Insurance & Financial Institutions (DIFI) | https://difi.az.gov |
| Arizona Registrar of Contractors (ROC) | https://roc.az.gov |
| AZ Legislature — A.R.S. Title 6 Ch. 5 (Consumer Lenders) | https://www.azleg.gov/arsDetail/?title=6 |
| AZ Legislature — A.R.S. Title 20 (Insurance) | https://www.azleg.gov/arsDetail/?title=20 |
| AZ Legislature — A.R.S. Section 44-7061 (Blockchain) | https://www.azleg.gov/ars/44/07061.htm |
| AZ Legislature — A.R.S. Title 32 Ch. 10 (Contractors) | https://www.azleg.gov/arsDetail/?title=32 |
| HB 2441 (2020) — AOB Statute | https://www.azleg.gov/legtext/54leg/2r/bills/hb2441p.htm |
| AZ Fintech Sandbox Program (AG Office) | https://www.azag.gov/consumer/sandbox |
| NIPR — Arizona Licensing | https://nipr.com/licensing-center |
| Arizona Administrative Code R20-6-801 | https://www.law.cornell.edu/regulations/arizona/Ariz-Admin-Code-SS-R20-6-801 |
| Arizona AG — Earned Wage Access Opinion I22-005 | https://www.azag.gov/opinions/i22-005-r22-011 |
| HB 2749 (2025) — Digital Assets | https://www.azleg.gov/legtext/57leg/1r/laws/0150.htm |
| DIFI Regulatory Bulletin 2025-04 | https://www.ilsainc.com/bulletin/ |
| Arizona ROC Statute & Rules Book (2024) | https://roc.az.gov/sites/default/files/2024-09/2024%20Statute%20and%20Rules%20Book.pdf |

---

## 14. Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **MEDIUM** | Consumer lender licensing required for 3+ loans/year of $10K or less; loans over $10K exempt; money transmitter license for crypto-fiat. Clear statutory framework. Penalties for unlicensed lending are severe (voidable loans). Business-purpose loans and non-recourse advances may have pathways but require legal review. |
| Insurance Claim Risk | **MEDIUM** | 30-day payment rule with interest penalty; unfair claims practices act with specific timelines; ALE protections. No specific emergency advance mandate. Contractor involvement heavily restricted. Mortgagee/loss draft procedures add complexity. Claim advance products require careful legal structuring. |
| AOB Risk | **MEDIUM** | AOB is permitted with extensive statutory requirements. Detailed disclosure, font-size, rescission, and litigation notice requirements. Emergency $5,000/1% cap. Non-compliance voids the agreement. The statutory framework is clear but complex; compliance is achievable with proper legal drafting. |
| Public Adjuster Risk | **HIGH** | Arizona strictly prohibits contractors and non-licensed persons from negotiating insurance claims on behalf of insureds. Violation = contractor license suspension/revocation. SmartContractor must build robust firewalls to prevent any platform activity from being characterized as unauthorized adjusting. This is the highest-risk category for SmartContractor. |
| Token Collateral Risk | **MEDIUM** | Arizona is crypto-friendly and recognizes blockchain/smart contracts, but no specific statute addresses token collateral for loans. Money transmitter licensing for fiat-crypto exchanges. Fintech sandbox provides potential testing pathway. Uncertainty is moderate — the state's innovation-friendly posture helps, but legal review is essential. |
| Escrow-Backed Advance Risk | **MEDIUM-HIGH** | No specific statute addresses escrow-backed contractor advances. Multiple overlapping regulatory regimes may apply (consumer lending, money transmission, AOB, UCC Article 9). Non-recourse structure without finance charge may avoid licensing, but this requires legal confirmation. The lack of clear statutory guidance creates uncertainty. |
| Consumer Protection Risk | **MEDIUM** | Strong contractor disclosure requirements (10-point bold type); 50% down payment limit; 3-14 day cancellation rights; ROC enforcement active. Unfair Claims Settlement Practices Act applies. Consumer Fraud Act enforced by AG. Fintech sandbox participants must comply with all consumer protection laws. |

---

*This compliance file was prepared for research and informational purposes only. It does not constitute legal advice. All SmartContractor product features must be reviewed by Arizona-licensed counsel before deployment. All statutory citations should be verified against current law as of the date of use.*

*File prepared: 2025*
*Research sources: Official Arizona statutes, DIFI, ROC, AG opinions, case law as cited.*
