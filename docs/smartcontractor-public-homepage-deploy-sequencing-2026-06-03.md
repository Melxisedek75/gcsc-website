# SmartContractor Public Homepage Deploy Sequencing

Status: internal founder-present sequencing addendum. This does not approve public website replacement, public whitepaper publication, GitHub Pages changes, Vercel changes, DNS changes, Namecheap changes, Supabase redirect changes, external account setup, public URL sharing, tester invites, production deploy, real payments, real financing, regulated financial products, external infrastructure integrations, provider outreach, legal conclusions, or edits to public `index.html` / `whitepaper.html`.

Prepared: 2026-06-03 PT, founder-present evening mode.

## Purpose

Connect the new homepage v1.3 public-copy work to the existing deployment/public-beta gates without merging approvals that must stay separate.

The main rule is simple:

> Homepage copy approval is not publication approval. Publication approval is not deployment approval. Deployment setup is not public sharing approval.

## Source Documents

- `docs/smartcontractor-public-site-end-of-week-plan-2026-06-03.md`
- `docs/smartcontractor-public-homepage-founder-review-draft-2026-06-03.md`
- `docs/smartcontractor-public-homepage-publication-readiness-2026-06-03.md`
- `docs/smartcontractor-public-homepage-claim-risk-scan-2026-06-03.md`
- `docs/smartcontractor-public-homepage-visual-qa-rollback-checklist-2026-06-03.md`
- `docs/smartcontractor-public-homepage-browser-qa-evidence-status-2026-06-03.md`
- `docs/smartcontractor-public-homepage-local-browser-qa-runbook-2026-06-03.md`
- `docs/smartcontractor-public-homepage-dry-run-replacement-diff-package-2026-06-03.md`
- `docs/smartcontractor-public-homepage-rollback-packet-2026-06-03.md`
- `docs/smartcontractor-homepage-founder-ready-decision-summary-2026-06-03.md`
- `docs/smartcontractor-deployment-decision-prep.md`
- `docs/smartcontractor-deployment-live-action-decision-packet.md`
- `docs/smartcontractor-public-beta-deploy-to-invite-handoff.md`

## Current Decision

| Area | Current State |
|---|---|
| Local homepage draft review | GO |
| Public `index.html` replacement | NO-GO |
| Public `whitepaper.html` replacement | NO-GO |
| GitHub Pages route/settings change | NO-GO |
| Vercel setup or deploy | NO-GO |
| DNS or Namecheap change | NO-GO |
| Supabase redirect change | NO-GO |
| Public URL sharing or tester invite | NO-GO |
| Real finance/provider/external infrastructure action | NO-GO |

## Required Gate Order

| Step | Gate | Required Evidence | Allowed Result |
|---|---|---|---|
| 1 | Copy direction review | Founder records `APPROVE_COPY_DIRECTION_ONLY` or revisions | Continue local draft work only |
| 2 | Section order review | Founder records `APPROVE_SECTION_ORDER_ONLY` or revisions | Continue local QA only |
| 3 | Hidden future infrastructure review | Founder records `APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE` or revisions | Continue copy/claim cleanup only |
| 4 | Browser/visual QA | Desktop, mobile, click, redaction, and issue rows recorded for the local draft | Evidence can support publication review |
| 5 | Final claim scan | No blocked live-loan, escrow, stablecoin, token collateral, partnership, legal, or production claims | Candidate can move to publication packet |
| 6 | Asset and rollback review | Tailwind/Google Fonts/public asset decision plus archive/rollback owner/path | Candidate can move to final replacement request |
| 7 | Homepage publication approval | Standalone `PUBLICATION_GO` recorded after evidence is complete | Future exact-file public replacement package may be prepared |
| 8 | Public file replacement | Separate scoped edit, final diff, final checks, scoped commit | Public homepage changed only after gate 7 |
| 9 | Deployment/external setup review | Existing deployment packet records target, account owner, env owner, rollback owner, latest checks | Founder may review external setup path |
| 10 | External deployment action | `DEPLOYMENT_EXTERNAL_ACTION_RECORDED` with non-secret fields | Founder-controlled external setup only |
| 11 | URL smoke evidence | Deployed commit, URL label, request ID, security headers, no-real-money evidence, rollback/hold decision | URL may move to invite/share review |
| 12 | Invite/share approval | Existing public beta invite/share gate and exact approval phrase | First limited demo-only sharing may be reviewed |

