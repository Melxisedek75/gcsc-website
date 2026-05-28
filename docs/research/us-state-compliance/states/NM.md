# New Mexico (NM) — SmartContractor Compliance File

*Prepared for GCSC / SmartContractor legal research. Last updated: June 2025.*

---

## 1. Executive Summary & Risk Rating

| Field | Detail |
|-------|--------|
| **State** | New Mexico |
| **Primary Regulators** | NM Regulation and Licensing Department (RLD) — Financial Institutions Division (FID); Construction Industries Division (CID); Office of Superintendent of Insurance (OSI) |
| **Overall Risk Rating** | **MEDIUM-HIGH** |

New Mexico maintains a moderately complex regulatory environment for contractor-financing and insurance-claims products. The state imposes a strict **36% all-in APR cap** on consumer loans of $10,000 or less (HB 132, effective January 1, 2023), requires **CID contractor licensing** for construction work valued above $500, and enforces a broad **Uniform Money Services Act** that captures virtual-currency exchange. Assignment of Benefits (AOB) is generally permitted under common-law contract principles post-loss, though no dedicated AOB statute exists. Public adjusters must be licensed and are expressly forbidden from acting as contractors on the same claim. The regulatory status of token-collateral lending and escrow is **UNKNOWN_REQUIRES_COUNSEL_REVIEW**.

**Key Blocking Factors:**
- Lending to NM consumers ≤$10,000 requires a Small Loan Act license (36% APR cap).
- Token-collateral / smart-contract liquidation may trigger money-transmitter licensing under FID's broad "monetary value" interpretation.
- Insurance-claim advances ≤$10,000 are likely characterized as loans subject to the Small Loan Act.
- Repayment routing from insurance proceeds is **BLOCKED** pending legal review (mortgagee priority; lender licensing overlap).

---

## 2. Regulatory Sources & Authorities

| Agency | Acronym | Jurisdiction | URL |
|--------|---------|--------------|-----|
| Office of Superintendent of Insurance | **OSI** | Insurance regulation, adjuster licensing, market conduct | https://www.osi.state.nm.us |
| Regulation and Licensing Department — Financial Institutions Division | **FID / RLD** | Money transmitters, small-loan licensing, consumer finance | https://www.rld.nm.gov/financial-institutions/ |
| Regulation and Licensing Department — Construction Industries Division | **CID** | Contractor licensing, bonds, trade standards | https://www.rld.nm.gov/construction-industries/ |
| New Mexico Regulation and Licensing Department (Escrow) | **RLD** | Escrow company regulation (discretionary authority) | https://www.rld.nm.gov/ |

**Key Statutes Consulted**

| Statute | Citation | Subject |
|---------|----------|---------|
| Small Loan Act of 1955 | NMSA 1978 §§ 58-15-1 et seq. | Consumer lending licensing, $10K cap, rate regulation |
| Bank Installment Loan Exemption Act | NMSA 1978 Ch. 58, Art. 7 | Related lending regulation, bank exemptions |
| HB 132 (2022) | Effective 1/1/2023 | 36% all-in APR cap, anti-evasion provisions |
| Uniform Money Services Act | NMSA 1978 §§ 58-32-101 et seq. | Money transmission, stored value, virtual currency |
| Construction Industries Licensing Act | NMSA 1978 §§ 60-13-1 et seq. | Contractor licensing (CID), classifications, bonds |
| Insurance Code — Adjusters | NMSA 1978 §§ 59A-13-1 et seq. | Public adjuster licensing, bonds, conduct |
| Public Adjuster Contracts | NMSA 1978 § 59A-13-15 | Contract requirements, disclosure, rescission, dual-role ban |
| Unfair Claims Practices | NMSA 1978 § 59A-16-20 | Claims handling standards, 90-day catastrophic settlement |
| Unfair Practices Act (UDAP) | NMSA 1978 §§ 57-12-1 et seq. | Consumer protection, treble damages, attorney fees |
| General Usury | NMSA 1978 § 56-8-3 | Default 15% interest-rate cap (non-licensed lenders) |

