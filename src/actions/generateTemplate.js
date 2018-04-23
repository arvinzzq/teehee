const fs = require('fs');
const path = require('path');
const download = require('download');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
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

    // Collect prompts according to command input.
    const prompts = [];
    meta.prompts.forEach(item => {
      if (!command[item.name]) {
        prompts.push(item.name === 'author' ? {
          ...item,
          default: gitUser().author
        } : item);
      }
    });

    const options = {
      name: command.name || '',
      version: command.version || '0.0.1',
      description: command.description || '',
      keywords: command.keywords || '',
      author: command.author || '',
      license: command.license ||  'MIT'
    };

    // issue of version and description is to be fixed.

    inquirer.prompt(prompts).then(anwsers => {
      const context = {
        ...options,
        ...anwsers
      };
    })

  }).catch(err => {
    spinner.stop();
    console.log(chalk.red(`Error: ${err} \nTemplate download failed.`));
  });
};
