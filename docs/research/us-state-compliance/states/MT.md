# SmartContractor State Compliance: Montana (MT)

## 1. State Summary & Key Facts

| Fact | Detail |
|------|--------|
| **Primary Insurance Regulator** | Montana Commissioner of Securities and Insurance (CSI) — [csimt.gov](https://csimt.gov) |
| **Primary Banking Regulator** | Montana Division of Banking and Financial Institutions (BFI) |
| **Money Transmitter License** | **NOT required at state level** — Montana does not regulate money transmitters under MCA 32-26-101 et seq. |
| **Usury Cap** | 15% for loans under $1,500 unless licensed (MCA 31-1-107); greater of 15% or prime + 6% for written contracts above $1,500 |
| **Consumer Loan Act** | MCA 32-5-101 et seq.; license required for consumer-purpose lending via NMLS |
| **Contractor Licensing** | Primarily **local**; state-level registration only (no exam/experience required) |
| **AOB Status** | Generally permitted post-loss; no specific AOB statute; general contract law applies |
| **Public Adjuster License** | Required through CSI; $5,000 surety bond; 24 CE hours biennially |
| **Overall Stance** | Relatively permissive; favorable for digital asset businesses; consumer lending triggers licensing |

**Bottom line for SmartContractor:** Montana is an outlier — no state money transmitter license is required, making token collateral operations more favorable than most states. However, consumer-purpose lending to homeowners triggers the Montana Consumer Loan Act licensing requirement. Contractor financing structured as business-purpose loans may fall outside the Act. Escrow activities may be regulated by the Division of Banking and should be carefully structured. All homeowner-facing financing products must be routed through a Montana-licensed lender or obtain a license.

---

## 2. Regulatory Bodies & Sources

| Agency | Role | Contact / URL |
|--------|------|---------------|
| Montana Commissioner of Securities and Insurance (CSI) | Insurance regulation, adjuster licensing, unfair trade practices | [csimt.gov](https://csimt.gov) / (406) 444-2040 |
| Montana Division of Banking and Financial Institutions (BFI) | Consumer loan licensing, mortgage regulation, escrow oversight | [doa.mt.gov/BFID](https://doa.mt.gov/BFID/) / (406) 841-2920 |
| Montana Dept of Labor & Industry (DLI) | Contractor registration (not licensing) | [dli.mt.gov](https://dli.mt.gov) / (406) 444-7734 |
| Montana Attorney General — Consumer Protection | Deceptive trade practice enforcement | [dojmt.gov](https://dojmt.gov) / (406) 444-2026 |
| NMLS | Consumer loan license application and management | [nationwidelicensingsystem.org](https://nationwidelicensingsystem.org) |
| FinCEN (federal) | MSB registration for crypto/digital asset businesses | [fincen.gov](https://fincen.gov) |

**Key statutes referenced throughout this file:**
- **MCA 31-1-107** — Interest rate/usury cap
- **MCA 32-5-101 et seq.** — Montana Consumer Loan Act
- **MCA 32-26-101 et seq.** — Money Transmitter Act (not enforced against digital assets)
- **MCA 33-18-101 et seq.** — Unfair Trade Practices Act (insurance claim handling)
- **MCA 33-17-301 et seq.** — Public adjuster standards of conduct
- **MCA 30-14-101 et seq.** — Montana Consumer Protection Act

---

## 3. Lending / Finance Licensing Notes

### Montana Consumer Loan Act (MCA 32-5-101 et seq.)

A license is **required** for engaging in the business of making "consumer loans" in Montana. Key provisions:

| Element | Requirement |
|---------|-------------|
| **Definition of consumer loan** | Credit to an individual primarily for personal, family, or household purposes (MCA 32-5-102(2)(a)) |
| **Exclusions** | Credit card debt, utility bills, bank/credit union loans, medical debts, commercial/business-purpose loans |
| **Loan servicer licensing** | Servicers of Montana Consumer Loans must be licensed (2016 BFI memo; 2023 AG Opinion) |
| **Venue** | NMLS (Nationwide Multistate Licensing System) |
| **License cost** | $500 per location, annually, renewable in December |
| **Bond** | No bond required |
| **Branch licensing** | Required for each location |

### Usury Cap (MCA 31-1-107)

| Loan Size | Maximum Rate |
|-----------|-------------|
| Under $1,500 | **15%** unless licensed under the Consumer Loan Act |
| $1,500+ (written contract) | Greater of **15%** or **prime rate + 6%** |

### Commercial / Business-Purpose Loans

The Consumer Loan Act applies to **consumer-purpose** loans. Commercial or business-purpose loans — including working capital advances to registered contractors — may fall outside the Act's scope but require individual legal analysis to confirm true business purpose. This distinction is critical for SmartContractor's contractor advance products.

### SmartContractor Implications
- Any financing extended to **Montana homeowners** for personal, family, or household purposes (including restoration/repair financing) likely requires a consumer loan license or partnership with a Montana-licensed lender.
- **Business-purpose advances to contractors** may not require a Consumer Loan Act license if properly structured and documented.
- Interest rates on unlicensed loans under $1,500 **cannot exceed 15%**.
- Loan servicers (including any entity handling repayment collections on Montana Consumer Loans) must be licensed.

---

## 4. Escrow-Backed Contractor Advance Rules

### Regulatory Framework

Montana does not have a standalone, comprehensive state escrow statute for construction or contractor payment escrow. However, escrow activities may fall under the oversight of the **Montana Division of Banking and Financial Institutions (BFI)** if the escrow provider is acting as a financial services entity. Key considerations:

| Aspect | Detail |
|--------|--------|
| **Primary regulator** | Montana Division of Banking and Financial Institutions |
| **Escrow licensing** | No dedicated "escrow agent" license; escrow activities by banks, credit unions, and title companies are generally permissible under existing charters |
| **Independent escrow companies** | May require registration or licensing analysis under Montana financial services law |
| **Application to contractor advances** | Escrow structures for holding contractor advance funds pending job completion are not specifically regulated but must comply with general trust/fiduciary duties |

### Escrow-Backed Advance Structure for SmartContractor

When SmartContractor uses an escrow mechanism to hold funds disbursed to contractors:

1. **Escrow agent selection** — Use a Montana-chartered bank, credit union, or licensed title company to hold escrow funds. Avoid unlicensed third-party escrow arrangements.
2. **Escrow agreement requirements** — The agreement should clearly define:
   - Conditions precedent for disbursement (e.g., proof of work completion, homeowner sign-off, inspection pass)
   - Holdback amounts (typically 5-10% for punch-list/pending items)
   - Timeline for disbursement after conditions are met
   - Interest disposition on escrowed funds
   - Dispute resolution mechanics
3. **Consumer vs. business purpose** — If the escrow backs a consumer-purpose loan (homeowner restoration), the underlying loan remains subject to the Montana Consumer Loan Act. Escrow does not shield the lender from licensing requirements.
4. **Escrow for business-purpose contractor advances** — Escrow structures holding business-purpose working capital advances may be used to mitigate performance risk without implicating consumer lending law, provided the advance is documented as a true commercial transaction.
5. **Trust account obligations** — Any entity holding client funds in escrow owes fiduciary duties under Montana common law. Commingling of escrow funds with operating funds is prohibited.

### Risk Controls

| Risk | Mitigation |
|------|------------|
| Escrow provider licensing risk | Partner with a Montana-chartered depository institution or licensed title company |
| Consumer lending triggered | Ensure escrow structure does not convert a business-purpose advance into consumer credit |
| Fiduciary / commingling risk | Maintain segregated escrow accounts; no commingling with SmartContractor operating funds |
| Disbursement delay risk | Define clear, objective disbursement triggers in the escrow agreement |

### SmartContractor Feature Status: Escrow-Backed Advances

```
ESCROW_CONTRACTOR_ADVANCE: LEGAL_REVIEW_REQUIRED
- Permitted as a risk-mitigation structure for business-purpose contractor advances
- Escrow provider must be a Montana-chartered bank, credit union, or licensed title company
- Does NOT exempt underlying consumer loans from Consumer Loan Act licensing
- Requires counsel-approved escrow agreement templates
- Recommended for: milestone-based disbursement, holdback for punch-list, homeowner protection
```

---

## 5. Contractor Licensing & Registration

### Montana Has NO State-Level General Contractor License

Montana contractors are regulated minimally at the state level. Instead of a competency license, contractors must **register** with the Department of Labor & Industry.

| Registration Type | Fee | Validity | Requirements |
|-------------------|-----|----------|--------------|
| **Construction Contractor Registration (CR)** | $70 | 2 years | For contractors with employees, corporations, or manager-managed LLCs. **No exam. No experience requirement.** |
| **Independent Contractor Exemption Certificate (ICEC)** | $125 | 2 years | For independent contractors without employees |

### Specialty Trades (State-Level Licensing Required)

| Trade | Licensing Body | Exam & Experience |
|-------|---------------|-------------------|
| Electricians | Montana State Electrical Board | Yes — exam and experience required |
| Plumbers | Montana Board of Plumbers | Yes — exam and experience required |

### Other Requirements

- **Workers' compensation**: Mandatory for all employers with one or more employees (cornerstone of Montana's contractor system)
- **Surety bond**: Not required at state level for general contractor registration (local jurisdictions may require)
- **General liability insurance**: Not required at state level (often required by contracts and local jurisdictions)
- **Local licensing**: Cities and counties may impose additional licensing, bonding, or insurance requirements

### SmartContractor Implications
- Contractors receiving financing through SmartContractor should hold valid CR or ICEC registration.
- Specialty trade contractors (electrical, plumbing) must hold state-level licenses.
- Business-purpose contractor advances should verify active registration status before funding.
- Local jurisdiction requirements should be checked on a per-project basis.

---

## 6. Insurance Claim Advance & Assignment of Benefits

### Montana's Unique "Ridley Advance Pay Rule" (Third-Party Claims)

Montana has a distinctive rule requiring insurers to advance-pay certain damages before settlement when liability is "reasonably clear." However, this applies to **third-party liability claims** (e.g., auto accidents), **NOT** to first-party property insurance claims (homeowner damage claims).

| Element | Detail |
|---------|--------|
| **Source cases** | *Ridley v. Guarantee Nat'l Ins. Co.*, 951 P.2d 987 (Mont. 1997); *DuBray v. Farmers Ins. Exchange*, 36 P.3d 897 (Mont. 2001) |
| **Standard** | Liability "reasonably clear" = a knowledgeable person would conclude defendant was 50%+ negligent |
| **Scope** | Third-party liability claims only (auto, personal liability) — NOT first-party homeowner property claims |

### First-Party Property Claims (Homeowner Claims)

| Rule | Statute |
|------|---------|
| Insurer must acknowledge and act promptly on communications | MCA 33-18-201 |
| Insurer must pay or deny within 30 days of proof of loss (60 days if additional info requested) | MCA 33-18-232 |
| Interest accrues on late-paid claims over $5 | MCA 33-18-232(2) |
| **Independent cause of action** for insurer UTPA violations; attorney fees available | MCA 33-18-242 |

### Assignment of Benefits (AOB)

| Aspect | Status |
|--------|--------|
| **AOB statute** | None — Montana does not have a specific AOB statute for homeowner insurance claims |
| **General rule** | Post-loss assignment of claim proceeds is generally permitted under Montana common law |
| **Anti-assignment clauses** | Typically apply only to **pre-loss** assignments of the policy itself; post-loss assignments of claim proceeds generally permitted |
| **Required form/language** | None — no mandated AOB notice language, font size, cancellation window, or contractor limit |

### SmartContractor Implications
- AOB is **permitted** in Montana for post-loss insurance claims but there is **no statutory safe harbor**.
- SmartContractor cannot rely on a statutory framework for AOB transactions — agreements must be carefully drafted under general Montana contract law.
- The Ridley Advance Pay Rule is **not directly relevant** to first-party homeowner claim advances.
- Montana's strong UTPA protections and independent cause of action (MCA 33-18-242) create a **heightened compliance environment** for any claim-related product.
- Mortgagee/loss payee rights must be accounted for in any claim proceeds assignment.

```
AOB_STATUS: PERMITTED_POST_LOSS / NO_STATUTORY_SAFE_HARBOR
CLAIM_ADVANCE_STATUS: LEGAL_REVIEW_REQUIRED
```

---

## 7. Public Adjuster & Insurance Representation

### Montana Public Adjuster Licensing Requirements

| Requirement | Detail |
|-------------|--------|
| **License required** | Yes — through Montana CSI |
| **Minimum age** | 18 |
| **Bond** | $5,000 surety bond |
| **Exam** | Must pass adjuster licensing exam |
| **CE requirements** | 24 approved credit hours biennially (3 ethics + 1 Montana legislative changes) |
| **Non-resident licenses** | Available; must meet Montana eligibility requirements |
| **Fee cap** | No statutory fee cap; compensation must be disclosed in a written contract before services begin |

### Standards of Conduct (MCA 33-17-301 et seq.; ARM 6.6.1601-1616)

Public adjusters in Montana must:
- Serve **only the insured's interests** with objectivity and loyalty
- **Not solicit** during a loss-producing event
- **Not permit** unlicensed personnel to perform adjuster work
- **Not acquire** property interests without written permission
- Maintain transaction records and act in a **fiduciary capacity**

### SmartContractor Implications — Critical

**Contractors and SmartContractor representatives MUST NOT perform public adjuster functions** without a Montana public adjuster license. Prohibited activities include:
- Negotiating with insurance companies on behalf of homeowners
- Interpreting policy coverage
- Preparing claim estimates for fee or commission
- Advising on claim strategy or settlement amounts

**Clear separation required:**

| Role | Permitted Activity |
|------|-------------------|
| Contractor | Repair work, construction estimates for work to be performed |
| Public Adjuster | Claim negotiation, policy interpretation, settlement advocacy (requires license) |
| SmartContractor | Financing/advance product; payment processing; escrow administration |

Performing adjuster functions without a license constitutes the **unauthorized practice of public adjusting**, a violation of Montana insurance law with potential civil and criminal penalties.

---

## 8. Token Collateral / Digital Asset Notes

### Montana Has NO State Money Transmitter License Requirement

Montana is one of the few U.S. states that does **not** impose a state-level money transmitter license. The Division of Banking website explicitly states: **"MONTANA DOES NOT REGULATE MONEY TRANSMITTERS."**

| Requirement | Status |
|-------------|--------|
| State money transmitter license | **NOT required** |
| Federal MSB registration with FinCEN | **Required** (Bank Secrecy Act) |
| AML/KYC program | **Required** (federal) |

> **Note:** In March 2023, Montana briefly requested detailed business plans from crypto operators, suggesting a potential policy shift. This requirement was later retracted, reaffirming the no-state-MTL policy.

### UCC Article 12 / Digital Assets

Montana has introduced legislation to adopt the **2022 UCC amendments**, which include:
- **Article 12** — governing Controllable Electronic Records (CERs)
- **Amended Article 9** — allowing perfection of security interests in digital assets by "control" (superior priority over filing)

**Status of adoption:** Requires verification with Montana counsel. If adopted, UCC Article 12 would provide a framework for digital asset ownership transfer and security interest perfection by control.

### SmartContractor Implications

Montana's lack of a state money transmitter license is **highly favorable** for token collateral operations. However:

1. **Federal FinCEN/BSA compliance** remains mandatory
2. **UCC 2022 adoption status** needs verification before relying on "control"-based perfection
3. Using cryptocurrency as **collateral for consumer loans** may trigger Montana Consumer Loan Act considerations
4. Smart contract-based collateral lock/liquidation is **novel and untested** under Montana law

```
TOKEN_COLLATERAL_STATUS: LEGAL_REVIEW_REQUIRED / NOT_BLOCKED_BY_STATE_LAW
- Favorable: no state money transmitter license
- Blocked: live token collateral features pending legal review and UCC adoption verification
- Federal compliance (FinCEN MSB, BSA/AML) is mandatory regardless
```

---

## 9. SmartContractor Feature Risk Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| **Contractor Equipment Credit (business purpose)** | `LEGAL_REVIEW_REQUIRED` | May fall outside Consumer Loan Act if properly structured as commercial. Verify contractor registration status. |
| **Escrow-Backed Contractor Advance** | `LEGAL_REVIEW_REQUIRED` | Use Montana-chartered bank/credit union/title company as escrow agent. Define objective disbursement triggers. |
| **Token Collateral / Digital Asset Lock** | `LEGAL_REVIEW_REQUIRED` | No state MTL required (favorable). Federal FinCEN/BSA compliance mandatory. UCC Article 12 status needs verification. |
| **Homeowner Restoration Financing** | `BLOCKED / LICENSE_REQUIRED` | Consumer-purpose lending to homeowners triggers Montana Consumer Loan Act. Requires licensed lender partnership. |
| **Insurance Claim Advance (ClaimBridge)** | `LEGAL_REVIEW_REQUIRED` | Strong UTPA protections (MCA 33-18-242). No specific AOB statute. Mortgagee/loss payee rights must be addressed. |
| **Assignment of Benefits** | `PERMITTED_POST_LOSS` | No AOB statute; general contract law applies. Post-loss assignments generally permitted. No statutory safe harbor. Counsel-approved AOB text required. |
| **Public Adjuster Services** | `LICENSE_REQUIRED` | SmartContractor and contractor partners must NOT perform adjuster functions without a Montana public adjuster license. |
| **Mortgagee/Loss Payee Handling** | `COUNSEL_REVIEW_REQUIRED` | Standard mortgagee/loss payee rules apply. Mortgage servicer manages fund release. Priority claim issues require legal review. |

### Aggregate Risk Scores

| Risk Category | Score | Rationale |
|---------------|-------|-----------|
| Lending / Consumer Loan | **HIGH** | Consumer Loan Act requires licensing for homeowner-facing products. Loan servicers must also be licensed. Strong consumer protection environment. |
| Insurance Claim / AOB | **MEDIUM** | No AOB statute means fewer barriers but less certainty. Strong UTPA protections with independent cause of action. Ridley rule not applicable to first-party claims. |
| Public Adjuster | **HIGH** | Strict licensing requirements. Unauthorized practice carries significant penalties. Clear separation between financing and claim adjustment is mandatory. |
| Token Collateral / Digital Assets | **MEDIUM** | No state MTL is highly favorable. Federal requirements still apply. UCC 2022 adoption status uncertain. Novel collateral structure untested under Montana law. |
| Escrow / Fund Administration | **MEDIUM** | No dedicated escrow statute, but Division of Banking may regulate. Use chartered institutions as escrow agents. Fiduciary duties apply. |
| Consumer Protection | **HIGH** | Montana Consumer Protection Act (MCA 30-14-101) prohibits unfair/deceptive practices with private right of action. Attorney fees available. Broadly applied. |

---

## 10. Required Disclosures & Regulatory Contacts

### Disclosure 1: Consumer Loan License Status

```
COUNSEL_APPROVED_TEXT_REQUIRED

[If SmartContractor is not a Montana-licensed lender:]
"SmartContractor is not licensed as a consumer lender under the Montana Consumer
Loan Act. Any loan or financing product offered to Montana residents is made in
partnership with [LICENSED LENDER NAME], a Montana-licensed consumer lender. All
loan terms, including interest rates and fees, comply with Montana law. The maximum
interest rate for loans under $1,500 is 15% per annum unless made by a licensed lender.
For questions or complaints, contact the Montana Division of Banking and Financial
Institutions at (406) 841-2920."
```

### Disclosure 2: Assignment of Benefits (AOB)

```
COUNSEL_APPROVED_TEXT_REQUIRED

"You are being asked to assign your insurance claim benefits to [ASSIGNEE].
Under Montana law, you have the right to file your insurance claim directly with
your insurance company without using an assignment. By signing this agreement,
you are transferring your right to receive insurance payments for covered repairs
to [ASSIGNEE]. You remain responsible for your insurance deductible and any work
not covered by insurance. Your mortgage lender may have rights to insurance
proceeds that take priority over this assignment. You should review this agreement
carefully before signing. You may wish to consult with your own attorney or
insurance professional."
```

### Disclosure 3: Public Adjuster Representation

```
COUNSEL_APPROVED_TEXT_REQUIRED

"SmartContractor and its representatives are NOT licensed public adjusters. We do
not negotiate with insurance companies on your behalf, interpret your insurance
policy, or prepare claim estimates for fee or commission. If you need assistance
with negotiating your insurance claim, you may hire a licensed Montana public
adjuster. You can verify a public adjuster's license at https://csimt.gov."
```

### Disclosure 4: Token Collateral / Digital Asset Risk

```
COUNSEL_APPROVED_TEXT_REQUIRED

"Your digital assets will be held as collateral for your loan. The value of digital
assets can fluctuate significantly. If the value of your collateral falls below a
specified threshold, your collateral may be liquidated without additional notice to
you. You may be required to provide additional collateral. Federal and state laws
regarding digital assets are evolving and may affect your rights. This transaction
is subject to federal Bank Secrecy Act and Anti-Money Laundering requirements.
Montana does not require a state money transmitter license for this transaction;
however, all federal digital asset regulations apply."
```

### Disclosure 5: Escrow-Backed Advance

```
COUNSEL_APPROVED_TEXT_REQUIRED

"Funds for this contractor advance are being held in escrow by [ESCROW AGENT NAME],
a [Montana-chartered bank / credit union / licensed title company]. Funds will be
released according to the milestones and conditions set forth in your escrow
agreement. A holdback of [X%] may be retained until final inspection and homeowner
sign-off. Interest on escrowed funds, if any, will be [disposition terms]. Disputes
regarding disbursement will be resolved per the dispute resolution provisions in
the escrow agreement."
```

### Disclosure 6: Mortgagee/Loss Payee Notice

```
COUNSEL_APPROVED_TEXT_REQUIRED

"If your property is subject to a mortgage, your mortgage lender is entitled to
receive notice of this assignment and may have rights to insurance proceeds that
take priority over this agreement. Your mortgage lender may be named as a loss
payee on your insurance policy and may need to endorse any insurance payment
checks. This assignment does not affect your obligation to make mortgage payments."
```

### Disclosure 7: Montana Consumer Protection Notice

```
COUNSEL_APPROVED_TEXT_REQUIRED

"Montana law prohibits unfair or deceptive trade practices. If you believe you
have been treated unfairly, you may file a complaint with the Montana Commissioner
of Securities and Insurance at https://csimt.gov/file-a-complaint/ or the Montana
Department of Justice, Consumer Protection Office at (406) 444-2026."
```

### Regulatory Contact Directory

| Agency | Address | Phone | Website |
|--------|---------|-------|---------|
| Montana Commissioner of Securities and Insurance | 840 Helena Ave, Helena, MT 59601 | (406) 444-2040 | [csimt.gov](https://csimt.gov) |
| Montana Division of Banking and Financial Institutions | PO Box 200546, Helena, MT 59620 | (406) 841-2920 | [doa.mt.gov/BFID](https://doa.mt.gov/BFID/) |
| Montana Dept of Labor & Industry — Contractor Registration | PO Box 8011, Helena, MT 59604 | (406) 444-7734 | [dli.mt.gov](https://dli.mt.gov) |
| Montana Attorney General — Consumer Protection | 215 N Sanders, Helena, MT 59601 | (406) 444-2026 | [dojmt.gov](https://dojmt.gov) |

---

*DISCLAIMER: This compliance file is for research and informational purposes only.*
*It does not constitute legal advice. All SmartContractor product features marked*
*`LEGAL_REVIEW_REQUIRED` or `BLOCKED` must be reviewed by Montana-licensed counsel*
*before launch. All disclosure text marked `COUNSEL_APPROVED_TEXT_REQUIRED` must be*
*drafted and approved by a licensed Montana attorney before use.*

*File Version: 1.0 | State: Montana (MT) | Last Updated: 2025*