---

## 3. Lending & Finance Licensing

### 3.1 Small Loan Act of 1955 (NMSA 1978 §§ 58-15-1 et seq.)

- **License Required**: Any person engaged in the business of lending **$10,000 or less** to NM borrowers must obtain a license from the FID Director (§ 58-15-3(A)).
- **Exemptions** (§ 58-15-3(C)):
  - Banking corporations, savings-and-loan associations, and credit unions operating under federal or state law;
  - Bona fide pawnbrokers under a pawnbroker license;
  - Bona fide commercial loans to dealers upon personal property held for resale;
  - Persons making advances under a written agreement providing for a total loan/line of credit exceeding $10,000.
- **Loan Products Covered**:
  - **Installment loans**: $10,000 or less, minimum 4 substantially equal payments, initial maturity of at least 120 days (§ 58-15-2(F)).
  - Refund-anticipation loans.
  - Small-dollar business/commercial loans: $10,000 or less for working capital, operations, expansion, or start-up.

### 3.2 Bank Installment Loan Exemption Act (NMSA 1978 Ch. 58, Art. 7)

- Loans of **$5,000 or less** must be made only under the Small Loan Act or the Bank Installment Loan Act (§ 58-15-3).
- Small-loan licensees may make loans under this act in accordance with § 58-7-2 NMSA 1978.

### 3.3 HB 132 — 36% APR Rate Cap (Effective January 1, 2023)

- Maximum APR on loans under both the Small Loan Act and the Bank Installment Loan Act: **36% all-in**.
- Loans of less than $500 may also be subject to a **one-time 5% origination fee** (resulting in ~52% APR on the smallest loans).
- Contains strong **anti-evasion provisions**; violations constitute unfair or deceptive trade practices under the Unfair Practices Act (§ 57-12-1 et seq.).

### 3.4 General Usury (NMSA 1978 § 56-8-3)

- Default interest-rate cap: **15% per year** for non-licensed lenders.
- This cap is largely superseded by the 36% small-loan cap for licensed lenders.
- MCA and commercial-receivable-purchase structures may attempt to evade this cap; courts may recharacterize such transactions as loans.

### 3.5 Loan Brokering / Servicing

- No separate loan-broker licensing statute was identified in NM.
- Small-loan licensees must demonstrate financial responsibility, character, and general fitness.
- Collection agencies require separate licensing under FID.
- Annual reporting required by April 15 for all small-loan licensees.

### GCSC Implications
- Any GCSC entity making loans of $10,000 or less to NM borrowers likely requires a **Small Loan Act license**.
- The 36% APR cap is strict and includes **all fees**.
- Partnering with a **bank or credit union** (which are exempt) may be a path to lawful lending in NM.
- Business-purpose loans to contractors (working capital, equipment) at $10,000 or less fall squarely under the Act.

---

## 4. Money Transmitter & Escrow Regulation

### 4.1 Uniform Money Services Act (NMSA 1978 §§ 58-32-101 et seq.)

- **Money Transmission Definition**: "Selling or issuing payment instruments, stored value, or receiving money or **monetary value** for transmission" (§ 58-32-102(Q)).
- **Monetary Value**: Defined as "a medium of exchange, whether or not redeemable in money" (§ 58-32-102) — this broad definition captures virtual currency and potentially other digital-store-of-value instruments.
- **FID Position**: The FID has publicly stated that *"any entity engaged in the business of providing the exchange of virtual currency for money or any other form of monetary value or stored value to persons located in the State of New Mexico must be licensed by the FID as a money transmitter."*
- **Money Services Business (MSB) License Requirements**:
  - Annual licensing renewal;
  - Surety bond (typically **$50,000+**);
  - AML / KYC compliance program;
  - Net-worth requirements;
  - Audit and examination by FID.

### 4.2 Escrow Regulation

