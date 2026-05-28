# Iowa SmartContractor Compliance Research

## 1. Executive Summary

| Product | Status | Notes |
|---------|--------|-------|
| Contractor workflow | Medium legal review needed | No state-level general contractor license; registration required for $2,000+/year through DIAL; specialty trades (plumbing, electrical, HVAC) require separate board licenses |
| Token-collateral equipment credit | High legal review needed | Iowa Uniform Money Services Act (Ch. 533C) likely covers crypto businesses; token collateral lock/liquidation may constitute money transmission; smart contracts recognized under SB 541 (2022) but does not exempt from licensing |
| Insurance claim advance / ClaimBridge | Blocked until licensed attorney review | AOB permitted but heavily regulated under Iowa Code 515.137A; co-payee only (not sole payee); 5-business-day cancellation window; 14-point capitalized notices required; ALE/loss of use payments prohibited to contractors per HF 982 (2025) |
| Contract-backed working capital | High legal review needed | Strict licensing: Regulated Loan Act (Ch. 536), Industrial Loan Law (Ch. 536A), Consumer Credit Code (Ch. 537); supervised loans by unlicensed persons are VOID; 10% usury cap on loans under $1,000 unless licensed (Iowa Code 535.2) |
| Escrow-backed contractor advance | High legal review needed | Iowa Division of Banking regulates escrow activities; escrow-backed advance structures must be analyzed under consumer lending and money transmission frameworks |

**Primary Regulatory Agencies:**
- **Iowa Insurance Division (IID)** — iid.iowa.gov — Insurance regulation, public adjuster licensing, AOB enforcement
- **Iowa Division of Banking** — Consumer lending licensing (Ch. 536, 536A, 537), money transmission (Ch. 533C), escrow oversight
- **Iowa Department of Inspections, Appeals, and Licensing (DIAL)** — Contractor registration
- **Iowa Attorney General** — Consumer Credit Code administration

---

## 2. Contractor / Home Improvement Rules

### Contractor Licensing
- Is a state contractor license required? **No — registration required for earnings $2,000+/year**
- Which agency issues it? Iowa Department of Inspections, Appeals, and Licensing (DIAL)
- Key requirements: unemployment insurance number; workers' compensation insurance (if employees); $25,000 surety bond (for out-of-state contractors); $50 fee
- "Construction" is broadly defined and includes: carpenters, roofers, painters, drywallers, masons, siding installers, and more
- **Specialty trades (state and local licensing):**
  - Plumbing/Mechanical/HVAC: Licensed by the Plumbing and Mechanical Systems Board (separate from registration)
  - Electrical: Licensed by the Electrical Examining Board / State Fire Marshal
  - Both require master-level competency and four years of practical experience
- Source: https://dial.iowa.gov/licenses/building/contractors

### Home Improvement Contract Rules
- Written contract requirements under Iowa Code; consumer protection provisions apply
- Iowa Consumer Credit Code (Ch. 537) may apply to credit-extending home improvement contracts
- Source: https://dial.iowa.gov/licenses/building/contractors

---

## 3. Lending / Credit Rules

### Consumer / Homeowner Lending
- Is a consumer lending license required? **Yes**
- **Regulated Loan Act (Iowa Code Chapter 536):** License required from the Superintendent of Banking to make loans of the threshold amount or less (currently $54,600 or less, tracking 12 C.F.R. 1026.3(b)) and charge a greater rate than permitted without license. Application through NMLS. Bond required. Annual fee.
- **Industrial Loan Law (Iowa Code Chapter 536A):** Separate licensing pathway for industrial loan companies. Bond $25,000 minimum, up to $150,000 depending on residential mortgage loan volume. Application through NMLS. Fingerprints and background checks required.
- **Iowa Consumer Credit Code (Iowa Code Chapter 537):** Applies to all consumer credit transactions with amount financed of $54,600 or less. Does not apply to first lien mortgage loans. Administered by the Iowa Attorney General.
- **Supervised Loans:** A consumer loan where the finance charge rate exceeds the rate published by the Iowa Division of Banking (4.25% as of mid-2025; adjusts monthly). Only authorized persons may make supervised loans: (1) supervised financial organizations (banks, credit unions), (2) licensed persons under Ch. 536 or 536A, or (3) the small-volume exemption (<10 supervised loans/year, no Iowa office, no face-to-face solicitation).
- **Critical Penalty:** A supervised loan made by an unauthorized person is **VOID**. The consumer has no obligation to pay.
- **Maximum Finance Charge:** 21% per year on the unpaid balance for consumer loans made by supervised financial organizations.
- Source: https://www.legis.iowa.gov/docs/ico/chapter/536.pdf

