const fileHandlerHelper = require('./filehandleHelper');

module.exports = {
    copyDirectory: fileHandlerHelper.copyDirectory,
    getDirectoryStats: fileHandlerHelper.getDirectoryStats,
    getFileUpdatedDate: fileHandlerHelper.getFileUpdatedDate,
    isDirectory: fileHandlerHelper.isDirectory,
    isDirectoryExsists: fileHandlerHelper.isDirectoryExsists,
    readFile: fileHandlerHelper.readFile,
    readJson: fileHandlerHelper.readJson,
    readLockFile: fileHandlerHelper.readLockFile,
    removeDirecotry: fileHandlerHelper.removeDirecotry,
    replaceFilesInDirWithMask: fileHandlerHelper.replaceFilesInDirWithMask,
    updateLockFile: fileHandlerHelper.updateLockFile,
    walkSync: fileHandlerHelper.walkSync,
    writeFile: fileHandlerHelper.writeFile,
    writeJson: fileHandlerHelper.writeJson,
    writeLockFile: fileHandlerHelper.writeLockFile,
}