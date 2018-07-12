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
        console.log(`You have no active project. Use ${cmd} to select one.`);
        return undefined;
      }

      this.spinner.start(`${emoji.get('chipmunk')}  Getting last lead for ${this.activeProject}.`);
      let projectDocRef = this.store
        .accounts().doc(this.aid)
        .projects().doc(this.activeProject);
      let query = projectDocRef.leads()
        .orderBy('system_created', 'desc').limit(1);
      let querySnapshot = await query.get();
      this.spinner.stop();

      if (querySnapshot.size === 0) {
        console.log('This project currently has no leads');
      } else {
        let leadQuerySnap = querySnapshot.docs()[0];
        console.log(leadQuerySnap.data());
      }
    } catch (err) {
      this.spinner.fail(err.message);
      throw err;
    }
  }
}

module.exports = LastLeadCommand;

