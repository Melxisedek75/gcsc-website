# GCSC Autonomous Workday Plan

Date: 2026-05-04

Founder availability: limited until 17:00 America/Los_Angeles.

## Rule For Today

Codex should work only on tasks that are safe to complete without founder presence.

Allowed:

- local documentation;
- architecture draft files;
- backend/frontend code that does not require new secrets;
- tests and CI;
- demo scripts;
- mobile/PWA planning;
- smart contract design drafts;
- grant and partner application materials;
- scoped commits and pushes.

Not allowed without founder:

- entering passwords;
- changing Namecheap, Microsoft, Vercel, Supabase production settings, payment provider settings, or wallet settings;
- applying strict live RLS policies;
- making real payments;
- deploying real lending;
- storing or exposing secrets;
- making final legal claims.

## Current Roadmap State

Already completed:

- SmartContractor clickable MVP;
- backend API;
- Supabase schema;
- payments router;
- verification abstraction;
- audit/event ledger;
- token collateral ledger;
- API validation;
- GitHub Actions CI;
- demo script;
- founder one-pager;
- Microsoft/Azure application packet;
- Auth/RLS plan and SQL draft.

Needs founder later:

- approve Supabase Auth mode;
- approve live RLS rollout;
- connect/choose deploy provider;
- legal review for real lending;
- submit Microsoft/Azure application.

## Work Queue Until 17:00

### 1. Smart Contract Design Drafts

Create non-deployed architecture docs for:

- project escrow contract;
- loan ledger contract;
- token collateral lock contract;
- peer review reward hook.

Goal: define actions, tables, events, permissions, and safety notes before writing WASM code.

### 2. PWA And Mobile Readiness

Improve or document:

- PWA install checklist;
- Android wrapper readiness;
- iOS constraints;
- mobile QA checklist.

Goal: prepare Android/iPhone path without needing app store accounts today.

### 3. Local QA Improvements

Add safe local checks:

- backend syntax validation;
- frontend inline JavaScript validation;
- API validation smoke tests;
- docs presence check.

Goal: make every push safer.

### 4. Partner / Grant Pack Polish

Polish:

- short pitch;
- application answers;
- demo walkthrough;
- responsible launch notes.

Goal: founder can later submit without rewriting everything.

### 5. Backlog Hygiene

After each work block:

- update `docs/smartcontractor-backlog.md`;
- commit only related files;
- push to GitHub;
- leave blocked items clearly marked.

## End-Of-Day Founder Summary Format

When founder returns, report:

1. What was completed.
2. What was committed and pushed.
3. What is still blocked.
4. Exact next actions for founder, step by step.
