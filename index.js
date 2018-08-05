const program = require('commander');

program.version(require('./package').version);

program
  .command('init <projectName>')
  .option('--description <description>', '描述')
  .option('--keywords <keywords>', '关键字')
  .option('--author <author>', '作者')
  .option('--license <license>', '许可类型')
  .action((projectName, command) => require('./src/actions/initProject')(projectName, command));

program
  .command('start <entryFileName>')
  .option('-c, --cluster')
  .option('-b, --babel')
  .action((entryFileName, command) => require('./src/actions/babelStart')(entryFileName, command));

program.parse(process.argv);
