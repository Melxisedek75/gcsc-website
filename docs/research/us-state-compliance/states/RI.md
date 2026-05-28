# Rhode Island SmartContractor Compliance Research

## 1. Executive Summary

| Category | Status |
|----------|--------|
| Overall Risk | High legal review needed |
| Contractor / Home Improvement | Medium legal review needed |
| Lending / Credit | High legal review needed |
| Token Collateral / Digital Asset | High legal review needed |
| Insurance Claim Advance (ClaimBridge) | Blocked until licensed attorney review |
| Assignment of Benefits | Low local issue found |
| Escrow / Consumer Protection | High legal review needed |

Rhode Island has a moderate-to-complex regulatory landscape for GCSC products. The state strengthened consumer protection laws significantly in 2021 (H.B. 6142) and 2025, with civil penalties up to $10,000 per violation. Post-loss assignment of benefits is permitted under common law (*Latos v. Helios, Inc.*, 1986). The Currency Transmission law (R.I. Gen. Laws Chapter 19-14.3) regulates virtual currency business activity and requires a license for "maintaining control of virtual currency on behalf of others." Lending is regulated under Chapters 19-14.1 and 19-14.2, with a general usury cap of 21% or prime + 9%. Contractor registration (not full licensure for general contractors) is required through the CRLB. Public adjuster licensing is strict, with a 10% fee cap during declared disasters. The RI Department of Business Regulation (DBR) oversees escrow activities and enforces strong consumer protection standards. All product features are blocked pending legal review.

---

## 2. Contractor / Home Improvement Rules

### Contractor Registration (Not Full Licensing)

- Rhode Island does NOT require a general contractor **license**. Instead, all contractors and subcontractors must **register** with the RI Contractors' Registration and Licensing Board (CRLB) [^1]

**Registration Requirements** [^1]:
- Must be 18+ years old
- Complete a 5-hour pre-registration education course (residential work)
- Obtain $500,000 general liability insurance (CRLB as certificate holder)
- Workers' compensation insurance (if employees)
- Pay $150 registration fee
- Corporations/LLCs must be registered with RI Secretary of State
- Annual renewal ($150) with 2.5 hours continuing education
- No exam required for general contractors

### Specific Trade Licensing

- Electricians, plumbers, HVAC, and underground utility contractors DO require trade-specific licenses from the RI Department of Labor and Training [^1]
- Commercial roofers, home inspectors, well drillers, and pump installers require exams [^1]

### Implications for GCSC

- GCSC should verify contractor registration status with CRLB before providing any financing or platform access
- Registered but unlicensed contractors may still perform general construction work
- Equipment financing to contractors as business-purpose loans should be structured carefully to avoid consumer lending triggers

---

## 3. Lending / Credit Rules

### Lender Licensing

- **Chapter 19-14.1 (R.I. Gen. Laws)**: Governs lenders and loan brokers. Any person engaged in the business of making or brokering loans to RI residents likely requires licensing [^1]
- **Chapter 19-14.2 (R.I. Gen. Laws)**: Governs small loan lenders [^1]:
  - Loans up to $300: 3% per month (36% APR)
  - Loans $301-$800: 2.5% per month (30% APR)
  - Loans $801-$5,000: 2% per month (24% APR) [^1]

### General Usury Cap

- **Maximum interest rate**: The greater of 21% per annum or (prime rate + 9%) (R.I. Gen. Laws Section 6-26-2) [^1]
- Contracts exceeding this rate are usurious and **void** [^1]
- Criminal penalties apply for willful violations (up to 5 years imprisonment) [^1]

### Exemptions

- **Deferred deposit transactions (payday loans)**: As of January 1, 2027, payday loans are capped at 36% APR [^1]
- **Banks and credit unions**: Federally insured depository institutions are exempt [^1]
- **Commercial loans over $1,000,000**: May be exempt from usury limits under certain conditions [^1]

### Loan Broker Requirements

- Chapter 19-14.1 requires loan broker licensing for anyone who, for compensation, arranges or negotiates loans for others [^1]
- Fees charged to clients before loan closing must be disclosed [^1]
- Records must be maintained for minimum 3 years [^1]

