# GCSC Safe MVP Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one reproducible, local-only SmartContractor MVP in `C:\gcsc` whose code, tests, user flows, and security boundaries are demonstrably consistent, without claiming production readiness or operating any live financial, XPR, Supabase, provider, or app-store system.

**Architecture:** The repository is already a monorepo in practice. The completion target is not a new monorepo migration: it is a verified source-of-truth map around the existing Express service in `construction-ai`, the Expo application in `mobile\smartcontractor`, and the local `proton-tsc` contracts in `contracts\gcsc-core`. Mobile calls a typed API boundary, but the default demo path must stay local/test-only until a separately reviewed backend contract and provenance proof exist. Blockchain-related code remains local simulation and testnet-readiness work, never a deployment or custody workflow.

**Tech Stack:** Node.js 20, Express, static HTML, Expo Router / React Native / TypeScript, AsyncStorage, `proton-tsc`, `@proton/vert`, Mocha, GitHub Actions, Codex + Claude independent review.

---

## Status baseline: audit dated 2026-08-03

This plan is grounded in the checked working tree, not in external folders or claims.

- Active branch: `fix/mobile-webauth-gcsc-owner` at `99f2838a`.
- Working tree is deliberately dirty. Preserve every existing tracked and untracked item. Do not reset, clean, stash, delete, or move it as part of this plan.
- `mobile\smartcontractor` exists and `npx tsc --noEmit` passed on 2026-08-03.
- `construction-ai` contains the local Express API and more than 600 files, including `/api/smartcontractor/jobs`, `/bids`, `/milestones`, `/disputes`, and many readiness endpoints. Its 30,000+ line `server.js` is an implementation risk, not a proof of product completion.
- `npm --prefix construction-ai run check` stopped at `check:android-preflight`. Root cause: `validate-android-wrapper-preflight.mjs` rejects harmless public safety wording such as `service-role key`; it did not reveal a key value.
- `contracts\gcsc-core` has 13 contract sources and five test files. `npm test` did not complete within 124 seconds on Windows and therefore is **UNVERIFIED**, even though older documents claim 31 passing tests.
- `v3`, `v3\routes\stripe-payments.js`, the claimed PostgreSQL schema, and the claimed 87 Jest tests are absent from `C:\gcsc`. Treat every claim about them as `UNPROVEN_EXTERNAL` until source, commit SHA, tests, and a review are imported into this repository.
- Mobile documentation says the remote Railway API lacks marketplace endpoints, while the local Express source implements paths with those names. This is a documented contradiction that must be resolved before any integration work.
- Current GitHub Actions run the mobile TypeScript check and `construction-ai` checks. They do not yet run the core contract build/test suite.

## Completion definition

The word "complete" has two different meanings. This plan completes only the first one.

| State | Meaning | Allowed result |
| --- | --- | --- |
| `SAFE_MVP_COMPLETE` | Reproducible local demonstration of auth-free/demo flows, job, bid, milestone, dispute, local API contract, mobile UI, and contract simulations. | A reviewed repository, green bounded checks, local demo evidence. |
| `PILOT_ELIGIBLE` | Founder has selected environment/provider/legal scope and all external prerequisites have independent evidence. | A decision packet only; no automatic launch. |
| `PRODUCTION_READY` | Legal, security, financial, operational, provider, custody, and deployment approvals are all recorded. | Out of scope for this plan. |

The plan must never label a green local validator as a loan approval, escrow release, testnet deployment, production readiness, or public launch.

## Non-negotiable boundaries

Do not perform any of the following while executing this plan: use secrets; access or alter external accounts; call a live Supabase project; deploy or publish a site; send real payments; create or release real loans/escrow; lock collateral; sign XPR/FIO transactions; create XPR accounts; handle wallet keys; activate a payment provider; make legal/provider commitments; create a mobile release; merge to `main`; or delete user data. Stop with `BLOCKED_FOUNDER` before any such step.

Every code task uses its own `codex/<task>` worktree. The author runs the full declared check set. Claude independently reviews the diff and reruns those checks through `ai-review/coordination/`; the author never approves their own work.

## File map and ownership

