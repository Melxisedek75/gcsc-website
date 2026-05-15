# Kimi Stream A Work Order: Public Whitepaper v1.2 Draft

Date: 2026-05-14 PT

Status: internal parallel-agent work order. Safe for Kimi/local agents. Not approval to publish.

Purpose: give Kimi a precise Stream A package for creating the internal public-facing GCSC / SmartContractor v1.2 whitepaper draft quickly, with strict file ownership, source references, claim boundaries, validator requirements, and review gates.

This work order is not legal advice, not financial advice, not securities advice, not lending approval, not escrow approval, not deployment approval, not public launch approval, and not approval for real payments, real loans, repayment routing, stablecoin settlement, token collateral, live Supabase changes, external account changes, or secrets handling.

## Required Starting Prompt For Kimi

```text
You are working in C:\gcsc on GCSC / SmartContractor.

Language for reports: Russian.

Mission: execute Stream A only: create an internal public whitepaper v1.2 draft package. Do not publish it. Do not edit live/public files.

Read first:
- AGENTS.md
- docs/gcsc-active-context.md
- docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md
- docs/gcsc-kimi-stream-a-whitepaper-v1-2-public-draft-work-order.md
- every source file listed in "Required Source Files"

Safety:
- No secrets.
- No live Supabase changes.
- No external account changes.
- No real payments, loans, escrow, repayment routing, stablecoin settlement, or token collateral.
- No legal conclusions.
- No public launch.
- Do not edit files outside your assigned file set.
- Do not edit whitepaper.html, index.html, AGENTS.md, GEMINI.md, .claude/CLAUDE.md, .env, or any production/deploy/account files.

Output:
- Short Russian summary.
- Files created/modified.
- Exact commands run and result.
- Risks/blockers.
- Confirmation that no live/legal/money/external/secrets boundary was crossed.
```

## Stream A Goal

Create a full internal public-facing v1.2 draft in Markdown that can later be reviewed by Codex, Claude, founder, legal/provider reviewers, and technical/security reviewers before any public publication.

The draft must shift GCSC from the old token/DAO/AI-first public story into the approved product-first story:

- SmartContractor as construction trust infrastructure.
- Project contracts, milestones, evidence, disputes, reputation, and admin/risk review before token economics.
- Contract-backed working-capital readiness, not live lending.
- Escrow-ready and settlement-ready roadmap, not live escrow or live settlement.
- AI-assisted recommendations only, not autonomous final approvals.
- GCSC/GCST as planned utility and settlement roadmap components, not price/yield/legal-status promises.
- Public use remains blocked until founder/legal/provider/technical/security/publication gates are recorded.

## Required Source Files

Kimi Stream A must read these files before drafting:

- `docs/gcsc-kimi-parallel-execution-audit-2026-05-14.md`
- `docs/gcsc-v1-2-core-architecture-package.md`
- `docs/whitepaper-v1-2-public-wording-package.md`
- `docs/whitepaper-v1-2-source-map.md`
- `docs/whitepaper-v1-2-restructure-draft.md`
- `docs/whitepaper-v1-2-section-replacement-preview.md`
- `docs/whitepaper-v1-2-claim-review-matrix.md`
- `docs/whitepaper-v1-2-terms-glossary.md`
- `docs/whitepaper-v1-2-public-excerpt-guard.md`
- `docs/whitepaper-v1-2-public-edit-queue.md`
- `docs/whitepaper-v1-2-public-website-update-packet.md`
- `docs/whitepaper-v1-2-publish-gate.md`
- `docs/gcsc-contract-backed-loan-blueprint.md`
- `docs/whitepaper-v1-2-contract-backed-loan-technical-requirements.md`
- `docs/whitepaper-v1-2-smart-contract-module-split-anti-backdoor-review.md`

Do not invent public claims if they are not supported by these files.

## Locked Files

Kimi Stream A must not modify:

- `whitepaper.html`
- `index.html`
- `whitepaper-v1.1.pdf`
- `AGENTS.md`
- `GEMINI.md`
- `.claude/CLAUDE.md`
- `.env`
- `.env*` except already committed safe examples if explicitly assigned later
- live Supabase files, migrations, production deploy settings, Vercel/Namecheap/GitHub Pages settings, payment provider files, app store files, wallet files, and secret-bearing files

## Assigned File Set

Kimi Stream A may create:

- `docs/whitepaper-v1-2-public-draft.md`
- `docs/whitepaper-v1-2-public-draft-review-report.md`
- `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs`

Kimi Stream A may propose, but should not directly apply unless assigned by the integrator:

- `construction-ai/package.json` script addition:
  - `"check:whitepaper-v1-2-public-draft": "node scripts/validate-whitepaper-v1-2-public-draft.mjs"`

Reason: only one integrator should edit `package.json` to avoid conflicts between 100 agents.

## Public Draft Required Structure

