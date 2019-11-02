/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { mergeConfig } = require("metro-config");
const wlConfigs = require('./wl.lib/config').metroConfig;

const defaultConfigs = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfigs, wlConfigs);