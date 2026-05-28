# Indiana (IN) State Compliance — SmartContractor

**Research Date:** 2026-07-08  
**Version:** 2.0  
**Status:** COMPLETE — Reformulated into 10 sections with escrow-backed advance rules

---

## 1. Regulatory Overview & Key Agencies

Indiana presents a **moderately complex regulatory environment** for SmartContractor. There is no single unified regulator — product components fall under three distinct state agencies:

| Agency | Jurisdiction | Website |
|--------|-------------|---------|
| Indiana Department of Insurance (IDOI) | Insurance licensing, adjuster regulation, claims practices, public adjuster oversight | https://www.in.gov/idoi/ |
| Indiana Department of Financial Institutions (DFI) | Consumer lending, money transmission, escrow regulation, digital asset oversight | https://www.in.gov/dfi/ |
| Indiana Professional Licensing Agency (IPLA) | State-level plumbing contractor licensing; professional occupation regulation | https://www.in.gov/pla/ |

**Key structural facts:**
- Indiana has **no statewide general contractor license**. Contractor licensing is **municipal/county-level**.
- The **Uniform Consumer Credit Code** (IUCCC, Ind. Code 24-4.5) requires a Consumer Loan License for consumer-purpose lending, administered by DFI via NMLS.
- **21% usury cap** applies to loans under $50,000 unless the lender is properly licensed under IUCCC (Ind. Code 24-4.3-102). Licensed supervised lenders may charge higher tiered rates.
- **Digital asset regulation** was significantly clarified by **HEA 1042**, enacted March 3, 2026, effective July 1, 2026 — creating one of the more favorable statutory environments for noncustodial blockchain activity in the U.S.
- **Escrow activity** is regulated through DFI; escrow agents must generally be licensed or exempt under Indiana law.
- **Assignment of Benefits** is generally permitted post-loss for property insurance claims — Indiana has no AOB prohibition statute.
- **Public adjuster licensing is mandatory** and heavily regulated under IC 27-1-27 (substantially amended by HB 1329, effective July 1, 2023).
- There is **no specific BitLicense equivalent**; cryptocurrency/digital asset regulation is evolving but now has a statutory foundation under HEA 1042.

---

## 2. Lending & Consumer Credit (IUCCC)

### 2.1 Consumer Loan Licensing
- **Statute:** Indiana Uniform Consumer Credit Code (IUCCC), Ind. Code 24-4.5 et seq.
- **Regulator:** DFI Consumer Credit Division
- **License:** "Consumer Loan License" required for making consumer loans to Indiana residents. Processed through NMLS. Annual fee $100; application fee $1,000 plus background checks.
- **Scope:** Applies to extensions of credit to Indiana consumers regardless of lender location, if advertising or soliciting within the state.

### 2.2 Rate Caps & Usury
- **Unlicensed loans under $50,000:** Hard 21% usury cap applies unless licensed (Ind. Code 24-4.3-102).
- **Licensed supervised loans (tiered):**
  - Up to 36% APR on first $2,000
  - 21% on $2,000–$4,000
  - 15% on amounts above $4,000
- Rates are subject to periodic adjustment under IC 24-4.5-1-106.
- **Criminal usury (loan sharking):** Violations at 2x the maximum supervised loan rate constitute a Level 6 felony under IC 35-45-7.

### 2.3 Commercial / Business-Purpose Exemption
- Indiana **does not** generally require a license for commercial or business-purpose lending.
- Commercial-purpose contractor financing (working capital, equipment) likely falls outside IUCCC scope.
- Occasional non-commercial lenders may qualify for a "consumer related loan" exemption under IC 24-4.5-3-602 if not regularly engaged in lending.
- **Partnering with a licensed financial institution is strongly recommended** for any consumer-facing product.

### 2.4 Loan Brokering
- Loan Broker License administered by the Indiana Secretary of State, Securities Division — not DFI.
- Required for brokering residential mortgage loans; processed through NMLS.

### 2.5 CPAP (Civil Proceeding Advance Payments)
- **Statute:** IC 24-12-4 — Indiana regulates lawsuit lending.
- License required for providers making 15+ CPAP transactions per year.
- Rate caps: up to 36% annual fee, up to 7% annual servicing charge, documentation fees $200–$500 depending on advance size.
- **HB 1124 (2023):** CPAP agreements must be disclosed to all parties and insurers in a civil proceeding; contracts are discoverable but not admissible as evidence.

