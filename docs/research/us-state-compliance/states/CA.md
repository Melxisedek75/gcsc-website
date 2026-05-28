# California SmartContractor Compliance Research

## 1. Executive Summary

| Product | Status | Notes |
|---------|--------|-------|
| Contractor workflow | **DEMO ONLY** | CSLB license required for work >=$500; $25,000 contractor bond; strict home improvement contract rules; down payment capped at lesser of $1,000 or 10% |
| Token-collateral equipment credit | **BLOCKED** | CFLL license required for lending; DFAL license required for crypto custody effective July 1, 2026; DFPI actively enforcing (Salt Lending $300K+ penalties, Dec 2024); 10% usury cap for unlicensed lenders |
| Insurance claim advance / ClaimBridge | **BLOCKED** | Only insurers may issue claim advances; AOB allowed post-loss but heavily restricted; contractors cannot engage in public adjusting; mortgagee endorsement requirements; mandatory wildfire ALE (4-month) and contents (30%/$250K) advances apply only to insurers |
| Escrow-backed contractor advance | **BLOCKED** | Escrow agents must be licensed through Bureau of Real Estate; escrow licensing requirements are stringent; any GCSC escrow function triggers licensure |
| Contract-backed working capital | **BLOCKED** | CFLL covers both consumer and commercial lending with no commercial-only exemption; SB 1235 disclosure requirements for transactions <=$500,000; CCFPL UDAAP authority applies to small business financing |

California is the most heavily regulated state for all GCSC product lines. Multiple state agencies maintain overlapping jurisdiction: **DFPI** (lending, crypto, commercial financing disclosures, UDAAP), **CDI** (insurance claims, public adjusters, AOB), **CSLB** (contractor licensing), **Bureau of Real Estate** (escrow agents), and the **Attorney General** (privacy, UCL). The DFPI has explicitly positioned itself as filling the void of reduced federal CFPB enforcement and has demonstrated aggressive posture — the December 2024 Salt Lending consent order imposed $162,800 in borrower refunds plus $137,500 in penalties for unlicensed crypto-backed lending. The Digital Financial Assets Law (AB 39) creates a comprehensive crypto licensing regime effective July 1, 2026, with civil penalties of up to $100,000 per day for unlicensed activity.

**CRITICAL:** All GCSC products are **BLOCKED** for live operation in California pending extensive legal review by qualified California counsel. Both the Token Collateral Equipment Credit and ClaimBridge products may face insurmountable licensing hurdles without strategic partnerships with DFPI-licensed finance lenders and DFAL-licensed digital financial asset businesses.

---

## 2. Official Sources & Regulatory Agencies

### Primary State Agencies

| Agency | Acronym | Jurisdiction | URL |
|--------|---------|--------------|-----|
| Department of Financial Protection and Innovation | DFPI | Lending licensing (CFLL), crypto regulation (DFAL), money transmission, commercial financing disclosures, UDAAP enforcement | https://dfpi.ca.gov |
| Contractors State License Board | CSLB | Contractor licensing, bonding, home improvement contract regulation | https://www.cslb.ca.gov |
| Department of Insurance | CDI | Insurance claims, public adjuster licensing, AOB, claim advance rules | https://www.insurance.ca.gov |
| Bureau of Real Estate | BRE | Escrow agent licensing and oversight | https://www.dre.ca.gov |
| Attorney General | CA AG | CCPA/CPRA privacy enforcement, Unfair Competition Law | https://oag.ca.gov |

### Key Sources Reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| CDI Residential Property Claims Guide | https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/res-prop-claim.cfm | Official guide to claims process, loss drafts, mortgagee rights |
| CDI Bulletin 2025-2 (Wildfire Advances) | https://www.insurance.ca.gov/0250-insurers/0300-insurers/0200-bulletins/bulletin-notices-commiss-opinion/upload/Bulletin-2025-2-Wildfire-Consumer-Protections-and-Advanced-Payments.pdf | Mandatory advance payments for declared disasters |
| CDI Fair Claims Settlement Practices Regs | https://www.insurance.ca.gov/01-consumers/130-laws-regs-hearings/05-CCR/fair-claims-regs.cfm | Claims handling requirements for insurers |
| DFPI – CFLL FAQ | https://dfpi.ca.gov/regulated-industries/california-financing-law/california-finance-lenders-license-frequently-asked-questions/ | CFLL licensing requirements, net worth, bonds |
| DFPI – DFAL FAQ | https://dfpi.ca.gov/regulated-industries/digital-financial-assets/digital-financial-assets-law-frequently-asked-questions/ | Crypto licensing regime under AB 39/SB 401 |
| DFPI – Commercial Financing Disclosures | https://dfpi.ca.gov/regulated-industries/california-financing-law/about-california-financing-law/california-financing-law-commercial-financing-disclosures/ | SB 1235 disclosure requirements |
| DFPI – Salt Lending Consent Order (Dec 2024) | https://dfpi.ca.gov/regulated-industries/enforcement-actions/ | Enforcement action against crypto-backed lending |
| CSLB – License Requirements | https://www.cslb.ca.gov/contractors/applicants/contractors_license/exam_application/before_applying_for_license.aspx | License qualifications, bond requirements |
| CA Legislature – AB 39 Text | https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB39 | Digital Financial Assets Law statutory text |
| CA Attorney General – CCPA | https://oag.ca.gov/privacy/ccpa | Consumer privacy requirements |

---

## 3. Contractor / Home Improvement Rules

### CSLB Licensing Requirements

California mandates strict contractor licensing through the Contractors State License Board:

- **License required** for any construction work >=$500 (Bus. & Prof. Code § 7028)
- **Contractor bond**: $25,000 required for all active licensees
- **LLC license bond**: $100,000 (in addition to the standard contractor bond)
- **Workers' compensation insurance**: Required if licensee has employees
- **No financial requirements** to qualify for a license, but applicant must demonstrate 4 years of journey-level experience
- **License classifications**: Class A (General Engineering), Class B (General Building), Class C (Specialty — 40+ specialties)
- **Reciprocity**: Limited reciprocity with Arizona, Nevada, and Utah for certain classifications
- **License verification**: Public lookup available at www.cslb.ca.gov; GCSC must integrate CSLB API verification

### Home Improvement Contract Requirements (Bus. & Prof. Code § 7159)

California imposes some of the nation's strictest home improvement contract rules:

