# Georgia (GA) SmartContractor Compliance Research

**State:** Georgia  
**Nickname:** The Peach State  
**Capital:** Atlanta  
**Population:** ~10.8 million (8th largest)  
**Regulatory Environment:** Moderate-to-High Complexity  
**Prepared:** August 2025  
**Researcher:** Legal & Regulatory Research Agent (GCSC/SmartContractor)  
**Disclaimer:** This document is for research and informational purposes only. It does not constitute legal advice. All products and services described herein must be reviewed by licensed Georgia counsel before any live deployment.

---

## 1. Executive Summary

Georgia presents a **moderate-to-high complexity regulatory environment** for GCSC/SmartContractor products. The state maintains strong consumer protection enforcement across multiple regulatory agencies, and several overlapping statutory frameworks create compliance challenges.

| Product | Status | Notes |
|---------|--------|-------|
| Contractor workflow | Medium legal review needed | State license required for work over $2,500; unlicensed contractors cannot enforce contracts or file liens; SB 90 commercial disclosure requirements |
| Token-collateral equipment credit | Blocked until licensed attorney review | Georgia DBF states some virtual currency transactions require money transmitter licensing; no specific token collateral statute; smart contract enforceability untested |
| Insurance claim advance / ClaimBridge | High legal review needed | Post-loss AOB likely valid but courts inconsistent on first-party claims; strict public adjuster rules (33.3% fee cap, no dual-role as contractor); 10-day payment after coverage confirmed |
| Contract-backed working capital | Medium legal review needed | GILA requires licensing for loans $3,000 or less; 60% criminal usury cap; commercial loans generally exempt; SB 90 disclosures for commercial financing $500K or less |
| Escrow-backed contractor advance | High legal review needed | Escrow activities potentially regulated by Georgia Department of Banking and Finance; must coordinate with mortgagee rights and loss draft procedures |

### Key Regulatory Bodies

| Agency | Role | Website |
|--------|------|---------|
| Georgia Office of the Commissioner of Insurance (OCI) | Insurance regulation, public adjuster licensing, GILA oversight | https://oci.georgia.gov |
| Georgia Department of Banking and Finance (DBF) | Money transmitter licensing, mortgage lending, escrow oversight | https://dbf.georgia.gov |
| Georgia Secretary of State - Professional Licensing Boards | Residential and General Contractor Licensing | https://sos.ga.gov |
| Georgia Attorney General | Consumer protection enforcement (Fair Business Practices Act) | https://law.georgia.gov |

### Key Regulatory Facts

- **GILA License Required:** The Georgia Installment Loan Act (O.C.G.A. 7-3-1) requires a license for consumer loans of $3,000 or less. The Commissioner of Insurance uniquely serves as the Industrial Loan Commissioner.
- **10% Usury Cap Unless Licensed:** O.C.G.A. 7-4-2 establishes a 7% legal interest rate with a 16% usury cap for state-chartered institutions on loans $3,000 or less. Industrial loan licensees may charge up to 60% annually (5% per month) under the criminal usury statute (O.C.G.A. 7-4-18).
- **Money Transmission:** O.C.G.A. Title 7, Chapter 1, Article 4 (Georgia Money Transmitter Act) regulates money transmission. The DBF has taken the position that "some forms of virtual currency transactions" fall within this definition.
- **Escrow Oversight:** The Georgia Department of Banking and Finance may regulate escrow activities, particularly when escrow holders are non-bank entities handling third-party funds.
- **Public Adjuster License Required:** Strict licensing through OCI; contractors cannot act as public adjusters.
- **AOB Status:** Post-loss assignment of insurance claims is generally permitted under long-standing Georgia precedent (1905), but courts are inconsistent on first-party property claims.
- **SB 90 (Effective January 1, 2024):** TILA-like disclosure requirements for commercial financing transactions of $500,000 or less to small businesses.

---

## 2. Official Sources Reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| Georgia Office of the Commissioner of Insurance (OCI) | https://oci.georgia.gov | Insurance claim handling rules, public adjuster licensing, GILA oversight |
| Georgia Department of Banking and Finance (DBF) | https://dbf.georgia.gov | Money transmitter licensing, mortgage lending, virtual currency guidance, escrow regulation |
| Georgia DBF - Money Transmission | https://dbf.georgia.gov/money-transmission | Virtual currency treated as money transmission; licensing requirements |
| Georgia DBF - Virtual Currency Guidance (PDF) | https://dbf.georgia.gov/media/10061/download | Consumer advisory on virtual currency; some virtual currency transactions require money transmitter license |
| Georgia Secretary of State - Contractor Licensing | https://sos.ga.gov | State Licensing Board for Residential and General Contractors |
| Georgia O.C.G.A. Title 33 - Insurance | https://law.justia.com/codes/georgia/title-33 | Complete insurance code including claim handling, public adjuster rules |
| Georgia O.C.G.A. Title 7 - Banking and Finance | https://law.justia.com/codes/georgia/title-7 | GILA, money transmitter act, mortgage lending, escrow regulation |
| Georgia O.C.G.A. Title 43 - Professions/Businesses | https://law.justia.com/codes/georgia/title-43 | Contractor licensing requirements |
| Georgia O.C.G.A. 10-1-390 (Fair Business Practices Act) | https://law.justia.com/codes/georgia/title-10 | Consumer protection, SB 90 commercial financing disclosures |
| Georgia GA ADC 120-2-52 | https://rules.sos.ga.gov/gac/120-2-52 | Fair and equitable settlement of first-party property damage claims |