### 2.6 Collection/Servicing
- In-state collectors must be licensed as collection agencies through the Indiana Secretary of State, Securities Division, with a $5,000 bond.
- **Out-of-state collectors:** *Wertz v. Asset Acceptance, LLC* (Ind. Ct. App. 2014) held that out-of-state debt collectors with no Indiana physical presence are NOT required to obtain an Indiana license.

---

## 3. Money Transmission & Digital Assets

### 3.1 Money Transmission Licensing
- **Statute:** Indiana Money Transmission Modernization Act, Ind. Code Title 28, Article 8 (IC 28-8-4.1)
- **License required for:** Selling/issuing payment instruments or stored value to Indiana persons; receiving money for transmission from Indiana persons.
- **Effective January 1, 2024:** Business-purpose money transmission became subject to licensing (previously consumer-purpose only).
- DFI guidance states that DFI does not license or regulate the holding, transmittal, or exchange of cryptocurrency directly. However, DFI may require licensure for businesses engaging in cryptocurrency services **while also** engaging in money transmission involving customer fiat funds.

### 3.2 HEA 1042 — Digital Asset Framework (Effective July 1, 2026)

Indiana enacted HEA 1042 on March 3, 2026, creating a comprehensive statutory framework:

| Term | Statutory Definition (IC 5-36-1) |
|------|---------------------------------|
| **Cryptocurrency** | Virtual currency not issued by a central authority, functioning as a medium of exchange, using encryption to regulate generation and verify transfers (excludes payment stablecoins) |
| **Digital asset** | Includes virtual currency, cryptocurrency, payment stablecoins, fungible and non-fungible tokens, and other electronic assets conferring economic, proprietary, or access rights |
| **Smart contract** | A computer program hosted and executed on a blockchain network; code specifying predetermined conditions that, when met, trigger predetermined outcomes |
| **Self-hosted wallet** | A digital interface used to secure and transfer digital assets while retaining independent control by the owner |

**Critical provisions for SmartContractor:**
1. **Noncustodial transfers excluded from money transmission** (IC 28-8-4.1-201(19)): Development or use of software for noncustodial transfer of digital assets does not, by itself, constitute money transmission. This is favorable for noncustodial token collateral mechanisms.
2. **DFI exclusive authority** (IC 5-36-2): No other public agency may adopt rules prohibiting, restricting, or impairing the ability to use/accept digital assets as payment or to take custody via self-hosted/hardware wallets.
3. **Blockchain activity protections** (IC 5-36-2, IC 36-1-30.5): Operating nodes, developing blockchain software, transferring digital assets, and staking are all protected activities.
4. **Private key privilege** (IC 34-46-7 / IC 35-37-7): Courts may compel disclosure of a private key ONLY if no other admissible information is sufficient to provide access.

### 3.3 Token Collateral Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Noncustodial token lock | NOT money transmission | Explicit statutory exclusion effective 7/1/2026 |
| Custodial token holding | Requires legal analysis | Different regulatory treatment if SmartContractor holds customer tokens |
| Smart contract execution | Protected activity | Statutorily defined and protected |
| Token collateral for lending | NOVEL — untested | No Indiana statute specifically addresses token-secured lending |
| Automated liquidation | COUNSEL REVIEW REQUIRED | No case law identified; liquidation mechanics must be reviewed |

**No specific BitLicense exists in Indiana.** Crypto regulation is evolving but HEA 1042 provides meaningful clarity. Using token collateral to secure loans or insurance claim advances remains a novel legal structure with no Indiana-specific precedent.

---

## 4. Escrow-Backed Contractor Advance Rules

### 4.1 Escrow Regulation in Indiana
- **Regulator:** Indiana Department of Financial Institutions (DFI) oversees escrow activity.
- Indiana regulates escrow agents through DFI. Escrow agents must generally be licensed or fall under a statutory exemption.
- **Ind. Code Title 28, Article 8** (Money Transmission Modernization Act) and related DFI regulations govern the holding of funds in escrow for third parties.
- Any SmartContractor arrangement involving the holding of contractor advance funds in escrow must comply with DFI escrow licensing requirements or qualify for an applicable exemption.