### Key Implications for GCSC

- Equipment financing to contractors may require lender licensing depending on structure and rate
- Commercial loan exemptions may apply for loans over $1M but most GCSC loans will be below this threshold
- The general usury cap (21% or prime + 9%) applies unless a specific exemption is met
- ALL LENDING ACTIVITIES BLOCKED PENDING LEGAL REVIEW

---

## 4. Escrow / Consumer Protection Rules

### DBR Escrow Oversight

- The Rhode Island Department of Business Regulation (DBR) has authority to regulate escrow activities conducted by financial services providers, mortgage lenders, and related entities under its broad supervisory jurisdiction over banking and financial services [^1]
- Escrow agents handling mortgage-related funds or insurance proceeds must comply with DBR regulations and may be subject to examination
- Public adjusters must deposit funds held on behalf of insureds into a non-interest-bearing escrow or trust account (230-RICR-20-50-4.11(A)(13)) [^1]
- Any platform holding or disbursing insurance claim proceeds on behalf of homeowners may trigger escrow regulation under DBR oversight

### Consumer Protection Framework

- **2021 Strengthening (H.B. 6142)**: Rhode Island significantly enhanced its consumer protection framework, removing exemptions for regulated industries and expanding enforcement authority [^1]
- **2025 Enhancements**: Additional consumer protection amendments further strengthened the Attorney General's enforcement powers and private rights of action [^1]
- **Unfair Trade Practices (R.I. Gen. Laws Chapter 9-1)**: Prohibits unfair methods of competition and unfair or deceptive acts or practices in the conduct of trade or commerce
- **Penalties**: Civil penalties up to $10,000 per violation for initial offenses; private litigants may recover $500 per violation plus treble damages [^1]
- **Attorney General Actions**: The Attorney General may bring civil enforcement actions with statutory penalty authority [^1]

### Insurance-Specific Consumer Protections

- **Unfair Claims Settlement Practices Act (R.I. Gen. Laws Chapter 27-9.1)**: Governs claim handling with specific timeframes and penalties [^1]
- **Insurer Duty of Good Faith**: Insurers must attempt in good faith to effectuate prompt, fair, and equitable settlement of claims
- **Required Timeframes**: 15 days to acknowledge claims; 21 days to accept or deny after proof of loss; 45-day update letters for ongoing investigations [^1]

### Implications for GCSC

- Any platform feature holding funds in escrow (claim proceeds, repair payments, token collateral liquidations) may require DBR registration or licensing
- Consumer-facing disclosures must comply with the strengthened 2021/2025 consumer protection standards
- ALL ESCROW AND FUNDS-HOLDING ACTIVITIES ARE BLOCKED PENDING LEGAL REVIEW
- Demo mode permitted only; no actual funds may be held or disbursed

---

## 5. Token Collateral / Digital Asset Risk

### Virtual Currency Regulation

- Rhode Island amended its Currency Transmission law (Chapter 19-14.3, effective January 1, 2020) to include virtual currency business activity [^1]
- **License Required**: "Currency transmission" explicitly includes "maintaining control of virtual currency or transactions in virtual currency on behalf of others" [^1]
- **Definition of Virtual Currency**: "A digital representation of value that: (A) is used as a medium of exchange, unit of account, or store of value; and (B) is not legal tender, whether or not denominated in legal tender" [^1]

### Key Exemptions (R.I. Gen. Laws Section 19-14.3-1(4))

- Persons using virtual currency solely on their own behalf [^1]
- Personal, family, or household use [^1]
- **Secured parties/creditors** with a judicial lien on virtual currency collateral (enforcement of security interest only) [^1]
- Virtual currency control-services vendors (under agreement with a licensee) [^1]
- Native digital tokens used in a proprietary blockchain service platform [^1]

### Required Disclosures (Section 19-14.3-3.5)

Licensees must provide disclosures including: fees and charges; that virtual currency is NOT legal tender; NOT backed by the government; NOT subject to FDIC or SIPC protections; transfers are generally irrevocable [^1]

