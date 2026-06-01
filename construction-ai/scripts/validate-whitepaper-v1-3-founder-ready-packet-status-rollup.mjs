import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  rollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderApprovalToReview: path.join(root, 'docs', 'whitepaper-v1-3-founder-approval-to-review-packet.md'),
  founderStateTransitionMatrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  smartcontractorStatus: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
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

const rollup = readRequired('founder-ready packet status rollup', files.rollup);
const masterIndex = readRequired('internal review master index', files.masterIndex);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const founderApprovalToReview = readRequired('founder approval-to-review packet', files.founderApprovalToReview);
const founderStateTransitionMatrix = readRequired('founder review state transition matrix', files.founderStateTransitionMatrix);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const smartcontractorStatus = readRequired('SmartContractor wording review status', files.smartcontractorStatus);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal founder-ready packet status rollup',
  'Current publication decision remains NO-GO',
  'Founder Reading Path',
  'Current Packet Status',
  'Open Blockers',
  'Safe Founder Decisions Available',
  'Decisions Not Available Yet',
  'Stop Boundary',
  'founder publication decision | PENDING',
  'legal/provider review | PENDING',
  'screenshot QA | PENDING',
  'provider outreach | BLOCKED',
  'public file replacement | BLOCKED',
  'live finance/Web3 activity | BLOCKED',
]) {
  requirePhrase(rollup, phrase, 'founder-ready packet status rollup');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'whitepaper.html',
  'index.html',
]) {
  requirePhrase(rollup, fileReference, 'founder-ready packet status rollup');
}

requirePhrase(masterIndex, 'Recommended Reading Order', 'internal review master index');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(founderApprovalToReview, 'V1_3_LOCAL_REVIEW_APPROVED', 'founder approval-to-review packet');
requirePhrase(founderStateTransitionMatrix, 'NO_GO_PUBLICATION_DEFAULT', 'founder review state transition matrix');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(smartcontractorStatus, 'SmartContractor Wording Review Status', 'SmartContractor wording review status');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');

const blockedPatterns = [
  /\bCurrent publication decision remains GO\b/i,
  /\bpublic publication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\bfounder publication decision \| COMPLETE\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bscreenshot QA \| COMPLETE\b/i,
  /\bprovider response recorded\b/i,
  /\blive action approved\b/i,
  /\bpartnership commitment recorded\b/i,
  /\bprovider outreach \| ALLOWED\b/i,
  /\bpublic file replacement \| ALLOWED\b/i,
];

for (const pattern of blockedPatterns) {
  rejectPattern(rollup, pattern, 'founder-ready packet status rollup');
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Founder-Ready Packet Status Rollup') || content.includes('Founder Reading Path')) {
    errors.push(`${label} appears to contain internal founder-ready rollup content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 founder-ready packet status rollup validation passed');