### 4.2 Escrow-Backed Advance Structure
An escrow-backed contractor advance involves:
1. **Advance funding** — funds are deposited into an escrow account controlled by a licensed escrow agent or exempt entity.
2. **Milestone-based release** — funds are released from escrow to the contractor upon verification of completed work milestones or material delivery.
3. **Claim proceeds assignment** — repayment may be structured from assigned insurance claim proceeds, with the escrow agent coordinating disbursement.

### 4.3 Regulatory Requirements
- **Escrow agent licensing:** If SmartContractor or a partner holds advance funds for disbursement to contractors, DFI licensing as an escrow agent or money transmitter may be triggered unless an exemption applies.
- **Commingling prohibition:** Escrow funds must be maintained in segregated accounts and cannot be commingled with operating funds.
- **Record keeping:** Detailed transaction records, reconciliation statements, and audit trails are required.
- **Fiduciary duties:** Escrow agents owe fiduciary duties to all parties; breach can result in DFI enforcement action and civil liability.

### 4.4 Compliance Checklist for Escrow-Backed Advances
| Requirement | Status | Detail |
|-------------|--------|--------|
| Escrow agent licensed or exempt | REQUIRED | Verify DFI licensure or exemption before holding funds |
| Segregated escrow accounts | REQUIRED | Funds must not commingle with operational accounts |
| Written escrow agreement | REQUIRED | Must specify disbursement conditions, fees, and timelines |
| Milestone verification | REQUIRED | Independent verification before funds released |
| Consumer purpose characterization | COUNSEL REVIEW | If advance benefits homeowner, IUCCC may apply |
| Business purpose certification | REQUIRED | Contractor must certify business-purpose use |
| Insurance claim proceeds coordination | COUNSEL REVIEW | Mortgagee involvement and AOB terms must be addressed |

### 4.5 Key Risks
- **Unauthorized escrow activity:** Acting as an escrow agent without DFI licensure or exemption is a violation of Indiana law.
- **Consumer lending trigger:** If escrow-backed advances are extended to homeowners (even indirectly), IUCCC licensing and rate caps may apply.
- **Money transmission nexus:** Holding and disbursing funds on behalf of others may constitute money transmission if not structured carefully.
- **Mortgagee coordination:** If insurance claim proceeds are the repayment source, mortgage servicer loss draft departments must be coordinated with early in the process.

### 4.6 Practical Implementation Notes
- SmartContractor should **partner with a DFI-licensed escrow agent** rather than attempt to hold escrow funds directly.
- All escrow-backed advance products should be reviewed by Indiana-licensed counsel before deployment.
- Escrow fee structures must be disclosed transparently in advance.
- Milestone verification should use objective, verifiable criteria (e.g., inspection reports, material delivery receipts, photo documentation).

---

## 5. Contractor Licensing & HICA

### 5.1 Contractor Licensing Structure
- **No statewide general contractor license in Indiana.** Licensing is handled at the **municipal/county level**.
- **Plumbing contractors:** Licensed at the state level by IPLA Plumbing Commission.
- **Electrical and HVAC contractors:** Licensed locally, not at the state level.
- General contractors must register with each jurisdiction where they operate (Indianapolis, Fort Wayne, Evansville, South Bend, etc.).
- **Typical local requirements:** General liability insurance ($500K–$1M), surety bond ($5K–$25K depending on jurisdiction/trade), workers' compensation insurance.

### 5.2 Home Improvement Contract Act (HICA) — IC 24-5-11
- **Applies to:** Contracts for home improvements to residential property exceeding $150 (materials + labor + services).
- **Key requirements:**
  - Contract must be in writing with specific terms (names, addresses, work description, start/completion dates, price, signatures).
  - Contractor must sign **before** homeowner is required to sign or make any down payment.
  - Homeowner must receive a fully executed copy immediately upon signing.
  - Contract must be readable and understandable.
  - Modifications must be in writing signed by the consumer.
  - **3-business-day cancellation right** after signing.
  - **Insurance claim special rule:** If insurer denies coverage, homeowner may cancel within 3 business days of denial notice.
