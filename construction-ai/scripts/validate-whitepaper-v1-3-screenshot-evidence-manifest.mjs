import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  manifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  visualTemplate: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
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

const manifest = readRequired('screenshot evidence manifest', files.manifest);
const handoff = readRequired('screenshot QA handoff', files.handoff);
const visualTemplate = readRequired('visual QA evidence template', files.visualTemplate);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const whitepaperDraft = readRequired('whitepaper v1.3 draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal screenshot evidence manifest',
  'Screenshot QA remains PENDING',
  'Capture Scope',
  'Evidence Folder Rules',
  'Visual Acceptance Checks',
  'Intake Record Template',
  'Required Before Any Future GO',
  'Stop Boundary',
  'publication decision | NO-GO',
]) {
  requirePhrase(manifest, phrase, 'screenshot evidence manifest');
}

for (const evidenceId of [
  'V13-WP-DESKTOP-01',
  'V13-WP-DESKTOP-02',
  'V13-WP-MOBILE-01',
  'V13-WP-MOBILE-02',
  'V13-HOME-DESKTOP-01',
  'V13-HOME-MOBILE-01',
]) {
  requirePhrase(manifest, evidenceId, 'screenshot evidence manifest');
  requirePhrase(handoff, evidenceId, 'screenshot QA handoff');
}

for (const phrase of [
  'screenshots reviewed for wallet, key, payment, or private data | PENDING',
  'screenshot filenames mapped to Evidence IDs | PENDING',
  'private data review is complete',
  'publication GO record is completed separately',
]) {
  requirePhrase(manifest, phrase, 'screenshot evidence manifest');
}

requirePhrase(handoff, 'Screenshot QA is PENDING', 'screenshot QA handoff');
requirePhrase(visualTemplate, 'Required Before Public Use', 'visual QA evidence template');
requirePhrase(publicationEvidence, 'screenshot QA evidence | PENDING', 'publication evidence current status');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper v1.3 draft');
requirePhrase(homepageDraft, 'Publication Gate', 'homepage v1.3 draft');

const blockedApprovalPatterns = [
  /\bScreenshot QA is COMPLETE\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bfounder approval recorded\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(manifest)) {
    errors.push(`screenshot evidence manifest contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Screenshot Evidence Manifest') || content.includes('V13-WP-DESKTOP-01')) {
    errors.push(`${label} appears to contain internal screenshot evidence manifest content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 screenshot evidence manifest validation passed');
