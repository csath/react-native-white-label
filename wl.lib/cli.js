const chalk = require('chalk');
const minimist = require('minimist');
const inquirer = require('inquirer');
const fileReader = require('./fileReader');
const auditor = require('./auditor');
const assetHandler = require('./assetHandler');

const log = console.log;

const readWlConfigsFile = () => {
    let wlConfigs = null;
    let wlConfigLastEditedTime = null;
    try {
        wlConfigs = require('../wl-config.js');
        wlConfigLastEditedTime = fileReader.getFileUpdatedDate('./wl-config.js');
    }
    catch(e) {
        log(chalk.red(`No wl-config.js found!`));
        log(chalk.yellow(`Masking config generation abort!`));
        process.kill(process.pid);
    }
    return ({ wlConfigs, wlConfigLastEditedTime });
}

const validateMaskArgsAgainstWlConfigs = (wlConfigs) => {
    // read argument list
    const mask = minimist(process.argv).m;

    if (mask && !wlConfigs.maskList.find(i => i.mask == mask)) {
        log(chalk.red(`No mask configs for '${(mask || '').toUpperCase()}' is defined in wl-config.js!`));
        log(chalk.yellow(`Masking config generation abort!`));
        process.kill(process.pid);
    }
    return mask;
}

const askQuestionToOverrideWlConfigs = async (mask = '') => {
    return new Promise(function (resolve) {
        const questions = [{
            type: 'confirm',
            default: false,
            name: 'shouldOverride',
            message: chalk.magenta(`Existing wl-config.lock doesn't match with the provided mask '${(mask || '').toUpperCase()}'. Do you want to override wl-config.lock with new configs for '${(mask || '').toUpperCase()}'?`),
        }];
        let shouldOverride = false;
        inquirer.prompt(questions)
        .then(answers => {
            shouldOverride = answers['shouldOverride'];
            resolve(shouldOverride);
        })
        .catch(e => {
            resolve(shouldOverride);
        });
    });
}

const askQuestionToDeleteAndReplaceWlConfigs = async (_maskName = '') => {
    return new Promise(function (resolve) {
        const questions = [{
            type: 'confirm',
            default: false,
            name: 'shouldDeleteLock',
            message: chalk.magenta(`Do you want to remove wl-config.lock and restart masking config generation for '${(_maskName || '').toUpperCase()}'(press Y/YES)\nor use exsisting lock configs (press N/NO)?`),
        }];
        let shouldDeleteLock = false;
        inquirer.prompt(questions)
        .then(answers => {
            shouldDeleteLock = answers['shouldDeleteLock'];
            resolve(shouldDeleteLock);
        })
        .catch(e => {
            resolve(shouldDeleteLock);
        });
    });
}

const init = async () => {
    try {
        log(chalk.yellow(`Initializing app masking cli...`));

        // read wl-configs content
        let { wlConfigs, wlConfigLastEditedTime } = readWlConfigsFile();

        // validate mask argument against wl-configs
        const mask = validateMaskArgsAgainstWlConfigs(wlConfigs);
        
        // get existing configs
        const exisitngLockConfigs = await fileReader.readLockFile();

        // if no previous configs found
        if (!exisitngLockConfigs) {
            let _maskName = mask || wlConfigs.defaultMask || (wlConfigs.maskList.length > 0 ? wlConfigs.maskList[0].mask : '');

            log(chalk.yellow(`No wl-config.lock found!`));
            log(chalk.yellow(`Restarting masking config generation for '${(_maskName || '').toUpperCase()}'...`));

            await auditor.overrideWithNewConfigs(_maskName, wlConfigLastEditedTime.getTime(), (wlConfigs.maskList || []).find(i => i.mask === _maskName));

            log(chalk.green(`Successfully rewired app masking configurations for '${(_maskName || '').toUpperCase()}'`));
        }
        // if previous configs found but have different masks
        else if (exisitngLockConfigs && mask && (mask != exisitngLockConfigs.mask)) {
            const shouldOverride = await askQuestionToOverrideWlConfigs(mask);

            if (shouldOverride) {
                await auditor.overrideWithNewConfigs(mask, wlConfigLastEditedTime.getTime(), (wlConfigs.maskList || []).find(i => i.mask === mask));

                log(chalk.green(`Successfully rewired app masking configurations for '${(mask || '').toUpperCase()}'`));
            }
            else {
                log(chalk.yellow(`Masking config generation abort! Running with exsisting lock configs for ${exisitngLockConfigs.mask}`));
            }
        }
        // if previous configs found but lock doesn't sync with wl-config.js lastEdited time
        else if (wlConfigLastEditedTime && (wlConfigLastEditedTime.getTime() != exisitngLockConfigs.wlConfigLastEditedTime)) {
            let _maskName = wlConfigs.defaultMask || (wlConfigs.maskList.length > 0 ? wlConfigs.maskList[0].mask : '');

            log(chalk.yellow(`wl-config.js has been updated and wl-config.lock doesn't synch with wl-config.js`));
            log(chalk.cyan(`wl-config.lock config for mask : ${(exisitngLockConfigs.mask || '').toUpperCase()}`));
            log(chalk.cyan(`wl-config.js default mask      : ${(_maskName || '').toUpperCase()}`));

            const shouldDeleteLock = await askQuestionToDeleteAndReplaceWlConfigs(_maskName);
            if (shouldDeleteLock) {
                await auditor.overrideWithNewConfigs(_maskName, wlConfigLastEditedTime.getTime(), (wlConfigs.maskList || []).find(i => i.mask === _maskName));
                log(chalk.green(`Successfully rewired app masking configurations for '${(_maskName || '').toUpperCase()}'!`));
            }
            else {
                log(chalk.green(`Configured to use existing wl-config.lock`));
                log(chalk.yellow(`Skipping masking config generation...`));

                await assetHandler.moveAssets(exisitngLockConfigs.maskConfig, exisitngLockConfigs.lastKnownAssetStatString);
            }
        }
        // if previous configs found
        else {
            log(chalk.green(`Existing wl-config.lock found!`));
            log(chalk.yellow(`Skipping masking config generation...`));

            await assetHandler.moveAssets(exisitngLockConfigs.maskConfig, exisitngLockConfigs.lastKnownAssetStatString);
        }
    }
    catch(e) {
        log(chalk.red(`App masking failed!\n\n`), chalk.yellow('More information: \n', e, '\n\n'));
        process.kill(process.pid);
    }
}

module.exports = (() => init())();
