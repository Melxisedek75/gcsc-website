import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const files = {
  masterIndex: path.join(root, 'docs', 'whitepaper-v1-3-internal-review-master-index.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  founderPublicationReadinessHandoff: path.join(root, 'docs', 'whitepaper-v1-3-founder-publication-readiness-handoff.md'),
  founderActionBoard: path.join(root, 'docs', 'whitepaper-v1-3-founder-action-board.md'),
  founderEveningReviewGuide: path.join(root, 'docs', 'whitepaper-v1-3-founder-evening-review-guide.md'),
  founderDecisionRoutingChecklist: path.join(root, 'docs', 'whitepaper-v1-3-founder-decision-routing-checklist.md'),
  founderPacket: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-packet.md'),
  founderCloseout: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-closeout.md'),
  founderApprovalToReview: path.join(root, 'docs', 'whitepaper-v1-3-founder-approval-to-review-packet.md'),
  founderStateTransitionMatrix: path.join(root, 'docs', 'whitepaper-v1-3-founder-review-state-transition-matrix.md'),
  publicDraft: path.join(root, 'docs', 'whitepaper-v1-3-public-draft.md'),
  draftStaticAssetManifest: path.join(root, 'docs', 'whitepaper-v1-3-draft-static-asset-manifest.md'),
  draftExternalAssetReviewIntake: path.join(root, 'docs', 'whitepaper-v1-3-draft-external-asset-review-intake-checklist.md'),
  draftPrintPdfExportStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-print-pdf-export-static-checklist.md'),
  draftAccessibilityStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-accessibility-static-checklist.md'),
  draftResponsiveStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-responsive-static-checklist.md'),
  draftContentParityChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-content-parity-checklist.md'),
  draftLinkCtaStaticChecklist: path.join(root, 'docs', 'whitepaper-v1-3-draft-link-cta-static-checklist.md'),
  smartcontractorWordingStatus: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-review-status.md'),
  smartcontractorWordingEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-wording-evidence-log.md'),
  smartcontractorProductIntegrationMap: path.join(root, 'docs', 'whitepaper-v1-3-smartcontractor-product-integration-map.md'),
  providerQuestionStatus: path.join(root, 'docs', 'whitepaper-v1-3-provider-question-status-matrix.md'),
  questionMapping: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  reviewerRouting: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-routing-index.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  reviewerEvidenceAppendix: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-evidence-appendix.md'),
  reviewerRedaction: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-redaction-checklist.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  categorySelection: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-category-selection-intake-template.md'),
  externalReviewerCoverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  reviewerSummary: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-summary-shell.md'),
  reviewerResponseRoutingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
  reviewerResponseChangeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
  reviewerResponseReReviewChecklist: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-re-review-checklist.md'),
  reviewerResponseLocalRevisionEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-local-revision-evidence-log.md'),
  reviewerResponseDraftQaRoutingGate: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md'),
  founderBrowserQaRunbook: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-runbook.md'),
  founderBrowserQaReport: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-report-template.md'),
  founderBrowserQaIssueIntake: path.join(root, 'docs', 'whitepaper-v1-3-founder-browser-qa-issue-intake-template.md'),
  browserQaEvidenceFlow: path.join(root, 'docs', 'whitepaper-v1-3-browser-qa-evidence-flow.md'),
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  screenshotHandoff: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-qa-founder-handoff.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  screenshotCaptureReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-capture-readiness-closeout.md'),
  navigationClickResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  archiveRollbackEvidence: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
  finalPublicWordingDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicWordingScanEvidenceLog: path.join(root, 'docs', 'whitepaper-v1-3-public-wording-scan-evidence-log.md'),
  publicAnnouncementReview: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
  publicDistributionBoundaryMatrix: path.join(root, 'docs', 'whitepaper-v1-3-public-distribution-boundary-matrix.md'),
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
const founderPublicationReadinessHandoff = readRequired('founder publication readiness handoff', files.founderPublicationReadinessHandoff);
const founderActionBoard = readRequired('founder action board', files.founderActionBoard);
const founderEveningReviewGuide = readRequired('founder evening review guide', files.founderEveningReviewGuide);
const founderDecisionRoutingChecklist = readRequired('founder decision routing checklist', files.founderDecisionRoutingChecklist);
const founderPacket = readRequired('founder review packet', files.founderPacket);
const founderCloseout = readRequired('founder review closeout', files.founderCloseout);
const founderApprovalToReview = readRequired('founder approval-to-review packet', files.founderApprovalToReview);
const founderStateTransitionMatrix = readRequired('founder review state transition matrix', files.founderStateTransitionMatrix);
const publicDraft = readRequired('public draft', files.publicDraft);
const draftStaticAssetManifest = readRequired('draft static asset manifest', files.draftStaticAssetManifest);
const draftExternalAssetReviewIntake = readRequired('draft external asset review intake checklist', files.draftExternalAssetReviewIntake);
const draftPrintPdfExportStaticChecklist = readRequired('draft print/PDF export static checklist', files.draftPrintPdfExportStaticChecklist);
const draftAccessibilityStaticChecklist = readRequired('draft accessibility static checklist', files.draftAccessibilityStaticChecklist);
const draftResponsiveStaticChecklist = readRequired('draft responsive static checklist', files.draftResponsiveStaticChecklist);
const draftContentParityChecklist = readRequired('draft content parity checklist', files.draftContentParityChecklist);
const draftLinkCtaStaticChecklist = readRequired('draft link CTA static checklist', files.draftLinkCtaStaticChecklist);
const smartcontractorWordingStatus = readRequired('SmartContractor wording review status', files.smartcontractorWordingStatus);
const smartcontractorWordingEvidenceLog = readRequired('SmartContractor wording evidence log', files.smartcontractorWordingEvidenceLog);
const smartcontractorProductIntegrationMap = readRequired('SmartContractor product integration map', files.smartcontractorProductIntegrationMap);
const providerQuestionStatus = readRequired('provider question status matrix', files.providerQuestionStatus);
const questionMapping = readRequired('reviewer question mapping matrix', files.questionMapping);
const reviewerRouting = readRequired('reviewer routing index', files.reviewerRouting);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const reviewerEvidenceAppendix = readRequired('reviewer evidence appendix', files.reviewerEvidenceAppendix);
const reviewerRedaction = readRequired('reviewer packet redaction checklist', files.reviewerRedaction);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const categorySelection = readRequired('reviewer category selection intake template', files.categorySelection);
const externalReviewerCoverSheet = readRequired('external reviewer cover sheet', files.externalReviewerCoverSheet);
const reviewerSummary = readRequired('reviewer response summary shell', files.reviewerSummary);
const reviewerResponseRoutingCloseout = readRequired('reviewer response routing closeout', files.reviewerResponseRoutingCloseout);
const reviewerResponseChangeRequestQueue = readRequired('reviewer response change request queue', files.reviewerResponseChangeRequestQueue);
const reviewerResponseReReviewChecklist = readRequired('reviewer response re-review checklist', files.reviewerResponseReReviewChecklist);
const reviewerResponseLocalRevisionEvidenceLog = readRequired('reviewer response local revision evidence log', files.reviewerResponseLocalRevisionEvidenceLog);
const reviewerResponseDraftQaRoutingGate = readRequired('reviewer response draft QA routing gate', files.reviewerResponseDraftQaRoutingGate);
const founderBrowserQaRunbook = readRequired('founder browser QA runbook', files.founderBrowserQaRunbook);
const founderBrowserQaReport = readRequired('founder browser QA report template', files.founderBrowserQaReport);
const founderBrowserQaIssueIntake = readRequired('founder browser QA issue intake template', files.founderBrowserQaIssueIntake);
const browserQaEvidenceFlow = readRequired('browser QA evidence flow', files.browserQaEvidenceFlow);
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const screenshotHandoff = readRequired('screenshot handoff', files.screenshotHandoff);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const screenshotCaptureReadinessCloseout = readRequired('screenshot capture readiness closeout', files.screenshotCaptureReadinessCloseout);
const navigationClickResults = readRequired('navigation click evidence results template', files.navigationClickResults);
const archiveRollbackEvidence = readRequired('archive rollback evidence template', files.archiveRollbackEvidence);
const finalPublicWordingDiff = readRequired('final public wording diff template', files.finalPublicWordingDiff);
const publicWordingScanEvidenceLog = readRequired('public wording scan evidence log', files.publicWordingScanEvidenceLog);
const publicAnnouncementReview = readRequired('public announcement review template', files.publicAnnouncementReview);
const publicDistributionBoundaryMatrix = readRequired('public distribution boundary matrix', files.publicDistributionBoundaryMatrix);
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
  'founder publication readiness handoff | ready local NO-GO handoff',
  'founder action board | ready for founder review',
  'founder evening review guide | ready for founder review',
  'founder decision routing checklist | ready for founder review',
  'public whitepaper replacement | NO-GO',
  'public homepage replacement | NO-GO',
  'draft static asset manifest | local manifest only / external asset review pending',
  'draft external asset review intake | local template only / privacy performance fallback and public-routing review pending',
  'draft print/PDF export static checklist | local checklist only / print preview and export review pending',
  'draft accessibility static checklist | static checklist only / browser accessibility review pending',
  'draft responsive static checklist | static checklist only / responsive browser review pending',
  'draft content parity checklist | static checklist only / browser content review pending',
  'draft link and CTA static checklist | static checklist only / browser click and mobile tap review pending',
  'founder browser QA runbook | local runbook prepared / execution pending',
  'founder browser QA report template | local template only / report not filled',
  'founder browser QA issue intake template | local template only / issue routing pending',
  'browser QA evidence flow | local flow map only / browser evidence not collected',
  'visual QA evidence | local template only / all results PENDING_VISUAL_QA',
  'local browser review notes | local notes only / screenshots pending',
  'screenshot capture readiness closeout | local readiness only / no screenshots recorded',
  'screenshot evidence results | local template only / all results PENDING_CAPTURE',
  'navigation click evidence results | local template only / all results PENDING_CLICK',
  'archive rollback evidence | local template only / no archive or rollback executed',
  'final public wording diff | local template only / no diff recorded',
  'public wording scan evidence log | local scan evidence only / public replacement blocked',
  'public announcement review | local template only / no announcement approved',
  'public distribution boundary matrix | local matrix only / all external distribution blocked',
  'SmartContractor wording evidence log | local product wording evidence only / production release blocked',
  'SmartContractor product integration map | local product module map only / production integration blocked',
  'reviewer packet send readiness | local checklist only / no founder-controlled send decision recorded',
  'reviewer question mapping | local matrix only / no founder-selected category recorded',
  'reviewer category selection intake | local template only / no founder-selected category recorded',
  'reviewer response change request queue | local queue only / no reviewer response recorded',
  'reviewer response re-review checklist | local checklist only / no reviewer response recorded',
  'reviewer response local revision evidence log | local evidence log only / no reviewer response recorded',
  'reviewer response draft QA routing gate | local routing gate only / no reviewer response recorded',
]) {
  requirePhrase(masterIndex, phrase, 'internal review master index');
}

