#!/usr/bin/env node
'use strict';
const yargs = require('yargs');
const readApiKey = require('./src/read-api-key');
const Service = require('./src/service');
const Utils = require('./src/utils');

const privateApiKey = readApiKey();

if (!privateApiKey) {
  console.log(`  Set the environement variable CAPTUROO_PRIVATE_API_KEY to you private key,
  or add the following lines to ~/.capturoo
  [default]
  private_api_key=<your key>`);
  process.exit();
}

let service = new Service(privateApiKey);

yargs
  .usage('$0 <cmd> [args]')
  .command('account', 'Show account details', (yargs) => {
  }, async function(argv) {
    try {
      let account = await service.getAccount();
      console.log(account)
    } catch (err) {
      console.error(err);
    }
  })
  .command('projects', 'List all projects', (yargs) => {
  }, function(argv) {
    service.getProjects()
      .then(result => {
        console.log(Utils.displayProjectArray(result.data));
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