- **Enforcement:** Any HICA violation constitutes a "deceptive act" under the Indiana Deceptive Consumer Sales Act (IC 24-5-0.5), exposing contractors to actual damages, treble damages (up to $1,000 cap for willful violations), attorney fees, and voidable contracts.

### 5.3 Contractor Financing Notes
- Commercial-purpose loans to contractors (equipment, working capital) are generally NOT regulated under IUCCC if primarily for business purpose.
- Equipment financing and factoring arrangements may fall outside IUCCC scope.
- If financing is offered to homeowners for home improvements, IUCCC consumer lending rules apply.

---

## 6. Insurance Claims & Additional Living Expenses

### 6.1 Claim Payment Standards
- Indiana does not have a specific statute mandating emergency advance payments on property insurance claims.
- The **Unfair Claim Settlement Practices Act** (IC 27-4-1 et seq.) incorporates common law duties of good faith and fair dealing, including obligations to refrain from unfounded refusal to pay or causing unfounded delays.
- Standard industry practice: insurers may issue advance payments for emergency repairs and ALE while the claim is being processed.
- **No Indiana-specific statute** was found mandating a specific number of days for property claim payment.

### 6.2 Additional Living Expenses (ALE)
- ALE coverage is standard in Indiana homeowner policies.
- Covers temporary housing, meals (if no kitchen), and other expenses above normal living costs while the home is uninhabitable.
- Indiana specifically requires insurers to offer **mine subsidence ALE coverage** of up to $15,000 in certain counties (IC 27-7-9).
- ALE is generally paid directly to the homeowner (not to contractors).

### 6.3 Direction to Pay / Claim Proceeds
- Insurers may pay contractors directly if the homeowner signs a "direction to pay" form.
- Assignment of claim benefits to contractors appears generally permitted in Indiana (no prohibitory statute identified), subject to policy terms.
- Mortgage lenders named on the policy will be included on claim checks; standard loss draft procedures apply.

---

## 7. Assignment of Benefits (AOB)

### 7.1 AOB Status: ALLOWED — Not Heavily Regulated
- Indiana **does NOT have a specific statute** that prohibits, restricts, or heavily regulates Assignment of Benefits for property insurance claims.
- Post-loss assignment of insurance claims is generally permitted under common law principles, even if the policy contains a non-assignment clause, because post-loss claims are treated as chose in action that can be assigned.
- Unlike Florida (which effectively banned post-loss AOBs as of 2023), Indiana provides flexibility.

### 7.2 Practical Implications
- A homeowner may assign insurance claim proceeds to a contractor or financing entity.
- Mortgage lender consent may be required if the lender is a named insured.
- SmartContractor should review policy terms carefully, as some policies may contain anti-assignment clauses (though post-loss assignments are generally valid despite such clauses).
- Any AOB arrangement should clearly specify which claim components are assigned (e.g., dwelling repair proceeds only, NOT ALE, NOT contents).

### 7.3 AOB Risk Assessment: MEDIUM
- Lack of specific AOB regulation creates flexibility but also uncertainty.
- No required rescission period, no mandated font size, no itemized estimate requirement.
- General contract law, HICA (for home improvement contracts), and consumer protection laws still apply.
- **Public adjuster contracts** may specify that the PA is named as a **co-payee** on an insurer's payment (IC 27-1-27-16(b)).
- Public adjuster contracts may NOT: (1) allow PA to collect entire fee from first payment if multiple payments expected; (2) require insured to authorize checks ONLY in PA's name; (3) give PA power of attorney; (4) allow PA to perform as roofing contractor, appraiser, or any non-adjuster role (IC 27-1-27-15).

---

## 8. Public Adjuster Regulations

### 8.1 Licensing Requirements (IC 27-1-27, as amended by HB 1329, eff. July 1, 2023)
- Must be at least 18 years old, Indiana resident, of good reputation.
- Must pass the public adjuster written examination.
- Must submit application to IDOI (via Sircon or NAIC paper application).
- Must maintain a **$10,000 surety bond** for Indiana.
- License fee: $50. Licenses expire December 31 annually.