---

## 3. Lending / Finance Licensing Notes

### Georgia Installment Loan Act (GILA) - O.C.G.A. 7-3-1 et seq.

- **Scope:** Regulates loans of $3,000 or less made to any person in Georgia.
- **Licensing:** License is a "condition precedent to recovery" - unlicensed lenders cannot recover on loans (*Bayne v. Sun Fin. Co.*, 114 Ga. App. 27 (1966)).
- **Interest Rate:** The legal rate of interest is 7% (O.C.G.A. 7-4-2). On loans $3,000 or less, the usury limit is 16% annually for state-chartered institutions. Industrial loan licensees may charge higher rates but are capped by Georgia's criminal usury law at 60% annually (5% per month), plus a $3/month maintenance fee.
- **Exemptions:** Banks, trust companies, real estate loan/mortgage companies, federal and Georgia building and loan associations, credit unions, and pawnbrokers are exempt from GILA. Pawnbrokers may charge up to 25% monthly interest (300% APR) under Georgia's pawnbroker law.
- **Regulator:** The Commissioner of Insurance serves as the Industrial Loan Commissioner (Georgia is unique in this regard - small-dollar lending is regulated by the Department of Insurance rather than Banking and Finance).

### Commercial/Business-Purpose Loans

- Commercial loans are generally **EXEMPT** from Georgia's consumer lending licensing requirements.
- **SB 90 (Effective January 1, 2024):** Georgia amended its Fair Business Practices Act to require TILA-like disclosures for commercial financing transactions of $500,000 or less to small business borrowers.
- **Covered Providers:** Persons who consummate more than 5 commercial financing transactions in Georgia during any calendar year.
- **Required Disclosures:** Total funds provided, total funds disbursed, total amount paid to the provider, total dollar cost of the transaction, payment schedule, prepayment costs.
- **Exemptions from SB 90:** Federally insured depository institutions, Georgia-licensed money transmitters, captive finance companies, Farm Credit Act institutions, and purchase-money obligations.

### Criminal Usury

- **O.C.G.A. 7-4-18:** Charging more than 60% annual interest on loans $250,000 or less constitutes criminal usury (a misdemeanor), except for pawnbrokers.
- Applies to all state financial institutions and persons/companies providing loans.

### Mortgage Lending/Broking

- **O.C.G.A. 7-1-1000 et seq.** (Georgia Residential Mortgage Act): Requires licensing for mortgage lenders, mortgage brokers, and mortgage loan originators.
- Regulated by Georgia Department of Banking and Finance through NMLS.
- Mortgage Broker: $150,000 surety bond required.
- Mortgage Lender: $250,000 surety bond required.

### Key GCSC Lending Implications

| Scenario | License Required? | Notes |
|----------|------------------|-------|
| Consumer loan $3,000 or less to homeowner | **Yes - GILA** | Unlicensed lending unrecoverable |
| Commercial loan to licensed contractor | Generally **No** | SB 90 disclosures may apply if $500K or less |
| Equipment financing to contractor | Generally **No** | May be structured as commercial loan exempt from GILA |
| Token-collateralized loan | **Unknown** | Money transmission analysis required; counsel review mandatory |
| Working capital advance (true sale/purchase) | **Possibly No** | Structure determines; attorney review required |

---

## 4. Escrow-Backed Contractor Advance Rules

### Overview

This section addresses a GCSC-specific product concept: **advancing funds to contractors where repayment is secured by holding insurance claim proceeds or customer contract payments in an escrow arrangement.** Georgia law does not have a single unified "escrow licensing" statute, but multiple regulatory frameworks may apply depending on how the escrow is structured and who holds the funds.

### Regulatory Framework for Escrow Activities

**Georgia Department of Banking and Finance Oversight**

- The Georgia DBF has authority to regulate non-bank entities that hold third-party funds in escrow-like arrangements, particularly when such activities intersect with money transmission, mortgage servicing, or lending regulation.
- **O.C.G.A. 7-1-680 et seq. (Georgia Money Transmitter Act):** If an escrow arrangement involves "receiving money or monetary value for transmission" or "transmitting money or monetary value by any and all means including electronic transfer," a money transmitter license may be required.
- **Escrow without transmission:** If GCSC does not take control of customer funds but merely coordinates the timing of disbursement through a licensed third-party escrow agent, money transmission licensing may not be triggered. This structure requires careful legal analysis.

