#!/usr/bin/env node
'use strict';
const yargs = require('yargs');
const { readApiKey, writeCurrentProjectSync } = require('./src/utils/capturoo-settings');
const Service = require('./src/service');
const DisplayUtils = require('./src/utils/display');
const { login } = require('./src/utils/login');
const capturooCommands = require('./src/commands');

yargs
  .usage('$0 <cmd> [args]')
  .command('account', 'Show account details', (yargs) => {
  }, async function(argv) {
    let apiKey = readApiKey();
    if (!apiKey) {
      console.log(`Run:\n\ncapturoo setup\n\na single time, or set the environement variable CAPTUROO_PRIVATE_API_KEY to you private key.`);
      process.exit();
    }

    let service = new Service(apiKey);
    try {
      let account = await service.getAccount();
      console.log(account)
    } catch (err) {
      console.error(err);
    }
  })
  .command('select', 'Select a project', (yargs) => {
  }, function (argv) {
    let apiKey = readApiKey();
    if (!apiKey) {
      console.log(`Run:\n\ncapturoo setup\n\na single time, or set the environement variable CAPTUROO_PRIVATE_API_KEY to you private key.`);
      process.exit();
    }
    let service = new Service(apiKey);

    let selectProjectCommand = new capturooCommands.SelectProjectCommand(service);
    selectProjectCommand.run()
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
  .command('projects', 'List all projects', (yargs) => {
  }, function(argv) {
    let apiKey = readApiKey();
    if (!apiKey) {
      console.log(`Run:\n\ncapturoo setup\n\na single time, or set the environement variable CAPTUROO_PRIVATE_API_KEY to you private key.`);
      process.exit();
    }
    let service = new Service(apiKey);
    service.getProjects()
      .then(result => {
        console.log(DisplayUtils.displayProjectArray(result.data));
      })
      .catch(err => {
        let data = err.response.data;
        if (data.hasOwnProperty('status') && data.status === 401) {
          console.log('There was a problem authenticating you. Please check your private key in your ~/.capturoo file.');
        }
      });
  })
  .command('leads [<leadid>]', 'List all leads or a specific lead for a given project', (yargs) => {
    yargs
    .options('p', {
      alias: 'project',
      demandOption: true,
      type: 'string'
    })
    .positional('leadid', {
      describe: 'Lead ID to describe',
      type: 'string'
    });
  }, function(argv) {
    let apiKey = readApiKey();
    if (!apiKey) {
      console.log(`Run:\n\ncapturoo setup\n\na single time, or set the environement variable CAPTUROO_PRIVATE_API_KEY to you private key.`);
      process.exit();
    }

    let service = new Service(apiKey);
    service.getLeads(argv.p)
      .then(result => {
        console.log(result.data);
      })
      .catch(err => {
        let data = err.response.data;
        if (data.hasOwnProperty('status') && data.status === 401) {
          console.log('There was a problem authenticating you. Please check your private key in your ~/.capturoo file.');
        }
      });
  })
  .help()
  .argv