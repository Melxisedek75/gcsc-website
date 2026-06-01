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
  visualQaEvidence: path.join(root, 'docs', 'whitepaper-v1-3-visual-qa-evidence-template.md'),
  localBrowserReviewNotes: path.join(root, 'docs', 'whitepaper-v1-3-local-browser-review-notes.md'),
  draftNavigationReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-readiness-closeout.md'),
  draftNavigationClickQaHandoff: path.join(root, 'docs', 'whitepaper-v1-3-draft-navigation-click-qa-handoff.md'),
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
  navigationClickEvidenceIntake: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-intake-checklist.md'),
  navigationClickEvidenceResults: path.join(root, 'docs', 'whitepaper-v1-3-navigation-click-evidence-results-template.md'),
  blockerMatrix: path.join(root, 'docs', 'whitepaper-v1-3-publication-blocker-status-matrix.md'),
  archiveRollbackEvidence: path.join(root, 'docs', 'whitepaper-v1-3-archive-rollback-evidence-template.md'),
  finalPublicWordingDiff: path.join(root, 'docs', 'whitepaper-v1-3-final-public-wording-diff-template.md'),
  publicAnnouncementReview: path.join(root, 'docs', 'whitepaper-v1-3-public-announcement-review-template.md'),
  publicDistributionBoundaryMatrix: path.join(root, 'docs', 'whitepaper-v1-3-public-distribution-boundary-matrix.md'),
  founderPublicationReadinessHandoff: path.join(root, 'docs', 'whitepaper-v1-3-founder-publication-readiness-handoff.md'),
  founderReadyRollup: path.join(root, 'docs', 'whitepaper-v1-3-founder-ready-packet-status-rollup.md'),
  screenshotManifest: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-manifest.md'),
  screenshotIntake: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-intake-checklist.md'),
  screenshotResults: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-evidence-results-template.md'),
  screenshotCaptureReadinessCloseout: path.join(root, 'docs', 'whitepaper-v1-3-screenshot-capture-readiness-closeout.md'),
  localDraftQaReadiness: path.join(root, 'docs', 'whitepaper-v1-3-local-draft-qa-readiness-scorecard.md'),
  externalReviewerCoverSheet: path.join(root, 'docs', 'whitepaper-v1-3-external-reviewer-cover-sheet.md'),
  reviewerPacketStatusRollup: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-status-rollup.md'),
  sendReadiness: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-packet-send-readiness-checklist.md'),
  questionMapping: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-question-mapping-matrix.md'),
  categorySelection: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-category-selection-intake-template.md'),
  reviewerResponseRoutingCloseout: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-routing-closeout.md'),
  reviewerResponseChangeRequestQueue: path.join(root, 'docs', 'whitepaper-v1-3-reviewer-response-change-request-queue.md'),
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
const visualQaEvidence = readRequired('visual QA evidence template', files.visualQaEvidence);
const localBrowserReviewNotes = readRequired('local browser review notes', files.localBrowserReviewNotes);
const draftNavigationReadinessCloseout = readRequired('draft navigation readiness closeout', files.draftNavigationReadinessCloseout);
const draftNavigationClickQaHandoff = readRequired('draft navigation click QA handoff', files.draftNavigationClickQaHandoff);
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
const navigationClickEvidenceIntake = readRequired('navigation click evidence intake checklist', files.navigationClickEvidenceIntake);
const navigationClickEvidenceResults = readRequired('navigation click evidence results template', files.navigationClickEvidenceResults);
const blockerMatrix = readRequired('publication blocker status matrix', files.blockerMatrix);
const archiveRollbackEvidence = readRequired('archive rollback evidence template', files.archiveRollbackEvidence);
const finalPublicWordingDiff = readRequired('final public wording diff template', files.finalPublicWordingDiff);
const publicAnnouncementReview = readRequired('public announcement review template', files.publicAnnouncementReview);
const publicDistributionBoundaryMatrix = readRequired('public distribution boundary matrix', files.publicDistributionBoundaryMatrix);
const founderPublicationReadinessHandoff = readRequired('founder publication readiness handoff', files.founderPublicationReadinessHandoff);
const founderReadyRollup = readRequired('founder-ready packet status rollup', files.founderReadyRollup);
const screenshotManifest = readRequired('screenshot evidence manifest', files.screenshotManifest);
const screenshotIntake = readRequired('screenshot evidence intake checklist', files.screenshotIntake);
const screenshotResults = readRequired('screenshot evidence results template', files.screenshotResults);
const screenshotCaptureReadinessCloseout = readRequired('screenshot capture readiness closeout', files.screenshotCaptureReadinessCloseout);
const localDraftQaReadiness = readRequired('local draft QA readiness scorecard', files.localDraftQaReadiness);
const externalReviewerCoverSheet = readRequired('external reviewer cover sheet', files.externalReviewerCoverSheet);
const reviewerPacketStatusRollup = readRequired('reviewer packet status rollup', files.reviewerPacketStatusRollup);
const sendReadiness = readRequired('reviewer packet send readiness checklist', files.sendReadiness);
const questionMapping = readRequired('reviewer question mapping matrix', files.questionMapping);
const categorySelection = readRequired('reviewer category selection intake template', files.categorySelection);
const reviewerResponseRoutingCloseout = readRequired('reviewer response routing closeout', files.reviewerResponseRoutingCloseout);
const reviewerResponseChangeRequestQueue = readRequired('reviewer response change request queue', files.reviewerResponseChangeRequestQueue);
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
  'visual QA evidence template validator | PASS_LOCAL_TEMPLATE',
  'visual QA evidence template | PENDING',
  'screenshot evidence intake | PENDING',
  'screenshot evidence results template validator | PASS_LOCAL_TEMPLATE',
  'local draft QA scorecard | PENDING',
  'reviewer packet send approval | PENDING',
  'reviewer packet send readiness checklist validator | PASS_LOCAL_CHECKLIST',
  'reviewer packet send readiness | PENDING_FOUNDER_SEND_DECISION',
  'reviewer question mapping matrix validator | PASS_LOCAL_MATRIX',
  'reviewer question mapping | PENDING_FOUNDER_CATEGORY_SELECTION',
  'reviewer category selection intake template validator | PASS_LOCAL_TEMPLATE',
  'reviewer category selection intake | PENDING_FOUNDER_CATEGORY_SELECTION',
  'reviewer response received | PENDING',
  'reviewer response change request queue validator | PASS_LOCAL_QUEUE',
  'reviewer response change request queue | PENDING_RESPONSE_INTAKE',
  'founder browser QA runbook validator | PASS_LOCAL_RUNBOOK',
  'founder browser QA runbook execution | PENDING',
  'founder browser QA report template validator | PASS_LOCAL_TEMPLATE',
  'founder browser QA report | PENDING_BROWSER_QA_REPORT',
  'founder browser QA issue intake template validator | PASS_LOCAL_TEMPLATE',
  'founder browser QA issue intake | PENDING_ISSUE_ROUTING',
  'browser QA evidence flow validator | PASS_LOCAL_FLOW',
  'browser QA evidence flow | PENDING_FLOW',
  'draft static asset manifest validator | PASS_LOCAL_MANIFEST',
  'draft external asset review intake validator | PASS_LOCAL_TEMPLATE',
  'draft external asset review | PENDING_EXTERNAL_ASSET_REVIEW',
  'draft print/PDF export static checklist validator | PASS_STATIC_CHECKLIST',
  'print/PDF export review | PENDING_PRINT_PDF_EXPORT_REVIEW',
  'draft accessibility static checklist validator | PASS_STATIC_CHECKLIST',
  'browser accessibility review | PENDING_BROWSER_A11Y_REVIEW',
  'draft responsive static checklist validator | PASS_STATIC_CHECKLIST',
  'responsive browser review | PENDING_RESPONSIVE_BROWSER_REVIEW',
  'draft content parity checklist validator | PASS_STATIC_CHECKLIST',
  'browser content review | PENDING_BROWSER_CONTENT_REVIEW',
  'draft link and CTA static checklist validator | PASS_STATIC_CHECKLIST',
  'browser link and CTA click review | PENDING_BROWSER_CLICK_REVIEW',
  'manual navigation click evidence | PENDING',
  'draft navigation click QA handoff validator | PASS_LOCAL_TEMPLATE',
  'navigation click evidence intake validator | PASS_LOCAL_TEMPLATE',
  'navigation click evidence results template validator | PASS_LOCAL_TEMPLATE',
  'archive rollback evidence template validator | PASS_LOCAL_TEMPLATE',
  'archive rollback evidence template | PENDING',
  'final public wording diff template validator | PASS_LOCAL_TEMPLATE',
  'final public wording diff | PENDING',
  'public announcement review template validator | PASS_LOCAL_TEMPLATE',
  'public announcement review template | PENDING',
  'public distribution boundary matrix validator | PASS_LOCAL_MATRIX',
  'public distribution decision | PENDING_NO_GO',
  'founder publication readiness handoff validator | PASS_LOCAL',
  'founder publication readiness handoff | PENDING_NO_GO',
]) {
  requirePhrase(status, phrase, 'publication evidence current status');
}

