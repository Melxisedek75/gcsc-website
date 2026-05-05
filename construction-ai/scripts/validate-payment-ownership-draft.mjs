import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sqlPath = resolve('..', 'docs', 'smartcontractor-payment-intent-ownership-draft.sql');
const sql = readFileSync(sqlPath, 'utf8');
const normalized = sql.toLowerCase();
const sqlWithoutLineComments = sql
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

function fail(message) {
  console.error(`Payment ownership draft validation failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(snippet, message) {
  assert(normalized.includes(snippet.toLowerCase()), message || `Missing SQL snippet: ${snippet}`);
}

const ownershipColumns = [
  ['payer_profile_id', 'public.profiles(id)'],
  ['homeowner_id', 'public.homeowners(id)'],
  ['contractor_id', 'public.contractors(id)'],
  ['job_id', 'public.jobs(id)'],
  ['loan_id', 'public.contractor_loans(id)'],
  ['project_contract_id', 'public.project_contracts(id)'],
  ['milestone_id', 'public.milestones(id)'],
];

assertIncludes('begin;', 'Draft must be wrapped in a transaction');
assertIncludes('commit;', 'Draft must commit explicitly');
assertIncludes('alter table public.payment_intents', 'Draft must alter payment_intents');
assertIncludes('drop policy if exists "payment_intents_select_none_from_browser"', 'Draft must remove temporary no-browser-read policy');
assertIncludes('drop policy if exists "payment_intents_select_participants"', 'Draft must be safe to re-run');
assertIncludes('create policy "payment_intents_select_participants"', 'Draft must create participant select policy');
assertIncludes('on public.payment_intents for select', 'Policy must target payment_intents select');
assertIncludes('to authenticated', 'Policy must be authenticated-only');

for (const [column, reference] of ownershipColumns) {
  assertIncludes(`add column if not exists ${column} uuid references ${reference}`, `Missing typed ownership column ${column}`);
  assertIncludes(`payment_intents_${column}_idx`, `Missing index for ${column}`);
  assertIncludes(`comment on column public.payment_intents.${column}`, `Missing column comment for ${column}`);
}

for (const helper of [
  'private.current_profile_id()',
  'private.current_homeowner_id()',
  'private.current_contractor_id()',
]) {
  assertIncludes(helper, `Participant policy must use ${helper}`);
}

for (const participantTable of [
  'public.jobs',
  'public.contractor_loans',
  'public.project_contracts',
  'public.milestones',
]) {
  assertIncludes(participantTable, `Participant policy must check ${participantTable}`);
}

assert(!/\bfor\s+insert\b/i.test(sql), 'Draft must not create browser insert policy for payment_intents');
assert(!/\bfor\s+update\b/i.test(sql), 'Draft must not create browser update policy for payment_intents');
assert(!/\bto\s+anon\b/i.test(sql), 'Draft must not grant payment visibility to anon');
assert(!/\busing\s*\(\s*true\s*\)/i.test(sql), 'Draft must not contain USING (true)');
assert(!/\bwith\s+check\s*\(\s*true\s*\)/i.test(sql), 'Draft must not contain WITH CHECK (true)');
assert(
  !/supabase_service_role_key|service[-_ ]role key|password|secret/i.test(sqlWithoutLineComments),
  'Draft SQL body must not include secret placeholders'
);

console.log(JSON.stringify({
  status: 'passed',
  file: sqlPath,
  ownership_columns_checked: ownershipColumns.map(([column]) => column),
}, null, 2));