- The **New Mexico Regulation and Licensing Department** may regulate escrow companies and escrow agents under its general statutory authority, though no dedicated escrow licensing statute comparable to California or Arizona was identified.
- Escrow activities incidental to real-estate transactions are generally conducted under the supervision of the RLD or through title-insurance entities regulated by the OSI.
- **No NM-specific statute explicitly authorizing third-party claim-proceeds escrow for contractor financing was found.**

### 4.3 Payday Lending Context (Compliance Boundary Marker)

- NM previously permitted payday lending at rates up to **175% APR**.
- HB 132 (2023) effectively eliminated traditional payday lending by imposing the **36% all-in APR cap**.
- Installment loans under $10,000 are now capped at 36% APR with a 120-day minimum term, making short-term high-rate advance products unlawful.
- This rate environment confirms that any GCSC product offering "claim advances" or "installment credit" to NM consumers must conform to the 36% cap or partner with an exempt entity.

### GCSC Implications
- If GCSC facilitates the exchange of virtual currency for fiat, or holds digital value on behalf of users, **money-transmitter licensing may be triggered**.
- Escrow of claim proceeds or contractor payments in a custodial capacity may implicate RLD escrow oversight.
- The interaction between smart-contract automated disbursements and the "stored value" / "monetary value" definitions is **untested under NM law** and requires counsel review.

---

## 5. Contractor Licensing & Construction Finance

### 5.1 CID Licensing (NMSA 1978 §§ 60-13-1 et seq.)

- **CID (Construction Industries Division)** of the Regulation and Licensing Department is the **single statewide licensing agency** for construction contractors.
- **Threshold**: Work valued above **$500** requires a CID license.
- **70+ license classifications**, including:
  - **GB-98** — General Building (commercial / multifamily);
  - **GB-2** — Residential General Building;
  - **GA-98** — General Engineering;
  - **EE-98** — Electrical; **MM-98** — Mechanical; etc.
- **Qualifying Party (QP)**: Must have **4 years of experience** and pass trade + business/law examinations.
- **Surety Bond**: All contractors must post a bond (amounts vary by classification).
- **Insurance**: General liability and workers' compensation required.
- **Continuing Education**: Required for renewal (trade-code updates).

### 5.2 Contractor Financing / Business Loans

- Small-dollar business loans ($10,000 or less) to contractors fall under the **Small Loan Act** (see §3 above).
- Equipment financing to contractors may be structured as commercial loans exempt from the Small Loan Act if made to dealers upon personal property held for resale.
- **No specific contractor-finance exemption was identified.**

### 5.3 Consumer Protection for Contractor Transactions

- NM **Unfair Practices Act** (§§ 57-12-1 et seq.) applies to contractor/homeowner transactions.
- Solar/contractor-specific rules: certain disclosures required; payments for leases/PPAs cannot begin until interconnection.
- Door-to-door sales: § 57-12-21 NMSA 1978 provides special consumer protections (3-day rescission right).

---

## 6. Insurance, Claims & Assignment of Benefits

### 6.1 Additional Living Expense (ALE) Advances

- **Emergency Orders Only**: The NM OSI has issued emergency orders (e.g., for 2024 wildfires) requiring insurers to issue **$5,000 advance payments** for ALE to impacted policyholders.
- **No Permanent Statute**: No general NM statute requires insurers to provide emergency advance payments on property claims outside of declared emergencies.
- **Unfair Claims Practices Act** (§ 59A-16-20 NMSA 1978) requires insurers to:
  - Acknowledge claims reasonably promptly;
  - Investigate promptly;
  - Affirm or deny coverage within a reasonable time;
  - Attempt in good faith to effectuate prompt, fair, and equitable settlements when liability is reasonably clear;
  - Settle catastrophic claims within **90 days** of reporting (§ 59A-16-20(F)).
- **Claim Payment Method** (§ 59A-16-21): Insurers must pay claims with checks/drafts or, if requested, by electronic transfer.

### 6.2 Assignment of Benefits (AOB)