for (const checkName of [
  'npm run check:whitepaper-v1-3-plan',
  'npm run check:whitepaper-v1-3-public-html-plan',
  'npm run check:whitepaper-v1-3-draft-html-smoke',
  'npm run check:whitepaper-v1-3-draft-css-qa',
  'npm run check:whitepaper-v1-3-visual-qa-evidence',
  'npm run check:whitepaper-v1-3-draft-navigation-readiness-closeout',
  'npm run check:whitepaper-v1-3-draft-navigation-click-qa-handoff',
  'npm run check:whitepaper-v1-3-founder-browser-qa-runbook',
  'npm run check:whitepaper-v1-3-founder-browser-qa-report',
  'npm run check:whitepaper-v1-3-founder-browser-qa-issue-intake',
  'npm run check:whitepaper-v1-3-browser-qa-evidence-flow',
  'npm run check:whitepaper-v1-3-draft-static-assets',
  'npm run check:whitepaper-v1-3-draft-external-asset-review-intake',
  'npm run check:whitepaper-v1-3-draft-print-pdf-export-static',
  'npm run check:whitepaper-v1-3-draft-accessibility-static',
  'npm run check:whitepaper-v1-3-draft-responsive-static',
  'npm run check:whitepaper-v1-3-draft-content-parity',
  'npm run check:whitepaper-v1-3-draft-link-cta-static',
  'npm run check:whitepaper-v1-3-navigation-click-evidence-intake',
  'npm run check:whitepaper-v1-3-navigation-click-evidence-results',
  'npm run check:whitepaper-v1-3-claim-risk-hardening',
  'npm run check:whitepaper-v1-3-founder-decision-intake',
  'npm run check:whitepaper-v1-3-reviewer-response-intake',
  'npm run check:whitepaper-v1-3-screenshot-evidence-manifest',
  'npm run check:whitepaper-v1-3-screenshot-evidence-intake',
  'npm run check:whitepaper-v1-3-screenshot-evidence-results',
  'npm run check:whitepaper-v1-3-screenshot-capture-readiness-closeout',
  'npm run check:whitepaper-v1-3-local-draft-qa-readiness',
  'npm run check:whitepaper-v1-3-publication-blocker-status-matrix',
  'npm run check:whitepaper-v1-3-archive-rollback-evidence',
  'npm run check:whitepaper-v1-3-final-public-wording-diff',
  'npm run check:whitepaper-v1-3-public-announcement-review',
  'npm run check:whitepaper-v1-3-public-distribution-boundary-matrix',
  'npm run check:whitepaper-v1-3-founder-publication-readiness-handoff',
  'npm run check:whitepaper-v1-3-founder-ready-packet-status-rollup',
  'npm run check:whitepaper-v1-3-internal-review-master-index',
  'npm run check:whitepaper-v1-3-external-reviewer-cover-sheet',
  'npm run check:whitepaper-v1-3-reviewer-packet-status-rollup',
  'npm run check:whitepaper-v1-3-reviewer-packet-send-readiness',
  'npm run check:whitepaper-v1-3-reviewer-question-mapping',
  'npm run check:whitepaper-v1-3-reviewer-category-selection-intake',
  'npm run check:whitepaper-v1-3-reviewer-response-routing-closeout',
  'npm run check:whitepaper-v1-3-reviewer-response-change-request-queue',
  'npm run check:ci-workflow',
]) {
  requirePhrase(status, checkName, 'publication evidence current status');
}

