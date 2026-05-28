# Michigan (MI) — SmartContractor Compliance File

> **Research Date:** 2025-06-25
> **Status:** ACTIVE — Research complete; pending legal review for token-collateral and claim-advance features
> **Primary Regulator:** Michigan Department of Insurance and Financial Services (DIFS) — [michigan.gov/difs](https://michigan.gov/difs)
> **Secondary Regulator:** Michigan Department of Licensing and Regulatory Affairs (LARA) — contractor licensing

---

## 1. State Overview & Regulatory Summary

### 1.1 One-Line Verdict
Michigan is a **HIGH-REGULATION** state for consumer financial services. The Consumer Financial Services Act imposes a **25% usury cap on loans under $1,000** unless the lender is licensed (MCL 438.31). Contractor licensing is administered by LARA. Post-loss Assignment of Benefits (AOB) is **allowed** for property insurance, though the 2019 reforms (SB 1 / Public Act 21) created a regulated AOB framework—primarily for auto no-fault insurance, not property claims. Public adjuster licensing is **strict**: 10% fee cap, DIFS-approved contracts required, and public adjusters **cannot** be connected with fire repair contractors (MCL 500.1224). Michigan DIFS may regulate escrow activities touching insurance or financial services. Token collateral has **no clear regulatory framework** under Michigan law.

### 1.2 Risk Tiers at a Glance

| Product Tier | Status | Key Blocker |
|---|---|---|
| Token-collateral equipment credit | UNKNOWN / BLOCKED | No DIFS guidance on digital assets; MTSA/CFSA licensing unclear |
| ClaimBridge (AOB-backed advance) | LEGAL REVIEW REQUIRED | Must avoid unauthorized public adjusting; adjuster/contractor separation |
| Escrow-backed contractor advance | NEW — LEGAL REVIEW REQUIRED | DIFS escrow authority; must structure outside public-adjuster prohibitions |
| Contractor payment flow | LEGAL REVIEW REQUIRED | LARA licensing for projects ≥$600; verify licensed status |

### 1.3 Top 5 Rules That Could Kill the Product
1. **25% usury cap** on unlicensed loans under $1,000 (MCL 438.31) — any advance product must stay under this rate or obtain a Consumer Financial Services license.
2. **Consumer Financial Services Act licensing** (MCL 487.2051 et seq.) — may require a Class I or II license with a $500,000 surety bond if making regulated consumer loans.
3. **Money Transmitter licensing** (MCL 487.101 et seq.) — receiving funds for transmission could trigger MTSA if GCSC holds or routes claim proceeds.
4. **Public adjuster cannot advance money to insureds** (MCL 500.1227) — if GCSC is deemed to be facilitating claim adjustment, advancing funds during a claim is prohibited conduct.
5. **Public adjuster / fire repair contractor separation** (MCL 500.1224) — any GCSC partner that is a public adjuster cannot be connected with a GCSC-affiliated repair contractor.

---

## 2. Licensing & Regulator Directory

### 2.1 Key Regulators

| Agency | Role | Contact / URL |
|---|---|---|
| **Michigan DIFS** — Office of Consumer Finance | Consumer lending, money transmission, escrow oversight | [michigan.gov/difs/industry/con-finance-mortgage](https://www.michigan.gov/difs/industry/con-finance-mortgage) |
| **Michigan DIFS** — Insurance Division | Public adjuster licensing, AOB regulation (insurance claims), insurance fraud | [michigan.gov/difs/industry/licensing-ins](https://www.michigan.gov/difs/industry/licensing-ins) |
| **Michigan LARA** — Bureau of Professional Licensing | Residential builder & M&A contractor licensing | [michigan.gov/lara](https://www.michigan.gov/lara) |
| **Michigan DIFS** — Consumer Hotline | Complaints, fraud reporting | 877-999-6442 / [michigan.gov/ReportFraud2DIFS](https://michigan.gov/ReportFraud2DIFS) |

### 2.2 License Types Relevant to GCSC

| License | Statute | Bond / Net Worth | Renewal |
|---|---|---|---|
| Consumer Financial Services — Class I | MCL 487.2051 et seq. | $500,000 surety bond or LOC | Annual (Dec 31) |
| Consumer Financial Services — Class II | MCL 487.2051 et seq. | $500,000 surety bond or LOC | Annual (Dec 31) |
| Money Transmitter | MCL 487.101 et seq. | $500K + $10K/additional location, max $1.5M | Annual (Dec 1) |
| Regulatory Loan License | MCL 493.1 et seq. | Via NMLS | Annual |
| Residential Builder (LARA) | PA 299 of 1980, Art. 24 | $100K GL insurance | Triennial |
| Public Adjuster ("Adjuster for the Insured") | MCL 500.1222 et seq. | Exam + character requirements | Biennial |

### 2.3 Escrow Oversight
The Michigan Department of Insurance and Financial Services **may regulate escrow** activities that involve insurance claim proceeds or consumer financial services. Escrow agents handling insurance-related funds should verify whether DIFS registration or licensure is required based on the specific escrow structure.

---

## 3. Lending / Finance Licensing

### 3.1 Consumer Financial Services Act (CFSA)
- **Statute:** 1988 PA 161, MCL 487.2051 et seq.
- **Regulator:** Michigan DIFS — Office of Consumer Finance
- **Scope:** Covers consumer financial services including lending, sale of checks, and money transmission–adjacent activities
- **Class I License:** Authorizes all activities under any financial licensing act (most comprehensive)
- **Class II License:** Same as Class I except excludes sale of checks, certain secondary mortgage activities, and mortgage broker/lender/servicer activities
- **Minimum Bond:** $500,000 surety bond or letter of credit
- **Late Fee:** $25/day, capped at $1,000
- **Renewal:** Annual, expires December 31

### 3.2 25% Usury Cap (CRITICAL)
- **Statute:** MCL 438.31
- **Rule:** Loans under **$1,000** cannot carry an interest rate exceeding **25% per annum** unless the lender holds a **license** under the Consumer Financial Services Act or the Regulatory Loan Act
- **Implication for GCSC:** Any contractor advance product with an APR ≥25% on advances under $1,000 **must** be originated by a licensed entity, or the rate must stay below 25%. COUNSEL REVIEW REQUIRED to structure compliant rate tiers.

### 3.3 Money Transmission Services Act (MTSA)
- **Statute:** 2006 PA 250, MCL 487.1001 et seq.
- **Required for:** Selling/issuing payment instruments, prepaid access, or receiving money or monetary value for transmission
- **Bond:** $500,000 first location + $10,000 per additional location, max $1,500,000
- **Net Worth:** Minimum $100,000 ($25,000 per additional location, up to $1M max)
- **Key Definition:** "Money" means **government-authorized currency** — does NOT explicitly include virtual currency
- **Renewal:** Due December 1 annually

### 3.4 Exemptions to Consider
- MTSA does **not** apply if activity is strictly limited to currency exchange
- Various exemptions under Section 4 of the MTSA
- Depository financial institutions (banks, credit unions) are exempt from CFSA/MTSA
- Commercial/business-purpose loans may fall outside CFSA if **truly** business-purpose — must carefully document business purpose
- **COUNSEL REVIEW REQUIRED** to determine if GCSC's contractor financing structure qualifies for a commercial-lending exemption

---

## 4. Escrow-Backed Contractor Advance Rules (NEW)

> **Section Status:** NEW — Michigan-specific escrow analysis for contractor advance products. This section addresses the regulatory framework for holding and disbursing contractor advance funds through an escrow or trust mechanism.

### 4.1 Escrow Oversight in Michigan
- The **Michigan Department of Insurance and Financial Services** may regulate escrow activities that intersect with insurance claim proceeds or consumer financial services.
- There is **no standalone state-level escrow statute** of general application comparable to some other states; escrow arrangements are typically governed by:
  - The **Michigan Trust Code** (MCL 700.7101 et seq.) if structured as a trust
  - **Contract law** principles under Michigan common law
  - DIFS regulations if the escrow involves insurance proceeds or regulated financial services

### 4.2 Escrow-Backed Advance Structure
An escrow-backed contractor advance product would operate as follows:
1. **Funding Source** (GCSC or capital partner) deposits advance funds into a **dedicated escrow account**
2. **Escrow Agent** (GCSC or third party) holds funds subject to draw conditions
3. **Contractor** submits proof of completion / milestones to trigger disbursement
4. **Homeowner** (or insurer, via AOB) provides repayment through claim proceeds or other sources

### 4.3 Licensing Triggers for Escrow Activities

| Activity | Likely Trigger | Notes |
|---|---|---|
| Holding insurance claim proceeds in escrow | DIFS oversight / possible MTSA | If GCSC receives claim proceeds for transmission to contractors, MTSA analysis required |
| Holding homeowner funds for contractor disbursement | CFSA / possible trust company rules | If funds are "monetary value" held for transmission, MTSA may apply |
| Acting as escrow agent for construction draws | LARA-adjacent; not directly licensed | No specific escrow-agent license found in Michigan, but trust company or CFSA licensing may apply depending on structure |
| Disbursing funds based on inspection milestones | Consumer protection / UDAP | Must have clear, written escrow agreements |

### 4.4 Michigan-Specific Escrow Requirements
- **Written Escrow Agreement Required:** Michigan follows common-law escrow principles: a valid escrow requires a clear written agreement defining the parties, the res (funds), conditions for release, and the escrow agent's duties.
- **Segregation of Funds:** Escrowed funds must be held in a segregated account, separate from the escrow agent's operating funds.
- **Fiduciary Duty:** The escrow agent owes a fiduciary duty to both parties (depositor and beneficiary/contractor).
- **Interest on Escrow:** Michigan does not mandate interest on escrowed funds unless the escrow agreement provides for it.

### 4.5 Prohibited Conduct — Public Adjuster Context
- **MCL 500.1227(2):** A public adjuster **cannot loan or advance money or collateral to an insured** during the claim adjustment process.
- **Implication:** If the escrow-backed advance is facilitated by or through a public adjuster partner, the advance itself may constitute prohibited conduct. The advance must be structurally separated from any licensed public adjuster activity.
- **Workaround:** Structure the advance as a **commercial transaction between GCSC (or its lending partner) and the contractor**, with the homeowner's obligation to repay arising independently of the insurance claim. Do not tie the advance disbursement to the public adjuster's claim activities.

### 4.6 Escrow + AOB Combination
If the homeowner executes an AOB assigning claim proceeds to GCSC or the contractor:
- The escrow agent may receive insurance claim checks directly if the AOB so provides
- **Mortgagee / loss draft rules apply** (see Section 9): mortgage servicers listed as co-payee will still require endorsement and may impose their own escrow requirements
- The AOB must be in **writing** under Michigan's statute of frauds (MCL 566.132)

### 4.7 Recommended Escrow Structure for GCSC
1. **Escrow Agent:** Use a Michigan-licensed financial institution or attorney as escrow agent where possible; alternatively, GCSC may act as escrow agent if no licensing trigger applies.
2. **Escrow Agreement:** Must specify:
   - Purpose (contractor advance for construction services)
   - Conditions precedent for each draw (milestone-based)
   - Inspection requirements
   - Dispute resolution mechanism
   - Interest disposition
   - Duration / sunset clause
3. **Rate Compliance:** Ensure the effective cost to the homeowner/contractor does not exceed the 25% usury cap on amounts under $1,000 unless a licensed entity is the lender of record.
4. **Separation:** Maintain clear structural separation between escrow disbursement decisions and any public adjuster's claim negotiation activities.

### 4.8 COUNSEL REVIEW CHECKLIST
- [ ] Does holding and disbursing contractor advance funds trigger MTSA licensing?
- [ ] Does the escrow structure require CFSA Class I/II licensing based on the source of funds?
- [ ] Is the advance structured to avoid public-adjuster prohibitions under MCL 500.1227(2)?
- [ ] Are escrow agreements compliant with Michigan common-law requirements?
- [ ] Does DIFS require notification or registration of the escrow activity?

---

## 5. Contractor Licensing & Requirements

### 5.1 LARA Licensing — Residential Builders
- **Threshold:** Projects **$600 or more** require licensing
- **License Types:**
  - **Residential Builder** — new construction, alteration, repair of residential structures
  - **Maintenance & Alteration (M&A) Contractor** — specific trades (carpentry, concrete, excavation, etc.)
- **Administrator:** LARA — Bureau of Professional Licensing
- **Requirements:**
  - 60 hours pre-licensure education
  - Pass state examination
  - Good moral character
  - Minimum **$100,000 general liability insurance** per occurrence (MCL 339.2412)
- **Renewal:** Triennial (3-year cycle)
- **Continuing Education:** Required for renewal

### 5.2 Home Improvement Finance Act
- **Statute:** 1965 PA 332, MCL 445.1101 et seq.
- Regulates financing of home improvement contracts (installment sales)
- Contractors may offer financing under this act with proper disclosures
- **COUNSEL REVIEW REQUIRED** to determine applicability to GCSC's contractor financing model

### 5.3 Retail Installment Sales Act
- **Statute:** 1966 PA 224, MCL 445.851 et seq.
- Regulates retail installment sales generally
- Applies to goods and services sold on installment
- Disclosure requirements for finance charges, terms

### 5.4 Key Restriction: Public Adjuster / Contractor Separation
- **MCL 500.1224:** A public adjuster **CANNOT** be employed by, own stock in, be an officer/director of, or be connected with a **fire repair contractor**
- **MCL 500.1227(2):** A public adjuster cannot collect or attempt to collect a fee from a repair contractor for obtaining repair work
- **Implication:** GCSC cannot facilitate a relationship where a public adjuster partner and a contractor partner are the same entity, under common ownership, or have interlocking directors/officers

### 5.5 Consumer Protection Exemption
- Residential builders are **exempt** from the Michigan Consumer Protection Act per Michigan Supreme Court ruling (2007)
- General consumer protection and UDAP principles still apply under other statutes

---

## 6. Assignment of Benefits (AOB)

### 6.1 AOB Status: **ALLOWED** for Property Insurance
- Michigan **allows** post-loss assignment of insurance claims
- Anti-assignment clauses in insurance policies are **NOT enforceable** for post-loss assignments under Michigan law
- Controlling authority: *Roger Williams Insurance Company v. Carrington*, 43 Mich. 252 (1880) (Michigan Supreme Court)
- Post-loss assignment treated as assignment of an accrued cause of action
- **Writing required** under Michigan statute of frauds (MCL 566.132)

### 6.2 2019 AOB Reforms
- **Public Act 21 of 2019 (SB 1):** Reformed Michigan's auto no-fault insurance system
- The 2019 reforms applied **ONLY to auto no-fault (PIP) insurance**, NOT to property insurance AOBs
- Michigan **now regulates AOB** in the auto context — but property insurance AOBs remain governed by common law
- No property insurance AOB reforms have been enacted as of the research date

### 6.3 What Michigan Does NOT Have (Florida-Style Restrictions)
- No AOB prohibition for post-loss property claims
- No mandatory 14-day / 30-day AOB rescission periods for property insurance
- No required font-size / signature rules for property AOBs
- No limitations on attorney fee assignments for property claims
- No prohibitions on AOBs for policies issued after a certain date

### 6.4 Practical Considerations for GCSC
- AOB gives assignee (contractor) authority to file claim, negotiate, and collect payment
- Policyholder still has contractual relationship with contractor
- AOB is a legally binding contract
- GCSC facilitating AOBs should ensure proper documentation
- **AOB for payment collection** is legally distinct from **claims negotiation / representation** — the latter requires a public adjuster license

### 6.5 Caution
- GCSC must **NOT** facilitate unauthorized public adjusting
- Any negotiation with insurance companies on behalf of insureds requires proper public adjuster licensing
- AOB for payment collection is permissible; claims representation is not without a license

---

## 7. Public Adjuster & Claims Representation

### 7.1 Licensing Requirement
- **"Adjuster for the Insured"** (public adjuster) license required to represent insureds in claims
- Regulated by **Michigan DIFS** under MCL 500.1222 et seq.
- Must pass examination, meet character requirements
- Renewal every 2 years

### 7.2 Fee Limitations
- **Maximum fee: 10% of amount paid in settlement by insurer** (MCL 500.1226)
- Applies to all payments in resolution of claim (judgment, mediation, arbitration, etc.)
- Fee must be specified in written contract

### 7.3 Contract Requirements
- **Must use DIFS-approved contract form** (MCL 500.1226(4))
- Contract form cannot be altered except to insert adjuster's name/contact info
- Fillable fields must be completed by computer
- Current approved form: Residential Public Adjusting Contract (Rev. 03-2019)
- Effective May 15, 2019; mandatory by June 30, 2019

### 7.4 Cancellation Rights
1. **Home Solicitation Sales Act:** 3 business days to cancel if contract solicited at homeowner's residence — **NO PAYMENT REQUIRED**
2. **Michigan Insurance Code (MCL 500.1226(4)):** If contract signed within 48 hours of loss, insured may void within 10 days — **NO PAYMENT REQUIRED**
3. **General rule:** Contract can be canceled at any time, but adjuster entitled to payment for work performed up to cancellation

### 7.5 Prohibited Activities (MCL 500.1227)
Public adjusters **CANNOT**:
- Employ unlicensed persons to help adjust losses
- Represent themselves as insurance company representatives, fire investigators, or fire department connected
- **Be employed by, own stock in, be officer/director of, or be connected with a fire repair contractor (MCL 500.1224)**
- Collect fees from repair contractors for obtaining repair work
- Solicit losses during active fires or while fire department present
- **Loan or advance money/collateral to insured during claim adjustment**

### 7.6 CRITICAL FOR GCSC
- **Contractors CANNOT negotiate claims with insurers on behalf of homeowners** without public adjuster license
- **GCSC CANNOT facilitate claims negotiation** unless through a licensed public adjuster
- **GCSC CANNOT advance money to insureds during claim adjustment** — this is prohibited conduct for adjusters
- Payment collection assistance (AOB) is different from claims representation
- If GCSC provides both contractor services and claims assistance, MUST ensure no public adjuster law violations

---

## 8. Token Collateral / Digital Asset Rules

### 8.1 Status: **UNKNOWN — REQUIRES COUNSEL REVIEW**

### 8.2 Key Findings
- Michigan's Money Transmission Services Act defines "money" as **"government-authorized currency"** — does NOT explicitly include virtual currency
- **DIFS has NOT issued** specific guidance or regulations on virtual currency, digital assets, or cryptocurrency
- No Michigan statute or regulation was found specifically addressing:
  - Token collateral for loans
  - Cryptocurrency lending
  - Digital asset custody
  - Smart contract enforcement
  - Stablecoin regulation

### 8.3 Money Transmission Analysis
- The MTSA regulates "selling or issuing of payment instruments" and "receiving of money or monetary value for transmission"
- Whether token collateral activities trigger money transmission licensing depends on interpretation of **"monetary value"**
- **NO CLEAR OFFICIAL GUIDANCE EXISTS**

### 8.4 Recommended Actions
- **MUST obtain Michigan-specific legal counsel** to analyze token collateral mechanism under MTSA
- **MUST consult with DIFS** regarding digital asset activities before any live operations
- Consider whether token activities constitute money transmission, lending, or neither
- Federal regulatory considerations (SEC, CFTC, OCC) also apply

---

## 9. Insurance Claim Advances & Loss Drafts

### 9.1 Additional Living Expenses (ALE) / Loss of Use
- ALE coverage is standard in homeowners policies — pays for temporary housing, meals, transportation above normal expenses
- No Michigan statute mandating specific ALE advance procedures
- Policy terms govern ALE limits and duration
- Documentation (receipts) required for reimbursement
- ALE is separate from dwelling/structure coverage

### 9.2 Emergency Advance Payments
- **No specific Michigan statute** found requiring insurers to make emergency advance payments on property claims
- MCL 500.2006 requires insurers to specify proof of loss requirements within 30 days
- Claim payment timing governed by policy terms and unfair claims practices regulations
- Most insurers voluntarily provide emergency advances for covered losses

### 9.3 Claim Settlement Timing
- **MCL 500.2006:** Insurer must specify proof of loss requirements within 30 days of claim receipt unless claim settled within 30 days
- If proof of loss not supplied for entire claim, supported amount paid within 60 days of receipt
- Interest may apply for untimely payments

### 9.4 Loss Draft / Mortgagee Checks
- Standard industry practice: Mortgage servicers listed as payee on claim checks
- Threshold-based handling:

| Claim Amount | Loan Status | Typical Handling |
|---|---|---|
| $40,000 or less | Current | Endorsed and returned to borrower |
| $40,000 or less | Delinquent | Escrowed, disbursed as repairs progress |
| Over $40,000 | Current | Escrowed, disbursed incrementally |
| Over $40,000 | Delinquent | Escrowed, stricter disbursement |

- **No specific Michigan statute** found governing loss draft procedures — primarily governed by mortgage contracts and federal servicing requirements (CFPB)

### 9.5 Escrow Disbursement Requirements (Industry Standard)
- Itemized adjuster's report
- Signed contractor proposal
- Loss Draft Claim form
- Inspections at draw milestones
- Sworn statement or lien waiver
- W-9 for contractors

---

## 10. Compliance Dashboard & Smart Contract Rules

### 10.1 Product Status Flags

```json
{
  "state": "MI",
  "state_name": "Michigan",
  "primary_regulator": "Michigan DIFS (michigan.gov/difs)",
  "contractor_regulator": "Michigan LARA",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "DIFS_crypto_clarification", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Michigan money transmission statute defines 'money' as government-authorized currency; does not explicitly include virtual currency. No DIFS guidance found on token collateral or digital asset lending. MUST obtain formal DIFS guidance and legal counsel opinion before any token activities. CFSA licensing analysis also required if lending mechanism falls under regulated consumer financial services."
  },
  "claimbridge": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "DIFS_insurance_review"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "AOBs are ALLOWED in Michigan for property insurance post-loss claims. However, ClaimBridge model requires careful legal review to ensure: (1) no unauthorized public adjusting activity, (2) compliance with MCL 500.1224 (contractor/adjuster separation), (3) no prohibited money advances to insureds during claim adjustment, (4) proper assignment documentation under Michigan statute of frauds. Michigan public adjuster fee cap (10%) and contract requirements (DIFS-approved form) apply if GCSC or partners engage in public adjusting activities."
  },
  "escrow_backed_contractor_advance": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": [],
    "blocked_actions": ["live_escrow_creation", "milestone_disbursement", "claim_proceeds_routing"],
    "required_reviews": ["legal", "DIFS_escrow_review", "provider"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "NEW escrow product. Must determine if holding and disbursing funds triggers MTSA or CFSA licensing. 25% usury cap applies on amounts under $1,000 unless licensed. Must avoid public-adjuster prohibitions under MCL 500.1227(2). Escrow agreement must comply with Michigan common-law requirements. DIFS escrow oversight may apply."
  },
  "contractor_flow_status": "LEGAL_REVIEW_REQUIRED - Contractor licensing by LARA required for projects $600+. Must verify licensed status. Residential builders exempt from Consumer Protection Act. Public adjuster/contractor separation rules under MCL 500.1224 are critical.",
  "homeowner_flow_status": "LEGAL_REVIEW_REQUIRED - Homeowner can assign post-loss claim rights. 3-day cancellation right under Home Solicitation Sales Act if solicited at residence. 10-day voidable period if AOB signed within 48 hours of loss. Must ensure homeowner understands rights.",
  "restoration_company_flow_status": "LEGAL_REVIEW_REQUIRED - Restoration companies must hold proper LARA license. Cannot negotiate claims with insurers without public adjuster license. Cannot be connected with public adjuster per MCL 500.1224. AOB for payment collection is permitted but claims representation is not."
}
```

### 10.2 Smart Contract Gating Rules

```json
{
  "state": "MI",
  "smart_contract_rules": {
    "block_live_loan_creation": true,
    "block_token_collateral_lock": true,
    "block_liquidation": true,
    "block_assignment_of_claim_proceeds": true,
    "block_repayment_routing_from_insurance_proceeds": true,
    "block_escrow_milestone_disbursement": true,
    "allow_demo_only_records": true,
    "allow_hash_reference_only_audit_records": true,
    "notes": "ALL live transaction functionality must be BLOCKED until: (1) Michigan counsel approves token collateral mechanism under MTSA and CFSA, (2) DIFS clarification obtained on digital asset activities, (3) Insurance/claims review confirms no unauthorized public adjusting, (4) Proper licensing analysis completed for any lending activities, (5) NEW: Escrow-backed advance structure reviewed for MTSA/CFSA triggers and public-adjuster separation compliance. Demo mode and hash-only audit records are permitted for development/testing."
  }
}
```

### 10.3 Risk Scores

| Risk Category | Score | Notes |
|---|---|---|
| Lending Risk | **HIGH** | CFSA requires licensing for regulated consumer financial services. $500K minimum bond. 25% usury cap on loans under $1,000. MTSA may apply. Commercial lending exemption may apply but requires careful analysis. |
| Insurance Claim Risk | **MEDIUM** | AOBs allowed for property claims. No specific emergency advance mandate found. Loss draft procedures governed by mortgage contracts. Key risk is inadvertently facilitating unauthorized public adjusting or violating adjuster/contractor separation rules (MCL 500.1224). |
| AOB Risk | **LOW-MEDIUM** | Post-loss AOBs explicitly ALLOWED under Michigan law. No property insurance AOB reforms enacted. 2019 reforms applied only to auto no-fault. However, AOB documentation must comply with statute of frauds (written requirement). Risk of contractor being deemed unauthorized adjuster if facilitating AOBs and claim negotiation. |
| Public Adjuster Risk | **HIGH** | Strict regulations on public adjusters. 10% fee cap. Must use DIFS-approved contract. Cannot be connected with fire repair contractor. Cannot advance money to insureds. Any GCSC involvement in claims negotiation requires licensed public adjuster status or partnership. |
| Token Collateral Risk | **HIGH** | No clear regulatory framework. Michigan money transmission statute does not explicitly include virtual currency. No DIFS guidance found. Unknown whether token collateral triggers MTSA, CFSA, or other licensing. Formal DIFS consultation strongly recommended before any token activities. |
| Escrow-Backed Advance Risk | **HIGH** | NEW product tier. MTSA/CFSA licensing triggers unknown. Must navigate 25% usury cap. Public adjuster advance prohibition (MCL 500.1227(2)) is a critical structural constraint. DIFS escrow oversight may apply. |
| Consumer Protection Risk | **MEDIUM** | Residential builders exempt from Michigan Consumer Protection Act. General consumer protection laws apply. Unfair trade practices regulated under Insurance Code. Contractor fraud awareness is state priority. DIFS actively investigates complaints. |

### 10.4 Required Disclosures Summary

| Disclosure | Status | Trigger |
|---|---|---|
| Token Collateral | **COUNSEL_APPROVED_TEXT_REQUIRED** | All token-collateral product interactions |
| ClaimBridge / AOB | **COUNSEL_APPROVED_TEXT_REQUIRED** | All AOB/claim-assistance interactions |
| Escrow-Backed Advance | **COUNSEL_APPROVED_TEXT_REQUIRED** | All escrow-backed advance interactions |
| Contractor Services | **COUNSEL_APPROVED_TEXT_REQUIRED** | All contractor referral/hiring interactions |
| General Consumer Protection | **COUNSEL_APPROVED_TEXT_REQUIRED** | All Michigan user interactions |

---

## APPENDIX: Key Michigan Statutes Reference

| Statute | Citation | Topic |
|---|---|---|
| Consumer Financial Services Act | 1988 PA 161, MCL 487.2051 et seq. | Consumer lending licensing |
| Money Transmission Services Act | 2006 PA 250, MCL 487.1001 et seq. | Money transmission licensing |
| Usury Cap — Loans under $1,000 | MCL 438.31 | 25% rate cap on unlicensed small loans |
| Insurance Code — Adjuster Licensing | MCL 500.1222 et seq. | Public adjuster rules |
| Insurance Code — Adjuster Contracts | MCL 500.1226 | Contract/fee requirements |
| Insurance Code — Adjuster Conduct | MCL 500.1227 | Prohibited activities (including advances to insureds) |
| Insurance Code — Conflicting Employment | MCL 500.1224 | Adjuster/contractor separation |
| Michigan Consumer Protection Act | 1976 PA 331, MCL 445.901 et seq. | Consumer protection (builders exempt) |
| Michigan Occupational Code — Builders | PA 299 of 1980, Art. 24, MCL 339.2401 et seq. | Contractor licensing (LARA) |
| Home Improvement Finance Act | 1965 PA 332, MCL 445.1101 et seq. | Home improvement financing |
| Retail Installment Sales Act | 1966 PA 224, MCL 445.851 et seq. | Retail installment sales |
| Statute of Frauds | MCL 566.132 | Writing requirement for AOB |
| Unfair Trade Practices — Insurance | MCL 500.2006 | Claim payment timing |
| 2019 Auto No-Fault Reform | 2019 PA 21 (SB 1) | AUTO insurance AOB reform — NOT property AOB |
| Michigan Trust Code | MCL 700.7101 et seq. | Escrow/trust structures |

---

*WARNING: This file is for research purposes only and does not constitute legal advice. Michigan-specific legal counsel MUST review all findings before any SmartContractor product operations in Michigan. All live transaction functionality is BLOCKED pending legal and regulatory review.*
