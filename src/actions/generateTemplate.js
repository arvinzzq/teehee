const path = require('path');
const download = require('download');
const chalk = require('chalk');
const ora = require('ora');
const template = require('../../config/template');

/**
 * Download template files to temporary folder,
 * and render files to destination folder according to context.
 */

module.exports = function(typeTemplate, projectName, context) {
  const { gitAddr, prefix, listTemplates } = template;
  // Check whether type of template is exist.
  if (!listTemplates.includes(typeTemplate)) {
    console.log(chalk.red(`Template of ${typeTemplate} is not supported.`));
    return;
  }

  const spinner = ora('Downloading template').start();

  const downloadPath = `https://github.com/zz1211/bloom-${typeTemplate}-template/archive/master.zip`;
  const temporaryPath = path.resolve(__dirname, '../templates/');
  const destinationPath = path.resolve(process.cwd(), '') ;

  download(downloadPath, temporaryPath, {
    extract: true
  }).then(function(data) {
    spinner.stop();
    console.log(chalk.blue('data is downloaded ~ cheers'));
  }).catch(function(err) {
    spinner.end();
    console.log(chalk.red(`Error: ${err} \nTemplate download failed.`));
  });
};
