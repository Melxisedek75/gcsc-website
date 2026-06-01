import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  checklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-css-qa-checklist.md'),
  css: path.join(root, 'whitepaper-v1-3-draft.css'),
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

const checklist = readRequired('draft CSS QA checklist', files.checklist);
const css = readRequired('whitepaper v1.3 draft CSS', files.css);
const whitepaperDraft = readRequired('whitepaper v1.3 draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft HTML', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Static CSS Checks',
  'Manual Visual Checks Still Required',
  'Stop Boundary',
  'overflow-x: hidden',
  'overflow-wrap: anywhere',
  'overflow-x: auto',
  'publication gate remains NO-GO',
]) {
  requirePhrase(checklist, phrase, 'draft CSS QA checklist');
}

for (const phrase of [
  'box-sizing: border-box',
  'overflow-x: hidden',
  'overflow-wrap: anywhere',
  '@media (max-width: 920px)',
  '@media (max-width: 520px)',
  'overflow-x: auto',
  'grid-template-columns: 1fr',
]) {
  requirePhrase(css, phrase, 'whitepaper v1.3 draft CSS');
}

const blockedAssetPatterns = [
  /css\/style\.css/i,
  /css\/whitepaper\.css/i,
  /assets\/gcsc-logo\.png/i,
];

for (const [label, content] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
  ['whitepaper-v1-3-draft.css', css],
]) {
  for (const pattern of blockedAssetPatterns) {
    if (pattern.test(content)) {
      errors.push(`${label} contains blocked legacy asset reference: ${pattern.source}`);
    }
  }

  if (/Ã¢|Ãƒ|ï¿½|âœ/i.test(content)) {
    errors.push(`${label} contains mojibake or corrupted glyph pattern`);
  }
}

requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper v1.3 draft HTML');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage v1.3 draft HTML');

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft CSS QA Checklist') || content.includes('Static CSS Checks')) {
    errors.push(`${label} appears to contain internal CSS QA checklist content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft CSS QA validation passed');
