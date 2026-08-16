import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDirectory, '..', '..');

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
