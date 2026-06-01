import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..');

const requiredFiles = [
  'docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md',
  'docs/whitepaper-v1-3-founder-review-packet.md',
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-public-outline.md',
  'docs/whitepaper-v1-3-integration-roadmap.md',
  'docs/whitepaper-v1-3-provider-shortlist.md',
  'docs/whitepaper-v1-3-fio-protocol-integration-brief.md',
  'docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md',
  'docs/whitepaper-v1-3-public-website-update-plan.md',
  'docs/whitepaper-v1-3-public-draft.md',
  'docs/whitepaper-v1-3-publication-gate.md',
  'docs/whitepaper-v1-3-archive-and-rollback-plan.md',
  'docs/whitepaper-v1-3-legal-provider-review-packet.md',
  'docs/whitepaper-v1-3-partner-outreach-drafts.md',
  'docs/whitepaper-v1-3-patent-innovation-map.md',
  'docs/whitepaper-v1-3-terms-glossary.md',
  'docs/whitepaper-v1-3-source-link-appendix.md',
  'docs/whitepaper-v1-3-wording-migration-checklist.md',
  'docs/whitepaper-v1-3-final-publication-checklist.md',
  'docs/whitepaper-v1-3-beta-wording-alignment.md',
  'docs/whitepaper-v1-3-product-integration-placeholder-plan.md',
  'docs/whitepaper-v1-3-public-website-risk-scan.md',
  'docs/whitepaper-v1-3-public-html-replacement-plan.md',
  'docs/whitepaper-v1-3-publication-decision-packet.md',
  'docs/whitepaper-v1-3-archive-execution-checklist.md',
  'docs/whitepaper-v1-3-homepage-wording-plan.md',
  'docs/whitepaper-v1-3-visual-review-checklist.md',
  'docs/whitepaper-v1-3-founder-approval-to-review-packet.md',
  'docs/whitepaper-v1-3-autonomous-continuation-rule.md',
  'docs/whitepaper-v1-3-visual-qa-evidence-template.md',
  'docs/whitepaper-v1-3-local-browser-review-notes.md',
  'docs/whitepaper-v1-3-draft-css-qa-checklist.md',
  'docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md',
  'docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-navigation-click-evidence-results-template.md',
  'docs/whitepaper-v1-3-publication-evidence-template.md',
  'docs/whitepaper-v1-3-publication-evidence-current-status.md',
  'docs/whitepaper-v1-3-publication-go-record-template.md',
  'docs/whitepaper-v1-3-publication-blocker-status-matrix.md',
  'docs/whitepaper-v1-3-archive-rollback-evidence-template.md',
  'docs/whitepaper-v1-3-final-public-wording-diff-template.md',
  'docs/whitepaper-v1-3-public-announcement-review-template.md',
  'docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md',
  'docs/whitepaper-v1-3-founder-action-board.md',
  'docs/whitepaper-v1-3-founder-evening-review-guide.md',
  'docs/whitepaper-v1-3-founder-decision-routing-checklist.md',
  'docs/whitepaper-v1-3-founder-review-state-transition-matrix.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-alignment.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-review-status.md',
  'docs/whitepaper-v1-3-provider-question-register.md',
  'docs/whitepaper-v1-3-provider-question-status-matrix.md',
  'docs/whitepaper-v1-3-regulated-web3-architecture-map.md',
  'docs/whitepaper-v1-3-claim-risk-hardening-checklist.md',
  'docs/whitepaper-v1-3-publication-readiness-dry-run.md',
  'docs/whitepaper-v1-3-founder-review-closeout.md',
  'docs/whitepaper-v1-3-founder-decision-intake-template.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-screenshot-evidence-manifest.md',
  'docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md',
  'docs/whitepaper-v1-3-screenshot-evidence-results-template.md',
  'docs/whitepaper-v1-3-screenshot-capture-readiness-closeout.md',
  'docs/whitepaper-v1-3-draft-qa-issue-register.md',
  'docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md',
  'docs/whitepaper-v1-3-reviewer-routing-index.md',
  'docs/whitepaper-v1-3-reviewer-packet-status-rollup.md',
  'docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md',
  'docs/whitepaper-v1-3-external-reviewer-cover-sheet.md',
  'docs/whitepaper-v1-3-reviewer-evidence-appendix.md',
  'docs/whitepaper-v1-3-reviewer-response-intake-template.md',
  'docs/whitepaper-v1-3-reviewer-response-summary-shell.md',
  'docs/whitepaper-v1-3-reviewer-response-routing-closeout.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
  'docs/whitepaper-v1-3-internal-review-master-index.md',
  'docs/whitepaper-v1-3-week-one-closeout-2026-06-06.md',
];

