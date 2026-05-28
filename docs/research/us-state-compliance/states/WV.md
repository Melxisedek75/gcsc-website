# West Virginia (WV) — SmartContractor Compliance Brief

> **Classification:** HIGH REGULATION | **Research Date:** 2025-07-17 | **Packet Version:** 1.0

---

## 1. State Overview & Regulatory Summary

West Virginia is classified as a **HIGH REGULATION** state for SmartContractor operations. The state presents a moderately complex but actively evolving regulatory environment with comprehensive consumer lending laws, strict contractor licensing requirements, and emerging digital-asset legislation.

**Primary Regulators:**
- **West Virginia Offices of the Insurance Commissioner (WVOIC)** — insurance claims, public adjuster licensing, unfair trade practices
- **WV Division of Financial Institutions (DFI)** — consumer lending, money transmission, escrow activities, fintech sandbox
- **WV Division of Labor — Contractor Licensing Board** — contractor licensing and enforcement

**Key Compliance Thresholds:**

| Activity | Threshold | Requirement |
|----------|-----------|-------------|
| Construction work | $2,500+ | Contractor license required |
| Consumer loans | > 18% APR | Regulated Consumer Lender (RCL) license |
| Loans $3,500 or less | Max 31% APR | Rate cap |
| Loans $3,500 – $15,000 | Max 27% APR | Rate cap |
| Loans $15,000+ | Max 18% APR | Rate cap |
| Money transmission | Any | MT license under WV Code Chapter 32A |
| Virtual currency kiosks | Any | MT license required (HB 5353, 2026) |
| Public adjusting | Any | License required under Code 33-12B |

**Critical Status:** ALL SmartContractor lending, token collateral, claim advance, and repayment routing products are marked **BLOCKED pending legal review**. West Virginia's 2026 legislative session significantly expanded digital asset regulation (HB 5353, SB 670), reinforcing the need for comprehensive counsel approval before any live operations.

---

## 2. Official Sources & Regulatory Bodies

| Agency / Source | Role | Website |
|----------------|------|---------|
| WV Offices of the Insurance Commissioner (WVOIC) | Primary insurance regulator; consumer services, claims guidance, public adjuster licensing | wvinsurance.gov |
| WV Division of Financial Institutions (DFI) | Consumer lending (RCL), money transmission, escrow regulation, fintech sandbox | dfi.wv.gov |
| WV Division of Labor — Contractor Licensing Board | Contractor licensing, examinations, enforcement | labor.wv.gov |
| NMLS | Money transmission and consumer lender license applications | nmlsconsumeraccess.org |
| WV Legislature — WV Code | Primary statutory authority | code.wvlegislature.gov |
| Pearson VUE | Public adjuster licensing exams | pearsonvue.com |
| Prov, Inc. | Contractor licensing exams | prov.com |

### Key Statutes

| Citation | Subject |
|----------|---------|
| W.Va. Code 46A-1-101 et seq. | West Virginia Consumer Credit and Protection Act (WVCCPA) |
| W.Va. Code 46A-4-101 et seq. | Regulated Consumer Lenders — licensing, rates, prohibited conduct |
| W.Va. Code 32A-2-1 et seq. | Money Transmission (Chapter 32A) |
| W.Va. Code 31A-8G-1 et seq. | FinTech Regulatory Sandbox Program |
| W.Va. Code 33-12B-1 et seq. | Adjuster Licensing (including Public Adjusters) |
| W.Va. Code 33-11-4 | Unfair Claims Settlement Practices |
| W.Va. Code 33-15-22 | Dental Assignment of Benefits |
| W.Va. Code 61-15-1 | Money Laundering — Cryptocurrency Definition |
| W.Va. CSR 114-14-1 et seq. | Unfair Claims Settlement Practices Regulations |

---

## 3. Lending & Finance Licensing

### 3.1 Regulated Consumer Lender (RCL) License

A **Regulated Consumer Lender license is required** for making or taking assignments of regulated consumer loans where the finance charge exceeds **18% APR** (actuarial method).

