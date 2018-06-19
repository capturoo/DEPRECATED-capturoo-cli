/**
 * Copyright 2018 Capturoo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 i Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require('fs');
const path = require('path');
const ini = require('ini');

class ConfigManager {
  constructor() {
    Object.assign(this, {
      homeDir: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    });
  }

  static get CAPTUROORC_FILE() {
    return '.capturoorc';
  }

  static get CAPTUROO_DIR() {
    return '.capturoo';
  }

  /**
   * Reads and parses the .capturoorc .INI file returning an object
   * containing the aid and privateApiKey.
   * @typedef {ConfigData} object
   * @property {string} ConfigData.aid
   * @property {string} ConfigData.privateApiKey
   * @returns {ConfigData}
   */
  readConfigSync() {
    if (process.env.CAPTUROO_ACCOUNT_ID
      && process.env.CAPTUROO_PRIVATE_API_KEY) {
      return {
        aid: process.env.CAPTUROO_ACCOUNTID,
        privateApiKey: process.env.CAPTUROO_PRIVATE_API_KEY
      };
    }

    const rcFile = path.resolve(this.homeDir, ConfigManager.CAPTUROORC_FILE);
    if (fs.existsSync(rcFile)) {
      let config = ini.parse(fs.readFileSync(rcFile, 'utf8'));
      if (config.hasOwnProperty('default')
        && config.default.hasOwnProperty('account_id')
        && config.default.hasOwnProperty('private_api_key')) {
        return {
          aid: config.default.account_id,
          privateApiKey: config.default.private_api_key
        };
      }
    }
  }

  writeConfigSync(aid, privateApiKey, name) {
    const rcFile = path.resolve(this.homeDir, ConfigManager.CAPTUROORC_FILE);
    if (!fs.existsSync(rcFile)) {
      fs.writeFileSync(rcFile, `[default]\naccount_id=${aid}\nprivate_api_key=${privateApiKey}\n`);
      return true;
    } else {
      fs.appendFileSync(rcFile, `[${name}]\naccount_id=${aid}\nprivate_api_key=${privateApiKey}\n`);
      return true;
    }
  }

  ensureCapturooDirExistsSync() {
    const projectDir = path.resolve(this.homeDir, ConfigManager.CAPTUROO_DIR);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, 0o775);
    }
    return projectDir;
  }

  writeCurrentProjectSync(pid) {
    const projectDir = this.ensureCapturooDirExistsSync();
    const currentProjectFile = path.resolve(projectDir, 'CURRENT_PROJECT');
    fs.writeFileSync(currentProjectFile, `${pid}\n`);
  };

  /**
   * Get the current pid string
   * @returns {string|undefined} returns undefined if not found
   */
  readCurrentProjectSync() {
    const projectDir = path.resolve(this.homeDir, ConfigManager.CAPTUROO_DIR);
    const currentProjectFile = path.resolve(projectDir, 'CURRENT_PROJECT');
    if (fs.existsSync(currentProjectFile)) {
      let projectId = fs.readFileSync(currentProjectFile, {
        encoding: 'utf8',
        flag: 'r'
      });
      return projectId.trim();
    }
  }
}

module.exports = ConfigManager;
