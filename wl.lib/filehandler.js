const fs = require('fs-extra');
const path = require('path');

const writeLockFile = async (fileContent = {}, fileName = 'wl-config.lock.json') => {  
    return new Promise(function(resolve) { 
        fs.writeJson(fileName, { ...fileContent }, { spaces: 2 }, err => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        });
    })
};

const readLockFile = async (fileName = 'wl-config.lock.json') => {
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

const readJson = (fileName) => {
    return new Promise(function(resolve) {
        resolve(fs.readJSONSync(fileName));
    });
}

const writeJson = async (fileContent = {}, fileName = '') => {  
    return new Promise(function(resolve) { 
        fs.writeJson(fileName, { ...fileContent }, { spaces: 2 }, err => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        });
    })
};

const writeFile = async (fileContent, fileName = '') => {  
    return new Promise(function(resolve) { 
        fs.writeFile(fileName, fileContent, err => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        });
    })
};


const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path)
    return stats.mtime;
}

const getDirectoryStats = (dir = '') => {
    return walkSync(dir);
}

const walkSync = (dir) => {
    if (!fs.lstatSync(dir).isDirectory()) return ({ dir , modifiedTime: fs.statSync(dir).mtime });
    return fs.readdirSync(dir).map(f => {
        return walkSync(path.join(dir, f))
    });
}

const copyDirectory = async (from, to, filter) => {
    return new Promise(function (resolve, reject) {
        try {
            const res = fs.copySync(from, to, { filter: filter, errorOnExist: true, overwrite: true });
            resolve(res);
        }
        catch (e) {
            reject(e);
        }
    });
}

const isDirectory = (dir) => {
    return fs.lstatSync(dir).isDirectory();
}

const removeDirecotry = (dir) => {
    return new Promise(function (resolve, reject) {
        fs.remove(dir, err => {
            if (err) reject(err)
            resolve();
        });
    });
}

const updateLockFile = async (key, value, fileName) => {
    return new Promise(async function(resolve) { 
        try {
            const obj = await readLockFile(fileName);
            obj[key] = value;
            await writeLockFile(obj, fileName);
            resolve(true);
        }
        catch (e) {
            resolve(false);
        }
    });
}

const replaceFilesInDirWithMask = (dir, mask) => {
    if (!fs.lstatSync(dir).isDirectory()) {
        const subExt = ((/.+\.([^\.]+)\./.exec(dir)) && (/.+\.([^\.]+)\./.exec(dir)[1]));
        if (subExt === mask) {
            fs.renameSync(dir, dir.replace(/(.+)(\.[^\.]+)(\.[^.]+)/, (match, p1, p2, p3) => `${p1}${p3}`));
            return;
        }
        return;
    }
    fs.readdirSync(dir).forEach(f => {
        replaceFilesInDirWithMask(path.join(dir, f), mask);
    });
}

const isDirectoryExsists = (dir) => {
    return fs.existsSync(dir);
}

module.exports = {
    writeLockFile,
    readLockFile,
    getFileUpdatedDate,
    readFile,
    getDirectoryStats,
    walkSync,
    copyDirectory,
    isDirectory,
    removeDirecotry,
    updateLockFile,
    replaceFilesInDirWithMask,
    isDirectoryExsists,
    readJson,
    writeJson,
    writeFile,
}