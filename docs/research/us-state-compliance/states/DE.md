# Delaware SmartContractor Compliance Research

## 1. Executive Summary

| Category | Status |
|----------|--------|
| Overall Risk | Medium legal review needed |
| Contractor / Home Improvement | Medium legal review needed |
| Lending / Credit | Low local issue found |
| Escrow-Backed Contractor Advance | Legal review needed |
| Token Collateral / Digital Asset | High legal review needed |
| Insurance Claim Advance (ClaimBridge) | Blocked until licensed attorney review |
| Assignment of Benefits | Restricted — not generally available for contractors |

Delaware presents a distinctive regulatory landscape for SmartContractor. The state is highly lender-friendly — licensed lenders face no usury caps, and the 5-loan exemption threshold allows limited unlicensed consumer lending. Delaware's blockchain-friendly corporate legislation (Delaware Blockchain Initiative, 8 DE Code § 224) expressly authorizes blockchain-based corporate recordkeeping, though this does not extend to financial services or token collateralization. The state enacted SB 80 (2021), which authorizes property insurers to prohibit assignment of policy rights to contractors, sharply limiting ClaimBridge viability. Public adjuster rules are extremely restrictive: dual-role prohibition (contractor + PA), fee caps, no advance payments to clients, and Class G felony exposure for unlicensed practice. Home Improvement Services Regulations effective November 1, 2023 impose detailed written contract and disclosure requirements on contractors. Delaware has established real estate escrow practices that may provide a framework for escrow-backed contractor advances, though no specific contractor-advance escrow statute exists.

---

## 2. Contractor / Home Improvement Rules

### Contractor Licensing

- **State Agency**: Delaware Division of Revenue (registration); Division of Professional Regulation (specialty trades)
- **General Contractor License Required?** **No state-level general contractor license** — registration with Division of Revenue is required instead
- **Registration**: Through Combined Registration Application (CRA); also registers business for gross receipts tax, withholding tax, and unemployment insurance
- **Registration fee**: $75/year
- **Non-resident contractors**: Must also register and may need to post a bond
- **Specialty trades** (Division of Professional Regulation): Electricians (Master Electrician), Plumbers (Master Plumber), HVACR (Master HVACR)
- **Source**: https://revenue.delaware.gov/business-tax-forms/contractors-resident-and-non-resident/

### Home Improvement Services Regulations (Effective November 1, 2023)

Promulgated under the Consumer Fraud Act (6 Del. C. § 2511 et seq.) by the Attorney General's Consumer Protection Unit:

- **Written contract required** with all material terms: price, scope of work, completion date
- **No blank contracts**: Contractor must fill in all terms before homeowner signs
- Estimated or guaranteed completion date must be stated (with disclosure if no date can be provided)
- Contractor contact information required: name, address, phone, email, website
- All express warranties and any disclaimers must be initialed by homeowner
- Notice of right to cancel for door-to-door sales (6 Del. C. § 4402(2))
- Contractors must provide a summary of regulations to homeowner before signing
- **Private cause of action** available to homeowners under 6 Del. C. § 2525

### Prohibited Practices

- Falsely representing merchandise as state of the art
- Requiring homeowner to sign before contract is binding on contractor
- Liquidated damages clauses entitling contractor to full price without work
- Obtaining certificate of completion before work is actually complete
- Inducing signature from person who cannot read or understand the contract
- Misrepresenting down payment as full price
- Misrepresenting binding price as an "estimate"
- Misrepresenting standard cost as "reduced"

**Source**: https://attorneygeneral.delaware.gov/fraud/cpu/

---

## 3. Lending / Credit Rules

### Licensed Lender Act (5 DE Code Chapter 22)

