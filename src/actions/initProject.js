const fs = require('fs');
const chalk = require('chalk');
const generateTemplate = require('./generateTemplate');

module.exports = (projectType, projectName, command) => {
  if (projectName && fs.existsSync(projectName)) {
    console.log(chalk.red(`创建失败，当前目录下 ${projectName} 已经存在。`));
    return;
  }
  generateTemplate(projectType, projectName, command);
};