- **AOB Status**: **Generally permitted post-loss** under common-law contract principles.
- **No NM-specific AOB statute** for property/casualty insurance claims was identified.
- Insurance policies typically contain anti-assignment clauses for *policy rights* (but not for proceeds *after* a loss occurs).
- § 59A-13-15(B) NMSA 1978 (Public Adjuster contracts) expressly allows the contract to specify that the public adjuster "shall be named as a co-payee on an insurer's payment of a claim" — indicating that assignment/co-payee arrangements for claim proceeds are **not per se prohibited**.
- NM does **not** impose specific AOB contract language, font sizes, rescission periods, or contractor-specific AOB limitations (unlike Florida, Texas, or Louisiana).

### 6.3 Mortgage / Loss Draft

- **No NM-specific statute** governing mortgagee/loss-draft check procedures was identified.
- Standard mortgage clause in homeowner policies names the mortgagee as an additional loss payee.
- Insurance checks for mortgaged properties are typically issued jointly to the homeowner and mortgagee.
- **Industry Practice (Fannie Mae / Freddie Mac Guidelines)**:
  - Current loans (<31 days delinquent): servicer may release initial disbursement up to greater of $40,000 or 33% of proceeds;
  - Delinquent loans (31+ days): full monitored claim process with inspection requirements;
  - Claims over $40,000 typically held in escrow with incremental disbursement.

### GCSC Implications
- Any product offering "insurance claim advances" to homeowners could be characterized as **lending**.
- If the advance is $10,000 or less, the Small Loan Act (36% APR cap) applies.
- If GCSC purchases a claim assignment at a discount, this could be characterized as lending or as an insurance-settlement purchase — characterization is **unclear** under NM law.
- Repayment from insurance proceeds creates additional regulatory complexity and is **BLOCKED pending legal review**.

---

## 7. Public Adjuster & Insurance Representation

### 7.1 Licensing Requirements (NMSA 1978 §§ 59A-13-1 et seq.)

- **License Required**: No person shall act as a public adjuster without a license from the OSI Superintendent.
- **Individual Requirements** (13.4.8.9 NMAC):
  - 18+ years old;
  - NM resident or reciprocal-state resident;
  - Good business reputation;
  - Pass examination;
  - **$10,000 surety bond**;
  - $30 license fee.
- **Business Entity**: Must employ individually licensed adjusters; each person performing adjusting acts must be licensed.
- **Continuing Education**: 24 hours biennially, including 3 hours ethics.
- **License Term**: 2 years, expires on last day of birth month.

### 7.2 Critical Restrictions for GCSC

1. **Contractor/Adjuster Dual Role PROHIBITED**: § 59A-13-15(I)(1) NMSA 1978 states: *"Your public adjuster is forbidden by law from acting as your contractor on this claim."* A public adjuster cannot also be the contractor performing repairs on the same claim.
2. **Individual Cannot Hold Both Licenses**: An individual licensed as a public adjuster shall **not** also be licensed as a staff or independent adjuster (13.4.8.17(A), 13.4.8.9(B)(7)).
3. **Referral Disclosure**: Public adjusters must disclose in writing any financial interest with any party involved in the claim, including construction firms and contractors (§ 59A-13-15(G)).
4. **Fee Restrictions**:
   - Cannot charge any fee before settlement and collection;
   - Fees must be paid as a percentage of each check (not from the first check);
   - During catastrophic disasters: maximum **10% of settlement**.
5. **Contract Requirements** (§ 59A-13-15):
   - Must be in writing;
   - **3-business-day rescission right**;
   - Must include specific disclosure document;
   - Cannot require insured to authorize checks only in the name of the public adjuster.

### 7.3 Who May Negotiate with the Insurance Company

- **Only licensed adjusters** (staff, independent, or public) may negotiate claims with insurers on behalf of others.
- **Contractors** negotiating claims on behalf of homeowners risk being deemed **unlicensed public adjusters**.
- **Attorneys** are exempt from adjuster licensing (§ 59A-13-2(B)).
- **Homeowners** may always negotiate their own claims.

