const fileHandler = require('../fileHandler');
const chalk = require('chalk');
const androidApplicationIdModule = require('./android/applicationId');
const androidDisplayNameModule = require('./android/displayName');
const iosBundleIdentifierModule = require('./ios/bundleIdentifier');
const iosDisplayNameModule = require('./ios/displayName');
const { execSync } = require('child_process');

const log = console.log;

const init = ({ androidApplicationId, iosBundleIdentifier, displayName, skip }) => {
    return new Promise(async function(resolve, reject) {
        try {
            if (skip) {
                return resolve(true);
            }
            log(chalk.yellow('Starting native app configurations...'));

            if (iosBundleIdentifier) {
                await iosBundleIdentifierModule.resolveIOSApplicationId(iosBundleIdentifier);
            }
            if (androidApplicationId) {
                await androidApplicationIdModule.resolveAndroidApplicationId(androidApplicationId);
            }
            if (displayName) {
                await iosDisplayNameModule.changeIosDisplayName(displayName);
                await androidDisplayNameModule.changeAndroidDisplayName(displayName);
                const appJson = await fileHandler.readJson(`./app.json`);
                fileHandler.writeJson({ ...appJson, displayName}, `./app.json`);
                log(chalk.cyan('update ./app.json successful!'));
            }

            if (process.platform != 'win32') {
                execSync('cd ios && pod install');
                execSync('cd android && ./gradlew clean');
            }
            else {
                execSync('cd android && ./gradlew clean');
            }
    
            return resolve();
        }
        catch (e) {
            log(chalk.red('Updating native app configurations failed!'));
            return reject(e);
        }
    });
}

module.exports = {
    init,
}