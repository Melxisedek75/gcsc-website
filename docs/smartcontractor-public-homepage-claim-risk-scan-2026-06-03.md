# SmartContractor Public Homepage Claim Risk Scan

Status: internal claim-risk scan for local homepage draft. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real loans, escrow custody, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, Metallicus/XPR/LOAN partnership claims, or edits to `index.html` / `whitepaper.html`.

Source file scanned: `index-v1-3-draft.html`

Date context: prepared during founder-present evening mode on 2026-06-03 PT.

## Purpose

Run the local homepage draft against the v1.3 claim risk register before any publication decision.

This scan answers:

- which draft lines are safe as internal review language;
- which lines need revision or stronger context before public use;
- which lines must remain blocked until founder/legal/provider/publication approval.

## Scan Method

The scan used the v1.3 claim risk register and searched the local homepage draft for sensitive public terms including Web3, working capital, escrow, loan, payment, stablecoin, token, FIO, XPR, WebAuth, Metal, Metallicus, partner, provider, collateral, settlement, wallet, legal, regulated, underwriting, custody, release, publication, and launch.

## Overall Result

Current posture: `REVIEW`, not `PUBLICATION_GO`.

No direct standalone claim was identified that GCSC currently originates loans, holds escrow, moves customer money, guarantees returns, settles stablecoins, uses token collateral, has Metallicus/XPR/FIO approval, or is publicly launched.

The draft is directionally safer than the legacy public homepage. Follow-up local copy tightening reduced the highest review-level wording around first-viewport Web3 prominence, active provider inference, settlement wording, and underwriting language. The draft still needs founder review and publication evidence before public use because it mentions Web3, licensed partners, lending, settlement, escrow, provider-review data, and named infrastructure candidates.

## Line-Level Findings

| Source Line | Current Pattern | Risk Level | Finding | Required Action Before Public Use |
|---|---|---|---|---|
| 7 | `future reviewed construction infrastructure records` | PASS WITH CONTEXT | Web3 was removed from the meta description, reducing first-impression blockchain risk. | Keep Web3 out of meta copy unless founder approves public positioning. |
| 67 | `partner-reviewed working-capital readiness` and `Future reviewed infrastructure remains a regulated layer` | PASS WITH CONTEXT | This avoids GCSC lending and removes Web3 from the first hero paragraph. | Keep `partner-reviewed`, `readiness`, and future reviewed infrastructure context; do not shorten into live finance language. |
| 78 | `Future Reviewed Infrastructure` in first-viewport visual panel | PASS WITH CONTEXT | The visual panel no longer leads with Web3 language. | Keep Web3 lower on the page as a future reviewed layer. |
| 95 | contractors need materials and labor capital | PASS WITH CONTEXT | Explains the business problem without promising a loan. | Keep as problem framing only; do not add `instant`, `approved`, `funded`, or GCSC-lending language. |
| 105 | `Escrow-ready milestone records help licensed partners` | PASS WITH CONTEXT | Properly says escrow-ready records, not GCSC custody or release. | Keep `escrow-ready` and `licensed partners`; do not imply GCSC holds or releases funds. |
| 115 | `Partners or future licensed entities handle regulated services` | PASS WITH CONTEXT | Separates product workflow from regulated activity. | Keep conditional language; avoid suggesting signed providers or active service availability. |
| 127 | `Future licensed escrow, lending, payment... partners may review structured records after approval` | PASS WITH CONTEXT | The line now makes the provider path conditional and approval-gated. | Keep `future`, `may`, and `after approval`; do not imply signed providers or active services. |
| 133 | FIO, XPR Network, WebAuth, Metal, Metallicus as future candidates | PASS WITH CONTEXT | Uses candidate/review language and avoids partnership approval. | Keep `future infrastructure candidates after review`; do not add logos, partnership badges, or implementation claims. |
| 145 | `audit or settlement references where approved` | PASS WITH CONTEXT | The line remains sensitive but now says references only and requires approval. | Keep lower on page; do not imply settlement execution, money movement, custody, routing, or release. |
| 157 | AI assists review; sensitive decisions require accountable review | PASS | This directly blocks AI approval of loans, funds, legal, escrow, and provider decisions. | Keep this boundary. |
| 183 | `Reputation as readiness data` heading | PASS WITH CONTEXT | The heading no longer suggests active underwriting or credit decisioning. | Keep as readiness/provider-review framing. |
| 184 | contractors can support review for better opportunities through reviewed partners | PASS WITH CONTEXT | The paragraph no longer says contractors qualify; it frames performance as provider-review data. | Keep `reviewed partners`; do not imply loan approval, adverse action, or automated credit decisions. |
| 195 | no publication/provider/live finance/legal launch boundary | PASS | Strong boundary against public launch, real loans, escrow, stablecoin, token collateral, FIO, XPR, legal conclusions. | Keep until a separate publication GO record exists. |
| 202 | internal draft not approved for publication | PASS | Correct publication status. | Keep visible while draft remains internal. |

## Recommended Copy Tightening Before Founder Publication Review

| Current Area | Safer Direction |
|---|---|
| Meta description | Applied: Web3 removed from meta description and replaced with future reviewed construction infrastructure records. |
| Hero visual panel | Applied: first-viewport visual text now says `Future Reviewed Infrastructure`. |
| Partner layer | Applied: provider list now says future licensed partners may review records after approval. |
| Technology section | Applied: settlement wording now says audit or settlement references where approved, not execution. |
| Reputation section | Applied: heading now says readiness data and paragraph says provider-review data/support review. |

## Blocked Public Claims Not Found In Current Draft

The scan did not identify these blocked claims in `index-v1-3-draft.html`:

- GCSC issues investment tokens.
- GCSC provides or approves loans.
- GCSC holds escrow or releases escrow funds.
- AI approves loans, releases funds, or makes legal decisions.
- Stablecoin settlement is live.
- Token collateral is active.
- FIO handles are payment approval.
- Metallicus, XPR, FIO, WebAuth, Metal, or LOAN have approved GCSC.
- Public launch or production release is approved.

These remain blocked and must not be added during public copy cleanup.

## Founder Review Decision

Recommended current decision: `APPROVE_COPY_DIRECTION_ONLY` or `REQUEST_REVISIONS`.

Do not treat this scan as `PUBLICATION_GO`.

If the founder likes the direction, the next local step is to prepare desktop/mobile visual QA and rollback evidence. Public `index.html` replacement still requires a separate explicit publication GO after all publication readiness evidence is complete.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming legal/provider review is complete;
- enabling real payments, real loans, escrow custody, repayment routing, stablecoin settlement, token collateral, wallet signatures, FIO registrations, XPR signatures, or production release.
