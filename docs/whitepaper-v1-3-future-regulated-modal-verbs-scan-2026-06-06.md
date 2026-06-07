# Whitepaper v1.3 Future-Regulated Modal Verbs Scan

Date: 2026-06-06 PT

Status: SCAN_DONE_LOCAL_ONLY

Purpose: source-verify Kimi's recommendation to standardize future-regulated modal verbs across current v1.3 internal/public-draft files, without editing public files or turning review-only wording into publication approval.

This scan does not approve public `index.html` or `whitepaper.html` replacement, PDF/deck/email/social publication, provider outreach, legal conclusions, provider commitments, public beta launch, deployment, live Supabase changes, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, token custody, FIO/XPR actions, production release, or any live action.

## Files Scanned

Core v1.3 source files scanned:

- `docs/whitepaper-v1-3-public-draft.md`
- `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md`
- `docs/whitepaper-v1-3-public-outline.md`
- `docs/whitepaper-v1-3-claim-risk-register.md`
- `docs/whitepaper-v1-3-integration-roadmap.md`
- `docs/whitepaper-v1-3-fio-protocol-integration-brief.md`
- `docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md`
- `docs/whitepaper-v1-3-legal-provider-review-packet.md`
- `docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md`
- `docs/whitepaper-v1-3-homepage-wording-plan.md`
- `docs/whitepaper-v1-3-smartcontractor-wording-alignment.md`
- `docs/whitepaper-v1-3-smartcontractor-wording-review-status.md`

Reference controls checked:

- `docs/working-capital-language-style-guide-review-only.md`
- `docs/gcsc-unified-vocabulary-matrix.md`
- `docs/whitepaper-v1-3-claim-risk-hardening-checklist.md`

## Scan Method

The broad scan covered all `docs/whitepaper-v1-3*.md` files for high-risk modal and approval terms. It found many matches because most v1.3 files are safety checklists that intentionally repeat blocked terms.

The focused scan then checked the core v1.3 source files for modal verbs and regulated terms near:

- `can`, `will`, `supports`, `provides`, `offers`, `ready`;
- `approved`, `live`, `partnership`, `partnered`, `integrated`;
- `loan`, `lending`, `escrow`, `stablecoin`, `token collateral`, `token`, `XPR`, `FIO`, `Metallicus`, `WebAuth`, `provider`, `payment`, `settlement`, `repayment`, `custody`.

Focused core-file counts:

| Term | Count | Interpretation |
| --- | ---: | --- |
| `can` | 39 | Mostly question format, allowed `can prepare`, or internal review-only design language. |
| `will` | 0 | No forced future certainty found in focused files. |
| `supports` | 0 | No present-tense support claim found in focused files. |
| `provides` | 1 | Appears in claim-risk blocked phrase context, not as an approved public claim. |
| `offers` | 0 | No offer-of-regulated-product claim found. |
| `ready` | 29 | Mostly `escrow-ready` / `provider-ready` record language; acceptable when paired with no-custody/no-live context. |
| `approved` | 33 | Mostly blocked phrase, review gate, or explicit not-approved context. |
| `live` | 47 | Mostly no-live boundary language. |
| `partnership` | 23 | Mostly partnership-claim blockers and candidate-infrastructure language. |
| `partnered` | 1 | Appears as a blocked phrase example, not a claim. |
| `integrated` | 1 | Appears in "No provider is approved or integrated" context. |

## Findings

| Finding | Evidence | Verdict |
| --- | --- | --- |
| Public draft uses `GCSC can prepare escrow-ready milestone records without acting as escrow`. | `docs/whitepaper-v1-3-public-draft.md:43`; style guide allows `can prepare` and `escrow-ready record`. | SAFE_WITH_CONTEXT |
| Public draft uses `GCSC can organize working-capital readiness data`. | `docs/whitepaper-v1-3-public-draft.md:49`; style guide allows `can organize` and lender/provider-reviewed readiness data. | SAFE_WITH_CONTEXT |
| Public outline says `partner-powered financing`. | `docs/whitepaper-v1-3-public-outline.md:7`; phrase is not a live approval, but can sound like active partner finance if copied into public hero text. | WATCHLIST_BEFORE_PUBLICATION |
| Hybrid draft uses `partner-approved settlement rail`. | `docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md:350`; internal roadmap context is safe, but public copy should prefer provider-reviewed/future wording unless written approval exists. | WATCHLIST_BEFORE_PUBLICATION |
| Traditional-first appendix includes blocked examples like `GCSC is partnered with Metallicus` and `GCSC can provide licensed lending through Metallicus today`. | `docs/whitepaper-v1-3-traditional-first-web3-ready-appendix.md:68-71`; these are under blocked framing examples. | SAFE_BLOCKED_EXAMPLE |
| Legal/provider packet uses `Can ...?` questions for escrow, FIO, provider and repayment topics. | `docs/whitepaper-v1-3-legal-provider-review-packet.md`; question format is appropriate for reviewer prep. | SAFE_REVIEW_QUESTION |
| Claim-risk register repeats risky phrases such as `GCSC provides contractor loans`, `GCSC holds escrow`, and `Stablecoin settlement is live`. | `docs/whitepaper-v1-3-claim-risk-register.md`; these are explicitly risk/source phrases with safer replacement columns. | SAFE_RISK_REGISTER_CONTEXT |

## Replacement Table

Use these replacements before any public-copy, homepage, PDF, deck, email, social, grant, investor, or provider-send decision:

| Watchlist Wording | Safer Wording |
| --- | --- |
| partner-powered financing | provider-reviewed working-capital readiness path |
| partner-approved settlement rail | future provider-reviewed settlement rail |
| approved provider infrastructure | provider-reviewed infrastructure path, if written approval exists |
| ready for live use | ready for founder/legal/provider review |
| can support repayment routing | can prepare local repayment allocation previews for future provider review |
| can support escrow | can prepare escrow-ready milestone records for licensed provider review |
| can support token collateral | may be reviewed later as a token-collateral path after legal/provider/custody/security approval |
| Metallicus/XPR integration | Metallicus/XPR candidate infrastructure research path |
| FIO payment request | future FIO UX research path |

## Rules For Future Edits

1. `can prepare` and `can organize` are acceptable for local readiness, records, packets, and review evidence.
2. `supports`, `provides`, `offers`, and `ready` should not appear near lending, escrow, payments, stablecoin settlement, token collateral, custody, provider approval, XPR, or FIO unless the sentence clearly says local-only, future, review-required, or blocked-live.
3. `approved`, `GO`, `READY`, `LIVE`, `PASSED`, and `COMPLETE` must not override `BLOCKED_FOR_LIVE`, `NO_PUBLICATION_GO`, or founder/legal/provider review gates.
4. Question packets may use `Can ...?` because the question itself is review prep, not a product claim.
5. Risk registers may quote unsafe phrases only when the same row identifies risk and safer replacement language.

## Next Safe Action

No source draft rewrite is required from this scan. If founder later requests a public-copy pass, apply the replacement table first to `docs/whitepaper-v1-3-public-draft.md`, `docs/whitepaper-v1-3-public-outline.md`, and any homepage/PDF/deck/email/social candidate, then rerun the v1.3 wording validators.

## Closeout

future_regulated_modal_scan_state: SCAN_DONE_LOCAL_ONLY

source_draft_files_changed: no

public_files_changed: no

publication_approved: no

live_actions_taken: no

legal_or_provider_conclusions_made: no
