# Hawaii (HI) — SmartContractor State Compliance File

> **Prepared:** June 2025
> **Status:** BLOCKED / DEMO-ONLY — All live transaction features require Hawaii-licensed legal review before activation.
> **Regulatory Snapshot:** Hawaii ended its Digital Currency Innovation Lab (DCIL) on June 30, 2024, removing the state money transmitter licensing requirement for digital currency activities. However, insurance claim financing faces severe restrictions due to HRS 431:10-228 (anti-assignment clauses enforced without pre/post-loss distinction), strict public adjuster regulation ($10,000 bond, written contract requirements), and the Mortgage Rescue Fraud Prevention Act (HRS Chapter 480E, treble damages). Contractor licensing is required for projects exceeding $1,500 through the Hawaii Contractors License Board.

---

## 1. State Summary

### 1.1 Regulatory Environment Overview

Hawaii presents a **complex, multi-layered regulatory environment** for SmartContractor products. The state is characterized by strong consumer protection enforcement, unique financial services regulation through the Department of Commerce and Consumer Affairs (DCCA), and historically strict — now dramatically relaxed — treatment of cryptocurrency activities.

**Key Regulatory Bodies:**
- **Hawaii Insurance Division** (cca.hawaii.gov/ins/) — Primary insurance regulator; licenses adjusters (including public adjusters), regulates claims handling, and enforces unfair claim settlement practices under HRS Chapter 431.
- **Hawaii Division of Financial Institutions (DFI)** — Regulates financial services loan companies, mortgage servicers, escrow depositories, money transmitters, and collection agencies.
- **Hawaii Contractors License Board (CLB)** — Under DCCA Professional and Vocational Licensing (PVL); licenses contractors under HRS Chapter 444 with three license classes (A, B, C).
- **Hawaii Office of Consumer Protection (OCP)** — Enforces HRS Chapter 480E (Mortgage Rescue Fraud Prevention Act), HRS Chapter 480D (Collection Practices), and general unfair/deceptive practice laws.

### 1.2 Five Critical Factors for SmartContractor

1. **Crypto-Friendly Turn (July 2024):** Hawaii concluded its Digital Currency Innovation Lab (DCIL) and determined that digital currency activities do NOT fall under the Money Transmitters Act (HRS Chapter 489D). No Hawaii-issued money transmitter license is required for crypto activities as of July 1, 2024. Federal compliance (FinCEN BSA/AML, SEC, FINRA) still applies.

2. **Strict Anti-Assignment Stance:** Hawaii law (HRS 431:10-228) makes **no distinction** between pre-loss and post-loss assignments of insurance policies. Most policies contain anti-assignment clauses that courts enforce (*Del Monte Fresh Produce (Hawaii), Inc. v. Fireman's Fund Ins. Co.*, 117 Hawai'i 357, 183 P.3d 734 (2007)). Pending legislation (SB2948, 2026) would further restrict post-loss assignments obtained as a condition of services.

3. **Strong Public Adjuster Regulation:** Hawaii regulates public adjusters extensively (HRS 431:9-201 et seq.), requiring a $10,000 surety bond, written contracts with 12 mandatory elements, fee restrictions (no contingency fee if insurer commits to policy limits within 72 hours), and strict separation from contractor activity.

4. **Mortgage Rescue Fraud Prevention Act (HRS Chapter 480E):** Regulates all "mortgage assistance relief services" with extreme severity — treble damages, attorney's fees, civil penalties up to $10,000 per violation, and possible jail time. Applies broadly to any service assisting homeowners in financial distress.

5. **Contractor Licensing Threshold:** Any construction project over **$1,500** in labor and materials requires a licensed contractor (HRS Chapter 444). No reciprocal licensing exists with any other state. The state maintains a Contractors Recovery Fund for homeowners who hire licensed contractors.

### 1.3 Overall Product Assessment

| Product Line | Status | Rationale |
|--------------|--------|-----------|
| Token Collateral / Equipment Credit | `UNKNOWN_REQUIRES_COUNSEL_REVIEW` | MTL removal is positive, but lending activities may trigger financial services loan company licensing (HRS Chapter 412, Article 9). No state framework for automated collateral/liquidation. 10% usury limit on loans under $25,000 unless licensed. |
| ClaimBridge (Claim Financing) | `BLOCKED` | HRS 431:10-228 enforces anti-assignment clauses without pre/post-loss distinction. Pending SB2948 would further restrict. Public adjuster licensing creates additional barriers. HRS 480E adds severe mortgage-related risk. |
| Contractor Flow | `DEMO_ONLY` | All live features blocked pending legal review of lending licensing. |
| Homeowner Flow | `BLOCKED` | HRS 480E, anti-assignment stance, and public adjuster restrictions create insurmountable barriers without licensed legal redesign. |
| Restoration Company Flow | `DEMO_ONLY` | Same restrictions as contractor flow. |

---

