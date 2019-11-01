/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const wlConfigs = require('./wl.config');

module.exports = {
  resolver: {
    sourceExts: wlConfigs.maskConfig.sourceExts,
    extraNodeModules: { ['rn-white-label'] : __dirname + '/wl.config.lock.js' }
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
