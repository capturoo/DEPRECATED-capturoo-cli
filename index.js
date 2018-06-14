#!/usr/bin/env node
const yargs = require('yargs');
const Display = require('./src/utils/display');
const commands = require('./src/commands');
const path = require('path');
var config = require('./config');

if (process.env.CAPTUROO_CLI_DEBUG_MODE) {
  let homeDir = process.env[(process.platform == 'win32')
    ? 'USERPROFILE' : 'HOME'];
  let stagingConfigFile = path.resolve(homeDir, '.config-staging.json');

  console.log(Display.stagingMode());
  config = require(stagingConfigFile);
}

function bailIfNoApiKey(apiKey) {
  if (!apiKey) {
    console.log(`Run:\n\ncapturoo setup\n\na single time, or set the environement variable CAPTUROO_PRIVATE_API_KEY to you private key.`);
    process.exit();
  }
}

yargs
  .usage('$0 <cmd> [args]')
  .command('account', 'Show account details', (yargs) => {
  }, async function(argv) {
    try {
      const command = commands.accountCommand(config);
      let account = await command.run();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  })
  .command('setup', 'Setup the command-line tool with your Capturoo account', (yargs) => {
  }, async (argv) => {
    const ConfigManager = require('./src/utils/config-manager');
    const configManager = new ConfigManager();
    if (configManager.readConfigSync())  {
      console.error('capturoo has already setup with your private key. If you wish to use a different account edit your ~/.capturoorc manually with your editor.')
      process.exit();
    }

    try {
      const command = commands.setupCommand(config);
      let account = await command.run();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  })
  .command('projects-add', 'Add a new project', (yargs) => {
  }, async (argv) => {
    try {
      const command = commands.addProjectCommand(config);
      await command.run();
      process.exit();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  })
  .command('projects-list', 'List all projects', (yargs) => {
  }, async (argv) => {
    try {
      const command = commands.listProjectsCommand(config);
      await command.run();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  })
  .command('projects-select', 'Select a project', (yargs) => {
  }, async (argv) => {
    try {
      const command = commands.selectProjectCommand(config);
      let pid = await command.run();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  })
  .command('leads-list [-P <pid>]', 'List all leads for the current project, or a given project', (yargs) => {
    yargs
    .options('P', {
      alias: 'project',
      demandOption: false,
      type: 'string'
    })
    .options('o', {
      alias: 'output',
      demandOption: false,
      type: 'string'
    })
    .options('format', {
      demandOption: false,
      default: 'json',
      type: 'string'
    })
    .choices('format', [
      'json', 'yaml', 'csv'
    ])
  }, function(argv) {
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);
    let service = new Service(apiKey);
    new capturooCommands.LeadsCommand(service)
      .run({
        projectId: argv.p,
        format: argv.format,
        output: argv.o
      })
      .then(() => {
      })
      .catch(err => {
      });
  })
  .command('leads-last [-p <projectId>]', '', (yargs) => {
    yargs
    .options('p', {
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
      'json', 'yaml', 'csv'
    ]);
  }, async (argv) => {
    try {
      const command = commands.lastLeadCommand(config);
      await command.run();
    } catch (err) {
      console.error(err);
      process.exit();
    }
  })
  .help()
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .argv
