'use strict';

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
  }
};
