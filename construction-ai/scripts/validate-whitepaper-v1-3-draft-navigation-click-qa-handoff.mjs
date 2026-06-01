import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-click-qa-handoff.md'),
  readinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
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

const handoff = readRequired('draft navigation click QA handoff', files.handoff);
const readinessCloseout = readRequired('draft navigation readiness closeout', files.readinessCloseout);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const publicationEvidence = readRequired('publication evidence current status', files.publicationEvidence);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal draft navigation click QA handoff',
  'Manual click QA remains PENDING',
  'Files To Open',
  'Whitepaper Click Sequence',
  'Homepage Click Sequence',
  'What To Record',
  'Issue Routing',
  'Required Before Any PASS',
  'Stop Boundary',
  'publication evidence ledger still says NO-GO',
]) {
  requirePhrase(handoff, phrase, 'draft navigation click QA handoff');
}

for (const evidenceId of [
  'V13-NAV-WP-01',
  'V13-NAV-WP-02',
  'V13-NAV-WP-03',
  'V13-NAV-WP-04',
  'V13-NAV-WP-05',
  'V13-NAV-WP-06',
  'V13-NAV-HOME-01',
  'V13-NAV-HOME-02',
  'V13-NAV-HOME-03',
  'V13-NAV-HOME-04',
  'V13-NAV-HOME-05',
]) {
  requirePhrase(handoff, evidenceId, 'draft navigation click QA handoff');
}

for (const reference of [
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
]) {
  requirePhrase(handoff, reference, 'draft navigation click QA handoff');
}

for (const target of [
  '#summary',
  '#product',
  '#partners',
  '#web3',
  '#gates',
]) {
  requirePhrase(whitepaperDraft, `href="${target}"`, 'whitepaper draft');
  requirePhrase(handoff, target, 'draft navigation click QA handoff');
}

for (const target of [
  '#mission',
  '#products',
  '#technology',
  '#review',
]) {
  requirePhrase(homepageDraft, `href="${target}"`, 'homepage draft');
  requirePhrase(handoff, target, 'draft navigation click QA handoff');
}

requirePhrase(readinessCloseout, 'Manual browser click evidence and screenshot evidence are PENDING', 'draft navigation readiness closeout');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(publicationEvidence, 'manual navigation click evidence | PENDING', 'publication evidence current status');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft');
requirePhrase(homepageDraft, 'Publication Gate: NO-GO', 'homepage draft');

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
  if (pattern.test(handoff)) {
    errors.push(`draft navigation click QA handoff contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (
    content.includes('Draft Navigation Click QA Handoff')
    || content.includes('V13-NAV-WP-01')
    || content.includes('V13-NAV-HOME-01')
  ) {
    errors.push(`${label} appears to contain internal draft navigation click QA handoff content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 draft navigation click QA handoff validation passed');
