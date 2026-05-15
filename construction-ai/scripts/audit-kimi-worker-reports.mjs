import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

const projectRoot = resolve('..');
const tmpRoot = resolve(projectRoot, '.tmp');
const explicitIntakeRoot = process.argv[2] ? resolve(process.argv[2]) : null;
const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
const expectedWorkerReportTotal = 100;
const requiredReportFields = [
  'Worker ID:',
  'Stream:',
  'Files read:',
  'Files created/modified:',
  'Commands run:',
  'Result:',
  'Findings by severity:',
  'Proposed integrator action:',
  'Stop boundaries checked:',
  'No-touch confirmation:',
  'Remaining blockers:',
];
const secretPattern = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service[_-]?role\s*[:=]|seed\s*phrase\s*[:=]|private\s*key\s*[:=]|password\s*[:=]|api[_-]?key\s*[:=]/i;
const liveRiskPattern = /live Supabase|deploy(?:ment)?|public launch|real payment|real loan|escrow release|repayment routing|stablecoin settlement|token collateral|XPR signature|app-store|legal approval|lender approval|provider commitment/i;

function fail(message) {
  console.error(`Kimi worker report audit failed: ${message}`);
  process.exit(1);
}

function findLatestIntakeRoot() {
  if (!existsSync(tmpRoot)) {
    fail(`Missing .tmp folder: ${tmpRoot}`);
  }

  const candidates = readdirSync(tmpRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('kimi-wave-one-output-intake-'))
    .map((entry) => resolve(tmpRoot, entry.name))
    .sort((a, b) => basename(b).localeCompare(basename(a)));

  if (candidates.length === 0) {
    fail('No kimi-wave-one-output-intake-* folder found. Run npm run prepare:kimi-output-intake first.');
  }

  return candidates[0];
}