### Usury Cap — Iowa Code 535.2
- **10% usury cap applies to loans under $1,000** unless the lender is licensed under Ch. 536 or 536A
- For loans of $1,000 or more, the general usury ceiling is higher (varies by loan type)
- Licensed lenders under the Regulated Loan Act and Industrial Loan Law are exempt from the general usury limits and may charge the graduated/scheduled rates authorized by their respective chapters
- Source: Iowa Code 535.2

### Commercial / Contractor Lending
- Business-purpose loans are generally excluded from the Consumer Credit Code unless the borrower is a natural person and the debt is for personal, family, or household use
- Iowa Code 537.1301 definitions primarily apply to consumer loans
- Contractor financing to business entities (LLCs, corporations) for business purposes is likely outside the ICCC but may still be subject to usury limits (Iowa Code Chapter 535)
- Note: The "less than 10 supervised loans" exemption and the threshold amount require careful analysis for any GCSC lending product
- Source: https://www.legis.iowa.gov/docs/ACO/IC/LINC/Chapter.537.pdf

### Broker / Servicer Licensing
- Persons who arrange or broker loans may need a license depending on the transaction structure
- COUNSEL_REVIEW_REQUIRED for any GCSC entity that facilitates, originates, or services loans in Iowa
- Source: https://www.legis.iowa.gov/docs/ico/chapter/536.pdf

---

## 4. Escrow-Backed Contractor Advance Rules

### NEW — Escrow Regulatory Framework
- **Regulator:** Iowa Division of Banking oversees escrow activities in the state
- Escrow agents handling insurance claim proceeds, construction funds, or loan disbursements may be subject to licensing, bonding, and net-worth requirements depending on the transaction structure
- Iowa does not have a standalone "escrow agent" statute comparable to some states; escrow activities are regulated through the Division of Banking's general authority and through the money transmission and lending frameworks

### Escrow-Backed Advance Structure Analysis
Any GCSC product that uses an escrow mechanism to hold and disburse contractor advance funds must analyze:

1. **Money Transmission Risk (Iowa Code Chapter 533C):**
   - Holding funds "for transmission" or as an intermediary in the movement of funds may constitute money transmission
   - "Monetary value" defined as a "medium of exchange, whether or not redeemable in money"
   - License required: $1,000 application fee; $500 license fee; bond $50,000 + $10,000/location (max $300,000); net worth $100,000 + $10,000/authorized delegate (max $500,000)
   - If an escrow-backed advance involves receiving insurance proceeds or homeowner funds and disbursing to contractors, this may trigger money transmission licensing

2. **Trust Fund / Fiduciary Obligations:**
   - Escrow-held funds create fiduciary duties to all beneficial owners
   - Commingling of escrow funds with operating funds is prohibited
   - Detailed record-keeping and reconciliation required
   - Disbursement must follow the escrow agreement terms precisely

3. **Insurance Proceeds Escrow (Loss Draft):**
   - Iowa Code 515.137A(4)(b) requires all mortgagees listed on the declarations page to be named as **co-payees**
   - Mortgage companies typically hold insurance proceeds in escrow and disburse as repairs progress
   - Any GCSC product that inserts itself into the loss draft chain must account for mortgagee co-payee requirements
   - Cannot bypass mortgagee to receive claim funds directly

4. **Consumer Lending Nexus:**
   - If escrow-backed advances are structured as loans to homeowners (rather than purchase of receivables), Iowa Consumer Credit Code (Ch. 537) and Regulated Loan Act (Ch. 536) apply
   - If structured as advances against insurance proceeds with repayment from claim funds, AOB rules (515.137A) and public adjuster restrictions apply
   - 10% usury cap on amounts under $1,000 (Iowa Code 535.2) unless lender is properly licensed

