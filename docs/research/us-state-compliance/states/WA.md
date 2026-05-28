# Washington (WA) — SmartContractor Compliance File

> **Classification:** HIGH REGULATION state  
> **Last Updated:** 2026-07-XX  
> **Status:** BLOCKED for live ClaimBridge operations | RESTRICTED DEMO ONLY for contractor flow  
> **Primary Regulators:** WA OIC (insurance.wa.gov) | WA DFI (dfi.wa.gov) | WA L&I (lni.wa.gov)

---

## 1. Executive Summary & Risk Overview

Washington State presents a **complex, restrictive, and actively enforced regulatory environment** for SmartContractor products. The state combines strict consumer lending laws, pending legislation that would outright prohibit post-loss Assignment of Benefits (AOB), aggressive consumer protection enforcement, and uncertain but potentially burdensome digital asset regulation.

### Key Findings

| Factor | Status | Detail |
|--------|--------|--------|
| Consumer Lending | HIGH RISK | Consumer Loan Act (RCW 31.04) requires DFI license; 25% APR cap for licensed lenders; 12% general usury (RCW 19.52) |
| Commercial Loan Exemption | AVAILABLE | Business-purpose loans to registered contractors may be exempt IF not secured by borrower's primary dwelling |
| AOB / ClaimBridge | **CRITICAL — BLOCKED** | SB 6178 (2025-2026) would PROHIBIT post-loss AOB entirely; passed Senate unanimously Feb 5, 2026; pending House |
| Token Collateral | UNKNOWN — COUNSEL REVIEW | RCW 19.230 (Money Transmitter Act) may apply; virtual currency licensees must provide disclosures (RCW 19.230.370) |
| Contractor Registration | MODERATE | L&I registration required (not licensing); $30K/$15K bond; no trade exam |
| Public Adjuster | HIGH RISK | License required via OIC; $5,000 bond; contractors must NOT engage in adjuster activity |
| Insurance Fair Conduct Act | HIGH RISK | Treble damages for unreasonable claim denial (RCW 48.30.015) |
| Consumer Protection | HIGH RISK | RCW 19.86 provides treble damages, attorney fees, civil penalties |

### Bottom Line

- **ClaimBridge (AOB-based):** BLOCKED — SB 6178, if enacted, eliminates the legal foundation for post-loss assignment of benefits in property insurance.
- **Contractor Equipment Credit:** RESTRICTED DEMO ONLY — commercial loan exemption may apply to registered contractors, but legal confirmation required before any live transactions.
- **Token Collateral Loans:** BLOCKED — money transmission licensing implications under RCW 19.230 are unresolved.
- **Homeowner Flow:** BLOCKED — any financing to consumers requires full DFI Consumer Loan Act licensing.

---

## 2. Official Sources & Regulators

### Primary Regulatory Agencies

| Agency | Role | Website |
|--------|------|---------|
| **WA Office of Insurance Commissioner (OIC)** | Primary insurance regulator; licensing of adjusters, producers; enforcement of IFCA | https://www.insurance.wa.gov/ |
| **WA Dept. of Financial Institutions (DFI)** | Consumer lending licensing (Consumer Loan Act), money transmission/virtual currency, escrow regulation | https://dfi.wa.gov/ |
| **WA Dept. of Labor & Industries (L&I)** | Contractor registration (not licensing), workplace safety, wage & hour | https://www.lni.wa.gov/licensing-permits/contractors/ |

### Key Statutes & Regulations

| Citation | Subject | URL |
|----------|---------|-----|
| RCW 31.04 | Consumer Loan Act | https://app.leg.wa.gov/rcw/default.aspx?cite=31.04 |
| RCW 19.52 | Interest / Usury | https://app.leg.wa.gov/rcw/default.aspx?cite=19.52 |
| RCW 19.230 | Uniform Money Services Act | https://app.leg.wa.gov/rcw/default.aspx?cite=19.230 |
| RCW 48.17 | Insurance Producer / Adjuster Licensing | https://app.leg.wa.gov/rcw/default.aspx?cite=48.17 |
| RCW 48.18 | Insurance Contracts | https://app.leg.wa.gov/rcw/default.aspx?cite=48.18 |
| RCW 48.30.015 | Insurance Fair Conduct Act | https://app.leg.wa.gov/rcw/default.aspx?cite=48.30.015 |
| RCW 18.27 | Contractor Registration | https://app.leg.wa.gov/rcw/default.aspx?cite=18.27 |
| RCW 19.86 | Consumer Protection Act | https://app.leg.wa.gov/rcw/default.aspx?cite=19.86 |
| WAC 208-620 | Consumer Loan Regulations | https://app.leg.wa.gov/wac/default.aspx?cite=208-620 |
| WAC 284-30 | Unfair Claims Settlement Practices | https://app.leg.wa.gov/wac/default.aspx?cite=284-30 |
| SB 6178 (2025-26) | AOB Prohibition Bill | https://app.leg.wa.gov/BillSummary/?BillNumber=6178&Year=2026 |