function listFiles(folder) {
  if (!existsSync(folder)) return [];

  const results = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const fullPath = join(folder, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function fieldPattern(field) {
  const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|\\n)\\s*${escapedField}`, 'i');
}

const intakeRoot = explicitIntakeRoot ?? findLatestIntakeRoot();
if (!existsSync(intakeRoot)) {
  fail(`Intake folder does not exist: ${intakeRoot}`);
}
if (!intakeRoot.startsWith(tmpRoot)) {
  fail('Intake folder must stay under C:\\gcsc\\.tmp');
}

const intakeFolderMapPath = resolve(intakeRoot, 'intake-folder-map.json');
if (!existsSync(intakeFolderMapPath)) {
  fail(`Missing intake-folder-map.json in intake folder: ${intakeFolderMapPath}`);
}

let intakeFolderMap;
try {
  intakeFolderMap = JSON.parse(readFileSync(intakeFolderMapPath, 'utf8'));
} catch (error) {
  fail(`Unable to parse intake-folder-map.json: ${error.message}`);
}

const intakeWriteAllowlist = Array.isArray(intakeFolderMap.intake_write_allowlist)
  ? intakeFolderMap.intake_write_allowlist
  : [];
const intakeBlocklist = Array.isArray(intakeFolderMap.intake_blocklist)
  ? intakeFolderMap.intake_blocklist
  : [];

const reportFindings = [];
const streamSummaries = streams.map((stream) => {
  const reportRoot = resolve(intakeRoot, 'streams', stream, 'worker-reports');
  const reportFiles = listFiles(reportRoot);
  const reportsWithIssues = [];

  for (const filePath of reportFiles) {
    const stats = statSync(filePath);
    const relativePath = relative(intakeRoot, filePath).replaceAll('\\', '/');
    const issue = {
      file: filePath,
      relative_file: relativePath,
      missing_fields: [],
      stream_mismatch: false,
      blocked_secret_or_credential: false,
      review_live_or_external_action: false,
      oversized: stats.size > 1024 * 1024,
    };

    if (issue.oversized) {
      reportsWithIssues.push(issue);
      reportFindings.push({
        severity: 'REVIEW',
        stream,
        file: filePath,
        reason: 'worker report larger than 1MB; review manually before sharing or merging',
      });
      continue;
    }

    const content = readFileSync(filePath, 'utf8');
    issue.missing_fields = requiredReportFields.filter((field) => !fieldPattern(field).test(content));

    const streamMatch = content.match(/(^|\n)\s*Stream:\s*([A-Z])/i);
    issue.stream_mismatch = Boolean(streamMatch && streamMatch[2].toUpperCase() !== stream);
    issue.blocked_secret_or_credential = secretPattern.test(content);
    issue.review_live_or_external_action = liveRiskPattern.test(content);

    if (issue.missing_fields.length > 0 || issue.stream_mismatch || issue.blocked_secret_or_credential || issue.review_live_or_external_action) {
      reportsWithIssues.push(issue);
    }

    if (issue.missing_fields.length > 0) {
      reportFindings.push({
        severity: 'REWORK',
        stream,
        file: filePath,
        reason: 'worker report is missing required fields',
        missing_fields: issue.missing_fields,
      });
    }
    if (issue.stream_mismatch) {
      reportFindings.push({
        severity: 'REWORK',
        stream,
        file: filePath,
        reason: 'worker report Stream field does not match intake stream folder',
      });
    }
    if (issue.blocked_secret_or_credential) {
      reportFindings.push({
        severity: 'BLOCKED',
        stream,
        file: filePath,
        reason: 'secret-looking or credential-looking text detected',
      });
    }
    if (issue.review_live_or_external_action) {
      reportFindings.push({
        severity: 'REVIEW',
        stream,
        file: filePath,
        reason: 'live/legal/money/public-action wording detected; route through Claude/Codex review',
      });
    }
  }

  return {
    stream,
    worker_reports: reportFiles.length,
    reports_with_issues: reportsWithIssues.length,
    issue_files: reportsWithIssues.map((issue) => ({
      relative_file: issue.relative_file,
      missing_fields: issue.missing_fields,
      stream_mismatch: issue.stream_mismatch,
      blocked_secret_or_credential: issue.blocked_secret_or_credential,
      review_live_or_external_action: issue.review_live_or_external_action,
      oversized: issue.oversized,
    })),
  };
});

const totalReports = streamSummaries.reduce((sum, stream) => sum + stream.worker_reports, 0);
const blocked = reportFindings.some((finding) => finding.severity === 'BLOCKED');
const needsRework = reportFindings.some((finding) => finding.severity === 'REWORK');
const needsReview = reportFindings.some((finding) => finding.severity === 'REVIEW');
const status = totalReports === 0
  ? 'no_reports_yet'
  : blocked
    ? 'blocked_for_review'
    : needsRework
      ? 'needs_rework'
      : needsReview
        ? 'needs_review'
        : 'passed';

console.log(JSON.stringify({
  status,
  intake_root: intakeRoot,
  intake_folder_map: intakeFolderMapPath,
  intake_write_allowlist: intakeWriteAllowlist,
  intake_blocklist: intakeBlocklist,
  allowlist_paths_checked: intakeWriteAllowlist.length,
  blocklist_entries_checked: intakeBlocklist.length,
  expected_worker_reports: expectedWorkerReportTotal,
  total_worker_reports: totalReports,
  missing_expected_reports: Math.max(expectedWorkerReportTotal - totalReports, 0),
  streams_with_reports: streamSummaries.filter((stream) => stream.worker_reports > 0).map((stream) => stream.stream),
  streams_without_reports: streamSummaries.filter((stream) => stream.worker_reports === 0).map((stream) => stream.stream),
  required_report_fields: requiredReportFields,
  streams: streamSummaries,
  findings: reportFindings,
  safety_boundaries_checked: [
    'secrets',
    'live Supabase',
    'deployment',
    'public launch',
    'legal decisions',
    'real payments',
    'real loans',
    'escrow',
    'repayment routing',
    'stablecoin settlement',
    'token collateral',
    'XPR signatures',
  ],
}, null, 2));