### Token Collateral Status

**Status**: High legal review needed. If GCSC maintains control of virtual currency on behalf of users as collateral, this likely constitutes regulated activity requiring a Currency Transmission license. The secured party exemption may apply if activity is limited to enforcement of a security interest. The native digital token exemption for proprietary blockchain platform tokens may be applicable to GCSC's platform token.

### Implications for GCSC

| Function | RI Status |
|----------|-----------|
| Block live loan creation | **true** — Lending licensing analysis required |
| Block token collateral lock | **true** — Money transmission licensing analysis required |
| Block liquidation | **true** — Cannot liquidate without resolving licensing |
| Block assignment of claim proceeds | **true** — AOB structure needs legal review |
| Block repayment routing | **true** — Tied to blocked claim advance feature |
| Allow demo-only records | **true** — Demo/testing mode permitted |
| Allow hash/reference-only audit records | **true** — Immutable audit records without financial transactions |

---

## 6. Insurance Claim Advance / ClaimBridge Risk

### Additional Living Expenses (ALE) / Loss of Use

- ALE coverage is standard in most Rhode Island homeowner insurance policies [^1]
- ALE covers the "necessary increase in living expenses" when a residence is uninhabitable [^1]
- **ALE does NOT pay in advance** — it reimburses for expenses actually incurred [^1]
- ALE is typically limited to a percentage of dwelling coverage (often 20%) [^1]

### Insurance Claim Handling Timeframes (230-RICR-20-40-2)

- Insurer must acknowledge receipt of claim within **15 days** [^1]
- Insurer must accept or deny claim within **21 days** after receipt of proof of loss [^1]
- If investigation remains incomplete, insurer must send update letters every **45 days** [^1]

### Unfair Claims Practices (R.I. Gen. Laws Section 27-9.1-4)

Prohibited practices include [^1]:
- Failing to acknowledge claim within 15 days
- Failing to adopt reasonable standards for prompt investigation
- Refusing to pay claims without reasonable investigation
- Failing to attempt in good faith to effectuate prompt, fair, and equitable settlement

### Loss Draft / Mortgagee Checks

- Standard industry practice: when a mortgage exists, insurance claim checks are made payable to both the homeowner AND the mortgagee [^1]
- R.I. Gen. Laws Section 27-5-3.2(b): No mortgage holder is entitled to payment of a claim under $3,500 unless no liability exists as to the mortgagor [^1]
- For claims under ~$40,000 on current loans: mortgagee typically endorses and returns [^1]

### Key Implications for GCSC

- AOB is legally permitted in RI, which is favorable for GCSC's claim proceeds assignment model
- However, facilitating AOBs must not cross into public adjuster territory
- Small loan lender rate caps (36% APR max) apply to any claim advance structured as a loan
- Consumer protection laws strengthened in 2021 and 2025 create additional compliance obligations

---

## 7. Assignment of Benefits & Public Adjuster Rules

### AOB Status in Rhode Island: PERMITTED

- Rhode Island permits the assignment of insurance benefits under common law [^1]
- **Key Case:** *Latos v. Helios, Inc.*, 1986 WL 732866 (R.I. Super. 1986) — established essential elements: assignor's intent to transfer a present interest; absolute appropriation with intent to vest present right in assignee; complete relinquishment of all control over the fund [^1]
- Post-loss assignments are generally valid; no specific AOB reform statute imposing cancellation windows, font-size requirements, or attorney fee limitations [^1]
- *Mello v. General Insurance of America*, 525 A.2d 1304 (R.I. 1987): the RI Supreme Court held that assignment of bad faith claims may be allowed in certain limited circumstances [^1]

### Public Adjuster Licensing (Strictly Required)

- R.I. Gen. Laws Section 27-10-1.2: "A person shall not act or hold themself out as a public, company, or independent adjuster in this state unless the person is licensed" [^1]
- **Public Adjuster Definition (230-RICR-20-50-4.3(A)(15))**: Any person who, for compensation, acts or aids in negotiating for, or effecting the settlement of, a first-party claim for loss or damage covered by an insurance contract [^1]

