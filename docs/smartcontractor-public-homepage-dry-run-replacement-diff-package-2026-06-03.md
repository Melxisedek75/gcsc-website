# SmartContractor Public Homepage Dry-Run Replacement Diff Package

Status: internal dry-run replacement package. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Current public file: `index.html`

Local replacement candidate: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Prepare the founder for the exact shape of a future homepage replacement decision without editing the public homepage.

This package answers:

- how much the local draft differs from the current public homepage;
- what public story changes;
- what links and sections change;
- what evidence is still missing;
- what must happen before any future public `index.html` replacement.

## Current Decision

| Area | Decision |
|---|---|
| Prepare dry-run diff package | GO |
| Edit `index-v1-3-draft.html` | HOLD |
| Edit public `index.html` | NO-GO |
| Edit public `whitepaper.html` | NO-GO |
| Publish/deploy/share externally | NO-GO |
| Treat this as visual QA PASS | NO-GO |
| Treat this as legal/provider review | NO-GO |

## Dry-Run Diff Facts

These facts came from a local `git diff --no-index` comparison. No file replacement was performed.

| Item | Result |
|---|---|
| Current public homepage line count | 242 |
| Local draft homepage line count | 200 |
| Dry-run diff shortstat | 1 file changed, 85 insertions, 126 deletions |
| Current public homepage SHA256 | `525B01C407E15D90ACDC7A3141BFC414EBC1459EB23D8D0F13F1B31781B91F2F` |
| Local draft homepage SHA256 | `420D751611DBF1844691CFC1B5E0E5245B4372CFAAD9CE08649BC705E9DCAB9A` |
| Public file edited during this run | NO |
| Draft file edited during this run | NO |
| Publication decision | NO-GO |

## First-Viewport Story Change

| Area | Current Public `index.html` | Candidate `index-v1-3-draft.html` |
|---|---|---|
| Title | `Global Construction Smart Contract - AI Infrastructure for Construction Finance` | `GCSC - Construction Trust Infrastructure` |
| Meta description | Decentralized infrastructure for payments, escrow, contractor reputation, XPR Network | Construction Trust Infrastructure for records, milestones, dispute evidence, partner-reviewed readiness, future reviewed infrastructure |
| First signal | `Building on XPR Network` | `Internal Draft - Not Approved For Publication`, `Publication Gate: NO-GO`, `Scope: No Real Money` |
| Hero promise | Blockchain/escrow/reputation as financial asset | Trust infrastructure for construction workflows |
| Public risk level | Higher blockchain/finance/escrow implication | Lower, with explicit ecosystem/finance terms hidden from homepage draft, but still requires founder/publication review |

## Sensitive Claim Reduction

| Claim Area | Current Public Risk | Candidate Draft Direction |
|---|---|---|
| Blockchain-first promise | Current public page leads with XPR/blockchain language. | Draft leads with construction trust workflow. |
| Escrow / money movement | Current public page says blockchain escrow releases payment after milestones. | Draft says review-ready milestone records help licensed partners/reviewers without custody or release language. |
| Reputation as collateral | Current public page says reputation can become a financial asset/collateral-like signal. | Draft says reputation is readiness/provider-review data. |
| XPR / network-specific language | Current public page frames XPR as core live infrastructure. | Draft hides named network/provider terms from homepage copy and keeps future infrastructure generic/private. |
| Provider/partner claims | Current page implies direct infrastructure execution. | Draft uses future/after-approval/provider-reviewed wording without signed-provider implication. |
| Publication boundary | Current page has no visible draft/publication boundary. | Draft has visible NO-GO/no-real-money boundary. |

## Section And Navigation Change

| Area | Current Public `index.html` | Candidate `index-v1-3-draft.html` |
|---|---|---|
| Nav links | Mission, Products, Technology, Contact | Mission, Products, Technology, Review Gates |
| Review boundary section | Not present as a named section | Present at `#review` |
| Draft whitepaper CTA | Not present | Links to `whitepaper-v1-3-draft.html` |
| Current public whitepaper CTA | Not part of first public homepage path | Preserved as `whitepaper.html` CTA near lower section |
| `#contact` anchor | Public nav points to contact; no `id="contact"` was found in the checked selector results | Removed from draft nav |

