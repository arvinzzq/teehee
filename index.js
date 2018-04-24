const program = require('commander');
const actions = require('./src/actions');

/**
 * process command parameters
 */

program
  .version(require('./package').version);

program
  .command('init <projectType> <projectName>')
  .option('--description <description>', '描述')
  .option('--keywords <keywords>', '关键字')
  .option('--author <author>', '作者')
  .option('--version <version>', '版本号')
  .option('--license <license>', '许可类型')
  .action(actions.initProject)
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ zan build');
    console.log();
});

program
  .parse(process.argv);
