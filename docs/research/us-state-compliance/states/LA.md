# Louisiana (LA) SmartContractor Compliance Guide

> **Research Date:** 2025-07-22
> **State Abbreviation:** LA
> **Legal System:** CIVIL LAW (Napoleonic Code / Louisiana Civil Code) -- NOT English Common Law
> **Regulatory Risk Level:** VERY HIGH / BLOCKED PENDING COUNSEL
> **Regulatory Status:** HIGH REGULATION -- Louisiana's unique civil law system, combined with strict AOB prohibitions, contractor restrictions, public adjuster limitations, comprehensive virtual currency licensing, and consumer credit regulation, creates the most complex regulatory environment for SmartContractor products in the United States. All SmartContractor products require Louisiana-licensed civil law counsel review before any market activity.

---

## Section 1: Executive Summary & Civil Law System Context

### 1.1 Louisiana: The Only Civil Law State in the United States

Louisiana is the sole U.S. state whose legal system derives from civil law -- specifically the Napoleonic Code and Spanish legal traditions -- rather than English common law. This distinction is not academic; it fundamentally shapes every aspect of contract law, property law, insurance regulation, and commercial transactions within the state. Every SmartContractor product, feature, and contractual mechanism must be evaluated through the lens of Louisiana's civil law system, which operates under fundamentally different principles than the other forty-nine states.

Under the Louisiana Civil Code, the foundational principle is codified in **La. C.C. Art. 1983**: "Contracts have the effect of law for the parties." This means that contracts in Louisiana derive their binding force not merely from mutual assent (as in common law) but because they are treated as private legislation between the parties. The implications for smart contracts, automated repayment mechanisms, and token-collateralized agreements are profound and unsettled.

### 1.2 Five Critical Regulatory Barriers

SmartContractor faces five overlapping regulatory barriers in Louisiana:

**1. Civil Law Contract Interpretation.** Louisiana courts interpret contracts by seeking the "common intent" of the parties (La. C.C. Art. 2046), not the "reasonable person" standard of common law. Smart contracts, which execute automatically based on code rather than expressed intent, create unique uncertainty under this framework. There is no binding *stare decisis* in Louisiana; prior court decisions are persuasive but not controlling, making legal forecasting exceptionally difficult for novel fintech products.

**2. Assignment of Benefits Prohibition.** La. R.S. 22:1275 (Act 364 of 2023) expressly prohibits assignment of post-loss insurance benefits to contractors, restoration companies, or any "person providing services." These assignments are declared "against public policy and are null and void." Violation constitutes an unfair and deceptive trade practice under R.S. 22:1969. This prohibition is absolute and represents the single greatest barrier to SmartContractor's claim-advance model.

**3. Contractor Insurance Activities Restrictions.** La. R.S. 37:2159.1 prohibits contractors from interpreting insurance policies, adjusting claims, sharing legal fees with attorneys, or requiring attorney representation agreements. SmartContractor must not enable, facilitate, or appear to enable any of these prohibited acts through its platform, user interface, or contractor tools.

**4. Public Adjuster Scope Limitations.** Unlike most states, Louisiana public adjusters may NOT negotiate claim settlements with insurers. Under R.S. 22:1692, they may only "investigate, appraise, or evaluate and report to an insured." Direct negotiation has been deemed the unauthorized practice of law. Additionally, public adjusters cannot charge contingency or percentage fees (R.S. 22:1703) -- only reasonable flat fees or hourly rates.

**5. Comprehensive Financial Licensing Requirements.** Louisiana requires multiple overlapping licenses: (a) Consumer Credit Law licensure for consumer loans and loan brokering; (b) Virtual Currency Business Act (VCBA) licensure for storing, exchanging, or transferring virtual currency (R.S. 6:1381 et seq.); (c) Money Transmitter licensure for money transmission (R.S. 6:1031 et seq.); and (d) Insurance Premium Finance licensure for financing insurance premiums (R.S. 9:3550). Each carries substantial bond, net worth, and reporting requirements.

### 1.3 Louisiana Citizens Property Insurance Corporation

Louisiana operates **Louisiana Citizens Property Insurance Corporation** ("Louisiana Citizens"), a state-backed insurer of last resort that provides property insurance to homeowners unable to obtain coverage in the private market. As of 2024-2025, Louisiana Citizens holds a significant market share of residential property policies, particularly in hurricane-prone coastal parishes. All claims-paying timelines, bad faith standards, and consumer protection requirements applicable to private insurers generally apply to Louisiana Citizens policies as well. SmartContractor must account for Louisiana Citizens as a major claims payor in the Louisiana market, with all the same AOB prohibitions and contractor restrictions applying to claims under its policies.

### 1.4 Civil Law Fundamentals for SmartContractor Products

| Civil Law Principle | La. Civil Code Citation | SmartContractor Implication |
|---|---|---|
| Contracts have effect of law | Art. 1983 | Smart contract automated execution may create unintended "legal effects" not foreseen by parties |
| Offer and acceptance required | Arts. 1927-1933 | Automated contract formation must satisfy civil law formation requirements |
| Lawful cause and object required | Art. 1969 | Any contract facilitating a prohibited AOB may be void for lack of lawful object |
| All rights assignable except personal | Art. 2642 | Overridden by R.S. 22:1275 for insurance benefits; assignments to service providers void |
| Anti-assignment clauses enforceable | Art. 2653 | Legislature expressly overrode for AOB context in R.S. 22:1275(D) |
| Consent defects (error, fraud, duress) | Arts. 1948-1954 | Automated execution may complicate claims of consent defect |
| No binding precedent | (Doctrine) | Legal uncertainty for novel smart contract disputes; prior decisions persuasive only |
| Obligations arise from contract | Arts. 1756-1759 | Repayment obligations created by smart contract are civil law obligations, not common law debts |

### 1.5 Bottom Line Assessment

**SmartContractor is NOT viable in Louisiana without:**
- (1) A Virtual Currency Business Act license from the Louisiana Office of Financial Institutions (for any token collateral feature);
- (2) A Consumer Credit Law license (for any consumer lending or loan brokering);
- (3) A Money Transmitter license (for any repayment routing involving funds movement);
- (4) Louisiana-licensed civil law counsel review of ALL contracts and disclosures;
- (5) Structural redesign to avoid any appearance of AOB facilitation, claim adjusting, or insurance negotiation;
- (6) Full compliance with Louisiana contractor licensing and prohibited acts laws.

Even with all licenses obtained, Louisiana's AOB prohibition makes the core claim-advance product model legally untenable as currently structured. Creative legal restructuring -- potentially through escrow-backed advances with federally insured financial institution involvement -- may offer a path forward, but requires extensive Louisiana counsel review (see Section 4).

---

## Section 2: Regulatory Bodies & Licensing Authorities

### 2.1 Louisiana Department of Insurance (LDI)

| Attribute | Detail |
|---|---|
| **Full Name** | Louisiana Department of Insurance |
| **Website** | https://www.ldi.la.gov |
| **Commissioner** | Commissioner of Insurance (elected statewide) |
| **Primary Jurisdiction** | All insurance companies, producers, adjusters, and insurance-related entities operating in Louisiana |
| **Key SmartContractor Relevance** | AOB prohibition enforcement (Advisory Letter 2025-02); public adjuster licensing; bad faith claims oversight; Louisiana Citizens oversight |

**LDI Key Functions:**
- Licenses and regulates all insurance companies, agents, brokers, and adjusters in Louisiana
- Enforces La. R.S. 22:1275 (AOB prohibition); issued **Advisory Letter 2025-02** on June 20, 2025 reminding all entities of the prohibition
- Licenses public adjusters under R.S. 22:1691-1708; monitors compliance with fee restrictions and scope limitations
- Investigates consumer complaints; has authority to issue cease-and-desist orders, impose fines, and refer matters for criminal prosecution
- Oversees Louisiana Citizens Property Insurance Corporation
- Administers unfair trade practices enforcement under R.S. 22:1964 et seq.

**SmartContractor Compliance Notes:**
- Any SmartContractor feature that appears to facilitate insurance claim processing, AOB arrangements, or public adjuster services will attract LDI scrutiny
- LDI has demonstrated active enforcement posture through Advisory Letter 2025-02
- All insurance-related disclosures must be pre-cleared with LDI or Louisiana counsel

### 2.2 Louisiana Office of Financial Institutions (OFI)

| Attribute | Detail |
|---|---|
| **Full Name** | Louisiana Office of Financial Institutions |
| **Website** | https://ofi.la.gov |
| **Commissioner** | Commissioner of Financial Institutions |
| **Primary Jurisdiction** | Consumer credit, money transmission, virtual currency business activity, escrow services, state-chartered banks and credit unions |
| **Key SmartContractor Relevance** | Consumer Credit Law enforcement; VCBA licensing; Money Transmitter licensing; escrow regulation |

**OFI Key Functions:**
- Licenses consumer lenders, loan brokers, and insurance premium finance companies under the Louisiana Consumer Credit Law (Title 9, Chapter 2, R.S. 9:3514 et seq.)
- Licenses and regulates virtual currency business activity under the Virtual Currency Business Act (R.S. 6:1381 et seq.) -- applications processed through NMLS
- Licenses money transmitters under R.S. 6:1031 et seq.
- Regulates escrow activities conducted by non-depository institutions
- Supervises licensed entities through examinations; imposes civil money penalties for violations
- Maintains NMLS coordination for multi-state licensing

**SmartContractor Compliance Notes:**
- OFI is the primary licensing barrier for all SmartContractor financial products in Louisiana
- VCBA license requires $100,000+ surety bond, $5,000 application fee, audited financials, and minimum net worth
- Consumer Credit Law license required for any consumer loan or loan brokering activity
- OFI enforcement is rigorous; unlicensed activity can result in criminal penalties

### 2.3 Louisiana State Licensing Board for Contractors (LSLBC)

| Attribute | Detail |
|---|---|
| **Full Name** | Louisiana State Licensing Board for Contractors |
| **Website** | https://lslbc.louisiana.gov |
| **Primary Jurisdiction** | Contractor licensing, home improvement registration, contractor discipline |
| **Key SmartContractor Relevance** | Contractor licensing requirements; prohibited acts (R.S. 37:2159.1); home improvement contract rules |

**LSLBC Key Functions:**
- Issues commercial construction licenses (projects $50,000+; $10,000+ for plumbing/electrical/mechanical)
- Issues residential construction licenses (projects $75,000+)
- Registers home improvement contractors (projects $7,500 to $75,000)
- Enforces Contractor's Occupational Licensing Law
- Disciplines contractors for violations including prohibited insurance-related acts under R.S. 37:2159.1
- Maintains contractor records; investigates consumer complaints

### 2.4 Louisiana Department of Justice / Attorney General

| Attribute | Detail |
|---|---|
| **Key SmartContractor Relevance** | Consumer protection enforcement; UDAP actions; criminal prosecution of unlicensed activity |

**Key Functions:**
- Enforces Louisiana Unfair Trade Practices and Consumer Protection Law (R.S. 51:1401 et seq.)
- May bring actions for deceptive trade practices in insurance and consumer credit
- Criminal prosecution authority for unauthorized public adjusting, unlicensed lending, and unlicensed money transmission

### 2.5 National Regulatory Coordination

