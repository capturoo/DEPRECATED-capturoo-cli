'use strict';
const { readCurrentProjectSync } = require('../utils/capturoo-settings');


function LeadsLastCommand(service) {
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

  if (opts.hasOwnProperty('format') && opts.format) {
    var format = opts.format;
  } else {
    var format = 'json';
  }

  return new Promise(function(resolve, reject) {
    service.getLeads(projectId)