## Candidate Draft Strengths

- Keeps public promise traditional-first.
- Removes explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral terms from the homepage draft.
- Keeps working capital as partner-reviewed readiness, not GCSC lending.
- Keeps milestone evidence as review-ready records, not custody or release.
- Adds visible publication/no-real-money status chips.
- Adds explicit review boundary blocking public publication, provider commitments, live payments, live financing, regulated financial products, external infrastructure integrations, legal conclusions, and public launch.

## Candidate Draft Open Risks

| Risk | Why It Still Needs Review |
|---|---|
| Founder still must approve public promise | Local copy direction is safer, but public positioning is a founder decision. |
| Partner layer language remains | Even conditional partner wording can be misread as available service if compressed. |
| Future infrastructure language remains | Generic future infrastructure still needs founder/legal/provider context before public replacement. |
| Visual QA is local-only | Browser screenshot/click/visual evidence exists for local draft, not for a public replacement file after `PUBLICATION_GO`. |
| External assets undecided | Tailwind CDN and Google Fonts still need founder/tech decision before public use. |
| Public replacement not approved | Standalone `PUBLICATION_GO` does not exist. |

## Required Before Any Future Public Edit

| Gate | Required State |
|---|---|
| Founder copy decision | `APPROVE_TRADITIONAL_FIRST_HOMEPAGE_DIRECTION` or revisions recorded |
| Founder section order decision | `APPROVE_SECTION_ORDER_ONLY` or revisions recorded |
| Future infrastructure visibility decision | `APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE` or revisions recorded |
| Local browser QA evidence | `ACCEPT_LOCAL_BROWSER_QA_EVIDENCE` or further QA requested |
| Browser QA evidence | Desktop/mobile/click rows recorded for local draft |
| Redaction review | Complete for any screenshots used |
| Final claim scan | No blocked public claims |
| External asset decision | Tailwind CDN and Google Fonts decision recorded |
| Archive/rollback | Current public homepage archive and restore path ready |
| Publication decision | Standalone `PUBLICATION_GO` recorded |

## Future Replacement Package Shape

Only after all gates above are complete, a separate future package should prepare:

1. current commit hash before public edit;
2. exact archive path for the current public `index.html`;
3. exact diff from current public homepage to approved replacement copy;
4. final claim-risk scan against the exact replacement file;
5. desktop/mobile visual QA evidence;
6. link/CTA browser click evidence;
7. rollback instructions that do not use destructive reset;
8. final verification commands;
9. scoped commit message;
10. founder approval record containing standalone `PUBLICATION_GO`.

This current dry-run package is not that future replacement package.

## Commands Used For Dry Run

These commands were used only for inspection:

```powershell
git diff --no-index --shortstat -- index.html index-v1-3-draft.html
git diff --no-index --stat -- index.html index-v1-3-draft.html
Select-String -Path index.html,index-v1-3-draft.html -Pattern '<title>|meta name="description"|blockchain|Web3|token|loan|escrow|stablecoin|collateral|FIO|XPR|Metallicus|Publication Gate|Internal Draft|No Real Money'
Select-String -Path index-v1-3-draft.html,index.html -Pattern 'id="mission"','id="products"','id="technology"','id="review"','href="#','whitepaper'
Get-FileHash -Algorithm SHA256 index.html,index-v1-3-draft.html
```

No copy, move, deploy, checkout, reset, public edit, or production action was run.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming public replacement QA has passed without post-replacement browser evidence;
- claiming legal/provider review is complete;
- enabling real payments, real financing, regulated financial products, external infrastructure integrations, wallet signatures, or production release.

## Working Summary

The local draft is a meaningful safer replacement candidate for the public homepage, but the replacement remains blocked. It removes explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral homepage wording, adds clear review boundaries, and aligns with the traditional-first direction. Public replacement still requires final public-copy QA, final claim scan, external asset decisions, rollback preparation, and a standalone `PUBLICATION_GO`.
