# Arkansas SmartContractor Compliance Research

## 1. Executive Summary

| Category | Status |
|----------|--------|
| Overall Risk | Blocked until licensed attorney review |
| Contractor / Home Improvement | Medium legal review needed |
| Lending / Credit | Blocked until licensed attorney review |
| Escrow-Backed Contractor Advance | Blocked — no specific statute; high consumer protection enforcement |
| Token Collateral / Digital Asset | Blocked until licensed attorney review |
| Insurance Claim Advance (ClaimBridge) | Blocked until licensed attorney review |
| Assignment of Benefits | Restricted — no property AOB statute; post-loss common law only |

Arkansas presents a **HIGH-REGULATION** environment for SmartContractor products, driven by five critical factors:

1. **Public adjusters are PROHIBITED** — Arkansas is one of the few states that completely bans public adjusting. Contractors and GCSC representatives must not negotiate with insurers on behalf of homeowners. This is considered the unauthorized practice of law.

2. **Strict usury limits** — The Arkansas Constitution (Amendment 89) caps interest at **17% per annum** for non-bank loans under $2,000; for loans over $2,000, the rate is 5% above the federal discount rate (Ark. Code Ann. § 4-57-104). Violations result in forfeiture of principal and interest.

3. **No property insurance Assignment of Benefits statute** — AOB in Arkansas is limited to health care providers (AR Code § 23-99-1302). No clear statutory mechanism exists for contractors to receive claim proceeds directly from insurers.

4. **No specific escrow-backed contractor advance statute** — While escrow services are generally regulated, there is no Arkansas-specific framework for escrow-backed advances to contractors. This creates legal uncertainty for any advance product structured around escrow holdbacks.

5. **Blockchain/smart contracts recognized** — AR Code § 25-32-122 gives legal validity to blockchain signatures, records, and smart contracts, which is favorable for the technology stack. However, token collateral activities may trigger money transmission licensing under the Arkansas Money Transmitter Act (Ark. Code Ann. § 23-55-501 et seq.).

**Bottom line:** All SmartContractor product lines remain **BLOCKED** in Arkansas pending state-specific legal counsel review.

---

## 2. Contractor / Home Improvement Rules

### Contractor Licensing

- **Regulator**: Arkansas Contractors Licensing Board (ACLB) — https://aclba.arkansas.gov/
- **Commercial projects**: License required for work of $50,000 or more
- **Residential projects**: License required for work of $2,000 or more
- **License types**: Commercial; Residential Builder; Residential Remodeler (Limited/Unlimited); Home Improvement Specialty (Limited/Unlimited)
- **Financial requirements**:
  - Commercial: Minimum $50,000 net worth ($20,000 for Light Building/Mechanical/Electrical)
  - Residential Builder: Positive net worth required
  - $10,000 contractor bond required for commercial licensees
- **No contractor financing-specific license exists.** Contractors may refer customers to financing sources but cannot themselves make loans or broker credit without separate licensing.

### Home Improvement Contract Rules

- **Written contract required** for projects exceeding $2,000 (AR Code § 17-25-101)
- **3-day right to cancel** for home improvement contracts signed in the consumer's home under the Arkansas Home Improvement Fraud Prevention Act (Act 817 of 2007)
- Contract must include: detailed description of work, payment terms, proof of insurance, mechanic's lien information, warranties
- **Cannot require specific contractor**: AR Code § 23-66-206(O) makes it an unfair practice for insurers to require repairs by a particular contractor as a condition of payment
- High consumer protection enforcement environment — strict penalties for home improvement fraud

### Implications for SmartContractor

- GCSC must verify contractor license via ACLB before any engagement
- Any contractor referral arrangement is permissible if the contractor does not itself make the loan or broker credit
- If SmartContractor is deemed to be "arranging credit" or "brokering loans," mortgage broker licensing or money transmission licensing analysis may be triggered

---

## 3. Lending / Credit Rules

### Consumer / Homeowner Lending

- **Is a consumer lending license required?** No specific non-bank consumer lender license exists in Arkansas
- **Usury cap (constitutional)**: Arkansas Constitution Amendment 89 caps interest at **17% per annum** for non-bank loans of $2,000 or less (Ark. Const. Amend. 89, § 3)
- **Usury cap (statutory)**: For loans over $2,000, maximum rate is **5% above the federal discount rate** (Ark. Code Ann. § 4-57-104)
- **Federal preemption exception**: National banks and FDIC-insured depository institutions may charge the interest rate permitted by their home state. Amendment 89 § 6 preserves federal preemption.
- **Penalties for usury**: Contracts with rates exceeding the maximum lawful rate are **void as to principal and interest** under Amendment 89 § 2. All unpaid principal may be forfeited.
- **No industrial loan company, consumer finance company, or supervised lender licensing regime exists.** This is unlike states with UCCC-based systems.