### GCSC Implications
- GCSC and its contractor partners **must NOT** negotiate with insurance companies on behalf of homeowners.
- Any claim-negotiation assistance must be provided by a **licensed public adjuster or attorney**.
- GCSC can provide technology tools (document collection, status tracking) but should **not** engage in claim-settlement discussions.
- Facilitating direct communication between homeowner and insurer is permissible.

---

## 8. Token Collateral & Digital Assets

### 8.1 FID Position on Virtual Currency

- NM does **not** have a specific "digital asset" or "virtual currency" statute separate from the Money Services Act.
- HB 649 (introduced 2019, postponed indefinitely) would have created a separate "cryptovalue" licensing framework but was **not enacted**.
- **No clear statutory framework exists for using cryptocurrency as loan collateral** under NM law.

### 8.2 Open Legal Questions

No NM statute or regulation explicitly addresses:
- Accepting cryptocurrency as collateral for a loan;
- Locking tokens in a smart contract as security;
- Automated liquidation of token collateral;
- Whether a non-custodial smart-contract platform is a "money transmitter."

The FID's broad interpretation of "monetary value" and "stored value" creates risk that token-related activities could be deemed money transmission. **Counsel must review** whether GCSC's token-collateral mechanism requires MSB/money-transmitter licensing or a Small Loan Act license.

### 8.3 Token Collateral Status

**TOKEN_COLLATERAL_UNKNOWN_REQUIRES_COUNSEL_REVIEW**

| Factor | Status |
|--------|--------|
| Dedicated token-collateral statute | **None** |
| Money-transmitter applicability | **Likely (FID position)** |
| Small Loan Act applicability to crypto-backed loans ≤$10K | **Probable** |
| Non-custodial smart-contract exemption | **Untested** |

---

## 9. Required Disclosures & Consumer Protection

### 9.1 Public Adjuster / Contractor Separation

```
COUNSEL_APPROVED_TEXT_REQUIRED

[Draft placeholder — MUST BE REVIEWED BY NM COUNSEL]

IMPORTANT NOTICE TO NEW MEXICO HOMEOWNERS:

This platform does NOT provide public adjuster services. No person
associated with this platform is licensed as a public adjuster
under New Mexico law.

If you need assistance negotiating your insurance claim, you have
the right to hire a licensed New Mexico public adjuster. A public
adjuster is forbidden by law from also acting as your contractor
on the same claim.

You are not required to hire a public adjuster. You may negotiate
with your insurance company directly, or you may contact an attorney.

If you choose to hire a public adjuster, you have the right to
cancel that contract within three (3) business days after signing.
```

### 9.2 Loan / Advance Disclosure (If Applicable)

```
COUNSEL_APPROVED_TEXT_REQUIRED

[Draft placeholder — MUST BE REVIEWED BY NM COUNSEL]

NOTICE: This is a loan, not an insurance payment or grant.
New Mexico law limits the annual percentage rate (APR) on loans
of $10,000 or less to 36%. All fees are included in this rate.

You are borrowing money that must be repaid. Repayment may be
due from insurance proceeds, but your obligation to repay is
not dependent on your insurance claim being paid.

Lender:        [NAME]
License:       [NM SMALL LOAN ACT LICENSE NUMBER]
APR:           [XX.XX%]
Finance Charge: $[AMOUNT]
Amount Financed: $[AMOUNT]
Total of Payments: $[AMOUNT]
Payment Schedule: [SCHEDULE]
```

### 9.3 Token Collateral / Digital Asset Risk Disclosure

```
COUNSEL_APPROVED_TEXT_REQUIRED

[Draft placeholder — MUST BE REVIEWED BY NM COUNSEL]

WARNING: Digital assets (cryptocurrency, tokens) used as collateral
are subject to extreme price volatility. If the value of your
collateral falls below the required threshold, it may be liquidated
(sold) automatically by the smart contract.

You may lose all collateral posted. This transaction is not insured
by the FDIC or any government agency.

The regulatory status of token-collateralized lending in New Mexico
is unclear. By proceeding, you acknowledge this uncertainty.
```

