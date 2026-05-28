# SmartContractor State Compliance: South Carolina (SC)

**Research Date:** 2025-07-02
**Status:** DEMO-ONLY / LEGAL_REVIEW_REQUIRED for all live product features
**Regulatory Complexity:** Moderate to High

---

## 1. State Summary

South Carolina presents a **moderate but multi-layered regulatory environment** for SmartContractor products. The state maintains strict contractor licensing through LLR, one of the nation's lowest usury caps at 8.75%, and favorable (but complex) insurance claim assignment rules under common law.

**Key Regulatory Facts:**

- **AOB Status:** Post-loss assignment of benefits is **VALID under common law** (*PCS Nitrogen, Inc. v. Continental Cas. Co.*, 2022) -- the South Carolina Supreme Court adopted the "post-loss exception" allowing policyholders to assign post-loss insurance benefits without insurer consent. No statutory ban or hurricane-reform prohibition found.
- **Token/Crypto Collateral:** South Carolina AG's Money Services Division has taken the position that **virtual currencies alone do not qualify as monetary value** and activities relating to virtual currencies **do not require a money transmitter license**. However, if virtual currency transactions also involve fiat currency transfer, they may trigger money transmission regulation. No explicit state-level digital asset lending or collateral rules found.
- **Lending:** General usury cap of **8.75% per annum** (SC Code § 34-31-20) -- one of the lowest in the United States. Supervised lenders may charge higher rates (up to ~36% APR on loans ≤$600 per § 34-29-140; 18% on loans >$600). Consumer finance license required for loans ≤$7,500.
- **Contractor Licensing:** Strictly regulated by the SC Contractor Licensing Board within LLR. Commercial projects >$5,000 require state license. Residential builders/specialty contractors separately regulated. Unlicensed contractors cannot file mechanics' liens or enforce contracts.
- **Public Adjuster:** Licensing required through SC Department of Insurance (doi.sc.gov). Contractors **CANNOT** act as public adjusters. Clear conflict-of-interest prohibitions exist under § 38-48-70(g).
- **Escrow Regulation:** The South Carolina Department of Consumer Affairs may regulate escrow activities under its consumer protection authority. No dedicated state escrow agency exists.
- **Money Transmitter:** SC Code 35-11-105 et seq. governs money services; pure virtual currency activities exempt per SC AG guidance.
- **Loss Draft/Mortgagee:** Standard industry practice -- mortgage servicers co-pay claims >$40,000, hold funds in escrow, release incrementally based on inspections.

**Bottom Line:** South Carolina requires significant legal review before any product launch. AOB is permitted but complex. Token collateral is unregulated at state level for pure crypto but federal rules apply. Lending requires licensing analysis due to the 8.75% usury cap. Contractor and public adjuster boundaries must be strictly observed. All product flows remain DEMO-ONLY pending counsel review.

---

## 2. Official Sources Reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| SC Department of Insurance | https://doi.sc.gov | Public adjuster licensing, consumer guidance on claims |
| SC DOI -- Understanding Claim Payout Process | https://doi.sc.gov/953/Understanding-the-Claim-Payout-Process | Loss draft procedures, ALE, direction-to-pay forms |
| SC DOI -- Public Adjuster Licensing | https://doi.sc.gov/437/Public-Adjuster | Licensing requirements, fees, exam info |
| SC Code of Laws -- Title 38 (Insurance) | https://www.scstatehouse.gov/code/title38.php | Insurance claims, AOB, public adjuster rules |
| SC Code Title 38, Ch. 48 (Public Adjusters) | https://www.scstatehouse.gov/code/t38c048.php | Public adjuster definitions, licensing, conduct |
| SC Code Title 38, Ch. 59 (Claims Practices) | https://www.scstatehouse.gov/code/t38c059.php | Improper claim practices |
| SC Code Title 34, Ch. 29 (Consumer Finance) | https://www.scstatehouse.gov/code/t34c029.php | Consumer finance licensing, loans ≤$7,500 |
| SC Code Title 37 (Consumer Protection Code) | https://www.scstatehouse.gov/code/t37.php | Supervised lending, rate ceilings, consumer loans |
| SC Code Title 37, Ch. 3 (Loans) | https://www.scstatehouse.gov/code/t37c003.php | Loan finance charges, supervised lender rates |
| SC Code Title 35, Ch. 11 (Money Services) | https://www.scstatehouse.gov/code/t35c011.php | Money transmission, monetary value definitions |
| SC Code Title 40, Ch. 11 (Contractors) | https://www.scstatehouse.gov/code/t40c011.php | General/mechanical contractor licensing |
| SC Code Title 40, Ch. 59 (Residential Builders) | https://www.scstatehouse.gov/code/t40c059.php | Residential builder/specialty contractor licensing |
| SC Board of Financial Institutions -- Consumer Finance Division | https://bofi.sc.gov | Consumer lending supervision, licensing |
| SC Attorney General -- Money Services Division | https://www.scag.gov/inside-the-office/legal-services-division/money-services/ | Money transmission, virtual currency guidance |
| SC AG Money Services FAQs (Virtual Currency) | https://www.scag.gov/inside-the-office/legal-services-division/money-services/money-services-faqs/ | Virtual currency not monetary value, no license required |
| SC LLR -- Contractor Licensing Board | https://llr.sc.gov/clb/clb_licensure.aspx | Contractor license application, classifications |
| SC Supreme Court -- *Linder v. Ins. Claims Consultants* | Opinion No. 25417 (2002) | Unauthorized practice of law by public adjusters |
| SC Supreme Court -- *PCS Nitrogen v. Continental Cas.* | 871 S.E.2d 590 (2022) | Post-loss assignment valid without insurer consent |
| SC Department of Consumer Affairs | https://consumer.sc.gov | Consumer protection, escrow regulation, supervised lending |
| NMLS -- SC License Requirements | https://www.nmlsconsumeraccess.org | Mortgage lender, money transmitter licensing |

