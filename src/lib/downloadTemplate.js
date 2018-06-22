const fs = require('fs-extra');
const path = require('path');
const download = require('download');
const ora = require('ora');
const chalk = require('chalk');
const template = require('../../config/template');

/**
 * Download template from remote github repository to temporary folder.
 * @param {String} projectType
 */
module.exports = (projectType) => {
  const { gitAddr, prefix } = template;
  fs.ensureDirSync(path.resolve(__dirname, '../templates'));
  const spinner = ora('模板下载中...').start();

  const downloadPath = `${gitAddr}/${prefix}-${projectType}-template/archive/master.zip`;
  const temporaryPath = path.resolve(__dirname, '../templates/');

  return download(downloadPath, temporaryPath, { extract: true }).then(data => {
    spinner.stop();
    console.log(chalk.green('模板下载完成 ~ ᕕ(ᐛ)ᕗ'));
    return {
      data,
      pathTemplate: path.resolve(__dirname, `../templates/${prefix}-${projectType}-template-master`)
    };
  });
};
