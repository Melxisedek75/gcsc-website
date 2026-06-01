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
  'docs/whitepaper-v1-3-publication-evidence-template.md',
  'docs/whitepaper-v1-3-smartcontractor-wording-alignment.md',
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
  ['docs/whitepaper-v1-3-founder-approval-to-review-packet.md', ['MOVE_TO_REVIEW_FOR_LOCAL_POLISH_ONLY', 'V1_3_LOCAL_REVIEW_APPROVED', 'What Remains NO-GO']],
  ['docs/whitepaper-v1-3-autonomous-continuation-rule.md', ['After every completed safe v1.3 task', 'Tasks That Stop The Loop', 'Current Autonomous Queue', 'Live Heartbeat Binding', 'gcsc-nonstop-next-task-hook']],
  ['docs/whitepaper-v1-3-visual-qa-evidence-template.md', ['Desktop Review', 'Mobile Review', 'Content Review', 'Required Before Public Use']],
  ['docs/whitepaper-v1-3-local-browser-review-notes.md', ['Headless browser availability', 'whitepaper-v1-3-draft.css', 'Browser Screenshot QA Still Required', 'Stop Boundary']],
  ['docs/whitepaper-v1-3-publication-evidence-template.md', ['Publication Candidate', 'Required Evidence Before GO', 'Claim Review Evidence', 'Explicit Non-Approval']],
  ['docs/whitepaper-v1-3-smartcontractor-wording-alignment.md', ['Safe Product Position', 'Blocked Product Claims', 'Safe Replacements', 'Product Copy Rule']],
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
  'docs/whitepaper-v1-3-public-website-risk-scan.md',
  'docs/whitepaper-v1-3-terms-glossary.md',
  'docs/whitepaper-v1-3-beta-wording-alignment.md',
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
