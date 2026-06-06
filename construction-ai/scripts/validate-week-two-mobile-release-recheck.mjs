import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const recheckPath = resolve('..', 'docs', 'smartcontractor-week-two-mobile-release-recheck-2026-06-06.md');
const roadmapPath = resolve('..', 'docs', 'smartcontractor-mobile-roadmap.md');
const pwaChecklistPath = resolve('..', 'docs', 'smartcontractor-pwa-qa-checklist.md');
const releaseEvidencePath = resolve('..', 'docs', 'smartcontractor-mobile-release-evidence.md');
const releaseBlockersPath = resolve('..', 'docs', 'smartcontractor-mobile-release-blockers.md');
const goNoGoPath = resolve('..', 'docs', 'smartcontractor-mobile-release-go-no-go-matrix.md');
const androidDebugPath = resolve('..', 'docs', 'smartcontractor-android-debug-build-evidence.md');
const androidEmulatorPath = resolve('..', 'docs', 'smartcontractor-android-emulator-smoke-evidence.md');
const androidDevicePath = resolve('..', 'docs', 'smartcontractor-android-device-smoke-checklist.md');
const iosPreflightPath = resolve('..', 'docs', 'smartcontractor-ios-preflight.md');
const screenshotRedactionPath = resolve('..', 'docs', 'smartcontractor-mobile-screenshot-redaction-checklist.md');
const founderQaPath = resolve('..', 'docs', 'smartcontractor-mobile-founder-qa-report-template.md');
const localCommandsPath = resolve('..', 'docs', 'smartcontractor-mobile-local-qa-commands.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const packagePath = resolve('package.json');
const runnerPath = resolve('scripts', 'run-checks.mjs');

function fail(message) {
  console.error(`Week 2 mobile release recheck validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) fail(`${file} must include: ${snippet}`);
}

const recheck = readRequired(recheckPath);
const roadmap = readRequired(roadmapPath);
const pwaChecklist = readRequired(pwaChecklistPath);
const releaseEvidence = readRequired(releaseEvidencePath);
const releaseBlockers = readRequired(releaseBlockersPath);
const goNoGo = readRequired(goNoGoPath);
const androidDebug = readRequired(androidDebugPath);
const androidEmulator = readRequired(androidEmulatorPath);
const androidDevice = readRequired(androidDevicePath);
const iosPreflight = readRequired(iosPreflightPath);
const screenshotRedaction = readRequired(screenshotRedactionPath);
const founderQa = readRequired(founderQaPath);
const localCommands = readRequired(localCommandsPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const packageJson = readRequired(packagePath);
const runner = readRequired(runnerPath);

for (const section of [
  'SmartContractor Week 2 Mobile Release Recheck',
  'Status: LOCAL_RECHECK_ONLY',
  'Source Documents And Surfaces',
  'Week 2 Mobile Recheck Sequence',
  'Current Hold State Matrix',
  'Founder Safe Report-Back',
  'Decision State Matrix',
  'Exact Phrase Boundaries',
  'Codex Scope',
  'Required Checks',
  'Acceptance Check',
]) assertIncludes(recheck, section, recheckPath);

for (const required of [
  'This recheck does not approve Android store release',
  'docs/smartcontractor-mobile-roadmap.md',
  'docs/smartcontractor-pwa-qa-checklist.md',
  'docs/smartcontractor-mobile-release-evidence.md',
  'docs/smartcontractor-mobile-release-blockers.md',
  'docs/smartcontractor-mobile-release-go-no-go-matrix.md',
  'docs/smartcontractor-android-debug-build-evidence.md',
  'docs/smartcontractor-android-emulator-smoke-evidence.md',
  'docs/smartcontractor-android-device-smoke-checklist.md',
  'docs/smartcontractor-ios-preflight.md',
  'docs/smartcontractor-mobile-screenshot-redaction-checklist.md',
  'docs/smartcontractor-mobile-founder-qa-report-template.md',
  'docs/smartcontractor-mobile-local-qa-commands.md',
  '/api/admin/mobile-install-readiness',
  '/api/admin/week-two-mobile-release-readiness',
  '/api/admin/week-two-mobile-release-execution-checklist',
  'Confirm PWA install/offline readiness',
  'Confirm Android toolchain status',
  'Confirm Android debug build evidence status',
  'Confirm Android emulator and physical phone smoke status',
  'Confirm iOS preflight status',
  'Confirm screenshot and recording redaction',
  'Confirm build artifact provenance',
  'Confirm developer account and store submission gates',
  'Confirm real-money features are disabled',
  'REVIEW_PWA_EVIDENCE',
  'HOLD_FOR_ANDROID_TOOLCHAIN',
  'HOLD_FOR_ANDROID_DEBUG_BUILD',
  'HOLD_FOR_DEVICE_QA',
  'HOLD_FOR_IOS_PREP',
  'HOLD_FOR_SCREENSHOT_REDACTION',
  'HOLD_FOR_ARTIFACT_PROVENANCE_REVIEW',
  'BLOCKED_FOR_DEVELOPER_ACCOUNT_ACTION',
  'BLOCKED_FOR_STORE_SUBMISSION',
  'BLOCKED_FOR_LIVE_OR_PUBLIC_RELEASE',
  'Mobile Release Week 2 Recheck',
  'developer_account_action_requested: no',
  'store_submission_requested: no',
  'tester_invite_requested: no',
  'public_url_share_requested: no',
  'public_mobile_release_requested: no',
  'real_payment_or_loan_or_escrow_action_taken: no',
  'repayment_or_stablecoin_or_token_collateral_action_taken: no',
  'token_or_xpr_or_fio_action_taken: no',
  'legal_or_provider_conclusion_made: no',
  'Live-risk actions taken: none',
  'READY_FOR_FOUNDER_STORE_PREP_REVIEW',
  'REVIEW_BLOCKERS',
  'NO_GO',
  'MOBILE_RELEASE_DECISION_RECORDED',
  'MOBILE_DEVELOPER_ACCOUNT_ACTION_RECORDED',
  'MOBILE_STORE_SUBMISSION_DECISION_GATE',
  'Codex must stop before Android store release',
  'npm run check:week-two-mobile-release-recheck',
  'npm run check:mobile-release-go-no-go',
  'no-Android-store-release, no-iOS-store-release, no-TestFlight-upload',
]) assertIncludes(recheck, required, recheckPath);

for (const [content, snippet, file] of [
  [roadmap, 'SmartContractor Mobile Roadmap', roadmapPath],
  [pwaChecklist, 'SmartContractor PWA QA Checklist', pwaChecklistPath],
  [releaseEvidence, 'SmartContractor Mobile Release Evidence Bundle', releaseEvidencePath],
  [releaseBlockers, 'SmartContractor Mobile Release Blockers', releaseBlockersPath],
  [goNoGo, 'SmartContractor Mobile Release Go/No-Go Matrix', goNoGoPath],
  [androidDebug, 'SmartContractor Android Debug Build Evidence', androidDebugPath],
  [androidEmulator, 'SmartContractor Android Emulator Smoke Evidence', androidEmulatorPath],
  [androidDevice, 'SmartContractor Android Device Smoke Checklist', androidDevicePath],
  [iosPreflight, 'SmartContractor iOS Preflight', iosPreflightPath],
  [screenshotRedaction, 'SmartContractor Mobile Screenshot Redaction Checklist', screenshotRedactionPath],
  [founderQa, 'SmartContractor Mobile Founder QA Report Template', founderQaPath],
  [localCommands, 'SmartContractor Mobile Local QA Commands', localCommandsPath],
]) assertIncludes(content, snippet, file);

for (const snippet of [
  'PWA shell',
  'Android wrapper',
  'JDK 17',
  'JAVA_HOME',
  'ANDROID_HOME',
  'Android debug APK',
  'Android emulator smoke',
  'Android physical phone smoke',
  'iOS preflight',
  'Apple Developer',
  'App Store Connect',
  'production signing keys',
  'no real payments',
  'no real loans',
  'no escrow',
  'no token collateral',
]) assertIncludes(releaseBlockers, snippet, releaseBlockersPath);

for (const snippet of [
  'Mobile Store Listing Evidence Boundary',
  'Mobile Founder Release Approval Phrase Boundary',
  'Mobile Build Artifact Provenance Boundary',
  'Mobile Founder Store Submission Decision Gate',
  'Mobile Developer Account External Action Approval Phrase Boundary',
  'MOBILE_RELEASE_DECISION_RECORDED',
  'MOBILE_DEVELOPER_ACCOUNT_ACTION_RECORDED',
  'MOBILE_STORE_SUBMISSION_DECISION_GATE',
]) assertIncludes(goNoGo, snippet, goNoGoPath);

assertIncludes(context, 'Week 2 mobile release recheck', contextPath);
assertIncludes(context, 'check:week-two-mobile-release-recheck', contextPath);
assertIncludes(backlog, 'Week 2 mobile release recheck', backlogPath);
assertIncludes(backlog, 'check:week-two-mobile-release-recheck', backlogPath);
assertIncludes(packageJson, '"check:week-two-mobile-release-recheck"', packagePath);
assertIncludes(runner, '"check:week-two-mobile-release-recheck"', runnerPath);

if (/https?:\/\/(?!localhost(?::\d+)?(?:\/|\s|$)|127\.0\.0\.1(?::\d+)?(?:\/|\s|$))[^\s)`>"]+|sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(recheck)) {
  fail('Week 2 mobile release recheck must not contain real external URL or secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  week_two_mobile_release_recheck: recheckPath,
  linked_source_docs_checked: 12,
  store_signing_live_finance_boundaries_checked: true,
}, null, 2));