| Requirement | Detail |
|-------------|--------|
| Written contract | Must be in writing, legible, signed by both parties |
| Contractor identification | Name, address, CSLB license number must appear prominently |
| Contract contents | Description of work, materials, start/completion dates, price, payment schedule |
| Down payment cap | **Greater of $1,000 or 10% of contract price, whichever is LESS** |
| Cancellation right | 3-business-day right to cancel (home solicitation contracts) |
| Mechanics lien warning | Verbatim statutory language required |
| High-value contracts | Contracts >=$25,000 or funded by disaster relief loan: additional disclosure requirements |
| Change orders | Must be in writing, signed by both parties |
| Cost-plus contracts | Maximum 10% above estimated cost or $1,000, whichever is less |
| Prohibited terms | No waiver of lien rights before payment, no waiver of consequential damages, mandatory arbitration clauses are restricted |

### Contractor Financing Restrictions

- Contractors **cannot** act as lenders without a CFLL license
- **Referral arrangements** with licensed lenders may be permissible but require legal review
- Any financing arranged by a contractor for a homeowner likely triggers CFLL broker licensing
- **Advance fee restrictions**: Contractors cannot collect advance fees beyond statutory down payment limits
- Contractors who accept payment in stages must tie payments to project milestones

### Implications for GCSC

- GCSC **cannot** provide equipment financing to California contractors without a CFLL license or exempt entity partnership
- Any "buy now pay later" or equipment credit product requires legal review under CFLL
- Contractor onboarding flow **must** include CSLB license verification via API
- Down payment limits apply if any GCSC product functions as an advance payment mechanism
- Home improvement contract templates used by contractors on the platform should be reviewed for California compliance
- Mechanics lien rights must be preserved in all contract flows

---

## 4. Escrow-Backed Contractor Advance Rules (NEW)

### California Escrow Licensing Framework

California maintains a stringent escrow licensing regime that directly impacts any GCSC product involving escrow-style holding or disbursement of funds:

**Primary Law**: California Escrow Law (Financial Code §§ 17000-17612), administered by the **Bureau of Real Estate (BRE)**.

#### Who Must Be Licensed as an Escrow Agent

| Entity Type | License Required? | Notes |
|-------------|-------------------|-------|
| Independent escrow company | **Yes** | BRE license required; must be a corporation with $25,000 minimum net worth |
| Title insurer/underwritten title company | Exempt | May conduct escrows incidental to title business under specific authority |
| Financial institution (bank, credit union) | Exempt | May conduct escrows incidental to deposit-taking |
| Real estate broker | **Limited** | May perform escrows only in transactions where broker is also the listing or selling broker |
| Attorney | Exempt | May hold client funds in trust account under State Bar rules |
| **GCSC (technology platform)** | **Likely YES** | Any holding of funds for disbursement to contractors likely triggers escrow licensing |

#### Key Licensing Requirements for Independent Escrow Agents

- **Corporate structure**: Must be organized as a corporation under California law
- **Minimum net worth**: $25,000 (increases with escrow liability — up to $500,000+)
- **Surety bond**: Minimum $25,000 fidelity bond; additional bonds may be required based on liability
- **Escrow officers**: Each escrow officer must hold an individual escrow officer license from BRE
- **Principal escrow officer**: At least one licensed principal escrow officer required per company
- **Audit requirements**: Annual independent audit of trust accounts required
- **Trust account segregation**: All escrow funds must be maintained in segregated, non-interest-bearing trust accounts
- **Record retention**: Minimum 5-year record retention required
- **Fingerprinting and background checks**: Required for all officers, directors, and escrow officers
- **Application fee**: $650 plus fingerprinting fees
- **Examination**: BRE examination of books and records at any time

### DFPI Oversight of Escrow-Related Lending

While the BRE licenses escrow agents, the DFPI has concurrent jurisdiction over any lending activity that occurs in connection with escrow arrangements:

- **Escrow holdbacks as lending**: If GCSC holds contractor funds in escrow and releases them upon milestone completion while charging any form of fee, interest, or retainage, this may constitute "making a loan" under CFLL
- **Escrow-based advances**: Advancing funds to contractors against future contract proceeds held in escrow is likely a CFLL-regulated lending activity
- **Escrow servicing fees**: Fees charged for escrow-related services may be characterized as finance charges if they are incidental to a lending transaction, affecting APR calculations under SB 1235
- **Consumer purpose escrows**: Any escrow holding consumer/homeowner funds triggers heightened scrutiny and requires additional disclosures

### California Insurance Code — Escrow in Claim Proceeds Context

When insurance claim proceeds are involved:

- **Mortgagee escrow**: Mortgage lenders routinely hold insurance proceeds in escrow and disburse incrementally as repair work progresses — this is a traditional lender escrow function, not requiring BRE licensing
- **Contractor payment from escrow**: If GCSC proposes to hold claim proceeds in escrow for disbursement to contractors, this likely constitutes escrow agency business requiring BRE licensure
- **Assignment of escrow rights**: A contractor's assignment of rights to escrowed funds may be treated as an Assignment of Benefits (see Section 8) and subject to those restrictions
- **Proposed legislation (2025)**: Would require mortgage lenders to pay interest on held insurance proceeds — GCSC must monitor

### Critical Restrictions on Escrow Activities

- **No commingling**: Escrow funds cannot be commingled with operating funds under any circumstances
- **No unauthorized investment**: Escrow funds must remain in non-interest-bearing accounts unless all parties agree to interest disposition
- **Fiduciary duties**: Escrow agents owe fiduciary duties to all parties; breach can result in personal liability
- **Prohibited practices**: Escrow agents cannot:
  - Act as principals in transactions where they serve as escrow agents
  - Accept fees contingent on transaction closing
  - Disburse funds before all conditions are met
  - Disclose confidential information to third parties
  - Engage in any activity requiring a real estate license without proper licensure

### Implications for GCSC

| Scenario | Analysis | Status |
|----------|----------|--------|
| GCSC holds contractor equipment purchase funds in escrow pending delivery | **Likely requires BRE escrow license** — holding funds for disbursement upon conditions is core escrow activity | BLOCKED |
| GCSC holds insurance claim proceeds for staged disbursement to contractors | **Requires BRE escrow license + CFLL license** — dual regulatory trigger | BLOCKED |
| GCSC partners with licensed escrow agent to provide escrow services | **Potentially permissible** — but partnership structure must not constitute unlicensed escrow activity; requires legal review | LEGAL_REVIEW_REQUIRED |
| GCSC routes funds through contractor's existing escrow arrangement | **Informational only** — GCSC may facilitate documentation but cannot direct escrow operations without license | DEMO_ONLY |
| Smart contract holds funds in programmatic escrow (no human custody) | **UNKNOWN** — whether automated/programmatic escrow triggers BRE licensing is untested in California; requires legal analysis | COUNSEL_REQUIRED |