- **NMLS (Nationwide Multistate Licensing System):** OFI uses NMLS for VCBA applications, money transmitter applications, and consumer credit license applications
- **NAIC (National Association of Insurance Commissioners):** Louisiana is a full NAIC member; LDI participates in NAIC market conduct examinations
- **CSBS/AASC (Conference of State Bank Supervisors):** OFI participates in multistate supervisory coordination for money services businesses

---

## Section 3: Lending & Finance Licensing

### 3.1 Louisiana Consumer Credit Law -- Overview

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 9:3514 et seq. (Title 9, Chapter 2) |
| **Regulator** | Louisiana Office of Financial Institutions (OFI) |
| **Effective Scope** | All "consumer loans" and "consumer credit" transactions in Louisiana |
| **Definition of "Consumer"** | Natural person; if loan is for household, family, or personal purposes, it is a consumer loan regardless of borrower's business affiliations |

**Critical Threshold:** La. R.S. 9:3518 establishes that any loan to a consumer under $7,500 is subject to the full regulatory framework, including the **12% interest rate cap** unless the lender holds a valid Consumer Credit Law license from OFI. Unlicensed lenders charging above 12% on loans under $7,500 face severe civil and criminal penalties. Licensed lenders are exempt from the 12% cap and may charge rates permitted under the Uniform Consumer Credit Code (UCCC) framework adopted in Louisiana.

### 3.2 Licensed Lender (Consumer Lending License)

| Attribute | Detail |
|---|---|
| **Statute** | R.S. 9:3514 et seq. |
| **License Required For** | Making any "consumer loan" (loan to natural person for personal, family, or household purposes) |
| **Application Fee** | $650 initial |
| **Annual Renewal** | $500 |
| **Bond/Net Worth** | Surety bond or minimum net worth as determined by OFI |
| **Exemptions** | Federally insured depository institutions, supervised financial organizations, credit unions, certain nonprofit lenders |

**Key Operational Requirements:**
- Licensed lenders must file annual reports with OFI
- Consumer loan assignments to non-licensees require OFI approval (R.S. 9:3561(F))
- Finance charges must comply with UCCC tier structure
- Specific disclosure forms required for all consumer loans
- Right of rescission and cooling-off period requirements apply

**SmartContractor Implication:** Any SmartContractor product that provides funds to Louisiana homeowners for property repair or restoration is overwhelmingly likely to constitute a "consumer loan" requiring OFI licensure. The 12% cap for unlicensed loans under $7,500 makes unlicensed operation economically unviable and legally perilous.

### 3.3 Loan Broker Licensing

| Attribute | Detail |
|---|---|
| **Statute** | R.S. 9:3572.1 et seq. |
| **Definition** | "Any person who, for compensation or the expectation of compensation, obtains or offers to obtain a consumer loan from a third party for a consumer" |
| **Application Fee** | $500 initial; $500 annual renewal |
| **Surety Bond or Trust Account** | $25,000 surety bond OR trust account with federally insured bank |
| **Advance Fee Prohibition** | Advance fees prohibited except for bona fide third-party expenses (appraisal, credit report, title search) capped at actual cost |

**Required Documentation:**
- Loan Brokerage Agreement and Disclosure Statement with specific statutorily mandated language
- Itemized fee disclosure
- Notice of borrower's right to cancel
- Record retention for minimum periods

**Exemptions:**
- Licensed lenders making loans directly
- Supervised financial organizations
- Licensed mortgage brokers under Residential Mortgage Lending Act
- Insurance agents arranging premium financing (incidental to insurance sale)
- Licensed real estate agents (incidental to real estate transaction)
- Attorneys (incidental to legal practice)

**SmartContractor Implication:** If SmartContractor connects Louisiana homeowners with third-party lenders for repair financing, and SmartContractor receives compensation for this service, loan broker licensing is triggered. The $25,000 bond/trust account requirement and advance fee prohibition create significant compliance obligations.

### 3.4 Insurance Premium Finance Licensing

| Attribute | Detail |
|---|---|
| **Statute** | R.S. 9:3550 |
| **License Required For** | Financing insurance premiums for Louisiana consumers |
| **Key Feature** | Premium finance company pays premium to insurer; consumer repays in installments with finance charge |
| **Cancellation Rights** | Specific notice requirements to insured, agent, and insurer upon default; insured has cure period |

**SmartContractor Implication:** If any SmartContractor product involves advancing insurance premiums on behalf of Louisiana homeowners (with repayment over time), this license is triggered. The regulatory framework includes specific form requirements, rate limitations, and cancellation procedures.

### 3.5 Interest Rate & Usury Framework

**12% Cap for Unlicensed Lenders (R.S. 9:3518):**
- For loans under $7,500: Maximum annual interest rate of 12% unless lender holds OFI consumer credit license
- For loans $7,500 and above: General usury statute applies (currently 12% per annum for written contracts under R.S. 9:3500, with exceptions)
- Violation of the 12% cap by unlicensed lenders is a criminal offense and renders the loan usurious

**Licensed Lender Rate Structure (UCCC Framework):**
- Licensed lenders may charge finance charges permitted under the UCCC tiers adopted in Louisiana
- Rate structure is based on loan principal amount and term
- Specific limitations on prepaid finance charges, default charges, and deferral fees
- Annual percentage rate (APR) disclosure required under federal TILA and Louisiana law

**SmartContractor Implication:** The 12% cap for unlicensed loans under $7,500 is a hard ceiling. SmartContractor's standard product pricing, if it exceeds 12% APR on loans under $7,500, requires OFI licensure. Any claim advance product that functions as a consumer loan must either be licensed or capped at 12% APR.

### 3.6 Commercial / Business-Purpose Lending

Commercial loans (loans to businesses, or loans to individuals for business/commercial purposes) are generally less regulated in Louisiana than consumer loans. However, SmartContractor must exercise extreme caution:

- If loan proceeds are used for homeowner property repair, and the home is residential, Louisiana courts will likely characterize the loan as a consumer loan regardless of borrower's business entity status
- The "primary purpose" test looks at the use of proceeds, not the borrower's corporate structure
- Business-purpose exemptions require careful, Louisiana-specific structuring with civil law counsel
- Any security interest in residential property creates additional compliance requirements

### 3.7 Penalties for Unlicensed Lending

| Violation | Penalty |
|---|---|
| Unlicensed consumer lending | Civil money penalties, restitution, cease-and-desist orders |
| Charging over 12% without license (loans under $7,500) | Criminal usury; loan may be voided; forfeiture of all interest and charges |
| Unlicensed loan brokering | Criminal misdemeanor/felony depending on amount; civil penalties |
| Unlicensed premium financing | Cease-and-desist; civil penalties; restitution to consumers |

---


## Section 4: Escrow-Backed Contractor Advance Rules (NEW)

### 4.1 Louisiana Escrow Regulatory Framework

| Attribute | Detail |
|---|---|
| **Primary Regulator** | Louisiana Office of Financial Institutions (OFI) |
| **Applicable Statutes** | R.S. 6:1031 et seq. (Money Transmitter Law -- escrow provisions); R.S. 9:151 et seq. (Louisiana Escrow Act); R.S. 37:1430 et seq. (Title Insurance Escrow Regulation) |
| **Escrow Definition in Louisiana** | A written agreement whereby a neutral third party (escrow agent) holds funds, documents, or property on behalf of transacting parties and disburses them upon satisfaction of specified conditions |
| **Key Principle** | Escrow agents in Louisiana owe fiduciary duties to all parties to the escrow; commingling of escrow funds with operating funds is strictly prohibited |

Louisiana recognizes escrow arrangements primarily in the context of real estate transactions, title insurance closings, and certain financial services regulated by OFI. Unlike some common law states, Louisiana does not have a standalone, comprehensive "escrow licensing" statute for general-purpose escrow agents. Instead, escrow activity is regulated through:

1. **Money Transmitter Law (R.S. 6:1031 et seq.):** Escrow agents that hold or transmit funds may fall under money transmitter licensing requirements depending on the nature of the activity
2. **Title Insurance Regulations (R.S. 37:1430 et seq.):** Title insurers and their agents conducting escrow closings are regulated by the LDI
3. **Louisiana Escrow Act (R.S. 9:151 et seq.):** Governs escrow arrangements generally, including duties of escrow agents and procedures for escrow disputes
4. **Consumer Credit Law:** Escrow arrangements that are part of consumer credit transactions must comply with applicable disclosure and rate requirements

### 4.2 Escrow-Backed Advance Model: Structural Analysis

Given Louisiana's AOB prohibition (R.S. 22:1275) and consumer lending restrictions, SmartContractor may consider whether an **escrow-backed contractor advance model** could provide a legally compliant path to serve Louisiana contractors and homeowners. Under this model:

- A licensed escrow agent (or OFI-licensed financial institution) holds advance funds
- Contractor receives funds upon verified completion of specified work milestones
- Homeowner's repayment obligation is structured independently of insurance claim proceeds
- The escrow agent acts as a neutral fiduciary, not as a party to the underlying loan or service contract

**Structural Legality Assessment:**

| Element | Status | Analysis |
|---|---|---|
| Escrow agent licensed in Louisiana | **REQUIRED** | Escrow agent must be OFI-licensed, federally insured, or a Louisiana-licensed attorney or title company authorized to hold escrow |
| Escrow as alternative to AOB | **POTENTIALLY VIABLE** | Escrow does NOT involve assignment of insurance benefits; funds flow from lender/escrow to contractor based on work completion, not from insurer to contractor via AOB |
| Escrow for consumer loan disbursement | **LICENSE REQUIRED** | If the underlying advance is a consumer loan, the lender must still hold a Consumer Credit Law license from OFI |
| Escrow agent holding insurance proceeds | **RESTRICTED** | Escrow agents cannot facilitate AOB arrangements; holding insurance proceeds for disbursement to contractors implicates the AOB prohibition if structured as post-loss benefit assignment |
| Independent repayment from homeowner | **REQUIRED** | Repayment cannot be conditioned on insurance claim payment; homeowner must have independent obligation to repay |
| Fiduciary duties of escrow agent | **APPLIES** | Escrow agent owes fiduciary duties to all parties; breach creates civil liability under Louisiana civil law |

### 4.3 Louisiana Civil Law Implications for Escrow

Louisiana's civil law system creates unique considerations for escrow arrangements:

**1. Escrow as "Mandate" or "Deposit" under Civil Code**

Under Louisiana civil law, escrow relationships may be characterized as either:
- A **"mandate" (mandat)** under La. C.C. Arts. 2989-3016, where the escrow agent (mandatary) acts on behalf of the parties (mandators); or
- A **"deposit" (depot)** under La. C.C. Arts. 2926-2945, where the escrow agent (depositary) holds property for safekeeping

The characterization affects the applicable duties, liabilities, and remedies. An escrow agent's duties under civil law may be broader than under common law, including obligations of care, loyalty, and accounting that arise from the mandate or deposit relationship rather than from contract alone.

**2. Obligations and Remedies**

Under La. C.C. Art. 1983 ("contracts have the effect of law"), the escrow agreement binds the parties as law. However, the escrow agent's fiduciary duties also arise from the underlying mandate or deposit relationship, meaning:
- Duties exist independent of the written escrow agreement
- Parties may have claims for breach of fiduciary duty even in the absence of express contractual breach
- Civil law remedies (specific performance, dissolution, damages) apply differently than common law remedies

