'use strict';
const { writeCurrentProjectSync } = require('../utils/capturoo-settings');
const selectProject = require('../utils/select-project');

function SelectProjectCommand(service) {
  Object.assign(this, {
    service
  });
}

SelectProjectCommand.prototype.run = function() {
  let service = this.service;

  return new Promise(function(resolve, reject) {
    service.getProjects()
      .then(result => {
        let data = result.data.map(p => ({
          name: p.name + ' (' + p.projectId + ')',
          value: p.projectId
        }));
        return selectProject(data);
      })
      .then(answers => {
        writeCurrentProjectSync(answers.projectId);
        resolve(answers.projectId);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = SelectProjectCommand;