## 2. Official Sources Reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| Hawaii Insurance Division (DCCA) | https://cca.hawaii.gov/ins/ | Primary insurance regulator; licenses adjusters, regulates claims handling |
| Hawaii Division of Financial Institutions (DFI) | https://cca.hawaii.gov/dfi/ | Financial services regulation; money transmitters, lenders, escrow depositories |
| Hawaii DFI — DCIL FAQ (Industry) | https://cca.hawaii.gov/dfi/dcil-faq-industry/ | Digital currency activities not requiring MTL as of July 2024 |
| Hawaii DFI — Mortgage Servicer FAQs | https://cca.hawaii.gov/dfi/ms-faqs/ | Mortgage servicer licensing under HRS 454M |
| Hawaii Contractors License Board | https://cca.hawaii.gov/pvl/boards/contractor/ | Contractor licensing under HRS Chapter 444 |
| Hawaii PVL — Hire a Licensed Contractor | https://cca.hawaii.gov/pvl/hire-a-licensed-contractor/ | Consumer guidance; $1,500 licensing threshold |
| Hawaii Insurance Division — License Categories | https://cca.hawaii.gov/ins/insurance-license-categories/ | Adjuster licensing including public adjuster ($10,000 bond) |
| Hawaii Office of Consumer Protection | https://cca.hawaii.gov/ocp/ | Consumer protection enforcement; HRS Ch. 480E |
| Hawaii HRS Chapter 431 — Insurance Code | https://cca.hawaii.gov/ins/hrs/ | Complete insurance code including claims handling, adjuster rules |
| Hawaii HRS — All Chapters | https://cca.hawaii.gov/hawaii-revised-statutes/ | Master index including Chapters 443B, 449, 454F, 454M, 480D, 480E, 481B |
| Governor's Press Release — DCIL Conclusion | https://governor.hawaii.gov/newsroom/dcca-release-hawaii-digital-currency-innovation-lab-to-conclude/ | Official announcement of DCIL ending June 30, 2024 |
| Hawaii SB2948 (2026) | https://legiscan.com/HI/text/SB2948/ | Pending legislation to prohibit post-loss AOB as condition of services |
| Hawaii Division of Financial Institutions — Escrow Depositories | https://cca.hawaii.gov/dfi/escrow-depositories/ | Escrow depository licensing under HRS Chapter 449 |

---

## 3. Lending / Finance Licensing Notes

### 3.1 Financial Services Loan Companies
- **Statute:** HRS Chapter 412, Article 9 (Financial Services Loan Companies)
- **Regulator:** Hawaii Division of Financial Institutions (DFI)
- **Requirement:** A lender making consumer loans in excess of the general usury limit of 12% must be licensed as a financial services loan company, unless able to export a greater rate under federal preemption.
- **Nondepository financial services loan companies** must register with NMLS if any employee acts as a mortgage loan originator (HRS 412:9-501).
- **Foreign Lender Exemption:** Part II of Chapter 207 HRS exempts specified out-of-state lenders from business registration and taxation if they do not maintain a Hawaii place of business.

### 3.2 Usury Limitations
- **General usury limit:** 12% per annum (HRS Chapter 478)
- **Loans under $25,000:** 10% per annum unless lender is licensed under HRS Chapter 412, Article 9 or another applicable lending statute
- **Exceeding the usury limit** without appropriate licensing constitutes a violation subject to penalties and potential voiding of interest provisions
- **Business-purpose loans** to licensed contractors may qualify for exemptions from consumer usury limits but require clear documentation of commercial purpose

### 3.3 Money Transmitters
- **Statute:** HRS Chapter 489D (Money Transmitters Act)
- **Regulator:** Hawaii DFI
- **Key Development (July 1, 2024):** Digital currency/crypto activities **NO LONGER** require a Hawaii money transmitter license (HRS 489D-5(a) exclusion)
- **Important caveat:** Companies conducting **BOTH** USD/fiat money transmission AND digital currency activity still need an MTL for the fiat-denominated activity
- **Permissible investment requirements** apply only to USD outstanding transmission obligations, not digital currency obligations
- **Historical context:** Hawaii previously required crypto companies to hold cash reserves equal to crypto assets ("double reserve"), which made operations virtually impossible. The DCIL conclusion removed this barrier.

### 3.4 Mortgage Servicers
- **Statute:** HRS Chapter 454M
- **Regulator:** Hawaii DFI
- **License required:** No person may engage in mortgage servicing without a license
- **Bond:** $100,000 surety bond required
- **Exemptions:** Banks, credit unions, insurance companies, financial service loan companies; persons making/acquiring no more than 5 residential mortgage loans with own funds
- **Duties:** Good faith and fair dealing, safeguarding borrower funds, reasonable skill/care/diligence
- **Prohibited:** Collecting fees not disclosed in loan instruments or not permitted by law

### 3.5 Mortgage Loan Originators
- **Statute:** HRS Chapter 454F (Secure and Fair Enforcement for Mortgage Licensing Act / SAFE Act)
- **Regulator:** Hawaii DFI through NMLS
- **License required:** For any person who offers or negotiates terms of a residential mortgage loan

