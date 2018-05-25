'use strict';
const axios = require('./cli-axios');

class Service {
  constructor(privateApiKey) {
    Object.assign(this, {
      privateApiKey
    });
  }

  /**
   * Fetches account details
   * @returns {Promise}
   */
  async getAccount() {
    const privateApiKey = this.privateApiKey;

    return new Promise(function(resolve, reject) {
      let options = {
        method: 'GET',
        url: '/account',
        headers: {
          'X-API-Key': privateApiKey
        }
      };
      axios(options)
        .then(result => {
          resolve(result.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Creates a new project
   * @param {object} data
   * @param {string} data.projectId globally unqiue project ID
   * @param {string} data.name human-readable project name (utf8 encoded)
   * @returns {Promise}
   */
  async createProject(data) {
    const privateApiKey = this.privateApiKey;

    try {
      let options = {
        method: 'POST',
        url: '/projects',
        headers: {
          'X-API-Key': privateApiKey
        },
        data
      };

      return await axios(options);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch all projects associated to the account with the given private API key
   * @returns {Promise}
   */
  async getProjects() {
    const privateApiKey = this.privateApiKey;

    return new Promise(function(resolve, reject) {
      let options = {
        method: 'GET',
        url: '/projects',
        headers: {
          'X-API-Key': privateApiKey
        }
      };

      axios(options)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   *
   * @param {string} projectId
   */
  async getLeads(projectId) {
    const privateApiKey = this.privateApiKey;

    return new Promise(function(resolve, reject) {
      let options = {
        method: 'GET',
        'url': '/projects/' + projectId + '/leads',
        headers: {
          'X-API-Key': privateApiKey
        }
      };

      axios(options)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = Service;
