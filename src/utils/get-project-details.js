const inquirer = require('inquirer');

/**
 * Prompts the user for a project name and project ID
 * @typedef {object} ProjectData
 * @property {string} name
 * @property {string} projectId
 * @returns {Promise.<ProjectData>}
 */
const getProjectDetails = async () => {
  let questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Name of your project: '
    },
    {
      type: 'input',
      name: 'projectId',
      message: 'Alocate a project ID (lowercase including hyphen)'
    }
  ];
  try {
    return await inquirer.prompt(questions);
  } catch (err) {
    return err;
  }
};

module.exports = getProjectDetails;