**Summary**: Any GCSC product that involves holding, managing, or disbursing funds on behalf of contractors or homeowners — even through smart contracts — likely triggers California escrow licensing requirements. The combination of BRE escrow licensing, DFPI CFLL lending oversight, and CSLB contractor requirements creates a triple regulatory barrier. **All escrow-backed advance concepts are BLOCKED pending comprehensive legal review.**

---

## 5. Lending / Finance Licensing

### California Financing Law (CFL/CFLL) — Cal. Fin. Code §§ 22000 et seq.

The CFLL is one of the most comprehensive lending statutes in the United States and represents the primary barrier to GCSC's equipment credit product in California.

#### Who Must Be Licensed

| Entity | License Required? | Exemption |
|--------|-------------------|-----------|
| Consumer lender | **Yes** — no threshold | None (de minimis only) |
| Commercial lender | **Yes** — unless de minimis | One-loan exemption per 12 months |
| Broker (arranges loans) | **Yes** | None for compensation |
| Pawn broker | **Yes** (separate law) | — |
| Real estate broker making incidental loans | Exempt | Up to 5 commercial loans incidental to primary business |
| **GCSC making equipment loans to contractors** | **Likely YES** | One-loan exemption only |

- "Finance lender" is defined broadly: any person engaged in the business of making consumer or commercial loans
- **No exemption for commercial-only lenders** — the CFL covers both consumer AND commercial lending
- **One-loan exemption**: A person making one commercial loan in a 12-month period is NOT required to be licensed (Cal. Fin. Code § 22050.5)
- **De minimis exemption**: No more than one commercial financing transaction in 12 months, or five or fewer that are incidental to primary business (real estate brokers)
- **CRITICAL**: The one-loan exemption is per person/entity and does not aggregate across affiliates — but controlled entities may be scrutinized

#### Key Licensing Requirements (via NMLS)

| Requirement | Amount |
|-------------|--------|
| Minimum net worth (non-residential) | $25,000 |
| Minimum net worth (residential mortgage lending) | $250,000 |
| Surety bond | $25,000 minimum |
| Application fee | $200 + $100 investigation fee |
| Annual report | Due March 15 |
| Annual fee | Due October |
| Branch offices | Separate license required per branch |

- Books and records must be maintained at licensed location
- Director/officer changes must be reported to DFPI within 30 days
- Financial statements must be submitted annually
- DFPI may examine licensed entities at any time

#### Exemptions from CFLL

| Exempt Entity | Authority |
|---------------|-----------|
| Banks, credit unions, savings associations | Federal/state charter |
| Insurance companies (with CDI certificate of authority) | Cal. Ins. Code |
| Licensed residential mortgage lenders/servicers | CRMLA license |
| Broker-dealers | Corp. Code § 25211 |
| Farm Credit Act lenders | Federal statute |
| Industrial loan companies | ILC charter |

**NO exemption exists for:**
- Token/cryptocurrency collateral loans (unless made by exempt entity above)
- Blockchain-based lending platforms
- "Decentralized" lending protocols with California nexus
- Smart contract-automated loans

### Usury — Cal. Const. Art. XV, § 1

California's usury framework creates a stark divide between licensed and unlicensed lenders:

- **Unlicensed lenders**: Maximum 10% annual interest on loans for personal, family, or household purposes; 10% or higher for business loans (varies by loan type)
- **CFLL-licensed lenders**: **Exempt from usury** — may charge any rate of interest agreed to by the parties (Cal. Fin. Code § 22002)
- **Willful violation**: Forfeiture of all interest (not just excess); borrower can recover 3x interest paid in 1 year before action
- **Non-willful violation**: Lender can only recover principal; no interest awarded
- **CRITICAL**: Any GCSC loan without CFLL license is capped at 10% APR — likely insufficient for equipment credit risk profile

### Commercial Financing Disclosure Law (SB 1235) — Cal. Fin. Code §§ 22800-22805

| Element | Requirement |
|---------|-------------|
| Applies to | Commercial financing offers <=$500,000 |
| Disclosures required | Amount funded, total dollar cost, term/estimated term, payment method/frequency/amount, APR/estimated APR, prepayment policies, broker compensation |
| Provider types covered | Sales-based financing, factoring, asset-based lending, lease financing, traditional loans, lines of credit |
| Effective date | December 9, 2022 |
| Judicial status | Ninth Circuit upheld DFPI's disclosure rules (April 2025) |
| Penalties | Violations subject to CCFPL UDAAP enforcement |

- Disclosure must be provided at time of extending specific commercial financing offer
- Must use standardized format (DFPI regulations specify layout)
- Estimated APR permitted when exact terms cannot be known
- **Applies to GCSC equipment credit offers <=$500,000 to contractors**

### California Consumer Financial Protection Law (CCFPL) — Cal. Fin. Code §§ 90000 et seq.

The CCFPL is California's state-level equivalent of federal CFPA/UDAAP authority:

- **Prohibits**: UDAAP (unfair, deceptive, or abusive acts or practices) in connection with consumer financial products/services
- **Expanded scope (October 1, 2023)**: DFPI now has UDAAP authority over **commercial financing** to:
  - Small businesses with <=$16 million gross receipts
  - Nonprofit organizations
  - Family farms
- **Annual reporting**: Required for providers making >1 commercial financing transaction in 12 months to covered entities
- **SB 825 (effective January 1, 2026)**: Eliminated enforcement exemption for many DFPI-licensed entities — even licensed lenders are now subject to CCFPL UDAAP
- **Penalty structure**: Administrative penalties up to $25,000 per violation; $50,000 for reckless violations; $100,000 for knowing violations

### CCPA/CPRA Privacy Implications for Lending

| Aspect | Detail |
|--------|--------|
| GLBA exemption | Personal information subject to GLBA is exempt from most CPRA requirements |
| Residual CCPA/CPRA obligations | Notice at collection, service provider contracts, and certain consumer rights may still apply |
| "Financial information" scope | Broad — includes loan applications, credit data, transaction history |
| Sensitive personal information | Precise geolocation, social security number, financial account numbers receive heightened protection |
| Penalties | Up to $7,500 per intentional violation; $2,500 per negligent violation; statutory damages for data breaches ($100-$750 per consumer per incident) |

