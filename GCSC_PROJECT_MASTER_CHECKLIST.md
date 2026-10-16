# GCSC / SmartContractor Master Completion Checklist

Last updated: 2026-08-20 PT

Purpose: one visible source of truth for daily work. Codex should check this file before choosing the next safe GCSC/SmartContractor task.

## Status Legend

| Marker | Meaning |
|---|---|
| ✅ DONE | Completed and verified with evidence/checks. |
| 🟡 IN_PROGRESS | Current active work. |
| ⛔ BLOCKED | Requires founder action, external account, legal/provider decision, more RAM/tooling, live system access, or explicit live-risk approval. |
| ⬜ TODO | Safe local work remains. |
| 🔍 REVIEW | Built/prepared, but independent review or final verification still required. |

## Daily Update Rules

1. Move an item to ✅ only after the acceptance check is actually satisfied.
2. Add the evidence file, command, commit, APK path, request id, or review record in the `Evidence` column.
3. Keep live-risk work ⛔ until the founder is present and the exact approval/evidence gate is satisfied.
4. Do not use this checklist to approve production deploy, public launch, real payments, real loans, escrow release, token collateral, XPR/FIO signatures, legal/provider commitments, or mobile store release.
5. If a task creates code, create/update an `ai-review/records/*.md` record before merge/deploy.

## Current Active Focus

| Status | Priority | Workstream | Task | Owner | Acceptance Check | Evidence |
|---|---:|---|---|---|---|---|
| ✅ DONE | P0 | Mobile Android | Build fresh SmartContractor debug APK from `C:\gcsc-w` with WebAuth session fix | Codex | `app-debug.apk` exists and is built with local debug API config | `C:\gcsc-w\mobile\smartcontractor\android\app\build\outputs\apk\debug\app-debug.apk`; see `C:\gcsc-w\docs\autonomous-status\2026-08-20-mobile-debug-apk-build-status.md` |
| ✅ DONE | P0 | Mobile WebAuth | Verify wallet-first/session-priming code path locally | Codex | WebAuth tests and TypeScript pass | `npm test` = 6/6 pass; `npx tsc --noEmit` = pass in `C:\gcsc-w\mobile\smartcontractor` |
| ⛔ BLOCKED | P0 | Mobile Android | Install debug APK on phone | Codex + Founder | Phone connected, `adb devices -l` shows device, APK exists, `adb install -r` succeeds | APK exists; `adb devices -l` currently shows no connected devices |
| ⬜ TODO | P0 | Mobile Android | Run phone smoke test for fixed WebAuth session | Codex + Founder | Sign in, open lead purchase, no immediate `No WebAuth session` error | Runbook: `C:\gcsc-w\docs\testing\smartcontractor-debug-apk-install-and-wallet-smoke.md` |
| 🔍 REVIEW | P0 | Review Gate | Complete independent review for wallet-first-auth branch | Codex reviewer role / future external reviewer | Review record reaches approved status without self-approval | `C:\gcsc-w\ai-review\records\2026-08-19-wallet-first-auth-sol-ultra.md` currently not final PASS |

## Phase 1 - Local Foundation Cleanup

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ✅ DONE | P0 | Preserve root dirty worktree by using isolated worktree for wallet-first-auth | Work happens outside original dirty root | `C:\gcsc-w`, branch `codex/wallet-first-auth` |
| ⬜ TODO | P0 | Normalize and document uncommitted/generated Android build artifacts | `git status --short --branch` has intentional changes only | Current: `mobile/smartcontractor/package.json`, generated/status docs |
| ⬜ TODO | P0 | Decide whether `mobile/smartcontractor/package.json` script change should stay | `android`/`ios` scripts match native Expo workflow or are reverted with reason | Current diff: `expo start --android` -> `expo run:android` |
| ⬜ TODO | P1 | Create a compact "current state" index to avoid rereading huge docs | One short file points to active checklist, current branch, blockers, next commands | This file starts that role |
| ⬜ TODO | P1 | Add daily closeout discipline | Every workday ends with updated checklist, evidence, next task | Manual until automated safely |

## Phase 2 - Android Build and Device QA

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ✅ DONE | P0 | Finish native Android debug build on current Windows machine | New Architecture build completes without LLVM out-of-memory | `BUILD SUCCESSFUL in 4m 50s`; single-job Ninja prebuild used for heavy native targets |
| ✅ DONE | P0 | Free local build memory safely before retry | No active Java/clang/ninja build processes; enough RAM available | Founder closed large apps; build processes were stopped only when Gradle spawned many `clang++` |
| ✅ DONE | P0 | Retry New Architecture arm64-only build with local API | `BUILD SUCCESSFUL` and debug APK exists | `app-debug.apk`, arm64-v8a, `newArchEnabled=true`, local API base |
| ⬜ TODO | P0 | Use alternative build environment if local RAM remains insufficient | Same source commit builds APK elsewhere; artifact provenance recorded | Not needed for current debug APK, keep as fallback |
| ✅ DONE | P0 | Verify APK signature/debug metadata | `apksigner verify --verbose` passes | `apksigner verify --verbose` = `Verifies`; v2 signature true; 1 signer |
| ⛔ BLOCKED | P0 | Install APK on Pixel/Android phone | `adb install -r` succeeds | Requires phone connected |
| ⬜ TODO | P0 | Start local backend and `adb reverse tcp:10000 tcp:10000` | Phone app reaches local backend, not Railway production | Pending APK/device |
| ⬜ TODO | P0 | WebAuth connect wallet smoke test | WebAuth opens, returns, local session saved | Manual wallet approval only |
| ⬜ TODO | P0 | Lead purchase pre-sign smoke test | Payment sheet reaches WebAuth signing step without immediate missing-session error | Stop before real payment unless explicit testnet-only signing session |
| ⬜ TODO | P1 | Capture Android QA evidence | Status file includes APK path, device model, app version, screenshots/logs if safe | Redact wallet/contact details |

