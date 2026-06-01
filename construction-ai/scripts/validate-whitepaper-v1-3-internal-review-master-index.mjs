import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  founderActionBoard: path.join(root, 'docs', 'whitepaper-v1-3-founder-action-board.md'),
  founderPacket: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-packet.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderApprovalToReview: path.join(root, 'docs', 'whitepaper-v1-3-founder-approval-to-review-packet.md'),
  founderStateTransitionMatrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
  publicDraft: path.join(root, 'docs', 'whitepaper-v1-3-public-draft.md'),
  smartcontractorWordingStatus: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  providerQuestionStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  reviewerRouting: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  reviewerEvidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  reviewerRedaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  externalReviewerCoverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  reviewerSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  reviewerResponseRoutingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
  screenshotHandoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  screenshotCaptureReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-capture-readiness-closeout.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  qaIssueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  localDraftQaReadiness: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  publicWordingScan: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-current-status.md'),
  whitepaperDraftHtml: path.join(root, 'whitepaper-v1-3-draft.html'),
  homepageDraftHtml: path.join(root, 'index-v1-3-draft.html'),
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

const masterIndex = readRequired('internal review master index', files.masterIndex);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const founderActionBoard = readRequired('founder action board', files.founderActionBoard);
const founderPacket = readRequired('founder review packet', files.founderPacket);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const founderApprovalToReview = readRequired('founder approval-to-review packet', files.founderApprovalToReview);
const founderStateTransitionMatrix = readRequired('founder review state transition matrix', files.founderStateTransitionMatrix);
const publicDraft = readRequired('public draft', files.publicDraft);
const smartcontractorWordingStatus = readRequired('SmartContractor wording review status', files.smartcontractorWordingStatus);
const providerQuestionStatus = readRequired('provider question status matrix', files.providerQuestionStatus);
const reviewerRouting = readRequired('reviewer routing index', files.reviewerRouting);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const reviewerEvidenceAppendix = readRequired('reviewer evidence appendix', files.reviewerEvidenceAppendix);
const reviewerRedaction = readRequired('reviewer packet redaction checklist', files.reviewerRedaction);
const externalReviewerCoverSheet = readRequired('external reviewer cover sheet', files.externalReviewerCoverSheet);
const reviewerSummary = readRequired('reviewer response summary shell', files.reviewerSummary);
const reviewerResponseRoutingCloseout = readRequired('reviewer response routing closeout', files.reviewerResponseRoutingCloseout);
const screenshotHandoff = readRequired('screenshot handoff', files.screenshotHandoff);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const screenshotCaptureReadinessCloseout = readRequired('screenshot capture readiness closeout', files.screenshotCaptureReadinessCloseout);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const qaIssueRegister = readRequired('draft QA issue register', files.qaIssueRegister);
const localDraftQaReadiness = readRequired('local draft QA readiness scorecard', files.localDraftQaReadiness);
const publicWordingScan = readRequired('public wording scan status', files.publicWordingScan);
const whitepaperDraftHtml = readRequired('whitepaper draft HTML', files.whitepaperDraftHtml);
const homepageDraftHtml = readRequired('homepage draft HTML', files.homepageDraftHtml);
const publicWhitepaper = readRequired('public whitepaper', files.publicWhitepaper);
const publicHomepage = readRequired('public homepage', files.publicHomepage);

for (const phrase of [
  'Recommended Reading Order',
  'Strategy And Direction',
  'Public-Safe Drafts',
  'Claim-Risk Controls',
  'Provider And Legal Review',
  'Future Web3 Research',
  'Publication Evidence And Gates',
  'Local QA And Issue Control',
  'Current Decision State',
  'Founder Review Output',
  'Stop Boundary',
  'founder-ready packet status | ready for founder review',
  'founder action board | ready for founder review',
  'public whitepaper replacement | NO-GO',
  'public homepage replacement | NO-GO',
  'screenshot capture readiness closeout | local readiness only / no screenshots recorded',
  'screenshot evidence results | local template only / all results PENDING_CAPTURE',
  'navigation click evidence results | local template only / all results PENDING_CLICK',
]) {
  requirePhrase(masterIndex, phrase, 'internal review master index');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-founder-action-board.md',
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-response-routing-closeout.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-screenshot-capture-readiness-closeout.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-go-record-template.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
]) {
  requirePhrase(masterIndex, fileReference, 'internal review master index');
}

