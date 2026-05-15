# Kimi Streams F and N Work Order: API Inventory And Public Artifact Safety

Date: 2026-05-14 PT

Status: internal parallel-agent work order. Safe for Kimi/local agents. Not approval to deploy, publish, or touch live systems.

Purpose: give Kimi two high-leverage parallel work packages that reduce integration risk before many agents start editing the repo:

- Stream F: API contract / OpenAPI inventory.
- Stream N: security, secret-looking value, unsafe public claim, and mojibake scan.

This work order is not legal advice, not security certification, not production readiness approval, not deployment approval, not public launch approval, and not approval for real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, live Supabase changes, external account changes, or secrets handling.

## Required Starting Prompt For Kimi

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Mission: execute only your assigned stream: Stream F API Inventory or Stream N Public Artifact Safety. Do not edit outside your assigned file set.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- docs/gcsc-kimi-stream-f-n-api-and-public-safety-work-order.md
- the source files listed under your assigned stream

Safety:
- No secrets.
- No live Supabase changes.
- No external account changes.
- No real payments, loans, escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal conclusions.
- No public launch.
- Do not edit AGENTS.md, GEMINI.md, .claude/CLAUDE.md, .env, whitepaper.html, index.html, package.json, or deploy/account files unless a later integrator explicitly assigns them.

