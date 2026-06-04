import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  staticDraft: path.join(root, 'index-v1-3-static-draft.html'),
  currentDraft: path.join(root, 'index-v1-3-draft.html'),
  publicHomepage: path.join(root, 'index.html'),
  publicWhitepaper: path.join(root, 'whitepaper.html'),
  assetDecisionPacket: path.join(root, 'docs', 'smartcontractor-public-homepage-asset-decision-packet-2026-06-03.md'),
};

const errors = [];

function readRequired(label, filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required ${label}: ${filePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function requirePhrase(content, phrase, label) {
  if (!content.includes(phrase)) {
    errors.push(`${label} missing required phrase: ${phrase}`);
  }
}

function rejectPhrase(content, phrase, label) {
  if (content.includes(phrase)) {
    errors.push(`${label} contains blocked phrase: ${phrase}`);
  }
}

function rejectPattern(content, pattern, label) {
  if (pattern.test(content)) {
    errors.push(`${label} contains blocked pattern: ${pattern.source}`);
  }
}

const staticDraft = readRequired('static homepage v1.3 draft', files.staticDraft);
const currentDraft = readRequired('current homepage v1.3 draft', files.currentDraft);
const publicHomepage = readRequired('public homepage', files.publicHomepage);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const assetDecisionPacket = readRequired('homepage asset decision packet', files.assetDecisionPacket);

for (const phrase of [
  '<title>GCSC - Static Homepage Draft</title>',
  'Static CSS Candidate',
  'Internal Draft - Not Approved For Publication',
  'Publication Gate: NO-GO',
  'Scope: No Real Money',
  'Construction Trust Infrastructure',
  'Trust infrastructure for',
  'construction workflows',
  'partner-reviewed working-capital readiness',
  'Future Infrastructure Layer',
  'Research path, not public scope',
  'Reputation as <span class="gradient-text">readiness data</span>',
  'Current Public Whitepaper',
  'This static draft homepage does not approve public publication',
  'standalone PUBLICATION_GO',
  '--bg: #101214',
  '--panel: #161a1f',
  '--panel-2: #1f252c',
  '--brand: #2f6f8f',
  '--brand-2: #38a3a5',
  '--orange: #f59e0b',
  '--success: #22c55e',
  '--radius: 8px',
  'font-size: 70px;',
  'font-size: 52px;',
  'font-size: 38px;',
]) {
  requirePhrase(staticDraft, phrase, 'static homepage v1.3 draft');
}

for (const id of ['id="mission"', 'id="products"', 'id="technology"', 'id="review"']) {
  requirePhrase(staticDraft, id, 'static homepage v1.3 draft');
}

for (const href of [
  'href="#mission"',
  'href="#products"',
  'href="#technology"',
  'href="#review"',
  'href="whitepaper-v1-3-draft.html"',
  'href="whitepaper.html"',
]) {
  requirePhrase(staticDraft, href, 'static homepage v1.3 draft');
}

for (const phrase of [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'script src=',
  'tailwind.config',
  'AOS.init',
  '#8b5cf6',
  '#a78bfa',
  '#12121e',
  '#1a1a2e',
  '#0a0a0f',
  '#5b21b6',
  '#7c3aed',
  'rgba(139, 92, 246',
  'rgba(124, 58, 237',
  'hero::before',
  'radial-gradient',
  'clamp(',
]) {
  rejectPhrase(staticDraft, phrase, 'static homepage v1.3 draft');
}

for (const pattern of [
  /https?:\/\//i,
  /\bblockchain\b/i,
  /\bweb3\b/i,
  /\btoken\b/i,
  /\bxpr\b/i,
  /\bfio\b/i,
  /\bstablecoin\b/i,
  /\bescrow\b/i,
  /\blending\b/i,
  /\bloan\b/i,
  /\bcollateral\b/i,
  /\bmetallicus\b/i,
  /\bLOAN-style\b/i,
  /\binstant approval\b/i,
  /\bpublic launch approved\b/i,
  /\bproduction approved\b/i,
]) {
  rejectPattern(staticDraft, pattern, 'static homepage v1.3 draft');
}

for (const phrase of [
  'Tailwind CDN',
  'Google Fonts',
  'REQUIRE_COMPILED_PUBLIC_CSS',
  'REQUIRE_SYSTEM_OR_SELF_HOSTED_FONTS',
  'Hand-authored static CSS for draft',
  'no public edit without `PUBLICATION_GO`',
]) {
  requirePhrase(assetDecisionPacket, phrase, 'homepage asset decision packet');
}

if (!currentDraft.includes('https://cdn.tailwindcss.com')) {
  errors.push('current index-v1-3-draft.html should remain the original Tailwind CDN draft for existing QA evidence');
}

for (const [label, content] of [
  ['index.html', publicHomepage],
  ['whitepaper.html', publicWhitepaper],
]) {
  if (content.includes('Static CSS Candidate') || content.includes('GCSC - Static Homepage Draft')) {
    errors.push(`${label} appears to contain static draft-only content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('homepage v1.3 static draft validation passed');