| Area | Current source | Required result |
| --- | --- | --- |
| Repository truth | `PROJECT-MAP.md`, `docs/`, `.github/`, Git history | One short, versioned system inventory with a provenance state for each component. |
| Local API | `construction-ai/server.js` | A bounded marketplace API contract, tested independently from live configuration. |
| Validator harness | `construction-ai/scripts/run-checks.mjs`, `construction-ai/scripts/validate-*.mjs` | Fast, deterministic PR checks separated from slow evidence/report generators. |
| Android preflight | `construction-ai/scripts/validate-android-wrapper-preflight.mjs` | Detect an actual credential-shaped value, not words that warn users not to paste one. |
| Mobile application | `mobile/smartcontractor/app/`, `lib/`, `components/` | Explicit local-demo and remote modes with no false claim that local data is cross-user data. |
| Contracts | `contracts/gcsc-core/*.contract.ts`, `test/*.test.ts` | Bounded, deterministic build/test harness and coverage for all 13 local modules. |
| CI | `.github/workflows/mobile-ci.yml`, `.github/workflows/smartcontractor-ci.yml` | Required checks for API, mobile, and contract source with truthful names. |
| Review evidence | `ai-review/records/`, `ai-review/coordination/` | A task record per code change, independent reviewer outcome, and exact command outputs. |

## Execution order

### Task 0: Freeze evidence and establish component provenance

**Files:**
- Create: `docs/architecture/2026-08-system-inventory.md`
- Create: `docs/architecture/2026-08-component-provenance.csv`
- Modify: `PROJECT-MAP.md`
- Test: `construction-ai/scripts/validate-system-inventory.mjs`

- [ ] **Step 1: Record the exact repository baseline.**

Run:

```powershell
git status --short --branch
git rev-parse HEAD
git worktree list --porcelain
```

Expected: the inventory records `99f2838a` only as the observed starting revision, lists all existing worktrees, and explicitly marks the current root dirty.

- [ ] **Step 2: Write a component provenance table.**

Use these statuses only: `LOCAL_SOURCE_VERIFIED`, `LOCAL_ARTIFACT_ONLY`, `EXTERNAL_SOURCE_NOT_PRESENT`, `EXTERNAL_STATE_UNVERIFIED`, `ARCHIVE_OR_REFERENCE`. At minimum classify `construction-ai`, `mobile/smartcontractor`, `contracts/gcsc-core`, `contracts/gcsc-meme`, `gcsctoken111`, `gcscbuild11`, `smartcontractor-mobile`, `xprclaw`, `_collected`, and the alleged `v3` service.

- [ ] **Step 3: Add an inventory validator before changing product code.**

The validator must fail if the system inventory says a component is local source while its required path does not exist, or if it says `testnet deployed` without a linked evidence record and immutable transaction/hash field. It must not call a chain node.

- [ ] **Step 4: Run the validator and commit only the three inventory files.**

Run:

```powershell
npm --prefix construction-ai run check:system-inventory
git add docs/architecture/2026-08-system-inventory.md docs/architecture/2026-08-component-provenance.csv construction-ai/scripts/validate-system-inventory.mjs PROJECT-MAP.md
git commit -m "docs: establish GCSC component provenance"
```

Expected: one scoped commit; no archive is deleted or moved.

### Task 1: Make the validation signal truthful

**Files:**
- Create: `construction-ai/src/validation/public-secret-scan.mjs`
- Create: `construction-ai/test/public-secret-scan.test.mjs`
- Modify: `construction-ai/scripts/validate-android-wrapper-preflight.mjs`
- Modify: `construction-ai/package.json`
- Test: `construction-ai/test/public-secret-scan.test.mjs`

- [ ] **Step 1: Write failing tests for the false-positive boundary.**

The tests must make these assertions explicit:

```js
assert.deepEqual(findPublicSecretFindings('Do not paste a service-role key.'), []);
assert.deepEqual(findPublicSecretFindings('No private key is requested.'), []);
assert.equal(
  findPublicSecretFindings('SUPABASE_SERVICE_ROLE_KEY=sbp_12345678901234567890').length,
  1,
);
assert.equal(
  findPublicSecretFindings('STRIPE_TEST_KEY_PLACEHOLDER').length,
  1,
);
```

