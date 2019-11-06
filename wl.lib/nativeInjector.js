const fileHandler = require('./filehandler');
const chalk = require('chalk');

const log = console.log;

const changeAndroidDisplayName = (displayName = '') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!displayName) {
                reject('Display name cannot be null or empty')
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
            resolve();
        }
        catch (e) {
            log(chalk.green('Android app display name update failed!'));
            reject(e);
        }
    });
}

const resolveAndroidApplicationId = (newApplicationId = '') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!newApplicationId) {
                reject('New Application Id cannot be null or empty');
            }
            log(chalk.yellow('Starting to change andorid application ID...'));

            // read android buid.gradle and get existing application ID
            const buildGradleFilePath = `./android/app/build.gradle`;

            const buildGralde = await fileHandler.readFile(buildGradleFilePath);
            const existingApplicationId = (/applicationId\s"(\S*)"/.exec(buildGralde || '') && (/applicationId\s"(\S*)"/.exec(buildGralde || '')[1]));
            log(chalk.yellow(`Found exsisting application id: ${existingApplicationId}`));
            
            if (!existingApplicationId) {
                reject(`Couldn't find exisitng Application Id`);
            }

            // update build.gradle application id to new one
            let updatedBuildGradle = (buildGralde || '').replace(/applicationId\s"(\S*)"/, `applicationId "${newApplicationId}"`);
            await fileHandler.writeFile(updatedBuildGradle, buildGradleFilePath);
            log(chalk.green(`update application id in ${buildGradleFilePath} success!`));

            // update AndroidManifest.xml application id to new one
            const manifestFilePath = `./android/app/src/main/AndroidManifest.xml`;
            const manifestFile = await fileHandler.readFile(manifestFilePath);
            let updatedManifestFile = (manifestFile || '').replace(/package=\s*"(\S*)"/, `package="${newApplicationId}"`)
            await fileHandler.writeFile(updatedManifestFile, manifestFilePath);
            log(chalk.green(`update application id in ${manifestFilePath} success!`));

            // update MainActivity.java application id to new one
            const mainActivityJavaPath = `./android/app/src/main/${existingApplicationId.replace(/\./g, '/')}/MainActivity.java`;
            const mainActivityFile = await fileHandler.readFile(mainActivityJavaPath);
            let updatedMainActivityFile = (mainActivityFile || '').replace(/package\s*(\S*);/, `package ${newApplicationId};`)
            await fileHandler.writeFile(updatedMainActivityFile, mainActivityJavaPath);
            log(chalk.green(`update application id in ${mainActivityJavaPath} success!`));


            // update MainActivity.java application id to new one
            const mainApplicationJavaPath = `./android/app/src/main/${existingApplicationId.replace(/\./g, '/')}/MainApplication.java`;
            const mainApplicationFile = await fileHandler.readFile(mainApplicationJavaPath);
            let updatedMainApplicationFile = (mainApplicationFile || '').replace(/package\s*(\S*);/, `package ${newApplicationId};`)
            await fileHandler.writeFile(updatedMainApplicationFile, mainApplicationJavaPath);
            log(chalk.green(`update application id in ${mainApplicationJavaPath} success!`));

            // update BUCK application id to new one
            const buckPath = `./android/app/BUCK`;
            const buckFile = await fileHandler.readFile(buckPath);
            let updatedBuckFile = (buckFile || '').replace(/package\s*=\s*"(\S*)"/g, `package = "${newApplicationId}"`)
            await fileHandler.writeFile(updatedBuckFile, buckPath);
            log(chalk.green(`update application id in ${buckPath} success!`));

             // update java package path to match with application id
            const javaBasePath = './android/app/src/main/java';
            const temFileCopyPath = `./android/app/src/main/java/temp-${new Date().getTime()}`;
            const newPackagePath = `${javaBasePath}/${newApplicationId.replace(/\./g, '/')}`;
            const existingPackagePath = `${javaBasePath}/${existingApplicationId.replace(/\./g, '/')}`;

            await fileHandler.copyDirectory(existingPackagePath, temFileCopyPath);
            await fileHandler.removeDirecotry(`./android/app/src/main/java/${existingApplicationId.split('.')[0]}`)
            await fileHandler.copyDirectory(temFileCopyPath, newPackagePath);
            await fileHandler.removeDirecotry(temFileCopyPath);
            log(chalk.green(`update android application package path to ${newPackagePath} success!`));

            log(chalk.green(`Andorid application ID update successful!`));
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    changeAndroidDisplayName,
    resolveAndroidApplicationId,
}