`docs/whitepaper-v1-2-public-draft.md` must use this order:

1. Executive Summary
2. Construction Trust Problem
3. SmartContractor Marketplace
4. Project Contracts And Milestones
5. Evidence, Disputes, And Contractor Reputation
6. AI-Assisted Workflows And AI Boundaries
7. Contract-Backed Working-Capital Readiness
8. Escrow-Ready And Settlement-Ready Roadmap
9. Smart Contract Module Roadmap
10. GCSC/GCST Utility And DAO Roadmap
11. Legal, Provider, Custody, AML, Escrow, Lending, Stablecoin, Token, And AI Boundaries
12. Roadmap And Launch Gates
13. Source Map

The draft must read like a real whitepaper, not like a checklist or backlog.

## Section Agent Assignments

Use one section writer per major section. Each writer reports only its assigned section text and source references.

| Agent | Section | Output |
| --- | --- | --- |
| A1 | Executive Summary | 500-900 words, product-first narrative |
| A2 | Construction Trust Problem | pain points without unverifiable market overclaims |
| A3 | SmartContractor Marketplace | homeowner/contractor workflows and demo boundaries |
| A4 | Project Contracts And Milestones | project contract, milestone, evidence, approval states |
| A5 | Evidence, Disputes, And Reputation | dispute workflow, peer review, reputation signals |
| A6 | AI-Assisted Workflows | recommendation-only AI boundaries |
| A7 | Contract-Backed Working-Capital Readiness | signed-contract eligibility and blocked-live lending gates |
| A8 | Escrow-Ready And Settlement-Ready Roadmap | readiness language, no live custody/escrow claim |
| A9 | Smart Contract Module Roadmap | module split, authority, audit, anti-backdoor boundaries |
| A10 | GCSC/GCST Utility And DAO Roadmap | utility roadmap, no price/yield/legal-status promises |
| A11 | Legal/Provider Boundaries | all blocked live actions and review gates |
| A12 | Roadmap/Launch Gates + Source Map | launch levels, approvals, source references |

## Reviewer Agent Assignments

Run these reviewers after the section writers:

| Reviewer | Scope | Must Fail On |
| --- | --- | --- |
| R1 Claim Safety | entire draft | live lending, live escrow, stablecoin, token collateral, yield, price, regulatory approval, AI final approval claims |
| R2 Source Trace | every section | section without source file references |
| R3 Readability | entire draft | checklist tone, repeated disclaimers that make the draft unreadable, unclear product narrative |
| R4 Legal/Provider Boundary | finance/custody/token/AI sections | legal conclusions or provider commitments |
| R5 Validator Coverage | validator script | missing required headings, unsafe-phrase checks, source-map check |
| R6 Public File Lock | git diff/file list | modifications to locked public/live files |
| R7 Exact Wording | glossary alignment | blocked terms used outside blocked-claim context |
| R8 Integration Report | final package | unclear commands, missing risks, missing next step |

## Required Safe Language

Use phrases like:

- `construction trust infrastructure`
- `SmartContractor marketplace`
- `project contract`
- `milestone evidence`
- `admin/risk review`
- `AI-assisted recommendation`
- `human review required`
- `working-capital readiness`
- `contract-backed financing concept`
- `escrow-ready roadmap`
- `settlement-ready roadmap`
- `planned utility`
- `review gate`
- `blocked for live use`
- `founder, legal/provider, technical, and security review`

## Blocked Or Review-Required Language

Reject or rewrite phrases that imply:

- live loan approval;
- instant contractor financing;
- live escrow custody;
- automatic payment release;
- repayment routing already active;
- stablecoin settlement already active;
- token collateral locking already active;
- AI makes final decisions;
- guaranteed lead quality, guaranteed contractor results, or guaranteed payment;
- guaranteed yield, APY, staking return, passive income, token appreciation, or sustainable token price;
- SEC, regulatory, lender, escrow, custody, AML, or legal compliance approval;
- public launch is already approved;
- insurance, audit, or certification already completed unless a source file proves it.

If a blocked phrase is mentioned, it must appear only in a section that clearly says it is blocked, not live, or requires review.

## Required Validator Behavior

`construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs` must:

1. Read `docs/whitepaper-v1-2-public-draft.md`.
2. Fail if any required heading is missing.
3. Fail if `## Source Map` is missing.
4. Fail if source map does not reference the required source files used by the draft.
5. Fail if locked-file warning text is missing:
   - `This draft is not approved for public publication.`
   - `No real payments, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral are enabled by this draft.`
6. Fail if blocked live-action claims appear outside explicit blocked/review boundary sections.
7. Fail if the draft includes `APPROVED_FOR_LIVE`, `GO_FOR_PUBLICATION`, `guaranteed yield`, `token price will increase`, `SEC approved`, `AI approves loans`, `funds are released automatically`, or `live escrow`.
8. Print a clear PASS summary with section count, source count, blocked-claim scan result, and locked-file reminder.

