import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  closeout: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  readinessScorecard: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
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

function requireHtmlId(html, id, label) {
  requirePhrase(html, `id="${id}"`, label);
}

function requireHtmlLink(html, href, label) {
  requirePhrase(html, `href="${href}"`, label);
}

function requireAnchorTargets(html, targets, label) {
  for (const target of targets) {
    requireHtmlLink(html, `#${target}`, label);
    requireHtmlId(html, target, label);
  }
}

const closeout = readRequired('draft navigation readiness closeout', files.closeout);
const readinessScorecard = readRequired('local draft QA readiness scorecard', files.readinessScorecard);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft navigation readiness closeout',
  'Draft Navigation Readiness Closeout',
  'Files Checked',
  'Whitepaper Draft Anchor Map',
  'Homepage Draft Anchor Map',
  'Manual QA Still Required',
  'Current Limitation',
  'Stop Boundary',
  'PASS_LOCAL_STATIC only',
  'Manual browser click evidence and screenshot evidence are PENDING',
]) {
  requirePhrase(closeout, phrase, 'draft navigation readiness closeout');
}

for (const reference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
  '#summary',
  '#problem',
  '#product',
  '#milestones',
  '#capital',
  '#partners',
  '#web3',
  '#fio',
  '#metal',
  '#value-mirror',
  '#gates',
  '#mission',
  '#products',
  '#technology',
  '#review',
]) {
  requirePhrase(closeout, reference, 'draft navigation readiness closeout');
}

requirePhrase(readinessScorecard, 'draft navigation readiness closeout', 'local draft QA readiness scorecard');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage draft');

requireAnchorTargets(
  whitepaperDraft,
  ['summary', 'product', 'partners', 'web3', 'gates', 'problem', 'milestones', 'capital', 'fio', 'metal', 'value-mirror'],
  'whitepaper draft'
);

requireAnchorTargets(
  homepageDraft,
  ['mission', 'products', 'technology', 'review'],
  'homepage draft'
);

for (const href of ['index.html', 'whitepaper.html']) {
  requireHtmlLink(whitepaperDraft, href, 'whitepaper draft');
}

for (const href of ['whitepaper-v1-3-draft.html', 'whitepaper.html']) {
  requireHtmlLink(homepageDraft, href, 'homepage draft');
}

const blockedApprovalPatterns = [
  /\bmanual click QA complete\b/i,
  /\bscreenshot QA complete\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal approval recorded\b/i,
  /\bprovider approval recorded\b/i,
  /\blive action approved\b/i,
  /\bGO for publication\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(closeout)) {
    errors.push(`draft navigation readiness closeout contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Draft Navigation Readiness Closeout')
    || content.includes('Whitepaper Draft Anchor Map')
    || content.includes('PASS_LOCAL_STATIC only')
  ) {
    errors.push(`${label} appears to contain internal draft navigation readiness closeout content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft navigation readiness closeout validation passed');