### Implications for GCSC

| Activity | Regulatory Trigger | Status |
|----------|-------------------|--------|
| Making equipment loans to contractors (any volume) | CFLL license required | BLOCKED without license |
| Making 1 commercial loan per year | De minimis exemption | LEGAL_REVIEW_REQUIRED — structure must be precise |
| Charging >10% interest without CFLL license | Usury violation — criminal/civil penalties | BLOCKED |
| Providing equipment credit >$500K (rare) | SB 1235 disclosure not required; CFLL still required | BLOCKED |
| Providing equipment credit <=$500K | SB 1235 disclosure + CFLL license | BLOCKED |
| Any lending to small business (<$16M receipts) | CCFPL UDAAP compliance | BLOCKED |
| Collecting borrower financial data | CCPA/CPRA + GLBA compliance | LEGAL_REVIEW_REQUIRED |

---

## 6. Token Collateral / Digital Asset Risk

### Digital Financial Assets Law (DFAL) — AB 39 / SB 401 / AB 1934

California's DFAL creates one of the most comprehensive state-level crypto licensing regimes in the United States, second only to New York's BitLicense.

**Effective Date**: July 1, 2026 (licensing deadline extended from original 2025 date by AB 1934)

#### Regulated Activities ("Digital Financial Asset Business Activity")

| Activity | Description | GCSC Relevance |
|----------|-------------|----------------|
| Exchanging digital financial assets | Converting crypto to fiat or other crypto | HIGH — if GCSC facilitates any conversion |
| Transferring digital financial assets | Moving crypto on behalf of another person | HIGH — if GCSC transfers collateral |
| Storing digital financial assets | Holding crypto for another person (custody) | **CRITICAL** — if GCSC holds token collateral |
| Engaging in digital financial asset administration | Managing, controlling, or processing crypto transactions | HIGH — smart contract administration may trigger |
| Holding electronic precious metals or certificates | Digital gold/silver representations | LOW — unlikely applicable |

#### Key Licensing Requirements

| Requirement | Detail |
|-------------|--------|
| License application | Through DFPI/NMLS for any person engaging in DFAL business activity with CA residents |
| Surety bond or trust account | Minimum $500,000 (as determined by DFPI based on volume/risk) |
| Minimum capital and liquidity | DFPI-determined based on business model |
| Consumer disclosures | Extensive disclosures required BEFORE engaging in any activity |
| Transaction confirmations | Required for each transaction |
| Record retention | 5 years minimum |
| Civil penalties (unlicensed) | Up to **$100,000 per day** |
| Civil penalties (licensee violations) | Up to **$20,000 per day** |
| Private right of action | **None** — DFPI has exclusive enforcement authority |
| Transferability | License is **non-transferable and non-assignable** |

#### Definition of "Digital Financial Asset"

- Digital representation of value used as medium of exchange, unit of account, or store of value that is **NOT** legal tender
- **Excludes**: Securities registered with SEC, rewards program value, in-game currency
- **Includes**: Bitcoin, Ether, stablecoins (USDC, USDT), and most cryptocurrency tokens used as collateral
- **Stablecoins**: Treated as digital financial assets unless they are bank-issued and FDIC-insured

### DFPI Crypto-Backed Lending Enforcement

#### Salt Lending Consent Order (December 2024)

The DFPI's enforcement action against Salt Lending establishes the enforcement template for crypto-backed lending in California:

| Element | Detail |
|---------|--------|
| Investigation target | Crypto-backed lending program (crypto collateral for fiat loans) |
| Loans at issue | 342 loans to 151 California residents between 2019-2022 |
| Violations found | Failure to assess ability-to-repay; misrepresenting APRs; charging undisclosed administrative fees; failing to maintain $25,000 minimum net worth |
| Penalty — borrower refunds | $162,800 |
| Penalty — civil money penalty | $137,500 |
| Corrective actions | Enhanced consumer protections, improved underwriting, risk disclosures, ongoing reporting requirements |

**Key takeaway for GCSC**: The DFPI treated crypto-collateralized lending as regulable lending activity requiring licensure, regardless of whether the collateral was cryptocurrency. The fact that collateral was crypto did not exempt Salt Lending from CFLL requirements.

#### DFPI 2025 Policy Statement

- Crypto lending platforms **still require state license** to operate in California
- "Unlicensed activity can include engaging in financial services or lending without the required DFPI licence"
- DFPI is actively monitoring for unlicensed crypto lending activity
- No safe harbor for "innovative" or "blockchain-based" lending models

### California Money Transmission Act (MTA) — Cal. Fin. Code §§ 2000-2103

| Aspect | Detail |
|--------|--------|
| Regulator | DFPI |
| Definition | Receiving money for transmission; transmitting money |
| Crypto status | DFPI has NOT deemed crypto assets as "money" under MTA (as of 2023) |
| Stablecoins | Potentially treated as "money transmission" if they function as monetary value |
| DFPI proposal | Separate proposal to reduce duplicative regulation between MTA and DFAL |
| Dual regulation risk | Some crypto activities may trigger BOTH MTA and DFAL requirements |

### Implications for GCSC Token Collateral Product

| Feature | Analysis | Status |
|---------|----------|--------|
| Live loan creation with token collateral | Requires CFLL + DFAL license | **BLOCKED** |
| Token collateral lock (custody) | Triggers DFAL "storing" activity | **BLOCKED** |
| Non-custodial collateral (smart contract only) | UNKNOWN — whether pure programmatic lock triggers DFAL "control" is untested | **COUNSEL_REQUIRED** |
| Automated liquidation of collateral | Triggers DFAL + CFLL + potential MTA issues | **BLOCKED** |
| Crypto-to-fiat conversion for loan disbursement | Triggers DFAL "exchanging" activity | **BLOCKED** |
| Repayment routing in crypto | Triggers DFAL "transferring" activity | **BLOCKED** |
| APR calculation and display | Must comply with CFLL accuracy requirements (Salt Lending enforcement precedent) | **REQUIRES_LEGAL_REVIEW** |

**California-Specific Token Collateral Risks:**

