const fileHandler = require('../../filehandler');
const chalk = require('chalk');

const log = console.log;

const changeIosDisplayName = (displayName = 'SUOE') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!displayName) {
                log(chalk.red('Display name cannot be null or empty, Aborting...'));
                return reject('Display name cannot be null or empty')
            }
            log(chalk.yellow('Starting to change ios app display name...'));

            // read app name from app.json
            const appJson = await fileHandler.readJson(`./app.json`);

            // change .xcodeproj
            const xcodeprojPath = `./ios/${appJson.name}.xcodeproj/project.pbxproj`;
            const file = await fileHandler.readFile(xcodeprojPath);
            let updatedFile1 = (file || '').replace(new RegExp(`PRODUCT_NAME = ${appJson.displayName}`, 'g'), `PRODUCT_NAME = ${displayName}`)
            let updatedFile2 = (updatedFile1 || '').replace(new RegExp(` ${appJson.displayName}.app `, 'g'), ` ${displayName}.app `)
            let updatedFile3 = (updatedFile2 || '').replace(new RegExp(`/${appJson.displayName}.app/${appJson.displayName}`, 'g'), `/${displayName}.app/${displayName}`)
            let updatedFile4 = (updatedFile3 || '').replace(new RegExp(`path = ${appJson.displayName}.app;`), `path = ${displayName}.app;`)
            await fileHandler.writeFile(updatedFile4, xcodeprojPath);
            log(chalk.cyan('update project.pbxproj successful!'));

            // change .xcscheme
            const xcschemePath = `./ios/${appJson.name}.xcodeproj/xcshareddata/xcschemes/${appJson.name}.xcscheme`;
            const xcschemeFile = await fileHandler.readFile(xcschemePath);
            let updatedFile = (xcschemeFile || '').replace(new RegExp(`${appJson.displayName}.app`, 'g'), `${displayName}.app`)
            await fileHandler.writeFile(updatedFile, xcschemePath);
            log(chalk.cyan('update .xcscheme successful!'));

            log(chalk.green('IOS app display name update success!'));
            return resolve();
        }
        catch (e) {
            log(chalk.red('IOS app display name update failed!'));
            return reject(e);
        }
    });
}

module.exports = {
    changeIosDisplayName,
}