#!/usr/bin/env node
const yargs = require('yargs');
const { readApiKey, writeCurrentProjectSync } = require('./src/utils/capturoo-settings');
const Service = require('./src/service');
const DisplayUtils = require('./src/utils/display');
const { login } = require('./src/utils/login');
const capturooCommands = require('./src/commands');

if (process.env.CAPTUROO_CLI_DEBUG_MODE) {
  console.log('RUNNING IN STAGING MODE');
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
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);
    let service = new Service(apiKey);
    try {
      let account = await service.getAccount();
      console.log(account)
    } catch (err) {
      console.error(err);
    }
  })
  .command('projects:create', 'Create a new project', (yargs) => {
  }, async (argv) => {
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);

    let service = new Service(apiKey);
    try {
      let createProjectCommand = new capturooCommands.CreateProjectCommand(service);
      await createProjectCommand.run();
    } catch (err) {
      if (err.response && err.response.data) {
        let data = err.response.data;
        console.log(`Error "${data.message}"`);
      } else {
        console.log(err);
      }
    }
  })
  .command('projects:delete <pid>', 'Delete a project', (yargs) => {
    yargs
      .positional('pid', {
        describe: 'Project ID to delete',
      });
  }, async function(argv) {
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);

    let service = new Service(apiKey);
    try {
      let { data } = await service.getProjects();
      let projects = data.map(p => ( p.projectId));
      console.log(projects);
    } catch (err) {
      console.error(err);
      let data = err.response.data;
      if (data.hasOwnProperty('status') && data.status === 401) {
        console.log('There was a problem authenticating you.');
      }
    }
    console.log('project:delete');
  })
  .command('projects:select', 'Select a project', (yargs) => {
  }, function (argv) {
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);
    let service = new Service(apiKey);
    new capturooCommands.SelectProjectCommand(service)
      .run()
      .then(projectId => {
        console.log(`Project ${projectId} selected`);
      })
      .catch(err => {
        console.error(err);
      });
  })
  .command('setup', 'Setup the command-line tool with your Capturoo account', (yargs) => {
  }, function (argv) {
    if (readApiKey())  {
      console.log('capturoo has already setup with your private key. If you wish to use a different account edit your ~/.capturoorc manually with your editor.')
      process.exit();
    }
    login()
      .then(result => {
        process.exit();
      })
      .catch(err => {
        if (err.code === 'auth/wrong-password') {
          console.error(err.message);
        } else if (err.code === 'auth/user-not-found') {
          console.error(err.message);
        } else {
          console.error(err);
        }
        process.exit();
      });
  })
  .command('projects:list', 'List all projects', (yargs) => {
  }, function(argv) {
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);
    let service = new Service(apiKey);
    service.getProjects()
      .then(result => {
        console.log(DisplayUtils.displayProjectArray(result.data));
      })
      .catch(err => {
        let data = err.response.data;
        if (data.hasOwnProperty('status') && data.status === 401) {
          console.log('There was a problem authenticating you. Please check your private key in your ~/.capturoorc file.');
        }
      });
  })
  .command('leads:list [-p <projectId>]', 'List all leads or a specific lead for a given project', (yargs) => {
    yargs
    .options('p', {
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
  .command('leads:last [-p <projectId>]', '', (yargs) => {
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
  }, (argv) => {
    let apiKey = readApiKey();
    bailIfNoApiKey(apiKey);
    let service = new Service(apiKey);



  })
  .help()
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .argv