### 8.2 Contract Requirements (IC 27-1-27-16)
Public adjuster contracts MUST be in writing and contain:
1. Legible full name of PA as in department records
2. Permanent home state business address, email, and phone number
3. Certificate of authority (license) number
4. Title "Public Adjuster Contract" prominently at top of first page
5. Full name/address of insured; insurance company name and policy number
6. Description of loss and location
7. Description of services to be provided
8. Signatures of PA (or authorized representative) AND insured
9. Date and time of signing by both parties
10. Attestation language stating PA is fully bonded under Indiana law
11. Statement of full salary, fee, commission, or other consideration

### 8.3 Prohibited Contract Terms (IC 27-1-27-15)
- Fee collection from first payment only when multiple payments expected
- Requirement that insured authorize checks ONLY in PA's name
- Terms precluding civil remedies or PA's liability for negligence
- Terms allowing PA to act as roofing contractor, appraiser, or any non-adjuster role
- **Power of attorney** to act in place of the insured

### 8.4 Disclosure of Financial Interests (IC 27-1-27-12)
Before entering a contract, a PA must disclose in writing any direct/indirect financial interest with construction firms, salvage firms, lawyers/law firms, building appraisal firms, board-up companies, or any firm providing estimates or performing work related to the insured loss.

### 8.5 Cancellation Rights (IC 27-1-27-18, IC 27-1-27-19)
- **5-business-day cancellation window:** Insured may void PA contract within 5 business days after the insurer is provided a copy of the contract.
- Voiding by written notice via registered/certified mail, personal service, or email with read receipt.
- If insurer pays or commits in writing to pay the policy limit within 5 business days of loss reporting, PA cannot receive percentage-based commission; only reasonable time-based compensation allowed.

### 8.6 Critical Separation of Roles
- Indiana law **PROHIBITS** a public adjuster from acting as a contractor, appraiser, or in any role other than rendering advice/assistance in claim adjustment.
- **SmartContractor and its contractor partners MUST NOT engage in public adjuster activities** (negotiating with insurers on behalf of homeowners, interpreting policy coverage, documenting claims for settlement purposes) unless separately licensed as public adjusters.
- Contractors may perform repair work and bill insurers, but **negotiating the claim settlement is restricted to licensed adjusters**.

---

## 9. Mortgagee & Loss Draft Rules

### 9.1 Mortgagee Involvement in Claim Payments
- When a mortgagee (lender) is named on the homeowner's insurance policy, claim checks are typically made payable to both the homeowner and the mortgagee.
- **No Indiana-specific loss draft processing statute** was identified. Industry-standard procedures apply.

### 9.2 Industry-Standard Loss Draft Procedures
- Borrower endorses check and forwards to mortgage servicer with required documentation.
- If loan is current and claim is less than or equal to $40,000, servicer may endorse and return check to borrower.
- If claim exceeds $40,000, servicer typically deposits check into escrow and issues incremental disbursements based on inspection progress.
- If loan is delinquent, more restrictive disbursement rules apply (smaller initial disbursement, more frequent inspections).

### 9.3 Indiana-Specific Context
- Indiana has a relatively high rate of mortgage inclusion on insurance policies.
- Mortgage servicers have significant control over claim proceeds disbursement.
- Any SmartContractor arrangement involving claim proceeds must account for mortgagee involvement; the mortgage servicer's loss draft department will be an additional party in the process.
- Escrow-backed advance structures (Section 4) must coordinate with mortgage servicers early to avoid disbursement conflicts.

---

## 10. Compliance Dashboard & Required Disclosures

### 10.1 SmartContractor Product Status Dashboard