**3. No Binding Precedent for Novel Escrow Structures**

Because Louisiana courts are not bound by precedent, novel escrow structures -- such as technology-facilitated escrow for contractor advances with blockchain-based verification -- face legal uncertainty. Courts may look to:
- The Louisiana Civil Code provisions on mandate and deposit
- The specific language of the escrow agreement
- OFI guidance and regulations
- Analogous cases (persuasive only)

### 4.4 Escrow-Backed Advance: Compliance Requirements

For SmartContractor to implement an escrow-backed contractor advance in Louisiana, the following conditions must be met:

**Condition 1: Licensed Escrow Agent or Financial Institution**

The escrow agent must be one of the following:
- A federally insured depository institution (bank or credit union) with Louisiana presence
- An OFI-licensed money transmitter authorized to hold escrow
- A Louisiana-licensed attorney holding escrow as part of legal practice
- A Louisiana-licensed title insurance company conducting escrow closings
- An OFI-licensed consumer lender authorized to hold escrow for loan disbursements

**Condition 2: Independent Lender License (If Applicable)**

If the escrow holds funds from a lender providing consumer credit:
- The lender must hold a Consumer Credit Law license from OFI (R.S. 9:3514)
- Loan documents must comply with Louisiana consumer lending disclosure requirements
- Finance charges must comply with UCCC tiers or the 12% cap for loans under $7,500

**Condition 3: No Insurance Proceeds as Primary Repayment Source**

The escrow arrangement must NOT:
- Hold insurance claim proceeds for disbursement to contractors (this constitutes AOB)
- Condition contractor payment on insurer approval or payment
- Create any document that assigns, transfers, or gives a security interest in insurance benefits
- Include the insurer as a party to the escrow arrangement

**Condition 4: Work Verification and Milestone-Based Disbursement**

Escrow disbursement to the contractor must be based on:
- Verified completion of specified work milestones (e.g., inspection by neutral third party, homeowner acknowledgment, photographic documentation)
- Compliance with the underlying construction contract
- No requirement of insurer inspection or approval

**Condition 5: Separate Repayment Obligation**

The homeowner's repayment obligation must be:
- Independent of insurance claim outcome
- A direct obligation to the lender (or SmartContractor if acting as lender, with appropriate license)
- Documented in a separate loan agreement compliant with Louisiana consumer credit law
- Not secured by insurance proceeds (may be secured by other collateral, subject to licensing)

### 4.5 Escrow-Backed Advance: SmartContractor Implementation Pathway

| Step | Action | Estimated Timeline | Cost |
|---|---|---|---|
| 1 | Retain Louisiana civil law counsel specializing in financial services | 1-2 weeks | $15,000-$50,000 |
| 2 | Apply for Consumer Credit Law license from OFI (if lending directly) | 3-6 months | $650 application + bond + legal |
| 3 | Establish relationship with OFI-licensed escrow agent or federally insured bank | 1-3 months | Negotiable |
| 4 | Develop Louisiana-specific escrow agreement under civil law principles | 1-2 months | Legal fees |
| 5 | Submit escrow structure to OFI for informal guidance or no-action letter | 2-4 months | No fee; legal preparation costs |
| 6 | Develop work verification and milestone disbursement procedures | 1 month | Operational costs |
| 7 | Implement consumer credit disclosures and loan documentation | 1-2 months | Legal + compliance costs |
| 8 | Obtain VCBA license (if token collateral involved) | 6-12 months | $5,000 + $100,000+ bond + legal |

### 4.6 Escrow-Backed Advance: Risk Assessment

| Risk Category | Level | Mitigation |
|---|---|---|
| AOB prohibition risk | **MEDIUM** if properly structured | Ensure escrow does not hold or route insurance proceeds; maintain strict separation |
| Consumer credit licensing risk | **HIGH** if unlicensed | Obtain OFI consumer lending license before any loan activity |
| Escrow agent licensing risk | **HIGH** if unlicensed escrow | Use only OFI-licensed or federally insured escrow agents |
| Civil law interpretation risk | **MEDIUM-HIGH** | Louisiana civil law counsel on all documents; anticipate novel legal issues |
| Money transmitter risk | **MEDIUM** if escrow involves funds movement | Ensure escrow agent holds appropriate MT license or is exempt |
| Consumer protection risk | **MEDIUM** | Full UCCC disclosures; right of rescission; no deceptive practices |
| Operational complexity | **HIGH** | Milestone verification, multiple licensed parties, dual documentation (loan + escrow) |

### 4.7 Comparison: Escrow-Backed Advance vs. Direct Claim Advance

| Feature | Direct Claim Advance (Standard Model) | Escrow-Backed Contractor Advance (Louisiana Adaptation) |
|---|---|---|
| Repayment source | Insurance claim proceeds | Homeowner's independent obligation (not tied to insurance) |
| AOB status | **PROHIBITED** under R.S. 22:1275 | **NOT AOB** -- no assignment of insurance benefits |
| Licensing required | Multiple (lending, adjusting, potentially AOB) | Consumer Credit Law license + escrow agent relationship |
| Contractor paid from | Claim proceeds (blocked) | Escrow disbursement upon work completion |
| Homeowner obligation | Repay from claim proceeds | Direct loan repayment to licensed lender |
| Insurance involvement | Central (AOB to insurer) | None -- insurer is not a party |
| Speed of funds | Fast (direct from claim) | Slower (milestone verification + escrow disbursement) |
| Legal viability in Louisiana | **BLOCKED** | **POTENTIALLY VIABLE** with proper licensing |
| Complexity | Lower (but legally barred) | Higher (multiple licenses, escrow coordination) |

**Conclusion for Section 4:** An escrow-backed contractor advance model offers the most plausible legal pathway for SmartContractor in Louisiana, but requires substantial licensing investment, a licensed escrow agent relationship, strict separation from insurance proceeds, and comprehensive Louisiana civil law counsel review. The model is NOT a simple workaround -- it is a fundamentally different product structure that eliminates insurance-dependency in favor of a traditional consumer lending model with escrow-managed construction disbursement.

---


## Section 5: Contractor Licensing & Restrictions

