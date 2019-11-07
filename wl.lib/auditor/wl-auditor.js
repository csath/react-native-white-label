const fileHandler = require('../fileHandler');
const defaults = require("metro-config/src/defaults/defaults");
const assetHandler = require('../assetsHandler');
const nativeInjector = require('../nativeInjector');

const getMetroDefaultsForMask = (mask = '')  => {
    const _getExtsForMask = (_mask, exts = []) => {
        if (!_mask) { return exts;}
        // setting up extension precedence and adding mask precedence as high beore defaults. eg: 'wl.js' > 'js'
        return ((f,xs) => xs.reduce((acc,x) => acc.concat(f(x)), []))(ext => [`${_mask}.${ext}`, ext], exts);
    }
    return ({
        resolver: {
            sourceExts: _getExtsForMask(mask, defaults.sourceExts),
        }
    })
};

const generateMaskingInternalConfigs = async (mask = '', wlConfigLastEditedTime, maskConfig) => {
    return new Promise(async function(reslove, reject) {
        try {
            // generate configs
            const configs = getMetroDefaultsForMask(mask);

            // save changes to wl-config.lock.json 
            await fileHandler.writeLockFile({ 
                mask: mask,
                version: '1.0.1',
                lib: 'react-native-white-label',
                maskConfig: maskConfig,
                wlConfigLastEditedTime: wlConfigLastEditedTime,
                lockedTime: new Date().getTime(),
                metroConfig: configs,
            });
    
            // move assets
            await assetHandler.moveAssets(maskConfig);
    
            // update native app connfigs
            await nativeInjector.init(maskConfig.nativeConfig || {});
    
            reslove();
        }
        catch(e) {
            reject(e);
        }
    });
}

module.exports = {
    getMetroDefaultsForMask,
    generateMaskingInternalConfigs,
}