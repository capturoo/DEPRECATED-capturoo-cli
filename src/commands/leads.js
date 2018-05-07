'use strict';
const { readCurrentProjectSync } = require('../utils/capturoo-settings');
const { stringToFile, leadsToYamlString } = require('../utils/leads-processing');
const Json2csvParser = require('json2csv').Parser;

function LeadsCommand(service) {
  Object.assign(this, {
    service
  });
}

LeadsCommand.prototype.run = function(options) {
  let service = this.service;

  var opts = options || {};
  if (opts.hasOwnProperty('projectId') && opts.projectId) {
    var projectId = opts.projectId;
  } else {
    var projectId = readCurrentProjectSync();
  }

  if (opts.hasOwnProperty('output') && opts.output) {
    var output = opts.output;
  }

  if (opts.hasOwnProperty('format') && opts.format) {
    var format = opts.format;
  } else {
    var format = 'json';
  }

  return new Promise(function(resolve, reject) {
    service.getLeads(projectId)
      .then(result => {
        var str;

        if (format === 'yaml') {
          str = leadsToYamlString(result.data, output, projectId);
        } else if (format === 'json') {
          str = JSON.stringify(result.data);
        } else if (format === 'csv') {
          str =
        }

        if (output) {
          stringToFile(str, output, projectId);
        } else {
          console.log(str);
        }

        resolve();
      })
      .catch(err => {
        console.error(err);
        let data = err.response.data;
        if (data.hasOwnProperty('status') && data.status === 401) {
          console.log('There was a problem authenticating you. Please check your private key in your ~/.capturoorc file.');
        }
        reject(err);
      });
  });
};

module.exports = LeadsCommand;