The validator must use deterministic local file reads only. No network calls. No secrets. No live system access.

## Suggested Validator Skeleton

```js
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..");
const draftPath = path.join(repoRoot, "docs", "whitepaper-v1-2-public-draft.md");
const draft = fs.readFileSync(draftPath, "utf8");

const requiredHeadings = [
  "# GCSC / SmartContractor Whitepaper v1.2 Public Draft",
  "## Executive Summary",
  "## Construction Trust Problem",
  "## SmartContractor Marketplace",
  "## Project Contracts And Milestones",
  "## Evidence, Disputes, And Contractor Reputation",
  "## AI-Assisted Workflows And AI Boundaries",
  "## Contract-Backed Working-Capital Readiness",
  "## Escrow-Ready And Settlement-Ready Roadmap",
  "## Smart Contract Module Roadmap",
  "## GCSC/GCST Utility And DAO Roadmap",
  "## Legal, Provider, Custody, AML, Escrow, Lending, Stablecoin, Token, And AI Boundaries",
  "## Roadmap And Launch Gates",
  "## Source Map",
];

const forbidden = [
  "APPROVED_FOR_LIVE",
  "GO_FOR_PUBLICATION",
  "guaranteed yield",
  "token price will increase",
  "SEC approved",
  "AI approves loans",
  "funds are released automatically",
  "live escrow",
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

for (const heading of requiredHeadings) {
  if (!draft.includes(heading)) fail(`Missing heading: ${heading}`);
}

for (const phrase of forbidden) {
  if (draft.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`Forbidden phrase found: ${phrase}`);
  }
}

console.log(`PASS whitepaper v1.2 public draft: ${requiredHeadings.length} headings validated, forbidden phrase scan passed.`);
```

Kimi may improve this skeleton, but must keep it deterministic and local-only.

## Required Review Report

`docs/whitepaper-v1-2-public-draft-review-report.md` must include:

- summary of what was drafted;
- source files read;
- files created/modified;
- commands run and exact result;
- unsafe claims removed or avoided;
- remaining review blockers;
- package.json script addition proposal if not applied;
- confirmation that `whitepaper.html`, `index.html`, PDFs, deploy files, live Supabase, external accounts, payments, loans, escrow, stablecoin settlement, token collateral, and secrets were not touched.

## Commands To Run

Kimi Stream A should run these when the script is wired by the integrator:

```powershell
cd C:\gcsc\construction-ai
npm run check:whitepaper-v1-2-public-draft
npm run check:whitepaper-v1-2-public-wording-package
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-publish-gate
npm run check
```

If the package script is not wired yet, Kimi should run:

```powershell
cd C:\gcsc\construction-ai
node scripts/validate-whitepaper-v1-2-public-draft.mjs
npm run check:whitepaper-v1-2-public-wording-package
npm run check:whitepaper-v1-2-claim-review
npm run check:whitepaper-v1-2-publish-gate
```

## Definition Of Done

Stream A is done only when:

- `docs/whitepaper-v1-2-public-draft.md` exists and follows the required section order.
- `docs/whitepaper-v1-2-public-draft-review-report.md` exists and records sources, commands, risks, and no-touch confirmation.
- A deterministic validator exists at `construction-ai/scripts/validate-whitepaper-v1-2-public-draft.mjs`.
- The draft states that it is not approved for public publication.
- The draft states that no real payments, real loans, real escrow, repayment routing, stablecoin settlement, or token collateral are enabled.
- Unsafe public claims are absent or clearly listed as blocked/review-required.
- Source Map links each major section back to internal source files.
- Relevant checks pass or any failure is clearly reported with exact command output and fix recommendation.

## Handoff To Codex And Claude

After Kimi completes Stream A:

1. Codex reviews the diff and applies only scoped integration changes.
2. Codex wires `check:whitepaper-v1-2-public-draft` into `construction-ai/package.json` if Kimi did not.
3. Codex runs targeted checks and then full `npm run check`.
4. Claude reviews public wording, overclaims, structure, and security/legal/provider boundary consistency.
5. Founder/legal/provider/technical/security approval remains required before any public file, PDF, website, deck, social, grant, partner, investor, or announcement use.

## Stop Conditions

Stop and report instead of continuing if Kimi encounters:

- a request for passwords, API keys, private keys, seed phrases, service-role keys, OAuth tokens, signing keys, wallet keys, or raw database passwords;
- live Supabase changes;
- Vercel, Namecheap, GitHub Pages, payment provider, app store, wallet, or external account changes;
- real loan, real payment, real escrow, repayment routing, stablecoin settlement, token collateral, or production money movement;
- legal, securities, escrow, lending, custody, AML, tax, provider, or public launch decisions;
- need to edit locked files in this Stream A package.
