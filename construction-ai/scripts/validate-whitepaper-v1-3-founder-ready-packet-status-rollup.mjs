import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  rollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderActionBoard: path.join(root, 'docs', 'whitepaper-v1-3-founder-action-board.md'),
  founderEveningReviewGuide: path.join(root, 'docs', 'whitepaper-v1-3-founder-evening-review-guide.md'),
  founderDecisionRoutingChecklist: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-routing-checklist.md'),
  founderApprovalToReview: path.join(root, 'docs', 'whitepaper-v1-3-founder-approval-to-review-packet.md'),
  founderStateTransitionMatrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  reviewerEvidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  questionMapping: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  evidenceStatus: path.join(root, 'docs', 'whitepaper-v1-3-publication-evidence-current-status.md'),
  founderPublicationReadinessHandoff: path.join(root, 'docs', 'whitepaper-v1-3-founder-publication-readiness-handoff.md'),
  founderBrowserQaRunbook: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-runbook.md'),
  founderBrowserQaReport: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-report-template.md'),
  founderBrowserQaIssueIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-issue-intake-template.md'),
  browserQaEvidenceFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  draftStaticAssetManifest: path.join(root, 'docs', 'whitepaper-v1-3-draft-static-asset-manifest.md'),
  draftExternalAssetReviewIntake: path.join(root, 'docs', 'whitepaper-v1-3-draft-external-asset-review-intake-checklist.md'),
  draftPrintPdfExportStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-print-pdf-export-static-checklist.md'),
  draftAccessibilityStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-accessibility-static-checklist.md'),
  draftResponsiveStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-responsive-static-checklist.md'),
  draftContentParityChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-content-parity-checklist.md'),
  draftLinkCtaStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-link-cta-static-checklist.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  archiveRollbackEvidence: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
  finalPublicWordingDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicAnnouncementReview: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
  publicDistributionBoundaryMatrix: path.join(root, 'docs', 'whitepaper-v1-3-public-distribution-boundary-matrix.md'),
  providerStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  smartcontractorStatus: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  issueRegister: path.join(root, 'docs', 'whitepaper-v1-3-draft-qa-issue-register.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
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
const founderActionBoard = readRequired('founder action board', files.founderActionBoard);
const founderEveningReviewGuide = readRequired('founder evening review guide', files.founderEveningReviewGuide);
const founderDecisionRoutingChecklist = readRequired('founder decision routing checklist', files.founderDecisionRoutingChecklist);
const founderApprovalToReview = readRequired('founder approval-to-review packet', files.founderApprovalToReview);
const founderStateTransitionMatrix = readRequired('founder review state transition matrix', files.founderStateTransitionMatrix);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const reviewerEvidenceAppendix = readRequired('reviewer evidence appendix', files.reviewerEvidenceAppendix);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const questionMapping = readRequired('reviewer question mapping matrix', files.questionMapping);
const evidenceStatus = readRequired('publication evidence current status', files.evidenceStatus);
const founderPublicationReadinessHandoff = readRequired('founder publication readiness handoff', files.founderPublicationReadinessHandoff);
const founderBrowserQaRunbook = readRequired('founder browser QA runbook', files.founderBrowserQaRunbook);
const founderBrowserQaReport = readRequired('founder browser QA report template', files.founderBrowserQaReport);
const founderBrowserQaIssueIntake = readRequired('founder browser QA issue intake template', files.founderBrowserQaIssueIntake);
const browserQaEvidenceFlow = readRequired('browser QA evidence flow', files.browserQaEvidenceFlow);
const draftStaticAssetManifest = readRequired('draft static asset manifest', files.draftStaticAssetManifest);
const draftExternalAssetReviewIntake = readRequired('draft external asset review intake checklist', files.draftExternalAssetReviewIntake);
const draftPrintPdfExportStaticChecklist = readRequired('draft print/PDF export static checklist', files.draftPrintPdfExportStaticChecklist);
const draftAccessibilityStaticChecklist = readRequired('draft accessibility static checklist', files.draftAccessibilityStaticChecklist);
const draftResponsiveStaticChecklist = readRequired('draft responsive static checklist', files.draftResponsiveStaticChecklist);
const draftContentParityChecklist = readRequired('draft content parity checklist', files.draftContentParityChecklist);
const draftLinkCtaStaticChecklist = readRequired('draft link CTA static checklist', files.draftLinkCtaStaticChecklist);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const archiveRollbackEvidence = readRequired('archive rollback evidence template', files.archiveRollbackEvidence);
const finalPublicWordingDiff = readRequired('final public wording diff template', files.finalPublicWordingDiff);
const publicAnnouncementReview = readRequired('public announcement review template', files.publicAnnouncementReview);
const publicDistributionBoundaryMatrix = readRequired('public distribution boundary matrix', files.publicDistributionBoundaryMatrix);
const providerStatus = readRequired('provider question status matrix', files.providerStatus);
const smartcontractorStatus = readRequired('SmartContractor wording review status', files.smartcontractorStatus);
const issueRegister = readRequired('draft QA issue register', files.issueRegister);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
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
  'navigation click QA | PENDING',
  'visual QA evidence | READY_LOCAL_TEMPLATE_PENDING_BROWSER_CAPTURE',
  'local browser review notes | PENDING_BROWSER_CAPTURE',
  'founder publication readiness handoff | READY_LOCAL_NO_GO_HANDOFF',
  'founder browser QA runbook | READY_LOCAL_RUNBOOK_PENDING_EXECUTION',
  'founder browser QA report template | READY_LOCAL_TEMPLATE_PENDING_REPORT',
  'founder browser QA issue intake template | READY_LOCAL_TEMPLATE_PENDING_ISSUE_ROUTING',
  'browser QA evidence flow | READY_LOCAL_FLOW_PENDING_EVIDENCE',
  'draft static asset manifest | READY_LOCAL_MANIFEST_PENDING_EXTERNAL_ASSET_REVIEW',
  'draft external asset review intake | READY_LOCAL_TEMPLATE_PENDING_EXTERNAL_ASSET_REVIEW',
  'draft print/PDF export static checklist | READY_STATIC_CHECKLIST_PENDING_PRINT_PDF_EXPORT_REVIEW',
  'draft accessibility static checklist | READY_STATIC_CHECKLIST_PENDING_BROWSER_A11Y',
  'draft responsive static checklist | READY_STATIC_CHECKLIST_PENDING_RESPONSIVE_BROWSER',
  'draft content parity checklist | READY_STATIC_CHECKLIST_PENDING_BROWSER_CONTENT_REVIEW',
  'draft link and CTA static checklist | READY_STATIC_CHECKLIST_PENDING_BROWSER_CLICK_REVIEW',
  'public distribution boundary matrix | READY_LOCAL_MATRIX_NO_GO',
  'reviewer packet send readiness | READY_LOCAL_CHECKLIST_PENDING_FOUNDER_SEND_DECISION',
  'reviewer packet send readiness | PENDING_FOUNDER_SEND_DECISION',
  'reviewer question mapping | READY_LOCAL_MATRIX_PENDING_FOUNDER_CATEGORY_SELECTION',
  'reviewer question mapping | PENDING_FOUNDER_CATEGORY_SELECTION',
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
  'docs/whitepaper-v1-3-founder-action-board.md',
  'docs/whitepaper-v1-3-founder-evening-review-guide.md',
  'docs/whitepaper-v1-3-founder-decision-routing-checklist.md',
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-founder-publication-readiness-handoff.md',
  'docs/whitepaper-v1-3-founder-browser-qa-runbook.md',
  'docs/whitepaper-v1-3-founder-browser-qa-report-template.md',
  'docs/whitepaper-v1-3-founder-browser-qa-issue-intake-template.md',
  'docs/whitepaper-v1-3-browser-qa-evidence-flow.md',
  'docs/whitepaper-v1-3-draft-static-asset-manifest.md',
  'docs/whitepaper-v1-3-draft-external-asset-review-intake-checklist.md',
  'docs/whitepaper-v1-3-draft-print-pdf-export-static-checklist.md',
  'docs/whitepaper-v1-3-draft-accessibility-static-checklist.md',
  'docs/whitepaper-v1-3-draft-responsive-static-checklist.md',
  'docs/whitepaper-v1-3-draft-content-parity-checklist.md',
  'docs/whitepaper-v1-3-draft-link-cta-static-checklist.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-archive-rollback-evidence-template.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-public-announcement-review-template.md',
  'docs/whitepaper-v1-3-public-distribution-boundary-matrix.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
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
requirePhrase(founderActionBoard, 'Founder Action Board', 'founder action board');
requirePhrase(founderActionBoard, 'public file replacement | BLOCKED', 'founder action board');
requirePhrase(founderEveningReviewGuide, 'Founder Evening Review Guide', 'founder evening review guide');
requirePhrase(founderEveningReviewGuide, '15-Minute Review Order', 'founder evening review guide');
requirePhrase(founderDecisionRoutingChecklist, 'Founder Decision Routing Checklist', 'founder decision routing checklist');
requirePhrase(founderDecisionRoutingChecklist, 'Routing Matrix', 'founder decision routing checklist');
requirePhrase(founderApprovalToReview, 'V1_3_LOCAL_REVIEW_APPROVED', 'founder approval-to-review packet');
requirePhrase(founderStateTransitionMatrix, 'NO_GO_PUBLICATION_DEFAULT', 'founder review state transition matrix');
requirePhrase(reviewerPacketStatusRollup, 'Reviewer Packet Status Rollup', 'reviewer packet status rollup');
requirePhrase(reviewerEvidenceAppendix, 'Reviewer Evidence Appendix', 'reviewer evidence appendix');
requirePhrase(reviewerEvidenceAppendix, 'No outreach is approved', 'reviewer evidence appendix');
requirePhrase(sendReadiness, 'Reviewer Packet Send Readiness Checklist', 'reviewer packet send readiness checklist');
requirePhrase(sendReadiness, 'BLOCKED_NO_SEND', 'reviewer packet send readiness checklist');
requirePhrase(questionMapping, 'Reviewer Question Mapping Matrix', 'reviewer question mapping matrix');
requirePhrase(questionMapping, 'BLOCKED_NO_OUTREACH', 'reviewer question mapping matrix');
requirePhrase(evidenceStatus, 'Current decision: NO-GO', 'publication evidence current status');
requirePhrase(founderPublicationReadinessHandoff, 'Founder Publication Readiness Handoff', 'founder publication readiness handoff');
requirePhrase(founderPublicationReadinessHandoff, 'Current publication decision remains NO-GO', 'founder publication readiness handoff');
requirePhrase(founderBrowserQaRunbook, 'Founder Browser QA Runbook', 'founder browser QA runbook');
requirePhrase(founderBrowserQaRunbook, 'Browser QA remains PENDING', 'founder browser QA runbook');
requirePhrase(founderBrowserQaReport, 'Founder Browser QA Report Template', 'founder browser QA report template');
requirePhrase(founderBrowserQaReport, 'PENDING_BROWSER_QA_REPORT', 'founder browser QA report template');
requirePhrase(founderBrowserQaIssueIntake, 'Founder Browser QA Issue Intake Template', 'founder browser QA issue intake template');
requirePhrase(founderBrowserQaIssueIntake, 'PENDING_ISSUE_ROUTING', 'founder browser QA issue intake template');
requirePhrase(browserQaEvidenceFlow, 'Browser QA Evidence Flow', 'browser QA evidence flow');
requirePhrase(browserQaEvidenceFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(draftStaticAssetManifest, 'Draft Static Asset Manifest', 'draft static asset manifest');
requirePhrase(draftStaticAssetManifest, 'PENDING_EXTERNAL_ASSET_REVIEW', 'draft static asset manifest');
requirePhrase(draftExternalAssetReviewIntake, 'Draft External Asset Review Intake Checklist', 'draft external asset review intake checklist');
requirePhrase(draftExternalAssetReviewIntake, 'PENDING_EXTERNAL_ASSET_REVIEW', 'draft external asset review intake checklist');
requirePhrase(draftExternalAssetReviewIntake, 'PENDING_PRIVACY_REVIEW', 'draft external asset review intake checklist');
requirePhrase(draftPrintPdfExportStaticChecklist, 'Draft Print PDF Export Static Checklist', 'draft print/PDF export static checklist');
requirePhrase(draftPrintPdfExportStaticChecklist, 'PENDING_PRINT_PDF_EXPORT_REVIEW', 'draft print/PDF export static checklist');
requirePhrase(draftAccessibilityStaticChecklist, 'Draft Accessibility Static Checklist', 'draft accessibility static checklist');
requirePhrase(draftAccessibilityStaticChecklist, 'PENDING_BROWSER_A11Y_REVIEW', 'draft accessibility static checklist');
requirePhrase(draftResponsiveStaticChecklist, 'Draft Responsive Static Checklist', 'draft responsive static checklist');
requirePhrase(draftResponsiveStaticChecklist, 'PENDING_RESPONSIVE_BROWSER_REVIEW', 'draft responsive static checklist');
requirePhrase(draftContentParityChecklist, 'Draft Content Parity Checklist', 'draft content parity checklist');
requirePhrase(draftContentParityChecklist, 'PENDING_BROWSER_CONTENT_REVIEW', 'draft content parity checklist');
requirePhrase(draftLinkCtaStaticChecklist, 'Draft Link CTA Static Checklist', 'draft link CTA static checklist');
requirePhrase(draftLinkCtaStaticChecklist, 'PENDING_BROWSER_CLICK_REVIEW', 'draft link CTA static checklist');
requirePhrase(draftLinkCtaStaticChecklist, 'PENDING_MOBILE_TAP_REVIEW', 'draft link CTA static checklist');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(localBrowserReviewNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(archiveRollbackEvidence, 'No archive copy or rollback execution is recorded here', 'archive rollback evidence template');
requirePhrase(archiveRollbackEvidence, 'PENDING_ARCHIVE_COPY', 'archive rollback evidence template');
requirePhrase(finalPublicWordingDiff, 'No final public wording diff is recorded here', 'final public wording diff template');
requirePhrase(finalPublicWordingDiff, 'PENDING_FINAL_WORDING_DIFF', 'final public wording diff template');
requirePhrase(publicAnnouncementReview, 'No public announcement', 'public announcement review template');
requirePhrase(publicAnnouncementReview, 'PENDING_ANNOUNCEMENT_REVIEW', 'public announcement review template');
requirePhrase(publicDistributionBoundaryMatrix, 'Public Distribution Boundary Matrix', 'public distribution boundary matrix');
requirePhrase(publicDistributionBoundaryMatrix, 'BLOCKED_PROVIDER_OUTREACH', 'public distribution boundary matrix');
requirePhrase(providerStatus, 'No provider response is recorded yet', 'provider question status matrix');
requirePhrase(smartcontractorStatus, 'SmartContractor Wording Review Status', 'SmartContractor wording review status');
requirePhrase(issueRegister, 'Draft QA Issue Register', 'draft QA issue register');
requirePhrase(navigationClickResults, 'No browser click evidence is recorded', 'navigation click evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotResults, 'No screenshot evidence is recorded', 'screenshot evidence results template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');

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
