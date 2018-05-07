'use strict';
const inquirer = require('inquirer');

/**
 * @param {Array} of strings
 * @returns {Promise} with value { project: '<projectId>' }
 */
const selectProject = (projects) => {
  return new Promise(function(resolve, reject) {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'projectId',
          message: 'Select a project',
          choices: projects,
          filter: function(val) {
            return val.toLowerCase();
          }
        }
      ])
      .then(answers => {
        resolve(answers);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = selectProject;
