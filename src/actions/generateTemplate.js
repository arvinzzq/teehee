const fs = require('fs');
const path = require('path');
const download = require('download');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const lodash = require('lodash');
const gitUser = require('./gitUser');
const template = require('../../config/template');

/**
 * Download template files to temporary folder,
 * and render files to destination folder according to context.
 */

module.exports = (projectType, command) => {
  const { gitAddr, prefix, listTemplates } = template;
  // Check whether type of template is exist.
  if (!listTemplates.includes(projectType)) {
    console.log(chalk.red(`Template of ${projectType} is not supported.`));
    return;
  }

  const spinner = ora('Downloading template').start();

  const downloadPath = `https://github.com/zz1211/bloom-${projectType}-template/archive/master.zip`;
  const temporaryPath = path.resolve(__dirname, '../templates/');

  download(downloadPath, temporaryPath, {
    extract: true
  }).then(data => {
    spinner.stop();
    console.log(chalk.green('data is downloaded ~ cheers'));
    const metaPath = path.resolve(__dirname, `../templates/bloom-${projectType}-template-master/meta.js`);
    const meta = require(metaPath);

    // Collect initialized options of parameters.

    const {
      name,
      version,
      description,
      keywords,
      author,
      license
    } = command;

    const options = {
      name: (!lodash.isFunction(name) && name) || '',
      version: (!lodash.isFunction(version) && version) || '0.0.1',
      description: (!lodash.isFunction(description) && description) || '',
      keywords: keywords || '',
      author: author || gitUser().author,
      license: license ||  'MIT'
    };

    // Collect prompts according to command input.
    const prompts = [];

    // Set default name prompt
    if (!options['name']) {
      prompts.unshift({
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: `${projectType}`,
        validate(input) {
            if (!input) {
                return 'Project name is required';
            }
            return true;
        }
      });
    }

    // Merge prompts
    meta.prompts.forEach(item => {
      if (!command[item.name] || lodash.isFunction(command[item.name])) {
        if (item.name === 'name') {
          // Replace default prompt of name.
          prompts[0] = item;
        } else {
          prompts.push(item);
        }
      }
    });

    inquirer.prompt(prompts).then(anwsers => {
      const context = {
        ...options,
        ...anwsers
      };
      console.log('context: ', context);
    })

  }).catch(err => {
    spinner.stop();
    console.log(chalk.red(`Error: ${err} \nTemplate download failed.`));
  });
};
