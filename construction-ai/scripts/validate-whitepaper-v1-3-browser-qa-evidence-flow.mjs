import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  flow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  runbook: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-runbook.md'),
  report: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-report-template.md'),
  issueIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-issue-intake-template.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  clickIntake: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-intake-checklist.md'),
  clickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  visualQa: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  readiness: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  gate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
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

const flow = readRequired('browser QA evidence flow', files.flow);
const runbook = readRequired('founder browser QA runbook', files.runbook);
const report = readRequired('founder browser QA report template', files.report);
const issueIntake = readRequired('founder browser QA issue intake template', files.issueIntake);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const clickIntake = readRequired('navigation click evidence intake checklist', files.clickIntake);
const clickResults = readRequired('navigation click evidence results template', files.clickResults);
const visualQa = readRequired('visual QA evidence template', files.visualQa);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const readiness = readRequired('local draft QA readiness scorecard', files.readiness);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const gate = readRequired('publication gate', files.gate);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal browser QA evidence flow map',
  'Browser QA evidence remains PENDING_FLOW',
  'Current publication decision remains NO-GO',
  'Evidence Flow',
  'Required Source Documents',
  'Allowed State Progression',
  'No Shortcut Rules',
  'Stop Boundary',
  'PENDING_BROWSER_QA_RUN',
  'PENDING_CAPTURE',
  'PENDING_REDACTION_REVIEW',
  'PENDING_CLICK',
  'PENDING_VISUAL_QA',
  'PENDING_BROWSER_QA_REPORT',
  'PENDING_ISSUE_ROUTING',
  'HOLD_NO_PUBLIC_USE',
  'NO-GO',
]) {
  requirePhrase(flow, phrase, 'browser QA evidence flow');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-browser-qa-runbook.md',
  'docs/whitepaper-v1-3-founder-browser-qa-report-template.md',
  'docs/whitepaper-v1-3-founder-browser-qa-issue-intake-template.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(flow, fileReference, 'browser QA evidence flow');
}

for (const rule of [
  'A runbook is not browser evidence',
  'A template is not a filled evidence record',
  'A screenshot without redaction review is not usable evidence',
  'Static anchor checks are not browser click evidence',
  'Local QA completion is not public publication approval',
]) {
  requirePhrase(flow, rule, 'browser QA evidence flow');
}

requirePhrase(runbook, 'Browser QA remains PENDING', 'founder browser QA runbook');
requirePhrase(report, 'PENDING_BROWSER_QA_REPORT', 'founder browser QA report template');
requirePhrase(issueIntake, 'PENDING_ISSUE_ROUTING', 'founder browser QA issue intake template');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(clickIntake, 'Manual click evidence remains PENDING', 'navigation click evidence intake checklist');
requirePhrase(clickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(visualQa, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(readiness, 'Current publication decision remains NO-GO', 'local draft QA readiness scorecard');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(gate, 'Default state: NO-GO', 'publication gate');

for (const pattern of [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal\/provider clearance recorded\b/i,
  /\bscreenshot QA complete\b/i,
  /\bnavigation click QA complete\b/i,
  /\bvisual QA complete\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(flow, pattern, 'browser QA evidence flow');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Browser QA Evidence Flow') || content.includes('PENDING_BROWSER_QA_RUN')) {
    errors.push(`${label} appears to contain internal browser QA evidence flow content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 browser QA evidence flow validation passed');