### Commercial / Contractor Lending

- No specific licensing requirement for commercial loans (non-real estate)
- The 17% usury cap / 5% above federal discount rate still applies unless the lender is a federally insured depository institution with federal preemption
- Business loans over $10,000 to corporations may be exempt from usury cap under certain conditions
- Persons extending or arranging credit exclusively for commercial or business purposes to partnerships or corporations may be exempt from certain restrictions

### Broker / Servicer Licensing

- **Mortgage lending**: Regulated by Arkansas Securities Department through NMLS. Mortgage Banker, Mortgage Broker, Mortgage Servicer, and MLO licenses required for residential mortgage lending.
- **Advance fee restriction**: Arkansas Code § 23-39-401 defines "advance fee" broadly as "any consideration which is assessed or collected prior to the closing of a loan by a loan broker." Likely applies to mortgage loans only.
- **Collection agency license**: Required under AR Code § 17-24-101. Licensed mortgage servicers and banks are exempt.
- **Bond**: $100,000–$200,000 surety bond required for mortgage licensees depending on loan volume.

### Key Risk for SmartContractor

Any financing product offered in Arkansas must comply with the **17% constitutional usury cap** (loans ≤$2,000) or the **5% above federal discount rate** (loans >$2,000) unless originated through a federally insured depository institution with federal rate preemption. Token-based collateral loans and insurance claim advances must be structured carefully to avoid exceeding these caps.

---

## 4. Escrow-Backed Contractor Advance Rules

### Current Statutory Landscape

- **No specific escrow-backed contractor advance statute exists in Arkansas.** There is no dedicated legal framework governing advances to contractors that are secured by or held in escrow pending project completion.
- **General escrow regulation**: Escrow services in Arkansas are generally provided by title companies, attorneys, or licensed financial institutions. Non-bank entities providing escrow-like services may trigger money transmission or trust account regulation.
- **Implication**: Any SmartContractor escrow-backed advance product would operate in a legal gray area, requiring careful structural analysis.

### Potential Regulatory Triggers

| Activity | Potential Trigger | Regulator |
|----------|-------------------|-----------|
| Holding homeowner funds in escrow for contractor disbursement | Money transmission or trust account rules | Arkansas Securities Department |
| Advancing funds to contractors against future insurance proceeds | Lending usury analysis; potentially "advance fee" rules | Arkansas Securities Department; ACLB |
| Escrow holdback pending inspection/completion | Escrow licensing if not performed by licensed entity | Arkansas Insurance Department; ACLB |
| Automated disbursement upon oracle/verification trigger | Money transmission (Ark. Code Ann. § 23-55-501) | Arkansas Securities Department |

### Money Transmitter Act Implications

- **Ark. Code Ann. § 23-55-501 et seq.** (Money Transmitter Act) defines "money transmission" as selling or issuing payment instruments, stored value, or receiving money or monetary value for transmission
- **"Monetary value"** is defined as "a medium of exchange, whether or not redeemable in money" — potentially broad enough to cover escrow-backed advance mechanisms involving digital disbursement
- **Licensing required**: Any person engaged in money transmission must obtain a license from the Arkansas Securities Department
- **Exemptions**: Banks, credit unions, and certain federally regulated entities are exempt

### Structuring Considerations for Escrow-Backed Advances

1. **Licensed escrow agent requirement**: Any escrow function should be performed by a licensed Arkansas escrow agent, title company, or attorney — not by SmartContractor directly
2. **Non-recourse advance characterization**: If structured as a purchase of receivables or non-recourse advance rather than a loan, usury analysis may differ. However, Arkansas courts may recharacterize transactions based on substance over form.
3. **Insurance proceeds as collateral**: Advances backed by anticipated insurance claim proceeds are complicated by:
   - No property AOB statute (Section 6)
   - Public adjuster prohibition (Section 7)
   - Mortgagee loss draft involvement (Section 8)
4. **Smart contract escrow**: While blockchain-based escrow mechanisms are legally recognized (AR Code § 25-32-122), the underlying activity must still comply with Arkansas financial regulation.

### Consumer Protection Enforcement