**Potential Licensing Pathways**

| Structure | License Triggered? | Regulator | Notes |
|-----------|-------------------|-----------|-------|
| GCSC holds customer funds in own account | **High risk** - likely MT or escrow licensing | DBF | Taking custody of third-party funds creates regulatory exposure |
| Licensed bank/escrow agent holds funds; GCSC directs disbursement | **Lower risk** | DBF / N/A | Agent-of-payee or pass-through analysis required |
| Attorney trust account holds funds | Generally exempt | State Bar | Georgia attorney trust accounts regulated by GA Bar |
| Title company holds funds | Generally licensed | DBF / Insurance | Title companies already regulated for escrow |
| Smart contract holds stablecoin escrow | **Unknown** | DBF / CFPB | No Georgia precedent; money transmission analysis critical |

### Coordination with Mortgagee Loss Draft Procedures

- When a mortgaged property suffers an insured loss, the mortgagee (lender) is typically named as a loss payee and holds insurance proceeds in escrow, disbursing incrementally as repairs progress.
- **O.C.G.A. 33-24-4:** No insurance contract is enforceable except for the benefit of persons having an insurable interest at the time of loss. Mortgagees have a statutory insurable interest.
- Any GCSC escrow-backed advance that involves insurance claim proceeds **must account for the mortgagee's prior claim to those funds.** Diverting proceeds without mortgagee consent could violate the mortgagee's rights under Georgia law.
- For claims of $40,000 or less on current loans, servicers typically endorse and return the check to the homeowner within 6-8 business days. For claims over $40,000 or delinquent loans, servicers hold funds in escrow and disburse incrementally.

### Escrow-Backed Advance Structure Requirements

If GCSC pursues an escrow-backed contractor advance product in Georgia, the following structural safeguards should be implemented:

1. **Licensed Escrow Agent:** Use a Georgia-licensed escrow agent, bank, or title company to hold funds. GCSC should avoid taking direct custody of customer funds.
2. **Written Escrow Agreement:** All parties (homeowner, contractor, GCSC, escrow agent) must execute a written escrow agreement specifying disbursement conditions, timing, and conditions for release.
3. **Mortgagee Notification:** If the property is mortgaged, the mortgagee must be notified and must consent to any arrangement affecting insurance proceeds to which it is entitled as loss payee.
4. **Segregated Accounts:** Escrow funds must be held in segregated accounts, not commingled with GCSC operating funds.
5. **Interest Treatment:** Any interest earned on escrow deposits should be addressed in the escrow agreement (typically credited to the homeowner or disbursed per agreement terms).
6. **Disclosure Requirements:** Full disclosure to all parties of the escrow terms, fees, and the right to cancel where applicable.
7. **Record Retention:** Complete records of all escrow transactions must be maintained for audit and regulatory examination purposes.

### Risks Specific to Escrow-Backed Advances

| Risk | Severity | Mitigation |
|------|----------|------------|
| Money transmission licensing | **High** | Use licensed escrow agent; do not take custody of funds |
| Mortgagee priority claim | **High** | Verify mortgage status; obtain mortgagee consent; coordinate with loss draft dept |
| Escrow agent negligence/failure | **Medium** | Diligence on escrow agent; contractual protections; insurance |
| Customer cancellation/right to rescind | **Medium** | Build in cancellation rights; hold funds until rescission period expires |
| Regulatory examination | **Medium** | Maintain complete records; be prepared for DBF inquiry |
| Co-mingling of funds | **High** | Strict segregation of escrow and operating accounts |

### Status: ESCROW_BACKED_ADVANCE_BLOCKED_PENDING_COUNSEL_REVIEW

**Key Questions for Georgia Counsel:**

1. Does a GCSC arrangement that coordinates (but does not hold) escrowed insurance proceeds require any Georgia license (money transmitter, escrow agent, or otherwise)?
2. Can GCSC contractually secure a repayment interest in insurance proceeds that are also subject to a mortgagee's loss draft rights without violating O.C.G.A. 33-24-4?
3. Does the use of a smart contract to hold and release escrowed funds trigger money transmission regulation under O.C.G.A. 7-1-680?
4. What cancellation and disclosure rights apply to escrow-backed advance agreements under the Fair Business Practices Act (O.C.G.A. 10-1-390)?
5. If the escrow agent is a licensed Georgia bank or title company, does GCSC's role as "coordinator" of the escrow avoid direct regulatory licensing requirements?

---

## 5. Token Collateral / Digital Asset Risk

### Georgia Department of Banking and Finance Position

- **O.C.G.A. 7-1-680 et seq. (Georgia Money Transmitter Act):** The DBF has taken the position that "some forms of virtual currency transactions" fall within the definition of money transmission.
- Virtual currency administrators or exchangers that accept and transmit convertible virtual currency are considered **money transmitters** and must be licensed.
- **O.C.G.A. 7-1-680(14)-(15):** "Money transmission" includes "receiving money or monetary value for transmission or transmitting money or monetary value... by any and all means including... electronic transfer."
- The DBF issued a Consumer Advisory on Virtual Currency in April 2014, warning consumers that virtual currencies are volatile, can be stolen, are not FDIC-insured, and companies dealing in virtual currencies may be subject to state regulation and licensing.

