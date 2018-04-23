const fs = require('fs');
const chalk = require('chalk');
const generateTemplate = require('./generateTemplate');

module.exports = (projectType, command) => {
  const { name } = command;
  if (name && fs.existsSync(name)) {
    console.log(chalk.red(`创建失败，当前目录下 ${name} 已经存在。`));
    return;
  }
  generateTemplate(projectType, command);
};