requirePhrase(template, 'Current decision | NO-GO', 'publication evidence template');
requirePhrase(dryRun, 'Current result: NO-GO', 'publication readiness dry run');
requirePhrase(gate, 'Default state: NO-GO', 'publication gate');
requirePhrase(founderDecision, 'public publication approved? | NO by default', 'founder decision intake');
requirePhrase(reviewerResponse, 'public publication approved? | NO by default', 'reviewer response intake');
requirePhrase(visualQaEvidence, 'PENDING_VISUAL_QA', 'visual QA evidence template');
requirePhrase(visualQaEvidence, 'Visual Evidence Rows Template', 'visual QA evidence template');
requirePhrase(localBrowserReviewNotes, 'Browser Screenshot QA Still Required', 'local browser review notes');
requirePhrase(draftNavigationReadinessCloseout, 'Manual browser click evidence and screenshot evidence are PENDING', 'draft navigation readiness closeout');
requirePhrase(draftNavigationClickQaHandoff, 'Manual click QA remains PENDING', 'draft navigation click QA handoff');
requirePhrase(draftNavigationClickQaHandoff, 'V13-NAV-WP-01', 'draft navigation click QA handoff');
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
requirePhrase(draftPrintPdfExportStaticChecklist, 'PENDING_PRINT_PREVIEW_REVIEW', 'draft print/PDF export static checklist');
requirePhrase(draftAccessibilityStaticChecklist, 'Draft Accessibility Static Checklist', 'draft accessibility static checklist');
requirePhrase(draftAccessibilityStaticChecklist, 'PENDING_BROWSER_A11Y_REVIEW', 'draft accessibility static checklist');
requirePhrase(draftResponsiveStaticChecklist, 'Draft Responsive Static Checklist', 'draft responsive static checklist');
requirePhrase(draftResponsiveStaticChecklist, 'PENDING_RESPONSIVE_BROWSER_REVIEW', 'draft responsive static checklist');
requirePhrase(draftContentParityChecklist, 'Draft Content Parity Checklist', 'draft content parity checklist');
requirePhrase(draftContentParityChecklist, 'PENDING_BROWSER_CONTENT_REVIEW', 'draft content parity checklist');
requirePhrase(draftLinkCtaStaticChecklist, 'Draft Link CTA Static Checklist', 'draft link CTA static checklist');
requirePhrase(draftLinkCtaStaticChecklist, 'PENDING_BROWSER_CLICK_REVIEW', 'draft link CTA static checklist');
requirePhrase(draftLinkCtaStaticChecklist, 'PENDING_MOBILE_TAP_REVIEW', 'draft link CTA static checklist');
requirePhrase(navigationClickEvidenceIntake, 'Manual click evidence remains PENDING', 'navigation click evidence intake checklist');
requirePhrase(navigationClickEvidenceIntake, 'V13-NAV-HOME-05', 'navigation click evidence intake checklist');
requirePhrase(navigationClickEvidenceResults, 'No browser click evidence is recorded', 'navigation click evidence results template');
requirePhrase(navigationClickEvidenceResults, 'PENDING_CLICK', 'navigation click evidence results template');
requirePhrase(blockerMatrix, 'Current publication decision remains NO-GO', 'publication blocker status matrix');
requirePhrase(archiveRollbackEvidence, 'No archive copy or rollback execution is recorded here', 'archive rollback evidence template');
requirePhrase(archiveRollbackEvidence, 'PENDING_ARCHIVE_COPY', 'archive rollback evidence template');
requirePhrase(archiveRollbackEvidence, 'PENDING_ROLLBACK_REVIEW', 'archive rollback evidence template');
requirePhrase(finalPublicWordingDiff, 'No final public wording diff is recorded here', 'final public wording diff template');
requirePhrase(finalPublicWordingDiff, 'PENDING_FINAL_WORDING_DIFF', 'final public wording diff template');
requirePhrase(publicAnnouncementReview, 'No public announcement', 'public announcement review template');
requirePhrase(publicAnnouncementReview, 'PENDING_ANNOUNCEMENT_REVIEW', 'public announcement review template');
requirePhrase(publicDistributionBoundaryMatrix, 'Public Distribution Boundary Matrix', 'public distribution boundary matrix');
requirePhrase(publicDistributionBoundaryMatrix, 'BLOCKED_NO_GO', 'public distribution boundary matrix');
requirePhrase(founderPublicationReadinessHandoff, 'Founder Publication Readiness Handoff', 'founder publication readiness handoff');
requirePhrase(founderPublicationReadinessHandoff, 'Current publication decision remains NO-GO', 'founder publication readiness handoff');
requirePhrase(founderReadyRollup, 'Current publication decision remains NO-GO', 'founder-ready packet status rollup');
requirePhrase(screenshotManifest, 'Screenshot QA remains PENDING', 'screenshot evidence manifest');
requirePhrase(screenshotIntake, 'Screenshot QA remains PENDING', 'screenshot evidence intake checklist');
requirePhrase(screenshotResults, 'No screenshot evidence is recorded', 'screenshot evidence results template');
requirePhrase(screenshotResults, 'PENDING_CAPTURE', 'screenshot evidence results template');
requirePhrase(screenshotCaptureReadinessCloseout, 'No completed screenshot evidence is recorded', 'screenshot capture readiness closeout');
requirePhrase(localDraftQaReadiness, 'Current publication decision remains NO-GO', 'local draft QA readiness scorecard');
requirePhrase(externalReviewerCoverSheet, 'No outreach is approved or sent', 'external reviewer cover sheet');
requirePhrase(reviewerPacketStatusRollup, 'No outreach is approved', 'reviewer packet status rollup');
requirePhrase(sendReadiness, 'Reviewer Packet Send Readiness Checklist', 'reviewer packet send readiness checklist');
requirePhrase(sendReadiness, 'BLOCKED_NO_SEND', 'reviewer packet send readiness checklist');
requirePhrase(questionMapping, 'Reviewer Question Mapping Matrix', 'reviewer question mapping matrix');
requirePhrase(questionMapping, 'BLOCKED_NO_OUTREACH', 'reviewer question mapping matrix');
requirePhrase(categorySelection, 'Reviewer Category Selection Intake Template', 'reviewer category selection intake template');
requirePhrase(categorySelection, 'PENDING_FOUNDER_CATEGORY_SELECTION', 'reviewer category selection intake template');
requirePhrase(reviewerResponseRoutingCloseout, 'No reviewer response is recorded yet', 'reviewer response routing closeout');
requirePhrase(reviewerResponseChangeRequestQueue, 'Reviewer Response Change Request Queue', 'reviewer response change request queue');
requirePhrase(reviewerResponseChangeRequestQueue, 'No change request is active', 'reviewer response change request queue');

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
