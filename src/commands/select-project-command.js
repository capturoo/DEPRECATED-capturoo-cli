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
const inquirer = require('inquirer');
const Command = require('./command');
const Display = require('../utils/display');

class SelectProjectCommand extends Command {
  constructor(config, configManager) {
    super(config, configManager);
  }

  async promptSelectProject(choices) {
    try {
      return await inquirer.prompt([
        {
          type: 'list',
          name: 'pid',
          message: 'Select a project',
          choices,
          filter: (val) => val.toLowerCase()
        }
      ]);
    } catch (err) {
      throw err;
    }
  }

  async run() {
    try {
      // Get a list of project names
      this.spinner.start();
      let querySnapshot = await this.store
        .accounts().doc(this.aid)
        .projects().get();

      let choices = [];
      let projectNameLookup = [];
      for (const queryDocSnap of querySnapshot) {
        let data = queryDocSnap.data();
        choices.push({
          name: `${data.projectName} (${data.pid})`,
          value: data.pid
        });
        projectNameLookup[data.pid] = data.projectName;
      }
      this.spinner.stop();

      let answer = await this.promptSelectProject(choices);

      // find the pid in the original choices list to get both the pid
      // and projectName together
      var selected = choices.find(function(data) {
        return data.value === answer.pid
      });

      this.configManager.writeCurrentProjectSync(answer.pid);
      console.log(Display.displayProject(answer.pid, projectNameLookup[answer.pid]));
      return selected;
    } catch (err) {
      this.spinner.fail(err.message);
      throw err;
    }
  }
}


// SelectProjectCommand.prototype.run = function() {
//   let service = this.service;

//   return new Promise(function(resolve, reject) {
//     service.getProjects()
//       .then(result => {
//         let data = result.data.map(p => ({
//           name: p.name + ' (' + p.projectId + ')',
//           value: p.projectId
//         }));
//         return selectProject(data);
//       })
//       .then(answers => {
//         writeCurrentProjectSync(answers.projectId);
//         resolve(answers.projectId);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
// };

module.exports = SelectProjectCommand;
