'use strict';
const axios = require('./cli-axios');

class Service {
  constructor(privateApiKey) {
    Object.assign(this, {
      privateApiKey
    });
  }

  /**
   * Fetch account details
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