Output:
- Short Russian summary.
- Files created/modified.
- Exact commands run and result.
- Findings/blockers ranked Critical/High/Medium/Low when relevant.
- Proposed package.json script addition if needed.
- Confirmation that no live/legal/money/external/secrets boundary was crossed.
```

## Parallel Split

Streams F and N are independent and should run in parallel.

| Stream | Owner Group | Purpose | Main Outputs |
| --- | --- | --- | --- |
| F | API inventory agents | Document every local `/api/*` endpoint and its request/response/auth/live-risk boundary | `docs/smartcontractor-openapi-inventory.md`, `docs/smartcontractor-api-contract-v1.yaml`, validator |
| N | Safety scanner agents | Scan public/internal artifacts for secret-looking values, unsafe live claims, and mojibake | `docs/public-artifact-safety-audit.md`, validator |

One integrator later wires npm scripts. Stream agents should propose script names but not edit `construction-ai/package.json` in parallel.

## Stream F: API Contract / OpenAPI Inventory

### Goal

Create a single local API inventory so frontend, QA, Kimi, Codex, Claude, and future provider-review work can see every endpoint, request/response shape, auth mode, request-id behavior, database touchpoint, and live-risk boundary.

### Required Source Files

Stream F must read:

- `construction-ai/server.js`
- `construction-ai/package.json`
- `construction-ai/scripts/validate-auth.mjs`
- `construction-ai/public/smartcontractor.html`
- `docs/gcsc-active-context.md`
- `docs/smartcontractor-backlog.md`
- `docs/smartcontractor-auth-rls-plan.md`
- `docs/smartcontractor-founder-auth-admin-activation-prep.md`
- `docs/smartcontractor-deployment-decision-prep.md`

If route helpers exist under `construction-ai/src/`, read only the route/auth/validation files needed to explain current endpoint behavior.

### Assigned File Set

Stream F may create:

- `docs/smartcontractor-openapi-inventory.md`
- `docs/smartcontractor-api-contract-v1.yaml`
- `construction-ai/scripts/validate-openapi-inventory.mjs`

Stream F may propose, but should not directly apply:

- `"check:openapi-inventory": "node scripts/validate-openapi-inventory.mjs"`

### Inventory Requirements

`docs/smartcontractor-openapi-inventory.md` must include one row per `/api/*` route with:

- method;
- path;
- auth mode: `public`, `optional-auth`, `authenticated`, `admin-required`, `webhook`, or `local-demo`;
- request body summary;
- success response summary;
- error response summary;
- whether response includes `request_id`;
- database tables touched or `none`;
- audit event behavior;
- live-risk boundary;
- source file and approximate route location.

### OpenAPI YAML Requirements

`docs/smartcontractor-api-contract-v1.yaml` must include:

- `openapi: 3.0.3`;
- title `SmartContractor Local API Contract`;
- version `0.1.0-local`;
- server URL `http://localhost:3000`;
- all `/api/*` paths observed in `server.js`;
- reusable schemas for:
  - `RequestIdEnvelope`;
  - `ErrorEnvelope`;
  - `HealthResponse`;
  - `PaymentIntent`;
  - `VerificationCheck`;
  - `SmartContractorProfile`;
  - `Job`;
  - `Bid`;
  - `ProjectContract`;
  - `Milestone`;
  - `LoanRequest`;
  - `Dispute`;
  - `AuditEvent`;
- a clear description that the contract is local/demo-only and does not enable real payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or production money movement.

### Stream F Validator Requirements

`construction-ai/scripts/validate-openapi-inventory.mjs` must:

1. Read `construction-ai/server.js`.
2. Extract or conservatively detect `/api/*` route strings.
3. Read `docs/smartcontractor-openapi-inventory.md`.
4. Read `docs/smartcontractor-api-contract-v1.yaml`.
5. Fail if any route string from `server.js` is missing from the inventory.
6. Fail if any route string from `server.js` is missing from the OpenAPI YAML.
7. Fail if the inventory does not mention `request_id`.
8. Fail if the inventory does not mention blocked live actions:
   - real payments;
   - real loans;
   - real escrow;
   - repayment routing;
   - stablecoin settlement;
   - token collateral.
9. Fail if OpenAPI describes production servers, real credentials, or live provider URLs.
10. Print a PASS summary with route count and missing count.

### Stream F Commands

If the script is not wired into `package.json` yet:

```powershell
cd C:\gcsc\construction-ai
node scripts/validate-openapi-inventory.mjs
npm run check:auth
```

If the integrator wires the script:

```powershell
cd C:\gcsc\construction-ai
npm run check:openapi-inventory
npm run check:auth
npm run check
```

## Stream N: Public Artifact Safety Scan

### Goal

Create a deterministic local safety scanner that catches obvious secret-looking values, unsafe live finance/token/legal claims, public mojibake, and public artifact drift before Kimi creates many new files.

### Required Source Files

Stream N must read:

- `AGENTS.md`
- `docs/gcsc-active-context.md`
- `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`
- `docs/whitepaper-v1-2-claim-review-matrix.md`
- `docs/whitepaper-v1-2-terms-glossary.md`
- `docs/whitepaper-v1-2-public-excerpt-guard.md`
- `docs/whitepaper-v1-2-public-wording-package.md`
- `docs/whitepaper-v1-2-publish-gate.md`
- `whitepaper.html`
- `index.html` if present
- `construction-ai/public/`
- committed docs under `docs/`

Do not scan dependency/build folders unless the integrator assigns that separately.

### Assigned File Set

Stream N may create:

- `docs/public-artifact-safety-audit.md`
- `construction-ai/scripts/validate-public-artifact-safety.mjs`

Stream N may propose, but should not directly apply:

- `"check:public-artifact-safety": "node scripts/validate-public-artifact-safety.mjs"`

### Safety Audit Requirements

`docs/public-artifact-safety-audit.md` must include:

- scan scope;
- excluded folders;
- secret-looking pattern classes checked;
- unsafe public claim classes checked;
- mojibake pattern classes checked;
- findings table with severity, file, line/context, issue, recommendation;
- false-positive allowlist proposal;
- stop boundaries;
- confirmation that no live/external/money/legal action was taken.

Severity rules:

- Critical: probable private key, seed phrase, service-role key, raw database password, live payment key, or wallet secret.
- High: live finance/token/legal claim in public-facing artifact.
- Medium: review-required claim, outdated v1.0 wording, public launch ambiguity, or public file mojibake.
- Low: wording cleanup or documentation consistency issue.

### Stream N Validator Requirements

`construction-ai/scripts/validate-public-artifact-safety.mjs` must:

1. Walk only repo-local committed source/document/public paths assigned by this work order.
2. Exclude:
   - `node_modules`;
   - `.git`;
   - build/output folders;
   - `.tmp`;
   - local backups;
   - binary files;
   - known untracked private/local folders.
3. Fail on obvious secret-looking values:
   - private key block text with values;
   - seed phrase-like long word sequences after secret labels;
   - `service_role` key-looking strings;
   - Stripe live key-looking strings;
   - raw postgres URLs with password;
   - bearer tokens assigned to concrete values.
4. Fail on unsafe public claims outside approved blocked-claim docs:
   - `guaranteed yield`;
   - `token price will increase`;
   - `SEC approved`;
   - `AI approves loans`;
   - `live escrow`;
   - `funds are released automatically`;
   - `instant loan approval`;
   - `real loan activation`;
   - `stablecoin settlement is live`;
   - `token collateral is live`.
5. Fail on common mojibake markers in public HTML/docs.
6. Print a PASS summary with files scanned, skipped files, and findings count.

The validator must be deterministic and local-only. No network calls. No secrets. No live systems.

### Stream N Commands

If the script is not wired into `package.json` yet:

```powershell
cd C:\gcsc\construction-ai
node scripts/validate-public-artifact-safety.mjs
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-public-excerpt-guard
```

If the integrator wires the script:

```powershell
cd C:\gcsc\construction-ai
npm run check:public-artifact-safety
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-public-excerpt-guard
npm run check
```

## File Conflict Rules

- Stream F and Stream N must not edit the same file.
- Neither stream may edit `construction-ai/package.json`; they propose script additions in their reports.
- Neither stream may edit `server.js`.
- Neither stream may edit public copy files such as `whitepaper.html` or `index.html`; they report findings only.
- Neither stream may edit instruction files.
- Both streams must leave live/external/legal/money actions blocked.

## Integration Order

1. Codex reviews Stream N first if it reports Critical or High findings.
2. Codex reviews Stream F route inventory next and wires `check:openapi-inventory`.
3. Codex wires `check:public-artifact-safety` after false positives are reviewed.
4. Codex runs targeted checks, then full `npm run check`.
5. Claude reviews any High/Critical safety findings and the API contract before public beta/deploy decisions.

## Definition Of Done

Streams F and N are done only when:

- assigned docs exist;
- assigned validators exist;
- reports list exact source files read;
- reports list exact commands run;
- package script additions are proposed if not applied;
- no locked files were modified;
- no secrets, external accounts, live Supabase, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, legal conclusions, or public launch actions were touched;
- all relevant checks pass or exact failures are reported with a fix recommendation.

## Stop Conditions

Stop and report instead of continuing if either stream encounters:

- probable real secret material;
- live Supabase credentials or instructions to apply live SQL;
- production payment/provider credentials;
- real loan, escrow, custody, settlement, or repayment activation instructions;
- public legal/regulatory/compliance claims needing attorney review;
- need to edit locked files to complete the assigned stream.
