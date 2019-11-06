const fileHandler = require('./filehandler');

const changeAndroidDisplayName = (displayName = 'chanaka') => {
    return new Promise(async function(resolve, reject) {
        try {
            // change app.json
            const appJson = await fileHandler.readJson(`./app.json`);
            fileHandler.writeJson({ ...appJson, displayName}, `./app.json`);

            // change ...res/values/strings.xml
            const xmlFilePath = `./android/app/src/main/res/values/strings.xml`;
            const file = await fileHandler.readFile(xmlFilePath);
            let updatedFile = (file || '').replace(`<string name="app_name">${appJson.displayName}</string>`, `<string name="app_name">${displayName}</string>`)
            await fileHandler.writeFile(updatedFile, xmlFilePath);
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

const resolveBundleIdentifiers = (newApplicationId = 'com.id.cd') => {
    return new Promise(async function(resolve, reject) {
        try {
            if (!newApplicationId) {
                reject("New Application Id cannot be null or empty");
            }

            // read android buid.gradle and get existing application ID
            const buildGradleFilePath = `./android/app/build.gradle`;

            const buildGralde = await fileHandler.readFile(buildGradleFilePath);
            const existingApplicationId = (/applicationId\s"(\S*)"/.exec(buildGralde || '') && (/applicationId\s"(\S*)"/.exec(buildGralde || '')[1]));
            
            if (!existingApplicationId) {
                reject("Couldn't find exisitng Application Id");
            }

            // update build.gradle application id to new one
            let updatedBuildGradle = (buildGralde || '').replace(/applicationId\s"(\S*)"/, `applicationId "${newApplicationId}"`);
            await fileHandler.writeFile(updatedBuildGradle, buildGradleFilePath);

            // update AndroidManifest.xml application id to new one
            const manifestFilePath = `./android/app/src/main/AndroidManifest.xml`;
            const manifestFile = await fileHandler.readFile(manifestFilePath);
            let updatedManifestFile = (manifestFile || '').replace(/package=\s*"(\S*)"/, `package="${newApplicationId}"`)
            await fileHandler.writeFile(updatedManifestFile, manifestFilePath);

            console.log(existingApplicationId)

            const javaBasePath = './android/app/src/main/java';
            const temFileCopyPath = `./android/app/src/main/java/temp-${new Date().getTime()}`;
            const newPackagePath = `${javaBasePath}/${newApplicationId.replace(/\./g, '/')}`;
            const existingPackagePath = `${javaBasePath}/${existingApplicationId.replace(/\./g, '/')}`;
            console.log(newPackagePath)
            console.log(existingPackagePath)
            await fileHandler.copyDirectory(existingPackagePath, temFileCopyPath);
            // await fileHandler.removeDirecotry(`./android/app/src/main/java/${existingPackagePath.split('.')[0]}`)
            await fileHandler.copyDirectory(temFileCopyPath, newPackagePath);

            // fileHandler.writeJson({ ...appJson, displayName}, `./app.json`);

            // // change ...res/values/strings.xml
            // const xmlFilePath = `${androidDir}/app/src/main/res/values/strings.xml`;
            // let file = await fileHandler.readFile(xmlFilePath);
            // let b = (file || '').replace(`<string name="app_name">${appJson.displayName}</string>`, `<string name="app_name">${displayName}</string>`)
            // await fileHandler.writeFile(b, xmlFilePath);
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

resolveBundleIdentifiers()
module.exports = {
    changeAndroidDisplayName,
    resolveBundleIdentifiers,
}