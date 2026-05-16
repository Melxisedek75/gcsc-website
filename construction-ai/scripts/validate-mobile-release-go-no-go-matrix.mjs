import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const matrixPath = resolve('..', 'docs', 'smartcontractor-mobile-release-go-no-go-matrix.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');

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
assertIncludes(backlog, 'Mobile release go/no-go matrix', backlogPath);
assertIncludes(backlog, 'Mobile store listing evidence boundary', backlogPath);
assertIncludes(backlog, 'Mobile founder release approval phrase boundary', backlogPath);
assertIncludes(backlog, 'Mobile build artifact provenance boundary', backlogPath);
assertIncludes(backlog, 'check:mobile-release-go-no-go', backlogPath);

console.log(JSON.stringify({
  status: 'passed',
  matrix: matrixPath,
  safety_boundaries_checked: true,
}, null, 2));