**Licensing Requirements:**
- Must be a West Virginia domestic corporation
- Minimum capital: $10,000 + $2,000 per office ($12,000 minimum for one office)
- Application fee: $750 per office (annual renewal)
- FBI fingerprint/background check required
- Annual assessment based on outstanding loan balances as of December 31

### 3.2 Maximum Finance Charges (RCLs)

| Loan Type | Amount | Max APR | Points/Origination |
|-----------|--------|---------|-------------------|
| Unsecured, non-real property | $3,500 or less | 31% | None (or 2% processing fee if closed-end $2,000 or less) |
| Unsecured, non-real property | $3,500 – $15,000 | 27% | Up to 2% if closed-end |
| Unsecured, non-real property | Over $15,000 | 18% | Up to 2% if closed-end |
| Secured by real property | $15,000 or less | 27% | Up to 5% |

### 3.3 Key Prohibitions for RCLs
- No credit cards may be issued
- No prepayment penalties
- No balloon payment terms
- Must provide disclosure when refinancing at higher rates (SB 425)
- Must document tangible net benefit for residential real estate refinancing

### 3.4 Commercial / Business-Purpose Loans
- WVCCPA generally covers consumer loans (personal, family, household, agricultural purposes) under $25,000
- Business-purpose loans may fall outside WVCCPA coverage — **counsel must confirm**
- No specific "commercial loan" licensing exemption found for non-bank lenders
- Equipment financing to licensed contractors may qualify as commercial/business-purpose credit

### 3.5 Loan Brokering
- Broker fees permissible if disclosed to borrower and included in finance charge where applicable (46A-4-110a)

### 3.6 Supervised Financial Organizations
- Banks, industrial loan companies, building and loan associations, and credit unions are "supervised financial organizations" with different rate authority under 46A-3-104

### 3.7 Penalties for Unlicensed Lending
- **$2,000 per day** penalty for engaging in unlicensed consumer lending activity

**SmartContractor Status:** All lending products **BLOCKED** pending legal review of RCL licensing requirements and commercial-loan exemption analysis.

---

## 4. Escrow / Closing & Settlement Agent Licensing

### 4.1 Regulatory Authority

The **WV Division of Financial Institutions (DFI)** has broad authority to regulate escrow activities in West Virginia. While West Virginia does not maintain a standalone, separately defined "escrow agent" license comparable to some other states, escrow-related activities are subject to oversight through several channels:

- **Consumer lending regulations (WVCCPA Chapter 46A):** Any escrow activity connected to a regulated consumer loan falls under DFI jurisdiction
- **Money transmission law (WV Code Chapter 32A):** Escrow agents holding or transmitting funds may trigger money transmission licensing if the activity involves receiving and transmitting "value that substitutes for money"
- **Real estate settlement procedures:** Governed by federal RESPA and applicable state consumer protection laws

### 4.2 Applicability to SmartContractor Operations

| Escrow Activity | Regulatory Treatment |
|-----------------|---------------------|
| Holding insurance claim proceeds in trust for disbursement to contractors | Likely requires DFI oversight or MT license analysis |
| Third-party escrow for construction progress payments | May trigger consumer lending or MT regulation if connected to financed transactions |
| Automated escrow disbursement via smart contract | No specific statute; FinTech Sandbox may provide testing pathway |

### 4.3 Key Considerations

- **No standalone escrow license** exists in West Virginia, but DFI has broad interpretive authority over activities involving consumer funds
- Escrow services connected to mortgage transactions must comply with federal RESPA requirements
- Any entity holding funds on behalf of consumers in connection with lending or insurance claim advances should seek DFI guidance on registration or licensing obligations
- **HB 5353 (2026)** expanded DFI's regulatory reach over virtual currency custody, reinforcing the need for review of digital escrow arrangements

**SmartContractor Status:** Escrow-related functions are **BLOCKED** pending DFI consultation and legal review of whether claim-proceeds holding triggers money transmission or consumer lending regulation.

---

## 5. Contractor Licensing & Construction Finance

### 5.1 Contractor Licensing Requirements

