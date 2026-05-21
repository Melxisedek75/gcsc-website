import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'smartcontractor-mobile-release-go-no-go-matrix.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');

function fail(message) {
  console.error(`Mobile release go/no-go matrix validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.includes(snippet)) fail(`${file} must include: ${snippet}`);
}

const matrix = readRequired(matrixPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);

const requiredMatrixSnippets = [
  'SmartContractor Mobile Release Go/No-Go Matrix',
  'Android debug build',
  'Android emulator smoke',
  'Android physical phone smoke',
  'iOS preflight',
  'PWA install',
  'offline shell',
  'screenshot redaction',
  'store accounts',
  'production signing keys',
  'real payments disabled',
  'real loans disabled',
  'escrow disabled',
  'token collateral disabled',
  'Mobile Store Listing Evidence Boundary',
  'Mobile Founder Release Approval Phrase Boundary',
  'Mobile Build Artifact Provenance Boundary',
  'Mobile Founder Store Submission Decision Gate',
  'Founder Evening Mobile Release Decision Record',
  'Mobile Developer Account External Action Approval Phrase Boundary',
  'Do not submit Android or iOS store listings, upload signing keys, change app-store metadata, or publish a production/mobile release from Codex',
  'store screenshots, listing text, package IDs, bundle IDs, signing evidence, and reviewer notes stay founder-controlled until redacted and approved',
  'demo-only mobile evidence must not include secrets, private tester data, payment data, wallet data, Magic Link tokens, service-role keys, raw logs, or unredacted screenshots',
  'any store account, signing, reviewer, production listing, public release, or paid developer account step stays BLOCKED_FOR_EXTERNAL_ACTION',
  'A mobile release decision is not actionable unless the founder records the exact standalone phrase MOBILE_RELEASE_DECISION_RECORDED with platform, scope, build identifier, evidence file, disabled real-money confirmation, rollback owner, and decision',
  'Screenshots, chats, voice notes, old approvals, bundled deployment approvals, or informal Go messages must stay Review until the exact phrase and evidence fields are present',
  'MOBILE_RELEASE_DECISION_RECORDED does not approve store submission, signing-key upload, Play Console actions, App Store Connect actions, production deploy, real payments, real loans, escrow, token collateral, legal decisions, or public launch',
  'Every mobile build artifact considered for founder QA or release review must record platform, artifact_type, build_id, source_commit, generated_at, builder_owner, signing_mode, package_or_bundle_id, QA_evidence_file, disabled_real_money_evidence, and rollback_or_hold_decision',
  'Copied APKs, old TestFlight builds, stale screenshots, unsigned files, unknown signing state, cloud build links, or artifacts from a different commit default to HOLD_FOR_ARTIFACT_PROVENANCE_REVIEW',
  'A debug APK, local simulator build, emulator screenshot, or PWA install proof cannot be converted into App Store, Play Console, TestFlight, production signing, tester distribution, or public mobile release approval',
  'Mobile artifact provenance review never approves signing keys, Apple Developer setup, Play Console setup, store submission, public release notes, live Supabase changes, production payments, real loans, escrow, repayment routing, stablecoin settlement, token collateral, or public launch',
  'MOBILE_STORE_SUBMISSION_DECISION_GATE',
  'founder-present internal store-submission readiness decision',
  'record platform, release channel, build_id, source_commit, package_or_bundle_id, store_account_owner, signing_owner, screenshot_redaction_evidence, disabled_real_money_evidence, QA_evidence_file, latest_check_run, rollback_owner, and blocked_next_action',
  'No Play Console action, App Store Connect action, TestFlight upload, signing-key upload, production metadata change, store submission, public mobile release, production deploy, live Supabase change, real payment, real loan, real escrow, repayment routing, stablecoin settlement, token collateral, legal decision, or provider commitment is approved by this gate',
  'evening_mobile_release_state',
  'READY_FOR_FOUNDER_STORE_PREP_REVIEW, REVIEW_BLOCKERS, HOLD_FOR_ANDROID_TOOLCHAIN, HOLD_FOR_IOS_PREP, HOLD_FOR_DEVICE_QA, or NO_GO',
  'evening_mobile_release_evidence',
  'evening_mobile_release_owner',
  'evening_mobile_release_blocked_action',
  'Do not build store releases, upload to app stores, connect Apple or Google developer accounts, enter signing keys, invite production testers, publish mobile builds, enable payments, approve loans, release escrow, route repayments, settle stablecoins, lock token collateral, make legal/provider commitments, or launch publicly from this record',
  'MOBILE_DEVELOPER_ACCOUNT_ACTION_RECORDED',
  'Exact phrase must be a standalone line, not embedded in a longer sentence or checklist note',
  'mobile_developer_account_action_platform',
  'mobile_developer_account_action_scope',
  'mobile_developer_account_action_owner',
  'mobile_developer_account_action_evidence_file',
  'mobile_developer_account_action_blocked_action',
  'Do not treat this phrase as approval to create or modify Apple Developer, App Store Connect, Google Play Console, signing, TestFlight, Play testing, store metadata, paid developer, production deploy, live Supabase, payment, loan, escrow, repayment routing, stablecoin, token collateral, legal/provider, or public launch actions',
  'Founder Decision',
  'Go',
  'Review',
  'No-Go',
];

for (const snippet of requiredMatrixSnippets) {
  assertIncludes(matrix, snippet, matrixPath);
}

assertIncludes(context, 'mobile release go/no-go matrix', contextPath);
assertIncludes(context, 'Mobile store listing evidence boundary', contextPath);
assertIncludes(context, 'Mobile founder release approval phrase boundary', contextPath);
assertIncludes(context, 'Mobile build artifact provenance boundary', contextPath);
assertIncludes(context, 'Mobile founder store submission decision gate', contextPath);
assertIncludes(context, 'Mobile release founder evening decision record', contextPath);
assertIncludes(context, 'Mobile developer account external action approval phrase boundary', contextPath);
assertIncludes(backlog, 'Mobile release go/no-go matrix', backlogPath);
assertIncludes(backlog, 'Mobile store listing evidence boundary', backlogPath);
assertIncludes(backlog, 'Mobile founder release approval phrase boundary', backlogPath);
assertIncludes(backlog, 'Mobile build artifact provenance boundary', backlogPath);
assertIncludes(backlog, 'Mobile founder store submission decision gate', backlogPath);
assertIncludes(backlog, 'Mobile release founder evening decision record', backlogPath);
assertIncludes(backlog, 'Mobile developer account external action approval phrase boundary', backlogPath);
assertIncludes(backlog, 'check:mobile-release-go-no-go', backlogPath);
assertIncludes(audit, 'Mobile developer account external action approval phrase boundary', auditPath);

console.log(JSON.stringify({
  status: 'passed',
  matrix: matrixPath,
  safety_boundaries_checked: true,
}, null, 2));
