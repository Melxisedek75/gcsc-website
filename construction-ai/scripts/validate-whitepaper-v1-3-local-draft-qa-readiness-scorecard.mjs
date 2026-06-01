import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  scorecard: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  publicWordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  draftNavigationReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  draftNavigationClickQaHandoff: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-click-qa-handoff.md'),
  screenshotHandoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
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

const scorecard = readRequired('local draft QA readiness scorecard', files.scorecard);
const publicWordingScan = readRequired('public wording scan status', files.publicWordingScan);
const draftNavigationReadinessCloseout = readRequired('draft navigation readiness closeout', files.draftNavigationReadinessCloseout);
const draftNavigationClickQaHandoff = readRequired('draft navigation click QA handoff', files.draftNavigationClickQaHandoff);
const screenshotHandoff = readRequired('screenshot QA handoff', files.screenshotHandoff);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const whitepaperDraft = readRequired('whitepaper draft', files.whitepaperDraft);
const homepageDraft = readRequired('homepage draft', files.homepageDraft);
const draftCss = readRequired('whitepaper draft CSS', files.draftCss);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal local draft QA readiness scorecard',
  'Current publication decision remains NO-GO',
  'Local Draft QA Inputs',
  'Readiness Score',
  'Required Before Any Future Public Use',
  'Safe Next QA Actions',
  'Stop Boundary',
  'draft HTML smoke check | PASS_LOCAL',
  'draft CSS QA check | PASS_LOCAL',
  'draft navigation readiness closeout | PASS_LOCAL_STATIC_ONLY',
  'draft navigation click QA handoff | READY_LOCAL_TEMPLATE',
  'navigation and anchor readiness | PASS_LOCAL_STATIC',
  'navigation click QA handoff | READY_LOCAL_TEMPLATE',
  'screenshot evidence | PENDING',
  'legal/provider evidence | PENDING',
  'founder publication record | PENDING',
  'public replacement readiness | NO-GO',
]) {
  requirePhrase(scorecard, phrase, 'local draft QA readiness scorecard');
}

for (const linkedReference of [
  'npm run check:whitepaper-v1-3-draft-html-smoke',
  'npm run check:whitepaper-v1-3-draft-css-qa',
  'docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md',
  'docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper-v1-3-draft.css',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(scorecard, linkedReference, 'local draft QA readiness scorecard');
}

requirePhrase(publicWordingScan, 'Public Wording Scan Current Status', 'public wording scan status');
requirePhrase(draftNavigationReadinessCloseout, 'Draft Navigation Readiness Closeout', 'draft navigation readiness closeout');
requirePhrase(draftNavigationClickQaHandoff, 'Draft Navigation Click QA Handoff', 'draft navigation click QA handoff');
requirePhrase(screenshotHandoff, 'Screenshot QA is PENDING', 'screenshot QA handoff');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(whitepaperDraft, 'Internal Draft - Not Approved For Publication', 'whitepaper draft');
requirePhrase(homepageDraft, 'Publication Gate', 'homepage draft');
requirePhrase(draftCss, 'box-sizing', 'whitepaper draft CSS');

const blockedApprovalPatterns = [
  /\bCurrent publication decision remains GO\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bscreenshot QA \| COMPLETE\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bfounder publication approval \| COMPLETE\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(scorecard)) {
    errors.push(`local draft QA readiness scorecard contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Local Draft QA Readiness Scorecard') || content.includes('Readiness Score')) {
    errors.push(`${label} appears to contain internal local draft QA scorecard content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 local draft QA readiness scorecard validation passed');
