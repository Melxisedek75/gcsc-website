# Maryland (MD) — SmartContractor Compliance File

**Status:** HIGH RISK — Multiple regulatory obstacles require legal review  
**Last Updated:** 2025-07-24  
**Packet Version:** 1.0  

---

## 1. State Summary & Risk Overview

Maryland presents a **HIGH-RISK** regulatory environment for SmartContractor products. The state maintains robust consumer protection laws, strict contractor licensing through the Maryland Home Improvement Commission (MHIC), actively regulated insurance markets overseen by the Maryland Insurance Administration, and significant legal considerations around assignment of insurance claim benefits following the Maryland Supreme Court's July 2025 decision in *In re: Featherfall Restoration LLC*.

### Key Risk Vectors

| Risk Category | Level | Summary |
|---------------|-------|---------|
| Lending/Finance | **HIGH** | Consumer loan and installment loan licensing required through NMLS; loans acquired by unlicensed persons are unenforceable under Md. Code, Fin. Inst. § 11-219(b). Repeal of assignee exemption (SB 784, 2026) tightens secondary market rules. |
| Contractor Licensing | **HIGH** | Strict MHIC licensing required; contractors explicitly barred from acting as public adjusters; 1/3 deposit cap on home improvement contracts. |
| Assignment of Benefits | **MODERATE-HIGH** | Post-loss AOB generally permitted following *Featherfall* (July 2025), but policy language matters critically; ISO standard forms may still block claim assignments. |
| Public Adjuster | **HIGH** | Strict licensing required; 10-business-day cancellation window effective 10/1/2024; contractors **CANNOT** negotiate claims or advise on coverage without a license. |
| Token Collateral | **UNKNOWN/HIGH** | Maryland has NOT enacted specific virtual currency business legislation; Commissioner of Financial Regulation may assert jurisdiction over token/cryptocurrency activities. |
| Escrow Advances | **MODERATE** | Escrow activities overseen by Commissioner of Financial Regulation; must be structured carefully to avoid trust-fund and custodial obligations. |
| Consumer Protection | **HIGH** | Very strong enforcement framework; Maryland Consumer Protection Act and Financial Consumer Protection Act of 2018 provide broad authority; civil penalties up to $10,000 for initial violations. |

---

## 2. Regulatory Bodies & Licensing Authorities

| Agency | Jurisdiction | Contact / URL |
|--------|-------------|---------------|
| **Maryland Insurance Administration (MIA)** | Insurance regulation, public adjuster licensing, claim practices | insurance.maryland.gov; 410-468-2000 |
| **Commissioner of Financial Regulation (OFR)** | Consumer lending, installment lending, money transmission, escrow oversight | 500 N. Calvert St., Ste 402, Baltimore, MD 21202; 410-230-6100 |
| **Maryland Home Improvement Commission (MHIC)** | Contractor licensing, guaranty fund, contract requirements | labor.maryland.gov/license/mhic/; 410-230-6231 |
| **Office of the Attorney General — Consumer Protection Division** | Consumer Protection Act enforcement, deceptive trade practices | 200 St. Paul Place, Baltimore, MD 21202; 410-528-8662 |
| **NMLS / CSBS** | Licensing for consumer lenders, installment lenders, money transmitters | www.nmlsresourcecenter.org |

### Key Statutory Frameworks

- **Insurance Article** — Public adjusters (§ 10-401 et seq.), ALE coverage (§ 19-208), interest on benefits (§ 17-102)
- **Financial Institutions Article** — Consumer Loan Law (§ 11-201 et seq.), Installment Loan Law (§ 11-301 et seq.), Money Transmission Act (§ 12-401 et seq.)
- **Commercial Law Article** — Interest/usury (§ 12-103), Consumer Protection Act (§ 13-301 et seq.), Consumer Debt Collection Act (§ 14-201 et seq.)
- **Business Regulation Article** — MHIC licensing (§ 8-101 et seq.), contract requirements (§ 8-501), deposit limits (§ 8-617)

---

## 3. Lending / Finance Licensing

### 3.1 Consumer Loan Licensing (Md. Code, Fin. Inst. § 11-201 et seq.)

