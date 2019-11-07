const fileHandler = require('../../filehandler');
const chalk = require('chalk');

const log = console.log;

const resolveIOSApplicationId = (newApplicationId = '') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!newApplicationId) {
                log(chalk.red('New Bundle Id cannot be null or empty, Aborting...'));
                return reject('New Bundle Id cannot be null or empty');
            }
            log(chalk.yellow('Starting to change ios bundle Identifier...'));
            log(chalk.yellow(`Found new bundle id: ${chalk.magenta(newApplicationId)}`));

            // read app name from app.json
            const appJson = await fileHandler.readJson(`./app.json`);

            // change .xcodeproj
            const xcodeprojPath = `./ios/${appJson.name}.xcodeproj/project.pbxproj`;
            const file = await fileHandler.readFile(xcodeprojPath);
            let updatedFile = (file || '').replace(/PRODUCT_BUNDLE_IDENTIFIER = ([^"]\S*);/g, `PRODUCT_BUNDLE_IDENTIFIER = ${newApplicationId};`)
            await fileHandler.writeFile(updatedFile, xcodeprojPath);
            log(chalk.cyan('update project.pbxproj successful!'));

            log(chalk.green('IOS app bundle identifier update success!'));
            return resolve();
        }
        catch (e) {
            log(chalk.red('IOS app bundle identifier update failed!'));
            return reject(e);
        }
    });
}

module.exports = {
    resolveIOSApplicationId,
}