### Permissible Escrow Activities (Subject to Counsel Review)
- Holding construction completion funds in a segregated account pending verified milestone completion
- Disbursing funds to contractors upon joint authorization of homeowner and inspector
- Releasing retention funds after final inspection and certificate of completion
- Holding deductible funds in trust for insurer verification

### Prohibited / High-Risk Escrow Activities
- Holding insurance claim proceeds as sole payee (mortgagee must be co-payee)
- Disbursing ALE or loss of use funds to contractors (explicitly prohibited per HF 982)
- Commingling escrow funds with GCSC operating accounts
- Delaying disbursement beyond contractual timelines to earn float interest
- Disbursing without verifying contractor DIAL registration and specialty trade licenses

### Escrow-Backed Advance Compliance Checklist
- [ ] Determine whether the advance structure triggers money transmission licensing (Ch. 533C)
- [ ] Determine whether the advance is a "loan" subject to Ch. 536/536A/537
- [ ] Confirm contractor DIAL registration and specialty trade licenses
- [ ] Verify all mortgagees are named as co-payees on insurance proceeds
- [ ] Segregate escrow funds from GCSC operating funds
- [ ] Provide detailed escrow accounting to all parties
- [ ] Include 5-business-day cancellation window if AOB component exists
- [ ] Include 14-point capitalized notices per 515.137A
- [ ] **COUNSEL_REVIEW_REQUIRED** before activating any escrow-backed advance product in Iowa

---

## 5. Token Collateral / Digital Asset Risk

### Money Transmitter Risk
- Does the state regulate virtual currency transmission? **Yes**
- **Iowa Uniform Money Services Act (Chapter 533C):** "A person shall not engage in the business of money transmission unless the person is licensed"
- "Monetary value" defined as a "medium of exchange, whether or not redeemable in money" — Iowa Code 533C.103 does NOT list digital currency businesses as an exception
- Major exchanges (Coinbase, Binance, Gemini) have all registered as money transmitters in Iowa
- License requirements: $1,000 application fee; $500 license fee; bond $50,000 + $10,000/location (max $300,000); net worth $100,000 + $10,000/authorized delegate (max $500,000)
- Source: https://www.legis.iowa.gov/docs/ico/chapter/533C.pdf

### Digital Financial Asset Kiosks (SF 449, 2025)
- New regulations for digital financial asset transaction kiosks (crypto ATMs)
- Limits consumer transactions to $1,000/day
- Fee caps: greater of $5 or 15% of transaction value
- Requires written disclosures, receipts, blockchain analytics software
- Source: Iowa SF 449 (2025)

### Digital Asset / Token Rules
- **SB 541 (2022):** "A contract shall not be denied legal effect or enforceability solely because the contract is a smart contract or contains a smart contract provision" — signed into law May 20, 2022
- **HF 2445 (2022):** Amends Iowa's UCC to add a new chapter governing possession of controllable electronic records (UCC Article 12 equivalent) — effective June 13, 2022
- Iowa has been generally **crypto-neutral**: no hostile prohibition, but no special exemptions either
- Source: https://www.legis.iowa.gov/docs/ico/chapter/533C.pdf

### Collateral / Liquidation Risk
- Can tokens be used as loan collateral under state law? **Not confirmed**
- Any GCSC product accepting cryptocurrency/token as collateral likely implicates the Iowa Money Services Act
- Collateral lock, liquidation, and repayment routing may constitute "money transmission" or "receiving monetary value for transmission"
- Secured creditor exemption may apply but requires legal analysis
- **TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW** — Iowa law does not have clear precedent on token-collateralized lending
- **Recommendation:** Do not activate token collateral features in Iowa until counsel provides a definitive opinion on money transmission applicability
- Source: https://www.legis.iowa.gov/docs/ico/chapter/533C.pdf

---

## 6. Insurance Claim Advance / ClaimBridge Risk

