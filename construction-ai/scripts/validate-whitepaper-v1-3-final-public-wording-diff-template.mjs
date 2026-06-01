import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  template: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicWordingScanEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-evidence-log.md'),
  claimRiskHardening: path.join(root, 'docs', 'whitepaper-v1-3-claim-risk-hardening-checklist.md'),
  publicationEvidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  publicationBlockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  publicHtmlPlan: path.join(root, 'docs', 'whitepaper-v1-3-public-html-replacement-plan.md'),
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

const template = readRequired('final public wording diff template', files.template);
const publicWordingScanEvidenceLog = readRequired('public wording scan evidence log', files.publicWordingScanEvidenceLog);
const claimRiskHardening = readRequired('claim risk hardening checklist', files.claimRiskHardening);
const publicationEvidenceStatus = readRequired('publication evidence current status', files.publicationEvidenceStatus);
const publicationBlockerMatrix = readRequired('publication blocker status matrix', files.publicationBlockerMatrix);
const publicHtmlPlan = readRequired('public HTML replacement plan', files.publicHtmlPlan);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal final public wording diff template',
  'No final public wording diff is recorded here',
  'Source Pairing',
  'Diff Review Record Template',
  'Required Review Rows',
  'Allowed Result States',
  'Required Before Any PASS',
  'Stop Boundary',
  'docs/whitepaper-v1-3-public-wording-scan-evidence-log.md',
  'public file replacement approved? | NO by default',
  'publication approved? | NO by default',
  'final public wording diff complete? | NO',
  'PENDING_FINAL_WORDING_DIFF',
  'PENDING_DIFF',
  'V13-DIFF-WP-01',
  'V13-DIFF-HOME-01',
  'V13-DIFF-WP-WEB3',
  'V13-DIFF-HOME-CTA',
]) {
  requirePhrase(template, phrase, 'final public wording diff template');
}

for (const blockedAction of [
  'cannot be used to approve public wording',
  'replace public files',
  'publish a PDF',
  'send provider outreach',
  'register FIO names',
  'sign XPR actions',
]) {
  requirePhrase(template, blockedAction, 'final public wording diff template');
}

requirePhrase(claimRiskHardening, 'Hard Block List', 'claim risk hardening checklist');
requirePhrase(publicWordingScanEvidenceLog, 'Public Wording Scan Evidence Log', 'public wording scan evidence log');
requirePhrase(publicWordingScanEvidenceLog, 'V13-PWSCAN-001', 'public wording scan evidence log');
requirePhrase(publicationEvidenceStatus, 'final public wording diff | PENDING', 'publication evidence current status');
requirePhrase(publicationBlockerMatrix, 'final public wording diff | PENDING', 'publication blocker status matrix');
requirePhrase(publicHtmlPlan, 'Replacement Strategy', 'public HTML replacement plan');

for (const pattern of [
  /\bpublication approved\? \| YES\b/i,
  /\bpublic file replacement approved\? \| YES\b/i,
  /\bfinal public wording diff complete\? \| YES\b/i,
  /\bPUBLISH_NOW\b/i,
  /\bPUBLICATION_GO\b/i,
  /\bprovider outreach approved\b/i,
]) {
  rejectPattern(template, pattern, 'final public wording diff template');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Final Public Wording Diff Template') || content.includes('V13-DIFF-WP-01')) {
    errors.push(`${label} appears to contain internal final public wording diff template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 final public wording diff template validation passed');
