
const fileReader = require('./fileReader');
const chalk = require('chalk');
const minimist = require('minimist');
const defaults = require("metro-config/src/defaults/defaults");
const inquirer = require('inquirer');
  
const log = console.log;

const isDirectoryUpdated = async (dir, lastKnownStatString) => {
    return new Promise(function(resolve) { 
        fileReader.getDirectoryStats(dir)
        .then(stats => {
            if (JSON.stringify(stats) === lastKnownStatString) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        })
        .catch(() => {
            resolve(true);
        });
    });
}

const moveAssets = () => {

}

module.exports = {
    isDirectoryUpdated,
    moveAssets,
}