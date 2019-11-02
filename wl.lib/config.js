const existingConfigs = require('../wl-config.lock.json');
const defaults = require('metro-config/src/defaults/defaults');

module.exports = {
    ...(existingConfigs || {}),
    metroConfig: {
        resolver: {
            sourceExts: existingConfigs && existingConfigs.metroConfig && existingConfigs.metroConfig.sourceExts ? existingConfigs.metroConfig.sourceExts : defaults.sourceExts,
            extraNodeModules: { ['react-native-white-label']: __dirname + '/wl.lib/config.js' }
        },
    },
}