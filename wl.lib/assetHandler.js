
const fileReader = require('./fileReader');
const chalk = require('chalk');

const log = console.log;

const isDirectoryUpdated = (dir, lastKnownStatString) => {
    const stats = fileReader.getDirectoryStats(dir);
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
            if (lastKnownAssetStatString && !isDirectoryUpdated(maskConfigObj.assetsDirIn , lastKnownAssetStatString)) {
                log(chalk.green('Assets are already synced!'));
                resolve();
            }
            if (!maskConfigObj.assetsDirIn) {
                resolve();
            }
            if (maskConfigObj.assetsDirIn && !maskConfigObj.assetsDirOut) {
                log(chalk.red(`Directory to copy assets 'assetsDirOut' is not specified in wl-configs.js for mask ${(maskConfigObj.mask || '').toUpperCase()}`));
                process.kill(process.pid);
            }
    
            log(chalk.yellow(`Starting to move assets from '${maskConfigObj.assetsDirIn}' to '${maskConfigObj.assetsDirOut}' for ${(maskConfigObj.mask || '').toUpperCase()}`));
            
            await fileReader.removeDirecotry(maskConfigObj.assetsDirOut);
            await fileReader.copyDirectory(maskConfigObj.assetsDirIn, maskConfigObj.assetsDirOut, _filterFilesFromFileExtention.bind(null, (maskConfigObj.mask || '')));
            fileReader.replaceFilesInDirWithMask(maskConfigObj.assetsDirOut, (maskConfigObj.mask || ''));
            await fileReader.updateLockFile('lastKnownAssetStatString', maskConfigObj.assetsDirIn ? JSON.stringify(fileReader.getDirectoryStats(maskConfigObj.assetsDirIn)) : '');
    
            log(chalk.green(`Assets synced successfully!`));
            resolve();
        }
        catch (e) {
            log(chalk.red(`Moving assets for mask ${(maskConfigObj.mask || '').toUpperCase()} config failed!`));
            process.kill(process.pid);
        }
    });
}

const _filterFilesFromFileExtention = (mask, src) => {
    if (fileReader.isDirectory(src)) {
        return true;
    }
    const subExt = ((/.+\.([^\.]+)\./.exec(src)) && (/.+\.([^\.]+)\./.exec(src)[1]));

    if (!subExt) {
        return true;
    }
    if (subExt === mask) {
        return true;
    }
    return false;
}

module.exports = {
    isDirectoryUpdated,
    moveAssets,
}