### 5.1 Contractor's Occupational Licensing Law: Overview

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 37:2150 et seq. (Contractor's Occupational Licensing Law) |
| **Regulator** | Louisiana State Licensing Board for Contractors (LSLBC) |
| **Scope** | All commercial, residential, and home improvement construction in Louisiana |

Louisiana imposes strict licensing requirements on contractors based on project value and type. SmartContractor works with contractors; therefore, all contractors using or accessing the SmartContractor platform in Louisiana must hold appropriate LSLBC licenses or registrations. SmartContractor should implement license verification procedures before enabling contractor access.

### 5.2 License Tiers and Thresholds

| License Type | Threshold | Requirements | Bond/Insurance |
|---|---|---|---|
| **Commercial Construction License** | Projects $50,000+ ($10,000+ for plumbing, electrical, mechanical) | Examination; experience verification; financial responsibility | General liability ($100,000 min); workers' compensation |
| **Residential Construction License** | Projects $75,000+ | Examination; experience verification | General liability ($100,000 min); workers' compensation |
| **Home Improvement Registration** | Projects $7,500 to $75,000 | Registration (no exam); proof of insurance | General liability ($100,000 min) |
| **Municipal Contractors** | Varies by parish/municipality | Local permits may be required in addition to state license | Varies |

**Subcontractor Rules:** All subcontractors performing work within the scope of the primary contractor's license must either hold their own appropriate license or work under the supervision of a properly licensed contractor. The primary contractor bears responsibility for subcontractor compliance.

### 5.3 Written Contract Requirements (R.S. 37:2159)

Louisiana imposes specific written contract requirements for home improvement contracts:

**Mandatory Elements:**
- Complete agreement between owner and contractor
- Contractor's full legal name, physical address, and LSLBC license number
- Detailed description of work to be performed and materials to be used
- Total contract amount (or detailed description of basis for final price if not fixed)
- All signatures of parties

**Special Rule for Roof Repair/Replacement:**
- Contracts for roof repair or replacement to be paid from insurance proceeds MUST include a specific cancellation notice
- Notice must be in **boldface, 10-point type or larger**
- Owner has **72-hour cancellation right** after being notified that the insurer has denied all or part of the claim
- The 72-hour period runs from the time the owner receives notice of denial, not from contract signing
- This provision reflects the legislature's intent to protect homeowners from being locked into roofing contracts when insurance coverage is uncertain

**SmartContractor Implementation:** The SmartContractor platform should:
- Auto-populate Louisiana-required contract provisions for projects within the state
- Flag roof repair/replacement contracts for the mandatory 72-hour cancellation notice
- Block contract execution until all required elements are completed
- Maintain electronic records of all Louisiana contracts for minimum retention periods

### 5.4 Contractor Prohibited Acts -- CRITICAL (R.S. 37:2159.1)

La. R.S. 37:2159.1 establishes a comprehensive list of acts that contractors are **expressly prohibited** from performing. These prohibitions have direct, immediate implications for SmartContractor's platform design and feature set. SmartContractor must ensure that NO platform feature enables, facilitates, or appears to facilitate any prohibited act.

**Prohibition 1: Interpreting Insurance Policy Provisions**

> "A contractor shall not interpret insurance policy provisions regarding coverage or duties under an insured's property insurance policy."

**SmartContractor Implication:**
- Platform must NOT provide insurance policy analysis tools to contractors
- Must NOT generate "coverage reports" or "policy summaries"
- Must NOT include features that compare estimates to policy limits or coverage categories
- Contractor dashboard must NOT display policy language, coverage codes, or deductible amounts
- AI-powered tools must NOT be made available to contractors for insurance claim analysis

**Prohibition 2: Adjusting Property Insurance Claims**

> "A contractor shall not adjust a property insurance claim on behalf of an insured as an adjuster. This prohibition shall apply to any compensated employee or non-employee of a contractor."

**SmartContractor Implication:**
- Platform must NOT allow contractors to file claims, submit proof of loss, or communicate with insurers on homeowner's behalf
- Must NOT provide claim submission portals, adjuster-style estimate forms, or insurer-facing document upload
- "Compensated" scope is broad -- includes employees, subcontractors, and independent representatives
- Even "helping" a homeowner organize claim documents may constitute adjusting if done by contractor

**Prohibition 3: Agreement Without Itemized Estimate**

> "A contractor shall not provide an agreement authorizing repairs without a good faith itemized estimate of the work to be completed."

**SmartContractor Implication:**
- Platform must require itemized estimates before any authorization or agreement
- Estimates must be in "good faith" -- not inflated, not deceptive
- SmartContractor can facilitate estimate creation but should include safeguards against fraud

**Prohibition 4: Sharing Legal Fees with Attorneys**

> "A contractor shall not share in any legal fee earned by an attorney."

**SmartContractor Implication:**
- No revenue-sharing arrangements between contractors and attorneys on the platform
- No attorney referral fees paid to contractors
- Platform must not facilitate introductions between contractors and attorneys for fee-sharing purposes

**Prohibition 5: Requiring Attorney Representation**

> "A contractor shall not require an insured to sign an agreement authorizing an attorney to represent the insured."

**SmartContractor Implication:**
- Contractors cannot condition work on homeowner retaining an attorney
- Platform must not bundle attorney services with contractor services
- Any attorney referral feature must be entirely optional and clearly separate

**Prohibition 6: Accepting Referral Fees from Attorneys**

> "A contractor shall not accept referral fees from an attorney or law firm."

**SmartContractor Implication:**
- No referral fee arrangements visible on platform
- Payment flows must not show attorney-to-contractor payments
- SmartContractor itself must not accept referral fees that are shared with contractors

**Penalties for Violation:**
- LSLBC disciplinary action: license suspension, revocation, fines
- Civil liability to homeowner
- Potential criminal liability for fraud or deceptive trade practices
- LDI enforcement if insurance laws implicated

### 5.5 Contractor Insurance Requirements

| Insurance Type | Minimum Coverage | Statutory Basis |
|---|---|---|
| General Liability | $100,000 (residential/home improvement) | R.S. 37:2155 |
| Workers' Compensation | Statutory limits (if employees) | Louisiana Workers' Compensation Act |
| Commercial Auto | State minimum (if vehicles used) | R.S. 32:900 et seq. |

SmartContractor should verify contractor insurance coverage during onboarding and require annual re-verification. Uninsured contractors create liability exposure for all parties.

### 5.6 SmartContractor Platform Requirements for Louisiana Contractors

To ensure compliance with Louisiana contractor law, SmartContractor must implement:

1. **License Verification:** Real-time or periodic verification of LSLBC license status via LSLBC database
2. **Insurance Verification:** Certificate of insurance (COI) upload and annual re-verification
3. **Prohibited Feature Blocklist:** Disable any platform features that could enable insurance policy interpretation, claim adjusting, or attorney fee sharing
4. **Contract Template Compliance:** Louisiana-specific contract templates with all required disclosures
5. **Roof Work Flagging:** Automatic detection of roof repair/replacement scope and 72-hour cancellation notice injection
6. **Audit Trail:** Complete documentation of all contractor activities for regulatory examination purposes

---

## Section 6: Insurance Claims, ALE & Bad Faith Framework

### 6.1 Additional Living Expense (ALE) Advance for Total Loss (R.S. 22:1338)

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 22:1338 |
| **Trigger** | Total loss to insured dwelling |
| **Advance Amount** | Estimated value of three months of increased cost of living expenses |
| **Request Process** | Insured must make written request to insurer |
| **Timing** | Advance payable upon request (no waiting for full claim resolution) |
| **Subsequent Payments** | After advance period, additional ALE payable upon satisfactory proof of loss if actual costs exceed advance |

**Critical SmartContractor Implication:** La. R.S. 22:1338 creates a **direct statutory right of the insured to receive advances from their own insurer** -- not from a third party. The statute does NOT create any right for a third party (including SmartContractor, a contractor, or a lender) to receive or advance ALE funds. 

SmartContractor cannot position itself as a source of ALE advances without appropriate licensing. Any product marketed as "ALE advance" or "living expense advance" to Louisiana homeowners must be structured as a consumer loan (requiring OFI licensure) and must NOT be conditioned on or repaid from insurance proceeds (which would trigger AOB issues). The ONLY source of a true "ALE advance" under R.S. 22:1338 is the homeowner's own insurer.

### 6.2 Claim Payment Timing and Penalties (Bad Faith) -- R.S. 22:1892

La. R.S. 22:1892 establishes the foundational bad faith framework for Louisiana insurance claims. The statute was substantially amended by **Act 3 of 2024**, effective July 1, 2024, introducing significant new provisions including "reverse bad faith" and a cure period mechanism for catastrophic losses.

**Payment Timing Requirements:**

| Loss Type | Adjustment Initiation | Payment Deadline | Statute |
|---|---|---|---|
| Standard claims | Within 14 days of notice of loss | Within 30 days of satisfactory proof of loss | R.S. 22:1892(A) |
| Catastrophic loss (residential) | Within 14 days (except emergencies) | 60 days from satisfactory proof of loss | R.S. 22:1892.2 |
| Catastrophic loss (non-residential) | Within 14 days (except emergencies) | 90 days from satisfactory proof of loss | R.S. 22:1892.2 |

**Bad Faith Penalties:**
- If insurer fails to pay "arbitrary, capriciously, or without probable cause": penalty of **50% of amount found due OR $1,000, whichever is greater**
- PLUS **reasonable attorneys' fees** incurred by insured
- Penalty is assessed by court after trial or hearing on the merits

**Catastrophic Loss Cure Period (NEW 2024):**
- Before filing a bad faith suit for catastrophic loss, insured must send written **"cure period notice"**
- Insurer then has **60 days to cure** by paying the amount due
- If insurer pays **full amount due PLUS 20% attorneys' fees** within the cure period, the bad faith claim is extinguished
- This creates a powerful settlement mechanism but also adds procedural complexity

**Reverse Bad Faith (NEW 2024 -- R.S. 22:1892(J)):**

For the first time, Louisiana law imposes a **duty of good faith on insureds and their representatives**. Reverse bad faith includes:
- Failure to comply with contractual duties (e.g., providing proof of loss, cooperating with investigation)
- Misrepresenting facts or policy provisions
- Submitting claims lacking evidentiary support
- Other acts demonstrating lack of good faith

**SmartContractor Implication:** Reverse bad faith creates liability exposure if SmartContractor or its contractors encourage or assist homeowners in submitting unsupported claims, misrepresenting facts, or failing to cooperate with insurers. Platform must NOT facilitate or encourage claim behavior that could constitute reverse bad faith.

### 6.3 Proof of Loss Requirements (R.S. 22:1312)

| Attribute | Detail |
|---|---|
| **Insurer Duty** | Provide proof of loss form within 30 days of receiving notice of loss |
| **Insurer Advisory Duty** | Must advise insured of the requirement to submit proof of loss |
| **Insured Obligation** | Submit completed proof of loss within time specified in policy (typically 60 days) or as extended by law |

### 6.4 Civil Authority / Prohibited Use Coverage (R.S. 22:1273)

For losses resulting from declared disasters, if a civil authority prohibits use of the insured premises, coverage is afforded as provided in the policy. This applies regardless of whether formal evacuation orders were issued. This statute was significant in post-Hurricane Katrina litigation and remains relevant for Louisiana disaster response.

### 6.5 Claim Proceeds Breakdown (R.S. 22:1892)

When making payment incident to a claim, the insurer must provide a written breakdown specifying:
- Amounts for dwelling/property damage
- Amounts for Additional Living Expenses (ALE)
- Amounts for other coverages
- Deductibles applied
- Depreciation (if ACV policy)

This breakdown requirement helps homeowners understand their claim payments and is relevant if third parties (including lenders) are evaluating claim values. SmartContractor should NOT request or process these breakdowns on behalf of contractors, as doing so may constitute claim adjusting under R.S. 37:2159.1.

### 6.6 Louisiana Citizens Property Insurance Corporation: Claims Context

Louisiana Citizens operates as the state's insurer of last resort with substantial market share in high-risk parishes. Key claims considerations:

- Louisiana Citizens policies are subject to the same AOB prohibition (R.S. 22:1275) as private policies
- Claims handling timelines under R.S. 22:1892 and 22:1892.2 apply
- Louisiana Citizens has its own claims adjustment procedures but must comply with statutory timelines
- The "depopulation" program (transferring policies to private insurers) does not affect claims on existing policies
- SmartContractor must treat Louisiana Citizens as a major claims payor in Louisiana, with identical compliance requirements as private insurers

### 6.7 SmartContractor Claims Activities: Absolute Prohibitions

Based on the foregoing statutory framework, SmartContractor is **ABSOLUTELY PROHIBITED** from the following in Louisiana:

| Prohibited Activity | Statutory Basis | Penalty |
|---|---|---|
| Advancing insurance claim proceeds to homeowners | R.S. 22:1275 (AOB prohibition) + consumer credit licensing | AOB void; UDAP violation; unlicensed lending |
| Taking assignment of insurance benefits | R.S. 22:1275 | Assignment null and void; UDAP violation |
| Adjusting claims on homeowner's behalf | R.S. 37:2159.1 | LSLBC discipline; unauthorized adjusting |
| Negotiating with insurers | R.S. 22:1692 (public adjuster scope); unauthorized practice of law | Criminal/civil liability |
| Providing ALE advances without lending license | R.S. 22:1338 (reserved to insurer) + R.S. 9:3514 | Unlicensed consumer lending |
| Facilitating reverse bad faith conduct | R.S. 22:1892(J) | Contribution to insured's liability |
| Interpreting policy provisions | R.S. 37:2159.1(1) | LSLBC discipline |
| Charging percentage/contingency fees for claim services | R.S. 22:1703 | Contract void; LDI discipline |

### 6.8 Legally Permissible Claims-Related Activities

The following activities ARE legally permissible for SmartContractor in Louisiana:

| Permissible Activity | Conditions |
|---|---|
| Providing general educational information about the claims process | Must not advise on specific claims; must include disclaimer |
| Connecting homeowners to licensed attorneys | No fee-sharing; no referral fees from attorneys to SmartContractor/contractors |
| Document management for homeowner's own records | Homeowner controls all insurer communications; platform does not submit to insurers |
| Contractor estimate creation | Itemized, good faith estimates only; no comparison to policy limits |
| Loan origination (consumer lending license required) | Loan is independent of insurance claim; repayment not tied to claim proceeds |
| Escrow disbursement to contractors (escrow model) | Licensed escrow agent; milestone-based; no insurer involvement |

---

## Section 7: Assignment of Benefits (AOB) Prohibition

### 7.1 AOB Status: ABSOLUTELY PROHIBITED

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 22:1275 (Act 364 of the 2023 Regular Legislative Session) |
| **Effective Date** | 2023 (immediately upon enactment) |
| **LDI Advisory** | Advisory Letter 2025-02 (June 20, 2025) |
| **Legal Effect** | AOB agreements are "against public policy and are null and void" |
| **Scope** | All post-loss assignments of property insurance benefits to "persons providing services" |

### 7.2 Statutory Text and Elements

**Definition of "Assignment Agreement" (R.S. 22:1275(A)):**

> "Assignment agreement" means any instrument by which post-loss benefits under a residential or commercial property insurance policy are assigned, transferred, or acquired to or from a person providing services."

**"Person providing services" includes:**
- Persons inspecting, protecting, repairing, restoring, replacing, or mitigating damage to property
- Contractors and restoration companies
- Any person who receives compensation for these services

**Core Prohibition (R.S. 22:1275(B)(1)):**

> "A person shall not solicit or accept an assignment, in whole or in part, of any post-loss insurance benefit under a residential or commercial property insurance policy. An assignment agreement is against public policy and is null and void."

**Exceptions (R.S. 22:1275(B)(2)):**

The prohibition does NOT apply to:
- (a) Assignment to a **federally insured financial institution, mortgagee, or subsequent purchaser of the property**
- (b) Assignment of **liability coverage** benefits

**Violation Consequences (R.S. 22:1275(C)):**

Violation is an **unfair or deceptive trade practice** subject to penalties under R.S. 22:1969, including:
- Civil penalties
- LDI enforcement actions
- Restitution orders
- Potential criminal referral

**Express Override of Civil Code (R.S. 22:1275(D)):**

> "The provisions of Civil Code Article 2653 shall not apply to this Section."

This legislative override is critical. Under La. C.C. Art. 2653, anti-assignment clauses in contracts are generally enforceable only if the assignee has no knowledge of the clause. The legislature expressly eliminated this defense for AOB arrangements, making the prohibition absolute regardless of the assignee's knowledge of policy terms.

**Attorney Contingency Fees Preserved (R.S. 22:1275(E)):**

Nothing in the statute prohibits attorney contingency fees under R.S. 37:218. This carve-out is significant because it is one of the few remaining mechanisms for claim-related compensation tied to claim outcomes.

### 7.3 Civil Law Context: Why AOB Prohibition Overrides General Assignment Principles

Under Louisiana's civil law system, the general rule (before Act 364) was:

- **La. C.C. Art. 2642:** "All rights are assignable except those that are strictly personal." Insurance claim rights are generally not "strictly personal" and were therefore assignable.
- **La. C.C. Art. 2653:** Anti-assignment clauses in contracts are enforceable against assignees who have knowledge of the clause, but not against bona fide assignees without knowledge.
- **Pre-2023 Case Law:** Louisiana courts generally allowed post-loss assignments of insurance benefits despite policy anti-assignment clauses, reasoning that post-loss assignment does not increase the insurer's risk (the loss has already occurred).

**Act 364 Reversed the Civil Law Default:** The Louisiana Legislature used its plenary authority to override the civil code default rules specifically for insurance AOBs. The legislature's power to override civil code principles by specific statute is well-established in Louisiana and reflects the civil law tradition where the code is paramount but the legislature retains ultimate lawmaking authority.

This means:
- AOB is void even if the policy is silent on assignment
- AOB is void even if the insurer had previously accepted AOB arrangements
- AOB is void even if the assignment is post-loss (when the insurer's risk cannot increase)
- AOB is void even if the assignee had no knowledge of anti-assignment language
- No equitable exception applies

### 7.4 SmartContractor AOB Risk Matrix

| Scenario | AOB Status | Analysis |
|---|---|---|
| Homeowner assigns claim to SmartContractor | **PROHIBITED** | SmartContractor is a "person providing services" or facilitating services |
| Homeowner assigns claim to contractor via SmartContractor platform | **PROHIBITED** | The assignment instrument exists; platform facilitated prohibited act |
| SmartContractor takes security interest in claim proceeds | **PROHIBITED** | Functionally equivalent to assignment; violates R.S. 22:1275 |
| SmartContractor directs insurer to pay contractor directly | **PROHIBITED** | Directed payment constitutes assignment of benefits |
| Homeowner signs "direction to pay" in favor of contractor | **PROHIBITED** | Direction to pay is a form of assignment; void under R.S. 22:1275 |
| Assignment to federally insured bank as mortgagee | **PERMITTED** | Express exception in R.S. 22:1275(B)(2)(a) |
| Assignment to attorney for fees | **PERMITTED** | Express preservation in R.S. 22:1275(E) |
| Homeowner receives claim and pays contractor independently | **PERMITTED** | No assignment; homeowner pays from own funds |
| Escrow disbursement from homeowner's own funds | **PERMITTED** | No assignment; funds are homeowner's, not insurer's |

### 7.5 LDI Advisory Letter 2025-02: Enforcement Confirmation

On June 20, 2025, the Louisiana Department of Insurance issued **Advisory Letter 2025-02** reminding all entities -- including contractors, restoration companies, lenders, and technology platforms -- of the AOB prohibition. Key takeaways:

- LDI considers the prohibition sweeping and unambiguous
- "Creative" workarounds (such as power of attorney arrangements, direction-to-pay documents, or invoice factoring) that achieve the same result as AOB will be treated as AOB violations
- LDI encourages consumers to report suspected AOB violations
- LDI will coordinate with LSLBC for contractor violations and with OFI for financial services violations

### 7.6 AOB Prohibition: Strategic Implications for SmartContractor

The AOB prohibition eliminates the core business model of claim-secured contractor financing in Louisiana. SmartContractor must accept the following strategic realities:

1. **No claim-secured product is viable in Louisiana** as currently structured. Any product that relies on insurance claim proceeds as the repayment source is legally impossible.

2. **Mortgagee exception requires genuine mortgage.** The R.S. 22:1275(B)(2)(a) exception for "federally insured financial institution, mortgagee, or subsequent purchaser" requires a bona fide mortgage or security interest recorded in parish conveyance records. Simple token collateral does NOT qualify.

3. **Escrow model (Section 4) is the only viable alternative**, but it requires full separation from insurance proceeds and comprehensive licensing.

4. **Attorney fee exception (R.S. 22:1275(E))** preserves a narrow path for attorney-involved claim services, but SmartContractor cannot use this exception to circumvent the general prohibition.

5. **Any attempt to structure around the prohibition** using novel legal mechanisms (power of attorney, factoring, merchant cash advance characterization) will be viewed as evasion and subject to enforcement.

---


## Section 8: Public Adjuster & Insurance Representation Rules

### 8.1 Definition and Scope: Narrower Than All Other States

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 22:1691-1708 (Public Adjusters) |
| **Regulator** | Louisiana Department of Insurance (LDI) |
| **Definition of "Public Adjusting"** | "Investigating, appraising, or evaluating and reporting to an insured in relation to a first-party claim" |

**CRITICAL DISTINCTION:** Louisiana's definition of "public adjusting" is **deliberately narrower** than in any other U.S. state. The statute does NOT include "negotiating for or effecting the settlement of a claim" in the definition. This omission is intentional and reflects Louisiana jurisprudence holding that **direct negotiation with insurers on behalf of insureds constitutes the unauthorized practice of law**.

This means:
- A Louisiana public adjuster investigates damage, evaluates loss, and reports findings to the homeowner
- The public adjuster CANNOT call the insurer, write settlement demand letters, negotiate scope/price, or attend insurer examinations
- Only a **Louisiana-licensed attorney** may negotiate claim settlements on behalf of an insured (or the insured may negotiate their own claim)

### 8.2 Licensing Requirements (R.S. 22:1691-1708)

| Requirement | Detail |
|---|---|
| **License Required** | Yes -- no exemption for "incidental" adjusting |
| **Reciprocity** | Available with states having substantially equivalent requirements |
| **Examination** | Required (unless exempted by reciprocity or prior licensure) |
| **Surety Bond** | $50,000 surety bond OR irrevocable line of credit |
| **Continuing Education** | 24 hours biennially (including ethics) |
| **Record Retention** | 5 years |
| **Criminal Penalty** | Unauthorized public adjusting is a crime under R.S. 22:1707 |

**Application Process:**
- Application filed with LDI
- Background check required
- Examination scheduled through LDI-approved provider
- Bond or irrevocable line of credit filed with LDI
- License issued upon satisfactory completion of all requirements

### 8.3 Fee Restrictions -- CRITICAL (R.S. 22:1703)

La. R.S. 22:1703 contains one of the most restrictive public adjuster fee provisions in the United States:

> "A public adjuster shall not solicit for or enter into any contract or arrangement between an insured and a public adjuster which provides for payment of a fee to the public adjuster which is contingent upon, or calculated as a percentage of, the amount of any claim or claims paid to or on behalf of an insured by the insurer and any such contract shall be against public policy and is null and void."

**What This Means:**
- **Contingency fees:** PROHIBITED. A public adjuster cannot charge a percentage of the claim payment.
- **Percentage fees:** PROHIBITED. Any fee tied to claim amount is void.
- **Permitted fee structures:** Reasonable flat fee OR hourly rate only
- **Fee basis:** Must be based on time spent and expenses incurred
- **Special rule:** If insurer pays policy limits within 72 hours of loss report, public adjuster is entitled only to reasonable compensation for actual time and expenses incurred BEFORE the payment

**SmartContractor Implication:** SmartContractor must NOT:
- Facilitate percentage-based or contingency fee arrangements between homeowners and public adjusters
- Calculate, display, or process fees based on claim amounts
- Enable any fee structure that could be characterized as contingent upon claim payment

### 8.4 Contract Requirements (R.S. 22:1704)

All public adjuster contracts in Louisiana must:

1. Be in writing
2. Contain 12 specific elements mandated by statute, including:
   - Adjuster's name, address, and license number
   - Insured's name and loss address
   - Description of services to be performed
   - Fee structure (flat fee or hourly rate)
   - Itemized list of expenses
   - Notice of 3-business-day right of cancellation
   - Disclosure document explaining the claims process
   - Notice that adjuster cannot negotiate with insurer
3. Include the statutorily required disclosure document
4. Be signed by the insured
5. **Must notify insurer** of contract via signed letter from insured (adjuster cannot sign for insured)

**Cancellation Rights:**
- Insured has **3-business-day right of cancellation** from contract execution or from first meaningful contact with insurer, whichever is later
- Cancellation notice must be in boldface type
- Full refund of all fees required if cancelled within period

### 8.5 Standards of Conduct (R.S. 22:1706)

> "A public adjuster is obligated, under his license, to serve with objectivity and complete loyalty to the interest of his insured alone."

**Prohibited Conduct:**
- Accepting referral fees from attorneys, contractors, or other service providers
- Having any financial interest in the outcome of the claim beyond the flat/hourly fee
- Misrepresenting facts or policy provisions to the insured
- Failing to disclose material information about the claim
- Communicating directly with the insurer to negotiate (unauthorized practice of law)

### 8.6 Who May Negotiate with Insurance Companies in Louisiana

| Role | May Negotiate with Insurer? | Authority |
|---|---|---|
| **Licensed Louisiana attorney** | YES | R.S. 37:218; attorney-client relationship |
| **Public adjuster** | NO | R.S. 22:1692; unauthorized practice of law |
| **Contractor** | NO | R.S. 37:2159.1; prohibited act |
| **Homeowner (self)** | YES | Always; own claim rights |
| **Insurance producer/agent** | Limited | Within scope of agency contract with insurer |
| **SmartContractor / platform** | NO | Would constitute unauthorized adjusting or UPL |

### 8.7 SmartContractor Public Adjuster Risk Analysis

| Risk Scenario | Level | Mitigation |
|---|---|---|
| Platform connects homeowners to public adjusters | LOW if properly structured | Verify adjuster LDI license; enforce flat/hourly fee; provide disclosure templates |
| Platform displays public adjuster fees based on claim estimates | **HIGH** | Do not calculate or display percentage-based fees; block fee calculators tied to claim amounts |
| Platform allows adjuster to upload documents to insurer through platform | **VERY HIGH** | This constitutes negotiation/facilitation of claim presentation; PROHIBITED |
| Platform provides adjuster-style tools to contractors | **VERY HIGH** | Constitutes enabling unauthorized adjusting; R.S. 37:2159.1 violation |
| Platform takes referral fees from public adjusters | **HIGH** | LDI considers this unethical; may violate R.S. 22:1706 |
| SmartContractor employees advise homeowners on claim strategy | **VERY HIGH** | Unauthorized practice of law and/or unauthorized adjusting |

### 8.8 SmartContractor Platform Requirements for Public Adjuster Compliance

1. **License Verification:** Verify all public adjusters' LDI license status before platform access
2. **Fee Structure Controls:** Platform must only permit flat fee or hourly rate input; block percentage or contingency fee entry
3. **Communication Barriers:** Platform must NOT provide messaging tools between adjusters and insurers; adjuster communications should be limited to insured only
4. **Document Control:** Adjuster reports should go to homeowner only; platform must not transmit adjuster documents to insurers
5. **Disclosure Templates:** Provide Louisiana-required public adjuster contract templates and disclosure documents
6. **Cancellation Tracking:** Track 3-business-day cancellation window and process refunds automatically
7. **Audit Trail:** Maintain complete records of all adjuster activities for LDI examination

---

## Section 9: Token Collateral, Virtual Currency & Money Transmission

### 9.1 Louisiana Virtual Currency Business Act (VCBA) -- R.S. 6:1381 et seq.

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 6:1381-1394 |
| **Regulator** | Louisiana Office of Financial Institutions (OFI) |
| **Effective Date** | January 1, 2023 (licensing required after June 30, 2023) |
| **Application Portal** | NMLS (Nationwide Multistate Licensing System) |
| **Application Fee** | $5,000 |
| **Surety Bond** | Minimum $100,000 (volume-based, up to $1,000,000; OFI discretion to increase to $7,000,000) |
| **Net Worth** | Greater of $100,000 OR 3% of total assets |
| **Financial Statements** | Audited financials required annually |
| **Reporting** | Quarterly reports through NMLS |
| **Exemptions** | Extremely limited; no broad smart contract or DeFi exemption |

**Activities Requiring VCBA License:**

"Virtual currency business activity" means any of the following conducted for compensation:
- **(a)** Exchanging, transferring, or **storing virtual currency** or engaging in virtual currency administration
- **(b)** Holding electronic precious metals or electronic certificates representing precious metals
- **(c)** Exchanging one or more digital representations of value used within online games or digital platforms

### 9.2 Critical VCBA Analysis for SmartContractor

**Token Collateral Lock = "Storing Virtual Currency" = REQUIRES LICENSE**

The single most important VCBA determination for SmartContractor is that **holding or controlling virtual currency on behalf of Louisiana residents constitutes "storing virtual currency" under R.S. 6:1381(4)(a)** and requires a VCBA license.

| SmartContractor Feature | VCBA Characterization | License Required? |
|---|---|---|
| Token collateral lock (holding user's tokens as loan security) | "Storing virtual currency" | **YES** |
| Token liquidation (selling locked tokens on default) | "Exchanging virtual currency" | **YES** |
| Stablecoin collateral (USDC, USDT) | Covered as "virtual currency" | **YES** |
| Repayment routing via smart contract | Potentially "transferring" | **LIKELY YES** |
| Non-custodial wallet connection only | Not storing | **NO** (if truly non-custodial) |
| Blockchain record-keeping only (hashes, no funds) | Not a VCBA activity | **NO** |

**No Exemption for Smart Contracts or DeFi:** The VCBA does NOT contain an exemption for smart contracts, decentralized protocols, or automated execution. The statute focuses on the **activity** (storing, exchanging, transferring), not the **technology**. If SmartContractor's platform holds or controls virtual currency on behalf of Louisiana residents, licensure is required regardless of whether the holding is implemented via smart contract, multi-sig, or traditional custody.

### 9.3 Virtual Currency Custody Services (R.S. 6:1402)

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 6:1402 |
| **Permitted Providers** | State-chartered banks, trust companies, savings associations, and credit unions |
| **Third-Party Providers** | Financial institutions may use third-party service providers for custody |
| **Requirements** | Risk management systems; adequate insurance; service provider oversight; segregation of assets |
| **Custody Types** | Non-fiduciary (customer retains key control) and fiduciary (institution controls keys; requires trust powers) |

**SmartContractor Implication:** SmartContractor itself does not qualify as a "financial institution" under R.S. 6:1402 and therefore cannot provide custody services unless it first obtains a VCBA license. A partnership with a Louisiana-licensed financial institution for custody services may be a compliance pathway, but the institution would need to implement the custody arrangement and would bear regulatory responsibility.

### 9.4 Money Transmitter Law (R.S. 6:1031 et seq.)

| Attribute | Detail |
|---|---|
| **Statute** | La. R.S. 6:1031 et seq. |
| **Regulator** | Louisiana Office of Financial Institutions (OFI) |
| **Activity Requiring License** | "Money transmission" -- receiving money for transmission or transmitting money |
| **Application Fee** | Varies; processed through NMLS |
| **Surety Bond** | Minimum $25,000; increases $5,000 per location; capped at $250,000 |
| **Net Worth** | Minimum $100,000 |
| **Exemptions** | Federally insured depository institutions; certain payment processing arrangements |

**SmartContractor Implication:** If SmartContractor's platform:
- Receives funds from borrowers and transmits to contractors (or vice versa)
- Holds funds in escrow and disburses to multiple parties
- Routes repayments through platform-controlled accounts
- Facilitates any movement of money between parties

...then money transmitter licensing may be triggered IN ADDITION TO any consumer credit or VCBA licensing. Louisiana does NOT have a broad "agent of the payee" exemption that some states provide, making MT analysis particularly important.

### 9.5 Token Collateral Status: Complete Assessment

| Status | Determination |
|---|---|
| **Token collateral lock for Louisiana residents** | **BLOCKED** without VCBA license |
| **Token liquidation for Louisiana residents** | **BLOCKED** without VCBA license |
| **Stablecoin operations** | **BLOCKED** without VCBA license (stablecoins are virtual currency under VCBA) |
| **Non-custodial wallet-only model** | **PERMITTED** if SmartContractor never holds or controls private keys or tokens |
| **Blockchain audit records (hashes only)** | **PERMITTED** -- no virtual currency activity |
| **Custodial model with VCBA license** | **PERMITTED** with full compliance: $100,000+ bond, audited financials, quarterly reporting, net worth maintenance |

### 9.6 Penalties for Unlicensed Virtual Currency Activity

| Violation | Penalty |
|---|---|
| Engaging in virtual currency business without VCBA license | Civil money penalties; cease-and-desist; restitution; up to **$10,000 per violation per day** |
| Criminal violation | Knowing and willful unlicensed activity may result in criminal prosecution |
| Enforcement coordination | OFI coordinates with LDI, Attorney General, and federal regulators |
| Injunctive relief | OFI may seek court injunction to halt unlicensed activity |

### 9.7 Strategic Options for Token Collateral in Louisiana

**Option 1: Obtain Full VCBA License**
- Timeline: 6-12 months
- Cost: $5,000 application + $100,000+ bond + audited financials preparation + legal fees ($50,000-$150,000 total)
- Ongoing: Quarterly NMLS reporting; annual audits; net worth maintenance; examination costs
- Benefit: Full functionality for Louisiana residents

**Option 2: Non-Custodial Architecture**
- Redesign platform so SmartContractor never holds private keys or controls tokens
- User maintains self-custody; smart contract executes on-chain without intermediary custody
- Legal analysis required to confirm true non-custodial status under VCBA
- Benefit: No VCBA license required (if truly non-custodial)
- Risk: OFI may still assert jurisdiction if SmartContractor's interface appears to "store" or "administer" tokens

**Option 3: Licensed Financial Institution Partnership**
- Partner with Louisiana-chartered bank or trust company holding VCBA registration
- Institution provides custody; SmartContractor provides interface
- Institution bears regulatory responsibility; SmartContractor acts as technology service provider
- Requires extensive contractual and regulatory structuring
- Benefit: Leverages institution's existing license; potentially faster to market

**Option 4: Exclude Louisiana**
- Block all Louisiana IP addresses from token collateral features
- No licensing required for excluded features
- Business impact: Loss of Louisiana market for token-backed products

---

## Section 10: Dashboard Rules & Compliance Matrix

### 10.1 SmartContractor Louisiana Dashboard Configuration

```json
{
  "state": "LA",
  "state_name": "Louisiana",
  "legal_system": "CIVIL_LAW_NAPOLEONIC_CODE",
  "regulatory_risk_level": "VERY_HIGH_BLOCKED",
  "civil_law_compliance_required": true,
  "required_counsel": "LOUISIANA_CIVIL_LAW_ATTORNEY",
  "token_collateral_products": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": [
      "live_loan_creation",
      "token_collateral_lock",
      "token_liquidation",
      "repayment_routing",
      "stablecoin_escrow",
      "nft_collateral_lock"
    ],
    "required_licenses": [
      "VCBA_LICENSE_OFI",
      "MONEY_TRANSMITTER_LICENSE"
    ],
    "required_reviews": [
      "Louisiana_counsel_opinion",
      "OFI_informal_guidance",
      "VCBA_license_application",
      "civil_law_contract_review"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "VCBA_LICENSE_STATUS_DISCLOSURE",
      "VIRTUAL_CURRENCY_RISK_DISCLOSURE",
      "NO_CONSUMER_ADVICE_DISCLAIMER"
    ],
    "notes": "Louisiana Virtual Currency Business Act (R.S. 6:1381 et seq.) requires $100,000+ surety bond, $5,000 application fee, NMLS application through OFI, audited financials, and minimum net worth of greater of $100,000 or 3% of total assets. 'Storing virtual currency' includes token collateral lock. Money Transmitter Law (R.S. 6:1031) may also apply to repayment routing. Civil law system creates additional contract interpretation uncertainty for smart contracts. No exemption for DeFi or smart contract automation."
  },
  "claimbridge_claim_advance": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": [
      "insurance_claim_advance",
      "assignment_of_benefits",
      "claim_proceeds_secured_lending",
      "direction_to_pay",
      "power_of_attorney_for_claims",
      "insurer_direct_payment_request",
      "ALE_advance",
      "loss_draft_interception"
    ],
    "required_licenses": [
      "CONSUMER_CREDIT_LICENSE_OFI",
      "LDI_NOTIFICATION"
    ],
    "required_reviews": [
      "Louisiana_counsel_opinion",
      "OFI_consumer_credit_application",
      "LDI_compliance_review",
      "AOB_prohibition_compliance_audit"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "AOB_PROHIBITION_NOTICE",
      "NO_ADJUSTING_SERVICES_DISCLAIMER",
      "CONTRACTOR_RESTRICTIONS_NOTICE",
      "ATTORNEY_REFERRAL_RULES_NOTICE",
      "REVERSE_BAD_FAITH_NOTICE_2024"
    ],
    "notes": "La. R.S. 22:1275 (Act 364 of 2023) PROHIBITS assignment of post-loss insurance benefits to 'persons providing services' -- declared against public policy and null/void. LDI Advisory Letter 2025-02 confirms active enforcement. Contractors cannot interpret policies, adjust claims, or share legal fees (R.S. 37:2159.1). Public adjusters cannot negotiate with insurers (R.S. 22:1692). Consumer lending license required for any homeowner advances (R.S. 9:3514). 12% cap applies to unlicensed loans under $7,500 (R.S. 9:3518). AOB exception only for federally insured financial institutions, mortgagees, and subsequent purchasers. Louisiana Citizens Property Insurance Corporation policies subject to same AOB prohibition."
  },
  "escrow_backed_contractor_advance": {
    "status": "REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": [
      "insurance_proceeds_escrow",
      "claim_conditioned_disbursement",
      "AOB_facilitation_through_escrow"
    ],
    "permitted_actions_with_counsel": [
      "milestone_based_escrow_disbursement",
      "independent_consumer_loan_with_escrow",
      "licensed_escrow_agent_coordination"
    ],
    "required_licenses": [
      "CONSUMER_CREDIT_LICENSE_OFI",
      "ESCROW_AGENT_PARTNERSHIP"
    ],
    "required_reviews": [
      "Louisiana_counsel_opinion",
      "OFI_informal_guidance_or_no_action_letter",
      "escrow_structure_compliance_review",
      "civil_law_escrow_agreement_drafting"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "ESCROW_TERMS_DISCLOSURE",
      "LENDER_LICENSE_STATUS_DISCLOSURE",
      "INDEPENDENT_REPAYMENT_NOTICE"
    ],
    "notes": "Escrow-backed contractor advance model (Section 4) offers the most plausible legal pathway but requires: (1) OFI consumer credit license; (2) partnership with OFI-licensed escrow agent or federally insured financial institution; (3) strict separation from insurance proceeds; (4) milestone-based disbursement independent of claim status; (5) homeowner's independent repayment obligation; (6) comprehensive Louisiana civil law counsel review of all escrow agreements. This is a fundamentally different product from claim-secured advances. Estimated implementation timeline: 9-18 months."
  },
  "contractor_tools": {
    "status": "DEMO_ONLY_WITH_RESTRICTIONS",
    "allowed_user_types": ["LSLBC_LICENSED_CONTRACTORS"],
    "blocked_actions": [
      "insurance_policy_interpretation_tool",
      "claim_adjusting_features",
      "insurer_communication_portal",
      "coverage_analysis_ai",
      "policy_limit_comparison",
      "attorney_fee_sharing_feature",
      "attorney_referral_fee_processing"
    ],
    "permitted_actions": [
      "estimate_creation",
      "project_management",
      "photo_documentation",
      "contract_generation_with_la_disclosures",
      "invoice_management"
    ],
    "required_verifications": [
      "LSLBC_license_verification",
      "general_liability_insurance_verification",
      "workers_compensation_verification"
    ],
    "required_disclosures": [
      "CONTRACTOR_PROHIBITED_ACTS_NOTICE",
      "72_HOUR_ROOF_CANCELLATION_NOTICE",
      "HOMEOWNER_RIGHTS_DISCLOSURE"
    ],
    "notes": "All contractors must hold valid LSLBC license. Platform must actively block features that enable insurance policy interpretation (R.S. 37:2159.1(1)), claim adjusting (R.S. 37:2159.1(2)), or attorney fee arrangements (R.S. 37:2159.1(4)-(6)). Roof repair contracts require 72-hour cancellation notice (R.S. 37:2159)."
  },
  "public_adjuster_tools": {
    "status": "DEMO_ONLY_WITH_RESTRICTIONS",
    "allowed_user_types": ["LDI_LICENSED_PUBLIC_ADJUSTERS"],
    "blocked_actions": [
      "insurer_communication_portal",
      "claim_negotiation_tools",
      "contingency_fee_calculator",
      "percentage_fee_processing",
      "insurer_document_upload",
      "settlement_demand_generation"
    ],
    "permitted_actions": [
      "estimate_creation",
      "damage_documentation",
      "report_to_insured_only",
      "flat_fee_hourly_time_tracking",
      "contract_template_with_la_disclosures"
    ],
    "required_verifications": [
      "LDI_license_verification",
      "surety_bond_verification"
    ],
    "required_disclosures": [
      "NO_NEGOTIATION_NOTICE",
      "FLAT_FEE_ONLY_NOTICE",
      "THREE_DAY_CANCELLATION_NOTICE"
    ],
    "notes": "Public adjusters in Louisiana may NOT negotiate with insurers (unauthorized practice of law). May NOT charge contingency or percentage fees (R.S. 22:1703). Must charge flat fee or hourly rate only. Platform must enforce these restrictions through UI controls."
  },
  "homeowner_tools": {
    "status": "DEMO_ONLY",
    "allowed_actions": [
      "educational_content",
      "contractor_directory",
      "document_storage_for_personal_records",
      "general_claims_process_information"
    ],
    "blocked_actions": [
      "claim_filing_on_homeowner_behalf",
      "insurer_communication",
      "legal_advice",
      "policy_interpretation"
    ],
    "notes": "Homeowner-facing tools must provide only general educational information. Cannot advise on specific claims, interpret policies, or facilitate communications with insurers."
  },
  "overall_state_viability": "BLOCKED_PENDING_COUNSEL",
  "licensing_roadmap": [
    {
      "priority": 1,
      "license": "Louisiana_consumer_credit_license",
      "timeline_months": "3-6",
      "cost_estimate": "$650_app_plus_bond_legal",
      "prerequisite_for": ["any_consumer_lending", "escrow_backed_advance"]
    },
    {
      "priority": 2,
      "license": "VCBA_license",
      "timeline_months": "6-12",
      "cost_estimate": "$5000_app_$100k_bond_audit_legal",
      "prerequisite_for": ["token_collateral_lock", "token_liquidation"]
    },
    {
      "priority": 3,
      "license": "Money_transmitter_license",
      "timeline_months": "6-12",
      "cost_estimate": "$2500_app_$25k_bond_legal",
      "prerequisite_for": ["repayment_routing", "escrow_funds_movement"]
    }
  ],
  "civil_law_compliance_flags": [
    "CIVIL_LAW_CONTRACT_INTERPRETATION",
    "NO_BINDING_PRECEDENT",
    "CONTRACTS_HAVE_EFFECT_OF_LAW",
    "MANDATE_OR_DEPOSIT_CHARACTERIZATION_FOR_ESCROW"
  ],
  "special_risk_flags": [
    "AOB_PROHIBITED_TO_SERVICE_PROVIDERS",
    "CONTRACTOR_CANNOT_ADJUST_CLAIMS",
    "PUBLIC_ADJUSTER_CANNOT_NEGOTIATE",
    "REVERSE_BAD_FAITH_FOR_INSUREDS_2024",
    "VCBA_LICENSE_REQUIRED_FOR_TOKEN_STORAGE",
    "ATTORNEY_CONTINGENCY_SUPERIOR_TO_MORTGAGEE",
    "12_PERCENT_CAP_UNLICENSED_LOANS_UNDER_7500",
    "LOUISIANA_CITIZENS_MARKET_PRESENCE",
    "VCBA_NO_SMART_CONTRACT_EXEMPTION",
    "CIVIL_LAW_CONSENT_DEFECTS_FOR_AUTOMATED_EXECUTION"
  ]
}
```

### 10.2 Louisiana Required Disclosures (Platform-Mandatory)

**DISCLOSURE 1: CIVIL LAW NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

NOTICE: Louisiana is a civil law state based on the Napoleonic Code, not English 
common law. Contract interpretation, assignment rules, insurance claim rights, and 
remedies in Louisiana differ significantly from all other U.S. states. The following 
disclosures are specific to Louisiana law and are required by state statute. 
All contracts are interpreted under Louisiana Civil Code principles. Louisiana courts 
are not bound by prior decisions, which creates additional legal uncertainty for 
novel financial products. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 2: AOB PROHIBITION NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

IMPORTANT NOTICE REGARDING ASSIGNMENT OF INSURANCE BENEFITS

Under Louisiana Revised Statute 22:1275 (Act 364 of 2023), assignment of 
post-loss insurance benefits to contractors, restoration companies, lenders, 
or other persons providing repair services is PROHIBITED and is against public 
policy. Any such assignment is null and void. Violation is an unfair and 
deceptive trade practice subject to civil penalties.

SmartContractor does NOT accept assignment of insurance benefits. You remain 
solely responsible for payment of all amounts owed regardless of insurance 
claim outcomes. SmartContractor does not participate in your insurance claim 
and does not communicate with your insurance company. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 3: NO INSURANCE SERVICES / NO ADJUSTING DISCLAIMER**
```
COUNSEL_APPROVED_TEXT_REQUIRED

SMARTCONTRACTOR IS NOT AN INSURANCE COMPANY, PUBLIC ADJUSTER, 
CLAIMS ADJUSTER, OR LAW FIRM.

Under Louisiana Revised Statute 37:2159.1, contractors are prohibited from:
- Interpreting insurance policy provisions
- Adjusting property insurance claims on behalf of insureds
- Sharing in legal fees earned by attorneys
- Requiring you to sign an attorney representation agreement

SmartContractor does not interpret insurance policies, estimate insurance 
claim values, negotiate with insurance companies, adjust claims, or provide 
legal advice. All insurance claim matters should be directed to your insurance 
company or a Louisiana-licensed attorney. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 4: PUBLIC ADJUSTER LIMITATION NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

IMPORTANT: If you hire a public adjuster, Louisiana law restricts the services 
they may provide. Under Louisiana Revised Statute 22:1692, public adjusters may 
investigate, appraise, and evaluate damage and report to YOU, but may NOT 
negotiate claim settlements directly with your insurance company. Negotiation 
with insurers by anyone other than a licensed attorney may constitute the 
unauthorized practice of law.

Public adjusters in Louisiana cannot charge percentage or contingency fees. 
They may only charge reasonable flat fees or hourly rates. (R.S. 22:1703)
You have a three-business-day right to cancel any public adjuster contract. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 5: TOKEN COLLATERAL / VIRTUAL CURRENCY RISK**
```
COUNSEL_APPROVED_TEXT_REQUIRED

VIRTUAL CURRENCY TRANSACTIONS IN LOUISIANA

Under the Louisiana Virtual Currency Business Act (R.S. 6:1381 et seq.), 
entities that store, exchange, or transfer virtual currency on behalf of 
Louisiana residents must be licensed by the Louisiana Office of Financial 
Institutions. This includes stablecoins (such as USDC and USDT).

SmartContractor [IS/IS NOT] licensed by the Louisiana Office of Financial 
Institutions to engage in virtual currency business activity.

[IF NOT LICENSED: SmartContractor does not store, exchange, or transfer 
virtual currency on behalf of Louisiana residents. Token collateral features 
are not available in Louisiana.]

Virtual currency values are highly volatile. You may lose all collateral 
value. Virtual currency is not insured by the FDIC or any government agency. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 6: LENDING LICENSE NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

SMARTCONTRACTOR [IS/IS NOT] licensed as a consumer lender, loan broker, or 
insurance premium finance company under the Louisiana Consumer Credit Law 
(Title 9, Chapter 2, Louisiana Revised Statutes).

Any financing offered is [describe nature and license status]. For consumer 
loans under $7,500, Louisiana law caps interest at 12% per year for unlicensed 
lenders (R.S. 9:3518).

Before entering into any loan agreement, you have the right to ask for and 
receive a complete statement of all fees, charges, and the annual percentage 
rate. You may have a right to cancel certain loan transactions. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 7: ESCROW-BACKED ADVANCE NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

ESCROW-BACKED CONTRACTOR ADVANCE

This transaction uses an escrow arrangement to disburse funds to your 
contractor upon verified completion of work milestones. The escrow agent 
[NAME] is [LICENSED AS/CHARTERED AS] and regulated by [REGULATOR].

The escrow agent acts as a neutral fiduciary and does not represent any 
party to the transaction. Escrow funds are held separate from the escrow 
agent's operating funds and are not used for any purpose other than as 
directed in the escrow agreement.

Your repayment obligation is independent of your insurance claim. You must 
repay all amounts borrowed regardless of whether your insurance claim is 
approved, denied, or underpaid. The escrow agent does not participate in 
your insurance claim and does not hold insurance proceeds. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 8: REVERSE BAD FAITH NOTICE (2024 LAW)**
```
COUNSEL_APPROVED_TEXT_REQUIRED

Under Louisiana Revised Statute 22:1892(J), as amended in 2024, insureds 
and their representatives have a duty of good faith and fair dealing when 
submitting insurance claims. Misrepresenting facts, failing to comply with 
policy duties, or submitting claims lacking evidentiary support may affect 
your rights and expose you to liability.

SmartContractor does not advise you on claim strategy or the merits of your 
claim. All claim-related decisions are yours alone. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 9: CONTRACTOR PROHIBITED ACTS NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

Under Louisiana Revised Statute 37:2159.1, contractors using this platform 
are prohibited from: interpreting insurance policies; adjusting claims; 
providing repair agreements without good faith itemized estimates; sharing 
legal fees with attorneys; requiring attorney representation agreements; 
and accepting referral fees from attorneys.

SmartContractor monitors platform use and will terminate access for any 
contractor found to be using platform features to engage in prohibited acts. [COUNSEL TO FINALIZE]
```

**DISCLOSURE 10: 72-HOUR ROOF CANCELLATION NOTICE**
```
COUNSEL_APPROVED_TEXT_REQUIRED

[FOR ROOF REPAIR/REPLACEMENT CONTRACTS ONLY -- BOLDFACE 10-POINT TYPE]

IMPORTANT: YOU HAVE THE RIGHT TO CANCEL THIS CONTRACT WITHIN SEVENTY-TWO 
(72) HOURS AFTER YOU ARE NOTIFIED THAT YOUR INSURER HAS DENIED ALL OR PART 
OF YOUR CLAIM. THIS CANCELLATION RIGHT IS REQUIRED BY LOUISIANA LAW 
(R.S. 37:2159).

To cancel, notify the contractor in writing within the 72-hour period. 
You are not obligated to pay for any work performed during the cancellation 
period beyond what your insurance company has approved. [COUNSEL TO FINALIZE]
```

---

## APPENDIX A: Key Louisiana Statutes Reference Table

| Statute | Citation | Topic | Status |
|---|---|---|---|
| Louisiana Civil Code | Arts. 1927, 1969, 1983, 2046, 2642, 2653, 2926-2945, 2989-3016 | Contract formation, effect, assignment, mandate, deposit | ACTIVE -- FUNDAMENTAL LAW |
| AOB Prohibition | R.S. 22:1275 (Act 364 of 2023) | Assignment of post-loss benefits void | ACTIVE -- PROHIBITED |
| Public Adjuster Licensing | R.S. 22:1691-1708 | Licensing, conduct, fees, contracts | ACTIVE -- RESTRICTED |
| Public Adjuster Fee Restriction | R.S. 22:1703 | No contingency/percentage fees; flat/hourly only | ACTIVE -- PROHIBITED |
| Bad Faith Claims | R.S. 22:1892 | Payment timing, penalties, insurer duties | ACTIVE -- RESTRUCTURED 2024 |
| Catastrophic Loss | R.S. 22:1892.2 | 60/90-day payment; cure period; 20% attorneys' fees | ACTIVE -- NEW 2024 |
| Reverse Bad Faith | R.S. 22:1892(J) | Insured duty of good faith | ACTIVE -- NEW 2024 |
| ALE Advance | R.S. 22:1338 | 3-month advance for total loss (insurer only) | ACTIVE |
| Proof of Loss | R.S. 22:1312 | Insurer must provide form within 30 days | ACTIVE |
| Civil Authority Coverage | R.S. 22:1273 | Coverage when civil authority prohibits use | ACTIVE |
| Contractor Prohibited Acts | R.S. 37:2159.1 | No claim adjusting, no policy interpretation, no legal fee sharing | ACTIVE -- RESTRICTED |
| Home Improvement Contracts | R.S. 37:2159 | Written contract requirements; 72-hour roof cancellation | ACTIVE |
| Consumer Credit Law | R.S. 9:3514 et seq. | Consumer lending, brokering, premium finance licensing | ACTIVE |
| 12% Unlicensed Loan Cap | R.S. 9:3518 | Maximum rate for unlicensed loans under $7,500 | ACTIVE |
| Loan Broker Licensing | R.S. 9:3572.1 et seq. | Loan broker bond ($25,000), disclosure requirements | ACTIVE |
| Insurance Premium Finance | R.S. 9:3550 | Premium finance company licensing | ACTIVE |
| VCBA | R.S. 6:1381-1394 | Virtual currency licensing; $100K+ bond | ACTIVE -- SINCE 2023 |
| Virtual Currency Custody | R.S. 6:1402 | Financial institution custody services | ACTIVE -- SINCE 2022 |
| Money Transmitter Law | R.S. 6:1031 et seq. | Money transmission licensing | ACTIVE |
| Louisiana Escrow Act | R.S. 9:151 et seq. | General escrow rules under civil law | ACTIVE |
| Attorney Fee Privilege | R.S. 37:218 | Attorney privilege ranks first over all other privileges | ACTIVE |
| Louisiana Citizens Property Insurance Corp. | R.S. 22:2091 et seq. | State-backed insurer of last resort | ACTIVE |

---

## APPENDIX B: Louisiana Civil Law -- Key Differences from Common Law

| Issue | Common Law (49 states) | Louisiana Civil Law |
|---|---|---|
| **Primary Legal Source** | Case law (judicial precedent) | Codes and statutes (Napoleonic Code) |
| **Binding Precedent** | Yes (*stare decisis*) | No (persuasive only; courts interpret code) |
| **Contract Formation** | Offer + acceptance + consideration | Offer + acceptance; "cause" and "object" required |
| **Contract Interpretation** | Objective "reasonable person" standard | Subjective common intent; "contracts have effect of law" (Art. 1983) |
| **Contract Validity** | Consideration required | Lawful cause and lawful object required (Art. 1969) |
| **Anti-Assignment Clauses** | Often unenforceable for post-loss assignments | Enforceable under Art. 2653 unless statute overrides |
| **Insurance Claim Assignment** | Generally allowed post-loss in most states | PROHIBITED by R.S. 22:1275 since 2023 (service providers) |
| **Assignment Rules** | Common law doctrines (equitable assignment, etc.) | Art. 2642 (all rights assignable except personal); Art. 2653 (anti-assignment) |
| **Bad Faith Claims** | Contractual/extra-contractual tort | Codified in R.S. 22:1892; "reverse bad faith" added 2024 |
| **Attorney Fee Privilege** | May yield to mortgagee interest | Superior to mortgagee under R.S. 37:218(A) |
| **Escrow Characterization** | Contractual arrangement | Mandate (mandat) or deposit (depot) under Civil Code |
| **Consent Defects** | Fraud, duress, mistake (common law) | Error, fraud, duress (Arts. 1948-1954) -- potentially broader |
| **Property Law** | Common law estates | Civil law "immovable property" and "movable property" categories |
| **Obligations** | Contract and tort | "Obligations" arise from contract, tort, quasi-contract, quasi-tort (Arts. 1756-1759) |
| **Remedies** | Damages, specific performance (equity) | Specific performance, dissolution, damages (civil code remedies) |

---

## APPENDIX C: Louisiana Regulatory Contact Directory

| Agency | Address | Phone | Website |
|---|---|---|---|
| Louisiana Department of Insurance (LDI) | P.O. Box 94214, Baton Rouge, LA 70804 | (225) 342-5900 | https://www.ldi.la.gov |
| Louisiana Office of Financial Institutions (OFI) | P.O. Box 94095, Baton Rouge, LA 70804 | (225) 925-4660 | https://ofi.la.gov |
| Louisiana State Licensing Board for Contractors | 2525 Quail Drive, Baton Rouge, LA 70808 | (225) 765-2301 | https://lslbc.louisiana.gov |
| Louisiana Department of Justice / Attorney General | P.O. Box 94005, Baton Rouge, LA 70804 | (225) 326-6705 | https://www.ag.louisiana.gov |
| Louisiana Citizens Property Insurance Corporation | P.O. Box 53800, Baton Rouge, LA 70892 | (877) 272-3424 | https://www.lacitizens.com |
| NMLS (for license applications) | -- | (855) 616-4955 | https://www.nmlsconsumeraccess.org |

---

## APPENDIX D: SmartContractor Louisiana Implementation Checklist

### Pre-Market Requirements (ALL Must Be Completed)

- [ ] Retain Louisiana-licensed civil law attorney with financial services expertise
- [ ] Retain Louisiana insurance regulatory counsel
- [ ] Submit OFI Consumer Credit Law license application (if any consumer lending)
- [ ] Submit OFI VCBA license application through NMLS (if any token collateral)
- [ ] Submit OFI Money Transmitter license application through NMLS (if any funds movement)
- [ ] Draft Louisiana-specific escrow agreement under civil law principles (if escrow model)
- [ ] Obtain $25,000 surety bond for loan broker activities (if applicable)
- [ ] Obtain $100,000+ surety bond for VCBA activities (if applicable)
- [ ] Obtain $25,000+ surety bond for money transmitter activities (if applicable)
- [ ] Prepare audited financial statements (required for VCBA and MT)
- [ ] Draft all 10 Louisiana-required disclosures; obtain counsel approval
- [ ] Submit escrow structure to OFI for informal guidance or no-action letter
- [ ] Confirm LDI notification of platform operations (if any insurance-adjacent features)
- [ ] Verify Louisiana Citizens Property Insurance Corporation compliance procedures
- [ ] Implement LSLBC license verification API for contractor onboarding
- [ ] Implement LDI license verification for public adjuster onboarding
- [ ] Block AOB-enabling features for Louisiana IP addresses
- [ ] Block token collateral features for Louisiana IP addresses (until VCBA licensed)
- [ ] Implement 72-hour roof cancellation notice in contract generation
- [ ] Implement 3-business-day public adjuster cancellation tracking
- [ ] Conduct compliance training for all Louisiana-facing staff
- [ ] Establish Louisiana-specific complaint handling procedures
- [ ] Register with Louisiana Secretary of State (foreign entity qualification)
- [ ] Obtain Louisiana tax registrations (sales tax, income tax withholding)

### Ongoing Compliance Requirements

- [ ] Annual OFI consumer credit license renewal ($500)
- [ ] Annual VCBA license renewal (NMLS; bond maintenance)
- [ ] Annual money transmitter license renewal (NMLS; bond maintenance)
- [ ] Quarterly NMLS reports for VCBA and MT licensees
- [ ] Annual audited financials submission to OFI
- [ ] Biennial CE tracking for any licensed public adjusters on platform
- [ ] Annual LSLBC license re-verification for all contractors
- [ ] Annual insurance certificate re-verification for all contractors
- [ ] Quarterly AOB compliance audits of platform activity
- [ ] Annual review of Louisiana statute amendments (Legislature meets annually)
- [ ] Maintain 5-year records for all consumer transactions
- [ ] Maintain 5-year records for all public adjuster platform activity

---

*This Louisiana SmartContractor Compliance Guide was prepared for informational purposes only and does not constitute legal advice. Louisiana's civil law system creates unique legal uncertainties for novel fintech and insurtech products. ALL SmartContractor products, services, contracts, and disclosures MUST be reviewed and approved by Louisiana-licensed civil law counsel before any market entry or customer engagement in Louisiana. All features marked BLOCKED or DEMO_ONLY remain unavailable for live transactions pending legal review and licensing. Last updated: 2025-07-22.*