- **License required**: Any person making **more than 5 loans** in any 12-month period must obtain a Licensed Lender license from the Office of the State Bank Commissioner. Five or fewer loans is exempt (§ 2202(a)).
- **Usury**: **No usury restrictions for licensed lenders**. Delaware is a deregulated lending state. Licensed lenders may charge any rate agreed upon by contract (§ 2229).
- **General usury**: For non-licensed persons, interest is limited to **5% over the Federal Reserve discount rate** (Title 5, § 221). Licensed lenders are exempt from this cap.
- **Bond**: $50,000 to $200,000 corporate surety bond (§ 2208)
- **License fee**: $250 investigation fee + $250 annual license fee (§ 2203(b))
- **Exemptions**: Banking organizations, federal credit unions, insurance companies, and persons lending under other applicable Delaware or federal law (§ 2202(a)(1)-(2))
- **Net worth**: No minimum net worth specified for licensed lenders
- **Supervision**: Annual examination by State Bank Commissioner (§ 2210)
- **Source**: https://delcode.delaware.gov/title5/c022/index.html

### Short-Term Consumer Loans ("Payday")

Defined as loan of $1,000 or less with repayment period less than 60 days, not secured by motor vehicle title (§ 2227(7)):

- Maximum 5 short-term consumer loans per borrower per 12-month period from ALL licensees (§ 2235A(a)(1))
- Maximum 4 rollovers (§ 2235A(a)(2))
- 1-business-day right of rescission (§ 2227(5))
- English and Spanish disclosures required (§ 2235A(b))
- High-cost loan surcharge: $1,500 per licensed office annually (§ 2203(c))

### Commercial / Business-Purpose Lending

- Delaware does not distinguish between consumer and commercial lending in its Licensed Lender statute
- The 5-loan exemption threshold applies broadly
- **No usury restriction** applies to loans over $100,000 where the borrower is a corporation, LLC, partnership, or other business entity, or where the loan is not secured by the borrower's principal residence
- Equipment credit / contractor working capital loans may be licensable depending on volume
- **Source**: https://delcode.delaware.gov/title5/c022/index.html

### Mortgage Loan Broker (5 DE Code Chapter 21)

- Separate license required for persons who "offer to find lenders for borrowers, arranges terms, processes application packages"
- $25,000 surety bond required
- Licensed through NMLS

### Loan Servicing / Collection

- **No collection agency license required in Delaware**. Delaware does not currently issue licenses for collection agencies.

---

## 4. Escrow-Backed Contractor Advance Rules

### Delaware Escrow Framework Overview

Delaware has well-established real estate escrow practices, primarily governed by common law principles and the Delaware Real Estate Commission regulations. While **no specific statute governs contractor-specific escrow accounts**, the state's escrow infrastructure provides a plausible foundation for escrow-backed contractor advance products. Any such structure must navigate the intersection of: (a) Delaware's licensed lender requirements if the advance exceeds the 5-loan threshold; (b) public adjuster prohibitions on advancing money pending settlement (18 DE Code § 1758(b)(11)); and (c) the Home Improvement Services Regulations governing contractor contracts.

### Real Estate Escrow Practices

- **Escrow agents** in Delaware real estate transactions are typically licensed attorneys, title companies, or real estate brokers operating under Delaware Real Estate Commission oversight
- Escrow funds must be maintained in segregated trust accounts
- Escrow agents owe fiduciary duties to all parties
- **No specific "contractor escrow" or "construction escrow" statute** exists in Delaware
- General escrow principles apply: funds held by neutral third party until specified conditions are met
- **Source**: Delaware Real Estate Commission regulations; common law

### Escrow-Backed Advance Product Considerations

For SmartContractor's purposes, an escrow-backed contractor advance would involve a neutral escrow agent holding funds (whether from the platform, a licensed lender, or an investor) and disbursing to the contractor upon verified completion of milestones. Key Delaware considerations:

| Factor | Status | Notes |
|--------|--------|-------|
| Escrow agent licensing | **Required analysis** | If escrow agent is not a DE attorney or licensed title company, licensing status unclear |
| Interest on escrow funds | **Permissible with disclosure** | Subject to usury (5% over Fed discount rate) unless escrowed by licensed lender |
| Milestone-based disbursement | **Structurally viable** | Consistent with general escrow principles; aligns with Home Improvement Services Regulations |
| Insurance proceeds as escrow funding source | **High risk** | Intersects with SB 80 AOB restrictions and PA advance prohibitions |
| Consumer protection applicability | **Likely applies** | Home Improvement Services Regulations and Consumer Fraud Act would govern disclosures |

