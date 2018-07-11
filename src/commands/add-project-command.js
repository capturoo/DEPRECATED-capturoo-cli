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
const inquirer = require('inquirer');
const chalk = require('chalk');
const emoji = require('node-emoji');

class AddProjectCommand extends Command {
  constructor(config, configManager) {
    super(config, configManager);
  }

  async promptProjectDetails() {
    try {
      return await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Name of your project: '
        },
        {
          type: 'input',
          name: 'pid',
          message: 'Alocate a project ID (lowercase including hyphen)'
        }
      ]);
    } catch (err) {
      throw err;
    }
  }

  async run() {
    try {
      let answer = await this.promptProjectDetails();

      this.spinner.start();
      let projectDocRef = await this.store.accounts().doc(this.aid)
        .projects().add({
          pid: answer.pid,
          projectName: answer.projectName
        });

      let projectDocSnap = await projectDocRef.get();
      if (!projectDocSnap.exists) {
        let e = Error('Failed to create project');
        e.code = 'project-command/failed-to-create-project';
        throw e;
      }

      let data = projectDocSnap.data();
      this.spinner.succeed(
        `${emoji.get('chipmunk')}  ${data.projectName} (${data.pid}) successfully added. Use ${chalk.cyan.bold('capturoo project-select')} to switch to this project.`
      );
      return projectDocSnap.data();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AddProjectCommand;
