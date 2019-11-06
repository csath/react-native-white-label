const fileHandler = require('./filehandler');
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
            fileHandler.writeJson({ ...appJson, displayName}, `./app.json`);
            log(chalk.green('update successful! ./app.json'));

            // change ...res/values/strings.xml
            const xmlFilePath = `./android/app/src/main/res/values/strings.xml`;
            const file = await fileHandler.readFile(xmlFilePath);
            let updatedFile = (file || '').replace(`<string name="app_name">${appJson.displayName}</string>`, `<string name="app_name">${displayName}</string>`)
            await fileHandler.writeFile(updatedFile, xmlFilePath);
            log(chalk.green('update successful! ./android/app/src/main/res/values/strings.xml'));

            log(chalk.green('Android app display name update success!'));
            return resolve();
        }
        catch (e) {
            log(chalk.green('Android app display name update failed!'));
            return reject(e);
        }
    });
}

const resolveAndroidApplicationId = (newApplicationId = 'csa.csa.csa.csa.csa.csa.csa') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!newApplicationId) {
                log(chalk.red('New Application Id cannot be null or empty, Aborting...'));
                return reject('New Application Id cannot be null or empty');
            }
            log(chalk.yellow('Starting to change andorid application ID...'));
            log(chalk.yellow(`Found new application id: ${chalk.magenta(newApplicationId)}`));

            // read android buid.gradle and get existing application ID
            const buildGradleFilePath = `./android/app/build.gradle`;

            const buildGralde = await fileHandler.readFile(buildGradleFilePath);
            const existingApplicationId = (/applicationId\s"(\S*)"/.exec(buildGralde || '') && (/applicationId\s"(\S*)"/.exec(buildGralde || '')[1]));
            log(chalk.yellow(`Found exsisting application id: ${chalk.magenta(existingApplicationId)}`));
            
            if (!existingApplicationId) {
                log(chalk.red(`Couldn't find exisitng Application Id, Aborting...`));                
                return reject(`Couldn't find exisitng Application Id`);
            }

            // update build.gradle application id to new one
            let updatedBuildGradle = (buildGralde || '').replace(/applicationId\s"(\S*)"/, `applicationId "${newApplicationId}"`);
            await fileHandler.writeFile(updatedBuildGradle, buildGradleFilePath);
            log(chalk.cyan(`updated application ID in ${chalk.gray(buildGradleFilePath)}`));

            // update AndroidManifest.xml application id to new one
            const manifestFilePath = `./android/app/src/main/AndroidManifest.xml`;
            const manifestFile = await fileHandler.readFile(manifestFilePath);
            let updatedManifestFile = (manifestFile || '').replace(/package=\s*"(\S*)"/, `package="${newApplicationId}"`)
            await fileHandler.writeFile(updatedManifestFile, manifestFilePath);
            log(chalk.cyan(`updated application ID in ${chalk.gray(manifestFilePath)}`));

            // update MainActivity.java application id to new one
            const mainActivityJavaPath = `./android/app/src/main/java/${existingApplicationId.replace(/\./g, '/')}/MainActivity.java`;
            const mainActivityFile = await fileHandler.readFile(mainActivityJavaPath);
            let updatedMainActivityFile = (mainActivityFile || '').replace(/package\s*(\S*);/, `package ${newApplicationId};`)
            await fileHandler.writeFile(updatedMainActivityFile, mainActivityJavaPath);
            log(chalk.cyan(`updated application ID in ${chalk.gray(mainActivityJavaPath)}`));


            // update MainActivity.java application id to new one
            const mainApplicationJavaPath = `./android/app/src/main/java/${existingApplicationId.replace(/\./g, '/')}/MainApplication.java`;
            const mainApplicationFile = await fileHandler.readFile(mainApplicationJavaPath);
            let updatedMainApplicationFile = (mainApplicationFile || '').replace(/package\s*(\S*);/, `package ${newApplicationId};`)
            await fileHandler.writeFile(updatedMainApplicationFile, mainApplicationJavaPath);
            log(chalk.cyan(`updated application ID in ${chalk.gray(mainApplicationJavaPath)}`));

            // update BUCK application id to new one
            const buckPath = `./android/app/BUCK`;
            const buckFile = await fileHandler.readFile(buckPath);
            let updatedBuckFile = (buckFile || '').replace(/package\s*=\s*"(\S*)"/g, `package = "${newApplicationId}"`)
            await fileHandler.writeFile(updatedBuckFile, buckPath);
            log(chalk.cyan(`updated application ID in ${chalk.gray(buckPath)}`));

             // update java package path to match with application id
            const javaBasePath = './android/app/src/main/java';
            const temFileCopyPath = `./android/app/src/main/java/temp-${new Date().getTime()}`;
            const newPackagePath = `${javaBasePath}/${newApplicationId.replace(/\./g, '/')}`;
            const existingPackagePath = `${javaBasePath}/${existingApplicationId.replace(/\./g, '/')}`;

            await fileHandler.copyDirectory(existingPackagePath, temFileCopyPath);
            await fileHandler.removeDirecotry(`./android/app/src/main/java/${existingApplicationId.split('.')[0]}`)
            await fileHandler.copyDirectory(temFileCopyPath, newPackagePath);
            await fileHandler.removeDirecotry(temFileCopyPath);
            log(chalk.cyan(`updated android application package path to ${chalk.gray(newPackagePath)}`));

            log(chalk.green(`Andorid application ID update successful!`));
            return resolve();
        }
        catch (e) {
            return reject(e);
        }
    });
}
resolveAndroidApplicationId()
module.exports = {
    changeAndroidDisplayName,
    resolveAndroidApplicationId,
}