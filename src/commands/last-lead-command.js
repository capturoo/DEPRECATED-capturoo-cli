/**
 * Copyright 2018 Capturoo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Command = require('./command');
const emoji = require('node-emoji');
const chalk = require('chalk');

class LastLeadCommand extends Command {
  constructor(config, configManager) {
    super(config, configManager);
  }

  async run() {
    try {
      if (!this.activeProject) {
        let cmd = `${chalk.cyan.bold('capturoo projects-select')}`;
        console.log(`You have no active project. Use ${cmd} to select one.`)
        process.exit();
      }

      let proj = `${chalk.white.bold(`${chalk.white.bold(this.activeProject)}`)}`;
      this.spinner.start(`${emoji.get('chipmunk')}  Getting last lead for ${proj}.`);
      let projectDocRef = this.manage
        .accounts().doc(this.aid)
        .projects().doc(this.activeProject);
      let query = projectDocRef.leads()
        .orderBy('system_created', 'desc').limit(1);
      let querySnapshot = await query.get();
      let leadQuerySnap = querySnapshot.docs()[0];
      this.spinner.stop();
      console.log(leadQuerySnap.data());
    } catch (err) {
      this.spinner.fail(err.message);
      throw err;
    }
  }
}

module.exports = LastLeadCommand;

// function LeadsLastCommand(service) {
//   Object.assign(this, {
//     service
//   });
// }
// LeadsCommand.prototype.run = function(options) {
//   let service = this.service;

//   var opts = options || {};
//   if (opts.hasOwnProperty('projectId') && opts.projectId) {
//     var projectId = opts.projectId;
//   } else {
//     var projectId = readCurrentProjectSync();
//   }

//   if (opts.hasOwnProperty('format') && opts.format) {
//     var format = opts.format;
//   } else {
//     var format = 'json';
//   }

//   return new Promise(function(resolve, reject) {
//     service.getLeads(projectId)