No later gate can be skipped because an earlier gate passed.

## Approval Phrase Separation

| Phrase Or Decision | What It Allows | What It Does Not Allow |
|---|---|---|
| `APPROVE_COPY_DIRECTION_ONLY` | Keep refining local homepage copy and QA packets | No public file edit, deploy, URL sharing, or launch |
| `APPROVE_SECTION_ORDER_ONLY` | Keep the selected section order in local packets | No publication or external action |
| `APPROVE_HIDDEN_FUTURE_INFRASTRUCTURE_LANGUAGE` | Keep future infrastructure generic/private/founder-review-only on homepage copy | No external infrastructure service, partnership, regulated product, wallet, payment, or financing action |
| `PUBLICATION_GO` | Prepare and execute the exact approved public `index.html` replacement package after all evidence is complete | No Vercel setup, DNS change, Supabase redirect, tester invite, public launch, legal/provider approval, or live finance |
| `DEPLOYMENT_EXTERNAL_ACTION_RECORDED` | Founder-controlled external deployment setup review/action with non-secret fields | No public launch, tester invite, production finance, legal/provider commitment, or secret disclosure |
| Public beta invite approval phrase | First reviewed demo-only invite batch after URL smoke evidence | No production launch, broad public sharing, live money, legal/provider commitment, or provider setup |

## Platform Sequencing

### Current Static Public Site

The current static public site remains untouched until `PUBLICATION_GO` is recorded and the exact-file replacement package is prepared.

Do not use GitHub Pages settings as a workaround for missing homepage approval.

### Vercel Public Beta App

Vercel remains the recommended first hosted SmartContractor app target, but it is a separate deployment decision path from homepage copy approval.

Do not import, connect, deploy, enter environment values, update redirects, or share a Vercel URL from this homepage sequencing document.

### Local-Only Review

Local-only review remains the correct state while browser visual QA, final claim scan, asset decision, rollback path, and founder publication approval are incomplete.

## Thursday/Friday Founder Checklist

Use this order for the end-of-week site review:

1. Review the local homepage draft direction.
2. Choose copy direction: approve, revise, or hold.
3. Choose whether hidden generic future infrastructure wording is acceptable.
4. Review browser QA evidence after it is actually captured.
5. Review the final claim scan.
6. Review the public file diff and rollback path.
7. Record `PUBLICATION_GO` only if the founder is ready for a public homepage replacement.
8. After public replacement is complete and verified, review deployment/public URL evidence as a separate topic.

## Stop Boundary

Stop before:

- editing public `index.html`;
- editing public `whitepaper.html`;
- changing GitHub Pages, Vercel, DNS, Namecheap, routing, or deploy settings;
- importing or connecting external accounts;
- entering secrets, service-role keys, provider keys, passwords, tokens, cookies, Magic Link URLs, billing data, or private keys;
- changing Supabase Auth redirects;
- sharing a public beta URL or sending tester invites;
- publishing PDFs, decks, social posts, email campaigns, partner packets, investor packets, or announcements;
- contacting providers, attorneys, Metallicus, XPR, FIO, WebAuth, Metal, LOAN, lenders, escrow providers, insurers, banks, appraisers, or regulators;
- claiming legal/provider review is complete;
- enabling real payments, real financing, regulated financial products, external infrastructure integrations, wallet signatures, production release, or public launch.

## Working Summary

The homepage replacement path and the deployment path are related but separate. The homepage can move through local copy review, claim review, visual QA, rollback prep, and publication approval. Deployment can move through existing Vercel/GitHub Pages/local-only decision gates only after the founder controls external setup. Neither path approves live finance, public launch, legal/provider commitments, or external infrastructure actions.