### 9.4 Assignment of Benefits / Claim Proceeds

```
COUNSEL_APPROVED_TEXT_REQUIRED

[Draft placeholder — MUST BE REVIEWED BY NM COUNSEL]

NOTICE: You are assigning a portion of your insurance claim proceeds
to [GCSC / CONTRACTOR / LENDER]. This assignment does not guarantee
that your insurance company will pay your claim.

You remain responsible for any amounts owed even if your insurance
company denies your claim or pays less than expected.

If you have a mortgage on your property, your lender may have a
priority claim to insurance proceeds. This assignment is subordinate
to your mortgage lender's rights.
```

### 9.5 Not a Money Transmitter / MSB

```
COUNSEL_APPROVED_TEXT_REQUIRED

[Draft placeholder — MUST BE REVIEWED BY NM COUNSEL]

NOTICE: [GCSC entity] is not licensed as a money services business
or money transmitter under New Mexico law. All funds transfers are
conducted through licensed financial institutions.
```

### 9.6 Consumer Protection Context

- NM **Unfair Practices Act** (§§ 57-12-1 et seq.) provides a **private right of action**, **treble damages**, and **attorney fees**.
- UDAP applies broadly to consumer transactions, including contractor/homeowner and lender/borrower relationships.
- Violations of HB 132's 36% APR cap constitute unfair or deceptive trade practices.
- Door-to-door sales and telemarketing carry specific statutory protections (§ 57-12-21).

---

## 10. Dashboard Rules & Compliance Matrix

### 10.1 Product Status Flags

```json
{
  "state": "NM",
  "state_name": "New Mexico",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": [
      "live_loan_creation",
      "token_collateral_lock",
      "liquidation",
      "repayment_routing"
    ],
    "required_reviews": [
      "legal",
      "provider",
      "security"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED"
    ],
    "notes": "NM Uniform Money Services Act broadly defines monetary value and money transmission. FID requires money transmitter license for virtual currency exchanges. No clear guidance on token collateral/escrow/smart contract liquidation. Whether non-custodial smart contract platform is a money transmitter is untested. 36% APR cap applies to loans $10,000 or less. Counsel must determine if token-collateral lending requires MSB license or Small Loan Act license."
  },
  "claimbridge": {
    "status": "BLOCKED",
    "allowed_user_types": [],
    "blocked_actions": [
      "insurance_claim_advance",
      "assignment_of_benefits",
      "claim_financing",
      "repayment_from_claim_proceeds"
    ],
    "required_reviews": [
      "legal",
      "provider",
      "security"
    ],
    "required_disclosures": [
      "COUNSEL_APPROVED_TEXT_REQUIRED",
      "PUBLIC_ADJUSTER_NOT_CONTRACTOR_DISCLOSURE"
    ],
    "notes": "AOB is generally permitted post-loss under common law but no NM statute explicitly authorizes claim proceeds assignment to third parties. Public adjuster cannot act as contractor on same claim (59A-13-15(I)(1)). Any claim advance to homeowners of $10,000 or less likely requires Small Loan Act license and is subject to 36% APR cap. Repayment from insurance proceeds implicates mortgagee priority and potential money-transmitter status."
  },
  "contractor_flow_status": "DEMO_ONLY_PENDING_LEGAL_REVIEW",
  "homeowner_flow_status": "DEMO_ONLY_PENDING_LEGAL_REVIEW",
  "restoration_company_flow_status": "DEMO_ONLY_PENDING_LEGAL_REVIEW"
}
```

### 10.2 Smart-Contract Function Blockers

