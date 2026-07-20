import { existsSync, readFileSync } from 'node:fs';

function fail(message) {
  console.error(`SmartContractor Android wrapper generation failed: ${message}`);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing required file: ${path}`);
  return readFileSync(path, 'utf8');
}

const requiredFiles = [
  'android/settings.gradle',
  'android/build.gradle',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/java/com/gcsc/smartcontractor/MainActivity.java',
  'android/app/src/main/assets/capacitor.config.json',
  'android/app/src/main/assets/public/smartcontractor.html',
  'android/app/src/main/assets/public/manifest.webmanifest',
  'android/app/src/main/assets/public/service-worker.js',
];

for (const file of requiredFiles) {
  read(file);
}

const appBuild = read('android/app/build.gradle');
if (!appBuild.includes('namespace = "com.gcsc.smartcontractor"') && !appBuild.includes('namespace "com.gcsc.smartcontractor"')) {
  fail('Android app namespace must stay com.gcsc.smartcontractor');
}
if (!appBuild.includes('applicationId "com.gcsc.smartcontractor"')) {
  fail('Android applicationId must stay com.gcsc.smartcontractor');
}

const mainActivity = read('android/app/src/main/java/com/gcsc/smartcontractor/MainActivity.java');
if (!mainActivity.includes('extends BridgeActivity')) {
  fail('MainActivity must extend Capacitor BridgeActivity');
}

const bundledConfig = read('android/app/src/main/assets/capacitor.config.json');
if (!bundledConfig.includes('"appId": "com.gcsc.smartcontractor"')) {
  fail('Bundled Capacitor config must keep SmartContractor appId');
}
if (!bundledConfig.includes('"webDir": "public"')) {
  fail('Bundled Capacitor config must keep public webDir');
}

const bundledPublicFiles = [
  'android/app/src/main/assets/public/smartcontractor.html',
  'android/app/src/main/assets/public/manifest.webmanifest',
  'android/app/src/main/assets/public/service-worker.js',
  'android/app/src/main/assets/public/offline.html',
];
// Match actual secret MATERIAL, not safety copy mentioning the words —
// keep in sync with validate-android-wrapper-preflight.mjs.
const secretLike = new RegExp(
  [
    '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'sk_live_[a-zA-Z0-9]{8,}',
    'eyJ[A-Za-z0-9_-]{20,}\\.[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}',
    '(service[_-]?role[_-]?key|private[_-]?key|seed[_ -]phrase|(db|database)[_ -]password)["\']?\\s*[:=]\\s*["\']?[A-Za-z0-9+/_-]{12,}',
  ].join('|'),
  'i'
);
for (const file of bundledPublicFiles) {
  const content = read(file);
  if (secretLike.test(content)) {
    fail(`Bundled Android public asset contains forbidden secret-like wording: ${file}`);
  }
}

console.log(JSON.stringify({
  status: 'passed',
  wrapper: 'android',
  app_id: 'com.gcsc.smartcontractor',
  public_assets_checked: bundledPublicFiles.length,
}, null, 2));