### 3.6 Collection Agencies
- **Statute:** HRS Chapter 443B
- **Regulator:** DCCA Professional and Vocational Licensing Division
- **Registration required:** No collection agency may collect debts from Hawaii residents without registering
- **Requirements:** Bond, active business office in Hawaii, designated principal collector
- **Exempt out-of-state collection agencies:** May apply for exemption if no Hawaii employees/agents, no Hawaii office, licensed in reciprocal state

### 3.7 Collection Practices
- **Statute:** HRS Chapter 480D
- **Applies to:** Debt collectors who are NOT collection agencies, collecting consumer debts owed to the collector (not third party)

### 3.8 Credit Repair Organizations
- **Statute:** HRS 481B-12
- **Prohibits:** Soliciting payment based on false representations of ability to alter credit history; making untrue statements to credit reporting agencies
- **Violation:** Constitutes unfair or deceptive act or practice under HRS 480-2

### 3.9 Small Dollar Installment Loans
- Hawaii has specific licensing for small dollar installment loan branches (regulated by DFI)
- Relevant for any SmartContractor product offering small-dollar advances to contractors or homeowners

### 3.10 Contractor Licensing Requirements (Financial Context)
- **Statute:** HRS Chapter 444
- **Board:** Hawaii Contractors License Board (CLB) under DCCA
- **Threshold:** Contractor license required for any project exceeding **$1,500** in labor and materials (including taxes), or any project requiring a building/electrical/plumbing permit
- **Three License Classes:**
  - **A — General Engineering Contractor:** Fixed works (highways, tunnels, bridges, water/power)
  - **B — General Building Contractor:** Structures requiring 2+ unrelated building trades; may self-perform up to 2 specialty trades per project
  - **C — Specialty Contractor:** 42 distinct trade classifications (Hawaii Administrative Rules Title 16, Chapter 77)
- **Requirements:** 4 years documented supervisory experience; examination; liability insurance ($100K/$300K bodily injury, $50K property damage); workers' compensation; tax clearance
- **Renewal:** Biennial, by September 30 of even-numbered years
- **No reciprocal licensing** with any other state

---

## 4. Escrow-Backed Contractor Advance Rules

> **NEW SECTION** — This section addresses the specific regulatory framework for escrow-backed advances to contractors in Hawaii, including escrow depository licensing, permissible escrow structures, and compliance requirements for SmartContractor's advance products.

### 4.1 Escrow Depository Licensing (HRS Chapter 449)

- **Statute:** HRS Chapter 449 (Escrow Depositories)
- **Regulator:** Hawaii Division of Financial Institutions (DFI), within the Department of Commerce and Consumer Affairs (DCCA)
- **License required:** No person shall engage in the business of accepting escrow deposits without an escrow depository license issued by the DFI Commissioner
- **Bond:** Minimum $100,000 surety bond required; Commissioner may require additional bond up to $500,000 based on volume
- **Net worth:** Minimum net worth of $100,000; Commissioner may require up to $500,000
- **Audit:** Annual financial audit required; records must be maintained for minimum 7 years
- **Fidelity coverage:** Fidelity bond or insurance covering all employees handling escrow funds

### 4.2 What Constitutes "Escrow" in Hawaii

Hawaii defines escrow broadly as "any transaction wherein one person, for the purpose of effecting the sale, transfer, encumbrance, or lease of real or personal property to another person, delivers any written instrument, money, evidence of title to real or personal property, or other thing of value to a third person to be held by that third person until the happening of a specified event or the performance of a prescribed condition, when it is then to be delivered by that third person to a grantee, grantor, promisee, promisor, obligee, obligor, bailee, bailor, or any agent or employee of the latter."

**Key implications for SmartContractor:**
- Holding funds for disbursement to contractors upon completion milestones may constitute escrow activity
- If SmartContractor or a third-party advance provider holds insurance claim proceeds or homeowner funds for conditional disbursement to contractors, escrow licensing may be triggered
- **Operating without an escrow depository license** is a misdemeanor and subjects the operator to administrative penalties, including cease-and-desist orders

### 4.3 Permissible Escrow Structures for Contractor Advances

| Structure | Escrow License Required? | Notes |
|-----------|------------------------|-------|
| Third-party licensed escrow depository holds advance funds | No (for SmartContractor) | SmartContractor partners with Hawaii-licensed escrow depository; escrow holder is the licensed party |
| SmartContractor holds funds pending contractor milestone completion | **YES** | This constitutes escrow activity; SmartContractor would need HRS Chapter 449 license |
| Direct lender disbursement to contractor (no conditional hold) | No | Standard loan disbursement; document as commercial loan to licensed contractor |
| Factoring/purchase of contractor invoices | Generally no | True sale of accounts receivable; not escrow if purchase is non-recourse and absolute |
| Customer-controlled escrow with licensed depository | No | Homeowner directly engages escrow agent; SmartContractor not in custody chain |

### 4.4 Escrow-Backed Advance Product Design Requirements

If SmartContractor implements an escrow-backed contractor advance product in Hawaii using a **licensed third-party escrow depository**, the following requirements apply:

**Escrow Agreement Requirements:**
- Written escrow agreement signed by all parties (homeowner/insured, contractor, escrow agent, and advance provider if applicable)
- Clear specification of disbursement conditions (e.g., certificate of completion, inspection sign-off, municipal approval)
- Itemized disbursement schedule tied to construction milestones
- Procedure for dispute resolution if parties disagree on milestone completion
- Statement that the escrow agent owes a fiduciary duty to all parties to the escrow

**Source of Escrow Funds:**
- If advance funds originate from SmartContractor or a lending partner, the loan must comply with Section 3 (Lending/Finance Licensing Notes)
- If escrow is funded by insurance proceeds, the anti-assignment restrictions in Section 7 apply
- If escrow is funded by homeowner directly, consumer protection laws (HRS 480E, 480D) apply

**Prohibited Escrow Practices in Hawaii:**
- Commingling escrow funds with the escrow agent's operating funds (segregated trust account required)
- Disbursing funds prior to meeting all agreed conditions
- Charging escrow fees not disclosed in writing at the inception of the escrow
- Acting as escrow agent for a transaction in which the agent has a personal financial interest without full disclosure

### 4.5 Implications for SmartContractor

**Current Status:** `BLOCKED_FOR_DIRECT_ESCROW` / `REQUIRES_THIRD_PARTY_PARTNERSHIP`

- SmartContractor **cannot directly hold** conditional funds for contractor disbursement in Hawaii without obtaining an escrow depository license (HRS Chapter 449)
- Licensing requires $100,000 minimum net worth, $100,000 surety bond, annual audits, and 7-year record retention — significant operational burden
- **Recommended path:** Partner with an existing Hawaii-licensed escrow depository to hold advance funds and manage conditional disbursement
- Even with licensed escrow partner, the **underlying loan** must comply with Section 3 lending requirements (usury limits, financial services loan company licensing if applicable)
- Escrow-backed advances using **insurance claim proceeds as repayment source** remain blocked due to Section 7 (AOB restrictions) and Section 9 (mortgagee/loss draft rules)

### 4.6 Key Risk: Mortgage Rescue Fraud Prevention Act (HRS 480E) Intersection

If an escrow-backed advance is provided to a homeowner in financial distress (e.g., facing foreclosure, insurance loss with mortgage delinquency):
- The advance may be characterized as a "mortgage assistance relief service"
- HRS 480E **prohibits** charging upfront fees before services are completed
- **Required disclosures:** Nature of services, total cost, refund policy, that consumer may stop/avoid foreclosure without paying anyone
- **Penalties:** Treble damages, attorney's fees, civil penalties up to $10,000 per violation, possible jail time
- **Private right of action** for homeowners

**Mitigation:** Structure escrow-backed advances as true commercial loans to **licensed contractors only**, not to homeowners in financial distress. Ensure all HRS 480E disclosures are provided if the homeowner is a party to the transaction.

---

## 5. Token Collateral / Crypto Notes

### 5.1 Key Development: Hawaii Exempts Crypto from Money Transmitter Licensing

Effective **July 1, 2024**, Hawaii made a landmark policy change:

1. **Digital Currency Innovation Lab (DCIL)** concluded June 30, 2024
2. DFI determined that digital currency company activities do **NOT** fall under Hawaii's Money Transmitters Act (HRS Chapter 489D)
3. **No Hawaii-issued money transmitter license required** for digital currency activities
4. Crypto companies operate as **unregulated businesses at the state level** (though federal compliance still applies)

### 5.2 Permissible Digital Currency Activities (Without MTL)

Per DFI DCIL FAQ (as of February 9, 2024):
- Trading of digital currency or assets
- Providing hosted digital currency wallets or custodial services
- Digital currency activities representing investments (lending, staking) — may be subject to other licensing
- Issuing or redeeming stablecoins
- Issuing or redeeming proprietary tokens
- Facilitating use of proprietary tokens within proprietary platforms
- Processing/facilitating digital currency payments within blockchain
- Payment processing involving digital currency
- Transferring digital assets from one person to another

### 5.3 Critical Caveats

- **Federal compliance still required:** FinCEN (BSA/AML), SEC, FINRA regulations apply regardless of state exemption
- **USD/fiat activity still requires MTL:** If a company conducts USD money transmission alongside crypto, the fiat activity requires licensing under HRS 489D
- **No special digital currency licensing scheme** was adopted — Hawaii chose deregulation over a new framework
- **Consumer protection laws of general applicability** still apply to all digital currency activities
- **No clear state-level guidance** on digital asset lending collateral, liquidation mechanics, or smart contract enforcement

### 5.4 Implications for SmartContractor Token Collateral

- The removal of the MTL requirement is **positive** for token collateral lock/liquidation mechanics at the state level
- However, **lending/staking activities "may be subject to other licensing or registration requirements"** per DFI
- No Hawaii statute specifically addresses token collateral, smart contract enforcement, or automated liquidation
- **Consumer lending laws** (HRS Chapter 412, Article 9) may apply if loans are made to consumers
- **Usury limit:** 10% per annum on loans under $25,000 unless lender is appropriately licensed (see Section 3.2)
- Business-purpose loans to licensed contractors may be structured with fewer restrictions than consumer loans, but commercial usury limits still apply