### Federal FinCEN Guidance

- The DBF's advisory references FinCEN guidance (FIN-2013-G001): An administrator or exchanger that accepts and transmits convertible virtual currency or buys/sells convertible virtual currency is a **money transmitter under federal regulations** and must register as a Money Services Business (MSB).

### Token Collateral for Lending

- **No specific Georgia statute** addresses the use of cryptocurrency or digital tokens as collateral for loans.
- Under Georgia Uniform Commercial Code (O.C.G.A. Title 11), digital assets may be treated as general intangibles or investment property for secured transaction purposes.
- **Smart contract enforceability:** Georgia has NOT enacted the Uniform Electronic Transactions Act (UETA) amendment addressing smart contracts, nor has it adopted blockchain-specific legislation recognizing smart contracts.

### STATUS: TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW

**Key Uncertainties Requiring Counsel:**

1. Whether token collateral lock/liquidation through smart contracts constitutes money transmission requiring a license.
2. Whether digital tokens are considered "money or monetary value" under O.C.G.A. 7-1-680.
3. Enforceability of smart contract-based collateral agreements under Georgia contract law.
4. Whether token liquidation triggers securities regulation.
5. Application of Georgia's UCC Article 9 to digital asset collateral.

---

## 6. Insurance Claim Advance / ClaimBridge Risk

### Georgia Claim Handling Timeframes (GA ADC 120-2-52-.03)

| Milestone | Timeframe | Notes |
|-----------|-----------|-------|
| Acknowledge receipt of claim | 15 days | Must provide proof of loss forms |
| Affirm/deny liability (auto) | 15 days | After receiving completed proof of loss |
| Affirm/deny liability (fire) | 60 days | After receiving completed proof of loss |
| Coverage investigation | 30 days | If no proof of loss required |
| Total decision time | 60 days | From claim notification (extendable if documented requests pending) |
| Payment after coverage confirmed | 10 days | After full claim amount determined and not in dispute |
| Extension notification | 5 business days | Must notify claimant before initial period expires if more time needed |

### Bad Faith Statute - O.C.G.A. 33-4-6

- If an insurer refuses to pay a covered claim within **60 days after a demand** by the policyholder, and the refusal is found to be in **bad faith**, the insurer is liable for:
  - The full loss amount, **PLUS**
  - Not more than **50% of the liability** or **$5,000**, whichever is greater, **PLUS**
  - All reasonable **attorney's fees**.
- The 60-day demand is a mandatory prerequisite.
- The action for bad faith is **NOT abated** by payment after the 60-day period.

### Additional Living Expenses (ALE) / Loss of Use

- ALE is a standard coverage in Georgia homeowners policies.
- Typically covers: temporary housing, additional food costs, transportation, storage, laundry, pet boarding.
- Usually limited to 20% of dwelling coverage (varies by carrier).
- ALE is triggered when the home is uninhabitable due to a covered loss.
- Insurer must pay for the "shortest time required" to repair/rebuild.
- **Key GCSC Note:** ALE payments go to the homeowner, not the contractor. Any arrangement where GCSC or a contractor receives ALE payments on behalf of the homeowner raises significant legal concerns.

### Emergency Advance Payments

- Georgia law does not have a specific statute requiring insurers to make emergency advance payments.
- However, the Unfair Claims Settlement Practices Act (O.C.G.A. 33-6-34) prohibits:
  - Failing to adopt reasonable standards for prompt investigation and settlement.
  - Not attempting in good faith to effectuate prompt, fair, and equitable settlement when liability is reasonably clear.
  - Unreasonably delaying investigation or payment of claims.
- Some insurers voluntarily provide advance payments for emergency repairs and ALE.
- **No private right of action** under the Unfair Claims Settlement Practices Act - enforcement is by the Commissioner only.

---

## 7. Assignment of Benefits (AOB)

### Georgia Law on Assignment of Insurance Claims

**Post-Loss Assignment (Generally Valid):**

- Under long-standing Georgia precedent (dating to 1905), assignment of a fire insurance policy **after a loss has occurred** does NOT violate an anti-assignment provision and is valid **without the insurer's consent**.
- O.C.G.A. 44-12-24 permits assignment when it "involves, directly or indirectly, a right of property."
- Third-party claims (chose in action) are generally assignable even if the policy contains anti-assignment language.

**Pre-Loss Assignment (Requires Consent):**

- O.C.G.A. 33-24-17: "A policy may be assignable or not assignable, as provided by its terms."
- Assignment before a loss generally requires insurer consent if the policy so states.

**First-Party Property Claims (Uncertain):**