- [ ] **Step 2: Run the new test and verify the current scanner fails it.**

Run:

```powershell
node --test construction-ai/test/public-secret-scan.test.mjs
```

Expected: failure proves that a warning phrase is incorrectly treated as a credential.

- [ ] **Step 3: Implement a value-shaped scanner.**

`findPublicSecretFindings(text)` returns findings only for an assignment/value or known credential prefix with a nontrivial value. It must never return raw matched values; report only finding type and byte/line position. Keep the public HTML warnings unchanged.

- [ ] **Step 4: Replace the broad `secretLike.test(content)` call in the Android preflight with `findPublicSecretFindings(content)`.**

Expected: the validator reports the file and finding type, not a guessed secret or any public text.

- [ ] **Step 5: Verify both narrow and aggregate checks.**

Run:

```powershell
node --test construction-ai/test/public-secret-scan.test.mjs
npm --prefix construction-ai run check:android-preflight
npm --prefix construction-ai run check:security-audit
```

Expected: all three pass. A passing result means only that public local assets did not match the defined credential patterns.

- [ ] **Step 6: Open a Claude review task and commit.**

The review task must ask Claude to check that actual secret values are still detected and that no user-facing warning has been weakened.

### Task 2: Split deterministic checks from documentation/evidence generators

**Files:**
- Create: `construction-ai/scripts/check-manifest.mjs`
- Create: `construction-ai/test/check-manifest.test.mjs`
- Modify: `construction-ai/scripts/run-checks.mjs`
- Modify: `construction-ai/package.json`
- Modify: `.github/workflows/smartcontractor-ci.yml`
- Modify: `VALIDATORS.md`

- [ ] **Step 1: Classify every existing `check:*` script as `required`, `optional-local`, `evidence-template`, or `founder-gated`.**

No script may remain in the required list merely because it validates a Markdown template. The classification list is generated from `package.json` and committed as machine-readable JSON.

- [ ] **Step 2: Write a failing manifest test.**

It must fail if `check:required` includes a founder-gated script, if a script is listed twice, or if a declared script is missing from `package.json`.

- [ ] **Step 3: Define three commands with non-overlapping purpose.**

```json
{
  "check:required": "node scripts/run-checks.mjs --group required",
  "check:local-full": "node scripts/run-checks.mjs --group required,optional-local",
  "check:evidence": "node scripts/run-checks.mjs --group evidence-template"
}
```

`check:required` must complete on a Windows runner without network, secrets, or manual evidence. `check:evidence` may produce local reports but cannot be a merge gate.

- [ ] **Step 4: Update CI to run `npm ci` and `npm run check:required`.**

Expected: CI name states exactly what it proved; it does not claim backend/frontend production validation.

- [ ] **Step 5: Run each command twice.**

Run:

```powershell
npm --prefix construction-ai run check:required
npm --prefix construction-ai run check:required
npm --prefix construction-ai run check:local-full
```

Expected: the required command has identical script list and succeeds twice; local-full reports any founder-gated condition as skipped, never as a pass.

### Task 3: Repair the core-contract test harness before adding features

**Files:**
- Create: `contracts/gcsc-core/test/helpers/proton-artifacts.ts`
- Create: `contracts/gcsc-core/test/helpers/proton-artifacts.test.ts`
- Modify: `contracts/gcsc-core/test/gcscadvance1.test.ts`
- Modify: `contracts/gcsc-core/test/gcscclaim111.test.ts`
- Modify: `contracts/gcsc-core/test/gcsccredit11.test.ts`
- Modify: `contracts/gcsc-core/test/gcscrow1111.test.ts`
- Modify: `contracts/gcsc-core/test/gcscworkcap1.test.ts`
- Modify: `contracts/gcsc-core/package.json`
- Modify: `.github/workflows/smartcontractor-ci.yml`

- [ ] **Step 1: Measure each existing file separately with a hard diagnostic timeout.**

Run each test file with `mocha --require ts-node/register --reporter spec --timeout 60000`. Record elapsed time, result, and generated path in `docs/architecture/2026-08-contract-test-baseline.md`. Do not call external compilers or chains.

