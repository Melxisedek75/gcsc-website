# SmartContractor Public Homepage Claim Risk Scan

Status: internal claim-risk scan for local homepage draft. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, or edits to `index.html` / `whitepaper.html`.

Source file scanned: `index-v1-3-draft.html`

Date context: prepared during founder-present evening mode on 2026-06-03 PT.

## Purpose

Run the local homepage draft against the v1.3 claim risk register before any publication decision.

This scan answers:

- which draft lines are safe as internal review language;
- which lines need revision or stronger context before public use;
- which lines must remain blocked until founder/legal/provider/publication approval.

## Scan Method

The scan used the v1.3 claim risk register and searched the local homepage draft for sensitive public terms including Web3, working capital, escrow, loan, payment, stablecoin, token, FIO, XPR, WebAuth, Metal, Metallicus, partner, provider, collateral, settlement, wallet, legal, regulated, underwriting, custody, release, publication, and launch. A post-redaction static scan also ran against explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral terms.

## Overall Result

Current posture: `REVIEW`, not `PUBLICATION_GO`.

No direct standalone claim was identified that GCSC currently originates financing, holds customer funds, moves customer money, guarantees returns, operates regulated financial products, has external infrastructure approval, or is publicly launched.

The draft is directionally safer than the legacy public homepage. Follow-up local copy tightening removed explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral wording from the homepage draft and keeps future infrastructure generic, private, and founder/provider/legal-review-only. The draft still needs founder review and publication evidence before public use because it mentions regulated activity, licensed partners, provider-review data, live payments/financing boundaries, and external infrastructure integrations in review-boundary language.

## Line-Level Findings

| Source Line | Current Pattern | Risk Level | Finding | Required Action Before Public Use |
|---|---|---|---|---|
| 7 | `future reviewed construction infrastructure records` | PASS WITH CONTEXT | Web3 was removed from the meta description, reducing first-impression blockchain risk. | Keep Web3 out of meta copy unless founder approves public positioning. |
| 67 | `partner-reviewed working-capital readiness` and `Future reviewed infrastructure remains a regulated layer` | PASS WITH CONTEXT | This avoids GCSC lending and removes Web3 from the first hero paragraph. | Keep `partner-reviewed`, `readiness`, and future reviewed infrastructure context; do not shorten into live finance language. |
| 78 | `Future Reviewed Infrastructure` in first-viewport visual panel | PASS WITH CONTEXT | The visual panel no longer leads with Web3 language. | Keep specific infrastructure names out of homepage copy unless founder separately approves. |
| 95 | contractors need materials and labor capital | PASS WITH CONTEXT | Explains the business problem without promising a loan. | Keep as problem framing only; do not add `instant`, `approved`, `funded`, or GCSC-lending language. |
| 105 | `Review-ready milestone records help licensed partners` | PASS WITH CONTEXT | Escrow wording was removed while preserving milestone evidence value. | Keep review-ready records language; do not imply GCSC holds, releases, refunds, routes, or moves funds. |
| 115 | `Partners or future licensed entities handle regulated services` | PASS WITH CONTEXT | Separates product workflow from regulated activity. | Keep conditional language; avoid suggesting signed providers or active service availability. |
| 127 | `Future licensed compliance, insurance, identity, valuation, and dispute partners may review structured GCSC records after approval` | PASS WITH CONTEXT | The line avoids financing/payment/escrow wording and keeps the provider path conditional and approval-gated. | Keep `future`, `may`, and `after approval`; do not imply signed providers or active services. |
| 133 | `Future reviewed infrastructure remains a private planning track until legal, provider, and founder approval are complete` | PASS WITH CONTEXT | Specific network/provider names were removed from homepage draft copy. | Keep generic/private wording; do not add logos, partnership badges, or implementation claims. |
| 145 | `Future reviewed infrastructure can support regulated records, identity UX, and audit references only after legal, provider, and founder approval` | PASS WITH CONTEXT | The line avoids settlement execution, money movement, custody, routing, or release language. | Keep approval-gated audit/reference framing only. |
| 157 | AI assists review; sensitive decisions require accountable review | PASS | This directly blocks AI approval of financial, legal, and provider decisions. | Keep this boundary. |
| 183 | `Reputation as readiness data` heading | PASS WITH CONTEXT | The heading no longer suggests active underwriting or credit decisioning. | Keep as readiness/provider-review framing. |
| 184 | contractors can support review for better opportunities through reviewed partners | PASS WITH CONTEXT | The paragraph no longer says contractors qualify; it frames performance as provider-review data. | Keep `reviewed partners`; do not imply loan approval, adverse action, or automated credit decisions. |
| 195 | no publication/provider/live finance/legal launch boundary | PASS | Strong boundary against public launch, provider commitments, live payments, live financing, regulated financial products, external infrastructure integrations, and legal conclusions. | Keep until a separate publication GO record exists. |
| 202 | internal draft not approved for publication | PASS | Correct publication status. | Keep visible while draft remains internal. |

## Recommended Copy Tightening Before Founder Publication Review

| Current Area | Safer Direction |
|---|---|
| Meta description | Applied: Web3 removed from meta description and replaced with future reviewed construction infrastructure records. |
| Hero visual panel | Applied: first-viewport visual text now says `Future Reviewed Infrastructure`. |
| Partner layer | Applied: provider list now says future licensed compliance/insurance/identity/valuation/dispute partners may review records after approval. |
| Technology section | Applied: specific ecosystem and settlement wording was removed; section now says regulated records, identity UX, and audit references only after approval. |
| Reputation section | Applied: heading now says readiness data and paragraph says provider-review data/support review. |

## Blocked Public Claims Not Found In Current Draft

The scan did not identify these blocked claims in `index-v1-3-draft.html`:

- GCSC issues investment tokens.
- GCSC provides or approves financing.
- GCSC holds, releases, refunds, routes, or moves customer funds.
- AI approves loans, releases funds, or makes legal decisions.
- Any regulated financial product is live.
- External infrastructure integrations are approved or live.
- Any named ecosystem, provider, or network has approved GCSC.
- Public launch or production release is approved.

These remain blocked and must not be added during public copy cleanup.

## Founder Review Decision

Recommended current decision: `APPROVE_COPY_DIRECTION_ONLY` or `REQUEST_REVISIONS`.

Do not treat this scan as `PUBLICATION_GO`.

If the founder likes the direction, the next local step is to prepare the final public diff and rollback evidence. Public `index.html` replacement still requires a separate explicit publication GO after all publication readiness evidence is complete.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming legal/provider review is complete;
- enabling real payments, real loans, escrow custody, repayment routing, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production release.