const hybridDraftPhrases = [
  'Construction Trust Infrastructure',
  'GCSC does not reject Web3 finance',
  'GCSC phases Web3 finance responsibly',
  'FIO Protocol',
  'XPR Network',
  'Metallicus',
  'licensed partner',
  'not approved for public publication',
];

const fileSpecificPhrases = new Map([
  ['docs/whitepaper-v1-3-founder-review-packet.md', ['Founder Review Questions', 'Construction Trust Infrastructure first']],
  ['docs/whitepaper-v1-3-claim-risk-register.md', ['Highest-Risk Claims', 'Blocked Public Vocabulary', 'Publication Rule']],
  ['docs/whitepaper-v1-3-public-outline.md', ['Public Positioning', 'Explicit Public Boundaries']],
  ['docs/whitepaper-v1-3-integration-roadmap.md', ['Phase 0', 'Phase 5', 'Never Skip']],
  ['docs/whitepaper-v1-3-provider-shortlist.md', ['research-only shortlist', 'Next Research Actions']],
  ['docs/whitepaper-v1-3-fio-protocol-integration-brief.md', ['FIO Protocol', 'Technical Research Questions', 'Blocked Until Review']],
  ['docs/whitepaper-v1-3-metallicus-xpr-integration-brief.md', ['Metallicus', 'XPR Network', 'Blocked Until Founder/Legal/Provider Approval']],
  ['docs/whitepaper-v1-3-public-website-update-plan.md', ['High-Risk Old Wording To Replace', 'Required Before Editing Public Files']],
  ['docs/whitepaper-v1-3-public-draft.md', ['internal public-safe draft', 'not live', 'provider-reviewed', 'review-required']],
  ['docs/whitepaper-v1-3-publication-gate.md', ['Default state: NO-GO', 'Blocked Public Actions']],
  ['docs/whitepaper-v1-3-archive-and-rollback-plan.md', ['Archive Strategy', 'Rollback Strategy', 'Blocked Until GO']],
  ['docs/whitepaper-v1-3-legal-provider-review-packet.md', ['Core Legal Position To Review', 'Review Area 5: FIO Protocol', 'Review Area 6: Metallicus, XPR, Metal, WebAuth', 'Required Review Outputs']],
  ['docs/whitepaper-v1-3-partner-outreach-drafts.md', ['Universal Boundary', 'FIO Protocol Draft', 'Metallicus/XPR/WebAuth Draft', 'Founder Use Rule']],
  ['docs/whitepaper-v1-3-patent-innovation-map.md', ['Stronger Innovation Areas', 'Patent Review Questions', 'Filing Boundary']],
  ['docs/whitepaper-v1-3-terms-glossary.md', ['Preferred Terms', 'Review-Required Terms', 'Blocked Public Terms Unless Approved']],
  ['docs/whitepaper-v1-3-source-link-appendix.md', ['Regulatory And Policy Sources', 'Web3 Infrastructure Sources', 'Source Use Boundary']],
  ['docs/whitepaper-v1-3-wording-migration-checklist.md', ['Replace First', 'Migration Order', 'Blocked Until Publication GO']],
  ['docs/whitepaper-v1-3-final-publication-checklist.md', ['Required Before GO', 'Final Go Requirements', 'Do Not Publish If']],
  ['docs/whitepaper-v1-3-beta-wording-alignment.md', ['Tester-Facing Safe Message', 'Blocked Words To Avoid In Beta Copy', 'Beta Stop Conditions']],
  ['docs/whitepaper-v1-3-product-integration-placeholder-plan.md', ['Placeholder Rules', 'Candidate Product Placeholders', 'Do Not Add Yet']],
  ['docs/whitepaper-v1-3-public-website-risk-scan.md', ['Highest-Risk `whitepaper.html` Findings', 'Highest-Risk `index.html` Findings', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-public-html-replacement-plan.md', ['Replacement Strategy', 'New `whitepaper-v1-3-draft.html` Structure', 'Current State']],
  ['docs/whitepaper-v1-3-publication-decision-packet.md', ['Decision Summary', 'What Changes From v1.0 To v1.3', 'Required Before GO', 'Keep publication decision as **NO-GO**']],
  ['docs/whitepaper-v1-3-archive-execution-checklist.md', ['Required Before Running', 'Future Commands', 'Rollback Commands', 'Blocked Now']],
  ['docs/whitepaper-v1-3-homepage-wording-plan.md', ['Current Risky Homepage Patterns', 'Proposed Homepage Direction', 'Blocked Until Approval']],
  ['docs/whitepaper-v1-3-visual-review-checklist.md', ['Desktop Checks', 'Mobile Checks', 'Required Before Public Use']],
  ['docs/whitepaper-v1-3-founder-approval-to-review-packet.md', ['Default state: NO-GO', 'MOVE_TO_REVIEW_FOR_LOCAL_POLISH_ONLY', 'V1_3_LOCAL_REVIEW_APPROVED', 'Exact Founder Approval Phrase', 'What Remains NO-GO', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-autonomous-continuation-rule.md', ['After every completed safe v1.3 task', 'Tasks That Stop The Loop', 'Current Autonomous Queue', 'Live Heartbeat Binding', 'gcsc-nonstop-next-task-hook']],
  ['docs/whitepaper-v1-3-visual-qa-evidence-template.md', ['Run Record Template', 'Visual Evidence Rows Template', 'Desktop Review', 'Mobile Review', 'Content Review', 'Allowed Result States', 'Required Before Public Use', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-local-browser-review-notes.md', ['Headless browser availability', 'whitepaper-v1-3-draft.css', 'Browser Screenshot QA Still Required', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-draft-css-qa-checklist.md', ['Static CSS Checks', 'Manual Visual Checks Still Required', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-draft-navigation-readiness-closeout.md', ['Draft Navigation Readiness Closeout', 'Whitepaper Draft Anchor Map', 'Homepage Draft Anchor Map', 'Manual QA Still Required', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-draft-navigation-click-qa-handoff.md', ['Draft Navigation Click QA Handoff', 'Whitepaper Click Sequence', 'Homepage Click Sequence', 'Required Before Any PASS', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-navigation-click-evidence-intake-checklist.md', ['Navigation Click Evidence Intake Checklist', 'Intake Readiness', 'Browser Click Review', 'Acceptable Intake States', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-navigation-click-evidence-results-template.md', ['Navigation Click Evidence Results Template', 'Run Record Template', 'Click Results Template', 'Result State Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-publication-evidence-template.md', ['Publication Candidate', 'Required Evidence Before GO', 'Claim Review Evidence', 'Explicit Non-Approval']],
  ['docs/whitepaper-v1-3-publication-evidence-current-status.md', ['Local Evidence Already Available', 'Evidence Still Missing Before Any GO', 'Current decision: NO-GO', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-publication-go-record-template.md', ['Future Publication GO Record Template', 'Required GO Evidence', 'Current decision | NO-GO by default', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-publication-blocker-status-matrix.md', ['Publication Blocker Status Matrix', 'Blocker Matrix', 'Clearance Rule', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-archive-rollback-evidence-template.md', ['Archive Rollback Evidence Template', 'Run Record Template', 'Archive Evidence Rows Template', 'Rollback Evidence Rows Template', 'Required Before Any PASS', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-final-public-wording-diff-template.md', ['Final Public Wording Diff Template', 'Source Pairing', 'Diff Review Record Template', 'Required Review Rows', 'Required Before Any PASS', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-public-announcement-review-template.md', ['Public Announcement Review Template', 'Announcement Review Record Template', 'Announcement Copy Rows Template', 'Required Before Any PASS', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-founder-ready-packet-status-rollup.md', ['Founder-Ready Packet Status Rollup', 'Founder Reading Path', 'Current Packet Status', 'Open Blockers', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-founder-action-board.md', ['Founder Action Board', 'Priority Action Board', 'Founder Inputs Still Needed', 'Codex Safe Continuation Queue', 'Actions Not Authorized', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-founder-evening-review-guide.md', ['Founder Evening Review Guide', '15-Minute Review Order', 'Decisions The Founder Can Make Tonight', 'Exact Phrase For Local Review Only', 'Safe Report-Back Format', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-founder-decision-routing-checklist.md', ['Founder Decision Routing Checklist', 'Intake Source', 'Routing Matrix', 'Required Checks Before Acting', 'Escalation Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-founder-review-state-transition-matrix.md', ['Founder Review State Transition Matrix', 'State Matrix', 'Allowed Transitions', 'Disallowed Transitions', 'Evidence Freshness Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-smartcontractor-wording-alignment.md', ['Safe Product Position', 'Blocked Product Claims', 'Safe Replacements', 'Product Copy Rule']],
  ['docs/whitepaper-v1-3-smartcontractor-wording-review-status.md', ['SmartContractor Wording Review Status', 'Required Product Position', 'Product Copy Boundaries', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-provider-question-register.md', ['Escrow Custody', 'Lending And Working Capital', 'KYC, KYB, AML, And Fraud', 'FIO Protocol', 'XPR, WebAuth, Metal, And Metallicus', 'Use Rule']],
  ['docs/whitepaper-v1-3-provider-question-status-matrix.md', ['Provider Question Status Matrix', 'Question Group Status', 'Required Before Status Can Change', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-regulated-web3-architecture-map.md', ['Current No-Real-Money Construction Workflow', 'Licensed Partner Services', 'Future Regulated Web3 Identity And Record Rails', 'Future Regulated Digital Construction Records', 'Blocked Live Actions', 'Marketing Boundary']],
  ['docs/whitepaper-v1-3-claim-risk-hardening-checklist.md', ['Hard Block List', 'Required Context If Mentioned', 'Current Public File Risk', 'Publication Stop Rule']],
  ['docs/whitepaper-v1-3-publication-readiness-dry-run.md', ['Current result: NO-GO', 'Public File Replacement Check', 'NO-GO Reasons', 'Safe Next Actions']],
  ['docs/whitepaper-v1-3-founder-review-closeout.md', ['Founder Decision Choices', 'Current Packet State', 'What Remains NO-GO', 'Founder Review Route', 'Safe Next Actions']],
  ['docs/whitepaper-v1-3-founder-decision-intake-template.md', ['Decision Record', 'Decision Meaning', 'Required Separate Approvals', 'Exact Local Review Phrase Handling', 'V1_3_LOCAL_REVIEW_APPROVED', 'Rejected as approval evidence', 'Safe Intake Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md', ['Screenshot QA is PENDING', 'Screenshot Set', 'Founder Steps', 'Evidence Intake Format', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-screenshot-evidence-manifest.md', ['Screenshot Evidence Manifest', 'Capture Scope', 'Intake Record Template', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-screenshot-evidence-intake-checklist.md', ['Screenshot Evidence Intake Checklist', 'Intake Readiness', 'Redaction Review', 'Issue Routing', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-screenshot-evidence-results-template.md', ['Screenshot Evidence Results Template', 'Run Record Template', 'Screenshot Results Template', 'Result State Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-screenshot-capture-readiness-closeout.md', ['Screenshot Capture Readiness Closeout', 'Capture Readiness State', 'Current Limitation', 'Do Not Treat As Evidence', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-draft-qa-issue-register.md', ['Draft QA Issue Register', 'Issue Severity', 'Resolution Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-local-draft-qa-readiness-scorecard.md', ['Local Draft QA Readiness Scorecard', 'Local Draft QA Inputs', 'Readiness Score', 'Safe Next QA Actions', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-routing-index.md', ['Core Review Packet', 'Attorney / Compliance Reviewer', 'Reviewer Response Intake', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-packet-status-rollup.md', ['Reviewer Packet Status Rollup', 'Packet Readiness Table', 'Reviewer Packet Groups', 'Required Before Any Founder-Controlled Send', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-packet-redaction-checklist.md', ['Reviewer Packet Redaction Checklist', 'Redaction Required Before Reviewer Packet Leaves Local Repo', 'Required Final Checks', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-external-reviewer-cover-sheet.md', ['External Reviewer Cover Sheet', 'Packet Scope', 'Reviewer Instructions', 'Redaction Confirmation', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-evidence-appendix.md', ['Reviewer Evidence Appendix', 'Evidence Package Summary', 'Evidence Not Yet Complete', 'Required Before Any Reviewer Send', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-response-intake-template.md', ['Intake Record', 'Required Reviewer Findings', 'Routing Rules', 'Safe Recording Rules', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-response-summary-shell.md', ['Reviewer Response Summary Shell', 'Required Changes Queue', 'Blockers Carried Forward', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-reviewer-response-routing-closeout.md', ['Reviewer Response Routing Closeout', 'Closeout State', 'Response Decision Routing', 'Required Evidence Before Any State Change', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-public-wording-scan-current-status.md', ['Public Wording Scan Current Status', 'Local Draft Scan Rule', 'Current Public File Boundary', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-internal-review-master-index.md', ['Recommended Reading Order', 'Current Decision State', 'Founder Review Output', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-week-one-closeout-2026-06-06.md', ['Status: in-progress week-one closeout draft', 'Completed Safe Tasks', 'Validators Run', 'Week-One Remaining Safe Tasks', 'Stop Boundary']],
]);

const unsafeStandaloneClaims = [
  'SEC-approved',
  'regulator-approved',
  'guaranteed return',
  'risk-free',
  'instant loan approval',
  'insured profit',
];

const allowedRiskContextFiles = new Set([
  'docs/whitepaper-v1-3-claim-risk-register.md',
  'docs/whitepaper-v1-3-claim-risk-hardening-checklist.md',
  'docs/whitepaper-v1-3-screenshot-qa-founder-handoff.md',
  'docs/whitepaper-v1-3-public-website-risk-scan.md',
  'docs/whitepaper-v1-3-terms-glossary.md',
  'docs/whitepaper-v1-3-beta-wording-alignment.md',
  'docs/whitepaper-v1-3-public-wording-scan-current-status.md',
]);

const errors = [];

for (const file of requiredFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required file: ${file}`);
    continue;
  }

  const text = fs.readFileSync(fullPath, 'utf8');

  if (file === 'docs/whitepaper-v1-3-hybrid-regulated-web3-draft.md') {
    for (const phrase of hybridDraftPhrases) {
      if (!text.includes(phrase)) {
        errors.push(`Missing phrase in ${file}: ${phrase}`);
      }
    }
  }

  const required = fileSpecificPhrases.get(file) ?? [];
  for (const phrase of required) {
    if (!text.includes(phrase)) {
      errors.push(`Missing phrase in ${file}: ${phrase}`);
    }
  }

  for (const claim of unsafeStandaloneClaims) {
    if (allowedRiskContextFiles.has(file)) {
      continue;
    }
    if (text.includes(claim) && !text.includes('Blocked') && !text.includes('Risky') && !text.includes('risk register')) {
      errors.push(`Unsafe claim appears outside risk context in ${file}: ${claim}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('whitepaper v1.3 plan validation passed');
