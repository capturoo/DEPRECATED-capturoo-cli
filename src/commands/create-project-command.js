const getProjectDetails = require('../utils/get-project-details');

class CreateProjectCommand {
  constructor(service) {
    Object.assign(this, {
      service
    });
  }

  async run() {
    try {
      let projectData = await getProjectDetails();
      return await this.service.createProject(projectData);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CreateProjectCommand;
