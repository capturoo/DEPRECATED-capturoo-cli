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
const capturoo = require('@capturoo/app');
require('@capturoo/auth');
require('@capturoo/store');
const ConfigManager = require('../utils/config-manager');
const emoji = require('node-emoji');
const Ora = require('ora');

class SetupCommand {
  constructor(config, configManager) {
    capturoo.initApp(config);
    Object.assign(this, {
      auth: capturoo.auth(),
      store: capturoo.store(),
      spinner: new Ora({
        color: 'gray',
        spinner: 'dots'
      }),
      configManager: (configManager) ? configManager : new ConfigManager()
    });
  }

  async run() {
    try {
      let { email, password } = await this.promptForEmailAndPassword();

      this.spinner.start();
      let account = await this.signInWithEmailAndPassword(email, password);
      this.configManager.writeConfigSync(
        account.aid,
        account.privateApiKey,
        'default'
      );

      this.spinner.succeed(`${emoji.get('chipmunk')}  capturoo setup successful.`);
      return account;
    } catch (err) {
      this.spinner.fail(err.message);
      throw err;
    } finally {
      this.spinner.stop();
    }
  }

  async promptForEmailAndPassword() {
    try {
      let answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: 'Account email address'
        },
        {
          type: 'password',
          message: 'Enter a masked password',
          name: 'password',
          mask: '*'
        }
      ]);
      return answers;
    } catch (err) {
      return err;
    }
  }

  async signInWithEmailAndPassword(username, password) {
    try {
      let userCredential = await this.auth.signInWithEmailAndPassword(
        username, password);

      this.store.setToken(this.auth.getToken());

      let accountDocSnap = await this.store.accounts().doc(userCredential.user.uid).get();
      if (!accountDocSnap.exists) {
        let e = Error(`Failed to locate the account (${userCredential.user.uid})`);
        e.code = 'auth/failed-to-locate-account';
        return e;
      }

      return accountDocSnap.data();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = SetupCommand;