## Phase 3 - Auth, Founder, Admin, RLS

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⛔ BLOCKED | P0 | Complete founder Supabase Auth Magic Link login test | Founder confirms non-secret success/failure status | Founder-only action |
| ⛔ BLOCKED | P0 | Verify real founder Auth user/profile | Founder provides non-secret status; no tokens/links in chat | Founder-only action |
| ⛔ BLOCKED | P0 | Activate founder admin membership | Explicit founder approval after real Auth user review | Live Supabase write blocked |
| ⛔ BLOCKED | P0 | Review strict RLS replacement | Founder reviews exact SQL/evidence before apply | Live Supabase migration blocked |
| ⬜ TODO | P1 | Re-run local auth/admin validators | `npm run check:auth` and relevant admin checks pass | Pending current workspace recheck |
| ⬜ TODO | P1 | Update founder-facing admin runbook | Beginner-safe steps match current UI/backend | Pending revalidation |

## Phase 4 - SmartContractor Product MVP

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⬜ TODO | P0 | Confirm homeowner onboarding happy path | Sign up/sign in/profile/job flow works locally | Browser/device evidence |
| ⬜ TODO | P0 | Confirm contractor onboarding happy path | Contractor profile, bids, job list work locally | Browser/device evidence |
| ⬜ TODO | P0 | Validate job posting and lead purchase UX | No misleading live-money claims; local/testnet boundaries visible | Local QA evidence |
| ⬜ TODO | P1 | Improve profile wallet disconnect/reconnect flow if QA finds issue | User can switch WebAuth account safely | Device QA evidence |
| ⬜ TODO | P1 | Verify request-id traceability in mobile/backend flows | Errors and success responses expose safe request IDs | `npm run check:auth` / manual QA |
| ⬜ TODO | P1 | Confirm offline/PWA shell still works after mobile changes | PWA install/offline checks pass | Existing validators rerun |
| ⬜ TODO | P1 | Update known issues list after phone QA | Founder can see exactly what remains | Checklist and release evidence |

## Phase 5 - Payments, Leads, Loans, Escrow

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⬜ TODO | P0 | Keep all payment flows demo/testnet-gated until legal/provider approval | App copy and backend guards prevent accidental real-money use | No-live-actions validator |
| ⬜ TODO | P0 | Verify lead-token payment endpoint against local/test backend | 402 challenge -> WebAuth signing path -> verification path works in safe test mode | Testnet-only evidence |
| ⛔ BLOCKED | P0 | Real payments / production payment provider | Written founder + provider/legal approval | Live-risk blocked |
| ⛔ BLOCKED | P0 | Real contractor loans / credit decisions | Legal/provider/finance review complete | Live-risk blocked |
| ⛔ BLOCKED | P0 | Real escrow release / repayment routing | Legal/provider/finance review complete | Live-risk blocked |
| ⬜ TODO | P1 | Add/refresh local fake-data tests for repayment waterfall | Deterministic local tests pass without live finance | `npm run` validator evidence |
| ⬜ TODO | P1 | Review all public copy for payment/loan/escrow promises | No guaranteed returns, no unapproved credit/escrow claims | Copy scan evidence |

## Phase 6 - Smart Contracts and XPR

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⬜ TODO | P0 | Revalidate local smart contract module inventory | Current contract files, accounts, tests, blockers listed | Local report |
| ⬜ TODO | P0 | Run local smart contract compile/test/replay validators | Local-only checks pass | Validator outputs |
| ⬜ TODO | P0 | Anti-backdoor / authority review for contracts | No owner drain, unsafe upgrade, or hidden authority issue remains | Review record |
| 🔍 REVIEW | P0 | Independent review of contract deployment readiness | Reviewer confirms local readiness only | No live deployment approval |
| ⛔ BLOCKED | P0 | XPR account creation, authority changes, signatures, WASM deploy | Founder present + explicit approval + evidence | Live-risk blocked |
| ⛔ BLOCKED | P0 | Token collateral / stablecoin settlement | Legal/provider/security review complete | Live-risk blocked |

