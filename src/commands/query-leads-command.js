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
const path = require('path');
const fs = require('fs');

class QueryLeadsCommand extends Command {
  constructor(config, configManager) {
    super(config, configManager);
  }

  async run(options = {}) {
    if (!this.activeProject) {
      let cmd = `${chalk.cyan.bold('capturoo projects-select')}`;
      console.warn(`You have no active project. Use ${cmd} to select one.`)
      return undefined;
    }

    if (options.hasOwnProperty('projectId') && options.projectId) {
      var projectId = options.projectId;
      this.log.debug(`options.projectId is set, using projectId=${projectId}`);
    } else {
      var projectId = this.activeProject;
      this.log.debug(
        `options.projectId is **not** set, default projectId=${projectId}`
      );
    }

    if (options.hasOwnProperty('output') && options.output) {
      var outFile = options.output;
      this.log.debug(`options.output is set. outFile=${outFile}`);
    } else {
      this.log.debug(`options.output is **not** set. outFile=undefined`);
      var outFile = undefined;
    }

    try {
      let proj = `${chalk.white.bold(
        `${chalk.white.bold(this.activeProject)}`
      )}`;
      this.spinner.start(`${emoji.get('chipmunk')}  Getting leads for ${proj}.`);

      let projectDocRef = this.store
        .accounts().doc(this.aid)
        .projects().doc(projectId);
      let query = projectDocRef.leads().orderBy('system_created', 'asc');
      let querySnapshot = await query.get();
      this.spinner.stop();

      if (querySnapshot.size === 0) {
        console.log(`This project currently has no leads`);
        return;
      }

      let records = querySnapshot.docs().map(s => s.data());

      if (options.format === 'csv') {
        const Json2csvParser = require('json2csv').Parser;
        const opts = {
          //fields
          flatten: true
        };
        // let leadKeys = Object.keys(querySnapshot.docs()[0].data().lead).map(
        //   v => `lead.${v}`
        // );
        // let systemKeys = Object.keys(querySnapshot.docs()[0].data().system).map(
        //   v => `system.${v}`
        // );
        // let trackingKeys = Object.keys(querySnapshot.docs()[0].data().tracking).map(
        //   v => `tracking.${v}`
        // );
        // const fields = [
        //   ...leadKeys,
        //   ...systemKeys,
        //   ...trackingKeys
        // ];
        const parser = new Json2csvParser(opts);

        var outString = parser.parse(records);
      } else {
        var outString = JSON.stringify(records, null, 2);
      }

      if (outFile) {
        this.log.debug(
          `Using fullpath of ${path.resolve(process.cwd(), outFile)}`
        );
        fs.writeFileSync(path.resolve(process.cwd(), outFile), outString);
      } else {
        console.log(outString);
      }
    } catch (err) {
      this.spinner.fail(err.message);
      throw err;
    }
  }
}

module.exports = QueryLeadsCommand;