- Georgia courts are **inconsistent** on whether post-loss assignment of first-party property claims is enforceable.
- **Assignment NOT Enforceable:** *Emergency Services 24, Inc. a/a/o Charles Johnson v. Georgia Farm Bureau* (Superior Court of Bibb County, 2013).
- **Assignment Enforceable:** *Affinity Roofing, LLC a/a/o Donald Vicchrilli v. Farmers Insurance Exchange* (Superior Court of Gwinnett County, 2020).
- The law is less clear for first-party claims because there is no "chose in action" (breach of contract) at the onset of the claim.

**Typical Policy Language:**

```
Assignment of Claim. Assignment to another party of any of your rights or duties
under this policy regarding any claim, or any part of any claim, will be void and
we will not recognize any such assignment, unless we give our written consent.
However, once you have complied with all policy provisions, you may assign to
another party, in writing, payment of claim proceeds otherwise payable to you.
```

**Key GCSC Implications:**

1. Assignment of claim proceeds AFTER a loss is more likely to be valid under Georgia law.
2. However, judicial inconsistency creates significant uncertainty.
3. Assignment of the entire policy (not just proceeds) is more likely to be challenged.
4. Standard policy language allows assignment of "payment of claim proceeds" after policy compliance.
5. Any AOB arrangement should be carefully structured by Georgia counsel.

---

## 8. Public Adjuster / Insurance Representation Notes

### Who May Negotiate with the Insurance Company

**Public Adjuster Requirements (O.C.G.A. 33-23-43 et seq.):**

- Must be **licensed** by the Georgia Office of the Commissioner of Insurance.
- Must complete **40-hour pre-licensing course**.
- Must pass the state public adjuster examination.
- Must maintain a **$5,000 surety bond**.
- Must submit fingerprints for criminal background check.
- License fee: $120.

### Public Adjuster Contract Requirements (O.C.G.A. 33-23-43.2)

- Contract must be **in writing** on a form **approved by the Commissioner**.
- Must be prominently captioned and titled **"Public Adjuster Contract."**
- Must contain:
  - Full name and license number of public adjuster.
  - Permanent business address and contact information.
  - Description of loss and services to be provided.
  - Signatures of both parties with dates.
  - Statement of fee/commission structure.
  - **12-point boldface disclosure:** "WE REPRESENT THE INSURED ONLY."
  - 12-point font disclosure that adjuster has no direct/indirect interest in any firm performing work on the loss.
- **Commissioner pre-approval required:** Public adjuster must email contract form to PAcontracts@oci.ga.gov for approval before use.

### Fee Structure (O.C.G.A. 33-23-43.3)

- Fee must be **reasonable**.
- Maximum commission: **33.3% of the insurance settlement amount**.
- If insurer pays or commits in writing to pay **policy limits within 3 business days** after loss is reported, public adjuster may only charge reasonable compensation based on **time spent and expenses incurred** (not percentage).
- All carrier payments to the policyholder **must include the policyholder as a payee** - insurers cannot issue checks solely to the public adjuster.

### Cancellation Rights

- Insured has **3-business-day right to cancel** the public adjuster contract.

### Prohibited Conduct (O.C.G.A. 33-23-43)

A public adjuster SHALL NOT:

- Misrepresent to an insured that they are required to hire a public adjuster.
- Solicit an insured during the progress of a loss-producing occurrence.
- Have a direct or indirect financial interest in any aspect of a claim other than the contracted fee.
- Charge a percentage fee if insurer pays policy limits within 3 business days.
- Misrepresent that they are an attorney.
- Permit an unlicensed employee to conduct business requiring a license.
- Violation is a **misdemeanor** and grounds for license suspension/revocation.

### CRITICAL: Contractor Cannot Act as Public Adjuster

- O.C.G.A. 33-23-43(c)(7): Public adjuster cannot have a direct or indirect financial interest in any firm performing work on the loss.
- O.C.G.A. 33-23-43.2(c): Prohibits public adjuster contracts from identifying the adjuster as "also being a contractor, appraiser, or other position."
- **GCSC and its contractor partners MUST NOT engage in activities that require a public adjuster license.**
- **GCSC MUST NOT** negotiate with insurance companies on behalf of homeowners, prepare claim documentation for submission to insurers, or advise homeowners on claim strategy.

---

## 9. Mortgage / Loss Draft Notes

### Standard Mortgage Clause

- Georgia security deeds (mortgages) universally include standard mortgagee clauses requiring the mortgage holder to be named as a loss payee on insurance policies.
- When a loss occurs, insurance checks are typically issued jointly to the homeowner(s) AND the mortgagee.

### Loss Draft Check Process

- The mortgage servicer's **Loss Draft Department** handles insurance claim proceeds.
- For claims of $40,000 or less on current loans, the servicer typically endorses and returns the check to the homeowner within 6-8 business days.
- For claims over $40,000 or delinquent loans, the servicer holds funds in escrow and disburses incrementally as repairs progress.
- The servicer may require:
  - Insurance adjuster's report.
  - Contractor estimates and signed agreement.
  - Photos of damage.
  - W-9 from contractor.
  - Notarized affidavits or lien releases.
  - Inspections at various stages of repair.