### Assignment of Benefits (AOB)
- Is AOB allowed, restricted, or prohibited? **Permitted but heavily regulated**
- **Iowa Code 515.137A** — "Insured Homeowner's Protection Act"
- **Co-payee only:** Contractor can only be named as co-payee (with named insured and all mortgagees), NOT sole payee
- **Required Contents:** Itemized description of work, materials, labor, fees; total itemized amount; statement that contractor has made no assurances the loss will be fully covered
- **14-point capitalized notices required:**
  - "YOU ARE AGREEING TO GIVE UP CERTAIN RIGHTS YOU HAVE UNDER YOUR INSURANCE POLICY. PLEASE READ AND UNDERSTAND THIS DOCUMENT BEFORE SIGNING."
  - "THE ITEMIZED DESCRIPTION OF THE WORK TO BE DONE SHOWN IN THIS ASSIGNMENT FORM HAS NOT BEEN AGREED TO BY THE INSURER. THE INSURER HAS THE RIGHT TO PAY ONLY FOR THE COST TO REPAIR OR REPLACE DAMAGED PROPERTY CAUSED BY A COVERED PERIL."
- **5-business-day cancellation window** from later of execution date or receipt of copy
- **Extended cancellation (HF 982, 2025):** If work not substantially commenced within 30 calendar days of scheduled start date (or execution if no date), insured may cancel without penalty
- **Indemnification provision (HF 982):** Assignment must require assignee to indemnify and hold harmless assignor from liabilities, damages, losses, costs, and attorney fees
- **Mortgagee protection:** All mortgagees must be co-payees; assignment cannot impair mortgagee interest
- **Copy to insurer:** Electronic copy to insurer, named insured, and all mortgagees within 5 business days
- **Contractor cooperation (HF 982):** Must cooperate with insurer's claim investigation, provide requested documents, comply with post-loss duties
- **Prohibited acts (HF 982):** Contractors shall NOT rebate deductibles, impose administrative fees for canceling or processing checks, act as public adjusters without Ch. 522C license, or receive ALE/loss of use payments
- **Violation consequences:** A violation voids the contract and is an unfair practice under Chapter 507B
- Source: https://www.legis.iowa.gov/docs/code/515.137A.pdf

### Public Adjuster Restrictions
- Is a public adjuster license required to negotiate claims? **Yes**
- **SF 619 (signed April 22, 2025; effective July 1, 2025):** Major changes to adjuster licensing
- Public adjuster bond increased from $20,000 to **$50,000**
- Independent adjuster licensing newly required (previously not required)
- Public adjuster contracts must be submitted to Commissioner for review/approval; deemed approved if not disapproved within 30 days
- Contractors explicitly prohibited from acting as public adjusters without Chapter 522C license
- Continuing education: 24 hours per 2-year term, including 2 hours ethics
- Limited to first-party claims only
- Source: https://iid.iowa.gov/regulated-individuals/insurance-producers-related-professionals/adjusters

### Additional Living Expenses (ALE) / Loss of Use
- Iowa Code 515.137A(3)(b), as amended by HF 982 (2025), **explicitly prohibits** contractors from receiving ALE or loss of use payments through a post-loss assignment
- **Implication:** GCSC ClaimBridge cannot route ALE or loss of use payments to contractors or to GCSC as repayment for claim advances
- Source: https://www.legis.iowa.gov/docs/code/515.137A.pdf

### Insurance Claim Payment Timing
- Iowa Code 515.117 is "Reserved" — no active statutory provisions for claim timelines
- Unfair claim settlement practices governed by 507B.4(3)(j): requires insurers to acknowledge claims promptly, investigate promptly, not refuse payment without reasonable investigation, affirm/deny coverage within reasonable time, attempt good-faith settlements
- **No Private Right of Action:** Iowa case law (Terra Indus., Inc. v. Commonwealth Ins. Co., 990 F.Supp. 679 (N.D. Iowa 1997)) holds that Chapter 507B does NOT create a private cause of action. Only the Insurance Commissioner can enforce.
- Interest on late payments: 507B.4(3)(p) and 511.38 require interest on claim payments when applicable
- Source: https://www.legis.iowa.gov/docs/ico/chapter/507B.pdf