requirePhrase(founderReadyRollup, 'Founder-Ready Packet Status Rollup', 'founder-ready packet status rollup');
requirePhrase(founderActionBoard, 'Founder Action Board', 'founder action board');
requirePhrase(founderActionBoard, 'Founder Inputs Still Needed', 'founder action board');
requirePhrase(founderPacket, 'Construction Trust Infrastructure first', 'founder review packet');
requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(founderApprovalToReview, 'V1_3_LOCAL_REVIEW_APPROVED', 'founder approval-to-review packet');
requirePhrase(founderStateTransitionMatrix, 'NO_GO_PUBLICATION_DEFAULT', 'founder review state transition matrix');
requirePhrase(publicDraft, 'Status: internal public-safe draft', 'public draft');
requirePhrase(smartcontractorWordingStatus, 'SmartContractor Wording Review Status', 'SmartContractor wording review status');
requirePhrase(providerQuestionStatus, 'Provider Question Status Matrix', 'provider question status matrix');
requirePhrase(reviewerRouting, 'Reviewer Response Intake', 'reviewer routing index');
requirePhrase(reviewerPacketStatusRollup, 'Reviewer Packet Status Rollup', 'reviewer packet status rollup');
requirePhrase(reviewerEvidenceAppendix, 'Reviewer Evidence Appendix', 'reviewer evidence appendix');
requirePhrase(reviewerEvidenceAppendix, 'Evidence Not Yet Complete', 'reviewer evidence appendix');
requirePhrase(reviewerRedaction, 'Reviewer Packet Redaction Checklist', 'reviewer packet redaction checklist');
requirePhrase(externalReviewerCoverSheet, 'External Reviewer Cover Sheet', 'external reviewer cover sheet');
requirePhrase(reviewerSummary, 'Reviewer Response Summary Shell', 'reviewer response summary shell');
requirePhrase(reviewerResponseRoutingCloseout, 'Reviewer Response Routing Closeout', 'reviewer response routing closeout');
requirePhrase(screenshotHandoff, 'Screenshot QA is PENDING', 'screenshot handoff');
requirePhrase(screenshotManifest, 'Screenshot Evidence Manifest', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot Evidence Intake Checklist', 'screenshot evidence intake checklist');
requirePhrase(screenshotResults, 'No screenshot evidence is recorded', 'screenshot evidence results template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(screenshotCaptureReadinessCloseout, 'Screenshot Capture Readiness Closeout', 'screenshot capture readiness closeout');
requirePhrase(navigationClickResults, 'No browser click evidence is recorded', 'navigation click evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(qaIssueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(localDraftQaReadiness, 'Local Draft QA Readiness Scorecard', 'local draft QA readiness scorecard');
requirePhrase(publicWordingScan, 'Public Wording Scan Current Status', 'public wording scan status');
requirePhrase(whitepaperDraftHtml, 'Internal Draft - Not Approved For Publication', 'whitepaper draft HTML');
requirePhrase(homepageDraftHtml, 'Publication Gate: NO-GO', 'homepage draft HTML');

const blockedApprovalPatterns = [
  /\bpublication approved\b/i,
  /\bpublic replacement approved\b/i,
  /\blegal conclusion approved\b/i,
  /\bprovider commitment approved\b/i,
  /\blive action approved\b/i,
  /\bpartnership approved\b/i,
];

for (const pattern of blockedApprovalPatterns) {
  if (pattern.test(masterIndex)) {
    errors.push(`internal review master index contains approval-sounding blocked phrase: ${pattern.source}`);
  }
}

for (const [label, content] of [
  ['whitepaper.html', publicWhitepaper],
  ['index.html', publicHomepage],
]) {
  if (content.includes('Internal Review Master Index') || content.includes('Recommended Reading Order')) {
    errors.push(`${label} appears to contain internal review index content`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 internal review master index validation passed');