---

## 3. Lending / Finance Licensing Notes

### Consumer Lending / Consumer Finance
- **SC Code § 34-29-10 et seq.** (Consumer Finance Law): License required for making loans of **$7,500 or less** with charges exceeding the general usury rate.
- **SC Code § 34-29-20(a)**: No person shall engage in business of lending in amounts of $7,500 or less without a license from the State Board of Financial Institutions (Consumer Finance Division).
- **Exemptions** (§ 34-29-20(b)): Banks, savings and loan associations, savings banks, trust companies, insurance companies, credit unions, licensed pawnbrokers. **Does NOT apply to loans made to a corporation.**
- **Penalty**: Violations are a misdemeanor; contracts made in violation are **void** -- lender has no right to collect principal, interest, or charges (§ 34-29-20(d)).
- **License Requirements**: $25,000 liquid assets required; financial responsibility, character, fitness findings; separate license per location.

### Supervised Lending (Title 37 Consumer Protection Code)
- **SC Code § 37-3-201**: Supervised lenders may contract for higher finance charges:
  - Loans ≤$600: Maximum charge as per § 34-29-140 (approximately 36% APR tiered structure)
  - Loans >$600 or made by Supervised Financial Organizations: Any rate filed and posted with Department of Consumer Affairs
  - Default maximum: 18% per year on unpaid balances
- **SC Code § 37-3-503**: Supervised lender license required from State Board of Financial Institutions; $25,000 minimum assets per license.
- **SC Code § 37-3-502**: Supervised loan = consumer loan with APR exceeding 12% (non-supervised) or 18%.

### Usury / Maximum Interest Rates
- **General usury cap**: **8.75% per annum** (SC Code § 34-31-20) -- one of the lowest in the United States
- **Legal rate of interest**: 8.75% (adjustable annually based on prime rate + 4% for judgments)
- **Non-supervised consumer loans**: Maximum 12% per year (§ 37-3-201(1))
- **Supervised loans**: Up to 18% per year default; higher rates allowed with filing/posting
- **Corporate loans**: Exempt from consumer finance licensing per § 34-29-20(b)
- **No criminal usury statute**: Enforcement is civil only

### Payday Lending / Deferred Presentment
- **SC Code § 34-39-110 et seq.** (South Carolina Deferred Presentment Services Act)
- Payday loans legal with licensing; max $550 per loan; max 15% fee; max 31 days; no rollovers
- Real-time database required to prevent multiple loans
- Criminal actions against borrowers prohibited

### Mortgage Lending
- Mortgage lender/servicer license required through SC Consumer Finance Division / NMLS
- $700 annual fee; expires December 31
- Broker license through Department of Consumer Affairs
- SAFE Act compliance required

### Implications for SmartContractor
- Any loan product to individual consumers would likely require supervised lender or consumer finance licensing if loan is ≤$7,500 and rate exceeds 8.75% (or 12% for non-supervised).
- Equipment credit to contractors may qualify as commercial purpose and potentially exempt from consumer lending rules if made to LLC/corporation.
- **ALL LENDING BLOCKED PENDING COUNSEL REVIEW** on applicability of exemptions.

---

## 4. Escrow, Consumer Protection & Money Transmitter Laws

### South Carolina Department of Consumer Affairs (SCDCA)
The **South Carolina Department of Consumer Affairs** (consumer.sc.gov) serves as the state's primary consumer protection regulator with authority that may extend to escrow regulation, supervised lending oversight, and enforcement of the SC Consumer Protection Code.

