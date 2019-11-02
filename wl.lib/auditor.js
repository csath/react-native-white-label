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
        sourceExts: _getExtsForMask(mask, defaults.sourceExts),
    })
};

const overrideWithNewConfigs = async (mask = '', wlConfigLastEditedTime) => {
    try {
        // generate configs
        const configs = getMetroDefaultsForMask(mask);

        // move assets

        // update native app connfigs

        // save changes to wl-config.lock.json 
        await fileReader.writeLockFile({ 
            mask: mask,
            metroConfig: configs,
            wlConfigLastEditedTime: wlConfigLastEditedTime,
            lastUpdatedTimestamp: new Date().toISOString() 
        });
    }
    catch(e) {
        throw new Error(`App masking failed!`);
    }
}

module.exports = {
    getMetroDefaultsForMask,
    overrideWithNewConfigs,
}