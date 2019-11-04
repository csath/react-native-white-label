const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const log = console.log;

const writeLockFile = async (fileContent = {}, fileName = 'wl-config.lock.json') => {  
    log(chalk.yellow(`Generating ${fileName} ...`));
    return new Promise(function(resolve) { 
        fs.writeJson(fileName, { ...fileContent }, { spaces: 2 }, err => {
            if (err) {
                log(chalk.red(`${fileName} update failed!`));
                resolve(false);
            }
            log(chalk.green(`${fileName} successfully updated!`));
            resolve(true);
        });
    })
};

const readLockFile = (fileName = 'wl-config.lock.json') => {
    return new Promise(function(resolve) {
        fs.readJson(`./${fileName}`, { spaces: 2 },(err, json) => {
            if (err) {
                resolve(null);
            }
            resolve(json);
        });
    });
}

const readFile = (fileName) => {
    return new Promise(function(resolve) {
        resolve(fs.readFileSync(fileName, 'utf8'));
    });
}

const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path)
    return stats.mtime;
}

const getDirectoryStats = (dir = '') => {
    return new Promise(function(resolve) {
        const directoryTree = walkSync(dir);
        resolve(directoryTree);
    });  
}

const walkSync = (dir) => {
    if (!fs.lstatSync(dir).isDirectory()) return ({ dir , modifiedTime: fs.statSync(dir).mtime });
    return fs.readdirSync(dir).map(f => {
        return walkSync(path.join(dir, f))
    });
}

module.exports = {
    writeLockFile,
    readLockFile,
    getFileUpdatedDate,
    readFile,
    getDirectoryStats,
    walkSync,
}