- **Escrow Regulation**: While South Carolina does not maintain a standalone escrow licensing statute comparable to some states, the SCDCA may regulate escrow activities under its broader consumer protection authority (Title 37). Entities holding consumer funds in escrow for property repairs may fall under SCDEA supervision depending on the arrangement.
- **Supervised Lender Oversight**: SCDCA works in conjunction with the Board of Financial Institutions to supervise licensed lenders and enforce rate-filing requirements.
- **Consumer Complaints**: SCDCA accepts and investigates consumer complaints against financial service providers, contractors, and insurance-related entities.
- **Contact**: P.O. Box 5757, Columbia, SC 29250 | 803-734-4200

### SC Consumer Protection Code (Title 37)
- **SC Code § 37-1-101 et seq.**: The South Carolina Consumer Protection Code governs consumer credit transactions, including loans, retail installment sales, and credit services.
- **Coverage**: Applies to consumer loans, retail installment contracts, and credit extended primarily for personal, family, or household purposes.
- **Prohibited Practices**: § 37-5-108 prohibits unconscionable practices; § 37-5-109 prohibits deceptive acts including misleading representations about debt, credit terms, or collateral.
- **Remedies**: Consumers may recover actual damages, statutory damages up to $5,000, attorney's fees, and punitive damages for willful violations. The SCDEA and Attorney General have enforcement authority.
- **Unfair Trade Practices Act (Title 39)**: Also applies; provides additional private right of action for deceptive trade practices.

### Money Transmitter Act (SC Code § 35-11-105 et seq.)
- **"Monetary value"** (§ 35-11-105(12)): A medium of exchange, whether or not redeemable in money.
- **"Receiving money for transmission"** (§ 35-11-105(32)): Receiving money or monetary value for transmission within or outside the US by electronic or other means.
- **"Stored value"** (§ 35-11-105(34)): Monetary value representing a claim against the issuer evidenced by an electronic or digital record.
- **License Required**: Anyone engaging in money transmission must obtain a license from the SC Attorney General's Money Services Division. License application through NMLS.
- **Bond/Net Worth**: Minimum $50,000 surety bond or permissible investment; net worth requirements apply.
- **Exemptions**: Banks, credit unions, certain government entities, and agents of the payee (under limited circumstances).

### SC AG Guidance on Virtual Currencies & Money Transmission
- **December 5, 2018 Interpretation**: Virtual currencies lack the characteristics necessary to be a medium of exchange; therefore, **virtual currencies alone do not qualify as monetary value** under the Money Services Act.
- **Key Holding**: Activities relating to virtual currencies **do not require a money transmitter license** under the Money Services Act.
- **SC AG Order MSD-19003 (ATM guidance)**: When an ATM facilitates only a direct sale/purchase of virtual currency by the operator with the customer, **no license is required**. However, exchange of virtual currency for fiat currency through an ATM acting as **third-party exchanger** is money transmission requiring a license.
- **SC AG FAQ (current)**: "To the extent that virtual currency transactions also involve the transfer of fiat currency, they may be subject to money transmission regulation under the Act."
- **Implication**: Pure crypto-to-crypto or token collateral activities (without fiat conversion/transmission) fall outside state money transmitter licensing requirements. This is a favorable position for SmartContractor's token collateral model.

### Pending Blockchain Legislation
- **H.B. 4351/S.B. 738 (2019/2020)**: Would have established "SC Blockchain Industry Empowerment Act" including exemptions for "Open Blockchain Tokens" from securities and money transmission laws -- **died in committee**.
- **H.B. 4200/S.B. 524 (2019/2020)**: Would have added virtual currency to unclaimed property act -- **died in committee**.
- **S.R. 1158 (2020)**: Senate resolution acknowledging importance of blockchain technology -- **adopted**.
- **H.B. 7254 (2025)**: Would establish economic growth blockchain act and regulate virtual/digital assets -- **pending**.

### Implications for SmartContractor
- **Escrow activities** involving holding consumer repair funds may require SCDEA coordination or registration. No clear exemption exists for technology platforms holding funds.
- **Token collateral (state level)**: LARGELY UNREGULATED at state level for pure virtual currency activities. No state money transmitter license required for token collateral lock/unlock if no fiat currency transmission involved.
- **Federal overlay remains**: Federal securities law, commodities law, and CFTC/SEC regulations still apply regardless of state exemption.
- **Token liquidation mechanisms** may trigger money transmission if proceeds converted to fiat and "transmitted" to third parties.
- **TOKEN_COLLATERAL_BLOCKED** pending comprehensive legal review of federal/state interaction.

---

## 5. Contractor Licensing Notes

