
const filehandler = require('../fileHandler');
const chalk = require('chalk');
const inquirer = require('inquirer');

const log = console.log;

const isDirectoryUpdated = (dirArr = [], lastKnownStatString) => {
    const stats = dirArr.map(i => filehandler.getDirectoryStats(i.sourceDri));
    if (JSON.stringify(stats) === lastKnownStatString) {
        return false;
    }
    else {
        return true;
    }
}

const moveAssets = async (maskConfigObj, lastKnownAssetStatString) => {
    return new Promise(async function (resolve) {
        try {
            if (!maskConfigObj.dirCopy || (maskConfigObj.dirCopy || []).length === 0) {
                return resolve();
            }
            if (lastKnownAssetStatString && !isDirectoryUpdated(maskConfigObj.dirCopy , lastKnownAssetStatString)) {
                log(chalk.green('Assets are already synced!'));
                return resolve();
            }
            if (maskConfigObj.dirCopy.find(i => (i.sourceDri && !i.destinationDri))) {
                log(chalk.red(`dirCopy in wl-configs.js for mask ${(maskConfigObj.mask || '').toUpperCase()} is missing 'destinationDri' or 'sourceDri' property`));
                process.kill(process.pid);
            }
    
            log(chalk.yellow(`Starting to move assets from for ${(maskConfigObj.mask || '').toUpperCase()}`));
            
            await Promise.all([ ...maskConfigObj.dirCopy.filter(i => (i.sourceDri && i.destinationDri)).map(e => _driCopyHelper(e, maskConfigObj.mask))]);

            await filehandler.updateLockFile('lastKnownAssetStatString', maskConfigObj.dirCopy ? JSON.stringify(maskConfigObj.dirCopy.map(i => filehandler.getDirectoryStats(i.sourceDri))) : '');
    
            log(chalk.green(`Assets sync success`));
            return resolve();
        }
        catch (e) {
            log(chalk.red(`Moving assets for mask ${(maskConfigObj.mask || '').toUpperCase()} config failed!`));
            process.kill(process.pid);
        }
    });
}

const _driCopyHelper = async (dirCopyObj, mask) => {
    return new Promise(async function (resolve, reject) {
        try {
            if (!dirCopyObj.sourceDri || !dirCopyObj.destinationDri) {
                return resolve();
            }
            else {
                if (dirCopyObj.overwrite) {
                    await filehandler.removeDirecotry(dirCopyObj.destinationDri);
                }
                await filehandler.copyDirectory(dirCopyObj.sourceDri, dirCopyObj.destinationDri, _filterFilesFromFileExtention.bind(null, (mask || '')));
                filehandler.replaceFilesInDirWithMask(dirCopyObj.destinationDri, (mask || ''));
                return resolve();
            }
        }
        catch (e) {
            return reject(e);
        }
    });
}

const _filterFilesFromFileExtention = (mask, src) => {
    if (filehandler.isDirectory(src)) {
        return true;
    }
    const subExt = ((/.+\.([^\.]+)\./.exec(src)) && (/.+\.([^\.]+)\./.exec(src)[1]));

    if (!subExt) {
        return true;
    }
    if ((subExt === mask) || (subExt === 'android') || (subExt === 'ios') || subExt.includes('/')) {
        return true;
    }
    return false;
}

const dirUnLinkHelper = (configs = [], currentConfig) => {
    return new Promise(async function(resolve) {
        const currentDestinations = (currentConfig.dirCopy || []).map(j => (j.destinationDri || ''));
        const flattenAllDestinations = configs.reduce((acc, i) => acc.concat((i.dirCopy || []).map(j => (j.destinationDri || ''))), []);
        const filteredDestinations = flattenAllDestinations.filter(i => !currentDestinations.find(k => k.startsWith(i))).filter(j => filehandler.isDirectoryExsists(j));
        
        const questions = filteredDestinations.map((i, index) => ({
            type: 'confirm',
            default: false,
            name: `shouldDelete${index}`,
            message: chalk.yellow(`Do you want to delete '${i}' ?`),
        }));

        inquirer.prompt(questions)
        .then(answers => {
            const shouldDelete = [];
            const notDelete = [];
            filteredDestinations.forEach((i, index) => {
                if (answers[`shouldDelete${index}`]) {
                    shouldDelete.push(i);
                }
                else {
                    notDelete.push(i);
                }
            });

            (shouldDelete.length > 0) && log(chalk.red(`Deleting...`));
            shouldDelete.forEach(async i => {
                log(chalk.red(i));
                await filehandler.removeDirecotry(i);
            });
            (notDelete.length > 0) && log(chalk.green(`Skipping...\n${notDelete.join('\n')}`));
            resolve(shouldOverride);
        })
        .catch(e => {
            resolve(e);
        })
        .finally(() => {
            resolve();
        });
    });
}

module.exports = {
    isDirectoryUpdated,
    moveAssets,
    dirUnLinkHelper,
}