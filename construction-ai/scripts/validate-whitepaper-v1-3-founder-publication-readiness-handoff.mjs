import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  handoff: path.join(root, 'docs', 'whitepaper-v1-3-founder-publication-readiness-handoff.md'),
  publicationGate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  archiveRollbackEvidence: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
  finalPublicWordingDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicAnnouncementReview: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
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

function rejectPattern(text, pattern, label) {
  if (pattern.test(text)) {
    errors.push(`${label} contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

const handoff = readRequired('founder publication readiness handoff', files.handoff);
const publicationGate = readRequired('publication gate', files.publicationGate);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const archiveRollbackEvidence = readRequired('archive rollback evidence template', files.archiveRollbackEvidence);
const finalPublicWordingDiff = readRequired('final public wording diff template', files.finalPublicWordingDiff);
const publicAnnouncementReview = readRequired('public announcement review template', files.publicAnnouncementReview);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder publication readiness handoff',
  'Current publication decision remains NO-GO',
  'Current Readiness Snapshot',
  'Founder Decisions Available Now',
  'Founder Decisions Not Available Yet',
  'Evidence Still Required Before Any GO',
  'Safe Next Local Actions',
  'Stop Boundary',
  'READY_FOR_FOUNDER_REVIEW',
  'READY_LOCAL_NO_GO_HANDOFF',
  'PENDING_BROWSER_CAPTURE',
  'PENDING_BROWSER_CLICK',
  'PENDING_CAPTURE_AND_REDACTION',
  'PENDING_EXTERNAL_REVIEW',
  'PENDING_ARCHIVE_AND_ROLLBACK_REVIEW',
  'PENDING_FINAL_DIFF',
  'PENDING_ANNOUNCEMENT_REVIEW',
  'PUBLICATION_GO',
  'PUBLIC_FILE_REPLACEMENT_GO',
  'PROVIDER_OUTREACH_GO',
  'LEGAL_PROVIDER_CLEARANCE_RECORDED',
  'SCREENSHOT_QA_COMPLETE',
  'NAVIGATION_CLICK_QA_COMPLETE',
  'LIVE_FINANCE_WEB3_GO',
]) {
  requirePhrase(handoff, phrase, 'founder publication readiness handoff');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-public-draft.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-claim-risk-hardening-checklist.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-archive-rollback-evidence-template.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-public-announcement-review-template.md',
  'docs/whitepaper-v1-3-publication-gate.md',
]) {
  requirePhrase(handoff, fileReference, 'founder publication readiness handoff');
}

requirePhrase(publicationGate, 'Default state: NO-GO', 'publication gate');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(masterIndex, 'Current Decision State', 'internal review master index');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(archiveRollbackEvidence, 'PENDING_ARCHIVE_COPY', 'archive rollback evidence template');
requirePhrase(archiveRollbackEvidence, 'PENDING_ROLLBACK_REVIEW', 'archive rollback evidence template');
requirePhrase(finalPublicWordingDiff, 'PENDING_FINAL_WORDING_DIFF', 'final public wording diff template');
requirePhrase(publicAnnouncementReview, 'PENDING_ANNOUNCEMENT_REVIEW', 'public announcement review template');

const blockedHandoffPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bGO for publication\b/i,
  /\bprovider outreach approved\b/i,
  /\blive action approved\b/i,
];

for (const pattern of blockedHandoffPatterns) {
  rejectPattern(handoff, pattern, 'founder publication readiness handoff');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder Publication Readiness Handoff') || content.includes('Founder Decisions Available Now')) {
    errors.push(`${label} appears to contain internal founder publication readiness handoff content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder publication readiness handoff validation passed');