- **DFAL "control" definition**: If smart contract controls private keys to collateral, may trigger DFAL licensure even without traditional "custody"
- **Liquidation oracles**: Automated price feeds triggering liquidation may be scrutinized under CFL "safe and sound" requirements
- **Price volatility disclosure**: Must disclose risk of collateral liquidation due to price drops (Salt Learning found insufficient risk disclosure)
- **Ability-to-repay**: DFPI expects crypto-backed lenders to assess borrower's ability to repay independent of collateral value
- **Fee disclosure**: All fees must be included in APR calculation; undisclosed administrative fees violate CFLL

---

## 7. Insurance Claim Advance / ClaimBridge Risk

### California Insurance Code Claim Advance Requirements

California has the nation's most extensive mandatory claim advance framework for declared disasters (particularly wildfires). **CRITICAL**: These requirements apply **only to insurance companies**, not to third-party advance providers like GCSC.

#### Additional Living Expense (ALE) Advances — Cal. Ins. Code § 2061(a)

| Requirement | Detail |
|-------------|--------|
| Trigger | Declared state of emergency + total loss claim |
| Mandatory advance | **No less than 4 months** of living expenses upon request |
| Additional payments | Require proper proof after advance period |
| ALE coverage minimum | 24 months from loss date (36 months with extension) in state of emergency |
| Extensions | Up to 12 additional months for delays beyond insured's control; 6-month extensions for good cause |
| Evacuation orders | Minimum 2 weeks ALE coverage (§ 2060(c)) |
| ALE itemization | Insurer must provide list of covered ALE items upon request (§ 2060(a)) |

#### Contents (Personal Property) Advances — Cal. Ins. Code § 10103.7

| Requirement | Detail |
|-------------|--------|
| Trigger | Declared state of emergency + total loss |
| Mandatory advance | **30% of dwelling policy limit**, up to **$250,000** |
| Inventory requirement | **NONE** — itemized inventory NOT required for this advance |
| Additional recovery | Policyholder can recover additional amounts up to full policy limit by filing full itemized claim |
| Insurer duty | Must NOTIFY policyholder of this advance option |

#### Replacement Cost Timeframes

| Scenario | Timeframe |
|----------|-----------|
| Standard | 12 months from first ACV payment to collect full replacement cost |
| State of emergency | **36 months** from first ACV payment (§ 2051.5(b)) |
| Extensions | 6-month extensions for good cause |

#### Fair Claims Settlement Practices Regulations (10 CCR § 2695 et seq.)

- Prohibits "unreasonably low" settlement offers
- Prohibits requiring company-specific inventory forms (§ 2061(a)(2))
- Must accept grouped/category inventory (§ 2061(a)(3))
- Requires good faith claims handling
- **40-day claim decision timeline** — insurer must accept or deny within 40 days of proof of loss
- Prohibits requiring insured to use "preferred" contractor as condition of payment

### Why GCSC Cannot Provide Insurance Claim Advances

GCSC providing "advances" against anticipated claim proceeds could constitute:

1. **Unauthorized insurance activity** — Only licensed insurers may provide coverage advances on covered claims
2. **Lending activity requiring CFLL license** — Any advance repaid from claim proceeds is likely a "loan" under CFLL
3. **Assignment of benefits arrangement** — See Section 8 for restrictions
4. **Potentially "rebating" or "inducement"** under insurance law — Providing claim-like advances could be seen as inducing insurance business
5. **Consumer deception** — Representing that GCSC can provide insurance-like advances violates UDAAP/CCFPL

### Mortgage / Loss Draft Considerations

| Element | Detail |
|---------|--------|
| Co-payee requirement | Insurance checks for dwelling/structure damage typically payable to both homeowner AND mortgage lender |
| Lender endorsement | Mortgage lender must endorse check before funds can be used |
| Lender escrow | Lender holds funds in escrow/account and releases as work progresses |
| ALE/personal property | Generally should NOT name mortgagee (but sometimes do inadvertently) |
| Threshold practices | Under $20,000-$40,000 (current loan): lender may endorse and return check; Over $40,000 (or delinquent): lender deposits funds, releases in draws |
| Initial disbursement | Typically 1/3 of proceeds or up to $40,000 |
| Final disbursement | After 100% completion inspection |
| California protections | Cal. Ins. Code § 2051.5(c): policyholder can use replacement cost funds to rebuild at new location or purchase elsewhere; insurer cannot deduct land value |

### CRITICAL for GCSC ClaimBridge

| Feature | Status | Reason |
|---------|--------|--------|
| Insurance claim advance issuance | **BLOCKED** | Only insurers may issue claim advances; unauthorized insurance activity |
| Claim financing / factoring | **BLOCKED** | Likely triggers CFLL lending license; potential insurance code violations |
| Repayment routing from claim proceeds | **BLOCKED** | Mortgagee endorsement requirements; CFLL issues; AOB restrictions |
| Claim negotiation assistance | **BLOCKED** | Unlicensed public adjusting (see Section 8) |
| AOB facilitation | **LEGAL_REVIEW_REQUIRED** | AOB is permitted post-loss but must exclude public adjusting authority |
| Claim status display (informational only) | **DEMO_ONLY** | Permitted as informational resource only |
| Contractor documentation assistance | **DEMO_ONLY** | Documentation help is permissible; negotiation is not |

**ClaimBridge can only function as a technology platform connecting licensed entities** (insurers, licensed public adjusters, CSLB-licensed contractors, mortgage servicers), not as an advance provider, claim negotiator, or financial intermediary.


---

## 8. Assignment of Benefits & Public Adjuster Rules

### Assignment of Benefits (AOB) — California Status: **ALLOWED (Post-Loss) — HEAVILY REGULATED**

California follows the "majority rule" on insurance claim assignments: post-loss assignment of insurance benefits is generally permitted, and insurance policy anti-assignment clauses are generally **NOT enforceable** for post-loss assignments.

#### General AOB Rules

| Aspect | Rule |
|--------|------|
| Post-loss assignments | Generally **permitted** without insurer consent |
| Pre-loss assignments | Require insurer consent; anti-assignment clauses enforceable |
| Assignment form | Must be in writing |
| Scope limitation | Should be limited to specific repair work, not entire claim |
| Revocability | 3-day cancellation periods may apply to certain home solicitation contracts |

#### Contractor-Specific AOB Restrictions (CRITICAL)

California imposes strict limitations on what contractors can do under an AOB:

