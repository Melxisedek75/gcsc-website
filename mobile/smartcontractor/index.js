// Custom entry point: install crypto/Buffer polyfills BEFORE the app (and its
// @proton/signing-request + elliptic imports) load. Expo Go bundles these
// polyfills implicitly; a standalone Hermes build does not, so without this the
// wallet/crypto modules throw at load and the app hangs on a black screen.
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Load the real Expo Router entry only after polyfills are in place.
require('expo-router/entry');