### Key Statutes

- **O.C.G.A. 33-24-4:** "No insurance contract on property or of any interest therein or arising therefrom shall be enforceable except for the benefit of persons having, at the time of the loss, an insurable interest in the things insured."
- The mortgagee has an insurable interest in the mortgaged property.
- **Key GCSC Implication:** Any arrangement that diverts insurance claim proceeds away from both the homeowner and the mortgagee without the mortgagee's consent could violate the mortgagee's rights under Georgia law.

---

## 10. Dashboard Rules, Smart Contract Implications & Risk Scores

### Dashboard Rules

```json
{
  "state": "GA",
  "state_name": "Georgia",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": [
      "live_loan_creation",
      "token_collateral_lock",
      "liquidation",
      "repayment_routing"
    ],
    "required_reviews": [
      "legal",
      "provider",
      "security"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "GEORGIA_TOKEN_COLLATERAL_DISCLOSURE",
      "MONEY_TRANSMITTER_ANALYSIS_REQUIRED"
    ],
    "notes": "Georgia DBF states some virtual currency transactions require money transmitter licensing. No clear state law on token collateral for loans. Smart contract enforceability untested. GILA may apply if loan is $3,000 or less. Commercial loans to licensed contractors may be exempt from consumer lending licensing. Counsel must analyze whether token collateral lock/liquidation constitutes money transmission, whether digital tokens are 'money or monetary value' under O.C.G.A. 7-1-680, and whether smart contract-based collateral agreements are enforceable. SB 90 commercial financing disclosure requirements may apply to business-purpose loans of $500,000 or less."
  },
  "claimbridge": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": [
      "insurance_claim_advance",
      "assignment_of_benefits",
      "claim_financing",
      "repayment_from_claim_proceeds"
    ],
    "required_reviews": [
      "legal",
      "provider",
      "security"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "GEORGIA_PUBLIC_ADJUSTER_PROHIBITION_NOTICE",
      "MORTGAGEE_CONSENT_REQUIREMENT",
      "ANTI_FRAUD_DISCLOSURE",
      "RIGHT_TO_CANCEL_NOTICE"
    ],
    "notes": "Post-loss assignment of claim proceeds may be enforceable under Georgia law but courts are inconsistent on first-party property claims. Assignment of entire policy is more restricted under O.C.G.A. 33-24-17. Public adjuster restrictions under O.C.G.A. 33-23-43 are strict - GCSC/contractors cannot negotiate with insurers on homeowner's behalf. Mortgagee must consent to any claim proceeds diversion. Bad faith penalties apply under O.C.G.A. 33-4-6 (60-day demand, 50% penalty). ALE payments belong to homeowner. Insurance claim payment must be made within 10 days after coverage confirmed."
  },
  "escrow_backed_contractor_advance": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": [
      "escrow_creation",
      "fund_holding",
      "escrow_disbursement_direction",
      "repayment_from_escrow"
    ],
    "required_reviews": [
      "legal",
      "provider",
      "security",
      "escrow_agent"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "ESCROW_TERMS_DISCLOSURE",
      "MORTGAGEE_CONSENT_REQUIREMENT",
      "RIGHT_TO_CANCEL_NOTICE",
      "GEORGIA_SB_90_DISCLOSURE"
    ],
    "notes": "Escrow activities may be regulated by Georgia Department of Banking and Finance. GCSC should avoid taking direct custody of customer funds. Use licensed escrow agent (bank, title company, or licensed escrow provider). Mortgagee consent required if insurance proceeds involved. Smart contract escrow untested under Georgia law. Money transmission analysis required if any funds pass through GCSC accounts."
  },
  "contractor_flow_status": "BLOCKED_PENDING_VERIFICATION",
  "homeowner_flow_status": "BLOCKED",
  "restoration_company_flow_status": "BLOCKED_PENDING_VERIFICATION",
  "notes": "All GCSC products must verify Georgia contractor licensing status before engaging (O.C.G.A. 43-41-17). Unlicensed contractors cannot enforce contracts or file liens. Contractor licensing is regulated by the Georgia Secretary of State, State Licensing Board for Residential and General Contractors."
}
```

### Smart Contract Implications

For Georgia, the smart contract system should implement the following controls:

| Control | Setting | Rationale |
|---------|---------|-----------|
| block_live_loan_creation | **true** | Until Georgia counsel confirms (1) whether token collateral lock/liquidation constitutes money transmission, (2) whether smart contract-based lending agreements are enforceable, and (3) GILA/commercial lending licensing requirements |
| block_token_collateral_lock | **true** | Georgia DBF position that some virtual currency transactions require money transmitter licensing creates legal uncertainty |
| block_liquidation | **true** | Liquidation of token collateral raises money transmission and securities law questions under Georgia law |
| block_assignment_of_claim_proceeds | **true** | Post-loss assignment may be valid but judicial inconsistency on first-party property claims creates significant risk; requires Georgia-specific legal structuring |
| block_repayment_routing_from_insurance_proceeds | **true** | Mortgagee rights, public adjuster prohibitions, and assignment enforceability uncertainty require counsel review |
| block_escrow_backed_advance | **true** | Escrow activities potentially regulated by Georgia DBF; money transmission analysis required; mortgagee coordination required |
| allow_demo_only_records | **true** | Demo/mockup mode is permissible for product development and compliance review |
| allow_hash_reference_only_audit_records | **true** | Immutable audit records may be maintained for compliance review purposes only |

### Off-Chain Checks Required

- Verify Georgia contractor license via Secretary of State.
- Confirm GILA license status if loan $3,000 or less.
- Confirm money transmitter license before token activity.
- Confirm no contractor-PA dual role.
- Verify no claim negotiation occurring.
- Confirm escrow agent licensing status.
- Verify mortgagee status and obtain consent for claim proceeds arrangements.

### Data Fields to Store

- Georgia contractor license number and type.
- GILA license status (if applicable).
- Loan amount (track $3,000 threshold).
- Money transmitter license status.
- Token collateral custody arrangement.
- AOB terms and judicial district.
- Bad faith demand date (if applicable).
- Escrow agent license number.
- Mortgagee name and loss draft department contact.
- Escrow agreement terms and conditions.

### Audit Events Needed

- BLOCKED_LIVE_LOAN_ATTEMPT (GILA if $3,000 or less).
- BLOCKED_TOKEN_COLLATERAL_ATTEMPT (money transmission).
- BLOCKED_CLAIM_NEGOTIATION (PA prohibition).
- BLOCKED_ESCROW_ADVANCE_ATTEMPT (escrow licensing).
- AOB_CREATED with judicial district metadata.
- BAD_FAITH_DEMAND_DATE_RECORDED.
- ESCROW_AGREEMENT_EXECUTED.
- MORTGAGEE_CONSENT_OBTAINED.
- DEMO_MODE_RECORD_CREATED.

### Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **High** | GILA requires licensing for loans $3,000 or less. Criminal usury cap of 60% applies to loans $250,000 or less. SB 90 imposes commercial financing disclosure requirements. Commissioner of Insurance serves as Industrial Loan Commissioner, creating unique regulatory overlap. Payday lending is effectively prohibited (Georgia has strong anti-payday lending stance). |
| Insurance Claim Risk | **Medium** | Georgia has robust claim handling regulations with strict timeframes. Bad faith penalties up to 50% of claim. 10-day payment requirement after coverage confirmed. Unfair Claims Settlement Practices Act enforced by Commissioner. No private right of action for unfair claims practices, but bad faith statute provides strong remedy. |
| AOB Risk | **Medium** | Post-loss assignment of claim proceeds is likely valid under Georgia law (1905 precedent), but courts are inconsistent on first-party property claims. Anti-assignment clauses in policies may limit assignment of the policy itself. Assignment of claim proceeds (not the policy) is the safer path but still requires careful legal structuring. |
| Public Adjuster Risk | **High** | Georgia has strict public adjuster regulations with contract pre-approval requirements, fee caps (33.3%), 3-day cancellation rights, and prohibitions on dual roles. GCSC/contractors must be extremely careful not to engage in activities requiring a public adjuster license. Violation is a misdemeanor. |
| Token Collateral Risk | **High** | Georgia DBF explicitly states some virtual currency transactions require money transmitter licensing. No specific legislation on token collateral or smart contract enforceability. Money transmitter violations carry serious penalties. Federal FinCEN guidance adds additional compliance layer. |
| Escrow-Backed Advance Risk | **High** | Georgia DBF may regulate escrow activities, especially for non-bank entities. Money transmission risk if funds pass through GCSC accounts. Mortgagee loss draft rights create priority claims that must be respected. No Georgia precedent for smart-contract-based escrow. |
| Consumer Protection Risk | **High** | Georgia Fair Business Practices Act (O.C.G.A. 10-1-390) prohibits unfair/deceptive practices. SB 90 adds commercial financing disclosure requirements. GILA provides strong consumer protections for small loans. Georgia Attorney General actively enforces consumer protection laws. Insurance-specific consumer protections exempt insurance transactions from FBPA but are replaced by O.C.G.A. Title 33 protections. |

---

## Required Disclosures

### GEORGIA_GENERAL_PROHIBITION_NOTICE (All Products)

```
COUNSEL_APPROVED_TEXT_REQUIRED
[Company Name] is NOT a public insurance adjuster, attorney, or insurance company.
We do not negotiate with insurance companies on your behalf. We do not file insurance
claims for you. If you need assistance with your insurance claim, you may wish to
consult with a licensed Georgia public adjuster or an attorney.
```