### Licensed Lender Overlay

- If an escrow-backed advance constitutes a "loan" (repayment required, interest charged), the 5-loan exemption threshold (5 DE Code § 2202(a)) applies
- Licensed lenders holding funds in escrow for contractor disbursement may do so at contractually agreed rates without usury constraint
- If the escrow advance is structured as a **true escrow service** (no lending, no interest, fees only), it may fall outside the Licensed Lender Act scope, though counsel must confirm
- **Source**: https://delcode.delaware.gov/title5/c022/index.html

### Prohibited Structures to Avoid

1. **Public adjuster money advance prohibition** (18 DE Code § 1758(b)(11)): A public adjuster cannot advance money to a client pending settlement where the amount would be included in the final settlement. This does not directly prohibit non-PA entities from making loans, but structuring must clearly distinguish escrow advances from PA advances.

2. **Fee-splitting with non-licensed persons**: If the escrow arrangement involves any fee-sharing with public adjusters, only licensed PAs may participate (§ 1758(b)(5)).

3. **AOB-coupled escrows**: Escrow arrangements funded by anticipated insurance proceeds and coupled with an assignment of those proceeds to the contractor are effectively prohibited under SB 80 (2021) when insurers exercise their limitation rights.

### Practical Requirements for Escrow-Backed Advances

- **Written escrow agreement** with all material terms (consistent with Home Improvement Services Regulations)
- Neutral, licensed escrow agent (attorney, title company, or bank)
- Milestone-based disbursement schedule tied to verified completion
- Clear disclosure that the advance is a **loan** (if applicable) and must be repaid
- No tying of escrow advance to insurance claim proceeds without licensed attorney review
- Compliance with Delaware Consumer Fraud Act (6 Del. C. Chapter 25) disclosure requirements

---

## 5. Token Collateral / Digital Asset Risk

### Money Transmitter Risk

- Does the state regulate virtual currency transmission? **Potentially** — statute is unclear
- **5 DE Code § 2303 (Title 5, Chapter 23 — Money Transmitter Act)**: "No person shall engage in the business of receiving money for transmission or transmitting the same without a license"
- **"Money transmission" is not defined in Delaware law** — this creates significant uncertainty
- Major exchanges (Coinbase, Binance, Gemini) have registered as money transmitters in Delaware
- **Net worth requirement**: $100,000 minimum (§ 2305)
- **Bond**: $25,000 minimum, plus $5,000 per additional location, up to $250,000 (§ 2309)
- **Exemptions**: Banks, trust companies, credit unions, savings associations (§ 2304); Commissioner may exempt additional persons/classes by regulation (§ 2304(c))
- **Source**: https://delcode.delaware.gov/title5/c023/index.html

### Digital Asset / Token Rules

- **No cryptocurrency-specific law** exists in Delaware
- **Blockchain-friendly corporate laws** (Delaware Blockchain Initiative):
  - **8 DE Code § 224**: Corporations may maintain records (stock ledger, books, accounts, minute books) on "one or more electronic networks or databases (including one or more distributed electronic networks or databases)" — i.e., blockchain
  - **8 DE Code § 219(c)**: Defines "stock ledger" to include blockchain-administered records
  - **8 DE Code § 232(c)**: Confirms blockchain participation qualifies as "electronic transmission"
  - **12 DE Code § 3801 et seq.**: Statutory trusts may use blockchain for beneficial interests
  - 2018–2019 amendments extended blockchain authority to LLCs, LPs, and partnerships
- **Important**: Corporate records on blockchain are **NOT** the same as lending collateral, consumer loan servicing, digital asset custody, or token-based financing. The Delaware blockchain amendments address corporate governance and securities recordkeeping, not financial services.
- **Source**: https://delcode.delaware.gov/title8/index.html