A **Consumer Loan license** is required for the principal executive office of any person making loans under the Maryland Consumer Loan Law (Md. Code, Com. Law § 12-301 et seq.). License is obtained through the NMLS. A consumer loan licensee is exempt from installment loan licensing provisions (§ 11-301(b)(5)).

**Critical provision:** Md. Code, Fin. Inst. § 11-219(b) states that **"a loan account that is acquired by a person who is not licensed under this subtitle is unenforceable."** Any entity acquiring a consumer loan must itself be licensed to enforce the loan.

### 3.2 Installment Loan Licensing (Md. Code, Fin. Inst. § 11-301 et seq.)

An **Installment Loan license** is required for any person making loans or extensions of credit repayable in scheduled periodic payments of principal and interest. Exemptions include Maryland-chartered banks, national banks, federal savings associations, federal/Maryland credit unions, consumer loan licensees, and licensed mortgage lenders engaging solely in mortgage lending. An affiliate exemption exists for bank/credit union affiliates subject to examination requirements.

### 3.3 Small Loans Under $25,000 (Md. Code, Com. Law § 12-314)

Loans of $25,000 or less made to individuals primarily for commercial purposes are subject to licensing requirements unless exempt. This threshold was increased from $6,000 to $25,000 by legislation in 2025.

### 3.4 Interest Rate Limits (Md. Code, Com. Law § 12-103)

| Loan Type | Rate Limit |
|-----------|-----------|
| Written agreement (default) | 8% per year |
| Unsecured or non-real-estate secured | **Up to 24% per year** |
| Loans secured by first lien on residential real property | No limit |
| Commercial loans | **No limit** |

The 24% cap on loans under $25,000 is the binding constraint for most consumer-facing SmartContractor products.

### 3.5 Secondary Market / Assignment Rules

- **SB 784** (signed April 14, 2026, effective July 1, 2026): Repealed Section 11-102, which had exempted certain assignees of mortgages, mortgage loans, and installment loans from licensing requirements.
- The Maryland Secondary Market Stability Act of 2025 (HB 1516) preserved a "passive trust" exemption from mortgage lender licensing.
- **Bottom line:** Any structure involving assignment or acquisition of loans in Maryland must undergo fact-specific licensing exposure analysis.

### 3.6 Commercial/Business-Purpose Loans

Commercial loans are generally **not** subject to Maryland Consumer Loan Law licensing requirements. Loans to non-individual business entities (corporations, LLCs, partnerships) are generally exempt from consumer credit licensing, and interest rate limits do not apply. This is the most viable path for contractor-facing SmartContractor products.

### 3.7 Collection/Servicing Licensing

- The Maryland Collection Agency Licensing Act requires licensing for debt collectors.
- The **Consumer Debt Collection Act** (Com. Law § 14-201 et seq.) applies to **all persons** collecting consumer debts, including creditors — not just third-party collectors.

---

## 4. Escrow-Backed Contractor Advance Rules

### 4.1 Regulatory Oversight

The **Maryland Commissioner of Financial Regulation** oversees escrow activities in the state. While Maryland does not have a standalone "escrow agent" licensing statute comparable to some other states, escrow activities may implicate:

- **Money Transmission Act** (Md. Code, Fin. Inst. § 12-401 et seq.) — if funds are held for transfer
- **Trust fund and custodial obligations** under Maryland common law and fiduciary principles
- **Consumer Loan Law** — if escrow-advance structures constitute extensions of credit

### 4.2 Escrow-Backed Advance Structure Requirements

For SmartContractor escrow-backed contractor advance products in Maryland:

| Requirement | Detail |
|-------------|--------|
| **Custody of funds** | Escrowed funds must be maintained in a segregated, non-commingled account at a federally insured depository institution |
| **Interest handling** | Interest earned on escrowed funds may need to be credited to the beneficiary depending on agreement terms |
| **Record keeping** | Detailed transaction records must be maintained and made available to the Commissioner upon request |
| **Disbursement controls** | Disbursement must follow written escrow instructions; no disbursement until conditions precedent are satisfied |
| **Consumer purpose** | If advances are made to consumers (homeowners), full consumer loan licensing applies; 24% rate cap governs |
| **Commercial purpose** | Advances to licensed contractors for business purposes generally exempt from consumer lending laws |

### 4.3 Prohibited & Restricted Activities