### Commercial Contractors
- **SC Code § 40-11-10 et seq.** (Contractors' Licensing Board within LLR)
- License required for construction work valued **over $5,000**
- Classified by project value: Group 1 ($50K), Group 2 ($200K), Group 3 ($500K), Group 4 ($1.5M), Group 5 (unlimited)
- Financial requirements: Net worth from $10K (Group 1) to $250K (Group 5), or surety bond in lieu
- Must pass Business Management & Law exam + technical exam
- Must designate Primary Qualifying Party with 2 years experience in last 5 years
- License renewal biennially (even-numbered years, expires October 31)

### Residential Builders
- **SC Code § 40-59-10 et seq.** (Residential Builders Commission within LLR)
- Separate from commercial contractor licensing
- Residential builder license required; specialty contractors registered/licensed
- **Unlicensed residential builders cannot file mechanics' liens or enforce contracts** (§ 40-59-30(B))
- Bond required: $15,000 minimum for residential builders; $5,000-$10,000 for specialty contractors
- General liability insurance required: $175,000 per occurrence minimum for residential builders

### Implications for SmartContractor
- Any contractor on the platform must hold valid SC contractor license (commercial) or residential builder registration
- Verification through LLR license lookup required: https://llr.sc.gov
- Financing to contractors may be considered commercial/business-purpose lending
- SmartContractor must not hold itself out as a lender, broker, or financing provider without appropriate licensing

---

## 6. Token Collateral / Crypto Notes

### South Carolina Regulatory Position
South Carolina maintains one of the more permissive state-level positions on pure virtual currency activities:

- **SC AG Money Services Division (December 5, 2018 Interpretation)**: Virtual currencies lack the characteristics necessary to be a medium of exchange; therefore, **virtual currencies alone do not qualify as monetary value** under the Money Services Act.
- **Activities relating to virtual currencies do not require a license** under the Money Services Act.
- **SC AG Order MSD-19003 (ATM guidance)**: Direct sale/purchase of virtual currency by operator with customer requires no license. Third-party exchanger activities do require licensing.
- **SC AG FAQ**: "To the extent that virtual currency transactions also involve the transfer of fiat currency, they may be subject to money transmission regulation under the Act."

### Digital Asset Lending & Collateral
- No explicit state-level digital asset lending or collateral statute exists in South Carolina.
- No state-level framework for tokenized securities, DeFi protocols, or smart contract-based collateral.
- H.B. 7254 (2025) pending -- would establish economic growth blockchain act; monitor for developments.

### Federal Law Overlay
Regardless of South Carolina's permissive state stance, federal regulations apply:
- **Securities law (SEC)**: Token classification as security depends on Howey test
- **Commodities law (CFTC)**: Virtual currencies treated as commodities
- **Bank Secrecy Act / FinCEN**: Crypto-related money services businesses must register and maintain AML programs
- **Tax treatment**: IRS Notice 2014-21 treats virtual currency as property for tax purposes

### Implications for SmartContractor
- **State-level token collateral status: LARGELY UNREGULATED at state level for pure virtual currency activities**
- No state money transmitter license required for token collateral lock/unlock if no fiat currency transmission involved
- Token liquidation mechanisms may trigger money transmission if proceeds converted to fiat and "transmitted"
- **TOKEN_COLLATERAL_BLOCKED** -- while SC state law is permissive, federal overlay is complex and uncertain
- Smart contract token collateral features remain DEMO-ONLY pending federal/state legal review

---

## 7. Insurance Claims, ALE & Loss Draft Notes

### Additional Living Expenses (ALE)
- ALE coverage is standard in most homeowners policies
- SC DOI confirms: "Most homeowner policies include coverage for additional living expenses. This coverage is designed to cover additional living expenses while repairs are being made to the damaged home."
- **ALE pays for costs INCURRED** -- does not pay in advance for estimated loss of use
- Covers: temporary housing, increased food costs, pet boarding, extra transportation, storage, moving, utility reconnection, emergency repairs
- Does NOT cover: mortgage payments, property taxes, luxury accommodations
- Typical limit: 20% of dwelling coverage

### Claim Payment Process
- SC DOI guidance: "The first check you get from your insurance company is often an advance against the total settlement amount, not the final payment."
- Policyholders can reopen claims if additional damage is found
- Multiple checks may be issued (structure, personal belongings, ALE)
- Insurers must acknowledge claims "with reasonable promptness" (§ 38-59-20(2))

### Direction to Pay
- SC DOI specifically warns: "Some contractors may ask you to sign a 'direction to pay' form that allows your insurance company to pay the firm directly. This form is a legal document, so you should read it carefully to be sure you are not also assigning your entire claim over to the contractor."
- "Assigning your entire insurance claim to a third party takes you out of the process and gives control of your claim to the contractor."
- **When in doubt, call your insurance professional before you sign.**

### Loss Draft / Mortgagee Checks
- If home has mortgage, repair check generally made out to both homeowner and mortgage lender
- Lender must endorse check before cashing
- Lenders may place funds in escrow and release incrementally
- Standard industry threshold: Claims >$40,000 typically monitored by servicer
- Delinquent loans: all funds held in escrow regardless of amount
- Mortgage servicers require: adjuster's report, contractor estimate, signed agreement, W-9, possibly inspection

### Partial/Advance Payments
- No SC-specific statute mandating emergency advance payments found
- SC DOI FAQ mentions: "Most individuals with insurance claims receive contact from the insurance adjuster within 48 hours after the claim is reported"
- Homeowner required to mitigate further damage; cost of mitigation (tarps, etc.) generally covered
- ALE checks should be made out to homeowner alone (not mortgage lender)

### Implications for SmartContractor
- ClaimBridge claim advance product would involve advancing funds against anticipated insurance proceeds
- Repayment from insurance proceeds creates assignment-like mechanism
- Direction-to-pay and claim assignment concepts overlap with AOB
- **INSURANCE CLAIM ADVANCE: BLOCKED PENDING LEGAL REVIEW**
- Must ensure SmartContractor does not promise to guarantee claim outcomes or coverage determinations

---

## 8. Assignment of Benefits Notes

### SC AOB Status: **ALLOWED (Common Law Post-Loss Exception)**

**Critical Case Law:**
- ***PCS Nitrogen, Inc. v. Continental Cas. Co.***, 871 S.E.2d 590 (S.C. 2022): SC Supreme Court adopted the "post-loss exception" -- insurer consent is **NOT required** for assignment of insurance benefits made after a "loss" has occurred.
- The court held that the operative "loss" arises at the time of the occurrence, not when judgment is issued against the insured.
- Reversed Court of Appeals which had required insurer consent.

**Key Holdings:**
- Post-loss assignment of insurance rights is valid in South Carolina
- Express anti-assignment clauses in policies do not bar post-loss assignments
- Applies even to third-party liability policies (based on PCS Nitrogen facts)
- Public policy rationale: prevents insurers from receiving "windfall"

**No Statutory AOB Ban Found:**
- Unlike Florida (which banned post-loss AOBs effective January 1, 2023), South Carolina has **NOT** enacted legislation prohibiting AOBs
- Post-hurricane AOB reform legislation has been discussed but **not enacted**
- AOB agreements remain enforceable under common law

**Important Caveats:**
- AOB must be a valid contract with consideration
- Scope of assignment matters -- partial assignment of specific rights vs. full claim assignment
- Healthcare AOBs are common and well-established
- Property AOBs are less common but legally valid

**SC DOI Warning to Consumers:**
- SC DOI explicitly warns homeowners about signing direction-to-pay forms that may inadvertently assign the entire claim
- Advises: "When in doubt, call your insurance professional before you sign"

### Implications for SmartContractor
- AOB mechanisms may be legally permissible in South Carolina
- SmartContractor must ensure any AOB is structured as a valid assignment with proper scope
- Cannot guarantee claim outcomes or interfere with insurer's coverage determinations
- Must not cross into public adjuster territory (see Section 9)
- **AOB STATUS: LEGAL_REVIEW_REQUIRED** -- while AOB is not banned, specific product structure requires counsel approval

---

## 9. Public Adjuster & Insurance Representation Notes

### Licensing Required
- **SC Code § 38-48-20**: "Every individual commonly called a public adjuster, adjusting losses for an insured, must be licensed by the director or his designee."
- Exam required (Pearson Vue); license fee $80 minimum (retaliatory); renewed October of even-numbered years
- SLED background check required
- Regulated by SC Department of Insurance (doi.sc.gov)

### Definition of Public Adjusting
- **SC Code § 38-48-10(2)**: "Public adjusting" means "investigating, appraising or evaluating, and reporting to an insured in relation to a first party claim arising under insurance contracts, that insure the real or personal property, or both, of the insured."
- Does NOT include motor vehicle claims
- Does NOT include activities constituting unauthorized practice of law

### Prohibited Conduct for Public Adjusters (§ 38-48-70)
Public insurance adjusters **shall NOT**:
- (a) Be dishonest or unfair in communications
- (b) Have any financial interest in any aspect of the insured's claim (other than compensation)
- (c) Refer insured to any person with whom the adjuster has a financial interest
- (d) Prevent or dissuade insured from communicating with insurer or attorney
- (e) Engage in unauthorized practice of law
- (f) Acquire interest in salvage without express written permission
- **(g) Solicit or enter into any agreement for repair/replacement of damaged property on which the public adjuster has been engaged to adjust or settle claims** -- **CRITICAL**: Contractor/public adjuster dual role prohibited
- **(h) Offer or provide advice as to whether the insured's claim is covered by the insured's contract with the insurer**

### Contractor as Public Adjuster -- STRICTLY PROHIBITED
- **SC Code § 38-48-70(g)**: Public adjuster cannot also be the repair contractor on the same claim
- This is a direct conflict of interest under South Carolina law
- NAPIA materials confirm: "It is against the law in this state for a public adjuster to act as an adjuster and contractor on the same claim"

### Unauthorized Practice of Law (*Linder v. Ins. Claims Consultants*, SC Supreme Court 2002)
Public adjusters **CAN** do:
- Provide estimate of property damage/repair costs (appraisal activities)
- Prepare contents inventory and sworn statements on proof of loss
- Present claim to insurance company (deliver paperwork)
- Negotiate with insurance company on competing property-damage valuations

Public adjusters **CANNOT** do:
- Advise clients of rights/duties/privileges under insurance policy
- Advise clients whether to accept settlement offers
- Become involved in coverage disputes
- Advertise services requiring legal skill

### Implications for SmartContractor
- **SmartContractor and its contractor partners MUST NOT act as public adjusters**
- Cannot negotiate claims with insurers on behalf of homeowners
- Cannot advise homeowners on coverage determinations
- Cannot have financial interest in both the claim adjustment AND the repair contract
- Platform must clearly distinguish between repair services and claim advocacy
- Any claim assistance must be limited to facilitating communication, not negotiating

---

## 10. Dashboard Rules, Risk Scores & Disclosures

### Dashboard Rules

```json
{
  "state": "SC",
  "state_name": "South Carolina",
  "token_collateral_equipment_credit": {
    "status": "UNKNOWN_REQUIRES_COUNSEL_REVIEW",
    "allowed_user_types": [],
    "blocked_actions": ["live_loan_creation", "token_collateral_lock", "liquidation", "repayment_routing"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "SC AG has taken position that pure virtual currency activities do NOT require money transmitter license. However, if token liquidation involves fiat currency conversion and transmission, money transmission licensing may be triggered. Equipment credit to contractors may qualify as commercial purpose but general usury cap (8.75%) and consumer finance licensing requirements apply to consumer loans. Supervised lenders may charge up to 18% (higher with filing). Federal securities/commodities law overlay creates additional uncertainty. Consumer Protection Code (Title 37) and Department of Consumer Affairs oversight may apply to escrow activities. ALL token collateral activities BLOCKED pending comprehensive legal review."
  },
  "claimbridge": {
    "status": "LEGAL_REVIEW_REQUIRED",
    "allowed_user_types": [],
    "blocked_actions": ["insurance_claim_advance", "assignment_of_benefits", "claim_financing", "repayment_from_claim_proceeds"],
    "required_reviews": ["legal", "provider", "security"],
    "required_disclosures": ["COUNSEL_APPROVED_TEXT_REQUIRED"],
    "notes": "Post-loss AOB is VALID under SC common law (PCS Nitrogen, 2022). However, ClaimBridge advance against insurance proceeds creates complex lending + assignment structure that has not been tested in SC courts. Public adjuster prohibitions prevent SmartContractor from negotiating claims. Loss draft/mortgagee priorities complicate repayment. Direction-to-pay forms require careful structuring. Consumer lending license requirements may apply. SCDEA consumer protection authority may regulate escrow holding of repair funds. DEMO-ONLY mode recommended until counsel approves specific product structure."
  },
  "contractor_flow_status": "DEMO_ONLY -- contractor can register and demonstrate platform features but cannot initiate live financing transactions",
  "homeowner_flow_status": "DEMO_ONLY -- homeowner can view platform and simulate claim process but cannot receive advances or assign benefits",
  "restoration_company_flow_status": "DEMO_ONLY -- restoration company can demonstrate workflow but cannot receive live payments or claim proceeds routing"
}
```

### Smart Contract Implications

| Action | SC Status | Notes |
|--------|-----------|-------|
| Block live loan creation | **true** | Pending determination of lending license requirements; 8.75% usury cap creates significant risk |
| Block token collateral lock | **true** | Unknown state/federal regulatory treatment; state MT license likely not required for pure crypto but federal overlay uncertain |
| Block liquidation | **true** | Token liquidation may trigger money transmission if fiat involved; SCDEA may regulate escrow |
| Block assignment of claim proceeds | **true** | AOB legally valid but product structure untested; legal review required |
| Block repayment routing from insurance proceeds | **true** | Mortgagee priority and loss draft procedures complicate direct routing |
| Allow demo-only records | **true** | All product flows limited to demonstration mode |
| Allow hash/reference-only audit records | **true** | Blockchain-based audit records permissible; no SC law prohibiting |

**Additional Smart Contract Notes:**
- Smart contract self-execution may be viewed as automated assignment mechanism
- If smart contract automatically assigns claim proceeds to SmartContractor, this could be challenged as unauthorized public adjusting or unlicensed lending
- Oracle feeds for claim status may not be recognized by SC courts as evidence
- Mortgage servicers will not recognize smart contract assignments without proper documentation
- **RECOMMENDATION**: Smart contracts should record references/hashes only; all actual financial transactions must occur through licensed intermediaries after counsel review

### Risk Scores

| Risk Category | Score | Notes |
|---------------|-------|-------|
| Lending Risk | **HIGH** | SC has one of lowest usury caps in US (8.75%). Consumer finance license required for loans ≤$7,500. Supervised lender license for higher-rate loans. Penalties include void contracts and criminal misdemeanor. Equipment credit to LLCs/corporations may be exempt but requires counsel confirmation. |
| Insurance Claim Risk | **MEDIUM** | Post-loss AOB is valid under SC common law, which is favorable. However, ClaimBridge structure (advance + assignment + repayment) is novel and untested. SC DOI warns consumers about assigning claims. Loss draft/mortgagee procedures complicate repayment. Public adjuster boundaries must be strictly observed. Post-hurricane AOB reforms possible. |
| AOB Risk | **MEDIUM** | AOB itself is not banned and post-loss assignments are valid. However, SmartContractor must avoid: (1) acting as public adjuster; (2) guaranteeing claim outcomes; (3) structuring AOB as disguised lending. No specific AOB cancellation period statute found. |
| Public Adjuster Risk | **HIGH** | SC law strictly prohibits contractor/public adjuster dual roles (§ 38-48-70(g)). Unauthorized public adjusting is a serious violation. *Linder v. ICC* established clear boundaries on what constitutes unauthorized practice of law. SmartContractor must implement strict firewalls between repair and claim advocacy functions. |
| Token Collateral Risk | **MEDIUM** | Favorable: SC AG says pure virtual currency activities do not require money transmitter license. Unfavorable: If fiat conversion involved, money transmission licensing may apply. No state-level digital asset lending framework. Federal securities/commodities overlay creates uncertainty. |
| Consumer Protection Risk | **HIGH** | SC Consumer Protection Code (Title 37) provides broad protections. Department of Consumer Affairs has enforcement authority and may regulate escrow activities. Unfair Trade Practices Act (Title 39) applies. Low usury cap creates rebuttable presumption of excess. Must provide clear disclosures. Demonstration/alpha mode strongly recommended before live transactions. |
| Money Transmitter Risk | **LOW-MEDIUM** | Pure crypto activities exempt per SC AG. Risk arises only if fiat currency transmission involved. MT license available through NMLS if needed. |

### Required Disclosures

#### Disclosure 1: Lending License Status
```
IMPORTANT NOTICE: COUNSEL_APPROVED_TEXT_REQUIRED

[SmartContractor] is not licensed as a consumer finance company, supervised lender, 
or mortgage lender in the State of South Carolina. Any financing product offered 
through this platform is provided by a third-party financial institution that holds 
the appropriate licenses. [SmartContractor] acts solely as a technology platform and 
does not make loans, extend credit, or engage in lending activities.

YOUR RIGHTS UNDER SOUTH CAROLINA LAW:
- The legal maximum rate of interest on non-supervised consumer loans is 12% per year.
- Supervised lenders may charge up to 18% per year (or higher rates if properly filed 
  and posted with the Department of Consumer Affairs).
- The general usury cap is 8.75% per annum (SC Code § 34-31-20).
- You have the right to cancel certain credit transactions within applicable time periods.

For questions or complaints, contact:
South Carolina Department of Consumer Affairs
P.O. Box 5757, Columbia, SC 29250 | 803-734-4200
South Carolina Board of Financial Institutions -- Consumer Finance Division
1205 Pendleton Street, Suite 306, Columbia, SC 29201 | 803-734-2020
```

#### Disclosure 2: Assignment of Benefits / Claim Proceeds
```
IMPORTANT NOTICE: COUNSEL_APPROVED_TEXT_REQUIRED

By using this platform, you understand that:
1. You are NOT required to assign your insurance claim or benefits to any contractor, 
   restoration company, or third party.
2. Any assignment of insurance benefits must be made voluntarily and in writing.
3. Assigning your claim takes you out of the claims process and gives control to the 
   assignee.
4. Your mortgage lender may have rights to insurance proceeds that affect any assignment.
5. [SmartContractor] does not negotiate with insurance companies, adjust claims, or act 
   as a public adjuster.
6. If you have questions about your claim, contact your insurance company or a licensed 
   South Carolina public adjuster.

SOUTH CAROLINA LAW:
- Post-loss assignment of insurance benefits may be valid without insurer consent under 
  South Carolina common law (PCS Nitrogen, Inc. v. Continental Cas. Co., 2022).
- Public adjusters must be licensed by the SC Department of Insurance.
- It is unlawful for a public adjuster to also act as your repair contractor on the same 
  claim (SC Code § 38-48-70(g)).
```

#### Disclosure 3: Public Adjuster Boundary
```
IMPORTANT NOTICE: COUNSEL_APPROVED_TEXT_REQUIRED

[SmartContractor] and its contractor partners:
- DO NOT negotiate insurance claims on your behalf
- DO NOT advise you on your insurance coverage
- DO NOT determine whether your claim is covered
- DO NOT act as public adjusters

If you need help with your insurance claim, you may:
- Contact your insurance company directly
- Hire a licensed South Carolina public adjuster
- Consult with an attorney

To verify a public adjuster's license:
South Carolina Department of Insurance
Phone: 803-737-6160
Website: https://doi.sc.gov
```

#### Disclosure 4: Token Collateral Risk
```
IMPORTANT NOTICE: COUNSEL_APPROVED_TEXT_REQUIRED

Digital asset collateral involves significant risks including:
- Price volatility: token value may decline below loan value
- Liquidation: your collateral may be automatically liquidated
- Regulatory uncertainty: state and federal laws may change
- Technology risk: smart contract vulnerabilities

South Carolina has not enacted specific laws regulating digital asset collateral or 
lending. The SC Attorney General has determined that pure virtual currency activities 
do not require a money transmitter license under state law. However, this activity may 
be subject to federal securities, commodities, and money transmission laws.

YOU SHOULD CONSULT WITH AN ATTORNEY BEFORE USING TOKEN COLLATERAL FEATURES.
COUNSEL_APPROVED_TEXT_REQUIRED.
```

#### Disclosure 5: Contractor Licensing Verification
```
IMPORTANT NOTICE: COUNSEL_APPROVED_TEXT_REQUIRED

South Carolina law requires contractors performing work valued at over $5,000 to hold 
a valid license from the South Carolina Contractor's Licensing Board (for commercial 
work) or the Residential Builders Commission (for residential work), both within the 
Department of Labor, Licensing and Regulation (LLR).

Before hiring any contractor through this platform:
- Verify the contractor's license at https://llr.sc.gov
- Confirm the license is active and in good standing
- Ensure the contractor has appropriate insurance
- Request proof of general liability and workers' compensation coverage

Unlicensed contractors cannot file mechanics' liens or enforce contracts in South 
Carolina (SC Code § 40-59-30(B)).

[SmartContractor] verifies contractor licensing status at registration but cannot 
guarantee ongoing compliance. You should verify licensure before work begins.
```

---

## APPENDIX A: Key South Carolina Statutes by Citation

| Citation | Subject |
|----------|---------|
| SC Code § 34-29-10 et seq. | Consumer Finance Law (loans ≤$7,500) |
| SC Code § 34-31-20 | Legal rate of interest (8.75%) |
| SC Code § 34-39-110 et seq. | Deferred Presentment Services Act (payday lending) |
| SC Code § 35-11-105 et seq. | Money Services Act (money transmission) |
| SC Code § 37-1-101 et seq. | Consumer Protection Code |
| SC Code § 37-3-201 | Loan finance charge maximums |
| SC Code § 37-3-502 et seq. | Supervised lender licensing |
| SC Code § 38-48-10 et seq. | Public insurance adjusters |
| SC Code § 38-59-20 | Improper claim practices |
| SC Code § 40-11-10 et seq. | Commercial contractor licensing |
| SC Code § 40-59-10 et seq. | Residential builder licensing |

## APPENDIX B: Key Case Law

| Case | Citation | Holding |
|------|----------|---------|
| *PCS Nitrogen, Inc. v. Continental Cas. Co.* | 871 S.E.2d 590 (S.C. 2022) | Post-loss assignment of insurance benefits valid without insurer consent |
| *Linder v. Insurance Claims Consultants, Inc.* | Opinion No. 25417 (S.C. 2002) | Public adjusters engage in unauthorized practice of law when advising on coverage disputes |

## APPENDIX C: Regulatory Contact Information

| Agency | Address | Phone |
|--------|---------|-------|
| SC Department of Insurance | 1201 Main Street, Suite 1000, Columbia, SC 29201 | 803-737-6160 |
| SC Board of Financial Institutions -- Consumer Finance Division | 1205 Pendleton Street, Suite 306, Columbia, SC 29201 | 803-734-2020 |
| SC Department of Consumer Affairs | P.O. Box 5757, Columbia, SC 29250 | 803-734-4200 |
| SC LLR -- Contractor's Licensing Board | 110 Centerview Drive, Columbia, SC 29210 | 803-896-4500 |
| SC Attorney General -- Money Services Division | Rembert Dennis Building, Columbia, SC | 803-734-3970 |

---

*This compliance file was prepared for research purposes only. It does not constitute legal advice. All SmartContractor products in South Carolina are BLOCKED in DEMO-ONLY mode pending state-specific legal review by qualified South Carolina counsel.*

*Last Updated: 2025-07-02*
