import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-capture-readiness-closeout.md'),
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  manifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  intake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  visualTemplate: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  readinessScorecard: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  publicationEvidence: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
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

const closeout = readRequired('screenshot capture readiness closeout', files.closeout);
const handoff = readRequired('screenshot QA handoff', files.handoff);
const manifest = readRequired('screenshot evidence manifest', files.manifest);
const intake = readRequired('screenshot evidence intake checklist', files.intake);
const visualTemplate = readRequired('visual QA evidence template', files.visualTemplate);
const localNotes = readRequired('local browser review notes', files.localNotes);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const readinessScorecard = readRequired('local draft QA readiness scorecard', files.readinessScorecard);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal screenshot capture readiness closeout',
  'Screenshot QA remains PENDING',
  'Capture Readiness State',
  'Inputs Verified',
  'Current Limitation',
  'Next Safe Capture Steps',
  'Do Not Treat As Evidence',
  'Stop Boundary',
  'actual screenshot files captured | PENDING_CAPTURE',
  'redaction review complete | PENDING_REDACTION_REVIEW',
  'publication decision | NO-GO',
  'No completed screenshot evidence is recorded',
]) {
  requirePhrase(closeout, phrase, 'screenshot capture readiness closeout');
}

for (const reference of [
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(closeout, reference, 'screenshot capture readiness closeout');
}

for (const evidenceId of [
  'V13-WP-DESKTOP-01',
  'V13-WP-DESKTOP-02',
  'V13-WP-MOBILE-01',
  'V13-WP-MOBILE-02',
  'V13-HOME-DESKTOP-01',
  'V13-HOME-MOBILE-01',
]) {
  requirePhrase(handoff, evidenceId, 'screenshot QA handoff');
  requirePhrase(manifest, evidenceId, 'screenshot evidence manifest');
  requirePhrase(intake, evidenceId, 'screenshot evidence intake checklist');
}

requirePhrase(handoff, 'Screenshot QA is PENDING', 'screenshot QA handoff');
requirePhrase(manifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(intake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(visualTemplate, 'Required Before Public Use', 'visual QA evidence template');
requirePhrase(localNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(readinessScorecard, 'screenshot evidence | PENDING', 'local draft QA readiness scorecard');
requirePhrase(publicationEvidence, 'screenshot QA evidence | PENDING', 'publication evidence current status');
requirePhrase(publicationEvidence, 'screenshot evidence intake | PENDING', 'publication evidence current status');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft');
requirePhrase(homepageDraft, 'Publication Gate', 'homepage draft');

const blockedApprovalPatterns = [
  /\bScreenshot QA is COMPLETE\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bfounder publication approval recorded\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership approval recorded\b/i,
  /\bGO for publication\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(closeout)) {
    errors.push(`screenshot capture readiness closeout contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Screenshot Capture Readiness Closeout')
    || content.includes('Capture Readiness State')
    || content.includes('PENDING_CAPTURE')
  ) {
    errors.push(`${label} appears to contain internal screenshot capture readiness closeout content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 screenshot capture readiness closeout validation passed');
