import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  template: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  manifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  visualTemplate: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
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

const template = readRequired('screenshot evidence results template', files.template);
const handoff = readRequired('screenshot QA handoff', files.handoff);
const manifest = readRequired('screenshot evidence manifest', files.manifest);
const intake = readRequired('screenshot evidence intake checklist', files.intake);
const visualTemplate = readRequired('visual QA evidence template', files.visualTemplate);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal screenshot evidence results template',
  'No screenshot evidence is recorded',
  'Required Inputs',
  'Run Record Template',
  'Screenshot Results Template',
  'Result State Rules',
  'Required Before Any PASS_LOCAL_ONLY',
  'Stop Boundary',
  'actual screenshot files captured | PENDING',
  'redaction review completed | PENDING',
  'publication decision | NO-GO',
]) {
  requirePhrase(template, phrase, 'screenshot evidence results template');
}

for (const linkedDoc of [
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
]) {
  requirePhrase(template, linkedDoc, 'screenshot evidence results template');
}

for (const evidenceId of [
  'V13-WP-DESKTOP-01',
  'V13-WP-DESKTOP-02',
  'V13-WP-MOBILE-01',
  'V13-WP-MOBILE-02',
  'V13-HOME-DESKTOP-01',
  'V13-HOME-MOBILE-01',
]) {
  requirePhrase(template, evidenceId, 'screenshot evidence results template');
  requirePhrase(handoff, evidenceId, 'screenshot QA handoff');
  requirePhrase(manifest, evidenceId, 'screenshot evidence manifest');
  requirePhrase(intake, evidenceId, 'screenshot evidence intake checklist');
}

for (const state of [
  'PENDING_CAPTURE',
  'PENDING_REDACTION_REVIEW',
  'PASS_LOCAL_ONLY',
  'ISSUE_FOUND',
  'REDACT_OR_DISCARD',
  'HOLD_NO_PUBLIC_USE',
]) {
  requirePhrase(template, state, 'screenshot evidence results template');
}

requirePhrase(handoff, 'Screenshot QA is PENDING', 'screenshot QA handoff');
requirePhrase(manifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(intake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(visualTemplate, 'Required Before Public Use', 'visual QA evidence template');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(evidenceStatus, 'screenshot QA evidence | PENDING', 'publication evidence current status');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage draft');

const blockedApprovalPatterns = [
  /\bscreenshot evidence \| COMPLETE\b/i,
  /\bscreenshot QA \| COMPLETE\b/i,
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
  if (pattern.test(template)) {
    errors.push(`screenshot evidence results template contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Screenshot Evidence Results Template')
    || content.includes('PENDING_REDACTION_REVIEW')
    || content.includes('V13-WP-DESKTOP-01')
  ) {
    errors.push(`${label} appears to contain internal screenshot results template content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 screenshot evidence results template validation passed');
