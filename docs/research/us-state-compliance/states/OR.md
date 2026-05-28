# Oregon (OR) — SmartContractor Compliance Report

**Classification:** 🔴 HIGH RISK

**Research Date:** 2025-06-11 | **Version:** 1.0

---

## Section 1: State Overview & Risk Classification

Oregon is classified as a **HIGH RISK** state for SmartContractor operations due to overlapping regulatory layers, strong consumer-protection enforcement, and judicial hostility toward key product mechanisms.

### Key Determinants

| Factor | Risk Impact |
|--------|-------------|
| **Consumer Finance Act (ORS Ch. 725)** — License required for consumer loans ≤$50K; unlicensed loans are **void** | 🔴 Blocks consumer lending products |
| **36% APR cap** on consumer loans; 9% general usury cap (ORS 82.010) | 🔴 Caps all consumer credit pricing |
| **AOB non-enforcement** — Oregon courts refuse to enforce assignments of benefits | 🔴 Blocks claim-proceeds repayment routing |
| **HB 3242 (2024)** — Private right of action with **treble damages** for unfair claims practices | 🔴 Massive litigation exposure for claims involvement |
| **Money Transmitter Act (ORS Ch. 717)** — Interpreted to include virtual currencies | 🔴 Token lock/liquidation may require MT license |
| **Public adjuster license** — New separate license class (Aug 2025) | 🔴 Contractor claim negotiation is unauthorized practice |
| **CCB down-payment caps** — 1/3 of contract or $1,000 max | 🟡 Contractor financing must respect hard cap |

### Bottom Line

All SmartContractor live operations — including token-collateral lending, claim-advance products, and AOB-based repayment routing — are **BLOCKED** pending Oregon-specific legal counsel review. Only **DEMO-ONLY** mockup presentations are permitted.

---

## Section 2: Regulatory Bodies & Key Agencies

| Agency | Role | Contact |
|--------|------|---------|
| **Oregon Division of Financial Regulation (DFR)** | Primary regulator for consumer finance, escrow, money transmission, insurance, public adjusters | dfr.oregon.gov / 503-947-7300 |
| **Oregon Construction Contractors Board (CCB)** | Licenses contractors; enforces bonding, insurance, and consumer protection rules | oregon.gov/ccb / 503-934-2247 |
| **Oregon Insurance Division (within DFR)** | Regulates insurers, claims practices, adjuster licensing | dfr.oregon.gov/business/licensing/insurance |
| **NMLS** | Processes consumer finance license applications | nmlsconsumeraccess.org / 1-855-665-7123 |
| **NIPR** | Processes public adjuster license applications | nipr.com |

### DFR Licensing Portal

