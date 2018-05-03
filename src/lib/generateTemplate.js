const fs = require('fs-extra');
const path = require('path');
const download = require('download');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const generatePrompts = require('./generatePrompts');
const template = require('../../config/template');

/**
 * Download template files to temporary folder which will be removed,
 * and render files to destination folder according to context.
 */

module.exports = (projectType, projectName, command) => {
  if (projectName && fs.existsSync(projectName)) {
    console.log(chalk.red(`创建失败，当前目录下 ${projectName} 已经存在。`));
    return;
  }
  const { gitAddr, prefix } = template;

  fs.ensureDirSync(path.resolve(__dirname, '../templates'));
  const spinner = ora('模板下载中...').start();

  const downloadPath = `${gitAddr}/${prefix}-${projectType}-template/archive/master.zip`;
  const temporaryPath = path.resolve(__dirname, '../templates/');

  download(downloadPath, temporaryPath, {
    extract: true
  }).then(data => {
    spinner.stop();
    console.log(chalk.green('模板下载完成 ~ ᕕ(ᐛ)ᕗ'));
    const metaPath = path.resolve(__dirname, `../templates/${prefix}-${projectType}-template-master/meta.js`);
    const meta = require(metaPath);
    const options = command.opts();
    const prompts = generatePrompts(meta, options);
    inquirer.prompt(prompts).then(anwsers => {
      const context = {
        ...options,
        ...anwsers,
        name: projectName
      };
      if (context.hasOwnProperty('keywords')) {
        context.keywords = context.keywords.trim().split(' ');
      }

      data.forEach((item) => {
        item.newPath = path.join(process.cwd(), item.path.replace(item.path.split('/')[0], projectName));
        if (item.type === 'file') {
          if (/package.json/.test(item.path)) {
            item.newData = handlebars.compile(item.data.toString('utf8'))(context)
          } else if (!/meta.js/.test(item.path)) {
            item.newData = item.data;
          }
          if (!/meta.js/.test(item.path)) {
            fs.outputFileSync(item.newPath, item.newData);
          }
        } else if (item.type === 'directory') {
          fs.ensureDirSync(item.newPath);
        }
      });
      fs.removeSync(path.resolve(__dirname, '../templates'));
    });

  }).catch(err => {
    spinner.stop();
    fs.removeSync(path.resolve(__dirname, '../templates'));
    console.log(chalk.red(`Error: ${err} \n阿喵，出错啦~`));
  });
};