- Arkansas has **high consumer protection enforcement** standards
- The Arkansas Home Improvement Fraud Prevention Act provides strong homeowner remedies
- Any escrow-backed advance must include clear disclosures about:
  - Total cost of the advance
  - Any fees or interest charges (subject to usury caps)
  - Conditions for escrow release
  - Recourse vs. non-recourse nature
  - COUNSEL_APPROVED_TEXT_REQUIRED for all disclosures

### Risk Determination

**ESCROW_ADVANCE_BLOCKED_PENDING_COUNSEL_REVIEW**

No Arkansas statute specifically authorizes or prohibits escrow-backed contractor advances. The product intersects with money transmission, usury, contractor licensing, and insurance regulation simultaneously. Formal legal opinion required before any pilot or deployment.

---

## 5. Token Collateral / Digital Asset Risk

### Money Transmitter Risk

- **Regulator**: Arkansas Securities Department oversees money transmission (Ark. Code Ann. § 23-55-501 et seq.)
- **No specific BitLicense or cryptocurrency-specific law** in Arkansas, but cryptocurrency may be encompassed in existing money transmission statutes
- **"Monetary value"** defined as "a medium of exchange, whether or not redeemable in money" (AR Code § 23-55-102)
- **Money transmission** defined as "selling or issuing payment instruments, stored value, or receiving money or monetary value for transmission" — license required (AR Code § 23-55-201)
- **No-action letters**: ASD has issued case-by-case no-action letters:
  - Mythical, Inc. (June 22, 2020): Virtual currency in a video game exempted
  - River Financial, Inc. (May 21, 2020): Sale of own Bitcoin inventory exempted
- **GCSC analysis**: Whether token collateral lock/unlock and liquidation activities constitute "money transmission" or "stored value" is **UNCLEAR** and requires specific counsel review. The ASD's case-by-case approach means SmartContractor should seek a no-action letter or formal legal opinion before operating.

### Digital Asset / Token Rules