Contractor licensing is **mandatory** for any construction work with a total project cost (materials + labor) of **$2,500 or more**.

**Authority:** WV Division of Labor — Contractor Licensing Board

| Requirement | Detail |
|-------------|--------|
| Application fee | $90 (annual renewal $90) |
| Exams | Business & Law exam + trade-specific exam (via Prov, Inc.) |
| Qualifying person | Owner, partner, corporate officer, or full-time employee |
| Insurance | Workers' compensation (if employees), unemployment compensation, general liability |
| Wage bond | Required for commercial contractors with employees (residential-only exempt) |

### 5.2 Penalties for Unlicensed Contracting

| Offense | Penalty |
|---------|---------|
| First | $200 – $1,000 fine |
| Second | $500 – $5,000 fine AND up to 6 months in jail |
| Third | $1,000 minimum fine AND 30 days to 1 year in jail |

### 5.3 Specialty Contractors

| Trade | Requirement |
|-------|-------------|
| Plumbing | Must employ certified Master or Journeyman Plumber |
| Electrical | Must employ licensed electrician (Office of State Fire Marshal) |
| HVAC | Must pass trade exam; 2–4 years experience required |

### 5.4 Construction Financing Implications

- Consumer credit to homeowners for residential repairs falls under WVCCPA (Chapter 46A)
- **CRITICAL:** A contractor who is not a licensed lender cannot make loans to consumers without appropriate RCL licensure
- Any financing program must be offered through a properly licensed financial institution or Regulated Consumer Lender
- **Contractors and their employees CANNOT negotiate claims with insurers on behalf of homeowners** without a public adjuster license

**SmartContractor Status:** Contractor flow **DEMO ONLY** pending legal review. Contractor licensing database integration recommended for validation.

---

## 6. Insurance Claims, AOB & Public Adjuster Rules

### 6.1 Insurance Claim Payment Timelines

West Virginia regulates claims handling under the **Unfair Trade Practices Act** (WV Code 33-11-4 and CSR 114-14):

| Timeline | Requirement |
|----------|-------------|
| 15 working days | Acknowledge claim receipt (unless payment made sooner) |
| 15 working days | Provide claimant with list of required items/statements/forms |
| 15 working days | Commence investigation procedures |
| 30 days | Pay or deny clean claim if submitted electronically |
| 40 days | Pay or deny clean claim if submitted manually |

- Insurer must conduct a "thorough, fair, and objective investigation"
- Unreasonable delay in seeking information = unfair practice
- Private cause of action available for damages from unfair settlement practices (first-party)

### 6.2 Additional Living Expenses (ALE)
- Standard homeowners policies include ALE coverage when residence is uninhabitable
- ALE pays for increased living expenses beyond normal expenses (hotel, meals, etc.)
- Requires receipts for reimbursement

### 6.3 Assignment of Benefits (AOB) Status

**Finding:** **No specific Assignment of Benefits prohibition statute** was found for property insurance claims in West Virginia.