### Collateral / Liquidation Risk

| Aspect | Assessment |
|--------|------------|
| Token collateral lock (holding crypto as collateral) | Unclear — may constitute "receiving money for transmission" or may fall outside undefined term |
| Token liquidation (selling collateral to recover loan) | Unclear — liquidation mechanics may constitute money transmission |
| Smart contract-only operations (no custody) | If non-custodial, may fall outside MTA scope; counsel must review |
| Blockchain audit records | Expressly supported under 8 DE Code § 224 for corporate records |

- Whether token collateralization constitutes "lending" requiring a Licensed Lender license is **unclear**
- **All token collateral operations blocked pending counsel review**

---

## 6. Insurance Claim Advance / ClaimBridge Risk

### Assignment of Benefits (AOB)

- Is AOB allowed, restricted, or prohibited? **Restricted — effectively prohibited for contractors**
- **SB 80 (151st General Assembly, 2021)**:
  - Authorizes property insurance carriers to **LIMIT** a policy's assignability "only to those persons or entities that have the legal authority to represent the insured"
  - **Explicitly prohibits** assignment of rights and benefits to "any other person, including a property repair contractor"
  - Prohibits property repair contractors from using power of attorney to subvert public adjuster licensing requirements
- **Traditional AOB to contractors is effectively prohibited** when insurers exercise their right to limit assignability
- **No comprehensive AOB statute** like Florida's exists for Delaware property insurance. The only AOB-related statute (18 DE Code § 3367) applies exclusively to health insurance payments to volunteer fire companies/EMS providers.
- **Post-loss AOB** is not statutorily prohibited in the abstract, but SB 80 allows insurers to contractually bar it, and most carriers have done so.
- **Source**: https://insurance.delaware.gov/wp-content/uploads/sites/15/2025/02/domestic-foreign-insurers-bulletin-no101-Revised.pdf

### Public Adjuster Restrictions

- **License required**: 18 DE Code § 1751 — No person shall act as a public adjuster without a license from the Insurance Commissioner
- **Bond**: $20,000 surety bond (§ 1752)
- **Exam**: Written examination required for residents; reciprocity available for non-residents
- **Fee**: $125 initial / $125 biennial renewal (odd-numbered years, Dec 1)
- **Continuing education**: 24 hours per biennium (3 hours ethics)
- **Fee caps** (§ 1756(e)): Maximum 2.5% of first $25,000 of total insurance recovery; maximum 12% of amount exceeding $25,000
- **Contract requirements**: Must be in writing on DOI-approved form; executed in duplicate; 3-business-day cancellation right (until midnight of 3rd business day after signing)

### Prohibited Acts for Public Adjusters (18 DE Code § 1758) — Critical for GCSC

- **Cannot have any interest** in any construction, restoration, home improvement, salvage, appraisal, loss mitigation, cleaning, or environmental restoration business (§ 1758(b)(6))
- **Cannot advance money** to client pending settlement where amount would be included in final settlement (§ 1758(b)(11))
- Cannot pay referral fees to any person (§ 1758(b)(1))
- Cannot split fees with anyone not also licensed as a PA (§ 1758(b)(5))
- Cannot represent both insurer and insured (§ 1758(b)(10))
- Performing PA functions without a license = **Class G felony** under 11 DE Code § 913

### Contractor Role in Claims (Per DOI Bulletin No. 28, Feb 2025)

| Activity | Contractor (No PA License) | Licensed Public Adjuster |
|----------|---------------------------|--------------------------|
| Offer repair services | YES | YES |
| Provide repair estimates | YES | YES |
| Perform repair work | YES | YES |
| Negotiate claims with insurer | **NO** | YES |
| Advise on policy coverage/claim strategy | **NO** | YES |
| Investigate or adjust losses | **NO** | YES |
| Advocate in claims process | **NO** | YES |
| File claim on behalf of insured | **NO** | YES |

### Insurance Claim Proceeds Timing

