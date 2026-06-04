# SmartContractor Public Homepage Rollback Packet

Status: internal rollback packet. This does not approve public website replacement, public whitepaper publication, PDF publishing, provider outreach, legal conclusions, live Supabase changes, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, GitHub Pages changes, Vercel changes, DNS changes, or edits to public `index.html` / `whitepaper.html`.

Current public file: `index.html`

Local replacement candidate: `index-v1-3-draft.html`

Prepared: 2026-06-03 PT, founder-present evening mode, after local browser QA and post-redaction dry-run diff refresh.

## Purpose

Prepare the rollback path before any future public homepage replacement.

This packet is not a public edit. It records what must be archived, how to restore it without destructive git commands, and which checks must pass before and after any future public replacement.

## Current Snapshot

| Item | Value |
|---|---|
| Current commit at packet prep | `0ba8778d` |
| Current public homepage path | `C:\gcsc\index.html` |
| Candidate draft path | `C:\gcsc\index-v1-3-draft.html` |
| Current public homepage SHA256 | `525B01C407E15D90ACDC7A3141BFC414EBC1459EB23D8D0F13F1B31781B91F2F` |
| Candidate draft SHA256 | `420D751611DBF1844691CFC1B5E0E5245B4372CFAAD9CE08649BC705E9DCAB9A` |
| Dry-run diff shortstat | `1 file changed, 85 insertions, 126 deletions` |
| Public homepage replacement | `NO-GO` |
| Archive file created now | `NO` |
| Public `index.html` edited now | `NO` |

## Required Before Public Edit

| Gate | Required State |
|---|---|
| Founder publication approval | Standalone `PUBLICATION_GO` recorded. |
| Final public diff | Exact diff from approved candidate to public `index.html` reviewed. |
| External asset decision | Tailwind CDN and Google Fonts decision recorded. |
| Final claim scan | No blocked public claims in exact approved copy. |
| Rollback archive path | Archive destination selected before copying. |
| Post-edit browser QA | Desktop, mobile, link/CTA, console, and risky-term checks planned for public replacement file. |

## Proposed Archive Path

Only after `PUBLICATION_GO`, archive the current public homepage to:

```text
docs/public-homepage-archives/index-pre-v1-3-publication-go-2026-06-03.html
```

If the date changes, update the date in the archive filename before the public edit.

## Future Replacement Procedure

Run these only after standalone `PUBLICATION_GO` exists.

```powershell
New-Item -ItemType Directory -Path docs/public-homepage-archives -Force
Copy-Item -LiteralPath index.html -Destination docs/public-homepage-archives/index-pre-v1-3-publication-go-2026-06-03.html
Copy-Item -LiteralPath index-v1-3-draft.html -Destination index.html
```

Do not use `git reset --hard`, `git checkout --`, or destructive cleanup as the publication or rollback mechanism.

## Future Rollback Procedure

Run this only if the future public replacement is approved, executed, and then needs to be reverted.

```powershell
Copy-Item -LiteralPath docs/public-homepage-archives/index-pre-v1-3-publication-go-2026-06-03.html -Destination index.html
```

Then verify:

```powershell
Get-FileHash -Algorithm SHA256 index.html
git diff -- index.html
git diff --check
```

Expected restored SHA256:

```text
525B01C407E15D90ACDC7A3141BFC414EBC1459EB23D8D0F13F1B31781B91F2F
```

## Post-Replacement Verification Checklist

If public replacement is ever approved and executed, verify before commit:

| Check | Required Result |
|---|---|
| `git diff -- index.html` | Exact approved public diff only. |
| `git diff -- whitepaper.html` | Empty unless separately approved. |
| `git diff --check` | Pass. |
| Homepage risky-term scan | No explicit Web3/XPR/FIO/token/stablecoin/escrow/lending/loan/collateral homepage wording unless founder explicitly approved it. |
| Local browser desktop screenshot | New public `index.html` renders without overlap. |
| Local browser mobile screenshot | New public `index.html` renders without horizontal overflow. |
| CTA/link checks | `#mission`, `#products`, `#technology`, `#review`, `whitepaper-v1-3-draft.html`, and `whitepaper.html` behave as intended. |
| Console health | Zero runtime errors; known asset warnings recorded. |
| Commit scope | Public homepage replacement files only. |

## Stop Boundary

Stop before:

- running the future archive or replacement commands without standalone `PUBLICATION_GO`;
- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- publishing a PDF, deck, social post, email, partner packet, investor packet, or announcement;
- contacting providers, attorneys, lenders, insurers, banks, appraisers, regulators, or infrastructure partners;
- claiming legal/provider review is complete;
- enabling real payments, real financing, regulated financial products, external infrastructure integrations, wallet signatures, or production release.

## Working Summary

The rollback path is ready as an internal packet, but no archive or public replacement was executed. Public `index.html` remains unchanged until the founder records standalone `PUBLICATION_GO`.
