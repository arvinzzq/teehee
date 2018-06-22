const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const downloadTemplate = require('./downloadTemplate');
const generatePrompts = require('./generatePrompts');

/**
 * Render downloaded template files to destination folder.
 * @param {String} projectType
 * @param {String} projectName
 * @param {Object} command
 */
module.exports = (projectType, projectName, command) => {
  downloadTemplate(projectType).then(({ data, pathTemplate }) => {
    const meta = require(`${pathTemplate}/meta.js`);
    const options = command.opts();
    const prompts = generatePrompts(meta, options);
    inquirer
      .prompt(prompts)
      .then(anwsers => {
        const context = {
          ...options,
          ...anwsers,
          name: projectName
        };
        if (context.hasOwnProperty('keywords')) {
          context.keywords = context
            .keywords
            .trim()
            .split(' ');
        }
        data.forEach((item) => {
          item.newPath = path.join(process.cwd(), item.path.replace(item.path.split('/')[0], projectName));
          if (item.type === 'file') {
            if (/package.json/.test(item.path)) {
              item.newData = handlebars.compile(item.data.toString('utf8'))(context);
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
    fs.removeSync(path.resolve(__dirname, '../templates'));
    console.log(chalk.red(`Error: ${err} \n阿喵，出错啦~`));
  });
};
