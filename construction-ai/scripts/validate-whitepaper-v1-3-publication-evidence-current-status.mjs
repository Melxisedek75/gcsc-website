import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  status: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  template: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-template.md'),
  dryRun: path.join(root, 'docs', 'whitepaper-v1-3-publication-readiness-dry-run.md'),
  gate: path.join(root, 'docs', 'whitepaper-v1-3-publication-gate.md'),
  founderDecision: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-intake-template.md'),
  reviewerResponse: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-intake-template.md'),
  draftNavigationReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotCaptureReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-capture-readiness-closeout.md'),
  localDraftQaReadiness: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  externalReviewerCoverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  reviewerResponseRoutingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
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

const status = readRequired('publication evidence current status', files.status);
const template = readRequired('publication evidence template', files.template);
const dryRun = readRequired('publication readiness dry run', files.dryRun);
const gate = readRequired('publication gate', files.gate);
const founderDecision = readRequired('founder decision intake', files.founderDecision);
const reviewerResponse = readRequired('reviewer response intake', files.reviewerResponse);
const draftNavigationReadinessCloseout = readRequired('draft navigation readiness closeout', files.draftNavigationReadinessCloseout);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotCaptureReadinessCloseout = readRequired('screenshot capture readiness closeout', files.screenshotCaptureReadinessCloseout);
const localDraftQaReadiness = readRequired('local draft QA readiness scorecard', files.localDraftQaReadiness);
const externalReviewerCoverSheet = readRequired('external reviewer cover sheet', files.externalReviewerCoverSheet);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const reviewerResponseRoutingCloseout = readRequired('reviewer response routing closeout', files.reviewerResponseRoutingCloseout);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Status: internal evidence status ledger',
  'Current publication decision remains NO-GO',
  'Local Evidence Already Available',
  'Evidence Still Missing Before Any GO',
  'Current Public File State',
  'Current decision: NO-GO',
  'Safe Next Actions',
  'Stop Boundary',
  'founder publication approval | PENDING',
  'legal/provider review | PENDING',
  'screenshot QA evidence | PENDING',
  'screenshot evidence intake | PENDING',
  'local draft QA scorecard | PENDING',
  'reviewer packet send approval | PENDING',
  'reviewer response received | PENDING',
  'manual navigation click evidence | PENDING',
]) {
  requirePhrase(status, phrase, 'publication evidence current status');
}

for (const checkName of [
  'npm run check:whitepaper-v1-3-plan',
  'npm run check:whitepaper-v1-3-public-html-plan',
  'npm run check:whitepaper-v1-3-draft-html-smoke',
  'npm run check:whitepaper-v1-3-draft-css-qa',
  'npm run check:whitepaper-v1-3-draft-navigation-readiness-closeout',
  'npm run check:whitepaper-v1-3-claim-risk-hardening',
  'npm run check:whitepaper-v1-3-founder-decision-intake',
  'npm run check:whitepaper-v1-3-reviewer-response-intake',
  'npm run check:whitepaper-v1-3-screenshot-evidence-manifest',
  'npm run check:whitepaper-v1-3-screenshot-evidence-intake',
  'npm run check:whitepaper-v1-3-screenshot-capture-readiness-closeout',
  'npm run check:whitepaper-v1-3-local-draft-qa-readiness',
  'npm run check:whitepaper-v1-3-publication-blocker-status-matrix',
  'npm run check:whitepaper-v1-3-founder-ready-packet-status-rollup',
  'npm run check:whitepaper-v1-3-internal-review-master-index',
  'npm run check:whitepaper-v1-3-external-reviewer-cover-sheet',
  'npm run check:whitepaper-v1-3-reviewer-packet-status-rollup',
  'npm run check:whitepaper-v1-3-reviewer-response-routing-closeout',
  'npm run check:ci-workflow',
]) {
  requirePhrase(status, checkName, 'publication evidence current status');
}

requirePhrase(template, 'Current decision | NO-GO', 'publication evidence template');
requirePhrase(dryRun, 'Current result: NO-GO', 'publication readiness dry run');
requirePhrase(gate, 'Default state: NO-GO', 'publication gate');
requirePhrase(founderDecision, 'public publication approved? | NO by default', 'founder decision intake');
requirePhrase(reviewerResponse, 'public publication approved? | NO by default', 'reviewer response intake');
requirePhrase(draftNavigationReadinessCloseout, 'Manual browser click evidence and screenshot evidence are PENDING', 'draft navigation readiness closeout');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(screenshotCaptureReadinessCloseout, 'No completed screenshot evidence is recorded', 'screenshot capture readiness closeout');
requirePhrase(localDraftQaReadiness, 'Current publication decision remains NO-GO', 'local draft QA readiness scorecard');
requirePhrase(externalReviewerCoverSheet, 'No outreach is approved or sent', 'external reviewer cover sheet');
requirePhrase(reviewerPacketStatusRollup, 'No outreach is approved', 'reviewer packet status rollup');
requirePhrase(reviewerResponseRoutingCloseout, 'No reviewer response is recorded yet', 'reviewer response routing closeout');

const blockedApprovalPatterns = [
  /\bCurrent decision:\s*GO\b/i,
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal\/provider review \| COMPLETE\b/i,
  /\bfounder publication approval \| COMPLETE\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(status)) {
    errors.push(`publication evidence status contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Publication Evidence Current Status') || content.includes('Local Evidence Already Available')) {
    errors.push(`${label} appears to contain internal publication evidence status content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 publication evidence current status validation passed');