| Function | NM Status | Notes |
|----------|-----------|-------|
| Block live loan creation | **TRUE** | Small Loan Act license likely required for loans ≤$10,000; 36% APR cap must be enforced |
| Block token collateral lock | **TRUE** | Unknown whether this constitutes money transmission or stored value under NM law; FID could take enforcement position |
| Block liquidation | **TRUE** | Liquidation of token collateral may be deemed money transmission or an unlicensed lending activity |
| Block assignment of claim proceeds | **TRUE** | No clear NM statutory authority for AOB to third-party lenders; public-adjuster restrictions may apply; mortgagee priority issues |
| Block repayment routing from insurance proceeds | **TRUE** | Mortgagee may have priority; unclear if repayment routing constitutes money transmission; lender licensing issues |
| Allow demo-only records | **TRUE** | Demo/mockup mode permissible for development and presentation |
| Allow hash/reference-only audit records | **TRUE** | Non-financial record-keeping (hashes, references) likely permissible if no actual funds movement |

### 10.3 Final Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **HIGH** | 36% APR cap strictly enforced; Small Loan Act licensing required for loans ≤$10,000; strong anti-evasion provisions; violations are unfair practices with treble-damages potential |
| Insurance Claim Risk | **MEDIUM-HIGH** | No clear statute authorizing claim advances; OSI emergency orders show regulatory attention; Unfair Claims Practices Act creates liability for improper claim handling; 90-day catastrophic claim settlement requirement |
| AOB Risk | **MEDIUM-HIGH** | AOB generally permitted post-loss under common law; no NM AOB statute found; contractor acting as adjuster is prohibited; untested whether facilitated AOB constitutes public adjusting |
| Public Adjuster Risk | **HIGH** | Strict licensing, $10,000 bond, exam required; contractor/adjuster dual role **expressly prohibited** by statute; 10% fee cap during catastrophes; 3-day rescission; significant penalties for unlicensed activity |
| Token Collateral Risk | **HIGH** | FID requires money-transmitter license for virtual-currency exchange; no clear framework for token-collateral lending; "monetary value" definition is broad; smart-contract liquidation status untested; HB 649 failed |
| Consumer Protection Risk | **MEDIUM-HIGH** | Unfair Practices Act provides private right of action, treble damages, attorney fees; UDAP applies broadly to consumer transactions; door-to-door sales and telemarketing have specific protections |
| Escrow / Money Transmitter Risk | **MEDIUM-HIGH** | FID may assert MSB licensing for custodial digital-value activities; RLD escrow authority is discretionary; smart-contract disbursement status is untested |

---

## Appendix: Quick-Reference Statutory Index

| Statute | Citation | Subject |
|---------|----------|---------|
| Small Loan Act of 1955 | §§ 58-15-1 et seq., NMSA 1978 | Consumer lending licensing, $10K cap |
| Bank Installment Loan Exemption Act | Ch. 58, Art. 7, NMSA 1978 | Related lending regulation |
| HB 132 (2022) | Effective 1/1/2023 | 36% APR cap, anti-evasion |
| Uniform Money Services Act | §§ 58-32-101 et seq., NMSA 1978 | Money transmission, virtual currency |
| Construction Industries Licensing Act | §§ 60-13-1 et seq., NMSA 1978 | Contractor licensing (CID) |
| Insurance Code — Adjusters | §§ 59A-13-1 et seq., NMSA 1978 | Public adjuster licensing |
| Public Adjuster Contracts | § 59A-13-15, NMSA 1978 | Contract requirements, disclosure |
| Unfair Claims Practices | § 59A-16-20, NMSA 1978 | Claims handling standards |
| Unfair Practices Act | §§ 57-12-1 et seq., NMSA 1978 | Consumer protection, UDAP |
| General Usury | § 56-8-3, NMSA 1978 | 15% interest-rate cap (default) |

---

*This compliance file is provided for research and compliance planning purposes only. It does NOT constitute legal advice. All SmartContractor products and services in New Mexico must be reviewed by qualified New Mexico legal counsel before launch. Status designations reflect the state of research as of the compilation date and should be verified against current law.*
