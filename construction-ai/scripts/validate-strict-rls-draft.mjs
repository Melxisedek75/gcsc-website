import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sqlPath = resolve('..', 'docs', 'smartcontractor-strict-rls-replacement-draft.sql');
const sql = readFileSync(sqlPath, 'utf8');
const normalized = sql.toLowerCase();
const sqlWithoutLineComments = sql
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

function fail(message) {
  console.error(`Strict RLS draft validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function countMatches(pattern) {
  return (sql.match(pattern) || []).length;
}

function assertIncludes(snippet, message) {
  assert(normalized.includes(snippet.toLowerCase()), message || `Missing SQL snippet: ${snippet}`);
}

const requiredTables = [
  'profiles',
  'homeowners',
  'contractors',
  'jobs',
  'bids',
  'bid_unlocks',
  'contractor_loans',
  'loan_repayments',
  'disputes',
  'dispute_evidence',
  'dispute_reviews',
  'ratings',
  'project_contracts',
  'milestones',
  'payment_intents',
  'payment_events',
  'verification_checks',
  'verification_provider_events',
  'audit_events',
  'token_price_snapshots',
  'token_collateral_locks',
];

const backendOnlyTables = [
  'payment_events',
  'verification_provider_events',
  'audit_events',
  'token_price_snapshots',
];

const requiredPolicyNames = [
  'profiles_select_own',
  'profiles_insert_own',
  'profiles_update_own',
  'homeowners_select_own',
  'homeowners_insert_own',
  'homeowners_update_own',
  'contractors_select_own_or_public_verified',
  'contractors_insert_own',
  'contractors_update_own',
  'jobs_select_open_or_participant',
  'jobs_insert_own_homeowner',
  'jobs_update_own_homeowner',
  'bids_select_participant_or_public_preview',
  'bids_insert_own_contractor',
  'bids_update_own_contractor',
  'bid_unlocks_select_own_contractor',
  'contractor_loans_select_own_contractor',
  'contractor_loans_insert_own_contractor',
  'loan_repayments_select_own_contractor',
  'disputes_select_participants',
  'disputes_insert_participants',
  'dispute_evidence_select_participants',
  'dispute_evidence_insert_participants',
  'dispute_reviews_select_dispute_participants_or_reviewer',
  'dispute_reviews_insert_own_reviewer',
  'project_contracts_select_participants',
  'milestones_select_project_participants',
  'payment_intents_select_none_from_browser',
  'verification_checks_select_own_subject',
  'token_collateral_locks_select_own_contractor',
  'token_collateral_locks_insert_own_contractor',
  'ratings_select_related_participants',
];

assertIncludes('begin;', 'Draft must be wrapped in a transaction');
assertIncludes('commit;', 'Draft must commit the transaction explicitly');
assertIncludes('create schema if not exists private;', 'Draft must create private helper schema');
assertIncludes('private.current_profile_id()', 'Draft must include current profile helper');
assertIncludes('private.current_homeowner_id()', 'Draft must include current homeowner helper');
assertIncludes('private.current_contractor_id()', 'Draft must include current contractor helper');
assertIncludes('project_contracts_accepted_bid_id_idx', 'Draft must include accepted bid FK index');
assertIncludes('token_collateral_locks_price_snapshot_id_idx', 'Draft must include token price snapshot FK index');

for (const table of requiredTables) {
  assertIncludes(`alter table public.${table} enable row level security;`, `Missing RLS enable statement for ${table}`);
}

for (const policy of requiredPolicyNames) {
  assertIncludes(`create policy "${policy}"`, `Missing required policy ${policy}`);
}

for (const table of backendOnlyTables) {
  const createPolicyForTable = new RegExp(`create\\s+policy\\s+"[^"]+"\\s+on\\s+public\\.${table}\\b`, 'i');
  assert(!createPolicyForTable.test(sql), `${table} must remain backend-only with no browser policy`);
}

assert(!/\busing\s*\(\s*true\s*\)/i.test(sql), 'Draft must not contain USING (true)');
assert(!/\bwith\s+check\s*\(\s*true\s*\)/i.test(sql), 'Draft must not contain WITH CHECK (true)');
assert(!/\bto\s+anon\b/i.test(sql), 'Draft must not grant policies directly to anon');
assert(!/\bservice_role\b/i.test(sql), 'Draft must not depend on hardcoded service_role policies');
assert(
  !/supabase_service_role_key|service[-_ ]role key|password|secret/i.test(sqlWithoutLineComments),
  'Draft SQL body must not include secret placeholders'
);

assert(
  countMatches(/drop policy if exists "dev /gi) >= 35,
  'Draft should drop the broad development policies before creating strict policies'
);

console.log(JSON.stringify({
  status: 'passed',
  file: sqlPath,
  tables_checked: requiredTables.length,
  policies_checked: requiredPolicyNames.length,
  backend_only_tables_checked: backendOnlyTables.length,
}, null, 2));