## Phase 7 - Website, Public Beta, Deploy

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ✅ DONE | P1 | Local homepage/publication gates prepared | Draft and validators exist; public files unchanged | Backlog records many DONE homepage gates |
| ⬜ TODO | P0 | Re-run final local website QA against current candidate | Desktop/mobile, links, claim scan, performance, SEO pass | Current QA evidence |
| ⛔ BLOCKED | P0 | Public homepage replacement | Standalone founder publication decision and rollback evidence | Public-file live boundary |
| ⛔ BLOCKED | P0 | Production deploy / public beta URL | Founder chooses platform/account and approves deploy | External account/live boundary |
| ⛔ BLOCKED | P0 | Public tester invites | Founder approval, invite scope, privacy/support plan | External send/live boundary |
| ⬜ TODO | P1 | Prepare non-secret public beta packet | Founder can review without exposing secrets or unsafe claims | Packet evidence |

## Phase 8 - Legal, Providers, Compliance

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⛔ BLOCKED | P0 | Attorney review for loans/escrow/payment language | Written legal feedback captured safely | Founder/external action |
| ⛔ BLOCKED | P0 | Payment provider / finance provider review | Provider constraints and commitments documented | Founder/external action |
| ⛔ BLOCKED | P0 | Verification provider selection | Provider chosen for identity/license/compliance checks | Founder/external action |
| ⬜ TODO | P1 | Prepare redacted provider/legal review packets | No secrets, no private user data, no unauthorized claims | Local docs |
| ⬜ TODO | P1 | Maintain compliance wording guard | Public/product copy stays conservative | Validator/copy scan |

## Phase 9 - AI Agents and Automation

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⬜ TODO | P1 | Inventory current AI agent scaffolds | CMA/RAA/CA/TA/REA current status documented | Local report |
| ⬜ TODO | P1 | Define local-only agent responsibilities for MVP | Agents cannot approve payments, loans, escrow, legal, or live actions | Architecture doc |
| ⬜ TODO | P1 | Add deterministic validators before agent autonomy | Tests enforce no-live-action and safe routing | Validator outputs |
| ⬜ TODO | P2 | Integrate memory/indexing for token savings | Agent reads compact indexes before large docs | Local-only setup |
| ⬜ TODO | P2 | Evaluate project-management plugin only if needed | Plugin does not require unnecessary paid account or extra token burn | Current recommendation: local Markdown first |

## Phase 10 - Review, Merge, Release

| Status | Priority | Task | Acceptance Check | Evidence |
|---|---:|---|---|---|
| ⬜ TODO | P0 | Every code change has focused tests | Relevant unit/integration checks pass | Exact commands in review record |
| ⬜ TODO | P0 | Every code branch has review record | `ai-review/records/*.md` complete | Review file |
| ⛔ BLOCKED | P0 | Merge to `main` | Review gate PASS and no unresolved P0/P1 | `AI_REVIEW_GATE=PASS` required |
| ⛔ BLOCKED | P0 | Production deploy | Review gate PASS + separate founder approval | Live-risk blocked |
| ⛔ BLOCKED | P0 | Mobile public release | APK/AAB/TestFlight evidence + store/signing/founder approval | Store/live boundary |
| ⬜ TODO | P1 | Create release rollback packet | Restore path, artifact hashes, owners, smoke tests documented | Release evidence |

## Founder Action Queue

| Status | Priority | Founder Action | Why It Matters | Safe Report-Back |
|---|---:|---|---|---|
| ✅ DONE | P0 | Provide/confirm enough RAM or alternative Android build environment | Current APK build fails from LLVM out-of-memory | Founder closed large apps; APK build succeeded locally |
| ⛔ BLOCKED | P0 | Reconnect Android phone when APK exists | Device install and WebAuth QA require USB | "Phone connected and USB debugging allowed" |
| ⛔ BLOCKED | P0 | Complete Supabase Magic Link founder login test | Needed before real admin activation | "Magic Link login passed/failed" without link/token |
| ⛔ BLOCKED | P0 | Decide deploy platform timing | Needed before public beta URL | "Deploy platform decision: ..." |
| ⛔ BLOCKED | P0 | Start attorney/provider review | Required before real loans, escrow, payments, token collateral | "Review started with ..." |
| ⛔ BLOCKED | P1 | Apple Developer / Google Play decisions | Needed for store release, not for local debug APK | "Store account ready/not ready" |

## Today / Next Work Order

1. Reconnect Pixel 8 so `adb devices -l` shows `device`.
2. Install `C:\gcsc-w\mobile\smartcontractor\android\app\build\outputs\apk\debug\app-debug.apk` on the phone.
3. Run WebAuth smoke test against local/debug config.
4. Update this checklist after each verified result.
5. Keep all live-risk items blocked until founder/external approvals are explicit and documented.

## Optional Tooling Decision

Current recommendation: do not connect a new paid/external project-management plugin yet.

Reason: the immediate need is a single always-visible local source of truth. Markdown on the Desktop and in the repo solves that without account setup, cost, external data exposure, or extra automation token burn.

Possible future upgrade:

- Notion / Linear / Asana: useful when outside collaborators join.
- GitHub Issues/Projects: useful when repository workflow becomes PR-based and public/private issue tracking is acceptable.
- Local Codex automation: useful for a short daily status ping, but should be used carefully because frequent heartbeats consume tokens.
