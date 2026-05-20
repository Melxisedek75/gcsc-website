import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const blueprintPath = resolve('..', 'docs', 'gcsc-contract-backed-loan-blueprint.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const auditPath = resolve('..', 'docs', 'gcsc-real-status-audit-2026-05-11.md');
const packagePath = resolve('package.json');

function fail(message) {
  console.error(`Contract-backed loan blueprint validation failed: ${message}`);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

function assertIncludes(content, snippet, file) {
  if (!content.toLowerCase().includes(snippet.toLowerCase())) {
    fail(`${file} must include: ${snippet}`);
  }
}

const blueprint = readRequired(blueprintPath);
const context = readRequired(contextPath);
const backlog = readRequired(backlogPath);
const audit = readRequired(auditPath);
const packageJson = JSON.parse(readRequired(packagePath));

for (const section of [
  'GCSC Contract-Backed Loan Blueprint',
  'Purpose',
  'Core Thesis',
  'Non-Negotiable Safety Principles',
  'Actors And Roles',
  'Lifecycle State Machine',
  'Payment Waterfall',
  'Data Model',
  'Smart Contract Module Boundaries',
  'Security And Anti-Backdoor Requirements',
  'Threat Model',
  'Implementation Owner Matrix',
  'Implementation Evidence Gate',
  'Implementation Packet Readiness Checklist',
  'Implementation Packet Status Taxonomy',
  'Implementation Packet External Use Gate',
  'Implementation Packet Decision Log',
  'Implementation Packet Redaction Checklist',
  'Implementation Packet Evidence Freshness Gate',
  'Implementation Packet Change Control Gate',
  'Implementation Packet Audience Scope Gate',
  'Implementation Packet Revocation Gate',
  'Implementation Packet Supersession Gate',
  'Implementation Packet Retirement Gate',
  'Implementation Packet Review Freeze Gate',
  'Founder Approval Gates',
  'Implementation Readiness',
  'Required Checks Before Public Use',
]) {
  assertIncludes(blueprint, section, blueprintPath);
}

for (const required of [
  'internal founder-approved design candidate only',
  'not legal advice',
  'not lending approval',
  'not escrow approval',
  'not payment provider approval',
  'not approval to launch real loans',
  'not approval to launch real escrow',
  'not approval to launch token collateral',
  'not approval to move real money',
  'expected milestone receivables',
  'contract-backed working-capital eligibility',
  'receivables-based underwriting',
  'repayment-first milestone waterfall',
  'AI never makes final legal, lending, escrow, collateral, or payment decisions',
  'Smart contracts never receive hidden admin backdoors',
  'Disputes pause release eligibility and repayment routing',
  'Contract Signed',
  'Loan Requested',
  'Risk Review',
  'Provider Review',
  'Release Eligible',
  'Repayment Routed',
  'Contractor Net Paid',
  'no state may jump directly from Evidence Submitted to Repayment Routed',
  'milestone_gross - approved_platform_fees - agreed_loan_repayment = contractor_net_payout',
  'no repayment above outstanding balance',
  'no negative payout',
  'project_contract_id',
  'evidence_reference_hash',
  'remaining_loan_balance',
  'Project Contract Registry',
  'Milestone And Escrow-Ready State Machine',
  'Contract-Backed Loan Ledger',
  'Repayment Waterfall Router',
  'Reputation And Risk Ledger',
  'Audit And Compliance Registry',
  'least-privilege roles',
  'no owner-only fund drain',
  'no hidden upgrade path',
  'no arbitrary balance mutation',
  'no arbitrary price oracle trust',
  'no bypass from dispute to release',
  'no self-approval by contractor',
  'no AI-only approval',
  'no service-role key in browser code',
  'route repayment while disputed',
  'release milestone before approval',
  'overpay repayment above outstanding balance',
  'delete or rewrite repayment history',
  'Threat',
  'Control',
  'Owner | Responsibility | Stop Boundary',
  'Founder | Approves public wording, provider outreach, live deploy timing, and admin activation | Cannot be bypassed by Codex or automation',
  'Legal/compliance reviewer | Reviews lending, escrow, repayment, collateral, privacy, and public claims | Must approve before real-money claims or provider commitments',
  'Finance or lending provider | Defines underwriting, funding, repayment, servicing, and disclosures | No autonomous Codex funding, servicing, or repayment routing',
  'Security reviewer | Reviews authority model, replay fixtures, audit trail, and anti-backdoor controls | No live contract deployment before security review',
  'Evidence Item | Required Before | Stop Boundary',
  'signed_project_contract_reference | local implementation planning | Must be a non-secret id or hash reference, not raw private contract text',
  'provider_review_reference | provider-facing handoff or real funding design | Must remain pending until provider writes back through founder-controlled review',
  'legal_review_reference | public real-money wording or production routing | Must remain pending until attorney/compliance review is recorded',
  'security_review_reference | production contract deployment | Must remain pending until authority, audit, replay, and anti-backdoor review is complete',
  'no_real_money_check_run | every local implementation packet | Must show local-only checks before any live loan, escrow, repayment, settlement, or collateral step',
  'Readiness Item | Required Evidence | Blocked If Missing',
  'scope_summary | Local-only module or packet scope with explicit non-live purpose | Packet cannot be used for provider, legal, public, or production decisions',
  'state_transition_map | Allowed states, forbidden jumps, dispute pauses, and repayment holds | No smart contract implementation handoff',
  'authority_and_audit_map | Role checks, signer references, request ids, and append-only audit events | No privileged action design acceptance',
  'blocked_live_action_list | Real loans, escrow, repayment routing, stablecoin settlement, token collateral, public launch, and provider commitments listed as blocked | No founder review packet closeout',
  'latest_check_run_reference | Fresh local validator or full check evidence | No packet status can move beyond LOCAL_REVIEW_ONLY',
  'Packet Status | Meaning | Allowed Next Status',
  'LOCAL_REVIEW_ONLY | Draft or implementation packet exists only for local technical review and cannot support external decisions | HOLD_FOR_SCOPE_REVIEW or READY_FOR_TECHNICAL_DRAFT',
  'HOLD_FOR_SCOPE_REVIEW | Scope, evidence, owner checkpoint, or no-real-money proof is incomplete | LOCAL_REVIEW_ONLY or READY_FOR_TECHNICAL_DRAFT',
  'READY_FOR_TECHNICAL_DRAFT | Local scope, fixtures, owner notes, blocked-live list, and check evidence are present | BLOCKED_FOR_LIVE_REVIEW',
  'BLOCKED_FOR_LIVE_REVIEW | Packet is technically organized but blocked from provider, legal, public, deploy, loan, escrow, repayment, settlement, or collateral use | LOCAL_REVIEW_ONLY after revisions only',
  'External Use | Minimum Recorded Evidence | Blocked Until',
  'founder_review_packet | Founder-facing summary, scope, current packet status, and blocked live actions | Founder records a review decision outside Codex automation',
  'legal_or_provider_packet | Redacted technical summary, no-secret evidence references, and no-real-money boundary | Legal/provider reviewer is selected and founder approves sending',
  'public_wording_source | Approved exact wording reference and claim-review evidence | Founder, legal/compliance, and public wording gates are recorded',
  'production_or_deploy_source | Security review reference, authority model reference, and latest full check run | Founder, security, legal/provider, and deployment decisions are all recorded',
  'Decision Field | Required Value | Blocked If Missing',
  'packet_decision_id | Stable non-secret local id tied to the packet and source commit | Decision cannot be referenced in handoff',
  'decision_owner | Founder, legal/compliance, finance/provider, security, or Codex-local owner | Decision cannot be treated as reviewed',
  'decision_state | HOLD, REVISE, LOCAL_ONLY_BUILD, or BLOCKED_FOR_LIVE_REVIEW | Decision cannot move packet status',
  'decision_evidence_reference | Redacted file path, check run, or non-secret review reference | Decision cannot support external use',
  'blocked_next_action | Explicit live action that remains blocked | Decision cannot close the safety gate',
  'Redaction Target | Required Handling | Blocked If Exposed',
  'private_contract_text | Replace with signed_project_contract_reference or evidence_reference_hash | No founder, legal/provider, public, or production packet use',
  'customer_or_contractor_identity | Replace with role, request id, or redacted profile reference | No external packet sharing',
  'payment_or_bank_detail | Remove entirely and keep only no-real-money status | No packet handoff or merge',
  'wallet_or_token_identifier | Replace with non-secret test fixture id unless founder-approved for review | No token collateral, settlement, or provider packet use',
  'secrets_or_credentials | Remove entirely and rotate outside Codex if exposure is suspected | Stop work and notify founder',
  'Evidence Reference | Maximum Age | Refresh Required Before',
  'latest_check_run_reference | Same working session or latest source commit | Any packet status upgrade, merge, or technical handoff',
  'decision_evidence_reference | Current packet version and source commit | Founder, legal/provider, public, or production packet use',
  'redaction_review_reference | After every packet content change | Any external sharing or handoff',
  'owner_checkpoint_reference | After scope, authority, or blocked-live list changes | Packet closeout or status change',
  'stale_or_missing_evidence | Treat as HOLD_FOR_SCOPE_REVIEW | No external use, merge, production decision, or live-risk action',
  'Change Control Field | Required Value | Blocked If Missing',
  'source_commit | Current local commit or working-tree reference for the packet change | No packet status upgrade or merge',
  'change_reason | Local technical reason tied to safety, evidence, scope, or implementation clarity | No handoff or closeout',
  'affected_packet_sections | Exact sections changed or reviewed | No founder, legal/provider, public, or production packet use',
  'review_owner | Codex-local, founder, legal/compliance, finance/provider, or security owner | No review state can be claimed',
  'rollback_or_hold_action | Revert, revise, or hold action if change evidence is stale, unsafe, or disputed | No live-risk action or external sharing',
  'Audience Scope Field | Required Value | Blocked If Missing',
  'intended_audience | Codex-local, founder, legal/compliance, finance/provider, security, or public-wording reviewer | No packet export or handoff',
  'allowed_content_depth | Summary, technical, legal/provider, security, or public-safe wording scope | No audience-specific packet use',
  'approval_status | INTERNAL_REVIEW_ONLY, FOUNDER_REVIEW_PENDING, EXTERNAL_REVIEW_PENDING, or BLOCKED_FOR_LIVE_REVIEW | No packet status upgrade',
  'prohibited_content | Secrets, private identities, payment details, wallet/token identifiers, live loan terms, or legal conclusions listed as excluded | No external sharing',
  'blocked_until | Explicit founder/legal/provider/security/public-wording decision or no-real-money evidence gate | No live-risk action or production use',
  'Revocation Trigger | Required Response | Blocked Until',
  'sensitive_data_found | Revoke packet approval, stop sharing, and re-run redaction review | Founder/admin confirms redacted replacement',
  'wrong_audience_shared | Mark packet BLOCKED_FOR_LIVE_REVIEW and record correction path | Founder/legal/provider route confirms next safe packet',
  'stale_evidence_discovered | Downgrade to HOLD_FOR_SCOPE_REVIEW and refresh evidence references | Latest check run and owner checkpoint are recorded',
  'unsafe_claim_found | Remove claim from packet and route wording to founder/legal review | Claim-review evidence is updated',
  'live_risk_action_detected | Stop work and keep real loan, escrow, repayment, settlement, collateral, provider, deploy, and public actions blocked | Founder/legal/provider/security decision is recorded',
  'Supersession Field | Required Value | Blocked If Missing',
  'superseded_packet_id | Stable non-secret id of packet being replaced | Old packet remains ambiguous for handoff or review',
  'replacement_packet_id | Stable non-secret id tied to current packet/source commit | New packet cannot be treated as active',
  'supersession_reason | Evidence refresh, redaction fix, audience correction, claim correction, or live-risk correction | Packet cannot override prior approval',
  'carry_forward_decisions | Explicit HOLD, REVISE, LOCAL_ONLY_BUILD, or BLOCKED_FOR_LIVE_REVIEW decisions copied or retired | Prior decision state cannot be reused',
  'blocked_old_packet_use | Old packet marked blocked for sharing, claim use, production use, live-risk action, and external handoff | Old packet may not be referenced as current',
  'Retirement Field | Required Value | Blocked If Missing',
  'retired_packet_id | Stable non-secret id of packet being retired | Packet may remain usable by mistake',
  'retirement_reason | Superseded, revoked, stale, wrong audience, unsafe claim, or live-risk correction | Retirement cannot be audited',
  'retirement_scope | Sharing, claim use, external handoff, production use, and live-risk action all blocked | Old packet may be reused outside scope',
  'replacement_or_hold_reference | Replacement packet id or HOLD_FOR_SCOPE_REVIEW record | Reviewers cannot identify current safe source',
  'retirement_owner | Codex-local, founder, legal/compliance, finance/provider, or security owner | Retirement cannot be treated as reviewed',
  'Review Freeze Field | Required Value | Blocked If Missing',
  'freeze_state | OPEN_FOR_LOCAL_EDIT, FROZEN_FOR_FOUNDER_REVIEW, FROZEN_FOR_LEGAL_PROVIDER_REVIEW, or BLOCKED_FOR_LIVE_REVIEW | Packet review state cannot be trusted',
  'freeze_reason | Founder review, legal/provider review, security review, public wording review, or live-risk block | Packet may change during review without record',
  'allowed_change_path | New packet version, supersession record, or explicit HOLD_FOR_SCOPE_REVIEW | In-place edits cannot proceed',
  'reviewer_notification_reference | Non-secret note that reviewers must use latest packet id | Reviewers may rely on stale packet',
  'thaw_condition | Review completed, packet superseded, packet retired, or founder/legal/provider/security decision recorded | Packet cannot resume editing',
  'signed project contract is not described as legal collateral today',
  'legal/provider review happens before public real-money claims',
  'real loans',
  'real escrow',
  'real repayment routing',
  'stablecoin settlement',
  'token collateral',
  'npm run check:contract-backed-loan-blueprint',
  'npm run check:whitepaper-v1-2-contract-backed-loan-flow',
  'npm run check:whitepaper-v1-2-smart-contract-architecture',
  'npm run check:legal-review',
]) {
  assertIncludes(blueprint, required, blueprintPath);
}

for (const [content, file] of [
  [context, contextPath],
  [backlog, backlogPath],
  [audit, auditPath],
]) {
  assertIncludes(content, 'Contract-backed loan blueprint', file);
  assertIncludes(content, 'check:contract-backed-loan-blueprint', file);
}

if (!packageJson.scripts?.['check:contract-backed-loan-blueprint']) {
  fail('package.json must expose check:contract-backed-loan-blueprint');
}

if (/sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service_role\s*[:=]|postgresql:\/\/|password\s*[:=]|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/i.test(blueprint)) {
  fail('Blueprint must not contain real secret-looking values');
}

console.log(JSON.stringify({
  status: 'passed',
  contract_backed_loan_blueprint: blueprintPath,
  anti_backdoor_controls_checked: true,
  live_money_block_checked: true,
}, null, 2));