### 5.5 SmartContractor Token Collateral Status

```
TOKEN_COLLATERAL: UNKNOWN_REQUIRES_COUNSEL_REVIEW
```

While the crypto regulatory environment has improved dramatically, the absence of a specific regulatory framework means counsel must review whether token collateral lending, automated liquidation, and smart contract enforcement are permissible under Hawaii's general lending, consumer protection, and escrow laws. The 10% usury rate on loans under $25,000 and potential financial services loan company licensing requirements are the primary open questions.

---

## 6. Insurance Claim Advance Notes

### 6.1 Claims Handling Requirements
- **Statute:** HRS 431:13-103(11) — Unfair claim settlement practices
- **Key timing requirements:**
  - Insurer must respond within **15 working days** to communications (more than acknowledgment)
  - Must affirm/deny coverage within **reasonable time** after proof of loss
  - Must offer payment within **30 calendar days** of affirming liability if amount is determined
  - Must provide written explanation for delay on claims unresolved 30+ days from report
  - Must attempt in good faith to effectuate prompt, fair, equitable settlements where liability is clear

### 6.2 Private Right of Action
- **IMPORTANT:** HRS 431:13-103 does **NOT** create a private right of action. Only the Insurance Commissioner can enforce. *Genovia v. Jackson Nat'l Life Ins. Co.*, 795 F. Supp. 1036 (Haw. 1992).
- However, violations may be used as evidence of bad faith in common law tort claims (*Best Place, Inc. v. Penn America Ins. Co.*, 920 P.2d 334 (Haw. 1996)).

### 6.3 Additional Living Expenses / Emergency Advances
- After the 2023 Maui wildfires, the Insurance Commissioner issued guidance about ALE coverage
- Homeowners policies "may provide coverage for additional living expenses if a covered loss makes your home uninhabitable"
- Policyholders should ask about temporary shelter expenses and keep receipts
- No specific statute mandating emergency advance payments was found

### 6.4 Insurance Fraud
- **Statute:** HRS 431:2-403 et seq.
- Penalties: Restitution, fines up to $10,000 per violation, attorney's fees
- Civil cause of action available for insurers to recover fraudulent payments
- **6-year statute of limitations** from discovery (10 years maximum from violation)

### 6.5 Standard Fire Policy
- **Statute:** HRS 431:10-210
- Hawaii has a standard fire policy form with specific provisions

### 6.6 Hawaii Property Insurance Association (HPIA)
- **Statute:** HRS 431:21-101 et seq.
- Hawaii's residual market for property insurance; claims handling timelines apply

---

## 7. Assignment of Benefits Notes

### 7.1 Current Law: HRS 431:10-228

**"A policy may be assignable or not assignable, as provided by its terms."**

Critical aspects:
1. **No pre-loss/post-loss distinction:** Hawaii makes **NO** distinction between assignments before and after a loss occurs
2. **Anti-assignment clauses are enforceable:** Most insurance policies contain anti-assignment clauses that prohibit assignment without insurer consent
3. **Case law:** *Del Monte Fresh Produce (Hawaii), Inc. v. Fireman's Fund Ins. Co.*, 117 Hawai'i 357, 183 P.3d 734 (2007) — court enforced anti-assignment clause without considering whether assignment occurred before or after loss
4. **Assignments allowed only if policy permits:** Where the policy doesn't prohibit assignment, AOBs are technically permitted, but this is rare in standard policies

### 7.2 Practical Impact
- Most Hawaii insurance policies have anti-assignment clauses
- This means **post-loss assignment of claim benefits to contractors is generally NOT permitted** without insurer consent
- This is a **significant barrier** to AOB-based claim financing models
- Unlike Florida (which permitted post-loss AOB until recent reforms) or Texas (post-loss AOB generally allowed), Hawaii's position is among the most restrictive nationally

### 7.3 Pending Legislation: SB2948 (2026)
- Bill would make post-loss assignments obtained through fraud, misrepresentation, or **as a condition of receiving services** void and unenforceable
- Adds new HRS section specifically addressing post-loss assignments
- Represents a trend toward **further restricting** AOBs in Hawaii
- As of March 2026, the bill was in amended form progressing through the legislature

### 7.4 Implications for SmartContractor ClaimBridge
- AOB-based claim advances face **substantial legal barriers** in Hawaii
- Even where AOBs are technically possible (policy silent on assignment), pending legislation may restrict them
- Alternative models (direct payment authorization, invoice factoring, escrow-backed advances per Section 4) should be explored
- **Legal review essential** before any AOB-based product launch
- Any product design must assume anti-assignment clauses are enforceable and plan accordingly

---

## 8. Public Adjuster / Insurance Representation Notes

