'use strict';
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
module.exports = {
  setupCommand: (config) => {
    const SetupCommand = require('./setup-command');
    return new SetupCommand(config);
  },
  accountCommand: (config) => {
    const AccountCommand = require('./account-command');
    return new AccountCommand(config);
  },
  addProjectCommand: (config) => {
    const AddProjectCommand = require('./add-project-command');
    return new AddProjectCommand(config);
  },
  listProjectsCommand: (config) => {
    const ListProjectsCommand = require('./list-projects-command');
    return new ListProjectsCommand(config);
  },
  selectProjectCommand: (config) => {
    const SelectProjectCommand = require('./select-project-command');
    return new SelectProjectCommand(config);
  },
  lastLeadCommand: (config) => {
    const LastLeadCommand = require('./last-lead-command');
    return new LastLeadCommand(config);
  },
  queryLeadsCommand: (config) => {
    const QueryLeadsCommand = require('./query-leads-command');
    return new QueryLeadsCommand(config);
  }
};