| Activity | Permitted? | Legal Basis |
|----------|------------|-------------|
| Performing repair work pursuant to AOB | **Yes** | Contracting work within CSLB scope |
| Billing insurance company directly for work performed | **Yes** | Standard AOB function |
| Being named as payee on claim proceeds checks for work performed | **Yes** | Within AOB scope |
| Negotiating insurance claims on behalf of homeowner | **NO** — crime | Unlicensed public adjusting |
| Preparing proofs of loss for homeowner | **NO** — crime | California v. Montgomery-Sansome |
| Advertising "insurance claim negotiating services" | **NO** — crime | Business & Professions Code |
| Suing insurer in homeowner's name | **NO** | No standing; unauthorized practice |
| Adjusting, settling, or compromising claims | **NO** — crime | Cal. Ins. Code § 15000 et seq. |

**Required Elements for Valid AOB in California:**
- Must be in writing
- Must clearly specify scope of assigned benefits (limited to repair work)
- Must NOT grant contractor authority to negotiate, adjust, or settle claim
- Should specify that assignment is for payment of work performed only
- Must include notice that contractor is not a public adjuster
- Should reference homeowner's right to hire independent public adjuster

### Public Adjuster Licensing — Cal. Ins. Code §§ 15000 et seq.

Any person who represents an insured in negotiating with an insurance company must hold a public adjuster license. Contractors performing this function are engaging in **unlicensed public adjusting** — a crime under California law.

#### Licensing Requirements

| Requirement | Detail |
|-------------|--------|
| Experience | Minimum 2 years certified experience in insurance adjusting |
| Examination | Must pass CDI licensing examination |
| Surety bond | $20,000 bond required |
| Contract form | Must use CDI-approved contract form, executed in duplicate |
| Fee cap | Typically 10-15% of settlement (negotiable within limits) |
| License verification | Searchable via CDI website |

#### Required Contract Provisions (Cal. Ins. Code § 15027)

Every public adjuster contract must include:

- Title: "Public Adjuster Contract"
- Name, license number, phone, address of licensee
- Name and address of insured
- Description of loss and location
- Insurer name and policy number
- Full fee/commission amount
- **Fee cannot cause insured to receive less than amounts already paid by insurer before contract date**
- Description of services to be performed
- Signatures of both parties
- **3-business-day right to cancel**
- Specific disclosure document about types of adjusters (independent, staff, public)

#### Prohibited Conduct for Public Adjusters

- Soliciting during active loss event or between 6 p.m. and 8 a.m.
- Any confession of judgment or waiver of chapter provisions is void
- Cannot interfere with insured's right to communicate directly with insurer
- Cannot have any undisclosed financial interest in repair work
- Cannot pay referral fees to contractors or other unlicensed persons
- Cannot represent both insurer and insured in same claim

### Implications for GCSC

| Feature | Status | Detail |
|---------|--------|--------|
| Facilitating AOB to contractors | **LEGAL_REVIEW_REQUIRED** | AOB is permitted but must be narrowly drafted; must exclude public adjusting authority |
| Providing AOB templates | **LEGAL_REVIEW_REQUIRED** | Templates must include public adjuster exclusion; require counsel approval |
| Facilitating contractor claim negotiation | **BLOCKED** | Unlicensed public adjusting — a crime |
| Providing public adjuster referrals | **DEMO_ONLY** | May provide informational directory; cannot receive referral fees |
| Coordinating between contractor and PA | **LEGAL_REVIEW_REQUIRED** | GCSC must not facilitate fee-sharing or kickbacks |
| Verifying PA license status | **PERMITTED** | Automated CDI license check is permissible |
| Displaying PA contact information | **DEMO_ONLY** | Informational only; no endorsement or referral fee arrangement |

**CRITICAL:** Any blurring of lines between contractor services and public adjusting creates felony liability. Smart contract logic must be carefully architected to ensure no claims negotiation, settlement, or adjusting authority is conferred on contractors or GCSC.

---

## 9. Smart Contract Implications

### California-Specific Smart Contract Architecture Requirements

| Feature | Status | Notes |
|---------|--------|-------|
| Block live loan creation | **true** | BLOCKED — requires CFLL and possibly DFAL license |
| Block token collateral lock | **true** | BLOCKED — DFAL licensure required for custody/control |
| Block liquidation | **true** | BLOCKED — liquidation triggers DFAL and CFLL issues |
| Block assignment of claim proceeds | **true** | LEGAL_REVIEW_REQUIRED — AOB permitted but highly restricted |
| Block repayment routing from insurance proceeds | **true** | BLOCKED — mortgagee priority issues, CFLL issues |
| Block escrow holding functions | **true** | BLOCKED — BRE escrow licensure required |
| Allow demo-only records | **true** | Demo/mockup mode permitted for development/testing |
| Allow hash/reference-only audit records | **true** | Immutable audit records permissible; no live transactions |
| Block claim advance issuance | **true** | Only insurers can issue claim advances |
| Block claims negotiation logic | **true** | Would constitute unlicensed public adjusting |
| Allow CSLB license verification | **true** | Automated license status check via CSLB API permitted |
| Allow CDI PA license verification | **true** | Automated public adjuster license check permitted |
| Block crypto custody functions | **true** | DFAL licensure required |
| Block APR calculation display | **true** | Must be reviewed for CFL/Reg Z accuracy |
| Block commercial financing disclosures | **true** | SB 1235 requires specific format; must be counsel-approved |

### Off-Chain Checks Required

Before any smart contract action in California:

1. **Verify CSLB contractor license** — Active status, proper classification, bond current, no suspensions
2. **Verify CDI public adjuster license** — If PA involved; confirm no conflicts of interest
3. **Confirm CFLL license status** — If any lending activity; verify license through NMLS/DFPI
4. **Confirm DFAL license status** — If any crypto custody or exchange activity
5. **Confirm BRE escrow license** — If any funds-holding activity
6. **Check mortgagee interest** — Verify if property is mortgaged; identify loss draft procedures
7. **Confirm declared disaster status** — Affects ALE/content advance rules (insurer obligations only)
8. **Verify CCPA/CPRA compliance** — Consumer data collection notices and rights management
9. **Track loan count** — For de minimis exemption monitoring (1 commercial loan/12 months)
10. **Confirm SB 1235 disclosure delivery** — For any commercial financing <=$500,000

### Data Fields to Store (Audit Trail Only)