- **Unfair Claims Settlement Practices** (18 DE Code § 2304(16)): Insurers must acknowledge promptly, investigate reasonably, attempt good faith settlement, not compel litigation by lowballing
- **Timing requirements**:
  - 15 working days to respond to communications (Regulation #18 900 CDR 902(3.1.2))
  - 10 working days to commence investigation (Regulation #18 900 CDR 902(3.1.3))
  - 30 days to affirm or deny coverage after proof of loss (Regulation #18 900 CDR 902(3.1.5))
  - Prompt payment within 30 days of settlement agreement execution (Regulation #18 900 CDR 903(5.1))
- **No specific Delaware statute** requiring emergency advance payments on property claims
- **Source**: https://delcode.delaware.gov/title18/c023/index.html

### Additional Living Expenses (ALE)

- ALE coverage is governed by policy terms, not by state statute in Delaware
- Delaware follows standard ISO policy forms for homeowners insurance
- ALE typically covers: temporary housing, reasonable restaurant meals, laundry, transportation above normal expenses
- Time limits and dollar limits are policy-specific

---

## 7. Dashboard Logic Recommendation

```json
{
  "state": "DE",
  "state_name": "Delaware",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Delaware has no cryptocurrency-specific law. Money transmission statute (5 DE Code 2303) covers receiving money for transmission without defining the term. Whether token collateral lock/liquidation constitutes money transmission or lending requiring a license is unclear. Delaware is blockchain-friendly for corporate records (8 DE Code 224) but this does not extend to financial services. Licensed lender may be required if making more than 5 loans in 12 months (5 DE Code 2202). Counsel must determine: (1) whether token collateral activities require a licensed lender license; (2) whether smart contract liquidation triggers money transmission licensing; (3) whether digital asset custody is regulated. BLOCKED pending counsel review."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Delaware SB 80 (2021) authorizes property insurers to prohibit assignment of policy rights to contractors. No comprehensive AOB statute exists for property insurance. Public adjuster may not advance money to client pending settlement (18 DE Code 1758(b)(11)). Public adjuster may not have interest in construction/restoration business (1758(b)(6)). Contractor may not perform public adjuster functions without license (Class G felony). Claim advances structured as loans may be possible through licensed lender framework but insurance claim repayment routing is legally uncertain. Home Improvement Services Regulations (Nov 2023) require detailed written contracts. BLOCKED pending significant legal restructuring."
  },
  "escrow_backed_contractor_advance": {
    "status": "REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": ["licensed_lenders_only"],
    "blocked_actions": ["escrow_advance_coupled_to_insurance_proceeds", "non_licensed_escrow_agent_operation"],
    "required_reviews": ["legal", "escrow_agent_qualification"],
    "required_disclosures": ["ESCROW_TERMS_DISCLOSURE", "LOAN_OR_ADVANCE_CHARACTERIZATION", "COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Escrow-backed contractor advances are structurally viable under Delaware law but require: (1) qualified escrow agent (attorney, title company, or licensed entity); (2) clear separation from public adjuster advance prohibitions; (3) compliance with Home Improvement Services Regulations for all contractor contracts; (4) licensed lender status if structured as a loan exceeding 5 loans/12 months; (5) no coupling with insurance claim proceeds without additional legal analysis. Milestone-based disbursement is consistent with general escrow principles."
  },
  "contractor_flow_status": "RESTRICTED",
  "homeowner_flow_status": "RESTRICTED",
  "restoration_company_flow_status": "RESTRICTED"
}
```

### Allowed Actions
- Verify Division of Revenue contractor registration
- Display claim status informationally (no negotiation)
- Provide licensed lender disclosure (if applicable)
- Escrow-backed advance in demo mode pending legal review

### Warnings Required
- "Delaware law restricts assignment of insurance claim proceeds to contractors (SB 80)"
- "Public adjusters cannot negotiate claims if they have interest in a construction business"
- "Your mortgage lender may hold insurance proceeds in escrow"
- "Any advance of funds is a LOAN and must be repaid — this is not an insurance benefit"
- "Contractors must be registered with Delaware Division of Revenue"

### Blocked Buttons / Actions
- **Assignment of benefits to contractors** — blocked per SB 80
- **Claim negotiation** — blocked; unauthorized public adjusting is Class G felony
- **Public adjuster referral fees** — blocked per § 1758(b)(1)
- **Live loan creation** — blocked if making more than 5 loans/year without license
- **Token collateral lock** — blocked pending money transmission analysis
- **Liquidation** — blocked pending legal review
- **Insurance-proceeds-coupled escrow advances** — blocked pending AOB/PA analysis

### Required Disclosures
- Delaware SB 80 AOB restriction disclosure
- Public adjuster role disclosure
- Licensed lender status disclosure (if >5 loans)
- Home Improvement Services Regulations disclosure
- Token collateral risk disclosure
- Escrow agreement terms disclosure (if escrow advance offered)
- COUNSEL_APPROVED_TEXT_REQUIRED for all

### Attorney Review Triggers
- Any lending activity (track 5-loan threshold)
- Any token collateral activity
- Any claim proceeds assignment to contractors
- Any public adjuster coordination
- Any escrow-backed advance product design
- Selection or qualification of escrow agent

---

## 8. Smart Contract Implications

### Delaware-Specific Considerations

1. **Blockchain recordkeeping expressly authorized**: 8 DE Code § 224 permits corporations to maintain records on distributed ledgers. Smart contracts maintaining hash-only audit trails on blockchain are legally supported for corporate records.

2. **Corporate formation on blockchain**: Permitted under 8 DE Code § 224 and 12 DE Code § 3801, which may support GCSC entity structuring if incorporated in Delaware.

3. **Smart contract execution of loan terms**: Not specifically addressed in Delaware law but generally permitted under contract law principles.

4. **Digital asset transfer via smart contract**: For collateral management, falls into regulatory gap requiring counsel review. Money transmission statute (5 DE Code § 2303) applies to "receiving money for transmission" without defining the term.

5. **Consumer Finance Act / Home Improvement Services Regulations**: Smart contract-facilitated loans and contractor contracts must comply with disclosure and contract requirements.

6. **Licensed Lender Act 5-loan threshold**: Smart contracts must track loan count and dates (rolling 12-month) to enforce the exemption threshold.

### Key Smart Contract Controls

| Control | Setting | Rationale |
|---------|---------|-----------|
| Block live loan creation | **true** | Licensed lender status unclear; usury exemption requires licensed lender status |
| Block token collateral lock | **true** | Money transmission applicability unclear |
| Block liquidation | **true** | Liquidation may constitute money transmission |
| Block assignment of claim proceeds | **true** | SB 80 (2021) authorizes insurers to prohibit AOB to contractors |
| Block repayment routing from insurance proceeds | **true** | Mortgagee rights may supersede; PA rules prohibit advances |
| Block escrow-backed advance (live) | **true** | Escrow agent qualification, PA separation, and lending license status require review |
| Allow demo-only records | **true** | Demo/testnet-only operation permitted |
| Allow hash/reference-only audit records | **true** | Delaware blockchain-friendly laws support audit records |

### Off-Chain Checks Required
- Verify Division of Revenue contractor registration
- Track loan count (5-loan threshold for licensing)
- Confirm money transmitter analysis before token activity
- Confirm no claim negotiation or PA activity occurring
- Confirm escrow agent is qualified Delaware attorney, title company, or licensed entity
- Verify no PA has interest in GCSC or contractor

### Data Fields to Store
- Contractor registration status
- Loan count and dates (rolling 12-month)
- Licensed lender status (if applicable)
- Token collateral custody arrangement
- PA involvement and conflict check
- Escrow agent qualification and license status
- Claim status (informational only)

### Actions That Must Be Blocked
- AOB to contractors (SB 80)
- Claim negotiation assistance
- PA referral fee arrangements
- Token collateral lock/escrow until legal review
- Live loan origination if over 5-loan threshold without license
- Escrow-backed advance coupled to insurance proceeds

### Audit Events Needed
- LOAN_COUNT_UPDATED (track 5-loan threshold)
- BLOCKED_AOB_CONTRACTOR (SB 80)
- BLOCKED_PA_REFERRAL_FEE (§ 1758)
- BLOCKED_TOKEN_COLLATERAL_ATTEMPT
- BLOCKED_ESCROW_ADVANCE_ATTEMPT
- DEMO_MODE_RECORD_CREATED

### Admin Approvals Required
- Override of blocked actions
- Licensed lender license application decision
- Token collateral legal opinion
- Escrow agent qualification determination
- Smart contract Delaware deployment

---

## 9. Open Questions For Licensed Attorney

1. **Money Transmission Scope**: Does Delaware's undefined "money transmission" statute (5 DE Code § 2303) apply to non-custodial smart contract token collateral where no fiat currency is involved?

2. **AOB Workarounds**: Can a non-contractor entity (e.g., a licensed public adjuster with no construction interest) receive an assignment of claim proceeds under SB 80, and can GCSC facilitate that connection?

3. **5-Loan Aggregation**: Does the 5-loan exemption apply per entity, or would affiliated entities be aggregated for counting purposes under 5 DE Code § 2202(a)?

4. **Blockchain Audit Records**: Can GCSC rely on Delaware's blockchain-friendly corporate laws (8 DE Code § 224) to support blockchain-based audit records for lending transactions?

5. **PA Advance Prohibition Scope**: Does the prohibition on public adjusters advancing money to clients (§ 1758(b)(11)) apply only to PAs, or could it affect GCSC's claim advance product structured as a loan through a licensed lender?

6. **Escrow Agent Licensing**: What licensing, if any, is required for a non-attorney, non-title-company escrow agent to hold contractor advance funds in Delaware?

7. **Escrow Advance Characterization**: Can a milestone-based escrow disbursement to contractors be structured as a service (not a loan) to avoid Licensed Lender Act requirements, or will Delaware regulators characterize it as lending?

8. **Escrow Interest Treatment**: If interest accrues on escrowed advance funds, does the 5% over Federal Reserve discount rate usury cap (Title 5, § 221) apply, or can a licensed lender escrow arrangement charge any contractually agreed rate?

---

## 10. Sources

- Delaware Department of Insurance — https://insurance.delaware.gov
- DE DOI Bulletin No. 28 (Feb 2025) — https://insurance.delaware.gov/wp-content/uploads/sites/15/2025/02/domestic-foreign-insurers-bulletin-no101-Revised.pdf
- Delaware Office of State Bank Commissioner — https://banking.delaware.gov
- Delaware Code - Title 5, Chapter 22 (Licensed Lenders) — https://delcode.delaware.gov/title5/c022/index.html
- Delaware Code - Title 5, Chapter 23 (Money Transmission) — https://delcode.delaware.gov/title5/c023/index.html
- Delaware Code - Title 18, Chapter 17A (Public Adjusters) — https://delcode.delaware.gov/title18/c017a/index.html
- Delaware Code - Title 18, Chapter 23 (Unfair Practices) — https://delcode.delaware.gov/title18/c023/index.html
- Delaware Code - Title 8, Section 224 (Blockchain) — https://delcode.delaware.gov/title8/index.html
- Delaware Division of Revenue - Contractors — https://revenue.delaware.gov/business-tax-forms/contractors-resident-and-non-resident/
- DE DOJ Consumer Protection Unit — https://attorneygeneral.delaware.gov/fraud/cpu/
- CSBS 50-State Survey — https://www.csbs.org/50-state-survey-consumer-finance-laws
- NIPR Delaware Licensing — https://nipr.com/licensing-center/state-requirements/delaware
- NAIC - Delaware Insurance Resources — https://content.naic.org

---

*Status: Research only. Not legal advice. Requires licensed attorney review. Last updated: July 2025.*
