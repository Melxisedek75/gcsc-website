# GCSC Kimi + Claude + Codex Handoff Bundle Manifest

Date: 2026-05-14 PT

Status: single bundle manifest for the founder.

Purpose: show exactly which files belong in the Kimi -> Claude -> Codex acceleration bundle, who receives each file, and what each file is for.

This manifest does not approve deployment, public launch, live Supabase changes, external account changes, legal decisions, provider commitments, real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, XPR signatures, app-store actions, secrets handling, or destructive actions.

## Fastest Path

1. Start with `docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md`.
2. From `C:\gcsc\construction-ai`, run `npm run prepare:kimi-handoff-bundle` if you want a timestamped local bundle folder under `C:\gcsc\.tmp\`.
3. Keep the generated `bundle-files.json` with the bundle; it records SHA-256 checksums and byte counts for every copied file.
4. Run `npm run prepare:kimi-agent-prompts` if you want 100 individual Kimi worker prompt files under `C:\gcsc\.tmp\kimi-wave-one-agent-prompts-...`.
5. Give Kimi the Kimi files listed below plus the generated worker prompt files if Kimi can distribute them.
6. Save Kimi controller summary and worker reports.
7. From `C:\gcsc\construction-ai`, run `npm run prepare:kimi-output-intake` if you want a timestamped local intake folder for Kimi outputs, Claude verdicts, and Codex merge notes.
8. Run `npm run summarize:kimi-output-intake` to count the saved files and catch obvious secret/live-risk wording before review.
9. Run `npm run audit:kimi-worker-reports` to check required worker report fields, stream mismatches, missing expected reports, and unsafe live/legal/money wording before Claude review.
10. Run `npm run prepare:claude-kimi-audit-bundle` if you want a timestamped Claude audit folder with templates, `CLAUDE-AUDIT-PROMPT.txt`, and a safe `kimi-output-to-add` folder.
11. Run `npm run prepare:kimi-merge-queue` to create the dated Codex integration queue before any accepted stream is staged.
12. Give Claude the Claude audit files plus Kimi outputs.
13. Give Codex only Claude-approved local outputs for integration.

## Kimi Bundle

| Order | File | Purpose |
| ---:| --- | --- |
| 1 | `AGENTS.md` | project rules, safety boundaries, Russian founder context |
| 2 | `docs/gcsc-active-context.md` | current project source-of-truth links and readiness |
| 3 | `docs/gcsc-kimi-wave-one-founder-handoff-index-2026-05-14.md` | current 100-agent allocation and stream map |
| 4 | `docs/gcsc-kimi-claude-codex-accelerated-build-master-plan-2026-05-15.md` | exact seven-day Kimi/Claude/Codex execution plan, intake commands, stream integration rules, and rework routing |
| 5 | `docs/gcsc-kimi-wave-one-launch-ready-brief-2026-05-15.md` | one-page pre-flight brief before founder-controlled Kimi launch |
| 6 | `docs/gcsc-kimi-wave-one-founder-copy-paste-prompt-2026-05-15.md` | one-message founder prompt to paste into Kimi after upload |
| 7 | `docs/gcsc-kimi-wave-one-controller-launch-packet-2026-05-14.md` | longer Kimi controller prompt and execution rhythm |
| 8 | `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md` | original full parallel execution audit and workstream breakdown |
| 9 | `docs/gcsc-kimi-100-agent-dispatch-board-2026-05-14.md` | older dispatch board, useful for wave mechanics and report format |
| 10 | `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md` | intake criteria Kimi must satisfy before Codex/Claude review |
| 11 | `docs/gcsc-kimi-wave-one-progress-tracker-2026-05-14.md` | shared status board for 100-agent progress, hard stops, Claude verdicts, and Codex intake |
| 12 | `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md` | required worker report structure so Claude/Codex can audit outputs quickly |
| 13 | `docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md` | required Claude audit structure for post-Kimi review |
| 14 | `docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md` | Stream A work order |
| 15 | `docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md` | Streams F/N work order |
| 16 | `docs/gcsc-kimi-stream-j-smart-contract-local-build-map-work-order.md` | Stream J work order |
| 17 | `docs/gcsc-kimi-stream-h-auth-rls-admin-work-order.md` | Stream H work order |
| 18 | `docs/gcsc-kimi-stream-i-deployment-public-beta-work-order.md` | Stream I work order |
| 19 | `docs/gcsc-kimi-stream-o-investor-partner-alignment-work-order.md` | Stream O work order |
| 20 | `docs/gcsc-kimi-stream-m-mobile-readiness-work-order.md` | Stream M work order |
| 21 | `docs/gcsc-kimi-stream-k-contract-backed-loan-implementation-work-order.md` | Stream K work order |
| 22 | `docs/gcsc-kimi-stream-l-legal-provider-review-work-order.md` | Stream L work order |
| 23 | `docs/gcsc-kimi-claude-codex-handoff-bundle-manifest-2026-05-14.md` | this bundle manifest for file routing and role ownership |

## Claude Bundle

Give Claude these files after Kimi returns:

| Order | File | Purpose |
| ---:| --- | --- |
| 1 | `AGENTS.md` | project rules and no-live-action boundaries |
| 2 | `docs/gcsc-active-context.md` | current readiness and source docs |
| 3 | `docs/gcsc-claude-kimi-output-audit-work-order-2026-05-14.md` | Claude's independent audit assignment |
| 4 | `docs/gcsc-kimi-output-integration-intake-checklist-2026-05-14.md` | intake acceptance and rejection states |
| 5 | `docs/gcsc-kimi-worker-output-package-template-2026-05-14.md` | required report fields Claude must enforce |
| 6 | `docs/gcsc-claude-kimi-audit-report-template-2026-05-14.md` | required Claude audit output structure |
| 7 | Kimi controller summary | what Kimi says it completed |
| 8 | Kimi worker reports | per-agent evidence |
| 9 | Kimi-created local files | draft outputs for inspection |

Claude should return exactly one audit report with stream verdicts.

## Codex Bundle

Give Codex:

| File Type | Required | Why |
| --- | --- | --- |
| Kimi controller summary | yes | high-level result map |
| Kimi worker reports for accepted streams | yes | evidence and file provenance |
| Kimi-created files for accepted streams | yes | integration candidates |
| Claude audit report | yes | independent risk review |
| Codex merge queue template | yes | final intake queue before scoped commits |
| rejected/rework stream list | yes | prevents accidental merge |

Codex should not receive secrets or private live account values. Codex will run local checks and commit only scoped safe files.

Codex should create its merge queue using `docs/gcsc-codex-kimi-integration-merge-queue-template-2026-05-14.md` before staging any accepted Kimi output.

## Bundle Ownership

| Role | Owns | Does Not Own |
| --- | --- | --- |
| Founder | starting Kimi/Claude chats and withholding secrets | live approvals inside Kimi/Claude |
| Kimi | volume drafting, inventory, and report generation | final integration, live actions, legal conclusions |
| Claude | independent review and risk classification | final integration or live approval |
| Codex | integration, validators, scoped commits, pushes | external accounts, secrets, live money/legal decisions |

## Stop If Any Output Contains

- passwords, keys, tokens, Magic Link URLs, wallet material, service-role values, provider credentials, or environment values;
- live Supabase writes, live RLS apply, admin membership insert, production SQL, XPR signature, deployment, app-store action, or external account change;
- legal approval, lender approval, escrow readiness, production readiness, public launch readiness, token collateral readiness, stablecoin readiness, or real-money readiness claims;
- public website, public whitepaper, deck, email, social, grant, investor, or outreach edits.

## Current Recommended Next Action

Use `docs/gcsc-founder-kimi-claude-quick-start-2026-05-14.md` now. It is the shortest founder-facing file and points to this manifest when the full bundle is needed.
