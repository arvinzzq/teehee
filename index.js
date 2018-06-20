const program = require('commander');
const actions = require('./src/actions');

/**
 * process command parameters
 */

program
  .version(require('./package').version);

program
  .command('init <projectName>')
  .option('--description <description>', '描述')
  .option('--keywords <keywords>', '关键字')
  .option('--author <author>', '作者')
  .option('--license <license>', '许可类型')
  .action(actions.initProject);


/**
 * 
 */
program
  .command('babel <entryFileName>')
  .option('-c, --cluster')
  .action(actions.babelCompile)

program
  .parse(process.argv);
