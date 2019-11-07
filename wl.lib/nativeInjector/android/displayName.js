const fileHandler = require('../../filehandler');
const chalk = require('chalk');

const log = console.log;

const changeAndroidDisplayName = (displayName = '') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!displayName) {
                log(chalk.red('Display name cannot be null or empty, Aborting...'));
                return reject('Display name cannot be null or empty')
            }
            log(chalk.yellow('Starting to change andorid app display name...'));

            // change app.json
            const appJson = await fileHandler.readJson(`./app.json`);

            // change ...res/values/strings.xml
            const xmlFilePath = `./android/app/src/main/res/values/strings.xml`;
            const file = await fileHandler.readFile(xmlFilePath);
            let updatedFile = (file || '').replace(`<string name="app_name">${appJson.displayName}</string>`, `<string name="app_name">${displayName}</string>`)
            await fileHandler.writeFile(updatedFile, xmlFilePath);
            log(chalk.green('update ./android/app/src/main/res/values/strings.xml successful!'));

            log(chalk.green('Android app display name update success!'));
            return resolve();
        }
        catch (e) {
            log(chalk.red('Android app display name update failed!'));
            return reject(e);
        }
    });
}

module.exports = {
    changeAndroidDisplayName,
}