### GEORGIA_CONTRACTOR_VERIFICATION_DISCLOSURE

```
COUNSEL_APPROVED_TEXT_REQUIRED
[Company Name] verifies that all contractors in our network hold a current, valid
license issued by the Georgia State Licensing Board for Residential and General
Contractors. You may verify any contractor's license at https://sos.ga.gov.
Contracting work in Georgia costing more than $2,500 requires a state license.
```

### GEORGIA_TOKEN_COLLATERAL_DISCLOSURE

```
COUNSEL_APPROVED_TEXT_REQUIRED
Digital assets, including cryptocurrency tokens, involve significant risk including
complete loss of value. Virtual currency transactions may be subject to regulation
by the Georgia Department of Banking and Finance as money transmission activity.
Virtual currency accounts or "wallets" are not insured by the FDIC or NCUA.
Transactions using virtual currency may have tax consequences. Georgia law does not
specifically address the use of digital tokens as loan collateral.
```

### GEORGIA_CLAIM_PROCEEDS_DISCLOSURE

```
COUNSEL_APPROVED_TEXT_REQUIRED
Insurance claim proceeds may be subject to the rights of your mortgage lender
(mortgagee). If your property is mortgaged, your lender may be named as a loss
payee on your insurance policy and may have the right to hold and disburse insurance
funds. Any assignment of claim proceeds requires compliance with Georgia law and
may require your mortgage lender's consent.
```

### GEORGIA_ESCROW_TERMS_DISCLOSURE

```
COUNSEL_APPROVED_TEXT_REQUIRED
Funds related to your transaction will be held by a licensed Georgia escrow agent.
[Company Name] does not hold or take custody of your funds. All escrow disbursements
will be made in accordance with the written escrow agreement executed by all parties.
If your property is subject to a mortgage, your lender may have rights to insurance
proceeds that take priority over other arrangements.
```

### GEORGIA_RIGHT_TO_CANCEL_NOTICE (If Applicable)

```
COUNSEL_APPROVED_TEXT_REQUIRED
You have the right to cancel this agreement within THREE (3) BUSINESS DAYS from
the date you sign it or the date you receive a fully executed copy, whichever is later.
To cancel, sign and date the cancellation notice and return it by certified mail or
statutory overnight delivery to: [Address]. If you cancel, any money you have paid
will be returned to you within 30 days.
```

### GEORGIA_SB_90_COMMERCIAL_FINANCING_DISCLOSURE (For business-purpose loans $500,000 or less)

```
COUNSEL_APPROVED_TEXT_REQUIRED
Total Amount of Funds Provided to Your Business: $______
Total Amount of Funds Disbursed to You: $______
Total Amount You Will Pay to [Provider]: $______
Total Dollar Cost of the Financing: $______
Payment Schedule: [_____ payments of $_____ every _____]
Prepayment: [Description of any prepayment charges or discounts]
```

---

## APPENDIX: Key Georgia Statutes Cited

| Statute | Citation | Subject |
|---------|----------|---------|
| Georgia Installment Loan Act | O.C.G.A. 7-3-1 et seq. | Small loan licensing and regulation |
| Georgia Money Transmitter Act | O.C.G.A. 7-1-680 et seq. | Money transmission licensing, virtual currency |
| Georgia Residential Mortgage Act | O.C.G.A. 7-1-1000 et seq. | Mortgage lending/broking licensing |
| Criminal Usury | O.C.G.A. 7-4-18 | 60% usury cap on loans $250,000 or less |
| Fair Business Practices Act | O.C.G.A. 10-1-390 et seq. | Consumer protection, SB 90 commercial disclosures |
| Contractor Licensing | O.C.G.A. 43-41-1 et seq. | Residential and general contractor licensing |
| Bad Faith Insurance | O.C.G.A. 33-4-6 | 60-day demand, 50% penalty for bad faith refusal |
| Unfair Claims Settlement Practices | O.C.G.A. 33-6-30 et seq. | Claim handling standards (no private right of action) |
| Policy Assignment | O.C.G.A. 33-24-17 | Assignability of insurance policies |
| Insurable Interest | O.C.G.A. 33-24-4 | Required interest in insured property |
| Public Adjuster Prohibitions | O.C.G.A. 33-23-43 | Conduct requirements and prohibitions |
| Public Adjuster Contracts | O.C.G.A. 33-23-43.2 | Contract form and content requirements |
| Public Adjuster Compensation | O.C.G.A. 33-23-43.3 | Fee cap of 33.3% |
| Chose in Action Assignment | O.C.G.A. 44-12-24 | Assignability of rights of action |
| Claim Settlement Standards | GA ADC 120-2-52-.03 | Timeframes for claim acknowledgment, investigation, payment |

---

*This document was prepared for internal compliance research purposes only. It does not constitute legal advice. All product deployment decisions must be reviewed and approved by licensed Georgia legal counsel. The information contained herein reflects research conducted as of the preparation date and may not reflect subsequent regulatory changes.*
