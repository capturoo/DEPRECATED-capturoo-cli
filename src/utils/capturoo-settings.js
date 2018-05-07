'use strict';
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const getHomeDir = () => {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

const readApiKey = () => {
  if (process.env.CAPTUROO_PRIVATE_API_KEY) {
    return process.env.CAPTUROO_PRIVATE_API_KEY;
  }
  const rcFile = path.resolve(getHomeDir(), '.capturoorc');
  if (fs.existsSync(rcFile)) {
    let config = ini.parse(fs.readFileSync(rcFile, 'utf8'));
    if (config.hasOwnProperty('default') && config.default.hasOwnProperty('private_api_key')) {
      return config.default.private_api_key;
    }
  }
};

const writeApiKey = (name, privateApiKey) => {
  const rcFile = path.resolve(getHomeDir(), '.capturoorc');
  if (!fs.existsSync(rcFile)) {
    fs.writeFileSync(rcFile, `[default]\nprivate_api_key=${privateApiKey}\n`);
    return true;
  } else {
    fs.appendFileSync(rcFile, `[${name}]\nprivate_api_key=${privateApiKey}\n`);
    return true;
  }
};

const writeCurrentProjectSync = (projectId) => {
  const projectDir = path.resolve(getHomeDir(), '.capturoo');
  const currentProjectFile = path.resolve(projectDir, 'CURRENT_PROJECT');
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, 0o775);
  }
  fs.writeFileSync(currentProjectFile, `${projectId}\n`);
};

/**
 * Get the current project ID string
 * @returns {string|undefined} returns undefined if not found
 */
const readCurrentProjectSync = () => {
  const projectDir = path.resolve(getHomeDir(), '.capturoo');
  const currentProjectFile = path.resolve(projectDir, 'CURRENT_PROJECT');
  if (fs.existsSync(currentProjectFile)) {
    let projectId = fs.readFileSync(currentProjectFile, {
      encoding: 'utf8',
      flag: 'r'
    });
    return projectId.trim();
  }
};

module.exports = {
  readApiKey,
  readCurrentProjectSync,
  writeApiKey,
  writeCurrentProjectSync
};