The Oregon DFR (https://dfr.oregon.gov) serves as the central regulatory gateway for:

- Consumer finance company licensing (ORS Ch. 725)
- Money transmitter licensing (ORS Ch. 717)
- Escrow agent registration and oversight
- Public adjuster and independent adjuster licensing
- Insurance company market conduct examinations
- Consumer complaint intake and enforcement

### Escrow Regulation

The **Oregon Division of Financial Regulation** regulates escrow activities. Escrow agents must be licensed, bonded, and meet net worth requirements. Any SmartContractor product involving escrow of insurance proceeds, repair funds, or claim payments must evaluate escrow licensing requirements under DFR-administered statutes.

---

## Section 3: Lending & Finance Licensing

### 3.1 Consumer Finance License (ORS Chapter 725)

**License Required:**

A consumer finance license is required for any person making loans of **$50,000 or less** with **periodic payments** and terms **longer than 60 days** (ORS 725.045). Applies to loans for personal, household, or educational use.

- An "income share agreement" or any obligation to repay a debt meets the definition of "loan" under Oregon law (DFR Bulletin 2025-02).
- Licensing requirements extend to **agents, brokers, facilitators, and servicers** of the company making or purchasing loans (ORS 725.010).

**Exemptions:**

- **Business/commercial purpose loans are exempt** from consumer finance licensing.
- Retail installment or purchase money contracts where the retailer is the originator are exempt.

**Key Requirements:**

| Requirement | Detail |
|-------------|--------|
| Max APR | **36%** per annum (interest + fees) |
| Application | Submitted through **NMLS** |
| License fee | $600 initial / annual renewal |
| Expiration | December 31 each year |
| Annual report | Due March 31 |
| Manager qualification | 3 of 5 years traditional lending experience (OAR 441-730-0025) |
| Underwriting | Required based on borrower's financial condition |

**Penalty for Unlicensed Lending:**

Loans made without a required license are **void**. Neither the lender nor any successor, assignee, or affiliate may collect principal, interest, fees, or charges (ORS 725.045). This is an absolute prohibition with no cure provision.

### 3.2 Commercial / Business-Purpose Loans

Oregon **does not require** a consumer finance license for bona fide business-purpose loans. However, if a loan to a contractor or restoration company is **re-characterized** as a consumer loan — e.g., if repayment ultimately comes from a homeowner's insurance claim — the exemption may not apply. **COUNSEL_REVIEW_REQUIRED** for any lending product directed to contractors where the economic substance may benefit a homeowner consumer.

### 3.3 Collection Agency Registration

Required for third-party debt collection in Oregon. Registration through NMLS; bond required ($10K–$15K).

### 3.4 Money Transmitter Act (ORS Chapter 717)

Oregon's Money Transmitter Act defines "money" as "a medium of exchange that...represents value that substitutes for currency" (ORS 717.200). The State has publicly stated this definition **includes virtual currencies**, including Bitcoin.

A **money transmitter license** is required for:
- Selling or issuing payment instruments
- Receiving money for transmission
- Transmitting money (including digital currency within the U.S. or abroad)

**Key Statutes:**
- ORS 717.200 — Definitions ("money," "payment instrument," "money transmission")
- ORS 717.205 — License required; no person may conduct money transmission without a license

### 3.5 Payday / Title Lending

Separate registration required; heavily regulated under Oregon law. Not applicable to SmartContractor products.

---

## Section 4: Consumer Protection Framework — APR Caps, Usury & Treble Damages

> **NEW SECTION** — This consolidated consumer-protection section captures Oregon's overlapping rate restrictions, the groundbreaking HB 3242 private right of action, and the enforcement landscape that makes Oregon one of the highest-risk jurisdictions for financial and claims products.

### 4.1 APR Cap — 36% Maximum (Consumer Loans)

Under ORS Chapter 725, the maximum annual percentage rate on any consumer finance loan is **36% per annum**, inclusive of all interest, fees, and charges. This is a hard statutory ceiling:

| Component | Treatment |
|-----------|-----------|
| Stated interest | Included in 36% cap |
| Origination fees | Included in 36% cap |
| Service charges | Included in 36% cap |
| Prepayment penalties | Included in 36% cap |
| Any other compensation to lender | Included in 36% cap |

**SmartContractor Implication:** Any consumer loan product — including claim advances, deferred payment plans, or token-collateralized loans to consumers — must compute all-in APR and ensure it does not exceed 36%. Loans exceeding this rate are usurious and potentially void.

### 4.2 General Usury Cap — 9% (ORS 82.010)

Oregon's general usury statute (ORS 82.010) establishes a **9% per annum** interest rate cap on loans that fall **outside** the licensed-consumer-finance framework. This applies to:

- Unlicensed lenders making loans to Oregon consumers
- Oral or informal loan agreements
- Certain commercial transactions where no exempt licensing category applies

The 9% usury cap functions as a backstop: if a loan is not squarely within the ORS 725 licensed framework (or another exemption), the default maximum rate is 9%. Exceeding 9% in an unlicensed context may result in forfeiture of excess interest, attorney fees, and potential criminal penalties.

**SmartContractor Implication:** The 9% general usury cap is a critical trap for unlicensed lending. If a product is structured as a "business loan" but is re-characterized as a consumer loan, not only is the loan potentially void under ORS 725.045, but the interest rate may also violate the 9% usury cap under ORS 82.010.

### 4.3 Escrow Regulation & Consumer Safeguards

The Oregon DFR regulates escrow agents and imposes the following on licensed escrow activities:

- **Licensing and bonding** — Escrow agents must be licensed and maintain a surety bond
- **Net worth requirements** — Minimum net worth standards apply
- **Fiduciary duties** — Escrow agents owe fiduciary duties to all parties
- **Segregated accounts** — Client funds must be maintained in segregated trust accounts
- **Record retention** — Detailed records must be maintained for examination

Any SmartContractor product that holds, disburses, or routes insurance claim proceeds through an escrow mechanism must evaluate whether escrow licensing is triggered. The DFR has broad examination and enforcement authority over escrow activities.

### 4.4 HB 3242 (2024) — Private Right of Action with Treble Damages

**Effective January 1, 2024**, HB 3242 amended ORS 746.230 to create a **private right of action** for unfair claim settlement practices. This is the single most impactful recent development for any entity involved in insurance claims.

| Element | Detail |
|---------|--------|
| **Cause of action** | Any insured may sue for violations of ORS 746.230 (unfair claims practices) |
| **Remedies** | Actual damages, **treble damages**, attorney fees, and litigation costs |
| **Notice requirement** | 45-day pre-suit notice with opportunity to cure |
| **Statute of limitations** | Two years from date of violation |
| **Who can be sued** | Insurers **and any entity facilitating claims** — scope is broad and untested |

**Unfair practices covered (ORS 746.230):**
- Misrepresenting pertinent facts or insurance policy provisions
- Failing to acknowledge and act promptly upon communications
- Failing to adopt and implement reasonable standards for prompt investigation
- Refusing to pay claims without a reasonable investigation
- Failing to attempt in good faith to promptly and equitably settle claims where liability is clear
- Compelling insureds to litigate to recover amounts due

**SmartContractor Implication — CRITICAL:**

HB 3242 creates **massive litigation exposure** for any entity involved in the claims process. If SmartContractor or its contractor partners:
- Delay claim processing or documentation
- Misrepresent coverage or claim values to homeowners
- Interfere with settlement negotiations
- Route claim proceeds in ways that reduce homeowner recovery

...the homeowner may sue for **treble damages plus attorney fees**. Oregon's extended repair timelines (12–36 months under ORS 742.270) compound this exposure by creating long-tail claim periods during which violations can occur.

**All claim-adjacent products are BLOCKED pending counsel review of HB 3242 exposure.**

### 4.5 Homeowner Bill of Rights & CCB Consumer Protections

Oregon's consumer protection framework includes:

- **Homeowner Bill of Rights** (DFR publication) — Informs consumers of insurance rights, repair timelines, and dispute resolution options
- **CCB complaint resolution** — Homeowners may file complaints against licensed contractors; CCB has enforcement authority
- **Right to cancel** — Homeowners have a statutory right to cancel residential construction contracts within a specified period
- **Written contract requirement** — Mandatory for all residential work exceeding $2,000; must include specific consumer rights notices

---

## Section 5: Contractor Licensing (CCB)

### 5.1 Oregon Construction Contractors Board (CCB)

All contractors performing construction work in Oregon must be licensed with the CCB (ORS Chapter 701).

| Endorsement | Scope |
|-------------|-------|
| **Residential General Contractor (RGC)** | Broad residential construction |
| **Residential Restoration Contractor (RRC)** | Restoration-specific work |
| **Commercial General Contractor (CGC1/CGC2)** | Commercial construction by project size |

### 5.2 Licensing Requirements

| Requirement | Detail |
|-------------|--------|
| Pre-license training | **16 hours** + passing Oregon exam |
| Responsible Managing Individual (RMI) | Must be owner or employee |
| Surety bond | $15,000 (residential specialty) to **$80,000** (commercial general) |
| General liability insurance | Required; amounts vary by endorsement |
| Workers' compensation | Required if employees |
| License fee | $400 for two-year license |

### 5.3 Residential Consumer Protections (ORS 701)

**Down Payment Limit:**

Residential contractors may collect no more than **one-third of the contract price or $1,000, whichever is less**, as a down payment before starting work. This is a **strict, non-waivable** consumer protection requirement.

**Written Contract Requirements (for work >$2,000):**

- Contractor name, address, CCB number
- Customer name and address
- Work description
- Price and payment terms
- Property owner rights disclosure
- Mediation/arbitration provisions

Failure to provide a written contract and required notices may **invalidate lien rights** under ORS 87.037.

### 5.4 Contractor Financing Implications

- Equipment financing or working capital loans to contractors are generally **commercial transactions**
- If a loan is secured by or repaid from **residential project proceeds**, consumer finance rules may be implicated
- Any SmartContractor product must verify the borrower's **active CCB license** before extending credit
- **DEMO_ONLY** for contractor financing until counsel reviews the business/commercial purpose exemption

---

## Section 6: Token Collateral & Digital Asset Compliance

### 6.1 Money Transmitter Analysis (ORS Chapter 717)

Oregon's Money Transmitter Act has been **interpreted to include virtual currencies**. Key findings:

| Activity | MT License Required? |
|----------|---------------------|
| Receiving digital currency for transmission | **Yes** |
| Transmitting digital currency within the U.S. | **Yes** |
| Token lock / collateral hold (custody) | **Uncertain — COUNSEL REVIEW REQUIRED** |
| Automated liquidation of collateral | **Uncertain — COUNSEL REVIEW REQUIRED** |
| Smart contract self-execution (non-custodial) | **Potentially exempt — COUNSEL REVIEW REQUIRED** |

### 6.2 Cryptocurrency-Specific Legislation

**HB 2488 (2019):**
- Prohibits Oregon state government from accepting cryptocurrency payments
- Prohibits cryptocurrency campaign contributions
- **Does not regulate private-party cryptocurrency transactions**

**HB 2487 / HB 2179 (2019):**
- Established blockchain study task forces for state agency use
- Did not create regulatory frameworks for private digital asset activity

### 6.3 Digital Asset Collateral Lending — CRITICAL Gaps

Oregon has **no specific statutory framework** for:
- Cryptocurrency lending
- Digital asset collateral
- Token lock mechanisms
- Automated liquidation of crypto collateral
- Smart contract enforceability in lending contexts

The application of ORS 725 (Consumer Finance Act) to crypto-collateralized loans depends on four factors:

1. Is the loan **$50,000 or less**?
2. Does the term **exceed 60 days**?
3. Does the loan have **periodic payments**?
4. Is the loan for **personal, household, or educational use**?

If all four criteria are met, a **consumer finance license is required** — even if the loan is collateralized by digital assets.

**TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW**

All token collateral operations are **BLOCKED** pending:
1. Determination of whether crypto-collateralized loans trigger ORS 725 licensing
2. Determination of whether token lock/liquidation mechanisms constitute money transmission under ORS 717
3. Analysis of UCC Article 9 applicability to digital asset security interests
4. Oregon-specific counsel opinion on smart contract enforceability

---

## Section 7: Insurance Claims, ALE & Emergency Rights

### 7.1 Repair / Rebuild Timelines (ORS 742.270)

| Scenario | Timeline |
|----------|----------|
| Standard repairs | **12 months** minimum |
| Declared emergency / fire order | **24 months** minimum |
| Declared emergency + unavoidable delays (permits, materials, contractor availability) | **Up to 36 months** |

### 7.2 Additional Living Expenses (ALE)

In declared emergencies:
- Insurers must provide ALE for **24 months** minimum
- Extendable to **36 months** with unavoidable delays
- Subject to policy limits
- Covers: temporary housing, extra food costs, laundry, storage, pet boarding
- **Does NOT cover:** mortgage payments or luxury expenses

### 7.3 Personal Property / Contents

**Model Attestation (ORS 742.053, effective Jan 1, 2024):**

For total losses in declared disasters, homeowners may submit a Model Attestation for Personal Property Loss Coverage Payment, entitling the insured to **70% of personal property coverage** without itemizing every loss.

### 7.4 Claim Payments & Loss Draft Checks

No Oregon-specific loss draft statute exists. Standard industry practice applies:
- Mortgagee named on policy receives loss draft checks as a payee
- Mortgage servicers disburse proceeds based on loan delinquency status and repair progress
- Fannie Mae/Freddie Mac guidelines typically followed

### 7.5 Unfair Claims Practices (ORS 746.230 + HB 3242)

As detailed in **Section 4.4**, HB 3242 (2024) creates a private right of action for unfair claim settlement practices with **treble damages, attorney fees, and litigation costs**. This dramatically raises the stakes for any entity participating in the claims ecosystem.

### 7.6 Emergency Advance Payments

Oregon does not have a specific statute requiring insurers to provide emergency advance payments. However, under ORS 746.230(f), insurers must attempt in good faith to promptly and equitably settle claims where liability is reasonably clear — which may support advance payment obligations. The DFR may advocate for advance payments through complaint resolution.

---

## Section 8: Assignment of Benefits (AOB)

### 8.1 AOB Status: NOT ENFORCED / RESTRICTED

**Critical Finding:** Oregon **generally refuses to enforce assignments of benefits** on insurance policies. According to legal and industry sources (Restoration Industry Association and legal commentators), Oregon courts do not enforce traditional AOB agreements that purport to transfer insurance claim rights to contractors.

However, Oregon **may allow the assignment of a legal claim** — meaning if an insurance company breaches the insurance contract by underpaying a claim or commits bad faith, the contractor may be able to take ownership of that legal claim and sue the insurance company directly.

### 8.2 No Comprehensive AOB Statute

Oregon has **no specific AOB statute** comparable to Florida's FS 627.7152 or similar comprehensive AOB legislation. The DFR issued a **consumer warning in July 2024** cautioning homeowners about AOB risks but did not enact new regulations.

### 8.3 AOB Practical Implications

| Aspect | Oregon Status |
|--------|---------------|
| AOB enforceability for policy benefits | **Generally NOT enforced** |
| Assignment of legal claim (breach/bad faith) | **May be permitted** |
| Statutory cancellation window | None specified |
| Required font / notice | None specified |
| Contractor limitations | Cannot act as public adjuster without license |
| Attorney fee recovery for assignee | Unclear |

### 8.4 Direction to Pay (DTP)

A Direction to Pay may be used as an alternative to AOB, but carriers are **not legally required** to honor it. DTP is significantly less powerful than an AOB in states where AOBs are statutorily enforced.

### 8.5 AOB Risk Assessment

- **HIGH RISK** for SmartContractor AOB-based products in Oregon
- Attempting to use AOBs for claim proceeds routing or repayment may not be legally enforceable
- Any product relying on AOB mechanisms requires **extensive counsel review**
- **All AOB-based repayment routing is BLOCKED**

---

## Section 9: Public Adjuster Licensing & Claim Representation

### 9.1 New Separate Public Adjuster License (Effective August 18, 2025)

Oregon established a **separate public adjuster license class**, distinct from the independent adjuster license (DFR memo, Aug 5, 2025).

**Key Requirements:**

| Requirement | Detail |
|-------------|--------|
| Application portal | **NIPR** |
| Nonresident eligibility | Must hold equivalent license in domicile state |
| **Dual license prohibition** | **Licensees cannot simultaneously hold independent AND public adjuster licenses** |
| Entity licensing | Business entities acting as public adjusters must obtain a separate entity license |

### 9.2 Who May Negotiate with Insurance Companies

| Role | Authority |
|------|-----------|
| **Licensed Public Adjusters** | May negotiate claims on behalf of insureds; compensated by insured (typically % of recovery) |
| **Licensed Insurance Producers** | Do NOT need adjuster license to adjust losses (ORS 744.515(2)(a)) |
| **Contractors** | May provide repair estimates and discuss claim amounts; **must NOT** engage in "adjusting" without license |
| **Unlicensed persons** | Limited one-adjustment exemption if license applied for within 2 days (ORS 744.515(2)(b)) |

### 9.3 GCSC / Contractor Boundary — STRICT

- **SmartContractor and its contractor partners must NOT act as public adjusters** in Oregon
- Any assistance with claim documentation, negotiation support, or claim filing must be **carefully structured** to avoid the unauthorized practice of public adjusting
- **COUNSEL_APPROVED_TEXT_REQUIRED** for any claim assistance materials
- Contractors **must NOT** hold themselves out as insurance representatives or claim negotiators

---

## Section 10: SmartContractor Compliance Dashboard

### 10.1 Product Status Matrix

| Product | Status | Blocked Actions |
|---------|--------|-----------------|
| **Token-collateral equipment credit** | 🔴 **BLOCKED** | Live loan creation, token collateral lock, liquidation, repayment routing |
| **ClaimBridge (claim advance)** | 🔴 **BLOCKED** | Insurance claim advance, assignment of benefits, claim financing, repayment from claim proceeds |
| **Contractor flow** | 🟡 **DEMO_ONLY** | Live binding transactions; mockup presentations only |
| **Homeowner flow** | 🔴 **BLOCKED** | All live operations |
| **Restoration company flow** | 🟡 **DEMO_ONLY** | Live binding transactions; mockup presentations only |

### 10.2 Required Reviews (All Products)

- [ ] Oregon-licensed **legal counsel** review
- [ ] **Provider** compliance review
- [ ] **Security** audit of smart contracts
- [ ] **Escrow licensing** analysis (if funds held/disbursement routed)
- [ ] **Money transmitter** analysis (if token lock/liquidation involved)

### 10.3 Required Disclosures

```
DISCLOSURE 1 — REGULATORY STATUS
[COUNSEL_APPROVED_TEXT_REQUIRED]

[GCSC Entity Name] is not licensed as a consumer finance company,
money transmitter, escrow agent, insurance company, public adjuster,
or contractor in the State of Oregon. This product demonstration is
for informational purposes only and does not create a binding
financial obligation. This product has not been approved by the
Oregon Division of Financial Regulation, the Oregon Insurance
Division, or the Oregon Construction Contractors Board.
```

```
DISCLOSURE 2 — APR & USURY LIMITATIONS
[COUNSEL_APPROVED_TEXT_REQUIRED]

Oregon law caps the annual percentage rate on consumer loans at 36%
(ORS Chapter 725) and establishes a general usury cap of 9% for
unlicensed loans (ORS 82.010). Any loan product offered in Oregon
must comply with these rate restrictions. Loans made without a
required consumer finance license are void under Oregon law.
```

```
DISCLOSURE 3 — ASSIGNMENT OF BENEFITS
[COUNSEL_APPROVED_TEXT_REQUIRED]

The State of Oregon generally does not enforce assignment of benefits
agreements that transfer insurance policy rights to third parties. Any
agreement purporting to assign insurance claim benefits may not be
enforceable in Oregon courts. You are not required to sign an assignment
of benefits to have repairs completed. You may file a claim directly with
your insurance company. [GCSC Entity Name] does not act as a public
adjuster and does not negotiate insurance claims on your behalf.
```

```
DISCLOSURE 4 — PUBLIC ADJUSTER LIMITATION
[COUNSEL_APPROVED_TEXT_REQUIRED]

[GCSC Entity Name] and its contractor partners are not licensed public
adjusters in the State of Oregon. We cannot and do not negotiate with
your insurance company on your behalf regarding the amount of your
claim or the scope of covered repairs. Only a licensed public adjuster
or your licensed insurance agent may represent you in claim negotiations.
```

```
DISCLOSURE 5 — CONTRACTOR DOWN PAYMENT LIMITS
[COUNSEL_APPROVED_TEXT_REQUIRED]

Under Oregon law (ORS 701), a residential contractor may not collect
more than one-third of the total contract price or $1,000, whichever
is less, as a down payment before work begins. Any request for a larger
down payment may violate Oregon law. Verify your contractor's license
at the Oregon Construction Contractors Board website (www.oregon.gov/ccb).
```

```
DISCLOSURE 6 — TREBLE DAMAGES WARNING (HB 3242)
[COUNSEL_APPROVED_TEXT_REQUIRED]

Under Oregon law (ORS 746.230, as amended by HB 3242, 2024), any
person damaged by unfair claim settlement practices may bring a private
lawsuit for actual damages, treble (triple) damages, attorney fees,
and litigation costs. [GCSC Entity Name] does not adjust, negotiate,
or settle insurance claims. Any dispute regarding your claim should be
directed to your insurance company or a licensed public adjuster.
```

```
DISCLOSURE 7 — HOMEOWNER RIGHTS / ALE
[COUNSEL_APPROVED_TEXT_REQUIRED]

If your home is damaged in a declared emergency, Oregon law (ORS 742.270)
requires your insurer to provide at least 24 months of additional living
expense (ALE) coverage and up to 24 months (extendable to 36 months) to
complete repairs. You have the right to control repair decisions and to
direct where claim proceeds are applied. Signing an assignment of benefits
may cause you to lose these rights.
```

### 10.4 Smart Contract Enforcement Status

| Function | Status | Notes |
|----------|--------|-------|
| Block live loan creation | **true** | ORS 725 licensing; unlicensed loans are void |
| Block token collateral lock | **true** | Money transmission analysis required |
| Block liquidation | **true** | Unknown legal status of automated crypto liquidation |
| Block assignment of claim proceeds | **true** | Oregon does not enforce AOB agreements |
| Block repayment routing from insurance | **true** | AOB unenforceability blocks direct repayment |
| Allow demo-only records | **true** | Mockup mode only; no binding transactions |
| Allow hash/reference audit records | **true** | Non-binding audit trail permitted for review |

### 10.5 Final Risk Scores

| Risk Category | Score | Key Driver |
|---------------|-------|------------|
| Lending Risk | **HIGH** | ORS 725 voids unlicensed loans; 36% APR cap; 9% usury backstop; re-characterization risk |
| Insurance Claim Risk | **HIGH** | HB 3242 treble damages + attorney fees; no claim advance statute; 12–36 month repair timelines |
| AOB Risk | **HIGH** | Oregon courts refuse to enforce AOBs; no comprehensive AOB statute; DFR consumer warning |
| Public Adjuster Risk | **HIGH** | New separate license (Aug 2025); dual-license prohibition; unauthorized practice exposure |
| Token Collateral Risk | **HIGH** | No crypto-collateral statute; MT law may apply; UCC Article 9 digital asset perfection untested |
| Consumer Protection Risk | **HIGH** | CCB down-payment caps; APR/usury limits; HB 3242; extended ALE/repair timelines; DFR enforcement |

### 10.6 Key Statutes & Rules Reference

| Citation | Description |
|----------|-------------|
| ORS Chapter 725 | Consumer Finance Act — licensing, APR limits, prohibited practices |
| ORS 725.045 | Unlicensed consumer loans are **void** |
| ORS 725.010 | Definitions; includes agents, brokers, facilitators |
| ORS 82.010 | General usury cap — **9%** maximum for unlicensed loans |
| OAR Chapter 441, Division 730 | Consumer Finance administrative rules |
| ORS Chapter 701 | CCB licensing, bonding, consumer protection |
| ORS 701.305 | Written contract requirements for residential contractors |
| ORS 742.270 | Repair/rebuild timelines (12–36 months), ALE requirements |
| ORS 742.053 | Model Attestation for Personal Property Loss (Jan 1, 2024) |
| ORS 746.230 | Unfair Claim Settlement Practices; **private right of action with treble damages** (HB 3242, 2024) |
| ORS 744.505 | Adjuster license required |
| ORS 744.515 | Exemptions from adjuster licensing |
| ORS 744.521 | Public adjuster licensing (separate class, effective Aug 2025) |
| ORS 717.200–717.320 | Money Transmitter Act — includes virtual currencies |
| HB 2488 (2019) | Prohibits state government from accepting cryptocurrency |
| HB 3242 (2024) | Private right of action for unfair claims settlement practices |

---

*This report is for research and informational purposes only. It does not constitute legal advice. All SmartContractor products must be reviewed by Oregon-licensed legal counsel before any market entry. Oregon is classified as HIGH RISK — live operations are prohibited pending counsel clearance.*