### Public Adjuster Conduct Rules (Key Provisions)

- **Cannot charge fees before settlement** (4.11(A)(3)) [^1]
- **Catastrophic fee cap**: No more than 10% of insurance settlement during declared disasters (4.11(A)(3)) [^1]
- **Cannot choose repair contractors**: A public adjuster shall not enter into a contract vesting authority to choose repair persons (230-RICR-20-50-4.11(A)(22)) [^1]
- Trust account required for funds held on behalf of insured [^1]
- Must serve with "objectivity and complete loyalty to the interest of his client alone" [^1]

### Who May Negotiate with Insurance on Behalf of Homeowner

- **Licensed public adjusters** (must be licensed by RI DBR) [^1]
- **Attorneys-at-law** admitted to practice in RI (exempt from adjuster licensing) [^1]
- **The insured** themselves [^1]
- **Licensed insurance producers** (but only for claims arising under policies they sold) [^1]

### Who May NOT Negotiate Claims for Others

- **Contractors**: A contractor who is NOT licensed as a public adjuster CANNOT negotiate insurance claims on behalf of a homeowner
- **GCSC / Platform**: GCSC and its representatives must NOT negotiate with insurance companies on behalf of homeowners unless properly licensed as public adjusters
- **Restoration companies**: Similarly, restoration companies cannot negotiate claims without a public adjuster license

### Implications for GCSC

- GCSC and its representatives MUST NOT negotiate claim values, advise homeowners about claim strategies, adjust losses, or hold themselves out as able to help with insurance claims
- GCSC CAN provide a platform for contractors to offer services, facilitate documentation and communication, process AOB paperwork (but NOT provide claim negotiation advice), and work with licensed public adjusters independently contracted by homeowners
- **PUBLIC ADJUSTER RISK: HIGH**

---

## 8. Mortgage / Loss Draft Rules

### Mortgagee Notification Requirements

- R.I. Gen. Laws Section 27-5-3.2(a): When mortgage servicing rights are transferred, the new holder must notify the insurance producer and insurer in writing within 30 days. Failure to notify requires the holder to indemnify the insurance producer [^1]

### Loss Draft Check Thresholds

- R.I. Gen. Laws Section 27-5-3.2(b): No mortgage holder is entitled to payment of a property insurance claim for a loss less than $3,500 unless no liability exists as to the mortgagor [^1]
- Industry practice (not statute): Loss drafts under $40,000 on current loans typically endorsed and returned; over $40,000 or delinquent loans typically escrowed with incremental disbursement [^1]

### Total Loss

- Industry standard: When claim exceeds 80% of insurance coverage amount, property considered total loss. Different procedures apply (appraisal required, monitored disbursement) [^1]

### Implications for GCSC

- GCSC's claim proceeds assignment mechanism must account for mortgagee involvement on mortgaged properties
- If insurance check is made payable to both homeowner and mortgagee, both must endorse
- Mortgagee may place funds in escrow and disburse incrementally, complicating GCSC's repayment timing
- **Mortgage/loss draft status: LEGAL_REVIEW_REQUIRED** for claim proceeds assignment structures

---

## 9. Dashboard Logic & Smart Contract Implications

### Dashboard Rules

```json
{
  "state": "RI",
  "state_name": "Rhode Island",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Rhode Island regulates virtual currency business activity under Currency Transmission law (R.I. Gen. Laws Ch. 19-14.3). Maintaining control of virtual currency on behalf of others likely requires a money transmission license. The secured party exemption (19-14.3-1(4)(ix)) and native token exemption (for proprietary blockchain tokens) may apply but require legal analysis. All token collateral features BLOCKED pending RI counsel review. If licensing required, status remains BLOCKED until license obtained."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Insurance claim advances, if structured as loans, likely trigger RI lender licensing requirements (Ch. 19-14.1 or 19-14.2). Assignment of benefits is permitted under RI common law but public adjuster restrictions are strict - GCSC must not engage in claim negotiation. Small loan lender rate caps (36% APR max) apply. Consumer protection laws strengthened in 2021 and 2025. All claim advance and AOB features BLOCKED pending comprehensive legal review."
  },
  "contractor_flow_status": "BLOCKED",
  "homeowner_flow_status": "BLOCKED",
  "restoration_company_flow_status": "BLOCKED"
}
```