- **No commingling:** Escrow funds must never be commingled with operating funds of the escrow holder or advance provider.
- **No unauthorized disbursement:** Disbursement prior to satisfaction of agreed conditions (e.g., repair completion, inspection sign-off) is prohibited.
- **No interest arbitrage:** Escrow-backed advances structured primarily to capture interest spreads on consumer funds may trigger usury and consumer protection scrutiny.
- **Deductible payment prohibition:** Contractors and escrow agents may **not** promise to pay a policyholder's insurance deductible, directly or indirectly. This is a prohibited inducement under Maryland insurance regulations.

### 4.4 SmartContractor Product Implications

| Product Feature | Status | Notes |
|----------------|--------|-------|
| Escrow holdback from insurance proceeds | **LEGAL REVIEW REQUIRED** | Must account for mortgagee/loss-payee interests; servicer disbursement schedules apply |
| Milestone-based disbursement to contractors | **VIABLE WITH STRUCTURING** | Commercial-purpose advances to MHIC-licensed contractors may be structured outside consumer lending regime |
| Hold-in-trust for homeowner benefit | **REQUIRES ESCROW ACCOUNT** | Creates custodial duty; must comply with OFR oversight expectations |
| Cross-collateralization of escrow balances | **BLOCKED** | Commingling and unauthorized use of escrowed funds prohibited |
| Automated escrow release via smart contract | **LEGAL REVIEW REQUIRED** | Must have clear off-chain oracle for condition verification; Commissioner may view automated release as outside standard escrow framework |

---

## 5. Contractor Licensing & MHIC Requirements

### 5.1 MHIC Licensing

**All home improvement contractors must hold an MHIC license** (Md. Bus. Reg. § 8-301). "Home improvement" is broadly defined as addition, alteration, conversion, improvement, modernization, remodeling, repair, or replacement of a residential building or adjacent structure (Bus. Reg. § 8-101(g)). It is a **criminal offense** to perform home improvement work without a license. Subcontractors may work without a license **only** when performing work for an MHIC-licensed contractor.

### 5.2 MHIC License Requirements

| Requirement | Standard |
|-------------|----------|
| Examination | PSI exam, minimum score 70% |
| Financial solvency | $20,000 net worth OR $20,000 surety bond |
| General liability insurance | **$500,000 minimum** (increased from $50,000, effective June 1, 2024) |
| Experience | 2+ years |
| Application fee | $370 |
| License term | 2 years |

### 5.3 Contract Requirements

- Must be in writing and legible (Bus. Reg. § 8-501)
- Must contain MHIC license number
- **Deposit limited to 1/3 of contract price** (Bus. Reg. § 8-617)
- Cannot accept any payment before contract is signed
- Must include MHIC Guaranty Fund notice
- Must include approximate start and completion dates
- Written change orders required for any modifications

### 5.4 Guaranty Fund

The MHIC administers a Guaranty Fund compensating homeowners for losses caused by licensed contractors. Maximum recovery: **$30,000 per claimant** ($250,000 aggregate per contractor). Only licensed contractors are covered; homeowners using unlicensed contractors have **no protection**.

### 5.5 Contractor as Public Adjuster — Critical Prohibition

The MHIC explicitly warns: **a home improvement contractor license does NOT authorize acting as a public adjuster.**

| Allowed | Prohibited |
|---------|-----------|
| Prepare an estimate for repair | Prepare the insurance claim for the homeowner |
| Answer questions the insurance company has about the estimate | Negotiate the claim with the insurance company |
| Perform contracted repair work | Advise the homeowner on the insurance policy's coverage |

To act as a public adjuster, a person must obtain a **separate license** from the Maryland Insurance Administration.

### 5.6 Business-Purpose Contractor Financing

