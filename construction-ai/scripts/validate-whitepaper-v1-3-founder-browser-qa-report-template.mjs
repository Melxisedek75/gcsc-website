import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  report: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-report-template.md'),
  runbook: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-runbook.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  publicHomepage: path.join(root, 'index.html'),
};

const errors = [];

function readRequired(label, file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required ${label}: ${file}`);
    return '';
  }

  return fs.readFileSync(file, 'utf8');
}

function requirePhrase(text, phrase, label) {
  if (!text.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const report = readRequired('founder browser QA report template', files.report);
const runbook = readRequired('founder browser QA runbook', files.runbook);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicationGate = readRequired('publication gate', files.publicationGate);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder browser QA report template',
  'Browser QA report is EMPTY_TEMPLATE',
  'Current publication decision remains NO-GO',
  'Report Record Template',
  'Evidence Summary Rows',
  'Required Cross References',
  'Allowed States',
  'No Approval Rule',
  'Stop Boundary',
  'PENDING_BROWSER_QA_REPORT',
  'PENDING_CAPTURE',
  'PENDING_CLICK',
  'PENDING_VISUAL_QA',
  'PENDING_REDACTION_REVIEW',
  'PASS_LOCAL_ONLY_REVIEWED_LATER',
  'FAIL_REWORK_REQUIRED_LATER',
  'BLOCKED_REDACTION_REVIEW_LATER',
]) {
  requirePhrase(report, phrase, 'founder browser QA report template');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-browser-qa-runbook.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(report, fileReference, 'founder browser QA report template');
}

for (const field of [
  'report_id',
  'source_commit',
  'browser',
  'desktop_viewport',
  'mobile_viewport',
  'files_reviewed',
  'screenshot_result_reference',
  'navigation_click_result_reference',
  'visual_qa_result_reference',
  'issue_register_reference',
  'redaction_state',
  'final_browser_qa_state',
  'publication_decision',
]) {
  requirePhrase(report, field, 'founder browser QA report template');
}

requirePhrase(runbook, 'Founder Browser QA Runbook', 'founder browser QA runbook');
requirePhrase(runbook, 'Browser QA remains PENDING', 'founder browser QA runbook');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');

const blockedPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bprovider outreach approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\bscreenshot QA complete\b/i,
  /\bnavigation click QA complete\b/i,
  /\bvisual QA complete\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedPatterns) {
  rejectPattern(report, pattern, 'founder browser QA report template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Browser QA Report Template') || content.includes('Report Record Template')) {
    errors.push(`${label} appears to contain internal founder browser QA report template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder browser QA report template validation passed');