```json
{
  "state": "IN",
  "state_name": "Indiana",
  "token_collateral_equipment_credit": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": ["licensed_contractors_business_purpose"],
    "blocked_actions": [
      "live_loan_creation_consumer_purpose",
      "token_collateral_lock_consumer",
      "liquidation_without_counsel_review",
      "repayment_routing_from_consumer_loans"
    ],
    "required_reviews": ["legal", "provider", "compliance"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "BUSINESS_PURPOSE_CERTIFICATION_REQUIRED",
      "NONCUSTODIAL_MECHANISM_DISCLOSURE"
    ],
    "notes": "HEA 1042 (eff. 7/1/2026) excludes noncustodial digital asset transfers from money transmission licensing and protects smart contracts/blockchain activity. Favorable for noncustodial token collateral. Token-secured lending remains novel with no Indiana precedent. Business-purpose contractor equipment financing falls outside IUCCC. Consumer-purpose lending requires DFI Consumer Loan License. Liquidation mechanisms require counsel review. All live loan creation BLOCKED pending legal review."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": [
      "insurance_claim_advance",
      "assignment_of_benefits_processing",
      "claim_financing",
      "repayment_from_claim_proceeds",
      "direction_to_pay_acceptance"
    ],
    "required_reviews": ["legal", "provider", "insurance"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "NOT_A_PUBLIC_ADJUSTER_DISCLOSURE",
      "MORTGAGEE_NOTICE_REQUIRED"
    ],
    "notes": "Insurance claim advance products are BLOCKED in Indiana pending comprehensive legal review. Intersection of: (1) advance payments secured by claim proceeds; (2) potential mortgagee involvement; (3) public adjuster restrictions preventing claim negotiation by unlicensed parties; and (4) possible IUCCC triggering if advance is deemed consumer credit, creates significant legal risk. May only proceed after counsel determines product does not constitute unauthorized public adjusting, consumer lending, or insurance claim manipulation."
  },
  "escrow_backed_contractor_advance": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": ["licensed_contractors_business_purpose"],
    "blocked_actions": [
      "escrow_fund_holding_without_license_or_exemption",
      "consumer_purpose_escrow_advance",
      "unverified_milestone_disbursement"
    ],
    "required_reviews": ["legal", "provider", "compliance", "escrow_agent"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "BUSINESS_PURPOSE_CERTIFICATION_REQUIRED",
      "ESCROW_AGREEMENT_REQUIRED",
      "MORTGAGEE_NOTICE_REQUIRED"
    ],
    "notes": "Escrow-backed contractor advances may proceed only with a DFI-licensed escrow agent or statutorily exempt entity. All escrow funds must be held in segregated accounts. Milestone verification required before disbursement. Business-purpose characterization essential to avoid IUCCC triggering. Coordinate with mortgage servicers when claim proceeds are repayment source."
  },
  "contractor_flow_status": "DEMO_ONLY — Contractor equipment financing may proceed as business-purpose loans after counsel confirms non-custodial token collateral mechanism complies with HEA 1042. Live loan creation BLOCKED pending legal review. Contractor must be properly licensed at local/municipal level.",
  "homeowner_flow_status": "BLOCKED — Any product offering credit/advances to homeowners for insurance claim-related purposes is BLOCKED. Requires DFI Consumer Loan License if structured as credit. Risk of unauthorized public adjusting if contractor negotiates claim with insurer. Home improvement contracts must comply with HICA (IC 24-5-11).",
  "restoration_company_flow_status": "BLOCKED_PENDING_LEGAL_REVIEW — Restoration companies work directly with homeowners and insurers. AOB may be permitted, but restoration companies cannot act as public adjusters. Any financing arrangement requires business-purpose characterization and local licensing verification."
}
```

### 10.2 Required Disclosures

#### Disclosure 1: Not a Public Adjuster
```
IMPORTANT NOTICE — READ BEFORE SIGNING

[COUNSEL_APPROVED_TEXT_REQUIRED]

SmartContractor and its representatives are NOT licensed public 
adjusters under Indiana law. We do NOT negotiate with your insurance 
company on your behalf, interpret your insurance policy, or determine 
the amount of your claim. If you need assistance negotiating your 
insurance claim, you have the right to hire a licensed public 
adjuster. You may contact the Indiana Department of Insurance at 
1-800-622-4461 for a list of licensed public adjusters or for 
more information about your rights.

[This disclosure must be provided in every transaction involving 
insurance claims or insurance-related financing.]
```