for (const fileReference of [
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-founder-publication-readiness-handoff.md',
  'docs/whitepaper-v1-3-founder-action-board.md',
  'docs/whitepaper-v1-3-founder-evening-review-guide.md',
  'docs/whitepaper-v1-3-founder-decision-routing-checklist.md',
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-draft-static-asset-manifest.md',
  'docs/whitepaper-v1-3-draft-external-asset-review-intake-checklist.md',
  'docs/whitepaper-v1-3-draft-print-pdf-export-static-checklist.md',
  'docs/whitepaper-v1-3-draft-accessibility-static-checklist.md',
  'docs/whitepaper-v1-3-draft-responsive-static-checklist.md',
  'docs/whitepaper-v1-3-draft-content-parity-checklist.md',
  'docs/whitepaper-v1-3-draft-link-cta-static-checklist.md',
  'whitepaper-v1-3-draft.html',
  'index-v1-3-draft.html',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-evidence-log.md',
  'docs/whitepaper-v1-3-smartcontractor-product-integration-map.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-reviewer-question-mapping-matrix.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md',
  'docs/whitepaper-v1-3-reviewer-category-selection-intake-template.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-response-routing-closeout.md',
  'docs/whitepaper-v1-3-reviewer-response-change-request-queue.md',
  'docs/whitepaper-v1-3-reviewer-response-re-review-checklist.md',
  'docs/whitepaper-v1-3-reviewer-response-local-revision-evidence-log.md',
  'docs/whitepaper-v1-3-reviewer-response-draft-qa-routing-gate.md',
  'docs/whitepaper-v1-3-founder-browser-qa-runbook.md',
  'docs/whitepaper-v1-3-founder-browser-qa-report-template.md',
  'docs/whitepaper-v1-3-founder-browser-qa-issue-intake-template.md',
  'docs/whitepaper-v1-3-browser-qa-evidence-flow.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-screenshot-capture-readiness-closeout.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-archive-rollback-evidence-template.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-public-wording-scan-evidence-log.md',
  'docs/whitepaper-v1-3-public-announcement-review-template.md',
  'docs/whitepaper-v1-3-public-distribution-boundary-matrix.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-go-record-template.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
]) {
  requirePhrase(masterIndex, fileReference, 'internal review master index');
}