- **AR Code § 25-32-122**: Blockchain signatures, records, and smart contracts are legally recognized
- "Smart contract" defined as "business logic that runs on a blockchain" or "a software program that stores rules on a shared and replicated ledger"
- Smart contracts cannot be denied legal effect solely because they contain self-executing terms (§ 25-32-122(d)(1))
- **2021 UCC Amendment**: Security interest in virtual currency may be perfected by filing or by control (control is preferred to protect the secured party's interest)
- **No NFT perfection framework** exists in Arkansas (UCC Article 12 not yet adopted)

### Collateral / Liquidation Risk

- UCC framework for virtual currency collateral exists (2021 amendment)
- Whether token collateral lock/liquidation constitutes "money transmission" is unclear
- ASD's case-by-case approach through no-action letters means SmartContractor should seek a no-action letter
- Smart contracts legally recognized but do not legitimize otherwise unlawful activity (usury violations, unlicensed money transmission)
- **All token collateral operations blocked pending Arkansas-specific counsel review**

---

## 6. Insurance Claim Advance / ClaimBridge Risk

### Assignment of Benefits (AOB)

- **Is AOB allowed, restricted, or prohibited?** **Restricted — no property insurance AOB statute**
- **Health Insurance AOB**: AR Code § 23-99-1302 explicitly allows assignment of benefits for **health care providers only**: "A payor, upon receipt of the claim and notice of the assignment of benefits submitted by the healthcare provider, shall promptly remit payment of the claim directly to the healthcare provider."
- **Property Insurance AOB**: **No Arkansas statute specifically authorizes assignment of benefits for property insurance claims.** The general AOB statute is limited to health care and is located in the health insurance chapter.
- **General assignment principles**: Under common law, a policyholder may assign claim proceeds **after a loss occurs** (post-loss assignment). Pre-loss assignment of policy rights is generally prohibited unless the insurer consents.
- AOB generally permitted post-loss under common law, but no standardized statutory mechanism exists for contractors to receive payment directly from property insurers.

### Public Adjuster Restrictions

- **PUBLIC ADJUSTERS ARE PROHIBITED IN ARKANSAS**
- AR Code § 23-64-102(4)(A) defines an "adjuster" as someone who investigates and negotiates claims **"on behalf of the insurer."** The statute does not contemplate adjusting on behalf of an insured.
- No public adjuster licensing category exists; public adjusting is considered the **unauthorized practice of law**
- 2011 bill (S.B. 378) to create public adjuster licensing failed after three attempts
- Only **licensed attorneys** may represent homeowners in insurance claim negotiations
- Insurance consultants are licensed but may only advise on non-claim-specific matters

### Insurance Claim Proceeds

- **Prompt payment standards** (Rule 43 / Unfair Claims Settlement Practices):
  - Claim acknowledgment: Within 15 working days of notification
  - Investigation completion: Within 45 calendar days
  - Payment: Claim checks mailed/delivered within 10 working days after processing
  - Coverage denial: Written denial with specific policy provision cited within 15 working days
- **No Arkansas-specific statute** requiring insurers to provide emergency advance payments on property claims
- After past disasters, ASD has issued special rules requiring insurers to advance funds for temporary expenses

### Unfair Claims Practices (Prohibited)

- Requiring repairs by a particular contractor as a condition of payment (§ 23-66-206(O))
- Failing to attempt in good faith to effectuate prompt, fair, and equitable settlements (§ 23-66-206(F))
- Delaying investigation or payment by requiring duplicative submissions (§ 23-66-206(I))
- Compelling insureds to institute litigation by offering substantially less than amounts ultimately recovered (§ 23-66-206(K))

---

## 7. Dashboard Logic Recommendation

```json
{
  "state": "AR",
  "state_name": "Arkansas",
  "token_collateral_equipment_credit": {
    "status": "Blocked until licensed attorney review",
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "asd_no_action_letter", "security"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "17_PERCENT_USURY_CAP_DISCLOSURE",
      "TOKEN_VOLATILITY_RISK_DISCLOSURE",
      "MONEY_TRANSMISSION_LEGAL_OPINION"
    ],
    "notes": "Token collateral framework recognized under UCC (2021 amendment) and smart contracts legally valid under AR Code 25-32-122. However, token collateral lock/liquidation may trigger money transmission licensing under AR Code 23-55-501. 17% constitutional usury cap applies to non-bank loans ≤$2,000; 5% above federal discount rate for loans >$2,000. AR Securities Department issues no-action letters on case-by-case basis. PILOT_ELIGIBLE_AFTER_COUNSEL if no-action letter obtained and usury compliance confirmed."
  },
  "escrow_backed_contractor_advance": {
    "status": "Blocked — no specific statute",
    "blocked_actions": ["escrow_creation", "escrow_funding", "advance_disbursement", "escrow_release"],
    "required_reviews": ["legal", "asd_interpretation", "acl_b coordination"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "ESCROW_NO_STATUTE_DISCLOSURE",
      "USURY_CAP_DISCLOSURE",
      "MONEY_TRANSMISSION_RISK_NOTICE",
      "CONSUMER_PROTECTION_HIGH_ENFORCEMENT_NOTICE"
    ],
    "notes": "No Arkansas statute specifically authorizes escrow-backed contractor advances. Product intersects with money transmission, usury (17% cap / 5% federal discount rate), contractor licensing, and insurance regulation. Escrow services must be performed by licensed escrow agent, title company, or attorney. High consumer protection enforcement environment."
  },
  "claimbridge": {
    "status": "Blocked until licensed attorney review",
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds", "contractor_claim_negotiation"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "PUBLIC_ADJUSTER_PROHIBITION_NOTICE",
      "NO_PROPERTY_AOB_DISCLOSURE",
      "THREE_DAY_CANCEL_RIGHT_NOTICE",
      "MORTGAGEE_LOSS_DRAFT_DISCLOSURE"
    ],
    "notes": "PUBLIC ADJUSTERS PROHIBITED in Arkansas. Contractors/GCSC must not negotiate claims with insurers on homeowner's behalf — this is considered unauthorized practice of law. No property insurance AOB statute exists; health care AOB only (23-99-1302). Claim proceeds repayment routing complicated by mortgagee loss draft process. Home improvement contracts over $2,000 require written contract and 3-day cancellation right for in-home signings. Claim advance products likely constitute lending subject to 17% usury cap (≤$2,000) or 5% above federal discount rate (>$2,000)."
  },
  "contractor_flow_status": "Blocked — No specific statewide contractor financing prohibition identified, but any lending requires usury analysis and contractor must be ACLB-licensed",
  "homeowner_flow_status": "Blocked — Consumer lending subject to 17% constitutional usury cap; high consumer protection enforcement",
  "restoration_company_flow_status": "Blocked — Same analysis as contractor flow; public adjuster prohibition applies"
}
```

### Allowed Actions

- Verify ACLB contractor license
- Display claim status informationally (no negotiation)
- Provide repair estimates through licensed contractors
- Demo-only mode for all products

### Warnings Required

- "Public insurance adjusters are PROHIBITED in Arkansas"
- "Arkansas law does not provide assignment of benefits for property insurance claims"
- "Interest on non-bank loans is capped at 17% annually for loans of $2,000 or less; 5% above federal discount rate for larger loans"
- "Your mortgage lender may hold insurance proceeds in escrow"
- "No escrow-backed contractor advance statute exists in Arkansas"

### Blocked Buttons / Actions

| Action | Reason |
|--------|--------|
| AOB creation | No property AOB statute |
| Insurance claim advance issuance | Usury + public adjuster prohibition |
| Contractor claim negotiation | Unauthorized practice of law |
| Live loan creation | 17% usury cap / licensing |
| Token collateral lock | Money transmission uncertainty |
| Liquidation | Money transmission + counsel review |
| Escrow-backed advance | No specific statute; multi-regulatory overlap |

### Required Disclosures

- 17% usury cap / 5% federal discount rate disclosure
- Public adjuster prohibition notice
- No property AOB disclosure
- Three-day cancellation right notice for in-home contracts
- Mortgagee/loss draft disclosure
- Token collateral risk disclosure
- Escrow-backed advance no-statute disclosure
- COUNSEL_APPROVED_TEXT_REQUIRED for all

---

## 8. Smart Contract Implications

### Arkansas-Specific Considerations

1. **Usury Compliance (Critical)**: Any smart contract-facilitated loan must enforce the 17% APR cap for loans ≤$2,000 and the 5% above federal discount rate for loans >$2,000. Hard-coded rate checks must be implemented at the contract level, with oracle or admin override for federal rate updates.

2. **Money Transmission Risk**: Token collateral lock/unlock and liquidation may constitute "money transmission" or "stored value" under Ark. Code Ann. § 23-55-501. Self-executing liquidation should be **BLOCKED** until counsel confirms it does not trigger ASD licensing.

3. **No Escrow Statute for Advances**: Smart contract-based escrow for contractor advances operates without specific statutory support. Contract terms must be robust, but cannot override Arkansas financial regulation by characterization alone.

4. **Public Adjuster Prohibition**: Smart contracts must include safeguards preventing any feature that could be construed as claim negotiation or settlement assistance on behalf of homeowners.

5. **Blockchain Legal Recognition**: AR Code § 25-32-122 provides statutory foundation for smart contract architecture in loan origination, collateral management, and repayment routing — but this does not legitimize otherwise unlawful activity.

### Key Smart Contract Controls

| Control | Setting | Rationale |
|---------|---------|-----------|
| Block live loan creation | true | 17% usury cap (≤$2K) / 5% + fed discount rate (>$2K); licensing analysis |
| Block token collateral lock | true | Money transmission licensing uncertainty |
| Block liquidation | true | ASD case-by-case approach; no-action letter recommended |
| Block escrow-backed advance | true | No specific statute; multi-regulatory overlap |
| Block assignment of claim proceeds | true | No property AOB statute; public adjusters prohibited |
| Block repayment routing from insurance proceeds | true | Mortgagee involvement + lack of AOB statute |
| Allow demo-only records | true | Mock/demonstration data for development |
| Allow hash/reference-only audit records | true | AR Code § 25-32-122 recognizes blockchain records as legally valid |

### Off-Chain Checks Required

- Verify ACLB contractor license
- Confirm loan rate is under 17% APR for loans ≤$2,000 (or 5% above federal discount rate for loans >$2,000)
- Confirm money transmitter status before token activity
- Confirm no claim negotiation occurring
- Confirm escrow agent licensing if escrow function used

### Data Fields to Store

- Contractor license number and type (ACLB)
- Loan APR, loan amount, and lender classification
- Token collateral custody arrangement
- Escrow agent license/status (if applicable)
- Claim status (informational only)
- Home improvement contract cancellation status

### Actions That Must Be Blocked

- Live loan origination until usury compliance confirmed
- Token collateral lock/escrow until money transmission analysis complete
- Automated liquidation until ASD no-action letter or legal opinion obtained
- Escrow-backed contractor advance until multi-regulatory analysis complete
- Assignment of property insurance claim benefits
- Repayment routing from insurance proceeds
- Claim negotiation assistance

### Audit Events Needed

- `BLOCKED_LIVE_LOAN_ATTEMPT` (usury/licensing)
- `BLOCKED_TOKEN_COLLATERAL_ATTEMPT` (money transmission)
- `BLOCKED_ESCROW_ADVANCE_ATTEMPT` (no statute/regulatory overlap)
- `BLOCKED_CLAIM_NEGOTIATION` (public adjuster prohibition)
- `DEMO_MODE_RECORD_CREATED`

---

## 9. Open Questions For Licensed Attorney

1. **Usury Scope**: Does the 17% constitutional usury cap apply to non-recourse advances against insurance claim proceeds, or only to traditional loans? What about the 5% above federal discount rate tier for advances over $2,000?

2. **Escrow-Backed Advance Characterization**: Can an escrow-backed contractor advance be structured as a true purchase of receivables or non-recourse advance to avoid usury and lending licensing, or will Arkansas courts recharacterize it as a loan?

3. **ASD No-Action Letter**: Should SmartContractor seek a no-action letter from the Arkansas Securities Department for token collateral activities, and what is the estimated timeline and process?

4. **Money Transmission — Escrow**: Does holding funds in escrow for contractor disbursement constitute "money transmission" under Ark. Code Ann. § 23-55-501 if performed by a licensed third-party escrow agent?

5. **Post-Loss AOB Enforceability**: Can a post-loss assignment of property insurance claim proceeds be enforced under Arkansas common law given the absence of a specific statute and the health-care-only AOB provision?

6. **UCC Sufficiency**: Does the UCC 2021 amendment provide sufficient legal basis for smart contract-based virtual currency collateral perfection in Arkansas?

7. **Direct Payment Mechanism**: Can a contractor legally receive payment directly from an insurer under any mechanism other than AOB (e.g., direction to pay, joint check agreement)?

8. **Consumer Protection Exposure**: Given Arkansas's high consumer protection enforcement environment, what specific disclosure and compliance measures are required for any pilot program?

9. **Advance Fee Analysis**: Does collecting any fee or charge prior to contractor work completion trigger Ark. Code § 23-39-401 "advance fee" restrictions?

---

## 10. Sources

- Arkansas Insurance Department — https://insurance.arkansas.gov
- Arkansas Securities Department — https://securities.arkansas.gov
- Arkansas Money Transmitter Act (Ark. Code Ann. § 23-55-501 et seq.) — https://securities.arkansas.gov/wp-content/uploads/2023/08/2023-Money-Services-Act.pdf
- Arkansas Contractors Licensing Board — https://aclba.arkansas.gov/
- Arkansas Constitution Amendment 89 (17% usury cap) — https://law.justia.com/constitution/arkansas/amendments/amendment-89/
- Ark. Code Ann. § 4-57-104 (Interest rate on loans over $2,000) — https://law.justia.com/codes/arkansas/title-4/chapter-57/
- AR Code § 23-64-102 (Adjuster Definitions) — https://law.justia.com/codes/arkansas/title-23/subtitle-3/chapter-64/
- AR Code § 23-99-1302 (Assignment of Benefits — Health Care) — https://law.justia.com/codes/arkansas/title-23/subtitle-3/chapter-99/subchapter-13/
- AR Code § 25-32-122 (Blockchain/Smart Contracts) — https://law.justia.com/codes/arkansas/title-25/chapter-32/
- AR Code § 23-55-102/201 (Money Transmission) — https://law.justia.com/codes/arkansas/title-23/subtitle-2/chapter-55/
- Arkansas Insurance Department Rule 43 (Unfair Claims Settlement Practices) — https://www.law.cornell.edu/regulations/arkansas/054-00-15-Ark-Code-R-005
- AR Code § 23-66-206 (Unfair Trade Practices) — https://law.justia.com/codes/arkansas/title-23/subtitle-3/chapter-66/
- AR Code § 17-25-101 (Contractor Licensing) — https://law.justia.com/codes/arkansas/title-17/chapter-25/
- Arkansas Home Improvement Fraud Prevention Act (Act 817 of 2007) — Secondary source citation
- Wharton 50-State Crypto Regulation Review — https://wifpr.wharton.upenn.edu/50-state-review/
- Wright Lindsey Jennings — Digital Assets in Arkansas — https://wlj.com/perfecting-security-interests-in-digital-assets-in-arkansas/

---

*This document is for research and informational purposes only. It does not constitute legal advice. ALL SmartContractor product lines in Arkansas are blocked pending comprehensive legal review. The Arkansas regulatory environment presents significant barriers, particularly around insurance claim financing, contractor representation, and escrow-backed advances.*