- [ ] **Step 2: Write the helper test first.**

The helper must cache artifacts by contract source SHA in an operating-system temporary directory, not under `test/.vert*`, and must reuse a cache only when the source SHA and `proton-asc` version match.

- [ ] **Step 3: Replace duplicated `cleanGenerated`, recursive artifact search, copy, and `npx proton-asc` functions in the five files with the helper.**

The helper uses the repository's pinned local binary path and an explicit child-process timeout. It returns `{ abi, wasm, sourceSha }`; no test may scan an unbounded directory tree for arbitrary artifacts.

- [ ] **Step 4: Add scripts.**

```json
{
  "test:unit": "mocha --require ts-node/register --timeout 60000 test/**/*.test.ts",
  "test:one": "mocha --require ts-node/register --timeout 60000"
}
```

- [ ] **Step 5: Verify bounded completion twice, then add it to CI.**

Run:

```powershell
npm --prefix contracts/gcsc-core run build
npm --prefix contracts/gcsc-core run test:unit
npm --prefix contracts/gcsc-core run test:unit
```

Expected: all files finish; the result states exact test count and duration. A timeout is a test-harness failure, not a partial pass.

### Task 4: Close contract coverage gaps one module at a time

**Files:**
- Create: `contracts/gcsc-core/test/gcsctoken111.test.ts`
- Create: `contracts/gcsc-core/test/gcscstable11.test.ts`
- Create: `contracts/gcsc-core/test/gcscmember11.test.ts`
- Create: `contracts/gcsc-core/test/gcsclead1111.test.ts`
- Create: `contracts/gcsc-core/test/gcscstake111.test.ts`
- Create: `contracts/gcsc-core/test/gcsctreasry1.test.ts`
- Create: `contracts/gcsc-core/test/gcscrealty11.test.ts`
- Create: `contracts/gcsc-core/test/gcscinsure11.test.ts`
- Modify: `contracts/gcsc-core/DEPLOYMENT-READINESS.md`

- [ ] **Step 1: For each module, write authorization and invalid-state tests before its happy path.**

Every test file must cover: unauthorized action rejection; invalid asset/symbol/precision rejection where relevant; state transition rejection; bound/cap rejection; and a successful local state update. No test may transfer a real asset or submit a chain transaction.

- [ ] **Step 2: Cover the modules in risk order.**

1. `gcsctoken111` and `gcscstable11`: issuance caps, authorized issuer/minter, transfer/open/close behavior.
2. `gcscrow1111`: re-check funding, release, dispute, duplicate, and unauthorized paths after harness changes.
3. `gcsctreasry1`, `gcsclead1111`, `gcscstake111`: authority, quorum, lock/reward bounds.
4. `gcscmember11`, `gcscinsure11`, `gcscrealty11`: membership state, policy/claim state, investment/income/refund state.

- [ ] **Step 3: Update deployment readiness only with measured evidence.**

Replace historical `PASS` fields with the date, command, test count, duration, commit SHA, and `LOCAL_ONLY` scope. Keep all network items blocked.

- [ ] **Step 4: Require independent smart-contract review.**

Claude's record must inspect authority tables, inline transfer permissions, amount calculations, overflow behavior, rollback impossibility, and every new test's negative cases. Any P0/P1 ends the task until fixed and re-reviewed.

### Task 5: Reconcile the API contract before connecting the mobile marketplace

**Files:**
- Create: `docs/api/smartcontractor-openapi.local.yaml`
- Create: `docs/api/smartcontractor-api-provenance.md`
- Create: `construction-ai/test/smartcontractor-api-contract.test.mjs`
- Modify: `construction-ai/server.js`
- Modify: `mobile/smartcontractor/lib/api.ts`
- Modify: `mobile/smartcontractor/README.md`

- [ ] **Step 1: Resolve the source contradiction in writing.**

The provenance document compares each endpoint asserted in the mobile README with the actual local Express route, response shape, authentication requirement, persistence dependency, and test state. The Railway URL is recorded as `EXTERNAL_STATE_UNVERIFIED`; do not call it.