requirePhrase(founderReadyRollup, 'Founder-Ready Packet Status Rollup', 'founder-ready packet status rollup');
requirePhrase(founderPublicationReadinessHandoff, 'Founder Publication Readiness Handoff', 'founder publication readiness handoff');
requirePhrase(founderPublicationReadinessHandoff, 'Current publication decision remains NO-GO', 'founder publication readiness handoff');
requirePhrase(founderActionBoard, 'Founder Action Board', 'founder action board');
requirePhrase(founderActionBoard, 'Founder Inputs Still Needed', 'founder action board');
requirePhrase(founderEveningReviewGuide, 'Founder Evening Review Guide', 'founder evening review guide');
requirePhrase(founderEveningReviewGuide, '15-Minute Review Order', 'founder evening review guide');
requirePhrase(founderDecisionRoutingChecklist, 'Founder Decision Routing Checklist', 'founder decision routing checklist');
requirePhrase(founderDecisionRoutingChecklist, 'Routing Matrix', 'founder decision routing checklist');
requirePhrase(founderPacket, 'Construction Trust Infrastructure first', 'founder review packet');
requirePhrase(founderCloseout, 'Founder Decision Choices', 'founder review closeout');
requirePhrase(founderApprovalToReview, 'V1_3_LOCAL_REVIEW_APPROVED', 'founder approval-to-review packet');
requirePhrase(founderStateTransitionMatrix, 'NO_GO_PUBLICATION_DEFAULT', 'founder review state transition matrix');
requirePhrase(publicDraft, 'Status: internal public-safe draft', 'public draft');
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
requirePhrase(smartcontractorWordingStatus, 'SmartContractor Wording Review Status', 'SmartContractor wording review status');
requirePhrase(smartcontractorWordingEvidenceLog, 'SmartContractor Wording Evidence Log', 'SmartContractor wording evidence log');
requirePhrase(smartcontractorProductIntegrationMap, 'SmartContractor Product Integration Map', 'SmartContractor product integration map');
requirePhrase(smartcontractorProductIntegrationMap, 'Product Release Gates', 'SmartContractor product integration map');
requirePhrase(smartcontractorProductIntegrationMap, 'BLOCKED_LIVE_ACTIONS', 'SmartContractor product integration map');
requirePhrase(providerQuestionStatus, 'Provider Question Status Matrix', 'provider question status matrix');
requirePhrase(questionMapping, 'Reviewer Question Mapping Matrix', 'reviewer question mapping matrix');
requirePhrase(questionMapping, 'BLOCKED_NO_OUTREACH', 'reviewer question mapping matrix');
requirePhrase(reviewerRouting, 'Reviewer Response Intake', 'reviewer routing index');
requirePhrase(reviewerPacketStatusRollup, 'Reviewer Packet Status Rollup', 'reviewer packet status rollup');
requirePhrase(reviewerEvidenceAppendix, 'Reviewer Evidence Appendix', 'reviewer evidence appendix');
requirePhrase(reviewerEvidenceAppendix, 'Evidence Not Yet Complete', 'reviewer evidence appendix');
requirePhrase(reviewerRedaction, 'Reviewer Packet Redaction Checklist', 'reviewer packet redaction checklist');
requirePhrase(sendReadiness, 'Reviewer Packet Send Readiness Checklist', 'reviewer packet send readiness checklist');
requirePhrase(sendReadiness, 'BLOCKED_NO_SEND', 'reviewer packet send readiness checklist');
requirePhrase(categorySelection, 'Reviewer Category Selection Intake Template', 'reviewer category selection intake template');
requirePhrase(categorySelection, 'PENDING_FOUNDER_CATEGORY_SELECTION', 'reviewer category selection intake template');
requirePhrase(externalReviewerCoverSheet, 'External Reviewer Cover Sheet', 'external reviewer cover sheet');
requirePhrase(reviewerSummary, 'Reviewer Response Summary Shell', 'reviewer response summary shell');
requirePhrase(reviewerResponseRoutingCloseout, 'Reviewer Response Routing Closeout', 'reviewer response routing closeout');
requirePhrase(reviewerResponseChangeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(reviewerResponseChangeRequestQueue, 'QUEUE_NOT_ACTIVE', 'reviewer response change request queue');
requirePhrase(reviewerResponseReReviewChecklist, 'Reviewer Response Re-Review Checklist', 'reviewer response re-review checklist');
requirePhrase(reviewerResponseReReviewChecklist, 'REREVIEW_NOT_READY', 'reviewer response re-review checklist');
requirePhrase(reviewerResponseLocalRevisionEvidenceLog, 'Reviewer Response Local Revision Evidence Log', 'reviewer response local revision evidence log');
requirePhrase(reviewerResponseLocalRevisionEvidenceLog, 'REVISION_EVIDENCE_NOT_RECORDED', 'reviewer response local revision evidence log');
requirePhrase(reviewerResponseDraftQaRoutingGate, 'Reviewer Response Draft QA Routing Gate', 'reviewer response draft QA routing gate');
requirePhrase(reviewerResponseDraftQaRoutingGate, 'DRAFT_QA_ROUTING_NOT_ACTIVE', 'reviewer response draft QA routing gate');
requirePhrase(founderBrowserQaRunbook, 'Founder Browser QA Runbook', 'founder browser QA runbook');
requirePhrase(founderBrowserQaRunbook, 'Browser QA remains PENDING', 'founder browser QA runbook');
requirePhrase(founderBrowserQaReport, 'Founder Browser QA Report Template', 'founder browser QA report template');
requirePhrase(founderBrowserQaReport, 'PENDING_BROWSER_QA_REPORT', 'founder browser QA report template');
requirePhrase(founderBrowserQaIssueIntake, 'Founder Browser QA Issue Intake Template', 'founder browser QA issue intake template');
requirePhrase(founderBrowserQaIssueIntake, 'PENDING_ISSUE_ROUTING', 'founder browser QA issue intake template');
requirePhrase(browserQaEvidenceFlow, 'Browser QA Evidence Flow', 'browser QA evidence flow');
requirePhrase(browserQaEvidenceFlow, 'PENDING_FLOW', 'browser QA evidence flow');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(localBrowserReviewNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(screenshotHandoff, 'Screenshot QA is PENDING', 'screenshot handoff');
requirePhrase(screenshotManifest, 'Screenshot Evidence Manifest', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot Evidence Intake Checklist', 'screenshot evidence intake checklist');
requirePhrase(screenshotResults, 'No screenshot evidence is recorded', 'screenshot evidence results template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(screenshotCaptureReadinessCloseout, 'Screenshot Capture Readiness Closeout', 'screenshot capture readiness closeout');
requirePhrase(navigationClickResults, 'No browser click evidence is recorded', 'navigation click evidence results template');
requirePhrase(navigationClickResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(archiveRollbackEvidence, 'No archive copy or rollback execution is recorded here', 'archive rollback evidence template');
requirePhrase(archiveRollbackEvidence, 'PENDING_ARCHIVE_COPY', 'archive rollback evidence template');
requirePhrase(finalPublicWordingDiff, 'No final public wording diff is recorded here', 'final public wording diff template');
requirePhrase(finalPublicWordingDiff, 'PENDING_FINAL_WORDING_DIFF', 'final public wording diff template');
requirePhrase(publicWordingScanEvidenceLog, 'Public Wording Scan Evidence Log', 'public wording scan evidence log');
requirePhrase(publicAnnouncementReview, 'No public announcement', 'public announcement review template');
requirePhrase(publicAnnouncementReview, 'PENDING_ANNOUNCEMENT_REVIEW', 'public announcement review template');
requirePhrase(publicDistributionBoundaryMatrix, 'Public Distribution Boundary Matrix', 'public distribution boundary matrix');
requirePhrase(publicDistributionBoundaryMatrix, 'BLOCKED_NO_GO', 'public distribution boundary matrix');
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