| Data Field | Purpose | Privacy Classification |
|------------|---------|----------------------|
| CSLB license number | Contractor verification | Public information |
| CSLB license status | Eligibility check | Public information |
| CFLL license number | Lending compliance | Public information (NMLS) |
| DFAL license number | Crypto activity compliance | Public information |
| BRE escrow license number | Escrow compliance | Public information |
| CDI PA license number | Public adjuster verification | Public information |
| Loan count and dates | De minimis tracking | Confidential — business data |
| Transaction hash | Immutable audit record | Pseudonymous |
| SB 1235 disclosure hash | Compliance evidence | Business record |
| CCPA consent timestamp | Privacy compliance | Personal information — CCPA protected |

### Actions That Must Be Blocked (Smart Contract Level)

```
BLOCKED_ACTIONS_CA = {
  "live_loan_creation": true,
  "token_collateral_lock": true,
  "collateral_liquidation": true,
  "claim_advance_issuance": true,
  "claim_negotiation_execution": true,
  "claim_settlement_logic": true,
  "aob_full_claim_assignment": true,
  "mortgagee_bypass_routing": true,
  "escrow_fund_holding": true,
  "crypto_custody": true,
  "crypto_exchange_facilitation": true,
  "crypto_transfer_on_behalf": true,
  "apr_display_unverified": true,
  "sb1235_disclosure_auto_generate": true,
  "pa_referral_fee_routing": true,
  "contractor_down_payment_excess": true  // > $1,000 or 10%, whichever is less
}
```

### Audit Events Required

| Event | Trigger | Retention |
|-------|---------|-----------|
| CSLB_LICENSE_VERIFIED | Contractor onboarding | 5 years |
| CSLB_LICENSE_EXPIRED | Periodic recheck | 5 years |
| CFLL_LICENSE_VERIFIED | Lending partner onboarding | 5 years |
| DFAL_LICENSE_VERIFIED | Crypto partner onboarding | 5 years |
| BRE_LICENSE_VERIFIED | Escrow partner onboarding | 5 years |
| PA_LICENSE_VERIFIED | PA directory listing | 5 years |
| LOAN_COUNT_UPDATED | Transaction tracking | 5 years |
| DE_MINIMIS_THRESHOLD_WARN | Approaching 1 loan/12 months | 5 years |
| BLOCKED_LOAN_CREATION_ATTEMPT | User attempted live loan | 5 years |
| BLOCKED_TOKEN_COLLATERAL_ATTEMPT | User attempted crypto lock | 5 years |
| BLOCKED_CLAIM_ADVANCE_ATTEMPT | User attempted advance | 5 years |
| BLOCKED_AOB_FULL_ASSIGNMENT | User attempted full claim AOB | 5 years |
| BLOCKED_ESCROW_HOLD_ATTEMPT | User attempted escrow creation | 5 years |
| DEMO_MODE_RECORD_CREATED | Demo transaction | 5 years |
| SB1235_DISCLOSURE_DELIVERED | Disclosure compliance | 5 years |
| CCPA_CONSENT_RECORDED | Privacy compliance | 5 years |

### California-Specific Smart Contract Risks

1. **DFAL "control" definition risk**: If smart contract controls private keys to collateral or has programmatic ability to move collateral, DFPI may deem this "control" triggering DFAL licensure even without traditional custody
2. **Liquidation oracle risk**: Automated price feeds triggering liquidation may be scrutinized under CFL "safe and sound" lending requirements; DFPI Salt Lending action found fault with automated processes
3. **On-chain AOB irrevocability risk**: Assignment of benefits recorded on blockchain may create technically irrevocable rights that conflict with California's 3-day cancellation periods for home solicitation contracts
4. **Payment routing compliance risk**: Smart contracts routing funds from insurance proceeds may violate mortgagee endorsement requirements and constitute unauthorized practice
5. **CCPA/CPRA on-chain privacy risk**: On-chain records of California residents' financial data may implicate CCPA/CPRA; while transaction hashes are pseudonymous, linking to real-world identity creates compliance obligations
6. **Escrow automation risk**: Programmatic escrow disbursement may be deemed escrow agency activity requiring BRE licensure even without human intermediaries
7. **APR accuracy risk**: Any APR calculation error in smart contract could violate CFLL and trigger CCFPL UDAAP enforcement (Salt Lending precedent)

### Admin Approvals Required

- Override of any blocked action (emergency only, with legal sign-off)
- Licensed lender partnership activation (CFLL license verified)
- Licensed DFAL entity partnership activation (DFAL license verified)
- Licensed escrow agent partnership activation (BRE license verified)
- Smart contract California deployment (legal opinion required)
- AOB template activation (counsel-approved)
- SB 1235 disclosure template activation (compliance review)

---

## 10. Open Questions, Risk Scores & Sources

### Open Questions For Licensed California Attorney

1. **De minimis lending structure**: Can GCSC structure its contractor equipment credit as a single commercial loan per 12-month period to each contractor entity, thereby qualifying for the one-loan CFLL exemption, or will DFPI aggregate affiliated borrowers?

2. **DFAL "control" scope**: Does a non-custodial smart contract that programmatically locks token collateral (without GCSC ever holding private keys) constitute "control" or "administration" of a digital financial asset triggering DFAL licensure?

3. **Programmatic escrow exemption**: Can a smart contract that automatically disburses funds upon verified oracle conditions (inspection completion, lien waiver submission) operate without BRE escrow licensure because it involves no human discretion?

4. **Partnership pathway**: Can GCSC operate in California exclusively through partnerships with (a) a CFLL-licensed finance lender, (b) a DFAL-licensed digital financial asset business, and (c) a BRE-licensed escrow agent, without GCSC itself holding any of these licenses? What partnership structures minimize GCSC's regulatory exposure?

5. **AOB blockchain irrevocability**: How does California law reconcile 3-day cancellation rights for home solicitation contracts with blockchain-based AOB records that are technically immutable?

6. **SB 1235 applicability to equipment credit**: Does GCSC's token-collateral equipment credit product constitute "commercial financing" subject to SB 1235 disclosure requirements, or is it exempt as a "true lease" or other structure?

7. **CCPA/CPRA and on-chain data**: To what extent do pseudonymous blockchain transaction records implicate CCPA/CPRA obligations when they can be linked to identified California residents through off-chain KYC processes?

8. **Mortgagee priority and smart contracts**: Can a smart contract legally acknowledge and enforce mortgagee endorsement requirements for claim proceeds routing, or does any automated routing of insurance proceeds inherently violate mortgagee rights?

