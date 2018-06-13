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
const Display = require('../utils/display');

class ListProjectsCommand extends Command {
  constructor(config, configManager) {
    super(config, configManager);
  }

  async run() {
    try {
      this.spinner.start();

      let querySnapshot = await this.manage.accounts().doc(this.aid).projects().get();
      let projects = [];
      for (const queryDocSnap of querySnapshot) {
        let data = queryDocSnap.data();
        projects.push(data);
      }

      let currentProject = this.configManager.readCurrentProjectSync();

      this.spinner.stop();

      let output = Display.displayProjectArray(this.aid, projects, currentProject);
      console.log(output);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ListProjectsCommand;
