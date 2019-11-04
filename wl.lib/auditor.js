const fileReader = require('./fileReader');
const chalk = require('chalk');
const minimist = require('minimist');
const defaults = require("metro-config/src/defaults/defaults");
const inquirer = require('inquirer');
  
const log = console.log;


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

const overrideWithNewConfigs = async (mask = '', wlConfigLastEditedTime, maskConfig) => {
    try {
        // generate configs
        const configs = getMetroDefaultsForMask(mask);

        // move assets

        // update native app connfigs

        // save changes to wl-config.lock.json 
        await fileReader.writeLockFile({ 
            mask: mask,
            version: '1.0.1',
            lib: 'react-native-white-label',
            originalMaskConfig: maskConfig,
            wlConfigLastEditedTime: wlConfigLastEditedTime,
            lockedTime: new Date().getTime(),
            metroConfig: configs,
        });
    }
    catch(e) {
        throw new Error(`App masking failed!`, e);
    }
}

module.exports = {
    getMetroDefaultsForMask,
    overrideWithNewConfigs,
}