- **WV Code 33-15-22 (2020):** Requires dental care insurers to honor AOB made in writing by covered person to dentist. This statute is **dental-specific only** and demonstrates legislative awareness of the AOB concept.
- No comparable general property insurance AOB statute found
- No AOB reform legislation (like Florida's) identified for WV

**Legal Analysis:**
- Under general common law principles, an insured may assign rights **after a loss** (claim proceeds) even if the policy contains anti-assignment clauses
- *Strahin v. Sullivan* (220 W. Va. 329, 2007) confirmed that third-party claimants can receive an assignment of the first-party policyholder's rights against the insurer
- Third-party bad faith suits were eliminated by statute (33-11-4a), but assignment of first-party rights remains a remedy

**Implications for SmartContractor:**
- Assignment of claim proceeds from homeowner to contractor may be permissible under WV common law
- Mortgagee/loss payee rights must be considered — mortgage companies typically listed as payee on checks
- Any AOB arrangement must be documented in writing
- Contractor should not negotiate the claim directly with insurer (public adjuster licensing issues — see 6.4)
- **STATUS: UNKNOWN_REQUIRES_COUNSEL_REVIEW**

### 6.4 Public Adjuster Licensing

A **public adjuster license is required** under WV Code 33-12B. No person shall act as or hold themselves out as a public adjuster without a license from the Commissioner.

| Requirement | Detail |
|-------------|--------|
| Line of authority | Property and Casualty only |
| Age | 18+ |
| Residency | WV resident or reciprocal state resident |
| Exam | WV exam via Pearson VUE |
| Background | Fingerprinting and criminal background check |
| Continuing education | 24 hours every 2 years (including 3 hours ethics) |
| Business entity fee | $200 annually (effective July 1, 2021) |

**Key Exemptions:** Attorney-at-law admitted in WV acting in professional capacity; person negotiating life/health claims; person employed only to obtain facts/technical assistance for a licensed public adjuster; licensed insurance producer with claim authority.

**CRITICAL RESTRICTIONS:**
- Contractors and their employees **CANNOT negotiate claims with insurers on behalf of homeowners** without a public adjuster license
- SmartContractor and its contractor partners must **NOT** hold themselves out as public adjusters
- SmartContractor may assist with documentation, but **cannot negotiate claim values, dispute settlements, or advocate on the homeowner's behalf** with the insurance company
- Providing "technical assistance" to a licensed public adjuster is permissible (exemption)

### 6.5 Loss Draft / Mortgagee Rights

- Insurance claim checks for mortgaged properties are typically made payable to **both** the insured homeowner AND the mortgagee
- Standard industry thresholds: claims $40,000+ placed in restricted escrow; delinquent loans trigger full escrow holding
- No specific WV statute mandates loss draft procedures — governed by mortgage terms and federal regulations
- Any claim advance product must account for mortgagee's priority interest in proceeds

**SmartContractor Status:** ClaimBridge products **BLOCKED** pending legal review of AOB permissibility, public adjuster restrictions, and mortgagee rights.

---

## 7. Digital Assets, Token Collateral & Money Transmission

### 7.1 Money Transmission Licensing (WV Code Chapter 32A)

Money transmission licensing is required for "receiving currency, the payment of money, or **other value that substitutes for money** by any means for the purpose of transmitting."

**HB 5353 (enacted April 1, 2026):**
- Explicitly includes **virtual currency kiosks** in money transmission law
- Defines virtual currency kiosk as "automated electronic machine that allows users to engage in money transmission"
- Requires NMLS licensure
- Transaction limits: $1,000/day for new customers; $10,000/day for existing customers
- Requires disclosures, ID verification, blockchain analysis, chief compliance officer, and 72-hour hold authority

**SB 345 (2023):** Adopted CSBS Money Transmission Modernization Act provisions regarding letters of credit for permissible investments.

### 7.2 Digital Asset Legislative Landscape

| Legislation | Year | Effect |
|-------------|------|--------|
| HB 2585 | 2017 | Defined "cryptocurrency" for state money laundering statutes (61-15-1) |
| HB 2813 | 2019 | Added virtual currency to sales/use tax "marketplace facilitator" definition |
| HB 4511 | 2022 | Amended Unclaimed Property Act to include virtual currency |
| SB 560 (F.A.S.T. Act) | 2026 | Allows State Treasurer to authorize stablecoin payments to state vendors/contractors |
| SB 143 (Inflation Protection Act) | 2026 | Authorizes Board of Treasury to invest up to 10% of public funds in qualifying digital assets ($750B market cap threshold) |
| SB 670 (D.U.N.A. Act) | 2026 | Creates legal framework for decentralized organizations recognizing digital assets, DLT, and blockchain-based governance |

### 7.3 FinTech Regulatory Sandbox

- **W.Va. Code 31A-8G-1 et seq. (2020):** Creates 24-month sandbox program administered by DFI
- Participants may test innovative products/services **without full licensure**
- Bond required: $5,000 minimum (commensurate with risk)
- Consumer protection laws still apply (including Chapter 46A)
- Maximum consumer loan amounts set on a case-by-case basis
- Up to 12-month extension available for licensing transition
- As of October 2023: 5 applications reviewed, 1 accepted

### 7.4 Token Collateral Assessment

- **No specific statute** addresses digital asset/token collateral for loans in West Virginia
- General **UCC Article 9** would govern secured transactions
- Digital assets recognized as property under various WV statutes
- The FinTech Regulatory Sandbox represents a potential pathway for testing token-collateralized lending products, but requires DFI approval and consumer protections
- Token collateral lock, liquidation, and smart contract enforcement: **UNKNOWN_REQUIRES_COUNSEL_REVIEW**
- Status of digital assets as "monetary instruments" or "value that substitutes for money" suggests money transmission analysis may apply to custody/holding arrangements

**SmartContractor Status:** All token collateral products **BLOCKED** pending comprehensive legal and compliance review of money transmission implications and sandbox eligibility.

---

## 8. Smart Contract Configuration

For West Virginia, smart contracts should be configured as follows:

| Feature | Setting | Rationale |
|---------|---------|-----------|
| `block_live_loan_creation` | **true** | RCL license may be required; unlicensed lending = $2,000/day penalty |
| `block_token_collateral_lock` | **true** | MT law broadly covers "value that substitutes for money"; no clear token collateral statute |
| `block_liquidation` | **true** | Liquidation of token collateral may trigger MT or securities concerns |
| `block_assignment_of_claim_proceeds` | **true** | AOB status for property claims not definitively confirmed; public adjuster restrictions apply |
| `block_repayment_routing_from_insurance_proceeds` | **true** | Mortgagee rights, claim priority, and repayment routing require legal confirmation |
| `allow_demo_only_records` | **true** | Demo mode permitted for UI/UX development and stakeholder presentations |
| `allow_hash_reference_only_audit_records` | **true** | Immutable audit records (hashed) may be maintained without triggering lending/custody regulations |

### Additional Smart Contract Notes
- FinTech Regulatory Sandbox (31A-8G) may provide pathway for limited live testing with DFI approval
- If sandbox participation is pursued: consumer loan limits, bond requirements, and disclosure requirements apply
- All demo transactions should be clearly marked as non-binding demonstrations
- Hash-only audit records should not include actual loan terms, collateral values, or personal information in plain text
- Smart contract liquidation mechanisms should be reviewed by counsel for compliance with WV usury limits and debt collection laws

---

## 9. Risk Scores

| Risk Category | Score | Rationale |
|---------------|-------|-----------|
| **Lending Risk** | **HIGH** | RCL license required for loans >18% APR. $2,000/day penalty for unlicensed activity. Strict rate caps and consumer protections under WVCCPA. Commercial loan exemption uncertain. |
| **Insurance Claim Risk** | **HIGH** | Claims handling heavily regulated under Unfair Trade Practices Act with specific timelines. Third-party bad faith abolished. ALE claims require receipts. Emergency advance procedures unclear. |
| **AOB Risk** | **MEDIUM** | No AOB prohibition statute found for property insurance in WV. Dental AOB statute (33-15-22) shows legislative awareness. Common law may permit post-loss assignment. Status unconfirmed. |
| **Public Adjuster Risk** | **HIGH** | Strict licensing required under 33-12B. Contractor or GCSC employee negotiating claims = unlicensed public adjuster activity. Attorney exemption exists only for licensed attorneys. |
| **Token Collateral Risk** | **HIGH** | No specific token collateral statute. MT law broadly covers "value that substitutes for money." HB 5353 (2026) shows regulatory intent to control virtual currency. FinTech Sandbox exists but has low acceptance rate. |
| **Escrow / Closing Risk** | **MEDIUM-HIGH** | No standalone escrow license, but DFI has broad interpretive authority. MT law may apply to funds-holding activities. Digital escrow arrangements untested under WV law. |
| **Consumer Protection Risk** | **HIGH** | WVCCPA provides comprehensive protections. 4-year statute of limitations. Unfair/deceptive practices prohibited. Specific disclosures required for refinancing. Right to cancel and rescission rules may apply. |

---

## 10. Required Disclosures

> **All disclosures below must be reviewed and approved by qualified legal counsel licensed in West Virginia before use.**

### 10.1 Token Collateral Lending Disclosure

```
[TO BE REVIEWED AND APPROVED BY COUNSEL]

IMPORTANT NOTICE: This product involves the use of digital assets 
(token/cryptocurrency) as collateral for a loan. The regulatory status of 
digital asset collateral in West Virginia has not been fully determined. 

Before proceeding, you should be aware that:
- West Virginia law may regulate the custody and transmission of digital assets
- The value of digital assets used as collateral may fluctuate significantly
- You may be required to provide additional collateral if the value decreases
- In the event of default, your collateral may be liquidated
- You may not be able to recover your collateral if certain conditions occur

[Additional disclosures required by counsel]
```

### 10.2 Claim Advance / Assignment of Benefits Disclosure

```
[TO BE REVIEWED AND APPROVED BY COUNSEL]

IMPORTANT NOTICE REGARDING INSURANCE CLAIM PAYMENTS

You are being asked to assign a portion of your insurance claim proceeds 
to [CONTRACTOR/GCSC]. Before signing any assignment:

1. You have the right to have this document reviewed by an attorney
2. This assignment does not guarantee payment from your insurance company
3. Your insurance company may still deny or reduce your claim
4. You remain responsible for any amounts not covered by insurance
5. Your mortgage lender may have rights to the insurance proceeds
6. You may be personally liable for the full amount regardless of insurance outcome

RIGHT TO CANCEL: [COUNSEL_APPROVED_TEXT_REQUIRED]
(WV cancellation period to be determined by counsel)

This assignment is limited to payment for services actually performed by 
the contractor. It does not authorize anyone to negotiate with your 
insurance company on your behalf.

[Additional disclosures required by counsel]
```

### 10.3 Public Adjuster Scope Limitation Disclosure

```
[TO BE REVIEWED AND APPROVED BY COUNSEL]

NOTICE: [Contractor/GCSC] is NOT a licensed public adjuster. We cannot 
and will not:
- Negotiate the value of your insurance claim
- Communicate with your insurance company on your behalf regarding 
  claim settlement
- Dispute your insurer's determination of covered damages
- Advise you on whether to accept or reject settlement offers

If you need assistance negotiating your claim, you may hire a licensed 
public adjuster (who must be licensed by the West Virginia Offices of 
the Insurance Commissioner) or an attorney.
```

### 10.4 Commercial Loan Purpose Disclosure

```
[TO BE REVIEWED AND APPROVED BY COUNSEL]

This loan is for business/commercial purposes only. By accepting this 
loan, you represent that the proceeds will be used for business purposes 
and not for personal, family, or household purposes.

The West Virginia Consumer Credit and Protection Act may not apply to 
this transaction. Different interest rates, fees, and protections may apply.
```

### 10.5 Escrow Services Disclosure

```
[TO BE REVIEWED AND APPROVED BY COUNSEL]

NOTICE REGARDING ESCROW OF INSURANCE PROCEEDS

Funds held by [GCSC/contractor] may be subject to regulation by the 
West Virginia Division of Financial Institutions. Your mortgage lender 
may have a priority interest in insurance proceeds. Funds will be 
disbursed only upon completion of specified repair milestones and 
satisfaction of all applicable legal requirements.

[Additional disclosures required by counsel]
```

---

## Disclaimer

**THIS DOCUMENT IS FOR RESEARCH AND INFORMATIONAL PURPOSES ONLY. IT DOES NOT CONSTITUTE LEGAL ADVICE. ALL SMARTCONTRACTOR PRODUCTS MUST BE REVIEWED BY QUALIFIED LEGAL COUNSEL LICENSED IN WEST VIRGINIA BEFORE ANY LIVE OPERATIONS. ALL STATUS DESIGNATIONS ARE "BLOCKED" PENDING COUNSEL APPROVAL. LAWS AND REGULATIONS ARE SUBJECT TO CHANGE.**

---

*End of Compliance Brief: West Virginia (WV)*