### Insurance Claim Proceeds / Loss Draft
- Iowa Code 515.137A(4)(b): All mortgagees listed on the declarations page must be named as **co-payees**
- Assignment shall not impair interest of mortgagee listed on declarations page
- Mortgage companies typically hold insurance proceeds in escrow and disburse as repairs progress
- For monitored claims (>$40,000 or delinquent loan), mortgage servicers typically impose additional requirements
- **Implication:** Any GCSC product that receives claim proceeds must account for mortgagee co-payee requirements and loss draft procedures
- Source: https://www.legis.iowa.gov/docs/code/515.137A.pdf

---

## 7. Dashboard Logic Recommendation

### Allowed Actions
- Demo-only records for product development
- Hash/reference-only audit records (smart contracts recognized under SB 541)
- Contractor registration verification through DIAL
- Escrow fund holding (pending counsel review of money transmission applicability)

### Warnings Required
- AOB co-payee only (not sole payee)
- 5-business-day cancellation window must be tracked; 30-day extended cancellation if work not commenced
- ALE/loss of use payments cannot be routed to contractors
- 14-point capitalized notices required for AOB documents
- Indemnification provision required per HF 982
- 10% usury cap on loans under $1,000 unless licensed (Iowa Code 535.2)

### Blocked Buttons / Actions
- Live loan creation (pending Ch. 536/536A/537 licensing analysis)
- Token collateral lock (likely money transmission under Ch. 533C)
- Liquidation (may constitute money transmission)
- Assignment of benefits as sole payee (heavily regulated; co-payee only per 515.137A)
- ALE/loss of use payment routing to contractors (explicitly prohibited)
- Repayment routing from insurance proceeds as sole payee (mortgagee co-payee requirements)
- Escrow-backed advance disbursement without verified DIAL registration and counsel approval

### Required Disclosures
- Lending product disclosure (Ch. 536/536A/537 compliance; 535.2 usury notice for loans under $1,000)
- AOB disclosure (co-payee status, cancellation rights, ALE prohibition, indemnification provision)
- Token collateral disclosure (money transmission risk)
- Public adjuster disclaimer
- General consumer protection notice
- Escrow agreement disclosure (if escrow-backed advance activated)

### Attorney Review Triggers
- Any lending activity (strict Iowa licensing; void if unlicensed; 10% usury cap under $1,000)
- Any token collateral activity (likely money transmission under Ch. 533C)
- Any AOB processing (515.137A compliance requirements)
- Any insurance claim-related product
- Any escrow-backed advance (money transmission, lending, and fiduciary duty analysis)

---

## 8. Smart Contract Implications

### Off-Chain Checks Required
- Verify DIAL contractor registration ($2,000+/year earnings threshold)
- Confirm loan purpose (consumer vs. business) for Iowa Credit Code applicability
- Check for mortgagee involvement (co-payee requirement)
- Determine if token activity constitutes money transmission
- Determine if escrow activity constitutes money transmission or trust/fiduciary obligations
- Verify specialty trade licenses (plumbing, electrical, HVAC) if applicable

### Data Fields to Store
- DIAL registration number and verification date
- Loan/supervised loan characterization (consumer vs. business purpose)
- Mortgagee names (for co-payee status)
- AOB cancellation window tracking (5 business days from execution/receipt)
- Work commencement date (30-day extended cancellation trigger)
- Escrow account number and balance (if escrow-backed advance)
- Escrow disbursement authorization signatures
- 535.2 usury tier flag (loan amount <$1,000)

### Actions That Must Be Blocked
- Live loan creation (pending license analysis under Ch. 536/536A/537)
- Token collateral lock (likely money transmission under Ch. 533C)
- Liquidation (may constitute money transmission)
- AOB assignment as sole payee (co-payee only; cannot be sole payee per 515.137A)
- ALE/loss of use payment routing to contractors
- Escrow disbursement without joint authorization (homeowner + inspector/mortgagee)
- Esc-backed advance funding to unregistered contractors

### Audit Events Needed
- Demo mode activation
- DIAL registration verification
- AOB cancellation window tracking (5-day and 30-day triggers)
- Counsel review completion (lending, money transmission, escrow, AOB)
- Escrow account creation and funding
- Escrow disbursement authorization and execution

