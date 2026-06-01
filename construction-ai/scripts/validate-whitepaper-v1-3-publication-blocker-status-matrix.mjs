import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  matrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  goTemplate: path.join(root, 'docs', 'whitepaper-v1-3-publication-go-record-template.md'),
  archiveRollbackEvidence: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
  finalPublicWordingDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicAnnouncementReview: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  founderDecision: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  reviewerSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
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

const matrix = readRequired('publication blocker status matrix', files.matrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const goTemplate = readRequired('publication GO record template', files.goTemplate);
const archiveRollbackEvidence = readRequired('archive rollback evidence template', files.archiveRollbackEvidence);
const finalPublicWordingDiff = readRequired('final public wording diff template', files.finalPublicWordingDiff);
const publicAnnouncementReview = readRequired('public announcement review template', files.publicAnnouncementReview);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const founderDecision = readRequired('founder decision intake', files.founderDecision);
const reviewerSummary = readRequired('reviewer response summary shell', files.reviewerSummary);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal publication blocker status matrix',
  'Current publication decision remains NO-GO',
  'Blocker Matrix',
  'Linked Control Documents',
  'Clearance Rule',
  'Stop Boundary',
  'founder publication decision | PENDING',
  'legal/provider review | PENDING',
  'screenshot QA | PENDING',
  'visual QA evidence review | PENDING',
  'provider outreach | BLOCKED',
  'public file replacement | BLOCKED',
  'live finance/Web3 actions | BLOCKED',
]) {
  requirePhrase(matrix, phrase, 'publication blocker status matrix');
}

for (const linkedDoc of [
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-go-record-template.md',
  'docs/whitepaper-v1-3-archive-rollback-evidence-template.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-public-announcement-review-template.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-founder-decision-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
]) {
  requirePhrase(matrix, linkedDoc, 'publication blocker status matrix');
}

requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(goTemplate, 'Current decision | NO-GO by default', 'publication GO record template');
requirePhrase(archiveRollbackEvidence, 'No archive copy or rollback execution is recorded here', 'archive rollback evidence template');
requirePhrase(finalPublicWordingDiff, 'No final public wording diff is recorded here', 'final public wording diff template');
requirePhrase(publicAnnouncementReview, 'No public announcement', 'public announcement review template');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(localBrowserReviewNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(founderDecision, 'public publication approved? | NO by default', 'founder decision intake');
requirePhrase(reviewerSummary, 'No reviewer response is recorded yet', 'reviewer response summary shell');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(issueRegister, 'Current publication decision remains NO-GO', 'draft QA issue register');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');

const blockedPatterns = [
  /\bCurrent publication decision remains GO\b/i,
  /\bfounder publication decision \| COMPLETE\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bscreenshot QA \| COMPLETE\b/i,
  /\bprovider outreach \| ALLOWED\b/i,
  /\bpublic file replacement \| ALLOWED\b/i,
  /\blive finance\/Web3 actions \| ALLOWED\b/i,
  /\bpublic replacement authorized\b/i,
  /\blive action authorized\b/i,
  /\bpartnership commitment recorded\b/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(matrix)) {
    errors.push(`publication blocker status matrix contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Publication Blocker Status Matrix') || content.includes('Blocker Matrix')) {
    errors.push(`${label} appears to contain internal publication blocker status matrix content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 publication blocker status matrix validation passed');