#### Disclosure 2: Business Purpose Certification (Contractor Financing)
```
BUSINESS PURPOSE CERTIFICATION

[COUNSEL_APPROVED_TEXT_REQUIRED]

I, the undersigned, certify that the financing requested is for 
business purposes only, to be used for my contracting business 
equipment, working capital, or business operations. I understand 
that this financing is NOT a consumer loan and is not subject to 
the protections of the Indiana Uniform Consumer Credit Code. 

I acknowledge that I am a licensed contractor [or business entity 
engaged in the construction contracting business] and that the 
proceeds of this financing will be used exclusively for business 
purposes.

Signature: ___________________ Date: _____________
```

#### Disclosure 3: Token Collateral Risk Disclosure
```
DIGITAL ASSET COLLATERAL RISK DISCLOSURE

[COUNSEL_APPROVED_TEXT_REQUIRED]

You are using a digital asset (cryptocurrency/token) as collateral 
for this transaction. Indiana law recognizes digital assets and 
protects blockchain-based transactions under HEA 1042 (effective 
July 1, 2026), but using digital assets as collateral involves 
significant risks, including:

1. The value of digital assets can be extremely volatile and may 
   decline significantly, which could result in liquidation of your 
   collateral.
2. Smart contracts execute automatically based on predetermined 
   conditions. Once executed, transactions generally cannot be 
   reversed.
3. If you lose access to your private keys or wallet, you may 
   permanently lose access to your digital assets.
4. Digital asset regulation continues to evolve. Changes in law 
   may affect your rights or the enforceability of this transaction.
5. [COUNSEL_TO_ADD_LIQUIDATION_TRIGGER_DISCLOSURE]

This transaction uses a noncustodial smart contract mechanism. 
[COUNSEL_TO_ADD_SPECIFIC_MECHANISM_DESCRIPTION].
```

#### Disclosure 4: Escrow Agreement Disclosure
```
ESCROW AGREEMENT NOTICE

[COUNSEL_APPROVED_TEXT_REQUIRED]

Funds for this contractor advance are being held in escrow by 
[ESCROW_AGENT_NAME], a [licensed escrow agent / statutorily exempt 
entity] under Indiana law. Funds will be released only upon 
verification of completed work milestones as specified in your 
escrow agreement.

You have the right to review the escrow agreement before signing. 
Escrow fees, if any, will be disclosed in writing. Funds are held 
in a segregated account and are not commingled with the escrow 
agent's operating funds.

For questions about escrow regulation in Indiana, contact the 
Indiana Department of Financial Institutions at (317) 232-3955.
```

#### Disclosure 5: No Insurance Claim Advance Guarantee
```
NO INSURANCE CLAIM ADVANCE GUARANTEE

[COUNSEL_APPROVED_TEXT_REQUIRED]

SmartContractor does NOT guarantee that your insurance claim will 
be approved, that you will receive any specific amount, or that 
payment will be made within any specific timeframe. Any advance or 
financing provided to you is independent of your insurance claim 
and does not affect your insurer's obligation to investigate and 
process your claim according to Indiana law and the terms of your 
policy.

Your obligation to repay any advance or financing is NOT dependent 
on the outcome of your insurance claim unless specifically stated 
in a separate written agreement signed by both parties.

If you have a mortgage on your property, your mortgage lender may 
be entitled to participate in claim proceeds and may control the 
disbursement of insurance funds.
```

#### Disclosure 6: Indiana Home Improvement Contract Notice
```
HOME IMPROVEMENT CONTRACT NOTICE

[COUNSEL_APPROVED_TEXT_REQUIRED]

Under Indiana law (the Home Improvement Contract Act, IC 24-5-11), 
any contract for home improvements exceeding $150 must be in 
writing and must include specific information. You have the right 
to cancel this contract within three (3) business days of signing.

You are NOT required to sign an assignment of your insurance 
benefits to obtain financing or to have repairs completed. Before 
signing any document that assigns your insurance claim rights, 
you should read it carefully and consider consulting an attorney.

The contractor is prohibited from:
- Offering to waive or rebate your insurance deductible
- Offering any consideration in exchange for filing an insurance claim
- Acting as a public adjuster unless separately licensed by the 
  Indiana Department of Insurance
```