### Admin Approvals Required
- Legal approval for lending licensing analysis (Ch. 536/536A/537; 535.2 usury)
- Legal approval for money transmission determination (Ch. 533C)
- Legal approval for escrow-backed advance structure (trust/fiduciary/money transmission)
- Compliance approval for 515.137A AOB requirements
- Provider approval for token collateral mechanism

---

## 9. Open Questions For Licensed Attorney

1. Does a noncustodial smart contract token collateral mechanism require a money transmitter license under Iowa Code Chapter 533C, or does the secured creditor exemption (if any) apply?
2. Does a business-purpose loan to an Iowa contractor require a Regulated Loan Act license if the loan amount is below the $54,600 threshold, and what documentation establishes business purpose?
3. Given Iowa Code 515.137A's co-payee requirement, can GCSC structure a claim advance product that does not require being named as a co-payee?
4. Do the HF 982 (2025) indemnification requirements and extended cancellation rights apply retroactively to all AOB arrangements, and how do they affect GCSC's contractual risk?
5. Does the SF 619 (2025) independent adjuster licensing requirement apply to GCSC representatives who communicate with insurers on behalf of contractors?
6. **(NEW — Escrow)** Does holding contractor advance funds in escrow pending construction milestone completion constitute money transmission under Iowa Code Chapter 533C, or does a bona fide escrow exclusion apply?
7. **(NEW — Escrow)** If GCSC structures an escrow-backed advance as a purchase of accounts receivable rather than a loan, does the 10% usury cap under Iowa Code 535.2 still apply to the effective cost of funds?
8. **(NEW — Escrow)** What fiduciary duties does an escrow holder owe to homeowners, contractors, and mortgagees under Iowa common law, and how do they interact with 515.137A's co-payee requirements?

---

## 10. Sources

- Iowa Insurance Division — https://iid.iowa.gov
- Iowa Insurance Division - Adjusters — https://iid.iowa.gov/regulated-individuals/insurance-producers-related-professionals/adjusters
- Iowa Department of Inspections, Appeals, and Licensing (DIAL) — https://dial.iowa.gov/licenses/building/contractors
- Iowa Division of Banking — https://iid.iowa.gov/divisions/banking
- Iowa Code 515.137A (Insured Homeowner's Protection Act / AOB) — https://www.legis.iowa.gov/docs/code/515.137A.pdf
- Iowa Code Chapter 535 (Interest / Usury) — https://www.legis.iowa.gov/docs/ico/chapter/535.pdf
- Iowa Code Chapter 536 (Regulated Loan Act) — https://www.legis.iowa.gov/docs/ico/chapter/536.pdf
- Iowa Code Chapter 536A (Industrial Loan Law) — https://law.justia.com/codes/iowa/title-xiii/chapter-536a/
- Iowa Code Chapter 537 (Consumer Credit Code) — https://www.legis.iowa.gov/docs/ACO/IC/LINC/Chapter.537.pdf
- Iowa Code Chapter 533C (Uniform Money Services Act) — https://www.legis.iowa.gov/docs/ico/chapter/533C.pdf
- Iowa Code 507B.4 (Unfair Trade Practices / Claims) — https://www.legis.iowa.gov/docs/ico/chapter/507B.pdf
- Iowa Code Chapter 522C (Public Adjusters) — Referenced in SF 619 bill text
- Iowa SF 619 (2025) — https://legiscan.com/IA/bill/SF619/2025
- Iowa HF 982 (2025) — AOB modifications
- Iowa SF 449 (2025) — Digital Financial Asset Kiosks
- Iowa SB 541 (2022) — Smart Contracts / DLT
- Iowa HF 2445 (2022) — Controllable Electronic Records
- Iowa Bulletin 25-04 — https://iid.iowa.gov/media/5335/download?inline
- NMLS / CSBS — https://www.nmlsconsumeraccess.org
- NIPR (National Insurance Producer Registry) — https://www.nipr.com
- Wharton 50-State Crypto Review — https://wifpr.wharton.upenn.edu/50-state-review-of-cryptocurrency-and-blockchain-regulation/
- Money Transmitter Law - Iowa — https://moneytransmitterlaw.com/cryptocurrency-state-laws/iowa/

---

*Status: Research only. Not legal advice. Requires licensed Iowa attorney review. All GCSC product flows are BLOCKED in Iowa pending legal review.*