### Smart Contract Implications

| Feature | Setting | Notes |
|---------|---------|-------|
| Block live loan creation | **true** | Lending licensing analysis required first |
| Block token collateral lock | **true** | Money transmission licensing analysis required |
| Block liquidation | **true** | Cannot liquidate collateral without resolving licensing |
| Block assignment of claim proceeds | **true** | AOB structure needs legal review |
| Block repayment routing from insurance proceeds | **true** | Tied to blocked claim advance feature |
| Allow demo-only records | **true** | Demo/testing mode permitted for development |
| Allow hash/reference-only audit records | **true** | Immutable audit records without financial transactions are lower risk |

### Additional Smart Contract Notes

- **On-chain evidence of AOB** (hash-only references) may be created in demo mode but should NOT trigger actual claim payments or disbursements
- **Token collateral lock/unlock** in demo mode should use testnet tokens only. No mainnet tokens should be held in smart contracts pending licensing analysis
- **Repayment routing** should be disabled in production. Demo mode may simulate repayment schedules for UI/UX testing
- **Rate compliance:** Any lending smart contract must enforce RI rate caps (36% APR max for small loans, 21% general usury cap)
- **Escrow compliance:** Any smart contract holding funds on behalf of users must comply with DBR escrow regulations — BLOCKED in all modes except demo

---

## 10. Open Questions, Required Disclosures & Sources

### Open Questions For Licensed Attorney

1. **Currency Transmission License**: Does GCSC's token collateral model require a Currency Transmission license from RI DBR, or does the secured party exemption or native token exemption apply?
2. **Lender License**: Does GCSC's equipment credit product to contractors require a lender or small loan lender license under Chapters 19-14.1 or 19-14.2?
3. **Business-Purpose Exemption**: What documentation and entity structuring are required to ensure contractor equipment loans qualify as business-purpose loans exempt from consumer lending regulation?
4. **AOB Structure**: Does a smart contract-facilitated AOB of insurance claim proceeds comply with RI common law requirements (*Latos v. Helios*)?
5. **Public Adjuster Boundary**: What specific platform activities (document collection, status tracking, communication facilitation) can GCSC perform without crossing into public adjuster territory?
6. **Usury Compliance**: How should the general usury cap (21% or prime + 9%) be calculated for token-collateralized loans with variable collateral values?
7. **Consumer Protection Disclosure**: What specific disclosures are required under the strengthened 2021/2025 consumer protection laws for GCSC's platform?
8. **Mortgagee Priority**: If GCSC receives an AOB of claim proceeds, how does the mortgagee's interest (Section 27-5-3.2(b)) affect GCSC's rights?
9. **Claim Advance Characterization**: Can an insurance claim advance be structured as a non-loan product to avoid lender licensing requirements?
10. **Escrow Registration**: Does GCSC's platform require escrow agent registration or licensing with the RI DBR for holding or disbursing insurance claim proceeds?

### Required Disclosures

The following disclosure placeholders must be reviewed and finalized by Rhode Island-licensed counsel before any product launch:

#### A. Token Collateral Disclosure
> "COUNSEL_APPROVED_TEXT_REQUIRED. [Platform Name] may maintain control of virtual currency on your behalf. Rhode Island law requires certain disclosures about virtual currency. Virtual currency is not legal tender, is not backed by the United States government, and is not subject to FDIC or SIPC protections. Transfers of virtual currency are generally irrevocable. For questions or complaints, contact the Rhode Island Department of Business Regulation, Division of Banking."

#### B. Lending/Finance Disclosure
> "COUNSEL_APPROVED_TEXT_REQUIRED. This [loan/advance] is subject to Rhode Island lending laws. The maximum annual percentage rate (APR) permitted under Rhode Island law is [RATE]%. Any rate exceeding [RATE]% would be usurious and void. You have the right to file complaints with the Rhode Island Department of Business Regulation. This is not legal advice. Consult an attorney if you have questions."

