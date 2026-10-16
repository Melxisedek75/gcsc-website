import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

test('keeps the standalone debug APK configuration in Expo source control', () => {
  const appConfig = readFileSync(join(process.cwd(), 'app.json'), 'utf8');

  assert.match(appConfig, /"\.\/plugins\/with-standalone-debug-apk"/);
});

test('embeds the JavaScript bundle in the installable debug APK', () => {
  const gradle = readFileSync(join(process.cwd(), 'android', 'app', 'build.gradle'), 'utf8');

  assert.match(gradle, /bundleCommand\s*=\s*"export:embed"/);
  assert.match(gradle, /debuggableVariants\s*=\s*\[\]/);
});