9. **Insurance claim factoring**: If structured as a true sale of claim proceeds (not a loan), does claim proceeds factoring avoid CFLL lending licensure while still complying with insurance code restrictions?

10. **UDAAP and "abusive" standard**: How does DFPI interpret the "abusive" prong of CCFPL UDAAP in the context of novel fintech products, and does GCSC's product design create "abusive" risk under DFPI's emerging standards?

### Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **HIGH** | CFLL requires license for any finance lending/brokering. No commercial-only exemption. One-loan exemption is extremely limiting. 10% usury cap for unlicensed lenders makes product economics challenging. SB 1235 disclosure compliance adds operational burden. |
| Insurance Claim Risk | **HIGH** | Only insurers can provide claim advances. Extensive consumer protections for declared disasters (4-month ALE, 30% contents). CDI and DFPI both have enforcement authority. Attempting to function as insurer without license is a crime under California law. |
| AOB Risk | **MEDIUM** | AOB is permitted post-loss in California (majority rule). However, contractors cannot engage in public adjusting. AOB must be limited to payment for work performed. Must include required notices. Not as restrictive as FL or LA, but contractor activity limitations are significant. |
| Public Adjuster Risk | **HIGH** | Contractor or GCSC performing public adjusting without license is a crime. Strict licensing requirements (2 years experience, exam, $20K bond, CDI-approved contract form). Clear separation required between contractor and claim negotiation. Referral fee restrictions apply. |
| Token Collateral Risk | **HIGH** | DFAL creates comprehensive crypto licensing regime effective July 1, 2026. DFPI has already enforced against crypto-backed lending (Salt Lending: $300K+ in penalties/refunds). $100K/day penalties for unlicensed activity. Capital, bond ($500K minimum), and liquidity requirements are substantial. |
| Consumer Protection Risk | **HIGH** | CCPA/CPRA, CCFPL UDAAP (now covering commercial transactions), Fair Claims Settlement Practices, Home Improvement Contract laws, and CFLL all create overlapping consumer protection obligations. California is the most litigious state for consumer financial products. |
| Escrow Licensing Risk | **HIGH** | BRE escrow licensure requires corporate structure, $25K+ net worth, surety bonds, licensed escrow officers, annual audits. Any GCSC funds-holding activity likely triggers licensure. Smart contract escrow is legally untested. |
| Regulatory Enforcement Risk | **VERY HIGH** | DFPI is explicitly "filling the void" of reduced federal CFPB enforcement and has demonstrated aggressive posture. CDI is highly active post-wildfire. Both agencies have demonstrated willingness to take aggressive enforcement action. Civil penalties are severe ($100K/day for unlicensed DFAL activity). |

### Recommended California Market Entry Pathway

Given the regulatory complexity, the only viable pathway to California market entry appears to be:

1. **Partnership with CFLL-licensed finance lender** — Lender originates and holds all loans; GCSC provides technology platform only
2. **Partnership with DFAL-licensed entity** (by July 1, 2026) — Licensed entity handles all crypto custody, exchange, and administration; GCSC provides frontend only
3. **Partnership with BRE-licensed escrow agent** — Licensed escrow agent holds and disburses all funds; GCSC provides workflow automation only
4. **No GCSC holding of funds, crypto, or lending licenses** — Pure technology platform model
5. **Comprehensive insurance review** — Ensure ClaimBridge design does not constitute unauthorized insurance, public adjusting, or lending activity
6. **Legal opinion letter** — Obtain qualified California counsel opinion on each product component before any live deployment

### Sources

- California Department of Financial Protection and Innovation (DFPI) — https://dfpi.ca.gov
- DFPI – CFLL FAQ — https://dfpi.ca.gov/regulated-industries/california-financing-law/california-finance-lenders-license-frequently-asked-questions/
- DFPI – DFAL FAQ — https://dfpi.ca.gov/regulated-industries/digital-financial-assets/digital-financial-assets-law-frequently-asked-questions/
- DFPI – Commercial Financing Disclosures — https://dfpi.ca.gov/regulated-industries/california-financing-law/about-california-financing-law/california-financing-law-commercial-financing-disclosures/
- DFPI – Salt Lending Consent Order (Dec 2024) — https://dfpi.ca.gov/regulated-industries/enforcement-actions/
- California Department of Insurance (CDI) — https://www.insurance.ca.gov
- CDI Residential Property Claims Guide — https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/res-prop-claim.cfm
- CDI Bulletin 2025-2 (Wildfire Advances) — https://www.insurance.ca.gov/0250-insurers/0300-insurers/0200-bulletins/bulletin-notices-commiss-opinion/upload/Bulletin-2025-2-Wildfire-Consumer-Protections-and-Advanced-Payments.pdf
- CDI Fair Claims Settlement Practices Regs — https://www.insurance.ca.gov/01-consumers/130-laws-regs-hearings/05-CCR/fair-claims-regs.cfm
- CDI Annual Notice – Significant CA Laws — https://www.insurance.ca.gov/0250-insurers/0300-insurers/0200-bulletins/bulletin-notices-commiss-opinion/upload/2025Notice-SigCALaw-ResIns-DeclSOE.pdf
- CA Contractors State License Board (CSLB) — https://www.cslb.ca.gov
- CSLB – License Requirements — https://www.cslb.ca.gov/contractors/applicants/contractors_license/exam_application/before_applying_for_license.aspx
- Bureau of Real Estate (BRE) — https://www.dre.ca.gov
- CA Legislature – AB 39 Text — https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB39
- CA Legislature – AB 1934 — https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB1934
- CA Attorney General – CCPA — https://oag.ca.gov/privacy/ccpa
- United Policyholders – CA Insurance Rights — https://uphelp.org/claim-guidance-publications/insurance-claim-rules-in-california-2025/
- United Policyholders – Mortgage Co. Release — https://uphelp.org/claim-guidance-publications/getting-your-mortgage-company-to-release-insurance-proceeds/
- CA Insurance Code – Public Adjuster Contracts (§15027) — https://codes.findlaw.com/ca/insurance-code/ins-sect-15027/

---

*Status: Research only. Not legal advice. ALL GCSC PRODUCTS ARE BLOCKED IN CALIFORNIA pending review by qualified California counsel. The regulatory landscape described above is current as of the research date and should be verified before any business decisions. All disclosures require COUNSEL_APPROVED_TEXT_REQUIRED before use. DFAL licensing deadline: July 1, 2026.*
