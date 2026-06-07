# No Live Actions Local Validator

Status: LOCAL_VALIDATOR_ONLY

Command: `npm --prefix construction-ai run check:no-live-actions`

Purpose: provide a tracked files only guard for accidental live-action triggers in package scripts, CI workflows, source files, and local scripts.

## Scope

- scans tracked files only through `git ls-files`;
- checks package scripts for deploy, publish, live Supabase, GitHub release, Git push, and XPR/Proton CLI commands;
- checks CI workflow files for deploy commands, live Supabase commands, and production environment declarations;
- checks source/script files for signature, transaction, XPR contract deployment, public HTML replacement, and non-local external write-call triggers;
- reports only file path, line number, and rule ID;
- uses redacted output and never prints secrets or matched values.

## Required Boundaries

This validator does not approve live Supabase changes, external account changes, deployment, public website replacement, public whitepaper publication, real payments, real loans, real escrow, repayment routing, stablecoin settlement, token collateral, XPR/FIO signatures, legal decisions, provider commitments, mobile store actions, production release, or destructive actions.

It specifically does not approve public website replacement, public beta launch, public URL sharing, tester invites, payment movement, loan approval, escrow release, repayment routing, stablecoin settlement, token collateral, XPR/FIO actions, app-store release, or production action.

## Pass Criteria

1. `construction-ai/package.json` includes `check:no-live-actions`.
2. `VALIDATORS.md` and Kimi Phase 2 intake document the local boundary.
3. Package scripts do not contain live deploy/publish/push/provider commands.
4. CI workflows do not contain live deploy or live Supabase mutation commands.
5. Source/script files do not contain direct live signing, deployment, public-file replacement, or external write-call triggers.

## Failure Handling

If this validator fails, inspect only the redacted file/path/rule metadata. Do not paste secrets or private data into chat. Remove the live-action trigger or move it behind an explicit founder-only live-run process that is not part of autonomous Codex or CI.
