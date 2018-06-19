#!/usr/bin/env node
const yargs = require('yargs');
const Display = require('./src/utils/display');
const commands = require('./src/commands');
const bunyan = require('bunyan');
const path = require('path');
const ConfigManager = require('./src/utils/config-manager');
const configManager = new ConfigManager();

// configure logging and put onboard the config for global use
const capturooDir = configManager.ensureCapturooDirExistsSync();
const log = bunyan.createLogger({
  name: 'myapp',
  //serializers: bunyan.stdSerializers,
  streams: [
    {
      level: 'debug',
      path: path.resolve(capturooDir, 'capturoo-cli.log')
    }
  ]
});

if (process.env.CAPTUROO_CLI_DEBUG_MODE) {
  let homeDir = process.env[(process.platform == 'win32')
    ? 'USERPROFILE' : 'HOME'];
  let stagingConfigFile = path.resolve(homeDir, '.config-staging.json');

  console.log(Display.stagingMode());
  var config = require(stagingConfigFile);
  log.debug('Running in staging mode');
} else {
  var config = require('./config');
}
config.log = log;

log.info('Capturoo CLI tool started');

function bailIfNoApiKey(apiKey) {
  if (!apiKey) {
    console.log(`Run:\n\ncapturoo setup\n\na single time, or set the' +
      ' environement variable CAPTUROO_PRIVATE_API_KEY to you private key.`);
    process.exit();
  }
}

yargs
  .usage('$0 <cmd> [args]')
  .command('account', 'Show account details', (yargs) => {
  }, async function(argv) {
    try {
      log.info('AccountCommand started');
      const command = commands.accountCommand(config);
      let account = await command.run();
    } catch (err) {
      console.error(err);
    }
  })
  .command('setup', 'Setup the command-line tool with your Capturoo' +
    ' account', (yargs) => {
  }, async (argv) => {
    if (configManager.readConfigSync())  {
      console.error('capturoo has already setup with your private key. ' +
      ' If you wish to use a different account edit your ~/.capturoorc' +
      ' manually with your editor.');
      process.exit();
    }

    try {
      const command = commands.setupCommand(config);
      let account = await command.run();
    } catch (err) {
      console.error(err);
    }
  })
  .command('projects-add', 'Add a new project', (yargs) => {
  }, async (argv) => {
    try {
      const command = commands.addProjectCommand(config);
      await command.run();
    } catch (err) {
      console.error(err);
    }
  })
  .command('projects-list', 'List all projects', (yargs) => {
  }, async (argv) => {
    try {
      const command = commands.listProjectsCommand(config);
      await command.run();
    } catch (err) {
      console.error(err);
    }
  })
  .command('projects-select', 'Select a project', (yargs) => {
  }, async (argv) => {
    try {
      const command = commands.selectProjectCommand(config);
      let pid = await command.run();
    } catch (err) {
      console.error(err);
    }
  })
  .command('leads-list [-P <projectId>] [-o <outfile>] [-f <format>]',
    'List all leads for the selected project, or a given project', (yargs) => {
    yargs.options('P', {
      alias: 'project',
      demandOption: false,
      type: 'string'
    }).options('o', {
      alias: 'output',
      demandOption: false,
      type: 'string'
    }).options('format', {
      demandOption: false,
      default: 'json',
      type: 'string'
    }).choices('format', [
      'json', 'csv'
    ]);
  }, async (argv) => {
    try {
      const command = commands.queryLeadsCommand(config);
      await command.run({
        projectId: argv.P,
        format: argv.format,
        output: argv.o
      });
    } catch (err) {
      console.error(err);
    }
  })
  .command('leads-last [-P <projectId>]',
    'Show the last lead added', (yargs) => {
    yargs
    .options('P', {
      alias: 'project',
      demandOption: false,
      type: 'string'
    })
    .options('format', {
      demandOption: false,
      default: 'json',
      type: 'string'
    })
    .choices('format', [
      'json'
    ]);
  }, async (argv) => {
    try {
      const command = commands.lastLeadCommand(config);
      await command.run();
    } catch (err) {
      console.error(err);
    }
  })
  .help()
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .argv
