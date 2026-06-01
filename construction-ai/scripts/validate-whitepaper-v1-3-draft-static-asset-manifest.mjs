import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  manifest: path.join(root, 'docs', 'whitepaper-v1-3-draft-static-asset-manifest.md'),
  whitepaperDraft: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraft: path.join(root, 'index-v1-3-draft.html'),
  draftCss: path.join(root, 'whitepaper-v1-3-draft.css'),
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

function rejectPhrase(text, phrase, label) {
  if (text.includes(phrase)) {
    errors.push(`${label} contains blocked phrase: ${phrase}`);
  }
}

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const manifest = readRequired('draft static asset manifest', files.manifest);
const whitepaperDraft = readRequired('whitepaper v1.3 draft HTML', files.whitepaperDraft);
const homepageDraft = readRequired('homepage v1.3 draft HTML', files.homepageDraft);
readRequired('whitepaper v1.3 draft CSS', files.draftCss);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft static asset manifest',
  'Draft static asset review is PENDING_EXTERNAL_ASSET_REVIEW',
  'Current publication decision remains NO-GO',
  'Draft File Asset Map',
  'Blocked Legacy Dependencies',
  'Publication Asset Review Still Required',
  'Local Checks',
  'Stop Boundary',
  'PASS_LOCAL_ASSET',
  'PENDING_EXTERNAL_ASSET_REVIEW',
  'NO_PUBLIC_REPLACEMENT',
]) {
  requirePhrase(manifest, phrase, 'draft static asset manifest');
}

for (const fileReference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper-v1-3-draft.css',
  'whitepaper.html',
  'index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com',
  'css/style.css',
  'css/whitepaper.css',
  'assets/gcsc-logo.png',
]) {
  requirePhrase(manifest, fileReference, 'draft static asset manifest');
}

requirePhrase(whitepaperDraft, 'href="whitepaper-v1-3-draft.css"', 'whitepaper v1.3 draft HTML');
requirePhrase(whitepaperDraft, 'https://fonts.googleapis.com', 'whitepaper v1.3 draft HTML');
requirePhrase(homepageDraft, 'https://cdn.tailwindcss.com', 'homepage v1.3 draft HTML');
requirePhrase(homepageDraft, 'https://fonts.googleapis.com', 'homepage v1.3 draft HTML');
requirePhrase(homepageDraft, 'href="whitepaper-v1-3-draft.html"', 'homepage v1.3 draft HTML');

for (const [label, content] of [
  ['whitepaper-v1-3-draft.html', whitepaperDraft],
  ['index-v1-3-draft.html', homepageDraft],
]) {
  rejectPhrase(content, 'css/style.css', label);
  rejectPhrase(content, 'css/whitepaper.css', label);
  rejectPhrase(content, 'assets/gcsc-logo.png', label);
  rejectPattern(content, /Ã¢|Ãƒ|ï¿½/i, label);
}

for (const pattern of [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bCDN production usage approved\b/i,
  /\bexternal asset review complete\b/i,
  /\blive action approved\b/i,
]) {
  rejectPattern(manifest, pattern, 'draft static asset manifest');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Draft Static Asset Manifest') || content.includes('PENDING_EXTERNAL_ASSET_REVIEW')) {
    errors.push(`${label} appears to contain internal draft static asset manifest content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft static asset manifest validation passed');
