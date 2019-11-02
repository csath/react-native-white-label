const chalk = require('chalk');
const minimist = require('minimist');
const inquirer = require('inquirer');
const fileReader = require('./fileReader');
const auditor = require('./auditor');
const log = console.log;

const init = async () => {
    try {
        log(chalk.yellow(`Initializing app masking cli...`));

        let wlConfigs = null;
        let wlConfigLastEditedTime = null;
        try {
            wlConfigs = require('../wl-config.js');
            wlConfigLastEditedTime = fileReader.getFileUpdatedDate('./wl-config.js');
            console.log(wlConfigLastEditedTime)
        }
        catch(e) {
            log(chalk.red(`No wl-config.js found!`));
            log(chalk.yellow(`Masking config generation abort!`));
            process.kill(process.pid);
        }
        
        // read argument list
        const mask = minimist(process.argv).m;

        if (mask && !wlConfigs.maskList.find(i => i.mask == mask)) {
            log(chalk.red(`No mask configs for '${(mask || '').toUpperCase()}' is defined in wl-config.js!`));
            log(chalk.yellow(`Masking config generation abort!`));
            process.kill(process.pid);
        }

        // get existing configs
        const exisitngConfigs = await fileReader.readLockFile();

        // if no previous configs found
        if (!exisitngConfigs) {
            log(chalk.yellow(`No wl-config.lock found!`));
            let _maskName = mask || wlConfigs.defaultMask || (wlConfigs.maskList.length > 0 ? wlConfigs.maskList[0].mask : '');
            log(chalk.yellow(`Restarting masking config generation for '${(_maskName || '').toUpperCase()}'...`));

            await auditor.overrideWithNewConfigs(_maskName, wlConfigLastEditedTime);
            log(chalk.green(`Successfully rewired app masking configurations for '${(_maskName || '').toUpperCase()}'`));
        }
        // if previous configs found but have different masks
        else if (exisitngConfigs && mask && (mask != exisitngConfigs.mask)) {
            const questions = [{
                type: 'confirm',
                default: false,
                name: 'shouldOverride',
                message: chalk.magenta(`Existing wl-config.lock doesn't match with the provided mask '${(mask || '').toUpperCase()}'. Do you want to override wl-config.lock with new configs for '${(mask || '').toUpperCase()}'?`),
            }];
            let shouldOverride = false;
            await inquirer.prompt(questions).then(answers => {
                shouldOverride = answers['shouldOverride'];
            });

            if (shouldOverride) {
                await auditor.overrideWithNewConfigs(mask, wlConfigLastEditedTime);
                log(chalk.green(`Successfully rewired app masking configurations for '${(mask || '').toUpperCase()}'`));
            }
            else {
                log(chalk.yellow(`Masking config generation abort!`));
            }
        }
        // if previous configs found but lock doesn't sync with wl-config.js lastEdited time
        else if (wlConfigLastEditedTime && (wlConfigLastEditedTime != exisitngConfigs.wlConfigLastEditedTime)) {
            let _maskName = wlConfigs.defaultMask || (wlConfigs.maskList.length > 0 ? wlConfigs.maskList[0].mask : '');
            log(chalk.yellow(`wl-config.js has been updated and wl-config.lock doesn't synch with wl-config.js`));
            log(chalk.cyan(`wl-config.lock config for mask : ${(exisitngConfigs.mask || '').toUpperCase()}`));
            log(chalk.cyan(`wl-config.js default mask      : ${(_maskName || '').toUpperCase()}`));
            const questions = [{
                type: 'confirm',
                default: false,
                name: 'shouldDeleteLock',
                message: chalk.magenta(`Do you want to remove wl-config.lock and restart masking config generation for '${(_maskName || '').toUpperCase()}'(press Y/YES)\nor use exsisting lock configs (press N/NO)?`),
            }];
            let shouldDeleteLock = false;
            await inquirer.prompt(questions).then(answers => {
                shouldDeleteLock = answers['shouldDeleteLock'];
            });
            if (shouldDeleteLock) {
                await auditor.overrideWithNewConfigs(_maskName, wlConfigLastEditedTime);
                log(chalk.green(`Successfully rewired app masking configurations for '${(_maskName || '').toUpperCase()}'!`));
            }
            else {
                log(chalk.green(`Configured to use existing wl-config.lock`));
                log(chalk.yellow(`Skipping masking config generation...`));
            }
        }
        // if previous configs found
        else {
            log(chalk.green(`Existing wl-config.lock found!`));
            log(chalk.yellow(`Skipping masking config generation...`));
        }
    }
    catch(e) {
        log(chalk.red(`App masking failed!\n\n`), chalk.yellow('More information: \n', e, '\n\n'));
        process.kill(process.pid);
    }
}

module.exports = (() => init())();