### 8.1 Licensing Requirements
- **Statute:** HRS 431:9-201 et seq.
- **Regulator:** Hawaii Insurance Division
- **License required:** No person shall act as, be appointed as, or hold oneself out to be an adjuster without a license

### 8.2 Public Adjuster Specific Requirements
- **Examination:** Must pass Hawaii adjuster examination (Pearson VUE)
- **Bond:** **$10,000 surety bond** required before license issuance (HRS 431:9-223)
- **Fingerprinting:** Required through FieldPrint
- **License types:** Independent adjuster, public adjuster, workers' compensation adjuster, crop adjuster

### 8.3 Public Adjuster Contract Requirements (HRS 431:9-244)

**All contracts must be in writing and contain:**
1. Title of "Public Adjuster Contract"
2. Description of services
3. Full salary, fee, commission, or other consideration
4. Initial expenses to be reimbursed (specified by type with dollar estimates)
5. Attestation that adjuster is fully bonded
6. Insured's full name, address, insurance company, policy number
7. Description of loss and location
8. Legible full name of public adjuster
9. Public adjuster's permanent home state, business address, phone
10. License number
11. **Signatures of both public adjuster and insured**
12. **Date signed by both parties**

**Prohibited contract terms:**
- Requiring insured to authorize insurance company to issue check only in public adjuster's name
- Imposing collection costs or late fees
- Precluding insured from pursuing civil remedies

### 8.4 Fee Restrictions
- **No contingency fee** if insurer pays or commits to pay policy limits within 72 hours of loss report
- If compensation is percentage-based, the **exact percentage must be specified**
- Compensation must be "reasonable" as determined by commissioner
- After 72-hour policy limits commitment, adjuster entitled only to reasonable compensation based on time and expenses

### 8.5 Adjuster Restrictions (HRS 431:9-227)
- An adjuster who is a producer cannot adjust any loss where their remuneration for insurance sale would be affected
- **Contractors CANNOT act as public adjusters** without a separate adjuster license
- **SmartContractor must not** enable or facilitate unlicensed adjuster activity
- **SmartContractor platform features must not** provide adjuster-like services (claim valuation, coverage analysis, negotiation strategy) to unlicensed users

### 8.6 Key Risk: Contractor as Public Adjuster
- A contractor who negotiates with an insurance company on behalf of a homeowner may be engaged in **unlicensed public adjusting**
- This is a **serious violation** that could result in criminal and civil penalties for the contractor, and potential aiding/abetting liability for SmartContractor if the platform facilitates such activity
- SmartContractor platform must ensure contractors do not cross this line
- Any insurance negotiation assistance must be provided by licensed adjusters only
- Platform should include clear disclaimers and workflow barriers preventing unlicensed claim negotiation

---

## 9. Mortgage / Loss Draft Notes

### 9.1 Standard Mortgage Clause
- Hawaii insurance policies include standard mortgage clauses protecting mortgagee interests
- Mortgagee (or servicer as ISAOA/ATIMA) must be named on policy declarations
- Mortgagee has independent rights under the policy separate from the insured

### 9.2 Loss Draft / Claim Proceeds
- When insurance claim checks include a mortgagee as payee, **both the insured and mortgagee must endorse**
- Mortgage servicers have specific duties regarding insurance loss proceeds (HRS Chapter 454M)
- For current loans (<31 days delinquent): servicers may release initial disbursement up to greater of $40,000 or 33% of proceeds
- For delinquent loans (31+ days): more restrictive disbursement requirements apply
- **Servicers must ensure proceeds are used for property repair**, not past due balances

### 9.3 Mortgage Rescue Fraud Prevention Act (HRS Chapter 480E)
- **Extremely important** for any SmartContractor product assisting homeowners with mortgage/claim issues
- Regulates "mortgage assistance relief services" — broadly defined to include any service claiming to help a homeowner avoid foreclosure, obtain a loan modification, or negotiate with a mortgage lender
- **Prohibits:**
  - Charging upfront fees before services completed
  - Misrepresenting likelihood of outcome
  - Failing to make required disclosures
  - Advising homeowners to stop communicating with their lender
- **Required disclosures:**
  - Nature of services provided
  - Total cost of services
  - Refund policy
  - That consumer may stop/avoid foreclosure without paying anyone
  - That consumer is not required to accept services to negotiate with lender
- **Penalties:** Treble damages, attorney's fees, civil penalties up to $10,000 per violation, possible jail time
- **Private right of action** for homeowners
- Enforced by Office of Consumer Protection (OCP)

### 9.4 Implications for SmartContractor
- Any product helping homeowners navigate insurance claims where a mortgage exists must account for mortgagee rights and endorsement requirements
- Loss draft check endorsement requirements may delay contractor payment significantly
- If SmartContractor provides any mortgage-related assistance (even incidentally), HRS 480E applies with severe penalties
- **Mitigation:** Structure all transactions as direct loans to licensed contractors; avoid any service representation that could be construed as mortgage assistance relief
- If homeowner is party to the transaction, provide all HRS 480E required disclosures regardless of whether mortgage assistance is the primary service

---

