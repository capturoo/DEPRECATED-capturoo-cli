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

class AccountCommand extends Command {
  constructor(config, configManager) {
    super(config, configManager);
  }

  async run() {
    try {
      this.spinner.start();
      let accountDocSnap = await this.manage.accounts().doc(this.aid).get();
      if (!accountDocSnap.exists) {
        let e = Error('Failed to get project');
        e.code = 'account-command/failed-to-get-project';
        throw e;
      }
      this.spinner.stop();

      console.log(Display.displayAccount(accountDocSnap.data()));
    } catch (err) {
      this.spinner.fail(err.message);
      throw err;
    }
  }
}

module.exports = AccountCommand;