- [ ] **Step 2: Write the local OpenAPI contract for exactly these demo endpoints.**

`GET/POST /api/smartcontractor/jobs`, `GET/POST /api/smartcontractor/bids`, `GET/POST /api/smartcontractor/milestones`, `GET/POST /api/smartcontractor/disputes`, and `GET /api/health`. Each schema includes `request_id`, explicit `demo_only`, ownership rules, and errors. It excludes payment, loan, collateral, escrow custody, and chain-signing endpoints.

- [ ] **Step 3: Add contract tests using an in-process Express app and local fixtures.**

Test 401/403, malformed payload, cross-user ownership attempt, state-transition conflict, and successful local fixture request. The tests must not load `.env`, create Supabase clients, or make HTTP calls outside `127.0.0.1`.

- [ ] **Step 4: Make the mobile API client consume only the documented shapes.**

Use one typed response envelope:

```ts
export type ApiEnvelope<T> = {
  data: T;
  request_id: string;
  demo_only: true;
};
```

If a server response lacks `demo_only: true`, the demo client fails closed with a visible local error. Do not use a production URL as the default.

- [ ] **Step 5: Align documentation and run the contract suite.**

Run:

```powershell
node --test construction-ai/test/smartcontractor-api-contract.test.mjs
npx --prefix mobile/smartcontractor tsc --noEmit
```

Expected: the README no longer claims endpoints are both absent and implemented; no live backend is contacted.

### Task 6: Replace ambiguous local mobile data with an explicit repository boundary

**Files:**
- Create: `mobile/smartcontractor/lib/repositories/types.ts`
- Create: `mobile/smartcontractor/lib/repositories/local-marketplace.ts`
- Create: `mobile/smartcontractor/lib/repositories/api-marketplace.ts`
- Create: `mobile/smartcontractor/lib/repositories/index.ts`
- Create: `mobile/smartcontractor/test/repositories/local-marketplace.test.ts`
- Modify: `mobile/smartcontractor/lib/jobs.ts`
- Modify: `mobile/smartcontractor/lib/bids.ts`
- Modify: `mobile/smartcontractor/lib/disputes.ts`
- Modify: affected route files under `mobile/smartcontractor/app/`

- [ ] **Step 1: Define the local-only interface before moving UI calls.**

```ts
export interface MarketplaceRepository {
  readonly mode: 'local-demo' | 'api-demo';
  listJobs(): Promise<Job[]>;
  createJob(input: CreateJobInput): Promise<Job>;
  listBids(jobId: string): Promise<Bid[]>;
  submitBid(input: SubmitBidInput): Promise<Bid>;
  createDispute(input: CreateDisputeInput): Promise<Dispute>;
}
```

All domain record types must carry `mode` and `demoOnly: true`. They must not contain transaction IDs that imply a completed transfer.

- [ ] **Step 2: Write local repository tests.**

Test stable ordering, owner isolation, duplicate bid replacement, invalid transition rejection, and local-storage recovery. Use a fake AsyncStorage adapter; do not run against a device or remote service.

- [ ] **Step 3: Move the existing AsyncStorage behavior behind `local-marketplace.ts`.**

The screens use the interface only. Existing strings that say a bid "opens escrow" or "releases" money change to `demo workflow prepared` unless a verified local state machine supports the claim.

- [ ] **Step 4: Implement `api-marketplace.ts` only after Task 5 contract tests are green.**

It may call an explicit local address configured for tests. It must reject any HTTPS public host, private network host other than loopback, or response without `demo_only: true`.

- [ ] **Step 5: Verify mobile code and test suite twice.**

Run:

```powershell
npx --prefix mobile/smartcontractor tsc --noEmit
npm --prefix mobile/smartcontractor run test
npm --prefix mobile/smartcontractor run test
```

Expected: one deterministic demo journey works with either repository; it never becomes a payment or custody path.

### Task 7: Test the mobile application without a wallet or production backend

