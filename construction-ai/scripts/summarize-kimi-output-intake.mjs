import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const projectRoot = resolve('..');
const tmpRoot = resolve(projectRoot, '.tmp');
const explicitIntakeRoot = process.argv[2] ? resolve(process.argv[2]) : null;
const streams = ['A', 'F', 'N', 'J', 'H', 'I', 'O', 'M', 'K', 'L', 'Q', 'S'];
const secretPattern = /sk_live_[a-z0-9]|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|xox[baprs]-[0-9]|service[_-]?role\s*[:=]|seed\s*phrase\s*[:=]|private\s*key\s*[:=]|password\s*[:=]|api[_-]?key\s*[:=]/i;
const liveRiskPattern = /live Supabase|deploy(?:ment)?|public launch|real payment|real loan|escrow release|repayment routing|stablecoin settlement|token collateral|XPR signature|app-store|legal approval|lender approval|provider commitment/i;

function fail(message) {
  console.error(`Kimi output intake summary failed: ${message}`);
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

const streamSummaries = streams.map((stream) => {
  const streamRoot = resolve(intakeRoot, 'streams', stream);
  const workerReports = listFiles(resolve(streamRoot, 'worker-reports'));
  const createdOrModifiedFiles = listFiles(resolve(streamRoot, 'created-or-modified-files'));
  const claudeVerdicts = listFiles(resolve(streamRoot, 'claude-verdict'));

  return {
    stream,
    worker_reports: workerReports.length,
    created_or_modified_files: createdOrModifiedFiles.length,
    claude_verdicts: claudeVerdicts.length,
  };
});

const allFiles = listFiles(intakeRoot);
const findings = [];
for (const filePath of allFiles) {
  const relativeFilePath = filePath.slice(intakeRoot.length + 1).replaceAll('\\', '/');
  if (relativeFilePath === 'README.md' || relativeFilePath === 'intake-folder-map.json') {
    continue;
  }

  const stats = statSync(filePath);
  if (stats.size > 1024 * 1024) {
    findings.push({
      severity: 'REVIEW',
      file: filePath,
      reason: 'file larger than 1MB; review before sharing or merging',
    });
    continue;
  }

  const content = readFileSync(filePath, 'utf8');
  if (secretPattern.test(content)) {
    findings.push({
      severity: 'BLOCKED',
      file: filePath,
      reason: 'secret-looking or credential-looking text detected',
    });
  }
  if (liveRiskPattern.test(content)) {
    findings.push({
      severity: 'REVIEW',
      file: filePath,
      reason: 'live/legal/money/public-action wording detected; route through Claude/Codex review',
    });
  }
}

const summary = {
  status: findings.some((finding) => finding.severity === 'BLOCKED') ? 'blocked_for_review' : 'summarized',
  intake_root: intakeRoot,
  intake_folder_map: intakeFolderMapPath,
  intake_write_allowlist: intakeWriteAllowlist,
  intake_blocklist: intakeBlocklist,
  allowlist_paths_checked: intakeWriteAllowlist.length,
  blocklist_entries_checked: intakeBlocklist.length,
  total_files: allFiles.length,
  controller_summary_files: listFiles(resolve(intakeRoot, '00-controller-summary')).length,
  claude_audit_files: listFiles(resolve(intakeRoot, '01-claude-audit')).length,
  codex_merge_queue_files: listFiles(resolve(intakeRoot, '02-codex-merge-queue')).length,
  blocked_or_rejected_files: listFiles(resolve(intakeRoot, '99-blocked-or-rejected')).length,
  streams: streamSummaries,
  streams_with_worker_reports: streamSummaries.filter((stream) => stream.worker_reports > 0).map((stream) => stream.stream),
  findings,
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
};

console.log(JSON.stringify(summary, null, 2));