---

## 3. Lending & Finance Licensing

### Consumer Loan Act (RCW Chapter 31.04)

No person may engage in making secured or unsecured loans, extending credit, or servicing residential mortgage loans without a license from DFI (RCW 31.04.035).

**Licensed Lender Rate Caps:**
- **Licensed consumer loan companies:** Maximum 25% APR per annum (WAC 208-620-235)
- **General usury cap:** 12% per year absent written agreement, or 4% above the Federal Reserve 26-week T-bill rate, whichever is higher (RCW 19.52.020)
- Licensed consumer loan companies are generally exempt from the 12% general usury cap

**Licensing Requirements (via NMLS):**
- $30,000 electronic surety bond
- Audited financial statements
- Criminal background checks and credit reports for all control persons
- $1,162.21 licensing fee
- Compliance with WAC 208-620

**Key Exemptions** (RCW 31.04.025):
- Banks, credit unions, savings and loan associations
- Loans primarily for **business, commercial, or agricultural purposes** (unless secured by borrower's primary dwelling)
- Seller financing (limited to 5 or fewer transactions per year; not available to contractors building residential dwellings)
- Immediate family loans
- Nonprofit housing organizations meeting specific criteria

### Commercial / Business Loan Exemption

- **No DFI license required** for commercial real estate loans or business-purpose loans not secured by a primary dwelling
- DFI recommends documenting the exemption with a **Business Purpose Affidavit**
- The exemption is void if the loan is secured by the borrower's primary residence — this is a critical trap

### Anti-Evasion Provisions (RCW 31.04.025(2)-(3))

Washington aggressively enforces anti-evasion rules:
- Any "device, subterfuge, or pretense to evade" licensing requirements is prohibited
- A person is deemed a **lender** if they hold the "predominant economic interest" in the loan, regardless of whether they purport to act as an agent or service provider
- Transactions structured to evade licensing will be subject to the full Act

### Mortgage Broker / Servicing

- Mortgage broker licensing required under Mortgage Broker Practices Act (Chapter 19.146 RCW) for residential mortgage brokering
- Collection agency licensing (Chapter 19.16 RCW) may be required for debt collection activities

---

## 4. Escrow, Digital Assets & Enhanced Regulatory Oversight *(NEW)*

### Escrow Regulation (WA DFI)

Washington DFI regulates escrow activities under RCW Chapter 18.44 and WAC Chapter 208-680:

- **Escrow Agent License Required:** No person may engage in escrow business without a license from DFI (RCW 18.44.021)
- **Exemptions:** Banks, credit unions, title insurers, attorneys in certain transactions, and licensed real estate brokers handling their own transactions may be exempt
- **Trust Fund Requirements:** Escrow agents must maintain all funds in a federally insured trust account, separate from operating funds
- **Fidelity Bond:** Minimum $20,000 fidelity bond or errors and omissions coverage required (RCW 18.44.361)
- **Implications for SmartContractor:** If any SmartContractor product involves holding funds in trust between a homeowner and contractor (e.g., milestone-based disbursement of insurance proceeds), escrow licensing analysis is required. Smart contract-based escrow substitutes are NOT clearly exempt.

### Virtual Currency & Digital Asset Licensing (RCW Chapter 19.230)

The Uniform Money Services Act (RCW 19.230) governs money transmission and virtual currency activity:

**Money Transmitter License:**
- Required for any person engaged in the business of money transmission (RCW 19.230.030)
- "Money transmission" includes receiving money or monetary value for transmission to another location or person
- **Virtual currency** is treated as a form of "monetary value" under the Act

**Mandatory Disclosures for Virtual Currency Licensees (RCW 19.230.370):**

All virtual currency licensees must provide the following disclosures to users:
1. A schedule of all fees and charges associated with the virtual currency product or service
2. Whether the product is insured or guaranteed by the United States government, the State of Washington, or any other insurance or guarantee mechanism
3. Notice that virtual currency transfers are irrevocable and that the consumer bears the risk of accidental or erroneous transfers
4. The licensee's liability for unauthorized or mistaken transfers
5. The user's responsibility to report errors or unauthorized transactions within specific timeframes
6. A clear statement that virtual currency is not legal tender and is not backed by any government

**Security Audit Requirement:**
- For business models storing virtual currency on behalf of others, a third-party security audit is required (RCW 19.230.040(5))

### SmartContractor Digital Asset Implications

| Activity | Licensing Risk | Status |
|----------|---------------|--------|
| Accepting virtual currency as loan collateral | Potential money transmission | UNKNOWN — REQUIRES COUNSEL |
| Locking tokens in a smart contract as security | Potential custody/money transmission | UNKNOWN — REQUIRES COUNSEL |
| Liquidating virtual currency collateral | Potential money transmission | UNKNOWN — REQUIRES COUNSEL |
| Holding insurance proceeds in trust for disbursement | Potential escrow licensing | UNKNOWN — REQUIRES COUNSEL |
| Providing virtual currency custody to Washington users | Money transmitter license required | BLOCKED |

**Federal Overlay:** FinCEN MSB registration and BSA/AML compliance may also apply to virtual currency activities, creating a dual federal-state licensing requirement.

### Washington's Regulatory Posture

Washington is a **highly active enforcement jurisdiction**:
- DFI and OIC coordinate on cross-industry investigations
- The Attorney General's office aggressively pursues Consumer Protection Act violations (RCW 19.86)
- Both treble damages and attorney fee awards are routinely granted in private enforcement actions
- No regulatory sandbox or safe harbor exists for fintech or blockchain-based lending products

---

## 5. Contractor Registration (L&I)

### Registration Requirements (RCW Chapter 18.27)

Washington requires **registration** (not licensing) of contractors through L&I:

- **Mandatory Registration:** All contractors must register with L&I before advertising, bidding, or performing work (RCW 18.27.020)
- **No Trade Exam:** Washington does not require trade exams, experience verification, or continuing education for general contractor registration
- **Exemption:** Work under $500 total (labor + materials) with no advertising = no registration required

**Registration Bond Requirements (increased July 1, 2024):**
- General contractors: $30,000 surety bond
- Specialty contractors: $15,000 surety bond

**Insurance Requirements:**
- General liability: $200,000 public liability / $50,000 property damage, OR
- $250,000 combined single limit

**Disclosure & Advertising (RCW 18.27.114):**
- Contractors must provide a disclosure statement for residential work over $1,000
- Registration number must appear on ALL advertising, contracts, and bids
- Unregistered contractors **cannot sue for collection of compensation** (RCW 18.27.080) — registration is a prerequisite to suit

### Financing Implications

| Borrower Type | Loan Purpose | License Required? |
|--------------|-------------|-------------------|
| Registered contractor | Business equipment, working capital | Likely EXEMPT (commercial loan exemption) |
| Registered contractor | Loan secured by primary dwelling | LICENSE REQUIRED |
| Homeowner / consumer | Any purpose (repair financing) | LICENSE REQUIRED |
| Unregistered contractor | Any purpose | HIGH RISK — registration prerequisite to suit |

### SmartContractor Requirements

- Verify contractor registration status via L&I database before extending any credit
- Confirm loan is NOT secured by borrower's primary dwelling to preserve commercial exemption
- Require signed Business Purpose Affidavit for all contractor loans
- Do not extend credit to unregistered contractors — collection risk is extreme

---

## 6. Insurance Claims, Prompt Payment & Fair Conduct

### Prompt Payment Standards (WAC 284-30)

| Requirement | Timeline |
|-------------|----------|
| Acknowledge receipt of claim | 10 working days (15 for group contracts) |
| Complete investigation | 30 days unless not reasonably possible |
| Issue settlement or denial | Within reasonable time after investigation |

**Key Prohibitions:**
- Insurers may NOT issue partial settlement checks that release the insurer from total liability (WAC 284-30-350(6))
- Insurers may NOT fail to settle first-party claims on the basis that responsibility should be assumed by others (WAC 284-30-380)
- These rules affect any SmartContractor product that assumes or depends on partial/interim insurance payments

### Additional Living Expenses (ALE)

- ALE is standard coverage in Washington homeowners policies, typically 20% of dwelling coverage
- Covers necessary increase in living expenses when residence is uninhabitable due to covered loss
- Payment is for the "shortest time required" to repair/replace damage
- Washington case law (*Garoutte v. American Family*) interprets "shortest time" broadly — includes assessment, appraisal, and payment periods, not just construction time

### Insurance Fair Conduct Act (RCW 48.30.015) — HIGH RISK

- First-party claimants who are **unreasonably denied** coverage may recover:
  - Actual damages
  - Attorney fees and costs
  - **Treble damages** (up to 3x actual damages) for unreasonable denial or violation of settlement practice rules
- **20-day pre-suit notice** required before filing an IFCA action
- This statute creates enormous exposure for any entity involved in insurance claim disputes, including contractors and financing companies whose actions influence claim outcomes

### Mortgagee / Loss Draft Holder Rights (RCW 48.18.125)

- Standard mortgagee clauses give mortgage holders the right to:
  - Receive notice of cancellation/non-renewal
  - Be named on loss draft checks for property damage
  - Control disbursement of claim proceeds (typically in stages as repairs progress)
- When a mortgagee is named, insurers typically issue loss draft checks jointly to the homeowner **and** the mortgagee
- Mortgagee rights are **senior to any assignment or direction of payment** by the homeowner
- Any product assuming direct flow of insurance proceeds to contractors must account for mortgagee involvement

---

## 7. Assignment of Benefits & SB 6178 *(CRITICAL)*

### The Pending AOB Prohibition

**Senate Bill 6178 (2025-2026 Session)** represents an existential threat to ClaimBridge operations in Washington:

| Attribute | Detail |
|-----------|--------|
| **Status** | Passed WA Senate unanimously (48-0-0-1) on **February 5, 2026**; pending House consideration |
| **Sponsor** | Sen. Victoria Hunt (D-Issaquah) |
| **Requested by** | Insurance Commissioner Patty Kuderer |
| **Title** | "Prohibiting the post-loss assignment of benefits in property insurance" |

### What SB 6178 Would Prohibit

- **All post-loss assignment of benefits agreements** in property insurance claims
- An AOB is defined as any agreement allowing a third party (e.g., contractor) to receive insurance payments directly from the consumer's insurance company
- Any such post-loss AOB would be **void and unenforceable**
- Pre-loss AOB provisions in insurance policies would also be prohibited

### Official OIC Position

> "When a consumer signs the agreement, their right to negotiate with the insurance company shifts to the repair professional and they lose control over their claim. This can lead to delays in the repair work as these disagreements are resolved, as well as inflated claim costs, unnecessary litigation, and higher premiums."
> — WA Office of Insurance Commissioner

### Impact on SmartContractor

| Product Feature | Impact |
|-----------------|--------|
| AOB-based repayment routing | **BLOCKED** — would be void under SB 6178 |
| Direct payment from insurer to contractor | **BLOCKED** — requires an AOB or equivalent, which would be prohibited |
| Claim financing against assigned proceeds | **BLOCKED** — no valid assignment to secure repayment |
| Any smart contract claim assignment feature | **BLOCKED** — prohibited regardless of technical implementation |

### Workaround Assessment

- **No viable workaround** exists if SB 6178 becomes law
- Direct payment from insurer to contractor without an AOB is also problematic, as insurers typically pay the policyholder unless a valid AOB or mortgagee clause directs otherwise
- Homeowners must retain control over their claims and payments
- ClaimBridge AOB-dependent functionality is **incompatible with Washington law** post-enactment

### Pre-SB 6178 Status

- Assignment of insurance policies was governed by RCW 48.18.360 (life/disability) and RCW 48.18.125 (loss payable/mortgagee clauses)
- Post-loss assignment of property insurance claims was not specifically prohibited
- However, standard insurance policy terms typically required insurer consent for assignment
- Even before SB 6178, AOB was an unreliable foundation for product design

---

## 8. Public Adjuster Licensing

### Licensing Requirements (RCW 48.17)

No person may act as or hold themselves out as an adjuster unless licensed by the OIC (RCW 48.17.060).

**Public Adjuster Specifics:**
- **Definition:** An adjuster employed by and representing solely the financial interests of the insured (homeowner)
- **Bond:** $5,000 surety bond required (RCW 48.17.430)
- **Lines:** Must apply for both Property and Casualty lines of authority
- **Fees:** $55 application fee; $50 biennial renewal
- **Qualifications:** 18+ years old, trustworthy, fingerprint background check, experience/education or exam passage

### What Constitutes Public Adjusting

| Activity | Classification |
|----------|---------------|
| Assisting homeowner with documentation, estimates, repair scope | Generally PERMISSIBLE |
| Interpreting policy terms for homeowner | **REQUIRES LICENSE** |
| Negotiating claim settlements with insurer | **REQUIRES LICENSE** |
| Directing claim strategy or advising on coverage | **REQUIRES LICENSE** |
| Holding oneself out as able to maximize claim payment | **REQUIRES LICENSE** |

### Prohibitions for SmartContractor & Contractors

- **GCSC, platform contractors, and affiliated parties must NOT negotiate with insurance companies on behalf of homeowners** unless properly licensed as public adjusters
- All platform materials must include clear disclaimers that GCSC is not an insurance company, adjuster, or public adjuster
- **Penalty for violation:** Administrative sanctions, fines, and potential criminal penalties under RCW 48.17.530 and RCW 48.17.560

### Emergency Adjuster Provisions

Non-resident independent adjusters may register as emergency adjusters after a governor-declared disaster (RCW 48.17.420(2)), valid for 180 days. This does NOT apply to public adjusting on behalf of insureds.

---

## 9. SmartContractor Product Status

### Dashboard Status Summary

```json
{
  "state": "WA",
  "state_name": "Washington",
  "classification": "HIGH_REGULATION",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Token collateral may constitute money transmission under RCW 19.230. Virtual currency licensees must provide disclosures per RCW 19.230.370. Commercial loan exemption may apply to registered contractors but requires legal confirmation."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "SB 6178 (2025-2026) would PROHIBIT post-loss AOB entirely. Passed Senate unanimously Feb 5 2026. AOB-based repayment routing is incompatible with Washington law. Consumer Loan Act licensing required for any advance to homeowners."
  },
  "contractor_flow_status": "RESTRICTED_DEMO_ONLY",
  "homeowner_flow_status": "BLOCKED",
  "restoration_company_flow_status": "RESTRICTED_DEMO_ONLY"
}
```

### Smart Contract Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Block live loan creation | **true** | Consumer loans require DFI licensing. Commercial loans require legal review. |
| Block token collateral lock | **true** | Unknown if money transmission license required under RCW 19.230. |
| Block liquidation | **true** | Token liquidation may constitute money transmission. |
| Block assignment of claim proceeds | **true** | SB 6178 prohibits post-loss AOB. |
| Block repayment routing from insurance | **true** | Incompatible with AOB prohibition and mortgagee rights. |
| Allow demo-only records | **true** | Demonstration/mockup mode is permissible. |
| Allow hash/reference-only audit records | **true** | Immutable audit records without live execution are permissible. |

### Operational Rules

- Smart contracts executing loans, collateral locks, or liquidations must be **DISABLED** for Washington users in production
- **Demo mode only:** UI may display workflow mockups, but no actual loan creation, token lock, or payment routing should execute
- **Audit/hash records:** Reference-only records (e.g., storing a hash of an estimate or invoice on-chain) without executing financial transactions may be permissible but require counsel review
- All Washington-facing materials must include the AOB prohibition disclosure (Section 10)

---

## 10. Required Disclosures & Compliance Checklist

### A. Lending Disclosures (Consumer Loan Act)

All loan documents must include disclosures required by RCW 31.04 and WAC 208-620:
- Right to rescind (where applicable)
- Finance charge and APR
- Payment schedule
- Prepayment penalties (if any)
- Late payment fees
- NMLS Consumer Access link and DFI license number
- **Status:** COUNSEL_APPROVED_TEXT_REQUIRED

### B. Business Purpose Affidavit (Commercial Exemption)

For any loan to a contractor or business, the affidavit must state:
- The loan is for business purposes only
- The loan is NOT secured by the borrower's primary dwelling
- The borrower acknowledges the business purpose and understands this is not a consumer loan
- **Status:** COUNSEL_APPROVED_TEXT_REQUIRED

### C. AOB Prohibition Disclosure *(SB 6178)*

If/when SB 6178 becomes law, all materials presented to Washington homeowners must clearly state:
- Post-loss assignment of insurance benefits is **prohibited by Washington law** (SB 6178)
- The homeowner retains all rights to negotiate with their insurance company
- GCSC/contractor **cannot receive insurance payments directly** from the insurer
- The homeowner controls all claim proceeds and payment decisions
- **Status:** COUNSEL_APPROVED_TEXT_REQUIRED

### D. Virtual Currency Disclosures (RCW 19.230.370)

If offering any virtual currency product, the following must be disclosed:
- Schedule of all fees and charges
- Whether the product is insured or guaranteed (likely NOT)
- Virtual currency transfers are irrevocable
- Licensee liability for unauthorized/mistaken transfers
- User's responsibility to report errors within specified timeframes
- Virtual currency is not legal tender and is not backed by any government
- **Status:** COUNSEL_APPROVED_TEXT_REQUIRED

### E. Insurance Fair Conduct Act Disclaimer

All platform materials must include:
- GCSC is **not** an insurance company, adjuster, or public adjuster
- GCSC does not negotiate insurance claims or influence claim outcomes
- GCSC does not guarantee insurance coverage or claim payment
- **Status:** COUNSEL_APPROVED_TEXT_REQUIRED

### F. Consumer Protection Act (RCW 19.86) Compliance

- All advertising and marketing materials must be truthful and not deceptive
- All fees must be clearly disclosed in writing before transaction
- No unfair or deceptive acts or practices in the conduct of trade or commerce
- Penalties include treble damages, attorney fees, and substantial civil penalties

### G. Contractor Registration Verification Checklist

Before extending credit to any Washington contractor:
- [ ] Verify active L&I registration at https://secure.lni.wa.gov/verify/
- [ ] Confirm registration bond is current ($30K general / $15K specialty)
- [ ] Confirm general liability insurance is current
- [ ] Obtain copy of disclosure statement provided to homeowner (if applicable)
- [ ] Confirm loan is NOT secured by borrower's primary dwelling
- [ ] Obtain signed Business Purpose Affidavit
- [ ] Review loan structure with Washington-licensed counsel

### H. Escrow Licensing Trigger Assessment

Before holding funds between homeowners and contractors:
- [ ] Determine if activity constitutes "escrow business" under RCW 18.44
- [ ] Confirm no exemption applies (e.g., real estate broker handling own transaction)
- [ ] If in doubt, BLOCK activity pending legal clearance
- [ ] Do NOT rely on smart contract automation as a substitute for escrow licensing

### I. Pending Legislation Watch

| Bill | Status | Action Required |
|------|--------|-----------------|
| SB 6178 — Prohibit Post-Loss AOB | Senate passed 2/5/2026; pending House | Monitor daily. If enacted, update all disclosures within 48 hours and confirm ClaimBridge remains BLOCKED. |

---

## Key Statute Quick Reference

| Citation | Subject | Relevance |
|----------|---------|-----------|
| RCW 31.04 | Consumer Loan Act | Consumer lending licensing, 25% APR cap |
| RCW 19.52 | Usury | 12% general usury cap |
| RCW 19.230 | Money Services Act | Money transmission, virtual currency licensing |
| RCW 19.230.370 | Virtual Currency Disclosures | Mandatory disclosures for digital asset products |
| RCW 18.27 | Contractor Registration | L&I registration, bond, insurance requirements |
| RCW 18.44 | Escrow Agents | Escrow licensing for fund-holding activities |
| RCW 48.17 | Adjuster Licensing | Public adjuster $5K bond, licensing |
| RCW 48.18.125 | Mortgagee Clauses | Loss draft holder rights |
| RCW 48.30.015 | Insurance Fair Conduct Act | Treble damages for unreasonable denial |
| RCW 19.86 | Consumer Protection Act | Treble damages, attorney fees, civil penalties |
| SB 6178 (2025-26) | AOB Prohibition | **CRITICAL** — would void all post-loss AOB |

---

> **Disclaimer:** THIS DOCUMENT IS FOR RESEARCH AND INFORMATIONAL PURPOSES ONLY. IT DOES NOT CONSTITUTE LEGAL ADVICE. SMARTCONTRACTOR MUST RETAIN QUALIFIED WASHINGTON-LICENSED COUNSEL TO REVIEW ALL PRODUCTS AND DISCLOSURES BEFORE ANY OPERATIONS IN WASHINGTON STATE. ALL PRODUCT FEATURES MARKED "BLOCKED" OR "UNKNOWN_REQUIRES_COUNSEL_REVIEW" MUST NOT BE ACTIVATED FOR WASHINGTON USERS WITHOUT SPECIFIC WRITTEN LEGAL CLEARANCE.
