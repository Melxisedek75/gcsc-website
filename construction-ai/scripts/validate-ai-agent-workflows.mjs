import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const docPath = resolve('..', 'docs', 'smartcontractor-ai-agent-workflows.md');
const backlogPath = resolve('..', 'docs', 'smartcontractor-backlog.md');
const contextPath = resolve('..', 'docs', 'gcsc-active-context.md');
const serverPath = resolve('server.js');
const packagePath = resolve('package.json');
const smokePath = resolve('scripts', 'smoke-ai-agent-recommendations.mjs');
const envPath = resolve('.env.example');

const doc = readFileSync(docPath, 'utf8');
const backlog = readFileSync(backlogPath, 'utf8');
const context = readFileSync(contextPath, 'utf8');
const server = readFileSync(serverPath, 'utf8');
const packageJson = readFileSync(packagePath, 'utf8');
const smoke = readFileSync(smokePath, 'utf8');
const envExample = readFileSync(envPath, 'utf8');

function fail(message) {
  console.error(`AI agent workflow validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(content, snippet, file) {
  assert(
    content.toLowerCase().includes(snippet.toLowerCase()),
    `${file} must include: ${snippet}`
  );
}

const requiredDocPhrases = [
  'local design scaffold only',
  'Shared Agent Contract',
  'Contractor Matching Agent',
  'Risk Assessment Agent',
  'Compliance Agent',
  'Treasury Agent',
  'Dispute Triage Agent',
  'Document Generation Agent',
  'required_human_review',
  'blocked_actions',
  'audit_event_required',
  'AI recommends; deterministic rules and humans approve',
  'No real payment, loan, escrow, refund, payout, token collateral, or liquidation action can be executed by an agent',
  'No live Supabase migration or production policy change without explicit founder approval',
];

for (const phrase of requiredDocPhrases) {
  assertIncludes(doc, phrase, docPath);
}

const forbiddenDocPhrases = [
  'agent may approve real loans',
  'agent can release escrow',
  'automatic legal approval',
  'guaranteed approval',
  'guaranteed returns',
  'send raw private documents',
];

for (const phrase of forbiddenDocPhrases) {
  assert(
    !doc.toLowerCase().includes(phrase.toLowerCase()),
    `${docPath} contains forbidden phrase: ${phrase}`
  );
}

for (const workflow of [
  'job_match_ranking',
  'starter_loan_review',
  'verification_triage',
  'payment_exception_review',
  'dispute_evidence_summary',
  'draft_document_packet',
]) {
  assertIncludes(doc, workflow, docPath);
}

assertIncludes(backlog, 'AI agent workflow scaffold', backlogPath);
assertIncludes(backlog, 'check:ai-agent-workflows', backlogPath);
assertIncludes(backlog, 'AI starter loan recommendation smoke test', backlogPath);
assertIncludes(backlog, 'check:ai-agent-recommendations', backlogPath);
assertIncludes(context, 'AI agent workflow scaffold', contextPath);
assertIncludes(context, 'check:ai-agent-workflows', contextPath);
assertIncludes(context, 'check:ai-agent-recommendations', contextPath);
assertIncludes(server, "app.get('/api/admin/ai-agents/workflows'", serverPath);
assertIncludes(server, 'buildAiAgentWorkflowCatalog', serverPath);
assertIncludes(server, 'ai-agent-workflow-catalog', serverPath);
assertIncludes(server, "app.post('/api/admin/ai-agents/recommendations'", serverPath);
assertIncludes(server, 'buildStarterLoanReviewRecommendation', serverPath);
assertIncludes(server, 'risk_assessment_agent', serverPath);
assertIncludes(server, 'required_human_review: true', serverPath);
assertIncludes(server, 'approve_real_loan', serverPath);
assertIncludes(server, 'release_escrow', serverPath);
assertIncludes(server, 'lock_token_collateral', serverPath);
assertIncludes(server, 'BLOCKED_FOR_LIVE', serverPath);
assertIncludes(server, 'SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE', serverPath);
assertIncludes(packageJson, '"check:ai-agent-recommendations": "node scripts/smoke-ai-agent-recommendations.mjs"', packagePath);
assertIncludes(smoke, "process.env.SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE = 'skip'", smokePath);
assertIncludes(smoke, 'throw new Error(`AI recommendation smoke failed:', smokePath);
assertIncludes(smoke, "audit_event_attempted === false", smokePath);
assertIncludes(smoke, 'assertNoRecommendationDraft', smokePath);
assertIncludes(smoke, 'must not return a recommendation draft', smokePath);
assertIncludes(smoke, "valid.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "invalid.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "missingEntityId.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "wrongEntityType.headers.get('x-request-id')", smokePath);
assertIncludes(smoke, "workflow must be starter_loan_review", smokePath);
assertIncludes(smoke, 'missingEntityId', smokePath);
assertIncludes(smoke, 'entity_id is required', smokePath);
assertIncludes(smoke, 'wrongEntityType', smokePath);
assertIncludes(smoke, 'payment_intent', smokePath);
assertIncludes(smoke, 'entity_type must be contractor_loan', smokePath);
assertIncludes(smoke, 'assertNoSecretLeak', smokePath);
assertIncludes(smoke, 'supabase_service_role_key', smokePath);
assertIncludes(smoke, 'private_key', smokePath);
assertIncludes(smoke, 'Workflow catalog response', smokePath);
assertIncludes(smoke, 'Valid recommendation response', smokePath);
assertIncludes(smoke, 'Missing-evidence recommendation response', smokePath);
assertIncludes(smoke, 'High-risk recommendation response', smokePath);
assertIncludes(smoke, 'local-only review packet is ready for human review', smokePath);
assertIncludes(smoke, 'loan-smoke-missing-evidence', smokePath);
assertIncludes(smoke, 'signed project contract evidence is missing', smokePath);
assertIncludes(smoke, 'repayment waterfall needs founder/legal/provider review', smokePath);
assertIncludes(smoke, 'business, license, insurance, or identity verification is incomplete', smokePath);
assertIncludes(smoke, 'loan-smoke-high-risk', smokePath);
assertIncludes(smoke, 'high_risk_manual_review', smokePath);
assertIncludes(smoke, 'requested amount is above the local starter-loan demo cap', smokePath);
assertIncludes(smoke, 'risk score is below the local review threshold', smokePath);
assertIncludes(smoke, "Workflow catalog safety boundaries must include", smokePath);
assertIncludes(smoke, "catalog_safety_boundaries_checked", smokePath);
assertIncludes(envExample, 'SMARTCONTRACTOR_AI_AGENT_AUDIT_MODE=live', envPath);
assertIncludes(envExample, 'skip only for local smoke tests', envPath);

console.log(JSON.stringify({
  status: 'passed',
  doc_checked: docPath,
  workflows_checked: 6,
  local_endpoint_checked: '/api/admin/ai-agents/recommendations',
}, null, 2));