#### C. Assignment of Benefits Disclosure
> "COUNSEL_APPROVED_TEXT_REQUIRED. By signing this Assignment of Benefits, you are transferring your right to receive insurance claim payments directly to [Assignee]. You remain responsible for complying with all terms and conditions of your insurance policy. This assignment does not authorize [Assignee] to negotiate your claim with the insurance company. If you need assistance negotiating your claim, you should contact a licensed public adjuster or an attorney."

#### D. Public Adjuster Prohibition Disclosure
> "COUNSEL_APPROVED_TEXT_REQUIRED. [Platform Name] and its representatives are NOT licensed public adjusters and do NOT negotiate insurance claims on your behalf. We cannot and do not advise you about the value of your claim, coverage disputes, or settlement strategies. For assistance with your insurance claim, you may contact your insurance company directly, hire a licensed public adjuster (verify license at the RI Department of Business Regulation), or consult an attorney."

#### E. General Consumer Protection Disclosure
> "COUNSEL_APPROVED_TEXT_REQUIRED. Under Rhode Island law, you have rights as a consumer. No person shall use unfair methods of competition or unfair or deceptive acts or practices in the conduct of trade or commerce. If you believe you have been treated unfairly, you may file a complaint with the Rhode Island Attorney General's Consumer Protection Unit or the Rhode Island Department of Business Regulation. Civil penalties of up to $10,000 per violation may apply to businesses that violate consumer protection laws."

#### F. Contractor Registration Verification Disclosure
> "COUNSEL_APPROVED_TEXT_REQUIRED. Contractors on this platform are required to be registered with the Rhode Island Contractors' Registration and Licensing Board. You may verify a contractor's registration at https://crb.ri.gov. Registration does not guarantee the quality of work. You should obtain multiple estimates and check references before hiring any contractor."

### Sources

- [^1] RI Department of Business Regulation — Division of Insurance, https://dbr.ri.gov/divisions/insurance
- RI General Laws — Title 27 (Insurance), https://webserver.rilegislature.gov/Statutes/TITLE27/INDEX.HTM
- RI General Laws — Chapter 27-10 (Insurance Adjusters), https://webserver.rilegislature.gov/Statutes/TITLE27/27-10/INDEX.HTM
- RI General Laws — Chapter 27-9.1 (Unfair Claims Settlement Practices), https://webserver.rilegislature.gov/Statutes/TITLE27/27-9.1/INDEX.HTM
- RI General Laws — Chapter 19-14.3 (Currency Transmission), https://webserver.rilegislature.gov/Statutes/TITLE19/19-14.3/INDEX.htm
- RI General Laws — Chapter 19-14.1 (Lenders and Loan Brokers), https://webserver.rilegislature.gov/Statutes/TITLE19/19-14.1/INDEX.htm
- RI General Laws — Chapter 19-14.2 (Small Loan Lenders), https://webserver.rilegislature.gov/Statutes/TITLE19/19-14.2/INDEX.htm
- RI General Laws — Chapter 6-26 (Interest and Usury), https://law.justia.com/codes/rhode-island/title-6/chapter-6-26/
- RI Contractors' Registration and Licensing Board, https://crb.ri.gov
- 230-RICR-20-50-4 (Insurance Claim Adjusters Reg), https://rules.sos.ri.gov/Regulations/part/230-20-50-4
- NAIC Adjuster Licensing Requirements Chart, https://content.naic.org/sites/default/files/model-law-chart-pl-40-adjuster-licensing-requirements.pdf
- *Latos v. Helios, Inc.*, 1986 WL 732866 (R.I. Super. 1986)
- *Mello v. Gen. Ins. of Am.*, 525 A.2d 1304 (R.I. 1987)

---

*This document is for research and informational purposes only. It does not constitute legal advice. All GCSC product features in Rhode Island are blocked pending legal review by licensed Rhode Island counsel.*