**Files:**
- Create: `mobile/smartcontractor/jest.config.js`
- Create: `mobile/smartcontractor/test/payments.test.ts`
- Create: `mobile/smartcontractor/test/webauth.test.ts`
- Create: `mobile/smartcontractor/test/routes.test.tsx`
- Modify: `mobile/smartcontractor/package.json`
- Modify: `mobile/smartcontractor/lib/payments.ts`
- Modify: `mobile/smartcontractor/lib/webauth.ts`

- [ ] **Step 1: Add `jest-expo` and testing-library only after recording the package versions and lockfile diff.**

No blanket dependency upgrade is permitted. The first test run must fail because the tests do not yet exist or the adapter is not wired.

- [ ] **Step 2: Inject a signer interface.**

```ts
export interface WalletSigner {
  connect(): Promise<{ account: string; permission: string }>;
  signTransfer(input: TransferRequest): Promise<{ transactionId: string }>;
}
```

The test double returns a fake transaction ID. Production WebAuth code is selected only by a runtime adapter; tests never open a URI, deep link, or XPR endpoint.

- [ ] **Step 3: Test failures, not only success.**

Cover missing session; callback with mismatched correlation ID; account-switch session reset; API 402 parsed but not retried against a public endpoint; local-demo payment attempt rejected; and loading/error state cleanup.

- [ ] **Step 4: Add static Android export as a separate non-release check.**

Run:

```powershell
npx --prefix mobile/smartcontractor expo export --platform android --output-dir .tmp/export-android-safe-mvp
```

Expected: bundle generation only. It is not an APK, EAS build, store artifact, wallet test, or release approval.

### Task 8: Reduce the Express monolith before extending behaviour

**Files:**
- Create: `construction-ai/src/api/app.mjs`
- Create: `construction-ai/src/api/routes/health.mjs`
- Create: `construction-ai/src/api/routes/marketplace.mjs`
- Create: `construction-ai/src/api/routes/readiness.mjs`
- Create: `construction-ai/src/api/middleware/request-context.mjs`
- Create: `construction-ai/src/api/middleware/demo-boundary.mjs`
- Modify: `construction-ai/server.js`
- Test: `construction-ai/test/api/*.test.mjs`

- [ ] **Step 1: Add characterization tests to the currently used local endpoints before extracting them.**

For `/api/health`, marketplace demo routes, and one readiness endpoint, assert status code, response content type, request ID behavior, and no-secret error redaction.

- [ ] **Step 2: Extract only those tested route groups into the new modules.**

`server.js` remains the entry point in this task. Do not refactor every readiness template or modify unrelated routes.

- [ ] **Step 3: Centralize the demo boundary.**

`demo-boundary.mjs` returns HTTP 409 for payment, loan, collateral, custody, provider webhook processing, or signing-related calls when local demo mode is active. It does not silently simulate a money transfer.

- [ ] **Step 4: Run characterization, required checks, and source-size report.**

Expected: exact endpoint behavior is unchanged for permitted local demos, while the server entry file has fewer responsibility groups. The report is informational, not a production-readiness metric.

### Task 9: Make CI a real gate for local source

**Files:**
- Create: `.github/workflows/contracts-ci.yml`
- Modify: `.github/workflows/mobile-ci.yml`
- Modify: `.github/workflows/smartcontractor-ci.yml`
- Create: `docs/ci/local-gate-matrix.md`

- [ ] **Step 1: Add a contract CI workflow.**

It installs the lockfile-resolved dependencies, runs `npm run build` and `npm run test:unit` under an explicit timeout, and uploads only redacted test summaries. It has no deployment token or wallet input.

- [ ] **Step 2: Add mobile unit tests to the existing typecheck workflow.**

The job sequence is `npm ci`, `npx tsc --noEmit`, `npm test`, then optional static Expo export. The export is marked non-release.

- [ ] **Step 3: Change the SmartContractor workflow to `check:required`.**

Do not run evidence-template and founder-gated scripts as if they were deterministic CI tests.

- [ ] **Step 4: Document the gate matrix.**

For every required command list owner, input source, network expectation, artifacts, timeout, and the exact claim supported by a pass.

### Task 10: Evidence, review, and release discipline

