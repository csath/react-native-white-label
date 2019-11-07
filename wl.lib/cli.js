const chalk = require('chalk');
const minimist = require('minimist');
const inquirer = require('inquirer');
const fileHandler = require('./filehandler');
const auditor = require('./auditor');
const assetHandler = require('./assetsHandler');

const log = console.log;

const readWlConfigsFile = () => {
    let wlConfigs = null;
    let wlConfigLastEditedTime = null;
    try {
        wlConfigs = require('../wl-config.js');
        wlConfigLastEditedTime = fileHandler.getFileUpdatedDate('./wl-config.js');
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
            message: chalk.magenta(`Do you want to remove wl-config.lock and restart masking config generation for '${(_maskName || '').toUpperCase()}'?`),
        }];
        let shouldDeleteLock = false;
        inquirer.prompt(questions)
        .then(answers => {
            shouldDeleteLock = answers['shouldDeleteLock'];
            !shouldDeleteLock && chalk.yellow(`using existing remove wl-config.lock configs...`),
            resolve(shouldDeleteLock);
        })
        .catch(e => {
            resolve(shouldDeleteLock);
        });
    });
}

const printLogo = () => {
    log(chalk.cyan.bold(`\n##################################################`));
    log(chalk.cyan.bold(`#####  ####################################  #####`));
    log(chalk.cyan.bold(`######  #####      MASKING  CLI     ######  ######`));
    log(chalk.cyan.bold(`#######  #####     ------------    ######  #######`));
    log(chalk.cyan.bold(`########  ##############################  ########`));
    log(chalk.cyan.bold(`##################################################`));
}

const printExitLogo = () => {
    log(chalk.gray.bold(`\n##################################################`));
    log(chalk.gray.bold(`###########  SHUTTING DOWN MASKING CLI  ##########`));
    log(chalk.gray.bold(`##################################################\n`));
}

const init = async () => {
    try {
        printLogo();
        log(chalk.yellow(`\nInitializing masking cli...`));

        let runningMask = '';
        let shouldRunDirUnlink = false;

        // read wl-configs content
        let { wlConfigs, wlConfigLastEditedTime } = readWlConfigsFile();

        // validate mask argument against wl-configs
        const mask = validateMaskArgsAgainstWlConfigs(wlConfigs);
        
        // get existing configs
        const exisitngLockConfigs = await fileHandler.readLockFile();

        // if no previous configs found
        if (!exisitngLockConfigs) {
            let _maskName = mask || wlConfigs.defaultMask || (wlConfigs.maskList.length > 0 ? wlConfigs.maskList[0].mask : '');

            log(chalk.yellow(`No wl-config.lock found!\nRestarting masking config generation for '${(_maskName || '').toUpperCase()}'...`));

            runningMask = (wlConfigs.maskList || []).find(i => i.mask === _maskName);
            shouldRunDirUnlink = true;
            await auditor.generateMaskingInternalConfigs(_maskName, wlConfigLastEditedTime.getTime(), runningMask);

            log(chalk.green(`Successfully rewired app masking configurations for '${(_maskName || '').toUpperCase()}'`));
        }
        // if previous configs found but have different masks
        else if (exisitngLockConfigs && mask && (mask != exisitngLockConfigs.mask)) {
            const shouldOverride = await askQuestionToOverrideWlConfigs(mask);

            if (shouldOverride) {
                runningMask = (wlConfigs.maskList || []).find(i => i.mask === mask);
                shouldRunDirUnlink = true;
                await auditor.generateMaskingInternalConfigs(mask, wlConfigLastEditedTime.getTime(), runningMask);

                log(chalk.green(`Successfully rewired app masking configurations for '${(mask || '').toUpperCase()}'`));
            }
            else {
                runningMask = exisitngLockConfigs.maskConfig;
                log(chalk.yellow(`Masking config generation abort! Running with exsisting lock configs for ${exisitngLockConfigs.mask}`));
            }
        }
        // if previous configs found but lock doesn't sync with wl-config.js lastEdited time
        else if (wlConfigLastEditedTime && (wlConfigLastEditedTime.getTime() != exisitngLockConfigs.wlConfigLastEditedTime)) {
            let _maskName = wlConfigs.defaultMask || (wlConfigs.maskList.length > 0 ? wlConfigs.maskList[0].mask : '');

            log(chalk.yellow(`wl-config.js has been updated and wl-config.lock doesn't synch with wl-config.js`));
            log(chalk.cyan(`Info:\n\twl-config.lock config for mask : ${(exisitngLockConfigs.mask || '').toUpperCase()}\n\twl-config.js default mask      : ${(_maskName || '').toUpperCase()}\n`));

            const shouldDeleteLock = await askQuestionToDeleteAndReplaceWlConfigs(_maskName);

            if (shouldDeleteLock) {
                runningMask = (wlConfigs.maskList || []).find(i => i.mask === _maskName);
                shouldRunDirUnlink = true;
                await auditor.generateMaskingInternalConfigs(_maskName, wlConfigLastEditedTime.getTime(), runningMask);
                
                log(chalk.green(`Successfully rewired app masking configurations for '${(_maskName || '').toUpperCase()}'!`));
            }
            else {
                log(chalk.yellow(`Masking config generation abort! Running with exsisting lock configs for ${exisitngLockConfigs.mask}`));
                
                runningMask = exisitngLockConfigs.maskConfig;
                await assetHandler.moveAssets(exisitngLockConfigs.maskConfig, exisitngLockConfigs.lastKnownAssetStatString);
            }
        }
        // if previous configs found
        else {
            log(chalk.yellow(`Existing wl-config.lock found!\nSkipping masking config generation...`));
            
            runningMask = exisitngLockConfigs.maskConfig;
            await assetHandler.moveAssets(exisitngLockConfigs.maskConfig, exisitngLockConfigs.lastKnownAssetStatString);
        }
        
        wlConfigs.promptDirUnlink && shouldRunDirUnlink && await assetHandler.dirUnLinkHelper(wlConfigs.maskList, runningMask);
    }
    catch(e) {
        log(chalk.red(`App masking failed!\n`), chalk.yellow('More information: \n', e));
        process.kill(process.pid);
    }
    finally {
        log(chalk.green(`wl-config.lock.json successfully updated!`));
        printExitLogo();
    }
}

module.exports = (() => init())();