### 10.3 Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **MEDIUM** | IUCCC licensing required for consumer-purpose loans. Business-purpose contractor financing generally exempt. Partnering with licensed financial institution mitigates risk. Criminal usury threshold is 2x max supervised loan rate. |
| Escrow Risk | **MEDIUM** | DFI regulates escrow activity. Licensed escrow agent or exemption required. Segregated accounts and fiduciary duties apply. Mischaracterization of escrow activity as non-regulated could trigger enforcement. |
| Insurance Claim Risk | **MEDIUM-HIGH** | No Indiana-specific claim advance statute creates uncertainty. Unfair Claim Settlement Practices Act applies broadly. Mortgagee involvement adds complexity. Public adjuster restrictions prevent unlicensed claim negotiation. |
| AOB Risk | **MEDIUM** | AOB is NOT prohibited in Indiana for property claims. No specific AOB statute provides a clear framework. General contract law applies. Must avoid public adjuster territory and comply with HICA. |
| Public Adjuster Risk | **HIGH** | Indiana heavily regulates public adjusters. SmartContractor and contractors must NOT engage in claim negotiation, policy interpretation, or claim documentation for settlement. Unauthorized public adjusting is a serious violation. |
| Token Collateral Risk | **MEDIUM** | HEA 1042 significantly reduces risk by excluding noncustodial transfers from money transmission licensing and protecting smart contracts. Token-secured lending is novel; liquidation mechanics have no precedent. |
| Consumer Protection Risk | **MEDIUM-HIGH** | HICA creates strict requirements and significant penalties. Deceptive Consumer Sales Act applies broadly. Three-business-day cancellation rights for home improvement contracts. |

---

## APPENDIX A: Key Indiana Statutes by Citation

| Citation | Subject | Relevance |
|----------|---------|-----------|
| IC 24-4.5 et seq. | Uniform Consumer Credit Code | Consumer lending licensing, rates, disclosures |
| IC 24-4.3-102 | Usury cap (21% for loans under $50K) | Unlicensed lending rate limit |
| IC 24-5-11 | Home Improvement Contract Act | Contractor contract requirements, homeowner protections |
| IC 24-5-0.5 | Deceptive Consumer Sales Act | Penalties for HICA violations; consumer remedies |
| IC 24-12-4 | Civil Proceeding Advance Payments | Lawsuit lending regulation |
| IC 27-1-27 | Public Adjusters | Licensing, contracts, prohibited acts |
| IC 27-1-28 | Independent Adjusters | Independent adjuster licensing |
| IC 27-4-1 | Unfair Claim Settlement Practices | Good faith claims handling obligations |
| IC 27-7-9 | Mine Subsidence Insurance | Specific ALE coverage requirements |
| IC 28-8-4.1 | Money Transmission Modernization Act | Money transmission licensing; crypto exclusion |
| IC 5-36-1 through IC 5-36-3 | Digital Asset Regulation (HEA 1042) | Digital asset definitions; agency authority limits |
| IC 34-46-7 | Digital Asset Private Key Privilege | Court compelled disclosure limited |
| IC 35-45-7 | Loan Sharking | Criminal usury threshold |

---

## APPENDIX B: Licensing Agency Contact Information

| Agency | Address | Phone | Email |
|--------|---------|-------|-------|
| Indiana Department of Insurance (IDOI) | 311 W Washington St, Ste 300, Indianapolis, IN 46204 | (317) 232-2385 | idoi@idoi.in.gov |
| Indiana Department of Financial Institutions (DFI) | 30 S Meridian St, Ste 300, Indianapolis, IN 46204 | (317) 232-3955 | dfilicensing@dfi.in.gov |
| Indiana Secretary of State — Securities Division | 302 W Washington St, Rm E-111, Indianapolis, IN 46204 | (317) 232-6681 | securities@sos.in.gov |
| Indiana Professional Licensing Agency (IPLA) | 402 W Washington St, Rm W072, Indianapolis, IN 46204 | (317) 234-8800 | pla@pla.in.gov |

---

*This compliance file is for informational purposes only and does not constitute legal advice. All SmartContractor products and services must be reviewed by Indiana-licensed legal counsel before deployment. All lending, escrow, token collateral lock, liquidation, insurance claim advance, assignment of benefits, and repayment routing activities must be approved by legal counsel before proceeding.*

*File prepared: July 2026*  
*Next review date: Upon significant regulatory change or before pilot launch, whichever is earlier*