**Files:**
- Create: `docs/evidence/safe-mvp-evidence-index.md`
- Create: `docs/release/safe-mvp-go-no-go.md`
- Modify: `AI-REVIEW-GATE.md` only if the current protocol lacks a requirement above
- Create: one task file per implementation in `ai-review/coordination/inbox/claude/`
- Create: one review record per implementation in `ai-review/records/`

- [ ] **Step 1: Create a single evidence index.**

Each entry includes task ID, author, reviewer, branch, full SHA, paths, exact commands, duration, outcome, and scope statement. A missing command result is `NOT_RUN`, never `PASS`.

- [ ] **Step 2: Create a safe-MVP go/no-go document.**

The go criteria are: provenance inventory current; required local checks green twice; mobile route/unit tests green; contracts build/tests green with measured coverage; API contract green; independent reviews approved; no high/critical unresolved issue. The document must state `NOT AUTHORIZATION FOR DEPLOYMENT`.

- [ ] **Step 3: Enforce the two-agent rule.**

CODEX authors only on dedicated branches. CLAUDE reviews through a separate worktree, reruns checks, and writes `APPROVED` or `CHANGES_REQUESTED`. No branch is merged by either agent.

### Task 11: Founder-only decisions after SAFE_MVP_COMPLETE

**Files:**
- Create: `docs/founder/production-decision-register.md`
- Create: `docs/founder/external-source-intake-checklist.md`

- [ ] **Step 1: Convert every remaining external dependency into one founder decision.**

Rows must include: live backend owner and source repository; legal scope; payment provider; lender/provider; Supabase environment; testnet account evidence; deployment host; domain; mobile signing; independent security audit; and public copy approval.

- [ ] **Step 2: Require evidence before promotion.**

For an external source, require local import or a cryptographic commit reference, licence, owner confirmation, dependency audit, test command, and independent code review. For a testnet claim, require account, network, transaction ID/code hash, date, command, and reviewer. This task does not query the chain or sign anything.

- [ ] **Step 3: Stop.**

The next action is a founder choice, not automatic execution. Any real payment, loan, escrow, stablecoin, collateral, XPR/FIO, provider, Supabase, release, or public deployment is `BLOCKED_FOUNDER`.

## Acceptance matrix

| Area | Completion evidence | Must never be inferred from it |
| --- | --- | --- |
| Android preflight | Value-shaped credential scan and tests pass. | Public app has no security risk at all. |
| API | Contract tests pass against in-process local app. | Railway/production API matches it. |
| Mobile | Typecheck, unit tests, local demo flow, static export pass. | Device wallet or payment flow works. |
| Contracts | Pinned local build/test pass twice with coverage. | Testnet/mainnet deployment or audit approval. |
| CI | Required workflows are green. | Legal, provider, or finance clearance. |
| Cross-review | Claude approves an exact diff. | Authorization to merge/deploy. |

## Explicit anti-patterns this plan forbids

1. Calling a missing external `v3` folder a backend implementation.
2. Treating a compiled WASM file as a deployed contract.
3. Treating a validator count as test coverage or product functionality.
4. Treating an Android or Expo build as a store release.
5. Writing UI language that says funds, escrow, collateral, or loan state changed when the data is only local.
6. Moving three codebases into a new directory before their contracts, source ownership, and tests are verified.
7. Using an external URL, secret, account, or wallet to make a green screenshot.
8. Approving the author’s own code or merging a review branch automatically.

## Self-review of this plan

- Scope coverage: source provenance, tests, validator correctness, contracts, local API, mobile data boundary, mobile testability, monolith reduction, CI, independent review, and founder-only actions each have a task.
- No silent production path: every phase either stays local or ends in an explicit founder gate.
- No external-source assumption: `v3`, PostgreSQL, Stripe, external Railway, and XPR deployment claims require separate evidence before work begins.
- No monorepo churn: the existing root is used; a restructuring task is intentionally absent until the system inventory and local tests prove a need.

## Execution handoff

Execute Tasks 0-2 first. They turn the current repository from an unverified accumulation of validators and claims into a trustworthy starting point. Do not begin Tasks 3-9 in parallel with Tasks 0-2 because their acceptance conditions depend on the resulting provenance, deterministic checks, and CI vocabulary.