Financing to contractors for working capital, equipment, or materials is generally a commercial transaction exempt from most consumer credit licensing requirements. However, if a contractor arranges financing for a homeowner (e.g., brokers a loan secured by the homeowner's property), this may trigger **mortgage broker/originator licensing**.

---

## 6. Insurance Claims, ALE & AOB Framework

### 6.1 Additional Living Expenses (ALE) — Md. Code, Ins. § 19-208

- **Mandatory minimum:** All homeowner's, fire, farmowner's, or dwelling insurance policies that provide ALE coverage must provide **at least 12 months** of coverage.
- Any clause limiting ALE to less than 12 months is **void and unenforceable**.
- The Commissioner may require an insurer to provide ALE coverage for **up to 24 months** if covered property remains uninhabitable due to delays caused by the insurer or factors beyond the insured's control.
- **Note:** This does **not** prohibit enforcement of monetary/dollar limits on ALE, only time limits.

### 6.2 Emergency Advance Payments & Claim Timing

Maryland law does not have specific statutes governing emergency advance payments from insurers; these are generally governed by policy terms and the common law obligation of insurers to act in good faith. Delays in ALE payments can constitute bad faith. Interest on overdue benefits is provided under § 17-102.

### 6.3 Assignment of Benefits — Post-Loss Framework

Maryland's AOB landscape changed significantly with the Maryland Supreme Court's July 2025 decision in ***In re: Featherfall Restoration LLC***.

#### The *Featherfall* Decision (July 24, 2025)

The Maryland Supreme Court **reversed** the Insurance Commissioner, Circuit Court, and Appellate Court, holding:

- An anti-assignment clause that only prohibits "assignment of this policy" does **NOT** prohibit assignment of a **specific claim** arising under the policy.
- The court distinguished between assignment of the **policy** and assignment of a **claim arising under the policy**.
- The assignment in *Featherfall* transferred "any and all insurance rights, benefits, proceeds, and any causes of action under applicable insurance policies for the above mentioned claim" — but **not** the policy itself.

#### Prior Precedent & Key Distinction

Two prior Maryland cases enforced anti-assignment clauses against post-loss assignments — *Michaelson v. Sokolove* (1936) and *Dwayne Clay MD PC v. Government Employees Insurance Co.* (1999) — but the anti-assignment clauses in those cases were **broader** than the one in *Featherfall*. The *Featherfall* clause only prohibited "assignment of this policy," not "benefits" or "interests."

#### Practical Impact for SmartContractor

| Scenario | Status |
|----------|--------|
| Claim assignment where policy only prohibits "assignment of this policy" | **Permitted** per *Featherfall* |
| Claim assignment under ISO standard forms prohibiting "assignment of interest under this Policy" | **Likely blocked** — broader language |
| Policy language matters critically | Minor wording differences determine validity |
| No comprehensive AOB statute | Unlike Florida, Maryland AOBs are governed by policy terms, common law, and *Featherfall* |

### 6.4 Mortgagee / Loss Draft Complications

When a mortgage exists, insurance claim checks are typically made payable to **both the homeowner and the mortgagee**. The mortgagee/servicer must endorse the check before funds can be accessed. For large losses, servicers typically hold proceeds in escrow and disburse incrementally based on repair progress. Any SmartContractor product that routes insurance claim proceeds must account for mortgagee involvement — servicer disbursement schedules may delay contractor payment significantly.

### 6.5 Deductible Payment Prohibition

Maryland law **prohibits** contractors and public adjusters from promising to pay a policyholder's insurance deductible, directly or indirectly. This is considered a **prohibited inducement**.

---

## 7. Public Adjuster Rules & Insurance Representation

### 7.1 Licensing Requirement

- **Public adjuster license required** under Md. Code, Ins. § 10-403.
- Unlicensed public adjusting is a violation subject to administrative and criminal penalties.
- "Marketing on behalf of a public adjuster" does not require a separate license (§ 10-403(b)).

### 7.2 Public Adjuster Contract Requirements (§ 10-411)

| Element | Requirement |
|---------|-------------|
| Form | Must be in writing |
| Title | Must be titled "Public Adjuster Contract" |
| Identification | Adjuster's name, business address, license number |
| Scope | Must describe services to be performed |
| Compensation | Must state fee/percentage/compensation |
| Cancellation right | **10-business-day right of cancellation** (increased from 3 business days, effective 10/1/2024 by HB 36) |
| Solicitation hours | Must include statement that adjuster may not solicit between 8:00 p.m. and 8:00 a.m. |
| 72-hour reporting | If contract entered within 72 hours of loss, must report to Commissioner within 1 business day |

### 7.3 Prohibited Conduct (§ 10-414)

- Cannot allow unlicensed employees to conduct business requiring a license
- Cannot have direct/indirect financial interest in any aspect of a claim (other than contract fee)
- Cannot acquire interest in salvage without written permission
- **Cannot solicit between 8:00 p.m. and 8:00 a.m.**
- Must disburse settlement payments within 15 business days

### 7.4 What Contractors CANNOT Do Without a Public Adjuster License

Per the Maryland Insurance Administration advisory:

- Investigate, appraise, evaluate, or give opinions on insurance claims
- Prepare insurance claims for homeowners
- Negotiate claims with insurance companies
- Advise homeowners on insurance policy coverage
- Accept payment from insurance proceeds as the sole payment mechanism

### 7.5 Fee Structure

- **No statutory fee cap** for public adjusters in Maryland; fee is negotiable between adjuster and insured.
- If insurer pays policy limit within 72 hours of loss notification, adjuster may **not** receive commission based on percentage — only "reasonable compensation" for work performed.

### 7.6 SmartContractor Implications

- SmartContractor **CANNOT** have contractors negotiate with insurance companies on behalf of homeowners.
- SmartContractor **CANNOT** permit unlicensed persons to advise on coverage or negotiate claims.
- SmartContractor **CANNOT** route insurance proceeds to contractors without proper legal analysis of assignment validity.
- Any feature suggesting or facilitating public adjuster-like activity without proper licensing creates **severe legal exposure**.

---

## 8. Token Collateral / Digital Asset Status

### 8.1 Current Regulatory Status

**Maryland has NOT enacted a comprehensive virtual currency or digital asset framework.** The state does not currently license or register companies dealing with virtual currencies. The Commissioner of Financial Regulation has evaluated virtual currencies but has not adopted specific regulations.

### 8.2 Money Transmission Act (Md. Code, Fin. Inst. § 12-401 et seq.)

Maryland's Money Transmission Act defines money transmission as selling/issuing payment instruments or prepaid access, or receiving money/value for transfer. **Virtual currency is NOT currently included in the definition of "money"** under the Maryland Money Transmission Act. However, the CSBS Money Transmission Modernization Act (model law) includes a comprehensive virtual currency article that Maryland has **not yet adopted**.

### 8.3 Financial Consumer Protection Act of 2018

This Act required the Financial Consumer Protection Commission to study cryptocurrencies, ICOs, exchanges, and blockchain technologies. The Commission recommended updating the Money Transmission Act to include virtual currency transmitters, but **no legislation has yet been enacted** implementing these recommendations.

### 8.4 Status for SmartContractor Token Collateral

**TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW**

Maryland has not enacted clear rules on using digital assets as collateral for lending purposes. The following questions remain unanswered:

- Whether token/cryptocurrency collateral lock mechanisms constitute money transmission
- Whether smart contract-based liquidation is permitted under Maryland law
- Whether token custody creates fiduciary or trust obligations
- Whether the state's Uniform Commercial Code Article 9 (secured transactions) applies to digital assets
- Whether digital assets constitute "property" or "investment property" for collateral purposes

**RECOMMENDATION:** All token collateral features must be **BLOCKED** for Maryland users pending:

1. State-specific legal counsel review
2. Determination of whether money transmitter licensing is triggered
3. Analysis of UCC Article 9 applicability to digital assets
4. Review of potential federal regulatory implications

---

## 9. Consumer Protection, Debt Collection & Enforcement

### 9.1 Maryland Consumer Protection Act (Com. Law § 13-301 et seq.)

The Maryland Consumer Protection Act provides **broad enforcement authority** against unfair, abusive, and deceptive trade practices. It applies to all consumer transactions, including lending, home improvement, and insurance-related services. Civil penalties up to **$10,000 for initial violations** and **$25,000 for subsequent violations** may be imposed.

### 9.2 Financial Consumer Protection Act of 2018 (Com. Law § 14-4101 et seq.)

This Act added **"abusive"** practices to the prohibited conduct framework and strengthened the Commissioner's enforcement tools. It applies to all financial products and services offered to Maryland consumers.

### 9.3 Consumer Debt Collection Act (Com. Law § 14-201 et seq.)

- Applies to **all persons** collecting consumer debts, including original creditors — not just third-party collectors.
- Prohibits harassment, false representations, unfair practices, and collection of amounts not expressly authorized by agreement or law.
- Requires debt collectors to be licensed under the Maryland Collection Agency Licensing Act.

### 9.4 OFR Enforcement & Advisory Authority

The Commissioner of Financial Regulation has broad authority to:

- Issue cease and desist orders
- Impose civil money penalties
- Order restitution to consumers
- Refer matters for criminal prosecution
- Issue advisory notices interpreting state law (e.g., Advisory Notice 14-01 on virtual currency risks)

### 9.5 Attorney General Enforcement

The Maryland Attorney General's Consumer Protection Division actively enforces state consumer protection laws and maintains a robust complaint-handling system. Coordination between the AG and OFR is common in financial services enforcement.

### 9.6 Required Disclosures

#### A. Consumer Loan Disclosure
All consumer loans must include disclosures required by Md. Code, Com. Law Title 12, Subtitle 3, including interest rate disclosures, fee schedules, right of cancellation notices, and complaint contact information for the Maryland Office of Financial Regulation and the Office of the Attorney General Consumer Protection Division.

#### B. Home Improvement Contract Disclosure
Required MHIC notices must include: contractor name/address/MHIC license number; MHIC contact information; Guaranty Fund notice; approximate start and completion dates; total contract price; deposit cap of 1/3; no payment before signing; right to cancel under Door-to-Door Sales Act; lien/mortgage disclosure if financing is secured by real property.

#### C. No Public Adjuster Activity Disclosure
> "IMPORTANT NOTICE: [SmartContractor/Contractor] is NOT a licensed public adjuster. We cannot and will not: prepare your insurance claim; negotiate with your insurance company on your behalf; advise you about your insurance policy coverage; or investigate, appraise, or evaluate your insurance claim. If you need assistance with your insurance claim, you may contact a licensed public adjuster through the Maryland Insurance Administration."

#### D. Consumer Complaint Notice
> "If you believe you have been treated unfairly or deceived in connection with this transaction, you may file a complaint with the Maryland Office of the Attorney General, Consumer Protection Division; the Maryland Office of Financial Regulation; or the Consumer Financial Protection Bureau. You may also have rights under the Maryland Consumer Protection Act and other applicable laws."

---

## 10. Dashboard Rules & Smart Contract Implications

### 10.1 Product-Specific Rules

```json
{
  "state": "MD",
  "state_name": "Maryland",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Maryland has not enacted specific virtual currency/collateral legislation. No state framework for token collateral, smart contract liquidation, or digital asset custody. Money Transmission Act does not currently include virtual currency but Commissioner has broad authority. UCC Article 9 applicability to digital assets is unclear. All token collateral features BLOCKED pending Maryland-specific legal review. Commercial loans to licensed contractors may be viable through appropriately licensed providers."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Maryland has no comprehensive AOB statute. Post-loss claim assignment was clarified by Featherfall v. Travelers (July 2025 Supreme Court decision), which permits assignment of CLAIMS where anti-assignment clause only prohibits assignment of the POLICY. However, ISO standard forms use broader language ('assignment of interest under this Policy') which may still block claim assignments. Contractors are explicitly prohibited from acting as public adjusters or negotiating claims without separate licensing. Public adjuster contracts require 10-business-day cancellation window and detailed disclosures. Insurance claim advances face mortgagee/loss-payee complications. All ClaimBridge features BLOCKED pending Maryland-specific legal review and possible product restructuring."
  },
  "contractor_flow_status": "DEMO_ONLY — Contractor financing may be viable as commercial-purpose lending through licensed providers, but all live transaction features must be blocked until: (1) provider licensing confirmed; (2) interest rate and fee compliance verified; (3) token collateral (if any) reviewed; (4) no insurance claim negotiation or public adjuster activity facilitated; (5) contract disclosures comply with MHIC and Consumer Protection Act requirements.",
  "homeowner_flow_status": "BLOCKED — Homeowner-facing lending features trigger consumer loan licensing requirements under Md. Code, Fin. Inst. § 11-201 et seq. Assignment of insurance benefits faces significant legal uncertainty. Consumer protection law is robust and strictly enforced. No live homeowner transactions without legal review.",
  "restoration_company_flow_status": "DEMO_ONLY — Restoration companies face the same constraints as contractors. Cannot negotiate claims, cannot accept AOB assignments without legal analysis of policy language under Featherfall standard. Commercial financing may be viable through licensed providers.",
  "escrow_backed_advance": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": ["mhic_licensed_contractors"],
    "blocked_actions": ["consumer_purpose_escrow_advance", "cross_collateralization", "commingled_escrow_disbursement"],
    "required_reviews": ["legal", "escrow_provider", "ofr_compliance"],
    "required_disclosures": ["escrow_agreement", "custodial_terms", "mortgagee_notice_if_applicable"],
    "notes": "Escrow-backed advances to MHIC-licensed contractors for commercial purposes may be viable with proper structuring. Escrow must be maintained in segregated accounts at federally insured depositories. Disbursement must be milestone-based with clear condition precedent. Consumer-purpose escrow advances are blocked due to lending licensing requirements. Advances from insurance proceeds must account for loss-payee and mortgagee interests."
  }
}
```

### 10.2 Feature-Level Smart Contract Status

| Feature | Status | Notes |
|---------|--------|-------|
| Block live loan creation | **TRUE** | Consumer loan licensing required; loans to unlicensed persons are unenforceable. Commercial loans may be viable through licensed providers only. |
| Block token collateral lock | **TRUE** | No clear Maryland legal framework for digital asset collateral. Money transmission risk. UCC Article 9 applicability unclear. |
| Block liquidation | **TRUE** | No clear authority for automated/smart contract liquidation under Maryland law. Consumer protection concerns. |
| Block assignment of claim proceeds | **TRUE** | Legal uncertainty following *Featherfall*. Assignment validity depends on specific policy language. Mortgagee complications. Contractor cannot negotiate claims. |
| Block repayment routing from insurance proceeds | **TRUE** | Loss draft checks typically name mortgagee as payee. Direct routing to third parties requires mortgagee consent. Public adjuster licensing issues. |
| Allow demo-only records | **TRUE** | Demo/mockup mode permitted for all flows. |
| Allow hash/reference-only audit records | **TRUE** | Reference-only records on blockchain for audit/compliance purposes may be permissible without triggering licensing. |
| Escrow-backed milestone disbursement | **REVIEW REQUIRED** | May be viable for commercial-purpose contractor advances with proper escrow structure. |

### 10.3 Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **HIGH** | Strict licensing regime (consumer loan, installment loan). Loans acquired by unlicensed persons are unenforceable. Recent repeal of assignee exemption (SB 784) tightens secondary market rules. Interest rate caps on consumer loans (24% max on unsecured). |
| Insurance Claim Risk | **HIGH** | No comprehensive AOB statute. *Featherfall* decision creates uncertainty. ISO standard policy forms may still block claim assignments. Strict public adjuster licensing. Mortgagee involvement in loss drafts. 12-month minimum ALE required. |
| AOB Risk | **MODERATE-HIGH** | Post-loss claim assignment generally permitted per *Featherfall* where anti-assignment clause is narrow. Validity depends on specific policy language. ISO forms use broader language that may block assignments. No statutory AOB framework. |
| Public Adjuster Risk | **HIGH** | Strict licensing required. 10-business-day cancellation window. Contractors explicitly barred from acting as public adjusters. Reporting requirements for contracts within 72 hours of loss. Cannot solicit 8pm-8am. Fee disclosure requirements. |
| Token Collateral Risk | **UNKNOWN/HIGH** | No state-level digital asset framework. Money Transmission Act does not include virtual currency but Commissioner has broad authority. UCC Article 9 applicability unclear. Federal regulatory overlay. |
| Escrow Advance Risk | **MODERATE** | Escrow overseen by Commissioner of Financial Regulation. Commercial-purpose advances to licensed contractors may be viable with proper structuring. Consumer-purpose escrow advances blocked. Must avoid commingling and unauthorized disbursement. |
| Consumer Protection Risk | **HIGH** | Very robust consumer protection framework. Consumer Protection Act applies broadly. Financial Consumer Protection Act of 2018 adds "abusive" practices. Civil penalties up to $10,000 (initial) / $25,000 (subsequent). Strong enforcement by Attorney General and OFR. |

---

*This file is for research and informational purposes only. It does not constitute legal advice. All SmartContractor product features must be reviewed and approved by Maryland-licensed legal counsel before deployment. All statutory citations should be verified against the current official code.*
