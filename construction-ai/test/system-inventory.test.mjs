import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDirectory, '..', '..');

function expectInvalidInventoryCsv(rewrite, expectedMessage) {
  const csvPath = path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv');
  const originalCsv = fs.readFileSync(csvPath, 'utf8');

  try {
    fs.writeFileSync(csvPath, rewrite(originalCsv), 'utf8');
    const result = spawnSync(process.execPath, ['construction-ai/scripts/validate-system-inventory.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expectedMessage);
  } finally {
    fs.writeFileSync(csvPath, originalCsv, 'utf8');
  }
}

test('system inventory validator accepts the checked root-only inventory', () => {
  const output = execFileSync(
    process.execPath,
    ['construction-ai/scripts/validate-system-inventory.mjs'],
    { cwd: root, encoding: 'utf8' },
  );

  assert.match(output, /system_inventory_validation_passed/);
  assert.match(output, /tracked_root_only/);
  assert.match(output, /99f2838a5d80bf1c3c1b368c50bcb4a28ef41521/);
  assert.match(output, /baseline_root_dirty/);
});

test('inventory classifies a tracked token source as local source', () => {
  const csv = fs.readFileSync(
    path.join(root, 'docs', 'architecture', '2026-08-component-provenance.csv'),
    'utf8',
  );

  assert.match(csv, /^gcsctoken111,gcsctoken111,directory,LOCAL_SOURCE_VERIFIED,/m);
});

test('inventory rejects an untracked path with a non-external provenance state', () => {
  expectInvalidInventoryCsv(
    (csv) => `${csv}untracked-optional,untracked-optional,directory,EXTERNAL_STATE_UNVERIFIED,Must not pass without tracked source.\n`,
    /untracked path must be EXTERNAL_SOURCE_NOT_PRESENT/,
  );
});

test('inventory rejects an absolute component path', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory', 'gcscbuild11,C:\\outside,directory'),
    /path must be root-relative/,
  );
});

test('inventory rejects parent-directory traversal', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory', 'gcscbuild11,../outside,directory'),
    /path must be root-relative/,
  );
});

test('inventory rejects an unknown provenance state', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.replace('gcscbuild11,gcscbuild11,directory,EXTERNAL_SOURCE_NOT_PRESENT', 'gcscbuild11,gcscbuild11,directory,UNKNOWN_STATE'),
    /unsupported provenance state/,
  );
});

test('inventory rejects a missing required component', () => {
  expectInvalidInventoryCsv(
    (csv) => csv.split('\n').filter((line) => !line.startsWith('gcscbuild11,')).join('\n'),
    /required component is missing or misclassified: gcscbuild11/,
  );
});

test('inventory rejects an untracked local-source claim', () => {
  expectInvalidInventoryCsv(
    (csv) => `${csv}untracked-local,untracked-local,directory,LOCAL_SOURCE_VERIFIED,Must not claim untracked source.\n`,
    /untracked path must be EXTERNAL_SOURCE_NOT_PRESENT/,
  );
});
