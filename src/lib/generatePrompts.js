const lodash = require('lodash');
const gitUser = require('../lib/gitUser');

function checkOptions(item, options) {
  return !(!options[item.name] || lodash.isFunction(options[item.name]));
}

function checkPrompts(item , prompts) {
  return prompts.find((prompt) => (prompt.name === item.name));
}

/**
 * Priority: options > meta > default-prompts
 * @param {Object} meta
 * @param {Object} options
 */
module.exports = (meta, options) => {
  const defaultPrompts = [{
    type: 'input',
    name: "description",
    message: "喵，简单介绍下你的项目吧：",
    default: "A React.js project"
  }, {
    type: 'input',
    name: "version",
    message: "项目初始版本号：",
    default: "0.0.1"
  }, {
    type: 'input',
    name: "keywords",
    message: "项目的关键字：",
    default: "bloom"
  }, {
    type: 'input',
    name: "author",
    message: "项目作者的大名：",
    default: gitUser().author
  }, {
    type: 'input',
    name: "license",
    message: "用哪个license呢：",
    default: "MIT"
  }];

  const prompts = [];
  meta.prompts.forEach(item => {
    if (!checkOptions(item, options)) {
      prompts.push(item);
    }
  });
  defaultPrompts.forEach((item) => {
    if (!checkOptions(item, options) && !checkPrompts(item, prompts)) {
      prompts.push(item);
    }
  });

  return prompts;
};
