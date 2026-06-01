import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  intake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  manifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  visualTemplate: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
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

const intake = readRequired('screenshot evidence intake checklist', files.intake);
const handoff = readRequired('screenshot QA handoff', files.handoff);
const manifest = readRequired('screenshot evidence manifest', files.manifest);
const visualTemplate = readRequired('visual QA evidence template', files.visualTemplate);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal screenshot evidence intake checklist',
  'Screenshot QA remains PENDING',
  'Intake Readiness',
  'Evidence ID Requirements',
  'Redaction Review',
  'Issue Routing',
  'Acceptable Intake States',
  'Stop Boundary',
  'publication decision | NO-GO',
  'private-data review complete | PENDING',
  'screenshot QA state | PENDING',
]) {
  requirePhrase(intake, phrase, 'screenshot evidence intake checklist');
}

for (const linkedDoc of [
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(intake, linkedDoc, 'screenshot evidence intake checklist');
}

for (const evidenceId of [
  'V13-WP-DESKTOP-01',
  'V13-WP-DESKTOP-02',
  'V13-WP-MOBILE-01',
  'V13-WP-MOBILE-02',
  'V13-HOME-DESKTOP-01',
  'V13-HOME-MOBILE-01',
]) {
  requirePhrase(intake, evidenceId, 'screenshot evidence intake checklist');
  requirePhrase(handoff, evidenceId, 'screenshot QA handoff');
  requirePhrase(manifest, evidenceId, 'screenshot evidence manifest');
}

for (const state of [
  'PENDING_CAPTURE',
  'PENDING_REDACTION_REVIEW',
  'ISSUE_FOUND',
  'REDACT_OR_DISCARD',
  'PASS_LOCAL_ONLY',
  'HOLD_NO_PUBLIC_USE',
]) {
  requirePhrase(intake, state, 'screenshot evidence intake checklist');
}

requirePhrase(handoff, 'Screenshot QA is PENDING', 'screenshot QA handoff');
requirePhrase(manifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(visualTemplate, 'Required Before Public Use', 'visual QA evidence template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(evidenceStatus, 'screenshot QA evidence | PENDING', 'publication evidence current status');

const blockedApprovalPatterns = [
  /\bScreenshot QA is COMPLETE\b/i,
  /\bscreenshot QA state \| COMPLETE\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\bprovider response recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership approval recorded\b/i,
  /\bpartnership commitment recorded\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(intake)) {
    errors.push(`screenshot evidence intake checklist contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Screenshot Evidence Intake Checklist') || content.includes('PENDING_REDACTION_REVIEW')) {
    errors.push(`${label} appears to contain internal screenshot intake checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 screenshot evidence intake checklist validation passed');