## 10. Dashboard Rules, Disclosures & Risk Summary

### 10.1 Dashboard Rules

```json
{
  "state": "HI",
  "state_name": "Hawaii",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Hawaii removed MTL requirement for crypto activities effective July 1, 2024, which is positive. However, no state statute specifically addresses token collateral, smart contract enforcement, or automated liquidation. Lending activities may trigger financial services loan company licensing under HRS Chapter 412 Article 9 if interest exceeds 10% usury limit on loans under $25,000. Consumer lending laws may apply. Federal FinCEN/SEC/FINRA compliance required. Business-purpose loans to licensed contractors may be viable but require counsel review."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Hawaii does not distinguish pre-loss from post-loss assignments (HRS 431:10-228). Most policies have anti-assignment clauses that courts enforce (Del Monte Fresh Produce case). Pending SB2948 (2026) would further restrict post-loss AOBs obtained as condition of services. Public adjuster licensing is strictly enforced with $10,000 bond requirement. Contractor cannot negotiate with insurer without adjuster license. Mortgage Rescue Fraud Prevention Act (HRS 480E) imposes severe penalties for mortgage-related services. Alternative models (direct pay authorization, factoring, escrow-backed via licensed third party) should be explored but are also untested."
  },
  "escrow_backed_advance": {
    "status": "REQUIRES_THIRD_PARTY_PARTNERSHIP",
    "allowed_user_types": [],
    "blocked_actions": ["smartcontractor_direct_escrow_hold"],
    "required_reviews": ["legal", "provider"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "SmartContractor cannot directly hold conditional funds for contractor disbursement without HRS Chapter 449 escrow depository license ($100K net worth, $100K bond, annual audits). Must partner with Hawaii-licensed escrow depository. Underlying loan must comply with Section 3 lending requirements. Escrow-backed advances using insurance claim proceeds as repayment remain blocked due to Section 7 AOB restrictions and Section 9 mortgagee rules."
  },
  "contractor_flow_status": "DEMO_ONLY",
  "homeowner_flow_status": "BLOCKED",
  "restoration_company_flow_status": "DEMO_ONLY"
}
```

### 10.2 Required Disclosures

#### Token Collateral / Equipment Credit Disclosures

```
DISCLOSURE 1 — LENDING NATURE
COUNSEL_APPROVED_TEXT_REQUIRED

[This disclosure must clearly state the nature of the transaction as a
business-purpose loan to a licensed contractor. Must specify: loan amount,
APR or factor rate, repayment terms, collateral requirements, and consequences
of default including token liquidation. Hawaii usury limit of 10% per annum
applies to loans under $25,000 unless lender is licensed.]

DISCLOSURE 2 — DIGITAL ASSET RISK
COUNSEL_APPROVED_TEXT_REQUIRED

[This disclosure must inform borrowers that: (1) Hawaii does not regulate
digital currency companies at the state level as of July 1, 2024; (2) digital
assets are volatile; (3) liquidation may occur automatically if collateral
value falls below threshold; (4) borrower may lose entire collateral and still
owe deficiency; (5) federal FinCEN/SEC/FINRA laws apply; (6) digital currency
activities are not insured by any government agency.]

DISCLOSURE 3 — NOT INSURANCE
COUNSEL_APPROVED_TEXT_REQUIRED

[This product is not insurance and does not replace insurance coverage.
No insurance claim is being purchased or assigned. This transaction is
independent of any insurance policy or claim.]
```

#### ClaimBridge / Insurance-Related Disclosures

```
DISCLOSURE 4 — NOT A PUBLIC ADJUSTER
COUNSEL_APPROVED_TEXT_REQUIRED

[GCSC/SmartContractor and the contractor are NOT licensed public adjusters
and cannot negotiate with your insurance company on your behalf. Hawaii law
(HRS 431:9-201) requires a $10,000 bond and specific licensing to act as a
public adjuster. If you need representation with your insurance claim, you
should hire a licensed public adjuster. This transaction does not affect your
insurance claim rights.]

DISCLOSURE 5 — NO ASSIGNMENT OF BENEFITS
COUNSEL_APPROVED_TEXT_REQUIRED

[This transaction does NOT constitute an assignment of your insurance policy
or insurance benefits under Hawaii law (HRS 431:10-228). Most Hawaii insurance
policies prohibit assignment without insurer consent. You remain responsible
for pursuing your insurance claim independently. Any repayment obligation
exists independently of your insurance claim and is due regardless of claim
outcome.]

DISCLOSURE 6 — MORTGAGE RESCUE FRAUD NOTICE
COUNSEL_APPROVED_TEXT_REQUIRED

[If your property is subject to a mortgage, your mortgage lender may have
rights to insurance proceeds under Hawaii law (HRS Chapter 454M). This service
is NOT mortgage assistance relief under HRS Chapter 480E. We do not negotiate
with your lender or provide foreclosure prevention services. You should notify
your mortgage lender of any loss. You may stop or avoid foreclosure without
paying any third party.]

DISCLOSURE 7 — NO GUARANTEE OF INSURANCE PAYMENT
COUNSEL_APPROVED_TEXT_REQUIRED

[Repayment is due regardless of whether your insurance claim is approved,
denied, or delayed. You remain personally liable for the full amount owed.
Your insurance policy and claim are separate from this transaction.
Hawaii law (HRS 431:13-103) does not create a private right of action against
insurers for claim delays.]

DISCLOSURE 8 — CONTRACTOR LICENSING
COUNSEL_APPROVED_TEXT_REQUIRED

[Any contractor performing work under this program must be licensed by the
Hawaii Contractors License Board (HRS Chapter 444). Hawaii requires a license
for any project exceeding $1,500. You may verify licensing at
https://mypvl.dcca.hawaii.gov/public-license-search/]

DISCLOSURE 9 — ESCROW THIRD-PARTY NOTICE
COUNSEL_APPROVED_TEXT_REQUIRED

[If this transaction involves an escrow arrangement, funds are held by a
Hawaii-licensed escrow depository regulated under HRS Chapter 449. SmartContractor
does not directly hold escrow funds. Disbursement conditions are specified in
the escrow agreement signed by all parties.]
```

