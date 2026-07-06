module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-worklets/plugin powers react-native-reanimated 4's worklets
    // and MUST be listed last. Without it, reanimated is broken in standalone
    // (release) builds — the app hangs on a black screen with the loader.
    plugins: ['react-native-worklets/plugin'],
  };
};
