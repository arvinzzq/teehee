const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const template = require('../../config/template');
const generateTemplate = require('../lib/generateTemplate');

/**
 * Download template files to temporary folder which will be removed,
 * and render files to destination folder according to context.
 */

module.exports = (projectName, command) => {
  if (projectName && fs.existsSync(projectName)) {
    console.log(chalk.red(`创建失败，当前目录下 ${projectName} 已经存在。`));
    return;
  }
  const prompts = [{
    type: 'list',
    name: 'projectType',
    message: '请选择创建的项目类型',
    choices: template.listTemplates
  }];

  inquirer.prompt(prompts).then(answers => {
    generateTemplate(answers.projectType, projectName, command);
  }).catch(err => {
    console.log(chalk.red(err));
  });
};
