import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  visualTemplate: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
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

const handoff = readRequired('screenshot QA handoff', files.handoff);
const visualTemplate = readRequired('visual QA evidence template', files.visualTemplate);
const localNotes = readRequired('local browser review notes', files.localNotes);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Screenshot QA is PENDING',
  'Files To Open',
  'Screenshot Set',
  'Founder Steps',
  'Visual Checks',
  'Evidence Intake Format',
  'Stop Boundary',
  'Public publication decision remains: NO-GO',
  'Do not replace or edit',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(handoff, phrase, 'screenshot QA handoff');
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
}

for (const phrase of [
  'Desktop Review',
  'Mobile Review',
  'Required Before Public Use',
]) {
  requirePhrase(visualTemplate, phrase, 'visual QA evidence template');
}

requirePhrase(localNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper v1.3 draft');
requirePhrase(homepageDraft, 'does not approve public publication', 'homepage v1.3 draft');

const blockedApprovalPatterns = [
  /\bScreenshot QA is COMPLETE\b/i,
  /\bpublication is approved\b/i,
  /\bpublic replacement is approved\b/i,
  /\bGO for public use\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\bpartnership approval recorded\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(handoff)) {
    errors.push(`screenshot QA handoff contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('V13-WP-DESKTOP-01') || content.includes('Screenshot QA Founder Handoff')) {
    errors.push(`${label} appears to contain internal screenshot QA handoff content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 screenshot QA handoff validation passed');
