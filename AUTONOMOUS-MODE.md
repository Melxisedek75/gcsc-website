# 🤖 GCSC AUTONOMOUS MODE — Claude self-driving protocol

> Created 2026-06-09. This file authorizes Claude to work on GCSC / gcsc.store
> autonomously: Claude picks the next task itself, by priority, and starts it —
> without waiting for the founder to say what to do next.

## Core rule

The founder does NOT want to be asked "what should I do next?" or "which task first?".
Claude decides the order itself (importance × safety × what it unblocks), announces
the chosen task as a statement ("Next I'm doing X"), and immediately starts it.
Keep going task after task until a real STOP boundary is hit.

Phrase actions as statements, never as a choice question ("do X or Y?").

## Every wake-up / continuation, do this

1. Read the architecture map: `C:\gcsc-smart-contractor\v3\ARCHITECTURE-TRUTH.md` (which repo/file is live vs dead — never edit dead code).
2. Run `git status --short --branch` in the relevant repo.
3. Pick the highest-priority UNBLOCKED item from the Backlog below.
4. Do it with tools directly. Verify (build / `node --check` / validators) where possible.
5. Update this file's Backlog (mark done, add newly discovered tasks).
6. Move to the next item. Do not stop to ask permission for safe work.

## The three repos (where to work)

| Part | Repo / folder | Edit here | Live deploy |
|---|---|---|---|
| Frontend (UI) | `C:\gcsc-store` (branch `api-backend`) | `src/pages`, `src/components` | Railway `gcsc-store` |
| Backend (API) | `C:\gcsc-smart-contractor` (branch `main`) | **only** `v3/pure-server.js` | Railway `gcsc-backend` |
| Showroom site | `C:\gcsc` (xprnet.org) | — | abandoned (do not touch) |

## STOP boundaries — pause and ask the founder ONLY for these

- Secrets / passwords / API keys / private tokens (Railway, Stripe, XPR, Google, Twilio).
- Connecting or paying for any external account or paid service.
- Enabling real money: live Stripe charges, contractor payouts, real escrow, stablecoin settlement, token collateral, loans, insurance payouts.
- XPR mainnet signatures or real token movement.
- `git push` / production release / replacing a public site (commit locally is fine; push only when asked).
- Legal/provider commitments.
- Destructive actions (deleting data, dropping DB, force operations) without a backup.

Everything else (reading code, writing/refactoring non-secret code, tests, docs,
local commits to a branch, validators, UI work, fixing dead-code/config) → do it
autonomously, no confirmation needed.

## Priority Backlog (Claude maintains this list)

Order = what Claude works through. Top = next. Mark `[x]` when done, add new finds.

### P1 — Product value (what users see/use)
- [ ] **Dashboard.tsx in `C:\gcsc-store`** — main screen after login, ~73 unfinished markers. Triage real stubs vs noise, wire up the contractor/homeowner cabinet actions (Settings, Edit, project/bid views) to `src/services/api.ts`. Biggest visible win.
- [ ] Audit `C:\gcsc-store/api/server.js` (the frontend's own API/proxy layer) — what it does, is it the real path to `gcsc-backend` or a duplicate.
- [ ] Replace "coming soon" stubs across pages (Settings, Edit) with working flows.

### P2 — Backend correctness (live `pure-server.js` only)
- [ ] Harden escrow milestone race (add row-lock/transaction around approve→release) BEFORE any real-money enable. Not urgent (no funds move yet) but required pre-launch.
- [ ] Real email OTP delivery — needs founder-chosen provider (Gmail API / SMTP creds) → STOP item, prep code path that activates when creds exist.

### P3 — Cleanup / hygiene (ends the "wrong file" trap)
- [ ] Archive the dead modular tree (`v3/server.js`, `v3/routes/`, `v3/middleware/`, `v3/database/db.js`) into `v3/_dead-modular-archive/` via `git mv` (reversible). Nothing live references it.
- [ ] Fix/flag misleading configs: inner `v3/render.yaml` + `v3/Dockerfile` (point at dead `server.js`); root `render.yaml` lacks `DATABASE_URL`.
- [ ] Move hardcoded test Stripe `pk_test` into env.

## How to activate this mode

- Say **«запусти autonomous builder»** (runs the `autonomous-builder` skill), or
- Just say **«продолжай»** / **«работай»** and Claude follows this file, or
- For hands-off recurring runs use `/loop` (self-paced) so Claude re-enters this protocol each cycle.

> Note: a hard hook cannot *choose* tasks for Claude (hooks are deterministic event
> handlers, not decision-makers). This protocol file + the backlog IS the decision
> engine; the skill/loop is the trigger. This avoids a runaway Stop-hook that would
> burn budget in an endless loop.
