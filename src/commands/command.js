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
const capturoo = require('@capturoo/app');
require('@capturoo/store');
const ConfigManager = require('../utils/config-manager');
const Display = require('../utils/display');
const Ora = require('ora');

class Command {
  constructor(config, configManager) {
    const spinner = new Ora({
      color: 'gray',
      spinner: 'dots'
    });

    capturoo.initApp(config);

    Object.assign(this, {
      configManager: (configManager) ? configManager : new ConfigManager()
    });
    let fileConfig = this.configManager.readConfigSync();
    let activeProject = this.configManager.readCurrentProjectSync();

    if (!fileConfig) {
      console.error(Display.noKey());
      process.exit();
    }

    Object.assign(this, {
      ...fileConfig,
      activeProject,
      spinner,
      log: config.log,
      store: capturoo.store()
    });
    capturoo.store().setPrivateApiKey(fileConfig.privateApiKey);
  }
}

module.exports = Command;