### 10.3 Risk Summary

| Risk Category | Score | Key Drivers |
|---------------|-------|-------------|
| Lending Risk | **HIGH** | 10% usury on loans under $25K; financial services loan company licensing may be required; HRS 480E Mortgage Rescue Fraud Act applies broadly; collection agency registration required if collecting third-party debts |
| Insurance Claim Risk | **HIGH** | No private right of action for unfair claims practices (only Commissioner enforcement); 15-day response / 30-day payment timelines; strict adjuster licensing with $10K bond; contractor cannot negotiate claims without license |
| AOB Risk | **HIGH** | HRS 431:10-228 upholds anti-assignment clauses with no pre/post-loss distinction; *Del Monte Fresh Produce* case; pending SB2948 further restricts; most policies prohibit assignment |
| Public Adjuster Risk | **HIGH** | Strict licensing with $10,000 bond; 12-element written contract required; fee restrictions including 72-hour policy limits rule; contractor acting as adjuster is serious violation; platform must not facilitate unlicensed adjusting |
| Token Collateral Risk | **MEDIUM** | MTL no longer required (positive July 2024 development); but lending activities may trigger other licensing; no state framework for automated collateral/liquidation; 10% usury limit on small loans; federal compliance still required |
| Consumer Protection Risk | **HIGH** | HRS 480E Mortgage Rescue Fraud (treble damages + attorney's fees); HRS 480D Collection Practices; HRS 481B-12 Credit Repair Organizations; HRS 481C Door-to-Door Sales; general unfair/deceptive practice laws (HRS 480-2); Office of Consumer Protection actively enforces |
| Escrow Risk | **MEDIUM-HIGH** | HRS Chapter 449 requires licensing to hold conditional funds; $100K net worth/bond requirements; fiduciary duty to all parties; 7-year record retention; SmartContractor must use third-party licensed escrow agent |

### 10.4 Key Hawaii Statutes Reference

| Topic | Statute | Section |
|-------|---------|---------|
| Insurance Code | HRS Title 24 | Chapter 431 |
| Assignment of Policies | HRS Chapter 431 | 431:10-228 |
| Unfair Claim Settlement Practices | HRS Chapter 431 | 431:13-103(11) |
| Adjuster Licensing | HRS Chapter 431 | 431:9-201 et seq. |
| Public Adjuster Bond | HRS Chapter 431 | 431:9-223 |
| Public Adjuster Contracts | HRS Chapter 431 | 431:9-244 |
| Adjuster Restrictions | HRS Chapter 431 | 431:9-227 |
| Contractor Licensing | HRS Chapter 444 | All |
| Contractor Repair Act | HRS Chapter 672E | All |
| Escrow Depositories | HRS Chapter 449 | All |
| Money Transmitters | HRS Chapter 489D | All |
| Collection Agencies | HRS Chapter 443B | All |
| Collection Practices | HRS Chapter 480D | All |
| Mortgage Rescue Fraud Prevention | HRS Chapter 480E | All |
| Unfair Competition | HRS Chapter 480 | All |
| Credit Repair Organizations | HRS Chapter 481B | 481B-12 |
| Credit Sales | HRS Chapter 476 | All |
| Financial Services Loan Companies | HRS Chapter 412 | Article 9 |
| Mortgage Loan Originators | HRS Chapter 454F | All (SAFE Act) |
| Mortgage Servicers | HRS Chapter 454M | All |
| Door-to-Door Sales | HRS Chapter 481C | All |
| Usury | HRS Chapter 478 | All |

---

*Document prepared: June 2025*
*Sources: Hawaii Revised Statutes, Hawaii DCCA Insurance Division, Hawaii DFI, Hawaii Contractors License Board, Hawaii Office of Consumer Protection, official Hawaii government websites*
*This document is for research purposes only and does not constitute legal advice. All product features marked BLOCKED or DEMO-ONLY pending legal review.*
